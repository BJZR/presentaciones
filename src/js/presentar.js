// modo presentación
const TRANS = {
  fade: () => [{ opacity: 0 }, { opacity: 1 }],
  slide: d => [{ transform: `translateX(${d * 100}%)` }, { transform: 'none' }],
  zoom: () => [{ opacity: 0, transform: 'scale(.92)' }, { opacity: 1, transform: 'none' }],
};
let PI = 0, T0 = 0, TM = 0;

// muestra la diapositiva i; dir = -1, 0 o 1
function va(i, dir) {
  PI = Math.max(0, Math.min(D.diaps.length - 1, i));
  const host = $('#pv'), c = document.createElement('div');
  c.className = 'capa';
  host.append(c);
  pinta(D.diaps[PI], c, false);
  const rapido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  c.animate((TRANS[D.trans] || TRANS.fade)(dir), { duration: rapido ? 0 : 380, easing: 'ease-out' })
    .onfinish = () => [...host.children].forEach(x => x !== c && x.remove());
  $('#cnt').textContent = `${PI + 1} / ${D.diaps.length}`;
  $('#barra').style.width = (PI + 1) / D.diaps.length * 100 + '%';
}

function reloj() {
  const s = Math.floor((Date.now() - T0) / 1000), p = n => String(n).padStart(2, '0');
  $('#reloj').textContent = p(Math.floor(s / 60)) + ':' + p(s % 60);
}

function presenta() {
  $('#pres').hidden = false;
  $('#pv').replaceChildren();
  T0 = Date.now();
  reloj();
  TM = setInterval(reloj, 1000);
  document.documentElement.requestFullscreen?.().catch(() => {});
  va(CUR, 0);
}

function sale() {
  if ($('#pres').hidden) return;
  $('#pres').hidden = true;
  clearInterval(TM);
  if (document.fullscreenElement) document.exitFullscreen();
  CUR = PI;
  SEL = null;
  todo();
}

function tecPres(ev) {
  const k = ev.key;
  if ([' ', 'ArrowRight', 'PageDown', 'Enter'].includes(k)) va(PI + 1, 1);
  else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(k)) va(PI - 1, -1);
  else if (k === 'Escape') sale();
  else return;
  ev.preventDefault();
}
