// ===== Hoja de personaje rellenable · Un Vampiro en Waterdeep =====
const KEY = 'waterdeep-hoja-v2';
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const sig = n => (n >= 0 ? '+' : '−') + Math.abs(n);
// muestra un número guardado como texto con su signo ("5" → "+5"), sin cambiar su valor
const sg = v => { v = String(v ?? '').trim(); return /^\d+$/.test(v) ? '+' + v : v.replace(/^-/, '−'); };
const ABN = {fue:'Fuerza', des:'Destreza', con:'Constitución', int:'Inteligencia', sab:'Sabiduría', car:'Carisma'};
const MONEDAS = ['pc','pp','pe','po','ppt'];
const ARMAD = [['ligera','Ligera'],['media','Media'],['pesada','Pesada'],['escudos','Escudos']];

function blank() {
  return {plantilla:'naranja', manual:false, nombre:'', jugador:'', trasfondo:'', clase:'guerrero', subclase:'', especie:'',
    nivel:1, xp:'', tam:'M', vel:'30 ft', ca:'10', escudo:false, pgAct:'', pgTemp:'', dgGast:'', muerte:{ok:0, ko:0}, inspiracion:false,
    fue:10, des:10, con:10, int:10, sab:10, car:10, salv:[...CLASES.guerrero.sv], per:{}, iniExtra:0,
    arm:{ligera:false, media:false, pesada:false, escudos:false}, armasEnt:'', herr:'',
    ataques:[{n:'', bono:'', dano:'', notas:'', hab:'', dado:'', comp:true, dm:true}],
    rasgosA:'', rasgosB:'', especieR:'', dotes:'',
    conj:[], gast:{}, apariencia:'', historia:'', alineamiento:'', idiomas:'', equipo:'', sint:['','',''],
    monedas:{pc:'', pp:'', pe:'', po:'', ppt:''}, m:{}};
}
const norm = o => { const b = blank(); return {...b, ...o, muerte:{...b.muerte, ...(o.muerte || {})}, arm:{...b.arm, ...(o.arm || {})},
  monedas:{...b.monedas, ...(o.monedas || {})}, m:{...(o.m || {})}, gast:{...(o.gast || {})}}; };

let S = load() || norm(structuredClone(PREGENS.soldado));
function load() { try { const j = localStorage.getItem(KEY); return j ? norm(JSON.parse(j)) : null; } catch { return null; } }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} }

// ---------- cálculos (modo "calcular") ----------
function calc() {
  const lvl = Math.min(20, Math.max(1, +S.nivel || 1));
  const cl = CLASES[S.clase] || CLASES.guerrero;
  const pb = Math.ceil(lvl / 4) + 1;
  const m = {}; ABIL.forEach(([k]) => m[k] = Math.floor(((+S[k] || 10) - 10) / 2));
  const v = {pb:sig(pb), ini:sig(m.des + (+S.iniExtra || 0)), pgMax:String(cl.dg + (lvl - 1) * (cl.dg / 2 + 1) + m.con * lvl), dgMax:`${lvl}d${cl.dg}`};
  ABIL.forEach(([k]) => { v['mod_' + k] = sig(m[k]); v['sv_' + k] = sig(m[k] + (S.salv.includes(k) ? pb : 0)); });
  SKILLS.forEach(([k,, a]) => v['sk_' + k] = sig(m[a] + pb * (S.per[k] || 0)));
  v.pasiva = String(10 + m.sab + pb * (S.per.percepcion || 0));
  const h = cl.hab;
  Object.assign(v, h ? {cm_hab:ABN[h], cm_mod:sig(m[h]), cm_cd:String(8 + pb + m[h]), cm_atk:sig(pb + m[h])} : {cm_hab:'', cm_mod:'', cm_cd:'', cm_atk:''});
  const sl = cl.cast === 'full' ? SLOTS_FULL[lvl - 1] : cl.cast === 'half' ? SLOTS_HALF[lvl - 1] : [];
  for (let i = 1; i <= 9; i++) v['slot_' + i] = sl[i - 1] ? String(sl[i - 1]) : '';
  if (cl.cast === 'pact') { const nv = Math.min(5, Math.ceil(lvl / 2)); v['slot_' + nv] = String(lvl === 1 ? 1 : lvl < 11 ? 2 : lvl < 17 ? 3 : 4); }
  return {v, m, pb, cl};
}
let C = calc();
const D = k => S.manual ? (S.m[k] ?? '') : (C.v[k] ?? '');
function atkVals(a) {
  if (S.manual || !a.hab || !a.dado) return {bono:a.bono, dano:a.dano};
  const ab = a.hab === 'sut' ? (C.m.fue > C.m.des ? 'fue' : 'des') : a.hab === 'conj' ? (C.cl.hab || 'int') : a.hab;
  const bono = C.m[ab] + (a.comp ? C.pb : 0), dm = a.dm ? C.m[ab] : 0;
  return {bono:sig(bono), dano:a.dado + (dm ? (dm > 0 ? '+' : '') + dm : '')};
}

// ---------- íconos ----------
const I = {
  gear:'<svg viewBox="0 0 24 24"><path d="M19.4 13a7.4 7.4 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7.6 7.6 0 0 0-1.7-1L15 3h-4l-.4 2.7a7.6 7.6 0 0 0-1.7 1l-2.5-1-2 3.5L6.6 11a7.4 7.4 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1a7.6 7.6 0 0 0 1.7 1L11 21h4l.4-2.7a7.6 7.6 0 0 0 1.7-1l2.5 1 2-3.5L19.4 13zM13 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/></svg>',
  swords:'<svg viewBox="0 0 24 24"><path d="M3 3h4l9 9-2 2-9-9V3zm18 0v4l-6.5 6.5-2-2L19 3h2zM6.5 14.5l3 3-2 2 1.5 1.5-1.5 1.5L5 20l-2 2-1-1 2-2-2.5-2.5L3 15l1.5 1.5 2-2zm11 0 2 2L21 15l1.5 1.5L20 19l2 2-1 1-2-2-2.5 2.5L15 21l1.5-1.5-2-2 3-3z"/></svg>',
  star:'<svg viewBox="0 0 24 24"><path d="M12 2l2.6 6.6L21.5 9l-5.3 4.5L18 20.5 12 16.8 6 20.5l1.8-7L2.5 9l6.9-.4z"/></svg>',
  pack:'<svg viewBox="0 0 24 24"><path d="M9 2h6v2h1a4 4 0 0 1 4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a4 4 0 0 1 4-4h1V2zm-1 10v5h8v-5H8z"/></svg>',
  penta:'<svg viewBox="0 0 24 24"><path d="M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21zm0 2a8.5 8.5 0 0 1 3.9.95L12 15.3 8.1 4.45A8.5 8.5 0 0 1 12 3.5zm-5.6 2.1L9.7 14.7 3.6 10.3a8.5 8.5 0 0 1 2.8-4.7zm11.2 0a8.5 8.5 0 0 1 2.8 4.7l-6.1 4.4 3.3-9.1zM4 12.4l6.1 0.05-3.4 6.5A8.5 8.5 0 0 1 4 12.4zm16 0a8.5 8.5 0 0 1-2.7 6.55l-3.4-6.5L20 12.4zM12 17.4l3.6 2.6a8.5 8.5 0 0 1-7.2 0l3.6-2.6z"/></svg>',
  book:'<svg viewBox="0 0 24 24"><path d="M2 4h7a3 3 0 0 1 3 3v14a2 2 0 0 0-2-2H2V4zm20 0h-7a3 3 0 0 0-3 3v14a2 2 0 0 1 2-2h8V4z"/></svg>',
  shield:'<svg viewBox="0 0 24 24"><path d="M12 2 4 5v6c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11V5l-8-3z"/></svg>',
  person:'<svg viewBox="0 0 24 24"><path d="M12 2a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm-8 20c0-4.4 3.6-8 8-8s8 3.6 8 8H4z"/></svg>',
  coin:'<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15.9V19h-2v-1.1c-1.6-.3-2.9-1.3-3-2.9h2c.1.8.8 1.4 2 1.4 1.3 0 2-.6 2-1.3 0-.8-.7-1.1-2.3-1.5C9.8 13.1 8.3 12.4 8.3 10.6c0-1.4 1.1-2.4 2.7-2.7V7h2v1c1.5.3 2.5 1.3 2.6 2.7h-2c-.1-.7-.7-1.2-1.6-1.2-1 0-1.7.5-1.7 1.2 0 .7.7 1 2.2 1.4 2 .5 3.6 1.1 3.6 3 0 1.5-1.1 2.5-2.1 2.8z"/></svg>',
  ring:'<svg viewBox="0 0 24 24"><path d="M9 2h6l-1.5 3h-3L9 2zm3 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm0 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"/></svg>'
};
const h3 = (ic, t) => `<h3>${I[ic]}${t}</h3>`;
// texto con títulos tipo "Furia (dos usos):" en negritas
function prose(t) {
  if (!String(t || '').trim()) return '<span class="empty">—</span>';
  return String(t).split('\n').map(l => {
    if (!l.trim()) return '<div class="gap"></div>';
    const m = l.match(/^([^:]{1,40}:)(.*)$/);
    return `<p>${m && !l.startsWith('-') ? `<b>${esc(m[1])}</b>${esc(m[2])}` : esc(l)}</p>`;
  }).join('');
}
const circ = (on, tg) => `<span class="circ tg ${on ? 'on' : ''}" data-tg="${tg}"></span>`;
const inp = (k, cls = '') => `<input class="si ${cls}" data-k="${k}" value="${esc(k.startsWith('mon:') ? S.monedas[k.slice(4)] : S[k])}" aria-label="${k}">`;

// ---------- frente ----------
function renderFront() {
  const sh = $('#sheet1'); sh.className = 'sheet t-' + S.plantilla;
  const id = (k, v, big) => `<div class="${big ? 'big' : ''}"><em>${k}:</em><b>${esc(v)}</b></div>`;
  const cl = CLASES[S.clase]?.n || '';
  const abils = ABIL.map(([k, l]) => `<div class="ab"><b>${l}</b><div class="sc">${esc(S[k])}</div><div class="md">${esc(sg(D('mod_' + k)))}</div></div>`).join('');
  const saves = ABIL.map(([k, l]) => `<div><span class="dot ${S.salv.includes(k) ? 'on' : ''}"></span><span class="n">${l}</span><span class="v">${esc(sg(D('sv_' + k)))}</span></div>`).join('');
  const skills = SKILLS.map(([k, n, a]) => { const p = S.per[k] || 0;
    return `<div><span class="dot ${p === 2 ? 'ex' : p ? 'on' : ''}"></span><span class="n">${n}</span><span class="a">${a.toUpperCase()}</span><span class="v">${esc(sg(D('sk_' + k)))}</span></div>`; }).join('');
  const rows = [...S.ataques.filter(a => a.n)]; while (rows.length < 6) rows.push(null);
  const atks = rows.map(a => { if (!a) return '<tr><td></td><td></td><td></td><td></td></tr>'; const r = atkVals(a);
    return `<tr><td class="b">${esc(a.n)}</td><td class="c">${esc(r.bono)}</td><td>${esc(r.dano)}</td><td>${esc(a.notas)}</td></tr>`; }).join('');
  const mu = t => [0,1,2].map(i => circ(i < S.muerte[t], `m${t}:${i}`)).join('');

  sh.innerHTML = `<div class="base"></div><div class="logo"></div><div class="area">
  <div class="row f-id"><div class="box ident">
    ${id('Nombre', S.nombre, 1)}${id('Clase', cl)}${id('Subclase', S.subclase)}${id('Nivel', S.nivel)}
    ${id('Trasfondo', S.trasfondo)}${id('Especie', S.especie)}${id('Jugador', S.jugador)}${id('XP', S.xp)}
  </div></div>
  <div class="row f-head">
    <div class="box hd" style="flex:14 1 0"><span class="lbl">Clase de armadura</span><span class="big-v">${esc(S.ca)}</span>
      <span class="lbl" style="display:flex;gap:5px;align-items:center"><span class="chkbox tg ${S.escudo ? 'on' : ''}" data-tg="escudo" style="width:14px;height:14px"></span>Escudo</span></div>
    <div class="box hd" style="flex:32 1 0"><span class="lbl">Puntos de golpe</span><div class="pair">
      <div>${inp('pgAct')}<span class="lbl">Actuales</span></div><div>${inp('pgTemp', 'sm')}<span class="lbl">Temp.</span></div>
      <div><span class="ro">${esc(D('pgMax'))}</span><span class="lbl">Máximo</span></div></div></div>
    <div class="box hd" style="flex:20 1 0"><span class="lbl">Dados de golpe</span><div class="pair">
      <div>${inp('dgGast', 'sm')}<span class="lbl">Gastados</span></div><div><span class="ro">${esc(D('dgMax'))}</span><span class="lbl">Máximo</span></div></div></div>
    <div class="box hd" style="flex:20 1 0"><span class="lbl">Salvaciones contra muerte</span>
      <div class="ds"><span>Éxitos</span><span>${mu('ok')}</span><span>Fallos</span><span>${mu('ko')}</span></div></div>
    <div class="box hd" style="flex:14 1 0"><span class="lbl">Inspiración heroica</span><span class="chkbox tg ${S.inspiracion ? 'on' : ''}" data-tg="inspiracion"></span></div>
  </div>
  <div class="row f-ab"><div class="abils">${abils}</div></div>
  <div class="row f-main">
    <div class="col" style="flex:25 1 0">
      <div class="box stats">
        <div><span class="lbl">Competencia</span><b>${esc(sg(D('pb')))}</b></div><div><span class="lbl">Iniciativa</span><b>${esc(sg(D('ini')))}</b></div>
        <div><span class="lbl">Velocidad</span><b>${esc(S.vel)}</b></div><div><span class="lbl">Tamaño</span><b>${esc(S.tam)}</b></div>
        <div class="w2"><span class="lbl">Percepción pasiva</span><b>${esc(D('pasiva')) || '&nbsp;'}</b></div>
      </div>
      <div class="box" style="flex:1">${h3('shield','Salvaciones')}<div class="lst sv">${saves}</div></div>
    </div>
    <div class="box" style="flex:30 1 0">${h3('star','Habilidades')}<div class="lst sk">${skills}</div></div>
    <div class="col" style="flex:45 1 0">
      <div class="box" style="flex:58 1 0">${h3('swords','Armas y trucos de daño')}<div class="fit"><table class="t">
        <tr><th>Nombre</th><th>Bono / CD</th><th>Daño y tipo</th><th>Notas</th></tr>${atks}</table></div></div>
      <div class="box" style="flex:42 1 0">${h3('gear','Entrenamiento y competencias')}<div class="fit ent">
        <div class="armr"><em>Armadura</em>${ARMAD.map(([k, l]) => `<span><span class="dia tg ${S.arm[k] ? 'on' : ''}" data-tg="arm:${k}"></span>${l}</span>`).join('')}</div>
        <em>Armas</em><span>${esc(S.armasEnt)}</span><em>Herram.</em><span>${esc(S.herr)}</span></div></div>
    </div>
  </div>
  <div class="row f-feat"><div class="box" style="flex:1">${h3('gear','Rasgos de clase')}
    <div class="fit" style="display:grid;grid-template-columns:1fr 1fr;gap:20px"><div class="prose">${prose(S.rasgosA)}</div><div class="prose">${prose(S.rasgosB)}</div></div></div></div>
  <div class="row f-last">
    <div class="box" style="flex:1">${h3('person','Rasgos de especie')}<div class="fit prose">${prose(S.especieR)}</div></div>
    <div class="box logo-gap" style="flex:1">${h3('star','Dotes')}<div class="fit prose">${prose(S.dotes)}</div></div>
  </div></div>`;
}

// ---------- reverso ----------
function renderBack() {
  const sh = $('#sheet2'); sh.className = 'sheet t-' + S.plantilla;
  const slots = [1,2,3,4,5,6,7,8,9].map(n => { const t = parseInt(D('slot_' + n)) || 0, g = S.gast[n] || 0;
    return `<div><i>Nv ${n}</i><u>${esc(D('slot_' + n))}</u>${[...Array(Math.min(t, 9))].map((_, i) => `<span class="dia tg ${i < g ? 'on' : ''}" data-tg="sl:${n}:${i}"></span>`).join('')}</div>`; }).join('');
  const rows = [...S.conj]; while (rows.length < Math.max(18, S.conj.length + 3)) rows.push(null);
  const sp = rows.map(c => c ? `<tr><td class="nv">${esc(c.nv)}</td><td class="b">${esc(c.n)}</td><td class="c">${esc(c.t)}</td><td>${esc(c.alc)}</td>
      <td class="c"><span class="dia ${c.c ? 'on' : ''}"></span><span class="dia ${c.r ? 'on' : ''}"></span><span class="dia ${c.m ? 'on' : ''}"></span></td><td>${esc(c.notas)}</td></tr>`
    : '<tr><td></td><td></td><td></td><td></td><td class="c"><span class="dia"></span><span class="dia"></span><span class="dia"></span></td><td></td></tr>').join('');
  sh.innerHTML = `<div class="base"></div><div class="logo"></div><div class="area">
  <div class="row b-head">
    <div class="box" style="flex:44 1 0">${h3('penta','Lanzamiento de conjuros')}<div class="cast">
      <div><span class="lbl">Característica</span><b class="txt">${esc(D('cm_hab')) || '&nbsp;'}</b></div>
      <div><span class="lbl">Modificador</span><b>${esc(sg(D('cm_mod'))) || '&nbsp;'}</b></div>
      <div><span class="lbl">CD de salvación</span><b>${esc(D('cm_cd')) || '&nbsp;'}</b></div>
      <div><span class="lbl">Bono de ataque</span><b>${esc(sg(D('cm_atk'))) || '&nbsp;'}</b></div></div></div>
    <div class="box" style="flex:56 1 0">${h3('star','Espacios de conjuro <span class="lbl" style="margin-left:auto">total · gastados</span>')}<div class="slotg">${slots}</div></div>
  </div>
  <div class="row b-main">
    <div class="box" style="flex:60 1 0">${h3('book','Trucos y conjuros preparados')}<div class="fit"><table class="t sp-t">
      <tr><th>Nv</th><th>Nombre</th><th>Tiempo</th><th>Alcance</th><th style="text-align:center">C · R · M</th><th>Notas</th></tr>${sp}</table>
      <div class="lbl" style="margin-top:4px;text-transform:none">C = concentración · R = ritual · M = material requerido · A = acción · AA = acción adicional · R (tiempo) = reacción</div></div></div>
    <div class="col" style="flex:40 1 0">
      <div class="box" style="flex:13 1 0">${h3('person','Apariencia')}<div class="fit notas">${esc(S.apariencia)}</div></div>
      <div class="box" style="flex:22 1 0">${h3('book','Historia y personalidad')}<div class="fit notas">${esc(S.historia)}</div>
        <div class="ident" style="padding:0;flex:none"><div><em>Alineamiento:</em><b>${esc(S.alineamiento)}</b></div></div></div>
      <div class="box" style="flex:12 1 0">${h3('book','Idiomas')}<div class="fit">${esc(S.idiomas)}</div></div>
      <div class="box" style="flex:53 1 0">${h3('pack','Equipo')}<div class="fit prose">${prose(S.equipo)}</div></div>
    </div>
  </div>
  <div class="row b-last">
    <div class="box" style="flex:50 1 0">${h3('ring','Sintonización con objetos mágicos')}<div class="fit sint">
      ${S.sint.map(x => `<div><span class="dia"></span>${esc(x)}</div>`).join('')}</div></div>
    <div class="box logo-gap" style="flex:50 1 0">${h3('coin','Monedas')}<div class="coins">
      ${MONEDAS.map(k => `<div>${inp('mon:' + k)}<span class="lbl">${k}</span></div>`).join('')}</div></div>
  </div></div>`;
}

// achica la letra de cada recuadro hasta que quepa
function fitAll() {
  document.querySelectorAll('.sheet .fit').forEach(el => {
    let fs = 16; el.style.fontSize = fs + 'px';
    while ((el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1) && fs > 7.5) { fs -= 0.5; el.style.fontSize = fs + 'px'; }
  });
}
function renderSheets() { C = calc(); renderFront(); renderBack(); fitAll(); }
function scaleSheets() {
  ['#stage1', '#stage2'].forEach(s => { const st = $(s), w = st.clientWidth; if (!w) return;
    const k = w / 1000; st.firstElementChild.style.transform = `scale(${k})`; st.style.height = 1414 * k + 'px'; });
}

// ---------- formulario ----------
const F = (label, key, type = 'text', cls = '') => `<label class="f ${cls}"><span>${label}</span>${
  type === 'area' ? `<textarea data-k="${key}">${esc(S[key])}</textarea>` : `<input type="${type}" data-k="${key}" value="${esc(S[key])}">`}</label>`;
const M = (label, key, cls = '') => S.manual
  ? `<label class="f ${cls}"><span>${label}</span><input data-m="${key}" value="${esc(S.m[key] ?? '')}"></label>`
  : `<label class="f ${cls}"><span>${label}</span><input value="${esc(C.v[key])}" disabled title="Se calcula solo"></label>`;

function renderForm() {
  const open = [...document.querySelectorAll('details.sec')].map(d => d.open);
  const claseOpts = Object.entries(CLASES).map(([k, v]) => `<option value="${k}" ${k === S.clase ? 'selected' : ''}>${v.n}</option>`).join('');
  const habOpts = v => [['','— a mano'],['fue','FUE'],['des','DES'],['sut','Sutileza'],['conj','Conjuro']].map(([k, l]) => `<option value="${k}" ${k === (v || '') ? 'selected' : ''}>${l}</option>`).join('');
  const atks = S.ataques.map((a, i) => `<div class="atk" data-i="${i}">
    <label class="f w3"><span>Nombre</span><input data-a="n" value="${esc(a.n)}"></label>
    <label class="f w3"><span>Notas</span><input data-a="notas" value="${esc(a.notas)}"></label>
    ${S.manual || !a.hab ? `<label class="f w3"><span>Bono / CD</span><input data-a="bono" value="${esc(a.bono)}"></label>
    <label class="f w3"><span>Daño y tipo</span><input data-a="dano" value="${esc(a.dano)}"></label>` : ''}
    ${S.manual ? '' : `<label class="f"><span>Calcular con</span><select data-a="hab">${habOpts(a.hab)}</select></label>
      ${a.hab ? `<label class="f"><span>Dado + tipo</span><input data-a="dado" value="${esc(a.dado)}" placeholder="1d8"></label>
      <label class="chk"><input type="checkbox" data-a="comp" ${a.comp ? 'checked' : ''}>Comp.</label>` : ''}`}
    <div class="row-end">${!S.manual && a.hab ? `<label class="chk"><input type="checkbox" data-a="dm" ${a.dm ? 'checked' : ''}>Suma mod. al daño</label>` : '<span></span>'}
      <button class="btn" data-del="${i}" type="button">Quitar</button></div></div>`).join('');
  const conj = S.conj.map((c, i) => `<div class="atk" data-c="${i}">
    <label class="f"><span>Nv</span><input data-cj="nv" value="${esc(c.nv)}"></label>
    <label class="f" style="grid-column:span 4"><span>Nombre</span><input data-cj="n" value="${esc(c.n)}"></label>
    <label class="f"><span>Tiempo</span><input data-cj="t" value="${esc(c.t)}"></label>
    <label class="f w3"><span>Alcance</span><input data-cj="alc" value="${esc(c.alc)}"></label>
    <label class="f w3"><span>Notas</span><input data-cj="notas" value="${esc(c.notas)}"></label>
    <div class="row-end"><span style="display:flex;gap:10px">${['c','r','m'].map(k => `<label class="chk"><input type="checkbox" data-cj="${k}" ${c[k] ? 'checked' : ''}>${k.toUpperCase()}</label>`).join('')}</span>
      <button class="btn" data-cdel="${i}" type="button">Quitar</button></div></div>`).join('');

  $('#form').innerHTML = `
  <details class="sec" open><summary>Identidad</summary><div class="in">
    <div class="full" style="grid-column:1/-1;display:flex;gap:6px">
      <button class="btn ${S.manual ? 'pri' : ''}" type="button" data-mode="1" style="flex:1">Valores a mano</button>
      <button class="btn ${S.manual ? '' : 'pri'}" type="button" data-mode="0" style="flex:1">Calcular</button></div>
    <p class="hint">${S.manual ? 'Modificadores, salvaciones, habilidades y demás se escriben tal cual; la página no corrige nada.' : 'La página calcula modificadores, salvaciones, habilidades, PG, CD y espacios.'}</p>
    ${F('Nombre','nombre','text','full')}${F('Jugador','jugador')}${F('Trasfondo','trasfondo')}
    <label class="f"><span>Clase</span><select data-k="clase">${claseOpts}</select></label>${F('Subclase','subclase')}
    ${F('Especie','especie')}${F('Nivel','nivel','number')}${F('Experiencia','xp')}${F('Tamaño','tam')}
  </div></details>

  <details class="sec" open><summary>Encabezado</summary><div class="in">
    ${F('Clase de armadura','ca')}<label class="chk" style="align-self:end"><input type="checkbox" data-k="escudo" ${S.escudo ? 'checked' : ''}>Escudo</label>
    ${F('PG actuales','pgAct')}${F('PG temporales','pgTemp')}${M('PG máximos','pgMax')}${M('Dados de golpe (máx.)','dgMax')}
    ${F('Dados gastados','dgGast')}${F('Velocidad','vel')}
    ${M('Competencia','pb')}${M('Iniciativa','ini')}${M('Percepción pasiva','pasiva')}
    ${S.manual ? '' : F('Iniciativa extra (Alerta)','iniExtra','number')}
    <label class="chk" style="grid-column:1/-1"><input type="checkbox" data-k="inspiracion" ${S.inspiracion ? 'checked' : ''}>Inspiración heroica</label>
  </div></details>

  <details class="sec" open><summary>Características</summary><div class="in">
    <div class="abil-in">${ABIL.map(([k, l]) => `<label><b>${l}</b><input type="number" min="1" max="30" data-k="${k}" value="${esc(S[k])}">
      ${S.manual ? `<input data-m="mod_${k}" value="${esc(S.m['mod_' + k] ?? '')}" style="font-size:15px;color:var(--ui-acc)" aria-label="Modificador ${l}">` : `<i>${C.v['mod_' + k]}</i>`}</label>`).join('')}</div>
  </div></details>

  <details class="sec"><summary>Salvaciones y habilidades</summary><div class="in">
    <div class="skills-in">${ABIL.map(([k, l]) => `<label class="chk"><input type="checkbox" data-sv="${k}" ${S.salv.includes(k) ? 'checked' : ''}>Salvación ${l}</label>
      ${S.manual ? `<input data-m="sv_${k}" value="${esc(S.m['sv_' + k] ?? '')}" style="width:64px">` : `<small>${C.v['sv_' + k]}</small>`}`).join('')}</div>
    <div class="skills-in" style="margin-top:8px">${SKILLS.map(([k, n, a]) => `<span style="display:flex;gap:6px;align-items:center">
      <select data-sk="${k}">${['—','Comp.','Pericia'].map((t, i) => `<option value="${i}" ${(S.per[k] || 0) === i ? 'selected' : ''}>${t}</option>`).join('')}</select>${n} <small style="color:var(--ui-dim)">${a.toUpperCase()}</small></span>
      ${S.manual ? `<input data-m="sk_${k}" value="${esc(S.m['sk_' + k] ?? '')}" style="width:64px">` : `<small>${C.v['sk_' + k]}</small>`}`).join('')}</div>
  </div></details>

  <details class="sec"><summary>Armas y trucos de daño</summary><div class="in">${atks}
    <button class="btn" type="button" id="addAtk" style="grid-column:1/-1">+ Arma o truco</button></div></details>

  <details class="sec"><summary>Rasgos y entrenamiento</summary><div class="in">
    <p class="hint">Las líneas que empiezan con "Nombre:" salen en negritas.</p>
    ${F('Rasgos de clase (columna izquierda)','rasgosA','area','full')}${F('Rasgos de clase (columna derecha)','rasgosB','area','full')}
    ${F('Rasgos de especie','especieR','area','full')}${F('Dotes','dotes','area','full')}
    <div class="saves-in">${ARMAD.map(([k, l]) => `<label class="chk"><input type="checkbox" data-arm="${k}" ${S.arm[k] ? 'checked' : ''}>${l}</label>`).join('')}</div>
    ${F('Armas','armasEnt','text','full')}${F('Herramientas','herr','text','full')}
  </div></details>

  <details class="sec"><summary>Conjuros</summary><div class="in">
    ${M('Característica','cm_hab')}${M('Modificador','cm_mod')}${M('CD de salvación','cm_cd')}${M('Bono de ataque','cm_atk')}
    <div class="full" style="grid-column:1/-1;display:grid;grid-template-columns:repeat(5,1fr);gap:6px">
      ${[1,2,3,4,5,6,7,8,9].map(n => S.manual ? `<label class="f"><span>Nv ${n}</span><input data-m="slot_${n}" value="${esc(S.m['slot_' + n] ?? '')}"></label>`
        : `<label class="f"><span>Nv ${n}</span><input value="${esc(C.v['slot_' + n])}" disabled></label>`).join('')}</div>
    <p class="hint">Espacios: el total por nivel. Los gastados se marcan tocando los rombos en la hoja.</p>
    ${conj}
    <button class="btn" type="button" id="addConj" style="grid-column:1/-1">+ Truco o conjuro</button>
  </div></details>

  <details class="sec"><summary>Reverso: personaje y equipo</summary><div class="in">
    ${F('Apariencia','apariencia','area','full')}${F('Historia y personalidad','historia','area','full')}
    ${F('Alineamiento','alineamiento','text','full')}${F('Idiomas','idiomas','text','full')}${F('Equipo','equipo','area','full')}
    ${[0,1,2].map(i => `<label class="f full"><span>Sintonización ${i + 1}</span><input data-sint="${i}" value="${esc(S.sint[i])}"></label>`).join('')}
    <div class="full" style="grid-column:1/-1;display:grid;grid-template-columns:repeat(5,1fr);gap:6px">
      ${MONEDAS.map(k => `<label class="f"><span>${k}</span><input data-k="mon:${k}" value="${esc(S.monedas[k])}"></label>`).join('')}</div>
  </div></details>`;
  document.querySelectorAll('details.sec').forEach((d, i) => { if (open[i] != null) d.open = open[i]; });
}

function setTpl() { document.querySelectorAll('.sw').forEach(b => b.setAttribute('aria-pressed', b.dataset.t === S.plantilla)); }
function refresh(full) { save(); setTpl(); renderSheets(); if (full) renderForm(); }

// ---------- eventos ----------
function setK(k, v) { if (k.startsWith('mon:')) S.monedas[k.slice(4)] = v; else S[k] = v; }
document.addEventListener('input', e => {
  const t = e.target, ds = t.dataset;
  if (t.closest('.sheet')) {           // campos que se llenan en la propia hoja: no se redibuja para no perder el cursor
    setK(ds.k, t.value); save();
    const twin = $(`#form [data-k="${CSS.escape(ds.k)}"]`); if (twin) twin.value = t.value;
    return;
  }
  if (ds.k) {
    setK(ds.k, t.type === 'checkbox' ? t.checked : t.type === 'number' ? (t.value === '' ? '' : +t.value) : t.value);
    if (ds.k === 'clase' && !S.manual) S.salv = [...CLASES[S.clase].sv];
    refresh(ds.k === 'clase');
  } else if (ds.m) { S.m[ds.m] = t.value; refresh(); }
  else if (ds.sv) { S.salv = t.checked ? [...new Set([...S.salv, ds.sv])] : S.salv.filter(x => x !== ds.sv); refresh(); }
  else if (ds.sk) { S.per[ds.sk] = +t.value; refresh(); }
  else if (ds.arm) { S.arm[ds.arm] = t.checked; refresh(); }
  else if (ds.sint) { S.sint[+ds.sint] = t.value; refresh(); }
  else if (ds.a) { const a = S.ataques[+t.closest('.atk').dataset.i]; a[ds.a] = t.type === 'checkbox' ? t.checked : t.value; refresh(ds.a === 'hab'); }
  else if (ds.cj) { const c = S.conj[+t.closest('.atk').dataset.c]; c[ds.cj] = t.type === 'checkbox' ? t.checked : t.value; refresh(); }
});
// valores calculados que se muestran en el formulario: se actualizan al salir del campo
document.addEventListener('change', e => { if (e.target.closest('#form') && e.target.matches('input[type=number],input[type=checkbox],select')) renderForm(); });

document.addEventListener('click', e => {
  const t = e.target, tg = t.dataset.tg;
  if (tg) {
    if (tg === 'escudo' || tg === 'inspiracion') S[tg] = !S[tg];
    else if (tg.startsWith('arm:')) { const k = tg.slice(4); S.arm[k] = !S.arm[k]; }
    else if (tg.startsWith('m')) { const [k, i] = tg.slice(1).split(':'); S.muerte[k] = S.muerte[k] === +i + 1 ? +i : +i + 1; }
    else if (tg.startsWith('sl:')) { const [, n, i] = tg.split(':'); S.gast[n] = (S.gast[n] || 0) === +i + 1 ? +i : +i + 1; }
    refresh(true); return;
  }
  if (t.dataset.mode != null) {
    const man = t.dataset.mode === '1';
    if (man && !S.manual) {   // al pasar a "a mano" se congelan los valores calculados (sin pisar los que ya estaban escritos)
      Object.entries(C.v).forEach(([k, v]) => { if (S.m[k] == null) S.m[k] = v; });
      S.ataques.forEach(a => { if (a.hab && a.dado) { const r = atkVals(a); a.bono = r.bono; a.dano = r.dano; a.hab = ''; } });
    }
    S.manual = man; refresh(true);
  }
  else if (t.dataset.del != null) { S.ataques.splice(+t.dataset.del, 1); refresh(true); }
  else if (t.dataset.cdel != null) { S.conj.splice(+t.dataset.cdel, 1); refresh(true); }
  else if (t.id === 'addAtk') { S.ataques.push({n:'', bono:'', dano:'', notas:'', hab:'', dado:'', comp:true, dm:true}); refresh(true); }
  else if (t.id === 'addConj') { S.conj.push({nv:'', n:'', t:'A', alc:'', notas:'', c:false, r:false, m:false}); refresh(true); }
  else if (t.classList.contains('sw')) { S.plantilla = t.dataset.t; refresh(); }
  else if (t.dataset.tab) { document.body.dataset.tab = t.dataset.tab; document.querySelectorAll('[data-tab]').forEach(b => b.setAttribute('aria-pressed', b === t)); scaleSheets(); }
});

$('#pregen').addEventListener('change', e => {
  const v = e.target.value; e.target.value = '';
  if (!v) return;
  if (!confirm('Esto reemplaza la hoja actual. Si no la has guardado, se pierde. ¿Seguir?')) return;
  S = v === 'nueva' ? blank() : norm(structuredClone(PREGENS[v]));
  refresh(true);
});
$('#btnSave').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(S, null, 1)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = (S.nombre || [CLASES[S.clase]?.n, S.trasfondo].filter(Boolean).join('_') || 'personaje').replace(/[^\wáéíóúñü -]/gi, '').trim().replace(/\s+/g, '_') + '.json';
  a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
});
$('#btnLoad').addEventListener('click', () => $('#jsonFile').click());
$('#jsonFile').addEventListener('change', async e => {
  const f = e.target.files[0]; e.target.value = '';
  if (!f) return;
  try { S = norm(JSON.parse(await f.text())); refresh(true); } catch { alert('Ese archivo no es una hoja válida.'); }
});
$('#btnPrint').addEventListener('click', () => {
  const v = $('#printWhat').value;
  document.body.classList.toggle('p-frente', v === 'frente');
  document.body.classList.toggle('p-reverso', v === 'reverso');
  window.print();
});

new ResizeObserver(scaleSheets).observe($('#stage1'));
document.fonts?.ready.then(() => renderSheets());
renderForm(); refresh();
