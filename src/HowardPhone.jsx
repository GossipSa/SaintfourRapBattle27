import { useEffect, useState } from 'react'
import { Phone, PhoneOff, X, LockKeyhole } from 'lucide-react'
import './HowardPhone.css'

const STORE='sf27-howard-phone-v2'
const SECRET_STORE='sf27-howard-second-number-v1'
const SECRET_NUMBER='27042007'
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
export default function HowardPhone({onBlocked,achievementUnlocked=false}){
 const [secretFound,setSecretFound]=useState(hasSecret)
 const [dial,setDial]=useState('')
 const [secretReply,setSecretReply]=useState('')
 const [secretCalls,setSecretCalls]=useState(()=>{try{return Math.max(0,Number(localStorage.getItem('sf27-howard-secret-calls'))||0)}catch{return 0}})
 const [visible,setVisible]=useState(()=>new URLSearchParams(window.location.search).get('resetHoward')==='1'||(hasSecret()&&Boolean(JSON.parse(localStorage.getItem('sf27-achievements-v2')||'{}').howardBlocked)))
 const [opened,setOpened]=useState(()=>new URLSearchParams(window.location.search).get('resetHoward')==='1')
 const [progress,setProgress]=useState(readState)
 const [reply,setReply]=useState(null)
 const [mode,setMode]=useState('incoming')
 const [dismissed,setDismissed]=useState(false)
 const [nextReminder,setNextReminder]=useState(0)
 const isBlocked=progress.blocked||achievementUnlocked
 useEffect(()=>{if(secretFound&&isBlocked){setVisible(true);setDismissed(false)}},[secretFound,isBlocked])
 useEffect(()=>{const found=()=>{setSecretFound(true);if(isBlocked){setVisible(true);setDismissed(false);setDial('')}};window.addEventListener('sf27-howard-number-found',found);return()=>window.removeEventListener('sf27-howard-number-found',found)},[isBlocked])
 useEffect(()=>{if(!opened||mode!=='secret-connecting')return;const timer=setTimeout(()=>setMode('secret-answer'),1800);return()=>clearTimeout(timer)},[opened,mode])
 useEffect(()=>{
  if(new URLSearchParams(window.location.search).get('resetHoward')==='1')return
  if((isBlocked&&!secretFound)||visible||opened)return
  let timer
  const show=()=>{
   setVisible(true)
   setDismissed(false)
   if(!progress.firstSeen){
    const next={...progress,firstSeen:true}
    setProgress(next);saveState(next)
   }else{
    const next={...progress,reminders:progress.reminders+1}
    setProgress(next);saveState(next)
   }
  }
  const schedule=()=>{
   window.clearTimeout(timer)
   if(document.visibilityState==='hidden')return
   const delay=isBlocked?3000:progress.firstSeen?REMINDER_MIN+Math.floor(Math.random()*REMINDER_RANGE):20000+Math.round(Math.random()*20000)
   timer=window.setTimeout(show,delay)
  }
  schedule()
  document.addEventListener('visibilitychange',schedule)
  return()=>{window.clearTimeout(timer);document.removeEventListener('visibilitychange',schedule)}
 },[isBlocked,progress.firstSeen,visible,opened,nextReminder,secretFound])
 useEffect(()=>{
  if(!opened)return
  const key=e=>{if(e.key==='Escape'){setOpened(false);setMode('incoming')}}
  document.addEventListener('keydown',key)
  return()=>document.removeEventListener('keydown',key)
 },[opened])
 const markMissed=()=>{
  if(progress.firstSeen&&!progress.introDone&&!progress.missed){const next={...progress,missed:true};setProgress(next);saveState(next)}
 }
 const open=()=>{if(isBlocked&&secretFound){setOpened(true);setMode('secret-idle');return}if(isBlocked)return;setOpened(true);setMode(progress.firstSeen&&progress.missed&&!progress.introDone?'idle':progress.introDone?'idle':'incoming')}
 const call=()=>{
  if(isBlocked){setMode('blocked');return}
  if(!progress.introDone){
   const next={...progress,introDone:true,firstSeen:true,missed:false,limit:30+Math.floor(Math.random()*16)}
   setProgress(next);saveState(next);setMode('mistake');return
  }
  const next={...progress,calls:progress.calls+1}
  if(next.calls>=next.limit)next.blocked=true
  setProgress(next);saveState(next)
  if(next.blocked){setMode('final');onBlocked?.();return}
  const pool=next.calls<8?responses.slice(0,5):next.calls<22?responses:responses.slice(1)
  const chosen=pool[Math.floor(Math.random()*pool.length)]
  setReply(chosen);setMode('answer')
 }
 const callSecret=()=>{if(mode==='secret-connecting')return;if(dial!==SECRET_NUMBER){setMode('secret-wrong');return}const index=secretCalls%secretLines.length;setSecretReply(secretLines[index]);setSecretCalls(secretCalls+1);try{localStorage.setItem('sf27-howard-secret-calls',String(secretCalls+1))}catch{}setMode('secret-connecting')}
 const pressKey=k=>{if(!isBlocked||!secretFound)return;const digit=k.charAt(0);if(!/^[0-9]$/.test(digit))return;setDial(v=>(v+digit).slice(0,14));setMode('secret-idle')}
 const hang=()=>{if(mode==='incoming')markMissed();setMode(isBlocked&&secretFound?'secret-idle':progress.blocked?'blocked':'idle')}
 const close=()=>{if(mode==='incoming')markMissed();setOpened(false);setMode('incoming')}
 const dismiss=()=>{markMissed();setDismissed(true);setVisible(false);setOpened(false);setMode('incoming');setNextReminder(n=>n+1)}
 if(!visible||(isBlocked&&!secretFound&&!opened))return null
 return <>
  {!opened&&<div className="hp-floating">
    <button type="button" className="hp-closed" onClick={open} aria-label="Открыть звонящую фиолетовую раскладушку">
     <span className="hp-closed-hinge"/><span className="hp-closed-logo">M</span><span className="hp-closed-display"><Phone size={20}/><small>{isBlocked&&secretFound?'DIAL':isBlocked?'BLOCKED':progress.introDone||progress.missed?'CALL LOG':'INCOMING'}</small></span><span className="hp-closed-led"/>
    </button>
    {(isBlocked&&secretFound||progress.missed||progress.introDone)&&<div className="hp-reminder">{isBlocked&&secretFound?'Может, попробуем позвонить по этому номеру?':progress.missed&&!progress.introDone?'1 ПРОПУЩЕННЫЙ ВЫЗОВ · ПЕРЕЗВОНИТЬ?':reminderLines[Math.max(0,progress.reminders-1)%reminderLines.length]}</div>}
    <button type="button" className="hp-dismiss" aria-label="Убрать телефон" onClick={dismiss}><X size={15}/></button>
   </div>}
  {opened&&<div className="hp-overlay" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)close()}}>
   <div className="hp-window" role="dialog" aria-modal="true" aria-label="Телефон Натаниэля Говарда">
    <button type="button" className="hp-exit" onClick={close} aria-label="Закрыть раскладушку"><X size={20}/></button>
    {secretFound&&isBlocked&&<aside className="hp-number-notes" aria-label="Сохранённые номера">
      <span className="hp-notes-heading">НАЙДЕННЫЕ НОМЕРА</span>
      <div className="hp-number-note">
       <small>WARLOCK · PRIVATE</small>
       <strong>27 04<br/>20 07</strong>
       <span>Натаниэль<br/>Говард</span>
      </div>
     </aside>}
    <div className="hp-phone">
     <button type="button" className="hp-upper" onClick={close} aria-label="Сложить телефон">
      <span className="hp-earpiece"/>
      <div className="hp-screen">
       <div className="hp-status"><span>▂▄▆</span><span>SF · 27</span><span>▰▰▰</span></div>
       <div className="hp-screen-body">
        {mode==='secret-idle'||mode==='secret-wrong'?<><span className="hp-screen-kicker">НАБОР НОМЕРА</span><strong className="hp-dial-display">{dial||'________'}</strong><small>{mode==='secret-wrong'?'НОМЕР НЕ НАЙДЕН':'ВВЕДИТЕ НОМЕР СО СТИКЕРА'}</small></>:mode==='secret-connecting'?<><span className="hp-screen-kicker">ИСХОДЯЩИЙ ВЫЗОВ</span><strong>{SECRET_NUMBER}</strong><strong className="hp-connecting">СОЕДИНЕНИЕ<span className="hp-dots"/></strong></>:mode==='secret-answer'?<><span className="hp-screen-kicker">НАТАНИЭЛЬ ГОВАРД</span><strong>{secretReply}</strong><small>ВЫЗОВ ЗАВЕРШЁН</small></>:mode==='blocked'?<><LockKeyhole size={31}/><strong>КОНТАКТ<br/>ЗАБЛОКИРОВАН</strong><small>WARLOCK INDUSTRIES</small></>:
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
       <button type="button" className="hp-answer" onClick={isBlocked&&secretFound?callSecret:call} aria-label={mode==='incoming'?'Ответить на звонок':'Позвонить ещё раз'} disabled={mode==='blocked'||mode==='final'||mode==='mistake'||mode==='secret-connecting'}><Phone size={20}/></button>
       <span className="hp-dpad"><span>▲</span><span>◀ ● ▶</span><span>▼</span></span>
       <button type="button" className="hp-hang" onClick={hang} aria-label="Сбросить звонок"><PhoneOff size={19}/></button>
      </div>
      <div className="hp-keys">{['1','2 ABC','3 DEF','4 GHI','5 JKL','6 MNO','7 PQRS','8 TUV','9 WXYZ','*','0 +','#'].map(k=><button type="button" key={k} onClick={()=>{if(isBlocked&&secretFound)pressKey(k);else if(mode==='idle')setMode('incoming')}}>{k}</button>)}</div>
      {isBlocked&&secretFound&&<button type="button" className="hp-clear-dial" onClick={()=>{setDial('');setMode('secret-idle')}}>СБРОСИТЬ НОМЕР</button>}<span className="hp-bottom-mark">MOTOR / SF EDITION</span>
     </div>
    </div>
    <div className="hp-caption">{mode.startsWith('secret-')?'Личный номер. Говард явно не ожидал этого звонка.':mode==='blocked'?'Натаниэль Говард заблокировал ваш номер.':mode==='final'?'Достижение открыто: «ГОВАРД ЗАБЛОКИРОВАЛ ВАС»':mode==='incoming'?'Неизвестный номер. Ответить на вызов?':mode==='mistake'?'Звонок оборвался. Но номер остался в журнале.':progress.missed&&!progress.introDone?'1 пропущенный вызов. Номер сохранился. Может, перезвоним?':'Можно попробовать перезвонить.'}</div>
    {(mode==='answer'||mode==='idle'||mode==='mistake')&&<button type="button" className="hp-redial" onClick={()=>{if(mode==='mistake'){setMode('idle')}else{call()}}}>ПОЗВОНИТЬ ЕЩЁ РАЗ ↗</button>}
    {mode==='secret-answer'&&<button type="button" className="hp-redial" onClick={()=>setMode('secret-idle')}>ПОЗВОНИТЬ СНОВА ↗</button>}
    {mode==='final'&&<button type="button" className="hp-redial" onClick={close}>ЗАКРЫТЬ ТЕЛЕФОН ↗</button>}
   </div>
  </div>}
 </>
}
