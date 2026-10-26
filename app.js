import * as THREE from './vendor/three.module.js';

const mount = document.querySelector('#scene');
const loading = document.querySelector('#loading');
const status = document.querySelector('#status');
const vrButton = document.querySelector('#vrButton');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x211f18);
scene.fog = new THREE.Fog(0x211f18, 7, 15);
const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
camera.position.set(0, 2.15, 7.7);
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'low-power' });
} catch (error) {
  status.textContent = `当前浏览器无法启用 3D 图形：${error.message || 'WebGL 不可用'}`;
  loading.classList.add('error');
  console.error('WebGL renderer could not be created', error);
  throw error;
}
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.25));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.18;
mount.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xe9d8b8, 0x43392a, 2.05));
const key = new THREE.DirectionalLight(0xffe6bd, 3.2); key.position.set(-3, 6, 4); scene.add(key);
const rim = new THREE.DirectionalLight(0xb3bfe0, 1.4); rim.position.set(4, 3, -4); scene.add(rim);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x29271f, roughness: .94 });
const ground = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), groundMat); ground.rotation.x = -Math.PI / 2; ground.position.y = -.03; scene.add(ground);
const pedestalMat = new THREE.MeshStandardMaterial({ color: 0x484134, roughness: .82, metalness: .05 });
const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(.83, .94, .18, 64), pedestalMat); pedestal.position.y = .08; scene.add(pedestal);
const ring = new THREE.Mesh(new THREE.TorusGeometry(.79, .012, 8, 64), new THREE.MeshStandardMaterial({ color: 0xb49a68, metalness: .35, roughness: .42 })); ring.rotation.x = Math.PI / 2; ring.position.y = .174; scene.add(ring);

const figure = new THREE.Group(); scene.add(figure);
const clay = new THREE.MeshStandardMaterial({ color: 0xa65d3d, roughness: .88 });
const lightClay = new THREE.MeshStandardMaterial({ color: 0xbb7651, roughness: .9 });
const darkClay = new THREE.MeshStandardMaterial({ color: 0x75442f, roughness: .95 });
const pigment = new THREE.MeshStandardMaterial({ color: 0x343b35, roughness: .9 });
function ellipsoid(parent, material, position, scale, segments = 20) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, segments, Math.max(12, segments - 4)), material);
  mesh.position.set(...position); mesh.scale.set(...scale); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
}
function capsuleBetween(parent, material, start, end, radius, endRadius = radius) {
  const a = new THREE.Vector3(...start), b = new THREE.Vector3(...end), direction = b.clone().sub(a);
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(endRadius, radius, direction.length(), 14, 2), material);
  mesh.position.copy(a.clone().add(b).multiplyScalar(.5)); mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize()); mesh.castShadow = true; parent.add(mesh);
  ellipsoid(parent, material, start, [radius, radius, radius], 14); ellipsoid(parent, material, end, [endRadius, endRadius, endRadius], 14); return mesh;
}
// Stylized teaching model: dimensions and costume are artistic choices, not a reconstruction of a specific artifact.
ellipsoid(figure, darkClay, [0, .38, 0], [.38, .22, .3]);
ellipsoid(figure, clay, [0, 1.02, 0], [.48, .66, .3]);
ellipsoid(figure, lightClay, [0, 1.4, .015], [.61, .39, .34]);
ellipsoid(figure, clay, [0, 1.74, .025], [.49, .27, .3]);
ellipsoid(figure, clay, [0, 2.12, .015], [.31, .38, .29]);
ellipsoid(figure, lightClay, [0, 2.37, .035], [.255, .29, .245]);
ellipsoid(figure, clay, [0, 2.66, .025], [.22, .095, .21]);
// Facial marks are intentionally abstract, avoiding a claim about a real excavated figure.
ellipsoid(figure, darkClay, [-.088, 2.41, .258], [.025, .018, .012], 12);
ellipsoid(figure, darkClay, [.088, 2.41, .258], [.025, .018, .012], 12);
const mouth = new THREE.Mesh(new THREE.TorusGeometry(.042, .009, 6, 18), darkClay); mouth.position.set(0, 2.31, .257); mouth.scale.y = .35; figure.add(mouth);
// A simple crossed-sleeve pose.
capsuleBetween(figure, clay, [-.43, 1.58, .02], [-.55, 1.2, .08], .145, .11);
capsuleBetween(figure, clay, [-.55, 1.2, .08], [-.32, .96, .25], .105, .09);
capsuleBetween(figure, clay, [.43, 1.58, .02], [.54, 1.24, .08], .145, .11);
capsuleBetween(figure, clay, [.54, 1.24, .08], [.3, 1.0, .25], .105, .09);
ellipsoid(figure, lightClay, [0, 1.62, .08], [.22, .14, .25]);
// Restrained decorative bands are graphic choices for the digital model.
for (const y of [1.12, 1.21, 1.76]) {
  const band = new THREE.Mesh(new THREE.TorusGeometry(y === 1.76 ? .42 : .43, .018, 6, 40), pigment);
  band.position.set(0, y, 0); band.rotation.x = Math.PI / 2; band.scale.set(1, .78, 1); figure.add(band);
}

// Image-inspired bronze mask model. This is a volumetric educational interpretation,
// not a scan or a claim about a specific museum object.
const maskFigure = new THREE.Group(); scene.add(maskFigure); maskFigure.visible = true; figure.visible = false;
const bronze = new THREE.MeshStandardMaterial({ color: 0x3e7068, roughness: .62, metalness: .48 });
const bronzeDark = new THREE.MeshStandardMaterial({ color: 0x183a38, roughness: .72, metalness: .35 });
const bronzePatina = new THREE.MeshStandardMaterial({ color: 0x7b9a79, roughness: .78, metalness: .25 });
function maskBox(material, pos, scale) { const m = new THREE.Mesh(new THREE.BoxGeometry(...scale), material); m.position.set(...pos); m.castShadow = true; maskFigure.add(m); return m; }
maskBox(bronze, [0, 1.55, 0], [1.28, 1.78, .34]); maskBox(bronze, [0, .63, 0], [1.66, .34, .44]);
maskBox(bronze, [-.67, 1.12, 0], [.32, 1.15, .42]); maskBox(bronze, [.67, 1.12, 0], [.32, 1.15, .42]);
maskBox(bronzePatina, [0, 2.56, 0], [.82, .42, .42]); maskBox(bronzeDark, [0, 2.82, 0], [.72, .22, .38]);
for (const x of [-.36, .36]) { const eye = new THREE.Mesh(new THREE.TorusGeometry(.19, .055, 10, 28), bronzeDark); eye.position.set(x, 1.82, .24); eye.scale.y = .82; maskFigure.add(eye); ellipsoid(maskFigure, bronzeDark, [x, 1.82, .25], [.07, .07, .035], 14); }
maskBox(bronzePatina, [0, 1.51, .24], [.16, .52, .16]);
const maskMouth = new THREE.Mesh(new THREE.TorusGeometry(.34, .065, 8, 32), bronzeDark); maskMouth.position.set(0, 1.08, .245); maskMouth.scale.y = .43; maskFigure.add(maskMouth);
for (let i = -3; i <= 3; i++) maskBox(bronzePatina, [i * .075, 1.08, .31], [.038, .22, .045]);
maskBox(bronzePatina, [-.98, .95, 0], [.22, .7, .38]); maskBox(bronzePatina, [.98, .95, 0], [.22, .7, .38]); maskFigure.position.y = -.18;

const initial = { yaw: .35, pitch: -.035, distance: 7.7 };
let yaw = initial.yaw, pitch = initial.pitch, distance = initial.distance;
function updateCamera() {
  const target = new THREE.Vector3(0, 1.42, 0);
  const spherical = new THREE.Spherical(distance, Math.PI / 2 + pitch, yaw);
  camera.position.copy(target).add(new THREE.Vector3().setFromSpherical(spherical)); camera.lookAt(target);
}
function resize() {
  const w = mount.clientWidth, h = mount.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(mount); resize(); updateCamera();
let lastFrame = 0;
renderer.setAnimationLoop((time) => { if (time - lastFrame < 33) return; lastFrame = time; renderer.render(scene, camera); });

let pointers = new Map(), lastX = 0, lastY = 0, pinchStart = 0, distanceStart = distance;
mount.addEventListener('pointerdown', event => {
  mount.setPointerCapture(event.pointerId); pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  if (pointers.size === 1) { lastX = event.clientX; lastY = event.clientY; }
  if (pointers.size === 2) { const [a, b] = [...pointers.values()]; pinchStart = Math.hypot(a.x - b.x, a.y - b.y); distanceStart = distance; }
});
mount.addEventListener('pointermove', event => {
  if (!pointers.has(event.pointerId)) return;
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  if (pointers.size === 1) { yaw += (event.clientX - lastX) * .009; pitch = THREE.MathUtils.clamp(pitch + (event.clientY - lastY) * .006, -.65, .55); lastX = event.clientX; lastY = event.clientY; updateCamera(); }
  else if (pointers.size >= 2) { const [a, b] = [...pointers.values()]; const span = Math.hypot(a.x - b.x, a.y - b.y); if (pinchStart) distance = THREE.MathUtils.clamp(distanceStart * pinchStart / span, 4.2, 11); updateCamera(); }
});
function endPointer(event) { pointers.delete(event.pointerId); if (pointers.size === 1) { const p = [...pointers.values()][0]; lastX = p.x; lastY = p.y; } }
mount.addEventListener('pointerup', endPointer); mount.addEventListener('pointercancel', endPointer);
mount.addEventListener('wheel', event => { event.preventDefault(); distance = THREE.MathUtils.clamp(distance + event.deltaY * .004, 4.2, 11); updateCamera(); }, { passive: false });
document.querySelector('#reset').addEventListener('click', () => { yaw = initial.yaw; pitch = initial.pitch; distance = initial.distance; updateCamera(); });
const objectLabel = document.querySelector('#objectLabel');
document.querySelectorAll('.model-choice').forEach(button => button.addEventListener('click', () => {
  const mask = button.dataset.model === 'mask'; maskFigure.visible = mask; figure.visible = !mask;
  document.querySelectorAll('.model-choice').forEach(b => b.classList.toggle('active', b === button));
  objectLabel.textContent = mask ? '青铜面具 · 图片启发的演示造型' : '壁画人物 · 图片启发的演示造型';
  yaw = initial.yaw; pitch = initial.pitch; distance = initial.distance; updateCamera();
}));

async function setupVR() {
  if (!navigator.xr || !renderer.xr) return;
  try {
    const supported = await navigator.xr.isSessionSupported('immersive-vr');
    if (!supported) return;
    renderer.xr.enabled = true;
    vrButton.hidden = false;
    vrButton.addEventListener('click', async () => {
      try { const session = await navigator.xr.requestSession('immersive-vr', { optionalFeatures: ['local-floor'] }); renderer.xr.setSession(session); }
      catch (error) { status.textContent = `VR 无法启动：${error.message || '请检查设备与浏览器权限'}`; loading.classList.remove('done'); setTimeout(() => loading.classList.add('done'), 2800); }
    });
  } catch { /* WebXR availability varies by browser, device and secure context. */ }
}
status.textContent = '展厅已就绪';
requestAnimationFrame(() => loading.classList.add('done'));
// The VR capability check must not block the normal 3D gallery from appearing.
setupVR().catch(error => console.warn('WebXR is unavailable; standard 3D remains active.', error));


