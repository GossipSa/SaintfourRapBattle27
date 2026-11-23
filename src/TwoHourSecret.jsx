import {useEffect,useRef,useState} from 'react'
import {Clock3,X,Trophy} from 'lucide-react'
import './TwoHourSecret.css'
const KEY='sf27-two-hour-resident-v1'
const DURATION=120*60*1000
export default function TwoHourSecret(){
 const preview=new URLSearchParams(window.location.search).get('previewTwoHours')==='1'
 const [earned,setEarned]=useState(()=>{try{return localStorage.getItem(KEY)==='1'}catch{return false}})
 const [open,setOpen]=useState(preview)
 const started=useRef(null)
 useEffect(()=>{
  if(earned||preview)return
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
 },[earned,preview])
 if(!open)return null
 return <div className="two-hour-backdrop" role="presentation"><section className="two-hour-dialog" role="dialog" aria-modal="true" aria-labelledby="two-hour-title" aria-describedby="two-hour-description">
  <div className="two-hour-header"><span className="two-hour-kicker">◉ GOSSIP SAINTFOUR</span><span className="two-hour-private">PRIVATE MESSAGE · 02:00:00 {preview?'· PREVIEW':''}</span></div>
  <button className="two-hour-close" type="button" aria-label="Закрыть" onClick={()=>setOpen(false)}><X size={19}/></button>
  <h2 id="two-hour-title">Серьёзно?</h2>
  <div id="two-hour-description" className="two-hour-story">
   <p>Два часа.</p>
   <p>Ты уже два часа сидишь на этом сайте.</p>
   <p>Я, конечно, подозревала, что у жителей Сентфора слишком много свободного времени, но ты, кажется, решил побить все рекорды.</p>
   <p>Что ты здесь ищешь? Компромат на Говарда? Очередную тупую выходку Декса? Или надеешься, что я где-нибудь случайно оставила что-то интересное?</p>
   <p>Хотя знаешь, что самое смешное?</p>
   <p className="two-hour-highlight">Сентфора не существует.</p>
   <p>Ни этих батлов, ни интервью, ни всей этой драмы.</p>
   <p>А ты всё равно провёл здесь два часа.</p>
   <p>…</p>
   <p>Ладно, кого я обманываю.</p>
   <p>Я ведь потратила на всё это гораздо больше времени. Придумывала, переделывала, прятала всякую ерунду по углам сайта в надежде, что кто-нибудь однажды её заметит.</p>
   <p>И, кажется, кто-то действительно заметил.</p>
   <p>Так что нет, я не буду говорить тебе потрогать траву.</p>
   <p className="two-hour-highlight">Мне просто приятно, что ты здесь.</p>
   <p>Только никому не рассказывай. У меня вообще-то репутация.</p>
  </div>
  <div className="two-hour-signature">— твоя Сплетница Сентфора ♡</div>
  <div className="two-hour-award"><Trophy size={28}/><div><small>SECRET ACHIEVEMENT UNLOCKED</small><strong>ПО ТУ СТОРОНУ ЭКРАНА</strong><span>120 минут. Один непрерывный сеанс. Один маленький секрет между нами.</span></div></div>
  <button className="two-hour-confirm" type="button" onClick={()=>setOpen(false)}>СЕКРЕТ ОСТАНЕТСЯ МЕЖДУ НАМИ</button>
 </section></div>
}
