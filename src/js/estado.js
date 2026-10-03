// estado global, temas y deshacer
const W = 1280, H = 720, KEY = 'presentador';
const TEMAS = {
  tinta:  { bg: '#fbfbf9', fg: '#1b2430', ac: '#2f4bff' },
  noche:  { bg: '#0e1a3a', fg: '#eef1fb', ac: '#ffb000' },
  salvia: { bg: '#cfdccb', fg: '#16301f', ac: '#c2410c' },
};
let D, LZ, CUR = 0, SEL = null, HIST = [], FUT = [];

const $ = s => document.querySelector(s);
const uid = () => Math.random().toString(36).slice(2, 8);
const diap = () => D.diaps[CUR];
const elSel = () => diap().els.find(e => e.id === SEL);
const nuevaDiap = tema => ({ id: uid(), tema: tema || 'tinta', els: [] });

const txt = (t, y, sz, peso) =>
  ({ id: uid(), t: 'txt', x: 100, y, w: 1080, txt: t, sz, peso, al: 'left', col: null });

// documento inicial
function inicio() {
  const d = nuevaDiap();
  d.els.push(
    { id: uid(), t: 'forma', forma: 'rect', x: 100, y: 200, w: 120, h: 12, fill: null },
    txt('Título de la presentación', 240, 88, 700),
    txt('Doble clic para editar', 380, 40, 400));
  return { titulo: 'Sin título', trans: 'fade', diaps: [d] };
}

// guarda copia antes de un cambio
function snap() {
  HIST.push(JSON.stringify(D));
  if (HIST.length > 60) HIST.shift();
  FUT = [];
}

function restaura(de, a) {
  if (!de.length) return;
  a.push(JSON.stringify(D));
  D = JSON.parse(de.pop());
  CUR = Math.min(CUR, D.diaps.length - 1);
  SEL = null;
  todo();
}
const deshacer = () => restaura(HIST, FUT);
const rehacer = () => restaura(FUT, HIST);

// autoguardado local
function guarda() { try { localStorage.setItem(KEY, JSON.stringify(D)); } catch (e) {} }
function carga() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } }
