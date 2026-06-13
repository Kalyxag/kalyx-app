// Ziel-Pfad im Repo: app/zertifikat/page.tsx  (NEU)
//
// Druckbare Zertifikatsansicht. Aufruf: /zertifikat?nr=<cert_number>
// Eigenständig (ohne Seitenleiste) für sauberen Druck/PDF.
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { WASSERZEICHEN_AKTIV, WASSERZEICHEN_DECKKRAFT } from '@/lib/badges/design-config'
import { effektiverStatus, STATUS_LABEL, tageBisAblauf } from '@/lib/certs/status'
import { buildBrandView, KALYX_SEAL_TEXT, KALYX_SEAL_SUB, type BrandView } from '@/lib/design/cobrand'

const NAVY='#0B1929', GREEN='var(--kx-brand,#14613E)', GOLD='#B8904A', CREAM='#F5F4EF', LINE='#E4E0D8', GRAY='#6B7280'
const FH="'Cormorant', Georgia, serif"; const FB="'Albert Sans', system-ui, sans-serif"; const FM="'IBM Plex Mono', ui-monospace, monospace"

type Cert={cert_number:string;title:string;recipient_name:string|null;score:number|null;status:string;issued_at:string;content_hash?:string|null;course_type?:string|null;course_level?:string|null;expires_at?:string|null;recert_interval?:string|null}
const TYP_LABEL:Record<string,string>={pflicht:'Compliance-Pflichtschulung',vorbereitung:'Vorbereitungskurs',weiterbildung:'Weiterbildung'}
const NIV_LABEL:Record<string,string>={grundlagen:'Grundlagen',aufbau:'Aufbau',vertiefung:'Vertiefung',experte:'Experte'}

export default function ZertifikatPage(){
  const [cert,setCert]=useState<Cert|null>(null)
  const [brand,setBrand]=useState<BrandView|null>(null)
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
      const {data}=await supabase.from('certificates').select('cert_number,title,recipient_name,score,status,issued_at,content_hash,course_type,course_level,expires_at,recert_interval,tenant_id').eq('cert_number',nr).maybeSingle()
      if(!on)return
      if(!data){setErr('Zertifikat nicht gefunden.')}else{
        setCert(data as Cert)
        // Co-Branding laden: Branding-Zeile + ob white_label-Add-on aktiv ist.
        const tid=(data as any).tenant_id
        if(tid){
          try{
            const [{data:br},{data:ten}]=await Promise.all([
              supabase.from('branding').select('*').eq('tenant_id',tid).maybeSingle(),
              supabase.from('tenants').select('addons').eq('id',tid).maybeSingle(),
            ])
            const addons=((ten as any)?.addons)||[]
            const hasWL=Array.isArray(addons)&&addons.includes('white_label')
            setBrand(buildBrandView(br as any,hasWL))
          }catch{ setBrand(buildBrandView(null,false)) }
        }
      }
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

      {(()=>{
        const eff=effektiverStatus({status:cert.status,expires_at:cert.expires_at})
        if(eff==='gueltig' && !cert.expires_at) return null
        const tage=tageBisAblauf(cert.expires_at)
        const farbe = eff==='abgelaufen'||eff==='widerrufen' ? {bg:'#FBEAEA',bd:'#E7C9C9',fg:'#9B2C2C'} : eff==='laeuft_bald_ab' ? {bg:'#FBF3E2',bd:'#E9D9B5',fg:'#8A6D1E'} : {bg:'var(--kx-brand-pale,#E6F0EB)',bd:GREEN,fg:GREEN}
        const text = eff==='abgelaufen' ? `Dieser Nachweis ist abgelaufen und erfordert eine Rezertifizierung${cert.expires_at?' (seit '+fmtDate(cert.expires_at)+')':''}.`
          : eff==='widerrufen' ? 'Dieser Nachweis wurde widerrufen.'
          : eff==='laeuft_bald_ab' ? `Dieser Nachweis läuft bald ab${cert.expires_at?' am '+fmtDate(cert.expires_at):''}${tage!=null?' (in '+tage+' Tagen)':''}.`
          : `Gültig bis ${cert.expires_at?fmtDate(cert.expires_at):'—'}.`
        return <div className="kx-noprint" style={{background:farbe.bg,border:`1px solid ${farbe.bd}`,borderRadius:12,padding:'12px 16px',marginBottom:14,display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontFamily:FM,fontSize:10.5,fontWeight:700,letterSpacing:'.06em',color:'#fff',background:farbe.fg,borderRadius:6,padding:'3px 9px',textTransform:'uppercase'}}>{STATUS_LABEL[eff]}</span>
          <span style={{fontFamily:FB,fontSize:13,color:farbe.fg}}>{text}</span>
        </div>
      })()}

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
          {brand && brand.brandName ? (
            <>
              {brand.logoFor('light') && (
                <img src={brand.logoFor('light')!} alt={brand.brandName} style={{maxHeight:54,maxWidth:240,objectFit:'contain',margin:'0 auto 10px',display:'block'}}/>
              )}
              <div style={{fontFamily:FH,fontWeight:700,fontSize:28,color:NAVY,letterSpacing:'.04em'}}>{brand.brandName}</div>
              <div style={{fontFamily:FM,fontSize:11,letterSpacing:'.28em',color:GOLD,textTransform:'uppercase',marginTop:6}}>Abschlusszertifikat</div>
            </>
          ) : (
            <>
              <div style={{fontFamily:FH,fontWeight:700,fontSize:30,color:NAVY,letterSpacing:'.14em'}}>KALYX</div>
              <div style={{fontFamily:FM,fontSize:11,letterSpacing:'.28em',color:GOLD,textTransform:'uppercase',marginTop:6}}>Abschlusszertifikat</div>
            </>
          )}
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
              {cert.expires_at && <><div style={{fontFamily:FM,fontSize:10.5,color:GRAY,letterSpacing:'.06em',marginTop:8}}>GÜLTIG BIS</div><div style={{fontFamily:FB,fontSize:14,color:NAVY}}>{fmtDate(cert.expires_at)}</div></>}
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontFamily:FM,fontSize:10.5,color:GRAY,letterSpacing:'.06em'}}>ZERTIFIKATSNUMMER</div>
              <div style={{fontFamily:FM,fontSize:13,color:NAVY}}>{cert.cert_number}</div>
            </div>
          </div>

          {(
            <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginTop:30,paddingTop:16,borderTop:`1px solid ${LINE}`}}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.6" aria-hidden="true">
                <path d="M12 22V12"/><path d="M12 12C12 7 7 4 3 6c4 1 7 5 9 6z"/><path d="M12 12c0-5 5-8 9-6-4 1-7 5-9 6z"/>
              </svg>
              <div style={{textAlign:'left'}}>
                <div style={{fontFamily:FM,fontSize:9.5,letterSpacing:'.14em',color:NAVY,textTransform:'uppercase'}}>{KALYX_SEAL_TEXT}</div>
                <div style={{fontFamily:FB,fontSize:9,color:GRAY}}>{KALYX_SEAL_SUB} · kalyx.academy/verify</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <p style={{fontFamily:FB,fontSize:12,color:GRAY,textAlign:'center',marginTop:18,lineHeight:1.6}}>
        {brand && brand.brandName
          ? <>Abschlusszertifikat von {brand.brandName} über einen absolvierten Kurs samt bestandener Prüfung. Kein offizieller Branchenabschluss. Echtheit fälschungssicher über KALYX prüfbar.<br/>Daten in der EU gespeichert.</>
          : <>KALYX-Abschlusszertifikat über einen auf der Plattform absolvierten Kurs samt bestandener Prüfung. Dies ist kein offizieller Branchenabschluss. Echtheit prüfbar über die Zertifikatsnummer.<br/>Pilotbetrieb · Daten in der EU gespeichert.</>}
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
