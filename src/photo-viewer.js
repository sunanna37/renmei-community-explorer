const dialog = document.querySelector('#lightbox');
const viewport = document.querySelector('#photo-viewport');
const surface = document.querySelector('#photo-surface');
const image = surface.querySelector('img');
const magnifier = document.querySelector('#photo-magnifier');
const loupe = document.querySelector('#photo-loupe');
const minus = document.querySelector('#photo-minus');
const plus = document.querySelector('#photo-plus');
let scale = 1;
let baseWidth = 0;
let baseHeight = 0;
let drag;

function zoom(next) {
  const x = (viewport.scrollLeft + viewport.clientWidth / 2) / (surface.offsetWidth || 1);
  const y = (viewport.scrollTop + viewport.clientHeight / 2) / (surface.offsetHeight || 1);
  scale = Math.max(1, Math.min(4, next));
  surface.style.width = baseWidth * scale + 'px';
  surface.style.height = baseHeight * scale + 'px';
  viewport.scrollLeft = x * surface.offsetWidth - viewport.clientWidth / 2;
  viewport.scrollTop = y * surface.offsetHeight - viewport.clientHeight / 2;
  document.querySelector('#zoom-level').textContent = Math.round(scale * 100) + '%';
  minus.disabled = scale === 1;
  plus.disabled = scale === 4;
  magnifier.hidden = true;
}

function fit() {
  if (!dialog.open || !image.naturalWidth) return;
  const ratio = Math.min(viewport.clientWidth / image.naturalWidth, viewport.clientHeight / image.naturalHeight, 1);
  baseWidth = image.naturalWidth * ratio;
  baseHeight = image.naturalHeight * ratio;
  zoom(scale);
}

minus.onclick = () => zoom(scale - .5);
plus.onclick = () => zoom(scale + .5);
document.querySelector('#photo-reset').onclick = () => zoom(1);
loupe.onclick = () => {
  const enabled = loupe.getAttribute('aria-pressed') !== 'true';
  loupe.setAttribute('aria-pressed', String(enabled));
  viewport.classList.toggle('loupe-active', enabled);
  magnifier.hidden = true;
};
image.onload = fit;
window.addEventListener('resize', fit);

function inspect(event) {
  const rect = image.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
    magnifier.hidden = true;
    return;
  }
  magnifier.style.left = x + 'px';
  magnifier.style.top = y + 'px';
  magnifier.style.backgroundImage = `url("${image.currentSrc}")`;
  magnifier.style.backgroundSize = `${rect.width * 2}px ${rect.height * 2}px`;
  magnifier.style.backgroundPosition = `${57 - x * 2}px ${57 - y * 2}px`;
  magnifier.hidden = false;
}

surface.addEventListener('pointerdown', event => {
  if (loupe.getAttribute('aria-pressed') === 'true') {
    inspect(event);
  } else if (event.pointerType === 'mouse' && event.button === 0 && scale > 1) {
    drag = {x: event.clientX, y: event.clientY, left: viewport.scrollLeft, top: viewport.scrollTop};
    surface.setPointerCapture(event.pointerId);
  }
});
surface.addEventListener('pointermove', event => {
  if (loupe.getAttribute('aria-pressed') === 'true') inspect(event);
  else if (drag) {
    viewport.scrollLeft = drag.left + drag.x - event.clientX;
    viewport.scrollTop = drag.top + drag.y - event.clientY;
  }
});
for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
  surface.addEventListener(type, () => { drag = undefined; });
}
surface.addEventListener('pointerleave', () => { magnifier.hidden = true; });

export function openPhoto(photo) {
  scale = 1;
  baseWidth = baseHeight = 0;
  drag = undefined;
  loupe.setAttribute('aria-pressed', 'false');
  viewport.classList.remove('loupe-active');
  magnifier.hidden = true;
  image.alt = photo.caption;
  document.querySelector('#photo-attribution').textContent = [photo.caption, photo.credit, photo.license].filter(Boolean).join('・');
  image.src = photo.src;
  dialog.showModal();
  zoom(1);
  if (image.complete) fit();
}
