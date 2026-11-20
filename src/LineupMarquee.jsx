const phrases=['NO RULES','NO FILTER','NO MERCY','SAINTFOUR RAP BATTLE ’27']
function TickerCopy(){return <span className="battle-ticker-copy">{phrases.map(phrase=><span className="battle-ticker-phrase" key={phrase}>{phrase}<b aria-hidden="true">✳</b></span>)}</span>}
export default function BattleTicker(){
 return <div className="battle-ticker" aria-label="NO RULES. NO FILTER. NO MERCY. SAINTFOUR RAP BATTLE ’27.">
   <div className="battle-ticker-track" aria-hidden="true"><TickerCopy/><TickerCopy/></div>
 </div>
}
