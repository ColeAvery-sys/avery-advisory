declare const require: any;
declare const process: any;
declare const module: any;

const { createServer } = require("http");

import { ensureMemoryEngineV1Migration } from "./memoryEngineMigration";
import {
  archiveMemory,
  deleteMemory,
  getJournalEntryById,
  getMemoryById,
  linkJournalEntry,
  linkMemoryToContact,
  linkMemoryToProject,
  linkMemoryToTask,
  listMemoryActions,
  saveJournalEntry,
  saveMemory,
  searchJournalEntries,
  searchMemories,
  tagMemory,
  unlinkMemory,
  updateMemory,
  removeMemoryTag,
} from "./memoryEngineService";

const PORT = Number(process.env.ATLAS_MEMORY_ENGINE_PORT || 8790);

function send(res: any, statusCode: number, body: any) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function readJson(req: any): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk: any) => {
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

function parseUrl(req: any) {
  return new URL(req.url, "http://" + req.headers.host);
}

async function route(req: any, res: any) {
  try {
    ensureMemoryEngineV1Migration();
    const url = parseUrl(req);
    const pathname = url.pathname;

    if (req.method === "GET" && pathname === "/api/health") {
      return send(res, 200, { ok: true, system: "ATLAS Memory Engine V1" });
    }

    if (req.method === "GET" && pathname === "/api/memory/actions") {
      return send(res, 200, { ok: true, items: listMemoryActions() });
    }

    if (req.method === "POST" && pathname === "/api/memory") {
      const body = await readJson(req);
      return send(res, 201, { ok: true, item: saveMemory(body) });
    }

    const memoryMatch = pathname.match(/^\/api\/memory\/([^/]+)$/);
    const memoryArchiveMatch = pathname.match(/^\/api\/memory\/([^/]+)\/archive$/);
    const memoryTagMatch = pathname.match(/^\/api\/memory\/([^/]+)\/tags$/);
    const memoryTagDeleteMatch = pathname.match(/^\/api\/memory\/([^/]+)\/tags\/([^/]+)$/);
    const memoryLinkMatch = pathname.match(/^\/api\/memory\/([^/]+)\/links$/);
    const memoryLinkDeleteMatch = pathname.match(/^\/api\/memory\/([^/]+)\/links\/([^/]+)$/);
    const journalMatch = pathname.match(/^\/api\/journal\/([^/]+)$/);
    const journalLinkMatch = pathname.match(/^\/api\/journal\/([^/]+)\/links$/);

    if (req.method === "GET" && pathname === "/api/memory") {
      return send(res, 200, {
        ok: true,
        items: searchMemories(url.searchParams.get("q") || "", {
          tags: splitList(url.searchParams.get("tags")),
          memoryType: url.searchParams.get("memoryType") || undefined,
          status: (url.searchParams.get("status") || undefined) as any,
          linkedObjectType: (url.searchParams.get("linkedObjectType") || undefined) as any,
          linkedObjectId: url.searchParams.get("linkedObjectId") || undefined,
        }),
      });
    }

    if (req.method === "GET" && memoryMatch) {
      return send(res, 200, { ok: true, item: getMemoryById(memoryMatch[1]) });
    }

    if (req.method === "PATCH" && memoryMatch) {
      const body = await readJson(req);
      return send(res, 200, { ok: true, item: updateMemory(memoryMatch[1], body) });
    }

    if (req.method === "DELETE" && memoryMatch) {
      return send(res, 200, { ok: true, item: deleteMemory(memoryMatch[1]) });
    }

    if (req.method === "POST" && memoryArchiveMatch) {
      return send(res, 200, { ok: true, item: archiveMemory(memoryArchiveMatch[1]) });
    }

    if (req.method === "POST" && memoryTagMatch) {
      const body = await readJson(req);
      return send(res, 200, { ok: true, item: tagMemory(memoryTagMatch[1], Array.isArray(body.tags) ? body.tags : splitList(body.tag)) });
    }

    if (req.method === "DELETE" && memoryTagDeleteMatch) {
      return send(res, 200, { ok: true, item: removeMemoryTag(memoryTagDeleteMatch[1], decodeURIComponent(memoryTagDeleteMatch[2])) });
    }

    if (req.method === "POST" && memoryLinkMatch) {
      const body = await readJson(req);
      if (!body.linkedObjectType || !body.linkedObjectId) throw new Error("linkedObjectType and linkedObjectId are required.");
      const linkedObjectType = body.linkedObjectType;
      if (linkedObjectType === "Project") return send(res, 200, { ok: true, item: linkMemoryToProject(memoryLinkMatch[1], body.linkedObjectId, body.linkType) });
      if (linkedObjectType === "Task") return send(res, 200, { ok: true, item: linkMemoryToTask(memoryLinkMatch[1], body.linkedObjectId, body.linkType) });
      if (linkedObjectType === "Contact") return send(res, 200, { ok: true, item: linkMemoryToContact(memoryLinkMatch[1], body.linkedObjectId, body.linkType) });
      throw new Error("Unsupported linkedObjectType.");
    }

    if (req.method === "DELETE" && memoryLinkDeleteMatch) {
      return send(res, 200, { ok: true, item: unlinkMemory(memoryLinkDeleteMatch[1], memoryLinkDeleteMatch[2]) });
    }

    if (req.method === "POST" && pathname === "/api/journal") {
      const body = await readJson(req);
      return send(res, 201, { ok: true, item: saveJournalEntry(body) });
    }

    if (req.method === "GET" && pathname === "/api/journal") {
      return send(res, 200, {
        ok: true,
        items: searchJournalEntries(url.searchParams.get("q") || "", {
          status: (url.searchParams.get("status") || undefined) as any,
          linkedObjectType: url.searchParams.get("linkedObjectType") || undefined,
          linkedObjectId: url.searchParams.get("linkedObjectId") || undefined,
        }),
      });
    }

    if (req.method === "GET" && journalMatch) {
      return send(res, 200, { ok: true, item: getJournalEntryById(journalMatch[1]) });
    }

    if (req.method === "POST" && journalLinkMatch) {
      const body = await readJson(req);
      if (!body.linkedObjectType || !body.linkedObjectId) throw new Error("linkedObjectType and linkedObjectId are required.");
      return send(res, 200, { ok: true, item: linkJournalEntry(journalLinkMatch[1], body.linkedObjectType, body.linkedObjectId, body.linkType) });
    }

    return send(res, 404, { ok: false, error: "Not found" });
  } catch (error: any) {
    const statusCode = typeof error.statusCode === "number" ? error.statusCode : 500;
    return send(res, statusCode, { ok: false, error: error.message || "Internal error", code: error.code || "MEMORY_ENGINE_ERROR" });
  }
}

function splitList(value: any) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function startMemoryEngineServer(port: number = PORT) {
  const server = createServer(route);
  server.listen(port, () => {
    console.log("ATLAS Memory Engine listening on http://localhost:" + port);
  });
  return server;
}

if (require.main === module) {
  startMemoryEngineServer();
}
