'use client'
import {useEffect,useState} from 'react'
import {auth} from '@/lib/auth'

export default function CompliancePage() {
  const [d,setD]=useState<any>(null)
  useEffect(()=>{const s=auth.getSession();if(s)setD(auth.getData(s.tenantSlug))},[])
  if(!d)return null
  const {stats,users}=d
  return (
    <div>
      <h1 style={{fontFamily:'Georgia,serif',fontSize:26,fontWeight:600,marginBottom:6,color:'#111820'}}>Compliance-Übersicht</h1>
      <p style={{fontSize:14,color:'#6B7280',marginBottom:28}}>FINMA-konformes Audit-Trail · unveränderlich · append-only</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:24}}>
        {[
          {v:`${stats.compliance_rate}%`,l:'Compliance-Rate',c:stats.compliance_rate>=90?'#14613E':stats.compliance_rate>=70?'#B8904A':'#DC2626'},
          {v:stats.total_completions,l:'Abgeschlossen',c:'#14613E'},
          {v:stats.overdue_count,l:'Überfällig',c:'#DC2626'},
        ].map(k=>(
          <div key={k.l} style={{background:'#fff',border:'1px solid #E5E7EB',borderRadius:12,padding:'20px 22px'}}>
            <div style={{fontFamily:'Georgia,serif',fontSize:36,fontWeight:600,color:k.c}}>{k.v}</div>
            <div style={{fontFamily:'monospace',fontSize:10,letterSpacing:'.08em',textTransform:'uppercase' as const,color:'#9CA3AF',marginTop:6}}>{k.l}</div>
          </div>
        ))}
      </div>
      <div style={{background:'#fff',border:'1px solid #E5E7EB',borderRadius:12,overflow:'hidden'}}>
        <div style={{padding:'14px 20px',borderBottom:'1px solid #F3F4F6',fontFamily:'monospace',fontSize:10,letterSpacing:'.08em',textTransform:'uppercase' as const,color:'#9CA3AF'}}>Mitarbeitende — Compliance-Status</div>
        {users.map((u:any)=>(
          <div key={u.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 20px',borderBottom:'1px solid #F9FAFB'}}>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:34,height:34,borderRadius:'50%',background:'#E6F0EB',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'#14613E'}}>
                {u.full_name.split(' ').map((n:string)=>n[0]).join('')}
              </div>
              <div>
                <div style={{fontSize:13,fontWeight:500,color:'#111820'}}>{u.full_name}</div>
                <div style={{fontSize:11,color:'#9CA3AF'}}>{u.department}</div>
              </div>
            </div>
            <span style={{fontFamily:'monospace',fontSize:10,background:'#E6F0EB',color:'#14613E',borderRadius:20,padding:'3px 10px'}}>{u.role}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
