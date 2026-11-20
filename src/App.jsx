import { useEffect, useMemo, useState } from 'react'
import { ArrowDownRight, ArrowRight, CalendarDays, Check, ChevronLeft, ChevronRight, Clapperboard, Flame, Home, Images, Menu, Mic2, Play, Radio, Vote, X } from 'lucide-react'
import './App.css'
import './theme.css'
import './cyber.css'
import './glitch.css'

const rappers = [
  { id:'dex', stage:'LIL DEX', name:'DEX HAWK', subtitle:'NO RULES. NO MERCY.', role:'THE WILD CARD', number:'01', color:'#ff78cf', initials:'DX', image:'/media/lil-dex.jpg', description:'Самый непредсказуемый участник. Резкие панчи, хаос и никаких тормозов.' },
  { id:'netti', stage:'MC NETTI', name:'NATHANIEL HOWARD', subtitle:'BUSINESS IS PERSONAL.', role:'THE EXECUTIVE', number:'02', color:'#c49afd', initials:'MN', image:'/media/mc-netti.jpg', description:'Глава Warlock на баттл-сцене. Холодный расчёт и ни одного лишнего слова.' },
  { id:'rudi', stage:'YUNG RUD', name:'RUDI BROOKS', subtitle:'PLAY TO WIN.', role:'THE CONTENDER', number:'03', color:'#e2a0ff', initials:'RB', image:'/media/rudi.jpg', description:'Капитан команды выходит за пределы площадки. Игра только начинается.' },
  { id:'daro', stage:'DON DARO', name:'DARREN', subtitle:'MAKE SOME NOISE.', role:'THE UNKNOWN', number:'04', color:'#a87fff', initials:'DD', image:'/media/don-daro.jpg', description:'Один из главных сюрпризов вечера. Его карты пока не раскрыты.' },
]
const media = [
  { id:'interview-dex', type:'INTERVIEW', title:'LIL DEX — BEFORE THE BATTLE', duration:'SOON', artist:'Lil Dex', thumbnail:'/media/interview-dex.jpg', url:'' },
  { id:'interview-netti', type:'INTERVIEW', title:'MC NETTI — NO COMMENT', duration:'SOON', artist:'MC Netti', thumbnail:'/media/interview-netti.jpg', url:'' },
  { id:'trailer', type:'VIDEO', title:'SAINTFOUR RAP BATTLE — OFFICIAL TEASER', duration:'SOON', artist:'Saintfour', thumbnail:'/media/teaser.jpg', url:'' },
]
const gallery = [
  { image:'/media/gallery-01.jpg', label:'BACKSTAGE / 001' },
  { image:'/media/gallery-02.jpg', label:'THE STAGE / 002' },
  { image:'/media/gallery-03.jpg', label:'AFTER THE ROUND / 003' },
  { image:'/media/gallery-04.jpg', label:'BEHIND THE SCENES / 004' },
]
const announcements = [
  { date:'26 NOV', label:'ANNOUNCEMENT', title:'THE LINEUP IS HERE', detail:'Четыре участника. Один микрофон. Начинаем обратный отсчёт.' },
  { date:'DEC ’26', label:'COMING UP', title:'FACE TO FACE', detail:'Интервью, закулисье и новые подробности предстоящего шоу.' },
  { date:'2027', label:'MAIN EVENT', title:'SAINTFOUR RAP BATTLE ’27', detail:'Главный баттл Сентфора. Дата премьеры будет объявлена отдельно.' },
]
const pollOptions = [
  { id:'dex', label:'LIL DEX' }, { id:'netti', label:'MC NETTI' }, { id:'rudi', label:'YUNG RUD' }, { id:'daro', label:'DON DARO' },
]
const nav = [
  { id:'home', name:'Главная', Icon:Home },
  { id:'artists', name:'Участники', Icon:Mic2 },
  { id:'media', name:'Медиатека', Icon:Clapperboard },
  { id:'gallery', name:'Галерея', Icon:Images },
  { id:'news', name:'Анонсы', Icon:CalendarDays },
  { id:'polls', name:'Опросы', Icon:Vote },
]
function Cover({src, alt, className='', initials='', style={}}) {
  const [broken,setBroken]=useState(false)
  return <div className={`cover ${className}`} style={style}>{!broken && src ? <img src={src} alt={alt} onError={()=>setBroken(true)} /> : <div className="cover-fallback"><span className="cover-noise" /><strong>{initials || 'SF'}</strong><small>SAINTFOUR RAP BATTLE</small></div>}</div>
}
function SectionTitle({tag,title,action, onAction}){return <div className="section-heading"><div><p className="eyebrow"><span className="red-dot"/> {tag}</p><h2 className="glitch-heading" data-text={title}>{title}</h2></div>{action && <button className="text-button" onClick={onAction}>{action} <ArrowRight size={16}/></button>}</div>}
export default function App() {
 const [page,setPage]=useState('home')
 const [menuOpen,setMenuOpen]=useState(false)
 const [selected,setSelected]=useState(null)
 const [voted,setVoted]=useState(()=>{try{return localStorage.getItem('sf_poll_vote')}catch{return null}})
 const [activeVideo,setActiveVideo]=useState(null)
 const [galleryIndex,setGalleryIndex]=useState(null)
 const [filter,setFilter]=useState('ALL')
 const telegramUser=window.Telegram?.WebApp?.initDataUnsafe?.user?.first_name || null
 useEffect(()=>{
   const tg=window.Telegram?.WebApp
   if(!tg)return
   tg.ready();tg.expand()
   tg.setHeaderColor?.('#09090d');tg.setBackgroundColor?.('#09090d')
 },[])
 useEffect(()=>{window.scrollTo({top:0,behavior:'smooth'})},[page])
 useEffect(()=>{const onKey=e=>{if(e.key==='Escape'){setSelected(null);setActiveVideo(null);setGalleryIndex(null)} if(galleryIndex!==null){if(e.key==='ArrowRight')setGalleryIndex(i=>(i+1)%gallery.length);if(e.key==='ArrowLeft')setGalleryIndex(i=>(i+gallery.length-1)%gallery.length)}};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[galleryIndex])
 const filteredMedia=useMemo(()=>media.filter(m=>filter==='ALL'||m.type===filter),[filter])
 const go=(p)=>{setPage(p);setMenuOpen(false)}
 function castVote(id){setVoted(id);try{localStorage.setItem('sf_poll_vote',id)}catch{}}
 return <div className="app">
  <div className="top-strip"><span>GOSSIP SAINTFOUR PRESENTS</span><span className="top-right"><span className="live-dot"/> THE UNDERGROUND IS CALLING</span></div>
  <header className="header"><button className="logo" onClick={()=>go('home')} aria-label="На главную"><span className="logo-mark">SF<span>✳</span></span><span className="logo-type">SAINTFOUR<strong>RAP BATTLE <i>’27</i></strong></span></button><nav className="desktop-nav" aria-label="Навигация">{nav.map(n=><button key={n.id} className={page===n.id?'active':''} onClick={()=>go(n.id)}>{n.name}</button>)}</nav><div className="header-actions"><span className="edition">VOL. 001 / 2027</span><button className="mobile-menu-button" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Меню">{menuOpen?<X/>:<Menu/>}</button></div></header>
  {menuOpen&&<nav className="mobile-nav" aria-label="Мобильная навигация">{nav.map(n=><button key={n.id} onClick={()=>go(n.id)}><n.Icon size={17}/>{n.name}<ArrowRight size={16}/></button>)}</nav>}
  <main>
  {page==='home'&&<>
   <section className="hero"><div className="hero-grid"/><div className="hero-flare"/><div className="hero-inner"><div className="hero-copy"><div className="hero-tag"><span className="status-pulse"/> THE STREETS HAVE A VOICE <span className="hero-tag-end">EST. SAINTFOUR</span></div><p className="hero-overline">GOSSIP SAINTFOUR ORIGINAL PRODUCTION</p><h1><span className="glitch-line" data-text="NO">NO</span><br/><span className="glitch-line" data-text="MORE">MORE</span><br/><em className="hero-glitch" data-text="SILENCE.">SILENCE<span>.</span></em></h1><p className="hero-subtitle">Четыре имени. Один микрофон. Никаких правил.<br/>SAINTFOUR RAP BATTLE <strong>’27</strong> — скоро.</p><div className="hero-buttons"><button className="primary-btn" onClick={()=>go('artists')}>УЗНАТЬ УЧАСТНИКОВ <ArrowRight size={17}/></button><button className="secondary-btn" onClick={()=>go('media')}><Play size={15}/> СМОТРЕТЬ МЕДИА</button></div></div><div className="hero-poster"><div className="poster-ring ring-1"/><div className="poster-ring ring-2"/><div className="poster-inner"><span>THE BATTLE</span><b>SF<span>’27</span></b><small>NO FILTER. NO FEAR.</small></div><div className="poster-corner">001 — SAINTFOUR</div></div></div><div className="hero-bottom"><span>SCROLL TO EXPLORE <ArrowDownRight size={15}/></span><span>INDEPENDENT UNDERGROUND SHOW — 2027</span></div></section>
   <div className="ticker"><div>NO RULES <span>✳</span> NO FILTER <span>✳</span> NO MERCY <span>✳</span> SAINTFOUR RAP BATTLE ’27 <span>✳</span> NO RULES <span>✳</span> NO FILTER <span>✳</span> NO MERCY <span>✳</span></div></div>
   <section className="section wrap"><SectionTitle tag="01 / THE LINEUP" title="MEET THE CONTENDERS" action="ВСЕ УЧАСТНИКИ" onAction={()=>go('artists')}/><div className="artist-grid">{rappers.map(r=><ArtistCard key={r.id} r={r} onClick={()=>setSelected(r)}/>)}</div></section>
   <section className="section wrap"><SectionTitle tag="02 / ON THE RECORD" title="BEHIND THE MIC" action="ВСЯ МЕДИАТЕКА" onAction={()=>go('media')}/><div className="media-grid">{media.slice(0,3).map(m=><MediaCard key={m.id} m={m} onClick={()=>setActiveVideo(m)}/>)}</div></section>
   <section className="promo-band"><div className="wrap promo-content"><div><p className="eyebrow"><span className="red-dot"/> HAVE YOUR SAY</p><h2><span className="glitch-line" data-text="WHO RUNS">WHO RUNS</span><br/><em className="glitch-line" data-text="THIS TOWN?">THIS TOWN?</em></h2><p>Выбирай фаворита до начала баттла.</p></div><button className="primary-btn light-btn" onClick={()=>go('polls')}>ПЕРЕЙТИ К ОПРОСУ <ArrowRight size={18}/></button></div></section>
   <section className="section wrap"><SectionTitle tag="03 / LATEST UPDATES" title="THE WORD ON THE STREET" action="ВСЕ АНОНСЫ" onAction={()=>go('news')}/><NewsList/></section>
  </>}
  {page==='artists'&&<section className="inner-page wrap"><PageHeading number="01" tag="THE LINEUP" title={<><span className="glitch-line" data-text="FOUR NAMES.">FOUR NAMES.</span><br/><em className="glitch-line" data-text="ONE STAGE.">ONE STAGE.</em></>} intro="Знакомься с участниками SAINTFOUR RAP BATTLE ’27. У каждого своя история и своя причина выйти к микрофону."/><div className="artist-grid">{rappers.map(r=><ArtistCard key={r.id} r={r} onClick={()=>setSelected(r)}/>)}</div><p className="page-footnote">* Состав и сценические псевдонимы могут уточняться по мере подготовки шоу.</p></section>}
  {page==='media'&&<section className="inner-page wrap"><PageHeading number="02" tag="ON THE RECORD" title={<><span className="glitch-line" data-text="ALL ACCESS.">ALL ACCESS.</span><br/><em className="glitch-line" data-text="NO FILTER.">NO FILTER.</em></>} intro="Интервью, тизеры и видео со съёмок. Здесь появятся все материалы проекта."/><div className="filter-pills">{['ALL','INTERVIEW','VIDEO'].map(f=><button key={f} className={filter===f?'selected':''} onClick={()=>setFilter(f)}>{f==='ALL'?'ВСЁ':f==='INTERVIEW'?'ИНТЕРВЬЮ':'ВИДЕО'}</button>)}</div><div className="media-grid">{filteredMedia.map(m=><MediaCard key={m.id} m={m} onClick={()=>setActiveVideo(m)}/>)}</div><p className="page-footnote">Видео появятся здесь после публикации. Превью пока являются заглушками.</p></section>}
  {page==='gallery'&&<section className="inner-page wrap"><PageHeading number="03" tag="THE ARCHIVE" title={<><span className="glitch-line" data-text="FREEZE">FREEZE</span><br/><em className="glitch-line" data-text="THE MOMENT.">THE MOMENT.</em></>} intro="Фотографии со сцены, бэкстейджа и съёмок. Настоящие кадры добавим по мере готовности."/><div className="gallery-grid">{gallery.map((g,i)=><button className={'gallery-tile tile-'+i} key={g.label} onClick={()=>setGalleryIndex(i)}><Cover src={g.image} alt={g.label} initials={String(i+1).padStart(2,'0')}/><span>{g.label} <ArrowRight size={16}/></span></button>)}</div></section>}
  {page==='news'&&<section className="inner-page wrap"><PageHeading number="04" tag="THE BULLETIN" title={<><span className="glitch-line" data-text="STAY">STAY</span><br/><em className="glitch-line" data-text="LOCKED IN.">LOCKED IN.</em></>} intro="Главные новости и анонсы предстоящего рэп-баттла. Следи за обновлениями."/><NewsList/></section>}
  {page==='polls'&&<section className="inner-page wrap"><PageHeading number="05" tag="YOUR VOICE COUNTS" title={<><span className="glitch-line" data-text="PICK YOUR">PICK YOUR</span><br/><em className="glitch-line" data-text="FAVOURITE.">FAVOURITE.</em></>} intro="Кто, по твоему мнению, заберёт сцену? Выбирай фаворита до премьеры."/><div className="poll-layout"><div className="poll-box"><div className="poll-top"><span><Vote size={17}/> FAN POLL / 001</span><span className="poll-status">LOCAL PREVIEW</span></div><h3 className="glitch-heading" data-text="WHO WILL OWN THE MIC?">WHO WILL OWN THE MIC?</h3><p className="poll-description">Выбери одного участника. Голос сохраняется только в этом браузере, пока не подключим серверную систему голосования.</p><div className="poll-options">{pollOptions.map((o,i)=><button onClick={()=>castVote(o.id)} key={o.id} className={voted===o.id?'chosen':''}><span className="poll-number">0{i+1}</span><span>{o.label}</span><span className="poll-indicator">{voted===o.id?<Check size={17}/>:<span/>}</span></button>)}</div><div className="poll-bottom">{voted?<span><Check size={16}/> Твой выбор сохранён на этом устройстве</span>:<span>ONE VOICE. ONE CHOICE.</span>}<button onClick={()=>{setVoted(null);try{localStorage.removeItem('sf_poll_vote')}catch{}}}>Сбросить</button></div></div><aside className="poll-side"><Flame size={31}/><p>THE HYPE IS REAL</p><h4 className="glitch-heading" data-text="THIS IS JUST THE BEGINNING.">THIS IS JUST THE BEGINNING.</h4><span>Позже добавим авторизацию через Telegram, защиту от повторных голосов и настоящие результаты. Пока это демонстрационный опрос.</span>{telegramUser&&<small>Telegram: {telegramUser}</small>}</aside></div></section>}
  </main>
  <footer className="footer"><div className="wrap footer-main"><div><span className="footer-logo">SAINTFOUR<span>✳</span></span><p>RAP BATTLE <b>’27</b></p><small>AN ORIGINAL GOSSIP SAINTFOUR PROJECT</small></div><div className="footer-nav">{nav.slice(1).map(n=><button key={n.id} onClick={()=>go(n.id)}>{n.name}</button>)}</div><div className="footer-stamp"><Radio size={23}/><span>UNDERGROUND<br/>NEVER DIES.</span></div></div><div className="wrap footer-bottom"><span>© {2027} GOSSIP SAINTFOUR. FAN PROJECT.</span><span>MADE FOR THE CULTURE. NOT FOR THE CLOUT.</span></div></footer>
  <nav className="bottom-nav" aria-label="Быстрая навигация">{nav.filter(n=>['home','artists','media','gallery','polls'].includes(n.id)).map(n=><button key={n.id} onClick={()=>go(n.id)} className={page===n.id?'active':''}><n.Icon size={19}/><span>{n.name}</span></button>)}</nav>
  {selected&&<div className="modal-backdrop" onClick={()=>setSelected(null)}><section className="artist-modal" role="dialog" aria-modal="true" aria-label={selected.stage} onClick={e=>e.stopPropagation()}><button className="close-btn" onClick={()=>setSelected(null)} aria-label="Закрыть"><X/></button><Cover src={selected.image} initials={selected.initials} alt={selected.stage}/><div className="artist-modal-body"><span className="eyebrow">CONTESTANT / {selected.number}</span><h2 className="glitch-heading" data-text={selected.stage}>{selected.stage}</h2><p className="modal-realname">{selected.name}</p><div className="modal-rule"/><p>{selected.description}</p><strong>{selected.subtitle}</strong></div></section></div>}
  {activeVideo&&<div className="modal-backdrop" onClick={()=>setActiveVideo(null)}><section className="video-modal" role="dialog" aria-modal="true" aria-label={activeVideo.title} onClick={e=>e.stopPropagation()}><button className="close-btn" onClick={()=>setActiveVideo(null)} aria-label="Закрыть"><X/></button>{activeVideo.url?<video controls playsInline autoPlay src={activeVideo.url}/>:<div className="video-unavailable"><Play size={42}/><h3>COMING SOON</h3><p>Видео ещё не опубликовано.</p></div>}<h3>{activeVideo.title}</h3></section></div>}
  {galleryIndex!==null&&<div className="modal-backdrop" onClick={()=>setGalleryIndex(null)}><section className="lightbox" role="dialog" aria-modal="true" aria-label="Просмотр фотографии" onClick={e=>e.stopPropagation()}><button className="close-btn" onClick={()=>setGalleryIndex(null)} aria-label="Закрыть"><X/></button><Cover src={gallery[galleryIndex].image} initials={String(galleryIndex+1).padStart(2,'0')} alt={gallery[galleryIndex].label}/><div className="lightbox-controls"><button onClick={()=>setGalleryIndex((galleryIndex+gallery.length-1)%gallery.length)} aria-label="Предыдущее"><ChevronLeft/></button><span>{gallery[galleryIndex].label} — {galleryIndex+1}/{gallery.length}</span><button onClick={()=>setGalleryIndex((galleryIndex+1)%gallery.length)} aria-label="Следующее"><ChevronRight/></button></div></section></div>}
 </div>
}
function ArtistCard({r,onClick}){return <button className="artist-card" onClick={onClick} style={{'--artist-color':r.color}}><Cover src={r.image} alt={r.stage} initials={r.initials}/><div className="artist-vignette"/><div className="artist-number">{r.number} / 04</div><div className="artist-info"><span>{r.role}</span><h3 className="glitch-label" data-text={r.stage}>{r.stage}</h3><p>{r.name}</p><div className="artist-action">VIEW PROFILE <ArrowRight size={16}/></div></div></button>}
function MediaCard({m,onClick}){return <button className="media-card" onClick={onClick}><div className="media-image"><Cover src={m.thumbnail} alt={m.title} initials={m.type==='VIDEO'?'PLAY':'INT'}/><span className="media-type">{m.type}</span><span className="play-circle"><Play fill="currentColor" size={19}/></span></div><div className="media-info"><span>{m.artist} <i>•</i> {m.duration}</span><h3 className="glitch-heading" data-text={m.title}>{m.title}</h3><p>WATCH THE STORY <ArrowRight size={15}/></p></div></button>}
function PageHeading({number,tag,title,intro}){return <div className="page-heading"><div className="page-kicker"><span className="red-dot"/> {number} / {tag}</div><h1>{title}</h1><p>{intro}</p><div className="page-heading-line"/></div>}
function NewsList(){return <div className="news-list">{announcements.map((a,i)=><article className="news-item" key={a.title}><span className="news-date">{a.date}</span><div><span className="news-label">{a.label}</span><h3 className="glitch-heading" data-text={a.title}>{a.title}</h3><p>{a.detail}</p></div><div className="news-index">0{i+1}</div></article>)}</div>}
