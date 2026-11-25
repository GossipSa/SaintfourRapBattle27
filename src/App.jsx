import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDownRight, ArrowRight, ChevronLeft, ChevronRight, Clapperboard, Flame, Home, Menu, Mic2, Play, Radio, Vote, X, Trophy, LockKeyhole, CheckCircle2, Ticket, Zap, FlaskConical, Mail, Eye, FileWarning, Volume2, VolumeX, Phone, PhoneOff, AudioLines, SlidersHorizontal, NotebookPen } from 'lucide-react'
import './App.css'
import './theme.css'
import './cyber.css'
import './glitch.css'
import './sponsors.css'
import SponsorsShowcase from './Sponsors.jsx'
import HypePolls from './HypePolls.jsx'
import SecretInterview from './SecretInterview.jsx'
import PoppyNotebook from './PoppyNotebook.jsx'
import HowardPhone from './HowardPhone.jsx'
import PhoneArchive from './PhoneArchive.jsx'
import { acquireAmbient, releaseAmbient, ambientElapsed, ambientRandom } from './ambient-timing.js'
import SaintfourNotifications from './SaintfourNotifications.jsx'
import TwoHourSecret from './TwoHourSecret.jsx'
import SheriffComplaints from './SheriffComplaints.jsx'
const dexManagerPhoto=`${import.meta.env.BASE_URL}media/dex-kitten-manager.jpg`
import AllAccessTicket from './AllAccessTicket.jsx'
import LuckySpin, { LuckySpinAchievements } from './LuckySpin.jsx'
import HelleboreSlots from './HelleboreSlots.jsx'
import SaintfourBank from './SaintfourBank.jsx'
import BattlePredictions from './BattlePredictions.jsx'
import { syncAchievements } from './saintfour-bank.js'
import BattleTicker from './LineupMarquee.jsx'
import './lineup-marquee.css'
import './hero-background.css'
import './host-card.css'
import CreditsTicker from './CreditsTicker.jsx'
import './credits-ticker.css'
import './profile-modal.css'
import './night-easter-egg.css'

const rappers = [
  { id:'dex', stage:'LIL DEX', name:'DEX HAWK', subtitle:'NO RULES. NO MERCY.', role:'THE WILD CARD', number:'01', color:'#ff78cf', initials:'DX', image:`${import.meta.env.BASE_URL}media/lil-dex.jpg`, profileImage:`${import.meta.env.BASE_URL}media/lil-dex-profile.jpg`, description:'Байкер, провокатор и человек, который никогда не держит язык за зубами. На баттле играет грязно, бьёт по больному и получает от этого удовольствие. Особенно если напротив Руди.' },
  { id:'netti', stage:'MC NETTI', name:'NATHANIEL HOWARD', subtitle:'BUSINESS IS PERSONAL.', role:'THE EXECUTIVE', number:'02', color:'#c49afd', initials:'MN', image:`${import.meta.env.BASE_URL}media/mc-netti.jpg`, profileImage:`${import.meta.env.BASE_URL}media/mc-netti-profile.jpg`, description:'Глава компании «Уорлок». До сих пор не понимает, кто записал его на рэп-баттл и зачем ему всё это нужно. Но раз уж оказался здесь, уходить без победы не собирается.' },
  { id:'rudi', stage:'YUNG RUD', name:'RUDI BROOKS', subtitle:'PLAY TO WIN.', role:'THE CONTENDER', number:'03', color:'#e2a0ff', initials:'RB', image:`${import.meta.env.BASE_URL}media/rudi.jpg`, profileImage:`${import.meta.env.BASE_URL}media/rudi-profile.jpg`, description:'Капитан школьной баскетбольной команды. На баттле у него тот же азарт, что и на площадке. Особенно когда напротив Декс.' },
  { id:'daro', stage:'DON DARO', name:'DARREN BOWIE', subtitle:'MAKE SOME NOISE.', role:'THE SHOWSTOPPER', number:'04', color:'#a87fff', initials:'DD', image:`${import.meta.env.BASE_URL}media/don-daro.jpg`, profileImage:`${import.meta.env.BASE_URL}media/don-daro-profile.jpg`, description:'Леопардовая шуба, золото и уверенность человека, которому не нужно ничего доказывать. Он пришёл не просто зачитать пару строк, а устроить настоящее шоу.' },
]
const host = {
  id:'host', stage:'POPPY', name:'PENELOPE (POPPY) EMERSON',
  subtitle:'SHE RUNS THE SHOW.', role:'THE HOST', number:'HOST',
  color:'#bd9aff', initials:'PE', image:`${import.meta.env.BASE_URL}media/poppy-host.jpg`, profileImage:`${import.meta.env.BASE_URL}media/poppy-host-profile.jpg`, isHost:true,
  description:'Ведущая SAINTFOUR RAP BATTLE ’27. Она здесь, чтобы держать микрофон, направлять хаос в нужное русло и не дать никому забыть, кто сегодня управляет этим шоу.'
}
// Интервью выходят по четвергам с 3 декабря 2026 года в 19:00 МСК (UTC+3).
// Порядок героев предварительный — даты/героев можно поменять перед анонсом.
const interviewApi = `${import.meta.env.DEV ? '' : 'https://2-26-81-166.sslip.io'}/api/interviews`
const interviewKey = id => id === 'interview-rud' ? 'rudi' : id.replace('interview-','')
const media = [
  { id:'interview-dex', type:'INTERVIEW', title:'LIL DEX — INTERVIEW', duration:'03 DEC · 19:00 МСК', artist:'Lil Dex', date:'2026-12-03', thumbnail:`${import.meta.env.BASE_URL}media/interviews/dex.jpg`, url:`${interviewApi}/dex` },
  { id:'interview-netti', type:'INTERVIEW', title:'MC NETTI — INTERVIEW', duration:'10 DEC · 19:00 МСК', artist:'MC Netti', date:'2026-12-10', thumbnail:`${import.meta.env.BASE_URL}media/interviews/netti.jpg`, url:`${interviewApi}/netti` },
  { id:'interview-rud', type:'INTERVIEW', title:'YUNG RUD — INTERVIEW', duration:'17 DEC · 19:00 МСК', artist:'Yung Rud', date:'2026-12-17', thumbnail:`${import.meta.env.BASE_URL}media/interviews/rudi.jpg`, url:`${interviewApi}/rudi` },
  { id:'interview-daro', type:'INTERVIEW', title:'DON DARO — INTERVIEW', duration:'24 DEC · 19:00 МСК', artist:'Don Daro', date:'2026-12-24', thumbnail:`${import.meta.env.BASE_URL}media/interviews/don-daro-final-20261125.jpg`, url:`${interviewApi}/daro` },
  { id:'interview-nadine', type:'INTERVIEW', title:'NADINE — INTERVIEW', duration:'31 DEC · 19:00 МСК', artist:'Nadine', date:'2026-12-31', thumbnail:`${import.meta.env.BASE_URL}media/interviews/nadine.jpg`, url:`${interviewApi}/nadine` },
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
const mobileMusicSource=`${import.meta.env.BASE_URL}media/audio/saintfour-background-quiet.m4a`
const desktopMusicSource=`${import.meta.env.BASE_URL}media/audio/saintfour-background.m4a`
const musicVolumeKey='sf27-music-volume-desktop-v1'

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
  { id:'achievements', name:'Достижения', Icon:Trophy },
  { id:'spin', name:'Рулетка', Icon:Zap },
]
function Cover({src, alt, className='', initials='', style={}}) {
  const [broken,setBroken]=useState(false)
  return <div className={`cover ${className}`} style={style}>{!broken && src ? <img src={src} alt={alt} onError={()=>setBroken(true)} /> : <div className="cover-fallback"><span className="cover-noise" /><strong>{initials || 'SF'}</strong><small>SAINTFOUR RAP BATTLE</small></div>}</div>
}
function SectionTitle({tag,title,action, onAction}){return <div className="section-heading"><div><p className="eyebrow"><span className="red-dot"/> {tag}</p><h2 className="glitch-heading" data-text={title}>{title}</h2></div>{action && <button className="text-button" onClick={onAction}>{action} <ArrowRight size={16}/></button>}</div>}
export default function App() {
 const [page,setPage]=useState('home')
 const [slotsDiscovered,setSlotsDiscovered]=useState(()=>{try{return window.localStorage.getItem('sf27-secret-slots-discovered')==='1'}catch{return false}})
 const unlockSlots=()=>{setSlotsDiscovered(true);try{window.localStorage.setItem('sf27-secret-slots-discovered','1')}catch{/* private mode */}}
 const musicRef=useRef(null)
 const musicFadeRef=useRef(null)
 const [mobileAudio]=useState(()=>window.matchMedia('(max-width: 760px)').matches)
 const [musicPanelOpen,setMusicPanelOpen]=useState(false)
 const [desktopMusicVolume,setDesktopMusicVolume]=useState(()=>{
  try{
   const n=Number(window.localStorage.getItem(musicVolumeKey))
   return Number.isFinite(n)&&n>=0&&n<=100&&window.localStorage.getItem(musicVolumeKey)!==null?n:30
  }catch{return 30}
 })
 const desktopVolumeRef=useRef(desktopMusicVolume)
 const [soundChoice,setSoundChoice]=useState(()=>{
  try{
   const value=window.localStorage.getItem(soundPrefKey)
   return value==='on'||value==='off'?value:null
  }catch{return null}
 })
 const soundChoiceRef=useRef(soundChoice)
 soundChoiceRef.current=soundChoice
 const stopMusic=()=>{
  if(musicFadeRef.current!==null)window.cancelAnimationFrame(musicFadeRef.current)
  musicFadeRef.current=null
  const audio=musicRef.current
  if(audio){audio.pause();audio.volume=0}
 }
 const startMusic=()=>{
  const audio=musicRef.current
  if(!audio||document.hidden)return
  if(musicFadeRef.current!==null)window.cancelAnimationFrame(musicFadeRef.current)
  musicFadeRef.current=null
  if(!audio.paused){audio.volume=mobileAudio?.02:desktopVolumeRef.current/100*.12;return}
  audio.volume=0
  const attempt=audio.play()
  if(attempt&&typeof attempt.then==='function')void attempt.then(()=>{
   if(document.hidden||soundChoiceRef.current!=='on'){audio.pause();return}
   const start=window.performance.now()
   const fade=(now)=>{
    if(audio.paused||document.hidden||soundChoiceRef.current!=='on')return
    const target=mobileAudio?.02:desktopVolumeRef.current/100*.12
    audio.volume=Math.max(0,Math.min(1,(now-start)/1800))*target
    if(now-start<1800)musicFadeRef.current=window.requestAnimationFrame(fade)
    else musicFadeRef.current=null
   }
   musicFadeRef.current=window.requestAnimationFrame(fade)
  }).catch(()=>{})
 }
 const changeDesktopVolume=(value)=>{
  const next=Number(value)
  if(!Number.isFinite(next))return
  const safe=Math.max(0,Math.min(100,next))
  desktopVolumeRef.current=safe
  setDesktopMusicVolume(safe)
  try{window.localStorage.setItem(musicVolumeKey,String(safe))}catch{/* private mode */}
  if(musicRef.current&&!musicRef.current.paused&&musicFadeRef.current===null)musicRef.current.volume=safe/100*.12
 }
 const chooseSound=(enabled)=>{
  const next=enabled?'on':'off'
  soundChoiceRef.current=next
  setSoundChoice(next)
  try{window.localStorage.setItem(soundPrefKey,next)}catch{/* private mode */}
  if(enabled)startMusic()
  else stopMusic()
 }
 useEffect(()=>{
  const audio=musicRef.current
  if(!audio)return
  let mounted=true
  const restore=()=>{
   if(!mounted||document.hidden||soundChoiceRef.current!=='on'||!audio.paused)return
   const attempt=audio.play()
   if(attempt&&typeof attempt.then==='function')void attempt.then(()=>{
    if(!mounted||document.hidden||soundChoiceRef.current!=='on'){audio.pause();return}
    audio.volume=mobileAudio?.02:desktopVolumeRef.current/100*.12
   }).catch(()=>{})
  }
  const suspend=()=>stopMusic()
  const onVisibility=()=>{if(document.hidden)suspend();else restore()}
  document.addEventListener('visibilitychange',onVisibility)
  window.addEventListener('pagehide',suspend)
  window.addEventListener('pageshow',onVisibility)
  restore()
  const onGesture=()=>restore()
  document.addEventListener('pointerdown',onGesture)
  document.addEventListener('keydown',onGesture)
  return ()=>{
   mounted=false
   document.removeEventListener('visibilitychange',onVisibility)
   window.removeEventListener('pagehide',suspend)
   window.removeEventListener('pageshow',onVisibility)
   suspend()
   document.removeEventListener('pointerdown',onGesture)
   document.removeEventListener('keydown',onGesture)
   if(musicFadeRef.current!==null)window.cancelAnimationFrame(musicFadeRef.current)
  }
 },[mobileAudio])
 const [menuOpen,setMenuOpen]=useState(false)
 const [selected,setSelected]=useState(null)
 const [externalDialogOpen,setExternalDialogOpen]=useState(false)
 useEffect(()=>{const update=()=>setExternalDialogOpen(Boolean(document.querySelector('[role="dialog"][aria-modal="true"]:not(.hp-window)')));const observer=new MutationObserver(update);observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['role','aria-modal']});update();return()=>observer.disconnect()},[])
 const [howardMailOpen,setHowardMailOpen]=useState(false)
 const [dexKittenOpen,setDexKittenOpen]=useState(false)
 const [daroRiderOpen,setDaroRiderOpen]=useState(false)
 const [rudiLetterOpen,setRudiLetterOpen]=useState(false)
 const [poppyNotebookOpen,setPoppyNotebookOpen]=useState(false)
 const [fifthInterviewOpen,setFifthInterviewOpen]=useState(false)
 const [allAccessOpen,setAllAccessOpen]=useState(false)
 const [activeVideo,setActiveVideo]=useState(null)
 const [watchedVideos,setWatchedVideos]=useState(()=>{try{return JSON.parse(localStorage.getItem('sf27-watched-videos-v1')||'{}')}catch{return {}}})
 const [watchToast,setWatchToast]=useState('')
 const markWatched=(video)=>{
  if(!video||watchedVideos[video.id])return
  const next={...watchedVideos,[video.id]:true}
  setWatchedVideos(next)
  try{localStorage.setItem('sf27-watched-videos-v1',JSON.stringify(next))}catch{}
  const interviewIds=['interview-dex','interview-netti','interview-rud','interview-daro','interview-nadine']
  if(interviewIds.every(id=>next[id]))setWatchToast('ПРЕДАННЫЙ ФАНАТ — все 5 интервью просмотрены!')
  else setWatchToast('Просмотр засчитан · '+interviewIds.filter(id=>next[id]).length+'/5 интервью')
 }
 const checkVideoProgress=(e)=>{
  const v=e.currentTarget
  if(!activeVideo||!Number.isFinite(v.duration)||v.duration<=0)return
  let watched=0
  for(let i=0;i<v.played.length;i++)watched+=v.played.end(i)-v.played.start(i)
  if(watched/v.duration>=.8)markWatched(activeVideo)
 }
 const [premieres,setPremieres]=useState({})
 const [galleryIndex,setGalleryIndex]=useState(null)
 const [achievements,setAchievements]=useState(()=>{
   try { const saved=JSON.parse(window.localStorage.getItem('sf27-achievements-v2')||'{}'); return saved&&typeof saved==='object'?saved:{} } catch { return {} }
 })
 useEffect(()=>{syncAchievements()},[achievements])
 const [achievementToast,setAchievementToast]=useState(null)
 const [warlockNotice,setWarlockNotice]=useState(false)
 const [wilsonOpen,setWilsonOpen]=useState(false)
 const unlockWilsonComplaint=()=>{
  if(achievements.wilsonSnitch)return
  setAchievements(prev=>{
   if(prev.wilsonSnitch)return prev
   const next={...prev,wilsonSnitch:true}
   try{window.localStorage.setItem('sf27-achievements-v2',JSON.stringify(next))}catch{/* private mode */}
   return next
  })
  // Achievement is displayed inside the sheriff dialog, not behind its overlay.
 }
 const unlockShakeBonus=()=>{
  if(achievements.shakeBonus)return
  setAchievements(prev=>{
   if(prev.shakeBonus)return prev
   const next={...prev,shakeBonus:true}
   try{window.localStorage.setItem('sf27-achievements-v2',JSON.stringify(next))}catch{/* private mode */}
   return next
  })
  setAchievementToast('shakeBonus')
 }
 useEffect(()=>{const onDexAchievement=()=>{setAchievements(prev=>{if(prev.dexOnTheLine)return prev;const next={...prev,dexOnTheLine:true};try{window.localStorage.setItem('sf27-achievements-v2',JSON.stringify(next))}catch{}return next});setAchievementToast('dexOnTheLine')};window.addEventListener('sf27-dex-achievement',onDexAchievement);return()=>window.removeEventListener('sf27-dex-achievement',onDexAchievement)},[])
 const unlockedCount=Number(Boolean(achievements.earlyBird))+Number(Boolean(achievements.loyalOne))+Number(Boolean(achievements.sideEffect))+Number(Boolean(achievements.whosWatching))+Number(Boolean(achievements.fifthChair))
 const activityCount=Number(Boolean(achievements.earlyBird))+Number(Boolean(achievements.loyalOne))
 const secretCount=Number(Boolean(achievements.sideEffect))+Number(Boolean(achievements.whosWatching))+Number(Boolean(achievements.fifthChair))
 const slotsJackpot=(()=>{try{return Boolean(JSON.parse(window.localStorage.getItem('sf27-hellebore-slots-v1')||'{}').jackpot)}catch{return false}})()
 const foundSecrets=secretCount+Number(Boolean(achievements.shakeBonus))+Number(Boolean(achievements.howardBlocked))+Number(Boolean(achievements.nightOwl))+Number(Boolean(achievements.wilsonSnitch))+Number(Boolean(slotsDiscovered))+Number(Boolean(slotsJackpot))+Number(Boolean(achievements.dexOnTheLine))
 const howardStoryCompleted=Boolean(achievements.howardBlocked)||(()=>{
  try{return Boolean(JSON.parse(window.localStorage.getItem('sf27-howard-phone-v2')||'{}').blocked)}
  catch{return false}
 })()
 const unlockHowardBlocked=()=>{
  setAchievements(prev=>{
   if(prev.howardBlocked)return prev
   const next={...prev,howardBlocked:true}
   try{window.localStorage.setItem('sf27-achievements-v2',JSON.stringify(next))}catch{/* private mode */}
   return next
  })
 }
 const unlockFifthChair=()=>{
  if(achievements.fifthChair)return
  setAchievements(prev=>{
   if(prev.fifthChair)return prev
   const next={...prev,fifthChair:true}
   try{window.localStorage.setItem('sf27-achievements-v2',JSON.stringify(next))}catch{/* private mode */}
   return next
  })
  setAchievementToast('fifthChair')
 }
 const openHowardMail=()=>{
   setHowardMailOpen(true)
   if(achievements.whosWatching)return
   setAchievements(prev=>{
     if(prev.whosWatching)return prev
     const next={...prev,whosWatching:true}
     try{window.localStorage.setItem('sf27-achievements-v2',JSON.stringify(next))}catch{/* private mode */}
     return next
   })
   setAchievementToast('whosWatching')
 }
 const unlockSideEffect=()=>{
   if(achievements.sideEffect)return
   setAchievements(prev=>{
     if(prev.sideEffect)return prev
     const next={...prev,sideEffect:true}
     try{window.localStorage.setItem('sf27-achievements-v2',JSON.stringify(next))}catch{/* private mode */}
     return next
   })
   setAchievementToast('sideEffect')
 }
 const unlockLoyalOne=(votes)=>{
   if(!completedHypeVotes(votes)||achievements.loyalOne)return
   setAchievements(prev=>{
     if(prev.loyalOne)return prev
     const next={...prev,loyalOne:true}
     try{window.localStorage.setItem('sf27-achievements-v2',JSON.stringify(next))}catch{/* private mode */}
     return next
   })
   setAchievementToast('loyalOne')
 }
 useEffect(()=>{
   // Re-check existing poll participation only when the visitor opens the polls.
   // A reset must stay at zero until the relevant activity is visited again.
   if(page!=='polls'||achievements.loyalOne)return
   try{
     const saved=JSON.parse(window.localStorage.getItem('sfvs-hype-server-votes-v1')||'{}')
     if(!completedHypeVotes(saved))return
     const t=window.setTimeout(()=>{
       setAchievements(prev=>{
         if(prev.loyalOne)return prev
         const next={...prev,loyalOne:true}
         try{window.localStorage.setItem('sf27-achievements-v2',JSON.stringify(next))}catch{/* private mode */}
         return next
       })
       setAchievementToast('loyalOne')
     },2200)
     return ()=>window.clearTimeout(t)
   }catch{/* missing vote cache */}
 },[page,achievements.loyalOne])
 useEffect(()=>{
   // Moscow time: first interview premiere (03 Dec 2026, 19:00 MSK).
   const beforeFirstPremiere=Date.now()<Date.parse('2026-12-03T19:00:00+03:00')
   if(page!=='home'||!beforeFirstPremiere || achievements.earlyBird)return
   const t=window.setTimeout(()=>{
     setAchievements(prev=>{
       if(prev.earlyBird)return prev
       const next={...prev,earlyBird:true}
       try {window.localStorage.setItem('sf27-achievements-v2',JSON.stringify(next))}catch{ /* private mode */ }
       return next
     })
     setAchievementToast('earlyBird')
   },6000)
   return ()=>window.clearTimeout(t)
 },[page,achievements.earlyBird])
 useEffect(()=>{
   if(achievements.nightOwl)return undefined
   const checkNight=()=>{
     if(document.visibilityState!=='visible')return
     const hour=new Date().getHours()
     if(hour<2||hour>=5)return
     setAchievements(prev=>{
       if(prev.nightOwl)return prev
       const next={...prev,nightOwl:true}
       try{window.localStorage.setItem('sf27-achievements-v2',JSON.stringify(next))}catch{/* private mode */}
       return next
     })
     setAchievementToast('nightOwl')
   }
   const timer=window.setTimeout(checkNight,3500)
   const interval=window.setInterval(checkNight,60000)
   document.addEventListener('visibilitychange',checkNight)
   return ()=>{window.clearTimeout(timer);window.clearInterval(interval);document.removeEventListener('visibilitychange',checkNight)}
 },[achievements.nightOwl])
 const warlockDue=useRef(null)
 useEffect(()=>{
   // WARLOCK is deliberately sequenced AFTER the first ambient message.
   // On each visit: first message (30–60s), then WARLOCK (another 2–3m).
   if(!howardStoryCompleted){warlockDue.current=null;return undefined}
   warlockDue.current=null
   const onFirstMessage=()=>{
     if(warlockDue.current===null){
       warlockDue.current=ambientElapsed()+ambientRandom(120000,180000)
     }
   }
   window.addEventListener('sf27-first-ambient-message',onFirstMessage)
   const timer=window.setInterval(()=>{
     if(warlockDue.current===null||ambientElapsed()<warlockDue.current)return
     if(!acquireAmbient('warlock'))return
     warlockDue.current=ambientElapsed()+ambientRandom(720000,1080000)
     setWarlockNotice(true)
   },1000)
   return()=>{window.clearInterval(timer);window.removeEventListener('sf27-first-ambient-message',onFirstMessage);releaseAmbient('warlock')}
 },[howardStoryCompleted])
 useEffect(()=>{
   if(!warlockNotice)return undefined
   const timer=window.setTimeout(()=>{setWarlockNotice(false);releaseAmbient('warlock')},8500)
   return ()=>{window.clearTimeout(timer);releaseAmbient('warlock')}
 },[warlockNotice])
 useEffect(()=>{
   if(!achievementToast)return undefined
   const t=window.setTimeout(()=>setAchievementToast(null),document.querySelector('.hp-overlay')?4000:10000)
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
       const response=await fetch(`${interviewApi}/status`,{cache:'no-store'})
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
   if(!item.url || !premieres[interviewKey(item.id)]?.available)return
   setActiveVideo(item)
 }
 useEffect(()=>{window.scrollTo({top:0,behavior:'smooth'})},[page])
 useEffect(()=>{const onKey=e=>{if(e.key==='Escape'){if(poppyNotebookOpen){setPoppyNotebookOpen(false)}else if(rudiLetterOpen){setRudiLetterOpen(false)}else if(daroRiderOpen){setDaroRiderOpen(false)}else if(dexKittenOpen){setDexKittenOpen(false)}else if(fifthInterviewOpen){setFifthInterviewOpen(false)}else if(howardMailOpen){setHowardMailOpen(false)}else{setSelected(null);setActiveVideo(null);setGalleryIndex(null)}} if(galleryIndex!==null){if(e.key==='ArrowRight')setGalleryIndex(i=>(i+1)%gallery.length);if(e.key==='ArrowLeft')setGalleryIndex(i=>(i+gallery.length-1)%gallery.length)}};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[galleryIndex,howardMailOpen,fifthInterviewOpen,dexKittenOpen,daroRiderOpen,rudiLetterOpen,poppyNotebookOpen])
 const filteredMedia=useMemo(()=>media.filter(m=>m.type==='INTERVIEW'),[])
 const go=(p)=>{setPage(p);setMenuOpen(false)}
 return <div className="app">
  <TwoHourSecret/>
  <audio ref={musicRef} src={mobileAudio?mobileMusicSource:desktopMusicSource} preload="none" loop aria-hidden="true"/>
  {soundChoice===null&&<div className="sound-consent-backdrop"><section className="sound-consent-dialog" role="dialog" aria-modal="true" aria-labelledby="sound-consent-title" aria-describedby="sound-consent-description"><div className="sound-consent-scanline" aria-hidden="true"/><div className="sound-consent-icon"><AudioLines size={29}/></div><span className="sound-consent-kicker">SAINTFOUR / BACKGROUND MUSIC</span><h2 id="sound-consent-title">SET THE <em>MOOD.</em></h2><p id="sound-consent-description">На сайте может играть тихая фоновая музыка. Включить её или оставить сайт без звука? Никаких сигналов при ачивках и секретках больше нет.</p><div className="sound-consent-actions"><button type="button" className="sound-consent-enable" onClick={()=>chooseSound(true)}><Volume2 size={18}/> ВКЛЮЧИТЬ МУЗЫКУ</button><button type="button" className="sound-consent-silent" onClick={()=>chooseSound(false)}><VolumeX size={17}/> БЕЗ МУЗЫКИ</button></div><small>Музыка играет тихо и повторяется на всех страницах сайта. В любой момент можно отключить её кнопкой MUSIC ON/OFF. Видео энергетика останется без звука.</small><p className="fan-disclaimer-consent"><strong>UNOFFICIAL FAN PROJECT</strong> Неофициальный фан-проект по мотивам «Клуба Романтики». Не связан с разработчиками.</p></section></div>}
  <div className="top-strip"><span>GOSSIP SAINTFOUR PRESENTS</span><span className="top-right"><span className="live-dot"/><span className="top-strip-slogan">THE UNDERGROUND IS CALLING</span></span></div>
  <header className="header"><button className="logo" onClick={()=>go('home')} aria-label="На главную"><span className="logo-mark">SF</span><span className="logo-type">SAINTFOUR<strong>RAP BATTLE <i>’27</i></strong></span></button><nav className="desktop-nav" aria-label="Навигация">{nav.map(n=><button key={n.id} className={page===n.id?'active':''} onClick={()=>go(n.id)}>{n.name}</button>)}</nav><div className="header-actions"><span className="edition">VOL. 001 / 2027</span><button className="sound-toggle sound-toggle-header" type="button" onClick={()=>chooseSound(soundChoice!=='on')} aria-label={soundChoice==='on'?'Выключить фоновую музыку':'Включить фоновую музыку'} aria-pressed={soundChoice==='on'} title={soundChoice==='on'?'Выключить музыку':'Включить музыку'}>{soundChoice==='on'?<Volume2 size={16}/>:<VolumeX size={16}/>} <span>MUSIC {soundChoice==='on'?'ON':'OFF'}</span></button>{!mobileAudio&&<div className="music-volume-wrap"><button type="button" className="music-volume-trigger" aria-label="Настроить громкость музыки" aria-expanded={musicPanelOpen} title="Громкость фоновой музыки" onClick={()=>setMusicPanelOpen(v=>!v)}><SlidersHorizontal size={17}/></button>{musicPanelOpen&&<div className="music-volume-popover"><label htmlFor="sf-music-volume">ГРОМКОСТЬ МУЗЫКИ <b>{desktopMusicVolume}%</b></label><input id="sf-music-volume" type="range" min="0" max="100" step="1" value={desktopMusicVolume} onChange={e=>changeDesktopVolume(e.target.value)} aria-label="Громкость фоновой музыки"/><small>Только для этого компьютера</small></div>}</div>}<button className="mobile-menu-button" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Меню">{menuOpen?<X/>:<Menu/>}</button></div></header>
  {menuOpen&&<nav className="mobile-nav" aria-label="Мобильная навигация">{nav.map(n=><button key={n.id} onClick={()=>go(n.id)}><n.Icon size={17}/>{n.name}<ArrowRight size={16}/></button>)}</nav>}
  <HowardPhone hidden={Boolean(externalDialogOpen||selected||activeVideo||galleryIndex!==null||menuOpen||musicPanelOpen||wilsonOpen||soundChoice===null||howardMailOpen||fifthInterviewOpen||dexKittenOpen||daroRiderOpen||rudiLetterOpen||poppyNotebookOpen||allAccessOpen)} onBlocked={unlockHowardBlocked} achievementUnlocked={Boolean(achievements.howardBlocked)} suppressed={Boolean(warlockNotice||achievementToast||wilsonOpen||soundChoice===null||howardMailOpen||fifthInterviewOpen||dexKittenOpen||daroRiderOpen||rudiLetterOpen||poppyNotebookOpen)}/>
  <SaintfourNotifications enabled={howardStoryCompleted} suppressed={Boolean(warlockNotice||achievementToast||wilsonOpen||soundChoice===null||howardMailOpen||fifthInterviewOpen||dexKittenOpen||daroRiderOpen||rudiLetterOpen||poppyNotebookOpen)}/>
  <main>
  {page==='bank'&&<SaintfourBank/>}
  {page==='spin'&&<LuckySpin onBack={()=>go('home')} onAchievements={()=>go('achievements')} onSlotsDiscovered={unlockSlots} onOpenSlots={()=>go('slots')} slotsDiscovered={slotsDiscovered}/>}
  {page==='slots'&&slotsDiscovered&&<section className="inner-page wrap" style={{maxWidth:650,margin:'35px auto 75px'}}><button type="button" className="achievement-return" onClick={()=>go('spin')} style={{marginBottom:20}}>← НАЗАД К КОЛЕСУ УДАЧИ</button><HelleboreSlots onClose={()=>go('spin')}/></section>}
  {page==='achievements'&&<section className="achievements-page wrap">
    <div className="achievement-page-top"><button type="button" onClick={()=>go('home')} className="achievement-return"><ArrowRight size={16}/> НАЗАД НА ГЛАВНУЮ</button><span>SAINTFOUR / SECRET ACCESS</span></div>
    <div className="achievement-page-hero"><span className="achievement-page-eyebrow">THE UNDERGROUND HAS SECRETS</span><h1 className="achievement-title-glitch" data-text="YOUR ACHIEVEMENTS.">YOUR <em>ACHIEVEMENTS.</em></h1><p>Исследуй Saintfour Rap Battle, участвуй в жизни шоу и собирай достижения. Некоторые находятся на виду. Другие придётся поискать.</p>
     <div className="achievement-progress"><strong>{unlockedCount} <span>/ 05</span></strong><div className="achievement-track"><div style={{width:`${unlockedCount*20}%`}}/></div><span>DISCOVERED</span></div>
    </div>
    <div className={'achievement-reward '+(unlockedCount===5?'achievement-reward-ready':'')} role={unlockedCount===5?'button':undefined} tabIndex={unlockedCount===5?0:undefined} aria-label={unlockedCount===5?'Открыть коллекционный ALL ACCESS TICKET':undefined} onClick={()=>{if(unlockedCount===5)setAllAccessOpen(true)}} onKeyDown={e=>{if(unlockedCount===5&&(e.key==='Enter'||e.key===' ')){e.preventDefault();setAllAccessOpen(true)}}}><div><span>FINAL REWARD / COLLECTION 01</span><h2><Ticket size={25}/> ALL ACCESS TICKET</h2><p>{unlockedCount===5?'Вся коллекция собрана! Твой коллекционный билет доступен. Нажми, чтобы открыть его.':'Коллекционный билет на шоу откроется, когда ты соберёшь всю первую коллекцию. Само шоу бесплатно для всех.'}</p>{unlockedCount===5&&<span className="achievement-reward-open">ПОСМОТРЕТЬ БИЛЕТ <ArrowRight size={15}/></span>}</div><span className="achievement-reward-lock">{unlockedCount===5?<CheckCircle2 size={17}/>:<LockKeyhole size={17}/>} {unlockedCount===5?'UNLOCKED / 5 OF 5':`LOCKED / ${unlockedCount} OF 5`}</span></div>
    {slotsDiscovered&&<button type="button" className="sf-slots-shortcut" onClick={()=>go('slots')}><span className="sf-slots-shortcut-icon"><Zap size={22}/></span><span className="sf-slots-shortcut-copy"><small>BLACK HELLEBORE / SECRET UNLOCKED</small><strong>LUCKY 777 · ИГРАТЬ В СЛОТЫ</strong><span>Секретная игра уже открыта. Вернуться можно в любой момент.</span></span><ArrowRight size={21}/></button>}
    <div className="achievement-category-nav" aria-label="Категории достижений"><a href="#sf-achievement-active" onClick={e=>{e.preventDefault();document.getElementById('sf-achievement-active')?.scrollIntoView({behavior:'smooth',block:'start'})}}>ЗА АКТИВНОСТЬ <span>{activityCount} / 2</span></a><a href="#sf-achievement-secrets" onClick={e=>{e.preventDefault();document.getElementById('sf-achievement-secrets')?.scrollIntoView({behavior:'smooth',block:'start'})}}>СЕКРЕТНЫЕ <span>{foundSecrets} / ???</span></a>{howardStoryCompleted&&<a href="#sf-phone-archive" onClick={e=>{e.preventDefault();document.getElementById("sf-phone-archive")?.scrollIntoView({behavior:"smooth",block:"start"})}}>PHONE ARCHIVE <span>???</span></a>}</div>
    <section className="achievement-category" id="sf-achievement-active">
      <div className="achievement-category-heading"><div><span className="achievement-category-kicker">01 / THE PARTICIPANTS</span><h2>ЗА <em>АКТИВНОСТЬ.</em></h2><p>Посещай сайт, участвуй в голосованиях и следи за премьерами.</p></div><span className="achievement-category-count">{String(activityCount).padStart(2,'0')} <i>/ 02</i></span></div>
      <div className="achievement-collection">
        <article className={'achievement-item achievement-tier-1 '+(achievements.earlyBird?'is-earned':'is-locked')}><div className="achievement-emblem">{achievements.earlyBird?<div className="sf-medallion"><span className="sf-medallion-rays" aria-hidden="true">✦</span><Ticket size={27} strokeWidth={1.6}/><i>01</i></div>:<LockKeyhole size={27}/>}</div><div className="achievement-item-copy"><span>ACHIEVEMENT / 001</span><h2>{achievements.earlyBird?'EARLY BIRD':'UNDISCOVERED'}</h2><p>{achievements.earlyBird?'Ты был здесь ещё до первой премьеры. Похоже, ты знаешь, где начинается самое интересное.':'Его время ещё придёт.'}</p></div><div className="achievement-status">{achievements.earlyBird?<><CheckCircle2 size={16}/> UNLOCKED</>:'LOCKED'}</div></article>
        <article className={'achievement-item achievement-tier-2 '+(achievements.loyalOne?'is-earned':'is-locked')}><div className="achievement-emblem">{achievements.loyalOne?<div className="sf-medallion sf-medallion-loyal"><span className="sf-medallion-rays" aria-hidden="true">✦</span><Vote size={27} strokeWidth={1.6}/><i>02</i></div>:<LockKeyhole size={27}/>}</div><div className="achievement-item-copy"><span>ACHIEVEMENT / 002</span><h2>THE LOYAL ONE</h2><p>{achievements.loyalOne?'Все четыре предварительных голосования пройдены. У Сентфора появился настоящий преданный фанат.':'Прими участие во всех четырёх голосованиях PRE-BATTLE HYPE.'}</p></div><div className="achievement-status">{achievements.loyalOne?<><CheckCircle2 size={16}/> UNLOCKED</>:'LOCKED'}</div></article>
      </div>
    </section>
    <section className="achievement-category achievement-category-secrets" id="sf-achievement-secrets">
      <div className="achievement-category-heading"><div><span className="achievement-category-kicker">02 / THE HIDDEN FILES</span><h2>СЕКРЕТНЫЕ <em>НАХОДКИ.</em></h2><p>Сколько их на самом деле — неизвестно. Продолжай искать.</p></div><span className="achievement-category-count">{String(foundSecrets).padStart(2,'0')} <i>/ ???</i></span></div>
      <details className="sf-secret-accordion"><summary><span>СЕКРЕТНЫЕ НАХОДКИ · {foundSecrets} ОТКРЫТО</span><span className="sf-secret-accordion-action">ПОКАЗАТЬ / СКРЫТЬ <span aria-hidden="true">⌄</span></span></summary>
       <div className="achievement-collection">
        <article className={'achievement-item achievement-tier-3 '+(achievements.sideEffect?'is-earned':'is-locked')}><div className="achievement-emblem">{achievements.sideEffect?<div className="sf-medallion sf-medallion-side-effect"><span className="sf-medallion-rays" aria-hidden="true">✦</span><FlaskConical size={27} strokeWidth={1.6}/><i>03</i></div>:<LockKeyhole size={27}/>}</div><div className="achievement-item-copy"><span>ACHIEVEMENT / 003</span><h2>{achievements.sideEffect?'SIDE EFFECT':'UNDISCOVERED'}</h2><p>{achievements.sideEffect?'Экспериментальная партия BLACK HELLEBORE 00 обнаружена. Производитель предпочёл бы об этом умолчать.':'Секрет ещё не раскрыт.'}</p></div><div className="achievement-status">{achievements.sideEffect?<><CheckCircle2 size={16}/> UNLOCKED</>:'LOCKED'}</div></article>
        <article className={'achievement-item achievement-tier-4 '+(achievements.whosWatching?'is-earned':'is-locked')}><div className="achievement-emblem">{achievements.whosWatching?<div className="sf-medallion sf-medallion-whos-watching"><span className="sf-medallion-rays" aria-hidden="true">✦</span><Mail size={27} strokeWidth={1.6}/><i>04</i></div>:<LockKeyhole size={27}/>}</div><div className="achievement-item-copy"><span>ACHIEVEMENT / 004</span><h2>{achievements.whosWatching?"WHO'S WATCHING?":'UNDISCOVERED'}</h2><p>{achievements.whosWatching?'Ты нашёл письмо, которое Поппи не собиралась показывать. Кто зарегистрировал MC NETTI — до сих пор неизвестно.':'Секрет ещё не раскрыт.'}</p></div><div className="achievement-status">{achievements.whosWatching?<><CheckCircle2 size={16}/> UNLOCKED</>:'LOCKED'}</div></article>
        <article className={'achievement-item achievement-tier-5 '+(achievements.fifthChair?'is-earned':'is-locked')}><div className="achievement-emblem">{achievements.fifthChair?<div className="sf-medallion"><span className="sf-medallion-rays" aria-hidden="true">✦</span><Mic2 size={27} strokeWidth={1.6}/><i>05</i></div>:<LockKeyhole size={27}/>}</div><div className="achievement-item-copy"><span>ACHIEVEMENT / 005</span><h2>{achievements.fifthChair?'THE FIFTH CHAIR':'UNDISCOVERED'}</h2><p>{achievements.fifthChair?'Ты взял интервью у самого себя, сломал четвёртую стену и оставил Поппи без гонорара.':'Секрет ещё не раскрыт.'}</p></div><div className="achievement-status">{achievements.fifthChair?<><CheckCircle2 size={16}/> UNLOCKED</>:'LOCKED'}</div></article>
      <article className={'achievement-item achievement-tier-6 '+(achievements.shakeBonus?'is-earned':'is-locked')}>
       <div className="achievement-emblem">{achievements.shakeBonus?<div className="sf-medallion"><span className="sf-medallion-rays" aria-hidden="true">✦</span><Zap size={27} strokeWidth={1.6}/><i>06</i></div>:<LockKeyhole size={27}/>}</div>
       <div className="achievement-item-copy"><span>BONUS ACHIEVEMENT / 006</span><h2>{achievements.shakeBonus?'SHAKE RESPONSIBLY':'UNDISCOVERED'}</h2><p>{achievements.shakeBonus?'Десять встряхиваний BLACK HELLEBORE. Промокод SHAKE10GET0 — скидка 0%, уважение 100%.':'Иногда любопытство заканчивается слишком громким пшшш.'}</p></div>
       <div className="achievement-status">{achievements.shakeBonus?<><CheckCircle2 size={16}/> UNLOCKED</>:'LOCKED'}</div>
      </article>
      <article className={'achievement-item achievement-tier-7 '+(achievements.howardBlocked?'is-earned':'is-locked')}>
       <div className="achievement-emblem">{achievements.howardBlocked?<div className="sf-medallion"><span className="sf-medallion-rays" aria-hidden="true">✦</span><PhoneOff size={27} strokeWidth={1.6}/><i>07</i></div>:<LockKeyhole size={27}/>}</div>
       <div className="achievement-item-copy"><span>SECRET ACHIEVEMENT / 007</span><h2>{achievements.howardBlocked?'ГОВАРД ЗАБЛОКИРОВАЛ ВАС':'UNDISCOVERED'}</h2><p>{achievements.howardBlocked?'Вы так настойчиво перезванивали Натаниэлю Говарду, что ваш номер внесли в чёрный список Warlock Industries.':'Секрет ещё не раскрыт.'}</p></div>
       <div className="achievement-status">{achievements.howardBlocked?<><CheckCircle2 size={16}/> UNLOCKED</>:'LOCKED'}</div>
      </article>
      <article className={'achievement-item achievement-tier-8 '+(achievements.nightOwl?'is-earned':'is-locked')}>
       <div className="achievement-emblem">{achievements.nightOwl?<div className="sf-medallion"><span className="sf-medallion-rays" aria-hidden="true">✦</span><Eye size={27} strokeWidth={1.6}/><i>08</i></div>:<LockKeyhole size={27}/>}</div>
       <div className="achievement-item-copy"><span>SECRET ACHIEVEMENT / 008</span><h2>{achievements.nightOwl?'ТЫ ВООБЩЕ СПИШЬ?':'UNDISCOVERED'}</h2><p>{achievements.nightOwl?'Зайти на сайт между 02:00 и 05:00 по местному времени. Поппи просит тебя лечь спать.':'Секрет ещё не раскрыт.'}</p></div>
       <div className="achievement-status">{achievements.nightOwl?<><CheckCircle2 size={16}/> UNLOCKED</>:'LOCKED'}</div>
      </article>
      <article className={'achievement-item achievement-tier-9 '+(achievements.wilsonSnitch?'is-earned':'is-locked')}>
       <div className="achievement-emblem">{achievements.wilsonSnitch?<div className="sf-medallion"><span className="sf-medallion-rays" aria-hidden="true">✦</span><FileWarning size={27} strokeWidth={1.6}/><i>09</i></div>:<LockKeyhole size={27}/>}</div>
       <div className="achievement-item-copy"><span>SECRET ACHIEVEMENT / 009</span><h2>{achievements.wilsonSnitch?'СТУКАЧ СЕНТФОРА':'UNDISCOVERED'}</h2><p>{achievements.wilsonSnitch?'Шериф Уилсон благодарит вас за сотрудничество. Остальные — нет.':'Секрет ещё не раскрыт.'}</p></div>
       <div className="achievement-status">{achievements.wilsonSnitch?<><CheckCircle2 size={16}/> UNLOCKED</>:'LOCKED'}</div>
      </article>
      <article className={'achievement-item achievement-tier-10 '+(slotsJackpot?'is-earned':'is-locked')}>
       <div className="achievement-emblem">{slotsJackpot?<div className="sf-medallion"><span className="sf-medallion-rays" aria-hidden="true">✦</span><Trophy size={27} strokeWidth={1.6}/><i>10</i></div>:<LockKeyhole size={27}/>}</div>
       <div className="achievement-item-copy"><span>SECRET ACHIEVEMENT / 010</span><h2>{slotsJackpot?'СЕМЬ-СЕМЬ-СЕМЬ':'UNDISCOVERED'}</h2><p>{slotsJackpot?'Три семёрки в BLACK HELLEBORE LUCKY 777. Поппи требует проверить автомат.':'Секрет ещё не раскрыт.'}</p></div>
       <div className="achievement-status">{slotsJackpot?<><CheckCircle2 size={16}/> UNLOCKED</>:'LOCKED'}</div>
      </article>
      <article className={'achievement-item achievement-tier-11 '+(slotsDiscovered?'is-earned':'is-locked')}>
       <div className="achievement-emblem">{slotsDiscovered?<div className="sf-medallion"><span className="sf-medallion-rays" aria-hidden="true">✦</span><Zap size={27} strokeWidth={1.6}/><i>11</i></div>:<LockKeyhole size={27}/>}</div>
       <div className="achievement-item-copy"><span>SECRET ACHIEVEMENT / 011</span><h2>{slotsDiscovered?'НЕ ТУДА ПОПАЛ':'UNDISCOVERED'}</h2><p>{slotsDiscovered?'Колесо удачи открыло секретную игру BLACK HELLEBORE. Доступ сохранён.':'Секрет ещё не раскрыт.'}</p></div>
       <div className="achievement-status">{slotsDiscovered?<><CheckCircle2 size={16}/> UNLOCKED</>:'LOCKED'}</div>
      </article>
      <article className={'achievement-item achievement-tier-12 '+(achievements.dexOnTheLine?'is-earned':'is-locked')}>
       <div className="achievement-emblem">{achievements.dexOnTheLine?<div className="sf-medallion"><span className="sf-medallion-rays" aria-hidden="true">✦</span><Phone size={27} strokeWidth={1.6}/><i>12</i></div>:<LockKeyhole size={27}/>}</div>
       <div className="achievement-item-copy"><span>SECRET ACHIEVEMENT / 012</span><h2>{achievements.dexOnTheLine?'НА УХЕ У LIL DEX':'UNDISCOVERED'}</h2><p>{achievements.dexOnTheLine?'Вы провели на линии с Дексом неприлично много времени. И, судя по всему, это ещё не конец.':'Секрет ещё не раскрыт.'}</p></div>
       <div className="achievement-status">{achievements.dexOnTheLine?<><CheckCircle2 size={16}/> UNLOCKED</>:'LOCKED'}</div>
      </article>
      </div>
      </details>
    </section>
    <PhoneArchive enabled={howardStoryCompleted}/>
    <section className="achievement-category achievement-category-spin" aria-label="Достижения Lucky Spin">
      <LuckySpinAchievements onOpen={()=>go('spin')}/>
    </section>

   </section>}
  {page==='home'&&<>
   <CreditsTicker/>
   <section className="hero"><div className="hero-photo-soft" aria-hidden="true"/><div className="hero-grid"/><div className="hero-flare"/><div className="hero-inner"><div className="hero-copy"><div className="hero-tag"><span className="status-pulse"/> THE STREETS HAVE A VOICE <span className="hero-tag-end">EST. SAINTFOUR</span></div><p className="hero-overline">GOSSIP SAINTFOUR ORIGINAL PRODUCTION</p><h1><span className="glitch-line" data-text="NO">NO</span><br/><span className="glitch-line" data-text="MORE">MORE</span><br/><em className="hero-glitch" data-text="SILENCE.">SILENCE<span>.</span></em></h1><p className="hero-subtitle">Четыре имени. Один микрофон. Никаких правил.<br/>SAINTFOUR RAP BATTLE <strong>’27</strong> — скоро.</p><div className="hero-buttons"><button className="primary-btn" onClick={()=>go('artists')}>УЗНАТЬ УЧАСТНИКОВ <ArrowRight size={17}/></button><button className="secondary-btn" onClick={()=>go('interviews')}><Clapperboard size={15}/> РАСПИСАНИЕ ИНТЕРВЬЮ</button></div></div></div><div className="hero-bottom"><span>SCROLL TO EXPLORE <ArrowDownRight size={15}/></span><span>INDEPENDENT UNDERGROUND SHOW — 2027</span></div></section>
   <BattleTicker/>
   <section className="section wrap"><SectionTitle tag="01 / THE LINEUP" title="MEET THE CONTENDERS" action="ВСЕ УЧАСТНИКИ" onAction={()=>go('artists')}/><div className="artist-grid">{rappers.map(r=><ArtistCard key={r.id} r={r} onClick={()=>setSelected(r)}/>)}</div><HostFeature onClick={()=>setSelected(host)}/></section>
   <section className="section wrap"><SectionTitle tag="02 / ON THE RECORD" title="BEHIND THE MIC" action="ВСЕ ИНТЕРВЬЮ" onAction={()=>go('interviews')}/><div className="home-interview-spotlight"><div><span className="home-interview-eyebrow">NEXT ON THE MIC <span>✳</span> PREMIERE / 001</span><p>Первым к микрофону выходит LIL DEX. Что он скажет до начала батла?</p></div><span className="home-interview-date">03 DEC <small>19:00 МСК</small></span></div><div className="media-grid home-interview-grid">{media.slice(0,1).map(m=><MediaCard key={m.id} m={m} available={Boolean(premieres[interviewKey(m.id)]?.available)} onClick={()=>openInterview(m)}/>)}</div><button type="button" className="fifth-home-tape" onClick={()=>setFifthInterviewOpen(true)} aria-label="Открыть доступную секретную запись THE FIFTH CHAIR"><span className="fifth-home-tape-glyph"><Mic2 size={17}/></span><span className="fifth-home-tape-copy"><small>ARCHIVE / UNLISTED 006 <i>·</i> ACCESS GRANTED</small><strong>THE FIFTH CHAIR</strong><span>Неучтённое интервью · запись доступна</span></span><span className="fifth-home-tape-action">ОТКРЫТЬ <ArrowRight size={14}/></span></button></section>
   <section className="promo-band promo-band-video"><video className="promo-band-background" autoPlay muted loop playsInline preload="metadata" aria-hidden="true"><source src={`${import.meta.env.BASE_URL}media/promo/rap-battle-promo.mp4`} type="video/mp4" /></video><div className="promo-band-shade" aria-hidden="true"/><div className="wrap promo-content"><div><p className="eyebrow"><span className="red-dot"/> HAVE YOUR SAY</p><h2><span className="glitch-line" data-text="WHO RUNS">WHO RUNS</span><br/><em className="glitch-line" data-text="THIS TOWN?">THIS TOWN?</em></h2><p>Батлы впереди. Но у Сентфора уже есть своё мнение. А у тебя?</p></div><button className="primary-btn light-btn" onClick={()=>go('polls')}>ГОЛОСОВАТЬ СЕЙЧАС <ArrowRight size={18}/></button></div></section>
   <section className="section wrap sponsors-home"><SectionTitle tag="03 / POWERED BY" title="THE PEOPLE BEHIND THE NOISE" action="ВСЕ ПАРТНЁРЫ" onAction={()=>go('sponsors')}/><SponsorsShowcase compact onSecretFound={unlockSideEffect} onBonusUnlock={unlockShakeBonus} bonusUnlocked={Boolean(achievements.shakeBonus)}/></section>
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
  {page==='interviews'&&<section className="inner-page wrap"><PageHeading number="03" tag="ON THE RECORD" title={<><span className="glitch-line" data-text="ALL ACCESS.">ALL ACCESS.</span><br/><em className="glitch-line" data-text="NO FILTER.">NO FILTER.</em></>} intro="Пять интервью: по одному с каждым из четырёх рэперов и отдельный выпуск с Надин. Новая премьера каждый четверг в 19:00 МСК с 3 декабря 2026 года. Порядок участников пока предварительный."/><div className="interview-schedule-note">5 ВЫПУСКОВ <span>✳</span> 03 / 10 / 17 / 24 / 31 DEC 2026 <span>✳</span> 19:00 МСК</div><p className="interview-schedule-note">ПРОСМОТРЕНО НА САЙТЕ: {['interview-dex','interview-netti','interview-rud','interview-daro','interview-nadine'].filter(id=>watchedVideos[id]).length} / 5 · {['interview-dex','interview-netti','interview-rud','interview-daro','interview-nadine'].every(id=>watchedVideos[id])?'🏆 ПРЕДАННЫЙ ФАНАТ':'ДОСТИЖЕНИЕ ПОСЛЕ ВСЕХ ПЯТИ'}</p><div className="media-grid">{filteredMedia.map(m=><MediaCard key={m.id} m={m} available={Boolean(premieres[interviewKey(m.id)]?.available)} onClick={()=>openInterview(m)}/>)}</div><button type="button" className="fifth-home-tape fifth-interview-tape" onClick={()=>setFifthInterviewOpen(true)} aria-label="Открыть доступное секретное интерактивное интервью THE FIFTH CHAIR"><span className="fifth-home-tape-glyph"><Mic2 size={17}/></span><span className="fifth-home-tape-copy"><small>ARCHIVE / UNLISTED 006 <i>·</i> ДОСТУПНО СЕЙЧАС</small><strong>THE FIFTH CHAIR</strong><span>Секретное интерактивное интервью · сыграть и получить достижение</span></span><span className="fifth-home-tape-action">ИГРАТЬ <ArrowRight size={14}/></span></button><p className="page-footnote">Каждое интервью становится доступным в 19:00 МСК в день указанной премьеры.</p></section>}
  {page==='gallery'&&<section className="inner-page wrap"><PageHeading number="03" tag="THE ARCHIVE" title={<><span className="glitch-line" data-text="FREEZE">FREEZE</span><br/><em className="glitch-line" data-text="THE MOMENT.">THE MOMENT.</em></>} intro="Фотографии со сцены, бэкстейджа и съёмок. Настоящие кадры добавим по мере готовности."/><div className="gallery-grid">{gallery.map((g,i)=><button className={'gallery-tile tile-'+i} key={g.label} onClick={()=>setGalleryIndex(i)}><Cover src={g.image} alt={g.label} initials={String(i+1).padStart(2,'0')}/><span>{g.label} <ArrowRight size={16}/></span></button>)}</div></section>}
  {page==='sponsors'&&<section className="inner-page wrap sponsors-page"><PageHeading number="06" tag="POWERED BY" title={<><span className="glitch-heading" data-text="BACKED BY">BACKED BY</span><br/><em className="glitch-heading" data-text="THE CULTURE.">THE CULTURE.</em></>} intro="WARLOCK, BLACK HELLEBORE ENERGY и GOSSIP SAINTFOUR — бренды и партнёры нашего фанатского рэп-шоу."/><SponsorsShowcase onSecretFound={unlockSideEffect} onBonusUnlock={unlockShakeBonus} bonusUnlocked={Boolean(achievements.shakeBonus)}/></section>}
  {page==='polls'&&<section className="inner-page wrap official-voting-page"><PageHeading number="04" tag="YOUR VOTE MATTERS" title={<><span className="glitch-line" data-text="WHO WINS?">WHO WINS?</span><br/><em className="glitch-line" data-text="YOU DECIDE.">YOU DECIDE.</em></>} intro="Прогнозы до премьеры уже открыты! А официальные голосования за победителей начнутся после выхода соответствующих выпусков."/>
    <HypePolls onVotesChanged={unlockLoyalOne}/>
    <div className="official-voting-intro" aria-labelledby="official-voting-title">
      <div className="official-voting-intro-copy"><span className="official-voting-kicker"><span className="official-voting-live-dot"/> THE MAIN EVENT / COMING SOON</span><h2 id="official-voting-title">OFFICIAL <em>VOTING.</em></h2><p>Прогнозы закончились. Теперь решать тебе, кто пройдёт дальше. Голосование откроется после выхода каждого батла.</p></div>
      <div className="official-voting-seal" aria-hidden="true"><span>SF</span><strong>VS</strong><small>THE VERDICT</small></div>
    </div>
    
    <div className="vote-explanation"><div><strong>КАК ПРОХОДИТ ГОЛОСОВАНИЕ?</strong><p>После выхода батла появятся голосования на сайте и в Telegram. Они будут открыты в течение 48 часов. Победители первых двух батлов проходят в финал.</p></div><div><strong>КОГДА МОЖНО ГОЛОСОВАТЬ?</strong><p>Пока официальные голосования закрыты. Они откроются после премьер соответствующих выпусков — тогда и можно будет отдать свой голос за победителя.</p></div></div>
    <div className="vote-rules-strip"><span><Vote size={18}/> OFFICIAL VOTING</span><span>48 ЧАСОВ НА ГОЛОСОВАНИЕ</span><span>TELEGRAM + SAINTFOUR VS</span></div>
    <div className="official-vote-grid">
      <OfficialVoteCard number="01" first={rappers[0]} second={rappers[1]}/>
      <OfficialVoteCard number="02" first={rappers[2]} second={rappers[3]}/>
      <OfficialVoteCard number="03" final/>
    </div>
    <BattlePredictions onOpenBank={()=>go('bank')}/>
    
  </section>}
  </main>
  <footer className="footer"><div className="wrap footer-main"><div><span className="footer-logo">SAINTFOUR</span><p>RAP BATTLE <b>’27</b></p><small>AN ORIGINAL GOSSIP SAINTFOUR PROJECT</small></div><div className="footer-nav">{nav.slice(1).map(n=><button key={n.id} onClick={()=>go(n.id)} className={n.id==='achievements'?'achievement-footer-link':undefined}>{n.id==='achievements'&&<Trophy size={14}/>} {n.name}{n.id==='achievements'&&<span>{unlockedCount}/5</span>}</button>)}</div><div className="footer-stamp"><Radio size={23}/><span>UNDERGROUND<br/>NEVER DIES.</span></div></div><div className="wrap fan-disclaimer-footer"><details><summary>UNOFFICIAL FAN PROJECT · ПРАВОВАЯ ИНФОРМАЦИЯ</summary><p>SAINTFOUR RAP BATTLE ’27 — неофициальный фанатский проект, созданный исключительно в развлекательных целях по мотивам вселенной «Клуба Романтики». Все права на оригинальных персонажей и материалы принадлежат их соответствующим правообладателям. Проект не связан с разработчиками и не является официальным.</p></details></div><div className="wrap footer-bottom"><span>© {2027} GOSSIP SAINTFOUR. FAN PROJECT.</span><span>MADE FOR THE CULTURE. NOT FOR THE CLOUT.</span><button type="button" className="wilson-footer-link" onClick={()=>setWilsonOpen(true)}><FileWarning size={13}/> REPORT AN INCIDENT · SHERIFF’S OFFICE</button></div></footer>
  <SheriffComplaints open={wilsonOpen} achievementUnlocked={Boolean(achievements.wilsonSnitch)} onClose={()=>setWilsonOpen(false)} onFirstComplaint={unlockWilsonComplaint}/>
  {achievementToast==='dexOnTheLine'&&!wilsonOpen&&<div className="achievement-toast achievement-tier-6" role="status" aria-live="polite"><button type="button" className="achievement-toast-main" onClick={()=>{setAchievementToast(null);go('achievements')}}><div className="achievement-toast-medal"><div className="sf-medallion"><Phone size={23}/><i>12</i></div></div><div className="achievement-toast-copy"><span>NEW ACHIEVEMENT <i>12 / SECRET</i></span><strong>НА УХЕ У LIL DEX</strong><small>25 звонков Дексу! Посмотреть достижение →</small></div></button><button type="button" className="achievement-toast-dismiss" aria-label="Закрыть уведомление" onClick={()=>setAchievementToast(null)}><X size={16}/></button></div>}
   {warlockNotice&&!achievementToast&&<div className="warlock-notice" role="status" aria-live="polite"><span className="warlock-notice-kicker"><Eye size={13}/> WARLOCK SECURITY / SYSTEM MESSAGE</span><strong>WARLOCK ОТСЛЕЖИВАЕТ ВАШУ АКТИВНОСТЬ.</strong><small>Шутка. Наверное.</small><button type="button" aria-label="Закрыть уведомление" onClick={()=>{setWarlockNotice(false);releaseAmbient('warlock')}}><X size={15}/></button></div>}
  {achievementToast&&achievementToast!=='dexOnTheLine'&&!wilsonOpen&&<div className={`achievement-toast achievement-tier-${achievementToast==='wilsonSnitch'?6:achievementToast==='nightOwl'?6:achievementToast==='shakeBonus'?6:achievementToast==='fifthChair'?5:achievementToast==='whosWatching'?4:achievementToast==='sideEffect'?3:achievementToast==='loyalOne'?2:1}`} role="status" aria-live="polite"><button className="achievement-toast-main" type="button" onClick={()=>{setAchievementToast(null);setHowardMailOpen(false);setSelected(null);go('achievements')}}><div className="achievement-toast-medal"><div className="sf-medallion"><span className="sf-medallion-rays" aria-hidden="true">✦</span>{achievementToast==='wilsonSnitch'?<FileWarning size={23}/>:achievementToast==='nightOwl'?<Eye size={23}/>:achievementToast==='shakeBonus'?<Zap size={23} strokeWidth={1.6}/>:achievementToast==='fifthChair'?<Mic2 size={23} strokeWidth={1.6}/>:achievementToast==='whosWatching'?<Mail size={23} strokeWidth={1.6}/>:achievementToast==='sideEffect'?<FlaskConical size={23} strokeWidth={1.6}/>:achievementToast==='loyalOne'?<Vote size={23} strokeWidth={1.6}/>:<Ticket size={23} strokeWidth={1.6}/>}<i>{achievementToast==='wilsonSnitch'?'09':achievementToast==='nightOwl'?'08':achievementToast==='shakeBonus'?'06':achievementToast==='fifthChair'?'05':achievementToast==='whosWatching'?'04':achievementToast==='sideEffect'?'03':achievementToast==='loyalOne'?'02':'01'}</i></div></div><div className="achievement-toast-copy"><span>NEW ACHIEVEMENT <i>{achievementToast==='wilsonSnitch'?'09':achievementToast==='nightOwl'?'08':achievementToast==='shakeBonus'?'06':achievementToast==='fifthChair'?'05':achievementToast==='whosWatching'?'04':achievementToast==='sideEffect'?'03':achievementToast==='loyalOne'?'02':'01'} / {achievementToast==='wilsonSnitch'?'SECRET':achievementToast==='nightOwl'?'SECRET':achievementToast==='shakeBonus'?'BONUS':'05'}</i></span><strong>{achievementToast==='wilsonSnitch'?'СТУКАЧ СЕНТФОРА':achievementToast==='nightOwl'?'ТЫ ВООБЩЕ СПИШЬ?':achievementToast==='shakeBonus'?'SHAKE RESPONSIBLY':achievementToast==='fifthChair'?'THE FIFTH CHAIR':achievementToast==='whosWatching'?"WHO'S WATCHING?":achievementToast==='sideEffect'?'SIDE EFFECT':achievementToast==='loyalOne'?'THE LOYAL ONE':'EARLY BIRD'}</strong><small>{achievementToast==='wilsonSnitch'?'Шериф Уилсон благодарит за сотрудничество':achievementToast==='nightOwl'?'Поппи советует тебе поспать':achievementToast==='shakeBonus'?'Промокод SHAKE10GET0 получен':achievementToast==='fifthChair'?'Интервью с невидимым гостем завершено':achievementToast==='whosWatching'?'Засекреченное письмо найдено':achievementToast==='sideEffect'?'Секретная формула найдена':achievementToast==='loyalOne'?'Все четыре голоса учтены':'Ты успел до первой премьеры'} <ArrowRight size={13}/></small></div></button><button type="button" className="achievement-toast-dismiss" aria-label="Закрыть уведомление" onClick={()=>setAchievementToast(null)}><X size={16}/></button></div>}
  {allAccessOpen&&<AllAccessTicket onClose={()=>setAllAccessOpen(false)}/>}
  {fifthInterviewOpen&&<SecretInterview onClose={()=>setFifthInterviewOpen(false)} onComplete={unlockFifthChair} alreadyEarned={Boolean(achievements.fifthChair)}/>}
  {selected&&<div className="modal-backdrop" onClick={()=>setSelected(null)}><section className="artist-modal" role="dialog" aria-modal="true" aria-label={selected.stage} onClick={e=>e.stopPropagation()}><button className="close-btn" onClick={()=>setSelected(null)} aria-label="Закрыть"><X/></button><Cover key={selected.id+'-'+(selected.profileImage||selected.image)} src={selected.profileImage?selected.profileImage+'?v=2':selected.image} initials={selected.initials} alt={selected.stage}/><div className="artist-modal-body"><span className="eyebrow">{selected.isHost?'HOST / SHOW PRESENTER':`CONTESTANT / ${selected.number}`}</span><h2 className="glitch-heading" data-text={selected.stage}>{selected.stage}</h2><p className="modal-realname">{selected.name}</p><div className="modal-rule"/><p>{selected.description}</p><strong>{selected.subtitle}</strong>{selected.isHost&&<button type="button" className="poppy-notebook-teaser" onClick={()=>setPoppyNotebookOpen(true)} aria-label="Открыть личный блокнот Поппи"><span className="poppy-notebook-teaser-icon"><NotebookPen size={23}/></span><span className="poppy-notebook-teaser-text"><small>POPPY / PRIVATE NOTES</small><strong>НЕ ДЛЯ ЭФИРА</strong><span>Записи организатора. Не открывать.</span></span><ArrowRight size={17} className="poppy-notebook-teaser-arrow"/></button>}{selected.id==='dex'&&<button type="button" className="dex-kitten-teaser" onClick={()=>setDexKittenOpen(true)} aria-label="Открыть фотографию маленького менеджера LIL DEX"><img src={dexManagerPhoto} alt="Чёрный котёнок Декса лежит на блокноте с панчами"/><span className="dex-kitten-teaser-copy"><small>LIL DEX / MANAGEMENT</small><b>МАЛЕНЬКИЙ МЕНЕДЖЕР LIL DEX</b><span>Забраковал половину панчей. Уснул на остальных.</span></span><ArrowRight size={16} className="dex-kitten-arrow"/></button>}{selected.id==='rudi'&&<button type="button" className="rudi-letter-teaser" onClick={()=>setRudiLetterOpen(true)} aria-label="Прочитать личную записку для YUNG RUD"><span className="rudi-letter-teaser-icon" aria-hidden="true"><span>♡</span></span><span className="rudi-letter-teaser-copy"><small>PERSONAL / FOR RUDI ONLY</small><b>ЛИЧНАЯ ЗАПИСКА ДЛЯ YUNG RUD</b><span>Кто-то оставил её среди вещей Руди перед батлом.</span></span><ArrowRight size={17} className="rudi-letter-teaser-arrow"/></button>}{selected.id==='daro'&&<button type="button" className="daro-rider-teaser" onClick={()=>setDaroRiderOpen(true)} aria-label="Открыть официальный райдер DON DARO"><span className="daro-rider-teaser-seal">DD</span><span className="daro-rider-teaser-copy"><small>DON DARO / BACKSTAGE DOCUMENT</small><b>ОФИЦИАЛЬНЫЙ РАЙДЕР</b><span>Список требований. Комментарий организатора прилагается.</span></span><ArrowRight size={17} className="daro-rider-teaser-arrow"/></button>}{selected.id==='netti'&&<button type="button" className="howard-mail-teaser" onClick={openHowardMail} aria-label="Открыть архивное письмо Поппи о регистрации MC NETTI"><span className="howard-mail-teaser-icon"><Mail size={19}/></span><span className="howard-mail-teaser-copy"><small>POPPY'S INBOX / CASE 027</small><b>РЕГИСТРАЦИЯ БЕЗ ОТПРАВИТЕЛЯ</b><span>Одно письмо. Никакого объяснения.</span></span><ArrowRight className="howard-mail-teaser-arrow" size={17}/></button>}</div></section></div>}
  {poppyNotebookOpen&&<PoppyNotebook onClose={()=>setPoppyNotebookOpen(false)}/>}
  {rudiLetterOpen&&<div className="rudi-letter-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setRudiLetterOpen(false)}}><section className="rudi-letter-dialog" role="dialog" aria-modal="true" aria-labelledby="rudi-letter-title"><header className="rudi-letter-toolbar"><span>PRIVATE NOTE / FOR RUDI BROOKS</span><button type="button" onClick={()=>setRudiLetterOpen(false)} aria-label="Закрыть записку"><X size={20}/></button></header><div className="rudi-letter-desk"><div className="rudi-letter-paper"><div className="rudi-letter-fold" aria-hidden="true"/><div className="rudi-letter-kiss" role="img" aria-label="Неровный отпечаток губ красно-розовой помадой"><svg viewBox="0 0 160 96" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><defs><filter id="lipstamp-worn"><feTurbulence type="fractalNoise" baseFrequency=".37" numOctaves="3" seed="18" result="grain"/><feDisplacementMap in="SourceGraphic" in2="grain" scale="3" xChannelSelector="R" yChannelSelector="G"/></filter><mask id="lipstamp-wear"><rect width="160" height="96" fill="white"/><g fill="black" opacity=".65"><ellipse cx="37" cy="32" rx="10" ry="1.7" transform="rotate(-18 37 32)"/><ellipse cx="65" cy="29" rx="5" ry="1.5"/><ellipse cx="96" cy="31" rx="10" ry="1.8" transform="rotate(14 96 31)"/><ellipse cx="116" cy="44" rx="3" ry="1.6"/><ellipse cx="49" cy="67" rx="7" ry="1.8" transform="rotate(12 49 67)"/><ellipse cx="85" cy="72" rx="10" ry="2"/><ellipse cx="106" cy="61" rx="5" ry="1.7"/><path d="M22 45l16 -1M62 38l11 1M105 40l15 -1M51 58l13 2M92 57l10 -1" fill="none" stroke="black" strokeWidth="1.3"/></g></mask></defs><g fill="#ae3452" mask="url(#lipstamp-wear)" filter="url(#lipstamp-worn)"><path d="M11 46C20 33 39 22 56 26C65 28 70 34 79 33C90 22 102 21 116 28C129 34 140 39 148 47C132 45 119 46 106 44C94 41 84 39 79 41C73 39 63 42 50 43C37 43 24 44 11 46Z"/><path d="M14 52C25 56 41 57 54 53C65 50 72 47 79 48C87 47 97 51 110 52C124 53 136 49 146 50C131 59 119 72 101 78C87 83 71 84 57 80C38 75 25 63 14 52Z"/></g><g fill="none" stroke="#8d2d48" strokeWidth="1.7" strokeLinecap="round" opacity=".43"><path d="M29 37c10 -6 19 -7 27 -6M100 30c11 -2 21 3 28 8M35 61c10 7 22 11 33 12M86 76c13 -1 23 -6 32 -12"/></g><g fill="#b94462" opacity=".55"><circle cx="24" cy="58" r="1.3"/><circle cx="132" cy="55" r="1.1"/><circle cx="115" cy="75" r="1"/><circle cx="42" cy="78" r=".8"/></g></svg></div><span className="rudi-letter-topline">FOR RUDI / PERSONAL</span><h2 id="rudi-letter-title">Руди, <span>♡</span></h2><div className="rudi-letter-body"><p>Я знаю, что для тебя важно побеждать.<br/>Ты всегда делаешь вид, что спокоен, но я всё равно вижу, как сильно ты стараешься.</p><p>Я просто хотела сказать тебе одну вещь.</p><p>Даже если что-то пойдёт не так, даже если ты не выиграешь этот батл, я всё равно буду верить в тебя и болеть за тебя громче всех.</p><p>Наверное, дело уже давно не только в батле.</p><p>Мне просто всегда хотелось, чтобы однажды ты посмотрел на меня так же, как я смотрю на тебя.</p></div><p className="rudi-letter-signature">Эбигейл <span>♡</span></p><p className="rudi-letter-postscript">P.S. Пожалуйста, не показывай это Дексу.</p></div><div className="rudi-letter-footnote"><span>Найдено среди вещей Руди.</span><small>На конверте было только его имя. А внутри — всё, что она так и не решилась сказать вслух.</small></div></div></section></div>}
  {daroRiderOpen&&<div className="daro-rider-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setDaroRiderOpen(false)}}><section className="daro-rider-dialog" role="dialog" aria-modal="true" aria-labelledby="daro-rider-title"><header className="daro-rider-toolbar"><span>DON DARO / ARTIST MANAGEMENT</span><button type="button" onClick={()=>setDaroRiderOpen(false)} aria-label="Закрыть райдер DON DARO"><X size={20}/></button></header><div className="daro-rider-paper"><div className="daro-rider-document-top"><span>SAINTFOUR RAP BATTLE ’27</span><strong>BACKSTAGE / PRIVATE</strong></div><div className="daro-rider-monogram" aria-hidden="true">DD<span>★</span></div><p className="daro-rider-kicker">OFFICIAL ARTIST REQUIREMENTS / DON DARO</p><h2 id="daro-rider-title">ОФИЦИАЛЬНЫЙ<br/><em>РАЙДЕР DON DARO</em></h2><p className="daro-rider-intro">Передано организаторам Saintfour Rap Battle до начала съёмок.</p><div className="daro-rider-rule"/><h3>ТРЕБОВАНИЯ АРТИСТА</h3><ol className="daro-rider-list"><li>Отдельная гримёрка.</li><li>Зеркало в полный рост.</li><li>Идеальное освещение.</li><li>Леопардовая шуба должна находиться в радиусе вытянутой руки.</li><li>Никаких вопросов о бюджете.</li><li>Напитки подавать так, будто это backstage мирового тура.</li><li>Уважительное обращение обязательно.</li></ol><div className="daro-rider-note"><span>ПРИМЕЧАНИЕ / ОТ АРТИСТА</span><p>В случае несоблюдения условий артист оставляет за собой право закатить глаза, пожаловаться на уровень сервиса и всё равно выйти в кадр красивым.</p></div><div className="daro-rider-stamp" aria-label="Получено организаторами"><span>RECEIVED</span><strong>SF / PRODUCTION</strong></div><div className="daro-rider-bottom"><div><span>СТАТУС</span><strong>Получено организаторами</strong></div><div><span>КОММЕНТАРИЙ СПЛЕТНИЦЫ</span><p>«Бюджет не согласован. Складной стул уже готов».</p></div></div></div></section></div>}
  {dexKittenOpen&&<div className="dex-kitten-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setDexKittenOpen(false)}}><section className="dex-kitten-dialog" role="dialog" aria-modal="true" aria-label="Маленький менеджер LIL DEX"><button type="button" className="dex-kitten-close" onClick={()=>setDexKittenOpen(false)} aria-label="Закрыть пасхалку"><X size={20}/></button><img src={dexManagerPhoto} alt="Чёрный котёнок с кулоном в форме крестика спит на листке с панчами для батла"/><div className="dex-kitten-caption"><span>OFFICIAL MANAGEMENT / LIL DEX</span><h2>МАЛЕНЬКИЙ МЕНЕДЖЕР</h2><p>Лично проверил панчи Декса. Половину забраковал, на остальных уснул.</p><small>Все вопросы по сотрудничеству — после дневного сна.</small></div></section></div>}
  {howardMailOpen&&<div className="howard-mail-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setHowardMailOpen(false)}}><section className="howard-mail-dialog" role="dialog" aria-modal="true" aria-labelledby="howard-mail-title"><div className="howard-mail-toolbar"><span><Mail size={15}/> POPPY / ARCHIVED MAIL</span><button type="button" autoFocus onClick={()=>setHowardMailOpen(false)} aria-label="Закрыть архивное письмо"><X size={20}/></button></div><div className="howard-mail-paper"><div className="howard-mail-stamp"><span>INBOX / UNSOLICITED</span><strong>FILE #027</strong></div><span className="howard-mail-kicker"><FileWarning size={14}/> RECOVERED MESSAGE · SENDER NOT VERIFIED</span><h2 id="howard-mail-title" className="howard-mail-glitch" data-text="UNKNOWN SENDER.">UNKNOWN <em>SENDER.</em></h2><div className="howard-mail-headers"><div><span>TO</span><strong>POPPY / SAINTFOUR RAP BATTLE</strong></div><div><span>FROM</span><strong className="howard-mail-redaction">████████@██████.███ <small>IDENTITY HIDDEN</small></strong></div><div><span>RECEIVED</span><strong>19 NOV 2026 · 02:17</strong></div><div><span>SUBJECT</span><strong>REGISTRATION CONFIRMATION / MC NETTI</strong></div></div><div className="howard-mail-content"><p>Уважаемая Пенелопа Эмерсон!</p><p>Направляем подтверждение регистрации участника <b>NATHANIEL HOWARD</b> под сценическим именем <b>MC NETTI</b> для SAINTFOUR RAP BATTLE ’27.</p><p>Участие согласовано. Представитель участника просил не связываться с ним до публикации состава. Все дальнейшие уведомления направляйте организатору шоу.</p><p>В случае вопросов используйте идентификатор заявки <b>SF–027–H</b>.</p><p className="howard-mail-signature">С уважением,<br/><span>ИМЯ ОТПРАВИТЕЛЯ УДАЛЕНО</span></p></div><div className="howard-mail-alert"><Eye size={17}/><div><strong>НЕСООТВЕТСТВИЕ / 01</strong><span>Личность отправителя не установлена. Подтверждение от самого Говарда отсутствует.</span></div></div><div className="howard-mail-bottom"><span>ATTACHMENT / REGISTRATION_SF027.pdf</span><span>ACCESS DENIED — FILE REMOVED</span></div><p className="howard-mail-poppy-note">Заметка Поппи: «И вот после такого мне говорят, что он сам не записывался. Тогда кто это отправил?»</p></div></section></div>}
  {activeVideo&&<div className="modal-backdrop" onClick={()=>setActiveVideo(null)}><section className="video-modal" role="dialog" aria-modal="true" aria-label={activeVideo.title} onClick={e=>e.stopPropagation()}><button className="close-btn" onClick={()=>setActiveVideo(null)} aria-label="Закрыть"><X/></button>{activeVideo.url?<video controls playsInline autoPlay src={activeVideo.url} onTimeUpdate={checkVideoProgress} onEnded={checkVideoProgress}/>:<div className="video-unavailable"><Play size={42}/><h3>COMING SOON</h3><p>Видео ещё не опубликовано.</p></div>}<h3>{activeVideo.title}</h3></section></div>}
  {watchToast&&<div className="warlock-notice" role="status"><span className="warlock-notice-kicker"><Trophy size={13}/> SAINTFOUR / WATCH PROGRESS</span><strong>{watchToast}</strong><button type="button" onClick={()=>setWatchToast('')} aria-label="Закрыть"><X size={15}/></button></div>}
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
function MediaCard({m,onClick,available=false}){return <button className={'media-card '+(!available?'media-locked':'')} onClick={onClick} disabled={!available} aria-label={available?`Смотреть ${m.title}`:`${m.title} — премьера ${m.duration}`}><div className="media-image"><Cover src={m.thumbnail} alt={m.title} initials="INT"/><span className="media-type">{available?'В ЭФИРЕ':'СКОРО'}</span>{available&&<span className="play-circle"><Play fill="currentColor" size={19}/></span>}</div><div className="media-info"><span>{m.artist} <i>•</i> {m.date?'ПРЕМЬЕРА '+m.duration:m.duration}</span><h3 className="glitch-heading" data-text={m.title}>{m.title}</h3><p>{available?'СМОТРЕТЬ ИНТЕРВЬЮ':'ДОСТУПНО ПОСЛЕ ПРЕМЬЕРЫ'} <ArrowRight size={15}/></p></div></button>}
function PageHeading({number,tag,title,intro}){return <div className="page-heading"><div className="page-kicker"><span className="red-dot"/> {number} / {tag}</div><h1>{title}</h1><p>{intro}</p><div className="page-heading-line"/></div>}