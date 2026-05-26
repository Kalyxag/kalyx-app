// ============================================================
// KALYX — Multi-Tenant Mock Data
// 5 Branchen-Profile für Demo & Testimonials
// Deployment: kalyx.academy (Vercel + Mock Mode)
// ============================================================

import type {
  Tenant, User, Course, Enrollment, Completion,
  Certificate, DashboardStats, ComplianceOverview, ActivityItem
} from '@/types'

// ── TENANTS ──────────────────────────────────────────────────

export const MOCK_TENANTS: Record<string, Tenant> = {
  'helvetia-finanz': {
    id: 'a1000000-0000-0000-0000-000000000001',
    slug: 'helvetia-finanz',
    name: 'Helvetia Finanz AG',
    display_name: 'Helvetia Finanz',
    plan: 'professional',
    logo_url: null,
    primary_color: '#14613E',
    accent_color: '#B8904A',
    custom_domain: null,
    billing_email: 'hello@kalyx.ag',
    address_city: 'Zürich',
    address_country: 'CH',
    mfa_required: true,
    sso_enabled: false,
    is_active: true,
    trial_ends_at: null,
    created_at: '2025-01-15T09:00:00Z',
    updated_at: '2025-05-01T14:00:00Z',
  },
  'novabio-schweiz': {
    id: 'a2000000-0000-0000-0000-000000000002',
    slug: 'novabio-schweiz',
    name: 'NovaBio Schweiz GmbH',
    display_name: 'NovaBio Schweiz',
    plan: 'enterprise',
    logo_url: null,
    primary_color: '#3A6DB5',
    accent_color: '#14613E',
    custom_domain: null,
    billing_email: 'hello@kalyx.ag',
    address_city: 'Basel',
    address_country: 'CH',
    mfa_required: true,
    sso_enabled: false,
    is_active: true,
    trial_ends_at: null,
    created_at: '2025-02-01T09:00:00Z',
    updated_at: '2025-05-01T14:00:00Z',
  },
  'akademie-plus': {
    id: 'a3000000-0000-0000-0000-000000000003',
    slug: 'akademie-plus',
    name: 'Akademie Plus AG',
    display_name: 'Akademie Plus',
    plan: 'professional',
    logo_url: null,
    primary_color: '#7C3AED',
    accent_color: '#14613E',
    custom_domain: null,
    billing_email: 'hello@kalyx.ag',
    address_city: 'Zürich',
    address_country: 'CH',
    mfa_required: false,
    sso_enabled: false,
    is_active: true,
    trial_ends_at: null,
    created_at: '2025-02-15T09:00:00Z',
    updated_at: '2025-05-01T14:00:00Z',
  },
  'swiss-retail-group': {
    id: 'a4000000-0000-0000-0000-000000000004',
    slug: 'swiss-retail-group',
    name: 'Swiss Retail Group AG',
    display_name: 'Swiss Retail Group',
    plan: 'professional',
    logo_url: null,
    primary_color: '#B8904A',
    accent_color: '#14613E',
    custom_domain: null,
    billing_email: 'hello@kalyx.ag',
    address_city: 'Bern',
    address_country: 'CH',
    mfa_required: false,
    sso_enabled: false,
    is_active: true,
    trial_ends_at: null,
    created_at: '2025-03-01T09:00:00Z',
    updated_at: '2025-05-01T14:00:00Z',
  },
  'precisiontech': {
    id: 'a5000000-0000-0000-0000-000000000005',
    slug: 'precisiontech',
    name: 'PrecisionTech AG',
    display_name: 'PrecisionTech',
    plan: 'professional',
    logo_url: null,
    primary_color: '#374151',
    accent_color: '#14613E',
    custom_domain: null,
    billing_email: 'hello@kalyx.ag',
    address_city: 'Winterthur',
    address_country: 'CH',
    mfa_required: true,
    sso_enabled: false,
    is_active: true,
    trial_ends_at: null,
    created_at: '2025-03-15T09:00:00Z',
    updated_at: '2025-05-01T14:00:00Z',
  },
}

// Default tenant for backward compat
export const MOCK_TENANT = MOCK_TENANTS['helvetia-finanz']

// ── USERS ────────────────────────────────────────────────────

export const MOCK_USERS_BY_TENANT: Record<string, User[]> = {
  'helvetia-finanz': [
    { id: 'u1-001', tenant_id: 'a1000000-0000-0000-0000-000000000001', email: 'admin@helvetia-finanz.ch', full_name: 'Sarah Muster', avatar_url: null, department: 'People & Culture', position: 'Head of People & Culture', employee_id: 'HF-001', location: 'Zürich HQ', phone: '+41 44 500 00 01', language: 'de', role: 'tenant_admin', is_active: true, last_login_at: '2025-05-19T08:14:00Z', external_id: null, manager_id: null, invited_by: null, onboarded_at: '2025-01-15T09:00:00Z', created_at: '2025-01-15T09:00:00Z', updated_at: '2025-05-19T08:14:00Z' },
    { id: 'u1-002', tenant_id: 'a1000000-0000-0000-0000-000000000001', email: 'compliance@helvetia-finanz.ch', full_name: 'Thomas Berger', avatar_url: null, department: 'Compliance', position: 'Chief Compliance Officer', employee_id: 'HF-002', location: 'Zürich HQ', phone: '+41 44 500 00 02', language: 'de', role: 'compliance_officer', is_active: true, last_login_at: '2025-05-18T17:30:00Z', external_id: null, manager_id: null, invited_by: null, onboarded_at: '2025-01-16T10:00:00Z', created_at: '2025-01-15T10:00:00Z', updated_at: '2025-05-18T17:30:00Z' },
    { id: 'u1-003', tenant_id: 'a1000000-0000-0000-0000-000000000001', email: 'anna.mueller@helvetia-finanz.ch', full_name: 'Anna Müller', avatar_url: null, department: 'Private Banking', position: 'Relationship Manager', employee_id: 'HF-003', location: 'Zürich HQ', phone: '+41 44 500 00 03', language: 'de', role: 'learner', is_active: true, last_login_at: '2025-05-19T09:14:00Z', external_id: null, manager_id: null, invited_by: null, onboarded_at: '2025-01-20T09:00:00Z', created_at: '2025-01-18T10:00:00Z', updated_at: '2025-05-19T09:14:00Z' },
    { id: 'u1-004', tenant_id: 'a1000000-0000-0000-0000-000000000001', email: 'peter.keller@helvetia-finanz.ch', full_name: 'Peter Keller', avatar_url: null, department: 'Risk Management', position: 'Senior Risk Analyst', employee_id: 'HF-004', location: 'Genf', phone: '+41 22 500 00 04', language: 'de', role: 'learner', is_active: true, last_login_at: '2025-05-18T11:07:00Z', external_id: null, manager_id: null, invited_by: null, onboarded_at: '2025-02-01T09:00:00Z', created_at: '2025-01-20T10:00:00Z', updated_at: '2025-05-18T11:07:00Z' },
    { id: 'u1-005', tenant_id: 'a1000000-0000-0000-0000-000000000001', email: 'marc.weber@helvetia-finanz.ch', full_name: 'Marc Weber', avatar_url: null, department: 'Operations', position: 'Operations Manager', employee_id: 'HF-005', location: 'Basel', phone: '+41 61 500 00 05', language: 'de', role: 'learner', is_active: true, last_login_at: '2025-05-01T16:00:00Z', external_id: null, manager_id: null, invited_by: null, onboarded_at: '2025-02-15T09:00:00Z', created_at: '2025-02-01T10:00:00Z', updated_at: '2025-05-01T16:00:00Z' },
  ],
  'novabio-schweiz': [
    { id: 'u2-001', tenant_id: 'a2000000-0000-0000-0000-000000000002', email: 'admin@novabio-schweiz.ch', full_name: 'Dr. Mia Steiner', avatar_url: null, department: 'Regulatory Affairs', position: 'Head of Regulatory Affairs', employee_id: 'NB-001', location: 'Basel', phone: '+41 61 600 00 01', language: 'de', role: 'tenant_admin', is_active: true, last_login_at: '2025-05-19T08:30:00Z', external_id: null, manager_id: null, invited_by: null, onboarded_at: '2025-02-01T09:00:00Z', created_at: '2025-02-01T09:00:00Z', updated_at: '2025-05-19T08:30:00Z' },
    { id: 'u2-002', tenant_id: 'a2000000-0000-0000-0000-000000000002', email: 'qualitaet@novabio-schweiz.ch', full_name: 'Andreas Huber', avatar_url: null, department: 'Quality Assurance', position: 'Quality Assurance Manager', employee_id: 'NB-002', location: 'Basel', phone: '+41 61 600 00 02', language: 'de', role: 'compliance_officer', is_active: true, last_login_at: '2025-05-18T14:00:00Z', external_id: null, manager_id: null, invited_by: null, onboarded_at: '2025-02-02T09:00:00Z', created_at: '2025-02-01T10:00:00Z', updated_at: '2025-05-18T14:00:00Z' },
    { id: 'u2-003', tenant_id: 'a2000000-0000-0000-0000-000000000002', email: 'labor@novabio-schweiz.ch', full_name: 'Lisa Koch', avatar_url: null, department: 'R&D', position: 'Senior Scientist', employee_id: 'NB-003', location: 'Basel', phone: '+41 61 600 00 03', language: 'de', role: 'learner', is_active: true, last_login_at: '2025-05-17T10:00:00Z', external_id: null, manager_id: null, invited_by: null, onboarded_at: '2025-02-10T09:00:00Z', created_at: '2025-02-05T10:00:00Z', updated_at: '2025-05-17T10:00:00Z' },
  ],
  'akademie-plus': [
    { id: 'u3-001', tenant_id: 'a3000000-0000-0000-0000-000000000003', email: 'admin@akademie-plus.ch', full_name: 'Prof. Laura Brunner', avatar_url: null, department: 'Weiterbildung', position: 'Leiterin Weiterbildung', employee_id: 'AP-001', location: 'Zürich', phone: '+41 44 700 00 01', language: 'de', role: 'tenant_admin', is_active: true, last_login_at: '2025-05-19T09:00:00Z', external_id: null, manager_id: null, invited_by: null, onboarded_at: '2025-02-15T09:00:00Z', created_at: '2025-02-15T09:00:00Z', updated_at: '2025-05-19T09:00:00Z' },
    { id: 'u3-002', tenant_id: 'a3000000-0000-0000-0000-000000000003', email: 'compliance@akademie-plus.ch', full_name: 'Stefan Baumann', avatar_url: null, department: 'Datenschutz', position: 'Datenschutzbeauftragter', employee_id: 'AP-002', location: 'Zürich', phone: '+41 44 700 00 02', language: 'de', role: 'compliance_officer', is_active: true, last_login_at: '2025-05-18T15:00:00Z', external_id: null, manager_id: null, invited_by: null, onboarded_at: '2025-02-16T09:00:00Z', created_at: '2025-02-15T10:00:00Z', updated_at: '2025-05-18T15:00:00Z' },
  ],
  'swiss-retail-group': [
    { id: 'u4-001', tenant_id: 'a4000000-0000-0000-0000-000000000004', email: 'admin@swiss-retail-group.ch', full_name: 'Nicole Zimmermann', avatar_url: null, department: 'HR & Training', position: 'HR & Training Manager', employee_id: 'SR-001', location: 'Bern', phone: '+41 31 800 00 01', language: 'de', role: 'tenant_admin', is_active: true, last_login_at: '2025-05-19T07:45:00Z', external_id: null, manager_id: null, invited_by: null, onboarded_at: '2025-03-01T09:00:00Z', created_at: '2025-03-01T09:00:00Z', updated_at: '2025-05-19T07:45:00Z' },
    { id: 'u4-002', tenant_id: 'a4000000-0000-0000-0000-000000000004', email: 'compliance@swiss-retail-group.ch', full_name: 'Marco Furrer', avatar_url: null, department: 'Operations', position: 'Operations Director', employee_id: 'SR-002', location: 'Bern', phone: '+41 31 800 00 02', language: 'de', role: 'compliance_officer', is_active: true, last_login_at: '2025-05-18T16:00:00Z', external_id: null, manager_id: null, invited_by: null, onboarded_at: '2025-03-02T09:00:00Z', created_at: '2025-03-01T10:00:00Z', updated_at: '2025-05-18T16:00:00Z' },
  ],
  'precisiontech': [
    { id: 'u5-001', tenant_id: 'a5000000-0000-0000-0000-000000000005', email: 'admin@precisiontech.ch', full_name: 'Hans Meier', avatar_url: null, department: 'Safety & Compliance', position: 'Safety & Compliance Officer', employee_id: 'PT-001', location: 'Winterthur', phone: '+41 52 900 00 01', language: 'de', role: 'tenant_admin', is_active: true, last_login_at: '2025-05-19T06:30:00Z', external_id: null, manager_id: null, invited_by: null, onboarded_at: '2025-03-15T09:00:00Z', created_at: '2025-03-15T09:00:00Z', updated_at: '2025-05-19T06:30:00Z' },
    { id: 'u5-002', tenant_id: 'a5000000-0000-0000-0000-000000000005', email: 'qualitaet@precisiontech.ch', full_name: 'Petra Koch', avatar_url: null, department: 'Quality', position: 'Quality Manager ISO 9001', employee_id: 'PT-002', location: 'Winterthur', phone: '+41 52 900 00 02', language: 'de', role: 'compliance_officer', is_active: true, last_login_at: '2025-05-18T13:00:00Z', external_id: null, manager_id: null, invited_by: null, onboarded_at: '2025-03-16T09:00:00Z', created_at: '2025-03-15T10:00:00Z', updated_at: '2025-05-18T13:00:00Z' },
  ],
}

export const MOCK_USERS = MOCK_USERS_BY_TENANT['helvetia-finanz']

// ── CREDENTIALS (for mock login) ─────────────────────────────

export const MOCK_CREDENTIALS: Record<string, { password: string; tenant: string }> = {
  'admin@helvetia-finanz.ch':      { password: 'HelvFinanz2025!',  tenant: 'helvetia-finanz' },
  'compliance@helvetia-finanz.ch': { password: 'HelvFinanz2025!',  tenant: 'helvetia-finanz' },
  'admin@novabio-schweiz.ch':      { password: 'NovaBio2025!',     tenant: 'novabio-schweiz' },
  'qualitaet@novabio-schweiz.ch':  { password: 'NovaBio2025!',     tenant: 'novabio-schweiz' },
  'admin@akademie-plus.ch':        { password: 'AkademiePlus2025!', tenant: 'akademie-plus' },
  'compliance@akademie-plus.ch':   { password: 'AkademiePlus2025!', tenant: 'akademie-plus' },
  'admin@swiss-retail-group.ch':   { password: 'SwissRetail2025!', tenant: 'swiss-retail-group' },
  'compliance@swiss-retail-group.ch': { password: 'SwissRetail2025!', tenant: 'swiss-retail-group' },
  'admin@precisiontech.ch':        { password: 'PrecisionTech2025!', tenant: 'precisiontech' },
  'qualitaet@precisiontech.ch':    { password: 'PrecisionTech2025!', tenant: 'precisiontech' },
}

// ── DASHBOARD STATS BY TENANT ─────────────────────────────────

export const MOCK_STATS_BY_TENANT: Record<string, DashboardStats> = {
  'helvetia-finanz':   { compliance_rate: 89, total_users: 50,  active_users: 47, total_completions: 137, pending_completions: 4,  certificates_issued: 89,  overdue_count: 4  },
  'novabio-schweiz':   { compliance_rate: 76, total_users: 120, active_users: 108, total_completions: 203, pending_completions: 12, certificates_issued: 67,  overdue_count: 18 },
  'akademie-plus':     { compliance_rate: 94, total_users: 200, active_users: 195, total_completions: 387, pending_completions: 8,  certificates_issued: 156, overdue_count: 8  },
  'swiss-retail-group':{ compliance_rate: 71, total_users: 350, active_users: 290, total_completions: 612, pending_completions: 45, certificates_issued: 198, overdue_count: 45 },
  'precisiontech':     { compliance_rate: 83, total_users: 180, active_users: 168, total_completions: 298, pending_completions: 18, certificates_issued: 112, overdue_count: 18 },
}

export const MOCK_DASHBOARD_STATS = MOCK_STATS_BY_TENANT['helvetia-finanz']

// ── COURSES ───────────────────────────────────────────────────

export const MOCK_COURSES: Course[] = [
  { id: 'c1', tenant_id: '', title: 'Geldwäscherei-Prävention (GwG 2025)', description: 'Pflichtschulung zu GwG, MROS, PEP-Identifikation und Enhanced Due Diligence', category: 'compliance', regulatory_tags: ['FINMA','GwG','AML','FATF'], passing_score: 80, estimated_minutes: 45, is_published: true, is_mandatory: true, valid_for_days: 365, version: '2025.1', ai_generated: true, question_count: 10, created_by: 'system', created_at: '2025-01-01T00:00:00Z', updated_at: '2025-05-01T00:00:00Z' },
  { id: 'c2', tenant_id: '', title: 'Datenschutz DSGVO & DSG 2025', description: 'Art. 5 DSGVO Grundsätze, Betroffenenrechte, 72h-Meldepflicht, Schweizer DSG 2023', category: 'privacy', regulatory_tags: ['DSGVO','DSG','EDÖB'], passing_score: 75, estimated_minutes: 30, is_published: true, is_mandatory: true, valid_for_days: 365, version: '2025.1', ai_generated: true, question_count: 10, created_by: 'system', created_at: '2025-01-01T00:00:00Z', updated_at: '2025-05-01T00:00:00Z' },
  { id: 'c3', tenant_id: '', title: 'Informationssicherheit & Cyberrisiken', description: 'ISO 27001, Phishing, MFA, Ransomware, Zero Trust — Awareness-Training', category: 'security', regulatory_tags: ['ISO27001','NIST'], passing_score: 70, estimated_minutes: 35, is_published: true, is_mandatory: true, valid_for_days: 730, version: '2025.1', ai_generated: true, question_count: 10, created_by: 'system', created_at: '2025-01-01T00:00:00Z', updated_at: '2025-05-01T00:00:00Z' },
]

// ── ACTIVITY ──────────────────────────────────────────────────

export const MOCK_ACTIVITY_BY_TENANT: Record<string, ActivityItem[]> = {
  'helvetia-finanz': [
    { id: 'act1', type: 'completion', user_name: 'Anna Müller',   description: 'GwG 2025 abgeschlossen · Score: 92%',           time_ago: 'Vor 23 Min.' },
    { id: 'act2', type: 'invite',     user_name: 'Lukas Bär',     description: 'Eingeladen · Private Banking',                  time_ago: 'Vor 1 Std.' },
    { id: 'act3', type: 'certificate',user_name: 'Peter Keller',  description: 'Zertifikat KALYX-2025-000087 ausgestellt',      time_ago: 'Vor 2 Std.' },
    { id: 'act4', type: 'overdue',    user_name: 'Marc Weber',    description: 'Frist für Informationssicherheit überschritten',time_ago: 'Erinnerung gesendet' },
    { id: 'act5', type: 'completion', user_name: 'Sophie Lang',   description: 'DSGVO/DSG abgeschlossen · Score: 87%',          time_ago: 'Gestern 16:44' },
  ],
  'novabio-schweiz': [
    { id: 'act1', type: 'completion', user_name: 'Dr. Mia Steiner', description: 'GxP Grundlagen abgeschlossen · Score: 88%', time_ago: 'Heute 08:45' },
    { id: 'act2', type: 'overdue',    user_name: 'Klaus Brenner',   description: 'Frist für Arbeitssicherheit überschritten',  time_ago: 'Erinnerung gesendet' },
    { id: 'act3', type: 'certificate',user_name: 'Lisa Koch',       description: 'Zertifikat KALYX-2025-000201 ausgestellt',   time_ago: 'Gestern 14:00' },
  ],
  'akademie-plus': [
    { id: 'act1', type: 'completion', user_name: 'Prof. Laura Brunner', description: 'Datenschutz abgeschlossen · Score: 96%',  time_ago: 'Heute 09:10' },
    { id: 'act2', type: 'completion', user_name: 'Sarah Wyss',          description: 'Medienkompetenz abgeschlossen · Score: 91%', time_ago: 'Heute 08:30' },
  ],
  'swiss-retail-group': [
    { id: 'act1', type: 'completion',  user_name: 'Nicole Zimmermann', description: 'Lebensmittelhygiene abgeschlossen · 83%', time_ago: 'Heute 07:50' },
    { id: 'act2', type: 'overdue',     user_name: 'Kevin Müller',      description: 'ISO 27001 Frist überschritten (Filiale 12)', time_ago: 'SMS gesendet' },
    { id: 'act3', type: 'invite',      user_name: 'Julia Sommer',      description: 'Neue Mitarbeiterin eingeladen · Filiale 7', time_ago: 'Vor 3 Std.' },
  ],
  'precisiontech': [
    { id: 'act1', type: 'completion', user_name: 'Hans Meier',   description: 'SUVA Arbeitssicherheit abgeschlossen · 88%',   time_ago: 'Heute 06:45' },
    { id: 'act2', type: 'completion', user_name: 'Petra Koch',   description: 'ISO 9001 Awareness abgeschlossen · 81%',       time_ago: 'Heute 06:30' },
    { id: 'act3', type: 'overdue',    user_name: 'Rolf Kuster',  description: 'Gefahrstoffe Frist überschritten',            time_ago: 'Erinnerung gesendet' },
  ],
}
