// Zentraler Integrations-Katalog (eine Wahrheit fuer Support-UI, API und App).
// WICHTIG (Ehrlichkeit): implementiert=true NUR fuer Integrationen, die wirklich
// funktionieren. Alles andere kann pro Kunde hoechstens "vorbereitung" sein.
// Eine neue Integration scharf schalten = hier implementiert auf true setzen,
// sobald der Code dahinter wirklich laeuft.

export type IntegrationDef = {
  key: string
  name: string
  kategorie: string
  protokoll: string
  implementiert: boolean
  beschreibung: string
  configFelder?: { key: string; label: string; placeholder?: string }[]
}

export const INTEGRATION_KATEGORIEN = [
  'HR & ERP',
  'Identitaet & Zugriff',
  'Zusammenarbeit',
  'E-Learning-Standards & CRM',
  'KALYX',
]

export const INTEGRATIONS: IntegrationDef[] = [
  // ---- HR & ERP ----
  { key: 'sap_successfactors', name: 'SAP SuccessFactors', kategorie: 'HR & ERP', protokoll: 'SCIM 2.0', implementiert: false, beschreibung: 'Bidirektionale Nutzer- und Schulungsdaten-Synchronisierung.' },
  { key: 'workday', name: 'Workday', kategorie: 'HR & ERP', protokoll: 'SCIM 2.0', implementiert: false, beschreibung: 'HR-Datensync, Provisioning, Abschluesse zurueckspiegeln.' },
  { key: 'personio', name: 'Personio', kategorie: 'HR & ERP', protokoll: 'SCIM 2.0', implementiert: false, beschreibung: 'Mitarbeiterdaten synchronisiert, Onboarding-Trigger.' },
  { key: 'bamboohr', name: 'BambooHR', kategorie: 'HR & ERP', protokoll: 'API', implementiert: false, beschreibung: 'Mitarbeiterprofil-Sync und Abschluss-Rueckspiegelung.' },

  // ---- Identitaet & Zugriff ----
  { key: 'entra_id', name: 'Microsoft Entra ID', kategorie: 'Identitaet & Zugriff', protokoll: 'SAML / SCIM', implementiert: false, beschreibung: 'Azure-AD-SSO, SCIM-Provisioning, MFA.' },
  { key: 'okta', name: 'Okta', kategorie: 'Identitaet & Zugriff', protokoll: 'SAML / SCIM', implementiert: false, beschreibung: 'SSO, Lifecycle-Management, MFA.' },
  { key: 'onelogin', name: 'OneLogin', kategorie: 'Identitaet & Zugriff', protokoll: 'SAML / SCIM', implementiert: false, beschreibung: 'Enterprise-SSO mit SCIM-Support.' },
  { key: 'google_workspace', name: 'Google Workspace', kategorie: 'Identitaet & Zugriff', protokoll: 'OIDC', implementiert: false, beschreibung: 'Google-SSO und Nutzer-Synchronisierung.' },

  // ---- Zusammenarbeit ----
  { key: 'teams_webhook', name: 'Microsoft Teams', kategorie: 'Zusammenarbeit', protokoll: 'Webhook (Workflows)', implementiert: true, beschreibung: 'Benachrichtigungen in einen Teams-Kanal ueber einen Workflow.', configFelder: [{ key: 'webhook_url', label: 'Workflow-URL', placeholder: 'https://prod-...logic.azure.com/workflows/...' }] },
  { key: 'sharepoint', name: 'SharePoint', kategorie: 'Zusammenarbeit', protokoll: 'API', implementiert: false, beschreibung: 'Kursinhalte aus SharePoint importieren.' },
  { key: 'slack_webhook', name: 'Slack', kategorie: 'Zusammenarbeit', protokoll: 'Webhook', implementiert: true, beschreibung: 'Erinnerungen und Abschlussmeldungen in einen Slack-Channel.', configFelder: [{ key: 'webhook_url', label: 'Incoming-Webhook-URL', placeholder: 'https://hooks.slack.com/services/...' }] },
  { key: 'zoom', name: 'Zoom', kategorie: 'Zusammenarbeit', protokoll: 'API', implementiert: false, beschreibung: 'Live-Trainings und Aufzeichnungen synchronisieren.' },

  // ---- E-Learning-Standards & CRM ----
  { key: 'scorm', name: 'SCORM 1.2 / 2004', kategorie: 'E-Learning-Standards & CRM', protokoll: 'Standard', implementiert: false, beschreibung: 'Import und Export von SCORM-Paketen.' },
  { key: 'xapi', name: 'xAPI (Tin Can)', kategorie: 'E-Learning-Standards & CRM', protokoll: 'Standard', implementiert: false, beschreibung: 'Lernverhalten-Tracking via xAPI-Statements.' },
  { key: 'lti', name: 'LTI 1.3', kategorie: 'E-Learning-Standards & CRM', protokoll: 'Standard', implementiert: false, beschreibung: 'Learning Tools Interoperability fuer LMS-Verbund.' },
  { key: 'salesforce', name: 'Salesforce', kategorie: 'E-Learning-Standards & CRM', protokoll: 'API', implementiert: false, beschreibung: 'Schulungsabschluesse in CRM-Profilen.' },

  // ---- KALYX ----
  { key: 'rest_api', name: 'KALYX REST-API', kategorie: 'KALYX', protokoll: 'API', implementiert: false, beschreibung: 'Offene API mit Schluessel pro Mandant fuer eigene Anbindungen.' },
]

export const INTEGRATION_MAP: Record<string, IntegrationDef> =
  INTEGRATIONS.reduce((acc, i) => { acc[i.key] = i; return acc }, {} as Record<string, IntegrationDef>)
