import { useEffect, useRef, useState } from 'react'
import { RotateCcw, Trophy, X, Volume2, VolumeX } from 'lucide-react'
import './hellebore-slots.css'
import {getBank,applySpin,awardAchievement,fmt,BANK_EVENT} from './saintfour-bank.js'

const KEY='sf27-hellebore-slots-v1'
const flavors=[
 {id:'kiwi',name:'KIWI CHARGE',color:'#a6d84b',position:'0%'},
 {id:'blueberry',name:'BLUEBERRY RUSH',color:'#4b8af5',position:'24%'},
 {id:'original',name:'ORIGINAL',color:'#d563ed',position:'50%'},
 {id:'pomegranate',name:'POMEGRANATE STORM',color:'#f34e78',position:'76%'},
 {id:'mango',name:'MANGO VOLT',color:'#ff9a3d',position:'100%'},
 {id:'seven',name:'777',color:'#f3d074'}
]
const randomSymbol=()=>Math.floor(Math.random()*flavors.length)
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{spins:0,jackpot:false}}catch{return {spins:0,jackpot:false}}}
function Can({index}){const f=flavors[index];return index===5?<div className="bh-slot-jackpot" aria-label="Семёрка джекпота">7</div>:<div className="bh-slot-standalone"><img src={`${import.meta.env.BASE_URL}media/sponsors/slots-${f.id}.svg`} alt={`BLACK HELLEBORE ${f.name}`} draggable="false"/></div>}
export default function HelleboreSlots({onClose}){
 const [reels,setReels]=useState([0,1,2])
 const [record,setRecord]=useState(load)
 const [spinning,setSpinning]=useState(false)
 const [result,setResult]=useState('ТРИ СЕМЁРКИ — И ВАША ВИРТУАЛЬНАЯ БАНКА. ПОЧТИ.')
 const [muted,setMuted]=useState(true)
 const [bank,setBank]=useState(getBank)
 const [bet,setBet]=useState(50)
 useEffect(()=>{const refresh=()=>setBank(getBank());window.addEventListener(BANK_EVENT,refresh);return()=>window.removeEventListener(BANK_EVENT,refresh)},[])
 const [showAchievement,setShowAchievement]=useState(false)
 const achievementTimer=useRef(null)
 const timer=useRef(null)
 const audio=useRef(null)
 useEffect(()=>()=>{clearTimeout(timer.current);clearTimeout(achievementTimer.current)},[])
 const playTone=(win)=>{if(muted)return;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const ctx=audio.current||new C();audio.current=ctx;[0,1,2].forEach(i=>{const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='sine';osc.frequency.value=(win?523:270)+i*(win?130:40);gain.gain.setValueAtTime(.045,ctx.currentTime+i*.12);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+i*.12+.16);osc.connect(gain);gain.connect(ctx.destination);osc.start(ctx.currentTime+i*.12);osc.stop(ctx.currentTime+i*.12+.18)})}catch{/* audio optional */}}
 const spin=()=>{if(spinning||bank.balance<bet)return;setSpinning(true);setResult('БАРАБАНЫ ВРАЩАЮТСЯ...');const next=[randomSymbol(),randomSymbol(),randomSymbol()];timer.current=setTimeout(()=>{setReels(next);setSpinning(false);const jackpot=next.every(v=>v===5);const matched=next.every(v=>v===next[0]);const multiplier=jackpot?25:matched?5:next.filter(v=>v===5).length>=2?2:0;const outcome=applySpin(bet,multiplier);if(!outcome){setResult('НЕДОСТАТОЧНО HBC. ПРОВЕРЬ БАЛАНС В БАНКЕ.');return}setResult(jackpot?'777! ДЖЕКПОТ! ВЫПЛАТА '+fmt(outcome.payout)+' HBC.':matched?'ТРИ ОДИНАКОВЫХ! ВЫПЛАТА '+fmt(outcome.payout)+' HBC.':multiplier===2?'ДВЕ СЕМЁРКИ! ВЫПЛАТА '+fmt(outcome.payout)+' HBC.':'НЕ В ЭТОТ РАЗ. СТАВКА СГОРЕЛА.');setRecord(prev=>{if(jackpot&&!prev.jackpot){setShowAchievement(true);awardAchievement('slots777',500);clearTimeout(achievementTimer.current);achievementTimer.current=setTimeout(()=>setShowAchievement(false),5500)}const nextRecord={spins:prev.spins+1,jackpot:prev.jackpot||jackpot};try{localStorage.setItem(KEY,JSON.stringify(nextRecord))}catch{}return nextRecord});playTone(multiplier>0)},1600)}

 return <div className="bh-slots" aria-label="BLACK HELLEBORE LUCKY 777">
  <div className="bh-slots-top"><div><span>BLACK HELLEBORE ENERGY / BONUS ARCADE</span><h3>BLACK HELLEBORE <b>LUCKY 777</b></h3></div><button type="button" onClick={onClose} aria-label="Закрыть слоты"><X size={19}/></button></div>
  <div className="bh-slots-reels" aria-live="off">{reels.map((v,i)=><div key={i} className={'bh-slot-window '+(spinning?'bh-slot-spinning':'')}><Can index={spinning?(v+i+record.spins+1)%flavors.length:v}/></div>)}</div>
  <div className="bh-slots-message" role="status">{result}</div>
  {showAchievement&&<div className="bh-slots-achievement"><Trophy size={20}/><div><small>SECRET ACHIEVEMENT / 010 · UNLOCKED</small><strong>СЕМЬ-СЕМЬ-СЕМЬ</strong><span>Три семёрки. Никаких материальных призов.</span></div></div>}
  <div className="bh-slots-betting"><div><small>SAINTFOUR BANK · BALANCE</small><strong>{fmt(bank.balance)} HBC</strong></div><div className="bh-slots-bet-choices" aria-label="Ставка">{[10,50,100,500].map(n=><button key={n} type="button" className={bet===n?"selected":""} disabled={spinning||bank.balance<n} onClick={()=>setBet(n)}>{n}</button>)}</div></div>
  <div className="bh-slots-actions"><button type="button" className="bh-slots-spin" disabled={spinning||bank.balance<bet} onClick={spin}><RotateCcw size={17}/>{spinning?'КРУТИМ...':bank.balance<bet?'НЕДОСТАТОЧНО HBC':'SPIN / '+bet+' HBC'}</button><button type="button" className="bh-slots-sound" onClick={()=>setMuted(v=>!v)} aria-label={muted?'Включить звук':'Выключить звук'}>{muted?<VolumeX size={19}/>:<Volume2 size={19}/>}</button></div>
  <aside className="bh-slots-disclaimer" aria-label="Предупреждение о виртуальных ставках"><strong>⚠ ИГРОВАЯ МЕХАНИКА · НЕ КАЗИНО</strong><p>BLACK HELLEBORE LUCKY 777 — развлекательная мини-игра с вымышленными HBC. Здесь нет ставок реальными деньгами, денежных выигрышей или призов. Азартные игры могут вызывать зависимость и финансовые проблемы. Не воспринимайте эту игру как способ заработка и делайте перерывы.</p></aside>
  <div className="bh-slots-foot"><span>SPINS: {record.spins}</span><span>VIRTUAL HBC ONLY · NO REAL MONEY</span></div>
 </div>
}
