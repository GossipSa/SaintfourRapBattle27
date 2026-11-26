// Optional, consent-based analytics; never affects game state.
const consentKey='sf27-analytics-consent-v1'
const visitorKey='sf27-analytics-visitor-v1'
const endpoint='https://txnjqqglpxvxljwcrruf.supabase.co/rest/v1/saintfour_battle_events'
const key='sb_publishable_3NJ6n5Xz-SJodEuNPrJwmg_f7SZFW2Y'
let visitor=null,session=null,last=0,enabled=false
const platform=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1)?'ios':/Android/i.test(navigator.userAgent)?'android':'desktop'
export function track(event_type,target=''){
 try{
  if(!enabled)return
  const now=Date.now()
  if(now-last>1800000){session=crypto.randomUUID();last=now;if(event_type!=='visit')track('visit')}
  last=now
  if(!/^[A-Za-z0-9_-]{0,64}$/.test(target))return
  fetch(endpoint,{method:'POST',headers:{apikey:key,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({visitor_id:visitor,session_id:session,event_type,target,platform}),keepalive:true}).catch(()=>{})
 }catch{}
}
function readConsent(){try{return localStorage.getItem(consentKey)}catch{return 'no'}}
function activate(){try{if(enabled)return;visitor=localStorage.getItem(visitorKey)||crypto.randomUUID();localStorage.setItem(visitorKey,visitor);session=crypto.randomUUID();last=Date.now();enabled=true;track('visit')}catch{}}
function deactivate(){enabled=false;visitor=null;session=null;try{localStorage.removeItem(visitorKey)}catch{}}
export function AnalyticsConsent(){
 const [choice,setChoice]=useState(readConsent)
 useEffect(()=>{
  if(choice==='yes')activate();else deactivate()
  const t=setInterval(()=>{if(!document.hidden)track('heartbeat')},60000)
  return ()=>clearInterval(t)
 },[choice])
 const choose=v=>{try{localStorage.setItem(consentKey,v)}catch{};setChoice(v)}
 const [open,setOpen]=useState(false)
 const button={background:'#211829',color:'#f5d9ef',border:'1px solid #79506e',borderRadius:6,padding:'6px 10px',cursor:'pointer',fontSize:12}
 return <div style={{maxWidth:650,margin:'12px auto',padding:'0 16px',textAlign:'center',color:'#c6b7c8',fontSize:12}}>
 {open?<div style={{padding:12,border:'1px solid #59405a',borderRadius:8,background:'#100e16'}}><p>Необязательная статистика: разрешить сбор посещений, устройства и игровых событий по случайному идентификатору браузера? Без имён, номеров и текстов сообщений. Отказ не влияет на игру. Согласие можно отозвать здесь.</p><div style={{display:'flex',justifyContent:'center',gap:8,flexWrap:'wrap'}}><button style={button} onClick={()=>{choose('yes');setOpen(false)}}>Разрешить</button><button style={button} onClick={()=>{choose('no');setOpen(false)}}>Не разрешать</button></div></div>:<button style={{background:'none',border:0,padding:'4px 0',color:'#b8a9bc',font:'inherit',textDecoration:'underline',textUnderlineOffset:3,cursor:'pointer'}} onClick={()=>setOpen(true)}>Настройки конфиденциальности</button>}
 </div>
}
import {useEffect,useState} from 'react'
