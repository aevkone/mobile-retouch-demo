// Лендинг «Мобильная ретушь»: слайдер до/после, липкая кнопка, заглушки оплаты.

// Ссылки на заказ в GetCourse — подставить после сборки предложений (05_platform/getcourse_setup.md).
const ORDER_LINKS = {
  base: '',     // например: https://<школа>.getcourse.ru/base
  presets: '',
};

// Слайдер до/после
const ba = document.getElementById('ba');
if (ba) {
  const range = ba.querySelector('.ba__range');
  const set = v => ba.style.setProperty('--pos', v + '%');
  range.addEventListener('input', () => set(range.value));
  set(range.value);
}

// Липкая кнопка на телефоне: появляется после первого экрана и прячется у тарифов
const sticky = document.querySelector('.sticky-cta');
const hero = document.querySelector('.hero');
const price = document.getElementById('price');
if (sticky && hero && price && 'IntersectionObserver' in window) {
  let heroVisible = true, priceVisible = false;
  const upd = () => sticky.classList.toggle('is-on', !heroVisible && !priceVisible);
  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; upd(); }).observe(hero);
  new IntersectionObserver(([e]) => { priceVisible = e.isIntersecting; upd(); }).observe(price);
}

// Кнопки покупки: пока ссылок нет — объясняем, что это демо
document.querySelectorAll('[data-offer]').forEach(btn => {
  const url = ORDER_LINKS[btn.dataset.offer];
  if (url) { btn.href = url; return; }
  btn.addEventListener('click', e => {
    e.preventDefault();
    alert('Демо-версия: здесь откроется оплата в GetCourse (карта, СБП, рассрочка).');
  });
});
