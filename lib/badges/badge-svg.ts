// ============================================================
// KALYX — Open Badges: Badge-Grafik (SVG), drei Premium-Designs
// ============================================================
// Designs (Entwürfe vom 12.06.2026, alle streng in der CI):
//   praegesiegel  Siegelrand wie eine Prägemarke, Crème/Gold/Grün
//   guilloche     Feinlinien-Rosette (Wertpapier-Anmutung)
//   nachtgrund    Navy mit Verlauf, Mint-Trieb, Gold (Cover-Folie)
// Jedes Design hat eine Wasserzeichen-Variante: eine Farbe, nur
// Linien, ohne Kurstitel — für den Einsatz hinter Zertifikaten.
// Es werden keine Personendaten ins Bild geschrieben.

import { KALYX_SPROUT_PATHS } from './openbadge'
import type { BadgeDesign } from './design-config'

const GREEN = '#14613E', NAVY = '#0B1929', GOLD = '#B8904A', MINT = '#7FD4A8', CREAM = '#F5F4EF'
const FH = "Cormorant, 'Cormorant Garamond', Georgia, serif"
const FM = "'IBM Plex Mono', ui-monospace, monospace"
const S = 420, C = S / 2

export function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/** Kurstitel in maximal zwei Zeilen brechen (Rest mit …). */
export function zweiZeilen(titel: string, max = 24): string[] {
  const worte = titel.split(/\s+/)
  const zeilen: string[] = ['']
  for (const w of worte) {
    const z = zeilen[zeilen.length - 1]
    if ((z + ' ' + w).trim().length <= max) zeilen[zeilen.length - 1] = (z + ' ' + w).trim()
    else if (zeilen.length < 2) zeilen.push(w)
    else { zeilen[1] = zeilen[1].slice(0, max - 1).trimEnd() + '…'; break }
  }
  return zeilen.filter(Boolean)
}

function sprout(scale: number, cx: number, cy: number, color: string, width = 1.7): string {
  const x = cx - 12 * scale, y = cy - 12 * scale
  const paths = KALYX_SPROUT_PATHS.map(d => `<path d="${d}"/>`).join('')
  return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${scale})" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round">${paths}</g>`
}

/** Siegelrand: Bogenwellen wie bei einer Prägemarke. */
function siegelrand(cx: number, cy: number, r: number, bumps: number, depth: number): string {
  const step = (2 * Math.PI) / bumps
  let d = `M ${(cx + r).toFixed(2)} ${cy.toFixed(2)} `
  for (let i = 0; i < bumps; i++) {
    const a0 = i * step, a1 = (i + 1) * step
    const mx = cx + (r + depth) * Math.cos(a0 + step / 2)
    const my = cy + (r + depth) * Math.sin(a0 + step / 2)
    d += `Q ${mx.toFixed(2)} ${my.toFixed(2)} ${(cx + r * Math.cos(a1)).toFixed(2)} ${(cy + r * Math.sin(a1)).toFixed(2)} `
  }
  return d + 'Z'
}

/** Feinlinien-Rosette aus rotierten Ellipsen (Banknoten-Anmutung). */
function guillocheNetz(cx: number, cy: number, rx: number, ry: number, n: number, color: string, op: number, w = 0.45): string {
  let out = ''
  for (let i = 0; i < n; i++) {
    out += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${color}" stroke-width="${w}" opacity="${op}" transform="rotate(${((180 * i) / n).toFixed(2)} ${cx} ${cy})"/>`
  }
  return out
}

// Ringtexte: oberer Halbkreis im Uhrzeigersinn, unterer gegenläufig → beide aufrecht.
function bogenOben(id: string, r: number): string { return `<path id="${id}" fill="none" d="M ${C - r} ${C} A ${r} ${r} 0 1 1 ${C + r} ${C}"/>` }
function bogenUnten(id: string, r: number): string { return `<path id="${id}" fill="none" d="M ${C - r} ${C} A ${r} ${r} 0 0 0 ${C + r} ${C}"/>` }
function ringtext(text: string, href: string, color: string, size = 12.5, spacing = '0.3em', op = 1): string {
  return `<text font-family="${FM}" font-size="${size}" font-weight="500" fill="${color}" letter-spacing="${spacing}" opacity="${op}"><textPath href="#${href}" startOffset="50%" text-anchor="middle">${text}</textPath></text>`
}

function titelBlock(zeilen: string[], y: number, farbe: string, fs = 19, dy = 23): string {
  const tspans = zeilen.map((z, i) => `<tspan x="${C}" dy="${i === 0 ? 0 : dy}">${esc(z)}</tspan>`).join('')
  return `<text x="${C}" y="${y}" text-anchor="middle" font-family="${FH}" font-size="${fs}" font-weight="600" font-style="italic" fill="${farbe}">${tspans}</text>`
}

function wortmarke(y: number, farbe: string, linieY: number, fs = 34): string {
  return `<text x="${C}" y="${y}" text-anchor="middle" font-family="${FH}" font-size="${fs}" font-weight="700" fill="${farbe}" letter-spacing="7">KALYX</text>
<line x1="${C - 42}" y1="${linieY}" x2="${C + 42}" y2="${linieY}" stroke="${GOLD}" stroke-width="1.4"/>`
}

const TXT_OBEN = 'VERIFIZIERTER SCHULUNGSNACHWEIS'
const TXT_UNTEN = 'KALYX·ACADEMY · SCHWEIZ'

function svgKopf(baked: string | null): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"${baked ? ' xmlns:openbadges="http://openbadges.org"' : ''} viewBox="0 0 ${S} ${S}" width="${S}" height="${S}">${baked ? `\n  <openbadges:assertion verify="${esc(baked)}"/>` : ''}`
}

function dPraegesiegel(zl: string[], baked: string | null): string {
  const ty = zl.length === 2 ? 266 : 278
  return `${svgKopf(baked)}
<defs>${bogenOben('o1', 157)}${bogenUnten('u1', 171)}</defs>
<path d="${siegelrand(C, C, 196, 44, 7)}" fill="${CREAM}" stroke="${GOLD}" stroke-width="1.4"/>
<circle cx="${C}" cy="${C}" r="186" fill="none" stroke="${GREEN}" stroke-width="2.4"/>
<circle cx="${C}" cy="${C}" r="180" fill="none" stroke="${GOLD}" stroke-width="0.9"/>
${guillocheNetz(C, C, 176, 52, 26, GREEN, 0.10)}
<circle cx="${C}" cy="${C}" r="142" fill="${CREAM}" stroke="${GOLD}" stroke-width="1.1"/>
${ringtext(TXT_OBEN, 'o1', GREEN)}${ringtext(TXT_UNTEN, 'u1', GOLD)}
${sprout(5.2, C, 156, GREEN)}
${wortmarke(230, NAVY, 242)}
${titelBlock(zl, ty, GREEN)}
</svg>`
}

function dGuilloche(zl: string[], baked: string | null): string {
  const ty = zl.length === 2 ? 274 : 286
  return `${svgKopf(baked)}
<defs>${bogenOben('o2', 165)}${bogenUnten('u2', 179)}</defs>
<circle cx="${C}" cy="${C}" r="200" fill="${CREAM}"/>
<circle cx="${C}" cy="${C}" r="199" fill="none" stroke="${GREEN}" stroke-width="1.6"/>
${guillocheNetz(C, C, 196, 118, 36, GREEN, 0.13, 0.4)}
${guillocheNetz(C, C, 188, 30, 30, GOLD, 0.22, 0.4)}
<circle cx="${C}" cy="${C}" r="150" fill="${CREAM}" fill-opacity="0.94" stroke="${GREEN}" stroke-width="1.8"/>
<circle cx="${C}" cy="${C}" r="145" fill="none" stroke="${GOLD}" stroke-width="0.9"/>
${ringtext(TXT_OBEN, 'o2', GREEN, 11.5, '0.28em')}${ringtext('KALYX · KALYX·ACADEMY · SCHWEIZ', 'u2', GREEN, 11.5, '0.28em')}
${sprout(5.6, C, 160, GREEN)}
${wortmarke(238, NAVY, 250, 36)}
${titelBlock(zl, ty, GREEN, 18.5)}
</svg>`
}

function dNachtgrund(zl: string[], baked: string | null): string {
  const ty = zl.length === 2 ? 272 : 284
  return `${svgKopf(baked)}
<defs>${bogenOben('o3', 161)}${bogenUnten('u3', 175)}
<radialGradient id="g3" cx="50%" cy="42%" r="65%"><stop offset="0%" stop-color="#16263F"/><stop offset="100%" stop-color="${NAVY}"/></radialGradient></defs>
<circle cx="${C}" cy="${C}" r="200" fill="url(#g3)"/>
<circle cx="${C}" cy="${C}" r="199" fill="none" stroke="${GOLD}" stroke-width="1.6"/>
<circle cx="${C}" cy="${C}" r="190" fill="none" stroke="${MINT}" stroke-width="0.8" opacity="0.55"/>
${guillocheNetz(C, C, 186, 44, 22, MINT, 0.10, 0.4)}
<circle cx="${C}" cy="${C}" r="146" fill="none" stroke="${GOLD}" stroke-width="1"/>
${ringtext(TXT_OBEN, 'o3', MINT, 11.5, '0.3em', 0.92)}${ringtext(TXT_UNTEN, 'u3', GOLD, 11.5, '0.3em', 0.95)}
${sprout(5.6, C, 158, MINT)}
${wortmarke(236, '#FFFFFF', 248, 36)}
${titelBlock(zl, ty, MINT, 18.5)}
</svg>`
}

/**
 * Wasserzeichen: eine Farbe, dezente Linien — je Design-Silhouette.
 * Personalisiert, wenn Kurstitel/Zertifikatsnummer übergeben werden:
 *   - Kurstitel und Nummer stehen lesbar im Zeichen selbst
 *   - ein Mikrotext-Ring wiederholt die Nummer (Sicherheitsdruck-Prinzip:
 *     mit blossem Auge eine feine Linie, unter Vergrösserung lesbar)
 * Damit ist das Wasserzeichen an genau ein Zertifikat gebunden — die
 * Nummer im Hintergrund muss zur gedruckten Nummer passen.
 */
function dWasserzeichen(design: BadgeDesign, kursTitel?: string, certNr?: string): string {
  const rand = design === 'praegesiegel'
    ? `<path d="${siegelrand(C, C, 194, 44, 7)}" stroke-width="1.2"/>`
    : `<circle cx="${C}" cy="${C}" r="197" stroke-width="1.4"/>`
  const netz = design === 'guilloche'
    ? guillocheNetz(C, C, 190, 110, 24, GREEN, 0.4, 0.5)
    : guillocheNetz(C, C, 178, 50, 18, GREEN, 0.45, 0.5)

  // Personalisierung
  const zl = kursTitel ? zweiZeilen(kursTitel, 26) : []
  const titelXml = zl.length
    ? `<text x="${C}" y="${zl.length === 2 ? 262 : 272}" text-anchor="middle" font-family="${FH}" font-size="17" font-weight="600" font-style="italic" fill="${GREEN}">${zl.map((z, i) => `<tspan x="${C}" dy="${i === 0 ? 0 : 21}">${esc(z)}</tspan>`).join('')}</text>`
    : ''
  const nrXml = certNr
    ? `<text x="${C}" y="${zl.length === 2 ? 318 : 308}" text-anchor="middle" font-family="${FM}" font-size="13.5" font-weight="600" letter-spacing="0.22em" fill="${GREEN}">${esc(certNr)}</text>`
    : ''
  // Mikrotext-Ring: Nummer endlos wiederholt, winzig, zwischen den Innenringen.
  let mikro = ''
  if (certNr) {
    const einheit = `${esc(certNr)} \u00b7 KALYX \u00b7 `
    const umfang = 2 * Math.PI * 130
    const wdh = Math.max(6, Math.floor(umfang / (einheit.length * 3.6)))
    mikro = `<defs><path id="mw" fill="none" d="M ${C} ${C - 130} a 130 130 0 1 1 -0.01 0"/></defs>
<text font-family="${FM}" font-size="5.6" letter-spacing="0.1em" fill="${GREEN}" opacity="0.9"><textPath href="#mw">${einheit.repeat(wdh)}</textPath></text>
<circle cx="${C}" cy="${C}" r="136" fill="none" stroke="${GREEN}" stroke-width="0.5" opacity="0.6"/>
<circle cx="${C}" cy="${C}" r="124" fill="none" stroke="${GREEN}" stroke-width="0.5" opacity="0.6"/>`
  }

  return `${svgKopf(null)}
<defs>${bogenOben('ow', 158)}${bogenUnten('uw', 172)}</defs>
<g stroke="${GREEN}" fill="none">
${rand}
<circle cx="${C}" cy="${C}" r="184" stroke-width="1.6"/>
${netz}
<circle cx="${C}" cy="${C}" r="142" stroke-width="1.1"/>
</g>
${mikro}
${ringtext(TXT_OBEN, 'ow', GREEN, 12)}${ringtext(TXT_UNTEN, 'uw', GREEN, 12)}
${sprout(certNr || kursTitel ? 4.4 : 5.4, C, certNr || kursTitel ? 148 : 158, GREEN, 1.6)}
<text x="${C}" y="${certNr || kursTitel ? 218 : 240}" text-anchor="middle" font-family="${FH}" font-size="${certNr || kursTitel ? 30 : 34}" font-weight="700" fill="none" stroke="${GREEN}" stroke-width="0.9" letter-spacing="8">KALYX</text>
<line x1="${C - 40}" y1="${certNr || kursTitel ? 230 : 252}" x2="${C + 40}" y2="${certNr || kursTitel ? 230 : 252}" stroke="${GOLD}" stroke-width="1.2"/>
${titelXml}
${nrXml}
</svg>`
}

/**
 * Erzeugt das Badge-SVG.
 * @param kursTitel    Kurstitel (im Wasserzeichen nicht verwendet)
 * @param assertionUrl Prüf-URL; wenn gesetzt, wird sie nach SVG-Baking-
 *                     Spezifikation eingebettet (nicht im Wasserzeichen)
 * @param design       eines der drei Premium-Designs
 * @param wasserzeichen true → Linien-Variante für den Zertifikatshintergrund
 */
export function badgeSvg(kursTitel: string, assertionUrl: string | null, design: BadgeDesign = 'praegesiegel', wasserzeichen = false, certNr?: string): string {
  if (wasserzeichen) return dWasserzeichen(design, kursTitel || undefined, certNr)
  const zl = zweiZeilen(kursTitel)
  if (design === 'guilloche') return dGuilloche(zl, assertionUrl)
  if (design === 'nachtgrund') return dNachtgrund(zl, assertionUrl)
  return dPraegesiegel(zl, assertionUrl)
}
