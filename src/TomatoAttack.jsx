import {useEffect,useRef,useState} from 'react'
import {RotateCcw,Trophy} from 'lucide-react'
import './TomatoAttack.css'
const players=[
 {id:'dex',name:'LIL DEX',image:'media/lil-dex-profile.jpg',line:'DEX: Я тебе это припомню.'},
 {id:'netti',name:'MC NETTI',image:'media/mc-netti-profile.jpg',line:'HOWARD: Это будет отражено в юридическом заключении.'},
 {id:'rud',name:'YUNG RUD',image:'media/yung-rud-profile.jpg',line:'RUDY: Серьёзно? Я вообще что сделал?!'},
 {id:'daro',name:'DON DARO',image:'media/don-daro-profile.jpg',line:'DARREN: Ты точно выбрал не того человека.'},
 {id:'poppy',name:'POPPY',image:'media/poppy-host-profile.jpg',line:'POPPY: Я ВООБЩЕ-ТО ВЕДУЩАЯ! ПОЧЕМУ Я В ЭТОМ СПИСКЕ?!'}
]
const KEY='sf27-tomato-v1'
const awards=[['first','ПЕРВЫЙ ПОМИДОР','Первое попадание'],['grudge','ЛИЧНАЯ НЕПРИЯЗНЬ','25 попаданий в одного персонажа'],['everyone','НИКОГО НЕ ПОЩАДИЛ','Попасть во всех пятерых'],['terror','ОВОЩНОЙ ТЕРРОР','100 бросков']]
function load(){try{const data=JSON.parse(localStorage.getItem(KEY)||'{}');return {counts:data.counts||{},earned:data.earned||{}}}catch{return {counts:{},earned:{}}}}
export default function TomatoAttack(){
 const [target,setTarget]=useState('dex')
 const [data,setData]=useState(load)
 const [splats,setSplats]=useState([])
 const [message,setMessage]=useState('')
 const [newAward,setNewAward]=useState('')
 const [throwing,setThrowing]=useState(null)
 const timeout=useRef(null)
 const player=players.find(p=>p.id===target)
 const total=Object.values(data.counts).reduce((a,b)=>a+(Number(b)||0),0)
 useEffect(()=>()=>clearTimeout(timeout.current),[])
 const hit=(e)=>{
  const rect=e.currentTarget.getBoundingClientRect()
  const x=Math.max(10,Math.min(90,((e.clientX-rect.left)/rect.width)*100))
  const y=Math.max(10,Math.min(90,((e.clientY-rect.top)/rect.height)*100))
  const count=(data.counts[target]||0)+1
  const counts={...data.counts,[target]:count}
  const sum=Object.values(counts).reduce((a,b)=>a+b,0)
  const conditions={first:sum>=1,grudge:Object.values(counts).some(n=>n>=25),everyone:players.every(p=>(counts[p.id]||0)>0),terror:sum>=100}
  const earned={...data.earned}
  const newOne=awards.find(([id])=>conditions[id]&&!earned[id])
  if(newOne){earned[newOne[0]]=true;setNewAward(newOne[1])}else setNewAward('')
  const next={counts,earned}
  setData(next)
  try{localStorage.setItem(KEY,JSON.stringify(next))}catch{}
  setSplats(prev=>[...prev,{id:Date.now()+Math.random(),x,y,rot:Math.random()*360}].slice(-35))
  setThrowing({x,y,id:Date.now()})
  setMessage(player.line)
  clearTimeout(timeout.current)
  timeout.current=setTimeout(()=>setThrowing(null),600)
 }
 return <section className="tomato-game" aria-label="TOMATO ATTACK">
  <div className="tomato-game-head"><span>SAINTFOUR / UNOFFICIAL FAN ACTIVITY</span><h2>TOMATO <em>ATTACK.</em> 🍅</h2><p>Выбирай мишень и бросай помидоры прямо в фотографию. Поппи категорически против этой инициативы.</p></div>
  <div className="tomato-tabs">{players.map(p=><button type="button" key={p.id} className={target===p.id?'selected':''} onClick={()=>{setTarget(p.id);setSplats([]);setMessage('');setNewAward('')}}>{p.name}<small>{data.counts[p.id]||0} 🍅</small></button>)}</div>
  <div className="tomato-arena">
   <div className="tomato-target-wrap">
    <button type="button" className="tomato-photo" onClick={hit} aria-label={'Бросить помидор в '+player.name}>
     <img src={import.meta.env.BASE_URL+player.image} alt={player.name} onError={e=>{e.currentTarget.src=import.meta.env.BASE_URL+'media/'+(target==='poppy'?'poppy-host.jpg':target==='dex'?'lil-dex.jpg':target==='netti'?'mc-netti.jpg':target==='rud'?'yung-rud.jpg':'don-daro.jpg')}}/>
     {splats.map(s=><span className="tomato-splat" key={s.id} style={{left:s.x+'%',top:s.y+'%',transform:'translate(-50%,-50%) rotate('+s.rot+'deg)'}}>🍅</span>)}
     {throwing&&<span className="tomato-impact" key={throwing.id} style={{left:throwing.x+'%',top:throwing.y+'%'}}>✹</span>}
     <span className="tomato-photo-hint">НАЖМИ НА ФОТО, ЧТОБЫ БРОСИТЬ 🍅</span>
    </button>
    <button className="tomato-clear" type="button" onClick={()=>setSplats([])}><RotateCcw size={14}/> ОЧИСТИТЬ ФОТО</button>
   </div>
   <div className="tomato-sidebar"><span className="tomato-label">CURRENT TARGET</span><strong>{player.name}</strong><div className="tomato-stat"><span>ПОПАДАНИЙ В ЦЕЛЬ</span><b>{data.counts[target]||0}</b></div><div className="tomato-stat"><span>ВСЕГО БРОСКОВ</span><b>{total}</b></div><p className="tomato-reaction" aria-live="polite">{message||'Участник пока ничего не подозревает.'}</p>
    {newAward&&<div className="tomato-unlock"><Trophy size={18}/> ДОСТИЖЕНИЕ ОТКРЫТО: {newAward}</div>}
    <div className="tomato-awards"><span className="tomato-label">TOMATO ACHIEVEMENTS</span>{awards.map(([id,title,desc])=><div key={id} className={data.earned[id]?'earned':''}><span>{data.earned[id]?'✓':'🔒'}</span><div><strong>{title}</strong><small>{desc}</small></div></div>)}</div>
   </div>
  </div>
 </section>
}
