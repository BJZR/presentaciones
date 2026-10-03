// lista de miniaturas y operaciones sobre diapositivas
function minis() {
  const L = $('#minis');
  L.replaceChildren();
  D.diaps.forEach((d, i) => {
    const m = document.createElement('div');
    m.className = 'mini' + (i === CUR ? ' on' : '');
    m.draggable = true;
    m.innerHTML = `<span>${i + 1}</span><div class="th"></div>`;
    L.append(m);
    pinta(d, m.querySelector('.th'), false);
    m.onclick = () => { CUR = i; SEL = null; todo(); };
    m.ondragstart = e => e.dataTransfer.setData('text', i);
    m.ondragover = e => e.preventDefault();
    m.ondrop = e => muevDiap(+e.dataTransfer.getData('text'), i);
  });
}

function muevDiap(a, b) {
  if (a === b) return;
  snap();
  D.diaps.splice(b, 0, D.diaps.splice(a, 1)[0]);
  CUR = b;
  todo();
}

function nueva() {
  snap();
  D.diaps.splice(++CUR, 0, nuevaDiap(D.diaps[CUR - 1].tema));
  SEL = null;
  todo();
}

function duplica() {
  snap();
  const c = JSON.parse(JSON.stringify(diap()));
  c.id = uid();
  c.els.forEach(e => e.id = uid());
  D.diaps.splice(++CUR, 0, c);
  SEL = null;
  todo();
}

function borra() {
  if (D.diaps.length < 2) return;
  snap();
  D.diaps.splice(CUR, 1);
  CUR = Math.min(CUR, D.diaps.length - 1);
  SEL = null;
  todo();
}
