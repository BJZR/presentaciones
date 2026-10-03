// dibuja diapositivas: editor, miniatura y presentación
const ajusta = h => {
  h.style.setProperty('--k', h.clientWidth / W);
  h.querySelectorAll('.capa').forEach(c => c.style.setProperty('--k', c.clientWidth / W));
};
const observa = h => new ResizeObserver(() => ajusta(h)).observe(h);

function pinta(d, host, ed) {
  const t = TEMAS[d.tema];
  const st = document.createElement('div');
  st.className = 'stage';
  st.style.cssText = `--fg:${t.fg};--ac:${t.ac}`;
  if (ed) st.innerHTML = '<b class="gv"></b><b class="gh"></b>';
  d.els.forEach(e => st.append(nodo(e, ed)));
  host.style.background = t.bg;
  host.replaceChildren(st);
  ajusta(host);
  return st;
}

function nodo(e, ed) {
  const n = document.createElement('div');
  n.className = 'el ' + e.t;
  n.dataset.id = e.id;
  n.style.cssText = `left:${e.x}px;top:${e.y}px;width:${e.w}px;` + (e.t === 'txt' ? '' : `height:${e.h}px;`);
  if (e.t === 'txt') {
    n.textContent = e.txt;
    Object.assign(n.style, { fontSize: e.sz + 'px', fontWeight: e.peso, textAlign: e.al, color: e.col || 'var(--fg)' });
  } else if (e.t === 'img') {
    n.innerHTML = `<img src="${e.src}" alt="">`;
  } else {
    n.style.background = e.fill || 'var(--ac)';
    if (e.forma === 'elip') n.style.borderRadius = '50%';
  }
  if (ed && e.id === SEL) {
    n.classList.add('sel');
    n.insertAdjacentHTML('beforeend', '<i class="mj"></i>');
  }
  return n;
}

const lienzo = () => pinta(diap(), LZ, true);

// arrastrar, redimensionar y alinear al centro
function down(ev) {
  const act = document.activeElement;
  if (act && act.isContentEditable) act.blur();
  const n = ev.target.closest('.el');
  if (!n) { SEL = null; return todo(); }
  if (n.isContentEditable) return;
  const id = n.dataset.id, mj = ev.target.classList.contains('mj');
  if (SEL !== id) { SEL = id; lienzo(); props(); }
  const e = elSel(), nn = LZ.querySelector(`[data-id="${id}"]`), st = nn.parentNode;
  const k = LZ.clientWidth / W, x0 = ev.clientX, y0 = ev.clientY, o = { ...e };
  let mv = false;
  const mueve = m => {
    if (!mv) { snap(); mv = true; }
    const dx = (m.clientX - x0) / k, dy = (m.clientY - y0) / k;
    if (mj) {
      e.w = Math.max(40, Math.round(o.w + dx));
      if (e.t !== 'txt') e.h = Math.max(40, Math.round(o.h + dy));
    } else {
      e.x = Math.round(o.x + dx);
      e.y = Math.round(o.y + dy);
    }
    const cv = !mj && Math.abs(e.x + nn.offsetWidth / 2 - W / 2) < 8;
    const ch = !mj && Math.abs(e.y + nn.offsetHeight / 2 - H / 2) < 8;
    if (cv) e.x = Math.round(W / 2 - nn.offsetWidth / 2);
    if (ch) e.y = Math.round(H / 2 - nn.offsetHeight / 2);
    st.classList.toggle('cv', cv);
    st.classList.toggle('ch', ch);
    Object.assign(nn.style, { left: e.x + 'px', top: e.y + 'px', width: e.w + 'px' });
    if (e.t !== 'txt') nn.style.height = e.h + 'px';
  };
  const fin = () => {
    removeEventListener('pointermove', mueve);
    removeEventListener('pointerup', fin);
    if (mv) todo();
  };
  addEventListener('pointermove', mueve);
  addEventListener('pointerup', fin);
}

// editar texto con doble clic
function edita(ev) {
  const n = ev.target.closest('.el.txt');
  if (!n) return;
  n.querySelector('.mj')?.remove();
  try { n.contentEditable = 'plaintext-only'; } catch (x) { n.contentEditable = 'true'; }
  n.focus();
  n.onkeydown = k => k.key === 'Escape' && n.blur();
  n.onblur = () => {
    const e = diap().els.find(x => x.id === n.dataset.id), v = n.innerText.replace(/\n$/, '');
    if (e && v !== e.txt) { snap(); e.txt = v; }
    todo();
  };
}
