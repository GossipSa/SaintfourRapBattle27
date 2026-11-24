import { useEffect, useRef, useState } from 'react'
import { X, MessageCircle, Mail, ShieldAlert, Zap, Eye, ImageOff } from 'lucide-react'
import './SaintfourNotifications.css'
import { acquireAmbient, releaseAmbient, ambientElapsed, ambientRandom } from './ambient-timing.js'

const messages=[
 {from:'POPPY EMERSON',kind:'message',title:'Кто-нибудь видел организатора?',body:'Мне нужно согласовать следующий выпуск. Желательно до его выхода.',action:'ОТВЕТИТЬ',reply:'POPPY: Отлично. Тогда найдите его и передайте, что я жду.',ttl:16000},
 {from:'LIL DEX',kind:'message',title:'Если кто-то спросит —',body:'Я здесь не был.',action:'ЧТО ТЫ НАТВОРИЛ?',reply:'DEX: Слишком много вопросов.',ttl:16000},
 {from:'SHERIFF WILSON',kind:'sheriff',title:'Ваше присутствие зафиксировано.',body:'Это не повод для паники. Пока.',ttl:8500},
 {from:'SHERIFF WILSON',kind:'sheriff',title:'Служебное уведомление',body:'Пожалуйста, не подавайте жалобы ради развлечения.',ttl:10000},
 {from:'BLACK HELLEBORE ENERGY',kind:'energy',title:'Вы выглядите уставшим.',body:'Совпадение? Не думаем.',ttl:8500},
 {from:'BLACK HELLEBORE ENERGY',kind:'energy',title:'ЕЩЁ НЕ СПИТЕ?',body:'Мы тоже. По совершенно другим причинам.',ttl:8000},
 {from:'UNKNOWN',kind:'unknown',title:'Вы всё ещё здесь?',body:'',ttl:5500},
 {from:'UNKNOWN',kind:'unknown',title:'Не всё предназначено для просмотра.',body:'Сообщение будет удалено.',ttl:6500},
 {from:'MC NETTI',kind:'typing',title:'MC NETTI печатает…',body:'',ttl:4500},
 {from:'SYSTEM',kind:'message',title:'Новое сообщение',body:'Отправитель отменил отправку.',ttl:7000},
]
const store='sf27-ambient-notification-history-v2'
const between=(min,max)=>min+Math.floor(Math.random()*(max-min+1))
function readHistory(){try{const v=JSON.parse(localStorage.getItem(store)||'{}');return {shown:Array.isArray(v.shown)?v.shown:[],last:Number.isInteger(v.last)?v.last:-1}}catch{return {shown:[],last:-1}}}
function choose(history){let available=messages.map((_,i)=>i).filter(i=>!history.shown.includes(i));if(!available.length)available=messages.map((_,i)=>i).filter(i=>i!==history.last);const i=available[Math.floor(Math.random()*available.length)];const next={shown:[...history.shown,i].slice(-messages.length),last:i};try{localStorage.setItem(store,JSON.stringify(next))}catch{/* storage unavailable */}return {index:i,next}}
const icons={message:MessageCircle,attachment:ImageOff,sheriff:ShieldAlert,energy:Zap,unknown:Eye,typing:Mail}
export default function SaintfourNotifications({suppressed=false,enabled=false}){
 const [active,setActive]=useState(null)
 const [expanded,setExpanded]=useState(false)
 const history=useRef(readHistory())
 const busy=useRef(false)
 const suppressedRef=useRef(suppressed)
 const enabledRef=useRef(enabled)
 const dismissTimer=useRef(null)
 useEffect(()=>{suppressedRef.current=suppressed},[suppressed])
 useEffect(()=>{enabledRef.current=enabled},[enabled])
 useEffect(()=>{
  // Once Howard's first block is complete, launch the ambient sequence on every visit.
  // Due times are never reset when the visitor opens a modal or another popup.
  if(!enabled)return undefined
  let first=true
  let due=ambientElapsed()+ambientRandom(30000,60000)
  const timer=window.setInterval(()=>{
   if(!enabledRef.current||ambientElapsed()<due||suppressedRef.current||busy.current)return
   if(!acquireAmbient('messages'))return
   const chosen=choose(history.current)
   history.current=chosen.next
   busy.current=true
   setExpanded(false)
   setActive({id:chosen.index,...messages[chosen.index]})
   if(first){
    first=false
    window.dispatchEvent(new Event('sf27-first-ambient-message'))
   }
   // Next message is due 2–4 active minutes after this one.
   due=ambientElapsed()+ambientRandom(120000,240000)
  },1000)
  return()=>{window.clearInterval(timer);window.clearTimeout(dismissTimer.current);busy.current=false;releaseAmbient('messages')}
 },[enabled])
 useEffect(()=>{
  if(!active)return
  clearTimeout(dismissTimer.current)
  dismissTimer.current=window.setTimeout(()=>{setActive(null);setExpanded(false);busy.current=false;releaseAmbient('messages')},expanded?6500:active.ttl)
  return()=>clearTimeout(dismissTimer.current)
 },[active,expanded])
 useEffect(()=>{if((suppressed||!enabled)&&active){setActive(null);setExpanded(false);busy.current=false;releaseAmbient('messages')}},[suppressed,enabled,active])
 if(!active)return null
 const Icon=icons[active.kind]||MessageCircle
 const close=()=>{setActive(null);setExpanded(false);busy.current=false;releaseAmbient('messages')}
 return <aside className={'sf-notification sf-notification--'+active.kind} role="status" aria-live="polite">
  <div className="sf-notification-top"><span><Icon size={14}/> {active.from} / INBOX</span><button type="button" aria-label="Закрыть уведомление" onClick={close}><X size={16}/></button></div>
  <strong>{expanded?active.reply:active.title}</strong>
  {!expanded&&active.body&&<p>{active.body}</p>}
  {!expanded&&active.action&&<button type="button" className="sf-notification-action" onClick={()=>setExpanded(true)}>{active.action} ↗</button>}
  {active.kind==='typing'&&<span className="sf-notification-typing" aria-label="Печатает"><i/><i/><i/></span>}
  <small>{expanded?'СООБЩЕНИЕ ПОЛУЧЕНО':active.action?'НАЖМИТЕ, ЧТОБЫ ОТВЕТИТЬ':'УВЕДОМЛЕНИЕ ИСЧЕЗНЕТ АВТОМАТИЧЕСКИ'}</small>
 </aside>
}
