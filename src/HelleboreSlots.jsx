import { useEffect, useRef, useState } from 'react'
import { RotateCcw, Trophy, X, Volume2, VolumeX } from 'lucide-react'
import './hellebore-slots.css'

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
 const timer=useRef(null)
 const audio=useRef(null)
 useEffect(()=>()=>clearTimeout(timer.current),[])
 const playTone=(win)=>{if(muted)return;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const ctx=audio.current||new C();audio.current=ctx;[0,1,2].forEach(i=>{const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='sine';osc.frequency.value=(win?523:270)+i*(win?130:40);gain.gain.setValueAtTime(.045,ctx.currentTime+i*.12);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+i*.12+.16);osc.connect(gain);gain.connect(ctx.destination);osc.start(ctx.currentTime+i*.12);osc.stop(ctx.currentTime+i*.12+.18)})}catch{/* audio optional */}}
 const spin=()=>{if(spinning)return;setSpinning(true);setResult('БАРАБАНЫ ВРАЩАЮТСЯ...');const next=[randomSymbol(),randomSymbol(),randomSymbol()];timer.current=setTimeout(()=>{setReels(next);setSpinning(false);const jackpot=next.every(v=>v===5);const matched=next.every(v=>v===next[0]);setResult(jackpot?'777! ДЖЕКПОТ! ВЫ ВЫИГРАЛИ ВИРТУАЛЬНУЮ БАНКУ BLACK HELLEBORE.':matched?'ТРИ ОДИНАКОВЫХ! BLACK HELLEBORE ОДОБРЯЕТ.':'НЕ В ЭТОТ РАЗ. ПОПРОБУЙТЕ ЕЩЁ РАЗ.');setRecord(prev=>{const nextRecord={spins:prev.spins+1,jackpot:prev.jackpot||jackpot};try{localStorage.setItem(KEY,JSON.stringify(nextRecord))}catch{}return nextRecord});playTone(jackpot||matched)},1600)}
 return <div className="bh-slots" aria-label="BLACK HELLEBORE LUCKY 777">
  <div className="bh-slots-top"><div><span>BLACK HELLEBORE ENERGY / BONUS ARCADE</span><h3>BLACK HELLEBORE <b>LUCKY 777</b></h3></div><button type="button" onClick={onClose} aria-label="Закрыть слоты"><X size={19}/></button></div>
  <div className="bh-slots-reels" aria-live="off">{reels.map((v,i)=><div key={i} className={'bh-slot-window '+(spinning?'bh-slot-spinning':'')}><Can index={spinning?(v+i+record.spins+1)%flavors.length:v}/></div>)}</div>
  <div className="bh-slots-message" role="status">{result}</div>
  {record.jackpot&&<div className="bh-slots-achievement"><Trophy size={20}/><div><small>SECRET ACHIEVEMENT / 010 · UNLOCKED</small><strong>СЕМЬ-СЕМЬ-СЕМЬ</strong><span>Три семёрки. Никаких материальных призов.</span></div></div>}
  <div className="bh-slots-actions"><button type="button" className="bh-slots-spin" disabled={spinning} onClick={spin}><RotateCcw size={17}/>{spinning?'КРУТИМ...':'SPIN / КРУТИТЬ'}</button><button type="button" className="bh-slots-sound" onClick={()=>setMuted(v=>!v)} aria-label={muted?'Включить звук':'Выключить звук'}>{muted?<VolumeX size={19}/>:<Volume2 size={19}/>}</button></div>
  <div className="bh-slots-foot"><span>SPINS: {record.spins}</span><span>FREE PLAY · NO BETS · NO REAL PRIZES</span></div>
 </div>
}
