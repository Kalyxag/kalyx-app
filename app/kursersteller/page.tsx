// Ziel-Pfad im Repo: app/kursersteller/page.tsx  (NEU)
//
// KI-Kursersteller. Erzeugt einen geerdeten Entwurf, den du prüfst und
// dann als echten Kurs in die Bibliothek speicherst (RLS, mandantengeschützt).
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import AppShell from '../components/AppShell'

const CREAM='#F5F4EF', NAVY='#0B1929', GREEN='var(--kx-brand,#14613E)', GOLD='#B8904A', GOLD_PALE='#F8F1E4', LINE='#E4E0D8', GRAY='#6B7280'
const FH="'Cormorant', Georgia, serif"
const FB="'Albert Sans', system-ui, -apple-system, sans-serif"
const FM="'IBM Plex Mono', ui-monospace, monospace"

const TYPES=[{v:'pflicht',l:'Compliance-Pflichtschulung'},{v:'vorbereitung',l:'Vorbereitungskurs'},{v:'weiterbildung',l:'Weiterbildung'}]
const LEVELS=[{v:'grundlagen',l:'Grundlagen'},{v:'aufbau',l:'Aufbau'},{v:'vertiefung',l:'Vertiefung'},{v:'experte',l:'Experte'}]
const LANGS=[{v:'de',l:'Deutsch'},{v:'fr',l:'Französisch'},{v:'it',l:'Italienisch'},{v:'en',l:'Englisch'}]

type Mod={title:string;content:string}
type Draft={title:string;description:string;category:string;modules:Mod[]}

export default function KurserstellerPage(){
  const router=useRouter()
  const [tenantId,setTenantId]=useState(''); const [uid,setUid]=useState('')
  const [thema,setThema]=useState(''); const [typ,setTyp]=useState('pflicht'); const [niveau,setNiveau]=useState('grundlagen')
  const [sprache,setSprache]=useState('de'); const [anzahl,setAnzahl]=useState(4)
  const [certPrep,setCertPrep]=useState(false); const [extCert,setExtCert]=useState('')
  const [gen,setGen]=useState(false); const [draft,setDraft]=useState<Draft|null>(null)
  const [saving,setSaving]=useState(false); const [savedId,setSavedId]=useState(''); const [msg,setMsg]=useState('')

  useEffect(()=>{let on=true;(async()=>{
    const {data}=await supabase.auth.getSession();const session=data.session
    if(!session){router.replace('/anmelden');return}
    const {data:au}=await supabase.from('app_users').select('tenant_id').eq('id',session.user.id).maybeSingle()
    const tid=(au as any)?.tenant_id; if(!tid){router.replace('/anmelden');return}
    if(!on)return; setTenantId(tid); setUid(session.user.id)
  })();return()=>{on=false}},[router])

  async function generate(){
    if(!thema.trim()){setMsg('Bitte ein Thema angeben.');return}
    if(certPrep && !extCert.trim()){setMsg('Bitte angeben, worauf der Kurs vorbereitet.');return}
    setGen(true); setMsg(''); setDraft(null); setSavedId('')
    try{
      const r=await fetch('/api/kurs-generieren',{method:'POST',headers:{'content-type':'application/json'},
        body:JSON.stringify({thema:thema.trim(),typ,niveau,sprache,module:anzahl,certPrep,externalCert:extCert.trim()})})
      const d=await r.json()
      if(!r.ok){setMsg(d?.error||'Erzeugen fehlgeschlagen.');setGen(false);return}
      setDraft({title:d.title||thema.trim(),description:d.description||'',category:d.category||'',modules:Array.isArray(d.modules)?d.modules:[]})
    }catch(e:any){setMsg('Netzwerkfehler beim Erzeugen.')}
    setGen(false)
  }

  function upd(p:Partial<Draft>){setDraft(d=>d?{...d,...p}:d)}
  function updMod(i:number,p:Partial<Mod>){setDraft(d=>{if(!d)return d;const m=d.modules.slice();m[i]={...m[i],...p};return{...d,modules:m}})}

  async function save(){
    if(!draft||!tenantId)return
    setSaving(true); setMsg('')
    const {data,error}=await supabase.from('courses').insert({
      tenant_id:tenantId,title:draft.title.trim(),description:draft.description.trim()||null,category:draft.category.trim()||null,
      course_type:typ,course_level:niveau,language:sprache,cert_prep:certPrep,external_cert:certPrep?extCert.trim():null,
      status:'entwurf',ai_generated:true,created_by:uid,
    }).select('id').single()
    if(error){setSaving(false);setMsg('Speichern fehlgeschlagen: '+error.message);return}
    const cid=(data as any).id
    const rows=draft.modules.map((m,i)=>({course_id:cid,tenant_id:tenantId,position:i+1,title:m.title.trim()||`Modul ${i+1}`,content:m.content.trim()||null,module_type:'lesson'}))
    if(rows.length) await supabase.from('course_modules').insert(rows)
    try{await supabase.from('audit_log').insert({tenant_id:tenantId,actor_id:uid,action:'course_ai_created',entity:'courses',entity_id:cid})}catch{}
    setSaving(false); setSavedId(cid)
  }

  const card:React.CSSProperties={background:'#fff',borderRadius:16,padding:'22px 22px',border:`1px solid ${LINE}`,boxShadow:'0 1px 2px rgba(0,0,0,.03),0 10px 28px rgba(0,0,0,.05)'}
  const eyebrow:React.CSSProperties={fontFamily:FM,fontSize:11,letterSpacing:'.18em',textTransform:'uppercase',color:GOLD}
  const input:React.CSSProperties={width:'100%',fontFamily:FB,fontSize:14.5,color:NAVY,background:CREAM,border:`1.5px solid ${LINE}`,borderRadius:10,padding:'11px 13px',outline:'none'}
  const label:React.CSSProperties={display:'block',fontSize:12.5,fontWeight:600,color:NAVY,marginBottom:5}
  const btn:React.CSSProperties={fontFamily:FB,fontSize:14.5,fontWeight:600,color:'#fff',background:GREEN,border:'none',borderRadius:10,padding:'12px 22px',cursor:'pointer'}
  const ta:React.CSSProperties={...input,minHeight:90,lineHeight:1.55,resize:'vertical',fontFamily:FB}

  return(<AppShell active="ki">
    <div style={eyebrow}>KI-Kursersteller</div>
    <h1 style={{fontFamily:FH,fontSize:32,fontWeight:600,color:NAVY,margin:'4px 0 6px'}}>Kurs mit KI entwerfen</h1>

    {/* Ehrlicher Hinweis */}
    <div style={{background:GOLD_PALE,borderLeft:`4px solid ${GOLD}`,borderRadius:8,padding:'12px 14px',marginBottom:18}}>
      <span style={{fontSize:13.5,color:'#7A5C24',lineHeight:1.5}}>
        <b>KI-Entwurf, bitte fachlich prüfen.</b> Die KI kann Fehler machen. Konkrete Gesetzesartikel, Normen-Nummern und Zahlen vor dem Veröffentlichen kontrollieren. Der Kurs wird zunächst als <b>Entwurf</b> gespeichert.
      </span>
    </div>

    {/* Eingabe */}
    <div className="kx-card" style={{...card,marginBottom:18}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12}}>
        <div style={{gridColumn:'1 / -1'}}><label style={label}>Thema des Kurses *</label><input className="kx-input" style={input} value={thema} onChange={e=>setThema(e.target.value)} placeholder="z. B. Datenschutz im Arbeitsalltag für neue Mitarbeitende"/></div>
        <div><label style={label}>Typ</label><select className="kx-input" style={input} value={typ} onChange={e=>setTyp(e.target.value)}>{TYPES.map(t=><option key={t.v} value={t.v}>{t.l}</option>)}</select></div>
        <div><label style={label}>Niveau</label><select className="kx-input" style={input} value={niveau} onChange={e=>setNiveau(e.target.value)}>{LEVELS.map(t=><option key={t.v} value={t.v}>{t.l}</option>)}</select></div>
        <div><label style={label}>Sprache</label><select className="kx-input" style={input} value={sprache} onChange={e=>setSprache(e.target.value)}>{LANGS.map(t=><option key={t.v} value={t.v}>{t.l}</option>)}</select></div>
        <div><label style={label}>Anzahl Module</label><input className="kx-input" style={input} type="number" min={2} max={6} value={anzahl} onChange={e=>setAnzahl(parseInt(e.target.value,10)||4)}/></div>
        <div style={{gridColumn:'1 / -1',display:'flex',alignItems:'flex-start',gap:9}}>
          <input type="checkbox" checked={certPrep} onChange={e=>setCertPrep(e.target.checked)} style={{marginTop:3,accentColor:GREEN}}/>
          <div style={{flex:1}}>
            <div style={{fontSize:13.5,fontWeight:600,color:NAVY}}>Vorbereitung auf eine externe Zertifizierung</div>
            <div style={{fontSize:12,color:GRAY,marginBottom:certPrep?8:0}}>KALYX bereitet vor, ersetzt aber nicht die offizielle Prüfung.</div>
            {certPrep && <input className="kx-input" style={input} value={extCert} onChange={e=>setExtCert(e.target.value)} placeholder="Vorbereitung auf … (z. B. ISO 27001 Foundation)"/>}
          </div>
        </div>
        <div style={{gridColumn:'1 / -1',display:'flex',alignItems:'flex-start',gap:9,background:'var(--kx-brand-pale,#E6F0EB)',borderRadius:10,padding:'11px 13px'}}>
          <span style={{color:GREEN,fontSize:15,lineHeight:1.2,marginTop:1}}>🛡️</span>
          <div style={{flex:1,fontSize:12.5,color:NAVY,lineHeight:1.5}}>
            <b>Fälschungssicherer Nachweis.</b> Sobald die erste Person diesen Kurs besteht, wird sein Inhalt (Lernziele, Module, Niveau und Art) als unveränderliche Fassung eingefroren und revisionssicher protokolliert. Jedes Zertifikat verweist dauerhaft auf genau diese Fassung und ist öffentlich unter <span style={{fontFamily:FM}}>kalyx.academy/verify</span> prüfbar. Spätere Änderungen am Kurs gelten erst für künftige Absolventen.
          </div>
        </div>
      </div>
      {msg && !draft && <p style={{color:'#C0392B',fontSize:13,margin:'12px 0 0'}}>{msg}</p>}
      <div style={{marginTop:14}}><button className="kx-btn" style={{...btn,opacity:gen?0.7:1}} onClick={generate} disabled={gen}>{gen?'Entwurf wird erzeugt …':'Entwurf generieren'}</button></div>
    </div>

    {/* Entwurf */}
    {draft && (
      <div className="kx-card" style={card}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
          <span style={{fontFamily:FM,fontSize:11,letterSpacing:'.12em',textTransform:'uppercase',color:GRAY}}>Entwurf · prüfen &amp; anpassen</span>
          <span style={{fontFamily:FM,fontSize:11,color:GOLD}}>KI-erzeugt</span>
        </div>
        <div style={{marginBottom:12}}><label style={label}>Titel</label><input className="kx-input" style={input} value={draft.title} onChange={e=>upd({title:e.target.value})}/></div>
        <div style={{marginBottom:12}}><label style={label}>Beschreibung</label><input className="kx-input" style={input} value={draft.description} onChange={e=>upd({description:e.target.value})}/></div>
        <div style={{marginBottom:6}}><label style={label}>Kategorie</label><input className="kx-input" style={{...input,maxWidth:320}} value={draft.category} onChange={e=>upd({category:e.target.value})}/></div>

        <div style={{borderTop:`1px solid ${LINE}`,margin:'16px 0 12px'}}/>
        <span style={{fontFamily:FM,fontSize:11,letterSpacing:'.12em',textTransform:'uppercase',color:GRAY}}>Module</span>
        {draft.modules.map((m,i)=>(
          <div key={i} style={{marginTop:12,padding:'14px',background:CREAM,borderRadius:12,border:`1px solid ${LINE}`}}>
            <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:8}}>
              <span style={{flexShrink:0,width:24,height:24,borderRadius:7,background:GREEN,color:'#fff',fontFamily:FM,fontSize:12,display:'flex',alignItems:'center',justifyContent:'center'}}>{i+1}</span>
              <input className="kx-input" style={{...input,background:'#fff'}} value={m.title} onChange={e=>updMod(i,{title:e.target.value})}/>
            </div>
            <textarea className="kx-input" style={{...ta,background:'#fff'}} value={m.content} onChange={e=>updMod(i,{content:e.target.value})}/>
          </div>
        ))}

        {msg && <p style={{color:'#C0392B',fontSize:13,margin:'12px 0 0'}}>{msg}</p>}
        {savedId
          ? <div style={{marginTop:16,display:'flex',alignItems:'center',gap:14,flexWrap:'wrap'}}>
              <span style={{color:GREEN,fontWeight:600,fontSize:14}}>✓ Als Entwurf in der Bibliothek gespeichert.</span>
              <a href="/bibliothek" style={{fontFamily:FB,fontSize:14,fontWeight:600,color:GREEN,textDecoration:'none',border:`1.5px solid ${GREEN}`,borderRadius:10,padding:'9px 16px'}}>Zur Bibliothek →</a>
            </div>
          : <div style={{marginTop:16}}><button className="kx-btn" style={{...btn,opacity:saving?0.7:1}} onClick={save} disabled={saving}>{saving?'Speichern …':'In Bibliothek speichern (als Entwurf)'}</button></div>}
      </div>
    )}

    <p style={{fontFamily:FB,fontSize:12.5,color:GRAY,textAlign:'center',marginTop:26}}>Pilotbetrieb · KI über eine US-Schnittstelle, mit Testdaten · Inhalte vor dem Veröffentlichen prüfen</p>
  </AppShell>)
}
