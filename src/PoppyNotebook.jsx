import { useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import './poppy-notebook.css'

const pages = [
  { chapter: '01 / PRODUCTION', title: 'ПЛАН СЪЁМОК', tab: 'TO-DO' },
  { chapter: '02 / PERSONAL', title: 'НЕ ДЛЯ ЭФИРА', tab: 'NOTES' },
  { chapter: '03 / PRIVATE', title: 'БОЛЬШЕ НИКОГДА', tab: 'BLOG' },
]

function CheckItem({ done = false, children }) {
  return <li className={done ? 'poppy-note-done' : ''}>
    <span className="poppy-note-check" aria-hidden="true">{done ? '✓' : ''}</span>
    <span>{children}</span>
  </li>
}

export default function PoppyNotebook({ onClose }) {
  const [page, setPage] = useState(0)
  const startX = useRef(null)
  const showPage = (n) => setPage(Math.max(0, Math.min(pages.length - 1, n)))
  const handleTouchStart = (event) => {
    startX.current = event.touches[0]?.clientX ?? null
  }
  const handleTouchEnd = (event) => {
    if (startX.current === null) return
    const endX = event.changedTouches[0]?.clientX
    const diff = endX === undefined ? 0 : endX - startX.current
    startX.current = null
    if (Math.abs(diff) < 55) return
    showPage(page + (diff < 0 ? 1 : -1))
  }
  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight' && page < pages.length - 1) {
      event.preventDefault()
      showPage(page + 1)
    }
    if (event.key === 'ArrowLeft' && page > 0) {
      event.preventDefault()
      showPage(page - 1)
    }
  }

  return (
    <div className="poppy-notebook-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      <section className="poppy-notebook-dialog" role="dialog" aria-modal="true" aria-labelledby="poppy-notebook-heading" onKeyDown={onKeyDown}>
        <header className="poppy-notebook-toolbar">
          <span>POPPY / PRIVATE NOTEBOOK</span>
          <button type="button" onClick={onClose} aria-label="Закрыть блокнот"><X size={20}/></button>
        </header>
        <div className="poppy-notebook-stage">
          <div className="poppy-notebook-binding" aria-hidden="true"><i/><i/><i/><i/><i/></div>
          <div className="poppy-notebook-tabs" aria-hidden="true">{pages.map((item, i) => <span key={item.tab} className={i === page ? 'active' : ''}>{item.tab}</span>)}</div>
          <div className="poppy-notebook-paper" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} key={page}>
            <div className="poppy-notebook-paper-head"><span>{pages[page].chapter}</span><span>SAINTFOUR / ’27</span></div>
            <h2 id="poppy-notebook-heading">{pages[page].title}<span className="poppy-note-scribble" aria-hidden="true">✳</span></h2>
            {page === 0 && <>
              <p className="poppy-note-intro">Если не записать — этого никто не сделает.</p>
              <ul className="poppy-note-checklist">
                <CheckItem done>Проверить микрофоны.</CheckItem>
                <CheckItem done>Убедиться, что Декс не курит в помещении.</CheckItem>
                <CheckItem>Выяснить, кто записал Говарда.</CheckItem>
                <CheckItem done>Выслушать требования Даррена.</CheckItem>
                <CheckItem>Найти деньги на требования Даррена.</CheckItem>
                <CheckItem>Не дать Руди и Дексу подраться до батла.</CheckItem>
              </ul>
              <div className="poppy-note-tape">НЕ ЗАБЫТЬ: <b>ЗАРЯДИТЬ КАМЕРЫ!</b></div>
            </>}
            {page === 1 && <>
              <div className="poppy-note-sticker">ЭТО НЕ ЧИТАТЬ<br/>НА КАМЕРУ!</div>
              <p className="poppy-note-intro">Заметки, которые лучше не показывать участникам:</p>
              <div className="poppy-note-remarks">
                <p><strong>ДЕКС.</strong> Если сказать ему «не делай», он сделает дважды.</p>
                <p><strong>РУДИ.</strong> Ведёт себя так, будто это финал чемпионата.</p>
                <p><strong>ДАРРЕН.</strong> Кажется, его шубе нужно отдельное кресло.</p>
                <p><strong>ГОВАРД.</strong> Продолжает спрашивать, кто его сюда записал. Я тоже хочу знать.</p>
              </div>
              <p className="poppy-note-margin">Напомнить Сплетнице: я вообще-то блогер, а не профессиональный организатор мероприятий.</p>
            </>}
            {page === 2 && <>
              <p className="poppy-note-final-date">ЛИЧНОЕ / ПОСЛЕ РЕПЕТИЦИИ</p>
              <div className="poppy-note-final-copy">
                <p>В следующий раз я просто продолжу вести свой блог.</p>
                <p>Никаких батлов.<br/>Никаких рэперов.<br/>Никакого Говарда.</p>
              </div>
              <div className="poppy-note-handwritten">Хотя кого я обманываю…</div>
              <div className="poppy-note-final-mark">P. ♡</div>
            </>}
            <span className="poppy-notebook-page-number">{String(page + 1).padStart(2, '0')} / 03</span>
          </div>
        </div>
        <footer className="poppy-notebook-controls">
          <button type="button" onClick={() => showPage(page - 1)} disabled={page === 0} aria-label="Предыдущая страница"><ArrowLeft size={17}/> НАЗАД</button>
          <div className="poppy-notebook-dots" aria-label="Страницы">{pages.map((p, i) => <button key={p.tab} type="button" className={page === i ? 'active' : ''} aria-label={`Страница ${i + 1}`} aria-current={page === i ? 'page' : undefined} onClick={() => showPage(i)}/>)}</div>
          <button type="button" onClick={() => showPage(page + 1)} disabled={page === pages.length - 1}>ДАЛЬШЕ <ArrowRight size={17}/></button>
        </footer>
      </section>
    </div>
  )
}
