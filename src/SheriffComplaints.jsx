import { useState } from 'react'
import { ShieldAlert, X, FileText, CheckCircle2, Trophy } from 'lucide-react'
import './sheriff-complaints.css'

const targets=[
 ['dex','LIL DEX / ДЕКС ХОУК'],
 ['howard','MC NETTI / НАТАНИЭЛЬ ГОВАРД'],
 ['rudi','YUNG RUD / РУДИ БРУКС'],
 ['daro','DON DARO / ДАРРЕН БОУИ'],
 ['poppy','POPPY / ПОППИ ЭМЕРСОН'],
 ['gossip','СПЛЕТНИЦА СЕНТФОРА'],
 ['show','SAINTFOUR RAP BATTLE / ВСЁ ШОУ']
]
const reasons=[
 ['noise','Нарушение общественного порядка'],
 ['music','Оскорбление музыкального вкуса'],
 ['suspicious','Подозрительное поведение'],
 ['personal','Личная неприязнь']
]
const replies={
 dex:{
  noise:'Хоук опять завёл свой мотоцикл под окнами? Запишем. Если найдём его раньше, чем он услышит патруль.',
  music:'Я не обязан разбираться в панчах Хоука. Но если это называется музыкой, у города появились новые проблемы.',
  suspicious:'Декс Хоук ведёт себя подозрительно? Вы сейчас описали его обычный вторник.',
  personal:'Личная неприязнь к Хоуку не является преступлением. Иначе мне пришлось бы открыть отдельное отделение.'
 },
 howard:{
  noise:'Мистер Говард? Нарушает порядок? Боюсь, вы неверно истолковали ситуацию. Вероятно, он отдавал необходимые распоряжения.',
  music:'Музыкальный вкус мистера Говарда не нуждается в вашей оценке. Уверен, он прекрасно разбирается и в этой области.',
  suspicious:'Прошу осторожнее подбирать выражения в отношении мистера Говарда. Его деловая деятельность не является основанием для подобных подозрений.',
  personal:'Вы испытываете неприязнь к мистеру Говарду? Очень жаль. Полагаю, проблема не в нём.'
 },
 rudi:{
  noise:'Брукс опять шумит? Если он снова тренируется возле участка, передайте, что баскетбольное кольцо мы здесь так и не установили.',
  music:'Он хотя бы попадает в корзину. Насчёт попадания в ритм у меня есть некоторые сомнения.',
  suspicious:'Брукс ведёт себя подозрительно? Сначала выясните, не пытается ли он просто произвести на кого-нибудь впечатление.',
  personal:'Вы не обязаны любить Брукса. Но прошу не решать ваши разногласия баскетбольным мячом.'
 },
 daro:{
  noise:'Молодой мистер Боуи? Вы уверены? Я знаком с его семьёй. Возможно, вы приняли обычное юношеское увлечение за нарушение порядка.',
  music:'Музыкальные эксперименты молодого мистера Боуи не являются основанием для жалобы. И я бы предпочёл, чтобы его отец не узнал об этом разговоре.',
  suspicious:'Даррен Боуи? Насколько мне известно, этот молодой человек всегда отличался примерным поведением. Хотя его появление на рэп-батле действительно вызывает вопросы.',
  personal:'Вы жалуетесь на сына мистера Боуи? Советую тщательно обдумать формулировку обращения. Это весьма уважаемая семья.'
 },
 poppy:{
  noise:'Эмерсон опять устроила мероприятие без согласования? Я поговорю с ней. Как только она перестанет снимать меня на камеру.',
  music:'С претензиями к музыкальной программе обращайтесь к организатору. Хотя, постойте, вы уже обратились.',
  suspicious:'Она задаёт неудобные вопросы, снимает всё подряд и называет это журналистикой. Пока оснований для задержания нет.',
  personal:'Если Поппи вас раздражает, не советую говорить ей об этом. Она сделает из вашей жалобы отдельный выпуск.'
 },
 gossip:{
  noise:'Жалоба принята. Однако для дальнейшего разбирательства мне бы сначала хотелось установить личность этой самой Сплетницы.',
  music:'Обращение зарегистрировано. Прежде чем его рассматривать, мне необходимо выяснить, кто скрывается за именем Сплетницы Сентфора.',
  suspicious:'Ваши подозрения зафиксированы. Осталось установить личность Сплетницы. Поверьте, я и сам давно хотел бы это сделать.',
  personal:'Жалоба принята. Как только установим личность этой самой Сплетницы, обязательно рассмотрим ваше недовольство.'
 },
 show:{
  noise:'Жалуетесь на всё шоу? Прекрасно. Я сам уже несколько раз пытался выяснить, кто дал разрешение на этот балаган.',
  music:'Я шериф, а не музыкальный критик. Хотя некоторые выступления заставляют задуматься о смене профессии.',
  suspicious:'Четверо рэперов, ведущая, анонимные организаторы… Пожалуй, тут действительно есть над чем поработать.',
  personal:'Личная неприязнь ко всему мероприятию? Наконец-то жалоба, с которой я могу согласиться.'
 }
}
const key='sf27-wilson-complaints-v1'
function readCount(){try{return Number(localStorage.getItem(key))||0}catch{return 0}}

export default function SheriffComplaints({open,onClose,onFirstComplaint}){
 const [target,setTarget]=useState('dex')
 const [reason,setReason]=useState('noise')
 const [count,setCount]=useState(readCount)
 const [result,setResult]=useState(null)
 if(!open)return null
 const submit=()=>{
  const next=count+1
  setCount(next)
  try{localStorage.setItem(key,String(next))}catch{/* private mode */}
  setResult({target,reason,count:next})
  if(next===1)onFirstComplaint?.()
 }
 const reset=()=>setResult(null)
 const answer=result?replies[result.target][result.reason]:null
 const intro=result?.count>=5?'Вы опять? У меня вообще-то есть другие дела. Впрочем, слушаю. ':result?.count===3?'Снова вы? Я начинаю узнавать ваши обращения. ':''
 return <div className="wilson-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
  <section className="wilson-dialog" role="dialog" aria-modal="true" aria-labelledby="wilson-title">
   <header className="wilson-header"><ShieldAlert size={27}/><div><span>SAINTFOUR SHERIFF'S DEPARTMENT</span><h2 id="wilson-title">ПРИЁМНАЯ ШЕРИФА УИЛСОНА</h2><small>OFFICIAL COMPLAINT FORM · CASE DEPARTMENT #027</small></div><button type="button" className="wilson-close" aria-label="Закрыть приёмную" onClick={onClose}><X size={20}/></button></header>
   {!result?<div className="wilson-body">
    <p>Укажите, на кого и по какой причине хотите пожаловаться. Шериф Уилсон рассмотрит ваше обращение. Возможно.</p>
    <label htmlFor="wilson-target">НА КОГО ЖАЛУЕМСЯ?</label>
    <select id="wilson-target" value={target} onChange={e=>setTarget(e.target.value)}>{targets.map(([id,name])=><option key={id} value={id}>{name}</option>)}</select>
    <label htmlFor="wilson-reason">ПРИЧИНА ОБРАЩЕНИЯ</label>
    <select id="wilson-reason" value={reason} onChange={e=>setReason(e.target.value)}>{reasons.map(([id,name])=><option key={id} value={id}>{name}</option>)}</select>
    <button type="button" className="wilson-submit" onClick={submit}><FileText size={17}/> ПОДАТЬ ЖАЛОБУ</button>
    <small className="wilson-privacy">Игровая форма. Жалобы никуда не отправляются, личные данные не собираются.</small>
   </div>:<div className="wilson-body">
    <div className="wilson-case"><span>CASE #027-{String(result.count).padStart(3,'0')}</span><strong className={result.target==='howard'?'wilson-cleared':''}><CheckCircle2 size={15}/>{result.target==='howard'?'NO VIOLATION FOUND':'REVIEWED'}</strong></div>
    <p className="wilson-subject">ОБЪЕКТ: {targets.find(([id])=>id===result.target)?.[1]}</p>
    <h3>ОФИЦИАЛЬНЫЙ ОТВЕТ ШЕРИФА УИЛСОНА</h3>
    <blockquote>«{intro}{answer}»</blockquote>
    {result.count===1&&<div className="wilson-achievement" role="status"><Trophy size={26}/><div><span>SECRET ACHIEVEMENT / 009 · UNLOCKED</span><strong>СТУКАЧ СЕНТФОРА</strong><small>Шериф Уилсон благодарит вас за сотрудничество. Остальные — нет.</small></div></div>}
    <button type="button" className="wilson-submit" onClick={reset}>ПОДАТЬ ЕЩЁ ОДНУ ЖАЛОБУ</button>
    <small className="wilson-privacy">Обращение зарегистрировано только в вашем браузере.</small>
   </div>}
   <footer className="wilson-foot"><span>SAINTFOUR / SHERIFF WILSON</span><span>TO SERVE AND TO ENDURE</span></footer>
  </section>
 </div>
}
