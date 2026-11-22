import { useEffect, useRef, useState } from 'react'
import './shake-can.css'

const canImage=`${import.meta.env.BASE_URL}media/sponsors/black-hellebore-can.webp?v=3`
const shakeKey='sf27-hellebore-shakes-v1'
const bonusCode='SHAKE10GET0'
const readShakes=()=>{
 try{return Math.min(10,Math.max(0,Number(window.localStorage.getItem(shakeKey))||0))}
 catch{return 0}
}
const drops=Array.from({length:30},(_,i)=>{
 const angle=i*2.39996
 const spread=32+(i%6)*15
 return {x:Math.round(Math.cos(angle)*spread),y:Math.round(Math.sin(angle)*spread*.72-25),size:4+(i%5)*3,delay:(i%5)*25,duration:640+(i%4)*115}
})
export default function ShakeCan({onBonusUnlock,bonusUnlocked=false}){
 const [opening,setOpening]=useState(false)
 const [burst,setBurst]=useState(0)
 const [shakes,setShakes]=useState(readShakes)
 const [rewardOpen,setRewardOpen]=useState(false)
 const [copied,setCopied]=useState(false)
 const timer=useRef(null)
 useEffect(()=>()=>window.clearTimeout(timer.current),[])
 useEffect(()=>{if(!rewardOpen)return undefined;const onKey=e=>{if(e.key==='Escape')setRewardOpen(false)};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[rewardOpen])
 const open=()=>{
  const next=Math.min(10,shakes+1)
  if(!bonusUnlocked&&shakes<10){
   setShakes(next)
   try{window.localStorage.setItem(shakeKey,String(next))}catch{/* local mode */}
   if(next===10){
    onBonusUnlock?.()
    setCopied(false)
    setRewardOpen(true)
   }
  }
  if(opening)return
  setOpening(true)
  setBurst(v=>v+1)
  window.clearTimeout(timer.current)
  timer.current=window.setTimeout(()=>setOpening(false),1400)
 }
 return <div className="hellebore-toy" aria-label="Интерактивная банка BLACK HELLEBORE ENERGY">
  <div className="hellebore-toy-stage">
   <span className="hellebore-toy-series">BLACK HELLEBORE / ENERGY</span>
   <span className="hellebore-toy-floor" aria-hidden="true"/>
   <button type="button" onClick={open} className={'hellebore-toy-button'+(opening?' is-opening':'')} aria-label="Встряхнуть и открыть банку BLACK HELLEBORE ENERGY">
    <img src={canImage} alt="Фиолетовая банка BLACK HELLEBORE ENERGY" loading="lazy" draggable="false"/>
    {opening&&<span className="hellebore-toy-fizz" aria-hidden="true"/>}
   </button>
   <div className="hellebore-toy-caption"><strong>{opening?'PSHHH!':'SHAKE IT.'}</strong><span>{opening?'BLACK HELLEBORE ENERGY':'Нажми на банку'}</span>{(bonusUnlocked||shakes===10)&&<button className="hellebore-bonus-reopen" type="button" onClick={()=>setRewardOpen(true)}>ТВОЙ ПРОМОКОД ↗</button>}</div>
  </div>
  {rewardOpen&&<div className="hellebore-bonus-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setRewardOpen(false)}}>
    <section className="hellebore-bonus-modal" role="dialog" aria-modal="true" aria-labelledby="hellebore-bonus-title">
     <button className="hellebore-bonus-close" onClick={()=>setRewardOpen(false)} aria-label="Закрыть награду">×</button>
     <span className="hellebore-bonus-kicker">BLACK HELLEBORE / BONUS ACHIEVEMENT 006</span>
     <span className="hellebore-bonus-symbol" aria-hidden="true">⚡</span>
     <h2 id="hellebore-bonus-title">SHAKE <em>RESPONSIBLY.</em></h2>
     <p>Ты встряхнул банку десять раз. Производитель просит больше так не делать.</p>
     <span className="hellebore-bonus-code-label">ТВОЙ ЭКСКЛЮЗИВНЫЙ ПРОМОКОД</span>
     <div className="hellebore-bonus-code">{bonusCode}</div>
     <p className="hellebore-bonus-fineprint">Скидка 0%. Зато бесплатные брызги уже включены. Промокод шуточный и не действует в магазинах.</p>
     <button className="hellebore-bonus-copy" type="button" onClick={()=>{navigator.clipboard?.writeText(bonusCode).then(()=>setCopied(true)).catch(()=>setCopied(false))}}>{copied?'СКОПИРОВАНО ✓':'СКОПИРОВАТЬ ПРОМОКОД'}</button>
    </section>
   </div>}
  {opening&&<div className="hellebore-splatter" key={burst} aria-hidden="true">
    <div className="hellebore-splatter-wash"/>
    {drops.map((d,i)=><i key={i} className="hellebore-splatter-drop" style={{'--dx':`${d.x}vw`,'--dy':`${d.y}vh`,'--sz':`${d.size}px`,'--delay':`${d.delay}ms`,'--dur':`${d.duration}ms`}}/>)}
   </div>}
 </div>
}
