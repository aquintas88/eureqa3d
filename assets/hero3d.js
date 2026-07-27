'use strict';
/* ─────────────────────────────────────────────────────────────
   hero3d.js — Escena WebGL del hero (Three.js r128).
   Nube de partículas sobre una esfera orgánica + estructura
   wireframe: evoca datos de escáner reconstruyéndose en un
   modelo 3D. Gira sola, "respira" y sigue el ratón.
   Progresivo: si no hay WebGL o el usuario pide reduced-motion,
   no arranca y se ve el vídeo de fondo (fallback en CSS).
   ───────────────────────────────────────────────────────────── */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.getElementById('hero3d');
  const THREE = window.THREE;
  if (!canvas || reduce || !THREE) return;

  const stage = canvas.closest('.hero') || canvas.parentElement;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (e) { return; } // sin WebGL → fallback al vídeo
  if (!renderer || !renderer.getContext()) return;

  let W = stage.clientWidth, H = stage.clientHeight;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(W, H, false);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 100);
  camera.position.z = 5.2;

  const group = new THREE.Group();
  group.position.x = 1.15;            // desplaza la escultura a la derecha (junto al panel)
  scene.add(group);

  /* — Nube de puntos sobre esfera con ruido (distribución fibonacci) — */
  const COUNT = 4200;
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const R = 2.05;
  const teal = new THREE.Color(0x63c4e8);
  const orange = new THREE.Color(0xe89a3c);
  const golden = Math.PI * (1 + Math.sqrt(5));
  for (let i = 0; i < COUNT; i++) {
    const t = i / COUNT;
    const phi = Math.acos(1 - 2 * t);
    const theta = golden * i;
    const sinPhi = Math.sin(phi);
    const x = sinPhi * Math.cos(theta);
    const y = sinPhi * Math.sin(theta);
    const z = Math.cos(phi);
    const n = 1 + 0.14 * Math.sin(5 * phi) * Math.cos(6 * theta); // relieve orgánico
    positions[i * 3]     = x * R * n;
    positions[i * 3 + 1] = y * R * n;
    positions[i * 3 + 2] = z * R * n;
    const c = Math.random() < 0.1 ? orange : teal; // ~10% acentos naranja
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.055, map: makeDot(), vertexColors: true,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    sizeAttenuation: true, opacity: 0.95,
  });
  group.add(new THREE.Points(geo, mat));

  /* — Estructura wireframe interior (geodésica) — */
  const wire = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.55, 1)),
    new THREE.LineBasicMaterial({ color: 0x3990b0, transparent: true, opacity: 0.22 })
  );
  group.add(wire);

  /* — Textura de punto suave (glow circular) — */
  function makeDot() {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.35, 'rgba(255,255,255,0.75)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }

  /* — Parallax de ratón — */
  let tmx = 0, tmy = 0, mx = 0, my = 0;
  stage.addEventListener('pointermove', (e) => {
    const r = stage.getBoundingClientRect();
    tmx = (e.clientX - r.left) / r.width - 0.5;
    tmy = (e.clientY - r.top) / r.height - 0.5;
  });

  /* — Bucle de render — */
  const clock = new THREE.Clock();
  let raf;
  function tick() {
    const t = clock.getElapsedTime();
    mx += (tmx - mx) * 0.05; my += (tmy - my) * 0.05;
    group.rotation.y = t * 0.11 + mx * 0.7;
    group.rotation.x = my * 0.45 + Math.sin(t * 0.2) * 0.06;
    group.scale.setScalar(1 + Math.sin(t * 0.7) * 0.02); // respiración
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }

  function resize() {
    W = stage.clientWidth; H = stage.clientHeight;
    camera.aspect = W / H; camera.updateProjectionMatrix();
    renderer.setSize(W, H, false);
  }
  window.addEventListener('resize', resize);

  // Todo listo → activa la escena y oculta el vídeo de fallback
  stage.classList.add('has-webgl');
  const vid = stage.querySelector('.hero-video');
  if (vid) { try { vid.pause(); } catch (e) {} }
  raf = requestAnimationFrame(tick);
})();
