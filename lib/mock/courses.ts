// ── KALYX Course Content & Quiz Data ─────────────────────────

export interface Module {
  id: string
  title: string
  duration: string
  content: string[]
  keypoints: string[]
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
