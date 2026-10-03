// crea elementos en la diapositiva actual
function mete(e) {
  snap();
  e.id = uid();
  diap().els.push(e);
  SEL = e.id;
  todo();
}

const nuevoTxt = () =>
  mete({ t: 'txt', x: 140, y: 280, w: 700, txt: 'Nuevo texto', sz: 48, peso: 400, al: 'left', col: null });

const nuevaForma = f =>
  mete({ t: 'forma', forma: f, x: 480, y: 210, w: 320, h: f === 'elip' ? 320 : 200, fill: null });

// reduce la imagen para que quepa en el autoguardado
function nuevaImg(file) {
  const r = new FileReader();
  r.onload = () => {
    const im = new Image();
    im.onload = () => {
      const m = Math.min(1, 1200 / im.width), c = document.createElement('canvas');
      c.width = im.width * m;
      c.height = im.height * m;
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
      const w = Math.min(640, c.width), h = w * c.height / c.width;
      mete({ t: 'img', src: c.toDataURL('image/webp', .85), x: (W - w) / 2, y: (H - h) / 2, w, h });
    };
    im.src = r.result;
  };
  r.readAsDataURL(file);
}
