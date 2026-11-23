const KEY='sf27-bank-v1'
export const BANK_EVENT='sf27-bank-updated'
export const fmt=n=>Math.floor(n).toLocaleString('ru-RU')
const clean=n=>Math.max(0,Math.floor(Number(n)||0))
const initial=()=>({balance:1000,earned:0,aidUsed:false,lastFreeSpin:0,awarded:[],transactions:[],predictions:{}})
export function getBank(){try{const raw=JSON.parse(localStorage.getItem(KEY));if(raw&&Array.isArray(raw.awarded))return {...initial(),...raw,balance:clean(raw.balance),earned:clean(raw.earned)}}catch{}return initial()}
export function saveBank(next){try{localStorage.setItem(KEY,JSON.stringify(next))}catch{}window.dispatchEvent(new Event(BANK_EVENT));return next}
function log(s,type,amount){return [{type,amount,at:Date.now()},...(s.transactions||[])].slice(0,30)}
export function awardAchievement(id,amount){const s=getBank();if(s.awarded.includes(id))return false;const n=clean(amount);saveBank({...s,balance:s.balance+n,earned:s.earned+n,awarded:[...s.awarded,id],transactions:log(s,'ACHIEVEMENT '+id,n)});return true}
export function applySpin(bet,multiplier){const s=getBank();if(![10,50,100,500].includes(bet)||s.balance<bet)return null;const payout=bet*multiplier;const profit=payout-bet;const next={...s,balance:s.balance+profit,earned:s.earned+Math.max(0,profit),transactions:log(s,'SLOTS ×'+multiplier,profit)};saveBank(next);return {payout,profit,balance:next.balance}}
export function claimAid(){const s=getBank();if(s.balance!==0||s.aidUsed)return false;saveBank({...s,balance:1500,aidUsed:true,transactions:log(s,'BANK EMERGENCY',1500)});return true}
export function claimFreeSpin(){const s=getBank();if(s.balance!==0||Date.now()-s.lastFreeSpin<86400000)return null;const amount=50+Math.floor(Math.random()*101);saveBank({...s,balance:amount,lastFreeSpin:Date.now(),transactions:log(s,'FREE SPIN',amount)});return amount}
export function bankTier(s){return s.earned>=100000?'elite':s.earned>=10000?'hellebore':'standard'}
export function syncAchievements(){let a={};let spin={};let slots={};try{a=JSON.parse(localStorage.getItem('sf27-achievements-v2')||'{}')}catch{}try{spin=JSON.parse(localStorage.getItem('sf27-lucky-spin-v2')||'{}')}catch{}try{slots=JSON.parse(localStorage.getItem('sf27-hellebore-slots-v1')||'{}')}catch{}
const awards={earlyBird:100,loyalOne:250,sideEffect:500,whosWatching:500,fifthChair:500,shakeBonus:500,howardBlocked:500,nightOwl:500,wilsonSnitch:500}
Object.entries(awards).forEach(([id,value])=>{if(a[id])awardAchievement(id,value)})
;[1,25,100,250,1000,1000000].forEach(n=>{if((spin.spins||0)>=n)awardAchievement('lucky-'+n,n>=250?250:100)})
if(spin.secret)awardAchievement('lucky-secret',500)
if(slots.jackpot)awardAchievement('slots777',500)
try{if(localStorage.getItem('sf27-two-hour-resident-v1')==='1')awardAchievement('two-hour',500)}catch{}
}
export function placePrediction(id,choice,choices){if(!['first','second'].includes(id)||!Array.isArray(choices)||!choices.includes(choice))return false;const s=getBank();if(s.balance<500||s.predictions?.[id])return false;const predictions={...s.predictions,[id]:{choice,stake:500,placedAt:Date.now(),status:'pending'}};saveBank({...s,balance:s.balance-500,predictions,transactions:log(s,'PREDICTION '+id,-500)});return true}
