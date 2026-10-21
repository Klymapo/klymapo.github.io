(() => {
  "use strict";

  const DATA = window.PORTFOLIO;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  const UI = {
    es: {
      skip: "Saltar al contenido", tagline: "Datos de día. Historias de noche.",
      press: "Presiona Start", pressHint: "Enter o toca",
      mNew: "Elegir modo", mCredits: "Créditos", mContact: "Contacto", mOptions: "Opciones",
      controls: "↑ ↓ mover · Enter elegir · Esc volver",
      back: "← Menú", backModes: "← Modos", selectTitle: "Elige tu modo",
      modeA: "Modo Analista", modeADesc: "Datos, BI, apps y videojuegos. El lado que construye.",
      modeN: "Modo Narrador", modeNDesc: "Novela negra, ciencia ficción y diseño narrativo. El lado que cuenta.",
      saves: "Partidas guardadas", count: n => `${n} partidas guardadas`,
      goN: "Ir a Narrador →", goA: "Ir a Analista →",
      slot: "Ranura", updated: "Actualizado", close: "Cerrar ✕",
      role: "Mi papel", stack: "Herramientas", genre: "Género", repo: "Ver código", private: "Código privado",
      contactLead: "¿Un proyecto de datos, una app o una historia? Escríbeme.", email: "Correo",
      optLang: "Idioma", optMotion: "Movimiento", motionFull: "Normal", motionReduced: "Reducido",
      status: { active: "Activo", dev: "En desarrollo", exp: "Experimental", design: "En diseño", writing: "En escritura" }
    },
    en: {
      skip: "Skip to content", tagline: "Data by day. Stories by night.",
      press: "Press Start", pressHint: "Enter or tap",
      mNew: "Choose mode", mCredits: "Credits", mContact: "Contact", mOptions: "Options",
      controls: "↑ ↓ move · Enter select · Esc back",
      back: "← Menu", backModes: "← Modes", selectTitle: "Choose your mode",
      modeA: "Analyst Mode", modeADesc: "Data, BI, apps and games. The side that builds.",
      modeN: "Storyteller Mode", modeNDesc: "Noir, science fiction and narrative design. The side that tells.",
      saves: "Saved games", count: n => `${n} saved games`,
      goN: "Go to Storyteller →", goA: "Go to Analyst →",
      slot: "Slot", updated: "Updated", close: "Close ✕",
      role: "My role", stack: "Tools", genre: "Genre", repo: "View code", private: "Private source",
      contactLead: "A data project, an app or a story? Write to me.", email: "Email",
      optLang: "Language", optMotion: "Motion", motionFull: "Full", motionReduced: "Reduced",
      status: { active: "Active", dev: "In development", exp: "Experimental", design: "In design", writing: "Writing" }
    }
  };

  // ---------- Preferencias (con tolerancia a almacenamiento bloqueado) ----------
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* sin almacenamiento */ } }
  };
  let lang = store.get("lang") || ((navigator.language || "es").toLowerCase().startsWith("es") ? "es" : "en");
  let motion = store.get("motion") || (matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduced" : "full");
  let started = false;
  const t = () => UI[lang];

  // ---------- Fechas reales desde GitHub ----------
  const dates = {};
  async function loadDates() {
    const KEY = "gh-dates-v1";
    try {
      const cached = JSON.parse(sessionStorage.getItem(KEY) || "null");
      if (cached) { Object.assign(dates, cached); return; }
    } catch { /* ignorar */ }
    try {
      const r = await fetch("https://api.github.com/users/Klymapo/repos?per_page=100&type=owner");
      if (!r.ok) return;
      const list = await r.json();
      list.forEach(x => { dates[x.name] = x.pushed_at; });
      try { sessionStorage.setItem(KEY, JSON.stringify(dates)); } catch { /* ignorar */ }
      if (document.body.dataset.screen === "saves") renderSlots();
    } catch { /* sin red: se usan fechas fijas o se omiten */ }
  }
  function dateOf(p) {
    const iso = (p.repo && dates[p.repo]) || p.date;
    if (!iso) return "";
    const d = new Date(iso.length === 10 ? iso + "T12:00:00" : iso);
    return d.toLocaleDateString(lang === "es" ? "es-MX" : "en-US", { day: "numeric", month: "short", year: "numeric" });
  }

  // ---------- Textos ----------
  function applyText() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach(el => {
      const v = t()[el.dataset.i18n];
      if (typeof v === "string") el.textContent = v;
    });
    $$("[data-count]").forEach(el => {
      el.textContent = t().count(DATA.projects.filter(p => p.modes.includes(el.dataset.count)).length);
    });
    $$("[data-lang]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    $$("[data-motion]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.motion === motion)));
    document.body.dataset.motion = motion;
  }

  // ---------- Partidas guardadas ----------
  function coverHTML(p) { return `<div class="cover"><span>${p.cover}</span></div>`; }

  function renderSlots() {
    const mode = document.body.dataset.mode;
    const list = DATA.projects.filter(p => p.modes.includes(mode));
    $("#slots").innerHTML = list.map((p, i) => {
      const c = p[lang];
      const d = dateOf(p);
      return `<li><button class="slot menu-item" type="button" data-id="${p.id}">
        ${coverHTML(p)}
        <span>
          <span class="slot-num mono">${t().slot} ${String(i + 1).padStart(2, "0")} · ${c.kind}</span>
          <h3>${p.title}</h3>
          <p class="slot-short">${c.short}</p>
          <span class="slot-meta mono"><span class="status">${t().status[p.status]}</span>${d ? `<span>${t().updated} ${d}</span>` : ""}</span>
        </span>
      </button></li>`;
    }).join("");
    const sw = $("#mode-switch");
    sw.href = mode === "a" ? "#narrador" : "#analista";
    sw.textContent = mode === "a" ? t().goN : t().goA;
    $("#saves-h").textContent = `${mode === "a" ? t().modeA : t().modeN} · ${t().saves}`;
  }

  // ---------- Ficha ----------
  const sheet = $("#sheet");
  let lastFocus = null;
  function openSheet(id) {
    const p = DATA.projects.find(x => x.id === id);
    if (!p) return;
    const c = p[lang];
    lastFocus = document.activeElement;
    $("#sheet-cover").innerHTML = coverHTML(p);
    $("#sheet-title").textContent = p.title;
    const d = dateOf(p);
    $("#sheet-meta").textContent = [c.kind, t().status[p.status], d && `${t().updated} ${d}`].filter(Boolean).join(" · ");
    $("#sheet-body").textContent = c.long;
    const TAG_EN = { "Estadística": "Statistics", "Narrativa": "Narrative", "Diseño narrativo": "Narrative design", "Novela negra": "Noir", "Misterio": "Mystery", "En desarrollo": "In progress" };
    const tags = p.tags.map(x => lang === "en" ? (TAG_EN[x] || x) : x).join(", ");
    const label = p.status === "writing" ? t().genre : t().stack;
    $("#sheet-facts").innerHTML = `<dt>${t().role}</dt><dd>${c.role}</dd><dt>${label}</dt><dd>${tags}</dd>`;
    $("#sheet-links").innerHTML = p.repo
      ? `<a class="btn" href="https://github.com/Klymapo/${p.repo}" target="_blank" rel="noopener">${t().repo}</a>`
      : (p.status === "writing" ? "" : `<span class="private">${t().private}</span>`);
    if (typeof sheet.showModal === "function") sheet.showModal(); else sheet.setAttribute("open", "");
    $("#sheet-close").focus();
  }
  function closeSheet() {
    if (sheet.open) sheet.close();
    if (lastFocus) lastFocus.focus();
  }
  $("#sheet-close").addEventListener("click", closeSheet);
  sheet.addEventListener("click", e => { if (e.target === sheet) closeSheet(); });
  sheet.addEventListener("close", () => { if (lastFocus) lastFocus.focus(); });

  // ---------- Créditos ----------
  function renderCredits() {
    const c = DATA.credits[lang];
    const block = (k, x) => `<article class="credit credit-${k}">
      <h3>${x.name}</h3><p class="credit-role mono">${x.role}</p>
      <dl>${x.lines.map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`).join("")}</dl></article>`;
    $("#credits").innerHTML = block("a", c.a) + block("n", c.n) +
      `<p class="cv-line"><a href="mailto:mariomtzhrt@gmail.com?subject=CV">${c.cv}</a></p>`;
  }

  // ---------- Navegación ----------
  const ROUTES = {
    "": ["title", ""], "menu": ["title", ""], "modo": ["select", ""],
    "analista": ["saves", "a"], "narrador": ["saves", "n"],
    "creditos": ["credits", ""], "contacto": ["contact", ""], "opciones": ["options", ""]
  };
  function route() {
    const hash = location.hash.replace(/^#/, "");
    const [key, sub] = hash.split("/");
    const [screen, mode] = ROUTES[key] || ROUTES[""];
    if (sheet.open) sheet.close();
    if (key === "menu" || (key && key !== "")) started = true;
    document.body.dataset.screen = screen;
    document.body.dataset.mode = mode;
    $$(".screen").forEach(s => { s.hidden = true; });
    const el = $(`#screen-${screen}`);
    el.hidden = false;
    if (screen === "title") {
      $("#press-start").hidden = started;
      $("#main-menu").hidden = !started;
    }
    if (screen === "saves") renderSlots();
    if (screen === "credits") renderCredits();
    const first = screen === "title"
      ? (started ? $(".menu-item", el) : $("#press-start"))
      : $(".menu-item", el) || $(".back", el);
    if (first) first.focus({ preventScroll: true });
    window.scrollTo(0, 0);
    if (screen === "saves" && sub) openSheet(sub);
  }

  function pressStart() {
    started = true;
    $("#press-start").hidden = true;
    $("#main-menu").hidden = false;
    $(".menu-item", $("#main-menu")).focus();
  }
  $("#press-start").addEventListener("click", pressStart);

  $("#slots").addEventListener("click", e => {
    const b = e.target.closest(".slot");
    if (b) openSheet(b.dataset.id);
  });

  $$("[data-lang]").forEach(b => b.addEventListener("click", () => {
    lang = b.dataset.lang; store.set("lang", lang); applyText();
  }));
  $$("[data-motion]").forEach(b => b.addEventListener("click", () => {
    motion = b.dataset.motion; store.set("motion", motion); applyText();
  }));

  // Control con teclado tipo menú de juego
  document.addEventListener("keydown", e => {
    if (sheet.open) return; // el diálogo maneja Esc solo
    const screenEl = $(`#screen-${document.body.dataset.screen}`);
    if (document.body.dataset.screen === "title" && !started && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault(); pressStart(); return;
    }
    if (e.key === "Escape") {
      const back = $(".back", screenEl);
      if (back) { e.preventDefault(); back.click(); }
      return;
    }
    const keys = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"];
    if (!keys.includes(e.key)) return;
    const items = $$(".menu-item", screenEl).filter(x => x.offsetParent !== null);
    if (!items.length) return;
    e.preventDefault();
    const i = items.indexOf(document.activeElement);
    const step = (e.key === "ArrowDown" || e.key === "ArrowRight") ? 1 : -1;
    const next = i === -1 ? 0 : (i + step + items.length) % items.length;
    items[next].focus();
  });

  window.addEventListener("hashchange", route);
  applyText();
  route();
  loadDates();
})();
