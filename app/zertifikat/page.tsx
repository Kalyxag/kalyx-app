// Ziel-Pfad im Repo: app/zertifikat/page.tsx  (NEU)
//
// Druckbare Zertifikatsansicht. Aufruf: /zertifikat?nr=<cert_number>
// Eigenständig (ohne Seitenleiste) für sauberen Druck/PDF.
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { WASSERZEICHEN_AKTIV, WASSERZEICHEN_DECKKRAFT } from '@/lib/badges/design-config'

const NAVY='#0B1929', GREEN='var(--kx-brand,#14613E)', GOLD='#B8904A', CREAM='#F5F4EF', LINE='#E4E0D8', GRAY='#6B7280'
const FH="'Cormorant', Georgia, serif"; const FB="'Albert Sans', system-ui, sans-serif"; const FM="'IBM Plex Mono', ui-monospace, monospace"

type Cert={cert_number:string;title:string;recipient_name:string|null;score:number|null;status:string;issued_at:string;content_hash?:string|null;course_type?:string|null;course_level?:string|null}
const TYP_LABEL:Record<string,string>={pflicht:'Compliance-Pflichtschulung',vorbereitung:'Vorbereitungskurs',weiterbildung:'Weiterbildung'}
const NIV_LABEL:Record<string,string>={grundlagen:'Grundlagen',aufbau:'Aufbau',vertiefung:'Vertiefung',experte:'Experte'}

export default function ZertifikatPage(){
  const [cert,setCert]=useState<Cert|null>(null)
  const [loading,setLoading]=useState(true)
  const [err,setErr]=useState('')

  useEffect(()=>{
    if(typeof document!=='undefined' && !document.getElementById('kalyx-fonts')){
      const l=document.createElement('link');l.id='kalyx-fonts';l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Cormorant:wght@500;600;700&family=Albert+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap';document.head.appendChild(l)
    }
    if(typeof document!=='undefined' && !document.getElementById('kalyx-print')){
      const s=document.createElement('style');s.id='kalyx-print';s.textContent='@media print{.kx-noprint{display:none!important}body{background:#fff!important}}';document.head.appendChild(s)
    }
    let on=true;(async()=>{
      const nr=new URLSearchParams(window.location.search).get('nr')||''
      if(!nr){setErr('Keine Zertifikatsnummer angegeben.');setLoading(false);return}
      const {data:sess}=await supabase.auth.getSession()
      if(!sess.session){window.location.href='/anmelden';return}
      const {data}=await supabase.from('certificates').select('cert_number,title,recipient_name,score,status,issued_at,content_hash,course_type,course_level').eq('cert_number',nr).maybeSingle()
      if(!on)return
      if(!data){setErr('Zertifikat nicht gefunden.')}else setCert(data as Cert)
      setLoading(false)
    })();return()=>{on=false}
  },[])

  const fmtDate=(s:string)=>{try{return new Date(s).toLocaleDateString('de-CH',{day:'numeric',month:'long',year:'numeric'})}catch{return s}}
  const wrap:React.CSSProperties={minHeight:'100vh',background:CREAM,fontFamily:FB,padding:'30px 16px',display:'flex',flexDirection:'column',alignItems:'center'}

  if(loading) return <div style={wrap}><p style={{color:GRAY,marginTop:40}}>Lade Zertifikat …</p></div>
  if(err||!cert) return <div style={wrap}><p style={{color:GRAY,marginTop:40}}>{err||'Nicht gefunden.'}</p><a href="/nachweise" style={{color:GREEN}}>Zurück zu den Nachweisen</a></div>

  return(<div style={wrap}>
    <div style={{maxWidth:820,width:'100%'}}>
      <div className="kx-noprint" style={{display:'flex',justifyContent:'space-between',marginBottom:14}}>
        <a href="/nachweise" style={{fontFamily:FB,fontSize:13.5,color:GREEN,textDecoration:'none'}}>← Nachweise</a>
        <button onClick={()=>window.print()} style={{fontFamily:FB,fontSize:13.5,fontWeight:600,color:'#fff',background:GREEN,border:'none',borderRadius:9,padding:'9px 18px',cursor:'pointer'}}>Drucken / als PDF speichern</button>
      </div>

      {/* Urkunde */}
      <div style={{background:'#fff',border:`1px solid ${LINE}`,borderRadius:6,padding:'56px 60px',boxShadow:'0 10px 40px rgba(0,0,0,.08)',position:'relative',overflow:'hidden'}}>
        {/* Wasserzeichen: Linien-Variante des Badge-Designs, dezent hinter dem
            Inhalt; druckt mit (kein kx-noprint). Konfiguration: lib/badges/design-config.ts */}
        {WASSERZEICHEN_AKTIV && cert.status==='gueltig' && (
          <img src={'/api/badge/image?nr='+encodeURIComponent(cert.cert_number)+'&variante=wasserzeichen'} alt=""
            aria-hidden="true"
            style={{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)',width:'min(420px, 78%)',opacity:WASSERZEICHEN_DECKKRAFT,pointerEvents:'none',userSelect:'none'}}/>
        )}
        <div style={{position:'absolute',inset:14,border:`2px solid ${GOLD}`,borderRadius:4,pointerEvents:'none',opacity:.5}}/>
        <div style={{position:'relative',textAlign:'center'}}>
          <div style={{fontFamily:FH,fontWeight:700,fontSize:30,color:NAVY,letterSpacing:'.14em'}}>KALYX</div>
          <div style={{fontFamily:FM,fontSize:11,letterSpacing:'.28em',color:GOLD,textTransform:'uppercase',marginTop:6}}>Abschlusszertifikat</div>
          <div style={{width:60,height:2,background:GOLD,margin:'22px auto'}}/>
          <div style={{fontFamily:FB,fontSize:14,color:GRAY}}>Hiermit wird bestätigt, dass</div>
          <div style={{fontFamily:FH,fontSize:30,fontWeight:600,color:NAVY,margin:'10px 0'}}>{cert.recipient_name||'—'}</div>
          <div style={{fontFamily:FB,fontSize:14,color:GRAY}}>den folgenden Kurs erfolgreich absolviert und die Prüfung bestanden hat:</div>
          <div style={{fontFamily:FH,fontSize:24,fontWeight:600,color:GREEN,margin:'12px 0 4px'}}>{cert.title}</div>
          {(cert.course_type||cert.course_level) && (
            <div style={{display:'flex',gap:8,justifyContent:'center',flexWrap:'wrap',margin:'8px 0 2px'}}>
              {cert.course_type && <span style={{fontFamily:FM,fontSize:10.5,letterSpacing:'.04em',color:NAVY,background:CREAM,border:`1px solid ${GOLD}`,borderRadius:20,padding:'3px 11px'}}>{TYP_LABEL[cert.course_type]||cert.course_type}</span>}
              {cert.course_level && <span style={{fontFamily:FM,fontSize:10.5,letterSpacing:'.04em',color:'#fff',background:GREEN,borderRadius:20,padding:'3px 11px'}}>Niveau: {NIV_LABEL[cert.course_level]||cert.course_level}</span>}
            </div>
          )}
          {cert.score!=null && <div style={{fontFamily:FM,fontSize:13,color:GRAY}}>Ergebnis: {Math.round(cert.score)}%</div>}

          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginTop:46,gap:20}}>
            <div style={{textAlign:'left'}}>
              <div style={{fontFamily:FM,fontSize:10.5,color:GRAY,letterSpacing:'.06em'}}>AUSGESTELLT</div>
              <div style={{fontFamily:FB,fontSize:14,color:NAVY}}>{fmtDate(cert.issued_at)}</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontFamily:FM,fontSize:10.5,color:GRAY,letterSpacing:'.06em'}}>ZERTIFIKATSNUMMER</div>
              <div style={{fontFamily:FM,fontSize:13,color:NAVY}}>{cert.cert_number}</div>
            </div>
          </div>
        </div>
      </div>

      <p style={{fontFamily:FB,fontSize:12,color:GRAY,textAlign:'center',marginTop:18,lineHeight:1.6}}>
        KALYX-Abschlusszertifikat über einen auf der Plattform absolvierten Kurs samt bestandener Prüfung.
        Dies ist kein offizieller Branchenabschluss. Echtheit prüfbar über die Zertifikatsnummer.<br/>
        Pilotbetrieb · Daten in der EU gespeichert.
      </p>

      {cert.status==='gueltig' && (
        <div className="kx-noprint" style={{background:'#fff',border:`1px solid ${LINE}`,borderRadius:14,padding:'18px 20px',marginTop:14,display:'flex',gap:16,alignItems:'center',flexWrap:'wrap'}}>
          <img src={'/api/badge/image?nr='+encodeURIComponent(cert.cert_number)} alt="Open Badge" width={84} height={84} style={{flexShrink:0}}/>
          <div style={{flex:1,minWidth:220}}>
            <div style={{fontFamily:FB,fontSize:14.5,fontWeight:700,color:NAVY}}>Open Badge</div>
            <div style={{fontFamily:FB,fontSize:12.5,color:GRAY,lineHeight:1.55,marginTop:3}}>
              Dieser Nachweis ist auch im internationalen Open-Badges-Standard (v2) verfügbar — portabel
              und von jedem Open-Badge-Prüfdienst verifizierbar. Die Badge-Datei trägt ihren
              Echtheitsnachweis in sich; persönliche Daten erscheinen darin nur geschützt (gehasht).
            </div>
            <div style={{display:'flex',gap:14,marginTop:9,flexWrap:'wrap'}}>
              <a href={'/api/badge/image?nr='+encodeURIComponent(cert.cert_number)+'&download=1'} style={{fontFamily:FB,fontSize:13,fontWeight:600,color:GREEN}}>Badge herunterladen (SVG)</a>
              <a href={'/api/badge/assertion?nr='+encodeURIComponent(cert.cert_number)} target="_blank" rel="noreferrer" style={{fontFamily:FB,fontSize:13,fontWeight:600,color:GREEN}}>Prüfdaten ansehen (JSON)</a>
            </div>
          </div>
        </div>
      )}

      {cert.status==='gueltig' && cert.content_hash && (
        <div className="kx-noprint" style={{background:'#fff',border:`1px solid ${LINE}`,borderRadius:14,padding:'18px 20px',marginTop:14}}>
          <div style={{display:'flex',gap:12,alignItems:'center'}}>
            <span style={{fontSize:20}}>🛡️</span>
            <div style={{fontFamily:FB,fontSize:14.5,fontWeight:700,color:NAVY}}>Geprüfter Schulungsinhalt</div>
          </div>
          <div style={{fontFamily:FB,fontSize:12.5,color:GRAY,lineHeight:1.55,marginTop:8}}>
            Dieses Zertifikat verweist nicht nur auf den Kurstitel, sondern auf die exakte, unveränderliche
            Fassung des Kurses, auf die geprüft wurde — Lernziele, Module, Niveau und Art. Diese Fassung wurde
            beim ersten Abschluss eingefroren und revisionssicher protokolliert. Spätere Änderungen am Kurs
            betreffen dieses Zertifikat nicht.
          </div>
          <div style={{fontFamily:FM,fontSize:11,color:GRAY,marginTop:10,wordBreak:'break-all',background:CREAM,borderRadius:8,padding:'8px 10px'}}>
            Inhalts-Prüfsumme: {cert.content_hash}
          </div>
          <div style={{marginTop:10}}>
            <a href={'/verify?nr='+encodeURIComponent(cert.cert_number)} target="_blank" rel="noreferrer" style={{fontFamily:FB,fontSize:13,fontWeight:600,color:GREEN}}>Inhalt öffentlich ansehen und prüfen →</a>
          </div>
        </div>
      )}
    </div>
  </div>)
}
