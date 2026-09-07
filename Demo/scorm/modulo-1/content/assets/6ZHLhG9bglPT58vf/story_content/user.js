window.InitUserScripts = function()
{
var player = GetPlayer();
var object = player.object;
var addToTimeline = player.addToTimeline;
var setVar = player.SetVar;
var getVar = player.GetVar;
window.Script1 = function()
{
  
(function loadGSAP(cb){
  if (window.gsap) return cb();
  var s=document.createElement('script'); s.src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"; s.onload=cb; document.head.appendChild(s);
})(function init(){
  var ovalo1 = document.querySelector("[data-acc-text='ovalo1']"); // cambia a tu selector
  if(!ovalo1) return;

  gsap.set(ovalo1, { transformOrigin: "50% 50%" });

  gsap.to(ovalo1, {
    duration: 0.9,
    scale: 1.12,        // “latido”
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1
  });
  
});


}

window.Script2 = function()
{
  
(function loadGSAP(cb){
  if (window.gsap) return cb();
  var s=document.createElement('script'); s.src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"; s.onload=cb; document.head.appendChild(s);
})(function init(){
  const ovalo2 = document.querySelector("[data-acc-text='ovalo2']"); // cambia a tu selector
  if(!ovalo2) return;

  gsap.set(ovalo2, { transformOrigin: "50% 50%" });

  gsap.to(ovalo2, {
    duration: 0.9,
    scale: 1.12,        // “latido”
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1
  });
});
}

window.Script3 = function()
{
  
(function loadGSAP(cb){
  if (window.gsap) return cb();
  var s=document.createElement('script'); s.src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"; s.onload=cb; document.head.appendChild(s);
})(function init(){
  const ovalo2 = document.querySelector("[data-acc-text='ovalo3']"); // cambia a tu selector
  if(!ovalo2) return;

  gsap.set(ovalo2, { transformOrigin: "50% 50%" });

  gsap.to(ovalo2, {
    duration: 0.9,
    scale: 1.12,        // “latido”
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1
  });
});
}

};
