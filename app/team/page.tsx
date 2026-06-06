// Ziel-Pfad im Repo: app/team/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import AppShell from '../components/AppShell'

const NAVY='#0B1929', GREEN='#14613E', GOLD='#B8904A', GREEN_PALE='#E6F0EB', GOLD_PALE='#F8F1E4', LINE='#E4E0D8', GRAY='#6B7280', CREAM='#F5F4EF', RED='#9b2c2c'
const FH="'Cormorant', Georgia, serif"; const FB="'Albert Sans', system-ui, sans-serif"; const FM="'IBM Plex Mono', ui-monospace, monospace"

type Dept={id:string;name:string}
type Role={id:string;name:string;access_level:string;department_id:string|null}
type Member={id:string;email:string;full_name:string;access_level:string;department:string|null;position:string|null;status:string}

const LV:Record<string,string>={admin:'Administrator',manager:'Manager',learner:'Lernende'}

export default function TeamPage(){
  const router=useRouter()
  const [loading,setLoading]=useState(true)
  const [isAdmin,setIsAdmin]=useState(false)
  const [canList,setCanList]=useState(false)
  const [memberCount,setMemberCount]=useState(0)
  const [levels,setLevels]=useState<Record<string,number>>({})
  const [depts,setDepts]=useState<Dept[]>([])
  const [roles,setRoles]=useState<Role[]>([])
  const [team,setTeam]=useState<Member[]>([])
  // Einladen-Formular
  const [fName,setFName]=useState(''); const [fEmail,setFEmail]=useState('')
  const [fLevel,setFLevel]=useState('learner'); const [fDept,setFDept]=useState(''); const [fPos,setFPos]=useState('')
  const [fBusy,setFBusy]=useState(false); const [fMsg,setFMsg]=useState(''); const [fErr,setFErr]=useState('')
  const [fLink,setFLink]=useState(''); const [showLinkHint,setShowLinkHint]=useState(false)
  // Bearbeiten
  const [myId,setMyId]=useState('')
  const [edit,setEdit]=useState<Member|null>(null)
  const [eName,setEName]=useState(''); const [eLevel,setELevel]=useState('learner'); const [eDept,setEDept]=useState(''); const [ePos,setEPos]=useState('')
  const [eBusy,setEBusy]=useState(false); const [eMsg,setEMsg]=useState(''); const [eLink,setELink]=useState(''); const [confirmDel,setConfirmDel]=useState(false)

  async function ladeListe(){
    const {data}=await supabase.auth.getSession()
    if(!data.session) return
    try{
      const r=await fetch('/api/team-invite',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({access_token:data.session.access_token,action:'liste'})})
      const j=await r.json()
      if(j?.ok) setTeam(j.team||[])
    }catch{}
  }

  useEffect(()=>{let on=true;(async()=>{
    const {data}=await supabase.auth.getSession();const session=data.session
    if(!session){router.replace('/anmelden');return}
    const {data:au}=await supabase.from('app_users').select('tenant_id,access_level').eq('id',session.user.id).maybeSingle()
    const tid=(au as any)?.tenant_id; if(!tid){router.replace('/anmelden');return}
    const myLevel=(au as any)?.access_level
    const [{data:users},{data:d},{data:r}]=await Promise.all([
      supabase.from('app_users').select('access_level').eq('tenant_id',tid),
      supabase.from('departments').select('id,name').eq('tenant_id',tid).order('created_at'),
      supabase.from('roles').select('id,name,access_level,department_id').eq('tenant_id',tid).order('created_at'),
    ])
    if(!on)return
    const us=(users as {access_level:string}[])||[]
    const lv:Record<string,number>={}; us.forEach(u=>{lv[u.access_level]=(lv[u.access_level]||0)+1})
    setMemberCount(us.length); setLevels(lv); setDepts((d as Dept[])||[]); setRoles((r as Role[])||[])
    setIsAdmin(myLevel==='admin'); setCanList(myLevel==='admin'||myLevel==='manager'); setMyId(session.user.id)
    if(myLevel==='admin'||myLevel==='manager') await ladeListe()
    setLoading(false)
  })();return()=>{on=false}},[router])

  async function einladen(per:'mail'|'link'){
    setFErr(''); setFMsg(''); setFLink(''); setShowLinkHint(false)
    if(!fName.trim()){ setFErr('Bitte einen Namen angeben.'); return }
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(fEmail.trim())){ setFErr('Bitte eine gültige E-Mail angeben.'); return }
    setFBusy(true)
    try{
      const {data}=await supabase.auth.getSession()
      const r=await fetch('/api/team-invite',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({
        access_token:data.session?.access_token, action:'einladen', per,
        email:fEmail.trim(), full_name:fName.trim(), access_level:fLevel, department:fDept||null, position:fPos.trim()||null,
      })})
      const j=await r.json()
      if(j?.ok){
        if(j.link){ setFLink(j.link); setFMsg('Konto angelegt. Gib der Person diesen Einladungslink weiter:') }
        else { setFMsg('Einladung an '+fEmail.trim()+' versendet.') }
        setFName(''); setFEmail(''); setFPos(''); setFDept(''); setFLevel('learner')
        await ladeListe()
      } else if(j?.code==='mail'){
        setShowLinkHint(true); setFErr(j.error||'Mailversand nicht eingerichtet.')
      } else {
        setFErr(j?.error||'Einladung fehlgeschlagen.')
      }
    }catch{ setFErr('Verbindung fehlgeschlagen.') }
    setFBusy(false)
  }

  async function erneut(email:string){
    const {data}=await supabase.auth.getSession()
    setFErr(''); setFMsg(''); setFLink('')
    try{
      const r=await fetch('/api/team-invite',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({access_token:data.session?.access_token,action:'erneut',email})})
      const j=await r.json()
      if(j?.ok&&j.link){ setFLink(j.link); setFMsg('Neuer Einladungslink für '+email+':') }
      else setFErr('Link konnte nicht erzeugt werden.')
    }catch{ setFErr('Verbindung fehlgeschlagen.') }
  }

  function oeffneEdit(m:Member){
    setEdit(m); setEName(m.full_name||''); setELevel(m.access_level); setEDept(m.department||''); setEPos(m.position||'')
    setEMsg(''); setELink(''); setConfirmDel(false)
  }

  async function speichereEdit(){
    if(!edit) return
    setEBusy(true); setEMsg('')
    try{
      const {data}=await supabase.auth.getSession()
      const r=await fetch('/api/team-invite',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({
        access_token:data.session?.access_token, action:'aktualisieren', user_id:edit.id,
        access_level:eLevel, full_name:eName.trim(), department:eDept||null, position:ePos.trim()||null,
      })})
      const j=await r.json()
      if(j?.ok){ await ladeListe(); setEdit(null) }
      else setEMsg(j?.error||'Speichern fehlgeschlagen.')
    }catch{ setEMsg('Verbindung fehlgeschlagen.') }
    setEBusy(false)
  }

  async function neuerLink(){
    if(!edit) return
    setEMsg(''); setELink('')
    try{
      const {data}=await supabase.auth.getSession()
      const r=await fetch('/api/team-invite',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({access_token:data.session?.access_token,action:'erneut',email:edit.email})})
      const j=await r.json()
      if(j?.ok&&j.link) setELink(j.link); else setEMsg('Link konnte nicht erzeugt werden.')
    }catch{ setEMsg('Verbindung fehlgeschlagen.') }
  }

  async function entferne(){
    if(!edit) return
    setEBusy(true); setEMsg('')
    try{
      const {data}=await supabase.auth.getSession()
      const r=await fetch('/api/team-invite',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({access_token:data.session?.access_token,action:'entfernen',user_id:edit.id})})
      const j=await r.json()
      if(j?.ok){ await ladeListe(); setEdit(null) }
      else setEMsg(j?.error||'Entfernen fehlgeschlagen.')
    }catch{ setEMsg('Verbindung fehlgeschlagen.') }
    setEBusy(false)
  }

  const card:React.CSSProperties={background:'#fff',borderRadius:16,padding:'22px 22px',border:`1px solid ${LINE}`,boxShadow:'0 1px 2px rgba(0,0,0,.03),0 10px 28px rgba(0,0,0,.05)'}
  const eyebrow:React.CSSProperties={fontFamily:FM,fontSize:11,letterSpacing:'.18em',textTransform:'uppercase',color:GOLD}
  const tileTitle:React.CSSProperties={fontFamily:FM,fontSize:11,letterSpacing:'.12em',textTransform:'uppercase',color:GRAY,marginBottom:10}
  const big:React.CSSProperties={fontFamily:FH,fontSize:34,fontWeight:700,color:NAVY,lineHeight:1}
  const chip:React.CSSProperties={fontFamily:FB,fontSize:12.5,fontWeight:600,padding:'5px 11px',borderRadius:8,border:`1.5px solid ${GREEN}`,color:GREEN,background:GREEN_PALE}
  const inp:React.CSSProperties={width:'100%',fontFamily:FB,fontSize:14,color:NAVY,background:CREAM,border:`1.5px solid ${LINE}`,borderRadius:10,padding:'10px 13px',boxSizing:'border-box'}
  const lbl:React.CSSProperties={display:'block',fontFamily:FB,fontSize:13,fontWeight:600,color:NAVY,marginBottom:6}

  return(<AppShell active="team">
    <div style={eyebrow}>Team</div>
    <h1 style={{fontFamily:FH,fontSize:32,fontWeight:600,color:NAVY,margin:'4px 0 18px'}}>Organisation &amp; Team</h1>
    {loading ? <div style={{color:GRAY,fontFamily:FB}}>Lade …</div> : (<>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:16,marginBottom:16}}>
        <div style={card}><span style={tileTitle}>Mitglieder</span><div style={big}>{memberCount}</div><div style={{fontSize:13,color:GRAY,marginTop:8}}>{Object.entries(levels).map(([k,v])=>`${LV[k]||k}: ${v}`).join(' · ')||'-'}</div></div>
        <div style={card}><span style={tileTitle}>Abteilungen</span><div style={big}>{depts.length}</div><div style={{fontSize:13,color:GRAY,marginTop:8}}>{depts.map(d=>d.name).slice(0,5).join(' · ')||'-'}</div></div>
        <div style={card}><span style={tileTitle}>Rollen</span><div style={big}>{roles.length}</div><div style={{fontSize:13,color:GRAY,marginTop:8}}>{roles.map(r=>r.name).slice(0,5).join(' · ')||'-'}</div></div>
      </div>

      {isAdmin && (
        <div style={{...card,marginBottom:16}}>
          <span style={tileTitle}>Mitarbeitende einladen</span>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:12,marginTop:6}}>
            <div><label style={lbl}>Voller Name</label><input style={inp} value={fName} onChange={e=>setFName(e.target.value)} placeholder="Vor- und Nachname"/></div>
            <div><label style={lbl}>E-Mail</label><input style={inp} value={fEmail} onChange={e=>setFEmail(e.target.value)} placeholder="name@firma.ch"/></div>
            <div><label style={lbl}>Rolle</label>
              <select style={inp} value={fLevel} onChange={e=>setFLevel(e.target.value)}>
                <option value="learner">Lernende</option><option value="manager">Manager</option><option value="admin">Administrator</option>
              </select>
            </div>
            <div><label style={lbl}>Abteilung</label>
              <select style={inp} value={fDept} onChange={e=>setFDept(e.target.value)}>
                <option value="">Keine Angabe</option>
                {depts.map(d=><option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Position (optional)</label><input style={inp} value={fPos} onChange={e=>setFPos(e.target.value)} placeholder="z. B. Analyst"/></div>
          </div>
          <div style={{display:'flex',gap:10,marginTop:14,flexWrap:'wrap'}}>
            <button disabled={fBusy} onClick={()=>einladen('mail')} style={{fontFamily:FB,fontSize:14,fontWeight:600,color:'#fff',background:GREEN,border:'none',borderRadius:10,padding:'11px 20px',cursor:'pointer',opacity:fBusy?.6:1}}>{fBusy?'…':'Per E-Mail einladen'}</button>
            <button disabled={fBusy} onClick={()=>einladen('link')} style={{fontFamily:FB,fontSize:14,fontWeight:600,color:GREEN,background:'#fff',border:`1.5px solid ${GREEN}`,borderRadius:10,padding:'11px 20px',cursor:'pointer'}}>Einladungslink erzeugen</button>
          </div>
          {fErr && <div style={{fontSize:13,color:RED,marginTop:10,lineHeight:1.5}}>{fErr}{showLinkHint && <> Nutze dazu den Knopf „Einladungslink erzeugen“.</>}</div>}
          {fMsg && <div style={{fontSize:13,color:GREEN,marginTop:10,fontWeight:600}}>{fMsg}</div>}
          {fLink && <div style={{marginTop:8,padding:'10px 12px',background:GOLD_PALE,border:`1px solid ${GOLD}`,borderRadius:9,fontFamily:FM,fontSize:12,color:NAVY,wordBreak:'break-all',lineHeight:1.5}}>{fLink}</div>}
          <div style={{fontSize:12,color:GRAY,marginTop:12,lineHeight:1.55}}>Per E-Mail einladen verschickt die Einladung direkt, sobald der Mailversand eingerichtet ist. Der Einladungslink funktioniert auch ohne Mailversand: du gibst ihn der Person selbst weiter.</div>
        </div>
      )}

      {canList && (
        <div style={{...card,marginBottom:16}}>
          <h2 style={{fontFamily:FH,fontSize:22,fontWeight:600,color:NAVY,margin:'0 0 12px'}}>Mitarbeitende</h2>
          {team.length===0 ? <p style={{color:GRAY,fontSize:14}}>Noch niemand eingeladen.</p> : (
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontFamily:FB,fontSize:13.5}}>
                <thead><tr style={{textAlign:'left',color:GRAY,fontSize:11.5,textTransform:'uppercase',letterSpacing:'.08em'}}>
                  <th style={{padding:'8px 8px'}}>Name</th><th style={{padding:'8px 8px'}}>Rolle</th><th style={{padding:'8px 8px'}}>Abteilung</th><th style={{padding:'8px 8px'}}>Status</th>{isAdmin&&<th></th>}
                </tr></thead>
                <tbody>
                  {team.map(m=>{
                    const eingeladen=m.status==='eingeladen'
                    return(<tr key={m.id} style={{borderTop:`1px solid #F0EEE8`}}>
                      <td style={{padding:'10px 8px'}}><div style={{fontWeight:600,color:NAVY}}>{m.full_name||'-'}</div><div style={{color:GRAY,fontSize:12}}>{m.email}{m.position?' · '+m.position:''}</div></td>
                      <td style={{padding:'10px 8px',color:NAVY}}>{LV[m.access_level]||m.access_level}</td>
                      <td style={{padding:'10px 8px',color:GRAY}}>{m.department||'-'}</td>
                      <td style={{padding:'10px 8px'}}><span style={{fontFamily:FM,fontSize:10.5,fontWeight:700,padding:'3px 9px',borderRadius:999,background:eingeladen?GOLD_PALE:GREEN_PALE,color:eingeladen?'#8a6d1f':GREEN}}>{eingeladen?'Eingeladen':'Aktiv'}</span></td>
                      {isAdmin&&<td style={{padding:'10px 8px',textAlign:'right'}}><button onClick={()=>oeffneEdit(m)} style={{fontFamily:FB,fontSize:12.5,fontWeight:600,color:GREEN,background:'none',border:'none',cursor:'pointer'}}>Bearbeiten</button></td>}
                    </tr>)
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div style={card}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12,flexWrap:'wrap',gap:8}}>
          <h2 style={{fontFamily:FH,fontSize:22,fontWeight:600,color:NAVY,margin:0}}>Rollen &amp; Zuordnung</h2>
          <a href="/onboarding" style={{fontFamily:FB,fontSize:13,fontWeight:600,color:GREEN,textDecoration:'none'}}>Struktur bearbeiten</a>
        </div>
        {roles.length===0 ? <p style={{color:GRAY,fontSize:14}}>Noch keine Rollen angelegt.</p> : roles.map(r=>{
          const dn=depts.find(d=>d.id===r.department_id)?.name
          return <div key={r.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 0',borderBottom:`1px solid #F0EEE8`}}>
            <div><span style={{fontSize:14.5,fontWeight:600,color:NAVY}}>{r.name}</span>{dn?<span style={{fontSize:13,color:GRAY}}> · {dn}</span>:null}</div>
            <span style={chip}>{LV[r.access_level]||r.access_level}</span>
          </div>
        })}
      </div>
    </>)}
    {edit && (
      <div onClick={()=>setEdit(null)} style={{position:'fixed',inset:0,background:'rgba(11,25,41,.45)',display:'flex',alignItems:'center',justifyContent:'center',padding:16,zIndex:50}}>
        <div onClick={e=>e.stopPropagation()} style={{background:'#fff',borderRadius:16,maxWidth:460,width:'100%',padding:26,boxShadow:'0 20px 60px rgba(0,0,0,.25)',maxHeight:'90vh',overflowY:'auto'}}>
          <h2 style={{fontFamily:FH,fontSize:22,fontWeight:600,color:NAVY,margin:'0 0 4px'}}>Person bearbeiten</h2>
          <div style={{fontSize:13,color:GRAY,marginBottom:18}}>{edit.email}</div>
          <label style={lbl}>Voller Name</label><input style={inp} value={eName} onChange={e=>setEName(e.target.value)}/>
          <label style={{...lbl,marginTop:12}}>Rolle</label>
          <select style={{...inp,opacity:edit.id===myId?0.6:1}} value={eLevel} onChange={e=>setELevel(e.target.value)} disabled={edit.id===myId}>
            <option value="learner">Lernende</option><option value="manager">Manager</option><option value="admin">Administrator</option>
          </select>
          {edit.id===myId && <div style={{fontSize:11.5,color:GRAY,marginTop:4}}>Die eigene Rolle kann hier nicht geändert werden.</div>}
          <label style={{...lbl,marginTop:12}}>Abteilung</label>
          <select style={inp} value={eDept} onChange={e=>setEDept(e.target.value)}>
            <option value="">Keine Angabe</option>{depts.map(d=><option key={d.id} value={d.name}>{d.name}</option>)}
          </select>
          <label style={{...lbl,marginTop:12}}>Position</label><input style={inp} value={ePos} onChange={e=>setEPos(e.target.value)}/>
          {eMsg && <div style={{fontSize:12.5,color:RED,marginTop:10,lineHeight:1.5}}>{eMsg}</div>}
          {eLink && <div style={{marginTop:8,padding:'10px 12px',background:GOLD_PALE,border:`1px solid ${GOLD}`,borderRadius:9,fontFamily:FM,fontSize:11.5,color:NAVY,wordBreak:'break-all',lineHeight:1.5}}>{eLink}</div>}
          <div style={{display:'flex',gap:10,marginTop:18,flexWrap:'wrap'}}>
            <button disabled={eBusy} onClick={speichereEdit} style={{fontFamily:FB,fontSize:14,fontWeight:600,color:'#fff',background:GREEN,border:'none',borderRadius:10,padding:'10px 18px',cursor:'pointer'}}>{eBusy?'…':'Speichern'}</button>
            <button onClick={()=>setEdit(null)} style={{fontFamily:FB,fontSize:14,fontWeight:600,color:GRAY,background:'#fff',border:`1.5px solid ${LINE}`,borderRadius:10,padding:'10px 18px',cursor:'pointer'}}>Abbrechen</button>
            {edit.status==='eingeladen' && <button onClick={neuerLink} style={{fontFamily:FB,fontSize:14,fontWeight:600,color:GREEN,background:'#fff',border:`1.5px solid ${GREEN}`,borderRadius:10,padding:'10px 18px',cursor:'pointer'}}>Neuer Einladungslink</button>}
          </div>
          {edit.id!==myId && (
            <div style={{marginTop:18,paddingTop:16,borderTop:`1px solid ${LINE}`}}>
              {!confirmDel ? (
                <button onClick={()=>setConfirmDel(true)} style={{fontFamily:FB,fontSize:13,fontWeight:600,color:RED,background:'none',border:'none',cursor:'pointer',padding:0}}>Aus dem Team entfernen</button>
              ):(
                <div>
                  <div style={{fontSize:13,color:NAVY,marginBottom:8,lineHeight:1.5}}>{edit.full_name||edit.email} wirklich entfernen? Das Konto wird dauerhaft gelöscht.</div>
                  <div style={{display:'flex',gap:10}}>
                    <button disabled={eBusy} onClick={entferne} style={{fontFamily:FB,fontSize:13,fontWeight:600,color:'#fff',background:RED,border:'none',borderRadius:9,padding:'9px 16px',cursor:'pointer'}}>{eBusy?'…':'Ja, entfernen'}</button>
                    <button onClick={()=>setConfirmDel(false)} style={{fontFamily:FB,fontSize:13,fontWeight:600,color:GRAY,background:'none',border:'none',cursor:'pointer'}}>Abbrechen</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )}
  </AppShell>)
}
