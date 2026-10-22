/* Mascota pixel art: reacciona a botones y cambios de pantalla. */
(() => {
  const box = document.getElementById("mascot");
  const img = document.getElementById("mascot-img");
  const bubble = document.getElementById("mascot-bubble");
  if (!box) return;

  const SAY = {
    es: {
      "#modo": ["¡A jugar!", "¡Vamos!"], "#creditos": ["Ese soy yo.", "Un poco de mí."], "#contacto": ["¿Platicamos?", "¡Escríbeme!"],
      "#opciones": ["Ajústalo a tu gusto.", "Listo."], "#analista": ["Datos de día.", "¡Modo Analista!"], "#narrador": ["Historias de noche.", "¡Modo Narrador!"],
      "#menu": ["¿Regresamos?", "Al menú."], slot: [t => `¿Abrimos ${t}?`, "¡Partida cargada!"], lang: ["¿Otro idioma?", "¡Cambiado!"],
      motion: ["¿Más calma?", "Hecho."], cv: ["Mi CV, recién salido.", "¡Gracias por leerlo!"], code: ["Aquí está el código.", "¡A curiosear!"],
      mail: ["Mi correo.", "¡Te leo!"], linkedin: ["También ando por LinkedIn.", "¡Conectemos!"], github: ["Mi GitHub.", "¡Bienvenido!"],
      close: ["¿Ya viste suficiente?", "¡Va!"],
      screen: { select: "¿Qué lado quieres ver?", sa: "Esto es lo que construyo.", sn: "Esto es lo que escribo.", credits: "Un poco de mí.", contact: "¡Aquí estoy!", options: "Configura a tu gusto." }
    },
    en: {
      "#modo": ["Let's play!", "Here we go!"], "#creditos": ["That's me.", "A bit about me."], "#contacto": ["Shall we talk?", "Write to me!"],
      "#opciones": ["Make it yours.", "Done."], "#analista": ["Data by day.", "Analyst mode!"], "#narrador": ["Stories by night.", "Storyteller mode!"],
      "#menu": ["Back to menu?", "Menu it is."], slot: [t => `Open ${t}?`, "Save loaded!"], lang: ["Another language?", "Switched!"],
      motion: ["Calmer?", "Done."], cv: ["My CV, fresh out.", "Thanks for reading!"], code: ["Here's the code.", "Dig in!"],
      mail: ["My email.", "I'll read you!"], linkedin: ["I'm on LinkedIn too.", "Let's connect!"], github: ["My GitHub.", "Welcome!"],
      close: ["Seen enough?", "Okay!"],
      screen: { select: "Which side do you want to see?", sa: "This is what I build.", sn: "This is what I write.", credits: "A bit about me.", contact: "Here I am!", options: "Set it up your way." }
    }
  };
  const lang = () => (document.documentElement.lang === "en" ? "en" : "es");
  const reduced = () => document.body.dataset.motion === "reduced" || matchMedia("(prefers-reduced-motion: reduce)").matches;
  const src = n => (reduced() ? "img/px2/m_idle.png" : `img/px2/m_${n}.gif`);

  let poseTimer, talkTimer, last = null;
  function pose(name, ms) {
    img.src = src(name);
    clearTimeout(poseTimer);
    if (ms) poseTimer = setTimeout(() => { img.src = src("idle"); }, ms);
  }
  function say(text, ms = 2400) {
    if (!text) return;
    bubble.textContent = text;
    box.classList.add("talk");
    clearTimeout(talkTimer);
    talkTimer = setTimeout(() => box.classList.remove("talk"), ms);
  }
  function lines(el) {
    const S = SAY[lang()];
    if (el.matches(".slot")) { const t = el.querySelector("h3"); return [S.slot[0](t ? t.textContent : ""), S.slot[1]]; }
    if (el.matches("[data-lang]")) return S.lang;
    if (el.matches("[data-motion]")) return S.motion;
    if (el.matches("[download]")) return S.cv;
    if (el.id === "sheet-close") return S.close;
    const href = el.getAttribute("href") || "";
    if (href.startsWith("mailto:")) return S.mail;
    if (href.includes("linkedin.com")) return S.linkedin;
    if (/github\.com\/Klymapo\/./.test(href)) return S.code;
    if (href.includes("github.com")) return S.github;
    return S[href] || null;
  }
  const TARGET = ".menu-item, .slot, .btn, .back, .switch, .sheet-close";

  function hover(e) {
    const el = e.target.closest(TARGET);
    if (!el || el === last) return;
    last = el;
    const l = lines(el);
    if (!l) return;
    pose("look", 1400);
    say(l[0]);
  }
  document.addEventListener("pointerover", hover);
  document.addEventListener("focusin", hover);
  document.addEventListener("click", e => {
    const el = e.target.closest(TARGET);
    if (!el) return;
    const l = lines(el);
    pose("cheer", 560);
    if (l) setTimeout(() => say(l[1]), 30);
  });

  function onScreen() {
    last = null;
    const scr = document.body.dataset.screen, mode = document.body.dataset.mode;
    const S = SAY[lang()].screen;
    const key = scr === "saves" ? "s" + mode : scr;
    if (S[key]) { pose("wave", 900); setTimeout(() => say(S[key], 2600), 50); }
  }
  window.addEventListener("hashchange", () => setTimeout(onScreen, 0));

  // Movimiento reducido: imágenes fijas en lugar de GIF
  function applyMotion() {
    document.querySelectorAll("img.px[data-still]").forEach(i => {
      if (!i.dataset.anim) i.dataset.anim = i.getAttribute("src");
      i.src = reduced() ? i.dataset.still : i.dataset.anim;
    });
    img.src = src("idle");
  }
  document.addEventListener("click", e => { if (e.target.closest("[data-motion]")) setTimeout(applyMotion, 0); });
  applyMotion();
  setTimeout(onScreen, 300);
})();
