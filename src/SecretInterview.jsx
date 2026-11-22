import { useEffect, useState } from 'react'
import { ArrowRight, Check, LockKeyhole, Phone, PhoneCall, PhoneOff, Play, RotateCcw, X } from 'lucide-react'
import './secret-interview.css'

// The guest is the person behind the screen. No photo assets are required.
const questions=[
 {
  label:'КАК ТЫ ЗДЕСЬ ОКАЗАЛСЯ?',
  line:'Итак, расскажи, как ты вообще узнал о нашем батле?',
  choices:[
   ['Мне кто-то скинул ссылку.','Ага, сарафанное радио. Люблю, когда реклама работает, а платить за неё не приходится.'],
   ['Увидел рекламу.','Прекрасно! Значит, наши спонсоры не зря вкладываются. Надо будет им это передать.'],
   ['Я здесь с самого начала.','О, тогда ты ветеран! Надеюсь, у тебя хотя бы есть представление, во что мы ввязались. У меня вот не всегда.']
  ],
  after:'Странно. Я вроде бы услышала ответ, но ты даже рта не открыл. Ладно, современные технологии. Продолжаем.'
 },
 {
  label:'КТО ЗДЕСЬ ГЛАВНЫЙ?',
  line:'У нас четыре участника. Четыре совершенно разных характера. Как думаешь, кто устроит самый большой хаос?',
  choices:[
   ['LIL DEX. У него это получается естественно.','Декс? Да он, по-моему, способен устроить скандал даже в пустой комнате. Причём ещё и останется собой доволен.'],
   ['MC NETTI. Ему достаточно просто появиться.','Мистер Говард? Смелое заявление. Обычно при его появлении люди стараются вести себя приличнее, а не наоборот.'],
   ['YUNG RUD и DON DARO ещё всех удивят.','О, кто-то решил не ставить на очевидных фаворитов! Уважаю. Посмотрим, оправдаются ли ожидания.']
  ],
  after:'Погоди. А ты откуда знаешь всех участников? А, точно. Они же на сайте написаны. На каком ещё сайте?.. Ладно. Следующий вопрос.'
 },
 {
  label:'НЕУДОБНЫЙ ВОПРОС',
  line:'Слушай, мне надо кое-что уточнить. Мы уже довольно долго разговариваем, а я до сих пор не понимаю, как ты отвечаешь. Ты вообще сейчас где?',
  choices:[
   ['Напротив тебя. В кресле.','В кресле?.. Очень смешно. Я, конечно, плохо спала, но не настолько.'],
   ['По другую сторону экрана.','Экрана? То есть ты сейчас смотришь на меня? А я, получается, смотрю на тебя? Ненавижу, когда интервью становятся сложнее, чем должны быть.'],
   ['Я просто нажимаю на кнопки.','На какие кнопки? Стоп. То есть ты не разговариваешь, а выбираешь готовые ответы? Прекрасно. Я тут сижу, стараюсь, а у тебя, оказывается, тест с вариантами ответа.']
  ],
  after:'Так. Давай уточним. Ты находишься не в студии. Ты меня видишь. Ты знаешь участников. И каким-то образом отвечаешь мне через экран. И что, получается, я сейчас разговариваю с человеком, который сидит где-то дома? А второе кресло тогда зачем поставили?!'
 },
 {
  label:'ДВЕ ПЕСНИ',
  line:'Раз уж у нас тут открылся портал в какую-то другую реальность, давай воспользуемся случаем. Ты, кажется, знаешь о нашем шоу больше меня. С чего вообще начался Saintfour Rap Battle?',
  choices:[
   ['С двух мемных песен.','С двух чего? ДВУХ МЕМНЫХ ПЕСЕН?! То есть кто-то просто написал две песни ради шутки, а теперь у нас четыре рэпера, интервью, спонсоры, полноценный сайт и Я СИЖУ ЗДЕСЬ?! А можно было просто посмеяться и разойтись?!'],
   ['Сплетница решила превратить шутку в целое шоу.','Сплетница? Ну конечно. Кто же ещё. То есть кому-то показалось недостаточным просто выложить пару песен, и теперь у нас здесь целая музыкальная индустрия? А я-то думала, у нас серьёзное мероприятие!'],
   ['Всё немного вышло из-под контроля.','НЕМНОГО?! Четыре рэпера, пять интервью, рекламные интеграции, голосования и отдельный сайт! Если это у вас «немного», я боюсь представить, что будет, когда вы действительно решите развернуться.']
  ],
  after:'Так. Значит, изначально были две песни. Потом кто-то решил, что этого мало, добавил участников и превратил всё в настоящее шоу. А я, получается, просто оказалась частью всего этого? Подожди. Только не говори, что меня тоже кто-то придумал.'
 },
 {
  label:'КТО ЗА ЭТО ОТВЕЧАЕТ?',
  line:'Ладно. Последний вопрос. Кто вообще отвечает за весь этот цирк?',
  choices:[
   ['Сплетница Сентфора.','Ага! Так и знала. Ну ничего. У меня к ней накопилось несколько вопросов.'],
   ['Человек, который придумал всё это шоу.','Замечательно. Значит, у нас есть автор. А у автора, надеюсь, есть бюджет? Потому что у меня есть претензии к условиям труда.'],
   ['Вообще-то ты ведущая. Сама разбирайся.','Я ВЕДУЩАЯ, А НЕ ОРГАНИЗАТОР! Я должна задавать вопросы, держать микрофон и красиво выглядеть в кадре! И ни в одном пункте моего контракта не было написано, что я должна разговаривать с невидимым зрителем из другой реальности!']
  ],
  after:'Знаешь что? С меня хватит. Если у всего этого есть автор, то у меня есть полное право с ним поговорить. Сейчас мы кое-что выясним.'
 }
]

const callChoices=[
 ['Поппи, это фан-проект. Бюджета нет.','В смысле бюджета нет? А кресла? А камеры? А спонсоры?! В смысле они тоже ненастоящие?! Подожди. А мой гонорар, получается, тоже вымышленный?'],
 ['Зато тебе платят охватами.','Охватами. ОХВАТАМИ?! Прекрасно. Тогда в следующий раз, когда я пойду покупать кофе, я расплачусь просмотрами! Может, мне ещё лайками аренду оплатить?!'],
 ['Мы вообще-то договаривались на энтузиазме.','На энтузиазме?! Мой энтузиазм закончился примерно в тот момент, когда выяснилось, что я разговариваю с человеком через какой-то сайт! И вообще, почему об этом договоре знаю только ты?!']
]


// Short stage directions keep the interview feeling like a recorded scene rather than a questionnaire.
const interviewActing=[
 {
  before:'Поппи поправляет бандану, отбрасывает прядь волос за плечо и бросает быстрый взгляд на пустое кресло.',
  answers:[
   'Усмехается, постукивает ногтем по краю карточки с вопросами.',
   'Одобрительно кивает и делает вид, что ставит галочку в блокноте.',
   'Приподнимает брови и чуть подаётся вперёд.'
  ],
  after:'Она прислушивается, замирает на секунду и растерянно смотрит на микрофон.'
 },
 {
  before:'Поппи перебирает карточки, выбирает следующую и устраивается поудобнее в кресле.',
  answers:[
   'Смеётся и качает головой, будто уже представляет будущую катастрофу.',
   'Выпрямляется, изображая деловой тон, но улыбка всё равно прорывается.',
   'Заинтересованно наклоняет голову и на секунду задумчиво прикусывает губу.'
  ],
  after:'Смотрит на пустое кресло, затем — на камеру. Медленно опускает карточку.'
 },
 {
  before:'Поппи поправляет микрофон и несколько секунд молча разглядывает соседнее кресло.',
  answers:[
   'Резко оборачивается вправо и всматривается в пустое сиденье.',
   'Медленно переводит взгляд с объектива на оператора и обратно.',
   'Опускает взгляд вниз, словно пытается разглядеть кнопки под собственными ногами.'
  ],
  after:'Отодвигает карточки в сторону, делает паузу и подаётся к камере.'
 },
 {
  before:'Поппи нервно разглаживает уголок карточки. Кажется, теперь она хочет услышать ответ всерьёз.',
  answers:[
   'Сначала смеётся, потом перестаёт. Широко раскрывает глаза и разводит руками.',
   'Закатывает глаза, откидывается на спинку кресла и смотрит прямо в объектив.',
   'Пересчитывает что-то на пальцах, каждый раз загибая новый, и резко вскидывает руки.'
  ],
  after:'Молчит несколько секунд, внимательно оглядывает студию и медленно опускает карточки на стол.'
 },
 {
  before:'Она уже не смотрит в сценарий. Сжимает микрофон и раздражённо стучит пальцами по подлокотнику.',
  answers:[
   'Коротко усмехается, будто услышала наконец знакомое имя.',
   'Поворачивается к оператору и многозначительно приподнимает бровь.',
   'Возмущённо распрямляется и вскидывает свободную руку.'
  ],
  after:'Отодвигает микрофон, достаёт телефон и несколько раз решительно нажимает на экран.'
 }
]
const phoneActing=[
 'Поппи смотрит на телефон, потом на дорогую с виду студию. Поднимает с пола одну из карточек и безнадёжно опускает её обратно.',
 'Несколько секунд молча смотрит в одну точку. Затем медленно снимает телефон с уха, смотрит на него и снова прикладывает к уху.',
 'Она закрывает глаза, считает до трёх и очень осторожно уточняет, не ослышалась ли.'
]
function StageCue({children}){return <p className="fifth-cue"><span aria-hidden="true">···</span>{children}</p>}

export default function SecretInterview({onClose,onComplete,alreadyEarned=false}){
 const [stage,setStage]=useState('intro')
 const [index,setIndex]=useState(0)
 const [choice,setChoice]=useState(null)
 const [callChoice,setCallChoice]=useState(null)
 useEffect(()=>{
  const original=document.body.style.overflow
  document.body.style.overflow='hidden'
  return ()=>{document.body.style.overflow=original}
 },[])
 const question=questions[index]
 // The same seven photo assets follow the seven dramatic beats of the existing script.
 const photoIndex=stage==='intro'?'01':stage==='questions'?['02','05','03','06','04'][index]:stage==='done'?'01':'07'
 const photoAlt=stage==='intro'?'Поппи ожидает неизвестного гостя напротив пустого кресла':stage==='questions'?['Поппи уверенно ведёт интервью','Поппи задумчиво изучает пустое кресло','Поппи недоверчиво смотрит на зрителя','Поппи потрясена рассказом о происхождении шоу','Поппи раздражённо готовится позвонить организатору'][index]:'Поппи возмущённо разговаривает по телефону'
 const photoUrl=`${import.meta.env.BASE_URL}media/fifth-chair/poppy-${photoIndex}.jpg`
 const choose=(i)=>setChoice(i)
 const next=()=>{
  if(choice===null)return
  if(index===questions.length-1){setStage('dial');return}
  setIndex(v=>v+1);setChoice(null)
 }
 const complete=()=>{
  setStage('done')
  if(!alreadyEarned)onComplete?.()
 }
 const restart=()=>{
  setStage('intro');setIndex(0);setChoice(null);setCallChoice(null)
 }
 return <div className="fifth-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
  <section className={'fifth-dialog fifth-phase-'+stage+(index>=2?' fifth-reality-broken':'')} role="dialog" aria-modal="true" aria-labelledby="fifth-title">
   <header className="fifth-topbar">
    <span className="fifth-rec"><i/> REC</span><span className="fifth-topbar-label">SAINTFOUR / UNLISTED INTERVIEW <b>006</b></span>
    <button type="button" onClick={onClose} className="fifth-close" aria-label="Закрыть интервью"><X size={19}/></button>
   </header>
   <div className="fifth-layout">
    <div className="fifth-visual">
     <div className="fifth-scene">
      <img key={photoIndex} className="fifth-scene-photo" src={photoUrl} alt={photoAlt} decoding="async" fetchPriority={stage==='intro'?'high':'auto'}/>
      <div className="fifth-stage-caption"><span>CAM 01 / INTERVIEW ROOM</span><span>{stage==='intro'?'STANDBY':stage==='done'?'SIGNAL LOST':'LIVE'}</span></div>
     </div>
     <div className="fifth-visual-meta"><span>POPPY EMERSON</span><span>GUEST NOT FOUND <i>●</i></span></div>
     <div className="fifth-progress" aria-label="Прогресс интервью">{Array.from({length:6},(_,i)=><span key={i} className={(stage==='done'||stage==='call'||stage==='dial'||i<index||(i===index&&choice!==null))?'fifth-progress-done':''}/>)}</div>
    </div>
    <div className="fifth-content">
     {stage==='intro'&&<div className="fifth-screen fifth-intro">
      <span className="fifth-kicker">UNLISTED RECORDING / NO GUEST ID</span>
      <h2 id="fifth-title">THE FIFTH <em>CHAIR.</em></h2>
      <p className="fifth-dialogue"><strong>ПОППИ</strong>Ну что, привет! Я Поппи Эмерсон, и ты смотришь Saintfour Rap Battle. Сегодня у нас немного необычный гость. Честно говоря, я даже не знаю, как тебя представить.</p>
      <StageCue>Проверяет, включён ли микрофон, поправляет волосы и поворачивается к пустому креслу. Несколько секунд ждёт, будто кто-то должен там появиться.</StageCue>
      <p className="fifth-dialogue">Ладно, разберёмся по ходу. Начнём с простого.</p>
      <button className="fifth-primary" onClick={()=>setStage('questions')}>НАЧАТЬ ИНТЕРВЬЮ <Play size={16}/></button>
     </div>}
     {stage==='questions'&&<div key={index} className="fifth-screen">
      <div className="fifth-question-head"><span>QUESTION {String(index+1).padStart(2,'0')} / 05</span><span>{question.label}</span></div>
      <h2 id="fifth-title" className="fifth-title-small">{question.label}</h2>
      <StageCue>{interviewActing[index].before}</StageCue><p className="fifth-dialogue"><strong>ПОППИ</strong>{question.line}</p>
      {choice===null?<><span className="fifth-answer-kicker">ТВОЙ ОТВЕТ / CHOOSE ONE</span><div className="fifth-options">{question.choices.map(([label],i)=><button key={i} type="button" className="fifth-option" onClick={()=>choose(i)}><span>{String.fromCharCode(65+i)}</span><b>{label}</b><ArrowRight size={15}/></button>)}</div></>:<div className="fifth-reaction"><span className="fifth-reaction-head"><Check size={14}/> ANSWER RECORDED / POPPY REACTS</span><StageCue>{interviewActing[index].answers[choice]}</StageCue><p>{question.choices[choice][1]}</p><div className="fifth-after"><span>ПОППИ / ПРОДОЛЖАЕТ</span><StageCue>{interviewActing[index].after}</StageCue><p>{question.after}</p></div><button className="fifth-primary" onClick={next}>{index===4?'ПОЗВОНИТЬ СПЛЕТНИЦЕ':'СЛЕДУЮЩИЙ ВОПРОС'} <ArrowRight size={16}/></button></div>}
     </div>}
     {stage==='dial'&&<div className="fifth-screen fifth-phone">
      <span className="fifth-kicker">UNSCRIPTED / OUTGOING CALL</span><div className="fifth-phone-icon"><PhoneCall size={30}/></div>
      <h2 id="fifth-title">СПЛЕТНИЦА <em>СЕНТФОРА.</em></h2><span className="fifth-calling">СОЕДИНЕНИЕ УСТАНОВЛЕНО</span>
      <StageCue>Поппи находит контакт «СПЛЕТНИЦА СЕНТФОРА», нажимает вызов и нетерпеливо постукивает носком ботинка по полу. После нескольких гудков распрямляется в кресле.</StageCue><div className="fifth-call-log"><p><strong>ПОППИ</strong>Алло? Привет, это Пенелопа. Да, с батла. Нет, всё нормально. Ну, почти.</p><StageCue>На секунду отводит телефон от уха и смотрит в объектив, словно проверяет, не исчез ли её невидимый гость.</StageCue><p>Я сейчас разговаривала с каким-то человеком, которого вообще нет в студии, и он мне кое-что рассказал. Это правда, что всё началось с двух мемных песен?</p><StageCue>Слушает ответ. Медленно приподнимает брови.</StageCue><p>А то, что ты потом добавила остальных участников, потому что двух тебе показалось мало, — тоже правда? Ага. Чудесно.</p><StageCue>Глубоко вздыхает, откладывает карточки и наклоняется к микрофону.</StageCue><p>Тогда у меня возникает закономерный вопрос. <b>ПОЧЕМУ МНЕ ЗА ЭТО НЕДОСТАТОЧНО ПЛАТЯТ?!</b></p></div>
      <button className="fifth-primary" onClick={()=>setStage('call')}>ОТВЕТИТЬ ЗА СПЛЕТНИЦУ <Phone size={16}/></button>
     </div>}
     {stage==='call'&&<div className="fifth-screen fifth-phone">
      <span className="fifth-kicker">CALL IN PROGRESS / YOU ARE THE CREATOR</span>
      <h2 id="fifth-title">ТВОЙ <em>ЗВОНОК.</em></h2>
      <StageCue>На другом конце отвечают. Поппи замирает с телефоном у уха и нетерпеливо ждёт.</StageCue><p className="fifth-dialogue"><strong>ПОППИ</strong>ПОЧЕМУ МНЕ ЗА ЭТО НЕДОСТАТОЧНО ПЛАТЯТ?!</p>
      {callChoice===null?<><span className="fifth-answer-kicker">СПЛЕТНИЦА НА ЛИНИИ / ЧТО ОТВЕТИМ?</span><div className="fifth-options">{callChoices.map(([label],i)=><button key={i} type="button" className="fifth-option" onClick={()=>setCallChoice(i)}><span>{String.fromCharCode(65+i)}</span><b>{label}</b><Phone size={14}/></button>)}</div></>:<div className="fifth-reaction"><span className="fifth-reaction-head"><Phone size={14}/> ПОППИ / НА ЛИНИИ</span><StageCue>{phoneActing[callChoice]}</StageCue><p>{callChoices[callChoice][1]}</p><div className="fifth-after fifth-final-scene"><span>ПОППИ / ВНЕ СЦЕНАРИЯ</span>
       <StageCue>Откидывается в кресле. На мгновение закрывает глаза и начинает загибать пальцы, перечисляя претензии.</StageCue>
       <p>Так, подожди. Давай ещё раз.</p>
       <p>Ты организовала батл. Я должна его вести. Мой сегодняшний гость вообще не существует в этой студии. А зарплата у меня, судя по всему, воображаемая.</p>
       <StageCue>Замолкает, слушая ответ на другом конце провода. Недоверчиво приподнимает бровь.</StageCue>
       <p>Что?..</p>
       <StageCue>Пауза. Поппи чуть отстраняет телефон от уха.</StageCue>
       <p>Что значит «зато зрителям нравится»?</p>
       <StageCue>Медленно поворачивается к камере, разводит руками.</StageCue>
       <p>А, ну конечно! ЗРИТЕЛЯМ НРАВИТСЯ! А мне, между прочим, тоже хотелось бы, чтобы мне что-нибудь нравилось. Например, мой банковский счёт!</p>
       <StageCue>Снова слушает Сплетницу. Хмурится, проверяет экран телефона и прикладывает его к уху обратно.</StageCue>
       <p>Подожди… Ты вообще меня слушаешь?</p>
       <StageCue>На другом конце что-то отвечают. Поппи выпрямляется.</StageCue>
       <p>В смысле, ты сейчас на сайте?.. Я тут с тобой серьёзно разговариваю, а ты что делаешь?!</p>
       <StageCue>Тишина. Поппи моргает, не веря услышанному.</StageCue>
       <p>Какую ещё ачивку?!</p>
       <div className="fifth-live-update" role="status" aria-label="Сплетница создаёт достижение"><div className="fifth-live-update-top"><span>SYSTEM / LIVE UPDATE</span><b>ACHIEVEMENT 005</b></div><strong>CREATING ACHIEVEMENT...</strong><div className="fifth-live-progress"><span/></div><small>AUTHOR OVERRIDE / GOSSIP SAINTFOUR</small></div>
       <StageCue>Смотрит то на экран телефона, то прямо в объектив.</StageCue>
       <p>Нет, стой. Ты хочешь сказать, что за ответы на мои вопросы этому человеку дадут награду?!</p>
       <p>А мне за проведение интервью что дадут?</p>
       <StageCue>Пауза. Поппи слушает ответ. Лицо медленно вытягивается.</StageCue>
       <p>Опыт?!</p>
       <StageCue>Закрывает глаза и медленно выдыхает.</StageCue>
       <p>Замечательно. Ему ачивка, мне опыт. Обожаю свою работу.</p>
       <StageCue>В изображении пробегают помехи. Поппи резко поднимает голову.</StageCue>
       <p>Подожди, что происходит с камерой?</p>
       <StageCue>Помехи усиливаются. Она подаётся вперёд, продолжая держать телефон у уха.</StageCue>
       <p>Сплетница, только не говори, что ты сейчас ещё и запись выключаешь!</p>
       <p>МЫ С ТОБОЙ НЕ ДОГОВО—</p></div><button className="fifth-primary fifth-cut" onClick={complete}><PhoneOff size={16}/> ОБОРВАТЬ ЗАПИСЬ</button></div>}
     </div>}
     {stage==='done'&&<div className="fifth-screen fifth-finished">
      <span className="fifth-kicker">[ CONNECTION LOST ] / RECORDING TERMINATED</span>
      <div className="fifth-unlock-symbol"><LockKeyhole size={33}/></div>
      <h2 id="fifth-title">ACHIEVEMENT <em>UNLOCKED.</em></h2>
      <span className="fifth-reward-index">005 / THE FIFTH CHAIR</span>
      <p>Ты получил награду. Поппи — профессиональный опыт.</p>
      <span className="fifth-afterword">Поппи всё ещё пытается дозвониться до Сплетницы.</span>
      <button className="fifth-primary" onClick={onClose}>ЗАБРАТЬ АЧИВКУ <Check size={16}/></button><button className="fifth-replay" onClick={restart}><RotateCcw size={14}/> ПРОЙТИ ЕЩЁ РАЗ</button>
     </div>}
    </div>
   </div>
   <footer className="fifth-footer"><span>GOSSIP SAINTFOUR / THE FIFTH CHAIR</span><span>{stage==='questions'?`ON THE RECORD / ${index+1} OF 5`:stage==='done'?'ACHIEVEMENT 005':'UNLISTED TAPE / 006'}</span></footer>
  </section>
 </div>
}
