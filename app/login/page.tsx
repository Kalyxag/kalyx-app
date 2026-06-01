'use client'
import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {auth} from '@/lib/auth'
import {MOCK_CREDENTIALS} from '@/lib/mock/data'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@helvetia-finanz.ch')
  const [pw, setPw] = useState('')
  const [mfa, setMfa] = useState('')
  const [step, setStep] = useState<'login'|'mfa'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hint, setHint] = useState(false)

  async function handleLogin(e: any) {
    e.preventDefault(); setError(''); setLoading(true)
    const r = await auth.login(email, pw)
    setLoading(false)
    if (r.error) {setError(r.error); return}
    if (r.requiresMfa) {setStep('mfa')} else {router.push('/dashboard')}
  }
  function handleMfa(e: any) {
    e.preventDefault()
    if (!/^\d{6}$/.test(mfa)) {setError('6 Ziffern erforderlich'); return}
    router.push('/dashboard')
  }

  const bg = '#0B1929', card = '#fff', green = '#14613E'
  const inp: React.CSSProperties = {width:'100%',border:'1.5px solid #E5E7EB',borderRadius:8,padding:'11px 14px',fontSize:14,marginBottom:14,fontFamily:'inherit',outline:'none',boxSizing:'border-box'}
  const btn: React.CSSProperties = {width:'100%',background:green,color:'#fff',border:'none',borderRadius:8,padding:13,fontSize:15,fontWeight:600,cursor:'pointer',marginTop:4}
  const err: React.CSSProperties = {background:'#FEF2F2',color:'#DC2626',borderRadius:8,padding:'10px 14px',fontSize:13,marginBottom:14}

  return (
    <div style={{minHeight:'100vh',background:bg,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div style={{background:card,borderRadius:16,padding:'40px 36px',width:'100%',maxWidth:440,boxShadow:'0 20px 60px rgba(0,0,0,.4)'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:28}}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="6" fill={green}/><path d="M8 24L16 8L24 24" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 19Q16 13 20 19" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity=".65"/><circle cx="16" cy="24" r="1.5" fill="white" opacity=".45"/></svg>
          <span style={{fontFamily:'Georgia,serif',fontSize:22,fontWeight:600,color:bg,letterSpacing:'.05em'}}>KALYX</span>
        </div>
        {step==='login' ? <>
          <div style={{fontFamily:'Georgia,serif',fontSize:24,fontWeight:600,marginBottom:6,color:'#111820'}}>Anmelden</div>
          <div style={{fontSize:13,color:'#6B7280',marginBottom:24,lineHeight:1.6}}>KI-native Compliance-Lernplattform · 5 Demo-Firmen verfügbar</div>
          {error && <div style={err}>{error}</div>}
          <form onSubmit={handleLogin}>
            <div style={{fontSize:13,fontWeight:500,color:'#374151',marginBottom:6}}>E-Mail</div>
            <input style={inp} type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
            <div style={{fontSize:13,fontWeight:500,color:'#374151',marginBottom:6}}>Passwort</div>
            <input style={inp} type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Beliebiges Passwort (Demo-Modus)" required/>
            <button style={btn} disabled={loading}>{loading?'Wird angemeldet…':'Anmelden →'}</button>
          </form>
          <div style={{textAlign:'center',marginTop:16}}>
            <span style={{fontSize:12,color:green,cursor:'pointer',textDecoration:'underline'}} onClick={()=>setHint(!hint)}>Demo-Logins anzeigen</span>
          </div>
          {hint && <div style={{background:'#F0FDF4',border:'1px solid #BBF7D0',borderRadius:8,padding:'12px 14px',marginTop:12,fontSize:12,lineHeight:1.8}}>
            <strong>Demo-Zugänge · Passwort: beliebig</strong><br/>
            {Object.entries(MOCK_CREDENTIALS).map(([em, {tenant}])=>(
              <span key={em} onClick={()=>{setEmail(em);setHint(false)}} style={{cursor:'pointer',color:green,display:'block'}}>
                {em} <span style={{color:'#9CA3AF',fontSize:10}}>({tenant})</span>
              </span>
            ))}
          </div>}
        </> : <>
          <div style={{fontFamily:'Georgia,serif',fontSize:24,fontWeight:600,marginBottom:6,color:'#111820'}}>Zwei-Faktor</div>
          <div style={{fontSize:13,color:'#6B7280',marginBottom:24}}>6-stelligen Code eingeben. Im Demo: beliebige 6 Ziffern (z.B. 123456)</div>
          {error && <div style={err}>{error}</div>}
          <form onSubmit={handleMfa}>
            <input style={{...inp,letterSpacing:'0.4em',textAlign:'center',fontSize:24}} type="text" value={mfa} onChange={e=>setMfa(e.target.value.replace(/\D/g,'').slice(0,6))} placeholder="000000" maxLength={6}/>
            <button style={btn}>Verifizieren →</button>
          </form>
          <span style={{display:'block',textAlign:'center',marginTop:14,fontSize:12,color:green,cursor:'pointer',textDecoration:'underline'}} onClick={()=>{setStep('login');setError('');setMfa('')}}>← Zurück</span>
        </>}
      </div>
    </div>
  )
}
