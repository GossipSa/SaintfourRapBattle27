import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Gift, RotateCcw, Trophy, LockKeyhole, CheckCircle2, Sparkles, Cigarette, Flower2, CircleDot, Zap, Cat, Disc3, Flame, Music2, Mic2, Crown, Star, Diamond } from 'lucide-react'
import { spinPrizes } from './spin-prizes'
import './lucky-spin.css'

const storageKey='sf27-lucky-spin-v2'
const milestones=[
 {count:1,title:'НУ, ПОНЕСЛАСЬ',description:'Ты только что потратил время на абсолютно бесполезную рулетку.'},
 {count:25,title:'ПОППИ НАЧИНАЕТ ПЕРЕЖИВАТЬ',description:'Даже организатор шоу не ожидала такого энтузиазма.'},
 {count:100,title:'ПРОФЕССИОНАЛЬНЫЙ БЕЗДЕЛЬНИК',description:'Сто прокруток. Ноль материальных призов.'},
 {count:250,title:'РУЛЕТКА ЗНАЕТ ТЕБЯ ПО ИМЕНИ',description:'Возможно, вам уже пора познакомиться лично.'},
 {count:1000,title:'ГОВАРД ТРЕБУЕТ ЗАКРЫТЬ САЙТ',description:'Юридический отдел Warlock направил официальную претензию.'},
 {count:1000000,title:'МИЛЛИОН. ТЫ СЕРЬЁЗНО?',description:'Поппи не верит. Декс уважает. Говард отказался комментировать.'}
]
const categoryWeights={'Декс':8,'Руди':8,'Говард':8,'Даррен':8,'Надин':9,'Поппи':9,'Батл / закулисье':9,'Warlock / архив':7,'Школа Сентфора':6,'BLACK HELLEBORE':8,'Сплетница Сентфора':7,'Saintfour / город':7,'Фанат / зритель':6}
function drawPrize(){const n=Math.random()*100;let cursor=0;let category='Фанат / зритель';for(const [name,weight] of Object.entries(categoryWeights)){cursor+=weight;if(n<cursor){category=name;break}}const choices=spinPrizes.filter(p=>p.group===category);return choices[Math.floor(Math.random()*choices.length)]}
const wheelIcons=[Cigarette,Flower2,CircleDot,Zap,Cat,Disc3,Flame,Music2,Mic2,Crown,Star,Diamond]
const blank={spins:0,history:[],found:[],secret:false}
function load(){try{const s=JSON.parse(localStorage.getItem(storageKey));if(s&&Number.isFinite(s.spins)&&Array.isArray(s.history)&&Array.isArray(s.found))return {...blank,...s}}catch{/* storage disabled */}return blank}
export default function LuckySpin({onBack,onAchievements,onSlotsDiscovered,onOpenSlots}){
 const [record,setRecord]=useState(load)
 const [angle,setAngle]=useState(0)
 const [rolling,setRolling]=useState(false)
 const [result,setResult]=useState(null)
 const [tab,setTab]=useState('collection')
 const [achievementNotice,setAchievementNotice]=useState(null)
 const noticeTimer=useRef(null)
 const timer=useRef(null)
 useEffect(()=>()=>{clearTimeout(timer.current);clearTimeout(noticeTimer.current)},[])
 const found=new Set(record.found)
 const spin=()=>{
  if(rolling)return
  const secretDrop=Math.random()<0.00005
  const prize=secretDrop?{id:'bh777',group:'BLACK HELLEBORE',name:'НЕИЗВЕСТНЫЙ ПРИЗ',description:'Похоже, колесо открыло что-то, чего не было в списке.'}:drawPrize()
  setResult(null);setRolling(true);setAchievementNotice(null)
  const extra=1800+Math.random()*1800
  setAngle(a=>a+360*6+extra)
  timer.current=setTimeout(()=>{
   const nextSpin=record.spins+1
   if(secretDrop)onSlotsDiscovered?.()
   const milestone=milestones.find(m=>m.count===nextSpin)
   const secretNew=!record.secret&&record.history.length>=2&&record.history[0].id===prize.id&&record.history[1].id===prize.id
   if(milestone||secretNew){setAchievementNotice(milestone?{title:milestone.title,description:milestone.description}:{title:'НЕВЕРОЯТНОЕ УПОРСТВО',description:'Три одинаковых приза подряд. Поппи подозревает вмешательство Warlock.'});clearTimeout(noticeTimer.current);noticeTimer.current=setTimeout(()=>setAchievementNotice(null),9000)}
   setRecord(prev=>{
    const next={spins:prev.spins+1,history:[{id:prize.id,at:Date.now()},...prev.history].slice(0,250),found:secretDrop?prev.found:[...new Set([...prev.found,prize.id])],secret:prev.secret||(prev.history.length>=2&&prev.history[0].id===prize.id&&prev.history[1].id===prize.id)}
    try{localStorage.setItem(storageKey,JSON.stringify(next))}catch{/* storage disabled */}
    return next
   })
   setResult(prize);setRolling(false)
  },4200)
 }
 return <section className="spin-page wrap">
  <div className="spin-top"><button type="button" onClick={onBack}><ArrowLeft size={16}/> НАЗАД НА ГЛАВНУЮ</button><span>SAINTFOUR / UNOFFICIAL ENTERTAINMENT</span></div>
  <div className="spin-heading"><span className="spin-eyebrow">WELCOME TO POPPY'S QUESTIONABLE ATTRACTION</span><h1 className="spin-glitch-title" aria-label="LUCKY SPIN."><span className="spin-glitch-base">LUCKY <em>SPIN.</em></span><span className="spin-glitch-layer spin-glitch-red" aria-hidden="true">LUCKY <em>SPIN.</em></span><span className="spin-glitch-layer spin-glitch-blue" aria-hidden="true">LUCKY <em>SPIN.</em></span></h1><p>Крути колесо. Выигрывай что угодно. Не рассчитывай получить это в реальной жизни.</p></div>
  <div className="spin-layout">
   <div className="spin-machine">
    <div className="spin-machine-label"><span>THE WHEEL OF VERY DUBIOUS FORTUNE</span><span>NO REFUNDS / NO QUESTIONS</span></div>
    <div className="spin-wheel-shell"><div className="spin-pointer" aria-hidden="true"/>
      <div className="spin-wheel" style={{transform:`rotate(${angle}deg)`}}>
       {wheelIcons.map((Icon,i)=><span key={i} className="spin-wheel-symbol" style={{transform:`rotate(${i*30}deg) translateY(calc(var(--wheel-size) * -0.345)) rotate(${-i*30}deg)`}}><Icon size={22} strokeWidth={1.8}/></span>)}
       <div className="spin-wheel-center"><span>SF</span><small>27</small></div>
      </div>
    </div>
    <p className="spin-wheel-note">Значки — просто декор. Приз выбирается случайно.</p>
    <button className="spin-go" type="button" onClick={spin} disabled={rolling}><RotateCcw size={20} className={rolling?'spin-go-icon':''}/>{rolling?'КОЛЕСО КРУТИТСЯ...':'КРУТИТЬ РУЛЕТКУ'}<ArrowRight size={18}/></button>
    <div className="spin-result" aria-live="polite">{rolling?<><span>PLEASE WAIT</span><strong>СУДЬБА ВЫБИРАЕТ БЕСПОЛЕЗНОСТЬ...</strong></>:result?<><span>YOUR PRIZE / {result.group.toUpperCase()}</span><strong>{result.name}</strong><p>{result.description}</p>{result.id==='bh777'&&<button type="button" className="spin-secret-portal" onClick={onOpenSlots}>ОТКРЫТЬ НЕИЗВЕСТНЫЙ ПРИЗ →</button>}</>:<><span>NO PRIZE YET</span><strong>НАЖМИ SPIN И ПОСМОТРИ, ЧТО ТЕБЕ НЕ ДОСТАНЕТСЯ.</strong></>}</div>
   </div>
   <aside className="spin-side">
    <div className="spin-stats"><div><span>TOTAL SPINS</span><strong>{record.spins.toLocaleString('ru-RU')}</strong></div><div><span>COLLECTED</span><strong>{found.size}<small> / {spinPrizes.length}</small></strong></div></div>
    <div className="spin-side-intro"><span>POPPY'S DISCLAIMER / 001</span><h2>ТЫ НИЧЕГО НЕ ВЫИГРАЕШЬ. <em>НО ПОПРОБОВАТЬ СТОИТ.</em></h2><p>Никаких гарантий. Никаких подсказок. Только ты, колесо и сомнительное чувство, что следующий прокрут точно будет удачным.</p></div>
    <div className="spin-panel"><div className="spin-tabs"><button className={tab==='collection'?'selected':''} onClick={()=>setTab('collection')}><Gift size={15}/> КОЛЛЕКЦИЯ</button><button className={tab==='history'?'selected':''} onClick={()=>setTab('history')}>ИСТОРИЯ</button><button className={tab==='awards'?'selected':''} onClick={()=>setTab('awards')}><Trophy size={15}/> АЧИВКИ</button></div>
      {tab==='collection'&&<><p className="spin-panel-caption">Найдено {found.size} из {spinPrizes.length}. Повторы не исчезают из истории. Призы разделены по категориям.</p><div className="spin-collection">{Object.keys(categoryWeights).map(group=><div className="spin-collection-group" key={group}><div className="spin-collection-group-heading"><strong>{group.toUpperCase()}</strong><span>{spinPrizes.filter(p=>p.group===group&&found.has(p.id)).length} / {spinPrizes.filter(p=>p.group===group).length}</span></div><div className="spin-collection-group-items">{spinPrizes.filter(p=>p.group===group).map(p=><div key={p.id} className={'spin-collect-item '+(found.has(p.id)?'discovered':'')} title={found.has(p.id)?p.name:'Неизвестный приз'}><span>{p.id.slice(5).padStart(3,'0')}</span>{found.has(p.id)?<><CheckCircle2 size={15}/><strong>{p.name}</strong></>:<><LockKeyhole size={14}/><strong>???</strong></>}</div>)}</div></div>)}</div></>}
      {tab==='history'&&<><p className="spin-panel-caption">Последние 250 прокруток. Повторные призы тоже учитываются.</p><div className="spin-history">{record.history.length?record.history.map((h,i)=>{const p=spinPrizes.find(x=>x.id===h.id);return <div key={h.at+'-'+i}><span>#{record.spins-i}</span><strong>{p?.name||'Неизвестный приз'}</strong><small>{p?.group}</small></div>}):<p>Здесь пока пусто. Колесо ждёт.</p>}</div></>}
      {tab==='awards'&&<><p className="spin-panel-caption">Отдельные достижения рулетки. На ALL ACCESS TICKET не влияют.</p><div className="spin-awards">{milestones.map(m=><div key={m.count} className={record.spins>=m.count?'earned':''}>{record.spins>=m.count?<CheckCircle2 size={19}/>:<LockKeyhole size={19}/>}<div><small>{m.count} ПРОКРУТОК</small><strong>{record.spins>=m.count?m.title:'НЕ ОТКРЫТО'}</strong><p>{record.spins>=m.count?m.description:'Продолжай крутить колесо.'}</p></div></div>)}<div className={record.secret?'earned':''}>{record.secret?<Sparkles size={19}/>:<LockKeyhole size={19}/>}<div><small>SECRET / ???</small><strong>{record.secret?'НЕВЕРОЯТНОЕ УПОРСТВО':'ЗАСЕКРЕЧЕНО'}</strong><p>{record.secret?'Три одинаковых приза подряд. Поппи подозревает вмешательство Warlock.':'Условие неизвестно.'}</p></div></div></div></>}
    </div>
   </aside>
  </div>
  {achievementNotice&&<div className="spin-achievement-toast" role="status" aria-live="polite"><button className="spin-achievement-toast-main" type="button" onClick={()=>{setAchievementNotice(null);onAchievements()}}><span className="spin-achievement-toast-icon"><Trophy size={23}/></span><span className="spin-achievement-toast-copy"><small>NEW ACHIEVEMENT / LUCKY SPIN</small><strong>{achievementNotice.title}</strong><span>{achievementNotice.description}</span><em>ПОСМОТРЕТЬ ДОСТИЖЕНИЯ →</em></span></button><button type="button" className="spin-achievement-toast-close" onClick={()=>setAchievementNotice(null)} aria-label="Закрыть уведомление">×</button></div>}
  <p className="spin-legal">SAINTFOUR LUCKY SPIN — ШУТОЧНЫЙ АТТРАКЦИОН. НИКАКИХ ПОКУПОК, ДЕНЕГ И НАСТОЯЩИХ ПРИЗОВ. ПРЕТЕНЗИИ НАПРАВЛЯТЬ ПОППИ.</p>
 </section>
}

export function LuckySpinAchievements({onOpen}){
 const [record]=useState(load)
 return <div className="spin-achievement-bridge"><div className="spin-achievement-bridge-head"><span>LUCKY SPIN / BONUS COLLECTION</span><strong>ДОСТИЖЕНИЯ РУЛЕТКИ</strong><p>Отдельная коллекция. Не влияет на получение ALL ACCESS TICKET.</p></div><div className="spin-achievement-bridge-list">{milestones.map(m=><div key={m.count}><span>{record.spins>=m.count?<CheckCircle2 size={16}/>:<LockKeyhole size={16}/>}</span><strong>{record.spins>=m.count?m.title:'НЕИЗВЕСТНО'}</strong><small>{m.count} SPINS</small></div>)}<div><span>{record.secret?<Sparkles size={16}/>:<LockKeyhole size={16}/>}</span><strong>{record.secret?'НЕВЕРОЯТНОЕ УПОРСТВО':'НЕИЗВЕСТНО'}</strong><small>SECRET</small></div></div><button type="button" onClick={onOpen}>ПЕРЕЙТИ К РУЛЕТКЕ <ArrowRight size={15}/></button></div>
}
