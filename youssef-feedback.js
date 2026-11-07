/* YOUSSEF: spoken requests, confirmed receipts, local notifications, incident history. */
(function(w){'use strict';
const sounds=['start','pause','resume','add','subtract','save','restore','off','confirmed','error','five','finish','test'];
const players=new Map();let playing=null;
const enabled=()=>localStorage.getItem('youssef-audio-enabled')!=='0';
function play(name){if(!enabled()||!sounds.includes(name))return false;
 try{if(playing){playing.pause();playing.currentTime=0;}let a=players.get('voice');if(!a){a=new Audio();a.preload='auto';players.set('voice',a);}const src='./youssef-audio-'+name+'.mp3';if(a.getAttribute('src')!==src)a.src=src;a.currentTime=0;a.volume=1;playing=a;const result=a.play();result?.catch(()=>{const e=document.getElementById('youssef-audio-status');if(e)e.textContent='Le navigateur bloque le son : appuie sur « Tester et activer ». ';});return true;}catch(_){return false;}}
function classify(text){const t=String(text||'').toLowerCase();if(/refus|erreur|impossible/.test(t))return 'error';if(/cinq|5 minutes/.test(t))return 'five';if(/terminé|terminée|fin du temps/.test(t))return 'finish';if(/pause/.test(t))return 'pause';if(/repris|reprise|reprendre/.test(t))return 'resume';if(/diminu|retir|rédu|[−–-]\s*temps/.test(t))return 'subtract';if(/sauvegard/.test(t))return 'save';if(/restaur/.test(t))return 'restore';if(/ajout|supplément|prolong|\+tps|\+ tps/.test(t))return 'add';if(/annul|étein|extinc/.test(t))return 'off';if(/activ|démarr/.test(t))return 'start';return 'confirmed';}
// Button audio is emitted by the click listener only; async callbacks must not repeat it.
function speak(){return false;}
w.GZActionAudio={play,classify};
function panel(){document.getElementById('gz-male-voice-panel')?.remove();document.getElementById('youssef-audio-panel')?.remove();const overlay=document.createElement('div');overlay.id='youssef-audio-panel';overlay.style.cssText='position:fixed;inset:0;background:#000b;z-index:1000200;display:grid;place-items:center;padding:18px';
 const box=document.createElement('section');box.style.cssText='max-width:450px;background:#151a2a;color:white;border:1px solid #64748b;border-radius:16px;padding:20px;font:16px system-ui';box.innerHTML='<h2>🎙️ Voix masculine intégrée</h2><p>Les annonces des touches utilisent des fichiers audio intégrés, même si le téléphone ne propose aucune voix française.</p><p id="youssef-audio-status" role="status"></p><button type="button" data-audio="test">▶ Tester et activer</button> <button type="button" data-audio="mute">Couper les annonces</button><p><button type="button" data-audio="close">Fermer</button></p><small>Le son confirme la demande. La réussite reste soumise à la réponse de la prise.</small>';
 box.querySelectorAll('button').forEach(b=>{b.style.cssText='padding:12px;border:1px solid #64748b;border-radius:8px;color:white;background:#253249;margin:4px';b.onclick=()=>{if(b.dataset.audio==='test'){localStorage.setItem('youssef-audio-enabled','1');play('test');box.querySelector('#youssef-audio-status').textContent='Annonces activées sur cet appareil.';}else if(b.dataset.audio==='mute'){localStorage.setItem('youssef-audio-enabled','0');playing?.pause();box.querySelector('#youssef-audio-status').textContent='Annonces désactivées sur cet appareil.';}else overlay.remove();};});overlay.append(box);document.body.append(overlay);}
function notificationStatus(){const b=document.getElementById('gz-notify-btn');if(!b||!('Notification'in w))return;const granted=Notification.permission==='granted';b.textContent=granted?'🔔✓':'🔔';b.title=granted?'Notifications locales autorisées — garder GameZone ouvert':'Activer les notifications sur ce téléphone';}
async function enableNotifications(){
 if(!('Notification'in w)||!('serviceWorker'in navigator))return alert('Notifications non prises en charge sur ce navigateur.');
 if(!w.isSecureContext)return alert('Ouvre GameZone en HTTPS.');
 try{
  const permission=Notification.permission==='default'?await Notification.requestPermission():Notification.permission;
  notificationStatus();
  if(permission!=='granted')return alert('Notifications non autorisées : ouvre les réglages du site sur ce téléphone pour les autoriser.');
  const registration=await Promise.race([navigator.serviceWorker.ready,new Promise((_,reject)=>setTimeout(()=>reject(Error('Recharge GameZone puis réessaie la cloche.')),8000))]);
  await registration.showNotification('GameZone Abou Youssef',{body:'Notifications locales activées : alertes à 5 minutes et à la fin tant que GameZone reste ouvert.',tag:'youssef-notification-test'});
 }catch(e){alert('Notifications : '+e.message);}
}
w.GZFeedback={notificationStatus,enableNotifications};
function setup(){
 if(typeof w.ownerSpeak==='function')w.ownerSpeak=speak;if(typeof w.gzSpeak==='function')w.gzSpeak=speak;if(typeof w.ownerSpeakNow==='function')w.ownerSpeakNow=speak;if(typeof w.gzSpeakNow==='function')w.gzSpeakNow=speak;
 // Replace the voice picker rather than depend on an empty OS voice list.
 const old=document.getElementById('gz-male-voice-button');if(old){const button=old.cloneNode(true);old.replaceWith(button);button.onclick=panel;button.title='Activer les annonces masculines intégrées';}
 notificationStatus();
 // Keep refusal text inside the open dialog: a toast behind it is easily missed.
 if(typeof w.showToast==='function'){const original=w.showToast;w.showToast=function(message){original(message);if(!/⚠|impossible|refus|non disponible|non confirm|requise|indisponible/i.test(String(message)))return;const modal=Array.from(document.querySelectorAll('.mo')).find(el=>el.getBoundingClientRect().height>0);const box=modal?.querySelector('.ms');if(!box)return;let error=box.querySelector('.youssef-command-error');if(!error){error=document.createElement('p');error.className='youssef-command-error';error.setAttribute('role','alert');error.style.cssText='padding:12px;background:#5b2335;color:#fff;border-radius:8px;white-space:normal';box.append(error);}error.textContent=String(message);};}
 const style=document.createElement('style');style.textContent='button,[role=button]{touch-action:manipulation}button:active{filter:brightness(1.2);transform:scale(.98)}';document.head.append(style);
}

document.addEventListener('click',e=>{const b=e.target.closest?.('button');if(!b||b.disabled)return;if(b.id==='gz-male-voice-button'){e.preventDefault();e.stopImmediatePropagation();panel();}else if(b.id==='gz-notify-btn'){e.preventDefault();e.stopImmediatePropagation();play('test');void enableNotifications();}},true);

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

