import {useEffect,useState} from 'react'
import {BANK_EVENT,getBank,fmt,placePrediction} from './saintfour-bank.js'
import './battle-predictions.css'
const battles=[{id:'first',label:'BATTLE 01 / FIRST CLASH',fighters:['LIL DEX','MC NETTI']},{id:'second',label:'BATTLE 02 / SECOND CLASH',fighters:['YUNG RUD','DON DARO']}]
export default function BattlePredictions(){
 const [bank,setBank]=useState(getBank)
 const [message,setMessage]=useState('')
 useEffect(()=>{const fn=()=>setBank(getBank());window.addEventListener(BANK_EVENT,fn);return()=>window.removeEventListener(BANK_EVENT,fn)},[])
 return <section className="sf-predictions"><div className="sf-predictions-head"><span>SAINTFOUR BANK / PREDICTIONS</span><h2>PUT YOUR HBC <em>ON THE LINE.</em></h2><p>Угадай победителя до официального голосования. Один прогноз на каждый батл, ставка 500 HBC. Верный прогноз — выплата 750 HBC, неверный — ставка сгорает.</p><strong>ТВОЙ БАЛАНС: {fmt(bank.balance)} HBC</strong></div>
 <div className="sf-prediction-grid">{battles.map(b=>{const picked=bank.predictions?.[b.id];return <article key={b.id} className="sf-prediction-card"><small>{b.label}</small><h3>{b.fighters[0]} <span>VS</span> {b.fighters[1]}</h3>{picked?<p className="sf-prediction-picked">ПРОГНОЗ ПРИНЯТ: <b>{picked.choice}</b><br/>500 HBC поставлены · ожидаем официальный результат</p>:<div className="sf-prediction-choices">{b.fighters.map(name=><button key={name} disabled={bank.balance<500} onClick={()=>{if(!window.confirm('Поставить 500 HBC на '+name+'? Изменить прогноз нельзя.'))return;const ok=placePrediction(b.id,name,b.fighters);setMessage(ok?'Прогноз принят. Удачи!':'Не удалось принять прогноз.');}}>{name}<small>500 HBC</small></button>)}</div>}</article>})}</div>
 {message&&<p role="status">{message}</p>}<p className="sf-prediction-note">Результаты будут рассчитаны после завершения официальных голосований. Пока победители не объявлены, ставки остаются в ожидании. Это только виртуальная валюта без реальной стоимости.</p></section>
}