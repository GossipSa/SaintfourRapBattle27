// Single-page coordination for nonessential Saintfour pop-ups.
// Time advances only while the document is visible; no visitor progress is stored here.
let activeMs=0
let activeSince=typeof performance!=='undefined'?performance.now():0
let hidden=typeof document!=='undefined'?document.hidden:false
let owner=null
let ownerSince=0
let lastEnd=-45000
const GAP=45000
if(typeof document!=='undefined'){
 document.addEventListener('visibilitychange',()=>{
  const now=performance.now()
  if(!hidden)activeMs+=now-activeSince
  hidden=document.hidden
  activeSince=now
 })
}
export const ambientElapsed=()=>activeMs+(hidden?0:performance.now()-activeSince)
export const ambientRandom=(min,max)=>min+Math.floor(Math.random()*(max-min+1))
const blockingUi=()=>Boolean(document.querySelector(
 '.achievement-toast, .spin-achievement-toast, .sound-consent-backdrop, .howard-mail-backdrop, .hp-overlay, .sf-notification, .warlock-notice, [role="dialog"][aria-modal="true"], .sf-secret-interview-overlay'
))
export function acquireAmbient(name){
 // Recover from a stale event owner (for example after a modal closes unexpectedly).
 if(owner&&ambientElapsed()-ownerSince>60000){owner=null;lastEnd=ambientElapsed()-GAP}
 if(hidden||owner||ambientElapsed()-lastEnd<GAP||blockingUi())return false
 owner=name
 ownerSince=ambientElapsed()
 return true
}
export function releaseAmbient(name){
 if(owner!==name)return
 owner=null
 ownerSince=0
 lastEnd=ambientElapsed()
}
