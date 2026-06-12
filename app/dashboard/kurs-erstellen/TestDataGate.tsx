'use client'

// ============================================================
// KALYX — Hinweis-Pop-up vor der Kursgenerierung (nur Testdaten)
// Gesteuerte Komponente: erscheint bei JEDER Generierung.
// Eltern-Komponente blendet sie ein und gibt onConfirm / onClose.
// ============================================================

const GREEN = 'var(--kx-brand,#14613E)'
const TEXT = '#111820'
const GRAY = '#6B7280'

type Props = {
  onConfirm: () => void
  onClose: () => void
}

export default function TestDataGate({ onConfirm, onClose }: Props) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(11, 25, 41, 0.55)',
        backdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 16,
          maxWidth: 520,
          width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          overflow: 'hidden',
        }}
      >
        <div style={{ background: GREEN, padding: '20px 28px' }}>
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: 10,
              letterSpacing: '0.14em',
              color: 'rgba(255,255,255,0.75)',
              marginBottom: 6,
              textTransform: 'uppercase',
            }}
          >
            KALYX Hinweis
          </div>
          <h2
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 22,
              fontWeight: 600,
              color: '#fff',
              margin: 0,
            }}
          >
            Aktuell ausschliesslich Testdaten
          </h2>
        </div>

        <div style={{ padding: '24px 28px' }}>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: TEXT, marginTop: 0, marginBottom: 16 }}>
            Diese Umgebung befindet sich im Testbetrieb. Bitte laden Sie ausschliesslich
            Testdaten hoch. Verwenden Sie keine echten Kundendaten, keine Mitarbeiterdaten
            und keine personenbezogenen Informationen.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: TEXT, marginBottom: 16 }}>
            Aktueller Stand: Die KI Kursgenerierung wird in dieser Phase über eine externe
            Schnittstelle verarbeitet. Sie dient allein dem Testen und der Demonstration.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: TEXT, marginBottom: 16 }}>
            Sobald KALYX den nächsten Schritt geht, erfolgt die Verarbeitung vollständig über
            eine souveräne Infrastruktur in der Schweiz oder der EU. Ihre Inhalte verbleiben dann
            in zertifizierten Rechenzentren, fliessen niemals in das Training von KI Modellen ein
            und werden lückenlos protokolliert.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: GRAY, marginBottom: 24 }}>
            Mit Ihrer Bestätigung erklären Sie, dass Sie ausschliesslich Testdaten verwenden.
          </p>

          <button
            onClick={onConfirm}
            style={{
              background: GREEN,
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '14px 28px',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              width: '100%',
              letterSpacing: '0.02em',
            }}
          >
            Bestätigen und generieren
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              color: GRAY,
              border: 'none',
              padding: '12px 28px',
              fontSize: 13,
              cursor: 'pointer',
              width: '100%',
              marginTop: 4,
            }}
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  )
}
