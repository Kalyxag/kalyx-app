// ============================================================
// KALYX — TypeScript Types
// Entsprechen exakt dem PostgreSQL Schema (database/schema.sql)
// ============================================================

// ---- ENUMS ----

export type TenantPlan = 'starter' | 'professional' | 'enterprise'

export type UserRole =
  | 'super_admin'
  | 'tenant_admin'
  | 'hr_manager'
  | 'compliance_officer'
  | 'manager'
  | 'learner'

export type CourseStatus = 'draft' | 'review' | 'published' | 'archived'

export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced'

export type ModuleType = 'video' | 'text' | 'quiz' | 'scorm' | 'iframe'

export type EnrollmentStatus =
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'expired'

// ---- CORE MODELS ----

export interface Tenant {
  id: string
  slug: string                    // z.B. "helvetia-finanz"
  name: string                    // "Helvetia Finanz AG"
  display_name: string | null
  plan: TenantPlan
  logo_url: string | null
  primary_color: string
  accent_color: string
  custom_domain: string | null    // "lernen.helvetia-finanz.ch"
  billing_email: string
  address_city: string | null
  address_country: string
  mfa_required: boolean
  sso_enabled: boolean
  is_active: boolean
  trial_ends_at: string | null
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  tenant_id: string
  email: string
  full_name: string
  avatar_url: string | null
  department: string | null
  position: string | null
  employee_id: string | null
  location: string | null
  phone: string | null
  language: string
  role: UserRole
  is_active: boolean
  last_login_at: string | null
  external_id: string | null     // SAP/Workday/Personio ID
  manager_id: string | null
  invited_by: string | null
  onboarded_at: string | null
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  tenant_id: string
  title: string
  description: string | null
  cover_image_url: string | null
  language: string
  duration_minutes: number | null
  difficulty: CourseDifficulty
  is_mandatory: boolean
  validity_days: number | null
  passing_score: number
  max_attempts: number
  ai_generated: boolean
  regulation_tags: string[]
  scorm_version: string | null
  status: CourseStatus
  published_at: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Enrollment {
  id: string
  tenant_id: string
  user_id: string
  course_id: string
  assigned_by: string | null
  assigned_at: string
  due_date: string | null
  status: EnrollmentStatus
  progress_percent: number
  score: number | null
  attempts: number
  started_at: string | null
  completed_at: string | null
  last_activity_at: string | null
  // Joined fields
  user?: Pick<User, 'full_name' | 'email' | 'department'>
  course?: Pick<Course, 'title' | 'regulation_tags' | 'duration_minutes'>
}

export interface Completion {
  id: string
  tenant_id: string
  user_id: string
  user_email: string              // Snapshot zum Zeitpunkt
  user_name: string               // Snapshot
  course_id: string
  course_title: string            // Snapshot
  course_version: number
  score: number | null
  passed: boolean
  attempts: number
  time_spent_seconds: number | null
  regulation_tags: string[]
  completed_at: string
}

export interface Certificate {
  id: string
  tenant_id: string
  completion_id: string
  user_id: string
  course_id: string
  certificate_number: string      // "KALYX-2025-000001"
  issued_at: string
  valid_until: string | null
  pdf_url: string | null
  pdf_hash: string | null
  is_valid: boolean
  revoked_at: string | null
}

export interface AuditLog {
  id: string
  tenant_id: string
  user_id: string | null
  user_email: string | null
  user_role: string | null
  ip_address: string | null
  action: string                  // 'course.completed', 'user.login', etc.
  resource_type: string | null
  resource_id: string | null
  metadata: Record<string, unknown>
  severity: 'debug' | 'info' | 'warn' | 'error' | 'critical'
  created_at: string
}

// ---- AUTH TYPES ----

export interface Session {
  user: User
  tenant: Tenant
  access_token: string
  expires_at: number
}

export interface LoginCredentials {
  email: string
  password: string
  tenant_slug?: string
}

export interface AuthState {
  session: Session | null
  loading: boolean
  error: string | null
}

// ---- DASHBOARD / API RESPONSE TYPES ----

export interface DashboardStats {
  compliance_rate: number         // 0-100
  active_users: number
  total_courses: number
  overdue_enrollments: number
  pending_invitations: number
  certificates_issued: number
  completions_this_month: number
}

export interface ComplianceOverview {
  course_id: string
  course_title: string
  is_mandatory: boolean
  due_date: string | null
  regulation_tags: string[]
  total_assigned: number
  completed: number
  overdue: number
  in_progress: number
  completion_rate: number         // 0-100
}

export interface ActivityItem {
  id: string
  type: 'completion' | 'enrollment' | 'certificate' | 'overdue' | 'invite'
  user_name: string
  course_title?: string
  detail: string
  timestamp: string
  severity: 'success' | 'info' | 'warning' | 'error'
}

// ---- FORM TYPES ----

export interface InviteUserForm {
  email: string
  full_name: string
  department: string
  position: string
  role: UserRole
}

export interface CreateCourseForm {
  title: string
  description: string
  is_mandatory: boolean
  validity_days: number | null
  passing_score: number
  regulation_tags: string[]
  ai_prompt?: string              // Wenn KI-generiert
}

// ---- UI HELPER TYPES ----

export interface NavItem {
  href: string
  label: string
  icon: string
  badge?: number
  badgeVariant?: 'green' | 'red' | 'gold'
}

export type BadgeVariant =
  | 'green'
  | 'gold'
  | 'red'
  | 'blue'
  | 'gray'
  | 'navy'
