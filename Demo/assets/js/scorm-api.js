(function(){
  let initialized=false;
  function state(){return LMSStorage.load();}
  function normalizeKey(k){return String(k||'').trim();}
  function get(k){return state().course.scorm.values[normalizeKey(k)]||'';}
  function set(k,v){
    k=normalizeKey(k);
    LMSStorage.update(s=>{
      s.course.scorm.values[k]=String(v);
      s.course.scorm.lastAccess=new Date().toISOString();
    });
    applyTracking(k,v);
  }
  function applyTracking(key,value){
    const k=String(key).toLowerCase();
    const v=String(value).toLowerCase();
    if((k.includes('lesson_status')||k.includes('completion_status')||k.includes('success_status'))&&['completed','passed'].includes(v)){
      LMSStorage.markScormComplete();
      window.dispatchEvent(new CustomEvent('lms:progress'));
      return;
    }
    if(k.includes('progress_measure')){
      const n=Math.max(0,Math.min(1,parseFloat(value)||0));
      LMSStorage.setScormProgress(n*100,{trackingMode:'scorm-api'});
      window.dispatchEvent(new CustomEvent('lms:progress'));
      return;
    }
    if(k.includes('lesson_location')||k.includes('location')){
      LMSStorage.update(s=>{s.course.scorm.lastHref=String(value);});
    }
    if(k.includes('score.raw')){
      const n=parseFloat(value);
      if(Number.isFinite(n))LMSStorage.update(s=>{s.course.scorm.values['last_score']=String(n);});
    }
  }
  function ok(){return 'true';}
  const API={
    LMSInitialize(){initialized=true;return ok();},
    LMSFinish(){initialized=false;return ok();},
    LMSGetValue(k){return get(k);},
    LMSSetValue(k,v){set(k,v);return ok();},
    LMSCommit(){return ok();},
    LMSGetLastError(){return '0';},
    LMSGetErrorString(){return 'No error';},
    LMSGetDiagnostic(){return ''}
  };
  const API2004={
    Initialize(){initialized=true;return ok();},
    Terminate(){initialized=false;return ok();},
    GetValue(k){return get(k);},
    SetValue(k,v){set(k,v);return ok();},
    Commit(){return ok();},
    GetLastError(){return '0';},
    GetErrorString(){return 'No error';},
    GetDiagnostic(){return ''}
  };
  window.API=API;
  window.API_1484_11=API2004;
})();
