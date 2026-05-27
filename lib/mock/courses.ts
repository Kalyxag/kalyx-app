// ── KALYX Course Content & Quiz Data ─────────────────────────

export interface Module {
  id: string
  title: string
  duration: string
  content: string[]
  keypoints: string[]
  sources?: string[]
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct: number
  explanation: string
}

export interface CourseData {
  id: string
  emoji: string
  title: string
  subtitle: string
  regulation: string
  color: string
  bg: string
  duration: string
  passing_score: number
  modules: Module[]
  quiz: QuizQuestion[]
}

export const COURSES_DATA: Record<string, CourseData> = {
  'gwg-2025': {
    id: 'gwg-2025',
    emoji: '⚖️',
    title: 'Geldwäscherei-Prävention (GwG 2025)',
    subtitle: 'Pflichtschulung für Finanzintermediäre nach Art. 3 GwG',
    regulation: 'FINMA · GwG · AML · FATF',
    color: '#14613E',
    bg: '#E6F0EB',
    duration: '45 Min.',
    passing_score: 80,
    modules: [
      {
        id: 'm1',
        title: 'Grundlagen des Geldwäschereigesetzes',
        duration: '10 Min.',
        content: [
          'Das Schweizer Geldwäschereigesetz (GwG) vom 10. Oktober 1997 verpflichtet Finanzintermediäre, Massnahmen zur Bekämpfung von Geldwäscherei und Terrorismusfinanzierung zu ergreifen.',
          'Als Finanzintermediär bei Helvetia Finanz AG unterliegen Sie direkt den Anforderungen des GwG und den FINMA-Rundschreiben. Dies gilt für alle Personen, die berufsmässig fremde Vermögenswerte annehmen oder aufbewahren.',
          'Geldwäscherei ist das Einschleusen von illegal erworbenem Geld in den legalen Wirtschaftskreislauf. Das klassische Drei-Phasen-Modell umfasst Placement (Einspeisung), Layering (Verschleierung) und Integration (Einschleusung).',
          'Die FATF (Financial Action Task Force) setzt die internationalen Standards. Die Schweiz ist Vollmitglied der FATF und hat deren 40 Empfehlungen in nationales Recht umgesetzt.',
        ],
        keypoints: [
          'GwG gilt für alle Finanzintermediäre — auch für Sie persönlich',
          'Drei Phasen: Placement → Layering → Integration',
          'FATF-Mitgliedschaft der Schweiz seit 1990',
          'Verstösse können zu Freiheitsstrafen bis 3 Jahre führen (Art. 305bis StGB)',
        ],
        sources: [
          'Bundesgesetz über die Bekämpfung der Geldwäscherei und der Terrorismusfinanzierung (GwG), SR 955.0 — admin.ch/fedlex',
          'FATF. 40 Recommendations on Money Laundering. Paris: FATF/OECD, 2012 (rev. 2023) — fatf-gafi.org',
          'FINMA. Rundschreiben 2011/1 «Tätigkeit als Finanzintermediär nach GwG». Bern: FINMA, 2011 — finma.ch',
        ],
      },
      {
        id: 'm2',
        title: 'Sorgfaltspflichten und Kundendokumentation',
        duration: '12 Min.',
        content: [
          'Art. 3 GwG verpflichtet Sie zur Identifizierung des Vertragspartners. Bei natürlichen Personen sind Kopien amtlicher Ausweise zu erstellen und aufzubewahren. Bei juristischen Personen sind Handelsregisterauszüge einzuholen.',
          'Die wirtschaftlich berechtigte Person (WB) muss gemäss Art. 4 GwG identifiziert werden, wenn sie nicht mit dem Vertragspartner identisch ist. Als WB gilt, wer letztendlich die wirtschaftliche Kontrolle über die Vermögenswerte ausübt.',
          'Das Formular A (Erklärung über den wirtschaftlich Berechtigten) ist bei allen Vermögenswerten über CHF 25\'000 einzuholen. Bei Trusts und ähnlichen Konstrukten ist immer das Formular T zu verwenden.',
          'Die Dokumentationspflicht beträgt 10 Jahre nach Beendigung der Geschäftsbeziehung. Alle Unterlagen müssen so geführt werden, dass sie für FINMA-Prüfer jederzeit zugänglich sind.',
        ],
        keypoints: [
          'Identifikationspflicht: Ausweis + Handelsregisterauszug',
          'Wirtschaftlich Berechtigter: Formular A ab CHF 25\'000',
          'Aufbewahrungsfrist: 10 Jahre nach Geschäftsende',
          'Formular T bei Trust-Strukturen zwingend',
        ],
      },
      {
        id: 'm3',
        title: 'PEP-Identifikation und Enhanced Due Diligence',
        duration: '12 Min.',
        content: [
          'Politisch exponierte Personen (PEP) sind Personen, die wichtige öffentliche Ämter ausüben oder ausgeübt haben. Dazu gehören Staats- und Regierungschefs, Minister, hohe Richter, Botschafter sowie deren unmittelbare Familienangehörigen.',
          'Bei PEP-Kunden sind verstärkte Sorgfaltspflichten anzuwenden (Art. 6 GwG). Dies bedeutet: Genehmigung durch Senior Management, Klärung der Herkunft der Vermögenswerte und verstärkte laufende Überwachung der Geschäftsbeziehung.',
          'Enhanced Due Diligence (EDD) ist auch bei Ländern mit hohem Geldwäschereirisiko erforderlich. Die FATF veröffentlicht regelmässig Listen von Ländern mit strategischen Mängeln (Grey List und Black List).',
          'Transaktionen mit Ländern auf der FATF-Schwarzen Liste (aktuell: DVRK, Iran) sind grundsätzlich zu verweigern. Bei Grey-List-Ländern sind verstärkte Massnahmen anzuwenden.',
        ],
        keypoints: [
          'PEP = wichtige öffentliche Ämter + Familie + enge Vertraute',
          'EDD: Senior Management Genehmigung erforderlich',
          'FATF Black List: Iran, DVRK — keine Transaktionen',
          'PEP-Status bleibt 12 Monate nach Amtsaustritt bestehen',
        ],
      },
      {
        id: 'm4',
        title: 'Meldepflicht und Transaktionsüberwachung',
        duration: '11 Min.',
        content: [
          'Art. 9 GwG begründet die Meldepflicht: Besteht der begründete Verdacht, dass Vermögenswerte aus einem Verbrechen stammen oder der Terrorismusfinanzierung dienen, MUSS unverzüglich an die MROS (Money Reporting Office Switzerland) gemeldet werden.',
          'Die Meldepflicht hat Vorrang vor dem Bankkundengeheimnis. Gleichzeitig besteht ein Verbot, den Kunden oder Dritte über die Meldung zu informieren (Tipping-off-Verbot nach Art. 10a GwG).',
          'Bei einer Verdachtsmeldung sind die betroffenen Vermögenswerte zu sperren (Art. 10 GwG). Diese Sperre dauert 5 Arbeitstage. Danach kann MROS eine Verlängerung beantragen.',
          'Indikatoren für verdächtige Transaktionen: Ungewöhnliche Bargeldtransaktionen, häufige Überweisungen an Offshore-Gesellschaften, Transaktionen ohne erkennbaren wirtschaftlichen Sinn, plötzliche Veränderungen des Transaktionsverhaltens.',
        ],
        keypoints: [
          'Meldepflicht an MROS — nicht freiwillig, sondern obligatorisch',
          'Tipping-off-Verbot: Kunden dürfen NICHT informiert werden',
          'Vermögenssperre: 5 Arbeitstage bei Verdacht',
          'MROS: goaml.admin.ch — elektronische Meldung',
        ],
        sources: [
          'Art. 9–10a GwG (SR 955.0): Meldepflicht, Sperrpflicht, Tipping-off-Verbot — admin.ch/fedlex',
          'MROS (fedpol). Jahresbericht 2023. Bern: fedpol, 2024 — fedpol.admin.ch/mros',
          'Basel Institute on Governance. Basel AML Index 2023. Basel: Basel Institute, 2023 — baselgovernance.org',
        ],
      },
    ],
    quiz: [
      { id: 'q1', question: 'Was versteht man unter "Layering" im Geldwäscherei-Prozess?', options: ['Einspeisung von Bargeld in den Finanzkreislauf', 'Verschleierung der Herkunft durch komplexe Transaktionen', 'Integration in die legale Wirtschaft', 'Identifikation des wirtschaftlich Berechtigten'], correct: 1, explanation: 'Layering (Verschleierung) ist die zweite Phase: Durch komplexe Transaktionsketten wird die Herkunft des Geldes verschleiert.' },
      { id: 'q2', question: 'Ab welchem Betrag muss bei Helvetia Finanz AG das Formular A eingeholt werden?', options: ['CHF 10\'000', 'CHF 15\'000', 'CHF 25\'000', 'CHF 50\'000'], correct: 2, explanation: 'Gemäss Art. 4 GwG ist das Formular A (Erklärung wirtschaftlich Berechtigter) ab CHF 25\'000 zwingend einzuholen.' },
      { id: 'q3', question: 'Was ist das "Tipping-off-Verbot"?', options: ['Verbot, Trinkgelder anzunehmen', 'Verbot, den Kunden über eine MROS-Meldung zu informieren', 'Verbot, Bargeld entgegenzunehmen', 'Verbot, PEP-Kunden zu akzeptieren'], correct: 1, explanation: 'Art. 10a GwG verbietet es, den Kunden oder Dritte über eine erstattete Verdachtsmeldung zu informieren.' },
      { id: 'q4', question: 'Wie lange dauert die gesetzliche Dokumentationsaufbewahrungsfrist?', options: ['5 Jahre', '7 Jahre', '10 Jahre', '15 Jahre'], correct: 2, explanation: 'Gemäss Art. 7 GwG beträgt die Aufbewahrungsfrist 10 Jahre nach Beendigung der Geschäftsbeziehung.' },
      { id: 'q5', question: 'Welche Aussage über PEP ist korrekt?', options: ['PEP-Status endet sofort nach Amtsaustritt', 'Nur Staatschefs gelten als PEP', 'PEP-Status bleibt 12 Monate nach Amtsaustritt', 'Familienangehörige sind keine PEP'], correct: 2, explanation: 'Der PEP-Status bleibt nach internationalem Standard (FATF) mindestens 12 Monate nach Amtsaustritt bestehen.' },
      { id: 'q6', question: 'Was muss bei einer Verdachtsmeldung SOFORT erfolgen?', options: ['Kontakt mit dem Kunden aufnehmen', 'Vermögenswerte sperren und MROS informieren', 'Vorgesetzten informieren und abwarten', 'Konto auflösen'], correct: 1, explanation: 'Art. 9/10 GwG: Bei begründetem Verdacht sind Vermögenswerte sofort zu sperren und unverzüglich an MROS zu melden.' },
      { id: 'q7', question: 'Wofür steht MROS?', options: ['Money Routing Office Switzerland', 'Money Reporting Office Switzerland', 'Monetary Risk Oversight Switzerland', 'Multi-Risk Office Switzerland'], correct: 1, explanation: 'MROS = Money Reporting Office Switzerland, die schweizerische Meldestelle für Geldwäscherei beim fedpol.' },
      { id: 'q8', question: 'Transaktionen mit welchem Land sind grundsätzlich zu verweigern?', options: ['Russland', 'China', 'Iran', 'Türkei'], correct: 2, explanation: 'Iran steht auf der FATF Black List. Transaktionen mit Black-List-Ländern sind grundsätzlich zu verweigern.' },
      { id: 'q9', question: 'Was ist Enhanced Due Diligence (EDD) bei PEP-Kunden?', options: ['Vereinfachte Prüfung', 'Normale Standardprüfung', 'Verstärkte Prüfung mit Senior Management Genehmigung', 'Automatische Ablehnung'], correct: 2, explanation: 'Bei PEP-Kunden ist EDD anzuwenden: Genehmigung durch Senior Management, Klärung der Vermögensherkunft, laufende Überwachung.' },
      { id: 'q10', question: 'Wie lange dauert die Vermögenssperre bei einer Verdachtsmeldung initial?', options: ['1 Arbeitstag', '3 Arbeitstage', '5 Arbeitstage', '10 Arbeitstage'], correct: 2, explanation: 'Art. 10 GwG: Die Vermögenssperre bei einer Verdachtsmeldung dauert initial 5 Arbeitstage. MROS kann eine Verlängerung beantragen.' },
    ],
  },

  'dsgvo-dsg': {
    id: 'dsgvo-dsg',
    emoji: '🔒',
    title: 'Datenschutz DSGVO & DSG 2025',
    subtitle: 'EU-DSGVO und revidiertes Schweizer Datenschutzgesetz',
    regulation: 'DSGVO · DSG 2023 · EDÖB',
    color: '#3A6DB5',
    bg: '#EAF0FA',
    duration: '30 Min.',
    passing_score: 75,
    modules: [
      { id: 'm1', title: 'Grundsätze der DSGVO', duration: '8 Min.', content: ['Die DSGVO gilt seit 25. Mai 2018 und schützt personenbezogene Daten von EU-Bürgern. Als Schweizer Unternehmen mit EU-Kundenkontakten unterliegt Helvetia Finanz AG der DSGVO.', 'Art. 5 DSGVO definiert die 7 Grundsätze: Rechtmässigkeit, Transparenz, Zweckbindung, Datenminimierung, Richtigkeit, Speicherbegrenzung und Integrität/Vertraulichkeit.', 'Personenbezogene Daten sind alle Informationen, die sich auf eine identifizierte oder identifizierbare natürliche Person beziehen. Dazu gehören Name, E-Mail, IP-Adressen, Standortdaten und Online-Kennungen.'], keypoints: ['7 Grundsätze Art. 5 DSGVO auswendig kennen', 'Gilt auch für CH-Unternehmen mit EU-Kundenkontakt', 'Besondere Kategorien: Gesundheit, Religion, politische Meinung'] },
      { id: 'm2', title: 'Betroffenenrechte', duration: '7 Min.', content: ['Betroffene haben folgende Rechte: Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21).', 'Das Recht auf Löschung ("Recht auf Vergessenwerden") gilt nicht absolut. Ausnahmen bestehen für rechtliche Verpflichtungen, öffentliche Interessen und Archivzwecke.', 'Anfragen von Betroffenen müssen innerhalb von 30 Tagen beantwortet werden. Bei komplexen Anfragen ist eine Verlängerung um weitere 60 Tage möglich.'], keypoints: ['Auskunftsrecht: Frist 30 Tage', 'Löschrecht hat Ausnahmen (gesetzliche Aufbewahrungspflichten)', 'Datenübertragbarkeit: maschinenlesbares Format'] },
      { id: 'm3', title: '72-Stunden Meldepflicht', duration: '8 Min.', content: ['Art. 33 DSGVO: Bei einer Datenpanne, die zu einem Risiko für die Rechte und Freiheiten natürlicher Personen führt, muss die zuständige Aufsichtsbehörde innerhalb von 72 Stunden informiert werden.', 'Zuständige Behörde für die Schweiz: Der Eidgenössische Datenschutz- und Öffentlichkeitsbeauftragte (EDÖB). In der EU die jeweilige nationale Datenschutzbehörde.', 'Bei hohem Risiko für Betroffene müssen auch diese unverzüglich informiert werden (Art. 34 DSGVO). Ein hohes Risiko liegt z.B. bei Identitätsdiebstahl oder finanziellen Schäden vor.'], keypoints: ['72 Stunden — ab Bekanntwerden der Panne', 'Meldung an EDÖB (CH) oder nationale Behörde (EU)', 'Betroffene informieren bei hohem Risiko'] },
      { id: 'm4', title: 'Schweizer DSG 2023', duration: '7 Min.', content: ['Das revidierte Datenschutzgesetz (DSG) ist am 1. September 2023 in Kraft getreten. Es bringt das Schweizer Recht auf DSGVO-Niveau und ersetzt das DSG von 1992.', 'Wichtige Neuerungen: Datenschutz-Folgeabschätzung (DSFA) bei hohem Risiko, Meldepflicht bei Datenpannen an EDÖB, Privacy by Design und Privacy by Default.', 'Sanktionen: Das DSG 2023 sieht Bussen von bis zu CHF 250\'000 für natürliche Personen vor (nicht Unternehmen). Dies unterscheidet sich von der DSGVO, wo Unternehmen direkt gebüsst werden.'], keypoints: ['In Kraft seit 1. September 2023', 'DSFA bei hochriskanten Verarbeitungen', 'Busse bis CHF 250\'000 (natürliche Personen)'] },
    ],
    quiz: [
      { id: 'q1', question: 'Welcher DSGVO-Grundsatz besagt, dass nur notwendige Daten erhoben werden dürfen?', options: ['Zweckbindung', 'Datenminimierung', 'Transparenz', 'Richtigkeit'], correct: 1, explanation: 'Art. 5 Abs. 1 lit. c DSGVO: Das Prinzip der Datenminimierung besagt, dass nur die für den Zweck notwendigen Daten erhoben werden dürfen.' },
      { id: 'q2', question: 'Innerhalb welcher Frist muss eine Datenpanne der Behörde gemeldet werden?', options: ['24 Stunden', '48 Stunden', '72 Stunden', '7 Tage'], correct: 2, explanation: 'Art. 33 DSGVO: Datenpannen müssen innerhalb von 72 Stunden ab Bekanntwerden gemeldet werden.' },
      { id: 'q3', question: 'Wann ist das revidierte Schweizer DSG in Kraft getreten?', options: ['1. Januar 2023', '1. Juni 2023', '1. September 2023', '1. Januar 2024'], correct: 2, explanation: 'Das revidierte DSG ist am 1. September 2023 in Kraft getreten.' },
      { id: 'q4', question: 'Wie lange haben Unternehmen für die Beantwortung von Auskunftsanfragen?', options: ['14 Tage', '30 Tage', '60 Tage', '90 Tage'], correct: 1, explanation: 'Art. 12 DSGVO: Auskunftsanfragen müssen grundsätzlich innerhalb von 30 Tagen beantwortet werden.' },
      { id: 'q5', question: 'Welche Höchstbusse sieht das Schweizer DSG 2023 vor?', options: ['CHF 50\'000', 'CHF 100\'000', 'CHF 250\'000', 'CHF 1\'000\'000'], correct: 2, explanation: 'Das revidierte DSG sieht Bussen von bis zu CHF 250\'000 für natürliche Personen vor.' },
      { id: 'q6', question: 'Was bedeutet "Privacy by Design"?', options: ['Datenschutz nach dem Design', 'Datenschutz von Anfang an eingebaut', 'Designschutz für Daten', 'Verschlüsselung aller Designs'], correct: 1, explanation: 'Privacy by Design bedeutet, Datenschutz bereits bei der Entwicklung von Systemen und Prozessen zu berücksichtigen.' },
      { id: 'q7', question: 'An welche Behörde muss in der Schweiz eine Datenpanne gemeldet werden?', options: ['FINMA', 'SECO', 'EDÖB', 'Bundesrat'], correct: 2, explanation: 'Der Eidgenössische Datenschutz- und Öffentlichkeitsbeauftragte (EDÖB) ist die zuständige Aufsichtsbehörde in der Schweiz.' },
      { id: 'q8', question: 'Was ist das "Recht auf Vergessenwerden"?', options: ['Recht auf Anonymisierung', 'Recht auf Datenlöschung (Art. 17 DSGVO)', 'Recht auf Datenverschlüsselung', 'Recht auf Datenspeicherung'], correct: 1, explanation: 'Das Recht auf Löschung ("Recht auf Vergessenwerden") ist in Art. 17 DSGVO geregelt und gilt mit gewissen Einschränkungen.' },
      { id: 'q9', question: 'Bei welchem Risiko müssen auch Betroffene über eine Datenpanne informiert werden?', options: ['Niedrigem Risiko', 'Mittlerem Risiko', 'Hohem Risiko', 'Immer'], correct: 2, explanation: 'Art. 34 DSGVO: Betroffene sind bei hohem Risiko für ihre Rechte und Freiheiten unverzüglich zu informieren.' },
      { id: 'q10', question: 'Gilt die DSGVO für Schweizer Unternehmen?', options: ['Nie', 'Immer', 'Wenn EU-Bürger betroffen sind', 'Nur bei mehr als 50 Mitarbeitenden'], correct: 2, explanation: 'Das Marktortprinzip (Art. 3 DSGVO): Die DSGVO gilt auch für Schweizer Unternehmen, wenn sie Waren/Dienstleistungen an EU-Bürger anbieten.' },
    ],
  },

  'iso-27001': {
    id: 'iso-27001',
    emoji: '🛡️',
    title: 'Informationssicherheit & Cyberrisiken',
    subtitle: 'ISO 27001 Awareness und praktische Cybersicherheit',
    regulation: 'ISO 27001:2022 · NIST · BSI',
    color: '#B8904A',
    bg: '#F8F1E4',
    duration: '35 Min.',
    passing_score: 70,
    modules: [
      { id: 'm1', title: 'CIA-Triad und Grundkonzepte', duration: '9 Min.', content: ['Die CIA-Triad bildet das Fundament der Informationssicherheit: Confidentiality (Vertraulichkeit), Integrity (Integrität) und Availability (Verfügbarkeit).', 'ISO 27001:2022 ist der internationale Standard für Informationssicherheits-Managementsysteme (ISMS). Bei Helvetia Finanz AG leiten sich unsere Sicherheitsrichtlinien aus diesem Standard ab.', 'Ein Informationssicherheits-Vorfall liegt vor, wenn die CIA-Triad verletzt wird: unbefugter Zugriff (Vertraulichkeit), Datenmanipulation (Integrität) oder Systemausfall (Verfügbarkeit).'], keypoints: ['CIA = Confidentiality, Integrity, Availability', 'ISO 27001:2022 als Grundlage', 'Jeden Vorfall sofort dem IT-Security Team melden'] },
      { id: 'm2', title: 'Phishing und Social Engineering', duration: '9 Min.', content: ['Phishing ist der häufigste Angriffsvector: Angreifer versuchen über gefälschte E-Mails oder Websites, Zugangsdaten zu stehlen. 91% aller Cyberangriffe beginnen mit einer Phishing-Mail.', 'Warnsignale: Dringlichkeit ("Sofortiger Handlungsbedarf"), generische Anrede, verdächtige Absenderadresse, Links die nicht zur angezeigten URL passen, Anhänge von unbekannten Absendern.', 'Social Engineering geht weiter als Phishing: Angreifer manipulieren Menschen, um Zugang zu Informationen oder Systemen zu erhalten. Vishing (Voice Phishing) und Smishing (SMS Phishing) nehmen zu.'], keypoints: ['NIE auf verdächtige Links klicken', 'Absenderadresse immer prüfen (nicht nur Absendername)', 'Verdächtige E-Mails sofort an security@helvetia-finanz.ch melden'] },
      { id: 'm3', title: 'Passwörter, MFA und Zugangssicherheit', duration: '9 Min.', content: ['Starke Passwörter: Mindestens 12 Zeichen, Kombination aus Gross-/Kleinbuchstaben, Zahlen und Sonderzeichen. Keine Wiederverwendung von Passwörtern. Passwort-Manager sind empfohlen.', 'Multi-Faktor-Authentifizierung (MFA) ist bei allen kritischen Systemen Pflicht. MFA kombiniert etwas, das Sie wissen (Passwort), mit etwas, das Sie haben (Token/App) oder sind (Biometrie).', 'Zero Trust Prinzip: Kein Gerät und kein Benutzer wird automatisch als vertrauenswürdig eingestuft — auch intern nicht. Jeder Zugriff wird verifiziert.'], keypoints: ['12+ Zeichen, kein Passwort-Recycling', 'MFA aktivieren — überall wo möglich', 'Zero Trust: Vertraue niemandem ohne Verifikation'] },
      { id: 'm4', title: 'Incident Response und Meldepflichten', duration: '8 Min.', content: ['Bei einem Sicherheitsvorfall gilt: Ruhe bewahren, sofort melden, nichts löschen. Beweise sichern ist wichtiger als sofortige Behebung. Der IT-Security Incident Response Plan definiert die genauen Schritte.', 'Meldekette bei Helvetia Finanz AG: Sofort an security@helvetia-finanz.ch + Direktvorgesetzten. Bei schwerem Vorfall direkter Anruf an IT-Hotline. Keine eigenständige Kommunikation nach aussen.', 'Ransomware: Bei Verschlüsselung sofort Netzwerkverbindung trennen (Kabel ziehen), IT-Security informieren, NICHTS auf dem betroffenen System machen. Keine Lösegeldzahlung ohne Genehmigung.'], keypoints: ['SOFORT melden — Beweise nicht vernichten', 'Bei Ransomware: Netzwerk trennen', 'Meldekette: security@helvetia-finanz.ch + Vorgesetzter'] },
    ],
    quiz: [
      { id: 'q1', question: 'Was steht "I" in der CIA-Triad?', options: ['Intelligence', 'Integrity', 'Integration', 'Infrastructure'], correct: 1, explanation: 'CIA = Confidentiality (Vertraulichkeit), Integrity (Integrität), Availability (Verfügbarkeit).' },
      { id: 'q2', question: 'Welcher Prozentsatz aller Cyberangriffe beginnt mit Phishing?', options: ['45%', '67%', '91%', '99%'], correct: 2, explanation: 'Studien zeigen, dass ca. 91% aller Cyberangriffe mit einer Phishing-E-Mail beginnen.' },
      { id: 'q3', question: 'Was soll man bei einer verdächtigen E-Mail ZUERST tun?', options: ['Link anklicken um zu prüfen', 'E-Mail löschen', 'An security@helvetia-finanz.ch weiterleiten', 'Kollegen informieren'], correct: 2, explanation: 'Verdächtige E-Mails sofort an das Security-Team weiterleiten — niemals Links anklicken oder Anhänge öffnen.' },
      { id: 'q4', question: 'Was bedeutet MFA?', options: ['Multi-Function Application', 'Multi-Factor Authentication', 'Managed Firewall Architecture', 'Mobile Fraud Alert'], correct: 1, explanation: 'MFA = Multi-Factor Authentication: Kombination aus Wissen (Passwort), Besitz (Token) und/oder Biometrie.' },
      { id: 'q5', question: 'Was ist das "Zero Trust" Prinzip?', options: ['Alle externen Verbindungen blockieren', 'Kein Gerät/Benutzer ohne Verifikation vertrauen', 'Zero Toleranz für Sicherheitsverstösse', 'Null Passwörter verwenden'], correct: 1, explanation: 'Zero Trust: Kein Gerät und kein Benutzer wird automatisch als vertrauenswürdig eingestuft — jeder Zugriff wird verifiziert.' },
      { id: 'q6', question: 'Was ist die ERSTE Massnahme bei einem Ransomware-Angriff?', options: ['Lösegeld zahlen', 'IT anrufen und abwarten', 'Netzwerkverbindung sofort trennen', 'Alle Dateien kopieren'], correct: 2, explanation: 'Bei Ransomware sofort die Netzwerkverbindung trennen (Kabel ziehen) um weitere Ausbreitung zu verhindern.' },
      { id: 'q7', question: 'Welche Mindestlänge wird für Passwörter empfohlen?', options: ['6 Zeichen', '8 Zeichen', '10 Zeichen', '12 Zeichen'], correct: 3, explanation: 'Empfohlen werden mindestens 12 Zeichen mit Kombination aus Gross-/Kleinbuchstaben, Zahlen und Sonderzeichen.' },
      { id: 'q8', question: 'Was ist "Vishing"?', options: ['Visuelles Phishing', 'Voice Phishing (Telefon)', 'Video Phishing', 'Virus Phishing'], correct: 1, explanation: 'Vishing = Voice Phishing: Angreifer rufen per Telefon an und geben sich als vertrauenswürdige Person aus.' },
      { id: 'q9', question: 'Welcher ISO-Standard regelt Informationssicherheits-Managementsysteme?', options: ['ISO 9001', 'ISO 14001', 'ISO 27001', 'ISO 31000'], correct: 2, explanation: 'ISO 27001:2022 ist der internationale Standard für Informationssicherheits-Managementsysteme (ISMS).' },
      { id: 'q10', question: 'Was bedeutet "Integrity" in der CIA-Triad?', options: ['Daten sind verschlüsselt', 'Daten sind korrekt und unverändert', 'Daten sind immer verfügbar', 'Daten sind gesichert'], correct: 1, explanation: 'Integrity (Integrität): Daten sind korrekt, vollständig und unverändert — keine unbefugte Manipulation hat stattgefunden.' },
    ],
  },
}

// ── RAUMPLANUNG KURSE — MetroPlan Zürich ─────────────────────

const RAUMPLANUNG_COURSES: Record<string, CourseData> = {
  'rpg2-2026': {
    id: 'rpg2-2026',
    emoji: '🗺️',
    title: 'RPG 2 — Bauen ausserhalb der Bauzonen (2026)',
    subtitle: 'Zweite Teilrevision des Raumplanungsgesetzes — in Kraft ab 1.1.2026',
    regulation: 'RPG · RPV · ARE · EspaceSuisse',
    color: '#1B4F72',
    bg: '#D6EAF8',
    duration: '50 Min.',
    passing_score: 80,
    modules: [
      {
        id: 'm1',
        title: 'Hintergrund und Ziele der RPG 2-Revision',
        duration: '12 Min.',
        content: [
          'Das Parlament hat am 29. September 2023 die zweite Teilrevision des Raumplanungsgesetzes (RPG 2) verabschiedet. Am 1. Januar 2026 trat der erste Teil in Kraft, die Bestimmungen zum Bauen ausserhalb der Bauzonen folgen per 1. Juli 2026.',
          'Herzstück der Revision ist das sogenannte Stabilisierungsziel: Die Anzahl Gebäude und die versiegelte Fläche ausserhalb der Bauzonen sollen stabilisiert werden. Damit will der Bund der Zersiedelung entgegenwirken und einen haushälterischen Umgang mit dem Boden sichern.',
          'Die RPG 2 führt ein Kontingentsystem ein: Für neue Gebäude ausserhalb der Bauzonen wird ein Kontingent festgelegt. Bereits wurden pro Jahr rund 70 zusätzliche Gebäude bewilligt — bei gleichbleibendem Wachstum würde das Kontingent in etwa 30 Jahren aufgebraucht.',
          'Als Planerin bei MetroPlan Zürich sind Sie direkt von der RPG 2 betroffen: Regionale Richtpläne, Nutzungsplanungen und Stellungnahmen müssen die neuen Anforderungen vollumfänglich berücksichtigen.',
        ],
        keypoints: [
          'RPG 2 in Kraft: 1.1.2026 (Teil 1) und 1.7.2026 (Bauen ausserhalb Bauzonen)',
          'Stabilisierungsziel = Herzstück der Revision',
          'Kontingent für neue Gebäude ausserhalb Bauzonen',
          'Kantone müssen Stabilisierungsstrategien erarbeiten',
        ],
        sources: [
          'Bundesgesetz über die Raumplanung (RPG) rev. 2. Parlamentarische Abstimmung 29. September 2023 — admin.ch/fedlex',
          'ARE. Erläuterungen zur revidierten RPV 2025. Bern: Bundesamt für Raumentwicklung, 2025 — are.admin.ch',
          'EspaceSuisse. RPG 2: Revidiertes Raumplanungsrecht in Kraft. Basel: EspaceSuisse, Januar 2026 — espacesuisse.ch',
        ],
      },
      {
        id: 'm2',
        title: 'Der neue Gebietsansatz und Richtplanung',
        duration: '13 Min.',
        content: [
          'Die RPG 2 führt den sogenannten Gebietsansatz ein — ein freiwilliges Instrument für Kantone, das eine koordinierte Entwicklung von Gebieten ausserhalb der Bauzonen ermöglicht. Der Kanton Bern hat bereits angekündigt, dieses Instrument nutzen zu wollen.',
          'Die kantonalen Richtpläne müssen bis Ende 2029 an die Anforderungen der RPG 2 angepasst werden. Die «Ergänzung des Leitfadens Richtplanung zu RPG 2» des ARE gibt den Kantonen dabei konkrete Vorgaben.',
          'Für die regionale Planung bedeutet dies: Bestehende Richtplaninhalte müssen auf Konformität mit den neuen Stabilisierungszielen geprüft werden. Raumkonzepte, Siedlungsleitbilder und Entwicklungsschwerpunkte sind entsprechend anzupassen.',
          'Die RPV-Revision vom 15. Oktober 2025 präzisiert die Anforderungen an kantonale und kommunale Planungen. Insbesondere die Regelungen zu Fruchtfolgeflächen (FFF) wurden verschärft: Änderungen von mehr als 3 Hektaren müssen dem Bundesamt für Landwirtschaft (BLW) gemeldet werden.',
        ],
        keypoints: [
          'Gebietsansatz: freiwilliges kantonales Instrument',
          'Richtplananpassung Frist: bis Ende 2029',
          'ARE Leitfaden Richtplanung zu RPG 2 beachten',
          'FFF-Meldepflicht: Änderungen > 3 ha an BLW',
        ],
      },
      {
        id: 'm3',
        title: 'Nutzungsplanung und kommunale Auswirkungen',
        duration: '13 Min.',
        content: [
          'Auf kommunaler Ebene müssen Zonenreglemente und Bau- und Zonenordnungen (BZO) im Einklang mit der revidierten kantonalen Richtplanung stehen. Gemeinden haben nach Genehmigung des kantonalen Richtplans eine Frist von 5 Jahren für die Anpassung ihrer Nutzungspläne.',
          'Bestehende Auszonungspflichten aus RPG 1 (2014) bleiben bestehen und werden durch RPG 2 ergänzt. Überdimensionierte Bauzonen müssen weiterhin rückgezont werden. Die RPG 2 verschärft zusätzlich die Anforderungen für Einzonungen.',
          'Für Planungen in der Agglomeration Zürich gilt: Der kantonale Richtplan Zürich und der Agglomerationsplan sind die übergeordneten Instrumente. Regionale Planungen müssen in diesem Rahmen koordiniert werden.',
          'Die Mehrwertabgabe (Art. 5 RPG) bleibt ein zentrales Instrument. Bei Planungsmehrwerten durch Einzonungen ist weiterhin eine Abgabe von mindestens 20% zu erheben. Die Mittel sind zweckgebunden für Massnahmen zur Freihaltung und Aufwertung des Kulturlands einzusetzen.',
        ],
        keypoints: [
          'BZO-Anpassungsfrist: 5 Jahre nach Richtplangenehmigung',
          'Auszonungspflichten aus RPG 1 bleiben bestehen',
          'Mehrwertabgabe: mindestens 20% bei Einzonungen',
          'Koordination mit kantonalem Richtplan Zürich zwingend',
        ],
      },
      {
        id: 'm4',
        title: 'Erneuerbare Energien und neue Spielräume',
        duration: '12 Min.',
        content: [
          'Die RPG 2 schafft neue Möglichkeiten für erneuerbare Energien ausserhalb der Bauzonen. Insbesondere Solaranlagen auf bestehenden Gebäuden und Infrastrukturen werden erleichtert. Die RPV darf die Nutzung von Sonnenenergie auf Dächern nicht stärker einschränken als Art. 1 RPG es erlaubt.',
          'Für Planungsbüros wie MetroPlan Zürich entstehen neue Aufgaben: Die Beratung von Gemeinden und Kantonen bei der Umsetzung der RPG 2, die Erarbeitung von Stabilisierungsstrategien und die Überprüfung bestehender Pläne auf Konformität.',
          'Die Koordinationspflicht zwischen raumrelevanten Bundesaufgaben (Sachpläne SIL, SIS etc.) und kantonaler Richtplanung wird durch die KoVo (Koordinationsverordnung) präzisiert. Als Projektleiterin müssen Sie diese Abstimmungsprozesse kennen und aktiv einfordern.',
          'Rechtsbehelfe: Bei Konflikten zwischen kommunalen Nutzungsplänen und kantonalen Richtplänen entscheidet letztlich das Bundesgericht. Die RPG 2 hat die Standortgebundenheit als Voraussetzung für Bauten ausserhalb der Bauzonen verschärft.',
        ],
        keypoints: [
          'Solaranlagen auf Bestandsgebäuden: erleichtert',
          'Neue Beratungsaufgaben für Planungsbüros',
          'KoVo: Koordination Sachpläne und Richtplanung',
          'Standortgebundenheit verschärft',
        ],
      },
    ],
    quiz: [
      { id: 'q1', question: 'Wann ist der erste Teil der RPG 2 in Kraft getreten?', options: ['1. September 2023', '1. Januar 2025', '1. Januar 2026', '1. Juli 2026'], correct: 2, explanation: 'Der erste Teil der RPG 2 trat am 1. Januar 2026 in Kraft. Die Bestimmungen zum Bauen ausserhalb der Bauzonen folgen per 1. Juli 2026.' },
      { id: 'q2', question: 'Was ist das "Herzstück" der RPG 2-Revision?', options: ['Der Gebietsansatz', 'Das Stabilisierungsziel', 'Die Mehrwertabgabe', 'Die Auszonungspflicht'], correct: 1, explanation: 'Das Stabilisierungsziel — Stabilisierung der Gebäudeanzahl und versiegelter Flächen ausserhalb der Bauzonen — ist das Herzstück der RPG 2.' },
      { id: 'q3', question: 'Bis wann müssen kantonale Richtpläne an RPG 2 angepasst werden?', options: ['Ende 2026', 'Ende 2027', 'Ende 2028', 'Ende 2029'], correct: 3, explanation: 'Kantone haben bis Ende 2029 Zeit, ihre Richtpläne an die Anforderungen der RPG 2 anzupassen.' },
      { id: 'q4', question: 'Ab welcher FFF-Verminderung muss dem Bundesamt für Landwirtschaft gemeldet werden?', options: ['1 Hektar', '2 Hektar', '3 Hektar', '5 Hektar'], correct: 2, explanation: 'Gemäss RPV muss das Bundesamt für Landwirtschaft (BLW) bei Nutzungsplanänderungen benachrichtigt werden, die Fruchtfolgeflächen um mehr als 3 Hektaren vermindern.' },
      { id: 'q5', question: 'Was ist der "Gebietsansatz" in der RPG 2?', options: ['Eine Pflicht für alle Kantone', 'Ein freiwilliges kantonales Instrument für koordinierte Entwicklung', 'Ein neuer Zonentyp', 'Eine Bundesaufgabe'], correct: 1, explanation: 'Der Gebietsansatz ist ein freiwilliges Instrument für Kantone, das eine koordinierte Entwicklung von Gebieten ausserhalb der Bauzonen ermöglicht.' },
      { id: 'q6', question: 'Wie hoch ist die Mehrwertabgabe bei Einzonungen gemäss Art. 5 RPG mindestens?', options: ['10%', '15%', '20%', '25%'], correct: 2, explanation: 'Art. 5 RPG schreibt eine Mehrwertabgabe von mindestens 20% bei Planungsmehrwerten durch Einzonungen vor.' },
      { id: 'q7', question: 'Wie lange haben Gemeinden nach Richtplangenehmigung für die Anpassung ihrer Nutzungspläne?', options: ['2 Jahre', '3 Jahre', '5 Jahre', '10 Jahre'], correct: 2, explanation: 'Gemeinden haben nach Genehmigung des kantonalen Richtplans eine Frist von 5 Jahren für die Anpassung ihrer Nutzungspläne (BZO).' },
      { id: 'q8', question: 'Was regelt die KoVo?', options: ['Koordination zwischen Bund und Gemeinden', 'Koordination raumrelevanter Bundesaufgaben', 'Koordination von Umweltprüfungen', 'Koordination der Mehrwertabgabe'], correct: 1, explanation: 'Die Koordinationsverordnung (KoVo) regelt die Koordination und Kooperation bei raumrelevanten Bundesaufgaben (Sachpläne, Konzepte).' },
      { id: 'q9', question: 'Wann hat das Parlament die RPG 2 verabschiedet?', options: ['15. Oktober 2025', '29. September 2023', '1. Januar 2024', '28. Juni 2000'], correct: 1, explanation: 'Das Parlament hat die zweite Teilrevision des Raumplanungsgesetzes (RPG 2) am 29. September 2023 verabschiedet.' },
      { id: 'q10', question: 'Was gilt für Solaranlagen auf Bestandsgebäuden ausserhalb der Bauzone nach RPG 2?', options: ['Weiterhin verboten', 'Erleichtert, keine Einschränkungen', 'Bewilligungspflicht bleibt, aber vereinfacht', 'Nur auf Landwirtschaftsgebäuden erlaubt'], correct: 2, explanation: 'Die RPG 2 und RPV erleichtern Solaranlagen auf bestehenden Gebäuden. Die RPV darf die Solarnutzung nicht stärker einschränken als Art. 1 RPG.' },
    ],
  },

  'dsg-oeffentlich': {
    id: 'dsg-oeffentlich',
    emoji: '🔏',
    title: 'Datenschutz für öffentliche Stellen — DSG 2023',
    subtitle: 'Besonderheiten des revidierten DSG für öffentliche Körperschaften und Planungsverbände',
    regulation: 'DSG 2023 · EDÖB · ÖREB · Geodaten',
    color: '#1B4F72',
    bg: '#D6EAF8',
    duration: '35 Min.',
    passing_score: 75,
    modules: [
      {
        id: 'm1',
        title: 'DSG 2023 für öffentliche Stellen — Besonderheiten',
        duration: '9 Min.',
        content: [
          'Das revidierte Datenschutzgesetz (DSG) gilt seit 1. September 2023 und betrifft auch öffentliche Stellen wie Planungsverbände, Kantone und Gemeinden. Als gemischte Institution (öffentliche Aufgaben, privatrechtliche Struktur) unterliegt MetroPlan Zürich dem DSG.',
          'Für öffentliche Stellen gelten neben dem DSG auch kantonale Datenschutzgesetze. Im Kanton Zürich ist dies das Gesetz über die Information und den Datenschutz (IDG). Das Zusammenspiel dieser Normen ist für die tägliche Arbeit entscheidend.',
          'Planungsprozesse involvieren zahlreiche personenbezogene Daten: Grundeigentümerdaten, Mitwirkungsunterlagen, Stellungnahmen von Behörden und Privaten, GIS-Daten mit Personenbezug. All diese Daten sind datenschutzrechtlich zu behandeln.',
          'Der Öffentlichkeitsgrundsatz (Informationsfreiheit) und der Datenschutz stehen oft in Spannung: Was öffentlich zugänglich ist, unterliegt trotzdem dem DSG — personenbezogene Daten in öffentlichen Planungsdokumenten müssen entsprechend behandelt werden.',
        ],
        keypoints: [
          'DSG + kantonales IDG gelten für MetroPlan Zürich',
          'Planungsdaten = häufig personenbezogene Daten',
          'Öffentlichkeitsgrundsatz ≠ Datenschutzfreiheit',
          'EDÖB ist Aufsichtsbehörde auf Bundesebene',
        ],
      },
      {
        id: 'm2',
        title: 'Geodaten, ÖREB-Kataster und Datenschutz',
        duration: '9 Min.',
        content: [
          'Geodaten spielen in der Raumplanung eine zentrale Rolle. Viele Geodaten enthalten personenbezogene Informationen (z.B. Grundeigentümerdaten, Gebäudeadressen). Der ÖREB-Kataster (öffentlich-rechtliche Eigentumsbeschränkungen) ist öffentlich zugänglich, enthält aber schützenswerte Daten.',
          'Bei der Arbeit mit GIS-Systemen (ArcGIS, QGIS) sind folgende Grundsätze zu beachten: Datensparsamkeit (nur notwendige Daten), Zweckbindung (Geodaten nur für planungsrelevante Zwecke), sichere Datenhaltung (Zugriffsrechte, Verschlüsselung).',
          'Mitwirkungsverfahren nach RPG Art. 4 generieren personenbezogene Daten: Stellungnahmen, Einsprachen, Kontaktdaten. Diese Daten sind nach Abschluss des Verfahrens entsprechend zu archivieren oder zu löschen.',
          'Datenbearbeitungsverzeichnis: MetroPlan Zürich muss ein Verzeichnis aller Datenbearbeitungen führen. Dieses umfasst: Art der Daten, Zweck, Empfänger, Aufbewahrungsfristen, Sicherheitsmassnahmen.',
        ],
        keypoints: [
          'ÖREB-Kataster öffentlich ≠ kein Datenschutz',
          'GIS-Systeme: Zugriffsrechte und Verschlüsselung',
          'Mitwirkungsunterlagen: Aufbewahrungsfristen beachten',
          'Datenbearbeitungsverzeichnis führen (Art. 12 DSG)',
        ],
      },
      {
        id: 'm3',
        title: 'Datenpannen und Meldepflichten',
        duration: '9 Min.',
        content: [
          'Das DSG 2023 führt eine Meldepflicht bei Datenpannen ein. Öffentliche Stellen müssen den EDÖB «so rasch wie möglich» über Verletzungen der Datensicherheit informieren, wenn diese voraussichtlich zu einem hohen Risiko für die betroffenen Personen führen.',
          'Typische Datenpannen in Planungsbüros: E-Mail mit personenbezogenen Planungsunterlagen an falsche Adresse, Verlust eines unverschlüsselten USB-Sticks mit Projekta, Hacking-Angriff auf das GIS-System, Versehentliche Veröffentlichung von Mitwirkungsunterlagen mit personenbezogenen Daten.',
          'Im Unterschied zur DSGVO (72 Stunden) gilt im DSG 2023 keine starre Frist — aber «so rasch wie möglich» bedeutet in der Praxis ebenfalls wenige Tage. Intern ist sofort zu melden: an die Geschäftsleitung und den Datenschutzbeauftragten.',
          'Prävention: Sensibilisierung der Mitarbeitenden, technische Schutzmassnahmen (Verschlüsselung, Zugriffsrechte), organisatorische Massnahmen (Vieraugenprinzip bei sensiblen Daten, sichere E-Mail-Kommunikation mit Behörden).',
        ],
        keypoints: [
          'Meldepflicht: EDÖB «so rasch wie möglich» informieren',
          'Intern sofort: Geschäftsleitung + Datenschutzbeauftragter',
          'Typische Pannen: Fehlversand, USB-Verlust, Hacking',
          'Prävention: Verschlüsselung, Zugriffsrechte, Schulung',
        ],
      },
      {
        id: 'm4',
        title: 'Auftragsbearbeitungen und Drittparteien',
        duration: '8 Min.',
        content: [
          'MetroPlan Zürich arbeitet mit Subunternehmen, Partnerplanern und Behörden zusammen. Bei der Weitergabe von personenbezogenen Daten (Grundeigentümerlisten, Mitwirkungsunterlagen) müssen Auftragsbearbeitungsverträge (ABV) abgeschlossen werden.',
          'Cloud-Dienste: Für die Verwendung von Cloud-Plattformen (z.B. für die Dateiablage von Planungsprojekten) muss geprüft werden, ob der Anbieter DSG-konform ist. US-Cloud-Dienste wie Google Drive oder Dropbox können problematisch sein, wenn sie personenbezogene Planungsdaten enthalten.',
          'Empfehlung für MetroPlan Zürich: Nutzung von Schweizer oder EU-zertifizierten Cloud-Diensten (z.B. Infomaniak, Switch) für Projekte mit personenbezogenen Daten. Interne Projektnamen ohne Personenbezug verwenden.',
          'Sanktionen: Das DSG sieht Bussen bis CHF 250\'000 für natürliche Personen vor. Als Projektleiterin mit direktem Zugriff auf personenbezogene Daten sind Sie persönlich verantwortlich.',
        ],
        keypoints: [
          'ABV bei Weitergabe an Dritte zwingend',
          'US-Cloud für personenbezogene Daten problematisch',
          'CH/EU-Cloud bevorzugen (Infomaniak, Switch)',
          'Persönliche Haftung: bis CHF 250\'000',
        ],
      },
    ],
    quiz: [
      { id: 'q1', question: 'Welches kantonale Gesetz ergänzt das DSG für öffentliche Stellen im Kanton Zürich?', options: ['Datenschutzgesetz des Kantons Zürich (DSchG)', 'Informations- und Datenschutzgesetz (IDG)', 'Öffentlichkeitsgesetz (OeG)', 'Verwaltungsrechtspflegegesetz (VRG)'], correct: 1, explanation: 'Im Kanton Zürich gilt das Gesetz über die Information und den Datenschutz (IDG) als kantonales Pendant zum Bundes-DSG.' },
      { id: 'q2', question: 'Was ist der ÖREB-Kataster?', options: ['Öffentliches Register für Eigentümer', 'Kataster der öffentlich-rechtlichen Eigentumsbeschränkungen', 'Öffentliche Bauzone-Datenbank', 'Raumplanungsbehörde Bund'], correct: 1, explanation: 'Der ÖREB-Kataster (öffentlich-rechtliche Eigentumsbeschränkungen) ist ein öffentliches Informationssystem, das Nutzungsplanungen und andere Eigentumsbeschränkungen dokumentiert.' },
      { id: 'q3', question: 'Was muss MetroPlan Zürich gemäss Art. 12 DSG führen?', options: ['Risikoregister', 'Datenbearbeitungsverzeichnis', 'Datenschutz-Folgeabschätzung', 'Compliance-Bericht'], correct: 1, explanation: 'Art. 12 DSG verpflichtet Verantwortliche zur Führung eines Verzeichnisses aller Datenbearbeitungen (Bearbeitungsverzeichnis).' },
      { id: 'q4', question: 'Bei welchem Cloud-Dienst sind Datenschutzbedenken bei personenbezogenen Planungsdaten besonders hoch?', options: ['Infomaniak', 'Switch', 'Google Drive', 'None of the above'], correct: 2, explanation: 'US-Cloud-Dienste wie Google Drive können problematisch sein, da sie dem US Cloud Act unterliegen — Behörden können auf Daten zugreifen.' },
      { id: 'q5', question: 'Welche Frist gilt im DSG 2023 für die Meldung einer Datenpanne?', options: ['24 Stunden', '72 Stunden', 'So rasch wie möglich', '7 Tage'], correct: 2, explanation: 'Das DSG 2023 schreibt keine starre Frist vor — es gilt «so rasch wie möglich». In der Praxis bedeutet das wenige Tage.' },
      { id: 'q6', question: 'Was ist bei der Weitergabe von Grundeigentümerdaten an einen Subplaner erforderlich?', options: ['Nichts Besonderes', 'Auftragsbearbeitungsvertrag (ABV)', 'Einwilligung der Grundeigentümer', 'Genehmigung des EDÖB'], correct: 1, explanation: 'Bei der Weitergabe personenbezogener Daten an Auftragsbearbeiter (Subunternehmen) muss ein Auftragsbearbeitungsvertrag (ABV) abgeschlossen werden.' },
      { id: 'q7', question: 'Was erzeugen Mitwirkungsverfahren nach RPG Art. 4 aus Datenschutzsicht?', options: ['Keine datenschutzrelevanten Daten', 'Personenbezogene Daten (Stellungnahmen, Kontakte)', 'Nur öffentliche Daten', 'Anonymisierte Statistiken'], correct: 1, explanation: 'Mitwirkungsverfahren generieren personenbezogene Daten: Stellungnahmen mit Absenderangaben, Einsprachen, Kontaktdaten von Privaten und Behörden.' },
      { id: 'q8', question: 'Welche Datenschutzbehörde ist auf Bundesebene zuständig?', options: ['Datenschutzbehörde Bund (DSB)', 'Eidg. Datenschutz- und Öffentlichkeitsbeauftragter (EDÖB)', 'Bundesamt für Justiz (BJ)', 'FINMA'], correct: 1, explanation: 'Der Eidgenössische Datenschutz- und Öffentlichkeitsbeauftragte (EDÖB) ist die zuständige Aufsichtsbehörde auf Bundesebene.' },
      { id: 'q9', question: 'Wie hoch ist die maximale Busse im DSG 2023 für natürliche Personen?', options: ['CHF 50\'000', 'CHF 100\'000', 'CHF 250\'000', 'CHF 1\'000\'000'], correct: 2, explanation: 'Das DSG 2023 sieht Bussen von bis zu CHF 250\'000 für natürliche Personen vor — als Projektleiterin sind Sie persönlich verantwortlich.' },
      { id: 'q10', question: 'Welchen Grundsatz gilt für GIS-Geodaten mit Personenbezug?', options: ['Öffentlichkeit geht vor Datenschutz', 'Datensparsamkeit und Zweckbindung', 'Geodaten sind nie personenbezogen', 'Keine Einschränkungen für Planungsbehörden'], correct: 1, explanation: 'Auch für Geodaten gelten die DSG-Grundsätze: Datensparsamkeit (nur notwendige Daten erheben) und Zweckbindung (nur für Planungszwecke verwenden).' },
    ],
  },

  'uvp-usg': {
    id: 'uvp-usg',
    emoji: '🌿',
    title: 'UVP — Umweltverträglichkeitsprüfung nach USG',
    subtitle: 'Umweltverträglichkeitsprüfung als Planungsinstrument nach USG Art. 10a–f und UVPV',
    regulation: 'USG · UVPV · BAFU · NHG',
    color: '#27AE60',
    bg: '#D5F5E3',
    duration: '45 Min.',
    passing_score: 80,
    modules: [
      {
        id: 'm1',
        title: 'Grundlagen UVP — Was, Wann, Warum',
        duration: '11 Min.',
        content: [
          'Die Umweltverträglichkeitsprüfung (UVP) ist in Art. 10a–f des Umweltschutzgesetzes (USG) geregelt. Sie ist für bestimmte Anlagen und Vorhaben obligatorisch, bevor die Bewilligung erteilt werden darf.',
          'Prüfpflichtig sind Anlagen, die in der Verordnung über die Umweltverträglichkeitsprüfung (UVPV) aufgelistet sind. Dazu gehören Infrastrukturvorhaben ab bestimmten Schwellenwerten (z.B. Nationalstrassen, Bahnlinien, Kraftwerke, grosse Einkaufszentren, Deponien).',
          'Die UVP bezweckt, dass die Behörden bei ihrer Entscheidung die Umweltauswirkungen eines Projekts kennen. Sie ist eine Grundlage für den Bewilligungsentscheid — aber kein Bewilligungsersatz.',
          'Als Projektleiterin bei MetroPlan Zürich sind Sie häufig in UVP-pflichtige Planungen involviert: Erschliessungsstrassen, Infrastrukturprojekte, grössere Überbauungen. Sie müssen den UVP-Bedarf frühzeitig erkennen und koordinieren.',
        ],
        keypoints: [
          'Rechtsgrundlage: USG Art. 10a–f + UVPV',
          'Abschliessende Liste UVP-pflichtiger Vorhaben in UVPV Anhang',
          'UVP = Grundlage für Bewilligung, kein Ersatz',
          'Frühzeitige Erkennung des UVP-Bedarfs entscheidend',
        ],
      },
      {
        id: 'm2',
        title: 'Ablauf und Pflichtenheft',
        duration: '11 Min.',
        content: [
          'Der UVP-Prozess beginnt mit dem Pflichtenheft (Art. 10b USG): Der Projektant unterbreitet der Behörde vor Einreichung der Unterlagen ein Pflichtenheft, in dem der Untersuchungsgegenstand und die Methode festgelegt werden.',
          'Der Umweltverträglichkeitsbericht (UVB) ist das Herzstück der UVP. Er muss den Zustand des Gebiets beschreiben, die Auswirkungen des Projekts analysieren und Massnahmen zur Verminderung von Umweltbelastungen vorschlagen.',
          'Die UVP ist mit dem Bewilligungs- oder Genehmigungsverfahren koordiniert. Bei mehrstufigen Verfahren (z.B. Sondernutzungsplan → Baubewilligung) kann eine mehrstufige UVP erforderlich sein.',
          'Fachbehörden spielen eine zentrale Rolle: BAFU (Bundesebene), AWEL Zürich (kantonale Umweltfachstelle), ARE (Raumplanung). Diese Behörden beurteilen den UVB und geben Empfehlungen an die Bewilligungsbehörde.',
        ],
        keypoints: [
          'Pflichtenheft: vor Einreichung, mit Behörde absprechen',
          'UVB enthält: Zustandsbeschrieb, Auswirkungen, Massnahmen',
          'Koordination mit Bewilligungsverfahren zwingend',
          'BAFU/AWEL: wichtige Fachbehörden einbinden',
        ],
      },
      {
        id: 'm3',
        title: 'Planungsbegleitende UVP und Koordination',
        duration: '12 Min.',
        content: [
          'Für Vorhaben mit Richtplanpflicht (z.B. neue Autobahnen, Hochspannungsleitungen) ist bereits auf Richtplanstufe eine UVP-Voruntersuchung durchzuführen. Dies ist die sogenannte planungsbegleitende UVP.',
          'Die Koordinationspflicht zwischen UVP und anderen Umweltschutzvorschriften ist komplex: Lärmschutz (LSV), Luftreinhaltung (LRV), Gewässerschutz (GSchG), Naturschutz (NHG) — all diese Gesetze haben eigene Anforderungen, die im UVB berücksichtigt werden müssen.',
          'Klimafolgeabschätzung: Neuere Praxis verlangt, dass auch Klimawandelauswirkungen im UVB berücksichtigt werden (Hitze, Starkregen, Trockenheit). Das BAFU hat entsprechende Leitfäden veröffentlicht.',
          'Öffentliche Auflage: Der UVB ist öffentlich zugänglich. Betroffene Personen und Organisationen mit Beschwerderecht (z.B. Umweltschutzorganisationen nach Art. 55 USG) können sich äussern.',
        ],
        keypoints: [
          'Richtplanstufe: UVP-Voruntersuchung für grosse Vorhaben',
          'Koordination mit LSV, LRV, GSchG, NHG im UVB',
          'Klimafolgeabschätzung: BAFU-Leitfaden beachten',
          'Beschwerderecht: Umweltorganisationen haben Mitwirkungsrechte',
        ],
      },
      {
        id: 'm4',
        title: 'NHG und Koordination Natur/Landschaft',
        duration: '11 Min.',
        content: [
          'Das Natur- und Heimatschutzgesetz (NHG) ergänzt die UVP: Bei Eingriffen in Biotope nationaler Bedeutung, Auenwälder, Moore und andere schützenswerte Lebensräume ist eine Interessenabwägung und Kompensation erforderlich.',
          'Bundesinventare (BLN, IVS, ISOS, Flachmoore etc.) sind bei der Planung verbindlich zu berücksichtigen. Bei Eingriffen in Schutzobjekte gilt das Verunstaltungsverbot — nur bei überwiegendem öffentlichem Interesse kann davon abgewichen werden.',
          'Artenschutz: Die eidgenössische Jagdverordnung (JSV) und das NHG schützen Wildtiere. Baubewilligungen können verweigert werden, wenn sie störend für Wildtierkorridore oder Brutgebiete sind. MetroPlan Zürich muss dies in regionalen Planungen berücksichtigen.',
          'Verbindung zu RPG 2: Die RPG 2 stärkt den Schutz von Fruchtfolgeflächen und naturnahen Gebieten ausserhalb der Bauzone. Bei Planungen muss die Konformität mit NHG und RPG 2 gemeinsam geprüft werden.',
        ],
        keypoints: [
          'NHG: Biotopschutz, Bundesinventare verbindlich',
          'BLN, IVS, ISOS: bei Planungen zwingend prüfen',
          'Wildtierkorridore in regionalen Planungen berücksichtigen',
          'NHG und RPG 2 gemeinsam prüfen',
        ],
      },
    ],
    quiz: [
      { id: 'q1', question: 'Welches Gesetz regelt die UVP in der Schweiz?', options: ['RPG Art. 10a', 'USG Art. 10a–f', 'NHG Art. 5', 'GSchG Art. 3'], correct: 1, explanation: 'Die Umweltverträglichkeitsprüfung (UVP) ist im Umweltschutzgesetz (USG) in den Artikeln 10a–f geregelt.' },
      { id: 'q2', question: 'Was ist der erste Schritt im UVP-Prozess?', options: ['Einreichung des UVB', 'Erstellung des Pflichtenhefts', 'Öffentliche Auflage', 'Beurteilung durch BAFU'], correct: 1, explanation: 'Das Pflichtenheft (Art. 10b USG) ist der erste Schritt: Projektant und Behörde legen vor Einreichung der Unterlagen den Untersuchungsgegenstand fest.' },
      { id: 'q3', question: 'Welche kantonale Behörde beurteilt UVP in Zürich?', options: ['ARE Zürich', 'AWEL Zürich', 'KEZU Zürich', 'Baudirektion Zürich'], correct: 1, explanation: 'Das Amt für Abfall, Wasser, Energie und Luft (AWEL) ist die kantonale Umweltfachstelle und beurteilt UVBs im Kanton Zürich.' },
      { id: 'q4', question: 'Was bedeutet "planungsbegleitende UVP"?', options: ['UVP nach der Planung', 'UVP auf Richtplanstufe bei grossen Vorhaben', 'Vereinfachte UVP', 'UVP ohne Pflichtenheft'], correct: 1, explanation: 'Die planungsbegleitende UVP findet bereits auf Richtplanstufe statt — bei grossen Vorhaben (Autobahnen, Hochspannungsleitungen) mit Richtplanpflicht.' },
      { id: 'q5', question: 'Welches Recht haben Umweltschutzorganisationen bei UVP-pflichtigen Vorhaben?', options: ['Kein besonderes Recht', 'Beschwerderecht gemäss Art. 55 USG', 'Vetorecht', 'Nur Beobachterstatus'], correct: 1, explanation: 'Art. 55 USG gibt qualifizierten Umweltschutzorganisationen Beschwerderecht bei UVP-pflichtigen Vorhaben.' },
      { id: 'q6', question: 'Was muss bei Eingriffen in Bundesinventare (BLN, ISOS) beachtet werden?', options: ['Nichts Besonderes', 'Nur Information der Behörde', 'Interessenabwägung, nur bei überwiegendem öff. Interesse zulässig', 'Automatisches Verbot'], correct: 2, explanation: 'Eingriffe in Objekte von Bundesinventaren (BLN, IVS, ISOS) sind nur bei überwiegendem öffentlichem Interesse zulässig — nach sorgfältiger Interessenabwägung.' },
      { id: 'q7', question: 'Was umfasst ein Umweltverträglichkeitsbericht (UVB)?', options: ['Nur technische Pläne', 'Zustandsbeschrieb, Auswirkungen und Massnahmen', 'Finanzierungsplan', 'Nur Lärmgutachten'], correct: 1, explanation: 'Der UVB muss den Ausgangszustand beschreiben, die Umweltauswirkungen des Projekts analysieren und Massnahmen zur Verminderung von Belastungen vorschlagen.' },
      { id: 'q8', question: 'Welche neuere Anforderung hat das BAFU für UVBs publiziert?', options: ['Biodiversitätsabschätzung', 'Klimafolgeabschätzung', 'Lärmmodellierung 3D', 'Grundwasseranalyse'], correct: 1, explanation: 'Das BAFU verlangt zunehmend, dass Klimafolgen (Hitze, Starkregen, Trockenheit) in UVBs berücksichtigt werden — mit entsprechenden Leitfäden.' },
      { id: 'q9', question: 'Was ist das "Verunstaltungsverbot" im NHG?', options: ['Verbot von Graffiti', 'Verbot des Eingriffs in Schutzobjekte ohne öff. Interesse', 'Verbot von Bauten in Schutzzonen', 'Verbot von Werbung in Naturschutzgebieten'], correct: 1, explanation: 'Das Verunstaltungsverbot im NHG untersagt Eingriffe in Objekte nationaler Bedeutung, sofern kein überwiegendes öffentliches Interesse vorliegt.' },
      { id: 'q10', question: 'Warum ist die Koordination von NHG und RPG 2 wichtig?', options: ['Doppelspurigkeiten vermeiden', 'Beide schützen Fruchtfolgeflächen und naturnahe Gebiete', 'Nur für kantonale Behörden relevant', 'Nur für Bundesebene'], correct: 1, explanation: 'RPG 2 stärkt den Schutz von Fruchtfolgeflächen und naturnahen Gebieten — dies ergänzt den NHG-Biotopschutz. Planungen müssen beide Normen gleichzeitig berücksichtigen.' },
    ],
  },

  'iveob-beschaffung': {
    id: 'iveob-beschaffung',
    emoji: '📋',
    title: 'Öffentliches Beschaffungsrecht — IVöB 2021',
    subtitle: 'Interkantonale Vereinbarung über das öffentliche Beschaffungswesen für Planungsbüros',
    regulation: 'IVöB · BöB · WTO-GPA · VöB',
    color: '#7D3C98',
    bg: '#E8DAEF',
    duration: '40 Min.',
    passing_score: 75,
    modules: [
      {
        id: 'm1',
        title: 'Grundlagen IVöB 2021 — Was hat sich geändert?',
        duration: '10 Min.',
        content: [
          'Die Interkantonale Vereinbarung über das öffentliche Beschaffungswesen (IVöB) 2021 ist das zentrale Regelwerk für Beschaffungen der Kantone und Gemeinden. Sie ist seit dem 1. Januar 2023 in allen Kantonen in Kraft und ersetzt die alte IVöB 2001.',
          'MetroPlan Zürich ist doppelt betroffen: Als Auftragnehmer öffentlicher Stellen muss das Büro die Vergabeverfahren kennen; als Subbeauftragte öffentlicher Körperschaften (z.B. Gemeinden) muss es auch Weiterbeauftragungen regelkonform gestalten.',
          'Wichtigste Neuerungen der IVöB 2021: Einführung von Nachhaltigkeitskriterien, Stärkung des Grundsatzes der Verhältnismässigkeit, neue Verfahrensregeln für den Dialog und die Ausschreibung, verbesserte Rechtsschutzregeln.',
          'Schwellenwerte (Kanton Zürich, exkl. MWST): Dienstleistungen Freihändige Vergabe bis CHF 100\'000, Einladungsverfahren CHF 100\'000–250\'000, Selektives Verfahren CHF 250\'000–500\'000, Offenes Verfahren ab CHF 500\'000. Für Planungsleistungen gelten diese Werte.',
        ],
        keypoints: [
          'IVöB 2021: seit 1.1.2023 in allen Kantonen',
          'MetroPlan: Auftragnehmer UND Subvergabe-Verpflichteter',
          'Schwellenwert offenes Verfahren: ab CHF 500\'000',
          'Neu: Nachhaltigkeitskriterien verbindlich',
        ],
      },
      {
        id: 'm2',
        title: 'Verfahrensarten und Zuschlagskriterien',
        duration: '10 Min.',
        content: [
          'Freihändige Vergabe: Unter CHF 100\'000 kann MetroPlan Zürich direkt beauftragt werden. Der Auftraggeber muss die Vergabe aber auch hier wirtschaftlich begründen können.',
          'Einladungsverfahren (CHF 100\'000–250\'000): Mindestens 3 Angebote müssen eingeholt werden. MetroPlan Zürich kann direkt eingeladen werden.',
          'Offenes Verfahren (ab CHF 500\'000): Öffentliche Ausschreibung auf simap.ch ist Pflicht. Teilnahme an allen qualifizierten Interessenten muss gewährt werden. Dies betrifft viele regionale Planungsaufträge.',
          'Zuschlagskriterien müssen vorab in der Ausschreibung bekannt gegeben werden. Preis ist nur ein Kriterium — Qualität, Referenzen, Methodik, Terminplanung und Nachhaltigkeitskriterien können und sollen berücksichtigt werden.',
        ],
        keypoints: [
          'simap.ch: Pflichtpublikation ab CHF 500\'000',
          'Zuschlagskriterien vorab publizieren',
          'Preis ist NICHT das einzige Kriterium',
          'Mindestens 3 Angebote bei Einladungsverfahren',
        ],
      },
      {
        id: 'm3',
        title: 'Nachhaltigkeitskriterien und WOKE-Prinzip',
        duration: '10 Min.',
        content: [
          'Die IVöB 2021 verankert Nachhaltigkeitskriterien verbindlich. Auftraggeber müssen bei der Beschaffung ökologische, soziale und innovative Aspekte berücksichtigen (Art. 2 IVöB).',
          'Für Planungsleistungen bedeutet dies: Beurteilung nach ökologischem Fussabdruck der Bürotätigkeit, Sozialstandards (GAV-Einhaltung, Lohngleichheit), Innovation (neue Planungsmethoden, BIM, GIS-Kompetenz).',
          'Nachweispflicht: Auftragnehmer müssen auf Anfrage nachweisen, dass sie Umwelt-, Sozial- und Arbeitsstandards einhalten. MetroPlan Zürich sollte hierfür entsprechende Dokumente bereit halten (ISO 14001, Lohngleichheitsanalyse, etc.).',
          'Ausschlussklauseln: Firmen können von der Vergabe ausgeschlossen werden bei Steuerhinterziehung, Korruption, Verletzung von Arbeitsschutzvorschriften oder Missachtung des Lohngleichheitsgebots.',
        ],
        keypoints: [
          'Nachhaltigkeitskriterien: ökologisch, sozial, innovativ',
          'Nachweispflicht auf Anfrage vorbereiten',
          'GAV-Einhaltung und Lohngleichheit prüfen',
          'Ausschluss bei Steuerhinterziehung oder Korruption',
        ],
      },
      {
        id: 'm4',
        title: 'Rechtsmittel und Submissionsrecht',
        duration: '10 Min.',
        content: [
          'Unterlegene Anbieter können gegen Vergabeentscheide Beschwerde einlegen. Die Beschwerdefrist beträgt 20 Tage ab Bekanntgabe des Zuschlags. Beschwerdeinstanz für kantonale Vergaben ist das Verwaltungsgericht des jeweiligen Kantons.',
          'Aufschiebende Wirkung: Eine Beschwerde hemmt nicht automatisch die Auftragserteilung. Der Auftraggeber kann in dringenden Fällen den Auftrag trotz laufender Beschwerde vergeben.',
          'Für Planungsbüros wie MetroPlan Zürich: Bei der Subvergabe von Leistungen (z.B. Spezialgutachten, Visualisierungen) ab CHF 100\'000 muss die IVöB ebenfalls eingehalten werden, wenn der Auftraggeber eine öffentliche Stelle ist.',
          'Submissionsfallen: Häufige Fehler sind das Überschreiten von Fristen, unvollständige Angebote, fehlende Nachweise, Angebote ausserhalb der Eignungskriterien. MetroPlan Zürich sollte eine interne Checkliste für Ausschreibungen führen.',
        ],
        keypoints: [
          'Beschwerdefrist: 20 Tage ab Zuschlag',
          'Verwaltungsgericht: Beschwerdeinstanz',
          'Subvergabe ab CHF 100\'000: IVöB gilt',
          'Checkliste für Ausschreibungen führen',
        ],
      },
    ],
    quiz: [
      { id: 'q1', question: 'Ab wann ist die IVöB 2021 in allen Kantonen in Kraft?', options: ['1. Januar 2021', '29. September 2023', '1. Januar 2023', '1. Juli 2024'], correct: 2, explanation: 'Die IVöB 2021 trat am 1. Januar 2023 in allen Kantonen in Kraft und ersetzte die alte IVöB 2001.' },
      { id: 'q2', question: 'Ab welchem Betrag ist im Kanton Zürich eine öffentliche Ausschreibung auf simap.ch Pflicht (Dienstleistungen)?', options: ['CHF 100\'000', 'CHF 250\'000', 'CHF 500\'000', 'CHF 1\'000\'000'], correct: 2, explanation: 'Ab CHF 500\'000 (offenes Verfahren) ist die Pflichtpublikation auf simap.ch im Kanton Zürich erforderlich.' },
      { id: 'q3', question: 'Wie viele Angebote müssen beim Einladungsverfahren mindestens eingeholt werden?', options: ['1', '2', '3', '5'], correct: 2, explanation: 'Beim Einladungsverfahren müssen mindestens 3 Angebote eingeholt werden.' },
      { id: 'q4', question: 'Was ist neu in der IVöB 2021 gegenüber der IVöB 2001?', options: ['Höhere Schwellenwerte', 'Verbindliche Nachhaltigkeitskriterien', 'Abschaffung des offenen Verfahrens', 'Kein Rechtsschutz mehr'], correct: 1, explanation: 'Die IVöB 2021 verankert erstmals verbindliche Nachhaltigkeitskriterien (ökologische, soziale und innovative Aspekte) in der Beschaffung.' },
      { id: 'q5', question: 'Auf welcher Plattform sind öffentliche Ausschreibungen ab Schwellenwert zu publizieren?', options: ['admin.ch', 'simap.ch', 'beschaffung.ch', 'are.admin.ch'], correct: 1, explanation: 'simap.ch ist die Schweizer Plattform für öffentliche Ausschreibungen — Pflichtpublikation ab dem jeweiligen Schwellenwert.' },
      { id: 'q6', question: 'Wie lange ist die Beschwerdefrist nach einem Vergabeentscheid?', options: ['5 Tage', '10 Tage', '20 Tage', '30 Tage'], correct: 2, explanation: 'Unterlegene Anbieter können innerhalb von 20 Tagen ab Bekanntgabe des Zuschlags Beschwerde einlegen.' },
      { id: 'q7', question: 'Wann kann eine Firma von der Vergabe ausgeschlossen werden?', options: ['Bei zu hohem Preis', 'Bei Steuerhinterziehung oder Korruption', 'Bei fehlendem ISO-Zertifikat', 'Bei mehr als 50 Mitarbeitenden'], correct: 1, explanation: 'Art. 44 IVöB sieht Ausschluss bei Steuerhinterziehung, Korruption, Verletzung von Arbeitsschutzvorschriften oder Missachtung des Lohngleichheitsgebots vor.' },
      { id: 'q8', question: 'Muss MetroPlan Zürich die IVöB auch bei der Subvergabe einhalten?', options: ['Nein, nur öffentliche Stellen', 'Ja, ab CHF 100\'000 wenn Auftraggeber öffentlich', 'Nur ab CHF 500\'000', 'Nein, bei Planungsleistungen nie'], correct: 1, explanation: 'Bei der Subvergabe von Leistungen ab CHF 100\'000 muss auch MetroPlan Zürich die IVöB einhalten, wenn der Hauptauftraggeber eine öffentliche Stelle ist.' },
      { id: 'q9', question: 'Was muss MetroPlan Zürich bei Nachhaltigkeitskriterien nachweisen können?', options: ['ISO 9001 Zertifikat', 'Einhaltung von Umwelt-, Sozial- und Arbeitsstandards', 'Mindestgrösse des Büros', 'Kantonale Zulassung'], correct: 1, explanation: 'Auftragnehmer müssen auf Anfrage nachweisen, dass sie Umwelt-, Sozial- und Arbeitsstandards einhalten (z.B. GAV, Lohngleichheit, Umweltmanagement).' },
      { id: 'q10', question: 'Was ist das wichtigste Zuschlagskriterium bei öffentlichen Vergaben?', options: ['Immer der tiefste Preis', 'Immer die Qualität', 'Das wirtschaftlich günstigste Angebot (Preis + Qualität)', 'Die Grösse des Büros'], correct: 2, explanation: 'Zuschlagskriterium ist das wirtschaftlich günstigste Angebot: Preis ist nur ein Faktor — Qualität, Methodik, Referenzen und Nachhaltigkeit sind gleichwertig zu berücksichtigen.' },
    ],
  },

  'klima-netto-null': {
    id: 'klima-netto-null',
    emoji: '🌍',
    title: 'Klimaanpassung & Netto-Null 2050 in der Raumplanung',
    subtitle: 'Klimastrategie Schweiz, CO2-Gesetz und Stadtklima in der räumlichen Planung',
    regulation: 'CO2-Gesetz · Klimastrategie 2050 · SIA · ARE',
    color: '#27AE60',
    bg: '#D5F5E3',
    duration: '40 Min.',
    passing_score: 75,
    modules: [
      {
        id: 'm1',
        title: 'Klimastrategie Schweiz 2050 — Netto-Null',
        duration: '10 Min.',
        content: [
          'Der Bundesrat hat die Klimastrategie Schweiz 2050 verabschiedet: Bis 2050 soll die Schweiz netto null Treibhausgasemissionen erreichen. Das revidierte CO2-Gesetz und das Klimaschutzgesetz (KlG, angenommen 18. Juni 2023) bilden die rechtliche Grundlage.',
          'Für die Raumplanung bedeutet Netto-Null: Neue Siedlungen und Bauten müssen klimaverträglich geplant werden. Dazu gehören kompakte Siedlungsstrukturen, Förderung des ÖV und Langsamverkehrs, Reduktion der Bodenversiegelung und Förderung von Begrünungsmassnahmen.',
          'Klimaschutzgesetz (KlG): Verabschiedet 2023, verankert das Netto-Null-Ziel gesetzlich. Der Bundesrat muss alle 4 Jahre Zwischenziele definieren. Kantone und Gemeinden sind aufgefordert, eigene Klimaschutzstrategien zu entwickeln.',
          'Für MetroPlan Zürich als Planungsorganisation: Die Klimaverträglichkeit muss bei allen Planungen berücksichtigt werden — von der Siedlungsentwicklung über die Mobilität bis zur Grün- und Freiraumentwicklung.',
        ],
        keypoints: [
          'Netto-Null 2050: gesetzlich verankert (KlG)',
          'Kompakte Siedlungsstrukturen fördern',
          'Bodenversiegelung reduzieren',
          'Kantone/Gemeinden: eigene Klimastrategien entwickeln',
        ],
      },
      {
        id: 'm2',
        title: 'Stadtklima und Hitzeinseleffekt',
        duration: '10 Min.',
        content: [
          'Der städtische Hitzeinseleffekt (Urban Heat Island, UHI) beschreibt die Überwärmung städtischer Gebiete gegenüber dem Umland. In Zürich können die Temperaturen im Sommer 5–8°C höher sein als im Umland.',
          'Raumplanerische Massnahmen gegen Überwärmung: Erhalt und Schaffung von Grünflächen (Parks, Stadtbäume), Frischluftkorridore freihalten, Wasserelemente (Brunnen, offene Gewässer), helle Oberflächenmaterialien, Fassaden- und Dachbegrünung.',
          'Klimaanpassungsplanung nach dem SIA Merkblatt 2040 "Energie": Gebäude und Stadtquartiere müssen so geplant werden, dass sie auch bei zukünftigen Klimabedingungen (Szenario CH2018) nutzbar bleiben. Übertemperierung, Starkregen und Trockenheit sind die Hauptrisiken.',
          'Fachstelle Stadtklima Zürich: Das ARE und die Stadtentwicklung Zürich haben Leitfäden zu klimagerechter Stadtplanung veröffentlicht. Diese Grundlagen sind in regionale und kommunale Planungen einzubeziehen.',
        ],
        keypoints: [
          'UHI: Zürich bis 8°C wärmer als Umland im Sommer',
          'Frischluftkorridore: in Richtplänen sichern',
          'SIA Merkblatt 2040: Grundlage für Klimaplanung',
          'Szenarien CH2018: massgebend für Planung',
        ],
      },
      {
        id: 'm3',
        title: 'Naturgefahren und Klimawandel',
        duration: '10 Min.',
        content: [
          'Der Klimawandel verstärkt Naturgefahren: Hochwasser, Erdrutsche, Trockenheit und Hitzewellen nehmen zu. Die Raumplanung hat die Aufgabe, Bauverbotszonen und Gefahrengebiete zu definieren und neue Siedlungen vor Naturgefahren zu schützen.',
          'Gefahrenkarten: Kantone und Gemeinden sind verpflichtet, Gefahrenkarten zu erstellen und in der Raumplanung zu berücksichtigen. Neueinzonungen in Gefahrengebieten sind grundsätzlich unzulässig.',
          'PLANAT (Nationale Plattform Naturgefahren): Koordiniert die Naturgefahrenprävention in der Schweiz. Die Empfehlungen von PLANAT sind für die kommunale und regionale Planung massgebend.',
          'Klimaangepasste Infrastruktur: Strassen, Brücken und Entwässerungssysteme müssen auf zukünftige Extremereignisse ausgelegt werden. MetroPlan Zürich ist als Planungsorganisation gefordert, diese Anforderungen in regionale Infrastrukturplanungen einzubeziehen.',
        ],
        keypoints: [
          'Gefahrenkarten: verbindlich in Raumplanung',
          'Neueinzonungen in Gefahrengebieten: unzulässig',
          'PLANAT: massgebende Empfehlungen',
          'Infrastruktur auf Extremereignisse auslegen',
        ],
      },
      {
        id: 'm4',
        title: 'Begrünung, Biodiversität und Grünraumplanung',
        duration: '10 Min.',
        content: [
          'Die Biodiversitätsstrategie Schweiz und der Aktionsplan Biodiversität verlangen, dass Grünräume nicht nur als Erholungsflächen, sondern auch als Lebensräume geplant werden. Dies betrifft städtische Grünflächen, Wildtierkorridore und ökologische Vernetzung.',
          'Grünraumanteil und Versiegelungsgrad: MetroPlan Zürich und die Zürcher Planungspraxis streben einen Grünraumanteil von mindestens 30% in Siedlungsgebieten an. Der Versiegelungsgrad soll durch Entsiegelungsmassnahmen gesenkt werden.',
          'Fassaden- und Dachbegrünung: Die SIA Norm 312 und kantonale Vorschriften fördern begrünte Dächer und Fassaden. Diese verbessern den Wasserhaushalt (Retentionswirkung), kühlen die Stadt und erhöhen die Biodiversität.',
          'Agglomerationsprogramme: Die Agglomerationsprogramme des Bundes (ARE) co-finanzieren Grünraum- und Freiraumprojekte in Agglomerationen. MetroPlan Zürich sollte diese Fördermöglichkeiten bei regionalen Planungen aktiv einbeziehen.',
        ],
        keypoints: [
          'Biodiversitätsstrategie: Grünräume = Lebensräume',
          'Ziel: 30% Grünraumanteil in Siedlungsgebieten',
          'SIA 312: Dachbegrünung fördern',
          'Agglomerationsprogramme: Finanzierungsmöglichkeit',
        ],
      },
    ],
    quiz: [
      { id: 'q1', question: 'Wann wurde das Klimaschutzgesetz (KlG) der Schweiz angenommen?', options: ['18. Juni 2021', '18. Juni 2023', '1. September 2023', '15. Oktober 2025'], correct: 1, explanation: 'Das Klimaschutzgesetz (KlG), das das Netto-Null-Ziel 2050 verankert, wurde am 18. Juni 2023 in der Volksabstimmung angenommen.' },
      { id: 'q2', question: 'Wie viel wärmer kann Zürich im Sommer durch den Hitzeinseleffekt sein?', options: ['1–2°C', '2–4°C', '5–8°C', '10–12°C'], correct: 2, explanation: 'Durch den städtischen Hitzeinseleffekt (Urban Heat Island, UHI) kann Zürich im Sommer 5–8°C wärmer sein als das umliegende Landgebiet.' },
      { id: 'q3', question: 'Welches SIA-Dokument ist massgebend für klimaangepasstes Bauen?', options: ['SIA 118', 'SIA 261', 'SIA 2040', 'SIA 312'], correct: 2, explanation: 'Das SIA Merkblatt 2040 "Energie" enthält Grundlagen für klimaangepasstes Planen und Bauen unter Berücksichtigung zukünftiger Klimaszenarien.' },
      { id: 'q4', question: 'Was koordiniert PLANAT?', options: ['Raumplanung Schweiz', 'Naturgefahrenprävention', 'Klimafinanzierung', 'Agglomerationsprogramme'], correct: 1, explanation: 'PLANAT (Nationale Plattform Naturgefahren) koordiniert die Naturgefahrenprävention in der Schweiz und gibt massgebende Empfehlungen für die Raumplanung.' },
      { id: 'q5', question: 'Welchen Grünraumanteil strebt die Zürcher Planungspraxis in Siedlungsgebieten an?', options: ['10%', '20%', '30%', '50%'], correct: 2, explanation: 'MetroPlan Zürich und die Zürcher Planungspraxis streben einen Grünraumanteil von mindestens 30% in Siedlungsgebieten an.' },
      { id: 'q6', question: 'Was sind die drei Hauptrisiken des Klimawandels für die Raumplanung?', options: ['Kälte, Wind, Schnee', 'Übertemperierung, Starkregen, Trockenheit', 'Hochwasser, Lawinen, Steinschlag', 'Permafrost, Gletscherschmelze, Erosion'], correct: 1, explanation: 'Die drei Hauptrisiken des Klimawandels für Gebäude und Städte sind Übertemperierung (Hitze), Starkregen (Überschwemmung) und Trockenheit (Wasserknappheit).' },
      { id: 'q7', question: 'Was regelt die SIA Norm 312?', options: ['Lärmschutz', 'Statik', 'Dachbegrünung', 'Barrierefreiheit'], correct: 2, explanation: 'Die SIA Norm 312 enthält technische Anforderungen für Dachbegrünungen — diese verbessern Wasserhaushalt, Kühlung und Biodiversität.' },
      { id: 'q8', question: 'Für welche Planungen sind Gefahrenkarten verbindlich zu berücksichtigen?', options: ['Nur für grosse Bauprojekte', 'Nur auf Bundesebene', 'Bei allen kommunalen und regionalen Planungen', 'Nur in Berggebieten'], correct: 2, explanation: 'Gefahrenkarten sind bei allen kommunalen und regionalen Planungen verbindlich zu berücksichtigen — Neueinzonungen in Gefahrengebieten sind grundsätzlich unzulässig.' },
      { id: 'q9', question: 'Was fördern Agglomerationsprogramme des Bundes (ARE)?', options: ['Nur Strasseninfrastruktur', 'Grünraum- und Freiraumprojekte in Agglomerationen', 'Nur Wohnbau', 'Industriezonen'], correct: 1, explanation: 'Die Agglomerationsprogramme des Bundes (ARE) co-finanzieren u.a. Grünraum- und Freiraumprojekte sowie Massnahmen für Langsamverkehr in Agglomerationen.' },
      { id: 'q10', question: 'Was verlangt die Biodiversitätsstrategie Schweiz von der Raumplanung?', options: ['Mehr Bauzonen', 'Grünräume als Lebensräume und ökologische Vernetzung planen', 'Weniger Schutzgebiete', 'Nur ästhetische Grünflächen'], correct: 1, explanation: 'Die Biodiversitätsstrategie Schweiz und der Aktionsplan Biodiversität verlangen, dass Grünräume nicht nur als Erholung, sondern als Lebensräume und ökologische Vernetzungskorridore geplant werden.' },
    ],
  },
}


Object.assign(COURSES_DATA, RAUMPLANUNG_COURSES)


// ── AGENTUR / MARKETING KURSE — Brandwerk Zürich AG ─────────
// ── BRANDWERK ZÜRICH AG — AGENTUR / MARKETING KURSE ─────────
// Neue Standard-Qualität: Quellen, mehr Tiefe, 10 Fragen, Thank-You-Page

const AGENTUR_COURSES: Record<string, CourseData> = {

  'ki-agentur': {
    id: 'ki-agentur',
    emoji: '🤖',
    title: 'KI-Tools im Agenturalltag',
    subtitle: 'ChatGPT, Copilot und Co. — professionell, sicher und effizient anwenden',
    regulation: 'OpenAI GPT-4o · Microsoft Copilot · Adobe Firefly · EU AI Act (EU) 2024/1689',
    color: '#7C3AED',
    bg: '#EDE9FE',
    duration: '35 Min.',
    passing_score: 70,
    modules: [
      {
        id: 'm1',
        title: 'Sprachmodelle verstehen: Was wirklich dahinter steckt',
        duration: '9 Min.',
        content: [
          'Grosse Sprachmodelle (Large Language Models, LLMs) wie GPT-4o oder Claude 3 funktionieren als hochkomplexe Wahrscheinlichkeitsmaschinen: Sie sagen voraus, welches Token (Wort oder Wortteil) als nächstes am wahrscheinlichsten kommt — basierend auf Training mit Billionen von Textzeichen. Das Resultat klingt überzeugend, ist aber keine Erkenntnis im menschlichen Sinne.',
          'Dieses Grundverständnis ist entscheidend für den professionellen Einsatz in der Agenturarbeit. LLMs halluzinieren — sie erfinden Fakten, die plausibel klingen. Keine KI-generierte Aussage über spezifische Zahlen, Studien oder externe Fakten sollte ohne Prüfung weiterverwendet werden. Das ist keine Schwäche von KI — es ist ihre Funktionsweise.',
          'Microsoft Copilot ist tief in Microsoft 365 integriert: Word, PowerPoint, Teams, Outlook und Excel. In M365-Business-Abonnements ist die Copilot-Lizenz oft günstig zubuchbar. Slides aus Briefings generieren, Meetings transkribieren, E-Mails anpassen — eine realistische Zeitersparnis von 30–60 Minuten täglich bei systematischem Einsatz.',
          'Adobe Firefly für Bildgenerierung ist DSGVO-sicher für Kundenprojekte: Es wurde ausschliesslich auf lizenzfreien Adobe-Stock-Bildern und eigenem Content trainiert. Midjourney (qualitativ führend) hat eine weniger transparente Trainingsdatenbasis. Für finale Kundenprojekte mit kommerzieller Verwertung: Firefly oder explizite IP-Klärung im Kundenvertrag.',
          'Datenschutz im Agenturkontext: Microsoft Copilot für M365 verarbeitet Daten im EU-Rechenzentrum, DSGVO-konform konfigurierbar. Consumer-ChatGPT (Free/Plus) und ähnliche Tools: keine vertraulichen Kundendaten oder NDA-relevanten Informationen eingeben. Team-Policy schriftlich festhalten.',
        ],
        keypoints: [
          'LLM = Wahrscheinlichkeitsmaschine — Fakten aus KI-Output immer prüfen',
          'Copilot in M365: echte Zeitersparnis, DSGVO-konform, EU-Server',
          'Adobe Firefly: copyright-sicher für kommerzielle Kundenprojekte',
          'Consumer-KI-Tools: keine vertraulichen Kundendaten, keine NDAs',
          'KI-Tool-Landschaft entwickelt sich monatlich — regelmässig evaluieren',
        ],
        sources: [
          'OpenAI. GPT-4 Technical Report. San Francisco: OpenAI, 2023 — openai.com/research/gpt-4',
          'Microsoft. Data, Privacy, and Security for Microsoft 365 Copilot. Redmond: Microsoft, 2024 — learn.microsoft.com/microsoft-365-copilot',
          'Adobe. Adobe Firefly Commercial Use Terms & FAQ. San Jose: Adobe, 2024 — helpx.adobe.com/firefly/using/firefly-terms.html',
        ],
      },
      {
        id: 'm2',
        title: 'Prompt Engineering: Systematisch bessere Ergebnisse erzielen',
        duration: '9 Min.',
        content: [
          'Prompt Engineering ist die Fähigkeit, KI-Sprachmodelle so anzusprechen, dass sie konsistent nützliche Outputs liefern. Die professionelle Formel: Persona + Kontext + Aufgabe + Format + Einschränkungen. Wer diese fünf Elemente in den Prompt integriert, verdoppelt typischerweise die Output-Qualität.',
          'Persona-Zuweisung macht den Unterschied: "Du bist ein erfahrener B2B-Texter für Schweizer Technologieunternehmen, der für ein CFO-Auditorium schreibt und klare, faktenbasierte Sprache ohne Marketing-Floskeln verwendet" liefert fundamental bessere Ergebnisse als kein Kontext.',
          'Chain-of-Thought Prompting reduziert Halluzinationen: "Analysiere zuerst die Zielgruppe, dann identifiziere die 3 stärksten Argumente, dann formuliere den Text — erkläre jeden Schritt." Das Modell muss explizit denken statt direkt zu generieren, was Fehlerquellen minimiert.',
          'Konkrete Agentur-Use-Cases: Briefing-Extraktion aus PDFs (Key-Messages, Zielgruppe, Tonalität), A/B-Variantenproduktion ("5 Headlines in verschiedenen Tonalitäten"), Schweizerdeutsche Lokalisierung ("Übersetze auf Schweizer Hochdeutsch, für Entscheider im Finanzsektor"), Wettbewerbsanalyse ("Fasse Kommunikation von Mitbewerber X zusammen, identifiziere Differenzierungsansätze").',
          'Prompt-Templates als Team-Asset: Erfolgreiche Prompt-Strukturen in einer gemeinsamen Bibliothek (Notion, Confluence) ablegen. Gute Prompts amortisieren sich schnell. Wer einmalig 30 Minuten in einen perfekten Briefing-Extraktion-Prompt investiert, spart 1–2 Stunden pro Projekt dauerhaft.',
        ],
        keypoints: [
          'Prompt-Formel: Persona + Kontext + Aufgabe + Format + Einschränkungen',
          'Chain-of-Thought: schrittweises Vorgehen reduziert Halluzinationen nachweislich',
          'Briefing-Extraktion aus PDF: reale Zeitersparnis 1–2h pro Projekt',
          'Prompt-Templates-Bibliothek: Team-Asset, einmalig investieren, dauerhaft profitieren',
          '3–5 Iterationen sind normal — Perfektionismus beim Erstprompt kostet mehr Zeit',
        ],
        sources: [
          'Wei, J. et al. Chain-of-Thought Prompting Elicits Reasoning in LLMs. arXiv:2201.11903. Google Brain, 2022 — arxiv.org/abs/2201.11903',
          'Anthropic. Prompt Engineering Guide. San Francisco: Anthropic, 2024 — docs.anthropic.com/en/docs/build-with-claude/prompt-engineering',
          'OpenAI. Best Practices for Prompt Engineering. San Francisco: OpenAI, 2023 — platform.openai.com/docs/guides/prompt-engineering',
        ],
      },
      {
        id: 'm3',
        title: 'KI-Bildgenerierung: Professionell, rechtssicher, effizient',
        duration: '9 Min.',
        content: [
          'KI-Bildgenerierung ist für Agenturen der direkteste Produktivitätsgewinn: Moodboards in 10 Minuten statt 3 Stunden, Persona-Visualisierungen ohne Shooting, Variantenproduktion für Kundenpräsentationen. Aktuelle Tools (Midjourney v6, DALL-E 3, Adobe Firefly, Stable Diffusion XL) sind für Konzeptpräsentationen produktionsreif.',
          'Copyright-Frage ist entscheidend für die Toolwahl: Adobe Firefly wurde auf lizenzfreien Adobe-Stock-Bildern trainiert — für kommerzielle Kundenprojekte freigegeben, kein IP-Risiko. Midjourney und DALL-E 3 sind qualitativ stark, aber die Trainingsdatenbasis ist weniger transparent. Bei direkt erkennbarer Ähnlichkeit zu geschützten Werken besteht IP-Risiko. Für finale Kundenkampagnen: Firefly oder explizite Klärung im Kundenvertrag.',
          'Professionelle Prompt-Technik für Bilder: Stil + Inhalt + Komposition + Licht + Format. Statt "Team im Büro": "Corporate photography editorial style, diverse team of three professionals in animated discussion, modern Zurich office with large windows, natural warm afternoon light, wide angle 16:9, candid authentic moment, Canon 5D Mark IV aesthetic, no stock-photo feel".',
          'EU AI Act (in Kraft 2024/25): Transparenzpflichten für KI-generierte Inhalte in der Werbung. Deepfakes und manipulative KI-Techniken in Werbung sind verboten. Standard-Bildgenerierung für Moodboards und Konzeptpräsentationen ist unkritisch. Bei Schaltung in bezahlten Medien: Deklaration je nach Medienumfeld und Kundenrichtlinien prüfen.',
          'Workflow-Empfehlung für Agenturteams: Stil-Prompt-Bibliothek pro Kunde anlegen ("Markenästhetik in KI-Prompt-Sprache"), intern testen und dokumentieren, quarterly aktualisieren. Konsistenz in der Bildsprache wird so trotz KI-Generierung sichergestellt.',
        ],
        keypoints: [
          'Adobe Firefly: freigegeben für kommerzielle Nutzung, kein IP-Risiko',
          'Midjourney/DALL-E 3: qualitativ stark, IP-Risiko bei kommerzieller Schaltung prüfen',
          'Prompt-Formel Bild: Stil + Inhalt + Komposition + Licht + Format + Mood',
          'EU AI Act: Deepfakes und manipulative KI verboten, Standard-Bildgenerierung unkritisch',
          'Kunden-Stil-Prompt-Bibliothek: sichert konsistente Bildsprache bei KI-Generierung',
        ],
        sources: [
          'EU. Verordnung (EU) 2024/1689 (AI Act), Art. 50: Transparenzpflichten. Brüssel: Europäisches Parlament, 2024 — eur-lex.europa.eu',
          'Adobe. Firefly FAQ: Can I use Firefly output commercially? San Jose: Adobe, 2024 — helpx.adobe.com',
          'World Intellectual Property Organization (WIPO). Generative AI and IP Policy. Geneva: WIPO, 2024 — wipo.int/about-ip/en/artificial_intelligence',
        ],
      },
      {
        id: 'm4',
        title: 'KI strategisch in den Agentur-Workflow verankern',
        duration: '8 Min.',
        content: [
          'Strategische KI-Integration bedeutet nicht, alle Prozesse zu automatisieren — sondern die richtigen Momente zu identifizieren, in denen KI echten Wert schafft ohne Qualität, Datenschutz oder Kundenwerte zu gefährden. Research und Briefing-Verdichtung, erste Entwürfe und Varianten, Übersetzung und Lokalisierung, Reporting-Automatisierung — das sind die klaren Gewinnerfelder.',
          'Was KI nicht ersetzen kann — und nicht sollte: Kundenvertrauen aufbauen, strategische Intuition, das Gespür für "das trifft den Kunden", kreative Leaps jenseits des Bekannten. Diese menschlichen Fähigkeiten werden durch KI wertvoller, nicht obsolet. Der Wettbewerbsvorteil liegt in der Kombination.',
          'Effizienz-Realität: Teams, die KI systematisch und kompetent einsetzen, schaffen laut McKinsey Global Institute (2023) die gleiche Arbeitsqualität in 20–40% weniger Zeit. In der Agenturpraxis: mehr strategische Arbeit, stärkere Pitches, oder höhere Marge bei gleicher Teamgrösse.',
          'DSGVO-Prüfpunkte vor jeder neuen KI-Integration: Wo sind die Daten? (EU-Server bevorzugen) Wer hat Zugriff? (Subprozessoren des Anbieters prüfen) Werden Daten für Training genutzt? (Opt-out verfügbar?) Gibt es einen Auftragsverarbeitungsvertrag? Für Microsoft 365 Copilot: alle Punkte über DPA regelbar.',
          'Team-KI-Policy als Mindeststandard: Welche Tools für welche Anwendungsfälle (erlaubt/verboten), Datenschutzregeln (keine Kundendaten in Consumer-Tools), Deklarationspflichten gegenüber Kunden, monatliche Tool-Evaluation-Session. Wer heute klare Regeln setzt, vermeidet morgen teure Vorfälle.',
        ],
        keypoints: [
          'McKinsey 2023: 20–40% Effizienzgewinn bei systematischem KI-Einsatz',
          'Mensch + KI > KI allein: strategische Kompetenz wird wertvoller, nicht obsolet',
          'DSGVO vor KI-Integration: Server, Subprozessoren, Training-Opt-out, AVV',
          'Team-KI-Policy: klare Regeln für Tools, Datenschutz, Deklaration',
          'Monatliche Tool-Evaluation: KI-Landscape verändert sich schnell',
        ],
        sources: [
          'McKinsey Global Institute. The Economic Potential of Generative AI: The Next Productivity Frontier. New York: McKinsey, 2023 — mckinsey.com/mgi',
          'World Economic Forum. The Future of Jobs Report 2023. Davos: WEF, 2023 — weforum.org/reports/the-future-of-jobs-report-2023',
          'EU. AI Act (EU) 2024/1689: Vollständiger Text. Brüssel: Europäisches Parlament, 2024 — eur-lex.europa.eu/legal-content/DE/TXT/?uri=OJ:L_202401689',
        ],
      },
    ],
    quiz: [
      { id: 'q1', question: 'Wie funktioniert ein Large Language Model (LLM) grundlegend?', options: ['Es durchsucht eine Wissensdatenbank nach der Antwort', 'Es sagt das statistisch wahrscheinlichste nächste Token voraus', 'Es verbindet sich in Echtzeit mit dem Internet', 'Es analysiert Nutzerabsichten durch Mustererkennung'], correct: 1, explanation: 'LLMs sagen das wahrscheinlichste nächste Token (Wort oder Wortteil) voraus — basierend auf Training mit riesigen Textmengen. Sie "wissen" nichts, sie generieren statistisch plausible Antworten.' },
      { id: 'q2', question: 'Welches KI-Bildtool ist für kommerzielle Kundenprojekte uneingeschränkt freigegeben?', options: ['Midjourney v6', 'DALL-E 3', 'Adobe Firefly', 'Stable Diffusion XL'], correct: 2, explanation: 'Adobe Firefly ist ausschliesslich auf lizenzfreien Adobe-Stock-Bildern trainiert und für kommerzielle Nutzung explizit freigegeben — kein IP-Risiko für Kundenkampagnen.' },
      { id: 'q3', question: 'Was ist die Prompt-Engineering-Formel für professionelle Ergebnisse?', options: ['Kurze, präzise Stichwörter', 'Persona + Kontext + Aufgabe + Format + Einschränkungen', 'Nur die Aufgabe klar formulieren', 'Möglichst detaillierte Beschreibung der KI-Technologie'], correct: 1, explanation: 'Die professionelle Formel: Persona zuweisen, Kontext geben, klare Aufgabe, gewünschtes Format, Einschränkungen definieren — verdoppelt typischerweise die Output-Qualität.' },
      { id: 'q4', question: 'Was darf NICHT in Consumer-KI-Tools (ChatGPT Free/Plus) eingegeben werden?', options: ['Eigene Textentwürfe zur Überarbeitung', 'Allgemeine Branchenfragen', 'Vertrauliche Kundendaten und NDA-relevante Informationen', 'Briefing-Strukturen ohne Namen'], correct: 2, explanation: 'Consumer-KI-Tools (ChatGPT Free/Plus) speichern Daten und trainieren ggf. Modelle. Vertrauliche Kundendaten, NDAs und personenbezogene Daten gehören nicht hinein.' },
      { id: 'q5', question: 'Was bewirkt Chain-of-Thought Prompting?', options: ['Verbindet mehrere KI-Tools', 'Lässt die KI schrittweise vorgehen — reduziert Halluzinationen', 'Wiederholt den Prompt mehrfach', 'Kombiniert mehrere Sprachmodelle'], correct: 1, explanation: 'Chain-of-Thought: KI explizit schrittweise vorgehen lassen. Das erzwingt nachvollziehbares "Reasoning" und reduziert nachweislich Fehler und Halluzinationen.' },
      { id: 'q6', question: 'Was verbietet der EU AI Act für Marketing?', options: ['Jeden KI-Einsatz in der Werbung', 'Personalisierte Werbung generell', 'Deepfakes und manipulative KI-Techniken', 'KI-generierte Textinhalte'], correct: 2, explanation: 'Art. 5 EU AI Act verbietet Deepfakes (ohne Einwilligung) und manipulative KI-Techniken in Werbung. Standard-Bildgenerierung und Texterstellung sind unkritisch.' },
      { id: 'q7', question: 'Welches Effizienz-Potenzial zeigt McKinsey für KI-Einsatz?', options: ['5–10% Zeitersparnis', '20–40% bei systematischem Einsatz', '60–80% bei allen Tätigkeiten', 'Über 90% bei Kreativarbeit'], correct: 1, explanation: 'McKinsey Global Institute (2023): 20–40% Effizienzgewinn bei systematischem und kompetentem KI-Einsatz — bei kreativen Wissensarbeiten realistisch.' },
      { id: 'q8', question: 'Was ist bei der DSGVO-Prüfung vor einer KI-Integration zu beachten?', options: ['Nur der Preis des Tools', 'Server-Standort, Subprozessoren, Training-Opt-out, AVV', 'Nur die Benutzeroberfläche', 'Ob das Tool ISO 9001 hat'], correct: 1, explanation: 'DSGVO-Checkliste: EU-Server bevorzugen, Subprozessoren prüfen, Training-Opt-out sicherstellen, Auftragsverarbeitungsvertrag abschliessen.' },
      { id: 'q9', question: 'Was ist eine Team-KI-Policy mindestens?', options: ['Eine informelle Empfehlung', 'Schriftliche Regeln für Tools, Datenschutz und Deklarationspflichten', 'Ein monatlicher Newsletter', 'Nur für Führungskräfte'], correct: 1, explanation: 'Eine Team-KI-Policy regelt schriftlich: welche Tools für welche Zwecke erlaubt, Datenschutzregeln, Deklarationspflichten gegenüber Kunden — Mindeststandard für professionelle Agenturen.' },
      { id: 'q10', question: 'Was kann KI in der Agenturarbeit NICHT ersetzen?', options: ['Erste Textentwürfe und Varianten', 'Research und Zusammenfassungen', 'Kundenvertrauen und strategische Intuition', 'Meeting-Protokolle und Notizen'], correct: 2, explanation: 'Kundenvertrauen, strategische Intuition und das Gespür für "das trifft den Kunden" bleiben menschliche Stärken. Diese werden durch KI wertvoller, nicht ersetzt.' },
    ],
  },

  'dsgvo-marketing': {
    id: 'dsgvo-marketing',
    emoji: '🍪',
    title: 'Datenschutz im Marketing — verständlich und rechtssicher',
    subtitle: 'DSGVO, Cookie-Consent und Analytics ohne Juristendeutsch',
    regulation: 'DSGVO (EU) 2016/679 · DSG 2023 · ePrivacy · IAB TCF 2.0',
    color: '#0369A1',
    bg: '#E0F2FE',
    duration: '40 Min.',
    passing_score: 75,
    modules: [
      {
        id: 'm1',
        title: 'DSGVO für Marketing-Teams — was konkret gilt',
        duration: '10 Min.',
        content: [
          'Die DSGVO (Datenschutz-Grundverordnung) gilt seit dem 25. Mai 2018 und schützt personenbezogene Daten von EU-Bürgern. Als Schweizer Agentur mit EU-Kundenkontakt oder EU-Zielgruppen unterliegen Sie dem Marktortprinzip (Art. 3 DSGVO) — unabhängig davon, wo Ihre Server stehen.',
          'Für Agenturen die entscheidende Rolle: Als Auftragsverarbeiter (Art. 28 DSGVO) verarbeiten Sie Kundendaten im Auftrag und benötigen vor dem ersten Datenkontakt einen gültigen Auftragsverarbeitungsvertrag (AVV). Ohne AVV sind Sie in einem rechtlichen Graubereich — auch wenn dies im Agenturalltag häufig vernachlässigt wird.',
          'Was gilt als personenbezogenes Datum im Marketing? Mehr als die meisten denken: Name, E-Mail, IP-Adresse, Cookie-ID, Klickverhalten, Gerätefingerprint, Kaufhistorie, Geolokation, Browsing-Verhalten. Alles, was eine natürliche Person direkt oder indirekt identifizierbar macht.',
          'Sechs Rechtsgrundlagen der DSGVO (Art. 6): Im Marketing-Kontext relevant sind Einwilligung (Newsletter, Tracking), Vertrag (transaktionale E-Mails), Berechtigte Interessen (einige B2B-Kommunikationen). "Die Kunden haben unserer Website zugestimmt" ist keine Rechtsgrundlage — der Consent-Banner muss spezifisch und freiwillig sein.',
          'Bussgelder: Die DSGVO sieht Strafen von bis zu 4% des globalen Jahresumsatzes oder 20 Mio. EUR vor. Meta wurde 2023 mit 1,2 Mrd. EUR gebüsst. Auch KMU waren betroffen. Agenturen haften als Auftragsverarbeiter mit — Unwissenheit ist kein Schutz.',
        ],
        keypoints: [
          'Marktortprinzip: DSGVO gilt bei EU-Bürgern unabhängig von Server-Standort',
          'Agentur als Auftragsverarbeiter → AVV vor Datenzugriff zwingend',
          'IP-Adresse, Cookie-ID, Klickverhalten = personenbezogene Daten',
          'Rechtsgrundlage für jeden Verarbeitungsschritt definieren',
          'Bussgelder bis 4% Jahresumsatz oder 20 Mio. EUR',
        ],
        sources: [
          'Verordnung (EU) 2016/679 (DSGVO), vollständiger Text — eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32016R0679',
          'EDPB. Guidelines 07/2020 on the concepts of controller and processor. Brüssel: EDPB, 2021 — edpb.europa.eu',
          'EDÖB. Leitfaden DSG 2023 für private Unternehmen. Bern: EDÖB, 2023 — edoeb.admin.ch',
        ],
      },
      {
        id: 'm2',
        title: 'Cookie-Banner, Meta-Pixel und Analytics — was rechtlich gilt',
        duration: '10 Min.',
        content: [
          'Cookie-Banner sind das sichtbarste Datenschutz-Element im Web — und das am häufigsten falsch implementierte. Viele Banner sind so gestaltet, dass Ablehnen schwerer ist als Akzeptieren. Das ist seit EDPB-Leitlinien 2022 explizit illegal in der EU.',
          'Was ein rechtsgültiger Cookie-Banner leisten muss: "Alle ablehnen" genauso prominent wie "Alle akzeptieren" darstellen, keine vorausgefüllten Häkchen für nicht-notwendige Cookies, klare Information zu gesetzten Cookies, einfache Rücknahmemöglichkeit. Statistik: Bei fairem Banner lehnen 60–80% der Nutzer Marketing-Cookies ab.',
          'Meta-Pixel und Google Analytics 4 (GA4): Beide übertragen Daten in die USA. Das EU-US Data Privacy Framework (Juli 2023) schafft neue Rechtsgrundlage für Datenübertragungen an zertifizierte US-Unternehmen — Meta und Google sind zertifiziert. Für FINMA-regulierte Kunden: Schweizer Alternativen evaluieren.',
          'Server-Side Tracking (ssGTM): Google Tag Manager kann server-seitig auf dem eigenen Server betrieben werden. Vorteil: Kein Third-Party-Cookie im Browser, mehr Datenkontrolle, bessere Datenqualität trotz Adblocker. Nachteil: Technischer Aufwand, laufende Server-Kosten.',
          'Schweizer Perspektive: Das DSG 2023 ist für rein inländische Sachverhalte weniger restriktiv als die DSGVO. Aber: Schweizer Websites mit EU-Traffic müssen DSGVO-Standards einhalten. Das betrifft praktisch jede Agentur und jeden grösseren Kunden.',
        ],
        keypoints: [
          '"Alle ablehnen" muss genauso prominent sein wie "Alle akzeptieren"',
          'EU-US DPF (2023): neue Rechtsgrundlage für Meta-Pixel und GA4',
          'Server-Side Tracking: mehr Kontrolle, bessere Datenqualität',
          '60–80% Ablehnungsrate → First-Party-Data-Strategie entwickeln',
          'DSG 2023 weniger restriktiv — aber DSGVO gilt bei EU-Traffic',
        ],
        sources: [
          'EDPB. Guidelines 03/2022 on Deceptive Design Patterns. Brüssel: EDPB, 2022 — edpb.europa.eu/our-work-tools/our-documents/guidelines',
          'Europäische Kommission. Adequacy Decision EU-US Data Privacy Framework, 2023/1795. Brüssel: EK, 2023 — eur-lex.europa.eu',
          'EDÖB. Erläuterungen zum revidierten DSG 2023. Bern: EDÖB, 2023 — edoeb.admin.ch/edoeb/de/home/datenschutz/dsg-2023',
        ],
      },
      {
        id: 'm3',
        title: 'E-Mail-Marketing rechtssicher gestalten',
        duration: '10 Min.',
        content: [
          'E-Mail-Marketing bleibt mit einem durchschnittlichen ROI von 36:1 (Litmus 2023) der effektivste Direktkanal — und gleichzeitig der am häufigsten DSGVO-widrig umgesetzte. Drei Massnahmen sichern 90% der Compliance.',
          'Double-Opt-in ist Best-Practice und in Deutschland gesetzliche Pflicht (UWG): Anmeldeformular → Bestätigungs-E-Mail → aktiver Klick auf Bestätigungslink → Einwilligung mit Zeitstempel gespeichert. Nur mit diesem Nachweis können Sie im Streitfall die Einwilligung belegen.',
          'Pflichtinhalte jeder Marketing-E-Mail: Absenderangabe mit physischer Adresse, Abmeldemöglichkeit (1-Klick, direkt im E-Mail), klare Erkennbarkeit als Werbung. Abmeldung muss innerhalb von 10 Werktagen verarbeitet werden.',
          'B2B-Grauzone: Die DSGVO erlaubt unter berechtigtem Interesse (Art. 6 Abs. 1 lit. f) eine erste B2B-Kontaktaufnahme, wenn das Angebot beruflich relevant ist und eine Abmeldeoption vorhanden ist. Das Schweizer UWG (Art. 3 lit. o) ist strenger — Kaltakquise per E-Mail ist grundsätzlich nur mit Einwilligung erlaubt.',
          'Tool-Empfehlungen nach Datenschutzniveau: Höchste Compliance: Infomaniak Newsletter (CH), Brevo (EU, Frankfurt). Gute Compliance mit Konfiguration: HubSpot (EU-Server wählbar), Mailchimp (US, SCCs erforderlich). Für FINMA-regulierte Kunden: Infomaniak oder self-hosted.',
        ],
        keypoints: [
          'Double-Opt-in mit Zeitstempel: einziger belastbarer Einwilligungsnachweis',
          'E-Mail-Pflichtinhalte: Absender, Adresse, 1-Klick-Abmeldung, Werbekennung',
          'B2B berechtigtes Interesse: relevant + Abmeldeoption + keine sensitiven Daten',
          'UWG (CH) strenger als DSGVO bei E-Mail-Kaltakquise',
          'Infomaniak Newsletter: maximale CH/EU-Datenschutz-Compliance',
        ],
        sources: [
          'Litmus. State of Email Marketing 2023: ROI and Benchmarks. Boston: Litmus, 2023 — litmus.com/blog/email-roi',
          'Art. 6 Abs. 1 lit. f DSGVO: Berechtigte Interessen — eur-lex.europa.eu',
          'Bundesgesetz gegen den unlauteren Wettbewerb (UWG), SR 241, Art. 3 lit. o — admin.ch/fedlex',
        ],
      },
      {
        id: 'm4',
        title: 'Die cookielose Zukunft: First-Party-Daten und neue Strategien',
        duration: '10 Min.',
        content: [
          'Die Ära der Third-Party-Cookies endet. Google hat Chrome (65% Marktanteil) auf Privacy Sandbox umgestellt. Safari und Firefox blockieren schon lange. Das betrifft Tracking, Retargeting, Attribution und Frequenzkappung gleichermassen.',
          'First-Party-Data-Strategie als Antwort: Daten die Nutzer direkt auf Ihrer Plattform hinterlassen — mit expliziter Einwilligung — sind der neue strategische Wert. Konkret: E-Mail-Adressen aus Newsletter-Anmeldungen, Kaufdaten, Login-Daten, Umfragedaten, Quiz-Ergebnisse. Diese Daten gehören Ihnen, sind DSGVO-konform wenn richtig erhoben, und werden wertvoller wenn Third-Party-Daten wegfallen.',
          'Contextual Targeting als Alternative: Anzeigen auf Basis des Seiteninhalts statt des Nutzerprofils. Laut IAS-Studie (2023) ist contextual Advertising ähnlich effektiv wie behaviorales Targeting — ohne Datenschutzrisiken. Für Agenturen: jetzt in contextual Targeting-Kompetenz investieren.',
          'Attribution in der cookielosen Welt: Multi-Touch-Attribution wird schwieriger. Modell-basierte Attribution (Incrementality Testing, Media Mix Modeling) werden zum Standard. Für Agenturen: Kunden jetzt auf diese Veränderung vorbereiten, Tracking-Infrastruktur konservieren.',
          'ePrivacy-Verordnung (in Verhandlung, erwartet 2026/27): Dehnt Cookie-Regelungen auf alle digitalen Kommunikationsmittel aus — WhatsApp Business, Teams, E-Mail-Tracking, In-App-Tracking. Jetzt First-Party-Daten aufbauen ist die beste Vorbereitung.',
        ],
        keypoints: [
          'Third-Party-Cookies: effektiv abgelöst durch Privacy Sandbox in Chrome',
          'First-Party-Daten: strategischer Wert steigt, DSGVO-konform wenn korrekt erhoben',
          'Contextual Targeting: ähnlich effektiv wie behavioral, kein Datenschutzrisiko',
          'Attribution: Incrementality Testing + Media Mix Modeling als neue Standards',
          'ePrivacy (2026/27): jetzt First-Party-Strategie aufbauen',
        ],
        sources: [
          'Google. Privacy Sandbox Initiative Documentation. Mountain View: Google, 2024 — developers.google.com/privacy-sandbox',
          'Integral Ad Science (IAS). Contextual Intelligence Report 2023. New York: IAS, 2023 — integralads.com/insider/contextual-intelligence-report',
          'Europäische Kommission. ePrivacy Regulation — Proposal COM/2017/010 final (in Revision) — eur-lex.europa.eu',
        ],
      },
    ],
    quiz: [
      { id: 'q1', question: 'Wann gilt die DSGVO für eine Schweizer Agentur?', options: ['Nie, die Schweiz ist kein EU-Mitglied', 'Nur wenn der Server in der EU steht', 'Wenn EU-Bürger betroffen sind (Marktortprinzip)', 'Nur bei FINMA-regulierten Kunden'], correct: 2, explanation: 'Das Marktortprinzip (Art. 3 DSGVO) bestimmt: Die DSGVO gilt unabhängig vom Server-Standort, wenn EU-Bürger betroffen sind oder Waren/Dienstleistungen in der EU angeboten werden.' },
      { id: 'q2', question: 'Was muss eine Agentur vor dem Zugriff auf Kundendaten abschliessen?', options: ['Eine Versicherung', 'Einen Auftragsverarbeitungsvertrag (AVV)', 'Eine EDÖB-Registrierung', 'Ein ISO 27001 Zertifikat'], correct: 1, explanation: 'Als Auftragsverarbeiter (Art. 28 DSGVO) muss die Agentur vor jeder Datenverarbeitung einen gültigen AVV mit dem Kunden abgeschlossen haben.' },
      { id: 'q3', question: 'Was ergeben Statistiken bei DSGVO-konformen Cookie-Bannern?', options: ['Fast alle akzeptieren', '60–80% lehnen Marketing-Cookies ab', 'Keine messbare Auswirkung', 'Mehr Conversions als ohne Banner'], correct: 1, explanation: 'Bei DSGVO-konformen Bannern mit gleichwertiger Ablehnoption lehnen 60–80% der Nutzer Marketing-Cookies ab — was First-Party-Data-Strategien wichtiger macht.' },
      { id: 'q4', question: 'Was bewirkt das EU-US Data Privacy Framework (2023)?', options: ['Verbot aller US-Tools in der EU', 'Neue Rechtsgrundlage für Datentransfers zu zertifizierten US-Unternehmen', 'DSGVO-Ausnahme für Agenturen', 'Abschaffung von Cookie-Bannern'], correct: 1, explanation: 'Das EU-US DPF (Juli 2023) schafft neue Rechtsgrundlage für Datentransfers zu zertifizierten US-Unternehmen wie Meta und Google.' },
      { id: 'q5', question: 'Was umfasst das Double-Opt-in Verfahren vollständig?', options: ['Nur das Anmeldeformular', 'Zweimalige Eingabe der E-Mail-Adresse', 'Anmeldung + Bestätigungs-E-Mail + aktiver Klick + Zeitstempel-Speicherung', 'Bestätigung per SMS'], correct: 2, explanation: 'Double-Opt-in: Anmeldeformular → Bestätigungs-E-Mail → aktiver Klick auf Bestätigungslink → Einwilligung mit Zeitstempel gespeichert. Nur so ist die Einwilligung beweissicher.' },
      { id: 'q6', question: 'Was ist die Rechtsgrundlage für B2B-E-Mail-Marketing unter berechtigtem Interesse?', options: ['Keine Einschränkungen bei B2B', 'Angebot beruflich relevant + Abmeldeoption + keine sensitiven Daten', 'Nur schriftliche Einwilligung', 'Branchenüblichkeit reicht als Begründung'], correct: 1, explanation: 'Berechtigtes Interesse (Art. 6 lit. f DSGVO) erlaubt B2B-Erstkontakt wenn: berufliche Relevanz gegeben, einfache Abmeldeoption vorhanden, keine sensitiven Daten betroffen.' },
      { id: 'q7', question: 'Welches Newsletter-Tool bietet maximale CH/EU-Datenschutz-Compliance?', options: ['Mailchimp (US-Server)', 'Constant Contact', 'Infomaniak Newsletter (CH)', 'ActiveCampaign'], correct: 2, explanation: 'Infomaniak Newsletter (Genf, Schweiz) ist optimal: Schweizer Hosting, kein US-Anbieter, DSGVO + DSG 2023 konform, ISO 27001 zertifiziert.' },
      { id: 'q8', question: 'Was ist Contextual Targeting?', options: ['Targeting basierend auf Nutzerverhalten und Cookies', 'Anzeigen auf Basis des Seiteninhalts, ohne Nutzerprofil', 'Geografisches Targeting', 'Demographic-based Targeting'], correct: 1, explanation: 'Contextual Targeting schaltet Anzeigen basierend auf dem Inhalt der besuchten Seite — ohne Nutzerprofil, ohne Third-Party-Cookies, DSGVO-unkritisch.' },
      { id: 'q9', question: 'Welche Modelle werden in der cookielosen Attribution wichtiger?', options: ['Last-Click-Attribution', 'First-Click-Attribution', 'Incrementality Testing und Media Mix Modeling', 'View-Through-Attribution'], correct: 2, explanation: 'Ohne Third-Party-Cookies werden modell-basierte Methoden Standard: Incrementality Testing (kausale Wirkungsmessung) und Media Mix Modeling (statistische Mediaeffizienz).' },
      { id: 'q10', question: 'Welche Kanäle reguliert die geplante ePrivacy-Verordnung neu?', options: ['Nur Web-Cookies', 'Alle digitalen Kanäle: Web, Messenger, E-Mail-Tracking, In-App', 'Nur soziale Medien', 'Nur Werbenetzwerke'], correct: 1, explanation: 'Die ePrivacy-Verordnung (erwartet 2026/27) dehnt Regeln auf alle digitalen Kommunikationsmittel aus — inkl. WhatsApp Business, Teams, E-Mail-Tracking und In-App-Kommunikation.' },
    ],
  },

  'abm-zertifikat': {
    id: 'abm-zertifikat',
    emoji: '🎯',
    title: 'Account-Based Marketing (ABM) Zertifikat',
    subtitle: 'Von der Target-Account-Liste zum messbaren Pipeline-Beitrag — praxisnah und zertifiziert',
    regulation: 'ITSMA ABM Framework 2022 · HubSpot ABM Certification · LinkedIn Marketing Solutions',
    color: '#14613E',
    bg: '#DCFCE7',
    duration: '50 Min.',
    passing_score: 75,
    modules: [
      {
        id: 'm1',
        title: 'ABM-Grundlagen und strategische Einordnung',
        duration: '12 Min.',
        content: [
          'Account-Based Marketing ist kein neuer Trend — es ist die Rückkehr zu dem, was gutes B2B-Marketing immer war: die richtigen Menschen im richtigen Unternehmen zur richtigen Zeit ansprechen. Was sich verändert hat: Technologie macht es skalierbar, und die Datengrundlage ist heute dramatisch besser als noch vor fünf Jahren.',
          'Die fundamentale Umkehrung des klassischen Demand-Generation-Funnels: Statt Awareness bei vielen → filtern → qualifizieren, dreht ABM den Prozess um. Erst Zielunternehmen definieren (Target Account List, TAL), dann Buyer-Profile identifizieren, dann gezielt Awareness und Engagement aufbauen, dann Sales aktivieren wenn Signale stark sind.',
          'ABM-Reifegrade nach ITSMA: Strategic ABM (1:1) — 5–30 hochpriore Accounts, vollständige Individualisierung. ABM Lite (1:few) — 20–100 Accounts, Segmentierung nach Branche und Grösse. Programmatic ABM (1:many) — 100+ Accounts, Technologie-getrieben. Agenturen wie Brandwerk arbeiten meist im 1:few-Modus.',
          'Business Case: ITSMA-Studie (2022) — 87% der ABM-Marketer sehen höheren ROI als bei anderen B2B-Ansätzen. Gartner (2023): Unternehmen mit reifem ABM erzielen 45% höhere Deal-Grössen und 25% kürzere Sales-Zyklen. Diese Zahlen erklären, warum ABM das am stärksten wachsende B2B-Marketing-Segment ist.',
          'Was ABM nicht ist: Kein schnelles Lead-Programm, kein Ersatz für schlechten Vertrieb, kein Tool das man einfach "einschaltet". ABM ist eine unternehmerische Entscheidung, Marketing und Sales gemeinsam auf dieselben Zielunternehmen zu fokussieren — mit einem Zeithorizont von 6–18 Monaten.',
        ],
        keypoints: [
          'ABM = umgekehrter Funnel: Zielaccounts zuerst definieren, dann aktivieren',
          'Drei Reifegrade: Strategic (1:1), ABM Lite (1:few), Programmatic (1:many)',
          '87% höherer ROI als andere B2B-Ansätze (ITSMA 2022)',
          'Gartner 2023: +45% Deal-Grösse, –25% Sales-Zyklen bei reifem ABM',
          'Zeitrahmen: 6–18 Monate für sichtbare Pipeline-Ergebnisse',
        ],
        sources: [
          'ITSMA. Account-Based Marketing Benchmark Study 2022. Lexington: ITSMA, 2022 — itsma.com/2022-abm-benchmark-study',
          'Gartner. Magic Quadrant for Account-Based Marketing Platforms 2023. Stamford: Gartner, 2023 — gartner.com/en/marketing',
          'Demandbase. State of ABM 2023. San Francisco: Demandbase, 2023 — demandbase.com/resources/state-of-abm',
        ],
      },
      {
        id: 'm2',
        title: 'Target Account List: Das Fundament des ABM-Erfolgs',
        duration: '13 Min.',
        content: [
          'Die Target Account List (TAL) ist das Fundament und der häufigste Fehlerursprung in ABM-Programmen. Eine schlecht definierte TAL verschwendet Budget und demoralisiert Sales. Eine präzise TAL konzentriert Energie auf Accounts mit dem höchsten potenziellen Wert.',
          'ICP-Entwicklung als Basis: Das Ideal Customer Profile (ICP) leitet sich aus der Analyse der besten bestehenden Kunden ab — höchster Customer Lifetime Value (CLV), bester Fit für das Angebot, einfachste Zusammenarbeit. Firmografische ICP-Dimensionen: Branche (NACE-Codes), Unternehmensgrösse, Wachstumsstadium, Technologie-Stack (via BuiltWith), geografische Präsenz, regulatorisches Umfeld.',
          'Intent Data als Prioritisierungs-Turbo: Tools wie Bombora, G2 Buyer Intent oder LinkedIn Matched Audiences zeigen, welche Unternehmen aktiv Inhalte zu bestimmten Themen konsumieren — also Kaufinteresse signalisieren. Accounts mit hohem Intent und gutem ICP-Fit sind die heissesten Prioritäten in der TAL.',
          'TAL-Grösse und -Segmentierung: Zu gross = verwässerter Fokus. Zu klein = limitiertes Pipeline-Potenzial. Faustregel für ein 1:few-Programm: 50–200 Accounts, priorisiert in Tier 1 (25 hottest), Tier 2 (75 high potential), Tier 3 (100 nurturing). Quartalsweise aktualisieren.',
          'Sales-Marketing-Abstimmung ist nicht optional: Sales und Marketing müssen die TAL gemeinsam definieren. Marketing kann die "richtigen" Accounts aquirieren — wenn Sales sie nicht bearbeitet, ist der Aufwand verschwendet. Umgekehrt gilt dasselbe.',
        ],
        keypoints: [
          'ICP aus besten Kunden ableiten: CLV, Fit, Zusammenarbeit als Kriterien',
          'Intent Data (Bombora, G2): zeigt aktiven Kaufbedarf in Zielunternehmen',
          'TAL-Struktur: 50–200 Accounts in Tier 1/2/3 priorisiert',
          'Sales + Marketing definieren TAL gemeinsam — keine Marketing-Only-Entscheidung',
          'TAL quartalsweise überprüfen und aktualisieren',
        ],
        sources: [
          'Demandbase / Engagio. ABM: A Practitioners Guide to Implementation. San Mateo: Engagio, 2021 — engagio.com/abm-practitioners-guide',
          'Bombora. B2B Intent Data Use Cases for Marketing & Sales. New York: Bombora, 2023 — bombora.com/resources/intent-data-use-cases',
          'Forrester. The State of ABM: Measurement and Attribution. Cambridge: Forrester, 2023 — forrester.com/report/abm-measurement',
        ],
      },
      {
        id: 'm3',
        title: 'ABM-Content, Personalisierung und Kanäle',
        duration: '13 Min.',
        content: [
          'Content-Personalisierung im ABM muss nicht bedeuten, für jeden Account alles neu zu erstellen. Die 80/20-Regel funktioniert: 80% Basiscontent (Kernbotschaften, ROI-Argumente, Produktbeschreibungen), 20% Account-Individualisierung (Branchenreferenz, spezifische Pain Points, Namen der Entscheider, aktuelle Unternehmensnews).',
          'Account Intelligence als Vorarbeit: Bevor Personalisierung beginnt, braucht es Insights. Quellen: LinkedIn (Posts der Entscheider, Jobausschreibungen zeigen aktuelle Prioritäten), Bombora (Intent Signals), Pressemitteilungen, G2/Capterra-Reviews über genutzte Technologie, Annual Reports bei börsennotierten Unternehmen.',
          'Content-Formate die im ABM funktionieren: Executive Briefings (personalisierte 2–4-seitige Dokumente für C-Level mit branchenspezifischen Zahlen), Account-spezifische Landing Pages (via Demandbase oder manuell — 2–3x höhere Engagement-Rate als generische Seiten), personalisierte Demo-Environments, LinkedIn-Konversationen vor dem ersten Sales-Kontakt.',
          'Kanal-Mix: LinkedIn ist der wichtigste Kanal für B2B-ABM — kein anderes Netzwerk bietet vergleichbares Account-basiertes Targeting (Unternehmen + Job-Title + Seniority). Ergänzend: E-Mail-Sequenzen (SDRs), Display Retargeting auf Zielaccounts, physische Events für 1:1-Accounts, Direct Mail für Late-Stage-Deals.',
          'Kanalkoordination ist der Schlüssel: ABM-Erfolg entsteht durch konsistente Botschaften über alle Kanäle. Wenn LinkedIn Botschaft X kommuniziert, Sales-E-Mails Botschaft Y, und Events Botschaft Z — verwirrt das Zielaccounts. Ein Playbook pro Account-Tier sichert Konsistenz über alle Touchpoints.',
        ],
        keypoints: [
          '80/20-Regel: 80% Basiscontent, 20% Account-Individualisierung',
          'Account Intelligence: LinkedIn, Bombora, Jobanzeigen, Annual Reports',
          'LinkedIn: wichtigster B2B-ABM-Kanal — unübertroffenes Account-Targeting',
          'ABM Landing Pages: 2–3x höhere Engagement-Rate als generische Seiten',
          'Kanalkoordination: einheitliche Botschaft über LinkedIn, E-Mail, Events und Sales',
        ],
        sources: [
          'LinkedIn. B2B Marketing Benchmark: Account-Based Marketing on LinkedIn 2023. Sunnyvale: LinkedIn, 2023 — business.linkedin.com/marketing-solutions/research',
          'Uberflip. The State of Content Experience in ABM 2023. Toronto: Uberflip, 2023 — uberflip.com/resources/reports',
          'ITSMA. How to Measure Account-Based Marketing. Lexington: ITSMA, 2023 — itsma.com/abm-measurement',
        ],
      },
      {
        id: 'm4',
        title: 'ABM messen: Die richtigen Metriken und Reporting',
        duration: '12 Min.',
        content: [
          'ABM-Reporting ist die häufigste Ursache für gescheiterte Programme — nicht weil ABM nicht funktioniert, sondern weil falsche Metriken verwendet werden. Wer ABM mit Lead-Volumen misst, wird enttäuscht. Wer mit Account-Engagement und Pipeline-Qualität misst, sieht echten Wert.',
          'Die vier entscheidenden ABM-Metriken: Account Engagement Score (AES) — aggregierte Messung aller Interaktionen eines Accounts (Websitebesuche, E-Mail-Öffnungen, Content-Downloads, LinkedIn-Interaktionen). Account Penetration Rate — Anteil der TAL-Accounts in aktiver Pipeline. Pipeline Influence — Anteil der Pipeline-Deals die durch ABM beeinflusst wurden. Deal Velocity — Geschwindigkeit der Pipeline-Bewegung bei ABM-Accounts.',
          'Attribution im B2B ist komplex: Durchschnittliche B2B-Deals haben 6–12 Touchpoints über 3–9 Monate. Last-Click-Attribution unterschätzt ABM-Wert massiv. Multi-Touch-Attribution (linear, U-shaped, data-driven) ist Standard. Für reifere Programme: Incrementality Testing — Pipeline-Entwicklung in behandelten Accounts vs. Kontrollgruppe vergleichen.',
          'Reporting-Rhythmus: Wöchentlich (Sales + Marketing): AES der Tier-1-Accounts, neue Pipeline-Aktivierung. Monatlich (Management): Account Penetration Rate, Pipeline Influence, ABM-Investitionen vs. beeinflusste Pipeline. Quartalsweise (C-Level): Deal Velocity, Win Rate bei ABM vs. Non-ABM, Customer Acquisition Cost.',
          'Gedulds-Argument für das C-Level: ABM-Ergebnisse sind oft nicht in Quartal 1 sichtbar. AES steigt in Monat 2–4, erste Pipeline-Aktivierung in Monat 4–8, Win Rate-Verbesserung in Monat 9–18. Diese Erwartungen müssen vor Programm-Start kommuniziert werden.',
        ],
        keypoints: [
          'Lead-Volumen ist die falsche ABM-Metrik — führt zu falschen Schlüssen',
          'Richtige Metriken: AES, Account Penetration, Pipeline Influence, Deal Velocity',
          '6–12 Touchpoints über 3–9 Monate → Multi-Touch-Attribution zwingend',
          'Reporting-Rhythmus: wöchentlich (Sales), monatlich (Mgmt), quartalsweise (C-Level)',
          'ABM-Timeline: Engagement M2–4, Pipeline M4–8, Win Rate M9–18',
        ],
        sources: [
          'Forrester. The State of ABM Measurement 2023. Cambridge: Forrester, 2023 — forrester.com',
          'HubSpot. Account-Based Marketing Analytics and Reporting Guide. Cambridge: HubSpot, 2023 — knowledge.hubspot.com/account-based-marketing',
          'Bizible (Adobe Marketo). Multi-Touch Attribution for B2B Marketing. San Jose: Adobe, 2022 — bizible.com/resources',
        ],
      },
    ],
    quiz: [
      { id: 'q1', question: 'Was unterscheidet ABM grundlegend von Demand Generation?', options: ['ABM nutzt keine digitalen Kanäle', 'ABM definiert zuerst Zielaccounts, dann Aktivierung (umgekehrter Funnel)', 'ABM ist nur für Grossunternehmen', 'ABM funktioniert ohne Sales-Zusammenarbeit'], correct: 1, explanation: 'ABM dreht den Funnel um: erst Target Account List definieren, dann gezielt Engagement bei diesen Accounts aufbauen — statt breit streuen und filtern.' },
      { id: 'q2', question: 'Was zeigt die ITSMA ABM Benchmark Study 2022 zum ROI?', options: ['Gleicher ROI wie andere Methoden', '87% der ABM-Marketer sehen höheren ROI', 'Schlechterer ROI als SEO', 'Nur Fortune-500-Unternehmen profitieren'], correct: 1, explanation: 'ITSMA 2022: 87% der ABM-Marketer berichten höheren ROI als bei anderen B2B-Marketingansätzen.' },
      { id: 'q3', question: 'Woraus leitet man das Ideal Customer Profile (ICP) am besten ab?', options: ['Aus der grössten verfügbaren Adressdatenbank', 'Aus den besten bestehenden Kunden: CLV, Fit, Zusammenarbeit', 'Aus einer zufälligen Branchenauswahl', 'Aus dem Bauchgefühl des Sales-Leiters'], correct: 1, explanation: 'Das ICP basiert auf der Analyse der besten Kunden: höchster Customer Lifetime Value, bester Fit für das Angebot, einfachste Zusammenarbeit.' },
      { id: 'q4', question: 'Was zeigen Intent Data Tools wie Bombora?', options: ['Demografische Daten der Entscheider', 'Welche Unternehmen aktiv Inhalte zu relevanten Themen konsumieren', 'Direktkontakte der Buying-Committee-Mitglieder', 'Umsatzzahlen der Zielaccounts'], correct: 1, explanation: 'Intent Data Tools messen, welche Unternehmen aktiv Inhalte zu bestimmten Themen konsumieren — ein klares Signal für aktives Kaufinteresse.' },
      { id: 'q5', question: 'Was ist die ABM-Content-Daumenregel?', options: ['100% individualisiert für jeden Account', '50% Basis, 50% individuell', '80% Basiscontent, 20% Account-Individualisierung', '20% Basis, 80% individuell'], correct: 2, explanation: '80/20: 80% Basiscontent mit Kernbotschaften, 20% Account-spezifische Individualisierung — das Optimum zwischen Effizienz und Relevanz.' },
      { id: 'q6', question: 'Warum ist LinkedIn der wichtigste B2B-ABM-Kanal?', options: ['Günstigste CPCs aller Plattformen', 'Unübertroffenes Account-Targeting: Unternehmen + Job-Title + Seniority', 'Grösste globale Reichweite', 'Einfachste technische Einrichtung'], correct: 1, explanation: 'LinkedIn bietet die präzisesten B2B-Targeting-Optionen: Unternehmen, Job-Funktion, Seniority, Branche — keine andere Plattform kombiniert diese Dimensionen.' },
      { id: 'q7', question: 'Was ist der Account Engagement Score (AES)?', options: ['Anzahl der Leads eines Accounts', 'Aggregierte Messung aller Interaktionen eines Accounts mit der eigenen Marke', 'Umsatzpotenzial des Accounts laut CRM', 'Anzahl der Sales-Kontakte pro Quartal'], correct: 1, explanation: 'Der AES aggregiert alle Account-Interaktionen: Websitebesuche, E-Mail-Öffnungen, Content-Downloads, LinkedIn-Interaktionen, Event-Teilnahmen.' },
      { id: 'q8', question: 'Wie viele Touchpoints hat ein durchschnittlicher B2B-Deal?', options: ['1–2 Touchpoints', '3–4 Touchpoints', '6–12 Touchpoints über 3–9 Monate', 'Über 30 Touchpoints'], correct: 2, explanation: 'B2B-Deals haben durchschnittlich 6–12 Touchpoints über 3–9 Monate — deshalb ist Multi-Touch-Attribution für korrekte ABM-Bewertung unerlässlich.' },
      { id: 'q9', question: 'Wann ist erste Pipeline-Aktivierung durch ABM typischerweise zu erwarten?', options: ['Monat 1–2', 'Monat 2–4', 'Monat 4–8', 'Nach 2+ Jahren'], correct: 2, explanation: 'ABM-Timeline: AES-Steigerung in Monat 2–4, erste Pipeline-Aktivierung in Monat 4–8, messbare Win-Rate-Verbesserung in Monat 9–18.' },
      { id: 'q10', question: 'Was ist die häufigste Ursache für gescheiterte ABM-Programme?', options: ['Falsches technisches Tool', 'Lead-Volumen statt Account Engagement als Hauptmetrik', 'Zu kleines Budget', 'Falscher Timing im Jahr'], correct: 1, explanation: 'Der häufigste Fehler: ABM mit Lead-Volumen messen statt Account Engagement und Pipeline-Qualität — was zu falschen Schlüssen und Programm-Abbruch führt.' },
    ],
  },

  'green-claims': {
    id: 'green-claims',
    emoji: '🌱',
    title: 'Nachhaltige Kommunikation & Green Claims Compliance',
    subtitle: 'Greenwashing rechtssicher vermeiden — EU Green Claims Directive 2024',
    regulation: 'EU Green Claims Directive 2024 · ISO 14021:2016 · CSRD (EU) 2022/2464',
    color: '#065F46',
    bg: '#ECFDF5',
    duration: '35 Min.',
    passing_score: 70,
    modules: [
      {
        id: 'm1',
        title: 'Greenwashing: Echte Fälle, echte Konsequenzen',
        duration: '9 Min.',
        content: [
          'Greenwashing ist seit 2024 nicht mehr nur ein Reputationsrisiko — es ist ein reguliertes Rechtsrisiko mit substanziellen Bussgeldern. Die EU Green Claims Directive macht ungerechtfertigte Umweltaussagen zu einer Haftungsfrage für Unternehmen und Agenturen gleichermassen.',
          'Fünf Greenwashing-Muster die Sie kennen müssen: (1) Vage Superlative ohne Nachweis — "100% nachhaltig", "klimaneutral", "umweltfreundlich". (2) Irrelevante Claims — "CFC-frei" für ein Produkt das nie CFCs enthielt. (3) Hidden Trade-offs — "Aus recyceltem Plastik" ohne Erwähnung der energieintensiven Herstellung. (4) Eigenmarken-Siegel ohne Drittprüfung. (5) Selektive Evidenz — nur vorteilhafte Studien zitieren.',
          'Reale Fälle mit Konsequenzen in Europa: H&M (2023) — "Conscious Collection" zurückgezogen nach niederländischer Verbraucherschutz-Klage. KLM (2023) — niederländisches Gericht verbot "CO2-neutrales Fliegen"-Werbung. Shell (2023) — britische ASA untersagte "Nachhaltiger Energieanbieter"-Werbung. Volkswagen (laufend) — Greenwashing-Kommunikation Teil juristischer Verfahren.',
          'Haftung für Agenturen: Als Agentur, die Greenwashing-Kommunikation entwickelt, können Sie mitgehaftet werden — in Deutschland explizit, in der Schweiz im Rahmen des Auftragsrechts. Die professionelle Prüfpflicht für Nachhaltigkeitsbehauptungen ist Teil des Sorgfaltsstandards. Keine Kampagne mit unverifizierten Umweltclaims schalten, auch wenn der Kunde darauf besteht.',
          'Chance statt nur Risiko: GfK-Studie (2023) zeigt: 68% der Konsumenten zahlen mehr für nachhaltige Produkte — wenn die Versprechen glaubwürdig sind. Agenturen, die in fundierte Nachhaltigkeitskommunikation investieren, bauen einen Wettbewerbsvorteil auf.',
        ],
        keypoints: [
          'Greenwashing ab 2024 rechtlich strafbar in der EU — Agentur haftet mit',
          'Fünf Muster: vage Superlative, irrelevante Claims, Hidden Trade-offs, Eigensiegel, selektive Evidenz',
          'H&M, KLM, Shell: reale Konsequenzen in Europa 2023',
          'Professionelle Prüfpflicht: Claims vor Umsetzung immer verifizieren',
          'GfK 2023: 68% Zahlungsbereitschaft für nachhaltige Produkte bei Glaubwürdigkeit',
        ],
        sources: [
          'ACM (Netherlands Authority for Consumers & Markets). Guidelines on Sustainability Claims. Den Haag: ACM, 2023 — acm.nl/en/publications/guidelines-sustainability-claims',
          'Europäische Kommission. Proposal for EU Green Claims Directive, COM/2023/166 final — eur-lex.europa.eu',
          'GfK. Sustainability in 2023: Consumer Attitudes and Purchasing Behavior. Nürnberg: GfK, 2023 — gfk.com',
        ],
      },
      {
        id: 'm2',
        title: 'EU Green Claims Directive 2024: Was konkret gilt',
        duration: '9 Min.',
        content: [
          'Die EU Green Claims Directive wurde im März 2024 vom EU-Parlament angenommen. Mitgliedsstaaten haben 24 Monate für die nationale Umsetzung. Für die Schweiz gilt sie direkt bei Kommunikation in EU-Märkten.',
          'Drei Kernverbote: (1) Unsubstantiierte Umweltaussagen ohne wissenschaftlichen Nachweis nach ISO 14044 oder gleichwertigem Standard. (2) Nicht-verifizierte Vergleiche ("grüner als Mitbewerber X") ohne gleiche Berechnungsbasis. (3) Eigenmarken-Zertifikate ohne unabhängige Drittprüfung.',
          'Was erlaubt ist: Umweltaussagen die durch anerkannte Lifecycle Assessments (LCA) nach ISO 14040/44 gestützt werden. Etablierte unabhängige Zertifikate: EU Ecolabel, Nordic Swan, Blauer Engel, FSC/PEFC, Fairtrade, B Corp. Fortschrittskommunikation mit konkreten, nachgewiesenen Verbesserungen ("30% weniger Energie gegenüber Vorgängermodell, TÜV-zertifiziert").',
          'Fünf-Punkte-Claim-Checkliste für die Agenturarbeit: (1) Unabhängig geprüft? (2) Spezifisch für dieses Produkt (nicht pauschal für die Unternehmensgruppe)? (3) Aktuell (max. 3 Jahre alt)? (4) Methodik transparent offengelegt? (5) Akkreditierte Stelle hat geprüft? Alle fünf mit Ja: grünes Licht. Eines mit Nein: Claim anpassen oder streichen.',
          'Sanktionen: Die Directive schreibt Mindest-Bussgelder von 4% des Jahresumsatzes im EU-Mitgliedstaat vor, wo der Verstoss festgestellt wurde. Zusätzlich: öffentliche Bekanntmachung, Ausschluss von öffentlichen Aufträgen, temporäres Vermarktungsverbot.',
        ],
        keypoints: [
          'EU Green Claims Directive: angenommen März 2024, 24 Monate Umsetzungsfrist',
          'Eigenmarken-Zertifikate ohne Drittprüfung: explizit verboten',
          'LCA nach ISO 14040/44: Goldstandard für Umweltaussagen',
          'Fünf-Punkte-Checkliste: unabhängig, spezifisch, aktuell, transparent, akkreditiert',
          'Sanktionen: bis 4% Jahresumsatz im betroffenen EU-Mitgliedstaat',
        ],
        sources: [
          'EU. Directive on Green Claims. Angenommen EU-Parlament 12. März 2024 — europarl.europa.eu/doceo/document/TA-9-2024-0132_DE.html',
          'ISO 14040:2006/ISO 14044:2006. Environmental management — Life cycle assessment. Geneva: ISO — iso.org/standard/37456.html',
          'European Environment Agency. Environmental Footprinting: Guidance for Businesses. Copenhagen: EEA, 2023 — eea.europa.eu',
        ],
      },
      {
        id: 'm3',
        title: 'Nachhaltige Kampagnengestaltung in der Agenturpraxis',
        duration: '9 Min.',
        content: [
          'Nachhaltige Kommunikation bedeutet nicht nur, keine falschen Claims zu machen — es bedeutet, Kommunikation ganzheitlich nachhaltiger zu gestalten. Das ist auch ein Differenzierungsmerkmal für Agenturen im Pitch.',
          'Nachhaltige Kampagnenproduktion: Digital-First-Strategien reduzieren CO2 gegenüber Printproduktionen erheblich und messbar. Bei unvermeidlichen Shootings: lokale Crews bevorzugen, nachhaltige Sets, digitale Previews statt Druckproben. Für Printprodukte: FSC-zertifiziertes Papier, Sojatinte, kurze Auflagen mit Rücknahme.',
          'CO2-Footprint von Kampagnen messen: Tools existieren. AdGreen (für Filmproduktionen), Media Carbon Calculator (für Mediastrategie). Grosse Werbetreibende mit ESG-Berichtspflicht fragen dies zunehmend aktiv an. Wer jetzt Daten erhebt, hat Pitch-Vorteil.',
          'Storytelling-Prinzipien für glaubwürdige Nachhaltigkeitskommunikation: Zeigen statt behaupten (konkrete Zahlen, Prozesse statt Adjektive), Fortschritt kommunizieren (von X% zu Y% bis Datum), authentische Schwächen eingestehen (erhöht Glaubwürdigkeit signifikant), SDG-Verknüpfung nur wenn wirklich belegt.',
          'Agentur-Nachhaltigkeit als Pitch-Differenziator: Grosse Kunden fordern zunehmend ESG-Daten ihrer Lieferanten. B Corp Zertifizierung, ISO 14001, Ecovadis-Score oder ein eigener Sustainability Report zeigen: "Wir leben, was wir kommunizieren." Ein wachsender Wettbewerbsvorteil für Agenturen.',
        ],
        keypoints: [
          'Digital-First: messbar geringerer CO2-Footprint als Print-First',
          'AdGreen / Media Carbon Calculator: Kampagnen-CO2 messen und kommunizieren',
          'Storytelling: zeigen + Fortschritt + Schwächen + belegte SDG-Verknüpfung',
          'B Corp / ISO 14001: Agentur-Nachhaltigkeit als Pitch-Differenziator',
          'Grosse Kunden fragen zunehmend nach ESG-Daten ihrer Agenturen',
        ],
        sources: [
          'AdGreen. Production Carbon Calculator for the Advertising Industry. London: AdGreen, 2023 — weareadgreen.org/carbon-calculator',
          'WFA (World Federation of Advertisers). Planet Pledge — Sustainable Marketing Playbook 2030. Brussels: WFA, 2022 — wfanet.org/knowledge/item/2022/05/16/Planet-Pledge',
          'B Lab. B Corp Certification: Assessment and Verification Process. Philadelphia: B Lab, 2024 — bcorporation.net/certification',
        ],
      },
      {
        id: 'm4',
        title: 'CSRD und ESG-Reporting: Was Marketing-Teams wissen müssen',
        duration: '8 Min.',
        content: [
          'Die EU-Richtlinie CSRD (Corporate Sustainability Reporting Directive, EU 2022/2464) verpflichtet ab 2025 grosse EU-Unternehmen zu standardisiertem Nachhaltigkeitsreporting nach ESRS-Standards. Ab 2026 kommen mittelgrosse EU-Unternehmen hinzu. Für Schweizer Unternehmen mit EU-Kotierung oder grossen EU-Operationen ebenfalls relevant.',
          'Direkter Impact auf Marketing-Teams: Marketing liefert Input für den Nachhaltigkeitsbericht (Kampagnen-CO2, Diversity in Kommunikation und Kreativteams). Marketing kommuniziert die ESG-Ergebnisse nach aussen. Marketing muss sicherstellen, dass Kommunikation keine CSRD-Aussagen widerlegt.',
          'Glaubwürdigkeit durch unabhängige Prüfung: Für Agenturen relevant: B Corp (holistische Unternehmens-Zertifizierung), ISO 14001 (Umweltmanagementsystem), Ecovadis (Supply-Chain-Rating), SBTi (Science-Based Targets für Klimaziele). Eigenmarken-Siegel ohne Drittprüfung verlieren an Glaubwürdigkeit.',
          'Greenwashing-Gefahr bei CSRD: Wenn Marketing mehr kommuniziert als CSRD-Daten belegen, entsteht eine gefährliche Diskrepanz. Diese kann als Greenwashing gewertet werden. Enge Abstimmung zwischen Marketing, Sustainability und Finance ist deshalb keine Option, sondern Notwendigkeit.',
          'Ausblick: Marken die heute authentisch Nachhaltigkeit leben und kommunizieren, werden morgen regulatorisch bevorzugt (öffentliche Beschaffung, EU-Taxonomie-Zugang) und marktlich belohnt (Konsumentenpräferenzen, Mitarbeiterattraktivität für Talente).',
        ],
        keypoints: [
          'CSRD: ab 2025 (grosse EU-Unternehmen), ab 2026 (mittelgrosse EU-Unternehmen)',
          'Marketing liefert Input UND kommuniziert ESG-Ergebnisse',
          'B Corp / ISO 14001 / Ecovadis: unabhängig geprüfte Nachhaltigkeitsnachweise',
          'CSRD-Diskrepanz: wenn Marketing mehr verspricht als Daten belegen = Greenwashing',
          'Authentische Nachhaltigkeit: regulatorisch und marktlich langfristig bevorzugt',
        ],
        sources: [
          'EU. Corporate Sustainability Reporting Directive (CSRD), Richtlinie (EU) 2022/2464 — eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32022L2464',
          'EFRAG. European Sustainability Reporting Standards (ESRS) Set 1. Brussels: EFRAG, 2023 — efrag.org/sustainability-reporting/esrs',
          'Science Based Targets Initiative (SBTi). Corporate Net-Zero Standard v1.2. London: SBTi, 2023 — sciencebasedtargets.org/net-zero',
        ],
      },
    ],
    quiz: [
      { id: 'q1', question: 'Was ist Greenwashing seit der EU Green Claims Directive 2024?', options: ['Nur ein Reputationsrisiko', 'Verboten und sanktionierbar mit bis zu 4% Jahresumsatz', 'Nur für börsennotierte Unternehmen relevant', 'Noch nicht offiziell geregelt'], correct: 1, explanation: 'Die EU Green Claims Directive 2024 macht Greenwashing explizit verboten — mit Sanktionen bis zu 4% des Jahresumsatzes im betroffenen EU-Staat.' },
      { id: 'q2', question: 'Was ist ein typisches Greenwashing-Muster?', options: ['"30% CO2-Reduktion gegenüber 2020, TÜV-zertifiziert"', '"100% nachhaltig" ohne unabhängigen Nachweis', '"FSC-zertifiziertes Papier für diese Broschüre"', '"CO2-Fussabdruck laut ISO 14064"'], correct: 1, explanation: '"100% nachhaltig" ohne unabhängig verifizierten Nachweis ist ein klassisches Greenwashing-Muster — ein vager Superlativ ohne substanzielle Grundlage.' },
      { id: 'q3', question: 'Was verbietet die EU Green Claims Directive explizit?', options: ['Alle Umweltkommunikation', 'Eigenmarken-Zertifikate ohne unabhängige Drittprüfung', 'Nur TV-Werbung mit Umweltbezug', 'Ausschliesslich börsennotierte Unternehmen'], correct: 1, explanation: 'Die Directive verbietet u.a. Nachhaltigkeitszertifikate von Eigenmarken ohne akkreditierte, unabhängige Drittprüfung.' },
      { id: 'q4', question: 'Was ist der anerkannte Goldstandard für produktbezogene Umweltaussagen?', options: ['Eigene Nachhaltigkeitsberichte', 'Lifecycle Assessment (LCA) nach ISO 14040/44', 'Grüne Verpackungsgestaltung', 'Social-Media-Versprechen des Managements'], correct: 1, explanation: 'Das Lifecycle Assessment (LCA) nach ISO 14040/44 analysiert den gesamten Lebensweg — von Rohstoffgewinnung bis Entsorgung — und ist der wissenschaftliche Standard für Umweltaussagen.' },
      { id: 'q5', question: 'Was stärkt die Glaubwürdigkeit von Nachhaltigkeitskommunikation am meisten?', options: ['"Wir sind die nachhaltigste Marke der Branche"', 'Konkrete Zahlen mit Fortschritt + authentische Schwächen eingestehen', 'Nur positive Aspekte kommunizieren', 'Möglichst alle 17 SDGs verknüpfen'], correct: 1, explanation: 'Fortschritt mit konkreten Zahlen kommunizieren und authentische Herausforderungen eingestehen erhöht die Glaubwürdigkeit signifikant — Perfektion wirkt unglaubwürdig.' },
      { id: 'q6', question: 'Was bedeutet CSRD direkt für Marketing-Teams?', options: ['Kein direkter Einfluss auf Marketing', 'Marketing liefert ESG-Daten und kommuniziert Nachhaltigkeitsergebnisse nach aussen', 'Nur Finance und Compliance betroffen', 'Nur für Industrieunternehmen relevant'], correct: 1, explanation: 'CSRD macht Marketing direkt relevant: als Lieferant von ESG-Input-Daten (Kampagnen-CO2, Diversity) und als Kommunikator der Nachhaltigkeitsergebnisse nach aussen.' },
      { id: 'q7', question: 'Welche Zertifizierung ist für Agenturen als ganzheitlicher Nachhaltigkeitsnachweis geeignet?', options: ['"Nachhaltig by Brandwerk" (Eigenmarke)', 'B Corp Zertifizierung durch B Lab', '"Wir-fühlen-uns-nachhaltig" Badge', 'ISO 9001 Qualitätsmanagement'], correct: 1, explanation: 'B Corp Zertifizierung durch B Lab ist eine unabhängige, holistische Nachhaltigkeitsbewertung — wachsend als Pitch-Qualifikationskriterium und Differenziator für Agenturen.' },
      { id: 'q8', question: 'Können Agenturen für Greenwashing-Kampagnen ihrer Kunden haften?', options: ['Nein, nur der Auftraggeber haftet', 'Ja, Agenturen haften als Mitentwickler mit', 'Nur bei internationalen Kampagnen', 'Nur bei Printproduktionen'], correct: 1, explanation: 'Als Mitentwickler von Greenwashing-Kommunikation können Agenturen mitgehaftet werden — die professionelle Prüfpflicht für Nachhaltigkeitsbehauptungen ist Sorgfaltsstandard.' },
      { id: 'q9', question: 'Was ist die gefährliche CSRD-Diskrepanz?', options: ['CSRD und ISO-Standards widersprechen sich', 'Marketing kommuniziert mehr als CSRD-Daten belegen → Greenwashing-Risiko', 'CSRD gilt nicht für Marketingaussagen', 'Nur bei Druckprodukten relevant'], correct: 1, explanation: 'Wenn das Marketing mehr Nachhaltigkeit verspricht als die CSRD-Berichtsdaten belegen, entsteht eine Diskrepanz die als Greenwashing gewertet werden kann.' },
      { id: 'q10', question: 'Was misst das AdGreen Carbon Calculator Tool?', options: ['Social-Media-Reichweite von Nachhaltigkeitskampagnen', 'CO2-Footprint von Werbeproduktionen', 'Greenwashing-Score von Kampagnen', 'Konsumentenpräferenzen für Nachhaltigkeit'], correct: 1, explanation: 'AdGreen ist ein Tool zur Messung des CO2-Footprints von Filmproduktionen und Werbekampagnen — zunehmend Standard in der Agenturbranche.' },
    ],
  },

  'social-selling-b2b': {
    id: 'social-selling-b2b',
    emoji: '💼',
    title: 'Social Selling & LinkedIn für B2B',
    subtitle: 'Mehr Pipeline, weniger Kaltakquise — mit System und Strategie',
    regulation: 'LinkedIn SSI Framework · LinkedIn B2B Institute · B2B Social Selling Index',
    color: '#0A66C2',
    bg: '#DBEAFE',
    duration: '35 Min.',
    passing_score: 70,
    modules: [
      {
        id: 'm1',
        title: 'LinkedIn-Profil als strategisches Geschäftswerkzeug',
        duration: '9 Min.',
        content: [
          'Ihr LinkedIn-Profil ist die neue Visitenkarte — die gelesen wird, bevor Sie den Raum betreten. Wenn ein potenzieller Klient, Pitch-Entscheider oder Partner Ihren Namen googelt, landet er dort. In 10 Sekunden entscheidet sich: weiterlesen oder schliessen. Für einen Group Account Director, der täglich mit Entscheidern spricht, ist das eine tägliche Chance oder ein tägliches Risiko.',
          'Profil-Hierarchie nach Wirkung: Headerbild (sofort sichtbar, zeigt professionellen Kontext), Foto (professionell, aber authentisch), Headline (nicht Jobtitel, sondern Wertversprechen), About-Section (2–4 Sätze: was Sie für wen bewirken + Call-to-Action), Featured Section (beste Arbeiten, Case Studies, Testimonials — selten gepflegt, bietet starke Differenzierung).',
          'Headline-Transformation: Vorher: "Group Account Director at Brandwerk Zürich AG" — zeigt Position. Nachher: "Ich helfe B2B-Marken, Enterprise-Entscheider zu erreichen und messbar Pipeline aufzubauen | Integrated Marketing | Zürich" — zeigt Wert, Expertise, Kontext. Der Unterschied ist sofort wahrnehmbar.',
          'Featured Section als Wettbewerbsvorteil: Kaum gepflegt, daher starkes Differenzierungsmerkmal. Nutzen für: Top-Artikel oder Case Study, Kunden-Testimonial, Video-Statement, Pitch-Auszug. Quarterly aktualisieren.',
          'LinkedIn Social Selling Index (SSI): LinkedIn misst in vier Dimensionen: Professional Brand (Profil und Aktivität), Find Right People (Entscheider-Identifikation), Engage with Insights (relevante Interaktionen), Build Relationships (Netzwerk-Pflege). LinkedIn-Daten: Top-SSI-Scores korrelieren mit 45% höherer Zielerreichungswahrscheinlichkeit.',
        ],
        keypoints: [
          'Headline = Wertversprechen, nicht Jobtitel — entscheidend für erste Wahrnehmung',
          'Featured Section: Top-Arbeiten, Case Studies, Testimonials — quarterly updaten',
          'SSI misst LinkedIn-Effektivität in 4 Dimensionen',
          'Top-SSI: 45% höhere Wahrscheinlichkeit, Sales-Ziele zu erreichen (LinkedIn)',
          'LinkedIn-Profil = aktives Vertriebswerkzeug, nicht statischer Lebenslauf',
        ],
        sources: [
          'LinkedIn. Social Selling Index: The 4 Pillars of Social Selling. Sunnyvale: LinkedIn, 2023 — business.linkedin.com/sales-solutions/social-selling/the-social-selling-index-ssi',
          'LinkedIn. B2B Marketing Benchmark Report 2023. Sunnyvale: LinkedIn, 2023 — business.linkedin.com/marketing-solutions/research/b2b-marketing-benchmark',
        ],
      },
      {
        id: 'm2',
        title: 'Content-Strategie und Thought Leadership aufbauen',
        duration: '9 Min.',
        content: [
          'Thought Leadership auf LinkedIn ist nicht das tägliche Posten von Inhalten — es ist die konsequente Kommunikation eines klaren Standpunkts zu einem Thema, für das man bekannt sein möchte. Als Group Account Director: "ABM in der Praxis", "B2B-Digital-Experience ohne Buzzwords", "Marketing-ROI ehrlich messen".',
          'Die 4-1-1-Regel für ausgewogenen Content: Auf jeden selbstpromotionalen Post kommen 4 Posts mit echtem Mehrwert für die Zielgruppe (Insights, Tipps, ehrliche Analysen) und 1 Post mit fremdem Content (mit eigenem Kommentar). Verhindert Spam-Effekt und baut Vertrauen auf.',
          'Was auf LinkedIn organisch funktioniert: Persönliche Erkenntnisse aus eigener Arbeit ("Was ich aus einem Pitch-Fehler gelernt habe"), klare Meinungsposts mit einer These, konkrete Zahlen und Ergebnisse ("30% mehr Pipeline durch ABM in 6 Monaten"), hinter-die-Kulissen-Content, native Kurzvideos.',
          'LinkedIn-Algorithmus: Die ersten 60–90 Minuten nach dem Posting sind entscheidend. LinkedIn verteilt initial an einen kleinen Bruchteil der Follower, misst die Engagement-Rate, und entscheidet dann über breitere Verteilung. Optimale Posting-Zeit: 7–9 Uhr morgens, Dienstag bis Donnerstag.',
          'Frequenz vs. Qualität: Zweimal pro Woche mit gut durchdachten Inhalten liefert bessere Ergebnisse als täglich oberflächliche Posts. LinkedIn-Daten: Profile mit 2–3 Qualitätsposts pro Woche haben 3x höheres Follower-Wachstum als täglich postende Profile mit geringem Engagement.',
        ],
        keypoints: [
          '4-1-1-Regel: 4 Mehrwert-Posts, 1 Fremd-Inhalt, 1 Eigenpromotion',
          'Beste Inhalte: persönliche Erkenntnisse, klare Thesen, konkrete Zahlen',
          'Algorithmus: erste 60–90 Min. entscheiden über Reichweite',
          'Optimale Posting-Zeit: 7–9 Uhr, Dienstag bis Donnerstag',
          '2–3 Qualitätsposts/Woche > täglich mittelmässig',
        ],
        sources: [
          'LinkedIn. Creator Mode and Content Strategy Guide 2023. Sunnyvale: LinkedIn, 2023 — linkedin.com/help/linkedin/answer/creator-mode',
          'Hootsuite. Social Media Trends 2024: LinkedIn Algorithm Insights. Vancouver: Hootsuite, 2024 — hootsuite.com/research/social-trends-2024',
          'Metricool. LinkedIn Benchmark Report 2023: What Actually Works. Madrid: Metricool, 2023 — metricool.com/linkedin-benchmark-report',
        ],
      },
      {
        id: 'm3',
        title: 'LinkedIn Ads und Lead Generation für B2B',
        duration: '9 Min.',
        content: [
          'LinkedIn Ads sind teurer als andere Plattformen — CPM 2–5x höher als Meta, CPC häufig CHF 8–15. Das ist gerechtfertigt: Sie zahlen für B2B-Qualitätszielgruppen, die auf anderen Plattformen nicht verfügbar sind. Der ROI rechnet sich bei korrektem Setup.',
          'Fünf wichtige LinkedIn-Ad-Formate: Sponsored Content (Awareness und Mid-Funnel, breite Reichweite), Lead Gen Forms (vorausgefüllte Formulare direkt in LinkedIn, 2–3x höhere Conversion als externe Landing Pages), Thought Leader Ads (organische Mitarbeitenden-Posts boosten, hohe Authentizität), Conversation Ads (personalisierte Nachrichten im Posteingang, höchste CTR), Document Ads (Whitepapers und Guides direkt im Feed).',
          'Zielgruppen für maximale Präzision: Standard: Company Size + Job Function + Seniority + Industry. Fortgeschritten: Matched Audiences (Upload eigene E-Mail-Listen oder CRM-Kontakte → hohe Relevanz), Retargeting (Website-Besucher, Video-Viewer, Lead-Form-Opener), Company Engagement (Nutzer die mit dem Unternehmensprofil interagiert haben).',
          'Lead Gen Forms und DSGVO: LinkedIn-Lead-Gen-Forms füllen Profildaten vor — praktisch, aber kein Ersatz für DSGVO-konforme Marketingeinwilligung. Separate Einwilligung im Formular einholen ("Ja, ich möchte weitere Informationen erhalten") und in CRM als DSGVO-Source dokumentieren.',
          'Budget-Empfehlung für den Einstieg: Mindestens CHF 5.000/Monat für statistische Signifikanz. Empfohlenes Test-Setup: 30% Awareness, 50% Lead Gen, 20% Retargeting. Nach 8 Wochen auswerten und Budget in performante Kampagnen verschieben.',
        ],
        keypoints: [
          'LinkedIn Ads: hoher CPM, aber B2B-Zielgruppen unübertroffen',
          'Lead Gen Forms: 2–3x höhere Conversion als externe Landing Pages',
          'Matched Audiences: eigene CRM-Daten für präzises Targeting',
          'LinkedIn-Lead ≠ DSGVO-Einwilligung — separat einholen und dokumentieren',
          'Mindestbudget CHF 5.000/Monat für statistische Signifikanz',
        ],
        sources: [
          'LinkedIn. LinkedIn Advertising Performance Benchmarks 2023. Sunnyvale: LinkedIn, 2023 — business.linkedin.com/marketing-solutions/blog/linkedin-b2b-marketing/2023/linkedin-advertising-benchmarks',
          'Wordstream. LinkedIn Ads Benchmarks by Industry 2024. Boston: Wordstream, 2024 — wordstream.com/blog/ws/linkedin-ads-benchmarks',
          'B2B Institute (LinkedIn). The B2B Advantage: Science of LinkedIn Advertising. Sunnyvale: LinkedIn B2B Institute, 2023 — b2binstitute.com',
        ],
      },
      {
        id: 'm4',
        title: 'Social Selling systematisieren und messen',
        duration: '8 Min.',
        content: [
          'Social Selling funktioniert nur mit konsistenter Routine — nicht mit sporadischem, unregelässigem Posten. Das tägliche 15-Minuten-System für systematische Ergebnisse: 5 Minuten Feed (3–5 wertvolle Kommentare bei Zielaccounts oder Meinungsführern), 5 Minuten Inbox (relevante Kontaktanfragen mit personalisierter Nachricht beantworten), 5 Minuten Prospecting (2–3 neue Personen in Zielaccounts identifizieren).',
          'Sales Navigator lohnt sich ab 10+ systematisch bearbeiteten Zielaccounts: CRM-Integration verfügbar, Intent-Signale nutzbar (Job Changes, Company Updates, Posts der Entscheider), erweiterte Such- und Filterfunktionen. Jahresgebühr ca. CHF 1.200 — ein abgeschlossener Deal amortisiert das um ein Vielfaches.',
          'Messung und KPIs: Profil-Views (Trend: steigt durch Aktivität), Search Appearances (durch Profil-Keywords direkt beeinflusst), Post-Engagement-Rate (Benchmark B2B LinkedIn: 2–5%), Follower-Wachstum (organischer Reichweitenaufbau), Pipeline-Beitrag (im CRM mit Source "LinkedIn" und Erstkontat-Datum taggen).',
          'CRM-Integration ist der Schlüssel zur Messbarkeit: Jeder LinkedIn-initiierte Kontakt im CRM mit Source "LinkedIn" taggen. Sales Navigator hat direkte CRM-Integrationen für HubSpot, Salesforce und Microsoft Dynamics. Erst wenn LinkedIn-Pipeline-Beitrag sichtbar ist, wird Social Selling intern als Investment anerkannt.',
          'Weekly Playbook für Account Directors: 30 Min./Woche Profil-Maintenance (Featured Section, Skills aktualisieren), täglich 15 Min. Engagement-Routine, zweimal wöchentlich eigener Post, monatlich SSI und Profil-Views analysieren und Strategie anpassen.',
        ],
        keypoints: [
          'Tägliche 15-Min.-Routine: 5 Feed, 5 Inbox, 5 Prospecting',
          'Sales Navigator: ab 10+ Zielaccounts, CHF ~1.200/Jahr, CRM-integrierbar',
          'Post-Engagement-Rate: B2B LinkedIn Benchmark 2–5%',
          'Pipeline-Beitrag: im CRM mit Source "LinkedIn" taggen — macht ROI messbar',
          '30 Min./Tag strukturiert übertrifft 2 Stunden/Woche sporadisch',
        ],
        sources: [
          'LinkedIn. LinkedIn Social Selling Index: Measuring Your Effectiveness. Sunnyvale: LinkedIn, 2023 — business.linkedin.com/sales-solutions/social-selling/the-social-selling-index-ssi',
          'HubSpot. The Complete Guide to Social Selling for B2B 2023. Cambridge: HubSpot, 2023 — blog.hubspot.com/sales/social-selling',
          'Salesforce. State of Sales Report 2023: Social Selling and Digital Prospecting. San Francisco: Salesforce, 2023 — salesforce.com/resources/research-reports/state-of-sales',
        ],
      },
    ],
    quiz: [
      { id: 'q1', question: 'Was kommuniziert eine optimale LinkedIn-Headline?', options: ['Jobtitel und Unternehmen', 'Das Wertversprechen: was man für wen bewirkt', 'Die komplette Berufserfahrung', 'Ausbildung und Zertifikate'], correct: 1, explanation: 'Die Headline kommuniziert das Wertversprechen, nicht die Position. "Ich helfe B2B-Marken, messbar Pipeline aufzubauen" ist wirkungsvoller als "Group Account Director at X".' },
      { id: 'q2', question: 'Was besagt die 4-1-1-Regel?', options: ['4 Posts pro Woche, 1 mal im Monat', '4 Mehrwert-Posts, 1 Fremd-Inhalt, 1 Eigenpromotion', '4 Kommentare täglich, 1 Like', '4 neue Connections pro Woche'], correct: 1, explanation: '4-1-1: Auf jeden Eigenpromotions-Post kommen 4 Posts mit echtem Mehrwert und 1 geteilter Fremd-Inhalt mit eigenem Kommentar.' },
      { id: 'q3', question: 'Was entscheidet hauptsächlich über die Algorithmus-Reichweite eines LinkedIn-Posts?', options: ['Die Länge des Posts', 'Engagement in den ersten 60–90 Minuten', 'Anzahl der eigenen Follower', 'Ob Premium-Account vorhanden'], correct: 1, explanation: 'LinkedIn misst die Early-Engagement-Rate in den ersten 60–90 Minuten und entscheidet dann über die weitere Verteilung an breitere Zielgruppen.' },
      { id: 'q4', question: 'Was sind LinkedIn Lead Gen Forms?', options: ['Externe Landing Pages im LinkedIn-Design', 'Vorausgefüllte Formulare direkt in LinkedIn ohne externe Weiterleitung', 'LinkedIn-internes CRM-System', 'Automatische InMail-Nachrichten'], correct: 1, explanation: 'Lead Gen Forms sind direkt in LinkedIn integriert: LinkedIn-Profildaten werden vorausgefüllt, keine externe Landing Page nötig — 2–3x höhere Conversion als externe Seiten.' },
      { id: 'q5', question: 'Was misst der LinkedIn Social Selling Index (SSI)?', options: ['Anzahl der Connections und Follower', 'Professional Brand, Find Right People, Engage, Build Relationships', 'Nur Posting-Frequenz und Reichweite', 'Monatlich abgeschlossene Deals über LinkedIn'], correct: 1, explanation: 'SSI misst in vier Dimensionen: Professional Brand aufbauen, die richtigen Personen finden, mit Insights interagieren, Beziehungen aufbauen.' },
      { id: 'q6', question: 'Ab wann lohnt sich LinkedIn Sales Navigator?', options: ['Immer, für jeden LinkedIn-Nutzer', 'Ab 10+ systematisch bearbeiteten Zielaccounts', 'Nur für Enterprise-Verkäufer', 'Nur für Vollzeit-Sales-Mitarbeitende'], correct: 1, explanation: 'Sales Navigator lohnt sich ab 10+ systematisch bearbeiteten Zielaccounts, wenn CRM-Integration und Intent-Signale strategisch genutzt werden.' },
      { id: 'q7', question: 'Was gilt bei LinkedIn Lead Gen Forms und DSGVO?', options: ['LinkedIn-Daten = automatische DSGVO-Einwilligung', 'Separate DSGVO-Einwilligung für Folgekommunikation muss eingeholt werden', 'Keine DSGVO-Pflichten bei LinkedIn-Daten', 'Nur bei EU-Bürgern relevant'], correct: 1, explanation: 'LinkedIn gibt Profildaten frei — das ist keine DSGVO-Einwilligung für Marketing-Kommunikation. Separate Einwilligung im Formular einholen und in CRM dokumentieren.' },
      { id: 'q8', question: 'Was ist der Benchmark für Post-Engagement-Rate bei B2B auf LinkedIn?', options: ['0,5–1%', '2–5%', '10–15%', 'Über 25%'], correct: 1, explanation: 'Benchmark B2B LinkedIn Engagement-Rate: 2–5%. Unter 2% = Content resoniert nicht mit der Zielgruppe. Über 5% = sehr guter, relevanter Content.' },
      { id: 'q9', question: 'Wie macht man den LinkedIn-Pipeline-Beitrag im CRM messbar?', options: ['Gar nicht möglich', 'Source "LinkedIn" + Erstkontat-Datum bei jedem LinkedIn-Kontakt im CRM taggen', 'Nur durch LinkedIn Sales Navigator', 'Monatlicher manueller Report'], correct: 1, explanation: 'Jeden LinkedIn-initiierten Kontakt im CRM mit Source "LinkedIn" und Erstkontat-Datum taggen — macht den Zusammenhang zwischen Social-Selling-Aktivität und Pipeline statistisch messbar.' },
      { id: 'q10', question: 'Was ist der Kernvorteil des täglichen 15-Minuten-Routinesystems?', options: ['Maximale Reichweite durch Frequenz', 'Konsistenz und Systematik bei minimalem Zeitaufwand', 'Günstigere LinkedIn-Costs', 'Automatisierung aller Aktivitäten'], correct: 1, explanation: 'Das 15-Min.-System schafft Konsistenz (täglich sichtbar, täglich im Netzwerk präsent) bei minimalem Zeitaufwand — was sporadische 2-Stunden-Sessions bei weitem übertrifft.' },
    ],
  },

}


Object.assign(COURSES_DATA, AGENTUR_COURSES)
