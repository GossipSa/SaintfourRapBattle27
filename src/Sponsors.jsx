import { Sparkles, Radio, Star } from 'lucide-react'

// Replace placeholders with confirmed partner names and licensed logos only.
// Optional image files should live under public/media/sponsors/.
const sponsors = [
  { id:'main', tier:'ГЕНЕРАЛЬНЫЙ ПАРТНЁР', tag:'MAIN PARTNER', icon:Star, featured:true },
  { id:'partner-1', tier:'ПАРТНЁР ШОУ', tag:'SHOW PARTNER', icon:Sparkles },
  { id:'partner-2', tier:'ПАРТНЁР ШОУ', tag:'SHOW PARTNER', icon:Sparkles },
  { id:'media-1', tier:'ИНФОПАРТНЁР', tag:'MEDIA PARTNER', icon:Radio },
  { id:'media-2', tier:'ИНФОПАРТНЁР', tag:'MEDIA PARTNER', icon:Radio },
]

function SponsorPlaceholder({ sponsor }) {
  const Icon = sponsor.icon
  return (
    <div className={`sponsor-tile ${sponsor.featured ? 'sponsor-featured' : ''}`}>
      <div className="sponsor-tile-top">
        <span>{sponsor.tag}</span>
        <span className="sponsor-cross" aria-hidden="true">✳</span>
      </div>
      <div className="sponsor-placeholder">
        <Icon size={sponsor.featured ? 37 : 27} strokeWidth={1.2} aria-hidden="true" />
        <strong>ВАШ ЛОГОТИП</strong>
        <span>COMING SOON</span>
      </div>
      <div className="sponsor-tile-bottom">
        <span>{sponsor.tier}</span>
        <span className="sponsor-tile-number">{sponsor.id === 'main' ? '001' : sponsor.id.toUpperCase()}</span>
      </div>
    </div>
  )
}

export default function SponsorsShowcase({compact=false}) {
  return (
    <div className={`sponsors-showcase ${compact ? 'sponsors-compact' : ''}`}>
      <div className="sponsors-intro">
        <p>BEHIND EVERY BIG SHOW — BIG SUPPORT.</p>
        <span>Партнёрские места подготовлены. Названия и логотипы появятся после подтверждения участия.</span>
      </div>
      <div className="sponsors-grid">
        {sponsors.slice(0,compact?3:5).map(s=><SponsorPlaceholder key={s.id} sponsor={s}/>)}
      </div>
      <div className="sponsors-note"><span className="red-dot"/> PARTNERS / SAINTFOUR RAP BATTLE ’27 <span>OFFICIAL LINEUP — TO BE ANNOUNCED</span></div>
    </div>
  )
}
