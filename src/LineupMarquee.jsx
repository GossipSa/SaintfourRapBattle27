const slogans = ['NO RULES', 'NO FILTER', 'NO MERCY', 'SAINTFOUR RAP BATTLE ’27']

function TickerCopy({ phrases }) {
  return (
    <span className="battle-ticker-copy">
      {phrases.map(phrase => (
        <span className="battle-ticker-phrase" key={phrase}>
          {phrase}<b aria-hidden="true">✳</b>
        </span>
      ))}
    </span>
  )
}

export default function BattleTicker({ phrases = slogans, variant }) {
  return (
    <div className={variant === 'lineup' ? 'battle-ticker battle-ticker-lineup' : 'battle-ticker'} lang="en">
      <div className="battle-ticker-track">
        <TickerCopy phrases={phrases}/>
        <span className="battle-ticker-repeat" aria-hidden="true"><TickerCopy phrases={phrases}/></span>
      </div>
    </div>
  )
}
