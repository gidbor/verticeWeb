function ExecuteScript(strId)
{
  switch (strId)
  {
      case "6EnNEW6rZVH":
        Script1();
        break;
      case "6U6C05vJR1r":
        Script2();
        break;
      case "6SHziEEt7DL":
        Script3();
        break;
      case "5stOmq612za":
        Script4();
        break;
  }
}

window.InitExecuteScripts = function()
{
var player = GetPlayer();
var object = player.object;
var addToTimeline = player.addToTimeline;
var setVar = player.SetVar;
var getVar = player.GetVar;
window.Script1 = function()
{
  const target = object('6K1Uf2k3YsT');
const duration = 750;
const easing = 'ease-out';
const id = '6Qmf3Swzyvi';
const pulseAmount = 0.07;
player.addForTriggers(
id,
target.animate([
{ scale: '1' }, { scale: `${1 + pulseAmount}` },
{ scale: '1' }, { scale: `${1 + pulseAmount}` },
{ scale: '1' }
],
  { fill: 'forwards', duration, easing }
)
);
}

window.Script2 = function()
{
  const target = object('6kFgcQfb3EI');
const duration = 750;
const easing = 'ease-out';
const id = '6ojPgWi00V6';
const pulseAmount = 0.07;
player.addForTriggers(
id,
target.animate([
{ scale: '1' }, { scale: `${1 + pulseAmount}` },
{ scale: '1' }, { scale: `${1 + pulseAmount}` },
{ scale: '1' }
],
  { fill: 'forwards', duration, easing }
)
);
}

window.Script3 = function()
{
  const target = object('5fawGwcSR6F');
const duration = 750;
const easing = 'ease-out';
const id = '6DNdxEj3rgE';
const pulseAmount = 0.07;
player.addForTriggers(
id,
target.animate([
{ scale: '1' }, { scale: `${1 + pulseAmount}` },
{ scale: '1' }, { scale: `${1 + pulseAmount}` },
{ scale: '1' }
],
  { fill: 'forwards', duration, easing }
)
);
}

window.Script4 = function()
{
  const target = object('5qHwYNiFduQ');
const duration = 750;
const easing = 'ease-out';
const id = '6MBrpgA24Mj';
const pulseAmount = 0.07;
player.addForTriggers(
id,
target.animate([
{ scale: '1' }, { scale: `${1 + pulseAmount}` },
{ scale: '1' }, { scale: `${1 + pulseAmount}` },
{ scale: '1' }
],
  { fill: 'forwards', duration, easing }
)
);
}

};
