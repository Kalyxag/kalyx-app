'use client'
import {useEffect,useState} from 'react'
import {auth} from '@/lib/auth'

export default function UsersPage() {
  const [d,setD]=useState<any>(null)
  useEffect(()=>{const s=auth.getSession();if(s)setD(auth.getData(s.tenantSlug))},[])
  if(!d)return null
  const {users,stats}=d
  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28}}>
        <div>
          <h1 style={{fontFamily:'Georgia,serif',fontSize:26,fontWeight:600,marginBottom:4,color:'#111820'}}>Mitarbeitende</h1>
          <p style={{fontSize:14,color:'#6B7280'}}>{stats.total_users} Personen · {stats.active_users} aktiv</p>
        </div>
        <button style={{background:'var(--kx-brand,#14613E)',color:'#fff',border:'none',borderRadius:8,padding:'10px 18px',fontSize:13,fontWeight:600,cursor:'pointer'}}>+ Einladen</button>
      </div>
      <div style={{background:'#fff',border:'1px solid #E5E7EB',borderRadius:12,overflow:'hidden'}}>
        <div style={{display:'grid',gridTemplateColumns:'2fr 1.5fr 1fr 1fr',padding:'12px 20px',borderBottom:'1px solid #F3F4F6',fontFamily:'monospace',fontSize:10,letterSpacing:'.08em',textTransform:'uppercase' as const,color:'#9CA3AF'}}>
          <span>Name</span><span>Position</span><span>Rolle</span><span>Letzter Login</span>
        </div>
        {users.map((u:any)=>(
          <div key={u.id} style={{display:'grid',gridTemplateColumns:'2fr 1.5fr 1fr 1fr',padding:'14px 20px',borderBottom:'1px solid #F9FAFB',alignItems:'center'}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:32,height:32,borderRadius:'50%',background:'var(--kx-brand-pale,#E6F0EB)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'var(--kx-brand,#14613E)',flexShrink:0}}>
                {u.full_name.split(' ').map((n:string)=>n[0]).join('')}
              </div>
              <div>
                <div style={{fontSize:13,fontWeight:500,color:'#111820'}}>{u.full_name}</div>
                <div style={{fontSize:11,color:'#9CA3AF'}}>{u.email}</div>
              </div>
            </div>
            <div>
              <div style={{fontSize:12,color:'#374151'}}>{u.position}</div>
              <div style={{fontSize:11,color:'#9CA3AF'}}>{u.department}</div>
            </div>
            <span style={{fontFamily:'monospace',fontSize:10,background:'#F3F4F6',borderRadius:4,padding:'3px 8px',color:'#6B7280'}}>{u.role.replace('_',' ')}</span>
            <div style={{fontFamily:'monospace',fontSize:11,color:'#9CA3AF'}}>{u.last_login_at?new Date(u.last_login_at).toLocaleDateString('de-CH'):'—'}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
