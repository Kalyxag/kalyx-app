// Ziel-Pfad im Repo: app/berichte/page.tsx  (NEU)
//
// Analytics und Audit-Report für Admins und Manager:
// - Heatmap Abteilung mal Pflichtthema (Abdeckung in Prozent)
// - Gesamtquote und Quote je Abteilung
// - Detailtabelle je Person mit Bestehdatum
// - Export als CSV (Semikolon, Excel-tauglich) und als PDF über die Druckansicht
// Daten kommen serverseitig von /api/audit-report. Keine neuen Tabellen.
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import AppShell from '../components/AppShell'

const CREAM='#F5F4EF', NAVY='#0B1929', GREEN='#14613E', GOLD='#B8904A', GREEN_PALE='#E6F0EB', LINE='#E4E0D8', GRAY='#6B7280'
const FH="'Cormorant', Georgia, serif"
const FB="'Albert Sans', system-ui, -apple-system, sans-serif"
const FM="'IBM Plex Mono', ui-monospace, monospace"

type Erg={kurs_id:string;bestanden:boolean;datum:string|null}
type Person={name:string;abteilung:string;ergebnisse:Erg[];done:number}
type Zelle={kurs_id:string;prozent:number}
type Reihe={name:string;personen:number;zellen:Zelle[];schnitt:number}
type Pflicht={id:string;titel:string}
type Data={ok:boolean;mandant:string;stichdatum:string;pflicht:Pflicht[];personen:Person[];heatmap:Reihe[];gesamt_abdeckung:number;personen_anzahl:number;pflicht_anzahl:number}

function heat(p:number){
  if(p>=80) return {bg:'#dcefe4',fg:'#14613e'}
  if(p>=50) return {bg:'#f8f1e4',fg:'#8a6d1f'}
  if(p>=1)  return {bg:'#f6e4df',fg:'#9b2c2c'}
  return {bg:'#f3f1ec',fg:'#9CA3AF'}
}

function injectPrint(){
  if(typeof document==='undefined') return
  if(document.getElementById('kx-print-style')) return
  const s=document.createElement('style'); s.id='kx-print-style'
  s.textContent='@media print{body *{visibility:hidden!important}#audit-print,#audit-print *{visibility:visible!important}'
    +'#audit-print{position:absolute;left:0;top:0;width:100%;padding:0;margin:0}.kx-noprint{display:none!important}'
    +'@page{margin:16mm}}'
  document.head.appendChild(s)
}

export default function BerichtePage(){
  const router=useRouter()
  const [loading,setLoading]=useState(true)
  const [denied,setDenied]=useState(false)
  const [d,setD]=useState<Data|null>(null)

  useEffect(()=>{injectPrint();let on=true;(async()=>{
    const {data}=await supabase.auth.getSession();const session=data.session
    if(!session){router.replace('/anmelden');return}
    try{
      const r=await fetch('/api/audit-report',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({access_token:session.access_token})})
      const j=await r.json()
      if(!on)return
      if(!j?.ok){ setDenied(true); setLoading(false); return }
      setD(j); setLoading(false)
    }catch{ if(on){setDenied(true);setLoading(false)} }
  })();return()=>{on=false}},[router])

  function exportCSV(){
    if(!d) return
    const head=['Name','Abteilung',...d.pflicht.map(p=>p.titel),'Erfuellt','Quote']
    const lines=d.personen.map(p=>{
      const cells=d.pflicht.map(c=>{const e=p.ergebnisse.find(x=>x.kurs_id===c.id); return e&&e.bestanden?(e.datum||'bestanden'):'offen'})
      const quote=d.pflicht_anzahl>0?Math.round((p.done/d.pflicht_anzahl)*100):100
      return [p.name,p.abteilung,...cells,p.done+'/'+d.pflicht_anzahl,quote+'%']
    })
    const esc=(v:string)=>{const t=String(v); return /[";\n]/.test(t)?'"'+t.replace(/"/g,'""')+'"':t}
    const csv=[head,...lines].map(r=>r.map(esc).join(';')).join('\r\n')
    const blob=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'})
    const url=URL.createObjectURL(blob); const a=document.createElement('a')
    a.href=url; a.download='kalyx-compliance-'+d.stichdatum+'.csv'; a.click(); URL.revokeObjectURL(url)
  }

  const card:React.CSSProperties={background:'#fff',borderRadius:16,padding:24,border:`1px solid ${LINE}`,boxShadow:'0 1px 2px rgba(0,0,0,.03),0 10px 28px rgba(0,0,0,.05)',marginBottom:16}
  const eyebrow:React.CSSProperties={fontFamily:FM,fontSize:11,letterSpacing:'.18em',textTransform:'uppercase',color:GOLD}
  const btn:React.CSSProperties={fontFamily:FB,fontSize:13.5,fontWeight:600,border:`1px solid ${GREEN}`,background:'#fff',color:GREEN,borderRadius:9,padding:'9px 16px',cursor:'pointer'}
  const btnP:React.CSSProperties={...btn,background:GREEN,color:'#fff'}

  if(loading) return <AppShell active="berichte"><div style={{color:GRAY,fontFamily:FB}}>Lade Auswertung …</div></AppShell>

  if(denied) return <AppShell active="berichte">
    <div style={eyebrow}>Berichte</div>
    <h1 style={{fontFamily:FH,fontSize:32,fontWeight:600,color:NAVY,margin:'4px 0 14px'}}>Analytics und Audit-Report</h1>
    <div style={card}><p style={{fontFamily:FB,fontSize:15,color:GRAY,lineHeight:1.6,margin:0}}>Diese Auswertung ist Admins und Managern vorbehalten. Melde dich mit einer entsprechenden Rolle an, um die Abdeckung je Abteilung und den Audit-Report zu sehen.</p></div>
  </AppShell>

  if(!d) return <AppShell active="berichte"><div style={{color:GRAY,fontFamily:FB}}>Keine Daten.</div></AppShell>

  const leer=d.pflicht_anzahl===0
  const code=(i:number)=>'P'+(i+1)

  return(<AppShell active="berichte">
    <div className="kx-noprint" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:12,marginBottom:18}}>
      <div>
        <div style={eyebrow}>Berichte</div>
        <h1 style={{fontFamily:FH,fontSize:32,fontWeight:600,color:NAVY,margin:'4px 0 0'}}>Analytics und Audit-Report</h1>
      </div>
      {!leer && (
        <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
          <button style={btn} onClick={exportCSV}>CSV exportieren</button>
          <button style={btnP} onClick={()=>window.print()}>Als PDF speichern</button>
        </div>
      )}
    </div>

    {leer ? (
      <div style={card}><p style={{fontFamily:FB,fontSize:15,color:GRAY,lineHeight:1.6,margin:0}}>Für diesen Mandanten sind noch keine Pflichtthemen hinterlegt. Sobald Pflichtkurse vergeben sind, erscheinen hier die Heatmap und der Audit-Report.</p></div>
    ) : (
    <div id="audit-print">
      {/* Kopf des Berichts */}
      <div style={card}>
        <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:16,alignItems:'flex-start'}}>
          <div>
            <div style={eyebrow}>Compliance-Schulungsnachweis</div>
            <div style={{fontFamily:FH,fontSize:26,fontWeight:700,color:NAVY,marginTop:4}}>{d.mandant}</div>
            <div style={{fontFamily:FM,fontSize:12.5,color:GRAY,marginTop:4}}>Stichdatum {d.stichdatum} · {d.personen_anzahl} Personen · {d.pflicht_anzahl} Pflichtthemen</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontFamily:FH,fontSize:44,fontWeight:700,color:d.gesamt_abdeckung>=80?GREEN:d.gesamt_abdeckung>=50?GOLD:'#9b2c2c',lineHeight:1}}>{d.gesamt_abdeckung}%</div>
            <div style={{fontFamily:FB,fontSize:12.5,color:GRAY}}>Gesamtabdeckung</div>
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div style={card}>
        <h2 style={{fontFamily:FH,fontSize:22,fontWeight:600,color:NAVY,marginBottom:4}}>Heatmap: Abteilung und Thema</h2>
        <p style={{fontFamily:FB,fontSize:13,color:GRAY,marginBottom:14}}>Anteil der Personen je Abteilung, die das Pflichtthema bestanden haben.</p>
        <div style={{overflowX:'auto'}}>
          <table style={{borderCollapse:'collapse',width:'100%',minWidth:480}}>
            <thead>
              <tr>
                <th style={{textAlign:'left',padding:'8px 10px',fontFamily:FM,fontSize:11,color:GRAY,borderBottom:`1px solid ${LINE}`}}>Abteilung</th>
                {d.pflicht.map((p,i)=>(
                  <th key={p.id} title={p.titel} style={{padding:'8px 8px',fontFamily:FM,fontSize:11,color:GRAY,borderBottom:`1px solid ${LINE}`,textAlign:'center'}}>{code(i)}</th>
                ))}
                <th style={{padding:'8px 10px',fontFamily:FM,fontSize:11,color:GRAY,borderBottom:`1px solid ${LINE}`,textAlign:'right'}}>Schnitt</th>
              </tr>
            </thead>
            <tbody>
              {d.heatmap.map((row,ri)=>(
                <tr key={ri}>
                  <td style={{padding:'8px 10px',fontSize:13,color:NAVY,borderBottom:`1px solid ${CREAM}`,whiteSpace:'nowrap'}}>{row.name} <span style={{color:GRAY,fontSize:11}}>· {row.personen}</span></td>
                  {row.zellen.map(z=>{const h=heat(z.prozent);return(
                    <td key={z.kurs_id} style={{padding:4,borderBottom:`1px solid ${CREAM}`,textAlign:'center'}}>
                      <div style={{background:h.bg,color:h.fg,fontFamily:FM,fontSize:11.5,fontWeight:600,borderRadius:6,padding:'7px 0'}}>{z.prozent}</div>
                    </td>
                  )})}
                  <td style={{padding:'8px 10px',textAlign:'right',fontFamily:FM,fontSize:12.5,fontWeight:700,color:row.schnitt>=80?GREEN:row.schnitt>=50?GOLD:'#9b2c2c',borderBottom:`1px solid ${CREAM}`}}>{row.schnitt}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{marginTop:12,display:'flex',flexWrap:'wrap',gap:'4px 16px'}}>
          {d.pflicht.map((p,i)=>(
            <span key={p.id} style={{fontFamily:FB,fontSize:11.5,color:GRAY}}><b style={{fontFamily:FM,color:NAVY}}>{code(i)}</b> {p.titel}</span>
          ))}
        </div>
      </div>

      {/* Detailtabelle je Person */}
      <div style={card}>
        <h2 style={{fontFamily:FH,fontSize:22,fontWeight:600,color:NAVY,marginBottom:14}}>Nachweis je Person</h2>
        <div style={{overflowX:'auto'}}>
          <table style={{borderCollapse:'collapse',width:'100%',minWidth:520}}>
            <thead>
              <tr style={{background:'#faf9f5'}}>
                <th style={{textAlign:'left',padding:'9px 10px',fontFamily:FM,fontSize:10.5,letterSpacing:.4,textTransform:'uppercase',color:GRAY,borderBottom:`1px solid ${LINE}`}}>Person</th>
                <th style={{textAlign:'left',padding:'9px 10px',fontFamily:FM,fontSize:10.5,letterSpacing:.4,textTransform:'uppercase',color:GRAY,borderBottom:`1px solid ${LINE}`}}>Abteilung</th>
                {d.pflicht.map((p,i)=>(<th key={p.id} title={p.titel} style={{padding:'9px 8px',fontFamily:FM,fontSize:10.5,color:GRAY,borderBottom:`1px solid ${LINE}`,textAlign:'center'}}>{code(i)}</th>))}
                <th style={{padding:'9px 10px',fontFamily:FM,fontSize:10.5,color:GRAY,borderBottom:`1px solid ${LINE}`,textAlign:'right'}}>Quote</th>
              </tr>
            </thead>
            <tbody>
              {d.personen.map((p,pi)=>{
                const quote=d.pflicht_anzahl>0?Math.round((p.done/d.pflicht_anzahl)*100):100
                return(
                  <tr key={pi}>
                    <td style={{padding:'9px 10px',fontSize:13,color:NAVY,fontWeight:600,borderBottom:`1px solid ${CREAM}`,whiteSpace:'nowrap'}}>{p.name}</td>
                    <td style={{padding:'9px 10px',fontSize:12.5,color:GRAY,borderBottom:`1px solid ${CREAM}`,whiteSpace:'nowrap'}}>{p.abteilung}</td>
                    {p.ergebnisse.map(e=>(
                      <td key={e.kurs_id} style={{padding:'9px 8px',textAlign:'center',borderBottom:`1px solid ${CREAM}`}}>
                        {e.bestanden
                          ? <span title={e.datum||'bestanden'} style={{fontFamily:FM,fontSize:11,fontWeight:700,color:GREEN}}>{e.datum||'ja'}</span>
                          : <span style={{fontFamily:FM,fontSize:11,color:'#b9573f'}}>offen</span>}
                      </td>
                    ))}
                    <td style={{padding:'9px 10px',textAlign:'right',fontFamily:FM,fontSize:12.5,fontWeight:700,color:quote>=80?GREEN:quote>=50?GOLD:'#9b2c2c',borderBottom:`1px solid ${CREAM}`}}>{quote}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p style={{fontFamily:FM,fontSize:11,color:GRAY,marginTop:14,lineHeight:1.6}}>Dieser Bericht dokumentiert KALYX-interne Schulungsnachweise (bestandene Übungsprüfungen) und ersetzt keine offizielle Branchenzertifizierung. Erstellt am {d.stichdatum} für {d.mandant}.</p>
      </div>
    </div>
    )}
  </AppShell>)
}
