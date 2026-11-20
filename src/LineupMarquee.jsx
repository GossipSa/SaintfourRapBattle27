const names=['LIL DEX','MC NETTI','YUNG RUD','DON DARO']
function TickerItems(){return <span className="lineup-marquee-set">{names.map((name,i)=><span className="lineup-marquee-name" key={name}><span>{String(i+1).padStart(2,'0')}</span>{name}<b aria-hidden="true">✳</b></span>)}</span>}
export default function LineupMarquee(){
  return <div className="lineup-marquee" aria-label="Участники: Lil Dex, MC Netti, Yung Rud, Don Daro">
    <div className="lineup-marquee-track" aria-hidden="true"><TickerItems/><TickerItems/></div>
  </div>
}
