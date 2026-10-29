// ===== Hoja de personaje rellenable · Un Vampiro en Waterdeep =====
const KEY = 'waterdeep-hoja-v1';
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const sig = n => (n >= 0 ? '+' : '−') + Math.abs(n);
const lines = t => String(t || '').split(/\n/).map(x => x.trim()).filter(Boolean);

function blank() {
  return {plantilla:'naranja', nombre:'', jugador:'', especie:'', clase:'guerrero', subclase:'', trasfondo:'',
    nivel:1, alineamiento:'', xp:'', fue:10, des:10, con:10, int:10, sab:10, car:10,
    salv:[...CLASES.guerrero.sv], per:{}, ca:10, vel:'30 pies', pgMax:'', iniExtra:0, inspiracion:false,
    ataques:[{n:'', hab:'fue', comp:true, dado:'', tipo:'', extra:0, dm:true, maes:'', alc:''}],
    otros:'', equipo:'', rasgos:'', trucos:'', preparados:'', espacios:'', notas:'', retrato:'', retX:50, retY:30};
}
let S = load() || structuredClone(PREGENS.kael);

function load() { try { const j = localStorage.getItem(KEY); return j ? {...blank(), ...JSON.parse(j)} : null; } catch { return null; } }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} }

// ---------- cálculos ----------
function calc() {
  const lvl = Math.min(20, Math.max(1, +S.nivel || 1));
  const cl = CLASES[S.clase] || CLASES.guerrero;
  const pb = Math.ceil(lvl / 4) + 1;
  const m = {}; ABIL.forEach(([k]) => m[k] = Math.floor(((+S[k] || 10) - 10) / 2));
  const save = k => m[k] + (S.salv.includes(k) ? pb : 0);
  const skill = ([k,,a]) => m[a] + pb * (S.per[k] || 0);
  const pgAuto = cl.dg + (lvl - 1) * (cl.dg / 2 + 1) + m.con * lvl;
  const hab = cl.hab;
  let slots = [];
  if (S.espacios.trim()) slots = S.espacios.split(/[\/,\s]+/).map(Number).filter(n => n > 0);
  else if (cl.cast === 'full') slots = SLOTS_FULL[lvl - 1];
  else if (cl.cast === 'half') slots = SLOTS_HALF[lvl - 1];
  const pact = cl.cast === 'pact' && !S.espacios.trim()
    ? {n: lvl === 1 ? 1 : lvl < 11 ? 2 : lvl < 17 ? 3 : 4, nv: Math.min(5, Math.ceil(lvl / 2))} : null;
  const atk = a => {
    const ab = a.hab === 'sut' ? (m.fue > m.des ? 'fue' : 'des') : a.hab === 'conj' ? (hab || 'int') : a.hab;
    const bono = m[ab] + (a.comp ? pb : 0) + (+a.extra || 0);
    const dmod = (a.dm ? m[ab] : 0) + (+a.extra || 0);
    const dano = a.dado ? a.dado + (dmod ? sig(dmod).replace('−','-') : '') : '';
    return {bono, dano};
  };
  return {lvl, cl, pb, m, save, skill, pgAuto, hab, slots, pact, atk,
    ini: m.des + (+S.iniExtra || 0), pasiva: 10 + skill(SKILLS[11]),
    cd: hab ? 8 + pb + m[hab] : null, ataqueConj: hab ? pb + m[hab] : null};
}

// ---------- íconos ----------
const I = {
  heart:'<svg viewBox="0 0 24 24"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z"/></svg>',
  shield:'<svg viewBox="0 0 24 24"><path d="M12 2 4 5v6c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11V5l-8-3zm0 5 1.5 3.2 3.5.4-2.6 2.4.7 3.5L12 14.8 8.9 16.5l.7-3.5L7 10.6l3.5-.4L12 7z"/></svg>',
  boot:'<svg viewBox="0 0 24 24"><path d="M7 2h6v9l6 3.5V20H4v-4l3-2V2zm-3 19h16v1H4z"/></svg>',
  bolt:'<svg viewBox="0 0 24 24"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/></svg>',
  gear:'<svg viewBox="0 0 24 24"><path d="M19.4 13a7.4 7.4 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7.6 7.6 0 0 0-1.7-1L15 3h-4l-.4 2.7a7.6 7.6 0 0 0-1.7 1l-2.5-1-2 3.5L6.6 11a7.4 7.4 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1a7.6 7.6 0 0 0 1.7 1L11 21h4l.4-2.7a7.6 7.6 0 0 0 1.7-1l2.5 1 2-3.5L19.4 13zM13 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/></svg>',
  swords:'<svg viewBox="0 0 24 24"><path d="M3 3h4l9 9-2 2-9-9V3zm18 0v4l-6.5 6.5-2-2L19 3h2zM6.5 14.5l3 3-2 2 1.5 1.5-1.5 1.5L5 20l-2 2-1-1 2-2-2.5-2.5L3 15l1.5 1.5 2-2zm11 0 2 2L21 15l1.5 1.5L20 19l2 2-1 1-2-2-2.5 2.5L15 21l1.5-1.5-2-2 3-3z"/></svg>',
  star:'<svg viewBox="0 0 24 24"><path d="M12 2l2.6 6.6L21.5 9l-5.3 4.5L18 20.5 12 16.8 6 20.5l1.8-7L2.5 9l6.9-.4z"/></svg>',
  pack:'<svg viewBox="0 0 24 24"><path d="M9 2h6v2h1a4 4 0 0 1 4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a4 4 0 0 1 4-4h1V2zm-1 10v5h8v-5H8z"/></svg>',
  penta:'<svg viewBox="0 0 24 24"><path d="M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21zm0 2a8.5 8.5 0 0 1 3.9.95L12 15.3 8.1 4.45A8.5 8.5 0 0 1 12 3.5zm-5.6 2.1L9.7 14.7 3.6 10.3a8.5 8.5 0 0 1 2.8-4.7zm11.2 0a8.5 8.5 0 0 1 2.8 4.7l-6.1 4.4 3.3-9.1zM4 12.4l6.1 0.05-3.4 6.5A8.5 8.5 0 0 1 4 12.4zm16 0a8.5 8.5 0 0 1-2.7 6.55l-3.4-6.5L20 12.4zM12 17.4l3.6 2.6a8.5 8.5 0 0 1-7.2 0l3.6-2.6z"/></svg>',
  book:'<svg viewBox="0 0 24 24"><path d="M2 4h7a3 3 0 0 1 3 3v14a2 2 0 0 0-2-2H2V4zm20 0h-7a3 3 0 0 0-3 3v14a2 2 0 0 1 2-2h8V4z"/></svg>',
  target:'<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 3a7 7 0 1 1 0 14 7 7 0 0 1 0-14zm0 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 2.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"/></svg>',
  dice:'<svg viewBox="0 0 24 24"><path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm2.5 3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm9 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM12 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM7.5 15a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm9 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/></svg>'
};
const h3 = (ic, t) => `<h3>${I[ic]}${t}</h3>`;
const ul = (t, two) => { const l = lines(t); return l.length ? `<ul class="ul ${two && l.length > 7 ? 'two' : ''}">${l.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '<span class="empty">—</span>'; };

// ---------- hoja ----------
function renderSheet() {
  const c = calc(), cl = c.cl;
  const sheet = $('#sheet');
  sheet.className = 'sheet t-' + S.plantilla;
  const id = (k, v, big) => `<div class="${big ? 'big' : ''}"><em>${k}:</em><b>${esc(v) || ''}</b></div>`;
  const clase = cl.n + (S.subclase ? ` (${S.subclase})` : '');
  const abils = ABIL.map(([k, l]) => `<div class="ab"><b>${l}</b><div class="sc">${+S[k] || 10}</div><div class="md">${sig(c.m[k])}</div></div>`).join('');
  const saves = ABIL.map(([k, l]) => `<div><span class="dot ${S.salv.includes(k) ? 'on' : ''}"></span><span class="n">${l}</span><span class="v">${sig(c.save(k))}</span></div>`).join('');
  const skills = SKILLS.map(s => { const p = S.per[s[0]] || 0;
    return `<div><span class="dot ${p === 2 ? 'ex' : p ? 'on' : ''}"></span><span class="n">${s[1]}</span><span class="a">${s[2].toUpperCase()}</span><span class="v">${sig(c.skill(s))}</span></div>`; }).join('');
  const atks = S.ataques.filter(a => a.n).map(a => { const r = c.atk(a);
    return `<tr><td>${esc(a.n)}${a.maes ? `<span class="sub">${esc(a.maes)}</span>` : ''}</td><td class="b">${a.comp || a.hab !== 'conj' || a.dm ? sig(r.bono) : '—'}</td><td>${esc(r.dano)} <span class="sub">${esc(a.tipo)}</span></td><td>${esc(a.alc)}</td></tr>`; }).join('');
  const pg = S.pgMax !== '' && S.pgMax != null ? +S.pgMax : c.pgAuto;
  const otros = [
    ['Bonificador de competencia', sig(c.pb)],
    ['Percepción pasiva', c.pasiva],
    ['Dados de golpe', `${c.lvl}d${cl.dg}`],
    ['Inspiración heroica', `<span class="chkbox ${S.inspiracion ? 'on' : ''}"></span>`],
    ...lines(S.otros).map(l => { const [a, ...b] = l.split(':'); return b.length ? [a, esc(b.join(':').trim())] : [l, '']; })
  ].map(([a, b]) => `<div><span>${esc(a)}</span><b>${b}</b></div>`).join('');
  const slotRows = c.pact ? `<div><i>Nv${c.pact.nv}</i>${'<span class="slot"></span>'.repeat(c.pact.n)}</div><div class="spell-head">Pacto: se recuperan en descanso corto</div>`
    : c.slots.map((n, i) => `<div><i>Nv${i + 1}</i>${'<span class="slot"></span>'.repeat(n)}</div>`).join('');
  const caster = c.hab ? `<div class="spell-head">Característica <b>${c.hab.toUpperCase()}</b> · CD de salvación <b>${c.cd}</b> · Ataque de conjuro <b>${sig(c.ataqueConj)}</b></div>` : '';
  const retrato = S.retrato ? `<img src="${S.retrato}" alt="" style="object-position:${S.retX}% ${S.retY}%">` : '<span>Retrato</span>';

  sheet.innerHTML = `<div class="base"></div><div class="logo"></div><div class="area">
  <div class="row r1">
    <div class="box portrait"><div class="ph">${retrato}</div></div>
    <div class="col" style="flex:1">
      <div class="box ident">
        ${id('Nombre', S.nombre, 1)}${id('Nivel', c.lvl)}
        ${id('Especie', S.especie)}${id('Alineamiento', S.alineamiento)}
        ${id('Clase', clase)}${id('Experiencia', S.xp)}
        ${id('Trasfondo', S.trasfondo)}${id('Jugador', S.jugador)}
      </div>
      <div class="abils">${abils}</div>
    </div>
  </div>
  <div class="row r2">
    <div class="col" style="flex:27 1 0">
      <div class="box vit">
        <span class="lb">${I.heart}Puntos de Golpe</span><span class="val">${pg}<small>máximo</small></span>
        <span class="lb">${I.shield}Clase de Armadura</span><span class="val">${esc(S.ca)}</span>
        <span class="lb">${I.boot}Velocidad</span><span class="val" style="font-size:17px">${esc(S.vel)}</span>
        <span class="lb">${I.bolt}Iniciativa</span><span class="val">${sig(c.ini)}</span>
      </div>
      <div class="box" style="flex:1">${h3('gear','Tiradas de Salvación')}<div class="lst sv">${saves}</div></div>
    </div>
    <div class="box" style="flex:34 1 0">${h3('star','Pericias')}<div class="lst sk">${skills}</div></div>
    <div class="col" style="flex:39 1 0">
      <div class="box" style="flex:55 1 0">${h3('swords','Combate')}<div class="fit"><table class="atk-t"><tr><th>Ataque</th><th>Bono</th><th>Daño</th><th>Alcance</th></tr>${atks || '<tr><td colspan="4" class="empty">—</td></tr>'}</table></div></div>
      <div class="box" style="flex:45 1 0">${h3('target','Otros')}<div class="fit otros">${otros}</div></div>
    </div>
  </div>
  <div class="row r3">
    <div class="box" style="flex:44 1 0">${h3('pack','Equipo')}<div class="fit">${ul(S.equipo)}</div></div>
    <div class="box" style="flex:56 1 0">${h3('gear','Rasgos y Dotes')}<div class="fit">${ul(S.rasgos, 1)}</div></div>
  </div>
  <div class="row r4">
    <div class="box" style="flex:60 1 0">${h3('penta','Conjuros')}${caster}
      <div class="spells fit" style="display:grid">
        <div><h4>Trucos</h4>${ul(S.trucos)}</div>
        <div><h4>Conjuros preparados</h4>${ul(S.preparados)}</div>
        <div class="slots"><h4>Espacios</h4>${slotRows || '<span class="empty">—</span>'}</div>
      </div></div>
    <div class="box notes-box" style="flex:40 1 0">${h3('book','Notas y Trasfondo')}<div class="fit notas">${esc(S.notas)}</div></div>
  </div></div>`;
  fitAll();
}

// achica la letra de cada recuadro hasta que quepa
function fitAll() {
  document.querySelectorAll('#sheet .fit').forEach(el => {
    let fs = 16; el.style.fontSize = fs + 'px';
    while ((el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1) && fs > 8.5) { fs -= 0.5; el.style.fontSize = fs + 'px'; }
  });
}

function scaleSheet() {
  const st = $('#stage'), w = st.clientWidth;
  if (!w) return;
  const k = w / 1000;
  $('#sheet').style.transform = `scale(${k})`;
  st.style.height = 1414 * k + 'px';
}

// ---------- formulario ----------
const F = (label, key, type = 'text', cls = '') => `<label class="f ${cls}"><span>${label}</span>${
  type === 'area' ? `<textarea data-k="${key}">${esc(S[key])}</textarea>` :
  `<input type="${type}" data-k="${key}" value="${esc(S[key])}">`}</label>`;

function renderForm() {
  const c = calc();
  const claseOpts = Object.entries(CLASES).map(([k, v]) => `<option value="${k}" ${k === S.clase ? 'selected' : ''}>${v.n}</option>`).join('');
  const habOpts = v => [['fue','FUE'],['des','DES'],['sut','Sutileza (FUE o DES)'],['conj','Conjuro (mágica)'],['con','CON'],['int','INT'],['sab','SAB'],['car','CAR']]
    .map(([k, l]) => `<option value="${k}" ${k === v ? 'selected' : ''}>${l}</option>`).join('');
  const atks = S.ataques.map((a, i) => `<div class="atk" data-i="${i}">
    <label class="f w3"><span>Nombre</span><input data-a="n" value="${esc(a.n)}"></label>
    <label class="f w3"><span>Característica</span><select data-a="hab">${habOpts(a.hab)}</select></label>
    <label class="f"><span>Dado</span><input data-a="dado" value="${esc(a.dado)}" placeholder="1d8"></label>
    <label class="f"><span>Tipo</span><input data-a="tipo" value="${esc(a.tipo)}" placeholder="cort."></label>
    <label class="f"><span>Bono mágico</span><input type="number" data-a="extra" value="${esc(a.extra)}"></label>
    <label class="f w3"><span>Maestría / notas</span><input data-a="maes" value="${esc(a.maes)}"></label>
    <label class="f w3"><span>Alcance</span><input data-a="alc" value="${esc(a.alc)}"></label>
    <div class="row-end"><label class="chk"><input type="checkbox" data-a="comp" ${a.comp ? 'checked' : ''}>Competente</label>
      <label class="chk"><input type="checkbox" data-a="dm" ${a.dm ? 'checked' : ''}>Suma mod. al daño</label>
      <button class="btn" data-del="${i}" type="button">Quitar</button></div></div>`).join('');

  $('#form').innerHTML = `
  <details class="sec" open><summary>Identidad</summary><div class="in">
    ${F('Nombre','nombre','text','full')}${F('Jugador','jugador')}${F('Especie','especie')}
    <label class="f"><span>Clase</span><select data-k="clase">${claseOpts}</select></label>${F('Subclase','subclase')}
    ${F('Trasfondo','trasfondo')}${F('Nivel','nivel','number')}${F('Alineamiento','alineamiento')}${F('Experiencia','xp')}
    <div class="ret-ctrl"><span class="btn" onclick="document.getElementById('retFile').click()">Subir retrato</span>
      ${S.retrato ? '<button class="btn" type="button" id="retDel">Quitar</button>' : ''}</div>
    ${S.retrato ? `<div class="ret-ctrl"><span class="hint" style="margin:0">Encuadre</span><input type="range" min="0" max="100" data-k="retX" value="${S.retX}"><input type="range" min="0" max="100" data-k="retY" value="${S.retY}"></div>` : ''}
  </div></details>

  <details class="sec" open><summary>Características</summary><div class="in">
    <div class="abil-in">${ABIL.map(([k, l]) => `<label><b>${l}</b><input type="number" min="1" max="30" data-k="${k}" value="${S[k]}"><i>${sig(c.m[k])}</i></label>`).join('')}</div>
    <p class="hint">Competencia a nivel ${c.lvl}: <b>${sig(c.pb)}</b>. Todo lo demás se calcula solo.</p>
  </div></details>

  <details class="sec"><summary>Salvaciones y pericias</summary><div class="in">
    <div class="saves-in">${ABIL.map(([k, l]) => `<label class="chk"><input type="checkbox" data-sv="${k}" ${S.salv.includes(k) ? 'checked' : ''}>${l} ${sig(c.save(k))}</label>`).join('')}</div>
    <p class="hint">Al cambiar de clase se marcan sus salvaciones.</p>
    <div class="skills-in">${SKILLS.map(s => `<span>${s[1]} <small style="color:var(--ui-dim)">${s[2].toUpperCase()} · ${sig(c.skill(s))}</small></span>
      <select data-sk="${s[0]}">${['—','Competente','Pericia'].map((t, i) => `<option value="${i}" ${(S.per[s[0]] || 0) === i ? 'selected' : ''}>${t}</option>`).join('')}</select>`).join('')}</div>
  </div></details>

  <details class="sec"><summary>Combate</summary><div class="in">
    ${F('Clase de Armadura','ca')}${F('Velocidad','vel')}
    <label class="f"><span>PG máximo (vacío = ${c.pgAuto} auto)</span><input data-k="pgMax" value="${esc(S.pgMax)}" placeholder="${c.pgAuto}"></label>
    ${F('Iniciativa extra (p. ej. Alerta)','iniExtra','number')}
    <label class="chk full" style="grid-column:1/-1"><input type="checkbox" data-k="inspiracion" ${S.inspiracion ? 'checked' : ''}>Inspiración heroica</label>
    ${atks}
    <button class="btn" type="button" id="addAtk" style="grid-column:1/-1">+ Ataque</button>
  </div></details>

  <details class="sec"><summary>Equipo, rasgos y otros</summary><div class="in">
    <p class="hint">Un elemento por renglón. En "Otros" usa <i>Nombre: valor</i>.</p>
    ${F('Equipo','equipo','area','full')}${F('Rasgos y dotes','rasgos','area','full')}${F('Otros','otros','area','full')}
  </div></details>

  <details class="sec"><summary>Conjuros</summary><div class="in">
    <p class="hint">${c.hab ? `${c.cl.n}: CD ${c.cd}, ataque ${sig(c.ataqueConj)}. Espacios automáticos por clase y nivel.` : 'Esta clase no lanza conjuros; deja vacío o anota los de dotes.'}</p>
    ${F('Trucos','trucos','area','full')}${F('Conjuros preparados','preparados','area','full')}
    <label class="f full"><span>Espacios a mano (vacío = automático, ej. 4/3/2)</span><input data-k="espacios" value="${esc(S.espacios)}"></label>
  </div></details>

  <details class="sec"><summary>Notas y trasfondo</summary><div class="in">${F('Notas','notas','area','full')}</div></details>`;
}

function setTpl() {
  document.querySelectorAll('.sw').forEach(b => b.setAttribute('aria-pressed', b.dataset.t === S.plantilla));
}
function refresh(full) { save(); setTpl(); renderSheet(); if (full) { const open = [...document.querySelectorAll('details.sec')].map(d => d.open); renderForm(); document.querySelectorAll('details.sec').forEach((d, i) => d.open = open[i] ?? d.open); } }

// ---------- eventos ----------
document.addEventListener('input', e => {
  const t = e.target;
  if (t.dataset.k) {
    const k = t.dataset.k;
    S[k] = t.type === 'checkbox' ? t.checked : t.type === 'number' || t.type === 'range' ? (t.value === '' ? '' : +t.value) : t.value;
    if (k === 'clase') S.salv = [...CLASES[S.clase].sv];
    refresh();
  } else if (t.dataset.sv) {
    const k = t.dataset.sv; S.salv = t.checked ? [...new Set([...S.salv, k])] : S.salv.filter(x => x !== k); refresh();
  } else if (t.dataset.sk) {
    S.per[t.dataset.sk] = +t.value; refresh();
  } else if (t.dataset.a) {
    const a = S.ataques[+t.closest('.atk').dataset.i];
    a[t.dataset.a] = t.type === 'checkbox' ? t.checked : t.type === 'number' ? +t.value : t.value; refresh();
  }
});
// las etiquetas de valores calculados del formulario se actualizan al salir del campo
document.addEventListener('change', e => { if (e.target.closest('#form') && !e.target.matches('textarea,input[type=text],input:not([type])')) refresh(true); });

document.addEventListener('click', e => {
  const t = e.target;
  if (t.dataset.del != null) { S.ataques.splice(+t.dataset.del, 1); refresh(true); }
  else if (t.id === 'addAtk') { S.ataques.push({n:'', hab:'fue', comp:true, dado:'', tipo:'', extra:0, dm:true, maes:'', alc:''}); refresh(true); }
  else if (t.id === 'retDel') { S.retrato = ''; refresh(true); }
  else if (t.classList.contains('sw')) { S.plantilla = t.dataset.t; refresh(); }
  else if (t.dataset.tab) { document.body.dataset.tab = t.dataset.tab; document.querySelectorAll('[data-tab]').forEach(b => b.setAttribute('aria-pressed', b === t)); scaleSheet(); }
});

$('#pregen').addEventListener('change', e => {
  const v = e.target.value; e.target.value = '';
  if (!v) return;
  if (!confirm('Esto reemplaza la hoja actual. Si no la has guardado, se pierde. ¿Seguir?')) return;
  S = v === 'nueva' ? blank() : structuredClone(PREGENS[v]);
  refresh(true);
});

$('#btnSave').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(S, null, 1)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = (S.nombre || 'personaje').replace(/[^\wáéíóúñü -]/gi, '').trim().replace(/\s+/g, '_') + '.json';
  a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
});
$('#btnLoad').addEventListener('click', () => $('#jsonFile').click());
$('#jsonFile').addEventListener('change', async e => {
  const f = e.target.files[0]; e.target.value = '';
  if (!f) return;
  try { S = {...blank(), ...JSON.parse(await f.text())}; refresh(true); } catch { alert('Ese archivo no es una hoja válida.'); }
});
$('#btnPrint').addEventListener('click', () => window.print());

$('#retFile').addEventListener('change', e => {
  const f = e.target.files[0]; e.target.value = '';
  if (!f) return;
  const img = new Image();
  img.onload = () => {
    const k = Math.min(1, 700 / Math.max(img.width, img.height));
    const cv = document.createElement('canvas'); cv.width = img.width * k; cv.height = img.height * k;
    cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
    S.retrato = cv.toDataURL('image/jpeg', .85); URL.revokeObjectURL(img.src); refresh(true);
  };
  img.src = URL.createObjectURL(f);
});

new ResizeObserver(scaleSheet).observe($('#stage'));
document.fonts?.ready.then(() => renderSheet());
renderForm(); refresh();
