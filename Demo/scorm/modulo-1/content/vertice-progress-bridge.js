(function(){
  'use strict';
  const TYPE='vertice:scorm-progress';
  let lastPayload='';
  let lastProgress=0;

  function clean(text){return String(text||'').replace(/\u00a0/g,' ').replace(/[ \t]+/g,' ').trim();}
  function clamp(n){return Math.max(0,Math.min(100,Math.round(Number(n)||0)));}

  function bodyText(){
    try{return clean(document.body ? document.body.innerText : '');}catch(_){return '';}
  }

  function findProgress(text){
    const patterns=[
      /(?:^|\s)(\d{1,3})\s*%\s*(?:COMPLETA|COMPLETADO|COMPLETADA|COMPLETE)(?:\s|$)/i,
      /(?:progreso|avance)[^\d]{0,25}(\d{1,3})\s*%/i,
      /(\d{1,3})\s*%\s*(?:de avance|recorrido|completado)/i
    ];
    for(const re of patterns){
      const m=text.match(re);
      if(m){const n=clamp(m[1]); if(n>=lastProgress || lastProgress===0) return n;}
    }
    return null;
  }

  function findSection(text){
    let index=null,total=null,title='';
    let m=text.match(/Secci[oó]n\s+(\d+)\s+de\s+(\d+)/i);
    if(m){index=Number(m[1]); total=Number(m[2]);}
    if(index==null){
      m=text.match(/(?:^|\s)(\d+)\s+de\s+(\d+)\s*[—–-]\s*([^\n]{2,100})/i);
      if(m){index=Number(m[1]); total=Number(m[2]); title=clean(m[3]);}
    }

    // Prefer the current/selected navigation item if Rise exposes one.
    try{
      const candidates=[
        '[aria-current="true"]',
        '[aria-current="page"]',
        '[aria-selected="true"]',
        '.is-active', '.active', '.selected'
      ];
      for(const sel of candidates){
        const els=Array.from(document.querySelectorAll(sel));
        const el=els.find(x=>{const t=clean(x.innerText); return t && t.length<160 && !/^\d+%/.test(t);});
        if(el){
          const t=clean(el.innerText).replace(/^\d+[.)]?\s*/, '');
          if(t && !/^(contenido|men[uú]|inicio)$/i.test(t)) title=t;
          break;
        }
      }
    }catch(_){ }

    // Header text like "5 de 34 — 2. Ciclo reproductivo de la hembra".
    if(!title){
      const hm=text.match(/(?:^|\s)\d+\s+de\s+\d+\s*[—–-]\s*([^\n]{3,120})/i);
      if(hm) title=clean(hm[1]);
    }
    return {index,total,title};
  }

  function fallbackProgress(section){
    if(section.index && section.total){return clamp(((section.index-1)/Math.max(1,section.total))*100);}
    return null;
  }

  function emit(reason){
    const text=bodyText();
    if(!text)return;
    const section=findSection(text);
    let progress=findProgress(text);
    if(progress==null) progress=fallbackProgress(section);
    if(progress==null) return;
    progress=Math.max(lastProgress,progress);
    lastProgress=progress;
    const payload={
      type:TYPE,
      progress,
      sectionIndex:section.index,
      sectionTotal:section.total,
      sectionTitle:section.title,
      href:location.href,
      reason:reason||'poll',
      ts:Date.now()
    };
    const serialized=JSON.stringify(payload);
    if(serialized===lastPayload && reason!=='heartbeat')return;
    lastPayload=serialized;
    try{window.parent.postMessage(payload,'*');}catch(_){ }
    try{window.top!==window.parent && window.top.postMessage(payload,'*');}catch(_){ }
    try{sessionStorage.setItem('verticeScormBridgeLast',serialized);}catch(_){ }
  }

  function schedule(reason,delay){clearTimeout(schedule.t);schedule.t=setTimeout(()=>emit(reason),delay||120);}

  window.addEventListener('scroll',()=>schedule('scroll',120),true);
  document.addEventListener('click',()=>schedule('click',180),true);
  document.addEventListener('keydown',()=>schedule('keydown',180),true);
  document.addEventListener('visibilitychange',()=>schedule('visibility',50));
  window.addEventListener('hashchange',()=>schedule('hashchange',80));
  window.addEventListener('popstate',()=>schedule('popstate',80));

  try{
    const observer=new MutationObserver(()=>schedule('mutation',150));
    observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,characterData:true});
  }catch(_){ }

  setInterval(()=>emit('heartbeat'),1000);
  setTimeout(()=>emit('load'),500);
  setTimeout(()=>emit('load'),1500);
  setTimeout(()=>emit('load'),3000);
})();
