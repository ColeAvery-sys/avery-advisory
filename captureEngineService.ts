declare const require: any;

import { saveJournalEntry, saveMemory } from "./memoryEngineService";
import { CaptureClassification, CaptureEngineState, CaptureEntity, CaptureObjectType, CapturePriority, CaptureRecord, CaptureSource } from "./captureEngineTypes";
import { cloneCaptureEngineState, loadCaptureEngineState, resetCaptureEngineRuntime, saveCaptureEngineState } from "./captureEngineRepository";

const fs = require("fs");
const path = require("path");

export interface CaptureInput {
  text: string;
  source?: CaptureSource;
  actor?: string;
}

export interface CaptureResult {
  capture: CaptureRecord;
  classification: CaptureClassification;
  memoryId?: string;
  journalId?: string;
}

export function captureInput(input: CaptureInput): CaptureResult {
  validateCaptureInput(input);
  const state = loadCaptureEngineState();
  const classification = classifyCaptureText(input.text);
  const entities = detectEntities(input.text, classification);
  classification.entities = entities;
  classification.confidence = calculateConfidence(classification, entities);
  const createdAt = new Date().toISOString();

  try {
    const downstream = createDownstreamObject(input.text, classification, entities, input.actor || "ATLAS");
    const capture: CaptureRecord = {
      id: createId("capture"),
      source: input.source || "Text",
      originalInput: input.text,
      timestamp: createdAt,
      confidence: classification.confidence,
      classification: cloneClassification(classification),
      createdMemoryId: downstream.memoryId,
      createdJournalId: downstream.journalId,
      status: "Success",
    };
    state.captures.push(capture);
    saveCaptureEngineState(state);
    return { capture: cloneCapture(capture), classification: cloneClassification(classification), memoryId: downstream.memoryId, journalId: downstream.journalId };
  } catch (error: any) {
    const capture: CaptureRecord = {
      id: createId("capture"),
      source: input.source || "Text",
      originalInput: input.text,
      timestamp: createdAt,
      confidence: classification.confidence,
      classification: cloneClassification(classification),
      status: "Failed",
      error: error && error.message ? error.message : String(error),
    };
    state.captures.push(capture);
    saveCaptureEngineState(state);
    throw error;
  }
}

export function classifyCaptureText(text: string): CaptureClassification {
  const normalized = normalizeText(text);
  const lower = normalized.toLowerCase();
  const rationale: string[] = [];

  const taskHints = ["need to", "remember to", "call ", "finish ", "buy ", "email ", "send ", "schedule ", "book ", "fix "];
  const journalHints = ["debrief", "journal", "reflection", "today i", "felt", "energy", "mood"];
  const goalHints = ["goal", "want to", "aim to", "plan to", "become", "achieve"];
  const projectHints = ["project", "launch", "build ", "echoframe", "atlas", "roadmap"];
  const knowledgeHints = ["research", "learn ", "study ", "note that", "knowledge", "fact"];
  const contactHints = ["contact", "met with", "meet with", "introduced to", "follow up with", "reach out to", "new contact"];

  let type: CaptureObjectType = "Memory";
  if (journalHints.some((hint) => lower.indexOf(hint) >= 0)) {
    type = "Journal Entry";
    rationale.push("Journal-style language detected.");
  } else if (goalHints.some((hint) => lower.indexOf(hint) >= 0)) {
    type = "Goal";
    rationale.push("Goal-oriented language detected.");
  } else if (projectHints.some((hint) => lower.indexOf(hint) >= 0) && lower.indexOf("grant") < 0) {
    type = "Project";
    rationale.push("Project-oriented language detected.");
  } else if (knowledgeHints.some((hint) => lower.indexOf(hint) >= 0)) {
    type = "Knowledge";
    rationale.push("Research or knowledge language detected.");
  } else if (taskHints.some((hint) => lower.indexOf(hint) >= 0)) {
    type = "Task";
    rationale.push("Action-oriented language detected.");
  } else if (contactHints.some((hint) => lower.indexOf(hint) >= 0) && /[A-Z][a-z]+/.test(normalized)) {
    type = "Contact";
    rationale.push("Contact-oriented language detected.");
  }

  const category = detectCategory(lower);
  const priority = detectPriority(lower);
  const title = deriveTitle(type, normalized);

  return {
    type: type,
    priority: priority,
    category: category,
    title: title,
    confidence: 0.7,
    summary: normalized,
    rationale: rationale.length > 0 ? rationale : ["Defaulted to memory classification."],
    entities: [],
  };
}

export function searchCaptures(query: string) {
  const state = loadCaptureEngineState();
  const needle = normalizeText(query).toLowerCase();
  return state.captures.filter((capture) => JSON.stringify(capture).toLowerCase().indexOf(needle) >= 0);
}

export function listCaptures() {
  return loadCaptureEngineState().captures.slice();
}

export function resetCaptureEngineForDemo(): void {
  resetCaptureEngineRuntime();
  const state = loadCaptureEngineState();
  state.captures = [];
  state.updatedAt = new Date().toISOString();
  saveCaptureEngineState(state);
}

function createDownstreamObject(text: string, classification: CaptureClassification, entities: CaptureEntity[], actor: string) {
  const projectIds = entities.filter((entity) => entity.type === "Project").map((entity) => entity.linkedId);
  const contactIds = entities.filter((entity) => entity.type === "Person" || entity.type === "Company").map((entity) => entity.linkedId);
  const taskIds = classification.type === "Task" ? [slugify(classification.title)] : [];
  const tags = [classification.type, classification.priority, classification.category].concat(entities.map((entity) => entity.value));

  if (classification.type === "Journal Entry") {
    const journal = saveJournalEntry({
      entryDate: new Date().toISOString().slice(0, 10),
      title: classification.title,
      summary: classification.summary,
      body: text,
      mood: "Captured",
      energy: "Unknown",
      memoryIds: [],
      projectIds: projectIds,
      taskIds: taskIds,
      contactIds: contactIds,
      actor: actor,
    });
    return { journalId: journal.id };
  }

  const memory = saveMemory({
    title: classification.title,
    summary: classification.summary,
    body: text,
    memoryType: classification.type,
    source: "Capture Engine",
    confidence: classification.confidence,
    tags: tags,
    projectIds: projectIds,
    taskIds: taskIds,
    contactIds: contactIds,
    actor: actor,
  });
  return { memoryId: memory.id };
}

function detectPriority(lower: string): CapturePriority {
  if (/(critical|urgent|asap|right now|immediately|today)/.test(lower)) return "Critical";
  if (/(high priority|important|tomorrow|grant|deadline|finish|must|need to)/.test(lower)) return "High";
  if (/(sometime|later|whenever|maybe|eventually)/.test(lower)) return "Low";
  return "Medium";
}

function detectCategory(lower: string) {
  if (lower.indexOf("grant") >= 0) return "Grants";
  if (lower.indexOf("echoframe") >= 0) return "EchoFrame";
  if (lower.indexOf("atlas") >= 0) return "ATLAS";
  if (lower.indexOf("real estate") >= 0) return "Real Estate";
  if (lower.indexOf("music") >= 0) return "Music";
  if (lower.indexOf("college") >= 0) return "Education";
  return "Personal";
}

function detectEntities(text: string, classification: CaptureClassification): CaptureEntity[] {
  const entities: CaptureEntity[] = [];
  const projectNames = extractProjectNames(text);
  for (const project of projectNames) {
    entities.push({ type: "Project", value: project, linkedId: slugify(project) });
  }

  const people = extractPeople(text);
  for (const person of people) {
    entities.push({ type: "Person", value: person, linkedId: slugify(person) });
  }

  const companies = extractCompanies(text);
  for (const company of companies) {
    entities.push({ type: "Company", value: company, linkedId: slugify(company) });
  }

  const locations = extractLocations(text);
  for (const location of locations) {
    entities.push({ type: "Location", value: location, linkedId: slugify(location) });
  }

  return dedupeEntities(entities);
}

function extractProjectNames(text: string) {
  const matches: string[] = [];
  if (/echoframe/i.test(text)) matches.push("EchoFrame");
  if (/atlas/i.test(text)) matches.push("ATLAS");
  return matches;
}

function extractPeople(text: string) {
  const matches: string[] = [];
  const patterns = [
    /call ([A-Z][a-z]+(?: [A-Z][a-z]+)?)/gi,
    /meet ([A-Z][a-z]+(?: [A-Z][a-z]+)?)/gi,
    /met with ([A-Z][a-z]+(?: [A-Z][a-z]+)?)/gi,
    /contact ([A-Z][a-z]+(?: [A-Z][a-z]+)?)/gi,
  ];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      matches.push(match[1]);
    }
  }
  return matches;
}

function extractCompanies(text: string) {
  const matches: string[] = [];
  if (/(llc|inc|corp|company|studios|labs)/i.test(text)) {
    const companyMatch = text.match(/([A-Z][A-Za-z0-9& ]+(?:LLC|Inc|Inc\.|Corp|Company|Studios|Labs))/);
    if (companyMatch && companyMatch[1]) matches.push(companyMatch[1].trim());
  }
  return matches;
}

function extractLocations(text: string) {
  const matches: string[] = [];
  const locationPatterns = [
    /to ([A-Z][A-Za-z0-9 ]+)/g,
    /at ([A-Z][A-Za-z0-9 ]+)/g,
    /in ([A-Z][A-Za-z0-9 ]+)/g,
  ];
  for (const pattern of locationPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const value = match[1].trim();
      if (value.length > 2 && value.length < 40) matches.push(value);
    }
  }
  return matches;
}

function dedupeEntities(entities: CaptureEntity[]) {
  const seen = new Set<string>();
  const deduped: CaptureEntity[] = [];
  for (const entity of entities) {
    const key = entity.type + "|" + entity.linkedId;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(entity);
  }
  return deduped;
}

function deriveTitle(type: CaptureObjectType, text: string) {
  const trimmed = text.trim();
  if (type === "Task") {
    const match = trimmed.match(/(?:need to |remember to |call |finish |buy |email |send |schedule |book |fix )(.+)/i);
    if (match && match[1]) {
      return capitalizeFirst(match[1].replace(/\b(tomorrow|today|now|please)\b/gi, "").trim());
    }
  }
  if (type === "Goal") {
    const goalMatch = trimmed.match(/(?:want to |aim to |plan to |goal:? )(.+)/i);
    if (goalMatch && goalMatch[1]) return capitalizeFirst(goalMatch[1].trim());
  }
  if (type === "Journal Entry") {
    return "Nightly Debrief";
  }
  if (type === "Project") {
    return capitalizeFirst(trimmed.replace(/\b(project|plan)\b/i, "").trim());
  }
  if (type === "Knowledge") {
    return capitalizeFirst(trimmed.slice(0, 60));
  }
  return capitalizeFirst(trimmed.slice(0, 60));
}

function calculateConfidence(classification: CaptureClassification, entities: CaptureEntity[]) {
  let confidence = 0.55;
  if (classification.type !== "Memory") confidence += 0.1;
  if (classification.priority !== "Medium") confidence += 0.05;
  if (entities.length > 0) confidence += 0.1;
  return Math.min(0.95, confidence);
}

function cloneCapture(value: CaptureRecord): CaptureRecord {
  return JSON.parse(JSON.stringify(value));
}

function cloneClassification(value: CaptureClassification): CaptureClassification {
  return JSON.parse(JSON.stringify(value));
}

function validateCaptureInput(input: CaptureInput) {
  if (!input || typeof input !== "object") throw new Error("Capture input must be an object.");
  if (typeof input.text !== "string" || !input.text.trim()) throw new Error("Capture text is required.");
}

function normalizeText(value: any) {
  return String(value == null ? "" : value).trim();
}

function capitalizeFirst(value: string) {
  const text = normalizeText(value);
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

function slugify(value: string) {
  return normalizeText(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function createId(prefix: string) {
  return prefix + "-" + new Date().getTime().toString(36) + "-" + Math.random().toString(16).slice(2, 8);
}
