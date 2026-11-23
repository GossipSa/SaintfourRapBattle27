import {useEffect,useState} from 'react'
import {BANK_EVENT,getBank,bankTier,fmt,claimAid,claimFreeSpin,syncAchievements,resetFinances} from './saintfour-bank.js'
import './saintfour-bank.css'
export default function SaintfourBank() {
 const [bank,setBank]=useState(getBank)
 const [message,setMessage]=useState('')
 useEffect(()=>{const update=()=>setBank(getBank());syncAchievements();update();window.addEventListener(BANK_EVENT,update);window.addEventListener('storage',update);const id=setInterval(()=>{syncAchievements();update()},5000);return()=>{window.removeEventListener(BANK_EVENT,update);window.removeEventListener('storage',update);clearInterval(id)}},[])
 const tier=bankTier(bank)
 const freeRemaining=Math.max(0,86400000-(Date.now()-bank.lastFreeSpin))
 return <section className="sf-bank-page">
 <span className="sf-bank-eyebrow">SAINTFOUR / VIRTUAL FINANCE</span><h1 className="sf-bank-glitch" data-text="SAINTFOUR BANK.">SAINTFOUR <em>BANK.</em></h1>
 <p className="sf-bank-lead">Твой виртуальный счёт Сентфора. Зарабатывай HBC в BLACK HELLEBORE LUCKY 777 и за достижения. Карты открываются автоматически по сумме заработанного за всё время.</p>
 <div className="sf-bank-layout"><div className={'sf-bank-card sf-bank-card-art '+tier}><img className="sf-bank-art" src={`${import.meta.env.BASE_URL}media/bank-cards/${tier==='elite'?'warlock-elite':tier==='hellebore'?'black-hellebore':'standard'}.webp`} alt={tier==='elite'?'WARLOCK ELITE — серебристо-чёрная карта с цветком морозника':tier==='hellebore'?'BLACK HELLEBORE — фиолетовая карта с цветком морозника':'STANDARD — тёмная карта SAINTFOUR BANK с граффити'} onError={e=>{e.currentTarget.style.display='none';e.currentTarget.nextElementSibling.style.display='flex'}}/><div className="sf-bank-art-fallback" style={{display:'none'}}><span>SAINTFOUR BANK</span><strong>{tier==='elite'?'WARLOCK ELITE':tier==='hellebore'?'BLACK HELLEBORE':'STANDARD'}</strong></div></div>
 <div className="sf-bank-balance"><small>AVAILABLE BALANCE</small><strong>{fmt(bank.balance)} HBC</strong><p>Всего заработано: <b>{fmt(bank.earned)} HBC</b>. Карты сохраняются навсегда, даже если потратить весь баланс.</p>
 {bank.balance===0&&<><button disabled={bank.aidUsed} onClick={()=>{if(claimAid())setMessage('Банк выдал последние 1 500 HBC. Повторной помощи не будет.')}}>{bank.aidUsed?'ПОМОЩЬ БАНКА УЖЕ ИСПОЛЬЗОВАНА':'ПОЛУЧИТЬ 1 500 HBC ОТ БАНКА'}</button><button disabled={freeRemaining>0} onClick={()=>{const n=claimFreeSpin();if(n!==null)setMessage('FREE SPIN: +'+n+' HBC')}}>{freeRemaining>0?'FREE SPIN ЧЕРЕЗ '+Math.ceil(freeRemaining/3600000)+' Ч.':'FREE SPIN · 50–150 HBC'}</button></>}
 {message&&<p role="status">{message}</p>}</div></div>
 <div className="sf-bank-levels">{[['STANDARD','При первом посещении',true],['BLACK HELLEBORE','10 000 HBC заработано',bank.earned>=10000],['WARLOCK ELITE','100 000 HBC заработано',bank.earned>=100000]].map(([name,detail,unlocked])=><div key={name} className={'sf-bank-level '+(unlocked?'active':'')}><strong>{unlocked?'✦':'◇'} {name}</strong><small>{detail} · {unlocked?'ОТКРЫТО':'ЗАКРЫТО'}</small></div>)}</div>
 <div className="sf-bank-history"><h2>ИСТОРИЯ ОПЕРАЦИЙ</h2><ul>{bank.transactions.length?bank.transactions.slice(0,12).map((t,i)=><li key={t.at+'-'+i}><span>{t.type}</span><strong>{t.amount>0?'+':''}{fmt(t.amount)} HBC</strong></li>):<li>Пока операций нет.</li>}</ul></div>
 <div className="sf-bank-reset"><button type="button" onClick={()=>{if(window.confirm("Сбросить только финансы? Баланс станет 1 000 HBC, история операций, заработок, карты и ставки обнулятся. Достижения и секреты сайта останутся, но HBC за уже полученные достижения повторно не начислятся.")){resetFinances();setMessage("Финансы сброшены: 1 000 HBC. Ачивки сохранены.")}}}>СБРОСИТЬ ФИНАНСЫ · НАЧАТЬ ЗАНОВО</button><small>Сбрасываются только деньги, ставки и финансовый прогресс. Ачивки и секреты остаются.</small></div>
 <p className="sf-bank-note">HBC — исключительно виртуальная игровая валюта. Не покупается за реальные деньги, не обменивается на деньги или призы. Данные хранятся только в этом браузере и могут быть удалены при очистке хранилища.</p>
 </section>
}