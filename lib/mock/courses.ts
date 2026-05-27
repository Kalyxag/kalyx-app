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

// Merge into main COURSES_DATA export
Object.assign(COURSES_DATA, RAUMPLANUNG_COURSES)

// ── AGENTUR / MARKETING KURSE — Brandwerk Zürich AG ───────────

const AGENTUR_COURSES: Record<string, CourseData> = {
  'ki-agentur': {
    id: 'ki-agentur',
    emoji: '🤖',
    title: 'KI-Tools im Agenturalltag',
    subtitle: 'ChatGPT, Copilot und Co. — endlich richtig anwenden',
    regulation: 'OpenAI · Microsoft Copilot · Adobe Firefly · EU AI Act',
    color: '#7C3AED',
    bg: '#EDE9FE',
    duration: '30 Min.',
    passing_score: 70,
    modules: [
      {
        id: 'm1',
        title: 'ChatGPT und Copilot verstehen — was steckt dahinter?',
        duration: '7 Min.',
        content: [
          'Seien wir ehrlich: Die meisten von uns tippen "ChatGPT schreib mir einen Post über X" und wundern sich dann, warum der Output klingt wie eine Schulaufgabe von 1997. Das lässt sich ändern — und zwar schnell.',
          'Grosse Sprachmodelle (Large Language Models, LLMs) wie GPT-4 funktionieren als Wahrscheinlichkeitsmaschinen: Sie sagen voraus, welches Wort als nächstes am wahrscheinlichsten kommt, basierend auf riesigen Textmengen. Das Resultat ist überzeugend — aber nur so gut wie Ihr Input (Prompt).',
          'Microsoft Copilot ist tief in den Office-Alltag integriert: PowerPoint-Slides aus Briefings generieren, E-Mails zusammenfassen, Teams-Meetings transkribieren. Das spart realistisch 30-60 Minuten pro Tag — wenn man weiss wie.',
          'Wichtig für den Agenturkontext: KI-Tools haben keinen Zugriff auf Ihre Kundendaten — solange Sie diese nicht hineinkopieren. Vor dem Einsatz im Kundenprojekt Datenschutz klären (DSGVO, Kundenverträge, NDAs).',
        ],
        keypoints: [
          'LLM = Wahrscheinlichkeitsmaschine, kein Allwissender',
          'Copilot in Word, PowerPoint, Teams bereits im M365-Abo',
          'Keine Kundendaten in Public-AI-Tools einfügen',
          'Guter Prompt = halbe Arbeit erledigt',
        ],
      },
      {
        id: 'm2',
        title: 'KI-Bildgenerierung: Midjourney, DALL-E und Firefly',
        duration: '7 Min.',
        content: [
          'Bildgenerierung ist der sichtbarste und gleichzeitig am häufigsten missverstandene Anwendungsfall von KI in Agenturen. Moodboards in 5 Minuten, Variationen ohne Fotografen, Personas visualisieren — das ist real und funktioniert heute.',
          'Adobe Firefly ist für Agenturen die sicherste Wahl: trainiert ausschliesslich auf lizenzfreien Adobe-Stock-Bildern und eigenem Content. Das bedeutet: keine Copyright-Risiken für Kundenprojekte. Midjourney und DALL-E können urheberrechtlich problematisch sein, wenn die generierten Bilder echten Kunstwerken ähneln.',
          'Prompt-Technik für Bilder: Stil + Inhalt + Format + Stimmung. Beispiel: "Corporate photography, diverse team in modern Zurich office, warm natural light, 16:9, candid authentic moment" liefert deutlich bessere Ergebnisse als "Team Foto Büro".',
          'Wichtiger Hinweis: KI-generierte Bilder müssen in vielen Kontexten deklariert werden (EU AI Act, Kundenbriefings, Medienagenturen). Interne Kommunikation ist unkritisch, Publikationen für Kunden sollten im NDA geregelt sein.',
        ],
        keypoints: [
          'Adobe Firefly = copyright-safe für Kundenprojekte',
          'Midjourney: qualitativ stark, aber IP-Risiko beachten',
          'Prompt-Formel: Stil + Inhalt + Format + Stimmung',
          'Deklarationspflicht bei KI-Bildern im EU-Kontext prüfen',
        ],
      },
      {
        id: 'm3',
        title: 'Prompt Engineering für Marketing-Teams',
        duration: '8 Min.',
        content: [
          'Prompt Engineering klingt nach einem Ingenieurstudium, ist es aber nicht. Es geht um drei simple Dinge: Kontext geben, Rolle zuweisen, Format definieren. Wer das beherrscht, bekommt aus ChatGPT Outputs, die echte Arbeit sparen.',
          'Die Rolle zuweisen: "Du bist ein erfahrener B2B-Texter mit Fokus auf Tech-Unternehmen. Schreibe einen LinkedIn-Post für einen CFO, der..." liefert fundamental bessere Ergebnisse als keine Rollenzuweisung.',
          'Chain-of-Thought: Bitten Sie die KI, schrittweise vorzugehen: "Analysiere zuerst die Zielgruppe, dann die wichtigsten Botschaften, dann formuliere den Text." Das reduziert halluzinierte Fakten erheblich.',
          'Für Agenturen besonders nützlich: Briefing-Extraktion (PDF hochladen, Key-Messages extrahieren lassen), Variantenproduktion (5 verschiedene Headlines für A/B-Test), Übersetzung und Tonalitätsanpassung (D/F/I/E in Schweizer Markttonalität).',
        ],
        keypoints: [
          'Formel: Rolle + Kontext + Aufgabe + Format + Einschränkungen',
          'Chain-of-Thought reduziert KI-Fehler massiv',
          'Briefing-Extraktion aus PDFs: spart 1-2h pro Projekt',
          'Nie Fakten übernehmen ohne Prüfung — KI halluziniert',
        ],
      },
      {
        id: 'm4',
        title: 'KI im Agentur-Workflow — Was sich ändert (und was nicht)',
        duration: '8 Min.',
        content: [
          'Die grosse Frage ist nicht ob KI die Agenturarbeit verändert — sie tut es bereits. Die Frage ist, wer in zwei Jahren noch gefragt ist: die Person, die KI strategisch einsetzt, oder die Person, die darauf wartet, dass sie erklärt wird.',
          'Was KI hervorragend kann: Research und Zusammenfassungen, erste Entwürfe und Varianten, Übersetzungen, Datenanalyse und Reporting, Briefing-Strukturierung, Meeting-Protokolle. Was KI nicht kann: Kundenbeziehungen pflegen, Vertrauen aufbauen, strategische Intuition, kreative Leaps jenseits des Bekannten.',
          'Effizienz-Realität in Agenturen: Teams, die KI systematisch einsetzen, schaffen die gleiche Arbeitsmenge mit 20-30% weniger Zeit. Das bedeutet nicht Stellenabbau — es bedeutet mehr Raum für strategische Arbeit und neue Projekte.',
          'EU AI Act (seit Februar 2025): KI-Systeme in der Werbung und im Marketing unterliegen bestimmten Transparenzpflichten. Deepfakes und manipulative KI in Werbung sind verboten. Für Standard-Agenturanwendungen (Text, Bild, Analyse) keine Einschränkungen — aber Compliance im Blick behalten.',
        ],
        keypoints: [
          'KI ist ein Werkzeug — Strategie und Beziehungen bleiben menschlich',
          '20-30% Effizienzgewinn bei systematischem Einsatz realistisch',
          'EU AI Act: Deepfakes und manipulative KI verboten',
          'Wer heute lernt, ist morgen vorne',
        ],
      },
    ],
    quiz: [
      { id: 'q1', question: 'Was ist das Grundprinzip eines Large Language Models (LLM)?', options: ['Es sucht in einer riesigen Datenbank nach der richtigen Antwort', 'Es sagt das wahrscheinlichste nächste Wort voraus', 'Es verbindet sich mit dem Internet und sucht Informationen', 'Es analysiert die Absicht des Nutzers psychologisch'], correct: 1, explanation: 'LLMs wie GPT funktionieren als Wahrscheinlichkeitsmaschinen: Sie sagen voraus, welches Wort oder Token als nächstes am wahrscheinlichsten kommt — basierend auf dem Training auf riesigen Textmengen.' },
      { id: 'q2', question: 'Welches KI-Bildtool ist für Kundenprojekte am copyright-sichersten?', options: ['Midjourney', 'DALL-E 3', 'Adobe Firefly', 'Stable Diffusion'], correct: 2, explanation: 'Adobe Firefly wurde ausschliesslich auf lizenzfreien Adobe-Stock-Bildern und eigenem Content trainiert — kein Copyright-Risiko für kommerzielle Nutzung in Kundenprojekten.' },
      { id: 'q3', question: 'Was gehört in einen guten Prompt?', options: ['Nur die Aufgabe, KI weiss den Rest', 'Rolle + Kontext + Aufgabe + Format + Einschränkungen', 'Möglichst kurze und präzise Stichworte', 'Eine detaillierte Erklärung der KI-Technologie'], correct: 1, explanation: 'Die Prompt-Formel: Rolle zuweisen + Kontext geben + klare Aufgabe + gewünschtes Format + Einschränkungen. Das liefert deutlich bessere Ergebnisse.' },
      { id: 'q4', question: 'Was darf NICHT in Public-AI-Tools eingegeben werden?', options: ['Eigene Textentwürfe', 'Allgemeine Branchenfragen', 'Vertrauliche Kundendaten und NDAs', 'Briefing-Strukturen ohne Kundennamen'], correct: 2, explanation: 'Vertrauliche Kundendaten, NDA-relevante Informationen und personenbezogene Daten dürfen nicht in Public-AI-Tools (ChatGPT, Copilot free) eingegeben werden — DSGVO und Kundenverträge.' },
      { id: 'q5', question: 'Was versteht man unter "Chain-of-Thought" Prompting?', options: ['Die KI in einer Kette von Tools nutzen', 'Die KI bitten, schrittweise vorzugehen', 'Mehrere KI-Modelle verknüpfen', 'Den Prompt mehrfach wiederholen'], correct: 1, explanation: 'Chain-of-Thought bedeutet, die KI zu bitten, schrittweise vorzugehen: "Analysiere zuerst X, dann Y, dann formuliere Z." Das reduziert Fehler und verbessert die Qualität.' },
      { id: 'q6', question: 'Welche Aussage über KI-generierte Bilder und den EU AI Act ist korrekt?', options: ['Alle KI-Bilder sind verboten', 'Deepfakes und manipulative KI in Werbung sind verboten', 'KI-Bilder brauchen keine Deklaration', 'Nur professionelle Tools sind erlaubt'], correct: 1, explanation: 'Der EU AI Act verbietet Deepfakes und manipulative KI in der Werbung. Standard-Anwendungen (Moodboards, Variationen) sind erlaubt, müssen aber je nach Kontext deklariert werden.' },
      { id: 'q7', question: 'Wo ist Microsoft Copilot bereits integriert?', options: ['Nur in Windows', 'In Microsoft 365 (Word, PowerPoint, Teams, Outlook)', 'Nur in Azure Cloud Services', 'In keinem Standard-Produkt'], correct: 1, explanation: 'Microsoft Copilot ist tief in Microsoft 365 integriert: Word, PowerPoint, Teams, Outlook — Slides aus Briefings generieren, Meetings transkribieren, E-Mails zusammenfassen.' },
      { id: 'q8', question: 'Wie viel Effizienzgewinn ist bei systematischem KI-Einsatz in Agenturen realistisch?', options: ['5-10%', '20-30%', '50-70%', 'Über 80%'], correct: 1, explanation: 'Studien und Praxiserfahrungen zeigen 20-30% Effizienzgewinn bei systematischem KI-Einsatz — genug für mehr strategische Arbeit, aber kein Ersatz für menschliche Kreativität.' },
      { id: 'q9', question: 'Was kann KI in der Agenturarbeit NICHT ersetzen?', options: ['Research und Zusammenfassungen', 'Erste Textentwürfe', 'Kundenbeziehungen und Vertrauen', 'Meeting-Protokolle'], correct: 2, explanation: 'KI kann Research, Entwürfe, Protokolle und Übersetzungen übernehmen — aber Kundenbeziehungen, Vertrauen, strategische Intuition und kreative Leaps bleiben menschlich.' },
      { id: 'q10', question: 'Was ist beim Einsatz von KI für Kundenprojekte zuerst zu prüfen?', options: ['Ob das Tool kostenlos ist', 'DSGVO-Konformität, Kundenverträge und NDAs', 'Ob die KI einen Schweizer Server hat', 'Ob der Output auf Deutsch verfügbar ist'], correct: 1, explanation: 'Vor dem Einsatz in Kundenprojekten: DSGVO-Konformität prüfen, Kundenvertrag und NDAs auf Datenschutzklauseln prüfen, sicherstellen dass keine vertraulichen Daten eingegeben werden.' },
    ],
  },

  'dsgvo-marketing': {
    id: 'dsgvo-marketing',
    emoji: '🍪',
    title: 'Datenschutz im Marketing — ohne Juristendeutsch',
    subtitle: 'DSGVO, Cookie-Consent und Analytics verständlich erklärt',
    regulation: 'DSGVO · DSG 2023 · ePrivacy · IAB TCF 2.0',
    color: '#0369A1',
    bg: '#E0F2FE',
    duration: '35 Min.',
    passing_score: 75,
    modules: [
      {
        id: 'm1',
        title: 'DSGVO für Marketing-Teams — was gilt wirklich?',
        duration: '9 Min.',
        content: [
          'Die DSGVO hat Marketing seit 2018 verändert — aber die meisten Teams verstehen nur den Teil, der sie direkt betrifft. Hier die ehrliche Kurzversion: Was gilt für Agenturen und Marketing-Profis konkret?',
          'Als Agentur seid ihr meistens Auftragsverarbeiter (nicht Verantwortlicher). Das bedeutet: Euer Kunde ist der Verantwortliche für seine Kundendaten — ihr verarbeitet diese im Auftrag. Ein gültiger Auftragsverarbeitungsvertrag (AVV) ist Pflicht, bevor ihr mit Kundendaten arbeitet.',
          'Personenbezogene Daten im Marketing sind umfassender als gedacht: Name, E-Mail, IP-Adresse, Cookie-ID, Klickverhalten, Kaufhistorie, Geräte-ID. Alles was einer natürlichen Person zugeordnet werden kann — auch indirekt.',
          'Rechtsgrundlage für Marketingmassnahmen: Einwilligung (Consent) für Newsletter und Tracking, berechtigtes Interesse für einige B2B-Kommunikationen, Vertrag für transaktionale E-Mails. "Die Leute haben ja unserer Website zugestimmt" reicht als Begründung nicht.',
        ],
        keypoints: [
          'Agentur = Auftragsverarbeiter → AVV mit Kunden ist Pflicht',
          'IP-Adresse und Cookie-ID sind personenbezogene Daten',
          'Rechtsgrundlage für jede Verarbeitung definieren',
          'Einwilligung muss freiwillig, informiert und nachweisbar sein',
        ],
      },
      {
        id: 'm2',
        title: 'Cookie-Banner, Meta-Pixel und Google Analytics richtig einsetzen',
        duration: '9 Min.',
        content: [
          'Cookie-Banner sind das Sinnbild des Datenschutz-Theaters: halb implementiert, meist rechtswidrig, und alle klicken auf "Alle akzeptieren" weil der Ablehnen-Button versteckt ist. Letzteres ist übrigens seit 2022 in der EU explizit illegal.',
          'Meta-Pixel und Google Analytics setzen Third-Party-Cookies und übertragen Daten in die USA. Seit dem Schrems II-Urteil (2020) und dem nachfolgenden EU-US Data Privacy Framework (2023) ist eine gewisse Rechtssicherheit zurückgekehrt — aber bei FINMA-regulierten Kunden besser Schweizer oder EU-Alternativen prüfen.',
          'Recht auf Ablehnung: Ein valider Cookie-Banner muss "Alle ablehnen" genauso prominent wie "Alle akzeptieren" darstellen. Statistiken zeigen: Bei fairem Banner lehnen 60-80% der Nutzer Marketing-Cookies ab. Das verändert Targeting-Strategien grundlegend.',
          'Alternativen im Schweizer Markt: Matomo (Open Source, self-hosted), Pirsch Analytics (DE, DSGVO-nativ), Cookieless Tracking via Server-Side GTM. Für reine CH-Kunden ohne EU-Traffic: DSG 2023 ist weniger restriktiv als DSGVO.',
        ],
        keypoints: [
          'Ablehnen-Button muss gleich prominent wie Akzeptieren sein',
          'Meta-Pixel und GA4: EU-US Data Privacy Framework prüfen',
          'Matomo / Server-Side GTM als datenschutzkonforme Alternativen',
          'Bei 60-80% Ablehnung: Strategie ohne Third-Party-Cookies planen',
        ],
      },
      {
        id: 'm3',
        title: 'E-Mail-Marketing rechtssicher — Newsletter und Lead-Nurturing',
        duration: '8 Min.',
        content: [
          'E-Mail-Marketing ist das effizienteste Direktkanal-Format — und gleichzeitig das am häufigsten DSGVO-widrig genutzte. Die gute Nachricht: Mit drei Massnahmen ist man zu 90% auf der sicheren Seite.',
          'Double-Opt-in ist Pflicht: Eine einzelne Bestätigungsmail nach dem Anmelden reicht nicht — der Nutzer muss aktiv über einen Bestätigungslink in einer E-Mail zustimmen. Diese Einwillung muss mit Zeitstempel gespeichert werden.',
          'B2B-Grauzone: Die DSGVO erlaubt unter "berechtigtem Interesse" eine erste Kontaktaufnahme per E-Mail mit Geschäftskunden, wenn das Angebot relevant für deren Beruf ist und eine Abmelde-Option vorhanden ist. Kaltakquise ist jedoch im Schweizer Recht (UWG Art. 3) strenger geregelt.',
          'Newsletter-Tools: Mailchimp (US → SCCs prüfen), HubSpot (EU-Server wählbar), Brevo/Sendinblue (EU, DSGVO-nativ), Newsletter2Go / CleverReach (DE). Für maximale Compliance: Schweizer Anbieter wie Infomaniak Newsletter.',
        ],
        keypoints: [
          'Double-Opt-in mit Zeitstempel-Speicherung ist Pflicht',
          'Abmeldung muss in jeder E-Mail möglich sein (1-Klick)',
          'B2B-Kaltakquise: DSGVO-Grauzone, UWG (CH) strenger',
          'EU-Server bei Newsletter-Tools bevorzugen',
        ],
      },
      {
        id: 'm4',
        title: 'Was kommt als nächstes? ePrivacy, AI Act und cookielose Welt',
        duration: '9 Min.',
        content: [
          'Die Datenschutzlandschaft für Marketing verändert sich weiter. Drei Entwicklungen, die Marketing-Teams jetzt kennen sollten: ePrivacy-Verordnung, AI Act und cookielose Welt.',
          'ePrivacy-Verordnung (noch in Verhandlung, EU): Wird die Cookie-Regelungen weiter verschärfen und auf alle digitalen Kommunikationsmittel ausdehnen (auch WhatsApp, Teams). Wahrscheinliches Inkrafttreten 2026/2027. Agenturen sollten jetzt Strategien ohne Third-Party-Cookies aufbauen.',
          'EU AI Act und Marketing: Personalisierte Werbung auf Basis von KI-Profiling ist grundsätzlich erlaubt, aber: Kein Profiling auf Basis sensibler Daten (Gesundheit, Religion, politische Meinung) — auch nicht indirekt. Manipulative Techniken sind verboten. Transparenzpflichten bei KI-generiertem Content.',
          'Cookielose Welt: Google hat Third-Party-Cookies in Chrome bis Ende 2025 auf Privacy Sandbox umgestellt. Die Zukunft gehört: First-Party-Data-Strategien, Kontextueller Werbung, Server-Side-Tracking, sauberem CRM und Permission-Marketing.',
        ],
        keypoints: [
          'ePrivacy: ab 2026/27 — jetzt First-Party-Data aufbauen',
          'AI Act: kein Profiling auf sensitiven Daten, auch nicht indirekt',
          'Chrome: Third-Party-Cookies → Privacy Sandbox (ab 2025)',
          'Zukunft: First-Party-Data + Contextual Targeting + Server-Side',
        ],
      },
    ],
    quiz: [
      { id: 'q1', question: 'Was ist eine Agentur aus DSGVO-Sicht, wenn sie mit Kundendaten arbeitet?', options: ['Verantwortlicher', 'Auftragsverarbeiter', 'Gemeinsam Verantwortlicher', 'Drittpartei'], correct: 1, explanation: 'Agenturen sind in der Regel Auftragsverarbeiter: Sie verarbeiten Daten im Auftrag des Kunden (Verantwortlicher). Ein Auftragsverarbeitungsvertrag (AVV) ist Pflicht.' },
      { id: 'q2', question: 'Was gilt für Cookie-Banner laut EU-Recht seit 2022?', options: ['Nur "Alle akzeptieren" muss angezeigt werden', '"Alle ablehnen" muss genauso prominent wie "Alle akzeptieren" sein', 'Cookie-Banner sind nicht mehr Pflicht', 'Nur Performance-Cookies brauchen Einwilligung'], correct: 1, explanation: 'Seit 2022 urteilten EU-Gerichte: "Alle ablehnen" muss genauso prominent dargestellt werden wie "Alle akzeptieren". Versteckte Ablehnen-Buttons sind rechtswidrig.' },
      { id: 'q3', question: 'Was ist beim Newsletter-Marketing Pflicht?', options: ['Single-Opt-in reicht', 'Double-Opt-in mit Zeitstempel-Speicherung', 'Telefonische Bestätigung', 'Jährliche Erneuerung der Einwilligung'], correct: 1, explanation: 'Double-Opt-in ist Pflicht: Bestätigungs-E-Mail mit aktivem Bestätigungslink, und die Einwilligung muss mit Zeitstempel gespeichert werden.' },
      { id: 'q4', question: 'Welche Daten sind personenbezogen im Sinne der DSGVO?', options: ['Nur Name und E-Mail-Adresse', 'Name, E-Mail, IP-Adresse, Cookie-ID, Klickverhalten', 'Nur Daten in strukturierten Datenbanken', 'Nur Daten natürlicher Personen mit Schweizer Wohnsitz'], correct: 1, explanation: 'Personenbezogene Daten umfassen alles, was einer Person zugeordnet werden kann: Name, E-Mail, IP-Adresse, Cookie-ID, Klickverhalten, Geräte-ID etc.' },
      { id: 'q5', question: 'Welches Tool ist für datenschutzkonforme Analytics empfehlenswert?', options: ['Google Universal Analytics', 'Adobe Analytics (US-Server)', 'Matomo (self-hosted)', 'Facebook Analytics'], correct: 2, explanation: 'Matomo (Open Source, self-hosted) ist die datenschutzfreundlichste Alternative zu Google Analytics: alle Daten bleiben auf dem eigenen Server, kein Drittanbieter.' },
      { id: 'q6', question: 'Was erlaubt berechtigtes Interesse im B2B-E-Mail-Marketing?', options: ['Unbegrenzte Kaltakquise an alle Adressen', 'Erste Kontaktaufnahme wenn Angebot beruflich relevant + Abmelde-Option', 'Kein E-Mail-Marketing ohne Einwilligung', 'Automatisches Hinzufügen zu Newslettern'], correct: 1, explanation: 'Berechtigtes Interesse erlaubt unter DSGVO eine erste B2B-Kontaktaufnahme, wenn das Angebot für das Berufsleben relevant ist und eine klare Abmelde-Option vorhanden ist.' },
      { id: 'q7', question: 'Was verbietet der EU AI Act im Marketing?', options: ['Jeglichen Einsatz von KI', 'Personalisierte Werbung generell', 'Manipulative KI-Techniken und Profiling auf sensitiven Daten', 'KI-generierte Bilder'], correct: 2, explanation: 'Der EU AI Act verbietet manipulative KI-Techniken und Profiling auf Basis sensibler Daten (Gesundheit, politische Meinung, Religion) — auch indirekt.' },
      { id: 'q8', question: 'Was ist die Zukunft ohne Third-Party-Cookies?', options: ['Ende des digitalen Marketings', 'First-Party-Data, kontextuelles Targeting, Server-Side-Tracking', 'Rückkehr zu Print-Werbung', 'Nur noch Social-Media-Werbung'], correct: 1, explanation: 'Die cookielose Zukunft gehört: First-Party-Data-Strategien, kontextueller Werbung, Server-Side GTM und sauberem Permission-Marketing.' },
      { id: 'q9', question: 'Wann muss eine Abmelde-Option im Newsletter vorhanden sein?', options: ['Nur beim ersten Newsletter', 'In jedem Newsletter (Pflicht)', 'Auf Anfrage innerhalb von 30 Tagen', 'Nur bei kommerziellen Newslettern'], correct: 1, explanation: 'Jede Marketing-E-Mail muss eine Abmelde-Option enthalten — dies ist in DSGVO und UWG (Schweiz) klar geregelt und kann nicht weggelassen werden.' },
      { id: 'q10', question: 'Was bedeutet ePrivacy-Verordnung für Agenturen?', options: ['Nichts Neues', 'Verschärfung auf alle digitalen Kommunikationskanäle ab ca. 2026/27', 'Abschaffung von Cookie-Bannern', 'Nur für Telefonmarketing relevant'], correct: 1, explanation: 'Die ePrivacy-Verordnung (erwartet 2026/27) wird Cookie-Regelungen auf alle digitalen Kanäle ausdehnen — auch Messenger und Teams. Jetzt First-Party-Strategien aufbauen.' },
    ],
  },

  'abm-zertifikat': {
    id: 'abm-zertifikat',
    emoji: '🎯',
    title: 'Account-Based Marketing (ABM) Zertifikat',
    subtitle: 'Von der Target-Account-Liste zum messbaren Pipeline-Beitrag',
    regulation: 'ITSMA ABM Framework · HubSpot · LinkedIn Marketing Solutions',
    color: '#14613E',
    bg: '#DCFCE7',
    duration: '45 Min.',
    passing_score: 75,
    modules: [
      {
        id: 'm1',
        title: 'ABM-Grundlagen — warum Giesskanne ausgedient hat',
        duration: '11 Min.',
        content: [
          'Account-Based Marketing ist kein neuer Trend — es ist die Rückkehr zu dem, was gutes B2B-Marketing immer war: Die richtigen Personen im richtigen Unternehmen zur richtigen Zeit mit der richtigen Botschaft ansprechen. Was neu ist: die Technologie macht es skalierbar.',
          'Der Unterschied zu klassischem Demand Generation: Statt eines breiten Funnels (viele Leads → filtern) dreht ABM den Prozess um: zuerst die Zielunternehmen definieren (Target Account List, TAL), dann gezielt Awareness, Engagement und Pipeline bei diesen Accounts aufbauen.',
          'ABM-Reifegrade nach ITSMA: One-to-One (Strategic ABM, 5-30 Accounts, hohe Individualisierung), One-to-Few (ABM Lite, 20-100 Accounts, Segmentierung nach Branche/Grösse), One-to-Many (Programmatic ABM, 100+ Accounts, Technologie-getrieben). Die meisten Agenturen starten mit One-to-Few.',
          'Business Case für ABM: Laut ITSMA-Studie 2023 sehen 87% der ABM-Marketer einen höheren ROI als bei anderen Marketingansätzen. Deal-Grössen sind im Schnitt 30-50% grösser bei ABM-Accounts, Sales-Zyklen kürzen sich um 20-30%.',
        ],
        keypoints: [
          'ABM = Target zuerst, dann Aktivierung (umgekehrter Funnel)',
          'Drei Reifegrade: One-to-One, One-to-Few, One-to-Many',
          '87% der ABM-Marketer sehen höheren ROI als bei Demand Gen',
          'ABM erfordert enge Sales-Marketing-Abstimmung (Smarketing)',
        ],
      },
      {
        id: 'm2',
        title: 'Target Account List — die Kunst der richtigen Auswahl',
        duration: '11 Min.',
        content: [
          'Die Target Account List (TAL) ist das Fundament jedes ABM-Programms. Schlechte TAL = verbrannte Budgets. Gute TAL = fokussierte Energie auf die Accounts mit dem höchsten Potenzial.',
          'Firmografische Kriterien: Unternehmensgrösse (Mitarbeitende, Umsatz), Branche (NACE-Codes), Region, Technologie-Stack (BuiltWith, Bombora), Wachstumsstadium (Series B+, Expansion), bestehende Beziehungen.',
          'Intent Data als Turbo: Tools wie Bombora, G2 Buyer Intent oder LinkedIn Matched Audiences zeigen, welche Unternehmen gerade aktiv nach Lösungen wie Ihrer suchen. Integration von Intent Data in die TAL-Priorisierung erhöht Conversion-Raten signifikant.',
          'Praktisch für Agenturen: Beginnen Sie mit dem Ideal Customer Profile (ICP) aus den besten bestehenden Kunden: gleiche Branche, gleiche Grösse, ähnliche Herausforderungen. Die TAL sollte Sales und Marketing gemeinsam definieren — sonst kauft Marketing, was Sales nicht verfolgt.',
        ],
        keypoints: [
          'TAL aus ICP ableiten (beste bestehende Kunden als Vorlage)',
          'Intent Data: zeigt aktiven Kaufbedarf bei Zielunternehmen',
          'Sales und Marketing definieren TAL gemeinsam',
          'TAL regelmässig aktualisieren (Quartalsweise)',
        ],
      },
      {
        id: 'm3',
        title: 'ABM-Content und Personalisierung in der Praxis',
        duration: '11 Min.',
        content: [
          'Personalisierung im ABM bedeutet nicht, für jeden Account eine komplett neue Kampagne zu bauen. 80% Basiscontent, 20% Individualisierung — das ist das Verhältnis, das in der Praxis funktioniert.',
          'Account-spezifische Signale nutzen: Welche technischen Herausforderungen haben sie (Jobanzeigen analysieren)? Welche Wettbewerber nutzen sie (Review-Seiten wie G2)? Was hat die Führungsetage zuletzt kommuniziert (LinkedIn, Pressemitteilungen)? Diese Insights machen Kommunikation relevant.',
          'Content-Formate für ABM: Executive Briefings (personalisierte One-Pager für C-Level), Industry Reports mit namentlicher Erwähnung, personalisierte Demo-Environments, ABM Landing Pages (via Demandbase, Uberflip oder auch manuell), LinkedIn-Konversationen vor dem Erst-Kontakt.',
          'Kanalstrategie im ABM: LinkedIn (organisch + Paid) ist der wichtigste Kanal für B2B-ABM. E-Mail-Sequenzen (Sales-Development), Display-Retargeting auf Zielaccounts, Events (physisch und digital) für One-to-One, Gifting-Plattformen (Sendoso) für Late-Stage-Accounts.',
        ],
        keypoints: [
          '80% Basiscontent, 20% Individualisierung als Faustformel',
          'Jobanzeigen und LinkedIn analysieren: zeigen echte Prioritäten',
          'ABM Landing Pages: personalisiert per Unternehmensname/Branche',
          'LinkedIn Organic + Paid: wichtigster ABM-Kanal im B2B',
        ],
      },
      {
        id: 'm4',
        title: 'ABM messen — was zählt wirklich?',
        duration: '12 Min.',
        content: [
          'ABM-Messung ist der schwierigste Teil — und gleichzeitig das wichtigste Argument gegenüber dem C-Level. Wer ABM nur mit Lead-Volumen misst, misst das Falsche.',
          'Die richtigen ABM-Metriken: Account Engagement Score (wie aktiv sind Ihre Target Accounts?), Pipeline Influence (wie viele Deals wurden durch ABM-Aktivitäten beeinflusst?), Account Penetration (wie viele der TAL-Accounts sind in der Pipeline?), Deal Velocity (wie schnell bewegen sich ABM-Accounts durch den Funnel?).',
          'ABM-Attribution ist komplex: B2B-Deals haben 6-12 Touchpoints über mehrere Monate. Multi-Touch-Attribution statt Last-Click ist Pflicht. Tools: HubSpot (mit ABM-Modul), Salesforce + Engagio/Demandbase, 6sense.',
          'Reporting-Tipp für Agenturen: Zeigen Sie dem Kunden den Account Engagement Trend über Zeit (nicht Lead-Volumen). Accounts, die regelmässig mit Ihrer Marke interagieren, schliessen mit 3x höherer Wahrscheinlichkeit ab — das ist das Argument für ABM-Geduld.',
        ],
        keypoints: [
          'Lead-Volumen ist die falsche ABM-Metrik',
          'Account Engagement Score + Pipeline Influence = die richtigen KPIs',
          'Multi-Touch-Attribution: B2B braucht 6-12 Touchpoints',
          'ABM braucht 6-12 Monate bis sichtbare Pipeline-Ergebnisse',
        ],
      },
    ],
    quiz: [
      { id: 'q1', question: 'Was unterscheidet ABM von klassischer Demand Generation?', options: ['ABM nutzt keine digitalen Kanäle', 'ABM definiert zuerst Zielaccounts, dann Aktivierung (umgekehrter Funnel)', 'ABM zielt nur auf Grossunternehmen', 'ABM arbeitet ohne Sales-Zusammenarbeit'], correct: 1, explanation: 'ABM dreht den Funnel um: Erst Target Account List definieren, dann gezielt Awareness und Engagement bei diesen Accounts aufbauen — statt breit streuen und filtern.' },
      { id: 'q2', question: 'Was ist "One-to-Few" ABM nach ITSMA?', options: ['ABM mit nur einem Kunden', 'ABM für 20-100 Accounts, segmentiert nach Branche/Grösse', 'Programmatisches ABM für 1000+ Accounts', 'ABM für Startups'], correct: 1, explanation: 'One-to-Few (ABM Lite) adressiert 20-100 Accounts mit Segmentierung nach Branche und Grösse — der pragmatische Einstieg für die meisten B2B-Unternehmen.' },
      { id: 'q3', question: 'Woraus leitet man die Target Account List (TAL) am besten ab?', options: ['Zufälliger Branchenauswahl', 'Aus dem Ideal Customer Profile (ICP) der besten bestehenden Kunden', 'Aus dem grössten verfügbaren Adressbestand', 'Aus dem Bauchgefühl des Sales-Teams'], correct: 1, explanation: 'Die beste TAL entsteht aus dem ICP der besten bestehenden Kunden: gleiche Branche, ähnliche Grösse, vergleichbare Herausforderungen — gemeinsam mit Sales definiert.' },
      { id: 'q4', question: 'Was sind "Intent Data" im ABM-Kontext?', options: ['Daten über die Absichten der Mitarbeitenden', 'Signale, die zeigen welche Unternehmen aktiv nach Lösungen suchen', 'Datenschutzerklärungen der Zielaccounts', 'Demografische Daten der Entscheider'], correct: 1, explanation: 'Intent Data (z.B. von Bombora oder G2) zeigen, welche Unternehmen gerade aktiv Inhalte zu bestimmten Themen konsumieren — also aktiven Kaufbedarf signalisieren.' },
      { id: 'q5', question: 'Welches Content-Verhältnis ist für ABM-Personalisierung empfohlen?', options: ['100% individuell pro Account', '50% Basis, 50% individuell', '80% Basiscontent, 20% Individualisierung', '20% Basis, 80% individuell'], correct: 2, explanation: '80% Basiscontent, 20% Individualisierung ist das Verhältnis das in der Praxis funktioniert: Effizienz und Relevanz im Gleichgewicht.' },
      { id: 'q6', question: 'Was ist der wichtigste B2B-ABM-Kanal?', options: ['TV-Werbung', 'LinkedIn (organisch + Paid)', 'Print-Anzeigen in Fachzeitschriften', 'Google Search Ads'], correct: 1, explanation: 'LinkedIn ist der wichtigste Kanal für B2B-ABM: Account-basiertes Targeting mit Unternehmensgrösse, Job-Title und Branchen-Filtern, organische Thought-Leadership und Sponsored Content.' },
      { id: 'q7', question: 'Was ist die falsche Metrik für ABM?', options: ['Account Engagement Score', 'Pipeline Influence', 'Lead-Volumen', 'Account Penetration Rate'], correct: 2, explanation: 'Lead-Volumen ist die falsche ABM-Metrik — ABM produziert weniger, aber qualitativ bessere Pipeline. Die richtigen Metriken sind Account Engagement, Pipeline Influence und Deal Velocity.' },
      { id: 'q8', question: 'Wie viele Touchpoints hat ein durchschnittlicher B2B-Deal?', options: ['1-2 Touchpoints', '3-4 Touchpoints', '6-12 Touchpoints', 'Über 20 Touchpoints'], correct: 2, explanation: 'B2B-Deals haben im Schnitt 6-12 Touchpoints über mehrere Monate — deshalb ist Multi-Touch-Attribution für ABM-Reporting unerlässlich.' },
      { id: 'q9', question: 'Wer sollte die Target Account List definieren?', options: ['Nur das Marketing-Team', 'Nur das Sales-Team', 'Sales und Marketing gemeinsam', 'Die externe Agentur'], correct: 2, explanation: 'Die TAL muss Sales und Marketing gemeinsam definieren — sonst kauft Marketing Awareness bei Accounts, die Sales nie bearbeitet, und umgekehrt.' },
      { id: 'q10', question: 'Wie lange dauert es bis ABM sichtbare Pipeline-Ergebnisse zeigt?', options: ['2-4 Wochen', '1-3 Monate', '6-12 Monate', 'Über 2 Jahre'], correct: 2, explanation: 'ABM braucht 6-12 Monate bis sichtbare Pipeline-Ergebnisse entstehen — der Aufbau von Account Awareness und Engagement ist ein nachhaltiger, nicht kurzfristiger Prozess.' },
    ],
  },

  'green-claims': {
    id: 'green-claims',
    emoji: '🌱',
    title: 'Nachhaltige Kommunikation & Green Claims',
    subtitle: 'Greenwashing vermeiden, EU Green Claims Directive meistern',
    regulation: 'EU Green Claims Directive 2024 · ISO 14021 · UN SDGs',
    color: '#065F46',
    bg: '#ECFDF5',
    duration: '30 Min.',
    passing_score: 70,
    modules: [
      {
        id: 'm1',
        title: 'Greenwashing — echte Fälle, echte Konsequenzen',
        duration: '7 Min.',
        content: [
          'Greenwashing ist nicht nur ein Reputationsrisiko — seit 2024 ist es in der EU ein Rechtsrisiko. Die EU Green Claims Directive hat den Spielraum für vage Nachhaltigkeitsversprechen dramatically eingeschränkt. Und die Bussgelder sind substanziell.',
          'Klassische Greenwashing-Muster die Sie kennen sollten: "100% nachhaltig" ohne Nachweis, "klimaneutral" ohne zertifizierten Offset-Standard, "grünes Produkt" ohne Lebenszyklusanalyse, "natürlich" als Pseudozertifikat, Grüne Farbe und Blätter-Motive ohne inhaltliche Substanz.',
          'Reale Fälle: H&M musste 2023 die "Conscious Collection" vom Markt nehmen (irreführende Nachhaltigkeitsversprechen). KLM verlor einen Rechtsstreit wegen "CO2-neutralem Fliegen". Volkswagen wurde nicht nur für den Abgasskandal, sondern auch für irreführende Umweltkommunikation sanktioniert.',
          'Für Agenturen: Ihr Haftungsrisiko ist real. Wenn Sie für einen Kunden eine Kampagne mit unzutreffenden Green Claims entwickeln und produzieren, können Sie mitgehaftet werden — nicht nur der Kunde. Prüfpflicht für eingekaufte Claims ist Teil des professionellen Standards.',
        ],
        keypoints: [
          'Greenwashing ist ab 2024 EU-rechtlich strafbar',
          '"100% nachhaltig", "klimaneutral" ohne Nachweis: Rechtsrisiko',
          'Agenturen haften mit für irreführende Green Claims der Kunden',
          'Prüfpflicht: Claims immer auf Nachweis hinterfragen',
        ],
      },
      {
        id: 'm2',
        title: 'EU Green Claims Directive 2024 — was gilt ab wann?',
        duration: '8 Min.',
        content: [
          'Die EU Green Claims Directive (Richtlinie über Umweltaussagen) wurde 2024 verabschiedet und gibt den EU-Mitgliedsstaaten 2 Jahre für die Umsetzung. Für die Schweiz gilt sie direkt bei Kommunikation in EU-Märkten.',
          'Die drei Kernverbote: (1) Unsubstantiierte Umweltaussagen ohne wissenschaftlichen Nachweis sind verboten. (2) Vergleichende Umweltaussagen müssen auf gleicher Basis gemacht werden. (3) Zertifikate von Eigenmarken ohne Drittprüfung sind nicht mehr zulässig.',
          'Was ist erlaubt: Umweltaussagen, die durch anerkannte Lifecycle-Assessments (LCA), ISO 14040/44 oder EU Ecolabel unterstützt werden. Das Kommunizieren von Verbesserungen relativ zum Vorgängerprodukt ist erlaubt, wenn klar deklariert.',
          'Praktische Umsetzung für Kampagnen: Checkliste vor jedem Green-Claim: Gibt es einen verifizierten Nachweis? Ist dieser aktuell? Gilt er für das beworbene Produkt/Dienstleistung spezifisch (nicht die ganze Unternehmensgruppe)? Wurde er von einer unabhängigen Stelle bestätigt?',
        ],
        keypoints: [
          'Umsetzungsfrist für EU-Staaten: 2 Jahre ab 2024',
          'Eigenmarken-Zertifikate ohne Drittprüfung: nicht mehr erlaubt',
          'LCA (Lifecycle Assessment) = der Goldstandard für Green Claims',
          'Claim-Checkliste: Nachweis → Aktualität → Spezifität → Unabhängigkeit',
        ],
      },
      {
        id: 'm3',
        title: 'Nachhaltige Kampagnenplanung in der Agenturpraxis',
        duration: '8 Min.',
        content: [
          'Nachhaltige Kommunikation bedeutet nicht nur, keine falschen Claims zu machen — es bedeutet, Kommunikation ganzheitlich nachhaltiger zu gestalten. Das ist auch ein Differenzierungsmerkmal für Agenturen, die zukunftsfähig bleiben wollen.',
          'Nachhaltigkeit in der Produktion: Digitale-First-Strategien reduzieren CO2 gegenüber Druckprodukten signifikant. Bei Shootings: lokale Crews, nachhaltige Sets, digitale Moodboards statt Printproben. Für Print: FSC-Papier, Sojatinte, Kurzläufer.',
          'Impact-Messung für Kommunikation: Scope-3-Emissionen von Kampagnen lassen sich berechnen (Media Carbon Calculator, AdGreen UK). Das wird für grosse Kunden mit ESG-Reporting zunehmend relevant. Einige Pitch-Briefings fordern bereits einen CO2-Budget-Plan für die Kampagne.',
          'Storytelling-Empfehlungen: Zeigen statt behaupten (konkrete Zahlen statt "wir sind nachhaltig"), Fortschritt kommunizieren (von X zu Y, nicht "wir haben es geschafft"), authentische Schwächen eingestehen (erhöht Glaubwürdigkeit enorm), SDG-Verknüpfung sinnvoll und belegt.',
        ],
        keypoints: [
          'Digitale-First reduziert CO2 gegenüber Print signifikant',
          'Scope-3-Emissionen von Kampagnen sind messbar',
          'Zeigen statt behaupten: Zahlen statt Superlative',
          'Fortschritt kommunizieren ist nachhaltiger als "Mission accomplished"',
        ],
      },
      {
        id: 'm4',
        title: 'ESG-Reporting und was Kommunikations-Teams wissen müssen',
        duration: '7 Min.',
        content: [
          'ESG-Reporting ist aus dem Nischenthema zum Mainstream geworden. Die EU-Richtlinie CSRD (Corporate Sustainability Reporting Directive) verpflichtet ab 2026 zunehmend mehr Unternehmen zu standardisiertem Nachhaltigkeitsreporting — und das betrifft die Kommunikationabteilung direkt.',
          'Für Marketing-Teams relevant: Kommunikationsabteilungen liefern Input für den Nachhaltigkeitsbericht (Kampagnen-CO2, soziale Projekte, Diversity in der Kommunikation). Sie sind auch für die externe Kommunikation der ESG-Ergebnisse zuständig.',
          'Glaubwürdigkeit durch Drittprüfung: Unabhängige Zertifizierungen wie B Corp, ISO 14001, Ecovadis oder branchenspezifische Labels erhöhen die Glaubwürdigkeit von Nachhaltigkeitskommunikation massiv. Als Agentur: Kunden bei der Wahl seriöser Labels beraten.',
          'Zukunftstrend: Kunden (insbesondere grosse Unternehmen) werden von Agenturen zunehmend ESG-Daten einfordern — Footprint der Agentur, Diversity-Zahlen, nachhaltige Produktionsmethoden. Wer das jetzt aufbaut, ist im Pitch von morgen vorne.',
        ],
        keypoints: [
          'CSRD: ab 2026 für mehr Unternehmen verpflichtend',
          'Marketing liefert Input UND kommuniziert ESG-Ergebnisse',
          'B Corp / ISO 14001 / Ecovadis: seriöse unabhängige Zertifikate',
          'Agenturen werden zunehmend selbst nach ESG-Daten gefragt',
        ],
      },
    ],
    quiz: [
      { id: 'q1', question: 'Was ist Greenwashing rechtlich seit 2024?', options: ['Nur ein Reputationsrisiko', 'In der EU rechtlich verboten und sanktionierbar', 'Nur bei Grossunternehmen relevant', 'Noch nicht geregelt'], correct: 1, explanation: 'Die EU Green Claims Directive 2024 macht Greenwashing rechtlich verboten und sanktionierbar — mit substanziellen Bussgeldern für Unternehmen und Agenturen.' },
      { id: 'q2', question: 'Welches Greenwashing-Muster ist typisch?', options: ['"Reduktion von X auf Y% bis 2030 laut ISO 14064"', '"100% nachhaltig" ohne Nachweis', '"Verbesserte CO2-Bilanz gegenüber Vorjahr laut Drittprüfer"', '"FSC-zertifiziertes Papier"'], correct: 1, explanation: '"100% nachhaltig" ohne nachgewiesene Basis ist ein klassisches Greenwashing-Muster — ein vager Superlativ ohne unabhängigen Nachweis.' },
      { id: 'q3', question: 'Was verbindet die EU Green Claims Directive?', options: ['Alle Umweltkommunikation', 'Unsubstantiierte Claims, nicht-unabhängige Eigenmarken-Zertifikate', 'Nur Print-Werbung', 'Nur für börsennotierte Unternehmen'], correct: 1, explanation: 'Die Directive verbietet unsubstantiierte Umweltaussagen ohne wissenschaftlichen Nachweis und Eigenmarken-Zertifikate ohne unabhängige Drittprüfung.' },
      { id: 'q4', question: 'Was ist der Goldstandard für Green Claims?', options: ['Eigene Nachhaltigkeitsberichte', 'Lifecycle Assessment (LCA) nach ISO 14040/44', 'Grüne Verpackung', 'Social-Media-Aussagen des CEO'], correct: 1, explanation: 'Das Lifecycle Assessment (LCA) nach ISO 14040/44 analysiert den gesamten Lebensweg eines Produkts und ist der anerkannte wissenschaftliche Standard für Umweltaussagen.' },
      { id: 'q5', question: 'Was ist beim nachhaltigen Storytelling empfohlen?', options: ['"Wir sind die nachhaltigste Marke der Branche"', 'Fortschritt kommunizieren: von X% auf Y% mit Nachweis', 'Nur positive Aspekte kommunizieren', 'Nachhaltigkeitskommunikation dem CSR-Team überlassen'], correct: 1, explanation: 'Fortschritt kommunizieren (von X auf Y) mit konkreten Zahlen und unabhängigem Nachweis ist glaubwürdiger als vage Superlative und "Mission accomplished".' },
      { id: 'q6', question: 'Was bedeutet CSRD für Marketing-Teams?', options: ['Nichts Konkretes', 'Marketing liefert Input und kommuniziert ESG-Ergebnisse für den Nachhaltigkeitsbericht', 'Nur für Finance relevant', 'Ersatz der bisherigen Werbebotschaften'], correct: 1, explanation: 'CSRD (Corporate Sustainability Reporting Directive) macht Marketing direkt relevant: als Lieferant von Kampagnen-CO2-Daten und als Kommunikator der ESG-Ergebnisse nach aussen.' },
      { id: 'q7', question: 'Welches Zertifikat ist unabhängig und glaubwürdig?', options: ['"Nachhaltig by Brand X" (Eigenmarke)', 'B Corp Zertifizierung', '"Grün geprüft" (selbst erstellt)', '"Wir-fühlen-uns-nachhaltig" Siegel'], correct: 1, explanation: 'B Corp ist eine unabhängige Zertifizierung durch die Non-Profit-Organisation B Lab — glaubwürdiger als Eigenmarken-Siegel ohne externe Prüfung.' },
      { id: 'q8', question: 'Haften Agenturen für Greenwashing-Kampagnen ihrer Kunden?', options: ['Nein, nur der Auftraggeber haftet', 'Ja, Agenturen können mitgehaftet werden', 'Nur bei Printprojekten', 'Nur bei internationalen Kampagnen'], correct: 1, explanation: 'Agenturen können bei irreführenden Green Claims mitgehaftet werden — professionelle Prüfpflicht für Nachhaltigkeitsbehauptungen ist Teil des Standards.' },
      { id: 'q9', question: 'Was ist ein reales Greenwashing-Beispiel aus der Praxis?', options: ['Kommunikation von verifizierten CO2-Reduktionen', 'H&Ms "Conscious Collection" (musste zurückgezogen werden)', 'FSC-Zertifizierung des Papiers', 'B Corp Zertifizierung'], correct: 1, explanation: "H&M musste 2023 die 'Conscious Collection' nach Verbraucherschutz-Klagen zurückziehen — die Nachhaltigkeitsversprechen konnten nicht substanziiert werden." },
      { id: 'q10', question: 'Was werden Kunden von Agenturen zunehmend einfordern?', options: ['Günstigere Preise', 'ESG-Daten der Agentur (Footprint, Diversity, Methoden)', 'Kürzere Kampagnenlaufzeiten', 'Mehr TV-Werbung'], correct: 1, explanation: 'Grosse Unternehmen mit ESG-Berichtspflicht fordern zunehmend ESG-Daten von Lieferanten — inkl. Agenturen. Wer das jetzt aufbaut, gewinnt morgen die Pitches.' },
    ],
  },

  'social-selling-b2b': {
    id: 'social-selling-b2b',
    emoji: '💼',
    title: 'Social Selling & LinkedIn für B2B',
    subtitle: 'Mehr Pipeline, weniger Kaltakquise — mit System',
    regulation: 'LinkedIn SSI · Meta Business Suite · B2B Social Selling Index',
    color: '#0A66C2',
    bg: '#DBEAFE',
    duration: '30 Min.',
    passing_score: 70,
    modules: [
      {
        id: 'm1',
        title: 'LinkedIn-Profil als strategisches Verkaufstool',
        duration: '7 Min.',
        content: [
          'Ihr LinkedIn-Profil ist die neue Visitenkarte — nur dass sie vor dem ersten Treffen schon gelesen wird. Wenn ein potenzieller Klient oder Recruiter Ihren Namen googelt, landet er dort. In 10 Sekunden entscheidet sich, ob er weiterklickt.',
          'Die kritischen Profil-Elemente: Headerbild (zeigt Ihr Umfeld, kein weisser Hintergrund), professionelles Foto (kein Selfie, aber authentisch), Headline (nicht "Group Account Director at X" sondern was Sie für wen bewirken), About-Section (Ihr Wertversprechen in 2-3 Sätzen, mit Call-to-Action).',
          'Featured Section richtig nutzen: Hier kommen Ihre besten Arbeiten, Artikel, Case Studies, Testimonials. Diese Section wird selten gepflegt — wer es tut, differenziert sich sofort.',
          'LinkedIn Social Selling Index (SSI): LinkedIn misst in vier Dimensionen, wie gut Sie die Plattform für Sales nutzen: Professional Brand, Find Right People, Engage with Insights, Build Relationships. Ihr SSI-Score korreliert laut LinkedIn-Daten mit dem Erreichen von Sales-Quoten.',
        ],
        keypoints: [
          'Headline = was Sie für wen bewirken (kein Job-Title)',
          'Featured Section: beste Arbeiten, Case Studies, Testimonials',
          'SSI-Score: LinkedIn misst Ihre Social-Selling-Effektivität',
          'Profil = aktives Vertriebstool, nicht Lebenslauf-Ablage',
        ],
      },
      {
        id: 'm2',
        title: 'Content-Strategie und Thought Leadership auf LinkedIn',
        duration: '8 Min.',
        content: [
          'Thought Leadership auf LinkedIn bedeutet nicht, jeden Tag zu posten. Es bedeutet, regelmässig relevante Inhalte zu teilen, die Ihre Zielgruppe interessieren und Ihnen einen Expertenstatus aufbauen.',
          'Die 4-1-1-Regel: Auf jeden selbstpromotionalen Post kommen 4 Posts mit genutzem Content (Insights, Tipps, Branchennews) und 1 Post mit fremdem Content (guter Artikel von anderen). Das verhindert den Feed-Spam-Effekt.',
          'Was auf LinkedIn wirklich funktioniert: Persönliche Erkenntnisse aus der eigenen Arbeit (nicht Branchen-Allgemeinplätze), Meinungsposts mit einer klaren These (provozieren konstruktiv Diskussionen), Zahlen und konkrete Ergebnisse (statt "wir sind stolz..."), hinter-den-Kulissen-Content (echte Einblicke in Projekte).',
          'Konsistenz schlägt Frequenz: Zweimal pro Woche mit guten Inhalten ist besser als täglich mittelmässig. LinkedIn-Algorithmus bevorzugt Posts mit hoher Early-Engagement-Rate (erste 60 Minuten entscheiden über Reichweite).',
        ],
        keypoints: [
          '4-1-1-Regel: 4 Nutzen, 1 Fremd, 1 Eigenpromotion',
          'Persönliche Erkenntnisse > Branchen-Allgemeinplätze',
          '2x/Woche gut > täglich mittelmässig',
          'Erste 60 Minuten nach Post entscheiden über Algorithmus-Reichweite',
        ],
      },
      {
        id: 'm3',
        title: 'LinkedIn Ads und Lead Gen Forms für B2B',
        duration: '8 Min.',
        content: [
          'LinkedIn Ads sind teurer als andere Plattformen — CPM 2-5x höher als Meta, CPC oft über CHF 10. Dafür ist die Zielgruppen-Qualität im B2B ungeschlagen. Der ROI rechnet sich, wenn man es richtig macht.',
          'Die stärksten LinkedIn-Ad-Formate für B2B: Single Image Ads (Awareness), Lead Gen Forms (ohne Landing Page, Conversion direkt auf LinkedIn), Conversation Ads (personalisierte Nachrichten im Inbox, hohe CTR), Thought Leader Ads (Boost organischer Posts von Mitarbeitenden).',
          'Zielgruppen-Setup: Company Size + Job Title + Industry + Seniority ist das Standard-Setup für B2B. Matched Audiences (Upload eigener E-Mail-Listen oder CRM-Daten) erhöht Relevanz massiv. Retargeting auf Website-Besucher und Video-Viewer für Mid-Funnel.',
          'Lead Gen Forms: Die vorausgefüllten Formulare direkt in LinkedIn erhöhen Conversion-Raten um 2-3x gegenüber externen Landing Pages. Perfekt für Content-Downloads, Webinar-Anmeldungen, Demos. Datenschutz: DSGVO-Einwilligung muss separat gegeben werden, reiner LinkedIn-Lead reicht nicht.',
        ],
        keypoints: [
          'LinkedIn Ads: teuer, aber B2B-Zielgruppen-Qualität ungeschlagen',
          'Lead Gen Forms: 2-3x höhere Conversion als externe Landing Pages',
          'Matched Audiences: eigene CRM-Daten für präzises Targeting',
          'LinkedIn-Lead ≠ DSGVO-Einwilligung: separat einholen',
        ],
      },
      {
        id: 'm4',
        title: 'Messen, optimieren und den SSI wirklich nutzen',
        duration: '7 Min.',
        content: [
          'Social Selling auf LinkedIn funktioniert nur mit Kontinuität und Messung. Was nicht gemessen wird, wird nicht verbessert — und bei LinkedIn gibt es erstaunlich viele Messpunkte.',
          'Die richtigen Metriken: Profil-Views (Trend über Zeit), Search Appearances (wie oft tauchen Sie in Suchen auf), Post-Engagement-Rate (Likes + Kommentare + Shares / Impressions), Follower-Wachstum, InMail Response Rate, und: Pipeline-Beitrag (welche Deals kamen über LinkedIn).',
          'LinkedIn Sales Navigator lohnt sich ab: Wenn Sie systematisch 10+ Target Accounts bearbeiten, Sales Navigator in Verbindung mit CRM nutzen und Intent-Signale (Job changes, Posts, Company News) für die Kontaktaufnahme nutzen wollen.',
          'Der Social Selling Playbook für Account Directors: Wöchentlich 30 Min. Profil-Maintenance (neue Featured Content, Empfehlungen), täglich 15 Min. Engagement (kommentieren bei Zielaccounts), zweimal wöchentlich eigener Post, monatlich Analyse der SSI und Profil-Views.',
        ],
        keypoints: [
          'Profil-Views + Search Appearances = Sichtbarkeits-KPIs',
          'Sales Navigator ab 10+ systematisch bearbeiteten Accounts',
          'Playbook: 30 Min./Woche Profil, 15 Min./Tag Engagement, 2x Post',
          'Pipeline-Beitrag von LinkedIn messen (im CRM taggen)',
        ],
      },
    ],
    quiz: [
      { id: 'q1', question: 'Was sollte die LinkedIn-Headline kommunizieren?', options: ['Nur Jobtitel und Unternehmen', 'Was Sie für wen bewirken (Wertversprechen)', 'Ihre komplette Berufserfahrung', 'Ihre Ausbildung'], correct: 1, explanation: 'Die Headline ist der wichtigste Text im Profil: Nicht "Group Account Director at X" sondern was Sie für wen bewirken — Ihr Wertversprechen in einem Satz.' },
      { id: 'q2', question: 'Was besagt die 4-1-1-Regel auf LinkedIn?', options: ['4 Posts pro Woche, 1 mal im Monat', '4 nützliche Posts, 1 fremder, 1 Eigenpromotion', '4 Kommentare, 1 Like, 1 Share täglich', '4 Connections, 1 Follow-up, 1 InMail'], correct: 1, explanation: 'Die 4-1-1-Regel: Auf jeden selbstpromotionalen Post kommen 4 Posts mit echtem Nutzen für die Zielgruppe und 1 geteilter Post von anderen — verhindert Spam-Effekt.' },
      { id: 'q3', question: 'Was entscheidet hauptsächlich über die Algorithmus-Reichweite eines LinkedIn-Posts?', options: ['Die Länge des Posts', 'Engagement in den ersten 60 Minuten nach Veröffentlichung', 'Anzahl der eigenen Follower', 'Ob bezahlte Werbung gebucht wird'], correct: 1, explanation: 'LinkedIn bevorzugt Posts mit hoher Early-Engagement-Rate: Kommentare, Likes und Shares in den ersten 60 Minuten bestimmen, wie weit der Algorithmus den Post verteilt.' },
      { id: 'q4', question: 'Was sind LinkedIn Lead Gen Forms?', options: ['Externe Landing Pages mit LinkedIn-Design', 'Direkt in LinkedIn vorausgefüllte Formulare ohne externe Weiterleitung', 'LinkedIn-interne CRM-Tools', 'Automatische Nachrichten an Kontakte'], correct: 1, explanation: 'Lead Gen Forms sind direkt in LinkedIn integriert: Nutzerdaten werden vorausgefüllt, keine externe Landing Page nötig — 2-3x höhere Conversion als externe Seiten.' },
      { id: 'q5', question: 'Was misst der LinkedIn Social Selling Index (SSI)?', options: ['Nur die Anzahl der Connections', 'Professional Brand, Find Right People, Engage, Build Relationships', 'Nur die Posting-Frequenz', 'Den monatlichen Umsatz über LinkedIn'], correct: 1, explanation: 'Der SSI misst LinkedIn-Nutzung in vier Dimensionen: Professional Brand aufbauen, die richtigen Personen finden, mit Insights interagieren, Beziehungen aufbauen.' },
      { id: 'q6', question: 'Wann lohnt sich LinkedIn Sales Navigator?', options: ['Immer, für jeden', 'Ab 10+ systematisch bearbeiteten Target Accounts', 'Nur für Enterprise-Unternehmen', 'Nur für Sales-Teams, nicht Marketing'], correct: 1, explanation: 'Sales Navigator lohnt sich ab 10+ systematisch bearbeiteten Target Accounts, wenn Intent-Signale (Job Changes, Company News) für die Kontaktaufnahme genutzt werden.' },
      { id: 'q7', question: 'Was gilt für DSGVO bei LinkedIn Lead Gen Forms?', options: ['LinkedIn-Einwilligung = DSGVO-Einwilligung', 'Separate DSGVO-Einwilligung muss zusätzlich eingeholt werden', 'Keine DSGVO-Pflichten bei LinkedIn', 'Nur bei EU-Bürgern relevant'], correct: 1, explanation: 'Ein Lead Gen Form gibt LinkedIn-Daten frei — das ist nicht automatisch eine DSGVO-konforme Einwilligung für Marketing-Kommunikation. Diese muss separat und nachweisbar eingeholt werden.' },
      { id: 'q8', question: 'Welches LinkedIn-Ad-Format eignet sich am besten für Mid-Funnel?', options: ['Brand Awareness Ads mit breitem Targeting', 'Retargeting auf Website-Besucher und Video-Viewer', 'Sponsored Messaging an alle LinkedIn-Nutzer', 'Text Ads in der Sidebar'], correct: 1, explanation: 'Retargeting auf Website-Besucher und Video-Viewer eignet sich ideal für Mid-Funnel: Diese Personen kennen die Marke bereits und sind näher an einer Entscheidung.' },
      { id: 'q9', question: 'Was funktioniert auf LinkedIn organisch besonders gut?', options: ['Unternehmens-PR und Pressemitteilungen', 'Persönliche Erkenntnisse aus eigener Arbeit und klare Meinungsposts', 'Produktkataloge und Preislisten', 'Jobanzeigen des eigenen Unternehmens'], correct: 1, explanation: 'Persönliche Erkenntnisse aus der eigenen Arbeit und klare Meinungsposts mit These erzeugen deutlich mehr Engagement als generische Branchen-Inhalte oder PR-Texte.' },
      { id: 'q10', question: 'Wie viel Zeit pro Woche ist für ein effektives Social-Selling-Playbook realistisch?', options: ['Mehrere Stunden täglich', '30 Min./Woche Profil + 15 Min./Tag Engagement', 'Nur bei Kampagnenphasen relevant', 'Mindestens 2h täglich'], correct: 1, explanation: 'Das Playbook: 30 Min./Woche Profil-Maintenance, 15 Min./Tag Engagement bei Zielaccounts, zweimal wöchentlich eigener Post — realistisch, konsistent und messbar effektiv.' },
    ],
  },
}

Object.assign(COURSES_DATA, AGENTUR_COURSES)
