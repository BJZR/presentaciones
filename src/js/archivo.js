// guardar y abrir presentaciones .json
function guardaArchivo() {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(D)], { type: 'application/json' }));
  a.download = (D.titulo || 'presentacion') + '.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

function abreArchivo(f) {
  f.text().then(t => {
    try {
      const n = JSON.parse(t);
      if (!Array.isArray(n.diaps) || !n.diaps.length) throw 0;
      snap();
      D = n;
      CUR = 0;
      SEL = null;
      todo();
    } catch (e) { alert('Archivo no válido'); }
  });
}
