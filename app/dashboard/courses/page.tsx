'use client'
import {useEffect,useState} from 'react'
import {auth} from '@/lib/auth'

const COURSES=[
  {id:'c1',emoji:'⚖️',title:'Geldwäscherei-Prävention (GwG 2025)',reg:'FINMA · GwG · AML',mins:45,pct:88,color:'#14613E',bg:'#E6F0EB',tags:['FINMA','GwG Art. 3–9','FATF/GAFI','AML']},
  {id:'c2',emoji:'🔒',title:'Datenschutz DSGVO & DSG 2025',reg:'DSGVO · DSG 2023',mins:30,pct:94,color:'#3A6DB5',bg:'#EAF0FA',tags:['DSGVO Art. 5','DSG 2023','Betroffenenrechte']},
  {id:'c3',emoji:'🛡️',title:'Informationssicherheit & Cyberrisiken',reg:'ISO 27001 · NIST',mins:35,pct:72,color:'#B8904A',bg:'#F8F1E4',tags:['ISO 27001','CIA-Triad','Zero Trust','Phishing']},
]

export default function CoursesPage() {
  const [s,setS]=useState<any>(null)
  useEffect(()=>{setS(auth.getSession())},[])
  if(!s)return null
  return (
    <div>
      <h1 style={{fontFamily:'Georgia,serif',fontSize:26,fontWeight:600,marginBottom:6,color:'#111820'}}>Pflichtschulungen</h1>
      <p style={{fontSize:14,color:'#6B7280',marginBottom:28}}>KI-generierte Kurse · Open Badge 3.0 Zertifikate · FINMA-konformer Audit-Trail</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
        {COURSES.map(c=>(
          <div key={c.id} style={{background:'#fff',border:'1px solid #E5E7EB',borderRadius:14,overflow:'hidden'}}>
            <div style={{background:c.bg,padding:'24px 22px',display:'flex',gap:14,alignItems:'center'}}>
              <span style={{fontSize:36}}>{c.emoji}</span>
              <div>
                <div style={{fontFamily:'monospace',fontSize:9,color:c.color,textTransform:'uppercase' as const,letterSpacing:'.08em',marginBottom:4}}>{c.reg}</div>
                <div style={{fontFamily:'Georgia,serif',fontSize:15,fontWeight:600,color:'#111820',lineHeight:1.3}}>{c.title}</div>
              </div>
            </div>
            <div style={{padding:'18px 22px'}}>
              <div style={{display:'flex',gap:8,flexWrap:'wrap' as const,marginBottom:14}}>
                {[`${c.mins} Min.`,'10 Fragen','Jährlich'].map(t=>(
                  <span key={t} style={{fontFamily:'monospace',fontSize:10,background:'#F9FAFB',border:'1px solid #E5E7EB',borderRadius:4,padding:'3px 8px',color:'#6B7280'}}>{t}</span>
                ))}
              </div>
              <div style={{marginBottom:14}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:5}}>
                  <span style={{color:'#6B7280'}}>Team-Abschlüsse</span>
                  <span style={{fontFamily:'monospace',fontWeight:600,color:c.color}}>{c.pct}%</span>
                </div>
                <div style={{height:5,background:'#F3F4F6',borderRadius:3}}><div style={{width:`${c.pct}%`,height:'100%',background:c.color,borderRadius:3}}/></div>
              </div>
              <div style={{display:'flex',flexWrap:'wrap' as const,gap:4,marginBottom:16}}>
                {c.tags.map(t=><span key={t} style={{fontFamily:'monospace',fontSize:9,background:'#F3F4F6',borderRadius:3,padding:'2px 7px',color:'#9CA3AF'}}>{t}</span>)}
              </div>
              <button style={{width:'100%',background:c.color,color:'#fff',border:'none',borderRadius:8,padding:'10px',fontSize:13,fontWeight:600,cursor:'pointer'}}>Kurs starten →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
