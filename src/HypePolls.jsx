import { useEffect, useState } from 'react'
import { Check, ChevronRight, RefreshCw } from 'lucide-react'
import './hype-polls.css'

const endpoint = 'https://txnjqqglpxvxljwcrruf.supabase.co/functions/v1/hype-polls'
const voteKey = 'sfvs-hype-server-votes-v1'
const voterKey = 'sfvs-hype-voter-id-v1'
const artistColors = {
  'LIL DEX': '#36e9ff',
  'MC NETTI': '#9d73e8',
  'YUNG RUD': '#bdff42',
  'DON DARO': '#ff59be',
  'NADINE': '#ff9b39',
}
const polls = [
  { id:'scandal', label:'01 / CHAOS', question:'Кто устроит самый громкий скандал?', choices:['LIL DEX','MC NETTI','YUNG RUD','DON DARO'] },
  { id:'punchlines', label:'02 / BARS', question:'У кого будут самые жёсткие панчи?', choices:['LIL DEX','MC NETTI','YUNG RUD','DON DARO'] },
  { id:'surprise', label:'03 / WILD CARD', question:'Кто удивит публику больше остальных?', choices:['LIL DEX','MC NETTI','YUNG RUD','DON DARO'] },
  { id:'interview', label:'04 / ON THE RECORD', question:'Чьё интервью ждёшь больше всего?', choices:['LIL DEX','MC NETTI','YUNG RUD','DON DARO','NADINE'] },
]
function readVotes(){
  try { const value = JSON.parse(localStorage.getItem(voteKey) || '{}'); return value && typeof value === 'object' && !Array.isArray(value) ? value : {} }
  catch { return {} }
}
function getVoterId(){
  let id = localStorage.getItem(voterKey)
  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) { id = crypto.randomUUID(); localStorage.setItem(voterKey,id) }
  return id
}
export default function HypePolls(){
  const [votes,setVotes] = useState(readVotes)
  const [results,setResults] = useState(null)
  const [pending,setPending] = useState(null)
  const [error,setError] = useState('')
  const [loading,setLoading] = useState(true)

  useEffect(()=>{
    let active=true
    async function load(){
      try {
        const response=await fetch(endpoint,{cache:'no-store'})
        if(!response.ok) throw Error('Unable to fetch results')
        const data=await response.json()
        if(active){setResults(data.results);setError('')}
      }catch{if(active)setError('Не удалось получить общую статистику. Попробуй обновить результаты.')}
      finally{if(active)setLoading(false)}
    }
    load()
    const interval=setInterval(load,30000)
    return()=>{active=false;clearInterval(interval)}
  },[])

  async function select(poll,choice){
    if(Object.hasOwn(votes,poll.id) || pending || !results)return
    setPending(poll.id);setError('')
    try{
      const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({pollId:poll.id,choice,voterId:getVoterId()})})
      const data=await response.json()
      if(!response.ok || (!data.saved && !data.alreadyVoted)) throw Error('Vote failed')
      const next={...votes,[poll.id]:data.choice}
      setVotes(next);setResults(data.results)
      try{localStorage.setItem(voteKey,JSON.stringify(next))}catch{/* session vote remains visible */}
    }catch{setError('Не удалось сохранить голос. Попробуй ещё раз.')}
    finally{setPending(null)}
  }

  const answered=polls.filter(p=>Object.hasOwn(votes,p.id)).length
  return <section className="hype-polls" aria-labelledby="hype-polls-title">
    <div className="hype-polls-intro"><div><span className="hype-kicker">BEFORE THE FIRST DROP / FAN PREDICTIONS</span><h2 id="hype-polls-title">PRE-BATTLE <em>HYPE.</em></h2><p>Пока микрофоны молчат, Сентфор уже спорит. На чьей стороне ты?</p></div><span className="hype-counter">{answered.toString().padStart(2,'0')} <small>/ 04 ОТВЕТА</small></span></div>
    {error && <div className="hype-error" role="alert">{error} <button onClick={()=>window.location.reload()} type="button"><RefreshCw size={14}/> Обновить</button></div>}
    <div className="hype-poll-grid">{polls.map(p=>{
      const voted=Object.hasOwn(votes,p.id)
      const stats=results?.[p.id]
      const picked=artistColors[votes[p.id]] || '#d478e4'
      return <article className={`hype-poll ${voted ? 'has-voted' : ''}`} style={{'--picked-color':picked}} key={p.id}>
        <div className="hype-poll-top"><span>{p.label}</span><span>{voted?'ВЫБРАНО':'ТВОЙ ВЫБОР'}</span></div>
        <h3>{p.question}</h3>
        <div className="hype-options">{p.choices.map(choice=>{
          const count=stats?.counts?.[choice] || 0
          const percentage=stats?.total ? Math.round(100*count/stats.total) : 0
          return <button type="button" key={choice} disabled={voted || Boolean(pending) || !results} className={'hype-option '+(voted&&votes[p.id]===choice?'chosen':'')} style={{'--option-color':artistColors[choice] || '#c786e7'}} onClick={()=>select(p,choice)} aria-pressed={voted&&votes[p.id]===choice}>
            <span className="hype-choice-name">{choice}</span>
            {stats ? <span className="hype-choice-percent">{percentage}%</span> : !loading ? <ChevronRight size={16}/> : null}
            {voted&&votes[p.id]===choice?<Check size={14} className="hype-picked-check"/>:null}
            {stats && <span className="hype-option-fill" style={{width:`${percentage}%`}} aria-hidden="true"/>}
          </button>
        })}</div>
        <div className="hype-poll-footer">{pending===p.id?'СОХРАНЯЕМ ГОЛОС…':voted?'ТВОЙ ГОЛОС УЧТЁН':loading?'ЗАГРУЖАЕМ РЕЗУЛЬТАТЫ…':stats?`ВСЕГО ГОЛОСОВ: ${stats.total}`:'СТАТИСТИКА НЕДОСТУПНА'}</div>
      </article>
    })}</div>
  </section>
}
