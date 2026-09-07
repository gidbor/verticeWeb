(function(){
  const KEY='verticeLmsStateV3';
  const LEGACY_KEY='verticeLmsStateLegacy';
  const defaultState={
    version:2,
    user:{
      loggedIn:false,
      email:'angelica@vertice.edu.co',
      name:'Angélica Ramírez',
      role:'Estudiante',
      phone:'+57 300 123 4567',
      city:'Bogotá, Colombia',
      timezone:'America/Bogota',
      remember:true,
      firstLoginAt:null,
      lastLoginAt:null
    },
    course:{
      id:'ia-fabricacion-vehiculo',
      title:'La inteligencia artificial en la fabricación de un vehículo',
      description:'Explora cómo la inteligencia artificial transforma la producción automotriz mediante automatización, control de calidad, mantenimiento predictivo, personalización, pronóstico de demanda y seguridad.',
      category:'Automotriz e inteligencia artificial',
      startDate:'2026-09-07',
      endDate:'2026-10-07',
      scorm:{
        progress:0,
        currentPosition:0,
        completed:false,
        maxScroll:0,
        secondsSpent:0,
        lastAccess:null,
        values:{},
        sessionStartedAt:null,
        currentLessonId:null,
        currentLessonTitle:'UT1 · Ventajas de la IA en la producción de automóviles',
        currentLessonIndex:0,
        totalLessons:55,
        visitedLessonIds:[],
        lastHref:null,
        trackingMode:'rise-reported',
        reportedProgress:0,
        packageSectionIndex:1,
        packageSectionTotal:55,
        packageSectionTitle:'UT1 · Ventajas de la IA en la producción de automóviles'
      },
      evaluation:{
        answers:{},
        currentQuestion:0,
        startedAt:null,
        completedAt:null,
        score:null,
        passed:false,
        attempts:0,
        timeLimitMinutes:20
      }
    },
    ui:{notices:3},
    events:[
      {id:'e1',title:'Continuar módulo SCORM',type:'course',offsetDays:0,time:'18:00'},
      {id:'e2',title:'Evaluación final',type:'deadline',offsetDays:7,time:'23:59'},
      {id:'e3',title:'Cierre del curso',type:'task',offsetDays:30,time:'23:59'}
    ]
  };

  function clone(v){return JSON.parse(JSON.stringify(v));}
  function deepMerge(target,source){
    if(!source||typeof source!=='object')return target;
    Object.keys(source).forEach(k=>{
      const v=source[k];
      if(v&&typeof v==='object'&&!Array.isArray(v)){
        target[k]=deepMerge(target[k]&&typeof target[k]==='object'?target[k]:{},v);
      }else target[k]=v;
    });
    return target;
  }
  function normalize(state){
    state.version=2;
    const sc=state.course.scorm;
    sc.progress=clamp(Number(sc.progress)||0);
    sc.currentPosition=clamp(Number(sc.currentPosition)||0);
    sc.currentLessonIndex=Math.max(0,Number(sc.currentLessonIndex)||0);
    sc.totalLessons=Math.max(1,Number(sc.totalLessons)||55);
    if(!Array.isArray(sc.visitedLessonIds))sc.visitedLessonIds=[];
    sc.reportedProgress=clamp(Number(sc.reportedProgress)||0);
    sc.packageSectionIndex=Math.max(1,Number(sc.packageSectionIndex)||1);
    sc.packageSectionTotal=Math.max(1,Number(sc.packageSectionTotal)||55);
    sc.packageSectionTitle=String(sc.packageSectionTitle||sc.currentLessonTitle||'Introducción');
    if(sc.completed)sc.progress=100;
    return state;
  }
  function clamp(v){return Math.max(0,Math.min(100,Math.round(v)));}
  function migrateLegacy(){
    try{
      const legacy=localStorage.getItem(LEGACY_KEY);
      if(!legacy)return null;
      return normalize(deepMerge(clone(defaultState),JSON.parse(legacy)));
    }catch(_){return null;}
  }
  function load(){
    try{
      let raw=localStorage.getItem(KEY);
      if(!raw){
        const migrated=migrateLegacy();
        const initial=migrated||clone(defaultState);
        localStorage.setItem(KEY,JSON.stringify(initial));
        return initial;
      }
      const merged=normalize(deepMerge(clone(defaultState),JSON.parse(raw)));
      localStorage.setItem(KEY,JSON.stringify(merged));
      return merged;
    }catch(_){
      const clean=clone(defaultState);
      localStorage.setItem(KEY,JSON.stringify(clean));
      return clean;
    }
  }
  function save(state){
    const normalized=normalize(state);
    localStorage.setItem(KEY,JSON.stringify(normalized));
    try{window.dispatchEvent(new CustomEvent('lms:state-changed',{detail:clone(normalized)}));}catch(_){}
    return normalized;
  }
  function update(mutator){const s=load();mutator(s);return save(s);}
  function reset(){const s=clone(defaultState);localStorage.setItem(KEY,JSON.stringify(s));return s;}
  function evaluationProgress(state){
    state=state||load();
    const total=(window.LMSData&&Array.isArray(window.LMSData.questions))?window.LMSData.questions.length:10;
    if(state.course.evaluation.completedAt)return 100;
    return clamp(Object.keys(state.course.evaluation.answers||{}).length/Math.max(1,total)*100);
  }
  function courseProgress(state){
    state=state||load();
    const sc=clamp(state.course.scorm.progress);
    const ev=evaluationProgress(state);
    return clamp(sc*.8+ev*.2);
  }
  function isCourseComplete(state){
    state=state||load();
    return !!state.course.scorm.completed&&!!state.course.evaluation.passed;
  }
  function setScormProgress(percent,meta){
    return update(s=>{
      const sc=s.course.scorm;
      const next=clamp(percent);
      sc.currentPosition=meta&&meta.currentPosition!=null?clamp(meta.currentPosition):next;
      sc.progress=Math.max(sc.progress,next);
      if(meta){
        if(meta.lessonId)sc.currentLessonId=meta.lessonId;
        if(meta.lessonTitle)sc.currentLessonTitle=meta.lessonTitle;
        if(meta.lessonIndex!=null)sc.currentLessonIndex=Math.max(0,Number(meta.lessonIndex)||0);
        if(meta.totalLessons)sc.totalLessons=Math.max(1,Number(meta.totalLessons)||1);
        if(meta.href)sc.lastHref=meta.href;
        if(meta.scrollRatio!=null)sc.maxScroll=Math.max(sc.maxScroll,Number(meta.scrollRatio)||0);
        if(meta.trackingMode)sc.trackingMode=meta.trackingMode;
        if(meta.reportedProgress!=null)sc.reportedProgress=Math.max(sc.reportedProgress,clamp(meta.reportedProgress));
        if(meta.packageSectionIndex!=null)sc.packageSectionIndex=Math.max(1,Number(meta.packageSectionIndex)||1);
        if(meta.packageSectionTotal!=null)sc.packageSectionTotal=Math.max(1,Number(meta.packageSectionTotal)||1);
        if(meta.packageSectionTitle)sc.packageSectionTitle=String(meta.packageSectionTitle);
        if(meta.lessonId&&!sc.visitedLessonIds.includes(meta.lessonId))sc.visitedLessonIds.push(meta.lessonId);
      }
      sc.lastAccess=new Date().toISOString();
      if(sc.completed)sc.progress=100;
    });
  }
  function markScormComplete(){
    return update(s=>{
      s.course.scorm.progress=100;
      s.course.scorm.currentPosition=100;
      s.course.scorm.completed=true;
      s.course.scorm.lastAccess=new Date().toISOString();
    });
  }
  function earnedBadges(state){
    state=state||load();
    const p=Number(state.course.scorm.progress)||0;
    const badges=[];
    if(state.user.firstLoginAt)badges.push('primer-acceso');
    if(p>=25)badges.push('explorador-scorm');
    if(p>=50)badges.push('mitad-camino');
    if(state.course.scorm.completed)badges.push('modulo-completado');
    if(state.course.evaluation.passed)badges.push('evaluacion-superada');
    if(isCourseComplete(state))badges.push('curso-completado');
    return badges;
  }
  window.LMSStorage={KEY,load,save,update,reset,courseProgress,evaluationProgress,isCourseComplete,setScormProgress,markScormComplete,earnedBadges};
})();
