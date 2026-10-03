// panel de propiedades y acciones sobre el elemento
const OBJ = o => ({ e: elSel(), s: diap(), d: D })[o];
const TRANS_NOM = [['fade', 'Fundido'], ['slide', 'Deslizar'], ['zoom', 'Zoom']];
const AL_NOM = { left: 'Izq', center: 'Centro', right: 'Der' };
const btn = (o, k, v, t, on) =>
  `<button data-o="${o}" data-k="${k}" data-v="${v}"${on ? ' class="on"' : ''}>${t}</button>`;

function props() {
  const e = elSel();
  $('#props').innerHTML = e ? panelEl(e) : panelDiap();
}

function panelDiap() {
  const sw = Object.keys(TEMAS).map(k =>
    `<button class="sw${diap().tema === k ? ' on' : ''}" data-o="s" data-k="tema" data-v="${k}" title="${k}"
      style="--bg:${TEMAS[k].bg};--ac:${TEMAS[k].ac}"></button>`).join('');
  const op = TRANS_NOM.map(([v, n]) => `<option value="${v}"${D.trans === v ? ' selected' : ''}>${n}</option>`).join('');
  return `<h3>Tema</h3><div class="fila">${sw}</div>
    <h3>Transición</h3><select data-o="d" data-k="trans">${op}</select>`;
}

function panelEl(e) {
  const tema = TEMAS[diap().tema];
  const color = (k, n, v) => `<label>${n}<input type="color" data-o="e" data-k="${k}" value="${v}"></label>`;
  let h = `<h3>${{ txt: 'Texto', img: 'Imagen', forma: 'Forma' }[e.t]}</h3>`;
  if (e.t === 'txt') {
    h += `<label>Tamaño<input type="range" data-o="e" data-k="sz" min="16" max="200" value="${e.sz}"></label>
      <div class="fila">${btn('e', 'peso', 400, 'Normal', e.peso == 400)}${btn('e', 'peso', 700, 'Negrita', e.peso == 700)}</div>
      <div class="fila" style="margin-top:6px">${Object.keys(AL_NOM).map(a => btn('e', 'al', a, AL_NOM[a], e.al === a)).join('')}</div>`
      + color('col', 'Color', e.col || tema.fg);
  }
  if (e.t === 'forma') h += color('fill', 'Relleno', e.fill || tema.ac);
  const acc = [['frente', 'Al frente'], ['fondo', 'Al fondo'], ['dup', 'Duplicar'], ['del', 'Borrar']];
  return h + '<h3>Orden</h3><div class="fila">' + acc.map(([a, t]) => `<button data-a="${a}">${t}</button>`).join('') + '</div>';
}

// cambios con deslizador y color: una sola copia por interacción
let TX = false;
function entrada(ev) {
  const t = ev.target, o = OBJ(t.dataset.o);
  if (!o || !t.dataset.k) return;
  if (!TX) { snap(); TX = true; }
  o[t.dataset.k] = t.type === 'range' ? +t.value : t.value;
  lienzo();
}
const cambio = () => { TX = false; todo(); };

function clic(ev) {
  const b = ev.target.closest('button');
  if (!b) return;
  const d = b.dataset;
  if (d.a) return ACC[d.a]();
  snap();
  OBJ(d.o)[d.k] = isNaN(d.v) ? d.v : +d.v;
  todo();
}

// reordena capas
function capa(fn) {
  const e = elSel();
  if (!e) return;
  snap();
  const a = diap().els;
  a.splice(a.indexOf(e), 1);
  fn(a, e);
  todo();
}

const ACC = {
  frente: () => capa((a, e) => a.push(e)),
  fondo: () => capa((a, e) => a.unshift(e)),
  dup() {
    const e = elSel();
    if (!e) return;
    snap();
    const c = { ...e, id: uid(), x: e.x + 30, y: e.y + 30 };
    diap().els.push(c);
    SEL = c.id;
    todo();
  },
  del() {
    if (!elSel()) return;
    snap();
    diap().els = diap().els.filter(e => e.id !== SEL);
    SEL = null;
    todo();
  },
};
