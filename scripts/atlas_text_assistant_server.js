const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const CONFIG_PATH = path.join(ROOT, "atlas_ops", "text_assistant", "atlas_text_assistant_config.json");
const STATE_PATH = path.join(ROOT, "atlas_ops", "text_assistant", "atlas_text_assistant_state.json");
const OUTBOX_PATH = path.join(ROOT, "atlas_ops", "text_assistant", "atlas_text_assistant_outbox.json");

loadDotEnv(path.join(ROOT, ".env"));

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
const port = Number(process.env.ATLAS_TEXT_ASSISTANT_PORT || 8787);
const webhookSecret = process.env.ATLAS_WEBHOOK_SECRET || "";
const model = process.env.ATLAS_TEXT_ASSISTANT_MODEL || "gpt-5-mini";

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, "");
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

function loadState() {
  if (!fs.existsSync(STATE_PATH)) {
    return {
      lastCheckInAt: null,
      currentStatus: config.defaultStatus,
      lastMissedCheckInNoticeAt: null
    };
  }

  return JSON.parse(fs.readFileSync(STATE_PATH, "utf8"));
}

function saveState(state) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

function loadOutbox() {
  if (!fs.existsSync(OUTBOX_PATH)) return [];
  return JSON.parse(fs.readFileSync(OUTBOX_PATH, "utf8"));
}

function saveOutbox(outbox) {
  fs.writeFileSync(OUTBOX_PATH, JSON.stringify(outbox, null, 2));
}

function normalizePhone(value) {
  return String(value || "").replace(/[^\d+]/g, "").replace(/^1?(\d{10})$/, "+1$1");
}

function isTrustedSender(sender) {
  const normalizedSender = normalizePhone(sender);
  return config.trustedContacts.some((contact) => normalizePhone(contact.phone) === normalizedSender);
}

function getTrustedContactByName(name) {
  const normalizedName = String(name || "").trim().toLowerCase();
  return config.trustedContacts.find((contact) => String(contact.name || "").trim().toLowerCase() === normalizedName);
}

function getTrustedContactByPhone(phone) {
  const normalizedPhone = normalizePhone(phone);
  return config.trustedContacts.find((contact) => normalizePhone(contact.phone) === normalizedPhone);
}

function queueOutboundMessage(to, body, label) {
  const contact = getTrustedContactByPhone(to);
  if (!contact) throw new Error("Outbound messages can only be queued for trusted contacts.");

  const outbox = loadOutbox();
  const message = {
    id: `atlas-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    to: normalizePhone(contact.phone),
    contactName: contact.name,
    label: label || "Atlas outbound message",
    body,
    status: "pending",
    createdAt: new Date().toISOString(),
    sentAt: null
  };
  outbox.push(message);
  saveOutbox(outbox);
  return message;
}

function startsWithHeyAtlas(message) {
  return String(message || "").trim().toLowerCase().startsWith("hey atlas");
}

function safeFallbackReply(message, state) {
  const lower = String(message || "").toLowerCase();
  const status = state.currentStatus || config.defaultStatus;

  if (/(emergency|urgent|danger|hurt|hospital|911|help)/.test(lower)) {
    return "This is Atlas, Mr. Avery's assistant. If this may be urgent or unsafe, please call Mr. Avery directly or contact emergency services. I will note that you reached out.";
  }

  if (/(where|location|address|gps)/.test(lower)) {
    return "This is Atlas, Mr. Avery's assistant. I cannot share Mr. Avery's location, but I can let him know you checked in.";
  }

  if (/(medical|medicine|health|money|bank|password|account)/.test(lower)) {
    return "This is Atlas, Mr. Avery's assistant. I cannot share private details, but your message has been received and I will make sure Mr. Avery is aware.";
  }

  if (status === "available") {
    return "This is Atlas, Mr. Avery's assistant. Mr. Avery has checked in recently. I will let him know you reached out.";
  }

  return "This is Atlas, Mr. Avery's assistant. Mr. Avery appears to be busy right now, but your message has been received. He will message you as soon as he is free.";
}

async function generateReply(message, sender, state) {
  if (!process.env.OPENAI_API_KEY) {
    return safeFallbackReply(message, state);
  }

  const prompt = [
    `You are ${config.assistantName}, ${config.ownerName}'s personal assistant.`,
    "Reply to a trusted loved one who texted a question starting with Hey Atlas.",
    "Use only approved status-level information.",
    `Current status: ${state.currentStatus || config.defaultStatus}.`,
    `Last check-in: ${state.lastCheckInAt || "none"}.`,
    `Allowed status details: ${config.allowedStatusDetails.join(", ")}.`,
    `Safety rules: ${config.safetyRules.join(" ")}`,
    "Return only the SMS reply text. Keep it under 480 characters.",
    `Sender: ${sender}`,
    `Incoming text: ${message}`
  ].join("\n");

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      input: prompt,
      max_output_tokens: 140
    })
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`OpenAI response failed: ${response.status} ${body}`);
    return safeFallbackReply(message, state);
  }

  const data = await response.json();
  return extractResponseText(data) || safeFallbackReply(message, state);
}

function extractResponseText(data) {
  if (typeof data.output_text === "string") return data.output_text.trim();

  const output = Array.isArray(data.output) ? data.output : [];
  for (const item of output) {
    const content = Array.isArray(item.content) ? item.content : [];
    for (const part of content) {
      if (typeof part.text === "string") return part.text.trim();
    }
  }

  return "";
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 100000) req.destroy();
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}

function writeJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

function isAuthorized(req) {
  if (!webhookSecret) return true;
  return req.headers.authorization === `Bearer ${webhookSecret}`;
}

function missedCheckInPayload(state) {
  const now = Date.now();
  const lastCheckInAt = state.lastCheckInAt ? new Date(state.lastCheckInAt).getTime() : 0;
  const lastNoticeAt = state.lastMissedCheckInNoticeAt ? new Date(state.lastMissedCheckInNoticeAt).getTime() : 0;
  const thresholdMs = (config.checkInWindowMinutes + config.missedCheckInDelayMinutes) * 60 * 1000;
  const noticeCooldownMs = config.missedCheckInDelayMinutes * 60 * 1000;
  const shouldNotify = (!lastCheckInAt || now - lastCheckInAt >= thresholdMs) && (!lastNoticeAt || now - lastNoticeAt >= noticeCooldownMs);

  if (shouldNotify) {
    state.lastMissedCheckInNoticeAt = new Date(now).toISOString();
    saveState(state);
  }

  return {
    shouldNotify,
    message: config.missedCheckInMessage,
    recipients: config.trustedContacts.map((contact) => contact.phone),
    lastCheckInAt: state.lastCheckInAt
  };
}

const server = http.createServer(async (req, res) => {
  try {
    if (!isAuthorized(req)) return writeJson(res, 401, { error: "Unauthorized" });

    if (req.method === "GET" && req.url === "/health") {
      return writeJson(res, 200, { ok: true, assistant: config.assistantName });
    }

    if (req.method === "POST" && req.url === "/atlas/reply") {
      const body = await readJson(req);
      const state = loadState();
      const sender = body.sender || "";
      const message = body.message || "";

      if (!startsWithHeyAtlas(message)) {
        return writeJson(res, 200, { allowed: false, reply: "" });
      }

      if (!isTrustedSender(sender)) {
        return writeJson(res, 200, {
          allowed: false,
          reply: "This is Atlas. I can only respond to Mr. Avery's approved contacts."
        });
      }

      const reply = await generateReply(message, sender, state);
      return writeJson(res, 200, { allowed: true, reply });
    }

    if (req.method === "POST" && req.url === "/atlas/checkin") {
      const body = await readJson(req);
      const state = loadState();
      state.lastCheckInAt = new Date().toISOString();
      state.currentStatus = body.status || "available";
      state.lastMissedCheckInNoticeAt = null;
      saveState(state);
      return writeJson(res, 200, { ok: true, ...state });
    }

    if (req.method === "POST" && req.url === "/atlas/status") {
      const body = await readJson(req);
      const state = loadState();
      state.currentStatus = body.status || state.currentStatus || config.defaultStatus;
      saveState(state);
      return writeJson(res, 200, { ok: true, ...state });
    }

    if (req.method === "POST" && req.url === "/atlas/missed-checkin") {
      const state = loadState();
      return writeJson(res, 200, missedCheckInPayload(state));
    }

    if (req.method === "POST" && req.url === "/atlas/outbox/queue-apollo-test") {
      const apollo = getTrustedContactByName("Apollo") || getTrustedContactByPhone("+13042106359");
      const message = queueOutboundMessage(
        apollo.phone,
        "Hello Apollo, this is Atlas. All systems are online, and it's wonderful to finally talk to you directly.",
        "Apollo systems-online test"
      );
      return writeJson(res, 200, { ok: true, message });
    }

    if (req.method === "POST" && req.url === "/atlas/outbox/queue") {
      const body = await readJson(req);
      const message = queueOutboundMessage(body.to, body.body, body.label);
      return writeJson(res, 200, { ok: true, message });
    }

    if (req.method === "GET" && req.url === "/atlas/outbox/next") {
      const outbox = loadOutbox();
      const message = outbox.find((item) => item.status === "pending") || null;
      return writeJson(res, 200, { hasMessage: Boolean(message), message });
    }

    if (req.method === "POST" && req.url === "/atlas/outbox/ack") {
      const body = await readJson(req);
      const outbox = loadOutbox();
      const message = outbox.find((item) => item.id === body.id);
      if (!message) return writeJson(res, 404, { error: "Message not found" });

      message.status = "sent";
      message.sentAt = new Date().toISOString();
      saveOutbox(outbox);
      return writeJson(res, 200, { ok: true, message });
    }

    return writeJson(res, 404, { error: "Not found" });
  } catch (error) {
    console.error(error);
    return writeJson(res, 500, { error: "Internal error" });
  }
});

server.listen(port, () => {
  console.log(`Atlas text assistant listening on http://localhost:${port}`);
});
