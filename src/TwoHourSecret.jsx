import {useEffect,useRef,useState} from 'react'
import {Clock3,X,Trophy} from 'lucide-react'
import './TwoHourSecret.css'
const KEY='sf27-two-hour-resident-v1'
const DURATION=120*60*1000
export default function TwoHourSecret(){
 const [earned,setEarned]=useState(()=>{try{return localStorage.getItem(KEY)==='1'}catch{return false}})
 const [open,setOpen]=useState(false)
 const started=useRef(null)
 useEffect(()=>{
  if(earned)return
  // A fresh page load starts a fresh uninterrupted session.
  started.current=document.visibilityState==='visible'?performance.now():null
  const check=()=>{
   if(document.visibilityState!=='visible'||started.current===null)return
   if(performance.now()-started.current>=DURATION){
    try{localStorage.setItem(KEY,'1')}catch{}
    setEarned(true)
    setOpen(true)
   }
  }
  const onVisibility=()=>{started.current=document.visibilityState==='visible'?performance.now():null}
  const onPageHide=()=>{started.current=null}
  document.addEventListener('visibilitychange',onVisibility)
  window.addEventListener('pagehide',onPageHide)
  const timer=window.setInterval(check,1000)
  return()=>{clearInterval(timer);document.removeEventListener('visibilitychange',onVisibility);window.removeEventListener('pagehide',onPageHide)}
 },[earned])
 if(!open)return null
 return <div className="two-hour-backdrop" role="presentation"><section className="two-hour-dialog" role="dialog" aria-modal="true" aria-labelledby="two-hour-title" aria-describedby="two-hour-description">
  <button className="two-hour-close" type="button" aria-label="Закрыть" onClick={()=>setOpen(false)}><X size={19}/></button>
  <span className="two-hour-kicker"><Clock3 size={14}/> SAINTFOUR SECURITY / ACTIVITY REPORT</span>
  <div className="two-hour-clock">02:00:00 <span>SESSION COMPLETE</span></div>
  <h2 id="two-hour-title">ТЫ ВСЁ ЕЩЁ <em>ЗДЕСЬ?</em></h2>
  <div id="two-hour-description" className="two-hour-story"><p>Два часа. Сто двадцать минут.</p><p>Поппи уже закончила интервью. Декс успел с кем-то поссориться. Говард трижды пожалел, что согласился участвовать в этом шоу.</p><p>А ты всё ещё здесь.</p><p>Мы не знаем, что именно ты ищешь. Но твою преданность невозможно игнорировать.</p></div>
  <div className="two-hour-award"><Trophy size={28}/><div><small>SECRET ACHIEVEMENT / UNLOCKED</small><strong>ПОСТОЯННЫЙ ЖИТЕЛЬ СЕНТФОРА</strong><span>120 минут непрерывно на сайте. Получено один раз.</span></div></div>
  <p className="two-hour-poppy">Поппи просит тебя хотя бы попить воды.</p>
  <button className="two-hour-confirm" type="button" onClick={()=>setOpen(false)}>ЛАДНО, ПОППИ. Я УСЛЫШАЛ.</button>
 </section></div>
}
