// Ziel-Pfad im Repo: app/skills/page.tsx  (NEU)
'use client'

import AppShell from '../components/AppShell'

const NAVY='#0B1929', GREEN='#14613E', GOLD='#B8904A', GREEN_PALE='#E6F0EB', LINE='#E4E0D8', GRAY='#6B7280'
const FH="'Cormorant', Georgia, serif"; const FB="'Albert Sans', system-ui, sans-serif"; const FM="'IBM Plex Mono', ui-monospace, monospace"

export default function SkillsPage(){
  const card:React.CSSProperties={background:'#fff',borderRadius:16,padding:'24px 24px',border:`1px solid ${LINE}`,boxShadow:'0 1px 2px rgba(0,0,0,.03),0 10px 28px rgba(0,0,0,.05)'}
  const eyebrow:React.CSSProperties={fontFamily:FM,fontSize:11,letterSpacing:'.18em',textTransform:'uppercase',color:GOLD}
  const step=(n:string,t:string,d:string)=>(
    <div style={{display:'flex',gap:12,alignItems:'flex-start',padding:'10px 0',borderBottom:`1px solid #F0EEE8`}}>
      <span style={{flexShrink:0,width:26,height:26,borderRadius:8,background:GREEN_PALE,color:GREEN,fontFamily:FM,fontSize:12,display:'flex',alignItems:'center',justifyContent:'center'}}>{n}</span>
      <div><div style={{fontSize:14.5,fontWeight:600,color:NAVY}}>{t}</div><div style={{fontSize:13.5,color:GRAY,lineHeight:1.55}}>{d}</div></div>
    </div>
  )
  return(<AppShell active="skills">
    <div style={eyebrow}>Skills-Matrix</div>
    <h1 style={{fontFamily:FH,fontSize:32,fontWeight:600,color:NAVY,margin:'4px 0 18px'}}>Kompetenzen im Blick</h1>
    <div className="kx-card" style={card}>
      <div style={{fontFamily:FH,fontSize:22,fontWeight:600,color:NAVY,marginBottom:6}}>In Vorbereitung</div>
      <p style={{fontSize:14.5,color:GRAY,lineHeight:1.65,marginBottom:14}}>Die Skills-Matrix zeigt künftig pro Person und Rolle, welche Kompetenzen vorhanden sind und wo Lücken bestehen. Sie entsteht automatisch aus euren Rollen, den absolvierten Kursen und den bestandenen Prüfungen, ihr müsst nichts doppelt pflegen.</p>
      <div style={{fontFamily:FM,fontSize:11,letterSpacing:'.12em',textTransform:'uppercase',color:GRAY,marginBottom:6}}>So wird sie gespeist</div>
      {step('1','Rollen definieren die Soll-Kompetenzen','Welche Fähigkeiten eine Rolle braucht, kommt aus eurer Organisation (Abteilungen & Rollen).')}
      {step('2','Kurse und Prüfungen liefern den Ist-Stand','Bestandene Prüfungen und abgeschlossene Kurse zahlen automatisch auf die Kompetenzen ein.')}
      {step('3','Lücken werden sichtbar','Die Matrix markiert, wo Soll und Ist auseinanderliegen, als Grundlage für gezielte Zuweisungen.')}
      <p style={{fontSize:12.5,color:GRAY,marginTop:14}}>Wir bauen sie, sobald Prüfungen und Nachweise im Alltag laufen, damit sie auf echten Daten aufsetzt statt auf Annahmen.</p>
    </div>
  </AppShell>)
}
