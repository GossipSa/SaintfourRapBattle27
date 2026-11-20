const lineup = [
  { label:'LIL DEX', type:'MC' },
  { label:'MC NETTI', type:'MC' },
  { label:'YUNG RUD', type:'MC' },
  { label:'DON DARO', type:'MC' },
  { label:'PENELOPE (POPPY) EMERSON', type:'HOST' },
]
function Credits(){return <span className="credits-runner-set">{lineup.map(item=><span className={'credits-runner-item '+(item.type==='HOST'?'credits-runner-host':'')} key={item.label}>{item.type==='HOST'&&<small>HOST</small>}<strong>{item.label}</strong><b aria-hidden="true">✳</b></span>)}</span>}
export default function CreditsTicker(){
  return <div className="credits-runner" aria-label="Участники: LIL DEX, MC NETTI, YUNG RUD, DON DARO. Ведущая: Пенелопа (Поппи) Эмерсон.">
    <div className="credits-runner-track" aria-hidden="true"><Credits/><Credits/></div>
  </div>
}
