import { useState } from 'react'
import { Check, ChevronRight } from 'lucide-react'
import './hype-polls.css'

const polls = [
  { id:'scandal', label:'01 / CHAOS', question:'Кто устроит самый громкий скандал?', choices:['LIL DEX','MC NETTI','YUNG RUD','DON DARO'] },
  { id:'punchlines', label:'02 / BARS', question:'У кого будут самые жёсткие панчи?', choices:['LIL DEX','MC NETTI','YUNG RUD','DON DARO'] },
  { id:'surprise', label:'03 / WILD CARD', question:'Кто удивит публику больше остальных?', choices:['LIL DEX','MC NETTI','YUNG RUD','DON DARO'] },
  { id:'interview', label:'04 / ON THE RECORD', question:'Чьё интервью ждёшь больше всего?', choices:['LIL DEX','MC NETTI','YUNG RUD','DON DARO','NADINE'] },
]

function readVotes(){
  try {
    const votes=JSON.parse(localStorage.getItem('sfvs-hype-votes-v1')||'{}')
    return votes && typeof votes==='object' && !Array.isArray(votes) ? votes : {}
  } catch { return {} }
}

export default function HypePolls(){
  const [votes,setVotes]=useState(readVotes)
  function select(poll,choice){
    if (Object.hasOwn(votes,poll.id)) return
    const next={...votes,[poll.id]:choice}
    setVotes(next)
    try { localStorage.setItem('sfvs-hype-votes-v1',JSON.stringify(next)) } catch { /* Still works for this visit */ }
  }
  const answered=polls.filter(p=>Object.hasOwn(votes,p.id)).length
  return <section className="hype-polls" aria-labelledby="hype-polls-title">
    <div className="hype-polls-intro"><div><span className="hype-kicker">BEFORE THE FIRST DROP / FAN PREDICTIONS</span><h2 id="hype-polls-title">PRE-BATTLE <em>HYPE.</em></h2><p>Батлы ещё не начались, а ставки уже сделаны. Выбирай своих фаворитов.</p></div><span className="hype-counter">{answered.toString().padStart(2,'0')} <small>/ 04 ОТВЕТА</small></span></div>
    <div className="hype-poll-grid">{polls.map(p=>{
      const voted=Object.hasOwn(votes,p.id)
      return <article className="hype-poll" key={p.id}>
        <div className="hype-poll-top"><span>{p.label}</span><span>{voted?'ВЫБРАНО':'ТВОЙ ВЫБОР'}</span></div>
        <h3>{p.question}</h3>
        <div className="hype-options">{p.choices.map(choice=><button type="button" key={choice} disabled={voted} className={'hype-option '+(voted&&votes[p.id]===choice?'chosen':'')} onClick={()=>select(p,choice)} aria-pressed={voted&&votes[p.id]===choice}><span>{choice}</span>{voted&&votes[p.id]===choice?<Check size={17}/>:!voted?<ChevronRight size={16}/>:null}</button>)}</div>
        <div className="hype-poll-footer">{voted?'ТВОЙ ПРОГНОЗ СОХРАНЁН НА ЭТОМ УСТРОЙСТВЕ':'ВЫБЕРИ ОДИН ВАРИАНТ'}</div>
      </article>
    })}</div>
    <p className="hype-disclaimer">Это предварительные фанатские прогнозы. Ответ сохраняется только в этом браузере и не учитывается в официальном голосовании. Общая статистика пока недоступна.</p>
  </section>
}
