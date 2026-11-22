 const open=()=>{setOpened(true);setMode(progress.blocked?'blocked':progress.introDone?'idle':'incoming')}
 const call=()=>{
  if(progress.blocked){setMode('blocked');return}
  if(!progress.introDone){
   const next={...progress,introDone:true,limit:30+Math.floor(Math.random()*16)}
   setProgress(next);saveState(next);setMode('mistake');return
  }
  const next={...progress,calls:progress.calls+1}
  if(next.calls>=next.limit)next.blocked=true
  setProgress(next);saveState(next)
  if(next.blocked){setMode('final');onBlocked?.();return}
  const pool=next.calls<8?responses.slice(0,5):next.calls<22?responses:responses.slice(1)
  const chosen=pool[Math.floor(Math.random()*pool.length)]
  setReply(chosen);setMode('answer')
 }
 const hang=()=>{setMode(progress.blocked?'blocked':progress.introDone?'idle':'incoming')}
 const close=()=>{setOpened(false);setMode('incoming')}
 const dismiss=()=>{setDismissed(true);setVisible(false);close()}
 if(!visible||dismissed)return null
 return <>
  {!opened&&<div className="hp-floating">
    <button type="button" className="hp-closed" onClick={open} aria-label="Открыть звонящую фиолетовую раскладушку">
     <span className="hp-closed-hinge"/><span className="hp-closed-logo">M</span><span className="hp-closed-display"><Phone size={20}/><small>{progress.blocked?'BLOCKED':progress.introDone?'CALL LOG':'INCOMING'}</small></span><span className="hp-closed-led"/>
    </button>
    <button type="button" className="hp-dismiss" aria-label="Убрать телефон" onClick={dismiss}><X size={15}/></button>
   </div>}
  {opened&&<div className="hp-overlay" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)close()}}>
   <div className="hp-window" role="dialog" aria-modal="true" aria-label="Телефон Натаниэля Говарда">
    <button type="button" className="hp-exit" onClick={close} aria-label="Закрыть раскладушку"><X size={20}/></button>
    <div className="hp-phone">
     <button type="button" className="hp-upper" onClick={close} aria-label="Сложить телефон">
      <span className="hp-earpiece"/>
      <div className="hp-screen">
       <div className="hp-status"><span>▂▄▆</span><span>SF · 27</span><span>▰▰▰</span></div>
       <div className="hp-screen-body">
        {mode==='blocked'?<><LockKeyhole size={31}/><strong>КОНТАКТ<br/>ЗАБЛОКИРОВАН</strong><small>WARLOCK INDUSTRIES</small></>:
         mode==='final'?<><span className="hp-screen-kicker">НАТАНИЭЛЬ ГОВАРД</span><strong className="hp-angry">КТО ДАЛ ВАМ МОЙ НОМЕР?!</strong><small>ВАШ НОМЕР ЗАБЛОКИРОВАН</small></>:
         mode==='mistake'?<><span className="hp-screen-kicker">НАТАНИЭЛЬ ГОВАРД</span><strong>Прошу прощения. Кажется, я ошибся номером.</strong><small>ВЫЗОВ ЗАВЕРШЁН</small></>:
         mode==='answer'?<><span className="hp-screen-kicker">НАТАНИЭЛЬ ГОВАРД</span><strong>{reply?.text}</strong><small>{reply?.status}</small></>:
         mode==='idle'?<><PhoneOff size={27}/><strong>ВЫЗОВ ЗАВЕРШЁН</strong><small>НАБЕРИТЕ ЕЩЁ РАЗ</small></>:
         <><span className="hp-screen-kicker">ВХОДЯЩИЙ ВЫЗОВ</span><Phone className="hp-ring" size={29}/><strong>Натаниэль<br/>Говард</strong><small>НЕИЗВЕСТНЫЙ НОМЕР</small></>}
       </div>
       <div className="hp-screen-bottom"><span>{mode==='incoming'?'ANSWER':'SAINTFOUR'}</span><span>{mode==='incoming'?'DECLINE':'27 / 27'}</span></div>
      </div>
      <span className="hp-upper-mark">SAINTFOUR TELECOM</span>
     </button>
     <div className="hp-joint"><span/></div>
     <div className="hp-lower">
      <div className="hp-actions">
       <button type="button" className="hp-answer" onClick={call} aria-label={mode==='incoming'?'Ответить на звонок':'Позвонить ещё раз'} disabled={mode==='blocked'||mode==='final'||mode==='mistake'}><Phone size={20}/></button>
       <span className="hp-dpad"><span>▲</span><span>◀ ● ▶</span><span>▼</span></span>
       <button type="button" className="hp-hang" onClick={hang} aria-label="Сбросить звонок"><PhoneOff size={19}/></button>
      </div>
      <div className="hp-keys">{['1','2 ABC','3 DEF','4 GHI','5 JKL','6 MNO','7 PQRS','8 TUV','9 WXYZ','*','0 +','#'].map(k=><button type="button" key={k} onClick={()=>{if(mode==='idle')setMode('incoming')}}>{k}</button>)}</div>
      <span className="hp-bottom-mark">MOTOR / SF EDITION</span>
     </div>
    </div>
    <div className="hp-caption">{mode==='blocked'?'Натаниэль Говард заблокировал ваш номер.':mode==='final'?'Достижение открыто: «ГОВАРД ЗАБЛОКИРОВАЛ ВАС»':mode==='incoming'?'Кто-то звонит вам по ошибке…':mode==='mistake'?'Звонок оборвался. Но номер остался в журнале.':'Можно попробовать перезвонить.'}</div>
    {(mode==='answer'||mode==='idle'||mode==='mistake')&&<button type="button" className="hp-redial" onClick={()=>{if(mode==='mistake'){setMode('idle')}else{call()}}}>ПОЗВОНИТЬ ЕЩЁ РАЗ ↗</button>}
    {mode==='final'&&<button type="button" className="hp-redial" onClick={()=>setMode('blocked')}>ПОСМОТРЕТЬ ЧЁРНЫЙ СПИСОК ↗</button>}
   </div>
  </div>}
 </>
}
