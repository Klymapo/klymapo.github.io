/* Contenido del portafolio. Para agregar un proyecto, copia un objeto y ajústalo.
   modes: "a" = Modo Analista, "n" = Modo Narrador (puede ir en ambos).
   repo: nombre del repo público en GitHub (la fecha se lee sola). Si es privado, deja repo vacío y pon "date".
   cover: dos o tres letras (respaldo si falta imagen).
   logo / poster / shots: nombres de archivo en img/ sin ".webp". concept: true marca las imágenes como arte conceptual. */
window.PORTFOLIO = {
  projects: [
    {
      id: "racoon", title: "RACOON", cover: "RC", logo: "racoon", shots: ["racoon-agenda", "racoon-ficha"], modes: ["a"], repo: "RACOON", status: "active",
      es: { kind: "App · PWA", short: "Seguimiento de series de anime: agenda, progreso por episodio y respaldos.", long: "PWA local-first para descubrir series, consultar su calendario y registrar el avance por episodio desde el navegador. Se instala en Android o escritorio, no pide cuenta y guarda respaldos locales. Cada dato muestra su fuente y si está confirmado o estimado.", role: "Diseño, desarrollo y datos" },
      en: { kind: "App · PWA", short: "Anime tracker: schedule, per-episode progress and backups.", long: "Local-first PWA to discover shows, check their schedule and log progress per episode in the browser. Installs on Android or desktop, needs no account and keeps local backups. Every field shows its source and whether it is confirmed or estimated.", role: "Design, development and data" },
      tags: ["PWA", "JavaScript", "AniList API"]
    },
    {
      id: "badia", title: "BADIA", cover: "BD", logo: "badia", shots: ["badia-01-conciliacion", "badia-02-linea-tiempo"], modes: ["a"], repo: "", date: "2026-10-13", status: "dev",
      es: { kind: "Análisis de datos", short: "Cruce de fuentes documentales para estudiar patrones geográficos y temporales.", long: "Proyecto de analítica sobre casos criminales históricos ya documentados. Reúne, limpia y relaciona fuentes públicas para construir un conjunto de datos explicable y reproducible, con visualizaciones de patrones geográficos, temporales y biográficos.", role: "Obtención de datos, limpieza, SQL, estadística y visualización" },
      en: { kind: "Data analysis", short: "Cross-referencing documentary sources to study geographic and time patterns.", long: "Analytics project on historical, already documented criminal cases. It gathers, cleans and links public sources into an explainable, reproducible dataset, with visualizations of geographic, temporal and biographical patterns.", role: "Data sourcing, cleaning, SQL, statistics and visualization" },
      tags: ["Python", "SQL", "Estadística"]
    },
    {
      id: "silverswift", title: "Silver Swift", cover: "SS", logo: "silver-swift", shots: ["silver-swift-caso-01-portada", "silver-swift-caso-02-logica", "silver-swift-caso-03-telemetria", "silver-swift-caso-04-interfaz"], modes: ["a"], repo: "", date: "2026-08-30", status: "dev",
      es: { kind: "Producto · Traducción", short: "Traducción multiformato: documentos, imágenes, audio y video.", long: "Plataforma de traducción que recibe documentos (EPUB, PDF, DOCX), imágenes con OCR, audio y video, detecta el tipo de medio y el idioma, y entrega la versión traducida en el mismo formato. El motor de traducción es intercambiable y corre con herramientas libres.", role: "Arquitectura, prototipo y medición de rendimiento" },
      en: { kind: "Product · Translation", short: "Multiformat translation: documents, images, audio and video.", long: "Translation platform that takes documents (EPUB, PDF, DOCX), images via OCR, audio and video, detects media type and language, and returns the translated version in the same format. The translation engine is swappable and runs on free tools.", role: "Architecture, prototype and performance measurement" },
      tags: ["Python", "LibreTranslate", "OCR"]
    },
    {
      id: "rupert", title: "Rupert", cover: "RU", logo: "rupert", shots: ["rupert-principal"], concept: true, modes: ["a"], repo: "RUPERT", status: "dev",
      es: { kind: "App · Asistente IA", short: "Asistente personal por voz, pensado primero para el celular.", long: "Centro de asistencia personal de bajo costo: interfaz para el teléfono, autenticación y funciones en la nube, y modelos de IA gratuitos. La memoria privada y los secretos viven fuera del repositorio público.", role: "Arquitectura y desarrollo" },
      en: { kind: "App · AI assistant", short: "Voice-driven personal assistant, built phone-first.", long: "Low-cost personal assistant hub: a phone-first interface, cloud auth and functions, and free AI models. Private memory and secrets live outside the public repository.", role: "Architecture and development" },
      tags: ["PWA", "Supabase", "Workers AI"]
    },
    {
      id: "naofumi", title: "NAOFUMI", cover: "NF", logo: "naofumi", shots: ["naofumi-inicio", "naofumi-ofertas"], modes: ["a"], repo: "NAOFUMI", status: "dev",
      es: { kind: "App · Herramienta", short: "Radar freelance local para encargos, propuestas y cobros.", long: "Interfaz para celular y escritorio que organiza encargos, hipótesis de clientes, propuestas, trabajos y cobros. Corre en tu equipo, funciona sin internet y no envía datos a ningún servicio.", role: "Diseño y desarrollo" },
      en: { kind: "App · Tool", short: "Local freelance radar for leads, proposals and payments.", long: "Mobile and desktop interface to organize leads, client hypotheses, proposals, jobs and payments. Runs on your machine, works offline and sends data nowhere.", role: "Design and development" },
      tags: ["Node.js", "Offline-first"]
    },
    {
      id: "peso", title: "El peso de los nombres", cover: "PN", logo: "el-peso-de-los-nombres", shots: ["peso-hub-inicio", "peso-hub-mapa", "peso-b2-lectura", "peso-4-cambio-a-theo", "peso-cinematica-theo-alastor"], modes: ["a", "n"], repo: "", date: "2026-10-12", status: "dev",
      es: { kind: "Videojuego · Godot", short: "Whodunit noir en 3D ambientado en el mundo de AlasTheo.", long: "Videojuego de misterio en Godot con personajes 3D estilo chibi low-poly. Une la investigación tipo whodunit con el mundo y los personajes de la saga AlasTheo. El código es privado mientras está en desarrollo.", role: "Diseño de juego, narrativa y desarrollo" },
      en: { kind: "Video game · Godot", short: "3D noir whodunit set in the AlasTheo world.", long: "Mystery game in Godot with chibi low-poly 3D characters. It blends whodunit investigation with the world and cast of the AlasTheo saga. Source is private while in development.", role: "Game design, narrative and development" },
      tags: ["Godot", "GDScript", "Narrativa"]
    },
    {
      id: "copox", title: "COPOX", cover: "CX", logo: "copox", shots: ["copox-proceso-01-volumen-alpha", "copox-proceso-02-topologia-alpha", "copox-proceso-03-materiales-alpha", { src: "copox-etapa-theo-v4-3", es: "Etapa actual · Theo V4.3, en revisión", en: "Current stage · Theo V4.3, under review" }, { src: "copox-etapa-alastor-v12", es: "Etapa actual · Alastor V12, en revisión", en: "Current stage · Alastor V12, under review" }], modes: ["a"], repo: "COPOX", status: "exp",
      es: { kind: "3D · Automatización", short: "Personajes 3D low-poly generados con scripts de Blender.", long: "Laboratorio de assets 3D en estilo chibi low-poly para el videojuego. Los modelos se generan con scripts de Blender que corren sin interfaz, incluso en GitHub Actions, con un estándar de medidas y pruebas de comparación.", role: "Pipeline 3D y automatización" },
      en: { kind: "3D · Automation", short: "Low-poly 3D characters generated with Blender scripts.", long: "Lab of chibi low-poly 3D assets for the game. Models are built with headless Blender scripts, including on GitHub Actions, following a measurement standard and comparison tests.", role: "3D pipeline and automation" },
      tags: ["Blender", "Python", "GitHub Actions"]
    },
    {
      id: "sunraku", title: "SUNRAKU", cover: "SR", logo: "sunraku-v02", logoBg: "light", shots: ["sunraku-ux-ui-propuesta-v02"], concept: true, modes: ["a"], repo: "SUNRAKU-", date: "2026-10-22", status: "design",
      es: { kind: "App · Texto a voz", short: "Estudio privado para convertir textos en narración.", long: "Importa texto pegado, TXT, DOCX, EPUB o PDF, lo divide en capítulos y fragmentos editables y prepara paquetes de trabajo para generar la narración en sesiones manuales de cómputo gratuito. Después se importan y revisan los audios. Solo usa voces propias o autorizadas y modelos con licencia comercial libre. Las cinemáticas del videojuego y la voz de Rupert quedan para una etapa posterior.", role: "Diseño de producto" },
      en: { kind: "App · Text to speech", short: "Private studio that turns text into narration.", long: "Imports pasted text, TXT, DOCX, EPUB or PDF, splits it into editable chapters and fragments, and prepares job packages to generate narration in manual sessions on free compute. Audio is then imported and reviewed. It only uses own or authorized voices and models with commercial-friendly licenses. Game cutscenes and Rupert's voice come in a later stage.", role: "Product design" },
      tags: ["TTS", "React", "Cloudflare Workers"]
    },
    {
      id: "rimuru", title: "RIMURU", cover: "RM", logo: "rimuru", logoBg: "light", shots: ["rimuru-ux-ui-propuesta-v01"], concept: true, modes: ["a", "n"], repo: "", date: "2026-10-22", status: "design",
      es: { kind: "App · Convocatorias", short: "Radar de concursos y convocatorias para novela, cuento y guion.", long: "Busca concursos, convocatorias y proyectos independientes de escritura en varios idiomas, con filtros por género, país y cuota. Cada ficha guarda bases, fechas, requisitos y derechos con su fuente, y un tablero sigue cada participación hasta el resultado. No sube manuscritos ni envía postulaciones por su cuenta.", role: "Diseño de producto" },
      en: { kind: "App · Open calls", short: "Radar for novel, short story and screenplay contests and open calls.", long: "Finds writing contests, open calls and indie projects in several languages, with filters by genre, country and fee. Each entry keeps rules, dates, requirements and rights with their source, and a board tracks every submission until the result. It never uploads manuscripts or submits on its own.", role: "Product design" },
      tags: ["React", "Cloudflare Workers", "PWA"]
    },
    {
      id: "guardian", title: "GUARDIAN", cover: "GD", logo: "guardian", logoBg: "light", shots: ["guardian-ux-ui-propuesta-v01"], concept: true, modes: ["a"], repo: "", date: "2026-10-22", status: "design",
      es: { kind: "App · Datos abiertos", short: "Avisos de fenómenos naturales de fuentes oficiales, cerca de ti y en el mundo.", long: "Panel de eventos y avisos oficiales de fenómenos naturales con mapa complementario, filtros por tipo y zona, y notificaciones. Separa lo observado de los avisos oficiales y muestra siempre la fuente y la hora. Nace de mi participación en Meta Quetzal, en el NASA Space Apps Challenge.", role: "Diseño de producto y datos" },
      en: { kind: "App · Open data", short: "Natural hazard alerts from official sources, nearby and worldwide.", long: "Dashboard of natural events and official advisories with a companion map, filters by type and area, and notifications. It keeps observations apart from official warnings and always shows source and time. It grew out of my team's Meta Quetzal project at the NASA Space Apps Challenge.", role: "Product and data design" },
      tags: ["NASA EONET", "React", "Cloudflare Workers"]
    },
    {
      id: "atlas", title: "ATLAS", cover: "AT", logo: "atlas", shots: ["atlas-inicio", "atlas-investigar-v09"], modes: ["a", "n"], repo: "ATLAS", status: "exp",
      es: { kind: "Juego educativo", short: "Aventura detectivesca para aprender cinco idiomas comparándolos.", long: "Resuelves casos, encuentras pistas y aprendes inglés, francés, alemán, ruso y japonés por comparación, con toda la navegación en español. Capítulos y ejercicios ampliables.", role: "Diseño narrativo, diseño de aprendizaje y desarrollo" },
      en: { kind: "Educational game", short: "Detective adventure to learn five languages side by side.", long: "Solve cases, find clues and learn English, French, German, Russian and Japanese by comparison, with Spanish-first navigation. Expandable chapters and exercises.", role: "Narrative design, learning design and development" },
      tags: ["Web", "i18n", "Diseño narrativo"]
    },
    {
      id: "moriarty", title: "MORIARTY", cover: "MO", logo: "moriarty", shots: ["moriarty-biblioteca", "moriarty-editor-v04"], modes: ["a", "n"], repo: "MORIARTY-", status: "dev",
      es: { kind: "App · Escritura", short: "Estudio de escritura offline con biblioteca de libros y sagas.", long: "Mi taller para escribir novelas: biblioteca de libros, sagas, sinopsis y búsqueda. Funciona sin conexión, sin cuentas y sin APIs de pago.", role: "Diseño y desarrollo" },
      en: { kind: "App · Writing", short: "Offline writing studio with a library of books and sagas.", long: "My workshop for writing novels: a library of books, sagas, synopses and search. Works offline, with no accounts and no paid APIs.", role: "Design and development" },
      tags: ["PWA", "JavaScript"]
    },
    {
      id: "brillo", title: "El brillo ausente", cover: "BA", poster: "el-brillo-ausente-portada", modes: ["n"], repo: "", status: "writing",
      es: { kind: "Novela negra · Saga AlasTheo", short: "Alastor y Theo, detectives consultores, investigan en Verlhaven.", long: "Primer libro de la saga AlasTheo. Alastor Kleinteil y Theo Lunette, un dúo de detectives consultores, resuelven un caso en la ciudad de Verlhaven. Novela negra con misterio de juego limpio.", role: "Autor" },
      en: { kind: "Noir novel · AlasTheo saga", short: "Consulting detectives Alastor and Theo investigate in Verlhaven.", long: "First book of the AlasTheo saga. Alastor Kleinteil and Theo Lunette, a consulting detective duo, work a case in the city of Verlhaven. Noir with a fair-play mystery.", role: "Author" },
      tags: ["Novela negra", "Misterio"]
    },
    {
      id: "hermanas", title: "El problema de las tres hermanas", cover: "3H", poster: "el-problema-de-las-tres-hermanas-portada", modes: ["n"], repo: "", status: "writing",
      es: { kind: "Novela negra · Saga AlasTheo", short: "Segundo caso de Alastor y Theo.", long: "Segundo libro de la saga AlasTheo. Un nuevo caso para el dúo de Verlhaven.", role: "Autor" },
      en: { kind: "Noir novel · AlasTheo saga", short: "Alastor and Theo's second case.", long: "Second book of the AlasTheo saga. A new case for the Verlhaven duo.", role: "Author" },
      tags: ["Novela negra", "Misterio"]
    },
    {
      id: "signalis", title: "SIGNALIS", cover: "SG", logo: "signalis", shots: ["signalis-principal"], concept: true, modes: ["n"], repo: "", date: "2026-10-13", status: "writing",
      es: { kind: "Ciencia ficción juvenil", short: "Kaien Novar aprende a pilotar un MANEK a distancia, con toda la arena mirando.", long: "Saga de ciencia ficción juvenil en Auracivis, una república tecnocrática donde la tecnología Signalis deja operar cuerpos mecánicos, los MANEK, desde una cápsula. Kaien Novar entra al circuito de entrenamiento y competencia, se mide contra Rin Cuprian, el mejor piloto del momento, y descubre que cada enlace cobra algo: fatiga, latencia y casas poderosas que deciden quién accede a la tecnología.", role: "Autor y construcción de mundo" },
      en: { kind: "YA science fiction", short: "Kaien Novar learns to pilot a MANEK remotely, with the whole arena watching.", long: "YA science fiction saga set in Auracivis, a technocratic republic where Signalis technology lets people run mechanical bodies, the MANEK, from a capsule. Kaien Novar joins the training and competition circuit, faces Rin Cuprian, the best pilot around, and learns that every link takes a toll: fatigue, latency and powerful houses that decide who gets access.", role: "Author and worldbuilding" },
      tags: ["Sci-fi", "Worldbuilding"]
    },
    {
      id: "flowers", title: "Flowers Crown", cover: "FC", logo: "flowers-crown", shots: ["flowers-crown-principal"], concept: true, modes: ["n"], repo: "", status: "writing",
      es: { kind: "Narrativa · Fantasía", short: "En Sense's Paradise, el pueblo que surte de flores a todo el reino, Bart sale a buscar una raíz casi imposible.", long: "Historia ambientada en Sense's Paradise, un pueblo que vive del cultivo y comercio de flores decorativas y medicinales. Arranca con Bart, el nieto del dueño de la posada, subiendo una montaña al amanecer en busca de la flor del Corazón de María a cambio de unas horas libres.", role: "Autor" },
      en: { kind: "Fiction · Fantasy", short: "In Sense's Paradise, the village that supplies flowers to the whole kingdom, Bart goes after an almost impossible root.", long: "A story set in Sense's Paradise, a village that lives off growing and trading decorative and medicinal flowers. It opens with Bart, the innkeeper's grandson, climbing a mountain at dawn in search of the Heart of Mary flower in exchange for a few hours off.", role: "Author" },
      tags: ["Fantasía", "En desarrollo"]
    }
  ],

  cvFiles: { a: "cv/CV_Mario_Martinez_Horta_Data_Analytics.pdf", n: "cv/CV_Atatoriz_Mario_Martinez_Horta_Narrativa.pdf" },

  credits: {
    es: {
      a: { name: "Mario Martínez Horta", role: "Analista de datos", lines: [
        ["Hoy", "Data Analyst Intern · Honeywell"],
        ["2024 a 2025", "Auditor y Supervisor Técnico · Copemsa"],
        ["2023 a 2024", "Técnico electromecánico · Meypar"],
        ["Estudios", "Ingeniería Industrial y Administración (en curso) · Técnico en Mecatrónica · Data Analyst Foundations (Udemy)"],
        ["Herramientas", "Python, SQL, Power BI, Excel, Godot, Blender"],
        ["Idiomas", "Español nativo, inglés avanzado, alemán y francés básico"]
      ]},
      n: { name: "Atátoriz", role: "Escritor y diseñador narrativo", lines: [
        ["Escribe", "Novela negra y ciencia ficción juvenil"],
        ["Diseña", "Narrativa para videojuegos y partidas de rol"],
        ["Sagas", "AlasTheo, SIGNALIS"]
      ]},
      cv: { a: "Descargar CV técnico (PDF)", n: "Descargar CV creativo (PDF)" }
    },
    en: {
      a: { name: "Mario Martínez Horta", role: "Data analyst", lines: [
        ["Now", "Data Analyst Intern · Honeywell"],
        ["2024 to 2025", "Technical Auditor and Supervisor · Copemsa"],
        ["2023 to 2024", "Electromechanical technician · Meypar"],
        ["Education", "Industrial Engineering and Management (in progress) · Mechatronics technician · Data Analyst Foundations (Udemy)"],
        ["Tools", "Python, SQL, Power BI, Excel, Godot, Blender"],
        ["Languages", "Native Spanish, advanced English, basic German and French"]
      ]},
      n: { name: "Atátoriz", role: "Writer and narrative designer", lines: [
        ["Writes", "Noir fiction and YA science fiction"],
        ["Designs", "Narrative for video games and tabletop sessions"],
        ["Sagas", "AlasTheo, SIGNALIS"]
      ]},
      cv: { a: "Download technical CV (PDF, Spanish)", n: "Download creative CV (PDF, Spanish)" }
    }
  }
};
