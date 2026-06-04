// Ziel-Pfad im Repo: app/api/seed-thomas/route.ts  (NEU)
//
// Legt EINMALIG ein vollstaendiges, realistisches Demo-Konto an:
// Mandant "Aurora Deep Ventures AG" + Admin Thomas Brunner + 5 Teammitglieder
// + 4 Abteilungen + 6 Rollen + 18 massgeschneiderte Kurse (mit Modulen, Fragen,
// Quellen auf aktuellem Stand) + einige abgeschlossene Pruefungen mit Nachweisen.
//
// Aufruf (einmal im Browser oeffnen):
//   /api/seed-thomas?token=GEHEIM
// Der Token muss process.env.SEED_SECRET entsprechen, sonst greift der Fallback
// FALLBACK_SECRET unten. Die Route ist idempotent: sie raeumt ein vorhandenes
// Aurora-Konto vorher auf und legt es frisch an. Nach erfolgreichem Lauf kann die
// Datei wieder geloescht werden.
//
// WICHTIG: Alles sind TESTDATEN. Keine echten Personen, keine echten Mandate.

import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import type { SupabaseClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'

export const runtime = 'nodejs'
export const maxDuration = 60
export const dynamic = 'force-dynamic'

// --- Schutz & Konstanten -----------------------------------------------------
const FALLBACK_SECRET = 'aurora-seed-7Q2x-Kalyx-2026'
const DEMO_PASSWORD = 'AuroraDeep!2026'
const TENANT_SLUG = 'aurora-deep-ventures'

const PROFILE = {
  display_name: 'Aurora Deep Ventures',
  legal_name: 'Aurora Deep Ventures AG',
  sector: 'finance',
  country: 'CH',
  company_size: '11-50',
  website: 'auroradeep.ch',
  uid_handelsregister: 'CHE-329.487.612',
  contact_name: 'Thomas Brunner',
  contact_email: 'thomas.brunner@auroradeep.ch',
  contact_phone: '+41 44 500 12 80',
  languages: ['de', 'en'],
}

// Nur Werte aus der erlaubten FRAMEWORKS-Liste der App verwenden.
const COMPLIANCE = {
  frameworks: ['DSG (CH)', 'EU AI Act', 'FINMA', 'ISO 27001'],
  esignature_required: true,
  recert_interval_default: 'jaehrlich',
  retention_months: 120,
  residency_confirmed: false,
}

const DEPARTMENTS = [
  { key: 'inv', name: 'Investment', description: 'Dealflow, Bewertung und Beteiligungen' },
  { key: 'pp', name: 'Portfolio & Programme', description: 'Betreuung der Startups und Acceleration-Programme' },
  { key: 'ops', name: 'Operations & Compliance', description: 'Betrieb, Finanzen und regulatorische Pflichten' },
  { key: 'legal', name: 'Legal & IP', description: 'Vertraege, geistiges Eigentum und Governance' },
]

const ROLES = [
  { name: 'Managing Partner', deptKey: 'inv', access_level: 'admin' },
  { name: 'Investment Principal', deptKey: 'inv', access_level: 'manager' },
  { name: 'Venture Analyst', deptKey: 'inv', access_level: 'learner' },
  { name: 'Program Manager', deptKey: 'pp', access_level: 'manager' },
  { name: 'Head of Operations & Compliance', deptKey: 'ops', access_level: 'admin' },
  { name: 'Legal & IP Counsel', deptKey: 'legal', access_level: 'manager' },
]

const TEAM = [
  { key: 'thomas', email: 'thomas.brunner@auroradeep.ch', full_name: 'Thomas Brunner', access_level: 'admin', deptKey: 'inv', position: 'Managing Partner' },
  { key: 'lena', email: 'lena.hofmann@auroradeep.ch', full_name: 'Lena Hofmann', access_level: 'manager', deptKey: 'inv', position: 'Investment Principal' },
  { key: 'nina', email: 'nina.schaub@auroradeep.ch', full_name: 'Nina Schaub', access_level: 'learner', deptKey: 'inv', position: 'Venture Analyst' },
  { key: 'marco', email: 'marco.keller@auroradeep.ch', full_name: 'Marco Keller', access_level: 'manager', deptKey: 'pp', position: 'Program Manager' },
  { key: 'sofia', email: 'sofia.marti@auroradeep.ch', full_name: 'Sofia Marti', access_level: 'admin', deptKey: 'ops', position: 'Head of Operations & Compliance' },
  { key: 'david', email: 'david.frei@auroradeep.ch', full_name: 'David Frei', access_level: 'manager', deptKey: 'legal', position: 'Legal & IP Counsel' },
]

// --- Kurs-Typen --------------------------------------------------------------
type Q = { topic: string; q: string; opts: string[]; correct: number; expl: string; diff: 'leicht' | 'mittel' | 'schwer' }
type Mod = { title: string; minutes: number; content: string }
type Crs = {
  key: string
  title: string
  type: 'compliance' | 'vorbereitung' | 'fachkurs' | 'onboarding' | 'sonstige'
  category: string
  level: 'einsteiger' | 'fortgeschritten' | 'experte'
  sector: string | null
  position: string | null
  duration: number
  certPrep: boolean
  extCert: string | null
  description: string
  modules: Mod[]
  questions: Q[]
}

export const COURSES: Crs[] = [
  // ===================== PFLICHTKURSE (4) =====================
  {
    key: 'p1', title: 'Datenschutz im Arbeitsalltag (revDSG)', type: 'compliance',
    category: 'Pflichtschulung', level: 'einsteiger', sector: 'finance', position: 'Alle Mitarbeitenden',
    duration: 45, certPrep: false, extCert: null,
    description: 'Pflichtkurs zum revidierten Schweizer Datenschutzgesetz (revDSG). Was sind Personendaten, welche Pflichten treffen Aurora als Verantwortliche, und wie verhalte ich mich richtig bei Datenbearbeitung und Datenpannen.',
    modules: [
      { title: 'Das revDSG: Grundlagen und Geltungsbereich', minutes: 14, content:
        'Das totalrevidierte Datenschutzgesetz (revDSG) ist seit dem 1. September 2023 in Kraft und loest das alte DSG von 1992 ab. Es schuetzt nur noch Daten natuerlicher Personen; Daten juristischer Personen fallen nicht mehr darunter. Genetische und biometrische Daten gelten neu ausdruecklich als besonders schuetzenswerte Personendaten.\n\nDer Geltungsbereich wirkt extraterritorial: Das Gesetz gilt fuer jede Datenbearbeitung, die sich in der Schweiz auswirkt, auch wenn sie aus dem Ausland angestossen wird. Fuer Aurora bedeutet das: Bewerberdaten, Founderdaten, Investorendaten und Mitarbeiterdaten unterliegen dem revDSG. Das Gesetz ist eng an die EU-DSGVO angelehnt, damit der freie Datenverkehr mit der EU erhalten bleibt.\n\nQuellen: Bundesgesetz ueber den Datenschutz (DSG/revDSG); EDOEB (edoeb.admin.ch); KMU-Portal des Bundes (kmu.admin.ch).' },
      { title: 'Pflichten: Transparenz, Sicherheit und Meldepflicht', minutes: 16, content:
        'Transparenz: Aurora muss betroffene Personen aktiv und verstaendlich informieren, welche Daten zu welchen Zwecken bearbeitet werden. Das geschieht ueblicherweise in einer Datenschutzerklaerung. Die Informationspflichten sind unter dem revDSG erweitert worden.\n\nDatensicherheit: Es sind angemessene technische und organisatorische Massnahmen zu treffen (Zugriffsbeschraenkung, Verschluesselung, Berechtigungskonzepte). Datenschutz durch Technik und durch datenschutzfreundliche Voreinstellungen ist Pflicht.\n\nMeldepflicht: Eine Verletzung der Datensicherheit, die zu einem hohen Risiko fuer die betroffenen Personen fuehrt, muss so rasch als moeglich dem EDOEB gemeldet werden. Betroffene sind zu informieren, wenn es zu ihrem Schutz noetig ist oder der EDOEB es verlangt. Aurora dokumentiert jeden Vorfall intern.\n\nQuellen: revDSG Art. 24 (Meldepflicht); PwC Schweiz, Informationspflichten; EDOEB-Leitfaeden.' },
      { title: 'Sanktionen und richtiges Verhalten', minutes: 13, content:
        'Anders als die DSGVO richtet das revDSG Strafen primaer gegen die verantwortliche natuerliche Person, nicht gegen das Unternehmen. Vorsaetzliche Verstoesse, etwa gegen Informations- oder Auskunftspflichten oder die Sorgfalt bei Auslandbekanntgabe, koennen mit Bussen bis zu 250 000 CHF geahndet werden. Das macht persoenliche Sorgfalt fuer jeden bei Aurora wichtig.\n\nVerhalten im Alltag: Daten nur fuer den vorgesehenen Zweck nutzen, keine Personendaten ueber unsichere Kanaele teilen, Zugriffe auf das Noetige beschraenken, bei Unsicherheit die Operations- und Compliance-Stelle fragen. Auskunftsgesuche betroffener Personen werden ernst genommen und fristgerecht beantwortet. Verdacht auf eine Datenpanne sofort intern melden, damit die Frist gegenueber dem EDOEB gewahrt werden kann.\n\nQuellen: revDSG Art. 60 ff. (Strafbestimmungen); secjur, Datenschutzgesetz Schweiz; EDOEB.' },
    ],
    questions: [
      { topic: 'Geltungsbereich', q: 'Wessen Daten schuetzt das revDSG seit dem 1. September 2023?', opts: ['Nur Daten juristischer Personen', 'Nur Daten natuerlicher Personen', 'Daten natuerlicher und juristischer Personen', 'Nur Daten von Schweizer Buergern'], correct: 1, expl: 'Das revDSG schuetzt ausschliesslich Daten natuerlicher Personen. Daten juristischer Personen fallen nicht mehr darunter.', diff: 'leicht' },
      { topic: 'Besondere Daten', q: 'Welche Datenkategorie wurde neu ausdruecklich zu den besonders schuetzenswerten Daten hinzugefuegt?', opts: ['Adressdaten', 'Genetische und biometrische Daten', 'Telefonnummern', 'Berufsbezeichnungen'], correct: 1, expl: 'Genetische und biometrische Daten zur eindeutigen Identifizierung gelten neu als besonders schuetzenswert.', diff: 'mittel' },
      { topic: 'Meldepflicht', q: 'An wen meldet Aurora eine Verletzung der Datensicherheit mit hohem Risiko?', opts: ['An die Kantonspolizei', 'An das Handelsregisteramt', 'An den EDOEB', 'An die FINMA'], correct: 2, expl: 'Datensicherheitsverletzungen mit hohem Risiko sind so rasch als moeglich dem Eidgenoessischen Datenschutz- und Oeffentlichkeitsbeauftragten (EDOEB) zu melden (Art. 24 revDSG).', diff: 'mittel' },
      { topic: 'Sanktionen', q: 'Gegen wen richten sich die Bussen des revDSG in erster Linie?', opts: ['Gegen das Unternehmen als Ganzes', 'Gegen die verantwortliche natuerliche Person', 'Gegen den EDOEB', 'Gegen die Aktionaere'], correct: 1, expl: 'Im Unterschied zur DSGVO sieht das revDSG Bussen bis 250 000 CHF primaer gegen die verantwortliche natuerliche Person vor.', diff: 'schwer' },
      { topic: 'Verhalten', q: 'Was ist bei einem Auskunftsgesuch einer betroffenen Person richtig?', opts: ['Ignorieren, da freiwillig', 'Ernst nehmen und fristgerecht beantworten', 'Nur muendlich beantworten', 'An den EDOEB weiterleiten'], correct: 1, expl: 'Betroffene haben ein Auskunftsrecht. Gesuche sind ernst zu nehmen und fristgerecht zu beantworten.', diff: 'leicht' },
    ],
  },
  {
    key: 'p2', title: 'Informationssicherheit und Cyber-Awareness', type: 'compliance',
    category: 'Pflichtschulung', level: 'einsteiger', sector: 'finance', position: 'Alle Mitarbeitenden',
    duration: 40, certPrep: false, extCert: null,
    description: 'Pflichtkurs zu sicherem Verhalten im digitalen Arbeitsalltag: Phishing und Social Engineering erkennen, Passwoerter und MFA, Umgang mit vertraulichen Founder- und Dealdaten sowie die aktuelle Schweizer Meldepflicht.',
    modules: [
      { title: 'Bedrohungen verstehen: Phishing und Social Engineering', minutes: 13, content:
        'Die haeufigste Einfallstuer ist nicht die Technik, sondern der Mensch. Phishing-Mails imitieren bekannte Absender und draengen zu schnellem Handeln (Rechnung, Passwort-Reset, dringende Zahlung). Social Engineering nutzt Vertrauen, Autoritaet und Zeitdruck aus, etwa der angebliche CEO, der eine sofortige Ueberweisung verlangt (CEO-Fraud).\n\nFuer Aurora ist das besonders heikel: Dealflow-Informationen, Term Sheets und Founderdaten sind wertvoll und vertraulich. Warnzeichen sind unerwartete Anhaenge, abweichende Absenderadressen, ungewoehnliche Zahlungsaufforderungen und Links, die nicht zur echten Domain passen. Im Zweifel ueber einen zweiten, bekannten Kanal rueckfragen.\n\nQuellen: Bundesamt fuer Cybersicherheit (BACS, ehemals NCSC), ncsc.admin.ch; Cyber-Safe Label fuer KMU.' },
      { title: 'Schutzmassnahmen: Passwoerter, MFA und Datenhygiene', minutes: 14, content:
        'Starke, einzigartige Passwoerter pro Dienst, verwaltet ueber einen Passwortmanager. Mehr-Faktor-Authentisierung (MFA) ueberall aktivieren, wo verfuegbar; sie ist der wirksamste Einzelschutz gegen uebernommene Konten. Geraete gesperrt halten, Software aktuell halten, keine Firmendaten auf privaten Geraeten ohne Freigabe.\n\nDatenhygiene: Vertrauliche Dokumente nur in den freigegebenen Systemen ablegen, Zugriffe nach dem Prinzip der minimalen Rechte vergeben, Clean-Desk-Prinzip. Vor dem Teilen von Dateien pruefen, wer Zugriff erhaelt. Beim Verlassen des Unternehmens werden Zugriffe entzogen.\n\nQuellen: BACS-Empfehlungen fuer Unternehmen; ITSec4KMU.' },
      { title: 'Vorfall erkennen und melden', minutes: 13, content:
        'Seit dem 1. April 2025 gilt in der Schweiz eine Meldepflicht fuer Cyberangriffe auf Betreiber kritischer Infrastrukturen: Vorfaelle sind innert 24 Stunden nach Entdeckung dem Bundesamt fuer Cybersicherheit (BACS) zu melden. Seit dem 1. Oktober 2025 koennen Unterlassungen mit Bussen bis 100 000 CHF sanktioniert werden. Aurora ist als kleiner Finanz- und Beteiligungsakteur nicht zwingend Betreiber kritischer Infrastruktur, orientiert sich aber bewusst an diesem Standard.\n\nIntern gilt: Jeder Verdacht auf einen Sicherheitsvorfall (geklickter Phishing-Link, verlorenes Geraet, ungewoehnliche Kontobewegung) wird sofort an die Operations- und Compliance-Stelle gemeldet. Schnelligkeit begrenzt den Schaden. Nichts verheimlichen, lieber einmal zu viel melden.\n\nQuellen: BACS, Meldepflicht (ncsc.admin.ch); Informationssicherheitsgesetz ISG und Cybersicherheitsverordnung CSV.' },
    ],
    questions: [
      { topic: 'Phishing', q: 'Was ist ein typisches Warnzeichen fuer eine Phishing-Mail?', opts: ['Eine erwartete Mail eines Kollegen', 'Dringender Zeitdruck und ein Link zu einer abweichenden Domain', 'Eine Mail ohne Anhang', 'Eine intern signierte Mail'], correct: 1, expl: 'Zeitdruck, unerwartete Zahlungsaufforderungen und Links auf abweichende Domains sind klassische Phishing-Merkmale.', diff: 'leicht' },
      { topic: 'CEO-Fraud', q: 'Der angebliche Managing Partner verlangt per Mail eine sofortige Ueberweisung. Was ist richtig?', opts: ['Sofort ueberweisen', 'Ueber einen zweiten, bekannten Kanal rueckfragen', 'Die Mail loeschen und nichts sagen', 'An alle Kollegen weiterleiten'], correct: 1, expl: 'Bei ungewoehnlichen Zahlungsaufforderungen immer ueber einen zweiten, verifizierten Kanal rueckfragen. Das ist der Schutz gegen CEO-Fraud.', diff: 'mittel' },
      { topic: 'MFA', q: 'Warum ist Mehr-Faktor-Authentisierung so wichtig?', opts: ['Sie ersetzt das Passwort vollstaendig', 'Sie ist der wirksamste Einzelschutz gegen uebernommene Konten', 'Sie macht Passwoerter ueberfluessig', 'Sie ist gesetzlich verboten'], correct: 1, expl: 'MFA schuetzt ein Konto selbst dann, wenn das Passwort kompromittiert wurde, und ist damit der wirksamste Einzelschutz.', diff: 'mittel' },
      { topic: 'Meldepflicht', q: 'Innert welcher Frist sind Cyberangriffe auf kritische Infrastrukturen dem BACS zu melden?', opts: ['Innert 7 Tagen', 'Innert 72 Stunden', 'Innert 24 Stunden', 'Es gibt keine Frist'], correct: 2, expl: 'Seit dem 1. April 2025 gilt eine Meldepflicht innert 24 Stunden nach Entdeckung an das BACS.', diff: 'schwer' },
      { topic: 'Vorfall', q: 'Du hast versehentlich auf einen verdaechtigen Link geklickt. Was tust du?', opts: ['Nichts, es wird schon nichts passieren', 'Sofort der Operations- und Compliance-Stelle melden', 'Den Computer neu starten und schweigen', 'Erst am naechsten Tag melden'], correct: 1, expl: 'Sofortige interne Meldung begrenzt den Schaden. Verheimlichen verschlimmert die Lage.', diff: 'leicht' },
    ],
  },
  {
    key: 'p3', title: 'Verhaltenskodex und Integritaet', type: 'compliance',
    category: 'Pflichtschulung', level: 'einsteiger', sector: 'finance', position: 'Alle Mitarbeitenden',
    duration: 35, certPrep: false, extCert: null,
    description: 'Pflichtkurs zu den Werten von Aurora: Integritaet, Transparenz und fairer Umgang. Was der Verhaltenskodex von jedem erwartet, wie wir mit Geschenken, Interessenkonflikten und Fehlverhalten umgehen.',
    modules: [
      { title: 'Werte und Verhaltenskodex von Aurora', minutes: 12, content:
        'Aurora arbeitet an der Schnittstelle von Forschung, Kapital und jungen Unternehmen. Vertrauen ist hier das wichtigste Gut. Der Verhaltenskodex haelt fest, woran wir uns halten: Ehrlichkeit gegenueber Foundern und Investoren, faire und respektvolle Zusammenarbeit, Vertraulichkeit, und Transparenz ueber das, was wir koennen und was nicht.\n\nWir versprechen nichts, was wir nicht halten koennen, und wir kommunizieren offen ueber Risiken. Diese Haltung gilt nach innen wie nach aussen. Der Kodex ist kein Papier fuer die Schublade, sondern Massstab fuer taegliche Entscheidungen.' },
      { title: 'Geschenke, Vorteile und Interessenkonflikte', minutes: 12, content:
        'Im Venture-Umfeld treffen viele Interessen aufeinander. Kleine, sozial uebliche Aufmerksamkeiten sind zulaessig; Geschenke oder Einladungen, die eine Entscheidung beeinflussen koennten, sind es nicht. Im Zweifel gilt Transparenz: offenlegen und im Team besprechen.\n\nEin Interessenkonflikt entsteht, wenn private Interessen mit den Interessen von Aurora oder eines Portfoliounternehmens kollidieren, etwa eine eigene Beteiligung, eine Verwandtschaft oder ein Verwaltungsratsmandat. Solche Konflikte sind nicht per se verboten, muessen aber offengelegt und sauber gehandhabt werden. Wer betroffen ist, haelt sich aus der betreffenden Entscheidung heraus.' },
      { title: 'Fehlverhalten ansprechen und melden', minutes: 11, content:
        'Eine offene Kultur lebt davon, dass Probleme angesprochen werden duerfen. Wer Fehlverhalten beobachtet, soll es ansprechen koennen, ohne Nachteile zu befuerchten. Meldungen koennen an die direkte Fuehrung oder an die Operations- und Compliance-Stelle gehen.\n\nWir behandeln Hinweise vertraulich und gehen ihnen nach. Vergeltung gegen Personen, die in gutem Glauben einen Hinweis geben, wird nicht geduldet. Integritaet bedeutet auch, eigene Fehler einzugestehen und daraus zu lernen.' },
    ],
    questions: [
      { topic: 'Werte', q: 'Was ist laut Verhaltenskodex der zentrale Wert im Umgang mit Foundern und Investoren?', opts: ['Maximaler Gewinn', 'Vertrauen durch Ehrlichkeit und Transparenz', 'Geschwindigkeit um jeden Preis', 'Vertraulichkeit gegenueber niemandem'], correct: 1, expl: 'Vertrauen, getragen von Ehrlichkeit und Transparenz, ist der zentrale Wert.', diff: 'leicht' },
      { topic: 'Geschenke', q: 'Wie geht Aurora mit einem wertvollen Geschenk um, das eine Entscheidung beeinflussen koennte?', opts: ['Annehmen, solange es niemand sieht', 'Es ist nicht zulaessig und sollte abgelehnt oder offengelegt werden', 'Annehmen und privat behalten', 'Weiterverschenken'], correct: 1, expl: 'Geschenke, die eine Entscheidung beeinflussen koennten, sind nicht zulaessig. Transparenz und Ablehnung sind richtig.', diff: 'mittel' },
      { topic: 'Interessenkonflikt', q: 'Du hast eine private Beteiligung an einem Startup, ueber dessen Finanzierung Aurora entscheidet. Was tust du?', opts: ['Nichts sagen und mitentscheiden', 'Den Konflikt offenlegen und dich aus der Entscheidung heraushalten', 'Die Beteiligung schnell verkaufen', 'Die Entscheidung alleine treffen'], correct: 1, expl: 'Interessenkonflikte sind offenzulegen, und die betroffene Person haelt sich aus der Entscheidung heraus.', diff: 'mittel' },
      { topic: 'Meldung', q: 'Was gilt fuer Personen, die in gutem Glauben Fehlverhalten melden?', opts: ['Sie muessen mit Nachteilen rechnen', 'Vergeltung gegen sie wird nicht geduldet', 'Ihre Meldung wird oeffentlich gemacht', 'Sie verlieren ihren Job'], correct: 1, expl: 'Hinweise in gutem Glauben werden vertraulich behandelt; Vergeltung wird nicht geduldet.', diff: 'leicht' },
      { topic: 'Integritaet', q: 'Was bedeutet Integritaet im Sinne des Kodex auch?', opts: ['Fehler vertuschen', 'Eigene Fehler eingestehen und daraus lernen', 'Nie etwas zugeben', 'Verantwortung abschieben'], correct: 1, expl: 'Zur Integritaet gehoert, eigene Fehler einzugestehen und daraus zu lernen.', diff: 'leicht' },
    ],
  },
  {
    key: 'p4', title: 'KI-Kompetenz und verantwortungsvoller KI-Einsatz (EU AI Act)', type: 'compliance',
    category: 'Pflichtschulung', level: 'einsteiger', sector: 'finance', position: 'Alle Mitarbeitenden',
    duration: 45, certPrep: false, extCert: null,
    description: 'Pflichtkurs zur KI-Kompetenzpflicht nach Artikel 4 EU AI Act. Was die Verordnung verlangt, welche Praktiken verboten sind, und wie wir KI-Werkzeuge bei Aurora verantwortungsvoll und transparent nutzen.',
    modules: [
      { title: 'Der EU AI Act und die KI-Kompetenzpflicht', minutes: 15, content:
        'Der EU AI Act (Verordnung (EU) 2024/1689) ist die erste umfassende KI-Regulierung und seit dem 1. August 2024 in Kraft. Er teilt KI-Systeme in Risikoklassen ein: verbotene Praktiken, Hochrisiko, begrenztes Risiko und minimales Risiko. Seit dem 2. Februar 2025 gelten zwei Pflichten ohne Uebergangsfrist: das Verbot bestimmter Praktiken (Art. 5) und die KI-Kompetenzpflicht (Art. 4).\n\nArtikel 4 verlangt, dass Anbieter und Betreiber sicherstellen, dass ihr Personal, das mit KI-Systemen arbeitet, ueber ausreichende KI-Kompetenz verfuegt. Inhalte und Format sind nicht vorgeschrieben, aber die Massnahmen muessen tatsaechlich umgesetzt und dokumentiert sein. Die Verordnung wirkt extraterritorial: Auch Akteure ausserhalb der EU sind betroffen, wenn ihre Systeme in der EU eingesetzt werden oder Personen in der EU betreffen. Fuer Aurora mit EU-Foundern und EU-Investoren ist das relevant.\n\nQuellen: Verordnung (EU) 2024/1689; EU-Kommission FAQ; TUEV-Consulting, EU AI Act Zwischenstand 2026.' },
      { title: 'Verbotene Praktiken und Risikoklassen', minutes: 15, content:
        'Verboten sind unter anderem manipulative oder taeuschende Techniken, das Ausnutzen von Schwaechen schutzbeduerftiger Gruppen, Social Scoring und bestimmte Formen biometrischer Massenueberwachung. Diese Verbote gelten bereits seit Februar 2025.\n\nHochrisiko-Systeme (Anhang III, etwa im Personalbereich oder bei Kreditwuerdigkeit) unterliegen strengen Governance- und Transparenzpflichten. Die Vollanwendung beginnt am 2. August 2026; ein Teil der Hochrisiko-Pflichten nach Anhang III wurde durch den sogenannten Digital Omnibus voraussichtlich auf Dezember 2027 verschoben. Pflichten fuer Anbieter allgemeiner KI-Modelle (GPAI) gelten seit August 2025. Wer KI nur einsetzt, ist Betreiber und ebenfalls in der Pflicht, etwa bei Transparenz nach Art. 50.\n\nQuellen: EU AI Act Art. 5, Art. 50, Anhang III; secjur, EU AI Act; Digital Omnibus on AI.' },
      { title: 'KI verantwortungsvoll nutzen bei Aurora', minutes: 15, content:
        'Praktische Regeln: KI-Ausgaben sind Entwuerfe, keine Wahrheiten. Ergebnisse werden vor Verwendung geprueft (Mensch in der Verantwortung). Keine vertraulichen Founder-, Deal- oder Personendaten in oeffentliche KI-Werkzeuge eingeben, ausser ein Dienst ist dafuer freigegeben. KI-Einsatz dort transparent machen, wo er Entscheidungen oder Aussenkommunikation beeinflusst.\n\nFuer die Dokumentation der KI-Kompetenz nach Art. 4 reicht es nicht, ein Tool zu nutzen; das Verstaendnis von Faehigkeiten und Grenzen muss vorhanden und nachweisbar sein. Dieser Kurs ist Teil dieses Nachweises. Bei Unsicherheit, ob ein Anwendungsfall in eine hoehere Risikoklasse faellt, vor dem Einsatz Ruecksprache mit der Operations- und Compliance-Stelle halten.\n\nQuellen: EU AI Act Art. 4 und Art. 50; ISO/IEC 42001; EU-Kommission FAQ.' },
    ],
    questions: [
      { topic: 'Kompetenzpflicht', q: 'Was verlangt Artikel 4 des EU AI Act?', opts: ['Ein Verbot jeder KI-Nutzung', 'Ausreichende KI-Kompetenz des Personals, das mit KI arbeitet', 'Eine Steuer auf KI-Systeme', 'Die Registrierung jedes Prompts'], correct: 1, expl: 'Art. 4 verlangt, dass Mitarbeitende mit ausreichender KI-Kompetenz arbeiten; die Massnahmen sind zu dokumentieren.', diff: 'mittel' },
      { topic: 'Fristen', q: 'Seit wann gelten die KI-Kompetenzpflicht und die verbotenen Praktiken?', opts: ['Seit dem 2. August 2026', 'Seit dem 2. Februar 2025', 'Seit dem 1. Januar 2024', 'Seit Dezember 2027'], correct: 1, expl: 'Art. 4 (Kompetenz) und Art. 5 (verbotene Praktiken) gelten seit dem 2. Februar 2025, ohne Uebergangsfrist.', diff: 'mittel' },
      { topic: 'Verbote', q: 'Welche Praktik ist nach dem EU AI Act verboten?', opts: ['Eine Rechtschreibhilfe nutzen', 'Social Scoring von Personen', 'Einen Chatbot fuer FAQ verwenden', 'Texte zusammenfassen'], correct: 1, expl: 'Social Scoring gehoert zu den verbotenen Praktiken nach Art. 5.', diff: 'mittel' },
      { topic: 'Geltung', q: 'Warum betrifft der EU AI Act auch Aurora in der Schweiz?', opts: ['Weil die Schweiz EU-Mitglied ist', 'Weil die Verordnung extraterritorial wirkt, sobald EU-Personen oder der EU-Markt betroffen sind', 'Weil das revDSG es vorschreibt', 'Gar nicht, er gilt nur in der EU'], correct: 1, expl: 'Der AI Act wirkt extraterritorial: Wer Systeme in der EU einsetzt oder Personen in der EU betrifft, faellt in den Geltungsbereich.', diff: 'schwer' },
      { topic: 'Praxis', q: 'Wie geht Aurora mit vertraulichen Dealdaten in oeffentlichen KI-Tools um?', opts: ['Frei eingeben, spart Zeit', 'Nicht eingeben, ausser der Dienst ist ausdruecklich dafuer freigegeben', 'Nur nachts eingeben', 'Immer eingeben, aber anonymisiert raten'], correct: 1, expl: 'Vertrauliche Founder-, Deal- oder Personendaten gehoeren nicht in nicht freigegebene oeffentliche KI-Werkzeuge.', diff: 'leicht' },
    ],
  },

  // ===================== VORBEREITUNGSKURSE (6) =====================
  {
    key: 'v1', title: 'Onboarding bei Aurora Deep Ventures', type: 'onboarding',
    category: 'Onboarding', level: 'einsteiger', sector: 'finance', position: 'Neue Mitarbeitende',
    duration: 30, certPrep: false, extCert: null,
    description: 'Willkommen bei Aurora. Dieser Kurs fuehrt neue Teammitglieder durch Mission, Werte, Organisation und die wichtigsten Spielregeln. Uebungsmaterial zur Einarbeitung, keine offizielle Pruefung.',
    modules: [
      { title: 'Mission und Werte', minutes: 10, content:
        'Aurora Deep Ventures ist ein Venture-Studio und Fruehphasen-Investor mit Fokus auf Deep-Tech und Space. Wir helfen forschungsnahen Teams, aus einer Idee ein tragfaehiges Unternehmen zu machen, mit Kapital, Programm und Netzwerk. Unsere Werte: Integritaet, Transparenz, Sorgfalt und Respekt. Wir sind ehrlich ueber Chancen und Risiken und behandeln vertrauliche Informationen entsprechend.' },
      { title: 'Organisation und Ansprechpartner', minutes: 10, content:
        'Aurora gliedert sich in vier Bereiche: Investment (Dealflow und Beteiligungen), Portfolio und Programme (Betreuung der Startups), Operations und Compliance (Betrieb, Finanzen, Regulatorik) und Legal und IP (Vertraege, Governance, geistiges Eigentum). Fragen zu Datenschutz, Sicherheit und Compliance gehen an die Operations- und Compliance-Stelle. Fragen zu Vertraegen und IP an Legal und IP.' },
      { title: 'Erste Schritte und Pflichtschulungen', minutes: 10, content:
        'In den ersten Wochen absolvierst du die Vorbereitungskurse zu Datenschutz, Informationssicherheit und Compliance und anschliessend die vier Pflichtschulungen. Richte deine Konten mit starken Passwoertern und MFA ein, lies den Verhaltenskodex und melde dich bei Unklarheiten. Vorbereitungskurse sind Uebung und Einarbeitung; die Pflichtschulungen schliessen mit einer Lernpruefung ab und erzeugen einen Nachweis.' },
    ],
    questions: [
      { topic: 'Mission', q: 'Worauf fokussiert sich Aurora Deep Ventures?', opts: ['Immobilienhandel', 'Deep-Tech und Space in der Fruehphase', 'Detailhandel', 'Reisevermittlung'], correct: 1, expl: 'Aurora ist ein Venture-Studio und Fruehphasen-Investor mit Fokus auf Deep-Tech und Space.', diff: 'leicht' },
      { topic: 'Werte', q: 'Welche Werte stehen bei Aurora im Zentrum?', opts: ['Geheimhaltung um jeden Preis', 'Integritaet, Transparenz, Sorgfalt und Respekt', 'Wachstum ohne Ruecksicht', 'Konkurrenz im Team'], correct: 1, expl: 'Integritaet, Transparenz, Sorgfalt und Respekt sind die Leitwerte.', diff: 'leicht' },
      { topic: 'Organisation', q: 'An wen richtest du Fragen zu Datenschutz und Compliance?', opts: ['An niemanden', 'An die Operations- und Compliance-Stelle', 'An die Foundercommunity', 'An externe Investoren'], correct: 1, expl: 'Operations und Compliance ist die Anlaufstelle fuer Datenschutz, Sicherheit und Regulatorik.', diff: 'leicht' },
      { topic: 'Einstieg', q: 'Was gilt fuer Vorbereitungskurse?', opts: ['Sie sind die offizielle Pruefung', 'Sie sind Uebung und Einarbeitung', 'Sie ersetzen den Arbeitsvertrag', 'Sie sind freiwillig und ohne Bezug'], correct: 1, expl: 'Vorbereitungskurse dienen der Uebung und Einarbeitung, sie sind keine offizielle Pruefung.', diff: 'leicht' },
      { topic: 'Sicherheit', q: 'Was richtest du beim Start ein?', opts: ['Ein einfaches Passwort fuer alles', 'Starke Passwoerter und MFA', 'Gar keine Konten', 'Nur ein privates Mailkonto'], correct: 1, expl: 'Starke, einzigartige Passwoerter und MFA sind Pflicht beim Start.', diff: 'leicht' },
    ],
  },
  {
    key: 'v2', title: 'Grundlagen Datenschutz und Vertraulichkeit', type: 'vorbereitung',
    category: 'Grundlagen', level: 'einsteiger', sector: 'finance', position: 'Alle Mitarbeitenden',
    duration: 25, certPrep: false, extCert: null,
    description: 'Vorbereitung auf die Pflichtschulung Datenschutz. Grundbegriffe, was Personendaten sind und wie wir vertraulich mit Founder- und Investorendaten umgehen. Uebungsmaterial, keine offizielle Pruefung.',
    modules: [
      { title: 'Was sind Personendaten', minutes: 9, content:
        'Personendaten sind alle Angaben, die sich auf eine bestimmte oder bestimmbare natuerliche Person beziehen: Name, Mailadresse, Telefonnummer, aber auch Bewertungen oder Notizen zu einer Person. Besonders schuetzenswert sind unter anderem Gesundheitsdaten, religioese oder politische Ansichten sowie genetische und biometrische Daten. Bei Aurora fallen vor allem Bewerber-, Founder- und Investorendaten an.' },
      { title: 'Vertraulichkeit im Dealflow', minutes: 8, content:
        'Founder teilen oft sensible Informationen, lange bevor ein Deal zustande kommt: Technologie, Zahlen, Strategie. Diese Informationen sind vertraulich zu behandeln, auch intern nach dem Prinzip Kenntnis nur bei Bedarf. Vertraulichkeitsvereinbarungen werden eingehalten. Nicht oeffentlich ueber laufende Gespraeche reden, keine Unterlagen offen liegen lassen.' },
      { title: 'Gute Datenhygiene', minutes: 8, content:
        'Daten nur fuer den vorgesehenen Zweck verwenden, nur so lange aufbewahren wie noetig, Zugriffe beschraenken. Dokumente in den freigegebenen Systemen ablegen. Bevor du etwas teilst, ueberlege, wer Zugriff erhaelt. Diese Grundlagen bereiten auf die Pflichtschulung revDSG vor, ersetzen sie aber nicht.' },
    ],
    questions: [
      { topic: 'Begriffe', q: 'Was sind Personendaten?', opts: ['Nur amtliche Dokumente', 'Alle Angaben zu einer bestimmten oder bestimmbaren natuerlichen Person', 'Nur Gesundheitsdaten', 'Nur Daten von Mitarbeitenden'], correct: 1, expl: 'Personendaten sind alle Angaben, die sich auf eine bestimmte oder bestimmbare natuerliche Person beziehen.', diff: 'leicht' },
      { topic: 'Besondere Daten', q: 'Welche Daten gelten als besonders schuetzenswert?', opts: ['Bueroadressen', 'Gesundheitsdaten und biometrische Daten', 'Firmennamen', 'Oeffentliche Webseiten'], correct: 1, expl: 'Gesundheits-, genetische und biometrische Daten zaehlen zu den besonders schuetzenswerten Daten.', diff: 'mittel' },
      { topic: 'Vertraulichkeit', q: 'Wie behandelst du sensible Founderinformationen?', opts: ['Frei im Team teilen', 'Vertraulich, nur bei Bedarf zugaenglich', 'Oeffentlich besprechen', 'An andere Investoren weitergeben'], correct: 1, expl: 'Founderinformationen sind vertraulich und nach dem Prinzip Kenntnis nur bei Bedarf zu behandeln.', diff: 'mittel' },
      { topic: 'Zweck', q: 'Wofuer duerfen erhobene Daten verwendet werden?', opts: ['Fuer beliebige Zwecke', 'Nur fuer den vorgesehenen Zweck', 'Fuer Werbung an Dritte', 'Fuer den Weiterverkauf'], correct: 1, expl: 'Daten duerfen nur fuer den vorgesehenen Zweck verwendet werden.', diff: 'leicht' },
      { topic: 'Einordnung', q: 'Was ist dieser Kurs im Verhaeltnis zur Pflichtschulung?', opts: ['Die offizielle Pruefung', 'Eine Vorbereitung, die die Pflichtschulung nicht ersetzt', 'Ein Ersatz fuer das revDSG', 'Ohne Bezug zum Datenschutz'], correct: 1, expl: 'Es ist Vorbereitungsmaterial und ersetzt die Pflichtschulung nicht.', diff: 'leicht' },
    ],
  },
  {
    key: 'v3', title: 'Grundlagen Informationssicherheit', type: 'vorbereitung',
    category: 'Grundlagen', level: 'einsteiger', sector: 'finance', position: 'Alle Mitarbeitenden',
    duration: 25, certPrep: false, extCert: null,
    description: 'Vorbereitung auf die Pflichtschulung Informationssicherheit. Passwoerter, MFA, Phishing-Erkennung und Clean-Desk als Grundlage. Uebungsmaterial, keine offizielle Pruefung.',
    modules: [
      { title: 'Passwoerter und MFA', minutes: 9, content:
        'Verwende fuer jeden Dienst ein eigenes, starkes Passwort, am besten ueber einen Passwortmanager. Aktiviere Mehr-Faktor-Authentisierung, wo immer es geht. Teile niemals Passwoerter, auch nicht mit Kollegen. Ein uebernommenes Konto ist eine der haeufigsten Schadensursachen.' },
      { title: 'Phishing erkennen', minutes: 8, content:
        'Pruefe Absenderadresse, Anrede, Sprache und Links. Faehrt der Mauszeiger ueber einen Link, zeigt sich das echte Ziel. Unerwartete Anhaenge nicht oeffnen. Bei Zahlungsaufforderungen oder Passwort-Resets, die du nicht erwartet hast, ueber einen zweiten Kanal rueckfragen.' },
      { title: 'Clean Desk und Geraete', minutes: 8, content:
        'Bildschirm beim Verlassen sperren, vertrauliche Unterlagen wegschliessen, keine Notizen mit Zugangsdaten. Firmendaten nur auf freigegebenen Geraeten und in freigegebenen Systemen. Verlust eines Geraets sofort melden. Diese Grundlagen bereiten auf die Pflichtschulung vor.' },
    ],
    questions: [
      { topic: 'Passwoerter', q: 'Wie sollten Passwoerter aussehen?', opts: ['Ein Passwort fuer alle Dienste', 'Pro Dienst ein eigenes, starkes Passwort', 'Kurz und einfach', 'Auf einem Zettel am Bildschirm'], correct: 1, expl: 'Pro Dienst ein eigenes, starkes Passwort, idealerweise im Passwortmanager.', diff: 'leicht' },
      { topic: 'MFA', q: 'Wann aktivierst du MFA?', opts: ['Nie', 'Wo immer es verfuegbar ist', 'Nur fuer private Konten', 'Nur einmal im Jahr'], correct: 1, expl: 'MFA ueberall aktivieren, wo es verfuegbar ist.', diff: 'leicht' },
      { topic: 'Phishing', q: 'Wie pruefst du das echte Ziel eines Links?', opts: ['Gar nicht', 'Mauszeiger ueber den Link halten und das Ziel pruefen', 'Sofort klicken', 'Den Absender anrufen lassen'], correct: 1, expl: 'Mit dem Mauszeiger ueber den Link fahren, ohne zu klicken, zeigt das echte Ziel.', diff: 'mittel' },
      { topic: 'Clean Desk', q: 'Was tust du, wenn du den Arbeitsplatz verlaesst?', opts: ['Bildschirm offen lassen', 'Bildschirm sperren und Unterlagen wegschliessen', 'Passwort notieren', 'Geraet ausschalten und Daten loeschen'], correct: 1, expl: 'Bildschirm sperren und vertrauliche Unterlagen wegschliessen.', diff: 'leicht' },
      { topic: 'Geraete', q: 'Was tust du bei Verlust eines Firmengeraets?', opts: ['Abwarten', 'Sofort melden', 'Selbst nichts unternehmen', 'Erst nach einer Woche melden'], correct: 1, expl: 'Geraeteverlust sofort melden, damit Zugriffe gesperrt werden koennen.', diff: 'leicht' },
    ],
  },
  {
    key: 'v4', title: 'Grundlagen Geistiges Eigentum', type: 'vorbereitung',
    category: 'Grundlagen', level: 'einsteiger', sector: 'finance', position: 'Investment & Programme',
    duration: 30, certPrep: false, extCert: null,
    description: 'Vorbereitung auf den Fachkurs IP-Strategie. Die vier Schutzrechte, das Eidgenoessische Institut fuer Geistiges Eigentum (IGE) und warum Geheimhaltung vor der Anmeldung entscheidend ist. Uebungsmaterial.',
    modules: [
      { title: 'Die vier Schutzrechte', minutes: 11, content:
        'In der Schweiz gibt es vier zentrale Schutzrechte. Patente schuetzen technische Erfindungen. Marken schuetzen Kennzeichen wie Produktnamen. Designs schuetzen die aeussere Gestaltung. Das Urheberrecht schuetzt Werke und Software automatisch ab Entstehung, ohne Anmeldung. Patente, Marken und Designs meldet man beim Eidgenoessischen Institut fuer Geistiges Eigentum (IGE) an.' },
      { title: 'Neuheit und Geheimhaltung', minutes: 10, content:
        'Eine Erfindung kann nur patentiert werden, wenn sie neu ist. Wird sie vor der Anmeldung in irgendeiner Form oeffentlich gemacht, etwa in einem Pitch, auf einer Konferenz oder in den Medien, ist sie nicht mehr neu und kann nicht mehr geschuetzt werden. Deshalb gilt: zuerst anmelden oder mit Vertraulichkeitsvereinbarung absichern, dann reden. Fuer Foundergespraeche bei Aurora ist das eine zentrale Sorgfalt.' },
      { title: 'IP bei Startups beachten', minutes: 9, content:
        'Founderteams sollten frueh klaeren, was geschuetzt werden soll und wem die Rechte gehoeren (etwa bei Beteiligung von Hochschulen). Das Team wird informiert, was nach aussen erzaehlt werden darf und was nicht. Diese Grundlagen bereiten auf den Fachkurs IP-Strategie vor. Die Schweiz belegt im Global Innovation Index regelmaessig einen Spitzenplatz, was die Bedeutung von IP unterstreicht.\n\nQuellen: IGE (ige.ch), So schuetzen Startups ihre Innovationen; Global Innovation Index 2025.' },
    ],
    questions: [
      { topic: 'Schutzrechte', q: 'Was schuetzt ein Patent?', opts: ['Einen Produktnamen', 'Eine technische Erfindung', 'Die Farbe eines Logos', 'Einen Domainnamen'], correct: 1, expl: 'Patente schuetzen technische Erfindungen.', diff: 'leicht' },
      { topic: 'Urheberrecht', q: 'Wie ist Software urheberrechtlich geschuetzt?', opts: ['Nur nach Anmeldung beim IGE', 'Automatisch ab Entstehung, ohne Anmeldung', 'Gar nicht', 'Nur mit Patent'], correct: 1, expl: 'Werke und Software sind urheberrechtlich automatisch ab Entstehung geschuetzt, ohne Anmeldung.', diff: 'mittel' },
      { topic: 'Behoerde', q: 'Wo meldet man in der Schweiz Patente, Marken und Designs an?', opts: ['Beim Handelsregisteramt', 'Beim Eidgenoessischen Institut fuer Geistiges Eigentum (IGE)', 'Bei der FINMA', 'Beim Bundesgericht'], correct: 1, expl: 'Patente, Marken und Designs werden beim IGE angemeldet.', diff: 'leicht' },
      { topic: 'Neuheit', q: 'Warum ist Geheimhaltung vor der Patentanmeldung wichtig?', opts: ['Sie ist nicht wichtig', 'Eine vorzeitige Veroeffentlichung zerstoert die Neuheit und damit die Patentierbarkeit', 'Sie spart Gebuehren', 'Sie verlaengert den Schutz'], correct: 1, expl: 'Wird eine Erfindung vor der Anmeldung oeffentlich, ist sie nicht mehr neu und kann nicht mehr patentiert werden.', diff: 'schwer' },
      { topic: 'Startups', q: 'Was sollten Founderteams frueh klaeren?', opts: ['Nichts', 'Was geschuetzt werden soll und wem die Rechte gehoeren', 'Nur den Firmennamen', 'Nur die Webadresse'], correct: 1, expl: 'Frueh klaeren, was geschuetzt werden soll und wem die Rechte zustehen, auch bei Hochschulbeteiligung.', diff: 'mittel' },
    ],
  },
  {
    key: 'v5', title: 'Grundlagen Fruehphasenfinanzierung', type: 'vorbereitung',
    category: 'Grundlagen', level: 'einsteiger', sector: 'finance', position: 'Investment & Programme',
    duration: 30, certPrep: false, extCert: null,
    description: 'Vorbereitung auf den Fachkurs Due Diligence. Finanzierungsphasen, Term Sheet, Cap Table und nicht verwaessernde Finanzierung verstaendlich erklaert. Uebungsmaterial, keine offizielle Pruefung.',
    modules: [
      { title: 'Finanzierungsphasen', minutes: 10, content:
        'Startups durchlaufen typischerweise Phasen von Pre-Seed und Seed ueber Series A und folgende Runden. Frueh fliesst oft nicht verwaesserndes Kapital (etwa Foerdergelder oder Wettbewerbe), spaeter Eigenkapital von Angels und Fonds. Aurora ist im Fruehbereich aktiv, wo Unsicherheit hoch und Sorgfalt entscheidend ist.' },
      { title: 'Term Sheet und Cap Table', minutes: 10, content:
        'Ein Term Sheet haelt die wichtigsten Bedingungen einer Beteiligung fest, etwa Bewertung, Beteiligungshoehe, Mitsprache und Schutzklauseln. Der Cap Table (Beteiligungstabelle) zeigt, wem wie viele Anteile gehoeren. Verwaesserung beschreibt, wie sich Anteile durch neue Runden verringern. Diese Begriffe sind das Handwerkszeug im Investment.' },
      { title: 'Sorgfalt und Fairness', minutes: 10, content:
        'Gute Fruehphaseninvestoren sind fair und transparent gegenueber Foundern und kommunizieren Risiken offen. Entscheidungen beruhen auf Fakten und einer sauberen Pruefung, nicht auf Druck oder Hype. Dieser Kurs bereitet auf den Fachkurs Due Diligence vor.' },
    ],
    questions: [
      { topic: 'Phasen', q: 'Welche Reihenfolge ist typisch?', opts: ['Series A vor Seed', 'Pre-Seed, Seed, dann Series A', 'Boerse zuerst', 'Nur eine einzige Runde'], correct: 1, expl: 'Typisch ist die Abfolge Pre-Seed, Seed, dann Series A und folgende Runden.', diff: 'leicht' },
      { topic: 'Nicht verwaessernd', q: 'Was ist nicht verwaesserndes Kapital?', opts: ['Kapital, das Anteile reduziert', 'Kapital wie Foerdergelder, das keine Anteile kostet', 'Ein Bankkredit mit Sicherheiten', 'Eine Anleihe'], correct: 1, expl: 'Nicht verwaesserndes Kapital, etwa Foerdergelder, kostet keine Unternehmensanteile.', diff: 'mittel' },
      { topic: 'Term Sheet', q: 'Was haelt ein Term Sheet fest?', opts: ['Nur den Firmennamen', 'Die wichtigsten Bedingungen einer Beteiligung', 'Die Steuererklaerung', 'Den Mietvertrag'], correct: 1, expl: 'Das Term Sheet fasst die zentralen Bedingungen wie Bewertung, Beteiligung und Schutzklauseln zusammen.', diff: 'mittel' },
      { topic: 'Cap Table', q: 'Was zeigt ein Cap Table?', opts: ['Die Mitarbeiterzahl', 'Wem wie viele Anteile gehoeren', 'Den Umsatz', 'Die Bueroflaeche'], correct: 1, expl: 'Der Cap Table zeigt die Verteilung der Anteile.', diff: 'leicht' },
      { topic: 'Haltung', q: 'Worauf beruhen gute Fruehphasenentscheidungen?', opts: ['Auf Hype und Druck', 'Auf Fakten und sauberer Pruefung', 'Auf Bauchgefuehl allein', 'Auf dem lautesten Pitch'], correct: 1, expl: 'Entscheidungen sollten auf Fakten und sorgfaeltiger Pruefung beruhen.', diff: 'leicht' },
    ],
  },
  {
    key: 'v6', title: 'Grundlagen Compliance und Regulatorik', type: 'vorbereitung',
    category: 'Grundlagen', level: 'einsteiger', sector: 'finance', position: 'Alle Mitarbeitenden',
    duration: 25, certPrep: false, extCert: null,
    description: 'Vorbereitung auf die Compliance-Fachkurse. Was Compliance bedeutet und ein Ueberblick ueber Geldwaschereipraevention, Sanktionen und Exportkontrolle. Uebungsmaterial, keine offizielle Pruefung.',
    modules: [
      { title: 'Was ist Compliance', minutes: 8, content:
        'Compliance bedeutet, geltende Gesetze, Regeln und interne Vorgaben einzuhalten. Es geht nicht nur um Strafen vermeiden, sondern um Vertrauen und Reputation. Im Venture-Umfeld ist sauberes Verhalten ein Wettbewerbsvorteil, weil Investoren und Partner darauf achten.' },
      { title: 'Drei wichtige Felder im Ueberblick', minutes: 9, content:
        'Geldwaschereipraevention (GwG) verlangt, die Herkunft von Geldern und die wirtschaftlich berechtigten Personen zu kennen. Sanktionen und Embargos verbieten Geschaefte mit bestimmten Personen, Unternehmen und Laendern. Exportkontrolle betrifft Gueter und Technologien mit moeglichem doppeltem Verwendungszweck. Alle drei sind im Deep-Tech-Venture relevant.' },
      { title: 'Wann nachfragen', minutes: 8, content:
        'Im Zweifel immer nachfragen, bevor man handelt. Anlaufstelle ist die Operations- und Compliance-Stelle. Lieber eine Frage zu viel als ein vermeidbarer Fehler. Dieser Kurs bereitet auf die Compliance-Fachkurse GwG, Sanktionen und Exportkontrolle vor.' },
    ],
    questions: [
      { topic: 'Begriff', q: 'Was bedeutet Compliance?', opts: ['Nur Marketing', 'Einhaltung von Gesetzen, Regeln und internen Vorgaben', 'Schnelles Wachstum', 'Steuern sparen'], correct: 1, expl: 'Compliance ist die Einhaltung von Gesetzen, Regeln und internen Vorgaben.', diff: 'leicht' },
      { topic: 'GwG', q: 'Worum geht es bei der Geldwaschereipraevention im Kern?', opts: ['Werbung', 'Herkunft von Geldern und wirtschaftlich Berechtigte kennen', 'Logo-Design', 'Bueromiete'], correct: 1, expl: 'Im Kern geht es darum, die Herkunft von Geldern und die wirtschaftlich berechtigten Personen zu kennen.', diff: 'mittel' },
      { topic: 'Sanktionen', q: 'Was regeln Sanktionen und Embargos?', opts: ['Arbeitszeiten', 'Verbote von Geschaeften mit bestimmten Personen, Firmen und Laendern', 'Ferientage', 'Bueroausstattung'], correct: 1, expl: 'Sanktionen und Embargos verbieten Geschaefte mit gelisteten Personen, Firmen und Laendern.', diff: 'mittel' },
      { topic: 'Exportkontrolle', q: 'Worauf zielt die Exportkontrolle?', opts: ['Auf Lebensmittel', 'Auf Gueter und Technologien mit moeglichem doppeltem Verwendungszweck', 'Auf Buecher', 'Auf Kleidung'], correct: 1, expl: 'Exportkontrolle betrifft Gueter und Technologien, die zivil und militaerisch nutzbar sind (Dual-Use).', diff: 'mittel' },
      { topic: 'Verhalten', q: 'Was tust du bei Unsicherheit?', opts: ['Einfach handeln', 'Vor dem Handeln bei Operations und Compliance nachfragen', 'Nichts tun und schweigen', 'Selbst entscheiden ohne Ruecksprache'], correct: 1, expl: 'Im Zweifel vor dem Handeln nachfragen. Anlaufstelle ist Operations und Compliance.', diff: 'leicht' },
    ],
  },
  // ===================== FACHKURSE (5) =====================
  {
    key: 'f1', title: 'IP-Strategie fuer Deep-Tech-Startups', type: 'fachkurs',
    category: 'Fachvertiefung', level: 'fortgeschritten', sector: 'finance', position: 'Investment & Programme',
    duration: 55, certPrep: false, extCert: null,
    description: 'Vertiefung fuer Investment und Programme: Wie man geistiges Eigentum bei Deep-Tech-Startups beurteilt, schuetzt und in Beteiligungen absichert. Patente, Geheimhaltung, Freedom to Operate und IP im Term Sheet.',
    modules: [
      { title: 'IP als Werttreiber im Deep-Tech', minutes: 16, content:
        'Bei forschungsnahen Startups ist geistiges Eigentum oft der eigentliche Wert. Die vier Schutzrechte in der Schweiz: Patente (technische Erfindungen), Marken (Kennzeichen), Designs (Gestaltung) und Urheberrecht (Werke und Software, automatisch ab Entstehung). Anmeldungen fuer Patente, Marken und Designs erfolgen beim Eidgenoessischen Institut fuer Geistiges Eigentum (IGE).\n\nFuer die Beurteilung eines Startups ist entscheidend: Existieren angemeldete oder erteilte Schutzrechte? Wem gehoeren sie wirklich (Gruender, Gesellschaft, oder noch der Hochschule)? Ist die Technologie ueberhaupt schutzfaehig, oder beruht der Vorsprung auf Geschaeftsgeheimnissen? Die Schweiz belegt im Global Innovation Index 2025 erneut einen Spitzenplatz, was den hohen Stellenwert von Innovation und ihrem Schutz im hiesigen Oekosystem zeigt.\n\nQuellen: IGE (ige.ch); Global Innovation Index 2025.' },
      { title: 'Neuheit, Geheimhaltung und Freedom to Operate', minutes: 14, content:
        'Die Neuheit ist Grundvoraussetzung fuer ein Patent. Wird eine Erfindung vor der Anmeldung oeffentlich gemacht, ist sie nicht mehr patentierbar. Im Investmentprozess heisst das: Vor einem Pitch oder einer Publikation muss die Anmeldung erfolgt oder eine Vertraulichkeitsvereinbarung geschlossen sein. Aurora behandelt erhaltene technische Informationen entsprechend vertraulich.\n\nFreedom to Operate (FTO) beschreibt die Frage, ob ein Produkt auf den Markt gebracht werden kann, ohne fremde Schutzrechte zu verletzen. Ein starkes eigenes Patent nuetzt wenig, wenn das Produkt fremde Patente verletzt. Eine FTO-Einschaetzung gehoert bei technologielastigen Beteiligungen zur Sorgfalt.\n\nQuellen: IGE, So schuetzen Startups ihre Innovationen (ige.ch).' },
      { title: 'IP im Beteiligungsprozess absichern', minutes: 14, content:
        'Im Beteiligungsprozess pruefen wir die IP-Kette: Sind alle Erfinder und Entwickler ueber Vertraege gebunden, sodass Rechte bei der Gesellschaft liegen? Gibt es Lizenzen von Hochschulen, und zu welchen Bedingungen? Sind Marken und Domains gesichert? Im Term Sheet und in der Beteiligungsdokumentation werden Zusicherungen zur IP, deren Inhaberschaft und zur Handlungsfreiheit verankert.\n\nWarnzeichen sind ungeklaerte Rechte aus der akademischen Herkunft, fehlende Uebertragungsvertraege mit Gruendern oder Freelancern und Open-Source-Komponenten mit unklaren Lizenzpflichten. Solche Punkte werden frueh angesprochen und im Legal- und IP-Bereich vertieft.\n\nQuellen: IGE (ige.ch); Praxiswissen Beteiligungsvertraege.' },
    ],
    questions: [
      { topic: 'Schutzrechte', q: 'Welches Schutzrecht entsteht automatisch ohne Anmeldung?', opts: ['Das Patent', 'Die Marke', 'Das Urheberrecht', 'Das Design'], correct: 2, expl: 'Das Urheberrecht an Werken und Software entsteht automatisch ab Entstehung, ohne Anmeldung.', diff: 'mittel' },
      { topic: 'Neuheit', q: 'Eine Erfindung wurde vor der Patentanmeldung oeffentlich praesentiert. Folge?', opts: ['Kein Problem fuer das Patent', 'Die Neuheit kann zerstoert sein, ein Patent wird unmoeglich', 'Das Patent wird automatisch erteilt', 'Die Gebuehren sinken'], correct: 1, expl: 'Eine vorzeitige Veroeffentlichung kann die Neuheit zerstoeren und damit die Patentierbarkeit ausschliessen.', diff: 'schwer' },
      { topic: 'FTO', q: 'Was beschreibt Freedom to Operate?', opts: ['Die Hoehe der Bewertung', 'Ob ein Produkt ohne Verletzung fremder Schutzrechte vermarktet werden kann', 'Den Umsatz pro Mitarbeiter', 'Die Zahl der Patente'], correct: 1, expl: 'Freedom to Operate prueft, ob ein Produkt vermarktet werden kann, ohne fremde Schutzrechte zu verletzen.', diff: 'schwer' },
      { topic: 'Due Diligence', q: 'Was ist ein typisches IP-Warnzeichen bei einem Startup?', opts: ['Gesicherte Marken', 'Ungeklaerte Rechte aus der Hochschulherkunft', 'Erteilte Patente der Gesellschaft', 'Saubere Uebertragungsvertraege'], correct: 1, expl: 'Ungeklaerte Rechte aus akademischer Herkunft oder fehlende Uebertragungen sind klassische Warnzeichen.', diff: 'mittel' },
      { topic: 'Anmeldung', q: 'Wo werden Patente, Marken und Designs in der Schweiz angemeldet?', opts: ['Beim IGE', 'Bei der SNB', 'Beim Bundesgericht', 'Bei der Gemeinde'], correct: 0, expl: 'Anmeldungen erfolgen beim Eidgenoessischen Institut fuer Geistiges Eigentum (IGE).', diff: 'leicht' },
    ],
  },
  {
    key: 'f2', title: 'Exportkontrolle und Dual-Use fuer Deep-Tech und Space', type: 'fachkurs',
    category: 'Fachvertiefung', level: 'fortgeschritten', sector: 'finance', position: 'Investment & Programme',
    duration: 55, certPrep: false, extCert: null,
    description: 'Vertiefung zur Schweizer Exportkontrolle. Was Dual-Use-Gueter sind, welche Pflichten das Gueterkontrollgesetz auferlegt und warum die Revision von 2025 fuer Deep-Tech und Space besonders relevant ist.',
    modules: [
      { title: 'Rechtsrahmen: GKG, GKV und Embargogesetz', minutes: 16, content:
        'Dual-Use-Gueter sind Waren, Software oder Technologien, die sowohl zivil als auch militaerisch genutzt werden koennen. Die zentrale Rechtsgrundlage in der Schweiz ist das Gueterkontrollgesetz (GKG, SR 946.202) mit der Gueterkontrollverordnung (GKV). Die Anhaenge der GKV listen die bewilligungspflichtigen Gueter. Zustaendig sind das Staatssekretariat fuer Wirtschaft (SECO) und fuer die Zollseite das Bundesamt fuer Zoll und Grenzsicherheit (BAZG).\n\nFlankierend gilt das Embargogesetz (EmbG, SR 946.231), das die Umsetzung internationaler Sanktionen regelt. Alle Exporteure sind gesetzlich verpflichtet, ihre Gueter auf Dual-Use-Relevanz zu pruefen. Ist ein Gut gelistet, braucht es vor der Ausfuhr eine Bewilligung, unabhaengig vom Bestimmungsland.\n\nQuellen: GKG (SR 946.202) und GKV; EmbG (SR 946.231); SECO; BAZG.' },
      { title: 'Revision 2025: neue Technologien erfasst', minutes: 14, content:
        'Der Bundesrat hat die Gueterkontrollverordnung angepasst; die Aenderung ist am 1. Mai 2025 in Kraft getreten. Neu bewilligungspflichtig sind unter anderem Gueter und Technologien aus den Bereichen Quantencomputing, fortgeschrittene Halbleiterfertigung, kuenstliche Intelligenz und additive Fertigung (3D-Druck). Ziel ist die Harmonisierung mit den wichtigsten Handelspartnern und der EU, damit die Schweiz nicht zur Umgehungsroute fuer sensible Technologien wird.\n\nGenau diese Felder sind im Deep-Tech- und Space-Umfeld von Aurora haeufig vertreten. Beteiligungen und Portfoliofirmen koennen daher von Bewilligungspflichten betroffen sein. Die ETH Zuerich etwa fuehrt fuer ihre Forschung eine eigene Exportkontrollstelle, was zeigt, wie ernst das Thema im Hochtechnologieumfeld genommen wird.\n\nQuellen: Bundesrat, Medienmitteilung vom 2. April 2025; SECO; ETH Zuerich Staffnet, Dual-Use-Exportkontrollen.' },
      { title: 'Sorgfalt im Investment- und Programmalltag', minutes: 14, content:
        'Praktische Sorgfalt: Bei technologielastigen Portfoliofirmen frueh klaeren, ob deren Produkte oder Forschung unter die Gueterlisten fallen koennten. Pruefen, ob die Firma einen Prozess fuer Ausfuhrbewilligungen hat. Bei internationalen Kooperationen und Lieferketten auf Bestimmungslaender und Endempfaenger achten.\n\nFalsche Einstufung oder ignorierte Pflichten koennen zu gestoppten Sendungen, Bussen und strafrechtlichen Folgen fuehren und den Ruf schaedigen. Aurora ist kein Exporteur im klassischen Sinn, traegt aber als Investor und Begleiter Mitverantwortung, das Thema auf die Agenda der Portfoliofirmen zu setzen. Im Zweifel SECO-Auskunft oder fachkundige Beratung einholen.\n\nQuellen: SECO, Dual-Use-Einstufung; BAZG.' },
    ],
    questions: [
      { topic: 'Begriff', q: 'Was sind Dual-Use-Gueter?', opts: ['Reine Konsumgueter', 'Gueter mit zivilem und militaerischem Verwendungszweck', 'Nur Waffen', 'Nur Lebensmittel'], correct: 1, expl: 'Dual-Use-Gueter sind zivil und militaerisch nutzbare Waren, Software oder Technologien.', diff: 'leicht' },
      { topic: 'Rechtsgrundlage', q: 'Welches Gesetz ist die zentrale Grundlage der Schweizer Exportkontrolle bei Dual-Use?', opts: ['Das Datenschutzgesetz', 'Das Gueterkontrollgesetz (GKG)', 'Das Obligationenrecht', 'Das Strassenverkehrsgesetz'], correct: 1, expl: 'Das Gueterkontrollgesetz (GKG, SR 946.202) mit der GKV ist die zentrale Grundlage.', diff: 'mittel' },
      { topic: 'Revision 2025', q: 'Welche Technologien wurden mit der GKV-Revision per 1. Mai 2025 neu bewilligungspflichtig?', opts: ['Buecher und Musik', 'Quantencomputing, fortgeschrittene Halbleiter, KI und additive Fertigung', 'Bueromaterial', 'Lebensmittel'], correct: 1, expl: 'Neu erfasst sind unter anderem Quantencomputing, fortgeschrittene Halbleiterfertigung, KI und additive Fertigung.', diff: 'schwer' },
      { topic: 'Zustaendigkeit', q: 'Welche Behoerde ist fuer Ausfuhrbewilligungen bei Dual-Use zustaendig?', opts: ['Die FINMA', 'Das SECO', 'Der EDOEB', 'Die SNB'], correct: 1, expl: 'Das Staatssekretariat fuer Wirtschaft (SECO) ist zustaendig, die Zollseite das BAZG.', diff: 'mittel' },
      { topic: 'Praxis', q: 'Warum ist das Thema fuer Aurora relevant, obwohl Aurora nicht exportiert?', opts: ['Es ist nicht relevant', 'Weil Portfoliofirmen im Deep-Tech und Space von Bewilligungspflichten betroffen sein koennen', 'Nur wegen des Datenschutzes', 'Nur fuer die Buchhaltung'], correct: 1, expl: 'Als Investor und Begleiter traegt Aurora Mitverantwortung, das Thema bei betroffenen Portfoliofirmen zu adressieren.', diff: 'mittel' },
    ],
  },
  {
    key: 'f3', title: 'EU AI Act in der Praxis', type: 'fachkurs',
    category: 'Fachvertiefung', level: 'experte', sector: 'finance', position: 'Investment & Programme',
    duration: 50, certPrep: false, extCert: null,
    description: 'Vertiefung zum EU AI Act fuer Investment und Portfolio. Risikoklassen, Hochrisiko-Pflichten, Zeitplan inklusive Digital Omnibus und was das fuer KI-Startups und ihre Bewertung bedeutet.',
    modules: [
      { title: 'Risikoklassen und Geltung', minutes: 16, content:
        'Der EU AI Act (Verordnung (EU) 2024/1689) unterscheidet vier Risikoklassen: verbotene Praktiken, Hochrisiko, begrenztes Risiko (Transparenzpflichten nach Art. 50) und minimales Risiko. Entscheidend ist die Rolle: Anbieter (entwickelt und bringt in Verkehr) tragen mehr Pflichten als Betreiber (setzt ein). Die Verordnung wirkt extraterritorial und betrifft auch Nicht-EU-Akteure, deren Systeme auf den EU-Markt wirken.\n\nFuer Aurora als Investor heisst das: Bei KI-Startups gehoert die Einordnung in die Risikoklassen zur Pruefung. Ein Startup, dessen Produkt in den Hochrisikobereich nach Anhang III faellt (zum Beispiel Personalauswahl oder Kreditwuerdigkeit), hat einen erheblich groesseren Pflichtenkatalog und damit Kosten- und Zeitrisiken.\n\nQuellen: Verordnung (EU) 2024/1689; EU-Kommission FAQ.' },
      { title: 'Zeitplan und Digital Omnibus', minutes: 14, content:
        'Der Zeitplan in Etappen: in Kraft seit 1. August 2024; verbotene Praktiken und KI-Kompetenzpflicht seit 2. Februar 2025; Pflichten fuer Anbieter allgemeiner KI-Modelle (GPAI) seit August 2025; Vollanwendung am 2. August 2026. Ein Teil der Hochrisiko-Pflichten nach Anhang III wurde durch den sogenannten Digital Omnibus voraussichtlich auf Dezember 2027 verschoben, um die Umsetzung zu erleichtern.\n\nWichtig fuer die Praxis: Die KI-Kompetenzpflicht gilt bereits heute, auch wenn die Durchsetzung der Hochrisikopflichten erst spaeter greift. Wer wartet, ist bei einer Pflichtverletzung exponiert. Der Zeitplan kann sich durch weitere Rechtsakte aendern, deshalb laufend beobachten.\n\nQuellen: EU AI Act; Digital Omnibus on AI; TUEV-Consulting, Zwischenstand 2026; secjur.' },
      { title: 'Bedeutung fuer die Bewertung von KI-Startups', minutes: 14, content:
        'In der Due Diligence von KI-Startups pruefen wir: In welche Risikoklasse faellt das Produkt? Gibt es eine technische Dokumentation, ein Risikomanagement und Datengrundlagen, die den Anforderungen genuegen koennen? Wird KI-Kompetenz im Team nachweisbar sichergestellt (Art. 4)? Ist Transparenz gegenueber Nutzern vorgesehen, wo verlangt (Art. 50)?\n\nNormen wie ISO/IEC 42001 (Managementsystem fuer KI) koennen helfen, Konformitaet strukturiert nachzuweisen. Regulatorische Reife ist ein Bewertungsfaktor: Sie senkt Risiken und erhoeht die Anschlussfaehigkeit an Kunden und spaetere Investoren. Aussagen zur Konformitaet pruefen wir kritisch und verlassen uns nicht auf Marketingversprechen.\n\nQuellen: EU AI Act Art. 4, Art. 50, Anhang III; ISO/IEC 42001.' },
    ],
    questions: [
      { topic: 'Risikoklassen', q: 'Wie viele Risikoklassen unterscheidet der EU AI Act grundsaetzlich?', opts: ['Zwei', 'Vier', 'Zehn', 'Keine'], correct: 1, expl: 'Vier: verbotene Praktiken, Hochrisiko, begrenztes Risiko und minimales Risiko.', diff: 'mittel' },
      { topic: 'Rollen', q: 'Wer traegt mehr Pflichten, Anbieter oder Betreiber?', opts: ['Der Betreiber', 'Der Anbieter', 'Beide gleich viel', 'Niemand'], correct: 1, expl: 'Anbieter, die ein KI-System entwickeln und in Verkehr bringen, tragen mehr Pflichten als reine Betreiber.', diff: 'mittel' },
      { topic: 'Zeitplan', q: 'Wann beginnt die Vollanwendung des EU AI Act?', opts: ['1. August 2024', '2. Februar 2025', '2. August 2026', '2030'], correct: 2, expl: 'Die Vollanwendung beginnt am 2. August 2026; Teile der Hochrisikopflichten wurden auf Dezember 2027 verschoben.', diff: 'schwer' },
      { topic: 'Digital Omnibus', q: 'Was bewirkt der sogenannte Digital Omnibus?', opts: ['Er verbietet KI vollstaendig', 'Er verschiebt einen Teil der Hochrisiko-Pflichten nach Anhang III voraussichtlich auf Dezember 2027', 'Er hebt das Gesetz auf', 'Er fuehrt eine KI-Steuer ein'], correct: 1, expl: 'Der Digital Omnibus verschiebt einen Teil der Anhang-III-Hochrisikopflichten voraussichtlich auf Dezember 2027.', diff: 'schwer' },
      { topic: 'Due Diligence', q: 'Welche Norm kann KI-Konformitaet strukturiert unterstuetzen?', opts: ['ISO 9001 allein', 'ISO/IEC 42001', 'Es gibt keine', 'Das revDSG'], correct: 1, expl: 'ISO/IEC 42001 ist ein Managementsystem fuer KI und kann Konformitaet strukturiert nachweisen helfen.', diff: 'mittel' },
    ],
  },
  {
    key: 'f4', title: 'Due Diligence und Investmentprozess', type: 'fachkurs',
    category: 'Fachvertiefung', level: 'fortgeschritten', sector: 'finance', position: 'Investment & Programme',
    duration: 50, certPrep: false, extCert: null,
    description: 'Vertiefung zum sorgfaeltigen Investmentprozess: rechtliche, technische und finanzielle Pruefung, typische Warnzeichen und die Verbindung zu KYC und Compliance. Wie aus Sorgfalt eine gute Entscheidung wird.',
    modules: [
      { title: 'Die drei Saeulen der Due Diligence', minutes: 16, content:
        'Sorgfaeltige Pruefung steht auf drei Saeulen. Rechtlich: Gesellschaftsstruktur, Beteiligungsverhaeltnisse, Vertraege, IP-Inhaberschaft, offene Streitigkeiten. Technisch: Reife der Technologie, Schutzrechte, Abhaengigkeiten, regulatorische Einordnung etwa nach EU AI Act oder Exportkontrolle. Finanziell: Zahlen, Annahmen im Finanzplan, Mittelverwendung, Cap Table und Verwaesserung.\n\nGute Due Diligence ist kein Misstrauen, sondern Respekt vor der Verantwortung gegenueber den Mitteln, die Aurora investiert. Sie schafft die Faktenbasis fuer eine Entscheidung und deckt Risiken auf, die spaeter teuer werden koennten.' },
      { title: 'Warnzeichen und Verbindung zur Compliance', minutes: 14, content:
        'Typische Warnzeichen: unklare oder ungesunde Beteiligungsverhaeltnisse, ungeklaerte IP-Rechte, uebertriebene Annahmen ohne Belege, intransparente Mittelherkunft oder Druck auf einen schnellen Abschluss ohne Pruefung. Solche Signale sind ernst zu nehmen.\n\nDer Investmentprozess ist mit Compliance verknuepft: Bevor Mittel fliessen, sind die Gegenparteien zu kennen (Know Your Customer), die wirtschaftlich berechtigten Personen zu klaeren und Sanktionslisten zu pruefen. So greifen Due Diligence und Geldwaschereipraevention ineinander.' },
      { title: 'Vom Befund zur Entscheidung', minutes: 14, content:
        'Befunde werden dokumentiert und im Team offen diskutiert. Risiken werden benannt, nicht beschoenigt, und gegen Chancen abgewogen. Das Term Sheet bildet die Bedingungen ab, inklusive Zusicherungen und Schutzklauseln, die erkannte Risiken adressieren. Entscheidungen sind nachvollziehbar zu begruenden.\n\nDiese Disziplin schuetzt Aurora und die Founder gleichermassen. Sie verhindert teure Fehler und schafft Vertrauen bei Co-Investoren. Eine gute Entscheidung erkennt man nicht am Tempo, sondern an der Qualitaet der Grundlage.' },
    ],
    questions: [
      { topic: 'Saeulen', q: 'Welche drei Saeulen hat die Due Diligence?', opts: ['Marketing, Vertrieb, PR', 'Rechtlich, technisch, finanziell', 'Nur finanziell', 'Design, Text, Bild'], correct: 1, expl: 'Die drei Saeulen sind rechtliche, technische und finanzielle Pruefung.', diff: 'leicht' },
      { topic: 'Warnzeichen', q: 'Was ist ein typisches Warnzeichen im Investmentprozess?', opts: ['Saubere Cap Table', 'Druck auf einen schnellen Abschluss ohne Pruefung', 'Belegte Annahmen', 'Klare IP-Rechte'], correct: 1, expl: 'Druck auf einen schnellen Abschluss ohne Pruefung ist ein klassisches Warnzeichen.', diff: 'mittel' },
      { topic: 'Compliance', q: 'Wie haengen Due Diligence und Geldwaschereipraevention zusammen?', opts: ['Gar nicht', 'Vor Mittelfluss sind Gegenparteien und wirtschaftlich Berechtigte zu kennen und Sanktionslisten zu pruefen', 'Nur am Jahresende', 'Nur bei Boersengang'], correct: 1, expl: 'KYC, wirtschaftlich Berechtigte und Sanktionspruefung sind Teil der sorgfaeltigen Pruefung vor Mittelfluss.', diff: 'mittel' },
      { topic: 'Entscheidung', q: 'Woran erkennt man laut Kurs eine gute Investmententscheidung?', opts: ['Am Tempo', 'An der Qualitaet der Grundlage', 'Am lautesten Pitch', 'An der Zahl der Meetings'], correct: 1, expl: 'Eine gute Entscheidung beruht auf der Qualitaet der Grundlage, nicht auf Tempo.', diff: 'leicht' },
      { topic: 'Dokumentation', q: 'Was geschieht mit den Befunden der Pruefung?', opts: ['Sie werden verworfen', 'Sie werden dokumentiert und offen diskutiert', 'Sie bleiben geheim', 'Sie werden geschoent'], correct: 1, expl: 'Befunde werden dokumentiert, offen diskutiert und im Term Sheet adressiert.', diff: 'leicht' },
    ],
  },
  {
    key: 'f5', title: 'ESG und Impact in Deep-Tech-Investments', type: 'fachkurs',
    category: 'Fachvertiefung', level: 'fortgeschritten', sector: 'finance', position: 'Investment & Programme',
    duration: 45, certPrep: false, extCert: null,
    description: 'Vertiefung zu Nachhaltigkeit und Wirkung im Investment. Was ESG bedeutet, wie man Wirkung serioes statt als Greenwashing misst und worauf bei regenerativen und CO2-armen Technologien zu achten ist.',
    modules: [
      { title: 'ESG verstehen, Greenwashing vermeiden', minutes: 15, content:
        'ESG steht fuer Umwelt (Environmental), Soziales (Social) und Unternehmensfuehrung (Governance). Im Investment bedeutet das, neben der Rendite auch Wirkung und Risiken in diesen Dimensionen zu beruecksichtigen. Gerade bei regenerativen, zirkulaeren und CO2-armen Technologien ist Wirkung Teil des Wertversprechens.\n\nWichtig ist Serioesitaet: Wirkung wird belegt, nicht behauptet. Greenwashing, also uebertriebene oder unbelegte Nachhaltigkeitsaussagen, schadet der Glaubwuerdigkeit und kann rechtliche und Reputationsrisiken ausloesen. Aurora unterscheidet zwischen messbarer Wirkung und Marketing.' },
      { title: 'Wirkung messen', minutes: 15, content:
        'Wirkung braucht klare Indikatoren und eine ehrliche Ausgangsbasis. Statt vager Versprechen werden konkrete, nachvollziehbare Kennzahlen definiert, etwa vermiedene Emissionen, Ressourceneinsparung oder Kreislauffaehigkeit, jeweils mit Annahmen und Quellen. Wichtig ist, zwischen Absicht und nachgewiesener Wirkung zu trennen und Fortschritt ueber die Zeit zu verfolgen.\n\nBei Fruehphasenfirmen ist Wirkung oft erst Potenzial. Dann ist ehrlich auszuweisen, was bereits belegt ist und was Annahme bleibt. Diese Haltung passt zur Transparenzregel von Aurora: heute belegen, was belegt ist, und Ziele als Ziele benennen.' },
      { title: 'Regulatorischer Rahmen im Ueberblick', minutes: 12, content:
        'Auf EU-Ebene praegen Rahmenwerke wie die Nachhaltigkeitsberichterstattung und die EU-Taxonomie die Erwartungen an glaubwuerdige Nachhaltigkeitsaussagen. Diese Anforderungen entwickeln sich laufend weiter. Fuer Fruehphasenfirmen sind sie meist noch nicht direkt verpflichtend, praegen aber die Erwartungen spaeterer Investoren und Kunden.\n\nFuer Aurora heisst das: Wirkung von Anfang an sauber und belegbar aufsetzen, damit Portfoliofirmen anschlussfaehig bleiben. Konkrete Berichtspflichten und Schwellenwerte sind im Einzelfall fachlich zu pruefen, da sie sich aendern koennen. Dieser Kurs gibt den Rahmen, ersetzt aber keine Einzelfallberatung.' },
    ],
    questions: [
      { topic: 'Begriff', q: 'Wofuer steht ESG?', opts: ['Ertrag, Sicherheit, Gewinn', 'Environmental, Social, Governance', 'Energie, Strom, Gas', 'Einkauf, Service, Garantie'], correct: 1, expl: 'ESG steht fuer Environmental (Umwelt), Social (Soziales) und Governance (Unternehmensfuehrung).', diff: 'leicht' },
      { topic: 'Greenwashing', q: 'Was ist Greenwashing?', opts: ['Eine Reinigungsmethode', 'Uebertriebene oder unbelegte Nachhaltigkeitsaussagen', 'Eine Foerderform', 'Eine Steuer'], correct: 1, expl: 'Greenwashing meint uebertriebene oder unbelegte Nachhaltigkeitsaussagen und schadet der Glaubwuerdigkeit.', diff: 'mittel' },
      { topic: 'Messung', q: 'Wie misst Aurora Wirkung serioes?', opts: ['Mit vagen Versprechen', 'Mit klaren, belegten Kennzahlen und ehrlicher Ausgangsbasis', 'Gar nicht', 'Nur ueber Marketing'], correct: 1, expl: 'Wirkung wird mit klaren, nachvollziehbaren Kennzahlen und ehrlicher Ausgangsbasis belegt.', diff: 'mittel' },
      { topic: 'Fruehphase', q: 'Wie geht man mit Wirkung bei Fruehphasenfirmen um?', opts: ['Alles als bewiesen darstellen', 'Ehrlich trennen, was belegt ist und was Annahme bleibt', 'Wirkung ignorieren', 'Nur Absichten kommunizieren'], correct: 1, expl: 'Bei Fruehphasenfirmen ist ehrlich auszuweisen, was belegt ist und was Potenzial bleibt.', diff: 'mittel' },
      { topic: 'Rahmen', q: 'Welche EU-Rahmenwerke praegen glaubwuerdige Nachhaltigkeitsaussagen?', opts: ['Es gibt keine', 'Nachhaltigkeitsberichterstattung und EU-Taxonomie', 'Nur das revDSG', 'Nur der EU AI Act'], correct: 1, expl: 'Die Nachhaltigkeitsberichterstattung und die EU-Taxonomie praegen die Erwartungen, entwickeln sich aber laufend weiter.', diff: 'schwer' },
    ],
  },

  // ===================== COMPLIANCE-KURSE (3) =====================
  {
    key: 'c1', title: 'Geldwaschereipraevention (GwG) und Transparenzregister (TJPG)', type: 'compliance',
    category: 'Compliance Spezial', level: 'fortgeschritten', sector: 'finance', position: 'Investment & Operations',
    duration: 55, certPrep: false, extCert: null,
    description: 'Spezialkurs zur Geldwaschereipraevention im Investmentumfeld. Sorgfaltspflichten, wirtschaftlich Berechtigte, das neue Transparenzregister (TJPG) und was die Revision von 2025 bringt.',
    modules: [
      { title: 'Grundlagen GwG und Sorgfaltspflichten', minutes: 16, content:
        'Das Geldwaeschereigesetz (GwG, SR 955.0) verfolgt das Ziel, das Einschleusen illegaler Gelder in den Wirtschaftskreislauf und die Terrorismusfinanzierung zu verhindern. Im Kern stehen Sorgfaltspflichten: die Identifikation der Vertragspartei (Know Your Customer), die Feststellung der wirtschaftlich berechtigten Person, die Klaerung von Hintergrund und Zweck ungewoehnlicher Transaktionen sowie die Dokumentation.\n\nWirtschaftlich berechtigt ist die natuerliche Person, die eine Gesellschaft letztlich kontrolliert. Bei Beteiligungen wird die Kontrollkette aufgeloest, bis die dahinterstehenden natuerlichen Personen feststehen. Unklare oder verschachtelte Strukturen ohne plausible Erklaerung sind ein Warnsignal.\n\nQuellen: Geldwaeschereigesetz (GwG, SR 955.0); FATF-Empfehlungen; SIF (sif.admin.ch).' },
      { title: 'Revision 2025 und das Transparenzregister', minutes: 15, content:
        'Am 26. September 2025 haben die Eidgenoessischen Raete das Gesetz ueber die Transparenz juristischer Personen (TJPG) sowie eine Revision des GwG verabschiedet. Das TJPG schafft ein zentrales, nicht oeffentliches Bundesregister der wirtschaftlich Berechtigten (Transparenzregister), auf das nur berechtigte Behoerden und unter Voraussetzungen Finanzintermediaere zugreifen koennen. Das Inkrafttreten ist voraussichtlich fuer die zweite Haelfte 2026 vorgesehen.\n\nKuenftig muessen sehr viele juristische Personen ihre wirtschaftlich Berechtigten dem Register melden; die Plattform EasyGov dient als zentrale Meldestelle. Vereine und Stiftungen wurden von der Registerpflicht ausgenommen. Ziel ist die Umsetzung internationaler Standards, insbesondere der FATF-Empfehlung 24.\n\nQuellen: SIF, Geldwaeschereibekaempfung; EasyGov, Transparenzregister; Parlamentsbeschluss vom 26.9.2025.' },
      { title: 'Praxis im Investmentprozess', minutes: 14, content:
        'Vor einer Beteiligung klaeren wir: Wer sind die wirtschaftlich Berechtigten der Gegenpartei und der Co-Investoren? Ist die Herkunft der Mittel plausibel und belegt? Gibt es Verbindungen zu politisch exponierten Personen oder zu Hochrisikolaendern? Befunde werden dokumentiert.\n\nWarnsignale sind unerklaerte Strukturen, Bargeld ohne Hintergrund, Eile ohne Pruefung oder die Weigerung, Eigentumsverhaeltnisse offenzulegen. Solche Faelle gehen an die Operations- und Compliance-Stelle. Aurora ist selbst kein klassischer Finanzintermediaer im Sinne des GwG; die hier vermittelten Sorgfaltsprinzipien sind aber gelebter Standard und schuetzen vor Reputations- und Rechtsrisiken.\n\nQuellen: GwG (SR 955.0); FATF-Empfehlungen; SIF.' },
    ],
    questions: [
      { topic: 'Ziel', q: 'Was ist das Hauptziel des GwG?', opts: ['Steuern erhoehen', 'Geldwaescherei und Terrorismusfinanzierung verhindern', 'Werbung regeln', 'Loehne festlegen'], correct: 1, expl: 'Das GwG soll das Einschleusen illegaler Gelder und die Terrorismusfinanzierung verhindern.', diff: 'leicht' },
      { topic: 'Wirtschaftlich Berechtigte', q: 'Wer ist die wirtschaftlich berechtigte Person?', opts: ['Der Geschaeftsfuehrer immer', 'Die natuerliche Person, die eine Gesellschaft letztlich kontrolliert', 'Die Bank', 'Der Anwalt'], correct: 1, expl: 'Wirtschaftlich berechtigt ist die natuerliche Person, die letztlich die Kontrolle ausuebt.', diff: 'mittel' },
      { topic: 'TJPG', q: 'Was wurde am 26. September 2025 beschlossen?', opts: ['Die Abschaffung des GwG', 'Das TJPG mit einem zentralen Transparenzregister und eine GwG-Revision', 'Ein neues Steuergesetz', 'Ein Datenschutzgesetz'], correct: 1, expl: 'Beschlossen wurden das TJPG mit zentralem Transparenzregister der wirtschaftlich Berechtigten und eine Revision des GwG.', diff: 'schwer' },
      { topic: 'Register', q: 'Welche Eigenschaft hat das neue Transparenzregister?', opts: ['Oeffentlich fuer jedermann', 'Zentral und nicht oeffentlich, Zugriff nur fuer berechtigte Stellen', 'Es gibt kein Register', 'Nur fuer Vereine'], correct: 1, expl: 'Das Register ist zentral und nicht oeffentlich; Zugriff haben nur berechtigte Behoerden und unter Voraussetzungen Finanzintermediaere.', diff: 'mittel' },
      { topic: 'Praxis', q: 'Was ist ein Warnsignal bei einer Beteiligung?', opts: ['Belegte Mittelherkunft', 'Weigerung, Eigentumsverhaeltnisse offenzulegen', 'Transparente Struktur', 'Klare wirtschaftlich Berechtigte'], correct: 1, expl: 'Die Weigerung, Eigentumsverhaeltnisse offenzulegen, ist ein klassisches Warnsignal.', diff: 'mittel' },
    ],
  },
  {
    key: 'c2', title: 'Sanktionen und Embargo-Compliance', type: 'compliance',
    category: 'Compliance Spezial', level: 'fortgeschritten', sector: 'finance', position: 'Investment & Operations',
    duration: 40, certPrep: false, extCert: null,
    description: 'Spezialkurs zu Sanktionen und Embargos. Was das Embargogesetz verlangt, wie Sanktionslisten funktionieren und wie wir Investoren, Partner und Portfoliofirmen entsprechend pruefen.',
    modules: [
      { title: 'Rechtsrahmen und SECO-Listen', minutes: 14, content:
        'Das Embargogesetz (EmbG, SR 946.231) bildet die Grundlage, damit die Schweiz internationale Sanktionen umsetzen kann. Gestuetzt darauf erlaesst der Bundesrat Verordnungen gegen bestimmte Laender, Organisationen und Personen. Das SECO fuehrt und veroeffentlicht die massgeblichen Sanktionslisten und ist Anlaufstelle fuer Fragen.\n\nSanktionen koennen Finanzgeschaefte, Gueter, Dienstleistungen und den Umgang mit gelisteten Personen verbieten oder einschraenken. Verstoesse koennen straf- und verwaltungsrechtliche Folgen haben. Sanktionsregime aendern sich laufend, daher ist Aktualitaet entscheidend.\n\nQuellen: Embargogesetz (EmbG, SR 946.231); SECO Sanktionen.' },
      { title: 'Screening in der Praxis', minutes: 13, content:
        'Bevor Aurora eine Beteiligung eingeht oder Mittel von Co-Investoren annimmt, werden die beteiligten Personen und Gesellschaften gegen die aktuellen Sanktionslisten geprueft. Das betrifft Founder, wirtschaftlich Berechtigte, Co-Investoren und wesentliche Geschaeftspartner der Portfoliofirmen. Auch Bestimmungslaender bei internationalen Aktivitaeten sind relevant.\n\nEin Treffer oder ein begruendeter Verdacht fuehrt zum Stopp und zur Klaerung mit der Operations- und Compliance-Stelle, bevor irgendetwas weitergeht. Im Zweifel keine Transaktion ohne Freigabe.' },
      { title: 'Verbindung zu Exportkontrolle und GwG', minutes: 12, content:
        'Sanktionen, Exportkontrolle und Geldwaschereipraevention greifen ineinander. Eine Person kann sanktioniert sein, ein Gut kann der Exportkontrolle unterliegen, und die Mittelherkunft kann GwG-relevant sein. Eine saubere Pruefung betrachtet alle drei Ebenen zusammen.\n\nFuer Aurora heisst das: Sanktionspruefung ist fester Teil des Investmentprozesses und der laufenden Betreuung, nicht eine einmalige Formalitaet. Da sich Listen aendern, werden bestehende Beziehungen bei Auffaelligkeiten erneut geprueft.\n\nQuellen: SECO; EmbG; GKG.' },
    ],
    questions: [
      { topic: 'Rechtsgrundlage', q: 'Welches Gesetz erlaubt der Schweiz die Umsetzung internationaler Sanktionen?', opts: ['Das revDSG', 'Das Embargogesetz (EmbG)', 'Das Obligationenrecht', 'Das GwG'], correct: 1, expl: 'Das Embargogesetz (EmbG, SR 946.231) ist die Grundlage fuer die Umsetzung von Sanktionen.', diff: 'mittel' },
      { topic: 'Listen', q: 'Welche Stelle fuehrt die massgeblichen Sanktionslisten in der Schweiz?', opts: ['Die FINMA', 'Das SECO', 'Der EDOEB', 'Die Gemeinde'], correct: 1, expl: 'Das SECO fuehrt und veroeffentlicht die massgeblichen Sanktionslisten.', diff: 'mittel' },
      { topic: 'Screening', q: 'Wen prueft Aurora gegen Sanktionslisten?', opts: ['Niemanden', 'Founder, wirtschaftlich Berechtigte, Co-Investoren und wesentliche Partner', 'Nur die eigene Buchhaltung', 'Nur Lieferanten von Bueromaterial'], correct: 1, expl: 'Geprueft werden die beteiligten Personen und Gesellschaften, inklusive wirtschaftlich Berechtigter und Co-Investoren.', diff: 'mittel' },
      { topic: 'Treffer', q: 'Was passiert bei einem Sanktionstreffer oder begruendetem Verdacht?', opts: ['Weitermachen wie geplant', 'Stopp und Klaerung mit Operations und Compliance vor jedem weiteren Schritt', 'Ignorieren', 'Schneller abschliessen'], correct: 1, expl: 'Bei Treffer oder Verdacht wird gestoppt und mit Operations und Compliance geklaert; keine Transaktion ohne Freigabe.', diff: 'leicht' },
      { topic: 'Aktualitaet', q: 'Warum werden bestehende Beziehungen erneut geprueft?', opts: ['Aus Langeweile', 'Weil sich Sanktionslisten laufend aendern', 'Das passiert nie', 'Nur einmal bei Vertragsschluss'], correct: 1, expl: 'Sanktionsregime aendern sich laufend, daher werden Beziehungen bei Auffaelligkeiten erneut geprueft.', diff: 'leicht' },
    ],
  },
  {
    key: 'c3', title: 'Interessenkonflikte, Insiderwissen und Antikorruption', type: 'compliance',
    category: 'Compliance Spezial', level: 'fortgeschritten', sector: 'finance', position: 'Alle Mitarbeitenden',
    duration: 45, certPrep: false, extCert: null,
    description: 'Spezialkurs zu Interessenkonflikten, dem Umgang mit vertraulichem und potenziell kursrelevantem Wissen sowie zur Korruptionspraevention. Besonders relevant fuer Personen mit Verwaltungsratsmandaten.',
    modules: [
      { title: 'Interessenkonflikte erkennen und steuern', minutes: 15, content:
        'Ein Interessenkonflikt entsteht, wenn private oder andere Interessen mit den Pflichten gegenueber Aurora oder einem Portfoliounternehmen kollidieren. Beispiele: eigene Beteiligungen, Verwaltungsratsmandate in mehreren Firmen, persoenliche Beziehungen zu Gegenparteien oder Nebentaetigkeiten.\n\nKonflikte sind nicht per se verboten, muessen aber offengelegt und gesteuert werden. Wer betroffen ist, legt den Konflikt offen und haelt sich aus der betreffenden Entscheidung heraus (Ausstand). Personen mit mehreren Mandaten, wie sie im Venture-Umfeld ueblich sind, achten besonders darauf, Rollen und Informationen sauber zu trennen.' },
      { title: 'Vertrauliches und kursrelevantes Wissen', minutes: 15, content:
        'Im Investmentgeschaeft entstehen viele vertrauliche Informationen: Dealflow, Finanzzahlen, geplante Runden, technische Details. Diese Informationen werden streng vertraulich behandelt und nur intern nach dem Prinzip Kenntnis nur bei Bedarf geteilt.\n\nKommt vertrauliche, noch nicht oeffentliche Information ueber boersenkotierte Unternehmen ins Spiel, ist besondere Vorsicht geboten: Der Handel mit Wertpapieren auf Basis solcher Insiderinformationen ist verboten und strafbar. Auch das Weitergeben solcher Informationen (Tipping) ist unzulaessig. Im Zweifel keine Transaktion und Ruecksprache mit der Operations- und Compliance-Stelle.' },
      { title: 'Korruptionspraevention', minutes: 12, content:
        'Korruption bedeutet, einen unzulaessigen Vorteil zu gewaehren oder anzunehmen, um eine Entscheidung zu beeinflussen. Das ist verboten, im Verhaeltnis zu Amtstraegern wie auch zwischen Privaten. Schmiergelder, verschleierte Provisionen und unangemessene Geschenke oder Einladungen sind tabu.\n\nErlaubt sind kleine, sozial uebliche und transparente Aufmerksamkeiten ohne Beeinflussungsabsicht. Die Grenze ist erreicht, wenn ein Vorteil eine Entscheidung beeinflussen koennte oder diesen Anschein erweckt. Im Zweifel offenlegen, dokumentieren und ablehnen. Korruption schaedigt Vertrauen und Reputation nachhaltig und kann strafrechtliche Folgen haben.' },
    ],
    questions: [
      { topic: 'Interessenkonflikt', q: 'Wie geht man mit einem Interessenkonflikt richtig um?', opts: ['Verheimlichen', 'Offenlegen und sich aus der betreffenden Entscheidung heraushalten', 'Trotzdem mitentscheiden', 'Den Konflikt verstaerken'], correct: 1, expl: 'Interessenkonflikte sind offenzulegen, und die betroffene Person tritt in den Ausstand.', diff: 'mittel' },
      { topic: 'Mehrfachmandate', q: 'Worauf achten Personen mit mehreren Verwaltungsratsmandaten besonders?', opts: ['Auf gar nichts', 'Rollen und Informationen sauber zu trennen', 'Informationen frei zu teilen', 'Mandate zu verheimlichen'], correct: 1, expl: 'Bei mehreren Mandaten ist die saubere Trennung von Rollen und Informationen besonders wichtig.', diff: 'mittel' },
      { topic: 'Insiderwissen', q: 'Was gilt fuer den Handel mit Wertpapieren auf Basis nicht oeffentlicher Insiderinformationen?', opts: ['Erlaubt, wenn diskret', 'Verboten und strafbar', 'Nur am Wochenende erlaubt', 'Erlaubt bei kleinen Betraegen'], correct: 1, expl: 'Der Handel auf Basis von Insiderinformationen ist verboten und strafbar; auch das Weitergeben (Tipping) ist unzulaessig.', diff: 'schwer' },
      { topic: 'Vertraulichkeit', q: 'Nach welchem Prinzip werden vertrauliche Dealinformationen intern geteilt?', opts: ['Mit allen, immer', 'Kenntnis nur bei Bedarf', 'Oeffentlich', 'Mit Co-Investoren der Konkurrenz'], correct: 1, expl: 'Vertrauliche Informationen werden nach dem Prinzip Kenntnis nur bei Bedarf geteilt.', diff: 'leicht' },
      { topic: 'Korruption', q: 'Wo liegt die Grenze bei Geschenken und Einladungen?', opts: ['Es gibt keine Grenze', 'Wenn der Vorteil eine Entscheidung beeinflussen koennte oder diesen Anschein erweckt', 'Nur bei Bargeld', 'Erst ab sehr hohen Betraegen'], correct: 1, expl: 'Die Grenze ist erreicht, sobald ein Vorteil eine Entscheidung beeinflussen koennte oder diesen Anschein erweckt.', diff: 'mittel' },
    ],
  },
]

// --- Abgeschlossene Pruefungen (fuer realistische Nachweise) -----------------
// Bewusst NICHT alle Kurse fuer alle: ergibt eine realistische Compliance-Quote.
const COMPLETIONS: { userKey: string; courseKey: string; score: number }[] = [
  // Thomas Brunner (Managing Partner): breit abgedeckt
  { userKey: 'thomas', courseKey: 'p1', score: 96 },
  { userKey: 'thomas', courseKey: 'p3', score: 92 },
  { userKey: 'thomas', courseKey: 'p4', score: 88 },
  { userKey: 'thomas', courseKey: 'f1', score: 94 },
  { userKey: 'thomas', courseKey: 'c3', score: 90 },
  // Sofia Marti (Head of Operations & Compliance): Compliance-stark
  { userKey: 'sofia', courseKey: 'p1', score: 98 },
  { userKey: 'sofia', courseKey: 'p2', score: 94 },
  { userKey: 'sofia', courseKey: 'p3', score: 92 },
  { userKey: 'sofia', courseKey: 'c1', score: 90 },
  { userKey: 'sofia', courseKey: 'c2', score: 88 },
  // Lena Hofmann (Investment Principal)
  { userKey: 'lena', courseKey: 'p1', score: 90 },
  { userKey: 'lena', courseKey: 'p4', score: 86 },
  { userKey: 'lena', courseKey: 'f4', score: 92 },
  // Marco Keller (Program Manager)
  { userKey: 'marco', courseKey: 'v1', score: 100 },
  { userKey: 'marco', courseKey: 'p1', score: 84 },
  { userKey: 'marco', courseKey: 'p2', score: 82 },
  // David Frei (Legal & IP Counsel)
  { userKey: 'david', courseKey: 'p1', score: 94 },
  { userKey: 'david', courseKey: 'p3', score: 96 },
  { userKey: 'david', courseKey: 'f1', score: 98 },
  { userKey: 'david', courseKey: 'c1', score: 90 },
  // Nina Schaub (Venture Analyst, neu, mitten im Onboarding)
  { userKey: 'nina', courseKey: 'v1', score: 88 },
]

// --- Helfer ------------------------------------------------------------------
function uuid() { return randomUUID() }

function certNumber(): string {
  const year = new Date().getFullYear()
  const rand = Math.random().toString(36).slice(2, 10).toUpperCase()
  return 'KX-' + year + '-' + rand
}

function daysAgoIso(d: number): string {
  return new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString()
}

// Insert, der unbekannte Spalten automatisch entfernt und neu versucht.
// Schuetzt gegen kleine Schema-Abweichungen (v. a. optionale app_users-Felder).
async function insertResilient(admin: SupabaseClient, table: string, rows: any[]) {
  if (!rows || rows.length === 0) return { error: null as any, dropped: [] as string[] }
  let cur = rows.map(r => ({ ...r }))
  const dropped: string[] = []
  for (let i = 0; i < 15; i++) {
    const { error } = await admin.from(table).insert(cur)
    if (!error) return { error: null as any, dropped }
    const msg = (error as any).message || ''
    const m = msg.match(/find the '([^']+)' column/) || msg.match(/column "([^"]+)"/) || msg.match(/'([a-zA-Z0-9_]+)' column/)
    const col = m && m[1]
    if (col && cur[0] && Object.prototype.hasOwnProperty.call(cur[0], col)) {
      dropped.push(col)
      cur = cur.map(r => { const c = { ...r }; delete c[col]; return c })
      continue
    }
    return { error, dropped }
  }
  return { error: { message: 'Zu viele unbekannte Spalten in ' + table }, dropped }
}

async function deleteAuthUsersByEmail(admin: SupabaseClient, emails: string[]) {
  const targets = new Set(emails.map(e => e.toLowerCase()))
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 })
    if (error || !data || !data.users || data.users.length === 0) break
    for (const u of data.users) {
      if (u.email && targets.has(u.email.toLowerCase())) {
        try { await admin.auth.admin.deleteUser(u.id) } catch {}
      }
    }
    if (data.users.length < 200) break
  }
}

// --- Hauptlogik --------------------------------------------------------------
async function run(req: Request) {
  const url = new URL(req.url)
  const token = url.searchParams.get('token') || ''
  const expected = process.env.SEED_SECRET || FALLBACK_SECRET
  if (token !== expected) {
    return NextResponse.json({ error: 'Nicht autorisiert. Bitte ?token=... korrekt angeben.' }, { status: 401 })
  }

  let admin: SupabaseClient
  try { admin = getAdminClient() } catch {
    return NextResponse.json({ error: 'Server nicht konfiguriert (SUPABASE_SERVICE_ROLE_KEY fehlt).' }, { status: 503 })
  }

  const notes: string[] = []

  // 1) Aufraeumen (idempotent): Daten eines bestehenden Aurora-Mandanten entfernen.
  //    Der Mandant selbst wird WIEDERVERWENDET, nicht geloescht. Das vermeidet
  //    Konflikte mit Fremdschluesseln und mit dem eindeutigen Slug und macht die
  //    Route gefahrlos mehrfach aufrufbar.
  let tenantId = ''
  // Loeschreihenfolge: zuerst die Tabellen, die auf andere verweisen.
  const childTables = ['audit_log', 'certificates', 'exam_attempts', 'course_questions', 'course_modules', 'course_assignments', 'courses', 'roles', 'departments', 'app_users', 'onboarding_state', 'compliance_profiles', 'branding', 'company_profiles']
  const { data: existing } = await admin.from('tenants').select('id').eq('slug', TENANT_SLUG).maybeSingle()
  if (existing && (existing as any).id) {
    tenantId = (existing as any).id
    for (const t of childTables) { try { await admin.from(t).delete().eq('tenant_id', tenantId) } catch {} }
    notes.push('Bestehendes Aurora-Konto gefunden und vollstaendig neu aufgebaut (Mandant beibehalten).')
  } else {
    const { data: tenant, error: tErr } = await admin.from('tenants').insert({ slug: TENANT_SLUG, status: 'trial' }).select('id').single()
    if (tErr || !tenant) {
      return NextResponse.json({ error: 'Mandant konnte nicht angelegt werden: ' + (tErr?.message || 'unbekannt') }, { status: 500 })
    }
    tenantId = (tenant as any).id as string
  }

  // Auth-Benutzer immer entfernen und anschliessend frisch neu anlegen.
  await deleteAuthUsersByEmail(admin, TEAM.map(t => t.email))

  // 3) Profile, Branding, Onboarding (alle Schritte erledigt), Compliance
  const r1 = await insertResilient(admin, 'company_profiles', [{ tenant_id: tenantId, ...PROFILE }])
  if (r1.error) return NextResponse.json({ error: 'company_profiles: ' + r1.error.message }, { status: 500 })
  try { await admin.from('branding').insert({ tenant_id: tenantId }) } catch {}
  const obRow = { tenant_id: tenantId, step_profile: true, step_departments: true, step_compliance: true, step_courses: true, step_branding: true, step_users: true }
  const rOb = await insertResilient(admin, 'onboarding_state', [obRow])
  if (rOb.error) return NextResponse.json({ error: 'onboarding_state: ' + rOb.error.message }, { status: 500 })
  const rComp = await insertResilient(admin, 'compliance_profiles', [{ tenant_id: tenantId, ...COMPLIANCE }])
  if (rComp.error) return NextResponse.json({ error: 'compliance_profiles: ' + rComp.error.message }, { status: 500 })

  // 4) Abteilungen
  const deptIdByKey: Record<string, string> = {}
  const deptRows = DEPARTMENTS.map(d => { const id = uuid(); deptIdByKey[d.key] = id; return { id, tenant_id: tenantId, name: d.name, description: d.description } })
  const rDept = await insertResilient(admin, 'departments', deptRows)
  if (rDept.error) return NextResponse.json({ error: 'departments: ' + rDept.error.message }, { status: 500 })

  // 5) Rollen
  const roleRows = ROLES.map(r => ({ id: uuid(), tenant_id: tenantId, name: r.name, department_id: deptIdByKey[r.deptKey] || null, access_level: r.access_level }))
  const rRole = await insertResilient(admin, 'roles', roleRows)
  if (rRole.error) return NextResponse.json({ error: 'roles: ' + rRole.error.message }, { status: 500 })

  // 6) Auth-Benutzer + app_users
  const uidByKey: Record<string, string> = {}
  for (const member of TEAM) {
    const { data: created, error: uErr } = await admin.auth.admin.createUser({ email: member.email, password: DEMO_PASSWORD, email_confirm: true })
    if (uErr || !created?.user) {
      return NextResponse.json({ error: 'Benutzer konnte nicht angelegt werden (' + member.email + '): ' + (uErr?.message || 'unbekannt') }, { status: 500 })
    }
    uidByKey[member.key] = created.user.id
  }
  const thomasUid = uidByKey['thomas']
  const appUserRows = TEAM.map(m => ({
    id: uidByKey[m.key], tenant_id: tenantId, email: m.email, access_level: m.access_level, status: 'active',
    consent_at: new Date().toISOString(), full_name: m.full_name, position: m.position,
    department: (DEPARTMENTS.find(d => d.key === m.deptKey)?.name) || null, language: 'de',
  }))
  const rUsers = await insertResilient(admin, 'app_users', appUserRows)
  if (rUsers.error) return NextResponse.json({ error: 'app_users: ' + rUsers.error.message }, { status: 500 })
  if (rUsers.dropped.length) notes.push('app_users ohne optionale Felder angelegt: ' + Array.from(new Set(rUsers.dropped)).join(', ') + '.')

  // 7) Kurse + Module + Fragen
  const courseIdByKey: Record<string, string> = {}
  const courseTitleByKey: Record<string, string> = {}
  const courseRows: any[] = []
  const moduleRows: any[] = []
  const questionRows: any[] = []
  for (const c of COURSES) {
    const cid = uuid()
    courseIdByKey[c.key] = cid
    courseTitleByKey[c.key] = c.title
    courseRows.push({
      id: cid, tenant_id: tenantId, title: c.title, description: c.description, category: c.category,
      sector: c.sector, position: c.position, course_type: c.type, level: c.level, language: 'de',
      duration_min: c.duration, cert_prep: c.certPrep, external_cert: c.extCert, status: 'veroeffentlicht',
      ai_generated: false, created_by: thomasUid,
    })
    c.modules.forEach((m, i) => moduleRows.push({ id: uuid(), course_id: cid, tenant_id: tenantId, position: i + 1, title: m.title, content: m.content, module_type: 'lesson', duration_min: m.minutes }))
    c.questions.forEach((q, i) => questionRows.push({ id: uuid(), course_id: cid, tenant_id: tenantId, position: i + 1, topic: q.topic, question: q.q, options: q.opts, correct_index: q.correct, explanation: q.expl, difficulty: q.diff }))
  }
  const rCourses = await insertResilient(admin, 'courses', courseRows)
  if (rCourses.error) return NextResponse.json({ error: 'courses: ' + rCourses.error.message }, { status: 500 })
  const rMods = await insertResilient(admin, 'course_modules', moduleRows)
  if (rMods.error) return NextResponse.json({ error: 'course_modules: ' + rMods.error.message }, { status: 500 })
  const rQs = await insertResilient(admin, 'course_questions', questionRows)
  if (rQs.error) return NextResponse.json({ error: 'course_questions: ' + rQs.error.message }, { status: 500 })

  // 8) Abschluesse: Pruefungsversuche + Zertifikate (nicht kritisch)
  let attemptsOk = 0, certsOk = 0
  const attemptRows: any[] = []
  const certRows: any[] = []
  let dayOffset = 58
  for (const comp of COMPLETIONS) {
    const cid = courseIdByKey[comp.courseKey]
    const uid2 = uidByKey[comp.userKey]
    if (!cid || !uid2) continue
    const total = 5
    const correct = Math.max(0, Math.min(total, Math.round((comp.score / 100) * total)))
    const attemptId = uuid()
    const started = daysAgoIso(dayOffset)
    const completed = daysAgoIso(dayOffset)
    dayOffset = dayOffset > 3 ? dayOffset - 2 : 2
    attemptRows.push({ id: attemptId, tenant_id: tenantId, course_id: cid, user_id: uid2, mode: 'pruefung', total, correct, score: comp.score, passed: true, answers: [], duration_sec: 600 + (comp.score % 7) * 90, started_at: started, completed_at: completed })
    const member = TEAM.find(t => t.key === comp.userKey)
    certRows.push({ id: uuid(), tenant_id: tenantId, course_id: cid, user_id: uid2, attempt_id: attemptId, cert_number: certNumber(), title: courseTitleByKey[comp.courseKey], recipient_name: member?.full_name || null, score: comp.score, status: 'gueltig' })
  }
  try {
    const rAtt = await insertResilient(admin, 'exam_attempts', attemptRows)
    if (!rAtt.error) attemptsOk = attemptRows.length
    else notes.push('exam_attempts uebersprungen: ' + rAtt.error.message)
  } catch (e: any) { notes.push('exam_attempts uebersprungen: ' + (e?.message || 'Fehler')) }
  try {
    const rCert = await insertResilient(admin, 'certificates', certRows)
    if (!rCert.error) certsOk = certRows.length
    else notes.push('certificates uebersprungen: ' + rCert.error.message)
  } catch (e: any) { notes.push('certificates uebersprungen: ' + (e?.message || 'Fehler')) }

  // 9) Audit-Eintrag (nicht kritisch)
  try { await admin.from('audit_log').insert({ tenant_id: tenantId, actor_id: thomasUid, action: 'seed_demo_account', entity: 'tenant', entity_id: tenantId }) } catch {}

  return NextResponse.json({
    ok: true,
    mandant: { name: PROFILE.legal_name, slug: TENANT_SLUG, tenant_id: tenantId },
    angelegt: {
      mitarbeitende: TEAM.length, abteilungen: DEPARTMENTS.length, rollen: ROLES.length,
      kurse: COURSES.length, module: moduleRows.length, fragen: questionRows.length,
      pruefungen: attemptsOk, nachweise: certsOk,
    },
    login: {
      hinweis: 'Anmeldung ueber die App unter /anmelden. Alle Konten nutzen dasselbe Demo-Passwort.',
      passwort: DEMO_PASSWORD,
      admin_login: TEAM[0].email,
      alle_konten: TEAM.map(t => ({ email: t.email, name: t.full_name, rolle: t.position, zugriff: t.access_level })),
    },
    notizen: notes,
    wichtig: 'Reine Testdaten. Diese Seed-Route nach erfolgreichem Lauf wieder aus dem Repo entfernen.',
  })
}

export async function GET(req: Request) { return run(req) }
export async function POST(req: Request) { return run(req) }
