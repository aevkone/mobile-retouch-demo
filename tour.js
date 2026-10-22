// Виртуальная экскурсия по лендингу: для показа клиенту и новых посетителей демо.
// Запуск: кнопка «Экскурсия» (только в демо) или ссылка с ?tour=1. Клавиши: ← → Esc.

const TOUR_STEPS = [
  { sel: '.hero', title: 'Первый экран', text: 'За 5 секунд: кто, что и зачем. Хук «Тебе не нужно покупать Canon Mark» — со слов Дарьи. Справа место под её реальный кадр.' },
  { sel: '.pains', title: 'Узнаёшь себя?', text: 'Три боли аудитории со встречи — её же словами. Посетительница должна узнать себя и остаться.' },
  { sel: '#compare', title: '«До/после»', text: 'Самый сильный аргумент. Шторку можно двигать пальцем. Сюда встанет реальный кадр Дарьи.' },
  { sel: '#costs', title: 'Честно о расходах', text: 'Сколько стоят подписки приложений. Это был главный скрытый вопрос у тестовых пользователей. Суммы вносим в день запуска.' },
  { sel: '#program', title: 'Программа', text: 'Все 28 уроков по названиям и словарик терминов — объясняем простыми словами.' },
  { sel: '#check', title: 'Проверка без куратора', text: 'Курс автономный: к каждому заданию — эталон «до/после», чек-лист и урок «Частые ошибки». Время Дарьи не тратится.' },
  { sel: '.fit', title: 'Кому подойдёт', text: 'Честно отсекаем тех, кому курс не нужен, — меньше возвратов и разочарований.' },
  { sel: '#trial', title: 'Попробуй до покупки', text: 'Кнопка ведёт в Telegram-бот: гайд и мини-урок. Так холодная аудитория знакомится с Дарьей.' },
  { sel: '.first-flow', title: 'Отзывов пока нет', text: 'Не выдумываем отзывы. После первого потока здесь появятся «до/после» учениц — только с их согласия.' },
  { sel: '#price', title: 'Тарифы', text: 'Два тарифа без участия автора, рассрочка, подарок первым 10. Кнопки откроют оплату в GetCourse.' },
  { sel: '#faq', title: 'Вопросы', text: 'Телефон и Android, подписки, данные в FaceApp, рассрочка, возврат и контакт поддержки.' },
];

(function () {
  const isDemo = true; // убрать кнопку перед боевым запуском
  let i = 0, root, box, spot, lastFocus;

  function build() {
    root = document.createElement('div');
    root.className = 'tour';
    root.innerHTML = `
      <div class="tour__spot" aria-hidden="true"></div>
      <div class="tour__box" role="dialog" aria-modal="false" aria-labelledby="tour-title">
        <p class="tour__count" aria-live="polite"></p>
        <h3 id="tour-title" class="tour__title"></h3>
        <p class="tour__text"></p>
        <div class="tour__nav">
          <button type="button" class="tour__btn tour__btn--ghost" data-act="close">Закрыть</button>
          <span class="tour__spacer"></span>
          <button type="button" class="tour__btn tour__btn--ghost" data-act="prev">Назад</button>
          <button type="button" class="tour__btn" data-act="next">Дальше</button>
        </div>
      </div>`;
    document.body.appendChild(root);
    box = root.querySelector('.tour__box');
    spot = root.querySelector('.tour__spot');
    root.addEventListener('click', e => {
      const act = e.target.dataset.act;
      if (act === 'next') go(i + 1);
      if (act === 'prev') go(i - 1);
      if (act === 'close') stop();
    });
  }

  function place() {
    const el = document.querySelector(TOUR_STEPS[i].sel);
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pad = 8;
    const top = Math.max(r.top, 76) - pad;
    const h = Math.min(r.bottom, innerHeight) - Math.max(r.top, 76) + pad * 2;
    Object.assign(spot.style, { top: top + 'px', left: Math.max(r.left, 0) + pad + 'px', width: Math.min(r.width, innerWidth) - pad * 2 + 'px', height: Math.max(h, 60) + 'px' });
  }

  function go(n) {
    if (n < 0) return;
    if (n >= TOUR_STEPS.length) return stop();
    i = n;
    const s = TOUR_STEPS[i];
    const el = document.querySelector(s.sel);
    if (!el) return go(n + 1);
    el.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    root.querySelector('.tour__count').textContent = `Шаг ${i + 1} из ${TOUR_STEPS.length}`;
    root.querySelector('.tour__title').textContent = s.title;
    root.querySelector('.tour__text').textContent = s.text;
    root.querySelector('[data-act="prev"]').disabled = i === 0;
    root.querySelector('[data-act="next"]').textContent = i === TOUR_STEPS.length - 1 ? 'Готово' : 'Дальше';
    setTimeout(place, 450);
    root.querySelector('[data-act="next"]').focus({ preventScroll: true });
  }

  function onKey(e) {
    if (e.key === 'ArrowRight') go(i + 1);
    else if (e.key === 'ArrowLeft') go(i - 1);
    else if (e.key === 'Escape') stop();
  }

  function start() {
    lastFocus = document.activeElement;
    if (!root) build();
    root.hidden = false;
    document.documentElement.classList.add('is-touring');
    addEventListener('keydown', onKey);
    addEventListener('scroll', place, { passive: true });
    addEventListener('resize', place);
    go(0);
  }

  function stop() {
    if (!root) return;
    root.hidden = true;
    document.documentElement.classList.remove('is-touring');
    removeEventListener('keydown', onKey);
    removeEventListener('scroll', place);
    removeEventListener('resize', place);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }

  if (isDemo) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tour-launch';
    btn.textContent = 'Экскурсия по странице';
    btn.addEventListener('click', start);
    document.body.appendChild(btn);
  }
  if (new URLSearchParams(location.search).has('tour')) start();
  window.startTour = start;
})();
