// ============================================================
// KALYX — Inhalts-Disclaimer-Welle
// Pfad: types/disclaimer.ts (NEUE Datei)
// ============================================================
// Diese Datei ergänzt die bestehenden Types aus courses.ts um
// Meta-Daten für Versionierung, Reviewer und Disclaimer-Stufe.
// Die Felder sind als separates Interface gehalten, damit die
// bestehende CourseData-Definition unverändert bleibt und
// die 14 Bestandskurse nicht angefasst werden müssen.
// ============================================================

export type DisclaimerLevel = 'legal_high' | 'legal_standard' | 'educational'

export type ContentStatus = 'draft' | 'review' | 'approved' | 'archived'

export type ContentOrigin =
  | 'kalyx_reference'       // Referenzkatalog von KALYX (die 14 Bestandskurse)
  | 'tenant_generated'      // vom Mandanten via KI-Kursersteller erstellt
  | 'partner_provided'      // von Content-Partnern bereitgestellt

export interface CourseMeta {
  version:                 string         // semver, z.B. "1.0.0"
  content_status:          ContentStatus
  last_review_date:        string         // ISO 8601, z.B. "2026-06-09"
  content_reviewer_name:   string         // z.B. "Maria Müller"
  content_reviewer_role:   string         // z.B. "Compliance Officer, MusterBank AG"
  disclaimer_level:        DisclaimerLevel
  content_origin:          ContentOrigin
  legal_sources?:          string[]       // optional, aggregiert aus Modul-Quellen
}

// ------------------------------------------------------------
// Acknowledgement-Tracking (entspricht der DB-Tabelle)
// ------------------------------------------------------------
export interface DisclaimerAck {
  id:                  string
  user_id:             string
  tenant_id:           string
  course_id:           string
  course_version:      string
  disclaimer_level:    DisclaimerLevel
  acknowledged_at:     string             // ISO 8601
  ip_address?:         string
  user_agent?:         string
}
