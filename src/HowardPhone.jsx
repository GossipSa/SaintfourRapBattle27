import { useEffect, useState } from 'react'
import { Phone, PhoneOff, X, LockKeyhole } from 'lucide-react'
import './HowardPhone.css'

const STORE='sf27-howard-phone-v1'
const lines=[
 'Откуда у вас этот номер?',
 'Я занят. Не звоните сюда.',
 'Я сказал: НЕ ЗВОНИТЕ.',
 'Это служебный номер. Последнее предупреждение.',
 'КТО ДАЛ ВАМ МОЙ НОМЕР?!',
]
function getCalls(){try{return Math.min(5,Math.max(0,Number(localStorage.getItem(STORE))||0))}catch{return 0}}
export default function HowardPhone({onBlocked}){
 const [visible,setVisible]=useState(false)
 const [opened,setOpened]=useState(false)
 const [calls,setCalls]=useState(getCalls)
 const [mode,setMode]=useState('incoming')
 const [dismissed,setDismissed]=useState(false)
 useEffect(()=>{
  if(sessionStorage.getItem('sf27-howard-seen'))return
  const t=window.setTimeout(()=>{
   if(document.visibilityState==='visible'){setVisible(true);sessionStorage.setItem('sf27-howard-seen','1')}
  },20000+Math.round(Math.random()*20000))
  return()=>clearTimeout(t)
 },[])
 useEffect(()=>{
  if(!opened)return
  const key=e=>{if(e.key==='Escape'){setOpened(false);setMode('incoming')}}
  document.addEventListener('keydown',key)
  return()=>document.removeEventListener('keydown',key)
 },[opened])
 const open=()=>{setOpened(true);setMode(calls>=5?'blocked':'incoming')}
 const call=()=>{
  if(calls>=5){setMode('blocked');return}
  const next=calls+1
  setCalls(next)
  try{localStorage.setItem(STORE,String(next))}catch{/* storage disabled */}
  setMode(next===5?'final':'answer')
  if(next===5)onBlocked?.()
 }
 const hang=()=>{setMode(calls>=5?'blocked':'idle')}
 const close=()=>{setOpened(false);setMode('incoming')}
 const dismiss=()=>{setDismissed(true);setVisible(false);close()}
 if(!visible||dismissed)return null
 return <>
  {!opened&&<div className="hp-floating">
    <button type="button" className="hp-closed" onClick={open} aria-label="Открыть звонящую фиолетовую раскладушку">
     <span className="hp-closed-hinge"/><span className="hp-closed-logo">M</span><span className="hp-closed-display"><Phone size={20}/><small>{calls>=5?'BLOCKED':'INCOMING'}</small></span><span className="hp-closed-led"/>
    </button>
    <button type="button" className="hp-dismiss" aria-label="Убрать телефон" onClick={dismiss}><X size={15}/></button>
   </div>}
  {opened&&<div className="hp-overlay" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)close()}}>
   <div className="hp-window" role="dialog" aria-modal="true" aria-label="Телефон Натаниэля Говарда">
    <button type="button" className="hp-exit" onClick={close} aria-label="Закрыть раскладушку"><X size={20}/></button>
    <div className="hp-phone">
     <button type="button" className="hp-upper" onClick={close} aria-label="Сложить телефон">
      <span className="hp-earpiece"/>
      <div className="hp-screen">
       <div className="hp-status"><span>▂▄▆</span><span>SF · 27</span><span>▰▰▰</span></div>
       <div className="hp-screen-body">
        {mode==='blocked'?<><LockKeyhole size={31}/><strong>КОНТАКТ<br/>ЗАБЛОКИРОВАН</strong><small>WARLOCK INDUSTRIES</small></>:
         mode==='final'?<><span className="hp-screen-kicker">НАТАНИЭЛЬ ГОВАРД</span><strong className="hp-angry">{lines[4]}</strong><small>ВЫЗОВ ЗАВЕРШЁН</small></>:
         mode==='answer'?<><span className="hp-screen-kicker">НАТАНИЭЛЬ ГОВАРД</span><strong>{lines[calls-1]}</strong><small>СОЕДИНЕНИЕ ПРЕРВАНО</small></>:
         mode==='idle'?<><PhoneOff size={27}/><strong>ВЫЗОВ ЗАВЕРШЁН</strong><small>НАБЕРИТЕ ЕЩЁ РАЗ</small></>:
         <><span className="hp-screen-kicker">ВХОДЯЩИЙ ВЫЗОВ</span><Phone className="hp-ring" size={29}/><strong>Натаниэль<br/>Говард</strong><small>НЕИЗВЕСТНЫЙ НОМЕР</small></>}
       </div>
       <div className="hp-screen-bottom"><span>{mode==='incoming'?'ANSWER':'SAINTFOUR'}</span><span>{mode==='incoming'?'DECLINE':'27 / 27'}</span></div>
      </div>
      <span className="hp-upper-mark">SAINTFOUR TELECOM</span>
     </button>
     <div className="hp-joint"><span/></div>
     <div className="hp-lower">
      <div className="hp-actions">
       <button type="button" className="hp-answer" onClick={call} aria-label={mode==='incoming'?'Ответить на звонок':'Позвонить ещё раз'} disabled={mode==='blocked'||mode==='final'}><Phone size={20}/></button>
       <span className="hp-dpad"><span>▲</span><span>◀ ● ▶</span><span>▼</span></span>
       <button type="button" className="hp-hang" onClick={hang} aria-label="Сбросить звонок"><PhoneOff size={19}/></button>
      </div>
      <div className="hp-keys">{['1','2 ABC','3 DEF','4 GHI','5 JKL','6 MNO','7 PQRS','8 TUV','9 WXYZ','*','0 +','#'].map(k=><button type="button" key={k} onClick={()=>{if(mode==='idle')setMode('incoming')}}>{k}</button>)}</div>
      <span className="hp-bottom-mark">MOTOR / SF EDITION</span>
     </div>
    </div>
    <div className="hp-caption">{mode==='blocked'?'Натаниэль Говард заблокировал ваш номер.':mode==='final'?'Достижение открыто: «ГОВАРД ЗАБЛОКИРОВАЛ ВАС»':mode==='incoming'?'Ответьте на вызов. Или сделайте вид, что вас нет.':'Нажмите зелёную кнопку, чтобы снова ему позвонить.'}</div>
    {mode==='answer'||mode==='idle'?<button type="button" className="hp-redial" onClick={()=>setMode('incoming')}>ПОЗВОНИТЬ ЕЩЁ РАЗ ↗</button>:null}
    {mode==='final'&&<button type="button" className="hp-redial" onClick={()=>setMode('blocked')}>ПОСМОТРЕТЬ ЧЁРНЫЙ СПИСОК ↗</button>}
   </div>
  </div>}
 </>
}
