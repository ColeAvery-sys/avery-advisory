CREATE TABLE IF NOT EXISTS memory_entries (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  body TEXT NOT NULL,
  memory_type TEXT NOT NULL,
  source TEXT NOT NULL,
  confidence REAL NOT NULL DEFAULT 0.5,
  status TEXT NOT NULL DEFAULT 'Active',
  visibility TEXT NOT NULL DEFAULT 'Private',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  archived_at TEXT
);

CREATE TABLE IF NOT EXISTS memory_tags (
  id TEXT PRIMARY KEY,
  memory_id TEXT NOT NULL,
  tag TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS memory_links (
  id TEXT PRIMARY KEY,
  memory_id TEXT NOT NULL,
  linked_object_type TEXT NOT NULL,
  linked_object_id TEXT NOT NULL,
  link_type TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS journal_entries (
  id TEXT PRIMARY KEY,
  entry_date TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  body TEXT NOT NULL,
  mood TEXT,
  energy TEXT,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS journal_links (
  id TEXT PRIMARY KEY,
  journal_id TEXT NOT NULL,
  linked_object_type TEXT NOT NULL,
  linked_object_id TEXT NOT NULL,
  link_type TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS memory_actions (
  id TEXT PRIMARY KEY,
  action_type TEXT NOT NULL,
  object_type TEXT NOT NULL,
  object_id TEXT NOT NULL,
  actor TEXT NOT NULL,
  status TEXT NOT NULL,
  details TEXT NOT NULL,
  created_at TEXT NOT NULL
);

