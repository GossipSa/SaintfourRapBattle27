import { useEffect, useRef, useState } from 'react'
import { Phone, PhoneOff, X, LockKeyhole } from 'lucide-react'
import './HowardPhone.css'
import { acquireAmbient, releaseAmbient, ambientElapsed, ambientRandom } from './ambient-timing.js'
import { dexCallStories } from './dex-call-stories.js'
import { poppyCallStories } from './poppy-call-stories.js'

const newPhoneStories={"darren":["Даррен Боуи. Слушаю. Откуда у вас мой номер?","Если это насчёт консультации по химии, то сегодня я занят.","Брукс предложил мне баскетбол. Я предложил ему дифференциальное уравнение. На этом переговоры закончились.","Скромность украшает человека? Мне вполне хватает шубы.","Красивый и умный? Продолжайте. У меня внезапно появилось свободное время.","Вы снова звоните. Начинаю думать, что дело не в моих знаниях химии.","Я в библиотеке. Да, в этой шубе.","Нет, золотые цепи не мешают проводить эксперименты.","У меня есть теория относительно Декса. Но доказательств пока недостаточно.","Я предпочитаю аргументы. И дорогие очки.","Мистер Говард сегодня в особенно прекрасном настроении. То есть нет.","Если вы хотите автограф, принесите нормальную ручку.","Поппи просила говорить короче. Невыполнимое требование.","Я не опоздал. Я эффектно появился.","Вы когда-нибудь пробовали объяснить Руди статистику?","Мой отец не имеет отношения к моему гардеробу.","Надин? Уточните вопрос.","Вам помочь с домашним заданием?","Нет, шубу я не одолжу.","Наука требует жертв. Мой стиль — нет.","Я занят. Но для вас сделаю исключение.","Декс считает себя непредсказуемым. Это предсказуемо.","У меня репетиция. Точнее, у остальных репетиция, у меня выступление.","Вы хотите услышать мой новый панч? Не раньше премьеры.","Очки не снимаю. Это часть образа.","Я умею готовить. Химия, в конце концов.","Не путайте уверенность с высокомерием. Хотя можете.","В моей лаборатории энергетики запрещены.","Простите, я только что выиграл спор.","Руди снова требует реванш. Не уточнил в чём.","Даррен Боуи. Слушаю. Откуда у вас мой номер? Ладно, продолжайте.","Если это насчёт консультации по химии, то сегодня я занят. Весьма любопытно.","Брукс предложил мне баскетбол. Я предложил ему дифференциальное уравнение. На этом переговоры закончились. У меня есть ещё минута.","Скромность украшает человека? Мне вполне хватает шубы. Запомните это.","Красивый и умный? Продолжайте. У меня внезапно появилось свободное время. Не будем спешить с выводами.","Вы снова звоните. Начинаю думать, что дело не в моих знаниях химии. Ладно, продолжайте.","Я в библиотеке. Да, в этой шубе. Весьма любопытно.","Нет, золотые цепи не мешают проводить эксперименты. У меня есть ещё минута.","У меня есть теория относительно Декса. Но доказательств пока недостаточно. Запомните это.","Я предпочитаю аргументы. И дорогие очки. Не будем спешить с выводами.","Мистер Говард сегодня в особенно прекрасном настроении. То есть нет. Ладно, продолжайте.","Если вы хотите автограф, принесите нормальную ручку. Весьма любопытно.","Поппи просила говорить короче. Невыполнимое требование. У меня есть ещё минута.","Я не опоздал. Я эффектно появился. Запомните это.","Вы когда-нибудь пробовали объяснить Руди статистику? Не будем спешить с выводами.","Мой отец не имеет отношения к моему гардеробу. Ладно, продолжайте.","Надин? Уточните вопрос. Весьма любопытно.","Вам помочь с домашним заданием? У меня есть ещё минута.","Нет, шубу я не одолжу. Запомните это.","Наука требует жертв. Мой стиль — нет. Не будем спешить с выводами.","Я занят. Но для вас сделаю исключение. Ладно, продолжайте.","Декс считает себя непредсказуемым. Это предсказуемо. Весьма любопытно.","У меня репетиция. Точнее, у остальных репетиция, у меня выступление. У меня есть ещё минута.","Вы хотите услышать мой новый панч? Не раньше премьеры. Запомните это.","Очки не снимаю. Это часть образа. Не будем спешить с выводами.","Я умею готовить. Химия, в конце концов. Ладно, продолжайте.","Не путайте уверенность с высокомерием. Хотя можете. Весьма любопытно.","В моей лаборатории энергетики запрещены. У меня есть ещё минута.","Простите, я только что выиграл спор. Запомните это.","Руди снова требует реванш. Не уточнил в чём. Не будем спешить с выводами."],"rudy":["О, привет! А мы знакомы? Ладно, теперь знакомы.","Ты сегодня нормально поел? Я серьёзно.","Приходи на игру. Только болей погромче.","За Декса? У всех бывают ошибки. Шучу!","Я только с тренировки. Рад, что позвонили.","Как день? У меня неплохо.","Не переживай, у тебя получится.","Хочешь, расскажу, как мы выиграли последний матч?","Поппи сказала, что я слишком много разговариваю.","Я тут выбираю кроссовки. Сложнее, чем кажется.","Надин? Надеюсь, у неё всё хорошо.","У меня сегодня выходной. Почти чудо.","Давай как-нибудь побросаем мяч.","Слушай, ты можешь звонить просто так.","Мне приятно, что ты вспомнил обо мне.","Не забывай отдыхать, ладно?","Тренер сегодня был особенно суров.","Декс опять делает вид, что не умеет улыбаться.","Даррен отказался играть со мной. Его потеря.","Я не всегда выигрываю. Но стараюсь.","Ты слышал наш новый трек?","У меня тут спор с Элис насчёт музыки.","Честно, я немного волнуюсь перед батлом.","Хочешь узнать секрет хорошего броска? Практика.","У меня ещё пять минут до тренировки.","Я бы сейчас с удовольствием съел пиццу.","Ты за кого болеешь? Только честно.","Спасибо за поддержку. Правда.","Если что, я на связи.","Улыбнись. Просто так.","О, привет! А мы знакомы? Ладно, теперь знакомы. Расскажи, как у тебя дела.","Ты сегодня нормально поел? Я серьёзно. Рад слышать тебя.","Приходи на игру. Только болей погромче. Договорились?","За Декса? У всех бывают ошибки. Шучу! Ну, держись там!","Я только с тренировки. Рад, что позвонили. До связи :)","Как день? У меня неплохо. Расскажи, как у тебя дела.","Не переживай, у тебя получится. Рад слышать тебя.","Хочешь, расскажу, как мы выиграли последний матч? Договорились?","Поппи сказала, что я слишком много разговариваю. Ну, держись там!","Я тут выбираю кроссовки. Сложнее, чем кажется. До связи :)","Надин? Надеюсь, у неё всё хорошо. Расскажи, как у тебя дела.","У меня сегодня выходной. Почти чудо. Рад слышать тебя.","Давай как-нибудь побросаем мяч. Договорились?","Слушай, ты можешь звонить просто так. Ну, держись там!","Мне приятно, что ты вспомнил обо мне. До связи :)","Не забывай отдыхать, ладно? Расскажи, как у тебя дела.","Тренер сегодня был особенно суров. Рад слышать тебя.","Декс опять делает вид, что не умеет улыбаться. Договорились?","Даррен отказался играть со мной. Его потеря. Ну, держись там!","Я не всегда выигрываю. Но стараюсь. До связи :)","Ты слышал наш новый трек? Расскажи, как у тебя дела.","У меня тут спор с Элис насчёт музыки. Рад слышать тебя.","Честно, я немного волнуюсь перед батлом. Договорились?","Хочешь узнать секрет хорошего броска? Практика. Ну, держись там!","У меня ещё пять минут до тренировки. До связи :)","Я бы сейчас с удовольствием съел пиццу. Расскажи, как у тебя дела.","Ты за кого болеешь? Только честно. Рад слышать тебя.","Спасибо за поддержку. Правда. Договорились?","Если что, я на связи. Ну, держись там!","Улыбнись. Просто так. До связи :)"],"abigail":["Приёмная Руди Брукса, слушаю. Запись на свидания закрыта.","Нет, мы с Руди не встречаемся. ПОКА.","У вас своего баскетболиста нет? Найдите.","Опять вы?","Руди занят. Очень занят.","Зачем вам его номер?","Я передам. Возможно.","Не думаю, что он ждёт вашего звонка.","Вы слишком часто звоните.","Руди сейчас тренируется. Не мешайте.","Это не справочная служба.","Ваше имя мне ничего не говорит.","Нет, я не его секретарь.","Вам обязательно звонить именно ему?","Очень интересно. До свидания.","Я запомнила ваш голос.","Мы уже разговаривали, кажется.","Поппи вам больше не отвечает?","У меня нет времени на это.","Я бы на вашем месте не перезванивала.","Он не у телефона.","Да, это опять я.","Какой настойчивый человек.","Вы серьёзно сейчас?","Надеюсь, это последний звонок.","Нет, номер я вам не дам.","У него есть дела поважнее.","Я всё слышала.","Не надо делать вид, что мы друзья.","Всего доброго. Особенно доброго."],"voicemail":["Абонент сейчас на тренировке.","После сигнала оставьте сообщение.","Руди не может ответить.","Телефон вне зоны доступа.","Перезвоните позже.","Вызов перенаправлен на автоответчик.","Абонент занят.","Тренировка продолжается.","Нет ответа.","Голосовая почта недоступна.","Руди: я перезвоню, когда освобожусь.","Сейчас не могу говорить.","Попробуйте после игры.","Связь прервана.","Абонент не поднял трубку."],"sms":["Просто хотел пожелать тебе хорошего дня. Вот и всё :)","Не забудь поесть. Энергетик не считается.","Кстати, ты можешь звонить просто так.","Спасибо, что поддерживаешь меня. Это правда приятно.","Поппи сказала, что я слишком много разговариваю. Представляешь? ПОППИ.","Сегодня забил отличный трёхочковый. Надо было видеть!","Надеюсь, у тебя всё хорошо.","Тренировка закончилась. Наконец-то.","Если день был тяжёлый, отдохни.","Я тут вспомнил наш разговор.","Слушай, ты сегодня улыбался?","Удачи тебе сегодня!","Не сиди до утра, ладно?","У меня сегодня хорошее настроение. Делюсь.","Хочу пиццу. Это важная новость.","Декс опять спорит со всеми.","Даррен объяснял что-то про физику мяча. Я почти понял.","Элис поставила крутой трек.","У нас скоро игра. Держи кулаки.","Надеюсь, ты не забыл про воду.","Как настроение?","Сегодня много дел, но я на связи.","Мне нравится, что мы общаемся.","Не воспринимай всё слишком серьёзно.","Увидел смешной мем. Вспомнил тебя.","Я наконец выспался!","После игры хочу просто лежать.","Если что-то не получается, попробуй ещё раз.","Хорошего вечера :)","Передаю привет из спортзала.","Просто хотел пожелать тебе хорошего дня. Вот и всё :) До связи!","Не забудь поесть. Энергетик не считается. Береги себя.","Кстати, ты можешь звонить просто так. Улыбнись :)","Спасибо, что поддерживаешь меня. Это правда приятно. Увидимся!","Поппи сказала, что я слишком много разговариваю. Представляешь? ПОППИ. Не пропадай.","Сегодня забил отличный трёхочковый. Надо было видеть! До связи!","Надеюсь, у тебя всё хорошо. Береги себя.","Тренировка закончилась. Наконец-то. Улыбнись :)","Если день был тяжёлый, отдохни. Увидимся!","Я тут вспомнил наш разговор. Не пропадай.","Слушай, ты сегодня улыбался? До связи!","Удачи тебе сегодня! Береги себя.","Не сиди до утра, ладно? Улыбнись :)","У меня сегодня хорошее настроение. Делюсь. Увидимся!","Хочу пиццу. Это важная новость. Не пропадай.","Декс опять спорит со всеми. До связи!","Даррен объяснял что-то про физику мяча. Я почти понял. Береги себя.","Элис поставила крутой трек. Улыбнись :)","У нас скоро игра. Держи кулаки. Увидимся!","Надеюсь, ты не забыл про воду. Не пропадай.","Как настроение? До связи!","Сегодня много дел, но я на связи. Береги себя.","Мне нравится, что мы общаемся. Улыбнись :)","Не воспринимай всё слишком серьёзно. Увидимся!","Увидел смешной мем. Вспомнил тебя. Не пропадай.","Я наконец выспался! До связи!","После игры хочу просто лежать. Береги себя.","Если что-то не получается, попробуй ещё раз. Улыбнись :)","Хорошего вечера :) Увидимся!","Передаю привет из спортзала. Не пропадай."]}
const gossipSms=[
 "Блять. Не туда.",
 "Мистер Говард снова требует установить мою личность. Передайте ему удачи.",
 "Если кто-то спросит, кто записал Говарда на батл, я ничего не знаю.",
 "Декс опять не согласовал текст. Будем удивляться вместе.",
 "Кто-нибудь видел Даррена? У нас вообще-то съёмки.",
 "Руди попросил выбрать его удачные фотографии. Прислал 47 одинаковых.",
 "Наш генеральный партнёр сегодня особенно генеральный и особенно недовольный.",
 "Эбигейл попросила удалить одну фотографию. Теперь мне хочется её опубликовать.",
 "Надин пока держится. Не знаю, как.",
 "Шериф Уилсон снова интересуется моей деятельностью. Приятно иметь постоянных читателей.",
 "Если вы нашли мой номер — нет, не нашли.",
 "Сегодня без сплетен. У меня выходной. Хотя подождите…",
 "Кто-нибудь объяснит Дексу, что котёнок не может официально подписывать договоры?",
 "Пенелопа обещала больше не брать интервью у Говарда. Посмотрим.",
 "Даррен прислал мне научную статью вместо текста для батла.",
 "У нас четыре рэпера и ни одного человека, способного прийти вовремя.",
 "Black Hole Energy уже не помогает.",
 "Иногда мне кажется, что единственный адекватный участник этого шоу — кот Декса.",
 "Не распространяйте непроверенные сплетни. Это вообще-то моя работа.",
 "Нет, WARLOCK не выкупил канал. Пока.",
 "Если вам позвонит шериф, мы с вами не знакомы.",
 "Сентфор — маленький город. Слишком маленький для такого количества идиотов.",
 "Кстати, кто вам вообще разрешил столько знать?",
 "Хорошего вечера. И поменьше звонков Говарду. Хотя нет, звоните.",
 "Поппи попросила не публиковать её переписку с участниками. Справедливо. Там половина слов под цензуру.",
 "Декс принёс на репетицию кота. Кот оказался пунктуальнее.",
 "У Говарда есть замечания к сценарию. У меня есть замечания к Говарду.",
 "Даррен сказал, что его шуба — инвестиция. Не спрашивайте.",
 "Руди пытается выяснить, кто придумал его рэперское имя. Не выдавайте меня.",
 "Сегодня выяснилось, что у нашего диджея больше терпения, чем у всех нас вместе взятых.",
 "Поппи требует отпуск. Мы ещё даже не закончили первый выпуск.",
 "Надин отказалась комментировать происходящее. Умное решение.",
 "Шериф интересуется, кто дал разрешение на мероприятие. Какое мероприятие?",
 "Проверила документы WARLOCK. Теперь у меня ещё больше вопросов.",
 "Декс опять исчез. Проверьте парковку.",
 "Даррен объяснял мне разницу между аргументом и утверждением. Я просто попросила его записать интервью.",
 "Эбигейл считает, что камера недостаточно часто показывает Руди.",
 "У Руди есть план на победу. По его словам, план — победить.",
 "Если Говард предложит вам подписать что-нибудь, хотя бы прочитайте мелкий шрифт.",
 "Я не отвечаю за то, что участники говорят в микрофон. Особенно Декс.",
 "Кот Декса сегодня отказался от интервью. Уважаю его принципы.",
 "Кто-то переставил кресла на площадке. Теперь мистер Говард хочет официальное объяснение.",
 "Даррен попросил не называть его ботаником. Принято. Доктор наук.",
 "Поппи сказала, что у неё всё под контролем. Через пять минут попросила помощи.",
 "Руди забыл текст. Зато вспомнил счёт последней игры.",
 "Эбигейл снова проверяет комментарии. Всем удачи.",
 "Если вам предложили энергетик из подозрительной банки — проверьте этикетку.",
 "Монтаж одного интервью занимает больше времени, чем само интервью. Спасибо, Декс.",
 "Я обещала себе не читать комментарии. Продержалась семь минут.",
 "Никто не знает, где сценарий. Сценарий у меня. Пока не спрашивайте.",
 "Надин сегодня снова оказалась главной темой чужих разговоров.",
 "В Сентфоре слухи распространяются быстрее, чем официальные опровержения.",
 "Шериф Уилсон, если вы это читаете, добрый вечер.",
 "Говард назвал происходящее цирком. Билеты на цирк уже практически готовы.",
 "Даррен выбирает между двумя парами очков. Съёмочная группа ждёт.",
 "Руди уверен, что публика будет на его стороне. Публика пока молчит.",
 "Декс попросил вырезать одну фразу. Какую именно, не сказал.",
 "Поппи не обязана знать, кто организовал этот бардак. Но обязана его вести.",
 "Кто-то выпил последний энергетик. Начинаем внутреннее расследование.",
 "Мой любимый жанр — официальное опровержение того, чего никто ещё не опубликовал.",
 "Слухи о моей личности снова оказались слухами. Какая неожиданность.",
 "Даррен принёс папку с материалами. На батл. Папку.",
 "Руди обещал быть через пять минут. Это было двадцать минут назад.",
 "Эбигейл попросила согласовать ракурс. Ракурс Руди, разумеется.",
 "Не спрашивайте Говарда, доволен ли он. Сэкономите время.",
 "Декс утверждает, что цепь — часть костюма. Костюма, который он носит каждый день.",
 "Поппи сегодня сказала в микрофон то, что мы все думали. Пришлось запикать.",
 "Элис заслуживает отдельной премии за работу в этих условиях.",
 "Иногда мне хочется просто выложить исходники. Потом вспоминаю про последствия.",
 "Сегодня в Сентфоре подозрительно тихо. Мне это не нравится.",
 "Говард потребовал список ответственных. Список начинается и заканчивается вопросительным знаком.",
 "Даррен попросил уточнить критерии голосования. Конечно, попросил.",
 "Руди назвал свою стратегию беспроигрышной. Запомнили.",
 "Декс предложил заменить интервью пятью минутами молчания. Соблазнительно.",
 "Поппи утверждает, что ей всё равно. У неё уже три страницы заметок.",
 "Эбигейл не понравился мой заголовок. Значит, заголовок удачный.",
 "Кот Декса получил больше комплиментов, чем некоторые участники.",
 "WARLOCK просит соблюдать деловой стиль. Мы стараемся. Не очень успешно.",
 "Шериф опять хочет поговорить. Я опять занята.",
 "Не всё, что происходит за кулисами, стоит показывать. Но как же хочется.",
 "Руди прислал голосовое на четыре минуты. Суть: всё нормально.",
 "Даррен исправил опечатку в афише. Заодно исправил мне пунктуацию.",
 "Декс назвал репетицию бессмысленной. Потом пришёл первым.",
 "Поппи попросила не ставить ей вопросы про Надин. Записала.",
 "Сегодня никто не поссорился. Пока что.",
 "Если кто-то видел мой сон, верните его.",
 "Мистер Говард, это не официальное заявление. Расслабьтесь. Хотя бы попробуйте.",
 "У меня на рабочем столе больше компромата, чем свободного места.",
 "Даррен спросил, можно ли добавить сноски к панчам.",
 "Руди попросил включить музыку погромче. Элис попросила его отойти от пульта.",
 "Декс обещает, что всё будет нормально. Вот теперь я переживаю.",
 "Эбигейл интересуется списком гостей. Список гостей интересуется Эбигейл.",
 "Поппи сегодня снова пришлось объяснять правила. Взрослым людям.",
 "Надин, если ты это читаешь, держись.",
 "Мне прислали очередную теорию о том, кто я. Фантазия у вас хорошая.",
 "У нас закончился кофе. Это не сплетня, это чрезвычайная ситуация.",
 "Пожалуйста, не звоните всем участникам одновременно. Хотя я бы посмотрела.",
 "Сентфор не спит. И мне, видимо, тоже не светит.",
 "Некоторые секреты лучше оставить секретами. Особенно мои."
]
const STORE='sf27-howard-phone-v2'
const SECRET_STORE='sf27-howard-second-number-v1'
const SECRET_NUMBER='27042007'
const DEX_NUMBER='66601313'
const POPPY_NUMBER='77701927'
const POPPY_STORE='sf27-poppy-contact-v1'
const POPPY_CALLS='sf27-poppy-calls-v1'
const DEX_STORE='sf27-dex-number-found-v1'
const DEX_CALL_STORE='sf27-dex-call-history-v1'
function readPoppyContact(){try{const found=JSON.parse(localStorage.getItem(POPPY_STORE)||'null');return found?.number===POPPY_NUMBER?found:null}catch{return null}}
function readPoppyCalls(){try{const v=JSON.parse(localStorage.getItem(POPPY_CALLS)||'{}');return {introDone:Boolean(v.introDone),used:Array.isArray(v.used)?v.used:[]}}catch{return {introDone:false,used:[]}}}
function hasDex(){try{return localStorage.getItem(DEX_STORE)===DEX_NUMBER}catch{return false}}
function readDexCalls(){try{const v=JSON.parse(localStorage.getItem(DEX_CALL_STORE)||'[]');return Array.isArray(v)?v.filter(i=>Number.isInteger(i)&&i>=0&&i<dexCallStories.length):[]}catch{return []}}
function nextDexStory(used){const remaining=dexCallStories.map((_,i)=>i).filter(i=>!used.includes(i));const pool=remaining.length?remaining:dexCallStories.map((_,i)=>i);const index=pool[Math.floor(Math.random()*pool.length)];const next=remaining.length?[...used,index]:[index];try{localStorage.setItem(DEX_CALL_STORE,JSON.stringify(next))}catch{}return {story:dexCallStories[index],count:next.length}}
const secretLines=["Натаниэль Говард, слушаю. Кто это?","Простите, откуда у вас этот номер?","Это частная линия. Представьтесь.","Если вы из прессы, обращайтесь в приёмную.","Вы звоните мне второй раз за минуту.","Нет, я не собираюсь обсуждать рэп-баттл.","Кто дал вам этот номер? Назовите имя.","Я не давал разрешения распространять мои контакты.","Это не телефон горячей линии WARLOCK.","У меня встреча. Говорите быстрее.","Вы молчите. Я тоже могу молчать.","Нет, автографы по телефону не выдаю.","Я уже объяснил: это личный номер.","Вы действительно считаете это забавным?","Я запомнил ваш голос. Точнее, ваше молчание.","Если это Поппи, передайте ей, что я занят.","У вас есть конкретный вопрос? Нет? Всего доброго.","Мне сейчас не до ваших развлечений.","Надеюсь, у вас есть веская причина звонить.","Секретарь не должен был пропускать этот вызов.","Вы настойчивы. Это не комплимент.","Вам не кажется, что мы уже разговаривали?","Я не обязан отвечать на каждый ваш звонок.","Никогда не думал, что буду скучать по спаму.","Это какая-то коллективная шутка?","Сколько раз вы собираетесь повторять это?","Вы нашли номер. Поздравляю. Что дальше?","Нет, мой график вам не сообщат.","Вопросы о компании задаются официально.","Я начинаю подозревать организаторов баттла.","Мне стоит сменить номер. Снова.","Это уже похоже на эксперимент по проверке терпения.","Вам никто не говорил, что такое личные границы?","Я отклонял этот вызов. Почему он проходит?","У меня на экране опять ваш номер. Прекрасно.","Не произносите имя Надин в этом разговоре.","Я не собираюсь читать вам свои панчи.","Если вы хотите интервью, запишитесь заранее.","Не называйте меня MC NETTI.","Нет. Я не надену ту одежду ещё раз.","Уточните, кто именно организовал этот цирк.","Я требую объяснений. Не смеха.","Вы хоть понимаете, сколько стоит моё время?","В следующий раз трубку возьмёт юрист.","Не проверяйте, действительно ли я это сделаю.","Я почти уверен, что заблокировал вас.","Почему телефон снова звонит?","Вы нашли какой-то обход блокировки?","Похоже, оператор связи тоже участвует в заговоре.","Я не обсуждаю служебные вопросы с незнакомцами.","Я перезвоню вам? Нет. Разумеется, нет.","В WARLOCK сейчас выясняют источник утечки.","Я слышу, как вы смеётесь. Очень зря.","Вы не первый, кто пытается вывести меня из себя.","Вы удивитесь, насколько длинным бывает рабочий день.","Положите трубку. Это было бы разумно.","Я больше не собираюсь повторяться.","Неужели у вас совсем нет других занятий?","Это последний раз, когда я отвечаю.","…Вы опять? Невероятно."]
function hasSecret(){try{return localStorage.getItem(SECRET_STORE)==='1'}catch{return false}}
const REMINDER_MIN=120000
const REMINDER_RANGE=120000
const reminderLines=['Номер сохранился в журнале. Может, перезвоним?','Номер всё ещё здесь. Говард, вероятно, надеялся, что вы его удалите.','Пропущенный вызов никуда не исчез. Перезвоним?']
const responses=[
 {text:'Абонент не отвечает.',status:'НЕТ ОТВЕТА'},
 {text:'Линия занята. Попробуйте позже.',status:'ЗАНЯТО'},
 {text:'Слушаю? ... Вы снова?',status:'ВЫЗОВ ЗАВЕРШЁН'},
 {text:'Я занят. Не звоните сюда больше.',status:'СОЕДИНЕНИЕ ПРЕРВАНО'},
 {text:'Это служебный номер. Прошу вас больше его не набирать.',status:'ВЫЗОВ ЗАВЕРШЁН'},
 {text:'У вас, очевидно, слишком много свободного времени.',status:'СОЕДИНЕНИЕ ПРЕРВАНО'},
 {text:'Вы ошиблись номером. Повторно.',status:'ВЫЗОВ ЗАВЕРШЁН'},
 {text:'Абонент временно недоступен.',status:'НЕТ ОТВЕТА'},
 {text:'Если это шутка, она затянулась.',status:'СОЕДИНЕНИЕ ПРЕРВАНО'},
 {text:'Откуда у вас вообще этот номер?',status:'ВЫЗОВ ЗАВЕРШЁН'},
]
function readState(){try{
 if(new URLSearchParams(window.location.search).get('resetHoward')==='1'){localStorage.removeItem(STORE);sessionStorage.removeItem('sf27-howard-seen');return {calls:0,introDone:false,blocked:false,limit:0,firstSeen:false,missed:false,reminders:0}}
const data=JSON.parse(localStorage.getItem(STORE)||'{}');return {calls:Math.max(0,Number(data.calls)||0),introDone:Boolean(data.introDone),blocked:Boolean(data.blocked),limit:Number(data.limit)||0,firstSeen:Boolean(data.firstSeen||data.introDone),missed:Boolean(data.missed),reminders:Math.max(0,Number(data.reminders)||0)}}catch{return {calls:0,introDone:false,blocked:false,limit:0}}}
function saveState(state){try{localStorage.setItem(STORE,JSON.stringify(state))}catch{/* storage disabled */}}
export default function HowardPhone({onBlocked,achievementUnlocked=false,suppressed=false}){
 const [secretFound,setSecretFound]=useState(hasSecret)
 const [dexFound,setDexFound]=useState(hasDex)
 const [poppyContact,setPoppyContact]=useState(readPoppyContact)
 const [poppyProgress,setPoppyProgress]=useState(readPoppyCalls)
 const [poppyLines,setPoppyLines]=useState([])
 const [poppySlide,setPoppySlide]=useState(0)
 const [poppyBusy,setPoppyBusy]=useState(false)
 const [dexUsed,setDexUsed]=useState(readDexCalls)
 const [dexStory,setDexStory]=useState(null)
 const [dial,setDial]=useState('')
 const lastHang=useRef(0)
 const [expandedContact,setExpandedContact]=useState(null)
 const [secretReply,setSecretReply]=useState('')
 const [secretCalls,setSecretCalls]=useState(()=>{try{return Math.max(0,Number(localStorage.getItem('sf27-howard-secret-calls'))||0)}catch{return 0}})
 const [visible,setVisible]=useState(()=>{try{const reset=new URLSearchParams(window.location.search).get('resetHoward')==='1';const state=readState();return reset||state.blocked}catch{return true}})
 const [opened,setOpened]=useState(()=>new URLSearchParams(window.location.search).get('resetHoward')==='1')
 const [progress,setProgress]=useState(readState)
 const [reply,setReply]=useState(null)
 const [mode,setMode]=useState('incoming')
 const [dismissed,setDismissed]=useState(false)
 const [nextReminder,setNextReminder]=useState(0)
 const dueAt=useRef(ambientElapsed()+ambientRandom(30000,90000))
 const suppressedRef=useRef(suppressed)
 suppressedRef.current=suppressed
 const isBlocked=progress.blocked||achievementUnlocked
 const poppyFound=Boolean(poppyContact)
 const [chain,setChain]=useState(()=>{try{const old=JSON.parse(localStorage.getItem('sf27-phone-chain-v1')||'null');if(old)return old}catch{}return {dex:dexUsed.length+(poppyContact?.source==='dex'?1:0),howard:secretCalls+(poppyContact?.source==='howard'?1:0),poppy:(poppyProgress.used?.length||0)+(poppyProgress.introDone?1:0),first:null,second:false,due:0,darren:0,rudy:0}})
 const chainRef=useRef(chain)
 const updateChain=fn=>{const next=fn(chainRef.current);chainRef.current=next;setChain(next);try{localStorage.setItem('sf27-phone-chain-v1',JSON.stringify(next))}catch{}}
 const countCall=name=>updateChain(v=>({...v,[name]:(v[name]||0)+1}))
 const newContacts={darren:'31415926',rudy:'23231927',abigail:'14021927'}
 const hasNewContact=name=>name==='abigail'?Boolean(chain.abigailOpen):chain.first===name||Boolean(chain.first&&chain.second)
 const [savedNumbers,setSavedNumbers]=useState(()=>{try{const a=JSON.parse(localStorage.getItem('sf27-phone-book-v1')||'[]');return Array.isArray(a)?a:[]}catch{return []}})
 const [bookIndex,setBookIndex]=useState(0)
 const discovered=[...(secretFound?[{number:SECRET_NUMBER,label:'HOWARD'}]:[]),...(dexFound?[{number:DEX_NUMBER,label:'LIL DEX'}]:[]),...(poppyFound?[{number:POPPY_NUMBER,label:'POPPY'}]:[]),...Object.keys(newContacts).filter(hasNewContact).map(name=>({number:newContacts[name],label:chain['known_'+name]||name==='abigail'?{darren:'DON DARO',rudy:'YUNG RUD',abigail:'ABIGAIL'}[name]:'НЕИЗВЕСТНЫЙ'}))]
 const phoneBook=[...discovered,...savedNumbers.filter(n=>!discovered.some(c=>c.number===n)).map(number=>({number,label:'НЕИЗВЕСТНЫЙ'}))]
 const saveDial=()=>{if(!/^\d{8}$/.test(dial))return;const next=[...new Set([...savedNumbers,dial])];setSavedNumbers(next);try{localStorage.setItem('sf27-phone-book-v1',JSON.stringify(next))}catch{}setDial('');setBookIndex(0);setMode('phone-book')}
 const selectBook=i=>{if(!phoneBook[i])return;setDial(phoneBook[i].number);setMode('secret-idle')}
 const [newContactName,setNewContactName]=useState('')
 const [newLine,setNewLine]=useState('')
 const [newSpeaker,setNewSpeaker]=useState('')
 const pickLine=(name)=>{const v=chainRef.current;const pool=newPhoneStories[name];const used=v['used_'+name]||[];const avail=pool.map((_,i)=>i).filter(i=>!used.includes(i));const i=(avail.length?avail:pool.map((_,j)=>j))[Math.floor(Math.random()*(avail.length||pool.length))];updateChain(x=>({...x,['used_'+name]:avail.length?[...used,i]:[i]}));return pool[i]}
 const sendPhoneSms=(id,sender,number,text)=>window.dispatchEvent(new CustomEvent('sf27-phone-sms',{detail:{id,sender,number,text}}))

 const [inbox,setInbox]=useState(()=>{try{return JSON.parse(localStorage.getItem('sf27-phone-inbox-v1')||'[]')}catch{return []}})
 const [menuIndex,setMenuIndex]=useState(0)
 const [smsIndex,setSmsIndex]=useState(0)
 const [smsPage,setSmsPage]=useState(0)
 const [probe,setProbe]=useState('')
 const probeCount=useRef(0)
 const [probeDone,setProbeDone]=useState(()=>{try{return localStorage.getItem('sf27-gossip-probe-done')==='1'}catch{return false}})
 const unread=inbox.filter(m=>!m.read).length
 const sms=inbox[smsIndex]
 const smsParts=sms?.text.match(/.{1,78}(?:\s|$)|\S+/gu)||[]
 const menuReady=isBlocked&&poppyFound
 const saveInbox=next=>{setInbox(next);try{localStorage.setItem('sf27-phone-inbox-v1',JSON.stringify(next))}catch{}}
 useEffect(()=>{
  const receive=e=>{const m=e.detail;if(!m?.id||!m?.text)return;setInbox(prev=>{if(prev.some(x=>x.id===m.id))return prev;const next=[{...m,read:false},...prev];try{localStorage.setItem('sf27-phone-inbox-v1',JSON.stringify(next))}catch{}return next})}
  window.addEventListener('sf27-phone-sms',receive);return()=>window.removeEventListener('sf27-phone-sms',receive)
 },[])
 useEffect(()=>{
  if(!menuReady||inbox.some(m=>m.id==='gossip-intro'))return
  const timer=setInterval(()=>{let due=0;try{due=Number(localStorage.getItem('sf27-phone-intro-due'))||0;if(!due){due=Date.now()+60000+Math.random()*60000;localStorage.setItem('sf27-phone-intro-due',String(due))}}catch{}if(Date.now()<due||document.hidden||opened||suppressed)return;window.dispatchEvent(new CustomEvent('sf27-phone-sms',{detail:{id:'gossip-intro',sender:'GOSSIP SAINTFOUR',number:'????????',text:'Материалы по Бруксу получила. Пока ничего не публикуем.'}}))},1000)
  return()=>clearInterval(timer)
 },[menuReady,inbox,opened,suppressed])
 useEffect(()=>{
  if(!menuReady||!inbox.some(m=>m.id==='gossip-intro'))return
  const tick=()=>{
   let due=0;try{due=Number(localStorage.getItem('sf27-gossip-next-due'))||0;if(!due){due=Date.now()+ambientRandom(240000,480000);localStorage.setItem('sf27-gossip-next-due',String(due))}}catch{return}
   if(Date.now()<due||document.hidden||opened||suppressed)return
   const regular=inbox.filter(m=>/^gossip-regular-/.test(m.id))
   const used=new Set(regular.map(m=>m.id.split('-').slice(-2).join('-')))
   const cycle=Math.floor(regular.length/gossipSms.length)
   const available=gossipSms.map((_,i)=>i).filter(i=>!used.has(cycle+'-'+i))
   if(!available.length)return
   const i=available[Math.floor(Math.random()*available.length)]
   try{localStorage.setItem('sf27-gossip-next-due',String(Date.now()+ambientRandom(240000,480000)))}catch{}
   window.dispatchEvent(new CustomEvent('sf27-phone-sms',{detail:{id:'gossip-regular-'+cycle+'-'+i,sender:'GOSSIP SAINTFOUR',number:'????????',text:gossipSms[i]}}))
  }
  const timer=setInterval(tick,1000);return()=>clearInterval(timer)
 },[menuReady,inbox,opened,suppressed])
 const inspectGossip=()=>{
  let n=probeCount.current;try{n=Number(localStorage.getItem('sf27-gossip-probe-count'))||0}catch{}
  n++;probeCount.current=n;try{localStorage.setItem('sf27-gossip-probe-count',String(n))}catch{}
  const fake=()=>String(ambientRandom(80000000,89999999))
  setProbe(n===1?'НОМЕР СКРЫТ':n===2?'ДАННЫЕ НЕДОСТУПНЫ':n===5?'ОШИБКА ИДЕНТИФИКАЦИИ':fake())
  if(n>=5&&!probeDone&&!inbox.some(m=>m.id==='gossip-probe-reply')){
   setProbeDone(true);try{localStorage.setItem('sf27-gossip-probe-done','1')}catch{}
   // Append while reading so that the selected message remains at the same index.
   saveInbox([...inbox,{id:'gossip-probe-reply',sender:'GOSSIP SAINTFOUR',number:'????????',text:'Вы сейчас серьёзно пытаетесь узнать мой номер? Уилсон, перелогиньтесь.',read:false}])
  }
 }
 useEffect(()=>{
  if(!menuReady)return
  const tick=()=>{
   const v=chainRef.current
   if(v.second)return
   if(!v.first&&v.poppy<5)return
   if(v.first&&(v[v.first]||0)<5)return
   if(!v.due){updateChain(x=>({...x,due:Date.now()+ambientRandom(60000,120000)}));return}
   if(Date.now()<v.due||document.hidden||opened||suppressed)return
   const name=v.first?(v.first==='darren'?'rudy':'darren'):(Math.random()<.5?'darren':'rudy')
   const id=v.first?'gossip-contact-second':'gossip-contact-first'
   if(!inbox.some(m=>m.id===id))window.dispatchEvent(new CustomEvent('sf27-phone-sms',{detail:{id,sender:'GOSSIP SAINTFOUR',number:'????????',text:(v.first?'Ну что, познакомились? Ладно, держите второй номер. Только не надо потом говорить, что это я организовала телефонный терроризм в Сентфоре.':'Кажется, вы ещё не разговаривали с Дарреном и Руди. Где-то у меня был номер одного из них. А, вот. Позвоните, узнайте, чей он. ;)')+' '+newContacts[name]}}))
   updateChain(x=>({...x,first:x.first||name,second:Boolean(x.first),due:0}))
  }
  const timer=setInterval(tick,1000);return()=>clearInterval(timer)
 },[menuReady,opened,suppressed,inbox])
 useEffect(()=>{
  if(!menuReady)return
  const tick=()=>{
   const v=chainRef.current;if(document.hidden||opened||suppressed)return
   if(v.warningDue&&Date.now()>=v.warningDue&&!v.abigailOpen){updateChain(x=>({...x,abigailOpen:true,warningDue:0}));sendPhoneSms('abi-warning','ABIGAIL',newContacts.abigail,'Я записала твой номер. Ещё раз позвонишь Руди — окажешься в чёрном списке. Надеюсь, понятно объяснила.');return}
   if(v.blockedUntil&&Date.now()>=v.blockedUntil){updateChain(x=>({...x,blockedUntil:0}));sendPhoneSms('rudy-unblock','RUDY BROOKS',newContacts.rudy,'Слушай, а почему твой номер оказался у меня в чёрном списке? Странно. Я тебя разблокировал, если что :)');sendPhoneSms('gossip-abi-enemy','GOSSIP SAINTFOUR','????????','Поздравляю. Кажется, у Эбигейл появился новый личный враг.');return}
   if(v.rudyDue&&Date.now()>=v.rudyDue){const text=pickLine('sms');const n=(v.rudySms||0)+1;updateChain(x=>({...x,rudySms:n,rudyDue:Date.now()+ambientRandom(420000,900000)}));sendPhoneSms('rudy-sms-'+n,'RUDY BROOKS',newContacts.rudy,text)}
  };const t=setInterval(tick,1000);return()=>clearInterval(t)
 },[menuReady,opened,suppressed])
 const readSms=i=>{setProbe('');setSmsIndex(i);setSmsPage(0);setMode('sms-read');saveInbox(inbox.map((m,j)=>j===i?{...m,read:true}:m))}
 const openInbox=()=>{setSmsIndex(0);setMode(inbox.length?'sms-list':'sms-empty')}
 const moveSelection=delta=>{if(mode==='phone-menu')setMenuIndex(v=>(v+delta+3)%3);if(mode==='phone-book'&&phoneBook.length)setBookIndex(v=>(v+delta+phoneBook.length)%phoneBook.length);if(mode==='sms-list'&&inbox.length)setSmsIndex(v=>(v+delta+inbox.length)%inbox.length)}
 const centre=()=>{if(mode==='sms-read'&&probe){setProbe('');return}if(mode==='poppy-answer'||mode==='poppy-unlock'){advancePoppy();return}if(mode==='sms-read'){if(smsPage<smsParts.length-1)setSmsPage(v=>v+1);else setMode('sms-list');return}if(mode==='sms-list'){if(inbox.length)readSms(smsIndex);return}if(mode==='phone-book'){selectBook(bookIndex);return}if(mode==='phone-menu'){if(menuIndex===0){setDial('');setMode('secret-idle')}else if(menuIndex===1){setBookIndex(0);setMode('phone-book')}else openInbox();return}if(menuReady)setMode('phone-menu')}

 // Resume the pre-block storyline on each visit, even if a previous call was dismissed.
 useEffect(()=>{if(!isBlocked&&!progress.firstSeen){const next={...progress,firstSeen:true};setProgress(next);saveState(next)}},[])
 useEffect(()=>{if((secretFound||dexFound||poppyFound)&&isBlocked){setVisible(true);setDismissed(false)}},[secretFound,dexFound,poppyFound,isBlocked])
 useEffect(()=>{const found=()=>{setDexFound(true);if(isBlocked)setVisible(true)};window.addEventListener('sf27-dex-number-found',found);return()=>window.removeEventListener('sf27-dex-number-found',found)},[isBlocked])
 useEffect(()=>{const found=()=>{setSecretFound(true);if(isBlocked){setVisible(true);setDismissed(false);setDial('')}};window.addEventListener('sf27-howard-number-found',found);return()=>window.removeEventListener('sf27-howard-number-found',found)},[isBlocked])
 useEffect(()=>{if(!opened||mode!=='secret-connecting')return;const timer=setTimeout(()=>setMode('secret-answer'),1800);return()=>clearTimeout(timer)},[opened,mode])
 useEffect(()=>{if(!opened||mode!=='dex-connecting'||!dexStory)return;const timer=setTimeout(()=>setMode('dex-answer'),dexStory.connectMs);return()=>clearTimeout(timer)},[opened,mode,dexStory])
 useEffect(()=>{
  // Random first arrival on every visit, even if the visitor previously dismissed it.
  // Retrying every two seconds avoids a missed notification when Telegram is backgrounded.
  if(isBlocked){releaseAmbient('phone');return}
  if(visible||opened)return
  dueAt.current=ambientElapsed()+(
   nextReminder===0?ambientRandom(30000,90000):ambientRandom(REMINDER_MIN,REMINDER_MIN+REMINDER_RANGE)
  )
  const timer=window.setInterval(()=>{
   if(ambientElapsed()<dueAt.current||suppressedRef.current)return
   if(!acquireAmbient('phone'))return
   setVisible(true)
   setDismissed(false)
   setProgress(prev=>{
    const next={...prev,firstSeen:true,reminders:nextReminder===0?prev.reminders:prev.reminders+1}
    saveState(next)
    return next
   })
  },2000)
  return()=>window.clearInterval(timer)
 },[isBlocked,visible,opened,nextReminder])
 useEffect(()=>()=>releaseAmbient('phone'),[])
 // An unanswered ringing phone should not silence the rest of the site forever.
 useEffect(()=>{
  if(isBlocked||!visible||opened)return undefined
  const timeout=window.setTimeout(()=>{
   releaseAmbient('phone')
   setVisible(false)
   setNextReminder(n=>n+1)
  },45000)
  return()=>window.clearTimeout(timeout)
 },[isBlocked,visible,opened])

 useEffect(()=>{
  if(!opened)return
  const key=e=>{if(e.key==='Escape'){setPoppyBusy(false);setOpened(false);setMode('incoming')}}
  document.addEventListener('keydown',key)
  return()=>document.removeEventListener('keydown',key)
 },[opened])
 const savePoppy=(source)=>{
  if(poppyContact)return
  const contact={number:POPPY_NUMBER,source}
  setPoppyContact(contact)
  try{localStorage.setItem(POPPY_STORE,JSON.stringify(contact))}catch{}
 }
 const revealPoppy=(source)=>{
  savePoppy(source)
  setPoppyLines(source==='howard'
   ?['У мисс Эмерсон, очевидно, слишком много времени.','Запишите: 77701927.','Передайте: я лично рекомендовал обратиться к ней.']
   :['Слышь, хочешь номер одной разговорчивой особы?','77701927. Поппи.','Спроси, кто записал Говарда на баттл. Хочу послушать, как она будет орать.'])
  setPoppySlide(0)
  setMode('poppy-unlock')
 }
 const advancePoppy=()=>{
  if(poppySlide<poppyLines.length-1){setPoppySlide(v=>v+1);return}
  if(mode==='poppy-unlock'){setMode('secret-idle');setDial('');return}
  setMode('secret-idle')
  setDial(POPPY_NUMBER)
 }
 const savePoppyProgress=(next)=>{
  setPoppyProgress(next)
  try{localStorage.setItem(POPPY_CALLS,JSON.stringify(next))}catch{}
 }
 const callPoppy=()=>{
  if(!poppyFound||poppyBusy)return
  countCall('poppy')
  setPoppyBusy(true)
  setMode('poppy-connecting')
 }
 useEffect(()=>{
  if(!opened||mode!=='poppy-connecting')return
  const timer=window.setTimeout(()=>{
   setPoppyBusy(false)
   if(Math.random()<.2){
    setPoppyLines([])
    setMode('poppy-no-answer')
    return
   }
   if(!poppyProgress.introDone){
    setPoppyLines(poppyContact?.source==='dex'
     ?['Поппи Эмерсон. Слушаю.','Кто записал Говарда на батл?!','Стойте. Декс дал вам мой номер?','Я его прибью. Передайте дословно.']
     :['Пенелопа Эмерсон. Слушаю.','Мистер Говард дал вам мой номер?','Он решил сделать меня своей секретаршей?','Прекрасно. У нас с ним будет разговор.'])
    savePoppyProgress({...poppyProgress,introDone:true})
   }else{
    const pool=poppyCallStories.map((_,i)=>i).filter(i=>!poppyProgress.used.includes(i))
    const candidates=pool.length?pool:poppyCallStories.map((_,i)=>i)
    const idx=candidates[Math.floor(Math.random()*candidates.length)]
    setPoppyLines(poppyCallStories[idx])
    savePoppyProgress({...poppyProgress,used:pool.length?[...poppyProgress.used,idx]:[idx]})
   }
   setPoppySlide(0)
   setMode('poppy-answer')
  },1800)
  return()=>window.clearTimeout(timer)
 },[opened,mode,poppyProgress,poppyContact])
 const markMissed=()=>{
  if(progress.firstSeen&&!progress.introDone&&!progress.missed){const next={...progress,missed:true};setProgress(next);saveState(next)}
 }
 const open=()=>{if(isBlocked&&(secretFound||dexFound||poppyFound)){setOpened(true);setMode(menuReady?'phone-menu':'secret-idle');return}if(isBlocked){setOpened(true);setMode('blocked');return}setOpened(true);setMode(progress.firstSeen&&progress.missed&&!progress.introDone?'idle':progress.introDone?'idle':'incoming')}
 const call=()=>{
  if(isBlocked){setMode('blocked');return}
  if(!progress.introDone){
   const next={...progress,introDone:true,firstSeen:true,missed:false,limit:30+Math.floor(Math.random()*16)}
   setProgress(next);saveState(next);setMode('mistake');return
  }
  const next={...progress,calls:progress.calls+1}
  if(next.calls>=next.limit)next.blocked=true
  setProgress(next);saveState(next)
  if(next.blocked){releaseAmbient('phone');setMode('final');onBlocked?.();return}
  const pool=next.calls<8?responses.slice(0,5):next.calls<22?responses:responses.slice(1)
  const chosen=pool[Math.floor(Math.random()*pool.length)]
  setReply(chosen);setMode('answer')
 }
 const callDex=()=>{countCall('dex');if(!poppyFound&&dexUsed.length>=14){revealPoppy('dex');return}const {story,count}=nextDexStory(dexUsed);setDexUsed(readDexCalls());setDexStory(story);setMode('dex-connecting');if(count===25){try{const a=JSON.parse(localStorage.getItem('sf27-achievements-v2')||'{}');localStorage.setItem('sf27-achievements-v2',JSON.stringify({...a,dexOnTheLine:true}));window.dispatchEvent(new Event('sf27-dex-achievement'))}catch{}}}
 const callNumber=()=>{if(mode==='secret-connecting'||mode==='dex-connecting'||mode==='poppy-connecting'||mode==='new-contact-connecting')return;if(dial===DEX_NUMBER&&dexFound){callDex();return}if(dial===SECRET_NUMBER&&secretFound){callSecret();return}if(dial===POPPY_NUMBER&&poppyFound){callPoppy();return}const name=Object.keys(newContacts).find(k=>newContacts[k]===dial&&hasNewContact(k));if(name){countCall(name);setNewContactName(name);setMode('new-contact-connecting');return}setMode('secret-wrong')}
 const callSecret=()=>{if(mode==='secret-connecting')return;if(dial!==SECRET_NUMBER){setMode('secret-wrong');return}countCall('howard');if(!poppyFound&&secretCalls>=24){revealPoppy('howard');return}const index=secretCalls%secretLines.length;setSecretReply(secretLines[index]);setSecretCalls(secretCalls+1);try{localStorage.setItem('sf27-howard-secret-calls',String(secretCalls+1))}catch{}setMode('secret-connecting')}
 const pressKey=k=>{if(!isBlocked||!(secretFound||dexFound||poppyFound))return;const digit=k.charAt(0);if(!/^[0-9]$/.test(digit))return;setDial(v=>(v+digit).slice(0,14));setMode('secret-idle')}
 useEffect(()=>{
  if(!opened||mode!=='new-contact-connecting')return
  const t=setTimeout(()=>{
   const name=newContactName,v=chainRef.current
   let speaker=name,line=''
   if(name==='rudy'){
    if(v.blockedUntil){speaker='blocked';line='ВАШ НОМЕР В ЧЁРНОМ СПИСКЕ'}
    else if(v.abigailOpen&&!v.blockedOnce){speaker='abigail';line='Я же предупреждала... Всё. Больше ты ему не позвонишь.';updateChain(x=>({...x,blockedOnce:true,blockedUntil:Date.now()+ambientRandom(180000,300000)}))}
    else {const roll=Math.random();if(roll<.2){speaker='abigail';const n=(v.abiAnswers||0)+1;updateChain(x=>({...x,abiAnswers:n,warningDue:n===3&&!x.abigailOpen?Date.now()+ambientRandom(30000,60000):x.warningDue}))}else if(roll<.35)speaker='voicemail'}
   }
   if(!line)line=pickLine(speaker)
   if(speaker===name){updateChain(x=>({...x,['known_'+name]:true,...(name==='rudy'&&!x.rudyDue?{rudyDue:Date.now()+ambientRandom(180000,300000)}:{})}))}
   setNewSpeaker(speaker);setNewLine(line);setMode('new-contact-answer')
  },1800);return()=>clearTimeout(t)
 },[opened,mode,newContactName])
 const hang=()=>{if(mode==='phone-book'){setMode('phone-menu');return}if(mode==='sms-read'){setProbe('');setMode('sms-list');return}if(['sms-list','sms-empty'].includes(mode)){setMode('phone-menu');return}if(mode==='phone-menu'){close();return}if(mode==='final'){close();return}const now=Date.now();const double=now-lastHang.current<500;lastHang.current=double?0:now;if(double&&isBlocked&&(secretFound||dexFound||poppyFound))setDial('');if(mode==='incoming')markMissed();if(mode==='poppy-connecting')setPoppyBusy(false);setMode(isBlocked&&(secretFound||dexFound||poppyFound)?(menuReady&&!double&&!['secret-idle','secret-wrong'].includes(mode)?'phone-menu':'secret-idle'):progress.blocked?'blocked':'idle')}
 const close=()=>{if(mode==='incoming')markMissed();if(mode==='poppy-connecting')setPoppyBusy(false);if(!isBlocked){releaseAmbient('phone');setVisible(false);setNextReminder(n=>n+1)}setOpened(false);setMode('incoming')}
 const dismiss=()=>{releaseAmbient('phone');markMissed();setDismissed(true);setVisible(false);setOpened(false);setMode('incoming');if(!isBlocked)setNextReminder(n=>n+1)}
 if(!visible&&!isBlocked)return null
 return <>
  {isBlocked&&!opened&&<button type="button" className="hp-pocket-launcher" onClick={open} aria-label="Достать Motorola"><Phone size={17}/><span>MOTOROLA</span>{unread>0&&<span className="hp-sms-alert" style={{color:'#ffb6f4',animation:'hp-blink 1.2s infinite'}}>✉ {unread}</span>}</button>}
  {!isBlocked&&!opened&&!suppressed&&<div className="hp-floating">
    <button type="button" className="hp-closed" onClick={open} aria-label="Открыть звонящую фиолетовую раскладушку">
     <span className="hp-closed-hinge"/><span className="hp-closed-logo">M</span><span className="hp-closed-display"><Phone size={20}/><small>{isBlocked&&secretFound?'DIAL':isBlocked?'BLOCKED':progress.introDone||progress.missed?'CALL LOG':'INCOMING'}</small></span><span className="hp-closed-led"/>
    </button>
    {(isBlocked&&secretFound||progress.missed||progress.introDone)&&<div className="hp-reminder">{isBlocked&&secretFound?'Может, попробуем позвонить по этому номеру?':progress.missed&&!progress.introDone?'1 ПРОПУЩЕННЫЙ ВЫЗОВ · ПЕРЕЗВОНИТЬ?':reminderLines[Math.max(0,progress.reminders-1)%reminderLines.length]}</div>}
    <button type="button" className="hp-dismiss" aria-label="Убрать телефон" onClick={dismiss}><X size={15}/></button>
   </div>}
  {opened&&<div className="hp-overlay" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)close()}}>
   <div className="hp-window" role="dialog" aria-modal="true" aria-label="Телефон Натаниэля Говарда">
    <button type="button" className="hp-exit" onClick={close} aria-label="Закрыть раскладушку"><X size={20}/></button>
    {!menuReady&&(secretFound||dexFound||poppyFound)&&isBlocked&&<aside className="hp-number-notes" aria-label="Сохранённые номера">
      {secretFound&&<button type="button" className={'hp-contact-tab '+(expandedContact==='howard'?'is-expanded':'')} onClick={()=>setExpandedContact(v=>v==='howard'?null:'howard')} aria-expanded={expandedContact==='howard'}>
       <span className="hp-tab-label">HOWARD</span>
       {expandedContact==='howard'&&<span className="hp-tab-details"><small>WARLOCK · PRIVATE</small><strong>27 04<br/>20 07</strong><span>Натаниэль Говард</span></span>}
      </button>}
      {dexFound&&<button type="button" className={'hp-contact-tab hp-contact-dex '+(expandedContact==='dex'?'is-expanded':'')} onClick={()=>setExpandedContact(v=>v==='dex'?null:'dex')} aria-expanded={expandedContact==='dex'}><span className="hp-tab-label">LIL DEX</span>{expandedContact==='dex'&&<span className="hp-tab-details"><small>PRIVATE / LEAKED</small><strong>66 60<br/>13 13</strong><span>Не звони, придурок.</span></span>}</button>}
      {poppyFound&&<button type="button" className={'hp-contact-tab hp-contact-poppy '+(expandedContact==='poppy'?'is-expanded':'')} onClick={()=>setExpandedContact(v=>v==='poppy'?null:'poppy')} aria-expanded={expandedContact==='poppy'}><span className="hp-tab-label">POPPY</span>{expandedContact==='poppy'&&<span className="hp-tab-details"><small>PRIVATE / SAVED</small><strong>77 70<br/>19 27</strong><span>Пенелопа Эмерсон</span></span>}</button>}
      {Object.keys(newContacts).filter(hasNewContact).map(name=><button type="button" key={name} className={'hp-contact-tab hp-contact-'+(chain['known_'+name]||name==='abigail'?name:'unknown')+' '+(expandedContact===name?'is-expanded':'')} onClick={()=>{setExpandedContact(v=>v===name?null:name);setDial(newContacts[name]);setMode('secret-idle')}}><span className="hp-tab-label">{chain['known_'+name]||name==='abigail'?{darren:'DON DARO',rudy:'YUNG RUD',abigail:'ABIGAIL'}[name]:'НЕИЗВЕСТНЫЙ'}</span>{expandedContact===name&&<span className="hp-tab-details"><strong>{newContacts[name].slice(0,4)}<br/>{newContacts[name].slice(4)}</strong></span>}</button>)}
     </aside>}
    <div className="hp-phone">
     <div className="hp-upper" style={{cursor:"default"}}>
      <span className="hp-earpiece"/>
      <div className="hp-screen">
       <div className="hp-status"><span>▂▄▆</span><span>SF · 27</span><span>▰▰▰</span></div>
       <div className="hp-screen-body" onClick={()=>{if(["poppy-answer","poppy-unlock","sms-read"].includes(mode))centre()}}>
        {mode==='new-contact-connecting'?<><span className="hp-screen-kicker">ИСХОДЯЩИЙ ВЫЗОВ</span><strong>{newContacts[newContactName]}</strong><small>СОЕДИНЕНИЕ…</small></>:mode==='new-contact-answer'?<><span className="hp-screen-kicker">{{darren:'DARREN BOWIE',rudy:'RUDY BROOKS',abigail:'ABIGAIL',voicemail:'АВТООТВЕТЧИК',blocked:'ВЫЗОВ ОТКЛОНЁН'}[newSpeaker]}</span><strong className="hp-poppy-story">{newLine}</strong><small>ВЫЗОВ ЗАВЕРШЁН</small></>:mode==='phone-menu'?<><span className="hp-screen-kicker">ГЛАВНОЕ МЕНЮ</span>{['☎ НАБОР НОМЕРА','▤ ТЕЛЕФОННАЯ КНИЖКА','✉ СООБЩЕНИЯ ('+unread+')'].map((label,i)=><button key={i} type="button" aria-current={menuIndex===i?'true':undefined} onClick={()=>{setMenuIndex(i);if(i===0){setDial('');setMode('secret-idle')}else if(i===1){setBookIndex(0);setMode('phone-book')}else openInbox()}} style={{width:'100%',padding:'7px 3px',border:'1px solid '+(menuIndex===i?'#e5a4fa':'#63416f'),borderRadius:5,background:menuIndex===i?'#713c85':'#281633',color:'#f5d5ff',font:'700 10px monospace',cursor:'pointer'}}>{label}</button>)}<small>ВЫБЕРИТЕ ПУНКТ · ▲ ▼ ●</small></>:mode==='phone-book'?<><span className="hp-screen-kicker">ТЕЛЕФОННАЯ КНИЖКА</span><div style={{width:'100%',minHeight:0,maxHeight:110,overflowY:'auto'}}>{phoneBook.map((c,i)=><button key={c.number} type="button" onClick={()=>selectBook(i)} aria-current={bookIndex===i?'true':undefined} style={{display:'block',width:'100%',marginBottom:3,padding:4,textAlign:'left',border:'1px solid '+(bookIndex===i?'#e5a4fa':'#63416f'),borderRadius:4,background:bookIndex===i?'#713c85':'#281633',color:'#f5d5ff',font:'700 9px monospace',cursor:'pointer'}}>{c.label}<span style={{display:'block',opacity:.8}}>{c.number}</span></button>)}</div><small>ВЫБЕРИТЕ КОНТАКТ · ●</small></>:mode==='sms-list'?<><span className="hp-screen-kicker">ВХОДЯЩИЕ · {inbox.length}</span><div style={{width:'100%',minHeight:0,maxHeight:100,overflowY:'auto'}}>{inbox.map((m,i)=><button key={m.id} type="button" onClick={()=>readSms(i)} aria-current={smsIndex===i?'true':undefined} style={{display:'block',width:'100%',marginBottom:3,padding:5,textAlign:'left',border:'1px solid '+(smsIndex===i?'#e5a4fa':'#63416f'),borderRadius:4,background:smsIndex===i?'#713c85':'#281633',color:'#f5d5ff',font:'700 9px monospace',overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis',cursor:'pointer'}}>{m.read?'✉':'●'} {m.sender} · {m.text}</button>)}</div><small>НАЖМИТЕ НА SMS ИЛИ ●</small></>:mode==='sms-empty'?<><strong>НЕТ СООБЩЕНИЙ</strong><small>КРАСНАЯ — НАЗАД</small></>:mode==='sms-read'?<><span className="hp-screen-kicker">SMS · {smsIndex+1}/{inbox.length}</span>{sms?.sender==='GOSSIP SAINTFOUR'?<button type="button" className="hp-sms-sender" onClick={e=>{e.stopPropagation();inspectGossip()}}>{sms.sender} · ????????</button>:<small>{sms?.sender} · {sms?.number}</small>}<strong className={probe?'hp-sms-probe':'hp-poppy-story'}>{probe||smsParts[smsPage]}</strong><small>● — {probe?'К СООБЩЕНИЮ':smsPage<smsParts.length-1?'ДАЛЕЕ':'К СПИСКУ'}</small></>:mode==='secret-idle'||mode==='secret-wrong'?<><span className="hp-screen-kicker">НАБОР НОМЕРА</span><strong className="hp-dial-display">{dial||'________'}</strong><small>{mode==='secret-wrong'?'НОМЕР НЕ НАЙДЕН':'НАБЕРИТЕ НОМЕР'}</small>{menuReady&&/^\d{8}$/.test(dial)&&<button type="button" className="hp-sms-sender" onClick={saveDial}>+ СОХРАНИТЬ НОМЕР</button>}</>:mode==='poppy-unlock'?<><span className="hp-screen-kicker">НОВЫЙ КОНТАКТ · POPPY</span><strong className="hp-poppy-story">{poppyLines[poppySlide]}</strong><small>77701927 СОХРАНЁН · {poppySlide+1}/{poppyLines.length} · КНОПКА ●</small></>:mode==='poppy-connecting'?<><span className="hp-screen-kicker">POPPY EMERSON</span><Phone className="hp-ring" size={23}/><strong className="hp-connecting">СОЕДИНЕНИЕ<span className="hp-dots"/></strong><small>{POPPY_NUMBER}</small></>:mode==='poppy-no-answer'?<><PhoneOff size={23}/><strong>АБОНЕНТ НЕ ОТВЕЧАЕТ</strong><small>ВЫЗОВ ЗАВЕРШЁН</small></>:mode==='poppy-answer'?<><span className="hp-screen-kicker">POPPY EMERSON · {poppySlide+1}/{poppyLines.length}</span><strong className="hp-poppy-story">{poppyLines[poppySlide]}</strong><small>{poppySlide===poppyLines.length-1?'КОНЕЦ РАЗГОВОРА · ●':'СЛЕДУЮЩАЯ РЕПЛИКА · ●'}</small></>:mode==='dex-connecting'?<><span className="hp-screen-kicker">LIL DEX / ИСХОДЯЩИЙ</span><strong>{DEX_NUMBER}</strong><strong className="hp-connecting">СОЕДИНЕНИЕ<span className="hp-dots"/></strong></>:mode==='dex-answer'?<><span className="hp-screen-kicker">LIL DEX · {dexStory?.duration}</span><strong className="hp-dex-story">{dexStory?.text}</strong><small>ВЫЗОВ ЗАВЕРШЁН</small></>:mode==='secret-connecting'?<><span className="hp-screen-kicker">ИСХОДЯЩИЙ ВЫЗОВ</span><strong>{SECRET_NUMBER}</strong><strong className="hp-connecting">СОЕДИНЕНИЕ<span className="hp-dots"/></strong></>:mode==='secret-answer'?<><span className="hp-screen-kicker">НАТАНИЭЛЬ ГОВАРД</span><strong>{secretReply}</strong><small>ВЫЗОВ ЗАВЕРШЁН</small></>:mode==='blocked'?<><LockKeyhole size={31}/><strong>КОНТАКТ<br/>ЗАБЛОКИРОВАН</strong><small>WARLOCK INDUSTRIES</small></>:
         mode==='final'?<><span className="hp-screen-kicker">НАТАНИЭЛЬ ГОВАРД</span><strong className="hp-angry">КТО ДАЛ ВАМ МОЙ НОМЕР?!</strong><small>ВАШ НОМЕР ЗАБЛОКИРОВАН</small></>:
         mode==='mistake'?<><span className="hp-screen-kicker">НАТАНИЭЛЬ ГОВАРД</span><strong>Прошу прощения. Кажется, я ошибся номером.</strong><small>ВЫЗОВ ЗАВЕРШЁН</small></>:
         mode==='answer'?<><span className="hp-screen-kicker">НАТАНИЭЛЬ ГОВАРД</span><strong>{reply?.text}</strong><small>{reply?.status}</small></>:
         mode==='idle'?<><PhoneOff size={27}/><strong>ВЫЗОВ ЗАВЕРШЁН</strong><small>НАБЕРИТЕ ЕЩЁ РАЗ</small></>:
         <><span className="hp-screen-kicker">ВХОДЯЩИЙ ВЫЗОВ</span><Phone className="hp-ring" size={29}/><strong>НЕИЗВЕСТНЫЙ<br/>НОМЕР</strong><small>ВХОДЯЩИЙ ВЫЗОВ</small></>}
       </div>
       <div className="hp-screen-bottom"><span>{mode==='incoming'?'ANSWER':'SAINTFOUR'}</span><span>{mode==='incoming'?'DECLINE':'27 / 27'}</span></div>
      </div>
      <span className="hp-upper-mark">SAINTFOUR TELECOM</span>
     </div>
     <div className="hp-joint"><span/></div>
     <div className="hp-lower">
      <div className="hp-actions">
       <button type="button" className="hp-answer" onClick={['phone-menu','phone-book'].includes(mode)?centre:isBlocked&&(secretFound||dexFound||poppyFound)?callNumber:call} aria-label={mode==='incoming'?'Ответить на звонок':'Позвонить ещё раз'} disabled={mode.startsWith('sms-')||mode==='blocked'||mode==='final'||mode==='secret-connecting'||mode==='dex-connecting'||mode==='poppy-connecting'||mode==='new-contact-connecting'||mode==='poppy-answer'||mode==='poppy-unlock'}><Phone size={20}/></button>
       <div className="hp-dpad" style={{flex:'none',gap:0}}><button type="button" aria-label="Вверх" onClick={()=>moveSelection(-1)} disabled={!['phone-menu','phone-book','sms-list'].includes(mode)} style={{width:36,height:17,border:0,background:'transparent',padding:0,fontSize:10}}>▲</button><button type="button" onClick={centre} disabled={!['poppy-answer','poppy-unlock','phone-menu','phone-book','sms-list','sms-read','secret-idle','secret-wrong'].includes(mode)||(!menuReady&&!['poppy-answer','poppy-unlock'].includes(mode))} aria-label="Выбрать или продолжить" style={{width:55,height:23,border:0,background:'transparent',padding:0,fontSize:12}}>◀ ● ▶</button><button type="button" aria-label="Вниз" onClick={()=>moveSelection(1)} disabled={!['phone-menu','phone-book','sms-list'].includes(mode)} style={{width:36,height:17,border:0,background:'transparent',padding:0,fontSize:10}}>▼</button></div>
       <button type="button" className="hp-hang" onClick={hang} aria-label="Завершить вызов; два нажатия — очистить номер"><PhoneOff size={19}/></button>
      </div>
      <div className="hp-keys">{['1','2 ABC','3 DEF','4 GHI','5 JKL','6 MNO','7 PQRS','8 TUV','9 WXYZ','*','0 +','#'].map(k=><button type="button" key={k} onClick={()=>{if(isBlocked&&(secretFound||dexFound||poppyFound)&&!['poppy-answer','poppy-unlock','poppy-connecting','secret-connecting','dex-connecting','new-contact-connecting','phone-book','sms-list','sms-read','sms-empty'].includes(mode))pressKey(k);else if(mode==='idle')setMode('incoming')}}>{<><span className="hp-key-digit">{k.charAt(0)}</span>{k.length>1&&<span className="hp-key-letters">{k.slice(1).trim()}</span>}</>}</button>)}</div>
      <span className="hp-bottom-mark">MOTOR / SF EDITION</span>
     </div>
    </div>
   </div>
  </div>}
 </>
}
