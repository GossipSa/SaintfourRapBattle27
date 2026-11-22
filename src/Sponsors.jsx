import './sponsor-tile-redesign.css'
import ShakeCan from './ShakeCan.jsx'
import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Play, Star, X, Zap, FlaskConical, ArrowLeft } from 'lucide-react'

// Bespoke partner symbols, kept small and understated like the other top-row marks.
function HelleboreMark({ size=24, className='' }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <g stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round">
      {[0,72,144,216,288].map(a=><path key={a} d="M16 14.5C11.4 11.2 11.7 5.9 16 2.5C20.3 5.9 20.6 11.2 16 14.5Z" transform={`rotate(${a} 16 16)`}/>) }
      <circle cx="16" cy="16" r="3.3" fill="#19141e"/>
      <circle cx="16" cy="16" r="1.1" fill="currentColor" stroke="none"/>
    </g>
  </svg>
}
function GossipSpark({ size=24, className='' }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path d="M16 2.5 19.2 12.8 29.5 16 19.2 19.2 16 29.5 12.8 19.2 2.5 16 12.8 12.8 16 2.5Z" fill="currentColor"/>
  </svg>
}

// In-universe fan project partners. Add actual media files to public/media/sponsors/.
const sponsors = [
  {
    id:'warlock',name:'WARLOCK',subtitle:'INDUSTRIES',tier:'ГЕНЕРАЛЬНЫЙ ПАРТНЁР',
    tag:'MAIN PARTNER',Icon:HelleboreMark,featured:true,
    cardLine:'Не всё идёт по плану.',cardDetail:'Даже когда план составляли вы.',cardAction:'ПОДРОБНЕЕ О ПАРТНЁРЕ',
    heading:'НЕКОТОРЫЕ РЕШЕНИЯ ПРИНИМАЮТСЯ БЕЗ ВАШЕГО УЧАСТИЯ.',
    description:'WARLOCK INDUSTRIES — генеральный партнёр SAINTFOUR RAP BATTLE ’27.\n\nКомпания Натаниэля Говарда привыкла контролировать происходящее. Однако в этот раз обстоятельства сложились несколько иначе.\n\nКак именно генеральный директор оказался среди участников шоу — вопрос, который пока остаётся открытым. Одно известно точно: WARLOCK не привыкла отступать.',
    note:'Участие генерального директора в программе мероприятия не комментируется.',
    aside:'WARLOCK / SAINTFOUR',
  },
  {
    id:'energy',name:'BLACK HELLEBORE',subtitle:'ENERGY',tier:'ЭНЕРГИЯ БАТЛА',
    tag:'OFFICIAL ENERGY',Icon:Zap,
    cardLine:'Заряжен на большее.',cardDetail:'Официальный источник энергии SAINTFOUR RAP BATTLE ’27.',cardAction:'ПОЗНАКОМИТЬСЯ С БРЕНДОМ',
    heading:'КОГДА ГРАДУС ПОВЫШАЕТСЯ — МЫ ДОБАВЛЯЕМ ЭНЕРГИИ.',
    description:'BLACK HELLEBORE ENERGY становится официальным энергетическим партнёром SAINTFOUR RAP BATTLE ’27.\n\nБренд поддерживает самые громкие события города, и первый рэп-баттл Сентфора не стал исключением. Новые лица, неожиданные противостояния и энергия, которую невозможно сдержать.\n\nBLACK HELLEBORE ENERGY. Заряжен на большее.',
    aside:'BLACK HELLEBORE / ENERGY',
  },
  {
    id:'gossip',name:'GOSSIP',subtitle:'SAINTFOUR',tier:'ОРГАНИЗАТОР ШОУ',
    tag:'THE ORGANIZER',Icon:GossipSpark,
    cardLine:'Мы просто включили камеры.',cardDetail:'А теперь весь Сентфор услышит, что произошло.',cardAction:'УЗНАТЬ ОБ ОРГАНИЗАТОРЕ',
    heading:'МЫ НЕ СОЗДАЁМ СЛУХИ. МЫ ДАЁМ ИМ МИКРОФОН.',
    description:'GOSSIP SAINTFOUR представляет SAINTFOUR RAP BATTLE ’27.\n\nМы привыкли рассказывать о том, что происходит в Сентфоре. Теперь решили дать его героям возможность высказаться самостоятельно.\n\nЧетыре участника. Один микрофон. И слишком много того, о чём раньше предпочитали молчать.\n\nМы просто включили камеры.',
    url:'https://t.me/Gossip_Saintfour',
    aside:'@GOSSIP_SAINTFOUR',
  },
]

const mediaPaths={
  photo:`${import.meta.env.BASE_URL}media/sponsors/black-hellebore.jpg`,
  video:`${import.meta.env.BASE_URL}media/sponsors/black-hellebore.mp4`,
}

function ProductMedia({onSecretFound}) {
  const [mode,setMode]=useState('photo')
  const [classified,setClassified]=useState(false)
  const [unavailable,setUnavailable]=useState({photo:false,video:false})
  const [loaded,setLoaded]=useState({photo:false,video:false})
  const [videoReady,setVideoReady]=useState(false)
  useEffect(()=>{
    const controller=new AbortController()
    fetch(mediaPaths.video,{method:'HEAD',signal:controller.signal})
      .then(response=>{
        if(response.ok && response.headers.get('content-type')?.startsWith('video/')){
          setVideoReady(true)
          setMode('video')
        }
      })
      .catch(()=>{})
    return ()=>controller.abort()
  },[])
  const mediaAvailable=loaded[mode]&&!unavailable[mode]
  return <div className="sponsor-product-media">
    <div className="sponsor-media-tabs" aria-label="Медиаматериалы энергетика">
      <button type="button" className={mode==='photo'?'active':''} onClick={()=>setMode('photo')}>ФОТО</button>
      <button type="button" className={mode==='video'?'active':''} onClick={()=>setMode('video')}>ВИДЕО</button>
    </div>
    <div className="sponsor-media-stage">
      {mode==='photo'&&<img src={mediaPaths.photo} alt="BLACK HELLEBORE ENERGY — фото банки" onLoad={()=>setLoaded(s=>({...s,photo:true}))} onError={()=>setUnavailable(s=>({...s,photo:true}))} className={mediaAvailable?'sponsor-loaded-media':'sponsor-hidden-media'}/>}
      {mode==='video'&&videoReady&&<video key={mediaPaths.video} src={mediaPaths.video} autoPlay muted loop playsInline preload="auto" aria-label="Рекламный ролик BLACK HELLEBORE ENERGY без звука" onLoadedMetadata={()=>setLoaded(s=>({...s,video:true}))} onError={()=>{setUnavailable(s=>({...s,video:true}));setMode('photo')}} className={mediaAvailable?'sponsor-loaded-media':'sponsor-hidden-media'}/>}
      {!mediaAvailable&&<div className="sponsor-media-fallback">
        <div className="sponsor-can-concept" aria-hidden="true"><span>BLACK</span><strong>HELLEBORE</strong><em>ENERGY</em><small>✳</small></div>
        <div className="sponsor-media-fallback-caption">{mode==='photo'?'ФОТО ПРОДУКТА':'РЕКЛАМНЫЙ РОЛИК'}<strong>MEDIA COMING SOON</strong><span>Добавим настоящий {mode==='photo'?'снимок банки':'ролик с Поппи'}</span></div>
        {mode==='video'&&<Play size={27} aria-hidden="true" className="sponsor-video-glyph"/>}
      </div>}
    </div>
    <div className="sponsor-research">
      <button className="sponsor-research-teaser" type="button" onClick={()=>{setClassified(x=>!x);if(!classified)onSecretFound?.()}} aria-expanded={classified} aria-controls="hellebore-rd-file">
        <div className="sponsor-research-preview" aria-hidden="true">
          <img src={mediaPaths.photo} alt="" loading="lazy"/>
          <span className="sponsor-research-overlay">R&D<br/>?</span>
        </div>
        <div className="sponsor-research-teaser-copy">
          <span className="sponsor-research-overline"><FlaskConical size={12}/> BLACK HELLEBORE / LAB ARCHIVE</span>
          <strong>НОВЫЙ ВКУС.<br/><em>НЕ ДЛЯ ВСЕХ.</em></strong>
          <p>Внутренняя карточка разработки. Прототип, состав и результаты тестов.</p>
          <span className="sponsor-research-cta">{classified?'СВЕРНУТЬ ДОСЬЕ':'ОТКРЫТЬ ДОСЬЕ'} <ArrowUpRight size={14}/></span>
        </div>
      </button>
      {classified&&<div className="hellebore-classified" id="hellebore-rd-file" role="region" aria-label="Досье экспериментального энергетика">
        <div className="hellebore-classified-top"><span><FlaskConical size={14}/> R&D / FILE BH–00 / INTERNAL USE ONLY</span><button type="button" onClick={()=>setClassified(false)} aria-label="Закрыть досье"><X size={16}/></button></div>
        <div className="hellebore-classified-content"><div className="hellebore-experimental-can" aria-hidden="true"><span>BLACK HELLEBORE</span><strong>?</strong><small>FORMULA ZERO</small></div><div><span className="hellebore-classified-kicker">PROTOTYPE / UNRELEASED</span><h4 className="hellebore-formula-glitch" data-text="FORMULA ZERO.">FORMULA <em>ZERO.</em></h4><p>Тестовая линейка BLACK HELLEBORE ENERGY. Рабочее название вкуса — <b>BLACKOUT BERRY</b>. Тёмные ягоды, холодное послевкусие и слишком много вопросов к финальной версии.</p><span className="hellebore-classified-footer">STATUS: REFORMULATION REQUIRED</span></div></div>
        <div className="hellebore-lab-notes">
          <div><span>01 / FLAVOR PROFILE</span><strong>BLACKOUT BERRY</strong><small>Тёмные ягоды · ледяная нота</small></div>
          <div><span>02 / FORMULA REV.</span><strong>BH–00 / V.03</strong><small>Рецептура на доработке</small></div>
          <div><span>03 / TEST STATUS</span><strong>ON HOLD</strong><small>Выпуск отложен</small></div>
        </div>
        <div className="hellebore-classified-bottom"><span>CONFIDENTIAL / NOT FOR PUBLIC RELEASE</span><button type="button" onClick={()=>setClassified(false)}><ArrowLeft size={14}/> НАЗАД К РЕКЛАМЕ</button></div>
      </div>}
    </div>
  </div>
}

function SponsorCard({sponsor,onOpen}) {
  const Icon=sponsor.Icon
  const number=sponsor.id==='warlock'?'01':sponsor.id==='energy'?'02':'03'
  return <article className={`sponsor-tile sponsor-${sponsor.id} ${sponsor.featured?'sponsor-featured':''}`}>
    <div className="sponsor-tile-top">
      <span>{number} / {sponsor.tier}</span>
      <Icon className="sponsor-symbol" size={24} strokeWidth={1.55} aria-hidden="true"/>
    </div>
    <div className="sponsor-identity">
      <div className="sponsor-wordmark" aria-label={sponsor.name+' '+sponsor.subtitle}>
        <strong className={sponsor.id==='warlock'?undefined:'sponsor-brand-glitch'} data-text={sponsor.name}>{sponsor.name}</strong><span>{sponsor.subtitle}</span>
      </div>
    </div>
    <div className="sponsor-pitch">
      <h3>{sponsor.cardLine}</h3>
      <p>{sponsor.cardDetail}</p>
    </div>
    <button type="button" className="sponsor-details-toggle" onClick={()=>onOpen(sponsor)}>
      <span>{sponsor.cardAction}</span><ArrowUpRight size={19} aria-hidden="true"/>
    </button>
  </article>
}

function SponsorModal({sponsor,onClose,onSecretFound}) {
  const closeRef=useRef(null)
  useEffect(()=>{
    const previous=document.activeElement
    const oldOverflow=document.body.style.overflow
    document.body.style.overflow='hidden'
    closeRef.current?.focus()
    const onKey=e=>{if(e.key==='Escape')onClose()}
    window.addEventListener('keydown',onKey)
    return ()=>{window.removeEventListener('keydown',onKey);document.body.style.overflow=oldOverflow;previous?.focus?.()}
  },[onClose])
  const Icon=sponsor.Icon
  return <div className="sponsor-modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
    <section className={`sponsor-modal sponsor-modal-${sponsor.id}`} role="dialog" aria-modal="true" aria-labelledby={`sponsor-title-${sponsor.id}`}>
      <button ref={closeRef} className="sponsor-modal-close" type="button" onClick={onClose} aria-label="Закрыть карточку"><X size={21}/></button>
      <div className="sponsor-modal-banner">
        <span className="sponsor-details-overline">SAINTFOUR / PARTNER PROFILE / {sponsor.id.toUpperCase()}</span>
        <div className="sponsor-modal-brand"><Icon size={31} strokeWidth={1.4}/><div><strong id={`sponsor-title-${sponsor.id}`} className={sponsor.id==='warlock'?'':'glitch-label'} data-text={sponsor.name}>{sponsor.name}</strong><span>{sponsor.subtitle}</span></div></div>
        <span className="sponsor-modal-tier">{sponsor.tier}</span>
      </div>
      <div className="sponsor-modal-content">
        <h3 className="glitch-heading" data-text={sponsor.heading}>{sponsor.heading}</h3>
        <p className="sponsor-details-description">{sponsor.description}</p>
        {sponsor.note&&<p className="sponsor-partner-note">{sponsor.note}</p>}
        {sponsor.id==='energy'&&<ProductMedia onSecretFound={onSecretFound}/>}
        {sponsor.url&&<a className="sponsor-channel-link" href={sponsor.url} target="_blank" rel="noopener noreferrer">ПЕРЕЙТИ В TELEGRAM <ArrowUpRight size={18}/></a>}
        <div className="sponsor-details-end"><Star size={13}/>{sponsor.aside}</div>
      </div>
    </section>
  </div>
}

export default function SponsorsShowcase({onSecretFound}) {
  const [selected,setSelected]=useState(null)
  const close=()=>setSelected(null)
  return <div className="sponsors-showcase">
    <div className="sponsors-intro"><p>BEHIND EVERY BIG SHOW — BIG SUPPORT.</p><span>Нажми на партнёра, чтобы открыть его карточку.</span></div>
    <div className="sponsors-grid">
      {sponsors.map(s=><SponsorCard key={s.id} sponsor={s} onOpen={setSelected}/>)}
    </div>
    <div className="sponsors-note"><span className="red-dot"/> PARTNERS / SAINTFOUR RAP BATTLE ’27 <span>GOSSIP SAINTFOUR ORIGINAL PROJECT</span></div>
    <ShakeCan/>
    {selected&&<SponsorModal sponsor={selected} onClose={close} onSecretFound={onSecretFound}/>}
  </div>
}
