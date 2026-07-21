CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  first_name TEXT NOT NULL,
  quick_score INTEGER CHECK (quick_score BETWEEN 0 AND 100),
  weakest_category TEXT,
  source TEXT,
  medium TEXT,
  campaign TEXT,
  content TEXT,
  term TEXT,
  landing_page TEXT,
  country TEXT,
  user_agent TEXT,
  consent_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_campaign ON leads(campaign);
CREATE INDEX IF NOT EXISTS idx_leads_weakest_category ON leads(weakest_category);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  email TEXT,
  event_name TEXT NOT NULL,
  event_data TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_name_created ON events(event_name, created_at);
CREATE INDEX IF NOT EXISTS idx_events_email ON events(email);
