import { useState } from 'react'
import { ArrowUpRight, Bolt, Building2, ChevronDown, Play, Radio, Star } from 'lucide-react'

// In-universe fan project partners. Add official media files to public/media/sponsors/.
// The media slots display honest placeholders until real assets are added.
const sponsors = [
  {
    id:'warlock',name:'WARLOCK',subtitle:'INDUSTRIES',tier:'ГЕНЕРАЛЬНЫЙ ПАРТНЁР',
    tag:'MAIN PARTNER',Icon:Building2,featured:true,
    heading:'БОЛЬШЕ, ЧЕМ КОМПАНИЯ.',
    description:'WARLOCK — влиятельная компания Сентфора, которой руководит Натаниэль Говард. На этой сцене даже бизнес становится личным.',
    aside:'WARLOCK / SAINTFOUR',
  },
  {
    id:'energy',name:'BLACK HELLEBORE',subtitle:'ENERGY',tier:'ОФИЦИАЛЬНЫЙ ЭНЕРГЕТИК ШОУ',
    tag:'OFFICIAL ENERGY',Icon:Bolt,
    heading:'LET THE CHAOS BEGIN.',
    description:'BLACK HELLEBORE ENERGY — вымышленный энергетик из вселенной SAINTFOUR RAP BATTLE. В рекламном ролике Поппи открывает банку и запускает хаос.',
    aside:'BLACK HELLEBORE / ENERGY',
  },
  {
    id:'gossip',name:'GOSSIP',subtitle:'SAINTFOUR',tier:'МЕДИАПАРТНЁР / АВТОР ПРОЕКТА',
    tag:'MEDIA PARTNER',Icon:Radio,
    heading:'СЕНТФОРУ ЕСТЬ ЧТО СКРЫВАТЬ.',
    description:'«Сплетница Сентфора» — Telegram-канал с новостями, теориями, мемами и материалами по вселенной Сентфора. Именно здесь выходит SAINTFOUR RAP BATTLE ’27.',
    url:'https://t.me/Gossip_Saintfour',
    aside:'@GOSSIP_SAINTFOUR',
  },
]

const mediaPaths={
  photo:'/media/sponsors/black-hellebore.jpg',
  video:'/media/sponsors/black-hellebore.mp4',
}

function ProductMedia() {
  const [mode,setMode]=useState('photo')
  const [unavailable,setUnavailable]=useState({photo:false,video:false})
  const [loaded,setLoaded]=useState({photo:false,video:false})
  const mediaAvailable=loaded[mode]&&!unavailable[mode]
  return <div className="sponsor-product-media">
    <div className="sponsor-media-tabs" aria-label="Медиаматериалы энергетика">
      <button type="button" className={mode==='photo'?'active':''} onClick={()=>setMode('photo')}>ФОТО</button>
      <button type="button" className={mode==='video'?'active':''} onClick={()=>setMode('video')}>ВИДЕО</button>
    </div>
    <div className="sponsor-media-stage">
      {mode==='photo'&&<img src={mediaPaths.photo} alt="BLACK HELLEBORE ENERGY — фото банки" onLoad={()=>setLoaded(s=>({...s,photo:true}))} onError={()=>setUnavailable(s=>({...s,photo:true}))} className={mediaAvailable?'sponsor-loaded-media':'sponsor-hidden-media'}/>}
      {mode==='video'&&<video key={mediaPaths.video} src={mediaPaths.video} controls playsInline preload="metadata" onLoadedMetadata={()=>setLoaded(s=>({...s,video:true}))} onError={()=>setUnavailable(s=>({...s,video:true}))} className={mediaAvailable?'sponsor-loaded-media':'sponsor-hidden-media'}/>}
      {!mediaAvailable&&<div className="sponsor-media-fallback">
        <div className="sponsor-can-concept" aria-hidden="true"><span>BLACK</span><strong>HELLEBORE</strong><em>ENERGY</em><small>✳</small></div>
        <div className="sponsor-media-fallback-caption">{mode==='photo'?'ФОТО ПРОДУКТА':'РЕКЛАМНЫЙ РОЛИК'}<strong>MEDIA COMING SOON</strong><span>Добавим настоящий {mode==='photo'?'снимок банки':'ролик с Поппи'}</span></div>
        {mode==='video'&&<Play size={27} aria-hidden="true" className="sponsor-video-glyph"/>}
      </div>}
    </div>
  </div>
}

function SponsorCard({sponsor,expanded,onToggle}) {
  const Icon=sponsor.Icon
  return <article className={`sponsor-tile sponsor-${sponsor.id} ${sponsor.featured?'sponsor-featured':''} ${expanded?'sponsor-expanded':''}`}>
    <div className="sponsor-tile-top"><span>{sponsor.tag}</span><span className="sponsor-cross" aria-hidden="true">✳</span></div>
    <div className="sponsor-identity">
      <Icon className="sponsor-symbol" size={sponsor.featured?35:27} strokeWidth={1.4} aria-hidden="true"/>
      <div className="sponsor-wordmark" aria-label={sponsor.name+' '+sponsor.subtitle}><strong>{sponsor.name}</strong><span>{sponsor.subtitle}</span></div>
    </div>
    <div className="sponsor-tile-bottom"><span>{sponsor.tier}</span><span className="sponsor-tile-number">{sponsor.id==='warlock'?'001':sponsor.id==='energy'?'002':'003'}</span></div>
    <button type="button" className="sponsor-details-toggle" onClick={onToggle} aria-expanded={expanded} aria-controls={`sponsor-details-${sponsor.id}`}>
      {expanded?'СВЕРНУТЬ':'ПОДРОБНЕЕ'} <ChevronDown size={17} className={expanded?'sponsor-chevron-up':''}/>
    </button>
    {expanded&&<div className="sponsor-details" id={`sponsor-details-${sponsor.id}`}>
      <p className="sponsor-details-overline">PARTNER PROFILE / {sponsor.id.toUpperCase()}</p>
      <h3>{sponsor.heading}</h3>
      <p className="sponsor-details-description">{sponsor.description}</p>
      {sponsor.id==='energy'&&<ProductMedia/>}
      {sponsor.url&&<a className="sponsor-channel-link" href={sponsor.url} target="_blank" rel="noopener noreferrer">ПЕРЕЙТИ В TELEGRAM <ArrowUpRight size={18}/></a>}
      <div className="sponsor-details-end"><Star size={13}/>{sponsor.aside}</div>
    </div>}
  </article>
}

export default function SponsorsShowcase() {
  const [expanded,setExpanded]=useState([])
  const toggle=id=>setExpanded(ids=>ids.includes(id)?ids.filter(x=>x!==id):[...ids,id])
  return <div className="sponsors-showcase">
    <div className="sponsors-intro"><p>BEHIND EVERY BIG SHOW — BIG SUPPORT.</p><span>Наши партнёры: открой карточку, чтобы узнать о бренде больше.</span></div>
    <div className="sponsors-grid">
      {sponsors.map(s=><SponsorCard key={s.id} sponsor={s} expanded={expanded.includes(s.id)} onToggle={()=>toggle(s.id)}/>)}
    </div>
    <div className="sponsors-note"><span className="red-dot"/> PARTNERS / SAINTFOUR RAP BATTLE ’27 <span>GOSSIP SAINTFOUR ORIGINAL PROJECT</span></div>
  </div>
}
