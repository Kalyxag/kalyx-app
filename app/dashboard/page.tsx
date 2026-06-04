// Ziel-Pfad im Repo: app/dashboard/page.tsx  (ERSETZT das alte Demo-Dashboard)
//
// Das frühere Demo-Dashboard mit Beispieldaten ist abgelöst. Diese Seite
// leitet auf den echten Arbeitsbereich um, damit der Login von kalyx.ag dort landet.
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardRedirect() {
  const router = useRouter()
  useEffect(() => { router.replace('/arbeitsbereich') }, [router])
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Albert Sans', system-ui, sans-serif", color: '#6B7280', background: '#0B1929' }}>
      <span style={{ color: 'rgba(255,255,255,.7)' }}>Weiter zum Arbeitsbereich …</span>
    </div>
  )
}
