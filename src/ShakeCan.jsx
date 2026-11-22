import { useEffect, useRef, useState } from 'react'
import './shake-can.css'

const canImage=`${import.meta.env.BASE_URL}media/sponsors/black-hellebore-can.webp`
const drops=Array.from({length:30},(_,i)=>{
 const angle=i*2.39996
 const spread=32+(i%6)*15
 return {x:Math.round(Math.cos(angle)*spread),y:Math.round(Math.sin(angle)*spread*.72-25),size:4+(i%5)*3,delay:(i%5)*25,duration:640+(i%4)*115}
})
export default function ShakeCan(){
 const [opening,setOpening]=useState(false)
 const [burst,setBurst]=useState(0)
 const timer=useRef(null)
 useEffect(()=>()=>window.clearTimeout(timer.current),[])
 const open=()=>{
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
   <div className="hellebore-toy-caption"><strong>{opening?'PSHHH!':'SHAKE IT.'}</strong><span>{opening?'BLACK HELLEBORE ENERGY':'Нажми на банку'}</span></div>
  </div>
  {opening&&<div className="hellebore-splatter" key={burst} aria-hidden="true">
    <div className="hellebore-splatter-wash"/>
    {drops.map((d,i)=><i key={i} className="hellebore-splatter-drop" style={{'--dx':`${d.x}vw`,'--dy':`${d.y}vh`,'--sz':`${d.size}px`,'--delay':`${d.delay}ms`,'--dur':`${d.duration}ms`}}/>)}
   </div>}
 </div>
}
