import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDownRight, ArrowRight, ChevronLeft, ChevronRight, Clapperboard, Flame, Home, Menu, Mic2, Play, Radio, Vote, X, Trophy, LockKeyhole, CheckCircle2, Ticket, Sparkles, FlaskConical, Mail, Eye, FileWarning, Volume2, VolumeX, AudioLines } from 'lucide-react'
import './App.css'
import './theme.css'
import './cyber.css'
import './glitch.css'
import './sponsors.css'
import SponsorsShowcase from './Sponsors.jsx'
import HypePolls from './HypePolls.jsx'
import BattleTicker from './LineupMarquee.jsx'
import './lineup-marquee.css'
import './hero-background.css'
import './host-card.css'
import CreditsTicker from './CreditsTicker.jsx'
import './credits-ticker.css'
import './profile-modal.css'

const rappers = [
  { id:'dex', stage:'LIL DEX', name:'DEX HAWK', subtitle:'NO RULES. NO MERCY.', role:'THE WILD CARD', number:'01', color:'#ff78cf', initials:'DX', image:`${import.meta.env.BASE_URL}media/lil-dex.jpg`, profileImage:`${import.meta.env.BASE_URL}media/lil-dex-profile.jpg`, description:'Байкер, провокатор и человек, который никогда не держит язык за зубами. На баттле играет грязно, бьёт по больному и получает от этого удовольствие. Особенно если напротив Руди.' },
  { id:'netti', stage:'MC NETTI', name:'NATHANIEL HOWARD', subtitle:'BUSINESS IS PERSONAL.', role:'THE EXECUTIVE', number:'02', color:'#c49afd', initials:'MN', image:`${import.meta.env.BASE_URL}media/mc-netti.jpg`, profileImage:`${import.meta.env.BASE_URL}media/mc-netti-profile.jpg`, description:'Глава компании «Уорлок». До сих пор не понимает, кто записал его на рэп-баттл и зачем ему всё это нужно. Но раз уж оказался здесь, уходить без победы не собирается.' },
  { id:'rudi', stage:'YUNG RUD', name:'RUDI BROOKS', subtitle:'PLAY TO WIN.', role:'THE CONTENDER', number:'03', color:'#e2a0ff', initials:'RB', image:`${import.meta.env.BASE_URL}media/rudi.jpg`, profileImage:`${import.meta.env.BASE_URL}media/rudi-profile.jpg`, description:'Капитан школьной баскетбольной команды. На баттле у него тот же азарт, что и на площадке. Особенно когда напротив Декс.' },
  { id:'daro', stage:'DON DARO', name:'DARREN BOWIE', subtitle:'MAKE SOME NOISE.', role:'THE UNKNOWN', number:'04', color:'#a87fff', initials:'DD', image:`${import.meta.env.BASE_URL}media/don-daro.jpg`, profileImage:`${import.meta.env.BASE_URL}media/don-daro-profile.jpg`, description:'Леопардовая шуба, золото и уверенность человека, которому не нужно ничего доказывать. Он пришёл не просто зачитать пару строк, а устроить настоящее шоу.' },
]
const host = {
  id:'host', stage:'POPPY', name:'PENELOPE (POPPY) EMERSON',
  subtitle:'SHE RUNS THE SHOW.', role:'THE HOST', number:'HOST',
  color:'#bd9aff', initials:'PE', image:`${import.meta.env.BASE_URL}media/poppy-host.jpg`, profileImage:`${import.meta.env.BASE_URL}media/poppy-host-profile.jpg`, isHost:true,
  description:'Ведущая SAINTFOUR RAP BATTLE ’27. Она здесь, чтобы держать микрофон, направлять хаос в нужное русло и не дать никому забыть, кто сегодня управляет этим шоу.'
}
// Интервью выходят по четвергам с 3 декабря 2026 года в 19:00 МСК (UTC+3).
// Порядок героев предварительный — даты/героев можно поменять перед анонсом.
const media = [
  { id:'interview-dex', type:'INTERVIEW', title:'LIL DEX — INTERVIEW', duration:'03 DEC · 19:00 МСК', artist:'Lil Dex', date:'2026-12-03', thumbnail:'/api/interviews/dex/poster', url:'/api/interviews/dex' },
  { id:'interview-netti', type:'INTERVIEW', title:'MC NETTI — INTERVIEW', duration:'10 DEC · 19:00 МСК', artist:'MC Netti', date:'2026-12-10', thumbnail:'/api/interviews/netti/poster', url:'/api/interviews/netti' },
  { id:'interview-rud', type:'INTERVIEW', title:'YUNG RUD — INTERVIEW', duration:'17 DEC · 19:00 МСК', artist:'Yung Rud', date:'2026-12-17', thumbnail:'/api/interviews/rudi/poster', url:'/api/interviews/rudi' },
  { id:'interview-daro', type:'INTERVIEW', title:'DON DARO — INTERVIEW', duration:'24 DEC · 19:00 МСК', artist:'Don Daro', date:'2026-12-24', thumbnail:'/api/interviews/daro/poster', url:'/api/interviews/daro' },
  { id:'interview-nadine', type:'INTERVIEW', title:'NADINE — INTERVIEW', duration:'31 DEC · 19:00 МСК', artist:'Nadine', date:'2026-12-31', thumbnail:'/api/interviews/nadine/poster', url:'/api/interviews/nadine' },
  { id:'trailer', type:'VIDEO', title:'SAINTFOUR RAP BATTLE — OFFICIAL TEASER', duration:'SOON', artist:'Saintfour', thumbnail:`${import.meta.env.BASE_URL}media/teaser.jpg`, url:'' },
]
const gallery = [
  { image:`${import.meta.env.BASE_URL}media/gallery-01.jpg`, label:'BACKSTAGE / 001' },
  { image:`${import.meta.env.BASE_URL}media/gallery-02.jpg`, label:'THE STAGE / 002' },
  { image:`${import.meta.env.BASE_URL}media/gallery-03.jpg`, label:'AFTER THE ROUND / 003' },
  { image:`${import.meta.env.BASE_URL}media/gallery-04.jpg`, label:'BEHIND THE SCENES / 004' },
]
// One optional low-volume background track, controlled explicitly by the visitor.
const soundPrefKey='sf27-sound-consent-v1'
const musicSource=`${import.meta.env.BASE_URL}media/audio/saintfour-background.m4a`

const hypePollIds=['scandal','punchlines','surprise','interview']
function completedHypeVotes(votes){
 return Boolean(votes&&typeof votes==='object'&&hypePollIds.every(id=>typeof votes[id]==='string'&&votes[id].length>0))
}
const nav = [
  { id:'home', name:'Главная', Icon:Home },
  { id:'artists', name:'Участники', Icon:Mic2 },
  { id:'battles', name:'Батлы', Icon:Flame },
  { id:'interviews', name:'Интервью', Icon:Clapperboard },
  { id:'polls', name:'Голосование', Icon:Vote },
  { id:'sponsors', name:'Партнёры', Icon:Radio },
]
function Cover({src, alt, className='', initials='', style={}}) {
  const [broken,setBroken]=useState(false)
  return <div className={`cover ${className}`} style={style}>{!broken && src ? <img src={src} alt={alt} onError={()=>setBroken(true)} /> : <div className="cover-fallback"><span className="cover-noise" /><strong>{initials || 'SF'}</strong><small>SAINTFOUR RAP BATTLE</small></div>}</div>
}
function SectionTitle({tag,title,action, onAction}){return <div className="section-heading"><div><p className="eyebrow"><span className="red-dot"/> {tag}</p><h2 className="glitch-heading" data-text={title}>{title}</h2></div>{action && <button className="text-button" onClick={onAction}>{action} <ArrowRight size={16}/></button>}</div>}
export default function App() {
 const [page,setPage]=useState('home')
 const musicRef=useRef(null)
 const musicFadeRef=useRef(null)
 const [soundChoice,setSoundChoice]=useState(()=>{
  try{
   const value=window.localStorage.getItem(soundPrefKey)
   return value==='on'||value==='off'?value:null
  }catch{return null}
 })
 const stopMusic=()=>{
  if(musicFadeRef.current!==null)window.cancelAnimationFrame(musicFadeRef.current)
  musicFadeRef.current=null
  const audio=musicRef.current
  if(audio){audio.pause();audio.volume=0}
 }
 const startMusic=()=>{
  const audio=musicRef.current
  if(!audio)return
  if(musicFadeRef.current!==null)window.cancelAnimationFrame(musicFadeRef.current)
  musicFadeRef.current=null
  const fadeIn=()=>{
   audio.volume=0
   const start=window.performance.now()
   const fade=(now)=>{
    if(audio.paused)return
    audio.volume=Math.min(.08,Math.max(0,(now-start)/1800*.08))
    if(audio.volume<.08)musicFadeRef.current=window.requestAnimationFrame(fade)
    else musicFadeRef.current=null
   }
   musicFadeRef.current=window.requestAnimationFrame(fade)
  }
  if(!audio.paused)return
  audio.volume=0
  const attempt=audio.play()
  if(attempt&&typeof attempt.then==='function')void attempt.then(fadeIn).catch(()=>{})
 }
 const chooseSound=(enabled)=>{
  const next=enabled?'on':'off'
  setSoundChoice(next)
  try{window.localStorage.setItem(soundPrefKey,next)}catch{/* private mode */}
  if(enabled)startMusic()
  else stopMusic()
 }
 useEffect(()=>{
  if(soundChoice==='on'){
   const audio=musicRef.current
   if(audio){
    audio.volume=0
    const attempt=audio.play()
    if(attempt&&typeof attempt.then==='function')void attempt.then(()=>{audio.volume=.08}).catch(()=>{})
   }
  }
  return ()=>{if(musicFadeRef.current!==null)window.cancelAnimationFrame(musicFadeRef.current)}
 // On reload, browsers may require another tap before playback; the control remains available.
 },[])
 const [menuOpen,setMenuOpen]=useState(false)
 const [selected,setSelected]=useState(null)
 const [howardMailOpen,setHowardMailOpen]=useState(false)
 const [activeVideo,setActiveVideo]=useState(null)
 const [premieres,setPremieres]=useState({})
 const [galleryIndex,setGalleryIndex]=useState(null)
 const [achievements,setAchievements]=useState(()=>{
   try { const saved=JSON.parse(window.localStorage.getItem('sf27-achievements-v1')||'{}'); return saved&&typeof saved==='object'?saved:{} } catch { return {} }
 })
 const [achievementToast,setAchievementToast]=useState(null)
 const unlockedCount=Number(Boolean(achievements.earlyBird))+Number(Boolean(achievements.loyalOne))+Number(Boolean(achievements.sideEffect))+Number(Boolean(achievements.whosWatching))
 const secretCount=Number(Boolean(achievements.sideEffect))+Number(Boolean(achievements.whosWatching))
 const openHowardMail=()=>{
   setHowardMailOpen(true)
   if(achievements.whosWatching)return
   setAchievements(prev=>{
     if(prev.whosWatching)return prev
     const next={...prev,whosWatching:true}
     try{window.localStorage.setItem('sf27-achievements-v1',JSON.stringify(next))}catch{/* private mode */}
     return next
   })
   setAchievementToast('whosWatching')
 }
 const unlockSideEffect=()=>{
   if(achievements.sideEffect)return
   setAchievements(prev=>{
     if(prev.sideEffect)return prev
     const next={...prev,sideEffect:true}
     try{window.localStorage.setItem('sf27-achievements-v1',JSON.stringify(next))}catch{/* private mode */}
     return next
   })
   setAchievementToast('sideEffect')
 }
 const unlockLoyalOne=(votes)=>{
   if(!completedHypeVotes(votes)||achievements.loyalOne)return
   setAchievements(prev=>{
     if(prev.loyalOne)return prev
     const next={...prev,loyalOne:true}
     try{window.localStorage.setItem('sf27-achievements-v1',JSON.stringify(next))}catch{/* private mode */}
     return next
   })
   setAchievementToast('loyalOne')
 }
 useEffect(()=>{
   if(achievements.loyalOne)return
   try{
     const saved=JSON.parse(window.localStorage.getItem('sfvs-hype-server-votes-v1')||'{}')
     if(completedHypeVotes(saved)){
       const t=window.setTimeout(()=>{
         setAchievements(prev=>{
           if(prev.loyalOne)return prev
           const next={...prev,loyalOne:true}
           try{window.localStorage.setItem('sf27-achievements-v1',JSON.stringify(next))}catch{/* private mode */}
           return next
         })
         setAchievementToast('loyalOne')
       },2200)
       return ()=>window.clearTimeout(t)
     }
   }catch{/* missing vote cache */}
 },[achievements.loyalOne])
 useEffect(()=>{
   // Moscow time: first interview premiere (03 Dec 2026, 19:00 MSK).
   const beforeFirstPremiere=Date.now()<Date.parse('2026-12-03T19:00:00+03:00')
   if(!beforeFirstPremiere || achievements.earlyBird)return
   const t=window.setTimeout(()=>{
     setAchievements(prev=>{
       if(prev.earlyBird)return prev
       const next={...prev,earlyBird:true}
       try {window.localStorage.setItem('sf27-achievements-v1',JSON.stringify(next))}catch{ /* private mode */ }
       return next
     })
     setAchievementToast('earlyBird')
   },6000)
   return ()=>window.clearTimeout(t)
 },[achievements.earlyBird])
 useEffect(()=>{
   if(!achievementToast)return undefined
   const t=window.setTimeout(()=>setAchievementToast(null),10000)
   return ()=>window.clearTimeout(t)
 },[achievementToast])

 useEffect(()=>{
   const tg=window.Telegram?.WebApp
   if(!tg)return
   tg.ready();tg.expand()
   tg.setHeaderColor?.('#09090d');tg.setBackgroundColor?.('#09090d')
 },[])
 useEffect(()=>{
   let live=true
   let releaseTimer
   async function refreshPremieres(){
     try {
       const response=await fetch('/api/interviews/status',{cache:'no-store'})
       if(!response.ok)throw Error('status unavailable')
       const data=await response.json()
       if(!live)return
       setPremieres(data.premieres || {})
       clearTimeout(releaseTimer)
       const next=Object.values(data.premieres || {}).filter(x=>!x.available).map(x=>Date.parse(x.at)-Date.parse(data.serverTime)).filter(ms=>ms>=0).sort((a,b)=>a-b)[0]
       if(next!==undefined)releaseTimer=setTimeout(refreshPremieres,Math.min(next+250,2147483000))
     }catch{if(live)setPremieres({})} // No trusted backend means fail closed.
   }
   refreshPremieres()
   const interval=setInterval(refreshPremieres,60000)
   const onFocus=()=>{if(document.visibilityState==='visible')refreshPremieres()}
   document.addEventListener('visibilitychange',onFocus)
   return ()=>{live=false;clearInterval(interval);clearTimeout(releaseTimer);document.removeEventListener('visibilitychange',onFocus)}
 },[])
 const openInterview=(item)=>{
   if(!item.url || !premieres[item.id.replace('interview-','')]?.available)return
   setActiveVideo(item)
 }
 useEffect(()=>{window.scrollTo({top:0,behavior:'smooth'})},[page])
 useEffect(()=>{const onKey=e=>{if(e.key==='Escape'){if(howardMailOpen){setHowardMailOpen(false)}else{setSelected(null);setActiveVideo(null);setGalleryIndex(null)}} if(galleryIndex!==null){if(e.key==='ArrowRight')setGalleryIndex(i=>(i+1)%gallery.length);if(e.key==='ArrowLeft')setGalleryIndex(i=>(i+gallery.length-1)%gallery.length)}};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[galleryIndex,howardMailOpen])
 const filteredMedia=useMemo(()=>media.filter(m=>m.type==='INTERVIEW'),[])
 const go=(p)=>{setPage(p);setMenuOpen(false)}
 return <div className="app">
  <audio ref={musicRef} src={musicSource} preload="none" loop aria-hidden="true"/>
  {soundChoice===null&&<div className="sound-consent-backdrop"><section className="sound-consent-dialog" role="dialog" aria-modal="true" aria-labelledby="sound-consent-title" aria-describedby="sound-consent-description"><div className="sound-consent-scanline" aria-hidden="true"/><div className="sound-consent-icon"><AudioLines size={29}/></div><span className="sound-consent-kicker">SAINTFOUR / AUDIO EXPERIENCE</span><h2 id="sound-consent-title">MAKE SOME <em>NOISE.</em></h2><p id="sound-consent-description">На сайте может играть тихая фоновая музыка. Включить её или оставить сайт без звука? Никаких сигналов при ачивках и секретках больше нет.</p><div className="sound-consent-actions"><button type="button" className="sound-consent-enable" onClick={()=>chooseSound(true)}><Volume2 size={18}/> ВКЛЮЧИТЬ МУЗЫКУ</button><button type="button" className="sound-consent-silent" onClick={()=>chooseSound(false)}><VolumeX size={17}/> БЕЗ МУЗЫКИ</button></div><small>Выбор сохранится. Музыку можно включить или выключить в шапке сайта в любой момент. Рекламные видео останутся без звука.</small></section></div>}
  <div className="top-strip"><span>GOSSIP SAINTFOUR PRESENTS</span><span className="top-right"><span className="live-dot"/><span className="top-strip-slogan">THE UNDERGROUND IS CALLING</span></span></div>
  <header className="header"><button className="logo" onClick={()=>go('home')} aria-label="На главную"><span className="logo-mark">SF<span>✳</span></span><span className="logo-type">SAINTFOUR<strong>RAP BATTLE <i>’27</i></strong></span></button><nav className="desktop-nav" aria-label="Навигация">{nav.map(n=><button key={n.id} className={page===n.id?'active':''} onClick={()=>go(n.id)}>{n.name}</button>)}</nav><div className="header-actions"><span className="edition">VOL. 001 / 2027</span><button className="sound-toggle sound-toggle-header" type="button" onClick={()=>chooseSound(soundChoice!=='on')} aria-label={soundChoice==='on'?'Выключить фоновую музыку':'Включить фоновую музыку'} aria-pressed={soundChoice==='on'} title={soundChoice==='on'?'Выключить музыку':'Включить музыку'}>{soundChoice==='on'?<Volume2 size={16}/>:<VolumeX size={16}/>} <span>MUSIC {soundChoice==='on'?'ON':'OFF'}</span></button><button className="mobile-menu-button" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Меню">{menuOpen?<X/>:<Menu/>}</button></div></header>
  {menuOpen&&<nav className="mobile-nav" aria-label="Мобильная навигация">{nav.map(n=><button key={n.id} onClick={()=>go(n.id)}><n.Icon size={17}/>{n.name}<ArrowRight size={16}/></button>)}{unlockedCount>0&&<button onClick={()=>go("achievements")}><Trophy size={17}/>Достижения <span className="achievement-menu-count">{unlockedCount} / 5</span><ArrowRight size={16}/></button>}</nav>}
  <main>
  {page==='achievements'&&<section className="achievements-page wrap">
    <div className="achievement-page-top"><button type="button" onClick={()=>go('home')} className="achievement-return"><ArrowRight size={16}/> НАЗАД НА ГЛАВНУЮ</button><span>SAINTFOUR / SECRET ACCESS</span></div>
    <div className="achievement-page-hero"><span className="achievement-page-eyebrow">THE UNDERGROUND HAS SECRETS</span><h1 className="achievement-title-glitch" data-text="YOUR ACHIEVEMENTS.">YOUR <em>ACHIEVEMENTS.</em></h1><p>Исследуй Saintfour Rap Battle, участвуй в жизни шоу и собирай достижения. Некоторые находятся на виду. Другие придётся поискать.</p>
     <div className="achievement-progress"><strong>{unlockedCount} <span>/ 05</span></strong><div className="achievement-track"><div style={{width:`${unlockedCount*20}%`}}/></div><span>DISCOVERED</span></div>
    </div>
    <div className="achievement-category-nav" aria-label="Категории достижений"><a href="#sf-achievement-active" onClick={e=>{e.preventDefault();document.getElementById('sf-achievement-active')?.scrollIntoView({behavior:'smooth',block:'start'})}}>ЗА АКТИВНОСТЬ <span>{unlockedCount} / 2</span></a><a href="#sf-achievement-secrets" onClick={e=>{e.preventDefault();document.getElementById('sf-achievement-secrets')?.scrollIntoView({behavior:'smooth',block:'start'})}}>СЕКРЕТНЫЕ <span>{secretCount} / 3</span></a></div>
    <section className="achievement-category" id="sf-achievement-active">
      <div className="achievement-category-heading"><div><span className="achievement-category-kicker">01 / THE PARTICIPANTS</span><h2>ЗА <em>АКТИВНОСТЬ.</em></h2><p>Посещай сайт, участвуй в голосованиях и следи за премьерами.</p></div><span className="achievement-category-count">{String(unlockedCount).padStart(2,'0')} <i>/ 02</i></span></div>
      <div className="achievement-collection">
        <article className={'achievement-item achievement-tier-1 '+(achievements.earlyBird?'is-earned':'is-locked')}><div className="achievement-emblem">{achievements.earlyBird?<div className="sf-medallion"><span className="sf-medallion-rays" aria-hidden="true">✦</span><Ticket size={27} strokeWidth={1.6}/><i>01</i></div>:<LockKeyhole size={27}/>}</div><div className="achievement-item-copy"><span>ACHIEVEMENT / 001</span><h2>{achievements.earlyBird?'EARLY BIRD':'UNDISCOVERED'}</h2><p>{achievements.earlyBird?'Ты был здесь ещё до первой премьеры. Похоже, ты знаешь, где начинается самое интересное.':'Его время ещё придёт.'}</p></div><div className="achievement-status">{achievements.earlyBird?<><CheckCircle2 size={16}/> UNLOCKED</>:'LOCKED'}</div></article>
        <article className={'achievement-item achievement-tier-2 '+(achievements.loyalOne?'is-earned':'is-locked')}><div className="achievement-emblem">{achievements.loyalOne?<div className="sf-medallion sf-medallion-loyal"><span className="sf-medallion-rays" aria-hidden="true">✦</span><Vote size={27} strokeWidth={1.6}/><i>02</i></div>:<LockKeyhole size={27}/>}</div><div className="achievement-item-copy"><span>ACHIEVEMENT / 002</span><h2>THE LOYAL ONE</h2><p>{achievements.loyalOne?'Все четыре предварительных голосования пройдены. У Сентфора появился настоящий преданный фанат.':'Прими участие во всех четырёх голосованиях PRE-BATTLE HYPE.'}</p></div><div className="achievement-status">{achievements.loyalOne?<><CheckCircle2 size={16}/> UNLOCKED</>:'LOCKED'}</div></article>
      </div>
    </section>
    <section className="achievement-category achievement-category-secrets" id="sf-achievement-secrets">
      <div className="achievement-category-heading"><div><span className="achievement-category-kicker">02 / THE HIDDEN FILES</span><h2>СЕКРЕТНЫЕ <em>НАХОДКИ.</em></h2><p>Некоторые детали заметят только самые внимательные.</p></div><span className="achievement-category-count">{String(secretCount).padStart(2,'0')} <i>/ 03</i></span></div>
      <div className="achievement-collection">
        <article className={'achievement-item achievement-tier-3 '+(achievements.sideEffect?'is-earned':'is-locked')}><div className="achievement-emblem">{achievements.sideEffect?<div className="sf-medallion sf-medallion-side-effect"><span className="sf-medallion-rays" aria-hidden="true">✦</span><FlaskConical size={27} strokeWidth={1.6}/><i>03</i></div>:<LockKeyhole size={27}/>}</div><div className="achievement-item-copy"><span>ACHIEVEMENT / 003</span><h2>{achievements.sideEffect?'SIDE EFFECT':'UNDISCOVERED'}</h2><p>{achievements.sideEffect?'Экспериментальная партия BLACK HELLEBORE 00 обнаружена. Производитель предпочёл бы об этом умолчать.':'Секрет ещё не раскрыт.'}</p></div><div className="achievement-status">{achievements.sideEffect?<><CheckCircle2 size={16}/> UNLOCKED</>:'LOCKED'}</div></article>
        <article className={'achievement-item achievement-tier-4 '+(achievements.whosWatching?'is-earned':'is-locked')}><div className="achievement-emblem">{achievements.whosWatching?<div className="sf-medallion sf-medallion-whos-watching"><span className="sf-medallion-rays" aria-hidden="true">✦</span><Mail size={27} strokeWidth={1.6}/><i>04</i></div>:<LockKeyhole size={27}/>}</div><div className="achievement-item-copy"><span>ACHIEVEMENT / 004</span><h2>{achievements.whosWatching?"WHO'S WATCHING?":'UNDISCOVERED'}</h2><p>{achievements.whosWatching?'Ты нашёл письмо, которое Поппи не собиралась показывать. Кто зарегистрировал MC NETTI — до сих пор неизвестно.':'Секрет ещё не раскрыт.'}</p></div><div className="achievement-status">{achievements.whosWatching?<><CheckCircle2 size={16}/> UNLOCKED</>:'LOCKED'}</div></article>
        <article className="achievement-item is-locked achievement-tier-5"><div className="achievement-emblem"><LockKeyhole size={27}/></div><div className="achievement-item-copy"><span>ACHIEVEMENT / 005</span><h2>UNDISCOVERED</h2><p>Секрет ещё не раскрыт.</p></div><div className="achievement-status">LOCKED</div></article>
      </div>
    </section>
    <div className="achievement-reward"><div><span>FINAL REWARD / COLLECTION 01</span><h2><Ticket size={25}/> ALL ACCESS TICKET</h2><p>Коллекционный билет на шоу откроется, когда ты соберёшь всю первую коллекцию. Само шоу бесплатно для всех.</p></div><span className="achievement-reward-lock"><LockKeyhole size={17}/> LOCKED / {unlockedCount} OF 5</span></div>
    <div className="achievement-testing"><div className="achievement-replay-row">{achievements.earlyBird&&<button type="button" className="achievement-replay" onClick={()=>{setAchievementToast('earlyBird');go('home')}}><Sparkles size={15}/> ПОВТОРИТЬ EARLY BIRD</button>}{achievements.loyalOne&&<button type="button" className="achievement-replay" onClick={()=>{setAchievementToast('loyalOne');go('home')}}><Vote size={15}/> ПОВТОРИТЬ THE LOYAL ONE</button>}{achievements.sideEffect&&<button type="button" className="achievement-replay" onClick={()=>{setAchievementToast('sideEffect');go('home')}}><FlaskConical size={15}/> ПОВТОРИТЬ SIDE EFFECT</button>}{achievements.whosWatching&&<button type="button" className="achievement-replay" onClick={()=>{setAchievementToast('whosWatching');go('home')}}><Mail size={15}/> ПОВТОРИТЬ WHO'S WATCHING?</button>}</div><p className="achievement-local-note">Пока достижения сохраняются только в этом браузере. Это первая тестовая версия механики.</p></div>
   </section>}
  {page==='home'&&<>
   <CreditsTicker/>
   <section className="hero"><div className="hero-photo-soft" aria-hidden="true"/><div className="hero-grid"/><div className="hero-flare"/><div className="hero-inner"><div className="hero-copy"><div className="hero-tag"><span className="status-pulse"/> THE STREETS HAVE A VOICE <span className="hero-tag-end">EST. SAINTFOUR</span></div><p className="hero-overline">GOSSIP SAINTFOUR ORIGINAL PRODUCTION</p><h1><span className="glitch-line" data-text="NO">NO</span><br/><span className="glitch-line" data-text="MORE">MORE</span><br/><em className="hero-glitch" data-text="SILENCE.">SILENCE<span>.</span></em></h1><p className="hero-subtitle">Четыре имени. Один микрофон. Никаких правил.<br/>SAINTFOUR RAP BATTLE <strong>’27</strong> — скоро.</p><div className="hero-buttons"><button className="primary-btn" onClick={()=>go('artists')}>УЗНАТЬ УЧАСТНИКОВ <ArrowRight size={17}/></button><button className="secondary-btn" onClick={()=>go('interviews')}><Clapperboard size={15}/> РАСПИСАНИЕ ИНТЕРВЬЮ</button></div></div></div><div className="hero-bottom"><span>SCROLL TO EXPLORE <ArrowDownRight size={15}/></span><span>INDEPENDENT UNDERGROUND SHOW — 2027</span></div></section>
   <BattleTicker/>
   <section className="section wrap"><SectionTitle tag="01 / THE LINEUP" title="MEET THE CONTENDERS" action="ВСЕ УЧАСТНИКИ" onAction={()=>go('artists')}/><div className="artist-grid">{rappers.map(r=><ArtistCard key={r.id} r={r} onClick={()=>setSelected(r)}/>)}</div><HostFeature onClick={()=>setSelected(host)}/></section>
   <section className="section wrap"><SectionTitle tag="02 / ON THE RECORD" title="BEHIND THE MIC" action="ВСЕ ИНТЕРВЬЮ" onAction={()=>go('interviews')}/><div className="home-interview-spotlight"><div><span className="home-interview-eyebrow">NEXT ON THE MIC <span>✳</span> PREMIERE / 001</span><p>Первым к микрофону выходит LIL DEX. Что он скажет до начала батла?</p></div><span className="home-interview-date">03 DEC <small>19:00 МСК</small></span></div><div className="media-grid home-interview-grid">{media.slice(0,1).map(m=><MediaCard key={m.id} m={m} available={Boolean(premieres[m.id.replace('interview-','')]?.available)} onClick={()=>openInterview(m)}/>)}</div></section>
   <section className="promo-band promo-band-video"><video className="promo-band-background" autoPlay muted loop playsInline preload="metadata" aria-hidden="true"><source src={`${import.meta.env.BASE_URL}media/promo/rap-battle-promo.mp4`} type="video/mp4" /></video><div className="promo-band-shade" aria-hidden="true"/><div className="wrap promo-content"><div><p className="eyebrow"><span className="red-dot"/> HAVE YOUR SAY</p><h2><span className="glitch-line" data-text="WHO RUNS">WHO RUNS</span><br/><em className="glitch-line" data-text="THIS TOWN?">THIS TOWN?</em></h2><p>Батлы впереди. Но у Сентфора уже есть своё мнение. А у тебя?</p></div><button className="primary-btn light-btn" onClick={()=>go('polls')}>ГОЛОСОВАТЬ СЕЙЧАС <ArrowRight size={18}/></button></div></section>
   <section className="section wrap sponsors-home"><SectionTitle tag="03 / POWERED BY" title="THE PEOPLE BEHIND THE NOISE" action="ВСЕ ПАРТНЁРЫ" onAction={()=>go('sponsors')}/><SponsorsShowcase compact onSecretFound={unlockSideEffect}/></section>
  </>}
  {page==='artists'&&<section className="inner-page wrap"><PageHeading number="01" tag="THE LINEUP" title={<><span className="glitch-line" data-text="FOUR NAMES.">FOUR NAMES.</span><br/><em className="glitch-line" data-text="ONE STAGE.">ONE STAGE.</em></>} intro="Знакомься с участниками SAINTFOUR RAP BATTLE ’27. У каждого своя история и своя причина выйти к микрофону."/><div className="artist-grid">{rappers.map(r=><ArtistCard key={r.id} r={r} onClick={()=>setSelected(r)}/>)}</div><HostFeature onClick={()=>setSelected(host)}/><p className="page-footnote">* Состав и сценические псевдонимы могут уточняться по мере подготовки шоу.</p></section>}
  {page==='battles'&&<section className="inner-page wrap battles-page"><PageHeading number="02" tag="THE BATTLES" title={<><span className="battle-title-word glitch-line" data-text="THREE">THREE</span>{' '}<span className="battle-title-word glitch-line" data-text="BATTLES.">BATTLES.</span><br/><em className="battle-title-word glitch-line" data-text="ONE">ONE</em>{' '}<em className="battle-title-word glitch-line" data-text="WINNER.">WINNER.</em></>} intro="Два первых противостояния определят участников финала. Кто выйдет на сцену в третьем батле — решат результаты первых двух."/>
    <div className="battle-match-grid">
      <BattleMatch number="01" name="FIRST CLASH" left={rappers[0]} right={rappers[1]}/>
      <BattleMatch number="02" name="SECOND CLASH" left={rappers[2]} right={rappers[3]}/>
      <BattleMatch number="03" name="THE FINAL" final/>
    </div>
    <p className="battle-page-note">Победители первого и второго батлов встретятся в финале. Даты премьер объявим отдельно.</p>
  </section>}
  {page==='interviews'&&<section className="inner-page wrap"><PageHeading number="03" tag="ON THE RECORD" title={<><span className="glitch-line" data-text="ALL ACCESS.">ALL ACCESS.</span><br/><em className="glitch-line" data-text="NO FILTER.">NO FILTER.</em></>} intro="Пять интервью: по одному с каждым из четырёх рэперов и отдельный выпуск с Надин. Новая премьера каждый четверг в 19:00 МСК с 3 декабря 2026 года. Порядок участников пока предварительный."/><div className="interview-schedule-note">5 ВЫПУСКОВ <span>✳</span> 03 / 10 / 17 / 24 / 31 DEC 2026 <span>✳</span> 19:00 МСК</div><div className="media-grid">{filteredMedia.map(m=><MediaCard key={m.id} m={m} available={Boolean(premieres[m.id.replace('interview-','')]?.available)} onClick={()=>openInterview(m)}/>)}</div><p className="page-footnote">Каждое интервью становится доступным в 19:00 МСК в день указанной премьеры.</p></section>}
  {page==='gallery'&&<section className="inner-page wrap"><PageHeading number="03" tag="THE ARCHIVE" title={<><span className="glitch-line" data-text="FREEZE">FREEZE</span><br/><em className="glitch-line" data-text="THE MOMENT.">THE MOMENT.</em></>} intro="Фотографии со сцены, бэкстейджа и съёмок. Настоящие кадры добавим по мере готовности."/><div className="gallery-grid">{gallery.map((g,i)=><button className={'gallery-tile tile-'+i} key={g.label} onClick={()=>setGalleryIndex(i)}><Cover src={g.image} alt={g.label} initials={String(i+1).padStart(2,'0')}/><span>{g.label} <ArrowRight size={16}/></span></button>)}</div></section>}
  {page==='sponsors'&&<section className="inner-page wrap sponsors-page"><PageHeading number="06" tag="POWERED BY" title={<><span className="glitch-heading" data-text="BACKED BY">BACKED BY</span><br/><em className="glitch-heading" data-text="THE CULTURE.">THE CULTURE.</em></>} intro="WARLOCK, BLACK HELLEBORE ENERGY и GOSSIP SAINTFOUR — бренды и партнёры нашего фанатского рэп-шоу."/><SponsorsShowcase onSecretFound={unlockSideEffect}/></section>}
  {page==='polls'&&<section className="inner-page wrap official-voting-page"><PageHeading number="04" tag="YOUR VOTE MATTERS" title={<><span className="glitch-line" data-text="WHO WINS?">WHO WINS?</span><br/><em className="glitch-line" data-text="YOU DECIDE.">YOU DECIDE.</em></>} intro="Прогнозы до премьеры уже открыты! А официальные голосования за победителей начнутся после выхода соответствующих выпусков."/>
    <HypePolls onVotesChanged={unlockLoyalOne}/>
    <div className="official-voting-intro" aria-labelledby="official-voting-title">
      <div className="official-voting-intro-copy"><span className="official-voting-kicker"><span className="official-voting-live-dot"/> THE MAIN EVENT / COMING SOON</span><h2 id="official-voting-title">OFFICIAL <em>VOTING.</em></h2><p>Прогнозы закончились. Теперь решать тебе, кто пройдёт дальше. Голосование откроется после выхода каждого батла.</p></div>
      <div className="official-voting-seal" aria-hidden="true"><span>SF</span><strong>VS</strong><small>THE VERDICT</small></div>
    </div>
    <div className="vote-rules-strip"><span><Vote size={18}/> OFFICIAL VOTING</span><span>48 ЧАСОВ НА ГОЛОСОВАНИЕ</span><span>TELEGRAM + SAINTFOUR VS</span></div>
    <div className="official-vote-grid">
      <OfficialVoteCard number="01" first={rappers[0]} second={rappers[1]}/>
      <OfficialVoteCard number="02" first={rappers[2]} second={rappers[3]}/>
      <OfficialVoteCard number="03" final/>
    </div>
    <div className="vote-explanation"><div><strong>КАК ПРОХОДИТ ГОЛОСОВАНИЕ?</strong><p>После выхода батла появятся голосования на сайте и в Telegram. Они будут открыты в течение 48 часов. Победители первых двух батлов проходят в финал.</p></div><div><strong>КОГДА МОЖНО ГОЛОСОВАТЬ?</strong><p>Пока официальные голосования закрыты. Они откроются после премьер соответствующих выпусков — тогда и можно будет отдать свой голос за победителя.</p></div></div>
  </section>}
  </main>
  <footer className="footer"><div className="wrap footer-main"><div><span className="footer-logo">SAINTFOUR</span><p>RAP BATTLE <b>’27</b></p><small>AN ORIGINAL GOSSIP SAINTFOUR PROJECT</small></div><div className="footer-nav">{nav.slice(1).map(n=><button key={n.id} onClick={()=>go(n.id)}>{n.name}</button>)}{unlockedCount>0&&<button className="achievement-footer-link" onClick={()=>go('achievements')}><Trophy size={14}/> Достижения <span>{unlockedCount}/5</span></button>}</div><div className="footer-stamp"><Radio size={23}/><span>UNDERGROUND<br/>NEVER DIES.</span></div></div><div className="wrap footer-bottom"><span>© {2027} GOSSIP SAINTFOUR. FAN PROJECT.</span><span>MADE FOR THE CULTURE. NOT FOR THE CLOUT.</span></div></footer>
  <nav className="bottom-nav" aria-label="Быстрая навигация">{nav.filter(n=>['home','artists','battles','interviews','polls'].includes(n.id)).map(n=><button key={n.id} onClick={()=>go(n.id)} className={page===n.id?'active':''}><n.Icon size={19}/><span>{n.name}</span></button>)}</nav>
  {achievementToast&&<div className={`achievement-toast achievement-tier-${achievementToast==='whosWatching'?4:achievementToast==='sideEffect'?3:achievementToast==='loyalOne'?2:1}`} role="status" aria-live="polite"><button className="achievement-toast-main" type="button" onClick={()=>{setAchievementToast(null);setHowardMailOpen(false);setSelected(null);go('achievements')}}><div className="achievement-toast-medal"><div className="sf-medallion"><span className="sf-medallion-rays" aria-hidden="true">✦</span>{achievementToast==='whosWatching'?<Mail size={23} strokeWidth={1.6}/>:achievementToast==='sideEffect'?<FlaskConical size={23} strokeWidth={1.6}/>:achievementToast==='loyalOne'?<Vote size={23} strokeWidth={1.6}/>:<Ticket size={23} strokeWidth={1.6}/>}<i>{achievementToast==='whosWatching'?'04':achievementToast==='sideEffect'?'03':achievementToast==='loyalOne'?'02':'01'}</i></div></div><div className="achievement-toast-copy"><span>NEW ACHIEVEMENT <i>{achievementToast==='whosWatching'?'04':achievementToast==='sideEffect'?'03':achievementToast==='loyalOne'?'02':'01'} / 05</i></span><strong>{achievementToast==='whosWatching'?"WHO'S WATCHING?":achievementToast==='sideEffect'?'SIDE EFFECT':achievementToast==='loyalOne'?'THE LOYAL ONE':'EARLY BIRD'}</strong><small>{achievementToast==='whosWatching'?'Засекреченное письмо найдено':achievementToast==='sideEffect'?'Секретная формула найдена':achievementToast==='loyalOne'?'Все четыре голоса учтены':'Ты успел до первой премьеры'} <ArrowRight size={13}/></small></div></button><button type="button" className="achievement-toast-dismiss" aria-label="Закрыть уведомление" onClick={()=>setAchievementToast(null)}><X size={16}/></button></div>}
  {selected&&<div className="modal-backdrop" onClick={()=>setSelected(null)}><section className="artist-modal" role="dialog" aria-modal="true" aria-label={selected.stage} onClick={e=>e.stopPropagation()}><button className="close-btn" onClick={()=>setSelected(null)} aria-label="Закрыть"><X/></button><Cover key={selected.id+'-'+(selected.profileImage||selected.image)} src={selected.profileImage?selected.profileImage+'?v=2':selected.image} initials={selected.initials} alt={selected.stage}/><div className="artist-modal-body"><span className="eyebrow">{selected.isHost?'HOST / SHOW PRESENTER':`CONTESTANT / ${selected.number}`}</span><h2 className="glitch-heading" data-text={selected.stage}>{selected.stage}</h2><p className="modal-realname">{selected.name}</p><div className="modal-rule"/><p>{selected.description}</p><strong>{selected.subtitle}</strong>{selected.id==='netti'&&<button type="button" className="howard-mail-teaser" onClick={openHowardMail} aria-label="Открыть архивное письмо Поппи о регистрации MC NETTI"><span className="howard-mail-teaser-icon"><Mail size={19}/></span><span className="howard-mail-teaser-copy"><small>POPPY'S INBOX / CASE 027</small><b>РЕГИСТРАЦИЯ БЕЗ ОТПРАВИТЕЛЯ</b><span>Одно письмо. Никакого объяснения.</span></span><ArrowRight className="howard-mail-teaser-arrow" size={17}/></button>}</div></section></div>}
  {howardMailOpen&&<div className="howard-mail-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setHowardMailOpen(false)}}><section className="howard-mail-dialog" role="dialog" aria-modal="true" aria-labelledby="howard-mail-title"><div className="howard-mail-toolbar"><span><Mail size={15}/> POPPY / ARCHIVED MAIL</span><button type="button" autoFocus onClick={()=>setHowardMailOpen(false)} aria-label="Закрыть архивное письмо"><X size={20}/></button></div><div className="howard-mail-paper"><div className="howard-mail-stamp"><span>INBOX / UNSOLICITED</span><strong>FILE #027</strong></div><span className="howard-mail-kicker"><FileWarning size={14}/> RECOVERED MESSAGE · SENDER NOT VERIFIED</span><h2 id="howard-mail-title" className="howard-mail-glitch" data-text="UNKNOWN SENDER.">UNKNOWN <em>SENDER.</em></h2><div className="howard-mail-headers"><div><span>TO</span><strong>POPPY / SAINTFOUR RAP BATTLE</strong></div><div><span>FROM</span><strong className="howard-mail-redaction">████████@██████.███ <small>IDENTITY HIDDEN</small></strong></div><div><span>RECEIVED</span><strong>19 NOV 2026 · 02:17</strong></div><div><span>SUBJECT</span><strong>REGISTRATION CONFIRMATION / MC NETTI</strong></div></div><div className="howard-mail-content"><p>Здравствуйте, Поппи.</p><p>Направляем подтверждение регистрации участника <b>NATHANIEL HOWARD</b> под сценическим именем <b>MC NETTI</b> для SAINTFOUR RAP BATTLE ’27.</p><p>Участие согласовано. Представитель участника просил не связываться с ним до публикации состава. Все дальнейшие уведомления направляйте организатору шоу.</p><p>В случае вопросов используйте идентификатор заявки <b>SF–027–H</b>.</p><p className="howard-mail-signature">С уважением,<br/><span>ИМЯ ОТПРАВИТЕЛЯ УДАЛЕНО</span></p></div><div className="howard-mail-alert"><Eye size={17}/><div><strong>НЕСООТВЕТСТВИЕ / 01</strong><span>Личность отправителя не установлена. Подтверждение от самого Говарда отсутствует.</span></div></div><div className="howard-mail-bottom"><span>ATTACHMENT / REGISTRATION_SF027.pdf</span><span>ACCESS DENIED — FILE REMOVED</span></div><p className="howard-mail-poppy-note">Заметка Поппи: «И вот после такого мне говорят, что он сам не записывался. Тогда кто это отправил?»</p></div></section></div>}
  {activeVideo&&<div className="modal-backdrop" onClick={()=>setActiveVideo(null)}><section className="video-modal" role="dialog" aria-modal="true" aria-label={activeVideo.title} onClick={e=>e.stopPropagation()}><button className="close-btn" onClick={()=>setActiveVideo(null)} aria-label="Закрыть"><X/></button>{activeVideo.url?<video controls playsInline autoPlay src={activeVideo.url}/>:<div className="video-unavailable"><Play size={42}/><h3>COMING SOON</h3><p>Видео ещё не опубликовано.</p></div>}<h3>{activeVideo.title}</h3></section></div>}
  {galleryIndex!==null&&<div className="modal-backdrop" onClick={()=>setGalleryIndex(null)}><section className="lightbox" role="dialog" aria-modal="true" aria-label="Просмотр фотографии" onClick={e=>e.stopPropagation()}><button className="close-btn" onClick={()=>setGalleryIndex(null)} aria-label="Закрыть"><X/></button><Cover src={gallery[galleryIndex].image} initials={String(galleryIndex+1).padStart(2,'0')} alt={gallery[galleryIndex].label}/><div className="lightbox-controls"><button onClick={()=>setGalleryIndex((galleryIndex+gallery.length-1)%gallery.length)} aria-label="Предыдущее"><ChevronLeft/></button><span>{gallery[galleryIndex].label} — {galleryIndex+1}/{gallery.length}</span><button onClick={()=>setGalleryIndex((galleryIndex+1)%gallery.length)} aria-label="Следующее"><ChevronRight/></button></div></section></div>}
 </div>
}
function OfficialVoteCard({number,first,second,final=false}){
 return <article className={'official-vote-card '+(final?'official-vote-final':'')}>
   <div className="official-vote-head"><span>VOTING / {number}</span><span className="official-vote-status"><span className="official-vote-dot"/> СКОРО</span></div>
   <div className="official-vote-fighters">
     {final?<>
       <div className="official-vote-person mystery"><div className="vote-question">?</div><strong>ПОБЕДИТЕЛЬ 01</strong></div>
       <span className="official-vs">VS</span>
       <div className="official-vote-person mystery"><div className="vote-question">?</div><strong>ПОБЕДИТЕЛЬ 02</strong></div>
     </>:<>
       <div className="official-vote-person"><img src={first.image} alt={first.stage}/><strong>{first.stage}</strong></div>
       <span className="official-vs">VS</span>
       <div className="official-vote-person"><img src={second.image} alt={second.stage}/><strong>{second.stage}</strong></div>
     </>}
   </div>
   <div className="official-vote-foot"><span>{final?'ГОЛОСОВАНИЕ ЗА ПОБЕДИТЕЛЯ ШОУ':'КТО ПРОЙДЁТ В ФИНАЛ?'}</span><span>48H VOTE WINDOW</span></div>
   <div className="official-vote-locked"><span>ГОЛОСОВАНИЕ ЕЩЁ НЕ ОТКРЫТО</span><span>ОЖИДАЕМ ПРЕМЬЕРУ</span></div>
 </article>
}
function BattleMatch({number,name,left,right,final=false}){
 const teasers = {
  '01': {headline:'ХАОС ПРОТИВ КОНТРОЛЯ.', description:'Один привык нарушать правила. Другой — устанавливать их. Но на этой сцене ни деньги, ни репутация не дают преимущества.'},
  '02': {headline:'АМБИЦИИ ПРОТИВ ОПЫТА.', description:'Капитан привык побеждать на площадке. Даррен — играть по собственным правилам. Кто из них сумеет захватить сцену?'},
  '03': {headline:'ДВОЕ ОСТАНУТСЯ. ПОБЕДИТ ОДИН.', description:'Победители первых двух батлов встретятся в решающем противостоянии. Имена пока неизвестны.'},
 }
 const teaser=teasers[number]
 return <article className={'battle-match '+(final?'battle-match-final':'')}>
  <div className="battle-match-top"><span>VERSUS / {number}</span><span>{name}</span></div>
  <div className="battle-match-stage">
    {final?<>
      <div className="battle-fighter battle-fighter-unknown"><div className="battle-silhouette">?</div><span>ПОБЕДИТЕЛЬ<br/>БАТЛА 01</span></div>
      <div className="battle-versus">VS</div>
      <div className="battle-fighter battle-fighter-unknown"><div className="battle-silhouette">?</div><span>ПОБЕДИТЕЛЬ<br/>БАТЛА 02</span></div>
    </>:<>
      <div className="battle-fighter"><img src={left.image} alt={left.stage}/><span>{left.stage}</span></div>
      <div className="battle-versus">VS</div>
      <div className="battle-fighter"><img src={right.image} alt={right.stage}/><span>{right.stage}</span></div>
    </>}
  </div>
  <div className="battle-match-teaser"><span className="battle-match-teaser-label">THE STORY / {number}</span><h3>{teaser.headline}</h3><p>{teaser.description}</p></div>
  <div className="battle-match-bottom"><strong>{final?'ФИНАЛ / СОСТАВ ОПРЕДЕЛЯЕТСЯ':'ПРОТИВОСТОЯНИЕ ПОДТВЕРЖДЕНО'}</strong><span>{final?'TO BE DECIDED':'PREMIERE TBA'}</span></div>
 </article>
}
function HostFeature({onClick}){return <section className="host-feature" aria-label="Ведущая шоу"><div className="host-feature-heading"><span>05 / THE HOST</span><span>THE ONE HOLDING THE MIC ✳</span></div><button className="host-card" onClick={onClick}><div className="host-portrait"><Cover src={host.image} alt="Поппи Эмерсон" initials="PE"/></div><div className="host-content"><span className="host-role">NOT A CONTESTANT — THE HOST</span><h3 className="glitch-heading" data-text="POPPY EMERSON">POPPY EMERSON</h3><p>Пенелопа (Поппи) Эмерсон</p><span className="host-caption">SHE RUNS THE SHOW.</span><span className="host-action">ПОЗНАКОМИТЬСЯ С ВЕДУЩЕЙ <ArrowRight size={17}/></span></div></button></section>}
function ArtistCard({r,onClick}){return <button className="artist-card" onClick={onClick} style={{'--artist-color':r.color}}><Cover src={r.image} alt={r.stage} initials={r.initials}/><div className="artist-vignette"/><div className="artist-number">{r.number} / 04</div><div className="artist-info"><span>{r.role}</span><h3 className="glitch-label" data-text={r.stage}>{r.stage}</h3><p>{r.name}</p><div className="artist-action">VIEW PROFILE <ArrowRight size={16}/></div></div></button>}
function MediaCard({m,onClick,available=false}){return <button className={'media-card '+(!available?'media-locked':'')} onClick={onClick} disabled={!available} aria-label={available?`Смотреть ${m.title}`:`${m.title} — премьера ${m.duration}`}><div className="media-image">{available?<Cover src={m.thumbnail} alt={m.title} initials="INT"/>:<div className="interview-locked-art" aria-hidden="true"><span className="locked-show-name">SAINTFOUR RAP BATTLE ’27</span><strong className="locked-word">INTERVIEW</strong><strong className="locked-word locked-pink">LOCKED</strong><span className="locked-premiere">PREMIERE AT 19:00 MSK</span></div>}<span className="media-type">{available?'В ЭФИРЕ':'СКОРО'}</span>{available&&<span className="play-circle"><Play fill="currentColor" size={19}/></span>}</div><div className="media-info"><span>{m.artist} <i>•</i> {m.date?'ПРЕМЬЕРА '+m.duration:m.duration}</span><h3 className="glitch-heading" data-text={m.title}>{m.title}</h3><p>{available?'СМОТРЕТЬ ИНТЕРВЬЮ':'ДОСТУПНО ПОСЛЕ ПРЕМЬЕРЫ'} <ArrowRight size={15}/></p></div></button>}
function PageHeading({number,tag,title,intro}){return <div className="page-heading"><div className="page-kicker"><span className="red-dot"/> {number} / {tag}</div><h1>{title}</h1><p>{intro}</p><div className="page-heading-line"/></div>}
