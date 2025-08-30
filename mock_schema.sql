-- SQL schema for all mock JSON files in NMC-main

-- 1. okrs.json
CREATE TABLE okrs (
  id VARCHAR PRIMARY KEY,
  title VARCHAR,
  objective TEXT,
  owner VARCHAR,
  status VARCHAR,
  quarter VARCHAR
);

CREATE TABLE okr_key_results (
  okr_id VARCHAR REFERENCES okrs(id),
  description TEXT,
  progress INT,
  target INT,
  unit VARCHAR
);

-- 2. encounters.json
CREATE TABLE encounters (
  id VARCHAR PRIMARY KEY,
  patientId VARCHAR,
  patientName VARCHAR,
  type VARCHAR,
  department VARCHAR,
  provider VARCHAR,
  date TIMESTAMP,
  status VARCHAR,
  chiefComplaint TEXT
);

CREATE TABLE encounter_diagnosis (
  encounter_id VARCHAR REFERENCES encounters(id),
  diagnosis VARCHAR
);

CREATE TABLE encounter_alerts (
  id VARCHAR PRIMARY KEY,
  encounter_id VARCHAR REFERENCES encounters(id),
  ruleId VARCHAR,
  severity VARCHAR,
  message TEXT,
  timestamp TIMESTAMP,
  status VARCHAR,
  action VARCHAR
);

CREATE TABLE encounter_vitals (
  encounter_id VARCHAR REFERENCES encounters(id),
  temperature VARCHAR,
  bloodPressure VARCHAR,
  heartRate VARCHAR,
  weight VARCHAR
);

-- 3. claims.json
CREATE TABLE claims (
  id VARCHAR PRIMARY KEY,
  patientId VARCHAR,
  patientName VARCHAR,
  payerName VARCHAR,
  claimAmount DECIMAL,
  currency VARCHAR,
  serviceDate DATE,
  submissionDate DATE,
  status VARCHAR,
  type VARCHAR,
  provider VARCHAR,
  department VARCHAR,
  preAuthRequired BOOLEAN,
  estimatedTAT VARCHAR
);

CREATE TABLE claim_services (
  claim_id VARCHAR REFERENCES claims(id),
  code VARCHAR,
  description TEXT,
  amount DECIMAL
);

-- 4. rules.json
CREATE TABLE rules (
  id VARCHAR PRIMARY KEY,
  name VARCHAR,
  family VARCHAR,
  severity VARCHAR,
  description TEXT,
  active BOOLEAN,
  triggers INT,
  overrides INT,
  acceptanceRate DECIMAL,
  lastModified TIMESTAMP
);

CREATE TABLE rule_cds (
  rule_id VARCHAR REFERENCES rules(id),
  condition VARCHAR,
  action VARCHAR,
  message TEXT
);

-- 5. codes.json
CREATE TABLE icd_codes (
  id VARCHAR PRIMARY KEY,
  description TEXT,
  category VARCHAR,
  confidence DECIMAL,
  suggested BOOLEAN,
  clinicalNotes TEXT
);

CREATE TABLE cpt_codes (
  id VARCHAR PRIMARY KEY,
  description TEXT,
  category VARCHAR,
  rvu DECIMAL,
  suggested BOOLEAN
);

-- 6. kpis.json
CREATE TABLE kpis (
  id VARCHAR PRIMARY KEY,
  name VARCHAR,
  value DECIMAL,
  unit VARCHAR,
  trend VARCHAR,
  change VARCHAR,
  target DECIMAL,
  category VARCHAR,
  subcategory VARCHAR,
  description TEXT,
  benchmark DECIMAL,
  lastUpdated TIMESTAMP,
  dataSource VARCHAR
);

-- 7. users.json
CREATE TABLE users (
  id VARCHAR PRIMARY KEY,
  name VARCHAR,
  email VARCHAR,
  persona VARCHAR,
  department VARCHAR,
  role VARCHAR,
  avatar VARCHAR
);

CREATE TABLE user_permissions (
  user_id VARCHAR REFERENCES users(id),
  permission VARCHAR
);

-- 8. agents.json
CREATE TABLE agents (
  id VARCHAR PRIMARY KEY,
  name VARCHAR,
  capability TEXT,
  status VARCHAR,
  type VARCHAR,
  lastActivity TIMESTAMP,
  enabled BOOLEAN
);

CREATE TABLE agent_metrics (
  agent_id VARCHAR REFERENCES agents(id),
  alertsTriggered INT,
  accuracy DECIMAL,
  responseTime VARCHAR,
  pathwaysOptimized INT,
  efficiencyGain VARCHAR,
  costSavings VARCHAR
);

CREATE TABLE agent_recent_actions (
  agent_id VARCHAR REFERENCES agents(id),
  action TEXT
);

-- 9. patients.json
CREATE TABLE patients (
  id VARCHAR PRIMARY KEY,
  mrn VARCHAR,
  name VARCHAR,
  nameArabic VARCHAR,
  age INT,
  dateOfBirth DATE,
  gender VARCHAR,
  nationality VARCHAR,
  emiratesId VARCHAR,
  phone VARCHAR,
  email VARCHAR,
  insuranceProvider VARCHAR,
  insuranceNumber VARCHAR,
  insuranceTier VARCHAR,
  insuranceExpiry DATE
);

CREATE TABLE patient_address (
  patient_id VARCHAR REFERENCES patients(id),
  street VARCHAR,
  city VARCHAR,
  emirate VARCHAR,
  country VARCHAR,
  postalCode VARCHAR
);

CREATE TABLE patient_emergency_contact (
  patient_id VARCHAR REFERENCES patients(id),
  name VARCHAR,
  nameArabic VARCHAR,
  relationship VARCHAR,
  phone VARCHAR
);

CREATE TABLE patient_allergies (
  patient_id VARCHAR REFERENCES patients(id),
  allergen VARCHAR,
  severity VARCHAR,
  reaction VARCHAR,
  dateReported DATE
);

-- 10. sources.json
CREATE TABLE sources (
  id VARCHAR PRIMARY KEY,
  name VARCHAR,
  type VARCHAR,
  vendor VARCHAR,
  version VARCHAR,
  status VARCHAR,
  lastSync TIMESTAMP,
  dataPoints INT,
  uptime DECIMAL,
  description TEXT
);

CREATE TABLE source_connected_modules (
  source_id VARCHAR REFERENCES sources(id),
  module VARCHAR
);

-- 11. auditEvents.json
CREATE TABLE audit_events (
  id VARCHAR PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL,
  user_id VARCHAR,
  user_name VARCHAR,
  user_role VARCHAR,
  action VARCHAR NOT NULL,
  resource VARCHAR NOT NULL,
  resource_id VARCHAR,
  outcome VARCHAR NOT NULL CHECK (outcome IN ('success', 'failure', 'warning')),
  ip_address VARCHAR,
  user_agent TEXT,
  session_id VARCHAR,
  category VARCHAR NOT NULL CHECK (category IN ('authentication', 'authorization', 'data_access', 'data_modification', 
                 'system_admin', 'clinical_decision', 'patient_access', 'configuration')),
  severity VARCHAR NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  location VARCHAR,
  device_type VARCHAR NOT NULL CHECK (device_type IN ('desktop', 'mobile', 'tablet', 'api')),
  details_description TEXT
);

CREATE TABLE audit_event_compliance (
  id SERIAL PRIMARY KEY,
  audit_event_id VARCHAR REFERENCES audit_events(id) ON DELETE CASCADE,
  compliance_standard VARCHAR NOT NULL,
  UNIQUE (audit_event_id, compliance_standard)
);

CREATE TABLE audit_event_changes (
  id SERIAL PRIMARY KEY,
  audit_event_id VARCHAR REFERENCES audit_events(id) ON DELETE CASCADE,
  field_name VARCHAR NOT NULL,
  old_value TEXT,
  new_value TEXT
);

CREATE TABLE audit_event_metadata (
  id SERIAL PRIMARY KEY,
  audit_event_id VARCHAR REFERENCES audit_events(id) ON DELETE CASCADE,
  meta_key VARCHAR NOT NULL,
  meta_value TEXT,
  UNIQUE (audit_event_id, meta_key)
);

CREATE TABLE audit_event_metadata_arrays (
  id SERIAL PRIMARY KEY,
  audit_event_id VARCHAR REFERENCES audit_events(id) ON DELETE CASCADE,
  meta_key VARCHAR NOT NULL,
  array_value TEXT NOT NULL,
  array_index INT NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_audit_timestamp ON audit_events(timestamp);
CREATE INDEX idx_audit_user_id ON audit_events(user_id);
CREATE INDEX idx_audit_resource ON audit_events(resource, resource_id);
CREATE INDEX idx_audit_category ON audit_events(category);
CREATE INDEX idx_audit_severity ON audit_events(severity);
CREATE INDEX idx_audit_outcome ON audit_events(outcome);
