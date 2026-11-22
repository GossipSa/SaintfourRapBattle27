import { useEffect, useState } from 'react'
import { CheckCircle2, Download, RotateCcw, Sparkles, Ticket, X } from 'lucide-react'
import './all-access-ticket.css'

const collected=['EARLY BIRD','THE LOYAL ONE','SIDE EFFECT',"WHO'S WATCHING?",'THE FIFTH CHAIR']
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
function exportTicket(number){
 // Draw both sides into one independent, shareable PNG, including on mobile.
 const W=1200,H=680,pad=36
 const canvas=document.createElement('canvas')
 canvas.width=W+pad*2
 canvas.height=H*2+pad*3
 const ctx=canvas.getContext('2d')
 if(!ctx)return
 const rect=(x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(x,y,w,h)}
 const type=(text,x,y,size=25,color='#f7dffb',weight='700',family='Arial')=>{
  ctx.font=`${weight} ${size}px ${family}`;ctx.fillStyle=color;ctx.fillText(text,x,y)
 }
 const panel=(y)=>{
  const g=ctx.createLinearGradient(pad,y,pad+W,y+H)
  g.addColorStop(0,'#43284e');g.addColorStop(.65,'#24172d');g.addColorStop(1,'#3d2149')
  rect(pad,y,W,H,g)
  ctx.lineWidth=3;ctx.strokeStyle='#e1a8e5';ctx.strokeRect(pad+2,y+2,W-4,H-4)
  for(let i=0;i<8;i++){ctx.fillStyle='rgba(235,155,236,.08)';ctx.beginPath();ctx.arc(pad+W-90-i*45,y+100+i*55,95-i*8,0,Math.PI*2);ctx.fill()}
  ctx.setLineDash([10,12]);ctx.beginPath();ctx.moveTo(pad+930,y+28);ctx.lineTo(pad+930,y+H-28);ctx.strokeStyle='#d59fdf';ctx.stroke();ctx.setLineDash([])
 }
 const y1=pad,y2=H+pad*2
 rect(0,0,canvas.width,canvas.height,'#100b16')
 panel(y1)
 type('GOSSIP SAINTFOUR PRESENTS',pad+60,y1+85,22,'#ddaee5')
 type('SAINTFOUR',pad+60,y1+160,55,'#fff4ff','900')
 type("RAP BATTLE '27",pad+60,y1+202,29,'#e2a1e7')
 type('ALL ACCESS',pad+60,y1+336,85,'#fff3ff','900')
 type('TICKET.',pad+60,y1+421,85,'#f1a8d9','900')
 type("COLLECTOR'S EDITION / FOUND ALL FIVE",pad+60,y1+475,22,'#d2b2df')
 type('HOLDER',pad+60,y1+551,18,'#b79cc4')
 type('THE FIFTH GUEST',pad+60,y1+584,24)
 type('SERIAL',pad+465,y1+551,18,'#b79cc4')
 type(number,pad+465,y1+584,24)
 type('05',pad+992,y1+269,120,'#ffcbef','900')
 type('/ 05',pad+1000,y1+319,35,'#ffcbef')
 type('ALL UNLOCKED',pad+962,y1+395,22,'#e6b6ef')
 panel(y2)
 type('SAINTFOUR / SECRET COLLECTION',pad+55,y2+78,23,'#dfabe8')
 type('FIVE SECRETS.',pad+55,y2+175,68,'#fff3ff','900')
 type('ONE VERY CURIOUS GUEST.',pad+55,y2+220,27,'#efacdf')
 for(let i=0;i<collected.length;i++){
  const y=y2+295+i*58
  type('✓',pad+65,y,27,'#edb5f2')
  type(String(i+1).padStart(2,'0')+'  /  '+collected[i],pad+115,y,29,'#f8e9fb')
 }
 type('Одобрено Сплетницей.',pad+60,y2+619,24,'#e2badf')
 type('Пенелопа Эмерсон отказалась комментировать.',pad+60,y2+648,19,'#bda4ca')
 type('05 / 05',pad+960,y2+337,48,'#ffc6ee','900')
 type('BACKSTAGE',pad+965,y2+380,22,'#e3b2e8')
 canvas.toBlob(blob=>{
  if(!blob)return
  const url=URL.createObjectURL(blob)
  const anchor=document.createElement('a')
  anchor.href=url;anchor.download=`SAINTFOUR-ALL-ACCESS-${number}.png`
  document.body.appendChild(anchor);anchor.click();anchor.remove()
  window.setTimeout(()=>URL.revokeObjectURL(url),2000)
 },'image/png')
}

export default function AllAccessTicket({onClose}){
 const [number]=useState(ticketNumber)
 const [side,setSide]=useState('front')
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
    <div className="allticket-switch" role="group" aria-label="Сторона коллекционного билета"><button type="button" className={side==='front'?'is-current':''} aria-pressed={side==='front'} onClick={()=>setSide('front')}>ЛИЦЕВАЯ / 01</button><button type="button" className={side==='back'?'is-current':''} aria-pressed={side==='back'} onClick={()=>setSide('back')}>ОБРАТНАЯ / 02</button></div>
    {side==='front'?<div key="front" className="allticket-paper">
     <div className="allticket-paper-left">
      <span className="allticket-overline">GOSSIP SAINTFOUR PRESENTS <Sparkles size={14}/></span>
      <span className="allticket-brand">SAINTFOUR<br/><b>RAP BATTLE <em>’27</em></b></span>
      <h2 id="allticket-title">ALL ACCESS<br/><em>TICKET.</em></h2>
      <span className="allticket-sub">COLLECTOR'S EDITION / FOUND ALL FIVE</span>
      <div className="allticket-meta"><div><small>HOLDER</small><strong>THE FIFTH GUEST</strong></div><div><small>ACCESS</small><strong>BACKSTAGE / VIP</strong></div><div><small>SERIAL</small><strong>{number}</strong></div></div>
     </div>
     <div className="allticket-paper-right"><Ticket size={34} strokeWidth={1.2}/><strong>05/05</strong><small>ALL ACHIEVEMENTS<br/>UNLOCKED</small><div className="allticket-code" aria-hidden="true">✳<br/>SF</div></div>
    </div>:<div key="back" className="allticket-paper allticket-paper-back">
     <div className="allticket-paper-left">
      <span className="allticket-overline">SAINTFOUR / SECRET COLLECTION <Sparkles size={14}/></span>
      <h2 id="allticket-title">FIVE <em>SECRETS.</em></h2>
      <span className="allticket-sub">ONE VERY CURIOUS GUEST / YOUR RECORD</span>
      <div className="allticket-stamps">{collected.map((name,i)=><div key={name}><CheckCircle2 size={17}/><strong>{String(i+1).padStart(2,'0')} / {name}</strong></div>)}</div>
      <p className="allticket-poppy-joke">«Одобрено Сплетницей. Пенелопа Эмерсон отказалась комментировать».</p>
     </div>
     <div className="allticket-paper-right"><CheckCircle2 size={34} strokeWidth={1.2}/><strong>05/05</strong><small>SECRET COLLECTION<br/>COMPLETE</small><div className="allticket-code" aria-hidden="true">✳<br/>SF</div></div>
    </div>}
    <button type="button" className="allticket-flip" onClick={()=>setSide(v=>v==='front'?'back':'front')}><RotateCcw size={16}/> ПЕРЕВЕРНУТЬ БИЛЕТ</button>
    <div className="allticket-below"><p><strong>Ты собрал всю коллекцию.</strong> Этот билет — твой знак отличия за исследование каждого уголка шоу. Сохрани обе стороны одним изображением и поделись им.</p><small>Цифровой коллекционный сувенир. Не является пропуском на платное мероприятие.</small></div>
   </div>
   <div className="allticket-bottom"><button type="button" className="allticket-save" onClick={()=>exportTicket(number)}><Download size={16}/> СОХРАНИТЬ PNG</button><button type="button" className="allticket-dismiss" onClick={onClose}>ЗАКРЫТЬ БИЛЕТ <X size={14}/></button></div>
  </section>
 </div>
}
