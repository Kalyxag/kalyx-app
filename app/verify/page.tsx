// Ziel-Pfad im Repo: app/verify/page.tsx  (NEU)
//
// Öffentliche, anmeldefreie Zertifikatsprüfung. Zeigt Gültigkeit,
// Niveau/Art und den eingefrorenen Schulungsinhalt (Lernziele, Module).
// Prüfungsfragen werden NICHT angezeigt. Liest über /api/verify.
'use client'

import { useEffect, useState } from 'react'

const NAVY='#0B1929', GREEN='#14613E', GOLD='#B8904A', CREAM='#F5F4EF', LINE='#E4E0D8', GRAY='#6B7280'
const FH="'Cormorant', Georgia, serif", FB="'Albert Sans', system-ui, sans-serif", FM="'IBM Plex Mono', ui-monospace, monospace"

type Modul={title:string;duration?:string;keypoints?:string[]}
type Inhalt={title:string;course_type:string;course_level:string;passing_score:number|null;learning_objectives:string[];modules:Modul[];module_count:number;question_count:number;content_hash:string;eingefroren_am:string}
type Result={valid:boolean;cert_number?:string;title?:string;recipient_name?:string|null;issued_at?:string;art?:string;niveau?:string;inhalt?:Inhalt|null;note?:string}

export default function VerifyPage(){
  const [nr,setNr]=useState('')
  const [res,setRes]=useState<Result|null>(null)
  const [loading,setLoading]=useState(false)
  const [done,setDone]=useState(false)

  useEffect(()=>{
    if(typeof document!=='undefined' && !document.getElementById('kalyx-fonts')){
      const l=document.createElement('link');l.id='kalyx-fonts';l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Cormorant:wght@500;600;700&family=Albert+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap';document.head.appendChild(l)
    }
    const q=new URLSearchParams(window.location.search).get('nr')||''
    if(q){setNr(q);pruefe(q)}
  },[])

  async function pruefe(nummer?:string){
    const n=(nummer??nr).trim()
    if(!n)return
    setLoading(true);setDone(false)
    try{
      const r=await fetch('/api/verify?nr='+encodeURIComponent(n))
      setRes(await r.json())
    }catch{setRes({valid:false})}
    setLoading(false);setDone(true)
  }

  const fmt=(s?:string)=>{if(!s)return '';try{return new Date(s).toLocaleDateString('de-CH',{day:'numeric',month:'long',year:'numeric'})}catch{return s}}

  return(<div style={{minHeight:'100vh',background:CREAM,fontFamily:FB,color:NAVY}}>
    <div style={{maxWidth:760,margin:'0 auto',padding:'40px 20px 80px'}}>
      <div style={{textAlign:'center',marginBottom:8}}>
        <div style={{fontFamily:FH,fontSize:30,fontWeight:700,letterSpacing:4,color:NAVY}}>KALYX</div>
        <div style={{fontFamily:FM,fontSize:10,letterSpacing:3,color:GOLD,marginTop:2}}>NACHWEIS-PRÜFUNG</div>
      </div>
      <p style={{textAlign:'center',fontSize:13.5,color:GRAY,maxWidth:520,margin:'10px auto 24px',lineHeight:1.5}}>
        Geben Sie die Zertifikatsnummer ein, um Echtheit und den geprüften Schulungsinhalt anzuzeigen.
      </p>

      <div style={{display:'flex',gap:8,justifyContent:'center',marginBottom:28,flexWrap:'wrap'}}>
        <input value={nr} onChange={e=>setNr(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')pruefe()}}
          placeholder="z. B. KX-2026-0418"
          style={{fontFamily:FM,fontSize:14,border:`1.5px solid ${LINE}`,borderRadius:10,padding:'11px 14px',minWidth:240,background:'#fff',color:NAVY}}/>
        <button onClick={()=>pruefe()} disabled={loading}
          style={{fontFamily:FB,fontSize:14,fontWeight:600,border:'none',background:GREEN,color:'#fff',borderRadius:10,padding:'11px 22px',cursor:'pointer'}}>
          {loading?'Prüfe …':'Prüfen'}
        </button>
      </div>

      {done && res && !res.valid && (
        <div style={{background:'#fff',border:`1px solid #E7C9C9`,borderRadius:14,padding:'26px',textAlign:'center'}}>
          <div style={{fontSize:30}}>⚠️</div>
          <div style={{fontFamily:FB,fontSize:17,fontWeight:700,color:'#9B2C2C',marginTop:6}}>Kein gültiges Zertifikat gefunden</div>
          <div style={{fontSize:13,color:GRAY,marginTop:6}}>Zur Nummer {res.cert_number||nr} liegt kein gültiger Nachweis vor. Bitte prüfen Sie die Schreibweise.</div>
        </div>
      )}

      {done && res && res.valid && (
        <div style={{background:'#fff',border:`1px solid ${LINE}`,borderRadius:16,overflow:'hidden'}}>
          <div style={{background:GREEN,padding:'20px 24px',color:'#fff',display:'flex',alignItems:'center',gap:14}}>
            <div style={{width:44,height:44,borderRadius:'50%',background:'rgba(255,255,255,.18)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>✓</div>
            <div>
              <div style={{fontFamily:FB,fontSize:18,fontWeight:700}}>Gültiger Nachweis</div>
              <div style={{fontFamily:FM,fontSize:12,opacity:.9}}>{res.cert_number}</div>
            </div>
          </div>
          <div style={{padding:'22px 24px'}}>
            <div style={{fontFamily:FH,fontSize:23,fontWeight:600,color:NAVY}}>{res.title}</div>
            <div style={{display:'flex',gap:8,flexWrap:'wrap',margin:'10px 0 4px'}}>
              {res.art && <span style={{fontFamily:FM,fontSize:10.5,color:NAVY,background:CREAM,border:`1px solid ${GOLD}`,borderRadius:20,padding:'3px 11px'}}>{res.art}</span>}
              {res.niveau && res.niveau!=='—' && <span style={{fontFamily:FM,fontSize:10.5,color:'#fff',background:GREEN,borderRadius:20,padding:'3px 11px'}}>Niveau: {res.niveau}</span>}
            </div>
            <div style={{fontSize:13,color:GRAY,marginTop:8}}>
              {res.recipient_name?<>Ausgestellt auf <b style={{color:NAVY}}>{res.recipient_name}</b> · </>:null}
              {fmt(res.issued_at)}
            </div>

            {res.inhalt ? (
              <div style={{marginTop:22,borderTop:`1px solid ${LINE}`,paddingTop:18}}>
                <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:4}}>
                  <span style={{fontSize:17}}>🛡️</span>
                  <div style={{fontFamily:FB,fontSize:15,fontWeight:700,color:NAVY}}>Geprüfter Schulungsinhalt</div>
                </div>
                <div style={{fontSize:12.5,color:GRAY,lineHeight:1.5,marginBottom:16}}>
                  Diese Fassung wurde beim ersten Abschluss eingefroren und revisionssicher protokolliert.
                  {res.inhalt.eingefroren_am?<> Eingefroren am {fmt(res.inhalt.eingefroren_am)}.</>:null}
                </div>

                {res.inhalt.learning_objectives?.length>0 && (
                  <div style={{marginBottom:18}}>
                    <div style={{fontFamily:FM,fontSize:10.5,letterSpacing:'.12em',color:GOLD,textTransform:'uppercase',marginBottom:8}}>Lernziele</div>
                    <ul style={{margin:0,paddingLeft:18}}>
                      {res.inhalt.learning_objectives.map((z,i)=>(
                        <li key={i} style={{fontSize:13.5,color:NAVY,lineHeight:1.5,marginBottom:4}}>{z}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div style={{fontFamily:FM,fontSize:10.5,letterSpacing:'.12em',color:GOLD,textTransform:'uppercase',marginBottom:8}}>Module ({res.inhalt.module_count})</div>
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  {res.inhalt.modules.map((m,i)=>(
                    <div key={i} style={{background:CREAM,borderRadius:10,padding:'11px 13px'}}>
                      <div style={{fontFamily:FB,fontSize:13.5,fontWeight:600,color:NAVY}}>{i+1}. {m.title}{m.duration?<span style={{color:GRAY,fontWeight:400}}> · {m.duration}</span>:null}</div>
                      {m.keypoints && m.keypoints.length>0 && (
                        <ul style={{margin:'6px 0 0',paddingLeft:18}}>
                          {m.keypoints.slice(0,4).map((k,j)=>(<li key={j} style={{fontSize:12,color:GRAY,lineHeight:1.45}}>{k}</li>))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{display:'flex',gap:18,flexWrap:'wrap',marginTop:16,fontSize:12.5,color:GRAY}}>
                  {res.inhalt.passing_score!=null && <span>Bestehensgrenze: <b style={{color:NAVY}}>{res.inhalt.passing_score}%</b></span>}
                  <span>Prüfungsfragen: <b style={{color:NAVY}}>{res.inhalt.question_count}</b> <span style={{color:GRAY}}>(aus Schutzgründen nicht öffentlich)</span></span>
                </div>
                <div style={{fontFamily:FM,fontSize:10.5,color:GRAY,marginTop:14,wordBreak:'break-all',background:CREAM,borderRadius:8,padding:'8px 10px'}}>
                  Inhalts-Prüfsumme (SHA-256): {res.inhalt.content_hash}
                </div>
              </div>
            ) : (
              <div style={{marginTop:18,fontSize:12.5,color:GRAY,fontStyle:'italic'}}>
                Für dieses Zertifikat liegt keine eingefrorene Inhaltsfassung vor (vor Einführung der Funktion ausgestellt).
              </div>
            )}

            <div style={{marginTop:20,borderTop:`1px solid ${LINE}`,paddingTop:14,fontSize:11.5,color:GRAY,lineHeight:1.5}}>
              {res.note} Daten in der EU gespeichert.
            </div>
          </div>
        </div>
      )}

      <div style={{textAlign:'center',marginTop:30,fontSize:11.5,color:GRAY}}>kalyx.academy · Wir schützen, was wächst.</div>
    </div>
  </div>)
}
