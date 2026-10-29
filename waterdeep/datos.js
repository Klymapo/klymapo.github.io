// Reglas 5e 2024 (lo necesario para calcular la hoja) + pregenerados del one shot.
const ABIL = [['fue','FUE'],['des','DES'],['con','CON'],['int','INT'],['sab','SAB'],['car','CAR']];

const SKILLS = [
  ['acrobacias','Acrobacias','des'],['arcanos','Arcanos','int'],['atletismo','Atletismo','fue'],
  ['engano','Engaño','car'],['historia','Historia','int'],['interpretacion','Interpretación','car'],
  ['intimidacion','Intimidación','car'],['investigacion','Investigación','int'],['juegomanos','Juego de Manos','des'],
  ['medicina','Medicina','sab'],['naturaleza','Naturaleza','int'],['percepcion','Percepción','sab'],
  ['perspicacia','Perspicacia','sab'],['persuasion','Persuasión','car'],['religion','Religión','int'],
  ['sigilo','Sigilo','des'],['supervivencia','Supervivencia','sab'],['tratoanimales','Trato con Animales','sab']
];

// dg = dado de golpe · sv = salvaciones · cast = tipo de lanzador · hab = característica mágica
const CLASES = {
  barbaro:   {n:'Bárbaro',    dg:12, sv:['fue','con'], cast:null},
  bardo:     {n:'Bardo',      dg:8,  sv:['des','car'], cast:'full', hab:'car'},
  brujo:     {n:'Brujo',      dg:8,  sv:['sab','car'], cast:'pact', hab:'car'},
  clerigo:   {n:'Clérigo',    dg:8,  sv:['sab','car'], cast:'full', hab:'sab'},
  druida:    {n:'Druida',     dg:8,  sv:['int','sab'], cast:'full', hab:'sab'},
  explorador:{n:'Explorador', dg:10, sv:['fue','des'], cast:'half', hab:'sab'},
  guerrero:  {n:'Guerrero',   dg:10, sv:['fue','con'], cast:null},
  hechicero: {n:'Hechicero',  dg:6,  sv:['con','car'], cast:'full', hab:'car'},
  mago:      {n:'Mago',       dg:6,  sv:['int','sab'], cast:'full', hab:'int'},
  monje:     {n:'Monje',      dg:8,  sv:['fue','des'], cast:null},
  paladin:   {n:'Paladín',    dg:10, sv:['sab','car'], cast:'half', hab:'car'},
  picaro:    {n:'Pícaro',     dg:8,  sv:['des','int'], cast:null}
};

// Espacios de conjuro por nivel de personaje (1–20)
const SLOTS_FULL = [[2],[3],[4,2],[4,3],[4,3,2],[4,3,3],[4,3,3,1],[4,3,3,2],[4,3,3,3,1],[4,3,3,3,2],
  [4,3,3,3,2,1],[4,3,3,3,2,1],[4,3,3,3,2,1,1],[4,3,3,3,2,1,1],[4,3,3,3,2,1,1,1],[4,3,3,3,2,1,1,1],
  [4,3,3,3,2,1,1,1,1],[4,3,3,3,3,1,1,1,1],[4,3,3,3,3,2,1,1,1],[4,3,3,3,3,2,2,1,1]];
const SLOTS_HALF = [[2],[2],[3],[3],[4,2],[4,2],[4,3],[4,3],[4,3,2],[4,3,2],[4,3,3],[4,3,3],
  [4,3,3,1],[4,3,3,1],[4,3,3,2],[4,3,3,2],[4,3,3,3,1],[4,3,3,3,1],[4,3,3,3,2],[4,3,3,3,2]];

const PREGENS = {
  kael: {
    plantilla:'naranja', nombre:'Kael Vesper', jugador:'', especie:'Humano', clase:'picaro', subclase:'Ladrón',
    trasfondo:'Criminal', nivel:5, alineamiento:'Neutral', xp:'6500',
    fue:8, des:18, con:14, int:12, sab:10, car:15,
    salv:['des','int'],
    per:{acrobacias:1, engano:2, investigacion:1, juegomanos:1, percepcion:1, persuasion:1, sigilo:2},
    ca:16, vel:'30 pies', pgMax:'', iniExtra:3, inspiracion:true,
    ataques:[
      {n:'Espada corta', hab:'sut', comp:true, dado:'1d6', tipo:'perf.', extra:0, dm:true, maes:'Hostigar', alc:'5 pies'},
      {n:'Daga (x2)', hab:'sut', comp:true, dado:'1d4', tipo:'perf.', extra:0, dm:true, maes:'Mella · arrojadiza', alc:'5 / 20-60'},
      {n:'Ballesta ligera', hab:'des', comp:true, dado:'1d8', tipo:'perf.', extra:0, dm:true, maes:'Ralentizar', alc:'80 / 320'}
    ],
    otros:'Ataque Furtivo: 3d6\nIdiomas: Común, Jerga de ladrones, Infracomún',
    equipo:'Cuero tachonado\nEspada corta y 2 dagas\nBallesta ligera y 20 virotes\nHerramientas de ladrón\nCapa con capucha y kit de disfraz\nBolsa con 25 po',
    rasgos:'Pericia (Engaño, Sigilo)\nAtaque Furtivo (3d6)\nMaestría con armas (2)\nAcción Astuta\nApuntar con Firmeza\nLadrón: Manos Rápidas, Trepador de Tejados\nGolpe Astuto\nEsquiva Asombrosa\nHumano: Ingenioso, Hábil, Versátil\nDote: Alerta (trasfondo)\nDote: Afortunado (humano)',
    trucos:'', preparados:'', espacios:'',
    notas:'Informante en los bajos fondos de Waterdeep. Conoce rumores sobre la nobleza y el culto de vampiros.',
    retrato:'', retX:50, retY:30
  },
  seraphine: {
    plantilla:'morado', nombre:'Seraphine Dathen', jugador:'', especie:'Elfa (Alto elfo)', clase:'clerigo', subclase:'Dominio de la Luz',
    trasfondo:'Acólita', nivel:5, alineamiento:'Legal buena', xp:'6500',
    fue:13, des:8, con:15, int:10, sab:18, car:13,
    salv:['sab','car'],
    per:{historia:1, medicina:1, percepcion:1, perspicacia:1, religion:1},
    ca:18, vel:'30 pies', pgMax:'', iniExtra:0, inspiracion:false,
    ataques:[
      {n:'Maza', hab:'fue', comp:true, dado:'1d6', tipo:'cont.', extra:0, dm:true, maes:'', alc:'5 pies'},
      {n:'Llama Sagrada', hab:'conj', comp:true, dado:'2d8', tipo:'radiante', extra:0, dm:false, maes:'Salvación DES', alc:'60 pies'},
      {n:'Doblar por los Muertos', hab:'conj', comp:true, dado:'2d8 / 2d12', tipo:'necrót.', extra:0, dm:false, maes:'Salvación SAB', alc:'60 pies'}
    ],
    otros:'Destello Protector: 4 / descanso largo\nIdiomas: Común, Élfico, Celestial',
    equipo:'Cota de malla y escudo\nMaza\nSímbolo sagrado de Lathander\nLibro de oraciones\nHierbas y ungüentos\nPaquete de sacerdote',
    rasgos:'Orden Divina: Protector\nCanalizar Divinidad (2 usos): Chispa Divina, Expulsar Muertos Vivientes, Resplandor del Alba\nDestello Protector\nAbrasar Muertos Vivientes\nElfa: Visión en la oscuridad 18 m, Linaje feérico, Sentidos agudos, Trance\nDote: Iniciado en la Magia (clérigo)',
    trucos:'Guía, Llama Sagrada, Luz, Taumaturgia\nPrestidigitación (alto elfo)\nResistencia, Doblar por los Muertos (dote)',
    preparados:'Dominio: Manos Ardientes, Fuego Feérico, Rayo Abrasador, Ver lo Invisible, Luz del Día, Bola de Fuego\nBendición, Curar Heridas, Escudo de la Fe, Saeta Guía, Arma Espiritual, Ayuda, Restablecimiento Menor, Revivir, Espíritus Guardianes\nDetectar Magia, Paso Brumoso (alto elfo)\nPalabra de Curación (dote)',
    espacios:'',
    notas:'Sirve en un templo de Lathander en Waterdeep. Investiga fenómenos sobrenaturales y la actividad vampírica.',
    retrato:'', retX:50, retY:30
  },
  aldric: {
    plantilla:'azul', nombre:'Aldric Morn', jugador:'', especie:'Humano', clase:'mago', subclase:'Ilusionista',
    trasfondo:'Sabio', nivel:5, alineamiento:'Neutral', xp:'6500',
    fue:8, des:14, con:15, int:18, sab:12, car:10,
    salv:['int','sab'],
    per:{arcanos:2, historia:1, investigacion:1, medicina:1, percepcion:1},
    ca:12, vel:'30 pies', pgMax:'', iniExtra:3, inspiracion:true,
    ataques:[
      {n:'Descarga de Fuego', hab:'conj', comp:true, dado:'2d10', tipo:'fuego', extra:0, dm:false, maes:'', alc:'120 pies'},
      {n:'Daga', hab:'sut', comp:true, dado:'1d4', tipo:'perf.', extra:0, dm:true, maes:'Arrojadiza', alc:'5 / 20-60'},
      {n:'Bastón', hab:'fue', comp:true, dado:'1d6', tipo:'cont.', extra:0, dm:true, maes:'Versátil (1d8)', alc:'5 pies'}
    ],
    otros:'CA 15 con Armadura de Mago\nIdiomas: Común, Élfico, Dracónico',
    equipo:'Bastón arcano (foco)\nLibro de conjuros\nDaga\nBolsa de componentes\nTinta, pluma y pergaminos\nTúnica de erudito',
    rasgos:'Recuperación Arcana\nAcadémico (Arcanos)\nIlusionista: Ilusiones Mejoradas\nMemorizar Conjuro\nHumano: Ingenioso, Hábil, Versátil\nDote: Iniciado en la Magia (mago)\nDote: Alerta (humano)',
    trucos:'Descarga de Fuego, Ilusión Menor, Luz, Mano de Mago\nPrestidigitación, Mensaje (dote)',
    preparados:'Escudo, Armadura de Mago, Detectar Magia, Imagen Silenciosa\nInvisibilidad, Sugestión, Imagen Múltiple\nContrahechizo, Patrón Hipnótico\nSueño (dote)',
    espacios:'',
    notas:'Erudito de la Biblioteca de Waterdeep. Sospecha que los vampiros usan ilusiones para manipular la ciudad.',
    retrato:'', retX:50, retY:30
  },
  thorne: {
    plantilla:'rojo', nombre:'Thorne Althar', jugador:'', especie:'Humano', clase:'paladin', subclase:'Juramento de Venganza',
    trasfondo:'Soldado', nivel:5, alineamiento:'Legal neutral', xp:'6500',
    fue:18, des:10, con:14, int:8, sab:12, car:15,
    salv:['sab','car'],
    per:{atletismo:1, intimidacion:1, percepcion:1, perspicacia:1, persuasion:1},
    ca:19, vel:'30 pies', pgMax:'54', iniExtra:0, inspiracion:true,
    ataques:[
      {n:'Espada larga', hab:'fue', comp:true, dado:'1d8', tipo:'cort.', extra:0, dm:true, maes:'Debilitar · Ataque Extra', alc:'5 pies'},
      {n:'Jabalina (x4)', hab:'fue', comp:true, dado:'1d6', tipo:'perf.', extra:0, dm:true, maes:'Ralentizar', alc:'30 / 120'},
      {n:'Golpe Divino', hab:'conj', comp:false, dado:'+2d8', tipo:'radiante', extra:0, dm:false, maes:'Al impactar · gasta espacio', alc:'—'}
    ],
    otros:'Imposición de Manos: 25 PG\nIdiomas: Común, Enano',
    equipo:'Cota de malla y escudo\nEspada larga\n4 jabalinas\nSímbolo sagrado\nInsignia de su antigua compañía\nPaquete de explorador',
    rasgos:'Imposición de Manos\nEstilo de combate: Defensa\nMaestría con armas (2)\nCanalizar Divinidad (2 usos): Sentido Divino, Voto de Enemistad\nAtaque Extra\nCorcel Fiel\nHumano: Ingenioso, Hábil, Versátil\nDote: Atacante Salvaje (trasfondo)\nDote: Duro (humano)',
    trucos:'',
    preparados:'Siempre: Golpe Divino, Encontrar Corcel, Perdición, Marca del Cazador, Paso Brumoso, Inmovilizar Persona\nBendición, Curar Heridas, Escudo de la Fe, Detectar el Bien y el Mal, Ayuda, Arma Mágica',
    espacios:'',
    notas:'Juró acabar con los no muertos tras la pérdida de su familia. Llegó a Waterdeep siguiendo la pista de un culto de vampiros.',
    retrato:'', retX:50, retY:30
  }
};
