(function(){
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const page=document.body.dataset.page||'';
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const clamp=n=>Math.max(0,Math.min(100,Math.round(Number(n)||0)));
  function svg(name){
    const paths={
      home:'<path d="M3 11.5 12 4l9 7.5V21h-6v-6H9v6H3z"/>',
      courses:'<path d="m3 8 9-5 9 5-9 5z"/><path d="M7 10.2V15c0 2 2.2 3.5 5 3.5s5-1.5 5-3.5v-4.8"/>',
      calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
      tasks:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3V1h6v2M8 9h8M8 13h8M8 17h5"/>',
      badges:'<circle cx="12" cy="9" r="6"/><path d="m8.5 14-2 7 5.5-3 5.5 3-2-7"/><path d="m12 6 1 2 2.2.3-1.6 1.6.4 2.2-2-1-2 1 .4-2.2-1.6-1.6 2.2-.3z"/>',
      certificates:'<path d="M6 3h9l3 3v8H6z"/><path d="M15 3v4h4M9 9h6M9 12h5"/><circle cx="14" cy="17" r="3"/><path d="m12.2 19.2-.7 2 2.5-1 2.5 1-.7-2"/>',
      search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
      bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
      chart:'<path d="M4 19 10 13l4 4 6-8"/><path d="M15 9h5v5"/>',
      book:'<path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v18H7.5A3.5 3.5 0 0 0 4 23zM20 5.5A3.5 3.5 0 0 0 16.5 2H13v18h3.5A3.5 3.5 0 0 1 20 23z"/>',
      user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
      clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/>',
      check:'<path d="m5 12 4 4L19 6"/>',
      lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
      target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="m15 9 6-6"/>',
      trophy:'<path d="M8 4h8v4c0 4-2 6-4 6s-4-2-4-6z"/><path d="M8 6H4v2c0 3 2 4 4 4M16 6h4v2c0 3-2 4-4 4M12 14v4M8 21h8"/>',
      menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
      fullscreen:'<path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/>'
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true" class="ui-svg" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name]||paths.book}</svg>`;
  }
  function initials(n){return String(n||'Usuario').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();}
  function fmtDate(iso){if(!iso)return '—';return new Intl.DateTimeFormat('es-CO',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(iso+'T12:00:00'));}
  function fmtDateLong(d){return new Intl.DateTimeFormat('es-CO',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(d);}
  function addDays(iso,n){const d=new Date(iso+'T12:00:00');d.setDate(d.getDate()+n);return d;}
  function formatSeconds(sec){sec=Math.max(0,Math.round(sec||0));const h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60);return h?`${h} h ${m} min`:`${m} min`;}
  function toast(msg,type='info'){
    let wrap=$('.toast-wrap');if(!wrap){wrap=document.createElement('div');wrap.className='toast-wrap';document.body.appendChild(wrap);}
    const t=document.createElement('div');t.className=`toast ${type}`;t.textContent=msg;wrap.appendChild(t);setTimeout(()=>t.remove(),3200);
  }
  window.toast=toast;
  function progressBar(p,cls=''){p=clamp(p);return `<div class="progress ${cls}" aria-label="Progreso ${p}%"><span style="width:${p}%"></span></div>`;}
  function navItems(){return [
    ['dashboard.html','Inicio','home','dashboard'],['mis-cursos.html','Mis cursos','courses','courses'],['calendario.html','Calendario','calendar','calendar'],['tareas.html','Tareas','tasks','tasks'],['insignias.html','Insignias','badges','badges'],['certificados.html','Certificados','certificates','certificates']
  ];}
  function renderHeader(){
    const target=$('#app-header');if(!target)return;
    const s=LMSStorage.load(),u=s.user;
    target.innerHTML=`<header class="app-header"><div class="header-inner">
      <a class="brand" href="dashboard.html"><img src="assets/logos/vertice-color.png" alt="Vértice Formación Profesional"></a>
      <nav class="main-nav" aria-label="Navegación principal">${navItems().map(([href,label,icon,key])=>`<a class="nav-link ${(page===key||(['courseDetail','scorm','evaluation'].includes(page)&&key==='courses'))?'active':''}" href="${href}">${svg(icon)}<span>${label}</span></a>`).join('')}</nav>
      <div class="header-actions"><div class="header-search">${svg('search')}<input id="global-search" placeholder="Buscar cursos, tareas, recursos..." aria-label="Buscar"></div><button class="icon-btn" aria-label="Notificaciones">${svg('bell')}<span class="notice-dot">${s.ui.notices}</span></button><div class="user-menu" id="user-menu"><div class="avatar">${initials(u.name)}</div><div class="user-meta"><div class="user-name">${esc(u.name)}</div><div class="user-role">${esc(u.role)}</div></div><span>⌄</span><div class="user-dropdown" id="user-dropdown"><a href="perfil.html">Mi perfil</a><a href="perfil.html#seguridad">Seguridad</a><button id="logout-btn">Cerrar sesión</button></div></div></div>
    </div></header>`;
    $('#user-menu')?.addEventListener('click',e=>{e.stopPropagation();$('#user-dropdown')?.classList.toggle('open');});
    document.addEventListener('click',()=>$('#user-dropdown')?.classList.remove('open'));
    $('#logout-btn')?.addEventListener('click',()=>{LMSStorage.update(st=>st.user.loggedIn=false);location.href='index.html';});
    $('#global-search')?.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.value.trim())location.href='mis-cursos.html?q='+encodeURIComponent(e.target.value.trim());});
  }
  function requireAuth(){if(page==='login')return true;const s=LMSStorage.load();if(!s.user.loggedIn){location.replace('index.html');return false;}return true;}
  function current(){const s=LMSStorage.load();return {s,p:LMSStorage.courseProgress(s),sp:clamp(s.course.scorm.progress),ep:LMSStorage.evaluationProgress(s),complete:LMSStorage.isCourseComplete(s)};}
  function syncBoundProgress(){
    const {s,p,sp}=current();
    $$('[data-course-progress]').forEach(el=>el.textContent=p+'%');
    $$('[data-scorm-progress]').forEach(el=>el.textContent=sp+'%');
    $$('[data-course-progress-bar]').forEach(el=>el.style.width=p+'%');
    $$('[data-scorm-progress-bar]').forEach(el=>el.style.width=sp+'%');
    $$('[data-current-lesson]').forEach(el=>el.textContent=s.course.scorm.currentLessonTitle||'Introducción');
  }
  window.addEventListener('storage',e=>{if(e.key===LMSStorage.KEY)syncBoundProgress();});
  window.addEventListener('lms:state-changed',syncBoundProgress);

  function initLogin(){
    const s=LMSStorage.load();if(s.user.loggedIn)$('#login-email').value=s.user.email||'';
    $('#toggle-password')?.addEventListener('click',()=>{const p=$('#login-password');p.type=p.type==='password'?'text':'password';});
    $('#login-form')?.addEventListener('submit',e=>{e.preventDefault();const email=$('#login-email'),pass=$('#login-password');const emailOk=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()),passOk=pass.value.length>=6;email.classList.toggle('invalid',!emailOk);$('#email-error').classList.toggle('show',!emailOk);pass.classList.toggle('invalid',!passOk);$('#password-error').classList.toggle('show',!passOk);if(!emailOk||!passOk)return;const now=new Date().toISOString();LMSStorage.update(st=>{st.user.loggedIn=true;st.user.email=email.value.trim();st.user.remember=$('#remember').checked;st.user.lastLoginAt=now;if(!st.user.firstLoginAt)st.user.firstLoginAt=now;});location.href='dashboard.html';});
  }

  function dashboard(){
    const host=$('#dashboard-content');if(!host)return;const {s,p,sp,complete}=current(),c=LMSData.course,next=addDays(s.course.startDate,7);
    host.innerHTML=`<section class="dashboard-intro"><div><h1>Hola, ${esc(s.user.name.split(' ')[0])} <span class="wave">👋</span></h1><p>Sigue aprendiendo, cada paso te acerca a tus metas.</p></div>
      <div class="summary-cards"><article class="summary-card navy"><div class="summary-icon">${svg('courses')}</div><div><span>Cursos activos</span><strong>1</strong></div><a href="mis-cursos.html">Ver mi curso →</a></article><article class="summary-card red"><div class="summary-icon">${svg('chart')}</div><div><span>Progreso general</span><strong data-course-progress>${p}%</strong>${progressBar(p,'light')}</div><a href="curso-detalle.html">Ver mi progreso →</a></article><article class="summary-card cyan"><div class="summary-icon">${svg('calendar')}</div><div><span>Próxima fecha</span><strong class="date-value">${fmtDate(next.toISOString().slice(0,10))}</strong><small>Evaluación final</small></div><a href="calendario.html">Ver calendario →</a></article></div></section>
      <section class="focus-panel"><div class="focus-panel-head"><div><h2>Mi curso</h2><p>Continúa desde el punto donde quedaste.</p></div><a class="link-arrow" href="mis-cursos.html">Ver detalle →</a></div><article class="focus-course"><img src="${c.image}" alt="${c.title}"><div class="focus-course-body"><div class="course-kicker">${complete?'Curso completado':'En progreso'}</div><h3>${c.title}</h3><p>${s.course.description}</p><div class="focus-meta"><span>${svg('book')} 1 módulo interactivo</span><span>${svg('clock')} ${formatSeconds(s.course.scorm.secondsSpent)}</span></div><div class="focus-progress"><div><span>Avance del curso</span><strong data-course-progress>${p}%</strong></div>${progressBar(p)}</div><div class="focus-current"><span>Sección actual</span><strong data-current-lesson>${esc(s.course.scorm.currentLessonTitle||'Introducción')}</strong><small>SCORM recorrido: <span data-scorm-progress>${sp}%</span></small></div><div class="focus-actions"><a class="btn btn-secondary" href="leccion-scorm.html">${sp?'Continuar':'Comenzar'} →</a><a class="btn btn-outline" href="curso-detalle.html">Ver programa</a></div></div></article></section>`;
  }

  function myCourses(){
    const host=$('#courses-content');if(!host)return;const {s,p,sp,complete}=current(),c=LMSData.course;
    host.innerHTML=`<div class="page-heading-row"><div><h1 class="page-title">Mis cursos</h1><p class="page-subtitle">Consulta y continúa tu aprendizaje.</p></div></div><div class="courses-toolbar"><div class="tabs"><button class="tab-btn active">Todos</button><button class="tab-btn">En progreso</button><button class="tab-btn">No iniciados</button><button class="tab-btn">Finalizados</button></div><select class="input compact-select"><option>Ordenar: estado del curso</option><option>Ordenar: progreso</option><option>Ordenar: fecha</option></select></div>
      <article class="card list-course fidelity"><img src="${c.image}" alt="${c.title}"><div class="list-course-main"><span class="badge ${complete?'badge-success':sp?'badge-info':'badge-muted'}">${complete?'Finalizado':sp?'En progreso':'No iniciado'}</span><h3>${c.title}</h3><p>${s.course.description}</p><div class="list-progress-label"><span>Avance</span><strong data-course-progress>${p}%</strong></div>${progressBar(p,complete?'success':'')}<small class="current-section">Sección actual: <strong data-current-lesson>${esc(s.course.scorm.currentLessonTitle||'Introducción')}</strong></small></div><div class="list-course-dates"><div><span>Inicio</span><strong>${fmtDate(s.course.startDate)}</strong></div><div><span>Fin</span><strong>${fmtDate(s.course.endDate)}</strong></div></div><div class="list-course-action"><a class="btn ${complete?'btn-success':'btn-secondary'}" href="${complete?'curso-detalle.html':'leccion-scorm.html'}">${complete?'Finalizado ✓':sp?'Continuar':'Comenzar'}</a></div></article>`;
    const tabs=$$('.tab-btn');tabs.forEach((b,i)=>b.addEventListener('click',()=>{tabs.forEach(x=>x.classList.remove('active'));b.classList.add('active');const visible=i===0||(i===1&&sp>0&&!complete)||(i===2&&sp===0)||(i===3&&complete);$('.list-course')?.classList.toggle('hidden',!visible);if(!visible)toast('No hay cursos en este estado','info');}));
  }

  function courseDetail(){
    const host=$('#course-detail-content');if(!host)return;const {s,p,sp}=current(),c=LMSData.course,ev=s.course.evaluation;
    host.innerHTML=`<div class="breadcrumbs"><a href="mis-cursos.html">Mis cursos</a><span>/</span><strong>${c.title}</strong></div><section class="course-hero refined"><img src="${c.hero}" alt="${c.title}"><div class="hero-overlay"></div><div class="course-hero-copy"><h1>${c.title}</h1><p>${s.course.description}</p><div class="course-meta-row"><span>${svg('courses')} 1 módulo SCORM</span><span>${svg('tasks')} 1 evaluación</span><span>${svg('clock')} ${c.duration}</span><span>${svg('certificates')} Certificado</span></div></div><div class="course-hero-progress"><div class="circular-progress" style="--deg:${p*3.6}deg"><strong data-course-progress>${p}%</strong></div><a class="btn btn-secondary btn-block" href="leccion-scorm.html">${sp?'Continuar curso':'Comenzar curso'} →</a></div></section>
      <div class="course-detail-grid"><main class="card module-list"><h2 class="section-title">Programa del curso</h2><div class="module-row ${s.course.scorm.completed?'done':'current'}"><div class="module-num">1</div><div><div class="module-name">Contenido interactivo · 8 unidades</div><div class="module-sub"><span data-current-lesson>${esc(s.course.scorm.currentLessonTitle||'Introducción')}</span> · <span data-scorm-progress>${sp}%</span> recorrido</div></div><span class="badge ${s.course.scorm.completed?'badge-success':'badge-accent'}">${s.course.scorm.completed?'Completado':'En progreso'}</span></div><div class="module-row ${ev.passed?'done':sp>=80?'current':''}"><div class="module-num">2</div><div><div class="module-name">Evaluación final</div><div class="module-sub">10 preguntas · aprobación mínima 80%</div></div><span class="badge ${ev.passed?'badge-success':sp>=80?'badge-info':'badge-muted'}">${ev.passed?'Aprobada':sp>=80?'Disponible':'Bloqueada'}</span></div><h3 class="subsection-title">Lección actual</h3><div class="current-lesson"><img src="assets/images/scorm-preview.jpg" alt="Contenido del módulo"><div><span class="eyebrow">Módulo 1</span><h3>${LMSData.course.title}</h3><p><span data-current-lesson>${esc(s.course.scorm.currentLessonTitle||'Introducción')}</span></p><small>Contenido web interactivo · avance <span data-scorm-progress>${sp}%</span></small></div><a class="btn btn-secondary" href="leccion-scorm.html">Entrar a la lección →</a></div></main><aside class="side-stack"><section class="card card-pad"><h3 class="section-title">Resumen del curso</h3><div class="info-list"><div class="info-row"><span>Instructor</span><strong>${c.instructor}</strong></div><div class="info-row"><span>Categoría</span><strong>${c.category}</strong></div><div class="info-row"><span>Nivel</span><strong>${c.level}</strong></div><div class="info-row"><span>Duración</span><strong>${c.duration}</strong></div></div></section><section class="card card-pad"><h3 class="section-title">Tu progreso</h3><div class="big-progress-number" data-course-progress>${p}%</div>${progressBar(p)}<div class="info-list spaced"><div class="info-row"><span>SCORM</span><strong data-scorm-progress>${sp}%</strong></div><div class="info-row"><span>Sección actual</span><strong data-current-lesson>${esc(s.course.scorm.currentLessonTitle||'Introducción')}</strong></div><div class="info-row"><span>Evaluación</span><strong>${ev.score===null?'Pendiente':ev.score+'%'}</strong></div></div></section><section class="card card-pad"><h3 class="section-title">Recursos</h3>${c.resources.map(r=>`<a class="resource-link" target="_blank" href="${encodeURI(r.url)}"><span>${r.name}</span><strong>${r.type}</strong></a>`).join('')}</section></aside></div>`;
  }

  function calendar(){
    const host=$('#calendar-content');if(!host)return;const s=LMSStorage.load();let currentDate=new Date();currentDate.setDate(1);
    function render(){const y=currentDate.getFullYear(),m=currentDate.getMonth(),first=new Date(y,m,1),last=new Date(y,m+1,0),start=(first.getDay()+6)%7,cells=[],prevLast=new Date(y,m,0).getDate();for(let i=0;i<start;i++)cells.push({d:prevLast-start+i+1,month:m-1,muted:true});for(let d=1;d<=last.getDate();d++)cells.push({d,month:m,muted:false});while(cells.length%7)cells.push({d:cells.length-start-last.getDate()+1,month:m+1,muted:true});const events=s.events.map(e=>({...e,date:addDays(s.course.startDate,e.offsetDays)}));host.innerHTML=`<div class="calendar-toolbar"><div><h1 class="page-title">Calendario</h1><p class="page-subtitle">Organiza tus actividades y fechas importantes.</p></div><div class="calendar-controls"><button class="btn btn-outline" id="today-btn">Hoy</button><button class="btn btn-outline" id="prev-month">‹</button><button class="btn btn-outline" id="next-month">›</button><strong class="month-pill">${new Intl.DateTimeFormat('es-CO',{month:'long',year:'numeric'}).format(currentDate)}</strong></div></div><div class="calendar-layout"><div><div class="calendar-grid">${['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map(x=>`<div class="calendar-head">${x}</div>`).join('')}${cells.map(c=>{const date=new Date(y,c.month,c.d),same=date.toDateString()===new Date().toDateString(),evs=events.filter(e=>e.date.toDateString()===date.toDateString());return `<div class="calendar-day ${c.muted?'muted':''} ${same?'today':''}"><div class="day-number">${c.d}</div>${evs.map(e=>`<div class="calendar-event ${e.type}">${e.title}<br><span>${e.time}</span></div>`).join('')}</div>`}).join('')}</div><div class="calendar-legend"><span><i class="dot task"></i>Tarea</span><span><i class="dot deadline"></i>Fecha límite</span><span><i class="dot course"></i>Evento del curso</span></div></div><aside class="card card-pad events-panel"><div class="panel-title-row"><h2 class="section-title">Próximos eventos</h2><a class="link-arrow" href="tareas.html">Ver todo</a></div><div class="event-list">${events.sort((a,b)=>a.date-b.date).map(e=>`<div class="event-item"><div class="event-icon">${svg(e.type==='deadline'?'tasks':'calendar')}</div><div><strong>${e.title}</strong><small>${fmtDateLong(e.date)}</small></div><span>${e.time}</span></div>`).join('')}</div><div class="calendar-connect"><div>${svg('calendar')}</div><div><strong>Sincroniza tu calendario</strong><small>Conecta tu calendario externo</small></div><button class="btn btn-outline" onclick="toast('Integración externa disponible en una fase posterior','info')">Conectar</button></div></aside></div>`;$('#prev-month').onclick=()=>{currentDate.setMonth(currentDate.getMonth()-1);render();};$('#next-month').onclick=()=>{currentDate.setMonth(currentDate.getMonth()+1);render();};$('#today-btn').onclick=()=>{currentDate=new Date();currentDate.setDate(1);render();};}render();
  }

  function badges(){
    const host=$('#badges-content');if(!host)return;const s=LMSStorage.load(),earned=LMSStorage.earnedBadges(s),all=LMSData.badges,p=LMSStorage.courseProgress(s);host.innerHTML=`<h1 class="page-title">Mis insignias</h1><p class="page-subtitle">Tus logros y reconocimientos en tu camino de aprendizaje.</p><div class="badge-layout"><main><div class="badge-summary"><div class="mini-stat primary"><strong>${earned.length}</strong><span>Insignias obtenidas</span><small>Total de logros alcanzados</small></div><div class="mini-stat"><strong>${s.course.scorm.completed?1:0}</strong><span>Módulos completados</span><small>Contenido finalizado</small></div><div class="mini-stat"><strong>${s.course.evaluation.passed?1:0}</strong><span>Evaluaciones aprobadas</span><small>Resultado ≥ 80%</small></div><div class="mini-stat"><strong>${all.length-earned.length}</strong><span>Insignias disponibles</span><small>Sigue aprendiendo</small></div></div><div class="tabs badge-tabs"><button class="tab-btn active">Obtenidas</button><button class="tab-btn">Disponibles</button></div><div class="badge-grid" id="earned-grid">${all.filter(b=>earned.includes(b.id)).map(renderBadge).join('')||'<div class="card empty-state">Aún no tienes insignias.</div>'}</div><div class="badge-grid hidden" id="available-grid">${all.filter(b=>!earned.includes(b.id)).map(b=>renderBadge(b,true)).join('')||'<div class="card empty-state">¡Ya obtuviste todas las insignias!</div>'}</div></main><aside class="side-stack"><section class="card level-card"><div class="level-banner"><div class="achievement-icon">V</div></div><div class="level-body"><span class="text-muted">Nivel actual</span><h2>${p>=80?'Aprendiz avanzado':p>=40?'Aprendiz en progreso':'Aprendiz inicial'}</h2><strong>${p*20} / 2000 XP</strong><div style="margin:10px 0">${progressBar(Math.min(100,p))}</div><small class="text-muted">El nivel se actualiza con el progreso real del curso.</small></div></section><section class="card card-pad"><h3 class="section-title">Progreso del curso</h3><div class="big-progress-number" data-course-progress>${p}%</div>${progressBar(p)}</section></aside></div>`;const tabs=$$('.badge-tabs .tab-btn');tabs.forEach((b,i)=>b.onclick=()=>{tabs.forEach(x=>x.classList.remove('active'));b.classList.add('active');$('#earned-grid').classList.toggle('hidden',i!==0);$('#available-grid').classList.toggle('hidden',i!==1);});
    function renderBadge(b,locked=false){return `<article class="card achievement ${b.color||''} ${locked?'locked':''}"><div class="achievement-icon">${b.icon}</div><h3>${b.title}</h3><p>${b.desc}</p><span class="badge ${locked?'badge-muted':'badge-success'}">${locked?'Disponible':'Obtenida ✓'}</span></article>`;}
  }

  function profile(){
    const host=$('#profile-content');if(!host)return;const s=LMSStorage.load(),p=LMSStorage.courseProgress(s),earned=LMSStorage.earnedBadges(s);host.innerHTML=`<div class="profile-layout"><aside class="card account-nav"><h3>Mi cuenta</h3><a class="active" href="#">${svg('user')} Mi perfil</a><a href="#seguridad">${svg('lock')} Seguridad</a><a href="#notificaciones">${svg('bell')} Notificaciones</a><a href="#preferencias">${svg('target')} Preferencias</a><a class="logout-link" id="profile-logout" href="#">Cerrar sesión</a></aside><main class="profile-main"><div><h1 class="page-title">Mi perfil</h1><p class="page-subtitle">Gestiona tu información personal y visualiza tu progreso.</p></div><div class="profile-top"><section class="card profile-card"><div class="profile-identity"><div class="profile-avatar">${initials(s.user.name)}</div><div><h2>${esc(s.user.name)}</h2><span class="badge badge-info">${esc(s.user.role)}</span><div class="profile-details"><span>✉ ${esc(s.user.email)}</span><span>☎ ${esc(s.user.phone)}</span><span>⌖ ${esc(s.user.city)}</span><span>▣ Miembro desde: ${s.user.firstLoginAt?new Intl.DateTimeFormat('es-CO',{day:'numeric',month:'long',year:'numeric'}).format(new Date(s.user.firstLoginAt)):'Hoy'}</span></div></div><button class="btn btn-outline" id="edit-profile-btn">Editar perfil</button></div></section><section class="card profile-stats"><div class="profile-stat"><strong>${s.course.scorm.completed?1:0}</strong><span>Cursos completados</span></div><div class="profile-stat"><strong data-course-progress>${p}%</strong><span>Progreso general</span></div><div class="profile-stat"><strong>${formatSeconds(s.course.scorm.secondsSpent)}</strong><span>Tiempo de aprendizaje</span></div><div class="profile-stat"><strong>${earned.length}</strong><span>Insignias obtenidas</span></div></section></div><div class="profile-bottom"><section class="card card-pad"><h3 class="section-title">Actividad reciente</h3><div class="simple-list"><div class="activity-row"><span>${svg('book')}</span><div><strong>Última sección SCORM</strong><small data-current-lesson>${esc(s.course.scorm.currentLessonTitle||'Introducción')}</small></div></div><div class="activity-row"><span>${svg('chart')}</span><div><strong>Avance SCORM</strong><small data-scorm-progress>${s.course.scorm.progress}%</small></div></div><div class="activity-row"><span>${svg('tasks')}</span><div><strong>Evaluación</strong><small>${s.course.evaluation.score===null?'Pendiente':s.course.evaluation.score+'%'}</small></div></div></div></section><section class="card card-pad"><h3 class="section-title">Preferencias</h3><div class="info-list"><div class="info-row"><span>Idioma</span><strong>Español</strong></div><div class="info-row"><span>Zona horaria</span><strong>${esc(s.user.timezone)}</strong></div><div class="info-row"><span>Formato de fecha</span><strong>dd/mm/aaaa</strong></div></div></section></div><section class="card card-pad hidden" id="profile-edit-card"><h3 class="section-title">Editar información</h3><form id="profile-form" class="profile-edit"><label>Nombre<input class="input" id="pf-name" value="${esc(s.user.name)}"></label><label>Correo<input class="input" id="pf-email" value="${esc(s.user.email)}"></label><label>Teléfono<input class="input" id="pf-phone" value="${esc(s.user.phone)}"></label><label>Ciudad<input class="input" id="pf-city" value="${esc(s.user.city)}"></label><label class="full">Zona horaria<select class="input" id="pf-tz"><option value="America/Bogota">Bogotá / Lima / Quito</option><option value="Europe/Madrid">Madrid</option></select></label><div class="full form-actions"><button class="btn btn-primary" type="submit">Guardar cambios</button><button class="btn btn-outline" type="button" id="cancel-profile">Cancelar</button><button class="btn btn-ghost" type="button" id="reset-demo">Restablecer demo</button></div></form></section></main></div>`;$('#edit-profile-btn').onclick=()=>$('#profile-edit-card').classList.remove('hidden');$('#cancel-profile').onclick=()=>$('#profile-edit-card').classList.add('hidden');$('#profile-form').onsubmit=e=>{e.preventDefault();const email=$('#pf-email').value.trim();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){toast('Ingresa un correo válido','error');return;}LMSStorage.update(st=>{st.user.name=$('#pf-name').value.trim();st.user.email=email;st.user.phone=$('#pf-phone').value.trim();st.user.city=$('#pf-city').value.trim();st.user.timezone=$('#pf-tz').value;});toast('Perfil actualizado','success');setTimeout(()=>location.reload(),400);};$('#profile-logout').onclick=e=>{e.preventDefault();LMSStorage.update(st=>st.user.loggedIn=false);location.href='index.html';};$('#reset-demo').onclick=()=>{if(confirm('¿Restablecer todos los avances de esta demo?')){const ns=LMSStorage.reset();ns.user.loggedIn=true;LMSStorage.save(ns);location.reload();}};
  }

  function simpleTasks(){const host=$('#tasks-content');if(!host)return;const s=LMSStorage.load(),can=s.course.scorm.progress>=80||s.course.scorm.completed;host.innerHTML=`<h1 class="page-title">Tareas</h1><p class="page-subtitle">Actividades asociadas a tu curso.</p><div class="simple-list"><article class="card simple-item"><div><span class="badge ${s.course.evaluation.passed?'badge-success':can?'badge-accent':'badge-muted'}">${s.course.evaluation.passed?'Completada':can?'Disponible':'Bloqueada'}</span><h3>Evaluación final · ${LMSData.course.title}</h3><p>10 preguntas · 20 minutos · puntaje mínimo 80%</p></div><a class="btn ${can?'btn-secondary':'btn-outline'}" href="${can?'evaluacion.html':'leccion-scorm.html'}">${s.course.evaluation.passed?'Ver resultado':can?'Presentar':'Completar SCORM'}</a></article></div>`;}
  function certificates(){const host=$('#certificates-content');if(!host)return;const s=LMSStorage.load(),complete=LMSStorage.isCourseComplete(s);host.innerHTML=`<h1 class="page-title">Certificados</h1><p class="page-subtitle">Tus constancias de finalización.</p>${complete?`<article class="card simple-item"><div><span class="badge badge-success">Disponible</span><h3>Certificado · ${LMSData.course.title}</h3><p>Curso completado satisfactoriamente.</p></div><button class="btn btn-secondary" id="print-cert">Imprimir certificado</button></article>`:`<div class="card empty-state"><div class="icon">${svg('certificates')}</div><h2>Aún no tienes certificados</h2><p>Completa el módulo SCORM y aprueba la evaluación final para desbloquear el certificado.</p><a class="btn btn-secondary" href="curso-detalle.html">Ver mi curso</a></div>`}`;$('#print-cert')?.addEventListener('click',()=>{const w=window.open('','_blank');w.document.write(`<html><head><title>Certificado</title><style>body{font-family:Arial;text-align:center;padding:80px;color:#233e66}h1{font-size:44px}div{border:10px solid #233e66;padding:60px}strong{color:#e72862}</style></head><body><div><h1>Certificado de finalización</h1><p>Se certifica que</p><h2>${esc(s.user.name)}</h2><p>completó satisfactoriamente el curso</p><h2>${LMSData.course.title}</h2><p>Resultado evaluación: <strong>${s.course.evaluation.score}%</strong></p><p>Vértice Formación Profesional</p></div><script>window.print()<\/script></body></html>`);w.document.close();});}

  function initScorm(){
    const frame=$('#scorm-frame');
    if(!frame)return;

    let timer=null,lastTick=Date.now(),observer=null,poll=null,detectTimer=null;
    const structure=(window.SCORM_STRUCTURE&&Array.isArray(window.SCORM_STRUCTURE.lessons))?window.SCORM_STRUCTURE.lessons:[];
    const fallbackTotal=Math.max(1,structure.length||55);
    const byId=new Map(structure.map(x=>[String(x.id),x]));

    function currentTotal(sc){return Math.max(1,Number(sc.packageSectionTotal)||Number(sc.totalLessons)||fallbackTotal);}

    function renderProgress(){
      const s=LMSStorage.load(),sc=s.course.scorm,p=LMSStorage.courseProgress(s),total=currentTotal(sc);
      $$('[data-scorm-progress]').forEach(el=>el.textContent=sc.progress+'%');
      $$('[data-overall-progress]').forEach(el=>el.textContent=p+'%');
      $$('[data-progress-bar]').forEach(el=>el.style.width=sc.progress+'%');
      $$('[data-overall-bar]').forEach(el=>el.style.width=p+'%');
      $$('[data-current-lesson]').forEach(el=>el.textContent=sc.packageSectionTitle||sc.currentLessonTitle||'Introducción');
      if($('#current-position')) $('#current-position').textContent=`Sección ${Math.min(total,Number(sc.packageSectionIndex)||1)} de ${total}`;
      $('#complete-banner')?.classList.toggle('show',sc.completed);
      if($('#mark-complete')) $('#mark-complete').textContent=sc.completed?'✓ Lección completada':'✓ Marcar como completada';
      const evalBtn=$('#go-evaluation');
      if(evalBtn){const open=sc.progress>=80||sc.completed;evalBtn.classList.toggle('disabled-link',!open);evalBtn.setAttribute('aria-disabled',String(!open));}
      const status=$('#package-status');
      if(status && sc.trackingMode==='rise-reported'){
        status.textContent=`Avance sincronizado con el contenido · ${sc.progress}% · sección ${sc.packageSectionIndex||1} de ${total}`;
        status.style.color='var(--success)';
      }
    }

    function storeReportedProgress(payload){
      if(!payload||payload.type!=='vertice:scorm-progress')return;
      const progress=Math.max(0,Math.min(100,Number(payload.progress)||0));
      const st=LMSStorage.load();
      const old=st.course.scorm;
      const sectionIndex=Math.max(1,Number(payload.sectionIndex)||Number(old.packageSectionIndex)||1);
      const sectionTotal=Math.max(1,Number(payload.sectionTotal)||Number(old.packageSectionTotal)||55);
      const sectionTitle=String(payload.sectionTitle||old.packageSectionTitle||old.currentLessonTitle||'Introducción').trim();
      LMSStorage.setScormProgress(progress,{
        currentPosition:progress,
        reportedProgress:progress,
        packageSectionIndex:sectionIndex,
        packageSectionTotal:sectionTotal,
        packageSectionTitle:sectionTitle,
        lessonTitle:sectionTitle,
        lessonIndex:Math.max(0,sectionIndex-1),
        totalLessons:sectionTotal,
        href:payload.href||'',
        trackingMode:'rise-reported'
      });
      renderProgress();
    }

    // Primary source: the progress actually rendered by Rise inside the iframe.
    window.addEventListener('message',event=>{
      if(event.source!==frame.contentWindow)return;
      if(event.data&&event.data.type==='vertice:scorm-progress') storeReportedProgress(event.data);
    });

    function parseRiseText(text,href){
      text=String(text||'').replace(/\u00a0/g,' ');
      let progress=null,sectionIndex=null,sectionTotal=null,sectionTitle='';
      const progressPatterns=[
        /(?:^|\s)(\d{1,3})\s*%\s*(?:COMPLETA|COMPLETADO|COMPLETADA|COMPLETE)(?:\s|$)/i,
        /(?:progreso|avance)[^\d]{0,25}(\d{1,3})\s*%/i,
        /(\d{1,3})\s*%\s*(?:de avance|recorrido|completado)/i
      ];
      for(const re of progressPatterns){const m=text.match(re);if(m){progress=Math.max(0,Math.min(100,Number(m[1])||0));break;}}
      let m=text.match(/Secci[oó]n\s+(\d+)\s+de\s+(\d+)/i);
      if(m){sectionIndex=Number(m[1]);sectionTotal=Number(m[2]);}
      const hm=text.match(/(?:^|\s)(\d+)\s+de\s+(\d+)\s*[—–-]\s*([^\n]{3,120})/i);
      if(hm){if(sectionIndex==null)sectionIndex=Number(hm[1]);if(sectionTotal==null)sectionTotal=Number(hm[2]);sectionTitle=String(hm[3]||'').trim();}
      if(progress==null&&sectionIndex&&sectionTotal)progress=Math.round(((sectionIndex-1)/Math.max(1,sectionTotal))*100);
      return progress==null?null:{type:'vertice:scorm-progress',progress,sectionIndex,sectionTotal,sectionTitle,href,reason:'parent-dom'};
    }

    function detectFromFrame(){
      try{
        const win=frame.contentWindow,doc=frame.contentDocument||win.document;
        if(!doc||!doc.documentElement)return;
        const href=win.location.href;

        // Secondary source: read the visible Rise text directly from the same-origin iframe.
        const parsed=parseRiseText(doc.body?.innerText||'',href);
        if(parsed && parsed.progress!=null){storeReportedProgress(parsed);return;}

        // Final fallback for packages that do not render a textual percentage.
        let lesson=null,ratio=0,position=0;
        const lessonEls=Array.from(doc.querySelectorAll('[data-lesson-id]')).filter(el=>byId.has(String(el.getAttribute('data-lesson-id'))));
        if(lessonEls.length){
          const viewport=win.innerHeight||700,center=viewport*.42;
          let chosen=null,best=Infinity;
          lessonEls.forEach(el=>{const r=el.getBoundingClientRect();if(r.bottom<0||r.top>viewport)return;const dist=Math.abs((r.top+r.bottom)/2-center);if(dist<best){best=dist;chosen={el,r};}});
          if(!chosen){const top=lessonEls.map(el=>({el,r:el.getBoundingClientRect()})).sort((a,b)=>Math.abs(a.r.top)-Math.abs(b.r.top))[0];chosen=top;}
          const id=String(chosen.el.getAttribute('data-lesson-id')),meta=byId.get(id);
          if(meta){lesson=meta;const r=chosen.r;const span=Math.max(1,r.height-viewport*.25);ratio=Math.max(0,Math.min(1,(viewport*.42-r.top)/span));position=((meta.index+ratio)/fallbackTotal)*100;}
        }
        if(!lesson){
          const h=Math.max(doc.documentElement.scrollHeight,doc.body?.scrollHeight||0),viewport=win.innerHeight||700,max=Math.max(1,h-viewport);
          ratio=Math.max(0,Math.min(1,(win.scrollY||doc.documentElement.scrollTop||0)/max));
          lesson=structure[0]||{id:'intro',title:'Introducción',index:0};position=ratio*100;
        }
        const current=LMSStorage.load().course.scorm;
        // Do not let the generic fallback overwrite a package-reported progress mode.
        if(current.trackingMode!=='rise-reported' || current.progress===0){
          const percent=Math.min(current.completed?100:99,Math.max(0,position));
          LMSStorage.setScormProgress(percent,{currentPosition:percent,lessonId:lesson.id,lessonTitle:lesson.title,lessonIndex:lesson.index,totalLessons:fallbackTotal,scrollRatio:ratio,href,trackingMode:'rise-dom-fallback'});
          renderProgress();
        }
      }catch(err){
        const status=$('#package-status');if(status)status.textContent='Contenido cargado; seguimiento limitado por el navegador.';
      }
    }

    function scheduleDetect(delay=90){clearTimeout(detectTimer);detectTimer=setTimeout(detectFromFrame,delay);}
    function attachTracking(){
      try{
        const win=frame.contentWindow,doc=frame.contentDocument||win.document;if(!doc)return;
        win.addEventListener('scroll',()=>scheduleDetect(80),{passive:true});
        doc.addEventListener('click',()=>scheduleDetect(180),true);
        observer=new MutationObserver(()=>scheduleDetect(120));
        observer.observe(doc.documentElement,{childList:true,subtree:true,attributes:true,characterData:true});
        const status=$('#package-status');if(status){status.textContent='Contenido cargado · sincronizando avance de Rise…';status.style.color='var(--success)';}
      }catch(_){ }
    }
    function tick(){const now=Date.now(),secs=Math.min(10,Math.round((now-lastTick)/1000));lastTick=now;if(document.visibilityState==='visible')LMSStorage.update(s=>{s.course.scorm.secondsSpent+=secs;s.course.scorm.lastAccess=new Date().toISOString();});}

    frame.addEventListener('load',()=>{
      LMSStorage.update(s=>{s.course.scorm.lastAccess=new Date().toISOString();s.course.scorm.sessionStartedAt=new Date().toISOString();});
      attachTracking();
      setTimeout(detectFromFrame,500);setTimeout(detectFromFrame,1300);setTimeout(detectFromFrame,2500);renderProgress();
    });

    $('#scorm-next')?.addEventListener('click',()=>{try{const win=frame.contentWindow;win.scrollBy({top:Math.round(win.innerHeight*.75),behavior:'smooth'});setTimeout(detectFromFrame,600);}catch(_){} });
    $('#scorm-prev')?.addEventListener('click',()=>{try{const win=frame.contentWindow;win.scrollBy({top:-Math.round(win.innerHeight*.75),behavior:'smooth'});setTimeout(detectFromFrame,500);}catch(_){} });
    $('#mark-complete')?.addEventListener('click',()=>{const s=LMSStorage.load();if(s.course.scorm.completed){toast('La lección ya está completada','info');return;}if(s.course.scorm.progress<80){toast(`Recorre al menos el 80% del contenido antes de marcarlo como completado. Avance actual: ${s.course.scorm.progress}%`,'error');return;}if(!confirm('¿Confirmas que terminaste de revisar el contenido del módulo?'))return;LMSStorage.markScormComplete();renderProgress();toast('Lección marcada como completada','success');});
    $('#scorm-fullscreen')?.addEventListener('click',()=>{$('.scorm-frame-wrap')?.requestFullscreen?.();});
    $('#go-evaluation')?.addEventListener('click',e=>{const s=LMSStorage.load();if(s.course.scorm.progress<80&&!s.course.scorm.completed){e.preventDefault();toast(`Debes alcanzar 80% del SCORM. Avance actual: ${s.course.scorm.progress}%`,'error');}});

    timer=setInterval(tick,5000);
    poll=setInterval(detectFromFrame,1000);
    window.addEventListener('beforeunload',()=>{clearInterval(timer);clearInterval(poll);clearTimeout(detectTimer);observer?.disconnect();tick();detectFromFrame();});
    window.addEventListener('lms:progress',renderProgress);
    window.addEventListener('storage',event=>{if(event.key===LMSStorage.KEY)renderProgress();});
    renderProgress();
  }

  function evaluation(){
    const host=$('#evaluation-content');if(!host)return;let s=LMSStorage.load(),unlocked=s.course.scorm.progress>=80||s.course.scorm.completed;if(!unlocked){host.innerHTML=`<div class="card empty-state"><div class="icon">${svg('lock')}</div><h1>Evaluación bloqueada</h1><p>Debes alcanzar al menos el 80% del contenido SCORM antes de presentar la evaluación.</p><p>Avance actual: <strong data-scorm-progress>${s.course.scorm.progress}%</strong></p><a class="btn btn-secondary" href="leccion-scorm.html">Volver al contenido SCORM</a></div>`;return;}if(s.course.evaluation.completedAt){renderResult();return;}if(!s.course.evaluation.startedAt)LMSStorage.update(st=>{st.course.evaluation.startedAt=new Date().toISOString();st.course.evaluation.attempts+=1;});let interval;
    function remaining(){const st=LMSStorage.load(),start=new Date(st.course.evaluation.startedAt).getTime(),limit=st.course.evaluation.timeLimitMinutes*60*1000;return Math.max(0,limit-(Date.now()-start));}
    function timeText(ms){const sec=Math.floor(ms/1000),m=Math.floor(sec/60),ss=sec%60;return `${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;}
    function renderQuestion(){const st=LMSStorage.load(),ev=st.course.evaluation,i=ev.currentQuestion,q=LMSData.questions[i],answered=Object.keys(ev.answers).length,prog=Math.round(answered/LMSData.questions.length*100),courseProg=LMSStorage.courseProgress(st);host.innerHTML=`<div class="breadcrumbs"><a href="curso-detalle.html">Mi curso</a><span>/</span><strong>Evaluación final</strong></div><h1 class="page-title">Evaluación final: ${LMSData.course.title}</h1><div class="eval-pills"><span class="badge badge-info">Evaluación</span><span class="badge badge-muted">Intento ${ev.attempts}</span></div><div class="eval-grid"><main class="card eval-main"><div class="eval-top"><span>Pregunta ${i+1} de ${LMSData.questions.length}</span><span>${prog}% respondido</span></div>${progressBar(prog)}<h2 class="question-title">${q.q}</h2><div class="answer-list">${q.options.map((o,idx)=>`<label class="answer ${Number(ev.answers[i])===idx?'selected':''}"><input type="radio" name="answer" value="${idx}" ${Number(ev.answers[i])===idx?'checked':''}><span>${idx+1}. ${o}</span></label>`).join('')}</div><div class="eval-notice" id="eval-notice">Selecciona una respuesta antes de continuar. Tus respuestas se guardan automáticamente.</div><div class="eval-actions"><button class="btn btn-outline" id="eval-prev" ${i===0?'disabled':''}>← Anterior</button><button class="btn btn-outline" id="eval-save">Guardar y salir</button><button class="btn btn-primary" id="eval-next">${i===LMSData.questions.length-1?'Finalizar evaluación':'Siguiente →'}</button></div></main><aside class="eval-sidebar"><section class="card"><h3 class="section-title">Detalles de la evaluación</h3><div class="eval-detail-grid"><div class="eval-detail"><span>Duración</span><strong>20 min</strong></div><div class="eval-detail"><span>Puntaje mínimo</span><strong>80%</strong></div><div class="eval-detail"><span>Preguntas</span><strong>10</strong></div><div class="eval-detail"><span>Tiempo restante</span><strong id="eval-time">${timeText(remaining())}</strong></div></div></section><section class="card"><h3 class="section-title">Navegación</h3><div class="qnav">${LMSData.questions.map((_,idx)=>`<button class="${idx===i?'current':ev.answers[idx]!==undefined?'answered':''}" data-q="${idx}">${idx+1}</button>`).join('')}</div></section><section class="card"><h3 class="section-title">Resumen del curso</h3><div class="big-progress-number">${courseProg}%</div>${progressBar(courseProg)}</section></aside></div>`;$$('.answer').forEach(l=>l.onclick=()=>{const v=Number($('input',l).value);LMSStorage.update(st=>st.course.evaluation.answers[i]=v);$$('.answer').forEach(x=>x.classList.remove('selected'));l.classList.add('selected');$('input',l).checked=true;$('#eval-notice').classList.add('saved');$('#eval-notice').textContent='Respuesta guardada automáticamente.';});$('#eval-prev').onclick=()=>{if(i>0){LMSStorage.update(st=>st.course.evaluation.currentQuestion=i-1);renderQuestion();}};$('#eval-save').onclick=()=>{toast('Evaluación guardada en localStorage','success');location.href='curso-detalle.html';};$('#eval-next').onclick=()=>{const now=LMSStorage.load().course.evaluation;if(now.answers[i]===undefined){toast('Selecciona una respuesta antes de continuar','error');return;}if(i<LMSData.questions.length-1){LMSStorage.update(st=>st.course.evaluation.currentQuestion=i+1);renderQuestion();}else finish();};$$('[data-q]').forEach(b=>b.onclick=()=>{LMSStorage.update(st=>st.course.evaluation.currentQuestion=Number(b.dataset.q));renderQuestion();});}
    function finish(force=false){const st=LMSStorage.load(),ans=st.course.evaluation.answers;if(!force&&Object.keys(ans).length<LMSData.questions.length){toast('Responde todas las preguntas antes de finalizar','error');return;}let correct=0;LMSData.questions.forEach((q,i)=>{if(Number(ans[i])===q.answer)correct++;});const score=Math.round(correct/LMSData.questions.length*100);LMSStorage.update(x=>{x.course.evaluation.score=score;x.course.evaluation.passed=score>=80;x.course.evaluation.completedAt=new Date().toISOString();x.course.evaluation.currentQuestion=0;});clearInterval(interval);renderResult();}
    function renderResult(){const st=LMSStorage.load(),ev=st.course.evaluation;host.innerHTML=`<div class="card eval-result"><div class="badge ${ev.passed?'badge-success':'badge-accent'}">${ev.passed?'Evaluación aprobada':'Evaluación no aprobada'}</div><div class="result-score">${ev.score}%</div><h1>${ev.passed?'¡Excelente trabajo!':'Puedes intentarlo nuevamente'}</h1><p>Tu resultado y progreso quedaron guardados en este navegador.</p><div class="result-actions"><a class="btn btn-primary" href="curso-detalle.html">Volver al curso</a>${ev.passed?'<a class="btn btn-secondary" href="certificados.html">Ver certificados</a>':'<button class="btn btn-secondary" id="retry-eval">Reintentar</button>'}</div></div>`;$('#retry-eval')?.addEventListener('click',()=>{LMSStorage.update(x=>{x.course.evaluation.answers={};x.course.evaluation.currentQuestion=0;x.course.evaluation.startedAt=new Date().toISOString();x.course.evaluation.completedAt=null;x.course.evaluation.score=null;x.course.evaluation.passed=false;x.course.evaluation.attempts+=1;});location.reload();});}
    renderQuestion();interval=setInterval(()=>{const ms=remaining(),el=$('#eval-time');if(el)el.textContent=timeText(ms);if(ms<=0){clearInterval(interval);finish(true);toast('El tiempo de la evaluación terminó','error');}},1000);
  }

  if(!requireAuth())return;
  if(page!=='login')renderHeader();
  const map={login:initLogin,dashboard,courses:myCourses,calendar,badges,profile,tasks:simpleTasks,certificates,courseDetail,evaluation};
  map[page]?.();
  if(page==='scorm')initScorm();
  syncBoundProgress();
})();
