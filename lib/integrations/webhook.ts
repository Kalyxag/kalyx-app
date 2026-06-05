// Versand an eingehende Webhooks (Slack + Microsoft Teams via Workflows).
// Slack erwartet { text }. Teams-Workflows akzeptieren weiterhin das
// MessageCard-Format. Beide werden hier passend verpackt.

const GREEN = '14613E'

// Baut den Meldungstext datensparsam. Ohne Klarnamen-Freigabe wird die Person
// neutral bezeichnet, sodass keine personenbezogenen Daten nach aussen gehen.
export function buildEventText(showNames: boolean, personName: string | null, action: string): string {
  const subjekt = showNames && personName && personName.trim() ? personName.trim() : 'Eine lernende Person'
  return subjekt + ' ' + action
}

export type WebhookResult = {
  ok: boolean
  status: number
  error?: string
  gesendet_am: string
}

function bodyFor(key: string, title: string, text: string): string {
  if (key === 'teams_webhook') {
    return JSON.stringify({
      '@type': 'MessageCard',
      '@context': 'https://schema.org/extensions',
      summary: title || 'KALYX',
      themeColor: GREEN,
      title: title || 'KALYX',
      text,
    })
  }
  // Slack (und sinnvolle Vorgabe)
  return JSON.stringify({ text: (title ? '*' + title + '*\n' : '') + text })
}

export async function sendWebhook(
  key: string, url: string, title: string, text: string,
): Promise<WebhookResult> {
  const gesendet_am = new Date().toISOString()
  if (!url || !/^https:\/\//i.test(url)) {
    return { ok: false, status: 0, error: 'Keine gueltige https-URL hinterlegt.', gesendet_am }
  }
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 8000)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: bodyFor(key, title, text),
      signal: ctrl.signal,
    })
    clearTimeout(timer)
    if (!res.ok) {
      const t = await res.text().catch(() => '')
      return { ok: false, status: res.status, error: t.slice(0, 300) || ('HTTP ' + res.status), gesendet_am }
    }
    return { ok: true, status: res.status, gesendet_am }
  } catch (e: any) {
    clearTimeout(timer)
    const msg = e?.name === 'AbortError' ? 'Zeitueberschreitung (8s).' : (e?.message || 'Verbindung fehlgeschlagen.')
    return { ok: false, status: 0, error: msg, gesendet_am }
  }
}
