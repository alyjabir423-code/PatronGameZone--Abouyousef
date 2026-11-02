/* GameZone Abou Youssef — durée libre compatible pilotage_v1. */
(function(root){'use strict';
 function quote(tariffs,minutes){
  const n=Number(minutes);
  if(!Number.isSafeInteger(n)||n<1||n>1440)throw Error('Choisis une durée entière entre 1 et 1 440 minutes');
  const base=(tariffs||[]).filter(t=>Number.isFinite(Number(t.min))&&Number(t.min)>0&&Number.isFinite(Number(t.prix))&&Number(t.prix)>0).slice().sort((a,b)=>Number(a.min)-Number(b.min))[0];
  if(!base)throw Error('Aucun tarif payant configuré pour ce poste');
  const exact=n*Number(base.prix)/Number(base.min),price=Math.max(10,Math.round(exact/10)*10);
  if(!Number.isSafeInteger(price))throw Error('Prix invalide');
  return {min:n,prix:price,lbl:n+' min personnalisées',custom:true,baseMin:Number(base.min),basePrix:Number(base.prix)};
 }
 function status(p){return p&&p.actif?(p.paused?'EN PAUSE':'EN FONCTION'):'LIBRE';}
 function observePower(memory,device,session,now){
  // SYNC8: a cloud status is never allowed to pause a customer session.
  // Only explicit Pause / Power-cut buttons may change paused=true.
  for(const key of Object.keys(memory))delete memory[key];
  return null;
}


function minutes(value){const n=Number(value);return Number.isSafeInteger(n)&&n>=1&&n<=1440?n:null;}
root.GameZoneCustom={quote,status,observePower,minutes};
})(typeof globalThis!=='undefined'?globalThis:this);
