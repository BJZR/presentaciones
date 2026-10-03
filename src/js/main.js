// arranque, comandos y atajos
function todo() {
  lienzo();
  minis();
  props();
  $('#tit').value = D.titulo;
  guarda();
}

const CMD = {
  nuevoTxt, deshacer, rehacer, presenta, guardaArchivo, nueva, duplica, borra,
  rect: () => nuevaForma('rect'),
  elip: () => nuevaForma('elip'),
  img: () => $('#fimg').click(),
  abrir: () => $('#fabr').click(),
};

function atajos(ev) {
  if (!$('#pres').hidden) return tecPres(ev);
  const t = ev.target, c = ev.ctrlKey || ev.metaKey, k = ev.key.toLowerCase();
  if (t.isContentEditable || /INPUT|SELECT/.test(t.tagName)) return;
  if (c && k === 'z') ev.shiftKey ? rehacer() : deshacer();
  else if (c && k === 'y') rehacer();
  else if (c && k === 'd') ACC.dup();
  else if (k === 'delete' || k === 'backspace') ACC.del();
  else if (k === 'f5') presenta();
  else return;
  ev.preventDefault();
}

D = carga() || inicio();
LZ = $('#lz');
observa(LZ);
observa($('#pv'));
LZ.onpointerdown = down;
LZ.ondblclick = edita;
$('#props').oninput = entrada;
$('#props').onchange = cambio;
$('#props').onclick = clic;
$('#tit').oninput = e => { D.titulo = e.target.value; guarda(); };
$('#pres').onclick = () => va(PI + 1, 1);
$('#fimg').onchange = e => { e.target.files[0] && nuevaImg(e.target.files[0]); e.target.value = ''; };
$('#fabr').onchange = e => { e.target.files[0] && abreArchivo(e.target.files[0]); e.target.value = ''; };
document.addEventListener('click', e => { const c = e.target.closest('[data-c]'); if (c) CMD[c.dataset.c](); });
document.addEventListener('keydown', atajos);
document.addEventListener('fullscreenchange', () => document.fullscreenElement || sale());
todo();
