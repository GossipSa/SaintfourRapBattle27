import { useEffect, useState } from 'react'
import { CheckCircle2, LockKeyhole, Sparkles, Ticket, X } from 'lucide-react'
import './all-access-ticket.css'

function ticketNumber(){
 try{
  const key='sf27-collection-pass-v1'
  let value=window.localStorage.getItem(key)
  if(!value){
   const num=window.crypto?.getRandomValues?.(new Uint32Array(1))[0] ?? Math.floor(Math.random()*4294967295)
   value='SF27-'+num.toString(36).toUpperCase().padStart(7,'0').slice(-7)
   window.localStorage.setItem(key,value)
  }
  return value
 }catch{return 'SF27-COLLECTOR'}
}

export default function AllAccessTicket({onClose}){
 const [number]=useState(ticketNumber)
 useEffect(()=>{
  const previous=document.body.style.overflow
  document.body.style.overflow='hidden'
  const onKey=(event)=>{if(event.key==='Escape')onClose()}
  window.addEventListener('keydown',onKey)
  return ()=>{document.body.style.overflow=previous;window.removeEventListener('keydown',onKey)}
 },[onClose])
 return <div className="allticket-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
  <section className="allticket-modal" role="dialog" aria-modal="true" aria-labelledby="allticket-title">
   <div className="allticket-header"><span><CheckCircle2 size={15}/> COLLECTION COMPLETE / 05 OF 05</span><button type="button" onClick={onClose} aria-label="Закрыть билет"><X size={19}/></button></div>
   <div className="allticket-page">
    <div className="allticket-paper">
     <div className="allticket-paper-left">
      <span className="allticket-overline">GOSSIP SAINTFOUR PRESENTS <Sparkles size={14}/></span>
      <span className="allticket-brand">SAINTFOUR<br/><b>RAP BATTLE <em>’27</em></b></span>
      <h2 id="allticket-title">ALL ACCESS<br/><em>TICKET.</em></h2>
      <span className="allticket-sub">COLLECTOR'S EDITION / FOUND ALL FIVE</span>
      <div className="allticket-meta"><div><small>HOLDER</small><strong>THE FIFTH GUEST</strong></div><div><small>ACCESS</small><strong>BACKSTAGE / 005</strong></div><div><small>SERIAL</small><strong>{number}</strong></div></div>
     </div>
     <div className="allticket-paper-right"><Ticket size={34} strokeWidth={1.2}/><strong>05/05</strong><small>ALL ACHIEVEMENTS<br/>UNLOCKED</small><div className="allticket-code" aria-hidden="true">✳<br/>SF</div></div>
    </div>
    <div className="allticket-below"><p><strong>Ты собрал всю коллекцию.</strong> Этот билет — твой знак отличия за исследование каждого уголка шоу. Он останется доступным в разделе достижений этого браузера.</p><small>Цифровой коллекционный сувенир. Не является пропуском на платное мероприятие.</small></div>
   </div>
   <div className="allticket-bottom"><button type="button" className="allticket-dismiss" onClick={onClose}>ЗАКРЫТЬ БИЛЕТ <X size={14}/></button></div>
  </section>
 </div>
}
