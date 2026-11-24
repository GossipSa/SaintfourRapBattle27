import { useEffect, useRef, useState } from 'react'
import { Phone, PhoneOff, X, LockKeyhole } from 'lucide-react'
import './HowardPhone.css'
import { acquireAmbient, releaseAmbient, ambientElapsed, ambientRandom } from './ambient-timing.js'
import { dexCallStories } from './dex-call-stories.js'
import { poppyCallStories } from './poppy-call-stories.js'

const STORE='sf27-howard-phone-v2'
const SECRET_STORE='sf27-howard-second-number-v1'
const SECRET_NUMBER='27042007'
const DEX_NUMBER='66601313'
const POPPY_NUMBER='77701927'
const POPPY_STORE='sf27-poppy-contact-v1'
const POPPY_CALLS='sf27-poppy-calls-v1'
const DEX_STORE='sf27-dex-number-found-v1'
const DEX_CALL_STORE='sf27-dex-call-history-v1'
function readPoppyContact(){try{const found=JSON.parse(localStorage.getItem(POPPY_STORE)||'null');return found?.number===POPPY_NUMBER?found:null}catch{return null}}
function readPoppyCalls(){try{const v=JSON.parse(localStorage.getItem(POPPY_CALLS)||'{}');return {introDone:Boolean(v.introDone),used:Array.isArray(v.used)?v.used:[]}}catch{return {introDone:false,used:[]}}}
function hasDex(){try{return localStorage.getItem(DEX_STORE)===DEX_NUMBER}catch{return false}}
function readDexCalls(){try{const v=JSON.parse(localStorage.getItem(DEX_CALL_STORE)||'[]');return Array.isArray(v)?v.filter(i=>Number.isInteger(i)&&i>=0&&i<dexCallStories.length):[]}catch{return []}}
function nextDexStory(used){const remaining=dexCallStories.map((_,i)=>i).filter(i=>!used.includes(i));const pool=remaining.length?remaining:dexCallStories.map((_,i)=>i);const index=pool[Math.floor(Math.random()*pool.length)];const next=remaining.length?[...used,index]:[index];try{localStorage.setItem(DEX_CALL_STORE,JSON.stringify(next))}catch{}return {story:dexCallStories[index],count:next.length}}
const secretLines=["Натаниэль Говард, слушаю. Кто это?","Простите, откуда у вас этот номер?","Это частная линия. Представьтесь.","Если вы из прессы, обращайтесь в приёмную.","Вы звоните мне второй раз за минуту.","Нет, я не собираюсь обсуждать рэп-баттл.","Кто дал вам этот номер? Назовите имя.","Я не давал разрешения распространять мои контакты.","Это не телефон горячей линии WARLOCK.","У меня встреча. Говорите быстрее.","Вы молчите. Я тоже могу молчать.","Нет, автографы по телефону не выдаю.","Я уже объяснил: это личный номер.","Вы действительно считаете это забавным?","Я запомнил ваш голос. Точнее, ваше молчание.","Если это Поппи, передайте ей, что я занят.","У вас есть конкретный вопрос? Нет? Всего доброго.","Мне сейчас не до ваших развлечений.","Надеюсь, у вас есть веская причина звонить.","Секретарь не должен был пропускать этот вызов.","Вы настойчивы. Это не комплимент.","Вам не кажется, что мы уже разговаривали?","Я не обязан отвечать на каждый ваш звонок.","Никогда не думал, что буду скучать по спаму.","Это какая-то коллективная шутка?","Сколько раз вы собираетесь повторять это?","Вы нашли номер. Поздравляю. Что дальше?","Нет, мой график вам не сообщат.","Вопросы о компании задаются официально.","Я начинаю подозревать организаторов баттла.","Мне стоит сменить номер. Снова.","Это уже похоже на эксперимент по проверке терпения.","Вам никто не говорил, что такое личные границы?","Я отклонял этот вызов. Почему он проходит?","У меня на экране опять ваш номер. Прекрасно.","Не произносите имя Надин в этом разговоре.","Я не собираюсь читать вам свои панчи.","Если вы хотите интервью, запишитесь заранее.","Не называйте меня MC NETTI.","Нет. Я не надену ту одежду ещё раз.","Уточните, кто именно организовал этот цирк.","Я требую объяснений. Не смеха.","Вы хоть понимаете, сколько стоит моё время?","В следующий раз трубку возьмёт юрист.","Не проверяйте, действительно ли я это сделаю.","Я почти уверен, что заблокировал вас.","Почему телефон снова звонит?","Вы нашли какой-то обход блокировки?","Похоже, оператор связи тоже участвует в заговоре.","Я не обсуждаю служебные вопросы с незнакомцами.","Я перезвоню вам? Нет. Разумеется, нет.","В WARLOCK сейчас выясняют источник утечки.","Я слышу, как вы смеётесь. Очень зря.","Вы не первый, кто пытается вывести меня из себя.","Вы удивитесь, насколько длинным бывает рабочий день.","Положите трубку. Это было бы разумно.","Я больше не собираюсь повторяться.","Неужели у вас совсем нет других занятий?","Это последний раз, когда я отвечаю.","…Вы опять? Невероятно."]
function hasSecret(){try{return localStorage.getItem(SECRET_STORE)==='1'}catch{return false}}
const REMINDER_MIN=120000
const REMINDER_RANGE=120000
const reminderLines=['Номер сохранился в журнале. Может, перезвоним?','Номер всё ещё здесь. Говард, вероятно, надеялся, что вы его удалите.','Пропущенный вызов никуда не исчез. Перезвоним?']
const responses=[
 {text:'Абонент не отвечает.',status:'НЕТ ОТВЕТА'},
 {text:'Линия занята. Попробуйте позже.',status:'ЗАНЯТО'},
 {text:'Слушаю? ... Вы снова?',status:'ВЫЗОВ ЗАВЕРШЁН'},
 {text:'Я занят. Не звоните сюда больше.',status:'СОЕДИНЕНИЕ ПРЕРВАНО'},
 {text:'Это служебный номер. Прошу вас больше его не набирать.',status:'ВЫЗОВ ЗАВЕРШЁН'},
 {text:'У вас, очевидно, слишком много свободного времени.',status:'СОЕДИНЕНИЕ ПРЕРВАНО'},
 {text:'Вы ошиблись номером. Повторно.',status:'ВЫЗОВ ЗАВЕРШЁН'},
 {text:'Абонент временно недоступен.',status:'НЕТ ОТВЕТА'},
 {text:'Если это шутка, она затянулась.',status:'СОЕДИНЕНИЕ ПРЕРВАНО'},
 {text:'Откуда у вас вообще этот номер?',status:'ВЫЗОВ ЗАВЕРШЁН'},
]
function readState(){try{
 if(new URLSearchParams(window.location.search).get('resetHoward')==='1'){localStorage.removeItem(STORE);sessionStorage.removeItem('sf27-howard-seen');return {calls:0,introDone:false,blocked:false,limit:0,firstSeen:false,missed:false,reminders:0}}
const data=JSON.parse(localStorage.getItem(STORE)||'{}');return {calls:Math.max(0,Number(data.calls)||0),introDone:Boolean(data.introDone),blocked:Boolean(data.blocked),limit:Number(data.limit)||0,firstSeen:Boolean(data.firstSeen||data.introDone),missed:Boolean(data.missed),reminders:Math.max(0,Number(data.reminders)||0)}}catch{return {calls:0,introDone:false,blocked:false,limit:0}}}
function saveState(state){try{localStorage.setItem(STORE,JSON.stringify(state))}catch{/* storage disabled */}}
export default function HowardPhone({onBlocked,achievementUnlocked=false,suppressed=false}){
 const [secretFound,setSecretFound]=useState(hasSecret)
 const [dexFound,setDexFound]=useState(hasDex)
 const [poppyContact,setPoppyContact]=useState(readPoppyContact)
 const [poppyProgress,setPoppyProgress]=useState(readPoppyCalls)
 const [poppyLines,setPoppyLines]=useState([])
 const [poppySlide,setPoppySlide]=useState(0)
 const [poppyBusy,setPoppyBusy]=useState(false)
 const [dexUsed,setDexUsed]=useState(readDexCalls)
 const [dexStory,setDexStory]=useState(null)
 const [dial,setDial]=useState('')
 const lastHang=useRef(0)
 const [expandedContact,setExpandedContact]=useState(null)
 const [secretReply,setSecretReply]=useState('')
 const [secretCalls,setSecretCalls]=useState(()=>{try{return Math.max(0,Number(localStorage.getItem('sf27-howard-secret-calls'))||0)}catch{return 0}})
 const [visible,setVisible]=useState(()=>{try{const reset=new URLSearchParams(window.location.search).get('resetHoward')==='1';const state=readState();return reset||state.blocked}catch{return true}})
 const [opened,setOpened]=useState(()=>new URLSearchParams(window.location.search).get('resetHoward')==='1')
 const [progress,setProgress]=useState(readState)
 const [reply,setReply]=useState(null)
 const [mode,setMode]=useState('incoming')
 const [dismissed,setDismissed]=useState(false)
 const [nextReminder,setNextReminder]=useState(0)
 const dueAt=useRef(ambientElapsed()+ambientRandom(30000,90000))
 const suppressedRef=useRef(suppressed)
 suppressedRef.current=suppressed
 const isBlocked=progress.blocked||achievementUnlocked
 const poppyFound=Boolean(poppyContact)
 // Resume the pre-block storyline on each visit, even if a previous call was dismissed.
 useEffect(()=>{if(!isBlocked&&!progress.firstSeen){const next={...progress,firstSeen:true};setProgress(next);saveState(next)}},[])
 useEffect(()=>{if((secretFound||dexFound||poppyFound)&&isBlocked){setVisible(true);setDismissed(false)}},[secretFound,dexFound,poppyFound,isBlocked])
 useEffect(()=>{const found=()=>{setDexFound(true);if(isBlocked)setVisible(true)};window.addEventListener('sf27-dex-number-found',found);return()=>window.removeEventListener('sf27-dex-number-found',found)},[isBlocked])
 useEffect(()=>{const found=()=>{setSecretFound(true);if(isBlocked){setVisible(true);setDismissed(false);setDial('')}};window.addEventListener('sf27-howard-number-found',found);return()=>window.removeEventListener('sf27-howard-number-found',found)},[isBlocked])
 useEffect(()=>{if(!opened||mode!=='secret-connecting')return;const timer=setTimeout(()=>setMode('secret-answer'),1800);return()=>clearTimeout(timer)},[opened,mode])
 useEffect(()=>{if(!opened||mode!=='dex-connecting'||!dexStory)return;const timer=setTimeout(()=>setMode('dex-answer'),dexStory.connectMs);return()=>clearTimeout(timer)},[opened,mode,dexStory])
 useEffect(()=>{
  // Random first arrival on every visit, even if the visitor previously dismissed it.
  // Retrying every two seconds avoids a missed notification when Telegram is backgrounded.
  if(isBlocked){releaseAmbient('phone');return}
  if(visible||opened)return
  dueAt.current=ambientElapsed()+(
   nextReminder===0?ambientRandom(30000,90000):ambientRandom(REMINDER_MIN,REMINDER_MIN+REMINDER_RANGE)
  )
  const timer=window.setInterval(()=>{
   if(ambientElapsed()<dueAt.current||suppressedRef.current)return
   if(!acquireAmbient('phone'))return
   setVisible(true)
   setDismissed(false)
   setProgress(prev=>{
    const next={...prev,firstSeen:true,reminders:nextReminder===0?prev.reminders:prev.reminders+1}
    saveState(next)
    return next
   })
  },2000)
  return()=>window.clearInterval(timer)
 },[isBlocked,visible,opened,nextReminder])
 useEffect(()=>()=>releaseAmbient('phone'),[])
 // An unanswered ringing phone should not silence the rest of the site forever.
 useEffect(()=>{
  if(isBlocked||!visible||opened)return undefined
  const timeout=window.setTimeout(()=>{
   releaseAmbient('phone')
   setVisible(false)
   setNextReminder(n=>n+1)
  },45000)
  return()=>window.clearTimeout(timeout)
 },[isBlocked,visible,opened])

 useEffect(()=>{
  if(!opened)return
  const key=e=>{if(e.key==='Escape'){setPoppyBusy(false);setOpened(false);setMode('incoming')}}
  document.addEventListener('keydown',key)
  return()=>document.removeEventListener('keydown',key)
 },[opened])
 const savePoppy=(source)=>{
  if(poppyContact)return
  const contact={number:POPPY_NUMBER,source}
  setPoppyContact(contact)
  try{localStorage.setItem(POPPY_STORE,JSON.stringify(contact))}catch{}
 }
 const revealPoppy=(source)=>{
  savePoppy(source)
  setPoppyLines(source==='howard'
   ?['У мисс Эмерсон, очевидно, слишком много времени.','Запишите: 77701927.','Передайте: я лично рекомендовал обратиться к ней.']
   :['Слышь, хочешь номер одной разговорчивой особы?','77701927. Поппи.','Спроси, кто записал Говарда на баттл. Хочу послушать, как она будет орать.'])
  setPoppySlide(0)
  setMode('poppy-unlock')
 }
 const advancePoppy=()=>{
  if(poppySlide<poppyLines.length-1){setPoppySlide(v=>v+1);return}
  if(mode==='poppy-unlock'){setMode('secret-idle');setDial('');return}
  setMode('secret-idle')
  setDial(POPPY_NUMBER)
 }
 const savePoppyProgress=(next)=>{
  setPoppyProgress(next)
  try{localStorage.setItem(POPPY_CALLS,JSON.stringify(next))}catch{}
 }
 const callPoppy=()=>{
  if(!poppyFound||poppyBusy)return
  setPoppyBusy(true)
  setMode('poppy-connecting')
 }
 useEffect(()=>{
  if(!opened||mode!=='poppy-connecting')return
  const timer=window.setTimeout(()=>{
   setPoppyBusy(false)
   if(Math.random()<.2){
    setPoppyLines([])
    setMode('poppy-no-answer')
    return
   }
   if(!poppyProgress.introDone){
    setPoppyLines(poppyContact?.source==='dex'
     ?['Поппи Эмерсон. Слушаю.','Кто записал Говарда на батл?!','Стойте. Декс дал вам мой номер?','Я его прибью. Передайте дословно.']
     :['Пенелопа Эмерсон. Слушаю.','Мистер Говард дал вам мой номер?','Он решил сделать меня своей секретаршей?','Прекрасно. У нас с ним будет разговор.'])
    savePoppyProgress({...poppyProgress,introDone:true})
   }else{
    const pool=poppyCallStories.map((_,i)=>i).filter(i=>!poppyProgress.used.includes(i))
    const candidates=pool.length?pool:poppyCallStories.map((_,i)=>i)
    const idx=candidates[Math.floor(Math.random()*candidates.length)]
    setPoppyLines(poppyCallStories[idx])
    savePoppyProgress({...poppyProgress,used:pool.length?[...poppyProgress.used,idx]:[idx]})
   }
   setPoppySlide(0)
   setMode('poppy-answer')
  },1800)
  return()=>window.clearTimeout(timer)
 },[opened,mode,poppyProgress,poppyContact])
 const markMissed=()=>{
  if(progress.firstSeen&&!progress.introDone&&!progress.missed){const next={...progress,missed:true};setProgress(next);saveState(next)}
 }
 const open=()=>{if(isBlocked&&(secretFound||dexFound||poppyFound)){setOpened(true);setMode('secret-idle');return}if(isBlocked){setOpened(true);setMode('blocked');return}setOpened(true);setMode(progress.firstSeen&&progress.missed&&!progress.introDone?'idle':progress.introDone?'idle':'incoming')}
 const call=()=>{
  if(isBlocked){setMode('blocked');return}
  if(!progress.introDone){
   const next={...progress,introDone:true,firstSeen:true,missed:false,limit:30+Math.floor(Math.random()*16)}
   setProgress(next);saveState(next);setMode('mistake');return
  }
  const next={...progress,calls:progress.calls+1}
  if(next.calls>=next.limit)next.blocked=true
  setProgress(next);saveState(next)
  if(next.blocked){releaseAmbient('phone');setMode('final');onBlocked?.();return}
  const pool=next.calls<8?responses.slice(0,5):next.calls<22?responses:responses.slice(1)
  const chosen=pool[Math.floor(Math.random()*pool.length)]
  setReply(chosen);setMode('answer')
 }
 const callDex=()=>{if(!poppyFound&&Math.random()<1/60){revealPoppy('dex');return}const {story,count}=nextDexStory(dexUsed);setDexUsed(readDexCalls());setDexStory(story);setMode('dex-connecting');if(count===25){try{const a=JSON.parse(localStorage.getItem('sf27-achievements-v2')||'{}');localStorage.setItem('sf27-achievements-v2',JSON.stringify({...a,dexOnTheLine:true}));window.dispatchEvent(new Event('sf27-dex-achievement'))}catch{}}}
 const callNumber=()=>{if(mode==='secret-connecting'||mode==='dex-connecting'||mode==='poppy-connecting')return;if(dial===DEX_NUMBER&&dexFound){callDex();return}if(dial===SECRET_NUMBER&&secretFound){callSecret();return}if(dial===POPPY_NUMBER&&poppyFound){callPoppy();return}setMode('secret-wrong')}
 const callSecret=()=>{if(mode==='secret-connecting')return;if(dial!==SECRET_NUMBER){setMode('secret-wrong');return}if(!poppyFound&&Math.random()<1/100){revealPoppy('howard');return}const index=secretCalls%secretLines.length;setSecretReply(secretLines[index]);setSecretCalls(secretCalls+1);try{localStorage.setItem('sf27-howard-secret-calls',String(secretCalls+1))}catch{}setMode('secret-connecting')}
 const pressKey=k=>{if(!isBlocked||!(secretFound||dexFound||poppyFound))return;const digit=k.charAt(0);if(!/^[0-9]$/.test(digit))return;setDial(v=>(v+digit).slice(0,14));setMode('secret-idle')}
 const hang=()=>{if(mode==='final'){close();return}const now=Date.now();const double=now-lastHang.current<500;lastHang.current=double?0:now;if(double&&isBlocked&&(secretFound||dexFound||poppyFound))setDial('');if(mode==='incoming')markMissed();if(mode==='poppy-connecting')setPoppyBusy(false);setMode(isBlocked&&(secretFound||dexFound||poppyFound)?'secret-idle':progress.blocked?'blocked':'idle')}
 const close=()=>{if(mode==='incoming')markMissed();if(mode==='poppy-connecting')setPoppyBusy(false);if(!isBlocked){releaseAmbient('phone');setVisible(false);setNextReminder(n=>n+1)}setOpened(false);setMode('incoming')}
 const dismiss=()=>{releaseAmbient('phone');markMissed();setDismissed(true);setVisible(false);setOpened(false);setMode('incoming');if(!isBlocked)setNextReminder(n=>n+1)}
 if(!visible&&!isBlocked)return null
 return <>
  {isBlocked&&!opened&&<button type="button" className="hp-pocket-launcher" onClick={open} aria-label="Достать Motorola"><Phone size={17}/><span>MOTOROLA</span></button>}
  {!isBlocked&&!opened&&!suppressed&&<div className="hp-floating">
    <button type="button" className="hp-closed" onClick={open} aria-label="Открыть звонящую фиолетовую раскладушку">
     <span className="hp-closed-hinge"/><span className="hp-closed-logo">M</span><span className="hp-closed-display"><Phone size={20}/><small>{isBlocked&&secretFound?'DIAL':isBlocked?'BLOCKED':progress.introDone||progress.missed?'CALL LOG':'INCOMING'}</small></span><span className="hp-closed-led"/>
    </button>
    {(isBlocked&&secretFound||progress.missed||progress.introDone)&&<div className="hp-reminder">{isBlocked&&secretFound?'Может, попробуем позвонить по этому номеру?':progress.missed&&!progress.introDone?'1 ПРОПУЩЕННЫЙ ВЫЗОВ · ПЕРЕЗВОНИТЬ?':reminderLines[Math.max(0,progress.reminders-1)%reminderLines.length]}</div>}
    <button type="button" className="hp-dismiss" aria-label="Убрать телефон" onClick={dismiss}><X size={15}/></button>
   </div>}
  {opened&&<div className="hp-overlay" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)close()}}>
   <div className="hp-window" role="dialog" aria-modal="true" aria-label="Телефон Натаниэля Говарда">
    <button type="button" className="hp-exit" onClick={close} aria-label="Закрыть раскладушку"><X size={20}/></button>
    {(secretFound||dexFound||poppyFound)&&isBlocked&&<aside className="hp-number-notes" aria-label="Сохранённые номера">
      {secretFound&&<button type="button" className={'hp-contact-tab '+(expandedContact==='howard'?'is-expanded':'')} onClick={()=>setExpandedContact(v=>v==='howard'?null:'howard')} aria-expanded={expandedContact==='howard'}>
       <span className="hp-tab-label">HOWARD</span>
       {expandedContact==='howard'&&<span className="hp-tab-details"><small>WARLOCK · PRIVATE</small><strong>27 04<br/>20 07</strong><span>Натаниэль Говард</span></span>}
      </button>}
      {dexFound&&<button type="button" className={'hp-contact-tab hp-contact-dex '+(expandedContact==='dex'?'is-expanded':'')} onClick={()=>setExpandedContact(v=>v==='dex'?null:'dex')} aria-expanded={expandedContact==='dex'}><span className="hp-tab-label">LIL DEX</span>{expandedContact==='dex'&&<span className="hp-tab-details"><small>PRIVATE / LEAKED</small><strong>66 60<br/>13 13</strong><span>Не звони, придурок.</span></span>}</button>}
      {poppyFound&&<button type="button" className={'hp-contact-tab hp-contact-poppy '+(expandedContact==='poppy'?'is-expanded':'')} onClick={()=>setExpandedContact(v=>v==='poppy'?null:'poppy')} aria-expanded={expandedContact==='poppy'}><span className="hp-tab-label">POPPY</span>{expandedContact==='poppy'&&<span className="hp-tab-details"><small>PRIVATE / SAVED</small><strong>77 70<br/>19 27</strong><span>Пенелопа Эмерсон</span></span>}</button>}
     </aside>}
    <div className="hp-phone">
     <button type="button" className="hp-upper" onClick={close} aria-label="Сложить телефон">
      <span className="hp-earpiece"/>
      <div className="hp-screen">
       <div className="hp-status"><span>▂▄▆</span><span>SF · 27</span><span>▰▰▰</span></div>
       <div className="hp-screen-body">
        {mode==='secret-idle'||mode==='secret-wrong'?<><span className="hp-screen-kicker">НАБОР НОМЕРА</span><strong className="hp-dial-display">{dial||'________'}</strong><small>{mode==='secret-wrong'?'НОМЕР НЕ НАЙДЕН':'НАБЕРИТЕ СОХРАНЁННЫЙ НОМЕР'}</small></>:mode==='poppy-unlock'?<><span className="hp-screen-kicker">НОВЫЙ КОНТАКТ · POPPY</span><strong className="hp-poppy-story">{poppyLines[poppySlide]}</strong><small>77701927 СОХРАНЁН · {poppySlide+1}/{poppyLines.length} · КНОПКА ●</small></>:mode==='poppy-connecting'?<><span className="hp-screen-kicker">POPPY EMERSON</span><Phone className="hp-ring" size={23}/><strong className="hp-connecting">СОЕДИНЕНИЕ<span className="hp-dots"/></strong><small>{POPPY_NUMBER}</small></>:mode==='poppy-no-answer'?<><PhoneOff size={23}/><strong>АБОНЕНТ НЕ ОТВЕЧАЕТ</strong><small>ВЫЗОВ ЗАВЕРШЁН</small></>:mode==='poppy-answer'?<><span className="hp-screen-kicker">POPPY EMERSON · {poppySlide+1}/{poppyLines.length}</span><strong className="hp-poppy-story">{poppyLines[poppySlide]}</strong><small>{poppySlide===poppyLines.length-1?'КОНЕЦ РАЗГОВОРА · ●':'СЛЕДУЮЩАЯ РЕПЛИКА · ●'}</small></>:mode==='dex-connecting'?<><span className="hp-screen-kicker">LIL DEX / ИСХОДЯЩИЙ</span><strong>{DEX_NUMBER}</strong><strong className="hp-connecting">СОЕДИНЕНИЕ<span className="hp-dots"/></strong></>:mode==='dex-answer'?<><span className="hp-screen-kicker">LIL DEX · {dexStory?.duration}</span><strong className="hp-dex-story">{dexStory?.text}</strong><small>ВЫЗОВ ЗАВЕРШЁН</small></>:mode==='secret-connecting'?<><span className="hp-screen-kicker">ИСХОДЯЩИЙ ВЫЗОВ</span><strong>{SECRET_NUMBER}</strong><strong className="hp-connecting">СОЕДИНЕНИЕ<span className="hp-dots"/></strong></>:mode==='secret-answer'?<><span className="hp-screen-kicker">НАТАНИЭЛЬ ГОВАРД</span><strong>{secretReply}</strong><small>ВЫЗОВ ЗАВЕРШЁН</small></>:mode==='blocked'?<><LockKeyhole size={31}/><strong>КОНТАКТ<br/>ЗАБЛОКИРОВАН</strong><small>WARLOCK INDUSTRIES</small></>:
         mode==='final'?<><span className="hp-screen-kicker">НАТАНИЭЛЬ ГОВАРД</span><strong className="hp-angry">КТО ДАЛ ВАМ МОЙ НОМЕР?!</strong><small>ВАШ НОМЕР ЗАБЛОКИРОВАН</small></>:
         mode==='mistake'?<><span className="hp-screen-kicker">НАТАНИЭЛЬ ГОВАРД</span><strong>Прошу прощения. Кажется, я ошибся номером.</strong><small>ВЫЗОВ ЗАВЕРШЁН</small></>:
         mode==='answer'?<><span className="hp-screen-kicker">НАТАНИЭЛЬ ГОВАРД</span><strong>{reply?.text}</strong><small>{reply?.status}</small></>:
         mode==='idle'?<><PhoneOff size={27}/><strong>ВЫЗОВ ЗАВЕРШЁН</strong><small>НАБЕРИТЕ ЕЩЁ РАЗ</small></>:
         <><span className="hp-screen-kicker">ВХОДЯЩИЙ ВЫЗОВ</span><Phone className="hp-ring" size={29}/><strong>НЕИЗВЕСТНЫЙ<br/>НОМЕР</strong><small>ВХОДЯЩИЙ ВЫЗОВ</small></>}
       </div>
       <div className="hp-screen-bottom"><span>{mode==='incoming'?'ANSWER':'SAINTFOUR'}</span><span>{mode==='incoming'?'DECLINE':'27 / 27'}</span></div>
      </div>
      <span className="hp-upper-mark">SAINTFOUR TELECOM</span>
     </button>
     <div className="hp-joint"><span/></div>
     <div className="hp-lower">
      <div className="hp-actions">
       <button type="button" className="hp-answer" onClick={isBlocked&&(secretFound||dexFound||poppyFound)?callNumber:call} aria-label={mode==='incoming'?'Ответить на звонок':'Позвонить ещё раз'} disabled={mode==='blocked'||mode==='final'||mode==='secret-connecting'||mode==='dex-connecting'||mode==='poppy-connecting'||mode==='poppy-answer'||mode==='poppy-unlock'}><Phone size={20}/></button>
       <button type="button" className="hp-dpad" onClick={advancePoppy} disabled={mode!=='poppy-answer'&&mode!=='poppy-unlock'} aria-label="Следующая реплика"><span>▲</span><span>◀ ● ▶</span><span>▼</span></button>
       <button type="button" className="hp-hang" onClick={hang} aria-label="Завершить вызов; два нажатия — очистить номер"><PhoneOff size={19}/></button>
      </div>
      <div className="hp-keys">{['1','2 ABC','3 DEF','4 GHI','5 JKL','6 MNO','7 PQRS','8 TUV','9 WXYZ','*','0 +','#'].map(k=><button type="button" key={k} onClick={()=>{if(isBlocked&&(secretFound||dexFound||poppyFound)&&!['poppy-answer','poppy-unlock','poppy-connecting'].includes(mode))pressKey(k);else if(mode==='idle')setMode('incoming')}}>{<><span className="hp-key-digit">{k.charAt(0)}</span>{k.length>1&&<span className="hp-key-letters">{k.slice(1).trim()}</span>}</>}</button>)}</div>
      <span className="hp-bottom-mark">MOTOR / SF EDITION</span>
     </div>
    </div>
    <div className="hp-caption">{mode.startsWith('poppy-')?'POPPY EMERSON · Личная линия.':mode.startsWith('dex-')?'LIL DEX. Никто не обещал, что разговор будет нормальным.':mode.startsWith('secret-')?'Личный номер. Говард явно не ожидал этого звонка.':mode==='blocked'?'Натаниэль Говард заблокировал ваш номер.':mode==='final'?'Достижение открыто: «ГОВАРД ЗАБЛОКИРОВАЛ ВАС»':mode==='incoming'?'Неизвестный номер. Ответить на вызов?':mode==='mistake'?'Звонок оборвался. Но номер остался в журнале.':progress.missed&&!progress.introDone?'1 пропущенный вызов. Номер сохранился. Может, перезвоним?':'Можно попробовать перезвонить.'}</div>
   </div>
  </div>}
 </>
}
