'use client'
import { useEffect, useState } from 'react'

// ============================================================
// KALYX — Hinweis-Pop-up vor dem Hochladen (nur Testdaten)
// Zeigt sich einmal pro Sitzung. Erst nach "Bestaetigen" frei.
// ============================================================

const GREEN = '#14613E'
const NAVY = '#0B1929'
const TEXT = '#111820'
const GRAY = '#6B7280'

export default function TestDataGate() {
  const [visible, setVisible] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    // Pro Sitzung nur einmal anzeigen
    const ack = sessionStorage.getItem('kalyx_testdata_ack')
    if (ack !== '1') setVisible(true)
  }, [])

  const handleConfirm = () => {
    sessionStorage.setItem('kalyx_testdata_ack', '1')
    setConfirmed(true)
    setTimeout(() => setVisible(false), 1600)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
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
        style={{
          background: '#fff',
          borderRadius: 16,
          maxWidth: 520,
          width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          overflow: 'hidden',
        }}
      >
        {!confirmed ? (
          <>
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
                und werden lückenlos protokolliert. Dieser Wechsel wird im CI/CD von KALYX umgesetzt.
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: GRAY, marginBottom: 24 }}>
                Mit Ihrer Bestätigung erklären Sie, dass Sie ausschliesslich Testdaten verwenden.
              </p>

              <button
                onClick={handleConfirm}
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
                Bestätigen
              </button>
            </div>
          </>
        ) : (
          <div style={{ padding: '48px 28px', textAlign: 'center' }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: GREEN,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                margin: '0 auto 20px',
              }}
            >
              ✓
            </div>
            <h2
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 20,
                fontWeight: 600,
                color: NAVY,
                margin: 0,
              }}
            >
              Vielen Dank für Ihren Besuch bei KALYX.
            </h2>
          </div>
        )}
      </div>
    </div>
  )
}
