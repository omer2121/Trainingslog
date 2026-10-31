"use strict";
/* =====================================================================
   Kraftbuch · allgemeine Trainings-App
   Für alle Nutzer, nicht personalisiert: Einstieg mit Fragen, Plan aus
   Vorlagen, Training im Einfach-Modus (eine Übung nach der anderen) oder
   als Liste. Alle Daten bleiben auf dem Gerät (localStorage), kein Konto.
   ===================================================================== */
const KEY = "kraftbuch_v1", VER = 1, APP_VER = "0.1";

/* ---------- Helfer ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const escH = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"}[c]));
const nf0 = new Intl.NumberFormat("de-DE", {maximumFractionDigits:0});
const nf1 = new Intl.NumberFormat("de-DE", {maximumFractionDigits:1});
const nf2 = new Intl.NumberFormat("de-DE", {maximumFractionDigits:2});
const fmt0 = x => nf0.format(Math.round(x)), fmt1 = x => nf1.format(x);
const pad2 = n => String(n).padStart(2, "0");
const clock = s =>{ s = Math.max(0, Math.round(s)); return `${Math.floor(s / 60)}:${pad2(s % 60)}`; };
const dur = ms =>{ const m = Math.max(0, Math.round(ms / 60000)); return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${pad2(m % 60)} min`; };
const dateKey = t =>{ const d = new Date(t); return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; };
const todayKey = () => dateKey(Date.now());
/* Kalendertage über UTC-Mitternacht rechnen, damit die Zeitumstellung nichts verschiebt */
const keyDate = k =>{ const [y, m, d] = k.split("-").map(Number); return new Date(Date.UTC(y, m - 1, d)); };
const addDays = (k, n) =>{ const t = keyDate(k); t.setUTCDate(t.getUTCDate() + n); return t.toISOString().slice(0, 10); };
const dayNum = k => Math.round(keyDate(k).getTime() / 864e5);
const WD = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const dayLabel = k =>{ const t = keyDate(k); return `${WD[t.getUTCDay()]} ${pad2(t.getUTCDate())}.${pad2(t.getUTCMonth() + 1)}.`; };
const shortDate = k => dayLabel(k).slice(3);
const daysAgo = ts => dayNum(todayKey()) - dayNum(dateKey(ts));
const agoText = ts =>{ const n = daysAgo(ts); return n <= 0 ? "heute" : n === 1 ? "gestern" : `vor ${n} Tagen`; };
const weekStart = k => addDays(k, -((keyDate(k).getUTCDay() + 6) % 7));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const numv = v => (v === "" || v == null || isNaN(+v) ? null : +v);
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

/* ---------- Symbole (Linien-Icons, 24er Raster) ---------- */
const IC = {
  train:'<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9.5v5M20.5 9.5v5M6.5 12h11"/>',
  progress:'<path d="M4 4v16h16"/><path d="M8 15l3.5-4 3 2.5L19.5 8"/>',
  plan:'<rect x="5" y="4.5" width="14" height="16" rx="2.5"/><path d="M9 3.5h6v3H9z"/><path d="M8.5 11h7M8.5 15h4.5"/>',
  more:'<circle cx="6" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="18" cy="12" r="1.5" fill="currentColor" stroke="none"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><path d="M12 7.7v.1"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  timer:'<circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5V9.8"/><path d="M10 3h4"/>',
  trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5.5A2.5 2.5 0 0 0 8 9.5M16 6h2.5A2.5 2.5 0 0 1 16 9.5"/><path d="M12 13v4M9 20h6"/>',
  chevR:'<path d="M10 7l5 5-5 5"/>',
  chevL:'<path d="M14 7l-5 5 5 5"/>',
  x:'<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
  up:'<path d="M12 19V6M6.5 11.5L12 6l5.5 5.5"/>',
  down:'<path d="M12 5v13M6.5 12.5L12 18l5.5-5.5"/>',
  hold:'<path d="M5.5 12h13"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  trash:'<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 12.5h9l1-12.5"/>',
  swap:'<path d="M7 7.5h11l-3-3M17 16.5H6l3 3"/>',
  search:'<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/>',
  book:'<path d="M5 4.5h11a2 2 0 0 1 2 2V20H7a2 2 0 0 1-2-2z"/><path d="M5 18a2 2 0 0 1 2-2h11"/>',
  list:'<path d="M9 6.5h11M9 12h11M9 17.5h11M4.5 6.5v.1M4.5 12v.1M4.5 17.5v.1"/>',
  target:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".8" fill="currentColor"/>',
  user:'<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
  shield:'<path d="M12 3.5l7 3v5c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9v-5z"/>',
  heart:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  flame:'<path d="M12 21c4 0 6.5-2.6 6.5-6.2 0-3.6-2.9-5.6-4.3-9.3-.6 2-1.8 3.2-3.2 3.9-.3-1.4-1.1-2.6-2.1-3.4C8.2 9 5.5 11 5.5 14.8 5.5 18.4 8 21 12 21z"/>',
  home:'<path d="M4 11l8-6.5 8 6.5"/><path d="M6 10v9.5h12V10"/>',
  gym:'<path d="M6.5 7.5v9M17.5 7.5v9M4 10v4M20 10v4M6.5 12h11"/>',
  lvl1:'<path d="M6 19v-4"/><path d="M12 19v-8M18 19V7" opacity=".3"/>',
  lvl2:'<path d="M6 19v-4M12 19v-8"/><path d="M18 19V7" opacity=".3"/>',
  lvl3:'<path d="M6 19v-4M12 19v-8M18 19V7"/>',
  easy:'<circle cx="12" cy="12" r="9"/><path d="M8.5 14a4.5 4.5 0 0 0 7 0"/><path d="M9 9.5v.1M15 9.5v.1"/>',
  ok:'<circle cx="12" cy="12" r="9"/><path d="M8.5 15h7"/><path d="M9 9.5v.1M15 9.5v.1"/>',
  hard:'<circle cx="12" cy="12" r="9"/><path d="M8.5 16.5a4.5 4.5 0 0 1 7 0"/><path d="M8 9l2 1M16 9l-2 1"/>',
  play:'<path d="M8 5.5v13l10-6.5z"/>',
  copy:'<rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M5 15V6a1 1 0 0 1 1-1h9"/>',
  save:'<path d="M5.5 4.5h10.5l3.5 3.5v10.5a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1z"/><path d="M8.5 4.5v4.5h6.5V4.5M8 19.5v-5.5h8v5.5"/>',
  table:'<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M4 10h16M10 10v9"/>',
  bell:'<path d="M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5H5z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
  phone:'<rect x="7" y="3.5" width="10" height="17" rx="2.5"/><path d="M3.5 9v6M20.5 9v6"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/>',
  text:'<path d="M3.5 18L8.5 6l5 12M5.3 14h6.4"/><path d="M15 18l3-7 3 7M15.9 16h4.2"/>',
  scale:'<rect x="4" y="4" width="16" height="16" rx="3.5"/><path d="M8.5 10a5 5 0 0 1 7 0"/><path d="M12 10.5l1.4-2"/>',
  hist:'<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4.5 4.5v3h3"/><path d="M12 8.5V12l2.5 2"/>',
  cal:'<rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M4 9.5h16M9 3v4M15 3v4"/>',
  pen:'<path d="M15.5 5l3.5 3.5L8.5 19H5v-3.5z"/><path d="M13 7.5l3.5 3.5"/>',
  undo:'<path d="M9 7.5L5 11.5l4 4"/><path d="M5.5 11.5H14a5 5 0 0 1 0 10h-2"/>'
};
const icon = (n, cls = "") => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${IC[n] || ""}</svg>`;

/* =====================================================================
   Zustand und Speicher
   ===================================================================== */
const blank = () => ({v:VER, profile:null, plan:null, workouts:[], active:null, notes:{}, body:{}, custom:[], settings:{}, meta:{}});
let S = blank(), canSave = true, saveT = null;
function normalize(){
  if(!S || typeof S !== "object") S = blank();
  S.v = VER;
  if(!Array.isArray(S.workouts)) S.workouts = [];
  if(!Array.isArray(S.custom)) S.custom = [];
  for(const k of ["notes", "body", "settings", "meta"]) if(!S[k] || typeof S[k] !== "object") S[k] = {};
  if(S.active && !Array.isArray(S.active.ex)) S.active = null;
  if(S.plan && !Array.isArray(S.plan.days)) S.plan = null;
}
function load(){
  try{
    const raw = localStorage.getItem(KEY);
    if(raw) S = JSON.parse(raw);
  }catch(e){ canSave = false; }
  normalize();
}
function save(){
  if(!canSave) return;
  clearTimeout(saveT);
  saveT = setTimeout(flushSave, 350);
}
/* Beim Wegwechseln sofort speichern: iOS kann die App sonst vorher beenden */
function flushSave(){
  if(!canSave) return;
  clearTimeout(saveT);
  try{ localStorage.setItem(KEY, JSON.stringify(S)); }
  catch(e){ toast("Speichern nicht möglich. Ist der Speicher voll?"); }
}

/* ---------- Einstellungen ---------- */
const DEF = {simple:false, units:"kg", fs:"m", autoRest:true, sound:false, vibrate:true, wake:true};
const opt = k => (S.settings[k] ?? DEF[k]);
function setOpt(k, v){ S.settings[k] = v; save(); }
function applyFont(){ const fs = opt("fs"); document.documentElement.classList.toggle("fs-l", fs === "l"); document.documentElement.classList.toggle("fs-xl", fs === "xl"); }

/* ---------- Einheiten: gespeichert wird immer kg ---------- */
const LB = 2.20462;
const unit = () => opt("units") === "lb" ? "lb" : "kg";
const wDisp = kg =>{ const lb = unit() === "lb", v = lb ? kg * LB : kg, f = lb ? 10 : 100; return nf2.format(Math.round(v * f) / f); };
const wIn = kg => wDisp(kg).replace(/\./g, "");
const wNum = kg =>{ const lb = unit() === "lb", f = lb ? 10 : 100; return Math.round((lb ? kg * LB : kg) * f) / f; };
function parseW(raw){
  const v = parseFloat(String(raw).trim().replace(",", "."));
  if(isNaN(v) || v < 0) return "";
  return Math.round((unit() === "lb" ? v / LB : v) * 1000) / 1000;
}
function parseInt0(raw){ const v = parseInt(String(raw).trim(), 10); return isNaN(v) || v < 0 ? "" : v; }

/* =====================================================================
   Übungen, Ausstattung, Plan
   ===================================================================== */
function EX(id){ return EXERCISES[id] || S.custom.find(c => c.id === id) || {n:"Unbekannte Übung", m:"core", eq:["custom"], k:"i", s:[], f:"", q:""}; }
const repUnit = ex => ex.u === "s" ? "Sek." : "Wdh.";
function haveSet(equip, bar){
  const base = equip === "gym" ? ["bb", "rack", "bench", "db", "cable", "machine", "bar", "bw"] : equip === "home" ? ["db", "bench", "bw"] : ["bw"];
  const s = new Set(base); if(bar) s.add("bar"); return s;
}
function available(ex, have){ have = have || haveSet(S.profile ? S.profile.equip : "gym", S.profile && S.profile.bar); return ex.eq.includes("custom") || ex.eq.every(e => have.has(e)); }
function stepOf(ex){
  if(ex.bw) return 0;
  if(unit() === "lb") return (ex.step && ex.step <= 1 ? 2.5 : 5) / LB;
  return ex.step || 2.5;
}
const roundTo = (v, step) => step > 0 ? Math.round(Math.round(v / step) * step * 1000) / 1000 : v;

/* Sätze, Wiederholungen und Pause nach Ziel, Erfahrung und Position im Tag */
function prescribe(ex, p, idx){
  const c = ex.k === "c";
  let sets = p.level === "neu" ? (idx === 0 ? 3 : 2) : 3;
  if(p.level === "erfahren" && c && idx < 2) sets = 4;
  let lo, hi;
  if(ex.u === "s"){ lo = 20; hi = 45; }
  else if(p.goal === "kraft" && c && idx < 2 && !ex.bw){ lo = 4; hi = 6; }
  else if(p.goal === "fit"){ lo = c ? 10 : 12; hi = 15; }
  else if(ex.bw && c){ lo = 6; hi = 15; }
  else if(p.level === "neu"){ lo = c ? 8 : 10; hi = c ? 12 : 15; }
  else { lo = c ? 6 : 10; hi = c ? 10 : 15; }
  const rest = c ? (p.goal === "kraft" && idx < 2 ? 180 : 120) : 75;
  return {sets, lo, hi, rest};
}
function templateFor(days, level){
  if(days === 3 && level === "erfahren") return TEMPLATES["3p"];
  return TEMPLATES[clamp(days, 2, 6)];
}
function buildPlan(p){
  const tpl = templateFor(p.days, p.level), have = haveSet(p.equip, p.bar);
  const days = tpl.days.map(d =>{
    const used = new Set(), ex = [];
    for(const spec of d.s){
      const [slot, vs] = spec.split(":"), variant = +(vs || 0);
      let list = (p.level === "neu" && EASY[slot]) || SLOTS[slot];
      if(p.goal === "kraft" && STRONG[slot] && p.level !== "neu") list = [STRONG[slot], ...list.filter(x => x !== STRONG[slot])];
      const cand = list.filter(id => EXERCISES[id] && available(EXERCISES[id], have) && !used.has(id));
      if(!cand.length) continue;
      const id = cand[Math.min(variant, cand.length - 1)];
      used.add(id);
      ex.push({id, ...prescribe(EXERCISES[id], p, ex.length)});
    }
    return {id:uid(), n:d.n, ex};
  });
  return {name:tpl.name, days};
}
function estMinutes(day){
  let sec = 300;
  day.ex.forEach(e =>{ sec += e.sets * (e.rest + 45) + 60; });
  return Math.round(sec / 300) * 5;
}
function nextDayIdx(){
  if(!S.plan || !S.plan.days.length) return 0;
  for(let i = S.workouts.length - 1; i >= 0; i--){
    const k = S.plan.days.findIndex(d => d.id === S.workouts[i].dayId);
    if(k >= 0) return (k + 1) % S.plan.days.length;
  }
  return 0;
}

/* =====================================================================
   Verlauf, Vorschläge, Rekorde
   ===================================================================== */
const e1rm = (w, r) => w * (1 + r / 30);
const isDone = s => s && numv(s.r) > 0;
function lastLog(exId){
  for(let i = S.workouts.length - 1; i >= 0; i--){
    const e = S.workouts[i].ex.find(x => x.id === exId && x.log.some(isDone));
    if(e) return {w:S.workouts[i], e};
  }
  return null;
}
/* Doppelte Progression: alle Sätze am oberen Ende -> Gewicht hoch,
   mehr als die Hälfte unter dem Bereich -> etwas leichter, sonst halten */
function suggest(exId, lo, hi){
  const ex = EX(exId), L = lastLog(exId);
  if(!L) return null;
  const done = L.e.log.filter(isDone);
  const ws = done.map(s => numv(s.w)).filter(v => v != null && v > 0);
  const top = ws.length ? Math.max(...ws) : null;
  const allTop = done.every(s => +s.r >= hi), lows = done.filter(s => +s.r < lo).length;
  const u = repUnit(ex);
  if(ex.bw || top == null)
    return allTop ? {w:null, k:"up", txt:`Ziel erreicht: mehr ${u} oder schwerere Variante`} : {w:null, k:"hold", txt:`Ziel: mehr ${u} als letztes Mal`};
  const step = stepOf(ex);
  if(allTop) return {w:roundTo(top + step, step), k:"up", txt:`Steigern auf ${wDisp(roundTo(top + step, step))} ${unit()}`};
  if(lows > done.length / 2) return {w:roundTo(top * 0.93, step), k:"down", txt:`Etwas leichter: ${wDisp(roundTo(top * 0.93, step))} ${unit()}`};
  return {w:top, k:"hold", txt:`${wDisp(top)} ${unit()} halten, mehr Wiederholungen`};
}
function setValue(ex, s){ return !ex.bw && numv(s.w) > 0 ? e1rm(+s.w, +s.r) : +s.r; }
function bestOf(exId, before = Infinity){
  const ex = EX(exId); let best = null;
  for(const wk of S.workouts){
    if(wk.start >= before) continue;
    const e = wk.ex.find(x => x.id === exId); if(!e) continue;
    for(const s of e.log){ if(!isDone(s)) continue; const v = setValue(ex, s); if(!best || v > best.v) best = {v, w:numv(s.w), r:+s.r, t:wk.start}; }
  }
  return best;
}
function prsOf(w){
  const out = [];
  for(const e of w.ex){
    const ex = EX(e.id), before = bestOf(e.id, w.start); if(!before) continue;
    let top = null; for(const s of e.log){ if(!isDone(s)) continue; const v = setValue(ex, s); if(!top || v > top.v) top = {v, w:numv(s.w), r:+s.r}; }
    if(top && top.v > before.v + 1e-9) out.push({id:e.id, ...top});
  }
  return out;
}
const setText = (ex, s) => !ex.bw && numv(s.w) > 0 ? `${wDisp(+s.w)} × ${s.r}` : `${s.r} ${repUnit(ex)}`;

/* =====================================================================
   Darstellung
   ===================================================================== */
const hdr = $("#hdr"), main = $("#main");
let view = "train", OB = null, durT = null;

function render(){
  document.body.classList.toggle("ob", view === "ob");
  $$(".tab").forEach(t =>{ const on = t.dataset.v === view; t.classList.toggle("on", on); t.setAttribute("aria-current", on ? "page" : "false"); });
  clearInterval(durT); durT = null;
  if(view === "ob") renderOnboarding();
  else if(view === "train") S.active ? (opt("simple") ? renderGuided() : renderWorkout()) : renderHome();
  else if(view === "progress") renderProgress();
  else if(view === "plan") renderPlan();
  else renderMore();
  syncWake();
}
function go(v){
  if(v === view){ window.scrollTo({top:0, behavior:"smooth"}); return; }
  view = v; window.scrollTo(0, 0); render();
}

/* ---------- Einstieg ---------- */
const OB_STEPS = ["goal", "level", "days", "equip", "mode", "preview"];
function startOnboarding(fromProfile){
  const p = S.profile || {};
  OB = {step:0, edit:!!fromProfile, prev:view === "ob" ? "more" : view, d:{goal:p.goal || null, level:p.level || null, days:p.days || null, equip:p.equip || null, bar:!!p.bar,
    simple:S.profile ? opt("simple") : null, units:unit()}};
  view = "ob"; window.scrollTo(0, 0); render();
}
function optCard(k, v, ic, t, d){
  return `<button class="opt${OB.d[k] === v ? " on" : ""}" data-act="ob-pick" data-k="${k}" data-v="${v}" aria-pressed="${OB.d[k] === v}">${icon(ic)}<span><b>${escH(t)}</b><span>${escH(d)}</span></span></button>`;
}
function renderOnboarding(){
  hdr.innerHTML = "";
  const st = OB_STEPS[OB.step], d = OB.d;
  const dots = `<div class="ob-dots" aria-label="Schritt ${OB.step + 1} von ${OB_STEPS.length}">${OB_STEPS.map((_, i)=> `<i class="${i <= OB.step ? "on" : ""}"></i>`).join("")}</div>`;
  let body = "", ready = true;
  if(st === "goal"){
    ready = !!d.goal;
    body = `<h1 class="title">Was ist dein Ziel?</h1><p class="sub">Danach richten sich Wiederholungen und Pausen.</p>
      <div class="opts">${optCard("goal", "muskel", "flame", GOALS.muskel.t, GOALS.muskel.d)}${optCard("goal", "kraft", "trophy", GOALS.kraft.t, GOALS.kraft.d)}${optCard("goal", "fit", "heart", GOALS.fit.t, GOALS.fit.d)}</div>`;
  } else if(st === "level"){
    ready = !!d.level;
    body = `<h1 class="title">Wie viel Erfahrung hast du?</h1><p class="sub">Einsteiger bekommen weniger Sätze und leichtere Übungen.</p>
      <div class="opts">${optCard("level", "neu", "lvl1", LEVELS.neu.t, LEVELS.neu.d)}${optCard("level", "mittel", "lvl2", LEVELS.mittel.t, LEVELS.mittel.d)}${optCard("level", "erfahren", "lvl3", LEVELS.erfahren.t, LEVELS.erfahren.d)}</div>`;
  } else if(st === "days"){
    ready = !!d.days;
    body = `<h1 class="title">Wie oft pro Woche?</h1><p class="sub">Lieber realistisch als zu viel. 3 Tage sind ein sehr guter Start.</p>
      <div class="days-pick" role="group" aria-label="Trainingstage pro Woche">${[2, 3, 4, 5, 6].map(n => `<button data-act="ob-pick" data-k="days" data-v="${n}" class="${d.days === n ? "on" : ""}" aria-pressed="${d.days === n}" aria-label="${n} Tage">${n}</button>`).join("")}</div>`;
  } else if(st === "equip"){
    ready = !!d.equip;
    body = `<h1 class="title">Wo trainierst du?</h1><p class="sub">Die App wählt nur Übungen, die du machen kannst.</p>
      <div class="opts">${optCard("equip", "gym", "gym", SETUPS.gym.t, SETUPS.gym.d)}${optCard("equip", "home", "home", SETUPS.home.t, SETUPS.home.d)}${optCard("equip", "bw", "user", SETUPS.bw.t, SETUPS.bw.d)}</div>
      ${d.equip && d.equip !== "gym" ? `<label class="check"><input type="checkbox" data-ob="bar"${d.bar ? " checked" : ""}> Ich habe eine Klimmzugstange</label>` : ""}`;
  } else if(st === "mode"){
    ready = d.simple != null;
    body = `<h1 class="title">Wie willst du loggen?</h1><p class="sub">Du kannst das später unter „Mehr“ jederzeit ändern.</p>
      <div class="opts">${optCard("simple", true, "target", "Einfach", "Eine Übung nach der anderen, große Knöpfe, kein Fachchinesisch")}${optCard("simple", false, "list", "Ausführlich", "Alle Übungen auf einen Blick, mit RIR und allen Zahlen")}</div>
      <h4 class="sec-h">Gewicht in</h4>
      <div class="seg" style="margin-top:10px" role="group" aria-label="Einheit"><button data-act="ob-pick" data-k="units" data-v="kg" class="${d.units === "kg" ? "on" : ""}">kg</button><button data-act="ob-pick" data-k="units" data-v="lb" class="${d.units === "lb" ? "on" : ""}">lb</button></div>`;
  } else {
    OB.plan = buildPlan(d);
    body = `<h1 class="title">Dein Plan</h1><p class="sub">${escH(OB.plan.name)} · ${d.days} Tage pro Woche · ${escH(SETUPS[d.equip].t)}</p>
      ${OB.plan.days.map(day => `<section class="card"><h2>${escH(day.n)}</h2><div style="margin-top:6px">${day.ex.map(e =>{ const ex = EX(e.id);
        return `<div class="pl-row"><div><b>${escH(ex.n)}</b><span>${escH(MUSCLES[ex.m])}</span></div><div class="r">${e.sets} × ${e.lo}–${e.hi}</div></div>`; }).join("")}</div></section>`).join("")}
      <div class="note-box"><b>Wichtig:</b> Kraftbuch ersetzt keine ärztliche Beratung. Wenn du Vorerkrankungen oder Beschwerden hast, Medikamente nimmst oder lange nicht trainiert hast, sprich vorher mit deiner Ärztin oder deinem Arzt.</div>
      <p class="fine">Übungen, Sätze und Tage kannst du im Bereich „Plan“ jederzeit ändern.</p>`;
  }
  const last = OB.step === OB_STEPS.length - 1;
  main.innerHTML = `<div class="view">${dots}${body}
    <div class="ob-nav">${OB.step > 0 ? `<button class="btn" data-act="ob-back">${icon("chevL", "sm")}Zurück</button>` : OB.edit ? `<button class="btn" data-act="ob-cancel">Abbrechen</button>` : ""}
      <button class="btn primary" data-act="${last ? "ob-done" : "ob-next"}"${ready ? "" : " disabled"}>${last ? (OB.edit ? "Plan übernehmen" : "Los geht's") : "Weiter"}</button></div></div>`;
}
function finishOnboarding(){
  const d = OB.d;
  S.profile = {goal:d.goal, level:d.level, days:d.days, equip:d.equip, bar:!!d.bar};
  S.plan = OB.plan || buildPlan(S.profile);
  S.settings.simple = !!d.simple; S.settings.units = d.units;
  S.meta.homeDay = null;
  const edit = OB.edit; OB = null; save();
  view = "train"; window.scrollTo(0, 0); render();
  toast(edit ? "Neuer Plan übernommen" : "Dein Plan ist fertig");
}

/* ---------- Training: Start ---------- */
function weekCount(k = todayKey()){
  const mon = weekStart(k), sun = addDays(mon, 6);
  return S.workouts.filter(w =>{ const d = dateKey(w.start); return d >= mon && d <= sun; }).length;
}
function backupDue(){
  if(!canSave || S.meta.noBackup === todayKey() || S.workouts.length < 1) return false;
  return !S.meta.lastBackup || daysAgo(S.meta.lastBackup) >= 7;
}
function renderHome(){
  const days = S.plan ? S.plan.days : [];
  if(!days.length){ hdr.innerHTML = ""; main.innerHTML = `<div class="view"><h1 class="title">Kein Plan</h1><p class="sub">Erstelle zuerst einen Plan.</p><button class="btn primary block" data-act="new-plan">Plan erstellen</button></div>`; return; }
  const nx = nextDayIdx(), sel = S.meta.homeDay != null && days[S.meta.homeDay] ? S.meta.homeDay : nx, d = days[sel];
  const h = new Date().getHours(), hello = h < 11 ? "Guten Morgen" : h < 18 ? "Hallo" : "Guten Abend";
  const wc = weekCount(), goal = S.profile ? S.profile.days : days.length;
  hdr.innerHTML = `<div class="hdr-row"><h2 class="hdr-title">Training</h2><span class="pill static">${icon("cal", "sm")}${wc} von ${goal} diese Woche</span></div>`;
  let banners = "";
  if(backupDue()){
    const lb = S.meta.lastBackup;
    banners += `<div class="banner">${icon("save")}<div><p><b>${lb ? `Letzte Sicherung ${agoText(lb)}.` : "Noch keine Sicherung."}</b> Deine Daten liegen nur auf diesem Gerät.</p>
      <div class="acts"><button class="btn sm primary" data-act="backup-now">Jetzt sichern</button><button class="btn sm ghost" data-act="backup-later">Später</button></div></div></div>`;
  }
  main.innerHTML = `<div class="view">
    <p class="eyebrow">${escH(hello)}</p>
    <h1 class="title">${escH(d.n)}</h1>
    <p class="sub">${d.ex.length} Übungen · etwa ${estMinutes(d)} min${sel === nx ? " · als Nächstes dran" : ""}</p>
    <div class="day-tabs" role="group" aria-label="Trainingstag wählen">${days.map((x, i)=> `<button data-act="home-day" data-i="${i}" class="${i === sel ? "on" : ""}" aria-pressed="${i === sel}">${escH(x.n)}${i === nx ? "<em>nächstes</em>" : ""}</button>`).join("")}</div>
    ${banners}
    <section class="card">${d.ex.map(e =>{ const ex = EX(e.id), sg = suggest(e.id, e.lo, e.hi);
      return `<div class="pl-row"><div><b>${escH(ex.n)}</b><span>${escH(sg ? sg.txt : MUSCLES[ex.m])}</span></div><div class="r">${e.sets} × ${e.lo}–${e.hi}<span> ${repUnit(ex)}</span></div></div>`; }).join("")}</section>
    <button class="btn primary lg block" data-act="start" data-i="${sel}">${icon("play", "sm")}Training starten</button>
    <p class="fine">${opt("simple") ? "Einfach-Modus: Die App führt dich Satz für Satz durch das Training." : "Ausführlich: alle Übungen und Sätze als Liste."} Ändern unter „Mehr“.</p>
  </div>`;
}
function startWorkout(di){
  const d = S.plan.days[di];
  S.active = {id:uid(), dayId:d.id, dayName:d.n, start:Date.now(), ex:d.ex.map(e => ({id:e.id, sets:e.sets, lo:e.lo, hi:e.hi, rest:e.rest, log:[]})), g:0};
  S.meta.homeDay = null; save();
  window.scrollTo(0, 0); render();
}
function workoutHeader(){
  const a = S.active, done = a.ex.reduce((n, e)=> n + e.log.filter(isDone).length, 0), due = a.ex.reduce((n, e)=> n + e.sets, 0);
  hdr.innerHTML = `<div class="wk-head"><div class="lt"><b>${escH(a.dayName)}</b><span id="wk-dur">${dur(Date.now() - a.start)} · ${done}/${due} Sätze</span></div>
    <div class="seg" role="group" aria-label="Ansicht"><button data-act="mode" data-v="1" class="${opt("simple") ? "on" : ""}" aria-pressed="${opt("simple")}">Einfach</button><button data-act="mode" data-v="0" class="${opt("simple") ? "" : "on"}" aria-pressed="${!opt("simple")}">Liste</button></div></div>`;
  durT = setInterval(()=>{ const el = $("#wk-dur"); if(el && S.active) el.textContent = `${dur(Date.now() - S.active.start)} · ${S.active.ex.reduce((n, e)=> n + e.log.filter(isDone).length, 0)}/${due} Sätze`; }, 15000);
}

/* ---------- Training: Liste ---------- */
function rirTarget(){ return LEVELS[S.profile ? S.profile.level : "mittel"].rir; }
function placeholders(e, ex, s, sg, last){
  const ls = last && last.e.log[s];
  const w = sg && sg.w != null ? sg.w : ls && numv(ls.w) > 0 ? +ls.w : null;
  const r = sg && sg.k === "up" ? e.lo : ls && isDone(ls) ? +ls.r : null;
  return {w, r};
}
function setRow(e, ei, ex, s, sg, last){
  const cur = e.log[s] || {}, ph = placeholders(e, ex, s, sg, last), r = numv(cur.r), cls = ["set"];
  if(r != null && r > 0){ cls.push("done"); if(r >= e.hi) cls.push("go"); if(r < e.lo) cls.push("under"); }
  const val = x => x == null || x === "" ? "" : String(x).replace(".", ",");
  return `<div class="${cls.join(" ")}" data-s="${s}">
    <span class="sn">${s + 1}</span>
    ${ex.bw ? "" : `<input class="in" data-f="w" inputmode="decimal" enterkeyhint="next" autocomplete="off" aria-label="Satz ${s + 1}: Gewicht in ${unit()}" placeholder="${ph.w != null ? escH(wIn(ph.w)) : unit()}" value="${numv(cur.w) != null ? escH(wIn(+cur.w)) : ""}">`}
    <span class="fw"><input class="in" data-f="r" inputmode="numeric" enterkeyhint="next" autocomplete="off" aria-label="Satz ${s + 1}: ${repUnit(ex)}" placeholder="${ph.r != null ? ph.r : `${e.lo}–${e.hi}`}" value="${escH(val(cur.r))}"><i class="badge" aria-hidden="true">${icon(r != null && r < e.lo ? "down" : "up")}</i></span>
    <input class="in" data-f="rir" inputmode="numeric" enterkeyhint="done" autocomplete="off" aria-label="Satz ${s + 1}: Wiederholungen in Reserve" placeholder="${escH(rirTarget().split("–")[0])}" value="${escH(val(cur.rir))}">
    <button class="chk" data-act="chk" aria-label="Satz ${s + 1} abhaken">${icon("check")}</button>
  </div>`;
}
function verdictOf(e, ex){
  const done = e.log.filter(isDone);
  if(done.length < e.sets) return null;
  if(done.every(s => +s.r >= e.hi)) return {k:"up", t:"Nächstes Mal steigern", sub: ex.bw ? "schwerere Variante oder mehr Wdh." : `+${wDisp(stepOf(ex))} ${unit()}`};
  if(done.filter(s => +s.r < e.lo).length > done.length / 2) return {k:"down", t:"Nächstes Mal etwas leichter", sub:`unter ${e.lo} ${repUnit(ex)}`};
  return {k:"hold", t:"Gewicht halten", sub:`Ziel: ${e.hi} ${repUnit(ex)} in allen Sätzen`};
}
function footHtml(e, ex){
  const v = verdictOf(e, ex);
  return `${v ? `<div class="vd ${v.k}">${icon(v.k === "up" ? "up" : v.k === "down" ? "down" : "hold")}<span>${escH(v.t)}</span><em>${escH(v.sub)}</em></div>` : ""}
    <button class="btn sm" data-act="add-set">${icon("plus", "sm")}Satz</button>`;
}
/* Nach einer Eingabe nur Klassen und Fuß aktualisieren: die Felder bleiben stehen, der Fokus auch */
function updateCard(ei){
  const card = $(`#ex-${ei}`); if(!card) return;
  const e = S.active.ex[ei], ex = EX(e.id), complete = e.log.filter(isDone).length >= e.sets;
  card.classList.toggle("complete", complete);
  $(".ex-num", card).innerHTML = complete ? icon("check", "sm") : pad2(ei + 1);
  $$(".set", card).forEach(row =>{
    const cur = e.log[+row.dataset.s] || {}, r = numv(cur.r), d = r != null && r > 0;
    row.classList.toggle("done", d); row.classList.toggle("go", d && r >= e.hi); row.classList.toggle("under", d && r < e.lo);
    const bd = $(".badge", row); if(bd) bd.innerHTML = icon(d && r < e.lo ? "down" : "up");
  });
  $(".ex-foot", card).innerHTML = footHtml(e, ex);
}
function exCard(e, ei){
  const ex = EX(e.id), sg = suggest(e.id, e.lo, e.hi), last = lastLog(e.id), n = Math.max(e.sets, e.log.length);
  const done = e.log.filter(isDone).length, complete = done >= e.sets, note = S.notes[e.id] || "";
  const rows = []; for(let s = 0; s < n; s++) rows.push(setRow(e, ei, ex, s, sg, last));
  return `<section class="ex${complete ? " complete" : ""}" id="ex-${ei}" data-e="${ei}">
    <header class="ex-h"><span class="ex-num">${complete ? icon("check", "sm") : pad2(ei + 1)}</span>
      <div class="ex-t"><h3>${escH(ex.n)}</h3><p>${escH(MUSCLES[ex.m])}${ex.side ? " · je Seite" : ""}</p></div>
      <button class="ib" data-act="exinfo" aria-label="So geht's: ${escH(ex.n)}">${icon("info")}</button></header>
    <div class="ex-note${note ? " has" : ""}">${icon("pen")}<textarea class="nt" rows="1" maxlength="160" enterkeyhint="done" spellcheck="false" data-note="${escH(e.id)}" placeholder="Notiz: Sitz, Griff, Einstellung …" aria-label="Notiz zu ${escH(ex.n)}">${escH(note)}</textarea></div>
    <div class="meta"><span class="chip">${e.sets} × ${e.lo}–${e.hi} ${repUnit(ex)}</span><span class="chip">RIR ${escH(rirTarget())}</span>
      <button class="chip" data-act="rest" aria-label="Pause ${clock(e.rest)} starten">${icon("timer")}${clock(e.rest)}</button>
      ${sg ? `<span class="chip ${sg.k}">${icon(sg.k === "up" ? "up" : sg.k === "down" ? "down" : "hold")}${escH(sg.txt)}</span>` : ""}</div>
    <div class="sets${ex.bw ? " nokg" : ""}"><div class="sets-h" aria-hidden="true"><span>#</span>${ex.bw ? "" : `<span>${unit()}</span>`}<span>${repUnit(ex)}</span><span>RIR</span><span></span></div>${rows.join("")}</div>
    <div class="ex-foot">${footHtml(e, ex)}</div>
  </section>`;
}
function renderWorkout(){
  workoutHeader();
  const a = S.active;
  main.innerHTML = `<div class="view">
    <p class="fine" style="margin-top:0">RIR = Wiederholungen in Reserve: wie viele du noch geschafft hättest. Graue Zahlen sind Vorschläge, ✓ übernimmt sie.</p>
    <div id="cards">${a.ex.map(exCard).join("")}</div>
    <button class="btn block" data-act="lib-workout">${icon("plus", "sm")}Übung hinzufügen</button>
    <button class="btn primary lg block" data-act="finish">${icon("check", "sm")}Training beenden</button>
    <button class="btn danger block" data-act="discard">Training verwerfen</button>
    <div class="key"><span><i class="k-done">${icon("check")}</i>abgehakt</span><span><i class="k-go">${icon("up")}</i>oberes Ende erreicht</span><span><i class="k-under">${icon("down")}</i>unter dem Bereich</span></div>
  </div>`;
  $$("#main .nt").forEach(fitNote);
}
function fitNote(el){ el.style.height = "auto"; el.style.height = `${Math.max(38, el.scrollHeight + 2)}px`; }
function commitRow(row){
  const a = S.active, ei = +row.closest(".ex").dataset.e, s = +row.dataset.s, e = a.ex[ei];
  const wi = $(".in[data-f=w]", row), ri = $(".in[data-f=r]", row), ii = $(".in[data-f=rir]", row);
  const rec = {w: wi ? parseW(wi.value) : "", r:parseInt0(ri.value), rir:parseInt0(ii.value)};
  const prev = e.log[s] ? {...e.log[s]} : null;
  if(rec.w === "" && rec.r === "" && rec.rir === "") e.log[s] = null;
  else { rec.t = (prev && prev.t) || Date.now(); e.log[s] = rec; }
  save();
  return {ei, s, rec, prev};
}
function refreshCard(ei){
  const card = $(`#ex-${ei}`); if(!card) return;
  const y = window.scrollY;
  card.outerHTML = exCard(S.active.ex[ei], ei);
  $$(".nt", $(`#ex-${ei}`)).forEach(fitNote);
  window.scrollTo(0, y);
}
function onCheck(row){
  unlockAudio();
  const a = S.active, ei = +row.closest(".ex").dataset.e, s = +row.dataset.s, e = a.ex[ei];
  const wi = $(".in[data-f=w]", row), ri = $(".in[data-f=r]", row), ii = $(".in[data-f=rir]", row);
  if(ri.value.trim() === ""){
    const ph = ri.getAttribute("placeholder");
    if(!/^\d+$/.test(ph)){ row.classList.add("shake"); setTimeout(()=> row.classList.remove("shake"), 400); ri.focus(); return toast(`Erst die ${repUnit(EX(e.id))} eintragen`); }
    ri.value = ph;
    if(wi && wi.value.trim() === "" && /^[\d.,]+$/.test(wi.getAttribute("placeholder"))) wi.value = wi.getAttribute("placeholder");
    if(ii.value.trim() === "") ii.value = ii.getAttribute("placeholder");
  }
  const wasDone = e.log.filter(isDone).length >= e.sets;
  commitRow(row); haptic();
  const nowDone = e.log.filter(isDone).length >= e.sets;
  if(opt("autoRest") && !(nowDone && ei === a.ex.length - 1)) startRest(ei);
  updateCard(ei); workoutHeader();
  if(nowDone && !wasDone){ const next = $(`#ex-${ei + 1}`); if(next) setTimeout(()=> next.scrollIntoView({behavior:"smooth", block:"start"}), 380); }
}

/* ---------- Training: Einfach-Modus ---------- */
let G = {key:"", w:0, r:0};
function firstOpen(e){ for(let s = 0; s < e.sets; s++) if(!isDone(e.log[s])) return s; return -1; }
function renderGuided(){
  workoutHeader();
  const a = S.active, n = a.ex.length;
  if(a.g == null || a.g < 0) a.g = 0;
  const allDone = a.ex.every(e => firstOpen(e) < 0);
  if(a.g >= n){
    a.g = n;
    main.innerHTML = `<div class="view"><div class="g-finish"><h2>${allDone ? "Alle Übungen geschafft!" : "Ende der Liste"}</h2>
      <p>${allDone ? "Stark. Speichere dein Training." : "Ein paar Sätze sind noch offen. Du kannst trotzdem beenden."}</p>
      <button class="btn primary lg block" data-act="finish">${icon("check", "sm")}Training beenden</button></div>
      <div class="g-nav"><button class="btn" data-act="g-prev">${icon("chevL", "sm")}Zurück</button><button class="btn danger" data-act="discard">Verwerfen</button></div></div>`;
    return;
  }
  const e = a.ex[a.g], ex = EX(e.id), s = firstOpen(e), sg = suggest(e.id, e.lo, e.hi), last = lastLog(e.id);
  const pct = a.ex.reduce((x, y)=> x + y.log.filter(isDone).length, 0) / Math.max(1, a.ex.reduce((x, y)=> x + y.sets, 0)) * 100;
  const doneChips = e.log.filter(isDone).map((v, i)=> `<span class="chip">${icon("check")}Satz ${i + 1}: ${escH(setText(ex, v))}</span>`).join("");
  let card;
  if(s < 0){
    card = `<section class="g-card"><p class="g-set">Übung fertig</p><p class="g-tip">Alle ${e.sets} Sätze sind eingetragen.</p>
      <button class="btn primary lg block" data-act="g-next">${a.g < n - 1 ? "Nächste Übung" : "Zum Abschluss"}${icon("chevR", "sm")}</button></section>`;
  } else {
    const key = `${a.id}|${a.g}|${s}`;
    if(G.key !== key){
      const ph = placeholders(e, ex, s, sg, last), prevSet = s > 0 ? e.log[s - 1] : null;
      G = {key, w: ph.w != null ? ph.w : prevSet && numv(prevSet.w) > 0 ? +prevSet.w : 0, r: ph.r != null ? ph.r : prevSet && isDone(prevSet) ? +prevSet.r : e.lo};
    }
    const lvl = LEVELS[S.profile ? S.profile.level : "mittel"];
    card = `<section class="g-card" aria-live="polite">
      <p class="g-set">Satz ${s + 1} von ${e.sets}</p>
      <p class="g-tip">${e.lo}–${e.hi} ${ex.u === "s" ? "Sekunden halten" : "Wiederholungen"}${ex.side ? " je Seite" : ""}. ${escH(lvl.feel)}</p>
      ${sg ? `<p class="g-tip"><b>${escH(sg.txt)}</b></p>` : ""}
      ${ex.bw ? "" : `<div class="step"><button data-act="g-w" data-d="-1" aria-label="Gewicht weniger">−</button><div class="val"><b id="g-w">${wDisp(G.w)}</b><span>${unit()}${G.w === 0 ? " · tippe + für Gewicht" : ""}</span></div><button data-act="g-w" data-d="1" aria-label="Gewicht mehr">+</button></div>`}
      <div class="step"><button data-act="g-r" data-d="-1" aria-label="${repUnit(ex)} weniger">−</button><div class="val"><b id="g-r">${G.r}</b><span>${ex.u === "s" ? "Sekunden" : "Wiederholungen"}</span></div><button data-act="g-r" data-d="1" aria-label="${repUnit(ex)} mehr">+</button></div>
      <p class="g-q">Wie war der Satz?</p>
      <div class="feel"><button class="f-easy" data-act="g-feel" data-rir="3">${icon("easy")}Leicht</button><button class="f-ok" data-act="g-feel" data-rir="2">${icon("ok")}Passt</button><button class="f-hard" data-act="g-feel" data-rir="0">${icon("hard")}Sehr schwer</button></div>
    </section>`;
  }
  main.innerHTML = `<div class="view">
    <div class="g-top"><span>Übung ${a.g + 1} von ${n}</span><span class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(pct)}"><i style="width:${pct}%"></i></span></div>
    <h1 class="g-name">${escH(ex.n)}</h1>
    <p class="g-sub">${escH(MUSCLES[ex.m])}${S.notes[e.id] ? ` · ${escH(S.notes[e.id])}` : ""}</p>
    <div class="row2"><button class="btn" data-act="exinfo" data-e="${a.g}">${icon("play", "sm")}So geht's</button><button class="btn" data-act="rest" data-e="${a.g}">${icon("timer", "sm")}Pause ${clock(e.rest)}</button></div>
    ${card}
    ${doneChips ? `<div class="g-done">${doneChips}</div>` : ""}
    <div class="g-nav"><button class="btn" data-act="g-prev"${a.g === 0 ? " disabled" : ""}>${icon("chevL", "sm")}Zurück</button><button class="btn" data-act="g-next">${s < 0 ? "Weiter" : "Überspringen"}${icon("chevR", "sm")}</button></div>
    ${e.log.some(isDone) ? `<button class="btn ghost block" data-act="g-undo">${icon("undo", "sm")}Letzten Satz rückgängig</button>` : ""}
    <button class="btn block" data-act="finish">${icon("check", "sm")}Training beenden</button>
  </div>`;
}
function guidedLog(rir){
  unlockAudio();
  const a = S.active, e = a.ex[a.g], ex = EX(e.id), s = firstOpen(e);
  if(s < 0) return;
  if(!(G.r > 0)) return toast(`Erst die ${ex.u === "s" ? "Sekunden" : "Wiederholungen"} einstellen`);
  e.log[s] = {w: ex.bw || !(G.w > 0) ? "" : Math.round(G.w * 1000) / 1000, r:G.r, rir, t:Date.now()};
  save(); haptic();
  const exDone = firstOpen(e) < 0, lastEx = a.g === a.ex.length - 1;
  if(opt("autoRest") && !(exDone && lastEx)) startRest(a.g);
  if(exDone){ const nx = a.ex.findIndex((x, i)=> i > a.g && firstOpen(x) >= 0); a.g = nx >= 0 ? nx : a.ex.length; }
  render(); window.scrollTo(0, 0);
}

/* ---------- Training beenden ---------- */
let armT = null;
function arm(btn, txt, fn){
  if(!btn.classList.contains("armed")){
    const old = btn.innerHTML; btn.classList.add("armed"); btn.textContent = txt;
    clearTimeout(armT); armT = setTimeout(()=>{ btn.classList.remove("armed"); btn.innerHTML = old; }, 4000);
    return;
  }
  clearTimeout(armT); fn();
}
function finishWorkout(){
  const a = S.active;
  const ex = a.ex.map(e => ({id:e.id, log:e.log.filter(isDone)})).filter(e => e.log.length);
  if(!ex.length) return toast("Noch kein Satz eingetragen");
  const w = {id:a.id, dayId:a.dayId, dayName:a.dayName, start:a.start, end:Date.now(), ex};
  const prs = prsOf(w);
  S.workouts.push(w); S.active = null; S.meta.homeDay = null;
  flushSave(); hideDock(); render(); window.scrollTo(0, 0);
  openSummary(w, prs);
}
function workoutStats(w){
  let sets = 0, vol = 0;
  for(const e of w.ex){ const ex = EX(e.id); for(const s of e.log){ sets++; if(!ex.bw && numv(s.w) > 0) vol += +s.w * +s.r; } }
  return {sets, vol};
}
function openSummary(w, prs){
  const st = workoutStats(w);
  openSheet("Training gespeichert", `<p class="lead">${escH(w.dayName)} · ${dayLabel(dateKey(w.start))} · Gut gemacht!</p>
    <div class="trio"><div><span>Dauer</span><b>${dur(w.end - w.start)}</b></div><div><span>Sätze</span><b>${st.sets}</b></div><div><span>Volumen</span><b>${fmt0(unit() === "lb" ? st.vol * LB : st.vol)} ${unit()}</b></div></div>
    ${prs.length ? `<h4>Neue Rekorde</h4><ul class="pr-list">${prs.map(p =>{ const ex = EX(p.id); return `<li>${icon("trophy")}<span class="pn"><b>${escH(ex.n)}</b><span>${escH(setText(ex, p))}</span></span></li>`; }).join("")}</ul>` : ""}
    <button class="btn primary block" data-sa="close">Fertig</button>`, {click: el =>{ if(el.dataset.sa === "close") closeSheet(); }});
}

/* ---------- Übung: Anleitung, Video, Alternativen ---------- */
function openExInfo(exId, ctx = {}){
  const ex = EX(exId);
  const alts = Object.entries(EXERCISES).filter(([id, x])=> id !== exId && x.m === ex.m && available(x)).map(([id])=> id);
  const canSwap = ctx.mode === "workout" || ctx.mode === "plan";
  let b = `<p class="lead">${escH(MUSCLES[ex.m])} · ${ex.eq.map(e => EQUIP_NAMES[e]).join(", ")}${ex.side ? " · je Seite" : ""}</p>`;
  if(ex.s && ex.s.length) b += `<h4>So geht's</h4><ol>${ex.s.map(x => `<li>${escH(x)}</li>`).join("")}</ol>`;
  if(ex.f) b += `<h4>Typische Fehler</h4><p>${escH(ex.f)}</p>`;
  b += `<h4>Video</h4><a class="vid" href="https://www.youtube.com/results?search_query=${encodeURIComponent(ex.q || ex.n)}" target="_blank" rel="noopener">${icon("play", "sm")}<span><b>Auf YouTube ansehen</b>${escH(ex.q || ex.n)}</span></a>`;
  if(alts.length) b += `<h4>${canSwap ? "Tauschen gegen" : "Ähnliche Übungen"}</h4><div class="lib-list">${alts.map(id => `<button class="lib-it" data-sa="${canSwap ? "swap" : "info"}" data-id="${id}"><span class="lt"><b>${escH(EXERCISES[id].n)}</b><span>${EXERCISES[id].eq.map(e => EQUIP_NAMES[e]).join(", ")}</span></span>${icon(canSwap ? "swap" : "chevR", "sm")}</button>`).join("")}</div>`;
  b += `<p class="fine">Bei Schmerzen abbrechen und eine Alternative wählen. Die Videos stammen von YouTube und nicht von Kraftbuch.</p>`;
  openSheet(ex.n, b, {click: el =>{
    const id = el.dataset.id; if(!id) return;
    if(el.dataset.sa === "info") return openExInfo(id, ctx);
    if(ctx.mode === "workout"){
      const e = S.active.ex[ctx.ei];
      if(e.log.some(isDone)) return toast("Diese Übung hat schon Sätze. Füge die neue lieber hinzu.");
      e.id = id; save(); closeSheet(); render(); toast("Für heute getauscht");
    } else if(ctx.mode === "plan"){
      const pe = S.plan.days[ctx.di].ex[ctx.xi];
      pe.id = id; save(); closeSheet(); render(); toast("Im Plan getauscht");
    }
  }});
}

/* ---------- Übungsbibliothek ---------- */
function openLibrary(ctx = {mode:"browse"}){
  const F = {q:"", m:"", all:false};
  const items = () =>{
    const all = [...Object.entries(EXERCISES), ...S.custom.map(c => [c.id, c])];
    const q = F.q.trim().toLowerCase();
    return all.filter(([id, x])=> (F.all || available(x)) && (!F.m || x.m === F.m) && (!q || x.n.toLowerCase().includes(q)))
      .sort((a, b)=> MUSCLE_ORDER.indexOf(a[1].m) - MUSCLE_ORDER.indexOf(b[1].m) || a[1].n.localeCompare(b[1].n, "de"));
  };
  const listHtml = () =>{ const it = items(); return it.length ? it.map(([id, x])=> `<button class="lib-it" data-sa="pick" data-id="${escH(id)}"><span class="lt"><b>${escH(x.n)}</b><span>${escH(MUSCLES[x.m])} · ${x.eq.map(e => EQUIP_NAMES[e]).join(", ")}</span></span>${icon(ctx.mode === "browse" ? "chevR" : "plus", "sm")}</button>`).join("") : `<p class="empty-s">Keine Übung gefunden.</p>`; };
  const filtersHtml = () => `<button data-sa="m" data-m="" class="${F.m ? "" : "on"}">Alle</button>${MUSCLE_ORDER.map(m => `<button data-sa="m" data-m="${m}" class="${F.m === m ? "on" : ""}">${escH(MUSCLES[m])}</button>`).join("")}`;
  const title = ctx.mode === "browse" ? "Übungen" : "Übung hinzufügen";
  openSheet(title, `<input class="search" id="lib-q" type="search" placeholder="Suchen, z. B. Rudern" aria-label="Übung suchen" autocomplete="off">
    <div class="filters" id="lib-f">${filtersHtml()}</div>
    <label class="check"><input type="checkbox" id="lib-all"> Auch Übungen für andere Ausstattung zeigen</label>
    <div class="lib-list" id="lib-l">${listHtml()}</div>
    <button class="btn block" data-sa="custom">${icon("plus", "sm")}Eigene Übung anlegen</button>`, {
    input: el =>{ if(el.id === "lib-q"){ F.q = el.value; $("#lib-l").innerHTML = listHtml(); } },
    change: el =>{ if(el.id === "lib-all"){ F.all = el.checked; $("#lib-l").innerHTML = listHtml(); } },
    click: el =>{
      if(el.dataset.sa === "m"){ F.m = el.dataset.m; $("#lib-f").innerHTML = filtersHtml(); $("#lib-l").innerHTML = listHtml(); return; }
      if(el.dataset.sa === "custom") return openCustom(ctx);
      if(el.dataset.sa === "pick") return pickExercise(el.dataset.id, ctx);
    }
  });
}
function pickExercise(id, ctx){
  const ex = EX(id), p = S.profile || {goal:"muskel", level:"mittel"};
  if(ctx.mode === "browse") return openExInfo(id, {mode:"browse"});
  if(ctx.mode === "workout"){
    const pr = prescribe(ex, p, 3);
    S.active.ex.push({id, sets:pr.sets, lo:pr.lo, hi:pr.hi, rest:pr.rest, log:[]});
    save(); closeSheet(); render(); toast(`${ex.n} hinzugefügt`);
    if(!opt("simple")) setTimeout(()=>{ const c = $(`#ex-${S.active.ex.length - 1}`); if(c) c.scrollIntoView({behavior:"smooth", block:"start"}); }, 300);
    return;
  }
  if(ctx.mode === "plan"){
    const day = S.plan.days[ctx.di];
    day.ex.push({id, ...prescribe(ex, p, day.ex.length)});
    save(); render(); openDayEditor(ctx.di); toast(`${ex.n} hinzugefügt`);
  }
}
function openCustom(ctx){
  openSheet("Eigene Übung", `<label class="field">Name<input id="cu-n" maxlength="60" placeholder="z. B. Kabel-Rudern einarmig" autocomplete="off"></label>
    <label class="field">Muskel<select id="cu-m">${MUSCLE_ORDER.map(m => `<option value="${m}">${escH(MUSCLES[m])}</option>`).join("")}</select></label>
    <label class="check"><input type="checkbox" id="cu-bw"> Ohne Zusatzgewicht (nur Wiederholungen)</label>
    <button class="btn primary block" data-sa="ok">Anlegen</button>`, {click: el =>{
    if(el.dataset.sa !== "ok") return;
    const n = $("#cu-n").value.trim();
    if(!n){ $("#cu-n").focus(); return flash(el, "Name fehlt"); }
    const c = {id:"c_" + uid(), n, m:$("#cu-m").value, eq:["custom"], k:"i", step:2.5, bw:$("#cu-bw").checked, s:[], f:"", q:n, custom:true};
    S.custom.push(c); save();
    pickExercise(c.id, ctx.mode === "browse" ? {mode:"browse"} : ctx);
  }});
}

/* ---------- Fortschritt ---------- */
function exerciseSeries(exId){
  const ex = EX(exId), pts = [];
  for(const w of S.workouts){
    const e = w.ex.find(x => x.id === exId); if(!e) continue;
    let top = null; for(const s of e.log){ if(!isDone(s)) continue; const v = setValue(ex, s); if(!top || v > top.v) top = {v, s}; }
    if(top) pts.push({x:dayNum(dateKey(w.start)), y:top.v, k:dateKey(w.start), info:setText(ex, top.s)});
  }
  /* mehrere Einheiten am selben Tag: der beste Wert zählt */
  const by = new Map(); pts.forEach(p =>{ const o = by.get(p.x); if(!o || p.y > o.y) by.set(p.x, p); });
  return [...by.values()].sort((a, b)=> a.x - b.x);
}
function loggedExercises(){
  const seen = new Map();
  for(let i = S.workouts.length - 1; i >= 0; i--) for(const e of S.workouts[i].ex) if(!seen.has(e.id) && e.log.some(isDone)) seen.set(e.id, S.workouts[i].start);
  return [...seen.keys()];
}
function renderProgress(){
  hdr.innerHTML = `<div class="hdr-row"><h2 class="hdr-title">Fortschritt</h2></div>`;
  const goal = S.profile ? S.profile.days : 3, total = S.workouts.length, wc = weekCount();
  const since = Date.now() - 30 * 864e5, recent = S.workouts.filter(w => w.start >= since);
  const prCount = recent.reduce((n, w)=> n + prsOf(w).length, 0);
  const exs = loggedExercises(), pick = exs.includes(S.meta.pick) ? S.meta.pick : exs[0];
  const recs = exs.map(id => ({id, b:bestOf(id)})).filter(x => x.b).slice(0, 10);
  const today = todayKey(), bw = numv(S.body[today]);
  main.innerHTML = `<div class="view">
    <div class="kpis">
      <div class="kpi"><div class="lb">Trainings</div><div class="v">${total}</div></div>
      <div class="kpi"><div class="lb">Diese Woche</div><div class="v">${wc}<small> / ${goal}</small></div></div>
      <div class="kpi"><div class="lb">Rekorde 30 T.</div><div class="v">${prCount}</div></div>
    </div>
    <section class="card"><h2>Trainings pro Woche</h2><p class="cap">Letzte 8 Wochen, Montag bis Sonntag · gestrichelt: dein Ziel von ${goal}</p><div class="chart" id="ch-weeks"></div></section>
    <section class="card"><h2>Kraftverlauf</h2><p class="cap">Bester Satz pro Training (geschätztes Maximum; ohne Gewicht: Wiederholungen)</p>
      ${pick ? `<select class="sel" id="ex-pick" aria-label="Übung wählen">${exs.map(id => `<option value="${escH(id)}"${id === pick ? " selected" : ""}>${escH(EX(id).n)}</option>`).join("")}</select><div class="chart" id="ch-ex"></div><details class="tbl"><summary>Als Tabelle</summary><div id="tb-ex"></div></details>` : `<p class="empty-s">Nach deinem ersten Training siehst du hier deinen Verlauf.</p>`}
    </section>
    <section class="card"><h2>Rekorde</h2><p class="cap">Bester Satz je Übung</p>
      ${recs.length ? `<ul class="pr-list">${recs.map(x =>{ const ex = EX(x.id); return `<li>${icon("trophy")}<span class="pn"><b>${escH(ex.n)}</b><span>${escH(setText(ex, x.b))} · ${dayLabel(dateKey(x.b.t))}</span></span><span class="pv"><b>${ex.bw || x.b.w == null ? x.b.r : fmt1(unit() === "lb" ? x.b.v * LB : x.b.v)}</b>${ex.bw || x.b.w == null ? repUnit(ex) : `geschätzt ${unit()}`}</span></li>`; }).join("")}</ul>` : `<p class="empty-s">Noch keine Rekorde.</p>`}
    </section>
    <section class="card"><h2>Körpergewicht</h2><p class="cap">Morgens wiegen, die Linie zeigt den 7-Tage-Schnitt</p>
      <div class="wt-row"><input class="search" id="bw-in" inputmode="decimal" enterkeyhint="done" autocomplete="off" placeholder="Heute in ${unit()}" aria-label="Körpergewicht heute in ${unit()}" value="${bw != null ? escH(wIn(bw)) : ""}"><button class="btn primary" data-act="bw-save">Speichern</button></div>
      <div class="chart" id="ch-bw"></div>
    </section>
    <section class="card"><h2>Verlauf</h2><p class="cap">Deine letzten Trainings</p>
      ${S.workouts.length ? S.workouts.slice(-30).reverse().map(w =>{ const st = workoutStats(w); return `<button class="hist" data-act="wk-open" data-id="${w.id}"><span class="lt"><b>${escH(w.dayName)}</b><span>${dayLabel(dateKey(w.start))} · ${st.sets} Sätze · ${dur(w.end - w.start)}</span></span>${icon("chevR", "sm")}</button>`; }).join("") : `<p class="empty-s">Noch kein Training gespeichert.</p>`}
    </section>
  </div>`;
  mountProgressCharts(pick);
}
function mountProgressCharts(pick){
  const mon = weekStart(todayKey()), goal = S.profile ? S.profile.days : 3;
  const weeks = Array.from({length:8}, (_, i)=>{ const m = addDays(mon, -7 * (7 - i)); return {x:shortDate(m), y:weekCount(m), tip:`Woche ab ${dayLabel(m)}`}; });
  barChart($("#ch-weeks"), weeks, {goal, label:"Trainings pro Woche"});
  if(pick) drawExercise(pick);
  const keys = Object.keys(S.body).filter(k => numv(S.body[k]) != null).sort().filter(k => k >= addDays(todayKey(), -55));
  const avg = k =>{ let s = 0, n = 0; for(let i = 0; i < 7; i++){ const v = numv(S.body[addDays(k, -i)]); if(v != null){ s += v; n++; } } return s / n; };
  const pts = keys.map(k => ({x:dayNum(k), y:unit() === "lb" ? avg(k) * LB : avg(k), k, info:`Waage ${wDisp(+S.body[k])} ${unit()}`}));
  const host = $("#ch-bw");
  if(pts.length > 1) lineChart(host, pts, {unit:unit(), h:150, label:"Körpergewicht, 7-Tage-Schnitt", xf: p => shortDate(p.k), tf: p => `${dayLabel(p.k)} · ${p.info}`});
  else host.innerHTML = `<p class="fine">${pts.length ? "Ab dem zweiten Tag wird daraus ein Verlauf." : "Trag dein Gewicht ein, dann entsteht hier ein Verlauf."}</p>`;
}
function drawExercise(id){
  const ex = EX(id), pts = exerciseSeries(id), host = $("#ch-ex"), lb = unit() === "lb", loaded = !ex.bw && pts.some(p => /×/.test(p.info));
  const shown = pts.map(p => ({...p, y: loaded && lb ? p.y * LB : p.y}));
  const u = loaded ? unit() : repUnit(ex);
  if(shown.length > 1) lineChart(host, shown, {unit:u, label:`${ex.n}, ${loaded ? "geschätztes Maximum" : repUnit(ex)}`, xf: p => shortDate(p.k), tf: p => `${dayLabel(p.k)} · ${p.info}`});
  else host.innerHTML = `<p class="fine">Ab dem zweiten Training mit dieser Übung wird daraus ein Verlauf.</p>`;
  $("#tb-ex").innerHTML = `<table class="t"><thead><tr><th>Datum</th><th>Bester Satz</th><th>${loaded ? `geschätzt ${unit()}` : u}</th></tr></thead><tbody>${shown.slice().reverse().map(p => `<tr><td>${dayLabel(p.k)}</td><td>${escH(p.info)}</td><td>${fmt1(p.y)}</td></tr>`).join("")}</tbody></table>`;
}
function openWorkoutDetail(id){
  const w = S.workouts.find(x => x.id === id); if(!w) return;
  const st = workoutStats(w);
  openSheet(w.dayName, `<p class="lead">${dayLabel(dateKey(w.start))} · ${dur(w.end - w.start)} · ${st.sets} Sätze</p>
    ${w.ex.map(e =>{ const ex = EX(e.id); return `<h4>${escH(ex.n)}</h4><div class="hs-row">${e.log.map(s => `<span class="hs"><b>${escH(!ex.bw && numv(s.w) > 0 ? `${wDisp(+s.w)} × ${s.r}` : `${s.r} ${repUnit(ex)}`)}</b><small>RIR ${s.rir === "" || s.rir == null ? "–" : s.rir}</small></span>`).join("")}</div>`; }).join("")}
    <button class="btn danger block" data-sa="del">${icon("trash", "sm")}Training löschen</button>`, {click: el =>{
    if(el.dataset.sa !== "del") return;
    arm(el, "Wirklich löschen?", ()=>{ S.workouts = S.workouts.filter(x => x.id !== id); save(); closeSheet(); render(); toast("Training gelöscht"); });
  }});
}

/* ---------- Plan ---------- */
function renderPlan(){
  hdr.innerHTML = `<div class="hdr-row"><h2 class="hdr-title">Plan</h2>${S.profile ? `<span class="pill static">${S.profile.days} Tage</span>` : ""}</div>`;
  if(!S.plan){ main.innerHTML = `<div class="view"><p class="empty-s">Noch kein Plan.</p><button class="btn primary block" data-act="new-plan">Plan erstellen</button></div>`; return; }
  const p = S.profile;
  main.innerHTML = `<div class="view">
    <p class="eyebrow">${p ? `${escH(GOALS[p.goal].t)} · ${escH(LEVELS[p.level].t)}` : ""}</p>
    <h1 class="title">${escH(S.plan.name)}</h1>
    <p class="sub">${p ? `${escH(SETUPS[p.equip].t)}${p.bar ? " · mit Klimmzugstange" : ""}` : ""}</p>
    ${S.plan.days.map((d, di)=> `<section class="card"><div class="hdr-row"><h2 style="margin-right:auto">${escH(d.n)}</h2><span class="chip">etwa ${estMinutes(d)} min</span></div>
      <div style="margin-top:4px">${d.ex.length ? d.ex.map(e =>{ const ex = EX(e.id); return `<div class="pl-row"><div><b>${escH(ex.n)}</b><span>${escH(MUSCLES[ex.m])} · Pause ${clock(e.rest)}</span></div><div class="r">${e.sets} × ${e.lo}–${e.hi}<span> ${repUnit(ex)}</span></div></div>`; }).join("") : `<p class="empty-s">Noch keine Übungen.</p>`}</div>
      <button class="btn sm block" data-act="day-edit" data-d="${di}">${icon("pen", "sm")}Tag bearbeiten</button></section>`).join("")}
    <button class="btn block" data-act="lib-browse">${icon("book", "sm")}Übungsbibliothek</button>
    <button class="btn block" data-act="new-plan">${icon("swap", "sm")}Neuen Plan erstellen</button>
    <p class="fine">Ein neuer Plan ersetzt nur die Übungsliste. Deine gespeicherten Trainings bleiben erhalten.</p>
  </div>`;
}
function openDayEditor(di){
  const d = S.plan.days[di];
  const rows = () => d.ex.map((e, xi)=>{ const ex = EX(e.id); return `<div class="ed-row"><div class="ed-t"><b>${escH(ex.n)}</b><span>${e.sets} × ${e.lo}–${e.hi} ${repUnit(ex)} · Pause ${clock(e.rest)}</span></div>
    <div class="pl-acts"><button class="ib" data-sa="up" data-x="${xi}" aria-label="Nach oben"${xi === 0 ? " disabled" : ""}>${icon("up", "sm")}</button><button class="ib" data-sa="down" data-x="${xi}" aria-label="Nach unten"${xi === d.ex.length - 1 ? " disabled" : ""}>${icon("down", "sm")}</button><button class="ib" data-sa="edit" data-x="${xi}" aria-label="Sätze und Wiederholungen ändern">${icon("pen", "sm")}</button><button class="ib" data-sa="swap" data-x="${xi}" aria-label="Übung tauschen">${icon("swap", "sm")}</button><button class="ib danger" data-sa="del" data-x="${xi}" aria-label="Übung entfernen">${icon("trash", "sm")}</button></div></div>`; }).join("") || `<p class="empty-s">Noch keine Übungen.</p>`;
  openSheet("Tag bearbeiten", `<label class="field">Name des Tages<input id="de-n" maxlength="40" value="${escH(d.n)}" autocomplete="off"></label>
    <h4>Übungen</h4><div id="de-rows">${rows()}</div>
    <button class="btn block" data-sa="add">${icon("plus", "sm")}Übung hinzufügen</button>
    ${S.plan.days.length > 1 ? `<button class="btn danger block" data-sa="del-day">${icon("trash", "sm")}Tag löschen</button>` : ""}`, {
    change: el =>{ if(el.id === "de-n"){ d.n = el.value.trim() || d.n; save(); render(); } },
    click: el =>{
      const xi = +el.dataset.x, sa = el.dataset.sa;
      if(sa === "add") return openLibrary({mode:"plan", di});
      if(sa === "up" && xi > 0){ [d.ex[xi - 1], d.ex[xi]] = [d.ex[xi], d.ex[xi - 1]]; }
      else if(sa === "down" && xi < d.ex.length - 1){ [d.ex[xi + 1], d.ex[xi]] = [d.ex[xi], d.ex[xi + 1]]; }
      else if(sa === "del"){ d.ex.splice(xi, 1); }
      else if(sa === "edit") return openPrescription(di, xi);
      else if(sa === "swap") return openExInfo(d.ex[xi].id, {mode:"plan", di, xi});
      else if(sa === "del-day") return arm(el, "Tag wirklich löschen?", ()=>{ S.plan.days.splice(di, 1); save(); closeSheet(); render(); toast("Tag gelöscht"); });
      else return;
      save(); $("#de-rows").innerHTML = rows(); render();
    }
  });
}
function openPrescription(di, xi){
  const e = S.plan.days[di].ex[xi], ex = EX(e.id), v = {sets:e.sets, lo:e.lo, hi:e.hi, rest:e.rest};
  const stp = (k, label) => `<label class="field">${label}<div class="stp"><button data-sa="dec" data-k="${k}" aria-label="${label} weniger">−</button><output id="pv-${k}">${v[k]}</output><button data-sa="inc" data-k="${k}" aria-label="${label} mehr">+</button></div></label>`;
  openSheet(ex.n, `<p class="lead">Sätze, Wiederholungsbereich und Pause</p>
    ${stp("sets", "Sätze")}<div class="grid2">${stp("lo", ex.u === "s" ? "Sekunden von" : "Wdh. von")}${stp("hi", "bis")}</div>
    <label class="field">Pause<select id="pv-rest">${[45, 60, 75, 90, 120, 150, 180, 240].map(s => `<option value="${s}"${s === v.rest ? " selected" : ""}>${clock(s)} min</option>`).join("")}</select></label>
    <button class="btn primary block" data-sa="save">Speichern</button>`, {
    change: el =>{ if(el.id === "pv-rest") v.rest = +el.value; },
    click: el =>{
      const k = el.dataset.k, sa = el.dataset.sa, stepK = ex.u === "s" && k !== "sets" ? 5 : 1;
      if(sa === "inc" || sa === "dec"){
        const lim = {sets:[1, 8], lo:[1, ex.u === "s" ? 300 : 50], hi:[1, ex.u === "s" ? 300 : 60]}[k];
        v[k] = clamp(v[k] + (sa === "inc" ? stepK : -stepK), lim[0], lim[1]);
        if(v.lo > v.hi){ if(k === "lo") v.hi = v.lo; else v.lo = v.hi; }
        ["sets", "lo", "hi"].forEach(x =>{ $(`#pv-${x}`).textContent = v[x]; });
        return;
      }
      if(sa === "save"){ Object.assign(e, v); save(); render(); openDayEditor(di); toast("Gespeichert"); }
    }
  });
}

/* ---------- Mehr ---------- */
function toggleRow(k, title, sub, ic){
  const on = opt(k);
  return `<button class="li" data-act="toggle" data-k="${k}" role="switch" aria-checked="${on}">${icon(ic)}<span class="lt"><b>${title}</b><span>${sub}</span></span><span class="sw${on ? " on" : ""}"></span></button>`;
}
function renderMore(){
  hdr.innerHTML = `<div class="hdr-row"><h2 class="hdr-title">Mehr</h2></div>`;
  const p = S.profile, lb = S.meta.lastBackup, fs = opt("fs");
  main.innerHTML = `<div class="view">
    <h3 class="sec-h" style="margin-top:4px">Bedienung</h3>
    <div class="list">
      ${toggleRow("simple", "Einfach-Modus", "Eine Übung nach der anderen, große Knöpfe", "target")}
      <div class="li">${icon("text")}<span class="lt"><b>Schriftgröße</b><span>Gilt für die ganze App</span></span><div class="seg" role="group" aria-label="Schriftgröße"><button data-act="fs" data-v="m" class="${fs === "m" ? "on" : ""}">A</button><button data-act="fs" data-v="l" class="${fs === "l" ? "on" : ""}" style="font-size:1.1em">A</button><button data-act="fs" data-v="xl" class="${fs === "xl" ? "on" : ""}" style="font-size:1.25em">A</button></div></div>
      <div class="li">${icon("scale")}<span class="lt"><b>Einheit</b><span>Für alle Gewichte</span></span><div class="seg" role="group" aria-label="Einheit"><button data-act="units" data-v="kg" class="${unit() === "kg" ? "on" : ""}">kg</button><button data-act="units" data-v="lb" class="${unit() === "lb" ? "on" : ""}">lb</button></div></div>
    </div>
    <h3 class="sec-h">Training</h3>
    <div class="list">
      ${toggleRow("autoRest", "Pause startet automatisch", "Nach jedem eingetragenen Satz", "timer")}
      ${toggleRow("sound", "Ton am Ende der Pause", "Drei kurze Pieptöne", "bell")}
      ${toggleRow("vibrate", "Vibration", "Beim Abhaken und am Pausenende (Android)", "phone")}
      ${toggleRow("wake", "Bildschirm anlassen", "Solange ein Training läuft", "sun")}
    </div>
    <h3 class="sec-h">Profil</h3>
    <div class="list"><button class="li" data-act="new-plan">${icon("user")}<span class="lt"><b>Ziel und Ausstattung ändern</b><span>${p ? `${escH(GOALS[p.goal].t)} · ${escH(LEVELS[p.level].t)} · ${p.days} Tage · ${escH(SETUPS[p.equip].t)}` : "noch nicht eingerichtet"}</span></span>${icon("chevR", "sm")}</button></div>
    <h3 class="sec-h">Daten</h3>
    <div class="list">
      <button class="li" data-act="backup">${icon("save")}<span class="lt"><b>Sicherung</b><span>Letzte: ${lb ? agoText(lb) : "noch keine"} · als Datei oder Text</span></span>${icon("chevR", "sm")}</button>
      <button class="li" data-act="export">${icon("table")}<span class="lt"><b>Export für Excel</b><span>Alle Sätze und dein Körpergewicht</span></span>${icon("chevR", "sm")}</button>
    </div>
    <p class="fine">Alles bleibt auf diesem Gerät. Die App erinnert dich nach 7 Tagen an eine Sicherung.</p>
    <h3 class="sec-h">Hinweise</h3>
    <div class="list">
      <button class="li" data-act="text" data-t="health">${icon("heart")}<span class="lt"><b>Gesundheit</b><span>Kein Ersatz für ärztlichen Rat</span></span>${icon("chevR", "sm")}</button>
      <button class="li" data-act="text" data-t="privacy">${icon("shield")}<span class="lt"><b>Datenschutz</b><span>Kein Konto, kein Server, keine Werbung</span></span>${icon("chevR", "sm")}</button>
    </div>
    <button class="btn danger block" data-act="wipe">${icon("trash", "sm")}Alle Daten löschen</button>
    <p class="fine">Kraftbuch ${APP_VER}</p>
  </div>`;
}
const TEXTS = {
  health:["Gesundheit", `<p>Kraftbuch ist eine Trainings-App und kein Medizinprodukt. Sie ersetzt keine ärztliche Beratung, Diagnose oder Behandlung.</p>
    <h4>Vor dem Start</h4><p>Wenn du Vorerkrankungen oder Beschwerden hast, Medikamente nimmst, schwanger bist oder lange nicht trainiert hast, sprich vorher mit deiner Ärztin oder deinem Arzt.</p>
    <h4>Sofort aufhören bei</h4><ul><li>Brustschmerz, Druck oder Engegefühl</li><li>Schwindel, Atemnot oder Herzstolpern</li><li>stechenden oder zunehmenden Gelenkschmerzen</li></ul>
    <p style="margin-top:10px">Die Vorschläge der App beruhen auf deinen Einträgen und allgemeinen Trainingsregeln. Sie kennen deine Gesundheit nicht.</p>`],
  privacy:["Datenschutz", `<p>Alle Daten bleiben auf deinem Gerät, im Speicher des Browsers bzw. der App. Es gibt kein Konto, keinen Server, keine Werbung und keine Weitergabe an Dritte.</p>
    <h4>Sicherung</h4><p>Sicherungen erstellst du selbst als Datei. Wohin du sie legst (z. B. iCloud Drive), entscheidest du.</p>
    <h4>Löschen</h4><p>Unter „Mehr“ kannst du alle Daten jederzeit löschen.</p>
    <h4>Videos</h4><p>Die Video-Links öffnen YouTube. Dort gelten die Datenschutzregeln von YouTube.</p>`]
};

/* ---------- Sicherung und Export ---------- */
function markBackup(){ S.meta.lastBackup = Date.now(); save(); }
/* Kein await vor navigator.share: das Teilen-Menü braucht den Tipp als Auslöser */
async function backupFile(){
  const json = JSON.stringify(S), name = `kraftbuch-${todayKey()}.json`;
  let file = null;
  try{ file = new File([json], name, {type:"application/json"}); }catch(e){}
  if(file && navigator.canShare && navigator.canShare({files:[file]})){
    try{ await navigator.share({files:[file], title:"Kraftbuch-Sicherung"}); markBackup(); return true; }
    catch(e){ if(e && e.name === "AbortError") return false; }
  }
  download(name, json, "application/json");
  markBackup(); return true;
}
function download(name, text, type){
  const url = URL.createObjectURL(new Blob([text], {type}));
  const a = document.createElement("a"); a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=> URL.revokeObjectURL(url), 4000);
}
function validBackup(d){ return d && typeof d === "object" && d.v === VER && Array.isArray(d.workouts); }
function openBackup(){
  const lb = S.meta.lastBackup;
  openSheet("Sicherung", `<p class="lead">Der komplette Stand als Datei: im Teilen-Menü „In Dateien sichern“ wählen, z. B. in iCloud Drive. Letzte Sicherung: <b id="bk-last">${lb ? agoText(lb) : "noch keine"}</b>.</p>
    <button class="btn primary block" data-sa="file">${icon("save", "sm")}Als Datei sichern</button>
    <h4>Als Text</h4><textarea class="bk" id="bk" spellcheck="false">${escH(JSON.stringify(S))}</textarea>
    <button class="btn block" data-sa="copy">${icon("copy", "sm")}Text kopieren</button>
    <h4>Zurückholen</h4><p>Sicherungsdatei laden oder den Text oben einfügen, dann „Wiederherstellen“ zweimal tippen.</p>
    <div class="row2"><label class="btn">${icon("save", "sm")}Datei laden<input type="file" id="bk-file" accept=".json,application/json,text/plain" hidden></label><button class="btn" data-sa="restore">Wiederherstellen</button></div>`, {
    change: el =>{
      if(el.id !== "bk-file" || !el.files || !el.files[0]) return;
      el.files[0].text().then(t =>{ $("#bk").value = t; toast("Datei geladen. Jetzt „Wiederherstellen“ tippen."); }).catch(()=> toast("Datei nicht lesbar"));
    },
    click: el =>{
      if(el.dataset.sa === "file") return backupFile().then(ok =>{ if(ok){ $("#bk-last").textContent = "heute"; flash(el, "Gesichert"); } });
      if(el.dataset.sa === "copy") return copyFrom($("#bk"), el).then(()=>{ markBackup(); $("#bk-last").textContent = "heute"; });
      if(el.dataset.sa !== "restore") return;
      let d; try{ d = JSON.parse($("#bk").value); }catch(e){ return flash(el, "Text nicht lesbar"); }
      if(!validBackup(d)) return flash(el, "Keine gültige Sicherung");
      arm(el, "Stand ersetzen?", ()=>{ S = d; normalize(); flushSave(); applyFont(); closeSheet(); view = S.profile ? "train" : "ob"; if(!S.profile) startOnboarding(false); else render(); toast("Sicherung wiederhergestellt"); });
    }
  });
}
function buildRows(sep, dec){
  const n = x => x === "" || x == null ? "" : String(x).replace(".", dec);
  const rows = [["Datum", "Training", "Übung", "Satz", `Gewicht (${unit()})`, "Wdh./Sek.", "RIR"]];
  for(const w of S.workouts) for(const e of w.ex){ const ex = EX(e.id); e.log.forEach((s, i)=> rows.push([dateKey(w.start), w.dayName, ex.n, i + 1, numv(s.w) > 0 ? n(wNum(+s.w)) : "", s.r, s.rir ?? ""])); }
  const bk = Object.keys(S.body).sort();
  if(bk.length){ rows.push([], ["Datum", `Körpergewicht (${unit()})`]); bk.forEach(k => rows.push([k, n(wNum(+S.body[k]))])); }
  const q = v =>{ v = String(v); return sep === ";" && /[;"\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v.replace(/\t/g, " "); };
  return rows.map(r => r.map(q).join(sep)).join("\n");
}
function openExport(){
  openSheet("Export für Excel", `<p class="lead">Alle Sätze und dein Körpergewicht. Als Datei für Excel oder Numbers, oder als Text zum Einfügen.</p>
    <button class="btn primary block" data-sa="csv">${icon("table", "sm")}Als CSV-Datei</button>
    <textarea class="bk" id="tx" readonly>${escH(buildRows("\t", "."))}</textarea>
    <button class="btn block" data-sa="copy">${icon("copy", "sm")}Text kopieren</button>`, {click: el =>{
    if(el.dataset.sa === "csv") return download(`kraftbuch-${todayKey()}.csv`, "﻿" + buildRows(";", ","), "text/csv");
    if(el.dataset.sa === "copy") return copyFrom($("#tx"), el);
  }});
}
function flash(btn, msg){
  if(btn.dataset.flash) return;
  const h = btn.innerHTML; btn.dataset.flash = "1"; btn.textContent = msg;
  setTimeout(()=>{ btn.innerHTML = h; delete btn.dataset.flash; }, 1800);
}
async function copyFrom(ta, btn){
  ta.focus(); ta.select(); ta.setSelectionRange(0, 9999999);
  let ok = false;
  try{ await navigator.clipboard.writeText(ta.value); ok = true; }
  catch(e){ try{ ok = document.execCommand("copy"); }catch(e2){ ok = false; } }
  flash(btn, ok ? "Kopiert" : "Markiert, jetzt kopieren");
}

/* =====================================================================
   Blätter, Toast, Pausen-Uhr, Bildschirm, Ton
   ===================================================================== */
const sheet = $("#sheet"), shBody = $("#sh-body");
let shH = null, lastFocus = null, sheetT = null;
function openSheet(title, html, handlers = {}){
  clearTimeout(sheetT);
  $("#sh-title").textContent = title.replace(/([–-])(?=\d)/g, "$1⁠");
  shBody.innerHTML = html; shH = handlers;
  if(!sheet.classList.contains("open")) lastFocus = document.activeElement;
  sheet.hidden = false; document.body.classList.add("sheet-open");
  requestAnimationFrame(()=> requestAnimationFrame(()=> sheet.classList.add("open")));
  $(".sh", sheet).scrollTop = 0;
}
function closeSheet(){
  if(sheet.hidden) return;
  sheet.classList.remove("open"); shH = null; document.body.classList.remove("sheet-open");
  sheetT = setTimeout(()=>{ sheet.hidden = true; shBody.innerHTML = ""; }, 280);
  if(lastFocus && lastFocus.isConnected && lastFocus.focus) lastFocus.focus({preventScroll:true});
}
sheet.addEventListener("click", e =>{
  if(e.target === sheet || e.target.closest("#sh-close")) return closeSheet();
  const el = e.target.closest("[data-sa]");
  if(el && !el.disabled && shH && shH.click) shH.click(el, e);
});
sheet.addEventListener("change", e =>{ if(shH && shH.change) shH.change(e.target); });
sheet.addEventListener("input", e =>{ if(shH && shH.input) shH.input(e.target); });

let toastT = null;
function toast(html, kind = ""){
  const el = $("#toast");
  el.innerHTML = html; el.className = `toast show ${kind}`;
  clearTimeout(toastT); toastT = setTimeout(()=>{ el.className = "toast"; }, 2800);
}
function haptic(){ if(opt("vibrate") && navigator.vibrate) navigator.vibrate(12); }
let actx = null;
function unlockAudio(){
  if(!opt("sound")) return;
  try{ if(!actx) actx = new (window.AudioContext || window.webkitAudioContext)(); if(actx.state === "suspended") actx.resume(); }catch(e){ actx = null; }
}
function beep(){
  if(!actx) return;
  try{
    [0, .24, .48].forEach(o =>{
      const t = actx.currentTime + o, osc = actx.createOscillator(), g = actx.createGain();
      osc.type = "sine"; osc.frequency.value = 880;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.35, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      osc.connect(g).connect(actx.destination); osc.start(t); osc.stop(t + 0.2);
    });
  }catch(e){}
}
const dock = $("#dock"), T = {end:0, total:0, label:"", int:null, doneT:null};
function startTimer(sec, label){
  clearTimeout(T.doneT);
  T.total = sec; T.end = Date.now() + sec * 1000; T.label = label || "Pause";
  try{ sessionStorage.setItem("kb_timer", JSON.stringify({end:T.end, total:T.total, label:T.label})); }catch(e){}
  dock.hidden = false; dock.classList.remove("done"); document.body.classList.add("dock-on");
  clearInterval(T.int); T.int = setInterval(tick, 250); tick();
}
function startRest(ei){ const e = S.active && S.active.ex[ei]; if(e) startTimer(e.rest, EX(e.id).n); }
function tick(){
  const left = (T.end - Date.now()) / 1000;
  if(left <= 0) return finishTimer();
  $("#dk-time").textContent = clock(left);
  $("#dk-lbl").textContent = `Pause · ${T.label}`;
  const C = 2 * Math.PI * 19, val = $(".ring .val", dock);
  val.style.strokeDasharray = C; val.style.strokeDashoffset = C * (1 - left / T.total);
}
function finishTimer(){
  clearInterval(T.int); T.int = null; T.end = 0;
  try{ sessionStorage.removeItem("kb_timer"); }catch(e){}
  $("#dk-time").textContent = "Weiter geht's";
  $("#dk-lbl").textContent = `Pause vorbei · ${T.label}`;
  dock.classList.add("done");
  if(opt("vibrate") && navigator.vibrate) navigator.vibrate([220, 100, 220]);
  if(opt("sound")) beep();
  T.doneT = setTimeout(hideDock, 10000);
}
function hideDock(){
  clearInterval(T.int); clearTimeout(T.doneT); T.int = null; T.end = 0;
  dock.hidden = true; dock.classList.remove("done"); document.body.classList.remove("dock-on");
  try{ sessionStorage.removeItem("kb_timer"); }catch(e){}
}
function adjustTimer(d){
  if(!T.end){ if(d > 0) startTimer(d, T.label); return; }
  T.end += d * 1000; T.total = Math.max(1, T.total + d);
  if(T.end <= Date.now()) return finishTimer();
  try{ sessionStorage.setItem("kb_timer", JSON.stringify({end:T.end, total:T.total, label:T.label})); }catch(e){}
  tick();
}
function resumeTimer(){
  try{
    const t = JSON.parse(sessionStorage.getItem("kb_timer") || "null");
    if(t && t.end > Date.now()){ T.total = t.total; T.end = t.end; T.label = t.label; dock.hidden = false; document.body.classList.add("dock-on"); clearInterval(T.int); T.int = setInterval(tick, 250); tick(); }
  }catch(e){}
}
let wakeLock = null;
async function syncWake(){
  const want = opt("wake") && view === "train" && !!S.active && document.visibilityState === "visible";
  try{
    if(want && !wakeLock && "wakeLock" in navigator){ wakeLock = await navigator.wakeLock.request("screen"); wakeLock.addEventListener("release", ()=>{ wakeLock = null; }); }
    else if(!want && wakeLock){ const l = wakeLock; wakeLock = null; await l.release(); }
  }catch(e){ wakeLock = null; }
}
document.addEventListener("visibilitychange", ()=>{
  if(document.visibilityState === "hidden") flushSave();
  syncWake();
  if(document.visibilityState === "visible" && T.end) tick();
});
window.addEventListener("pagehide", flushSave);

/* =====================================================================
   Diagramme (eine Reihe, SVG, Tooltip per Zeiger und Tastatur)
   ===================================================================== */
function niceTicks(lo, hi, n){
  const raw = (hi - lo) / Math.max(1, n - 1), mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => s >= raw) || 10 * mag;
  const out = []; for(let t = Math.floor(lo / step) * step; t <= hi + step * 1e-6; t += step) out.push(+t.toFixed(6));
  if(out[out.length - 1] < hi) out.push(+(out[out.length - 1] + step).toFixed(6));
  return out;
}
function hoverLayer(host, svg, n, posOf, show){
  const tt = $(".tt", host), hit = $(".hit", svg);
  let ki = n - 1;
  const nearest = cx =>{ const r = svg.getBoundingClientRect(), vx = (cx - r.left) / r.width * svg.viewBox.baseVal.width; let bi = 0, bd = Infinity; for(let i = 0; i < n; i++){ const d = Math.abs(posOf(i) - vx); if(d < bd){ bd = d; bi = i; } } return bi; };
  const at = i =>{ ki = i; show(i, tt); };
  const hide = ()=>{ tt.hidden = true; $$(".xh,.xd", svg).forEach(x => x.style.display = "none"); };
  hit.addEventListener("pointermove", e => at(nearest(e.clientX)));
  hit.addEventListener("pointerdown", e => at(nearest(e.clientX)));
  hit.addEventListener("pointerleave", e =>{ if(e.pointerType === "mouse") hide(); });
  svg.setAttribute("tabindex", "0");
  svg.addEventListener("focus", ()=> at(ki));
  svg.addEventListener("blur", hide);
  svg.addEventListener("keydown", e =>{
    if(e.key === "ArrowLeft"){ at(Math.max(0, ki - 1)); e.preventDefault(); }
    else if(e.key === "ArrowRight"){ at(Math.min(n - 1, ki + 1)); e.preventDefault(); }
    else if(e.key === "Escape") hide();
  });
}
function placeTip(host, tt, svg, x, y, Wd, Ht, b, sub){
  tt.textContent = "";
  const bb = document.createElement("b"); bb.textContent = b;
  const sp = document.createElement("span"); sp.textContent = sub;
  tt.append(bb, sp); tt.hidden = false;
  const sx = svg.clientWidth / Wd, sy = svg.clientHeight / Ht, half = tt.offsetWidth / 2 + 4;
  tt.style.left = `${Math.min(Math.max(x * sx, half), host.clientWidth - half)}px`;
  tt.style.top = `${Math.max(y * sy - 12, tt.offsetHeight)}px`;
}
function lineChart(host, pts, {h = 170, unit:u = "", label = "", xf = p => String(p.x), tf = p => String(p.x)} = {}){
  if(!host) return;
  const Wd = Math.max(240, Math.round(host.clientWidth || 300)), Ht = h, pl = 42, pr = 58, pt = 14, pb = 26;
  let x0 = Math.min(...pts.map(p => p.x)), x1 = Math.max(...pts.map(p => p.x));
  if(x0 === x1){ x0 -= 1; x1 += 1; }
  let y0 = Math.min(...pts.map(p => p.y)), y1 = Math.max(...pts.map(p => p.y));
  const span = (y1 - y0) || Math.max(1, Math.abs(y1) * 0.04);
  const ticks = niceTicks(y0 - span * 0.2, y1 + span * 0.2, 4);
  y0 = ticks[0]; y1 = ticks[ticks.length - 1];
  const X = x => pl + (x - x0) / (x1 - x0) * (Wd - pl - pr), Y = y => pt + (1 - (y - y0) / (y1 - y0)) * (Ht - pt - pb);
  const base = Ht - pb, last = pts[pts.length - 1];
  const line = pts.map((p, i)=> `${i ? "L" : "M"}${X(p.x).toFixed(1)},${Y(p.y).toFixed(1)}`).join("");
  const lw = p => xf(p).length * 6.4 + 10, xt = [];
  pts.forEach(p =>{ const q = xt[xt.length - 1]; if(!q || X(p.x) - X(q.x) >= (lw(p) + lw(q)) / 2) xt.push(p); });
  if(xt[xt.length - 1] !== last){ const q = xt[xt.length - 1]; if(xt.length > 1 && X(last.x) - X(q.x) < (lw(last) + lw(q)) / 2) xt.pop(); xt.push(last); }
  let s = `<svg viewBox="0 0 ${Wd} ${Ht}" width="${Wd}" height="${Ht}" role="img" aria-label="${escH(label)}: ${pts.length} Werte, zuletzt ${fmt1(last.y)} ${escH(u)}">`;
  ticks.forEach(t =>{ s += `<line class="grid" x1="${pl}" x2="${Wd - pr}" y1="${Y(t).toFixed(1)}" y2="${Y(t).toFixed(1)}"/><text class="ytk" x="${pl - 8}" y="${(Y(t) + 4).toFixed(1)}" text-anchor="end">${fmt1(t)}</text>`; });
  s += `<line class="axis" x1="${pl}" x2="${Wd - pr}" y1="${base}" y2="${base}"/>`;
  xt.forEach(p =>{ s += `<text class="xtk" x="${X(p.x).toFixed(1)}" y="${Ht - 7}" text-anchor="middle">${escH(xf(p))}</text>`; });
  if(pts.length > 1) s += `<path class="area" d="${line}L${X(last.x).toFixed(1)},${base}L${X(pts[0].x).toFixed(1)},${base}Z"/><path class="line" d="${line}"/>`;
  s += `<circle class="dot" cx="${X(last.x).toFixed(1)}" cy="${Y(last.y).toFixed(1)}" r="4.5"/><text class="endl" x="${(X(last.x) + 10).toFixed(1)}" y="${(Y(last.y) + 4).toFixed(1)}">${fmt1(last.y)}</text>`;
  s += `<line class="xh" x1="0" x2="0" y1="${pt}" y2="${base}" style="display:none"/><circle class="xd" r="4.5" style="display:none"/><rect class="hit" x="0" y="0" width="${Wd}" height="${Ht}" fill="transparent"/></svg><div class="tt" hidden></div>`;
  host.innerHTML = s;
  const svg = $("svg", host), xh = $(".xh", svg), xd = $(".xd", svg);
  hoverLayer(host, svg, pts.length, i => X(pts[i].x), (i, tt)=>{
    const p = pts[i];
    xh.setAttribute("x1", X(p.x)); xh.setAttribute("x2", X(p.x)); xh.style.display = "";
    xd.setAttribute("cx", X(p.x)); xd.setAttribute("cy", Y(p.y)); xd.style.display = "";
    placeTip(host, tt, svg, X(p.x), Y(p.y), Wd, Ht, `${fmt1(p.y)} ${u}`.trim(), tf(p));
  });
}
/* Balken: 4px gerundete Enden an der Grundlinie, 2px Abstand, Ziel als gestrichelte Linie */
function barChart(host, pts, {h = 150, goal = null, label = ""} = {}){
  if(!host) return;
  const Wd = Math.max(240, Math.round(host.clientWidth || 300)), Ht = h, pl = 26, pr = 44, pt = 14, pb = 24;
  const top = Math.max(goal || 0, ...pts.map(p => p.y), 1);
  const ticks = Array.from({length:top + 1}, (_, i)=> i).filter(t => top <= 6 || t % 2 === 0);
  const yMax = Math.max(top, ticks[ticks.length - 1]);
  const n = pts.length, slot = (Wd - pl - pr) / n, bw = Math.max(8, Math.min(28, slot - 8));
  const Y = v => pt + (1 - v / yMax) * (Ht - pt - pb), base = Ht - pb, cx = i => pl + slot * i + slot / 2;
  let s = `<svg viewBox="0 0 ${Wd} ${Ht}" width="${Wd}" height="${Ht}" role="img" aria-label="${escH(label)}: ${pts.map(p => p.y).join(", ")}">`;
  ticks.forEach(t =>{ s += `<line class="grid" x1="${pl}" x2="${Wd - pr}" y1="${Y(t).toFixed(1)}" y2="${Y(t).toFixed(1)}"/><text class="ytk" x="${pl - 8}" y="${(Y(t) + 4).toFixed(1)}" text-anchor="end">${t}</text>`; });
  pts.forEach((p, i)=>{
    if(p.y > 0){
      const x = cx(i) - bw / 2, y = Y(p.y), r = Math.min(4, bw / 2, base - y);
      s += `<path class="bar${i === n - 1 ? " hl" : ""}" d="M${x.toFixed(1)},${base}V${(y + r).toFixed(1)}Q${x.toFixed(1)},${y.toFixed(1)} ${(x + r).toFixed(1)},${y.toFixed(1)}H${(x + bw - r).toFixed(1)}Q${(x + bw).toFixed(1)},${y.toFixed(1)} ${(x + bw).toFixed(1)},${(y + r).toFixed(1)}V${base}Z"/>`;
    }
    if((n - 1 - i) % 2 === 0) s += `<text class="xtk" x="${cx(i).toFixed(1)}" y="${Ht - 7}" text-anchor="middle">${i === n - 1 ? "jetzt" : escH(p.x)}</text>`;
  });
  s += `<line class="axis" x1="${pl}" x2="${Wd - pr}" y1="${base}" y2="${base}"/>`;
  if(goal) s += `<line class="goal" x1="${pl}" x2="${Wd - pr}" y1="${Y(goal).toFixed(1)}" y2="${Y(goal).toFixed(1)}"/><text class="goal-l" x="${Wd - pr + 6}" y="${(Y(goal) + 4).toFixed(1)}">Ziel</text>`;
  s += `<rect class="hit" x="0" y="0" width="${Wd}" height="${Ht}" fill="transparent"/></svg><div class="tt" hidden></div>`;
  host.innerHTML = s;
  const svg = $("svg", host);
  hoverLayer(host, svg, n, cx, (i, tt)=>{
    const p = pts[i];
    placeTip(host, tt, svg, cx(i), Y(Math.max(p.y, 0)), Wd, Ht, `${p.y} ${p.y === 1 ? "Training" : "Trainings"}`, i === n - 1 ? "diese Woche" : p.tip);
  });
}

/* =====================================================================
   Ereignisse
   ===================================================================== */
document.addEventListener("click", e =>{
  const tab = e.target.closest(".tab");
  if(tab) return go(tab.dataset.v);
  const b = e.target.closest("[data-act]");
  if(!b || b.disabled) return;
  const a = S.active;
  switch(b.dataset.act){
    case "ob-pick":{
      const k = b.dataset.k, raw = b.dataset.v;
      OB.d[k] = k === "days" ? +raw : k === "simple" ? raw === "true" : raw;
      if(k === "equip" && raw === "gym") OB.d.bar = false;
      return render();
    }
    case "ob-next": OB.step = Math.min(OB_STEPS.length - 1, OB.step + 1); window.scrollTo(0, 0); return render();
    case "ob-back": OB.step = Math.max(0, OB.step - 1); window.scrollTo(0, 0); return render();
    case "ob-cancel": view = (OB && OB.prev) || "more"; OB = null; return render();
    case "ob-done": return finishOnboarding();
    case "new-plan": return startOnboarding(!!S.profile);
    case "home-day": S.meta.homeDay = +b.dataset.i; save(); return render();
    case "start": unlockAudio(); return startWorkout(+b.dataset.i);
    case "mode": setOpt("simple", b.dataset.v === "1"); return render();
    case "chk": return onCheck(b.closest(".set"));
    case "exinfo":{
      const ei = b.dataset.e != null ? +b.dataset.e : +b.closest(".ex").dataset.e;
      return openExInfo(a.ex[ei].id, {mode:"workout", ei});
    }
    case "rest":{ unlockAudio(); const ei = b.dataset.e != null ? +b.dataset.e : +b.closest(".ex").dataset.e; return startRest(ei); }
    case "add-set":{ const ei = +b.closest(".ex").dataset.e; a.ex[ei].sets = Math.max(a.ex[ei].sets, a.ex[ei].log.length) + 1; save(); return refreshCard(ei); }
    case "lib-workout": return openLibrary({mode:"workout"});
    case "finish": return finishWorkout();
    case "discard": return arm(b, "Wirklich verwerfen?", ()=>{ S.active = null; save(); hideDock(); render(); toast("Training verworfen"); });
    case "g-w":{ const ex = EX(a.ex[a.g].id), st = stepOf(ex); G.w = Math.max(0, roundTo(G.w + st * +b.dataset.d, st)); $("#g-w").textContent = wDisp(G.w); const sp = $("#g-w").nextElementSibling; if(sp) sp.textContent = unit(); return; }
    case "g-r":{ const ex = EX(a.ex[a.g].id), st = ex.u === "s" ? 5 : 1; G.r = clamp(G.r + st * +b.dataset.d, 0, ex.u === "s" ? 600 : 100); $("#g-r").textContent = G.r; return; }
    case "g-feel": return guidedLog(+b.dataset.rir);
    case "g-prev": a.g = Math.max(0, Math.min(a.g, a.ex.length) - 1); save(); window.scrollTo(0, 0); return render();
    case "g-next": a.g = Math.min(a.ex.length, a.g + 1); save(); window.scrollTo(0, 0); return render();
    case "g-undo":{ const e2 = a.ex[a.g]; for(let s = e2.log.length - 1; s >= 0; s--) if(isDone(e2.log[s])){ e2.log[s] = null; break; } G.key = ""; save(); toast("Satz entfernt"); return render(); }
    case "backup-now": return backupFile().then(ok =>{ if(ok){ toast(`${icon("save", "sm")}<span>Sicherung erstellt</span>`); render(); } });
    case "backup-later": S.meta.noBackup = todayKey(); save(); return render();
    case "bw-save":{
      const v = parseW($("#bw-in").value);
      if(v === "" || v < 25 || v > 350) return toast("Bitte ein Gewicht eintragen, z. B. 75,5");
      S.body[todayKey()] = v; save(); toast("Gewicht gespeichert"); return render();
    }
    case "wk-open": return openWorkoutDetail(b.dataset.id);
    case "day-edit": return openDayEditor(+b.dataset.d);
    case "lib-browse": return openLibrary({mode:"browse"});
    case "toggle":{ const k = b.dataset.k; setOpt(k, !opt(k)); if(k === "sound" && opt(k)){ unlockAudio(); beep(); } return render(); }
    case "fs": setOpt("fs", b.dataset.v); applyFont(); return render();
    case "units": setOpt("units", b.dataset.v); return render();
    case "backup": return openBackup();
    case "export": return openExport();
    case "text":{ const t = TEXTS[b.dataset.t]; return openSheet(t[0], t[1]); }
    case "wipe": return arm(b, "Wirklich alles löschen?", ()=>{ try{ localStorage.removeItem(KEY); }catch(e){} S = blank(); hideDock(); applyFont(); startOnboarding(false); toast("Alle Daten gelöscht"); });
    case "dk-minus": return adjustTimer(-15);
    case "dk-plus": return adjustTimer(15);
    case "dk-skip": return hideDock();
  }
});
document.addEventListener("change", e =>{
  if(e.target.matches("#main .in")){
    const row = e.target.closest(".set"), {ei, rec, prev} = commitRow(row);
    if(e.target.dataset.f === "r" && rec.r !== "" && (!prev || prev.r !== rec.r) && opt("autoRest")) startRest(ei);
    updateCard(ei); workoutHeader(); return;
  }
  if(e.target.id === "ex-pick"){ S.meta.pick = e.target.value; save(); return drawExercise(e.target.value); }
  if(e.target.dataset.ob === "bar"){ OB.d.bar = e.target.checked; return; }
});
document.addEventListener("input", e =>{
  if(e.target.matches("#main .nt")){
    const v = e.target.value.trim();
    if(v) S.notes[e.target.dataset.note] = v; else delete S.notes[e.target.dataset.note];
    e.target.parentElement.classList.toggle("has", !!v); fitNote(e.target); save();
  }
});
document.addEventListener("keydown", e =>{
  if(e.key === "Escape" && !sheet.hidden) return closeSheet();
  if(e.key === "Enter" && !e.shiftKey && e.target.matches("#main .nt")){ e.preventDefault(); return e.target.blur(); }
  if(e.key === "Enter" && e.target.id === "bw-in"){ e.preventDefault(); const sb = $('[data-act="bw-save"]'); if(sb) sb.click(); return; }
  if(e.key === "Enter" && e.target.matches("#main .in")){
    const ins = $$(".in", e.target.closest(".set")), i = ins.indexOf(e.target);
    if(i < ins.length - 1) ins[i + 1].focus(); else e.target.blur();
    e.preventDefault();
  }
});
let resizeT = null;
window.addEventListener("resize", ()=>{ clearTimeout(resizeT); resizeT = setTimeout(()=>{ if(view === "progress") mountProgressCharts(exsPick()); }, 200); });
const exsPick = () =>{ const exs = loggedExercises(); return exs.includes(S.meta.pick) ? S.meta.pick : exs[0]; };

/* ---------- Start ---------- */
(function init(){
  $$(".tab").forEach(t => t.insertAdjacentHTML("afterbegin", icon(t.dataset.icon)));
  $("#sh-close").innerHTML = icon("x", "sm");
  $("#dk-skip").innerHTML = icon("x", "sm");
  load(); applyFont();
  if(!S.profile || !S.plan) startOnboarding(false);
  else render();
  resumeTimer();
  if(canSave && navigator.storage && navigator.storage.persist) navigator.storage.persisted().then(p => p || navigator.storage.persist()).catch(()=>{});
  if("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("./sw.js").catch(()=>{});
})();
