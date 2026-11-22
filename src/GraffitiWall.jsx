import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, RotateCcw, Send, LockKeyhole } from 'lucide-react'
import './graffiti-wall.css'

const KEY='sf27-graffiti-drafts-v1'
const COLORS=['#f04495','#a77bff','#9bff65','#ff514f','#dfb77e','#0b0b12','#fff4df','#4ab9ff','#b44cff']
const TAGS=[
 {text:'DEX WAS HERE',x:7,y:17,rotate:-8,size:9,color:'#f568ba'},
 {text:'WARLOCK SUCKS',x:39,y:28,rotate:5,size:8,color:'#a6ef59'},
 {text:'РУДИ, Я ТЕБЯ ЛЮБЛЮ',x:12,y:48,rotate:-5,size:6,color:'#f7dbf1'},
 {text:'MC NETTI?',x:62,y:55,rotate:11,size:8,color:'#d8b5ff'},
 {text:'NO RULES',x:4,y:79,rotate:7,size:10,color:'#fc765c'},
 {text:'LIL DEX',x:60,y:85,rotate:-9,size:11,color:'#f8a2c8'},
 {text:'POPPY KNOWS',x:48,y:10,rotate:-4,size:5,color:'#d6e85c'},
 {text:'SAINTFOUR 27',x:22,y:93,rotate:2,size:5,color:'#e9d0ae'},
]
function randomColor(){return COLORS[Math.floor(Math.random()*COLORS.length)]}
function read(){try{const a=JSON.parse(localStorage.getItem(KEY));return Array.isArray(a)?a.slice(-300):[]}catch{return []}}
function spray(ctx,stroke,w,h){
 const p=stroke.points;if(!p?.length)return
 const radius=stroke.width*1.55,seed=stroke.seed||1337
 let state=seed>>>0
 const rnd=()=>{state=(Math.imul(1664525,state)+1013904223)>>>0;return state/4294967296}
 ctx.fillStyle=stroke.color
 const stamp=(x,y)=>{for(let k=0;k<7;k++){const angle=rnd()*Math.PI*2,r=radius*Math.sqrt(rnd()),dot=.25+rnd()*.9;ctx.globalAlpha=.08+rnd()*.32;ctx.beginPath();ctx.arc(x+Math.cos(angle)*r,y+Math.sin(angle)*r,dot,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=.4;ctx.beginPath();ctx.arc(x,y,Math.max(.65,stroke.width*.17),0,Math.PI*2);ctx.fill()}
 stamp(p[0][0]*w,p[0][1]*h)
 for(let i=1;i<p.length;i++){const x0=p[i-1][0]*w,y0=p[i-1][1]*h,x1=p[i][0]*w,y1=p[i][1]*h,dist=Math.hypot(x1-x0,y1-y0),steps=Math.min(180,Math.ceil(dist/3.5));for(let j=1;j<=steps;j++)stamp(x0+(x1-x0)*j/steps,y0+(y1-y0)*j/steps)}
 ctx.globalAlpha=1
}
export default function GraffitiWall({onBack}){
 const canvas=useRef(null),active=useRef(null),strokesRef=useRef([]),draftRef=useRef([]),paintRef=useRef(null)
 const [strokes,setStrokes]=useState(read),[draft,setDraft]=useState([]),[color,setColor]=useState(randomColor),[width,setWidth]=useState(9),[notice,setNotice]=useState('')
 useEffect(()=>{strokesRef.current=strokes},[strokes])
 useEffect(()=>{draftRef.current=draft;paintRef.current?.()},[draft])
 useEffect(()=>{
  const c=canvas.current;if(!c)return
  const paint=()=>{const box=c.getBoundingClientRect();if(!box.width||!box.height)return;const dpr=Math.min(window.devicePixelRatio||1,2);const w=Math.round(box.width*dpr),h=Math.round(box.height*dpr);if(c.width!==w)c.width=w;if(c.height!==h)c.height=h;const ctx=c.getContext('2d');if(!ctx)return;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,box.width,box.height);[...strokesRef.current,...draftRef.current,...(active.current?[active.current]:[])].forEach(stroke=>spray(ctx,stroke,box.width,box.height))}
  const blockTouch=e=>{if(active.current)e.preventDefault()};c.addEventListener('touchmove',blockTouch,{passive:false});c.addEventListener('touchstart',blockTouch,{passive:false});paintRef.current=paint;paint();const observer=new ResizeObserver(paint);observer.observe(c.parentElement);return()=>{observer.disconnect();c.removeEventListener('touchmove',blockTouch);c.removeEventListener('touchstart',blockTouch);paintRef.current=null}
 },[])
 const point=e=>{const rect=canvas.current.getBoundingClientRect();return [Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width)),Math.max(0,Math.min(1,(e.clientY-rect.top)/rect.height))]}
 const down=e=>{e.preventDefault();if(active.current)return;try{canvas.current.setPointerCapture(e.pointerId)}catch{/* unsupported capture */}active.current={color,width,seed:Math.floor(Math.random()*2147483647),points:[point(e)]};paintRef.current?.()}
 const move=e=>{if(!active.current)return;e.preventDefault();const p=point(e),points=active.current.points,last=points[points.length-1];if(Math.hypot((p[0]-last[0])*canvas.current.clientWidth,(p[1]-last[1])*canvas.current.clientHeight)<2)return;points.push(p);if(points.length>900)points.splice(1,1);paintRef.current?.()}
 const up=()=>{if(!active.current)return;const completed=active.current;active.current=null;setDraft(d=>[...d,completed])}
 const publish=()=>{if(!draft.length)return;const next=[...strokesRef.current,...draft].slice(-300);try{localStorage.setItem(KEY,JSON.stringify(next))}catch{setNotice('Не удалось сохранить рисунок в этом браузере.')}setStrokes(next);setDraft([]);setColor(randomColor());setNotice('След сохранён в этом браузере. Общую стену подключим отдельно.')}
 return <section className="graffiti-page wrap">
  <div className="graffiti-back"><button onClick={onBack}><ArrowLeft size={16}/> НАЗАД</button><span>SAINTFOUR / UNDERGROUND</span></div>
  <header className="graffiti-heading"><span>NO RULES / JUST MARKS</span><h1>THE <em>WALL.</em></h1><p>Одна кирпичная стена. Новые граффити поверх старых. Твой цвет выбирает случай.</p></header>
  <div className="graffiti-status"><span className="graffiti-live-dot"/> ПРОТОТИП / РИСУНКИ ПОКА ВИДНЫ ТОЛЬКО В ТВОЁМ БРАУЗЕРЕ</div>
  <div className="graffiti-bricks"><div className="graffiti-wall-noise"/><div className="graffiti-old-tags" aria-hidden="true">{TAGS.map((tag,i)=><span key={i} className="graffiti-tag" style={{left:tag.x+'%',top:tag.y+'%',transform:'rotate('+tag.rotate+'deg)',fontSize:'clamp(12px,'+tag.size+'cqw,90px)',color:tag.color}}>{tag.text}</span>)}<span className="graffiti-cross">✕</span><span className="graffiti-stamp">SF / 027</span></div><canvas ref={canvas} className="graffiti-canvas" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} aria-label="Полотно для граффити"/></div>
  <div className="graffiti-controls"><div className="graffiti-can"><span style={{background:color}}/><div><small>ТВОЙ СЛУЧАЙНЫЙ ЦВЕТ</small><strong>{color.toUpperCase()}</strong></div></div><label className="graffiti-size">РАСПЫЛЕНИЕ <input type="range" min="5" max="22" value={width} onChange={e=>setWidth(Number(e.target.value))}/></label><button type="button" className="graffiti-undo" onClick={()=>setDraft(d=>d.slice(0,-1))} disabled={!draft.length}><RotateCcw size={16}/> ОТМЕНИТЬ ШТРИХ</button><button type="button" className="graffiti-publish" onClick={publish} disabled={!draft.length}><Send size={16}/> ОСТАВИТЬ СЛЕД</button></div>
  {notice&&<p className="graffiti-notice" role="status">{notice}</p>}
  <p className="graffiti-disclaimer"><LockKeyhole size={14}/> После сохранения ластика нет. Пока это локальный тест: другие посетители не увидят твой рисунок до подключения общей базы.</p>
 </section>
}
