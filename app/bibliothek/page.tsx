// Ziel-Pfad im Repo: app/bibliothek/page.tsx  (ERSETZT)
//
// Kursbibliothek in der gemeinsamen App-Shell. Liest den Katalog mandantengeschützt
// (RLS): veröffentlichte globale Kurse + eigene. Anlegen schreibt echte Kurse in die DB.
// NEU: Filter und Anzeige nach Branche (sector) und Position.
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import AppShell from '../components/AppShell'
import CourseDisclaimer from '../components/CourseDisclaimer'
const CREAM='#F5F4EF', NAVY='#0B1929', GREEN='var(--kx-brand,#14613E)', GOLD='#B8904A'
const GREEN_PALE='var(--kx-brand-pale,#E6F0EB)', GOLD_PALE='#F8F1E4', BLUE='#3A6DB5', BLUE_PALE='#EAF0FA', LINE='#E4E0D8', GRAY='#6B7280'
const FH="'Cormorant', Georgia, serif"
const FB="'Albert Sans', system-ui, -apple-system, sans-serif"
const FM="'IBM Plex Mono', ui-monospace, monospace"

const TYPES=[{v:'compliance',l:'Compliance'},{v:'vorbereitung',l:'Vorbereitung'},{v:'fachkurs',l:'Fachkurs'},{v:'onboarding',l:'Onboarding'},{v:'sonstige',l:'Sonstige'}]
const LEVELS=[{v:'einsteiger',l:'Einsteiger'},{v:'fortgeschritten',l:'Fortgeschritten'},{v:'experte',l:'Experte'}]
const LANGS=[{v:'de',l:'Deutsch'},{v:'fr',l:'Französisch'},{v:'it',l:'Italienisch'},{v:'en',l:'Englisch'}]
const SECTORS=[{v:'finance',l:'Finance'},{v:'pharma',l:'Pharma & Life Sciences'},{v:'bildung',l:'Bildung & Verband'},{v:'retail',l:'Handel'},{v:'industrie',l:'Industrie'},{v:'sonstige',l:'Sonstige'}]
const tl=(arr:{v:string;l:string}[],v:string)=>arr.find(x=>x.v===v)?.l||v

type Course={id:string;tenant_id:string|null;title:string;description:string|null;category:string|null;sector:string|null;position:string|null;level:string;language:string;duration_min:number|null;course_type:string;cert_prep:boolean;external_cert:string|null;status:string;ai_generated:boolean}
type Module={id:string;position:number;title:string;content:string|null;module_type:string;duration_min:number|null}

export default function BibliothekPage(){
  const router=useRouter()
  const [loading,setLoading]=useState(true)
  const [tenantId,setTenantId]=useState('')
  const [uid,setUid]=useState('')
  const [courses,setCourses]=useState<Course[]>([])
  const [q,setQ]=useState(''); const [fType,setFType]=useState(''); const [fLevel,setFLevel]=useState('')
  const [fSector,setFSector]=useState(''); const [fPos,setFPos]=useState('')
  const [showForm,setShowForm]=useState(false)
  const [detail,setDetail]=useState<Course|null>(null)
  const [modules,setModules]=useState<Module[]>([]); const [modLoading,setModLoading]=useState(false)
  const [msg,setMsg]=useState('')

  const [cTitle,setCTitle]=useState(''); const [cDesc,setCDesc]=useState(''); const [cCat,setCCat]=useState('')
  const [cType,setCType]=useState('compliance'); const [cLevel,setCLevel]=useState('einsteiger'); const [cLang,setCLang]=useState('de')
  const [cDur,setCDur]=useState<number|''>(''); const [cCertPrep,setCCertPrep]=useState(false); const [cExtCert,setCExtCert]=useState('')
  const [cStatus,setCStatus]=useState('veroeffentlicht'); const [cSector,setCSector]=useState(''); const [cPos,setCPos]=useState(''); const [saving,setSaving]=useState(false)

  useEffect(()=>{let active=true;(async()=>{
    const {data}=await supabase.auth.getSession(); const session=data.session
    if(!session){router.replace('/anmelden');return}
    const {data:au}=await supabase.from('app_users').select('tenant_id').eq('id',session.user.id).maybeSingle()
    const tid=(au as any)?.tenant_id; if(!tid){router.replace('/anmelden');return}
    if(!active)return
    setTenantId(tid); setUid(session.user.id)
    await reload(); if(active) setLoading(false)
  })();return()=>{active=false}},[router])

  async function reload(){
    const {data}=await supabase.from('courses')
      .select('id,tenant_id,title,description,category,sector,position,level,language,duration_min,course_type,cert_prep,external_cert,status,ai_generated')
      .order('created_at',{ascending:false})
    setCourses((data as Course[])||[])
  }

  async function openDetail(c:Course){
    setDetail(c); setModules([]); setModLoading(true)
    const {data}=await supabase.from('course_modules').select('id,position,title,content,module_type,duration_min').eq('course_id',c.id).order('position')
    setModules((data as Module[])||[]); setModLoading(false)
  }

  async function createCourse(){
    if(!cTitle.trim()){setMsg('Bitte einen Titel angeben.');return}
    if(cCertPrep && !cExtCert.trim()){setMsg('Bitte angeben, worauf der Kurs vorbereitet (z. B. „Vorbereitung auf ISO 27001 Foundation").');return}
    setSaving(true); setMsg('')
    const {data,error}=await supabase.from('courses').insert({
      tenant_id:tenantId, title:cTitle.trim(), description:cDesc.trim()||null, category:cCat.trim()||null,
      sector: cSector||null, position: cPos.trim()||null,
      course_type:cType, level:cLevel, language:cLang, duration_min: cDur===''?null:Number(cDur),
      cert_prep:cCertPrep, external_cert: cCertPrep?cExtCert.trim():null, status:cStatus, ai_generated:false, created_by:uid,
    }).select('id').single()
    if(error){setSaving(false);setMsg('Anlegen fehlgeschlagen: '+error.message);return}
    await supabase.from('course_modules').insert({course_id:(data as any).id, tenant_id:tenantId, position:1, title:'Einführung', content:cDesc.trim()||'Inhalt folgt.', module_type:'lesson', duration_min:cDur===''?null:Number(cDur)})
    try{await supabase.from('audit_log').insert({tenant_id:tenantId,actor_id:uid,action:'course_created',entity:'courses',entity_id:(data as any).id})}catch{}
    setSaving(false); setShowForm(false)
    setCTitle('');setCDesc('');setCCat('');setCType('compliance');setCLevel('einsteiger');setCLang('de');setCDur('');setCCertPrep(false);setCExtCert('');setCStatus('veroeffentlicht');setCSector('');setCPos('')
    await reload()
  }

  // Positionen dynamisch aus dem Katalog (optional auf gewählte Branche eingegrenzt)
  const positions=useMemo(()=>{
    const set=new Set<string>()
    courses.forEach(c=>{ if(c.position && (!fSector || c.sector===fSector)) set.add(c.position) })
    return Array.from(set).sort((a,b)=>a.localeCompare(b))
  },[courses,fSector])

  const filtered=useMemo(()=>courses.filter(c=>{
    if(fType && c.course_type!==fType) return false
    if(fLevel && c.level!==fLevel) return false
    if(fSector && c.sector!==fSector) return false
    if(fPos && c.position!==fPos) return false
    if(q){const s=q.toLowerCase(); if(!(`${c.title} ${c.description||''} ${c.category||''} ${c.position||''}`.toLowerCase().includes(s))) return false}
    return true
  }),[courses,q,fType,fLevel,fSector,fPos])

  const card:React.CSSProperties={background:'#fff',borderRadius:16,padding:'20px 20px',border:`1px solid ${LINE}`,boxShadow:'0 1px 2px rgba(0,0,0,.03),0 10px 28px rgba(0,0,0,.05)'}
  const eyebrow:React.CSSProperties={fontFamily:FM,fontSize:11,letterSpacing:'.18em',textTransform:'uppercase',color:GOLD}
  const input:React.CSSProperties={width:'100%',fontFamily:FB,fontSize:14.5,color:NAVY,background:CREAM,border:`1.5px solid ${LINE}`,borderRadius:10,padding:'11px 13px',outline:'none'}
  const label:React.CSSProperties={display:'block',fontSize:12.5,fontWeight:600,color:NAVY,marginBottom:5}
  const btn:React.CSSProperties={fontFamily:FB,fontSize:14.5,fontWeight:600,color:'#fff',background:GREEN,border:'none',borderRadius:10,padding:'12px 20px',cursor:'pointer'}
  const btnGhost:React.CSSProperties={fontFamily:FB,fontSize:14,fontWeight:600,color:GREEN,background:'transparent',border:`1.5px solid ${GREEN}`,borderRadius:10,padding:'10px 16px',cursor:'pointer'}
  const pill=(bg:string,col:string):React.CSSProperties=>({fontFamily:FM,fontSize:10,letterSpacing:'.08em',textTransform:'uppercase',padding:'3px 9px',borderRadius:20,background:bg,color:col})

  return(<AppShell active="lernen">
    <div style={eyebrow}>Kursbibliothek</div>
    <h1 style={{fontFamily:FH,fontSize:32,fontWeight:600,color:NAVY,margin:'4px 0 14px'}}>Kurse entdecken</h1>

    {/* Erklärung: Nutzung & Inhalt */}
    <div style={{background:'#fff',border:`1px solid ${LINE}`,borderRadius:14,padding:'18px 20px',marginBottom:18,boxShadow:'0 1px 2px rgba(0,0,0,.03)'}}>
      <div style={{fontFamily:FM,fontSize:11,letterSpacing:'.14em',textTransform:'uppercase',color:GOLD,marginBottom:8}}>So funktioniert die Bibliothek</div>
      <p style={{fontSize:13.5,color:GRAY,lineHeight:1.6,margin:'0 0 10px'}}>
        Hier findest du alle Kurse: den <b style={{color:NAVY}}>globalen KALYX-Katalog</b> (Etikett „Katalog", für alle verfügbar) und <b style={{color:NAVY}}>eure eigenen Kurse</b> (Etikett „Eigen"). Mit Suche und den Filtern Typ, Niveau, Branche und Position findest du schnell das Passende.
      </p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:10}}>
        <div style={{fontSize:13,color:GRAY,lineHeight:1.55}}><b style={{color:GREEN}}>1 · Stöbern</b><br/>Kurs anklicken, Beschreibung und Module ansehen.</div>
        <div style={{fontSize:13,color:GRAY,lineHeight:1.55}}><b style={{color:GREEN}}>2 · Lernen &amp; Prüfung</b><br/>Im Kurs die Übungsprüfung ablegen, mit Auswertung.</div>
        <div style={{fontSize:13,color:GRAY,lineHeight:1.55}}><b style={{color:GREEN}}>3 · Nachweis</b><br/>Bestehen erzeugt automatisch ein Zertifikat unter „Nachweise".</div>
        <div style={{fontSize:13,color:GRAY,lineHeight:1.55}}><b style={{color:GREEN}}>Eigene Kurse</b><br/>Mit „+ Neuer Kurs" anlegen oder über den KI-Kursersteller erzeugen.</div>
      </div>
      <p style={{fontSize:12,color:GRAY,marginTop:10}}>Hinweis: Vorbereitungskurse sind Übungsmaterial und ersetzen keine offizielle Prüfung.</p>
    </div>

    {loading ? <div style={{color:GRAY,fontFamily:FB}}>Lade Bibliothek …</div> : (<>
      {/* Toolbar */}
      <div className="kx-card" style={{...card,marginBottom:18}}>
        <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center'}}>
          <input className="kx-input" style={{...input,flex:'2 1 220px'}} placeholder="Suchen nach Titel, Thema, Kategorie …" value={q} onChange={e=>setQ(e.target.value)} />
          <select className="kx-input" style={{...input,flex:'1 1 140px'}} value={fSector} onChange={e=>{setFSector(e.target.value); setFPos('')}}><option value="">Alle Branchen</option>{SECTORS.map(t=><option key={t.v} value={t.v}>{t.l}</option>)}</select>
          <select className="kx-input" style={{...input,flex:'1 1 150px'}} value={fPos} onChange={e=>setFPos(e.target.value)} disabled={positions.length===0}><option value="">Alle Positionen</option>{positions.map(p=><option key={p} value={p}>{p}</option>)}</select>
          <select className="kx-input" style={{...input,flex:'1 1 130px'}} value={fType} onChange={e=>setFType(e.target.value)}><option value="">Alle Typen</option>{TYPES.map(t=><option key={t.v} value={t.v}>{t.l}</option>)}</select>
          <select className="kx-input" style={{...input,flex:'1 1 130px'}} value={fLevel} onChange={e=>setFLevel(e.target.value)}><option value="">Alle Niveaus</option>{LEVELS.map(t=><option key={t.v} value={t.v}>{t.l}</option>)}</select>
          <button className="kx-btn" style={btn} onClick={()=>setShowForm(s=>!s)}>{showForm?'Schließen':'+ Neuer Kurs'}</button>
        </div>

        {showForm && (
          <div style={{marginTop:18,paddingTop:18,borderTop:`1px solid ${LINE}`}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12}}>
              <div style={{gridColumn:'1 / -1'}}><label style={label}>Titel *</label><input className="kx-input" style={input} value={cTitle} onChange={e=>setCTitle(e.target.value)} placeholder="z. B. Brandschutz-Unterweisung"/></div>
              <div><label style={label}>Kategorie (Fachgebiet)</label><input className="kx-input" style={input} value={cCat} onChange={e=>setCCat(e.target.value)} placeholder="z. B. Arbeitssicherheit"/></div>
              <div><label style={label}>Branche</label><select className="kx-input" style={input} value={cSector} onChange={e=>setCSector(e.target.value)}><option value="">Keine Angabe</option>{SECTORS.map(t=><option key={t.v} value={t.v}>{t.l}</option>)}</select></div>
              <div><label style={label}>Position</label><input className="kx-input" style={input} value={cPos} onChange={e=>setCPos(e.target.value)} placeholder="z. B. Kundenberater/in"/></div>
              <div><label style={label}>Typ</label><select className="kx-input" style={input} value={cType} onChange={e=>setCType(e.target.value)}>{TYPES.map(t=><option key={t.v} value={t.v}>{t.l}</option>)}</select></div>
              <div><label style={label}>Niveau</label><select className="kx-input" style={input} value={cLevel} onChange={e=>setCLevel(e.target.value)}>{LEVELS.map(t=><option key={t.v} value={t.v}>{t.l}</option>)}</select></div>
              <div><label style={label}>Sprache</label><select className="kx-input" style={input} value={cLang} onChange={e=>setCLang(e.target.value)}>{LANGS.map(t=><option key={t.v} value={t.v}>{t.l}</option>)}</select></div>
              <div><label style={label}>Dauer (Min.)</label><input className="kx-input" style={input} type="number" min={0} value={cDur} onChange={e=>setCDur(e.target.value===''?'':parseInt(e.target.value,10))}/></div>
              <div><label style={label}>Status</label><select className="kx-input" style={input} value={cStatus} onChange={e=>setCStatus(e.target.value)}><option value="veroeffentlicht">Veröffentlicht</option><option value="entwurf">Entwurf</option></select></div>
              <div style={{gridColumn:'1 / -1'}}><label style={label}>Beschreibung</label><input className="kx-input" style={input} value={cDesc} onChange={e=>setCDesc(e.target.value)} placeholder="Worum geht es im Kurs?"/></div>
              <div style={{gridColumn:'1 / -1',display:'flex',alignItems:'flex-start',gap:9}}>
                <input type="checkbox" checked={cCertPrep} onChange={e=>setCCertPrep(e.target.checked)} style={{marginTop:3,accentColor:GREEN}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:13.5,fontWeight:600,color:NAVY}}>Vorbereitung auf eine externe Zertifizierung</div>
                  <div style={{fontSize:12,color:GRAY,marginBottom:cCertPrep?8:0}}>Ehrlicher Hinweis: KALYX bereitet vor, ersetzt aber nicht die offizielle Prüfung.</div>
                  {cCertPrep && <input className="kx-input" style={input} value={cExtCert} onChange={e=>setCExtCert(e.target.value)} placeholder="Vorbereitung auf … (z. B. ISO 27001 Foundation)"/>}
                </div>
              </div>
            </div>
            {msg && <p style={{color:'#C0392B',fontSize:13,margin:'12px 0 0'}}>{msg}</p>}
            <div style={{marginTop:14}}><button className="kx-btn" style={{...btn,opacity:saving?0.7:1}} onClick={createCourse} disabled={saving}>{saving?'Speichern …':'Kurs anlegen'}</button></div>
          </div>
        )}
      </div>

      {/* Liste */}
      {filtered.length===0
        ? <div className="kx-card" style={{...card,textAlign:'center',color:GRAY}}>Keine Kurse gefunden. Passe die Filter an oder lege oben deinen ersten Kurs an.</div>
        : <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:16}}>
            {filtered.map(c=>(
              <div key={c.id} className="kx-card kx-tile" style={{...card,cursor:'pointer',display:'flex',flexDirection:'column'}} onClick={()=>openDetail(c)}>
                <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:10}}>
                  <span style={pill(c.tenant_id?GOLD_PALE:GREEN_PALE, c.tenant_id?GOLD:GREEN)}>{c.tenant_id?'Eigen':'Katalog'}</span>
                  <span style={pill(BLUE_PALE,BLUE)}>{tl(TYPES,c.course_type)}</span>
                  {c.status!=='veroeffentlicht' && <span style={pill('#FBEAEA','#C0392B')}>{c.status==='entwurf'?'Entwurf':'Archiv'}</span>}
                </div>
                <h3 style={{fontFamily:FH,fontSize:21,fontWeight:600,color:NAVY,marginBottom:6,lineHeight:1.2}}>{c.title}</h3>
                {c.description && <p style={{fontSize:13.5,color:GRAY,lineHeight:1.55,marginBottom:10,flex:1}}>{c.description.length>120?c.description.slice(0,120)+'…':c.description}</p>}
                {(c.sector||c.position) && <p style={{fontSize:12,color:GOLD,fontFamily:FM,marginBottom:6}}>{[c.sector?tl(SECTORS,c.sector):null,c.position].filter(Boolean).join(' · ')}</p>}
                {c.cert_prep && c.external_cert && <p style={{fontSize:12.5,color:GOLD,marginBottom:8}}>↗ {c.external_cert}</p>}
                <div style={{display:'flex',gap:12,fontSize:12,color:GRAY,fontFamily:FM,marginTop:'auto'}}>
                  <span>{tl(LEVELS,c.level)}</span><span>{c.language.toUpperCase()}</span>{c.duration_min?<span>{c.duration_min} Min.</span>:null}
                </div>
              </div>
            ))}
          </div>}

      <p style={{fontFamily:FB,fontSize:12.5,color:GRAY,textAlign:'center',marginTop:26}}>Pilotbetrieb · Inhalte teils als Beispiel · Daten in der EU</p>
    </>)}

    {/* Detail-Overlay */}
    {detail && (
      <div onClick={()=>setDetail(null)} style={{position:'fixed',inset:0,background:'rgba(11,25,41,.6)',display:'flex',alignItems:'center',justifyContent:'center',padding:20,zIndex:500}}>
        <div onClick={e=>e.stopPropagation()} style={{background:'#fff',borderRadius:18,maxWidth:620,width:'100%',maxHeight:'85vh',overflowY:'auto',padding:'30px 30px',boxShadow:'0 30px 70px rgba(0,0,0,.45)'}}>
          <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:12}}>
            <span style={pill(detail.tenant_id?GOLD_PALE:GREEN_PALE,detail.tenant_id?GOLD:GREEN)}>{detail.tenant_id?'Eigen':'Katalog'}</span>
            <span style={pill(BLUE_PALE,BLUE)}>{tl(TYPES,detail.course_type)}</span>
            <span style={pill(CREAM,GRAY)}>{tl(LEVELS,detail.level)}</span>
            {detail.sector && <span style={pill(GOLD_PALE,GOLD)}>{tl(SECTORS,detail.sector)}</span>}
          </div>
          <h2 style={{fontFamily:FH,fontSize:27,fontWeight:600,color:NAVY,marginBottom:8}}>{detail.title}</h2>
          {detail.position && <p style={{fontFamily:FM,fontSize:12.5,color:GRAY,marginBottom:8}}>Position: {detail.position}</p>}
          {detail.description && <p style={{fontSize:14.5,color:GRAY,lineHeight:1.6,marginBottom:12}}>{detail.description}</p>}
          {detail.cert_prep && detail.external_cert && <p style={{fontSize:13,color:GOLD,marginBottom:14}}>↗ {detail.external_cert}. Hinweis: Vorbereitung und Übung, nicht die offizielle Prüfung.</p>}
          <div style={{borderTop:`1px solid ${LINE}`,margin:'8px 0 16px'}}/>
          <p style={{fontFamily:FM,fontSize:11,letterSpacing:'.12em',textTransform:'uppercase',color:GRAY,marginBottom:10}}>Module</p>
          {modLoading ? <p style={{color:GRAY,fontSize:14}}>Lade Module …</p>
            : modules.length===0 ? <p style={{color:GRAY,fontSize:14}}>Noch keine Module hinterlegt.</p>
            : modules.map(m=>(
                <div key={m.id} style={{display:'flex',gap:12,alignItems:'flex-start',padding:'11px 0',borderBottom:`1px solid ${CREAM}`}}>
                  <span style={{flexShrink:0,width:26,height:26,borderRadius:8,background:GREEN_PALE,color:GREEN,fontFamily:FM,fontSize:12,display:'flex',alignItems:'center',justifyContent:'center'}}>{m.position}</span>
                  <div><div style={{fontSize:14.5,fontWeight:600,color:NAVY}}>{m.title}</div>{m.content && <div style={{fontSize:13,color:GRAY,marginTop:2}}>{m.content.length>160?m.content.slice(0,160)+'…':m.content}</div>}</div>
                </div>
              ))}
          <div style={{marginTop:20,display:'flex',justifyContent:'space-between',alignItems:'center',gap:10,flexWrap:'wrap'}}>
            <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
              <a href={`/lernen?kurs=${detail.id}`} className="kx-btn" style={{...btn,textDecoration:'none',display:'inline-block'}}>Kurs lernen →</a>
              <a href={`/pruefung?kurs=${detail.id}`} className="kx-btn" style={{...btnGhost,textDecoration:'none',display:'inline-block'}}>Direkt zur Prüfung</a>
            </div>
            <button className="kx-btn" style={btnGhost} onClick={()=>setDetail(null)}>Schließen</button>
          </div>
        </div>
      </div>
    )}
  </AppShell>)
}
