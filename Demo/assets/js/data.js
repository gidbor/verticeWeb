window.LMSData={
  course:{
    title:'Fisiología reproductiva porcina',
    shortTitle:'Fisiología reproductiva porcina',
    category:'Producción porcina',
    level:'Intermedio',
    instructor:'Vértice Formación Profesional',
    duration:'2 h 30 min',
    image:'assets/images/course-cover.jpg',
    hero:'assets/images/course-hero.jpg',
    scormPath:'scorm/modulo-1/content/index.html',
    resources:[
      {name:'Síntesis hormonal',type:'JPG',url:'scorm/modulo-1/content/assets/sintesis.jpg'},
      {name:'Ciclo ovárico y hormonal',type:'JPG',url:'scorm/modulo-1/content/assets/Ciclo ovárico y hormonal.jpg'},
      {name:'Anatomía reproductiva',type:'JPG',url:'scorm/modulo-1/content/assets/imagenInicial.jpg'}
    ],
    modules:[
      {id:1,title:'Módulo 1. Fisiología reproductiva porcina',lessons:1}
    ]
  },
  questions:[
    {q:'¿Cuál es una función principal de la GnRH en la regulación reproductiva?',options:['Estimular la liberación de FSH y LH','Disminuir la temperatura corporal','Inhibir permanentemente la ovulación','Aumentar la absorción de calcio'],answer:0},
    {q:'¿Qué hormona está directamente relacionada con la ovulación?',options:['Insulina','LH','Melatonina','Cortisol'],answer:1},
    {q:'¿Qué signo puede indicar celo en una cerda?',options:['Reflejo de inmovilidad','Pérdida permanente de apetito','Disminución de la frecuencia respiratoria','Ausencia de interacción con el macho'],answer:0},
    {q:'¿Dónde se producen los ovocitos?',options:['Útero','Ovarios','Cérvix','Hipotálamo'],answer:1},
    {q:'¿Cuál es la función de la FSH?',options:['Estimular el desarrollo folicular','Detener la actividad ovárica','Producir oxitocina','Cerrar el cérvix'],answer:0},
    {q:'¿Qué estructura conecta el útero con la vagina?',options:['Ovario','Cérvix','Hipófisis','Folículo'],answer:1},
    {q:'La progesterona se asocia principalmente con:',options:['Mantenimiento de la gestación','Aumento de la visión nocturna','Producción de glóbulos rojos','Digestión de proteínas'],answer:0},
    {q:'¿Qué hormona participa en las contracciones uterinas durante el parto?',options:['Oxitocina','FSH','TSH','Insulina'],answer:0},
    {q:'¿Qué sistema coordina señales hormonales reproductivas entre cerebro y gónadas?',options:['Eje hipotálamo-hipófisis-gónada','Sistema portal hepático','Sistema linfático exclusivamente','Eje renal-pancreático'],answer:0},
    {q:'Para detectar el celo de forma práctica puede evaluarse:',options:['Reflejo de inmovilidad ante presión dorsal o presencia del macho','Color de las pezuñas exclusivamente','Longitud de las orejas','Peso del alimento consumido en una sola toma'],answer:0}
  ],
  badges:[
    {id:'primer-acceso',title:'Primer acceso',desc:'Ingresaste por primera vez al campus.',icon:'✓',color:'blue'},
    {id:'explorador-scorm',title:'Explorador SCORM',desc:'Alcanzaste el 25% del módulo interactivo.',icon:'↗',color:'green'},
    {id:'mitad-camino',title:'Mitad de camino',desc:'Superaste el 50% del contenido SCORM.',icon:'★',color:'gold'},
    {id:'modulo-completado',title:'Módulo completado',desc:'Finalizaste el contenido SCORM.',icon:'🏁',color:'blue'},
    {id:'evaluacion-superada',title:'Evaluación superada',desc:'Aprobaste la evaluación con al menos 80%.',icon:'✓',color:'red'},
    {id:'curso-completado',title:'Curso completado',desc:'Completaste contenido y evaluación.',icon:'🏆',color:'gold'}
  ]
};
