'use client'
import {useEffect,useState} from 'react'
import {auth} from '@/lib/auth'

const COURSES=[
  {emoji:'⚖️',name:'GwG 2025',reg:'FINMA · GwG',pct:88,color:'#14613E'},
  {emoji:'🔒',name:'DSGVO & DSG',reg:'Datenschutz',pct:94,color:'#3A6DB5'},
  {emoji:'🛡️',name:'ISO 27001',reg:'Sicherheit',pct:72,color:'#B8904A'},
]

export default function DashboardPage() {
  const [d, setD] = useState<any>(null)
  const [s, setS] = useState<any>(null)
  useEffect(()=>{const sess=auth.getSession();if(!sess)return;setS(sess);setD(auth.getData(sess.tenantSlug))},[])
  if(!d||!s)return null
  const {stats,activity}=d
  const h=new Date().getHours()
  const g=h<12?'Guten Morgen':h<18?'Guten Tag':'Guten Abend'
  const card:React.CSSProperties={background:'#fff',border:'1px solid #E5E7EB',borderRadius:12,padding:'20px 22px'}
  return (
    <div>
      <div style={{marginBottom:28}}>
        <h1 style={{fontFamily:'Georgia,serif',fontSize:28,fontWeight:600,color:'#111820',marginBottom:4}}>{g}, {s.user?.full_name?.split(' ')[0]}.</h1>
        <p style={{fontSize:14,color:'#6B7280'}}>{s.tenant?.name} · {new Date().toLocaleDateString('de-CH',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:24}}>
        {[
          {v:`${stats.compliance_rate}%`,l:'Compliance-Rate',s:'↑ 3% diesen Monat',c:'#14613E'},
          {v:stats.total_users,l:'Mitarbeitende',s:`${stats.active_users} aktiv`,c:'#111820'},
          {v:stats.certificates_issued,l:'Zertifikate',s:'Open Badge 3.0',c:'#B8904A'},
          {v:stats.overdue_count,l:'Überfällig',s:'Erinnerung gesendet',c:'#DC2626'},
        ].map(k=>(
          <div key={k.l} style={card}>
            <div style={{fontFamily:'Georgia,serif',fontSize:36,fontWeight:600,color:k.c,lineHeight:1}}>{k.v}</div>
            <div style={{fontFamily:'monospace',fontSize:10,letterSpacing:'.08em',textTransform:'uppercase' as const,color:'#9CA3AF',marginTop:6}}>{k.l}</div>
            <div style={{fontSize:12,color:'#6B7280',marginTop:4}}>{k.s}</div>
          </div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:16}}>
        <div style={card}>
          <div style={{fontFamily:'monospace',fontSize:10,letterSpacing:'.08em',textTransform:'uppercase' as const,color:'#9CA3AF',marginBottom:16}}>Pflichtschulungen</div>
          {COURSES.map(c=>(
            <div key={c.name} style={{marginBottom:16}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                <span style={{fontSize:13,fontWeight:500}}>{c.emoji} {c.name} <span style={{color:'#9CA3AF',fontSize:11,fontWeight:400}}>— {c.reg}</span></span>
                <span style={{fontFamily:'monospace',fontSize:12,fontWeight:600,color:c.color}}>{c.pct}%</span>
              </div>
              <div style={{height:4,background:'#F3F4F6',borderRadius:2}}><div style={{width:`${c.pct}%`,height:'100%',background:c.color,borderRadius:2}}/></div>
            </div>
          ))}
        </div>
        <div style={card}>
          <div style={{fontFamily:'monospace',fontSize:10,letterSpacing:'.08em',textTransform:'uppercase' as const,color:'#9CA3AF',marginBottom:16}}>Letzte Aktivitäten</div>
          {activity.slice(0,5).map((a:any,i:number)=>(
            <div key={i} style={{display:'flex',gap:10,marginBottom:14,alignItems:'flex-start'}}>
              <div style={{width:8,height:8,borderRadius:'50%',background:a.type==='completion'?'#14613E':a.type==='overdue'?'#DC2626':'#B8904A',marginTop:4,flexShrink:0}}/>
              <div>
                <div style={{fontSize:12,color:'#111820',lineHeight:1.4}}><strong>{a.user_name}</strong> — {a.description}</div>
                <div style={{fontFamily:'monospace',fontSize:10,color:'#9CA3AF',marginTop:2}}>{a.time_ago}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
