import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, RotateCcw, Send, LockKeyhole } from 'lucide-react'
import './graffiti-wall.css'

const KEY='sf27-graffiti-drafts-v1'
const COLORS=['#f04495','#a77bff','#9bff65','#ff514f','#dfb77e','#0b0b12','#fff4df','#4ab9ff','#b44cff']
const START=[
 {color:'#dfb77e',width:8,points:[[.09,.18],[.11,.17],[.13,.19],[.16,.16],[.19,.18]]},
 {color:'#a77bff',width:7,points:[[.67,.23],[.69,.20],[.72,.22],[.75,.19],[.78,.22],[.81,.18]]},
 {color:'#f04495',width:6,points:[[.29,.72],[.32,.68],[.35,.73],[.38,.67],[.42,.71]]}
]
function randomColor(){return COLORS[Math.floor(Math.random()*COLORS.length)]}
function read(){try{const a=JSON.parse(localStorage.getItem(KEY));return Array.isArray(a)?a.slice(-300):[]}catch{return []}}
function draw(ctx,stroke,w,h){const p=stroke.points;if(!p?.length)return;ctx.strokeStyle=stroke.color;ctx.lineWidth=stroke.width;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(p[0][0]*w,p[0][1]*h);for(let i=1;i<p.length;i++)ctx.lineTo(p[i][0]*w,p[i][1]*h);if(p.length===1)ctx.lineTo(p[0][0]*w+.1,p[0][1]*h+.1);ctx.stroke()}
export default function GraffitiWall({onBack}){
 const canvas=useRef(null),active=useRef(null),strokesRef=useRef([])
 const [strokes,setStrokes]=useState(read),[draft,setDraft]=useState([]),[color,setColor]=useState(randomColor),[width,setWidth]=useState(6),[notice,setNotice]=useState('')
 useEffect(()=>{strokesRef.current=strokes},[strokes])
 useEffect(()=>{
  const c=canvas.current;if(!c)return
  const paint=()=>{const box=c.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);c.width=Math.round(box.width*dpr);c.height=Math.round(box.height*dpr);const ctx=c.getContext('2d');ctx.scale(dpr,dpr);ctx.clearRect(0,0,box.width,box.height);[...START,...strokes,...draft].forEach(s=>draw(ctx,s,box.width,box.height))}
  paint();const observer=new ResizeObserver(paint);observer.observe(c);return()=>observer.disconnect()
 },[strokes,draft])
 const point=e=>{const rect=canvas.current.getBoundingClientRect();return [Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width)),Math.max(0,Math.min(1,(e.clientY-rect.top)/rect.height))]}
 const down=e=>{e.preventDefault();canvas.current.setPointerCapture(e.pointerId);active.current={color,width,points:[point(e)]};setDraft(d=>[...d,active.current])}
 const move=e=>{if(!active.current)return;const p=point(e);active.current={...active.current,points:[...active.current.points,p]};setDraft(d=>[...d.slice(0,-1),active.current])}
 const up=()=>{active.current=null}
 const publish=()=>{if(!draft.length)return;const next=[...strokesRef.current,...draft].slice(-300);try{localStorage.setItem(KEY,JSON.stringify(next))}catch{setNotice('Не удалось сохранить рисунок в этом браузере.')}setStrokes(next);setDraft([]);setColor(randomColor());setNotice('След сохранён в этом браузере. Общую стену подключим отдельно.')}
 return <section className="graffiti-page wrap">
  <div className="graffiti-back"><button onClick={onBack}><ArrowLeft size={16}/> НАЗАД</button><span>SAINTFOUR / UNDERGROUND</span></div>
  <header className="graffiti-heading"><span>NO RULES / JUST MARKS</span><h1>THE <em>WALL.</em></h1><p>Одна кирпичная стена. Новые граффити поверх старых. Твой цвет выбирает случай.</p></header>
  <div className="graffiti-status"><span className="graffiti-live-dot"/> ПРОТОТИП / РИСУНКИ ПОКА ВИДНЫ ТОЛЬКО В ТВОЁМ БРАУЗЕРЕ</div>
  <div className="graffiti-bricks"><div className="graffiti-wall-noise"/><canvas ref={canvas} className="graffiti-canvas" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} aria-label="Полотно для граффити"/></div>
  <div className="graffiti-controls"><div className="graffiti-can"><span style={{background:color}}/><div><small>ТВОЙ СЛУЧАЙНЫЙ ЦВЕТ</small><strong>{color.toUpperCase()}</strong></div></div><label className="graffiti-size">ТОЛЩИНА <input type="range" min="3" max="18" value={width} onChange={e=>setWidth(Number(e.target.value))}/></label><button type="button" className="graffiti-undo" onClick={()=>setDraft(d=>d.slice(0,-1))} disabled={!draft.length}><RotateCcw size={16}/> ОТМЕНИТЬ ШТРИХ</button><button type="button" className="graffiti-publish" onClick={publish} disabled={!draft.length}><Send size={16}/> ОСТАВИТЬ СЛЕД</button></div>
  {notice&&<p className="graffiti-notice" role="status">{notice}</p>}
  <p className="graffiti-disclaimer"><LockKeyhole size={14}/> После сохранения ластика нет. Пока это локальный тест: другие посетители не увидят твой рисунок до подключения общей базы.</p>
 </section>
}
