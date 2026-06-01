// ============================================================
// KALYX — Multi-Tenant Mock Data v2
// Positionierung: Lern- & Qualifizierungsinfrastruktur
// Compliance = ein Use Case, nicht die Identität
// ============================================================

import type {
  Tenant, User, DashboardStats, ActivityItem
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
  'metroplan-zuerich': {
    id: 'a6000000-0000-0000-0000-000000000006',
    slug: 'metroplan-zuerich',
    name: 'MetroPlan Zuerich GmbH',
    display_name: 'MetroPlan Zuerich',
    plan: 'professional',
    logo_url: null,
    primary_color: '#1B4F72',
    accent_color: '#27AE60',
    custom_domain: null,
    billing_email: 'hello@kalyx.ag',
    address_city: 'Zürich',
    address_country: 'CH',
    mfa_required: false,
    sso_enabled: false,
    is_active: true,
    trial_ends_at: null,
    created_at: '2025-04-01T09:00:00Z',
    updated_at: '2025-05-01T14:00:00Z',
  },
  'brandwerk-zuerich': {
    id: 'a7000000-0000-0000-0000-000000000007',
    slug: 'brandwerk-zuerich',
    name: 'Brandwerk Zuerich AG',
    display_name: 'Brandwerk',
    plan: 'professional',
    logo_url: null,
    primary_color: '#0A66C2',
    accent_color: '#7C3AED',
    custom_domain: null,
    billing_email: 'hello@kalyx.ag',
    address_city: 'Zürich',
    address_country: 'CH',
    mfa_required: false,
    sso_enabled: false,
    is_active: true,
    trial_ends_at: null,
    created_at: '2025-04-15T09:00:00Z',
    updated_at: '2025-05-15T14:00:00Z',
  },
  // ── NEUE MANDANTEN ──────────────────────────────────────────
  'kantonsspital-zuerich': {
    id: 'a8000000-0000-0000-0000-000000000008',
    slug: 'kantonsspital-zuerich',
    name: 'Kantonsspital Zürich AG',
    display_name: 'Kantonsspital ZH',
    plan: 'enterprise',
    logo_url: null,
    primary_color: '#0F766E',
    accent_color: '#B8904A',
    custom_domain: null,
    billing_email: 'hello@kalyx.ag',
    address_city: 'Zürich',
    address_country: 'CH',
    mfa_required: true,
    sso_enabled: true,
    is_active: true,
    trial_ends_at: null,
    created_at: '2025-05-01T09:00:00Z',
    updated_at: '2025-05-20T14:00:00Z',
  },
  'zurich-insurance': {
    id: 'a9000000-0000-0000-0000-000000000009',
    slug: 'zurich-insurance',
    name: 'Zurich Insurance Group AG',
    display_name: 'Zurich Insurance',
    plan: 'enterprise',
    logo_url: null,
    primary_color: '#1D3A8A',
    accent_color: '#B8904A',
    custom_domain: null,
    billing_email: 'hello@kalyx.ag',
    address_city: 'Zürich',
    address_country: 'CH',
    mfa_required: true,
    sso_enabled: true,
    is_active: true,
    trial_ends_at: null,
    created_at: '2025-05-10T09:00:00Z',
    updated_at: '2025-05-25T14:00:00Z',
  },
}

export const MOCK_TENANT = MOCK_TENANTS['helvetia-finanz']

// ── USERS ────────────────────────────────────────────────────

export const MOCK_USERS_BY_TENANT: Record<string, User[]> = {
  'helvetia-finanz': [
    { id: 'u1-001', tenant_id: 'a1000000-0000-0000-0000-000000000001', email: 'admin@helvetia-finanz.ch', full_name: 'Sarah Muster', avatar_url: null, department: 'People & Culture', position: 'Head of People & Culture', employee_id: 'HF-001', location: 'Zürich HQ', phone: '+41 44 500 00 01', language: 'de', role: 'tenant_admin', is_active: true, last_login_at: '2025-05-19T08:14:00Z', external_id: null, manager_id: null, invited_by: null, onboarded_at: '2025-01-15T09:00:00Z', created_at: '2025-01-15T09:00:00Z', updated_at: '2025-05-19T08:14:00Z' },
    { id: 'u1-002', tenant_id: 'a1000000-0000-0000-0000-000000000001', email: 'compliance@helvetia-finanz.ch', full_name: 'Thomas Berger', avatar_url: null, department: 'Compliance', position: 'Chief Compliance Officer', employee_id: 'HF-002', location: 'Zürich HQ', phone: '+41 44 500 00 02', language: 'de', role: 'compliance_officer', is_active: true, last_login_at: '2025-05-18T17:30:00Z', external_id: null, manager_id: null, invited_by: null, onboarded_at: '2025-01-16T10:00:00Z', created_at: '2025-01-15T10:00:00Z', updated_at: '2025-05-18T17:30:00Z' },
    { id: 'u1-003', tenant_id: 'a1000000-0000-0000-0000-000000000001', email: 'anna.mueller@helvetia-finanz.ch', full_name: 'Anna Müller', avatar_url: null, department: 'Private Banking', position: 'Relationship Manager', employee_id: 'HF-003', location: 'Zürich HQ', phone: '+41 44 500 00 03', language: 'de', role: 'learner', is_active: true, last_login_at: '2025-05-19T09:14:00Z', external_id: null, manager_id: null, invited_by: null, onboarded_at: '2025-01-20T09:00:00Z', created_at: '2025-01-18T10:00:00Z', updated_at: '2025-05-19T09:14:00Z' },
    { id: 'u1-004', tenant_id: 'a1000000-0000-0000-0000-000000000001', email: 'peter.keller@helvetia-finanz.ch', full_name: 'Peter Keller', avatar_url: null, department: 'Risk Management', position: 'Senior Risk Analyst', employee_id: 'HF-004', location: 'Genf', phone: '+41 22 500 00 04', language: 'de', role: 'learner', is_active: true, last_login_at: '2025-05-18T11:07:00Z', external_id: null, manager_id: null, invited_by: null, onboarded_at: '2025-02-01T09:00:00Z', created_at: '2025-01-20T10:00:00Z', updated_at: '2025-05-18T11:07:00Z' },
    { id: 'u1-005', tenant_id: 'a1000000-0000-0000-0000-000000000001', email: 'marc.weber@helvetia-finanz.ch', full_name: 'Marc Weber', avatar_url: null, department: 'Operations', position: 'Operations Manager', employee_id: 'HF-005', location: 'Basel', phone: '+41 61 500 00 05', language: 'de', role: 'learner', is_active: true, last_login_at: '2025-05-01T16:00:00Z', external_id: null, manager_id: null, invited_by: null, onboarded_at: '2025-02-15T09:00:00Z', created_at: '2025-02-01T10:00:00Z', updated_at: '2025-05-01T16:00:00Z' },
    { id: 'u1-006', tenant_id: 'a1000000-0000-0000-0000-000000000001', email: 'it@helvetia-finanz.ch', full_name: 'David Leu', avatar_url: null, department: 'IT & Digitalisierung', position: 'IT Security Engineer', employee_id: 'HF-006', location: 'Zürich HQ', phone: '+41 44 500 00 06', language: 'de', role: 'learner', is_active: true, last_login_at: '2025-05-20T07:00:00Z', external_id: null, manager_id: null, invited_by: null, onboarded_at: '2025-03-01T09:00:00Z', created_at: '2025-03-01T09:00:00Z', updated_at: '2025-05-20T07:00:00Z' },
    { id: 'u1-007', tenant_id: 'a1000000-0000-0000-0000-000000000001', email: 'legal@helvetia-finanz.ch', full_name: 'Katharina Vogel', avatar_url: null, department: 'Legal', position: 'Senior Legal Counsel', employee_id: 'HF-007', location: 'Zürich HQ', phone: '+41 44 500 00 07', language: 'de', role: 'learner', is_active: true, last_login_at: '2025-05-19T15:00:00Z', external_id: null, manager_id: null, invited_by: null, onboarded_at: '2025-01-20T09:00:00Z', created_at: '2025-01-20T09:00:00Z', updated_at: '2025-05-19T15:00:00Z' },
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
  'metroplan-zuerich': [
    { id: 'u6-001', tenant_id: 'a6000000-0000-0000-0000-000000000006', email: 'admin@metroplan-zuerich.ch', full_name: 'Eva-Maria Rothenfluh', avatar_url: null, department: 'Regionale Planung', position: 'Projektleiterin', employee_id: 'MP-001', location: 'Zürich', phone: '+41 44 200 00 01', language: 'de', role: 'tenant_admin', is_active: true, last_login_at: '2025-05-19T08:30:00Z', external_id: null, manager_id: null, invited_by: null, onboarded_at: '2025-04-01T09:00:00Z', created_at: '2025-04-01T09:00:00Z', updated_at: '2025-05-19T08:30:00Z' },
    { id: 'u6-002', tenant_id: 'a6000000-0000-0000-0000-000000000006', email: 'datenschutz@metroplan-zuerich.ch', full_name: 'Markus Brunner', avatar_url: null, department: 'Compliance', position: 'Datenschutzbeauftragter', employee_id: 'MP-002', location: 'Zürich', phone: '+41 44 200 00 02', language: 'de', role: 'compliance_officer', is_active: true, last_login_at: '2025-05-18T14:00:00Z', external_id: null, manager_id: null, invited_by: null, onboarded_at: '2025-04-02T09:00:00Z', created_at: '2025-04-01T10:00:00Z', updated_at: '2025-05-18T14:00:00Z' },
  ],
  'brandwerk-zuerich': [
    { id: 'u7-001', tenant_id: 'a7000000-0000-0000-0000-000000000007', email: 'admin@brandwerk-zuerich.ch', full_name: 'Christine Mueller', avatar_url: null, department: 'Account Management', position: 'Group Account Director', employee_id: 'BW-001', location: 'Zürich', phone: '+41 44 300 00 01', language: 'de', role: 'tenant_admin', is_active: true, last_login_at: '2025-05-20T09:00:00Z', external_id: null, manager_id: null, invited_by: null, onboarded_at: '2025-04-15T09:00:00Z', created_at: '2025-04-15T09:00:00Z', updated_at: '2025-05-20T09:00:00Z' },
    { id: 'u7-002', tenant_id: 'a7000000-0000-0000-0000-000000000007', email: 'digital@brandwerk-zuerich.ch', full_name: 'Tobias Gerber', avatar_url: null, department: 'Digital', position: 'Head of Digital', employee_id: 'BW-002', location: 'Zürich', phone: '+41 44 300 00 02', language: 'de', role: 'learner', is_active: true, last_login_at: '2025-05-19T14:00:00Z', external_id: null, manager_id: null, invited_by: null, onboarded_at: '2025-04-16T09:00:00Z', created_at: '2025-04-15T10:00:00Z', updated_at: '2025-05-19T14:00:00Z' },
    { id: 'u7-003', tenant_id: 'a7000000-0000-0000-0000-000000000007', email: 'strategy@brandwerk-zuerich.ch', full_name: 'Laura Bachmann', avatar_url: null, department: 'Strategy', position: 'Senior Strategist', employee_id: 'BW-003', location: 'Zürich', phone: '+41 44 300 00 03', language: 'de', role: 'learner', is_active: true, last_login_at: '2025-05-18T11:00:00Z', external_id: null, manager_id: null, invited_by: null, onboarded_at: '2025-04-17T09:00:00Z', created_at: '2025-04-15T11:00:00Z', updated_at: '2025-05-18T11:00:00Z' },
  ],
  'kantonsspital-zuerich': [
    { id: 'u8-001', tenant_id: 'a8000000-0000-0000-0000-000000000008', email: 'admin@ksz.ch', full_name: 'Dr. Sandra Holzer', avatar_url: null, department: 'Personalentwicklung', position: 'Leiterin Personalentwicklung', employee_id: 'KSZ-001', location: 'Zürich', phone: '+41 44 400 00 01', language: 'de', role: 'tenant_admin', is_active: true, last_login_at: '2025-05-20T07:00:00Z', external_id: null, manager_id: null, invited_by: null, onboarded_at: '2025-05-01T09:00:00Z', created_at: '2025-05-01T09:00:00Z', updated_at: '2025-05-20T07:00:00Z' },
    { id: 'u8-002', tenant_id: 'a8000000-0000-0000-0000-000000000008', email: 'qualitaet@ksz.ch', full_name: 'Martin Frei', avatar_url: null, department: 'Qualitätsmanagement', position: 'Leiter Qualitätsmanagement', employee_id: 'KSZ-002', location: 'Zürich', phone: '+41 44 400 00 02', language: 'de', role: 'compliance_officer', is_active: true, last_login_at: '2025-05-19T08:00:00Z', external_id: null, manager_id: null, invited_by: null, onboarded_at: '2025-05-02T09:00:00Z', created_at: '2025-05-01T10:00:00Z', updated_at: '2025-05-19T08:00:00Z' },
    { id: 'u8-003', tenant_id: 'a8000000-0000-0000-0000-000000000008', email: 'pflege@ksz.ch', full_name: 'Claudia Bauer', avatar_url: null, department: 'Pflege', position: 'Pflegefachfrau HF', employee_id: 'KSZ-003', location: 'Zürich', phone: '+41 44 400 00 03', language: 'de', role: 'learner', is_active: true, last_login_at: '2025-05-20T06:15:00Z', external_id: null, manager_id: null, invited_by: null, onboarded_at: '2025-05-03T09:00:00Z', created_at: '2025-05-02T10:00:00Z', updated_at: '2025-05-20T06:15:00Z' },
  ],
  'zurich-insurance': [
    { id: 'u9-001', tenant_id: 'a9000000-0000-0000-0000-000000000009', email: 'admin@zurich-insurance.ch', full_name: 'Michael Zürcher', avatar_url: null, department: 'Learning & Development', position: 'Head of L&D DACH', employee_id: 'ZI-001', location: 'Zürich', phone: '+41 44 500 10 01', language: 'de', role: 'tenant_admin', is_active: true, last_login_at: '2025-05-20T08:30:00Z', external_id: null, manager_id: null, invited_by: null, onboarded_at: '2025-05-10T09:00:00Z', created_at: '2025-05-10T09:00:00Z', updated_at: '2025-05-20T08:30:00Z' },
    { id: 'u9-002', tenant_id: 'a9000000-0000-0000-0000-000000000009', email: 'compliance@zurich-insurance.ch', full_name: 'Dr. Patricia Wenger', avatar_url: null, department: 'Group Compliance', position: 'Chief Compliance Officer DACH', employee_id: 'ZI-002', location: 'Zürich', phone: '+41 44 500 10 02', language: 'de', role: 'compliance_officer', is_active: true, last_login_at: '2025-05-19T17:00:00Z', external_id: null, manager_id: null, invited_by: null, onboarded_at: '2025-05-11T09:00:00Z', created_at: '2025-05-10T10:00:00Z', updated_at: '2025-05-19T17:00:00Z' },
    { id: 'u9-003', tenant_id: 'a9000000-0000-0000-0000-000000000009', email: 'underwriting@zurich-insurance.ch', full_name: 'Rafael Ospina', avatar_url: null, department: 'Commercial Underwriting', position: 'Senior Underwriter', employee_id: 'ZI-003', location: 'Zürich', phone: '+41 44 500 10 03', language: 'de', role: 'learner', is_active: true, last_login_at: '2025-05-20T09:00:00Z', external_id: null, manager_id: null, invited_by: null, onboarded_at: '2025-05-12T09:00:00Z', created_at: '2025-05-10T11:00:00Z', updated_at: '2025-05-20T09:00:00Z' },
  ],
}

export const MOCK_USERS = MOCK_USERS_BY_TENANT['helvetia-finanz']

// ── CREDENTIALS ──────────────────────────────────────────────

export const MOCK_CREDENTIALS: Record<string, { password: string; tenant: string }> = {
  'admin@helvetia-finanz.ch':         { password: 'HelvFinanz2025!',     tenant: 'helvetia-finanz' },
  'compliance@helvetia-finanz.ch':    { password: 'HelvFinanz2025!',     tenant: 'helvetia-finanz' },
  'admin@novabio-schweiz.ch':         { password: 'NovaBio2025!',        tenant: 'novabio-schweiz' },
  'qualitaet@novabio-schweiz.ch':     { password: 'NovaBio2025!',        tenant: 'novabio-schweiz' },
  'admin@akademie-plus.ch':           { password: 'AkademiePlus2025!',   tenant: 'akademie-plus' },
  'compliance@akademie-plus.ch':      { password: 'AkademiePlus2025!',   tenant: 'akademie-plus' },
  'admin@swiss-retail-group.ch':      { password: 'SwissRetail2025!',    tenant: 'swiss-retail-group' },
  'compliance@swiss-retail-group.ch': { password: 'SwissRetail2025!',    tenant: 'swiss-retail-group' },
  'admin@precisiontech.ch':           { password: 'PrecisionTech2025!',  tenant: 'precisiontech' },
  'qualitaet@precisiontech.ch':       { password: 'PrecisionTech2025!',  tenant: 'precisiontech' },
  'admin@metroplan-zuerich.ch':       { password: 'MetroPlan2025!',      tenant: 'metroplan-zuerich' },
  'datenschutz@metroplan-zuerich.ch': { password: 'MetroPlan2025!',      tenant: 'metroplan-zuerich' },
  'admin@brandwerk-zuerich.ch':       { password: 'Brandwerk2025!',      tenant: 'brandwerk-zuerich' },
  'digital@brandwerk-zuerich.ch':     { password: 'Brandwerk2025!',      tenant: 'brandwerk-zuerich' },
  'strategy@brandwerk-zuerich.ch':    { password: 'Brandwerk2025!',      tenant: 'brandwerk-zuerich' },
  'admin@ksz.ch':                     { password: 'KSZuerich2025!',      tenant: 'kantonsspital-zuerich' },
  'qualitaet@ksz.ch':                 { password: 'KSZuerich2025!',      tenant: 'kantonsspital-zuerich' },
  'pflege@ksz.ch':                    { password: 'KSZuerich2025!',      tenant: 'kantonsspital-zuerich' },
  'admin@zurich-insurance.ch':        { password: 'ZurichIns2025!',      tenant: 'zurich-insurance' },
  'compliance@zurich-insurance.ch':   { password: 'ZurichIns2025!',      tenant: 'zurich-insurance' },
  'underwriting@zurich-insurance.ch': { password: 'ZurichIns2025!',      tenant: 'zurich-insurance' },
}

// ── DASHBOARD STATS ───────────────────────────────────────────

export const MOCK_STATS_BY_TENANT: Record<string, any> = {
  'helvetia-finanz':      { active_learners: 47, total_users: 50, learning_hours_month: 124, new_qualifications: 12, open_learning_goals: 4, certificates_issued: 89, overdue_count: 4, completion_rate: 89 },
  'novabio-schweiz':      { active_learners: 108, total_users: 120, learning_hours_month: 312, new_qualifications: 18, open_learning_goals: 14, certificates_issued: 67, overdue_count: 18, completion_rate: 76 },
  'akademie-plus':        { active_learners: 195, total_users: 200, learning_hours_month: 540, new_qualifications: 42, open_learning_goals: 8, certificates_issued: 156, overdue_count: 8, completion_rate: 94 },
  'swiss-retail-group':   { active_learners: 290, total_users: 350, learning_hours_month: 680, new_qualifications: 35, open_learning_goals: 45, certificates_issued: 198, overdue_count: 45, completion_rate: 71 },
  'precisiontech':        { active_learners: 168, total_users: 180, learning_hours_month: 290, new_qualifications: 22, open_learning_goals: 18, certificates_issued: 112, overdue_count: 18, completion_rate: 83 },
  'metroplan-zuerich':    { active_learners: 15, total_users: 18, learning_hours_month: 38, new_qualifications: 4, open_learning_goals: 8, certificates_issued: 12, overdue_count: 8, completion_rate: 62 },
  'brandwerk-zuerich':    { active_learners: 28, total_users: 32, learning_hours_month: 55, new_qualifications: 6, open_learning_goals: 6, certificates_issued: 18, overdue_count: 6, completion_rate: 55 },
  'kantonsspital-zuerich':{ active_learners: 380, total_users: 420, learning_hours_month: 890, new_qualifications: 58, open_learning_goals: 22, certificates_issued: 240, overdue_count: 22, completion_rate: 81 },
  'zurich-insurance':     { active_learners: 1240, total_users: 1400, learning_hours_month: 2800, new_qualifications: 180, open_learning_goals: 65, certificates_issued: 920, overdue_count: 65, completion_rate: 88 },
}

export const MOCK_DASHBOARD_STATS = MOCK_STATS_BY_TENANT['helvetia-finanz']

// ── SKILL GRAPH BY TENANT ─────────────────────────────────────
// Zeigt Qualifikationsprofil pro Mandant — Kern der KALYX-Positionierung

export interface SkillArea {
  id: string
  label: string
  description: string
  coverage: number     // 0-100: wie viel des Skill-Bereichs abgedeckt ist
  status: 'strong' | 'building' | 'gap'
  courses: string[]    // course IDs
  icon: string
}

export const MOCK_SKILLS_BY_TENANT: Record<string, SkillArea[]> = {
  'helvetia-finanz': [
    { id: 'aml', label: 'Finanzkriminalität & AML', description: 'GwG, FATF, PEP-Identifikation, Transaktionsüberwachung', coverage: 88, status: 'strong', courses: ['gwg-2025'], icon: '⚖️' },
    { id: 'datenschutz', label: 'Datenschutz & Privacy', description: 'DSGVO, DSG 2023, Betroffenenrechte, 72h-Meldepflicht', coverage: 94, status: 'strong', courses: ['dsgvo-dsg'], icon: '🔒' },
    { id: 'cyber', label: 'Cybersicherheit & IT-Risiken', description: 'ISO 27001, Phishing, MFA, Incident Response', coverage: 72, status: 'building', courses: ['iso-27001'], icon: '🛡️' },
    { id: 'finma', label: 'Regulatorisches Finanzwissen', description: 'FINMA-Anforderungen, Sorgfaltspflichten, Kapitalvorschriften', coverage: 60, status: 'building', courses: [], icon: '🏦' },
    { id: 'fuehrung', label: 'Führung & Teamentwicklung', description: 'Führungskompetenzen, Feedbackkultur, Delegation', coverage: 20, status: 'gap', courses: [], icon: '👥' },
  ],
  'novabio-schweiz': [
    { id: 'gxp', label: 'GxP & Life Sciences', description: 'Good Manufacturing Practice, Swissmedic, Labordokumentation', coverage: 76, status: 'building', courses: [], icon: '🧪' },
    { id: 'datenschutz', label: 'Datenschutz & Privacy', description: 'DSGVO, DSG 2023, klinische Daten', coverage: 70, status: 'building', courses: ['dsgvo-dsg'], icon: '🔒' },
    { id: 'cyber', label: 'Cybersicherheit', description: 'ISO 27001, Systemsicherheit im Laborumfeld', coverage: 60, status: 'building', courses: ['iso-27001'], icon: '🛡️' },
    { id: 'qualitaet', label: 'Qualitätsmanagement', description: 'ISO 9001, CAPA-Prozesse, Auditbereitschaft', coverage: 82, status: 'strong', courses: [], icon: '✅' },
    { id: 'arbeitssicherheit', label: 'Arbeitssicherheit & Gesundheit', description: 'SUVA, Laborrichtlinien, Schutzausrüstung', coverage: 45, status: 'gap', courses: [], icon: '🦺' },
  ],
  'brandwerk-zuerich': [
    { id: 'ki', label: 'KI-Kompetenz & EU AI Act', description: 'Sprachmodelle, Prompt Engineering, Datenschutz bei KI-Tools', coverage: 72, status: 'building', courses: ['ki-agentur'], icon: '🤖' },
    { id: 'datenschutz-marketing', label: 'Datenschutz im Marketing', description: 'DSGVO, Cookie-Banner, Analytics, E-Mail-Recht', coverage: 48, status: 'gap', courses: ['dsgvo-marketing'], icon: '🍪' },
    { id: 'abm', label: 'Account-Based Marketing', description: 'ABM-Strategie, TAL, LinkedIn, Pipeline-Aufbau', coverage: 55, status: 'building', courses: ['abm-zertifikat'], icon: '🎯' },
    { id: 'nachhaltigkeit', label: 'Nachhaltige Kommunikation', description: 'Green Claims Directive, Greenwashing-Risiken, CSRD', coverage: 38, status: 'gap', courses: ['green-claims'], icon: '🌱' },
    { id: 'social-selling', label: 'Social Selling & LinkedIn', description: 'Thought Leadership, LinkedIn Ads, SSI-Score', coverage: 61, status: 'building', courses: ['social-selling-b2b'], icon: '💼' },
  ],
  'kantonsspital-zuerich': [
    { id: 'patientensicherheit', label: 'Patientensicherheit', description: 'Critical Incident Reporting, CIRS, Fehlerkultur', coverage: 78, status: 'building', courses: [], icon: '🏥' },
    { id: 'datenschutz', label: 'Datenschutz & Patientendaten', description: 'KKS, DSG, Patientengeheimnis, elektronisches Patientendossier', coverage: 65, status: 'building', courses: ['dsgvo-dsg'], icon: '🔒' },
    { id: 'hygiene', label: 'Hygiene & Infektionsprävention', description: 'Händehygiene, MRSA, nosokomiale Infektionen, KRINKO', coverage: 91, status: 'strong', courses: [], icon: '🧼' },
    { id: 'cyber', label: 'Cybersicherheit', description: 'ISO 27001, Gerätesicherheit, Ransomware im Spitalumfeld', coverage: 52, status: 'building', courses: ['iso-27001'], icon: '🛡️' },
    { id: 'fuehrung', label: 'Klinische Führung', description: 'Teamprozesse, Kommunikation im Notfall, Hierarchie & Sicherheit', coverage: 44, status: 'gap', courses: [], icon: '👩‍⚕️' },
    { id: 'notfall', label: 'Notfallmanagement & BCP', description: 'Business Continuity, Triage, Massenanfall-Verletzter', coverage: 67, status: 'building', courses: [], icon: '🚨' },
  ],
  'zurich-insurance': [
    { id: 'finma-versicherung', label: 'FINMA & Versicherungsaufsicht', description: 'VAG, FINMA-Rundschreiben Versicherungen, SST', coverage: 88, status: 'strong', courses: ['gwg-2025'], icon: '📋' },
    { id: 'datenschutz', label: 'Datenschutz & Versicherungsdaten', description: 'DSGVO, DSG, Vertragsdaten, Kundendatenschutz', coverage: 91, status: 'strong', courses: ['dsgvo-dsg'], icon: '🔒' },
    { id: 'cyber', label: 'Cybersicherheit', description: 'ISO 27001, Cloud-Sicherheit, Third-Party-Risk', coverage: 84, status: 'strong', courses: ['iso-27001'], icon: '🛡️' },
    { id: 'ki', label: 'KI in der Versicherung', description: 'Algorithmenethik, EU AI Act, automatisierte Entscheidungen', coverage: 41, status: 'gap', courses: ['ki-agentur'], icon: '🤖' },
    { id: 'nachhaltigkeit', label: 'ESG & Nachhaltigkeits-Reporting', description: 'CSRD, TCFD, Klimarisiken in der Versicherung', coverage: 55, status: 'building', courses: ['green-claims'], icon: '🌍' },
    { id: 'betrug', label: 'Betrugsbekämpfung & AML', description: 'Versicherungsbetrug, GwG, interne Kontrollsysteme', coverage: 79, status: 'building', courses: [], icon: '🔍' },
  ],
  'metroplan-zuerich': [
    { id: 'raumplanung', label: 'Raumplanungsrecht', description: 'RPG 2, Richtplanung, Nutzungsplanung, Mehrwertabgabe', coverage: 62, status: 'building', courses: ['rpg2-2026'], icon: '🗺️' },
    { id: 'datenschutz', label: 'Datenschutz öffentliche Stellen', description: 'DSG 2023, IDG Zürich, Geodaten, ÖREB', coverage: 45, status: 'gap', courses: ['dsg-oeffentlich'], icon: '🔏' },
    { id: 'uvp', label: 'Umweltrecht & UVP', description: 'USG, UVPV, NHG, Biodiversität', coverage: 38, status: 'gap', courses: ['uvp-usg'], icon: '🌿' },
    { id: 'beschaffung', label: 'Öffentliches Beschaffungsrecht', description: 'IVöB 2021, Submissionsrecht, Nachhaltigkeit', coverage: 72, status: 'building', courses: ['iveob-beschaffung'], icon: '📋' },
    { id: 'klima', label: 'Klimaanpassung & Stadtklima', description: 'CO2-Gesetz, Hitzeinseleffekt, Naturgefahren', coverage: 55, status: 'building', courses: ['klima-netto-null'], icon: '🌡️' },
  ],
  'precisiontech': [
    { id: 'arbeitssicherheit', label: 'Arbeitssicherheit', description: 'SUVA, ArG, Gefahrstoffe, Schutzkonzepte', coverage: 83, status: 'strong', courses: [], icon: '🦺' },
    { id: 'qualitaet', label: 'Qualitätsmanagement', description: 'ISO 9001, Prozesssicherheit, KVP', coverage: 81, status: 'strong', courses: [], icon: '✅' },
    { id: 'datenschutz', label: 'Datenschutz & IT', description: 'DSGVO, DSG, Produktionsdaten', coverage: 68, status: 'building', courses: ['dsgvo-dsg'], icon: '🔒' },
    { id: 'cyber', label: 'OT/IT-Sicherheit', description: 'ISO 27001, Industrielle Steuerung, SCADA-Sicherheit', coverage: 55, status: 'building', courses: ['iso-27001'], icon: '🛡️' },
    { id: 'nachhaltigkeit', label: 'Umwelt & Nachhaltigkeit', description: 'ISO 14001, Energieeffizienz, CO2-Bilanz', coverage: 42, status: 'gap', courses: [], icon: '🌱' },
  ],
  'swiss-retail-group': [
    { id: 'lebensmittel', label: 'Lebensmittelsicherheit', description: 'LMG, HACCP, Hygiene, Rückverfolgbarkeit', coverage: 71, status: 'building', courses: [], icon: '🥗' },
    { id: 'datenschutz', label: 'Datenschutz', description: 'DSGVO, DSG, Kundendaten, Loyaltyprogramme', coverage: 65, status: 'building', courses: ['dsgvo-dsg'], icon: '🔒' },
    { id: 'arbeitssicherheit', label: 'Arbeitssicherheit Retail', description: 'SUVA, Ladensicherheit, Notfallplan', coverage: 60, status: 'building', courses: [], icon: '🦺' },
    { id: 'cyber', label: 'Cybersicherheit', description: 'ISO 27001, POS-Sicherheit, Phishing', coverage: 45, status: 'gap', courses: ['iso-27001'], icon: '🛡️' },
    { id: 'fuehrung', label: 'Führung & Filialmanagement', description: 'Teamführung, Onboarding, Performance', coverage: 35, status: 'gap', courses: [], icon: '🏪' },
  ],
  'akademie-plus': [
    { id: 'datenschutz', label: 'Datenschutz & Bildungsdaten', description: 'DSGVO, DSG, Schülerdaten, LMS-Datenschutz', coverage: 94, status: 'strong', courses: ['dsgvo-dsg'], icon: '🔒' },
    { id: 'cyber', label: 'Cybersicherheit', description: 'ISO 27001, Phishing, Remote-Learning-Sicherheit', coverage: 88, status: 'strong', courses: ['iso-27001'], icon: '🛡️' },
    { id: 'ki', label: 'KI in der Bildung', description: 'KI-Werkzeuge, EU AI Act, akademische Integrität', coverage: 55, status: 'building', courses: ['ki-agentur'], icon: '🤖' },
    { id: 'nachhaltigkeit', label: 'Nachhaltige Bildungsinstitution', description: 'ESG-Berichterstattung, Green Campus, CSRD', coverage: 30, status: 'gap', courses: [], icon: '🌱' },
  ],
}

// ── ACTIVITY ──────────────────────────────────────────────────

export const MOCK_ACTIVITY_BY_TENANT: Record<string, ActivityItem[]> = {
  'helvetia-finanz': [
    { id: 'act1', type: 'completion', user_name: 'Anna Müller', detail: 'GwG 2025 abgeschlossen · Score: 92%', timestamp: '2025-05-19T08:51:00Z', severity: 'success' },
    { id: 'act2', type: 'enrollment', user_name: 'Lukas Bär', detail: 'ISO 27001 Kurs gestartet', timestamp: '2025-05-19T07:42:00Z', severity: 'info' },
    { id: 'act3', type: 'certificate', user_name: 'Peter Keller', detail: 'Open Badge ausgestellt: DSGVO & DSG', timestamp: '2025-05-18T17:12:00Z', severity: 'success' },
    { id: 'act4', type: 'overdue', user_name: 'Marc Weber', detail: 'Lernziel überfällig: Informationssicherheit', timestamp: '2025-05-18T09:00:00Z', severity: 'warning' },
    { id: 'act5', type: 'completion', user_name: 'Sophie Lang', detail: 'DSGVO/DSG abgeschlossen · Score: 87%', timestamp: '2025-05-17T16:44:00Z', severity: 'success' },
  ],
  'novabio-schweiz': [
    { id: 'act1', type: 'completion', user_name: 'Dr. Mia Steiner', detail: 'GxP Grundlagen abgeschlossen · Score: 88%', timestamp: '2025-05-19T08:45:00Z', severity: 'success' },
    { id: 'act2', type: 'overdue', user_name: 'Klaus Brenner', detail: 'Lernziel überfällig: Arbeitssicherheit', timestamp: '2025-05-18T09:00:00Z', severity: 'warning' },
    { id: 'act3', type: 'certificate', user_name: 'Lisa Koch', detail: 'Open Badge ausgestellt: ISO 27001', timestamp: '2025-05-17T14:00:00Z', severity: 'success' },
  ],
  'akademie-plus': [
    { id: 'act1', type: 'completion', user_name: 'Prof. Laura Brunner', detail: 'Datenschutz abgeschlossen · Score: 96%', timestamp: '2025-05-19T09:10:00Z', severity: 'success' },
    { id: 'act2', type: 'completion', user_name: 'Sarah Wyss', detail: 'ISO 27001 abgeschlossen · Score: 91%', timestamp: '2025-05-19T08:30:00Z', severity: 'success' },
  ],
  'swiss-retail-group': [
    { id: 'act1', type: 'completion', user_name: 'Nicole Zimmermann', detail: 'Lebensmittelhygiene abgeschlossen · 83%', timestamp: '2025-05-19T07:50:00Z', severity: 'success' },
    { id: 'act2', type: 'overdue', user_name: 'Kevin Müller', detail: 'Lernziel überfällig: ISO 27001 Filiale 12', timestamp: '2025-05-18T09:00:00Z', severity: 'warning' },
    { id: 'act3', type: 'enrollment', user_name: 'Julia Sommer', detail: 'Onboarding-Pfad gestartet · Filiale 7', timestamp: '2025-05-18T07:00:00Z', severity: 'info' },
  ],
  'precisiontech': [
    { id: 'act1', type: 'completion', user_name: 'Hans Meier', detail: 'SUVA Arbeitssicherheit abgeschlossen · 88%', timestamp: '2025-05-19T06:45:00Z', severity: 'success' },
    { id: 'act2', type: 'completion', user_name: 'Petra Koch', detail: 'ISO 9001 Awareness abgeschlossen · 81%', timestamp: '2025-05-19T06:30:00Z', severity: 'success' },
    { id: 'act3', type: 'overdue', user_name: 'Rolf Kuster', detail: 'Lernziel überfällig: Gefahrstoffe', timestamp: '2025-05-18T09:00:00Z', severity: 'warning' },
  ],
  'metroplan-zuerich': [
    { id: 'act1', type: 'completion', user_name: 'Eva-Maria Rothenfluh', detail: 'RPG 2 Schulung abgeschlossen · 87%', timestamp: '2025-05-19T08:35:00Z', severity: 'success' },
    { id: 'act2', type: 'overdue', user_name: 'Markus Brunner', detail: 'Lernziel überfällig: UVP-Schulung', timestamp: '2025-05-18T09:00:00Z', severity: 'warning' },
  ],
  'brandwerk-zuerich': [
    { id: 'act1', type: 'completion', user_name: 'Christine Mueller', detail: 'ABM Zertifikat abgeschlossen · 84%', timestamp: '2025-05-20T09:15:00Z', severity: 'success' },
    { id: 'act2', type: 'completion', user_name: 'Tobias Gerber', detail: 'KI-Tools im Agenturalltag · 91%', timestamp: '2025-05-19T16:30:00Z', severity: 'success' },
    { id: 'act3', type: 'enrollment', user_name: 'Laura Bachmann', detail: 'Green Claims Kurs gestartet', timestamp: '2025-05-19T10:00:00Z', severity: 'info' },
  ],
  'kantonsspital-zuerich': [
    { id: 'act1', type: 'completion', user_name: 'Claudia Bauer', detail: 'Hygiene & Infektionsprävention · 94%', timestamp: '2025-05-20T06:30:00Z', severity: 'success' },
    { id: 'act2', type: 'enrollment', user_name: 'Thomas Keller', detail: 'Patientensicherheit Kurs gestartet', timestamp: '2025-05-19T07:00:00Z', severity: 'info' },
    { id: 'act3', type: 'certificate', user_name: 'Dr. Sandra Holzer', detail: 'Open Badge: Datenschutz im Gesundheitswesen', timestamp: '2025-05-19T08:00:00Z', severity: 'success' },
    { id: 'act4', type: 'overdue', user_name: 'Urs Schmid', detail: 'Lernziel überfällig: Notfallmanagement', timestamp: '2025-05-18T09:00:00Z', severity: 'warning' },
  ],
  'zurich-insurance': [
    { id: 'act1', type: 'completion', user_name: 'Rafael Ospina', detail: 'GwG & AML Zertifikat · 91%', timestamp: '2025-05-20T09:00:00Z', severity: 'success' },
    { id: 'act2', type: 'completion', user_name: 'Dr. Patricia Wenger', detail: 'DSGVO & DSG Refresher · 97%', timestamp: '2025-05-19T17:00:00Z', severity: 'success' },
    { id: 'act3', type: 'enrollment', user_name: 'Michael Zürcher', detail: 'KI in der Versicherung gestartet', timestamp: '2025-05-19T09:00:00Z', severity: 'info' },
    { id: 'act4', type: 'overdue', user_name: 'Simone Gross', detail: 'Lernziel überfällig: ESG-Reporting', timestamp: '2025-05-18T09:00:00Z', severity: 'warning' },
  ],
}
