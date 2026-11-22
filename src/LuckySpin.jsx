import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Gift, RotateCcw, Trophy, LockKeyhole, CheckCircle2, Sparkles } from 'lucide-react'
import { spinPrizes } from './spin-prizes'
import './lucky-spin.css'

const storageKey='sf27-lucky-spin-v1'
const milestones=[
 {count:1,title:'НУ, ПОНЕСЛАСЬ',description:'Ты только что потратил время на абсолютно бесполезную рулетку.'},
 {count:25,title:'ПОППИ НАЧИНАЕТ ПЕРЕЖИВАТЬ',description:'Даже организатор шоу не ожидала такого энтузиазма.'},
 {count:100,title:'ПРОФЕССИОНАЛЬНЫЙ БЕЗДЕЛЬНИК',description:'Сто прокруток. Ноль материальных призов.'},
 {count:250,title:'РУЛЕТКА ЗНАЕТ ТЕБЯ ПО ИМЕНИ',description:'Возможно, вам уже пора познакомиться лично.'},
 {count:1000,title:'ГОВАРД ТРЕБУЕТ ЗАКРЫТЬ САЙТ',description:'Юридический отдел Warlock направил официальную претензию.'}
]
const icons=['✿','★','⚡','●','✦','♠','☾','◆','✳','♥','☢','✧']
const blank={spins:0,history:[],found:[],secret:false}
function load(){try{const s=JSON.parse(localStorage.getItem(storageKey));if(s&&Number.isFinite(s.spins)&&Array.isArray(s.history)&&Array.isArray(s.found))return {...blank,...s}}catch{/* storage disabled */}return blank}
export default function LuckySpin({onBack}){
 const [record,setRecord]=useState(load)
 const [angle,setAngle]=useState(0)
 const [rolling,setRolling]=useState(false)
 const [result,setResult]=useState(null)
 const [tab,setTab]=useState('collection')
 const timer=useRef(null)
 useEffect(()=>()=>clearTimeout(timer.current),[])
 const found=new Set(record.found)
 const unlocked=milestones.filter(m=>record.spins>=m.count)
 const spin=()=>{
  if(rolling)return
  const prize=spinPrizes[Math.floor(Math.random()*spinPrizes.length)]
  const nextSpins=record.spins+1
  setResult(null);setRolling(true)
  const extra=1800+Math.random()*1800
  setAngle(a=>a+360*6+extra)
  timer.current=setTimeout(()=>{
   setRecord(prev=>{
    const next={spins:prev.spins+1,history:[{id:prize.id,at:Date.now()},...prev.history].slice(0,250),found:[...new Set([...prev.found,prize.id])],secret:prev.secret||((prev.spins+1)>=25&&new Set([...prev.found,prize.id]).size===1)}
    try{localStorage.setItem(storageKey,JSON.stringify(next))}catch{/* storage disabled */}
    return next
   })
   setResult(prize);setRolling(false)
  },4200)
 }
 const latestMilestone=milestones.find(m=>m.count===record.spins)
 return <section className="spin-page wrap">
  <div className="spin-top"><button type="button" onClick={onBack}><ArrowLeft size={16}/> НАЗАД НА ГЛАВНУЮ</button><span>SAINTFOUR / UNOFFICIAL ENTERTAINMENT</span></div>
  <div className="spin-heading"><span className="spin-eyebrow">WELCOME TO POPPY'S QUESTIONABLE ATTRACTION</span><h1>LUCKY <em>SPIN.</em></h1><p>Крути колесо. Выигрывай что угодно. Не рассчитывай получить это в реальной жизни.</p></div>
  <div className="spin-layout">
   <div className="spin-machine">
    <div className="spin-machine-label"><span>THE WHEEL OF VERY DUBIOUS FORTUNE</span><span>NO REFUNDS / NO QUESTIONS</span></div>
    <div className="spin-wheel-shell"><div className="spin-pointer" aria-hidden="true"/>
      <div className="spin-wheel" style={{transform:`rotate(${angle}deg)`}}>
       {icons.map((symbol,i)=><span key={i} className="spin-wheel-symbol" style={{transform:`rotate(${i*30}deg) translateY(-138px) rotate(${-i*30}deg)`}}>{symbol}</span>)}
       <div className="spin-wheel-center"><span>SF</span><small>27</small></div>
      </div>
    </div>
    <p className="spin-wheel-note">Символы на колесе ничего не предсказывают. Поппи просто понравился дизайн.</p>
    <button className="spin-go" type="button" onClick={spin} disabled={rolling}><RotateCcw size={20} className={rolling?'spin-go-icon':''}/>{rolling?'КОЛЕСО КРУТИТСЯ...':'КРУТИТЬ РУЛЕТКУ'}<ArrowRight size={18}/></button>
    <div className="spin-result" aria-live="polite">{rolling?<><span>PLEASE WAIT</span><strong>СУДЬБА ВЫБИРАЕТ БЕСПОЛЕЗНОСТЬ...</strong></>:result?<><span>YOUR PRIZE / {result.group.toUpperCase()}</span><strong>{result.name}</strong><p>{result.description}</p>{latestMilestone&&<small>🏆 НОВОЕ ДОСТИЖЕНИЕ: {latestMilestone.title}</small>}</>:<><span>NO PRIZE YET</span><strong>НАЖМИ SPIN И ПОСМОТРИ, ЧТО ТЕБЕ НЕ ДОСТАНЕТСЯ.</strong></>}</div>
   </div>
   <aside className="spin-side">
    <div className="spin-stats"><div><span>TOTAL SPINS</span><strong>{record.spins.toLocaleString('ru-RU')}</strong></div><div><span>COLLECTED</span><strong>{found.size}<small> / {spinPrizes.length}</small></strong></div></div>
    <div className="spin-side-intro"><span>POPPY'S DISCLAIMER / 001</span><h2>ТЫ НИЧЕГО НЕ ВЫИГРАЕШЬ. <em>НО ПОПРОБОВАТЬ СТОИТ.</em></h2><p>120 виртуальных призов. Повторы возможны. Шансы одинаковые. Ни Декс, ни Руди, ни Говард, ни Даррен не соглашались участвовать в этой затее.</p></div>
    <div className="spin-panel"><div className="spin-tabs"><button className={tab==='collection'?'selected':''} onClick={()=>setTab('collection')}><Gift size={15}/> КОЛЛЕКЦИЯ</button><button className={tab==='history'?'selected':''} onClick={()=>setTab('history')}>ИСТОРИЯ</button><button className={tab==='awards'?'selected':''} onClick={()=>setTab('awards')}><Trophy size={15}/> АЧИВКИ</button></div>
      {tab==='collection'&&<><p className="spin-panel-caption">Найдено {found.size} из {spinPrizes.length}. Повторы не исчезают из истории.</p><div className="spin-collection">{spinPrizes.map((p,i)=><div key={p.id} className={'spin-collect-item '+(found.has(p.id)?'discovered':'')} title={found.has(p.id)?p.name:'Неизвестный приз'}><span>{String(i+1).padStart(3,'0')}</span>{found.has(p.id)?<><CheckCircle2 size={15}/><strong>{p.name}</strong></>:<><LockKeyhole size={14}/><strong>???</strong></>}</div>)}</div></>}
      {tab==='history'&&<><p className="spin-panel-caption">Последние 250 прокруток. Повторные призы тоже учитываются.</p><div className="spin-history">{record.history.length?record.history.map((h,i)=>{const p=spinPrizes.find(x=>x.id===h.id);return <div key={h.at+'-'+i}><span>#{record.spins-i}</span><strong>{p?.name||'Неизвестный приз'}</strong><small>{p?.group}</small></div>}):<p>Здесь пока пусто. Колесо ждёт.</p>}</div></>}
      {tab==='awards'&&<><p className="spin-panel-caption">Отдельные достижения рулетки. На ALL ACCESS TICKET не влияют.</p><div className="spin-awards">{milestones.map(m=><div key={m.count} className={record.spins>=m.count?'earned':''}>{record.spins>=m.count?<CheckCircle2 size={19}/>:<LockKeyhole size={19}/>}<div><small>{m.count} ПРОКРУТОК</small><strong>{record.spins>=m.count?m.title:'НЕ ОТКРЫТО'}</strong><p>{record.spins>=m.count?m.description:'Продолжай крутить колесо.'}</p></div></div>)}<div className={record.secret?'earned':''}>{record.secret?<Sparkles size={19}/>:<LockKeyhole size={19}/>}<div><small>SECRET / ???</small><strong>{record.secret?'НЕВЕРОЯТНОЕ УПОРСТВО':'ЗАСЕКРЕЧЕНО'}</strong><p>{record.secret?'25 раз подряд получать один и тот же приз было бы подозрительно.':'Условие неизвестно.'}</p></div></div></div></>}
    </div>
   </aside>
  </div>
  <p className="spin-legal">SAINTFOUR LUCKY SPIN — ШУТОЧНЫЙ АТТРАКЦИОН. НИКАКИХ ПОКУПОК, ДЕНЕГ И НАСТОЯЩИХ ПРИЗОВ. ПРЕТЕНЗИИ НАПРАВЛЯТЬ ПОППИ.</p>
 </section>
}
