/* YOUSSEF: spoken requests, confirmed receipts, local notifications, incident history. */
(function(w){'use strict';
const sounds=['start','pause','resume','add','subtract','save','restore','off','confirmed','error','five','finish','test'];
const players=new Map();let playing=null,lastSound='',lastAt=0;
const enabled=()=>localStorage.getItem('youssef-audio-enabled')!=='0';
const phrases={start:'Activation demandée.',pause:'Pause demandée.',resume:'Reprise demandée.',add:'Ajout du temps demandé.',subtract:'Diminution du temps demandée.',save:'Sauvegarde du temps demandée.',restore:'Restauration du temps demandée.',off:'Extinction demandée.',confirmed:'Commande confirmée par la prise.',error:'Commande non confirmée. Vérifiez le poste.',five:'Il reste moins de cinq minutes.',finish:'Le temps est terminé.',test:'Bienvenue à GameZone Abou Youssef.'};
function play(name){if(!enabled()||!sounds.includes(name))return false;const now=Date.now();if(name===lastSound&&now-lastAt<1200)return true;const voice=w.GZMaleSpeech?.selectedVoice();if(!voice||!w.speechSynthesis)return false;lastSound=name;lastAt=now;try{const u=new SpeechSynthesisUtterance(phrases[name]);u.voice=voice;u.lang=voice.lang||'fr-FR';u.volume=1;u.rate=.95;w.speechSynthesis.cancel();w.speechSynthesis.speak(u);return true;}catch(_){return false;}}

function classify(text){const t=String(text||'').toLowerCase();if(/refus|erreur|impossible/.test(t))return 'error';if(/cinq|5 minutes/.test(t))return 'five';if(/terminé|terminée|fin du temps/.test(t))return 'finish';if(/pause/.test(t))return 'pause';if(/repris|reprise|reprendre/.test(t))return 'resume';if(/diminu|retir|rédu/.test(t))return 'subtract';if(/sauvegard/.test(t))return 'save';if(/restaur/.test(t))return 'restore';if(/ajout|supplément|prolong|\+tps|\+ tps/.test(t))return 'add';if(/annul|étein|extinc/.test(t))return 'off';if(/activ|démarr/.test(t))return 'start';return 'confirmed';}
function speak(text){const v=w.GZMaleSpeech?.selectedVoice();if(v&&w.speechSynthesis&&typeof SpeechSynthesisUtterance!=='undefined'&&enabled()){const u=new SpeechSynthesisUtterance(String(text));u.voice=v;u.lang=v.lang||'fr-FR';u.volume=1;u.rate=.95;try{w.speechSynthesis.cancel();w.speechSynthesis.speak(u);return true;}catch(_){}}return play(classify(text));}
w.GZActionAudio={play,classify};
function panel(){localStorage.setItem('youssef-audio-enabled','1');w.GZMaleSpeech?.openPanel();}

function notificationStatus(){const b=document.getElementById('gz-notify-btn');if(b&&'Notification'in w&&Notification.permission==='granted'){b.textContent='🔔✓';b.title='Notifications locales autorisées — garder GameZone ouvert';}}
w.GZFeedback={notificationStatus};
function setup(){
 if(typeof w.ownerSpeak==='function')w.ownerSpeak=speak;if(typeof w.gzSpeak==='function')w.gzSpeak=speak;if(typeof w.ownerSpeakNow==='function')w.ownerSpeakNow=speak;if(typeof w.gzSpeakNow==='function')w.gzSpeakNow=speak;
 // Replace the voice picker rather than depend on an empty OS voice list.
 const old=document.getElementById('gz-male-voice-button');if(old){const button=old.cloneNode(true);old.replaceWith(button);button.onclick=panel;button.title='Choisir et activer la voix masculine';}
 notificationStatus();
 const style=document.createElement('style');style.textContent='button,[role=button]{touch-action:manipulation}button:active{filter:brightness(1.2);transform:scale(.98)}';document.head.append(style);
}
document.addEventListener('click',e=>{const b=e.target.closest?.('button');if(!b||b.disabled||b.closest('#youssef-audio-panel')||b.id==='gz-male-voice-button'||b.id==='gz-notify-btn')return;const t=(b.textContent||'').trim().toLowerCase();if(/pause|reprendre|restaurer|sauvegarder|activer|démarrer|retirer|annuler|off tv|ajouter|\+tps|\+ tps/.test(t))play(classify(t));},true);
async function notify(title,body,tag){if(!('Notification'in w)||Notification.permission!=='granted')return;try{const reg=await navigator.serviceWorker.getRegistration();if(reg)await reg.showNotification(title,{body,tag});}catch(_){}}
const alertMemory=new Set();function once(key){if(alertMemory.has(key))return false;try{if(sessionStorage.getItem(key))return false;sessionStorage.setItem(key,'1');}catch(_){}alertMemory.add(key);return true;}
function checkAlerts(){if(typeof DB==='undefined'||!DB._cache)return;const root=DB._cache;
 for(const [key,a]of Object.entries(root.active_by_poste||{})){if(!a?.actif||a.paused||!a.sessionId)continue;const seconds=Math.max(0,Math.ceil((Number(a.finTs)-Date.now())/1000));if(!Number.isFinite(seconds)||!a.finTs)continue;const name=decodeURIComponent(key),cycle=a.bonusGrantedAt||a.tempsTotal||0;
  if(seconds>0&&seconds<=300&&once('youssef-five-'+a.sessionId+'-'+cycle)){notify('GameZone — 5 minutes',name+' : il reste moins de cinq minutes.','youssef-five-'+a.sessionId);play('five');}
  if(seconds===0&&once('youssef-end-'+a.sessionId)){notify('GameZone — Temps terminé',name+' : temps terminé.','youssef-end-'+a.sessionId);play('finish');}
 }
}
function incidents(){if(typeof DB==='undefined'||!DB._cache)return;const items=Object.entries(DB._cache.operation_incidents||{}).sort((a,b)=>Number(b[1]?.at)-Number(a[1]?.at));let box=document.getElementById('youssef-incidents');if(!items.length){box?.remove();return;}if(!box){box=document.createElement('div');box.id='youssef-incidents';document.getElementById('gz-build-version')?.after(box);}const recent=items.filter(([,a])=>Date.now()-Number(a.at||0)<300000),sig=JSON.stringify([items,recent.length]);if(box.dataset.signature===sig)return;box.dataset.signature=sig;box.style.cssText='padding:10px;color:#fff;font:13px system-ui;background:'+(recent.length?'#652438':'#30273b');box.replaceChildren();const details=document.createElement('details'),summary=document.createElement('summary');summary.textContent=recent.length?'⚠ '+recent.length+' commande(s) récente(s) à contrôler':'🗂 '+items.length+' ancien(s) signalement(s) — historique à consulter';details.append(summary);const info=document.createElement('p');info.textContent='Ces signalements sont conservés. Vérifie le poste et la recette avant de répéter une vente. Une confirmation ultérieure de la prise ne vérifie pas la recette.';details.append(info);for(const [id,a]of items){const row=document.createElement('p');row.textContent=new Date(Number(a.at)||0).toLocaleString('fr-FR')+' · Poste(s) '+(a.postes||[]).join(', ')+' · '+(a.message||'Commande non confirmée');details.append(row);}box.append(details);}
if(document.readyState==='loading')w.addEventListener('load',setup);else setup();setInterval(()=>{checkAlerts();incidents();},1000);
})(window);

