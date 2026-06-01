import { MOCK_TENANTS, MOCK_USERS_BY_TENANT, MOCK_CREDENTIALS, MOCK_STATS_BY_TENANT, MOCK_ACTIVITY_BY_TENANT } from './mock/data'

function getTenantSlug(email: string): string {
  const domain = email.split('@')[1]
  const map: Record<string, string> = {
    'helvetia-finanz.ch':      'helvetia-finanz',
    'novabio-schweiz.ch':      'novabio-schweiz',
    'akademie-plus.ch':        'akademie-plus',
    'swiss-retail-group.ch':   'swiss-retail-group',
    'precisiontech.ch':        'precisiontech',
    'metroplan-zuerich.ch':    'metroplan-zuerich',
    'brandwerk-zuerich.ch':    'brandwerk-zuerich',
    'ksz.ch':                  'kantonsspital-zuerich',
    'zurich-insurance.ch':     'zurich-insurance',
  }
  return map[domain] || 'helvetia-finanz'
}

export const auth = {
  async login(email: string, _password: string) {
    await new Promise(r => setTimeout(r, 600))
    const creds = MOCK_CREDENTIALS[email.toLowerCase()]
    if (!creds) return { error: 'E-Mail nicht gefunden' }
    const slug = creds.tenant
    const tenant = MOCK_TENANTS[slug]
    const users = MOCK_USERS_BY_TENANT[slug] || []
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!user) return { error: 'Benutzer nicht gefunden' }
    const session = { user, tenant, tenantSlug: slug }
    if (typeof window !== 'undefined') sessionStorage.setItem('kalyx_s', JSON.stringify(session))
    return { session, requiresMfa: tenant.mfa_required }
  },
  getSession() {
    if (typeof window === 'undefined') return null
    try { return JSON.parse(sessionStorage.getItem('kalyx_s') || 'null') } catch { return null }
  },
  logout() {
    if (typeof window !== 'undefined') sessionStorage.removeItem('kalyx_s')
  },
  getData(slug: string) {
    return {
      tenant:   MOCK_TENANTS[slug]        || MOCK_TENANTS['helvetia-finanz'],
      users:    MOCK_USERS_BY_TENANT[slug]|| [],
      stats:    MOCK_STATS_BY_TENANT[slug]|| MOCK_STATS_BY_TENANT['helvetia-finanz'],
      activity: MOCK_ACTIVITY_BY_TENANT[slug] || [],
    }
  }
}
