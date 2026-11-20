import { Bolt, Building2, Radio } from 'lucide-react'

// Fictional / in-universe partner identities for the fan project.
// Replace typography with actual approved logo assets when available.
const sponsors = [
  { id:'warlock', name:'WARLOCK', subtitle:'INDUSTRIES', tier:'ГЕНЕРАЛЬНЫЙ ПАРТНЁР', tag:'MAIN PARTNER', Icon:Building2, featured:true },
  { id:'energy', name:'BLACK HOLE', subtitle:'ENERGY', tier:'ЭНЕРГЕТИК БАТТЛА', tag:'OFFICIAL ENERGY', Icon:Bolt },
  { id:'gossip', name:'GOSSIP', subtitle:'SAINTFOUR', tier:'МЕДИАПАРТНЁР / АВТОР ПРОЕКТА', tag:'MEDIA PARTNER', Icon:Radio },
]

function SponsorCard({ sponsor }) {
  const Icon=sponsor.Icon
  return (
    <article className={`sponsor-tile sponsor-${sponsor.id} ${sponsor.featured ? 'sponsor-featured' : ''}`}>
      <div className="sponsor-tile-top">
        <span>{sponsor.tag}</span>
        <span className="sponsor-cross" aria-hidden="true">✳</span>
      </div>
      <div className="sponsor-identity">
        <Icon className="sponsor-symbol" size={sponsor.featured?35:27} strokeWidth={1.4} aria-hidden="true" />
        <div className="sponsor-wordmark" aria-label={sponsor.name+' '+sponsor.subtitle}>
          <strong>{sponsor.name}</strong>
          <span>{sponsor.subtitle}</span>
        </div>
      </div>
      <div className="sponsor-tile-bottom">
        <span>{sponsor.tier}</span>
        <span className="sponsor-tile-number">{sponsor.id==='warlock'?'001':sponsor.id==='energy'?'002':'003'}</span>
      </div>
    </article>
  )
}

export default function SponsorsShowcase() {
  return (
    <div className="sponsors-showcase">
      <div className="sponsors-intro">
        <p>BEHIND EVERY BIG SHOW — BIG SUPPORT.</p>
        <span>Бренды и партнёры вселенной SAINTFOUR RAP BATTLE ’27.</span>
      </div>
      <div className="sponsors-grid">
        {sponsors.map(s=><SponsorCard key={s.id} sponsor={s}/>)}
      </div>
      <div className="sponsors-note"><span className="red-dot"/> PARTNERS / SAINTFOUR RAP BATTLE ’27 <span>GOSSIP SAINTFOUR ORIGINAL PROJECT</span></div>
    </div>
  )
}
