'use client'
import {useEffect, useState} from 'react'
import {useRouter, usePathname} from 'next/navigation'
import {auth} from '@/lib/auth'

const NAV = [
  {href:'/dashboard',label:'Dashboard',icon:'📊'},
  {href:'/dashboard/courses',label:'Kurse',icon:'📚'},
  {href:'/dashboard/compliance',label:'Compliance',icon:'🛡️'},
  {href:'/dashboard/users',label:'Mitarbeitende',icon:'👥'},
]

export default function DashboardLayout({children}:{children:React.ReactNode}) {
  const router = useRouter()
  const pathname = usePathname()
  const [session, setSession] = useState<any>(null)

  useEffect(()=>{
    const s = auth.getSession()
    if(!s){router.push('/login');return}
    setSession(s)
  },[router])

  if(!session) return <div style={{background:'#0B1929',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:14}}>Wird geladen…</div>

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#F5F4EF'}}>
      <div style={{width:220,background:'#0B1929',display:'flex',flexDirection:'column',flexShrink:0,position:'sticky',top:0,height:'100vh',overflowY:'auto'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,padding:'20px 16px 16px',borderBottom:'1px solid rgba(255,255,255,.07)'}}>
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="5" fill="#14613E"/><path d="M8 24L16 8L24 24" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
          <span style={{fontFamily:'Georgia,serif',fontSize:16,fontWeight:600,color:'#fff',letterSpacing:'.06em'}}>KALYX</span>
        </div>
        <div style={{fontFamily:'monospace',fontSize:9,color:'rgba(255,255,255,.3)',padding:'10px 16px 6px',letterSpacing:'.08em',textTransform:'uppercase'}}>{session.tenant?.display_name}</div>
        {NAV.map(n=>(
          <a key={n.href} href={n.href} style={{display:'flex',alignItems:'center',gap:8,padding:'10px 14px',fontSize:13,fontWeight:500,color:pathname===n.href?'#fff':'rgba(255,255,255,.6)',cursor:'pointer',borderRadius:6,margin:'2px 8px',textDecoration:'none',background:pathname===n.href?'rgba(20,97,62,.3)':'transparent',borderLeft:pathname===n.href?'2px solid #14613E':'2px solid transparent'}}>
            <span>{n.icon}</span>{n.label}
          </a>
        ))}
        <div style={{marginTop:'auto',padding:'12px 14px',borderTop:'1px solid rgba(255,255,255,.07)',display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:30,height:30,borderRadius:'50%',background:'#14613E',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'#fff',flexShrink:0}}>
            {(session.user?.full_name||'').split(' ').map((n:string)=>n[0]).join('')}
          </div>
          <div>
            <div style={{fontSize:12,fontWeight:500,color:'#fff'}}>{session.user?.full_name}</div>
            <div style={{fontFamily:'monospace',fontSize:9,color:'rgba(255,255,255,.3)'}}>{session.user?.role}</div>
          </div>
        </div>
      </div>
      <div style={{flex:1,overflow:'auto'}}>
        <div style={{background:'#fff',borderBottom:'1px solid #E5E7EB',padding:'0 28px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <span style={{fontSize:13,color:'#6B7280',fontFamily:'monospace'}}>{session.tenant?.name}</span>
          <button style={{background:'none',border:'1px solid #E5E7EB',borderRadius:6,padding:'6px 12px',fontSize:12,cursor:'pointer',color:'#6B7280'}} onClick={()=>{auth.logout();router.push('/login')}}>Abmelden</button>
        </div>
        <div style={{padding:28}}>{children}</div>
      </div>
    </div>
  )
}
