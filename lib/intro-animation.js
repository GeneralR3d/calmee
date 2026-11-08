// The original Calme intro, with scoped listeners, observers, frames and WebGL cleanup.
export function mountIntro() {
  let cancelled = false;
  const disposers = [];
  const frames = new Set();
  function schedule(callback) {
    if (cancelled) return;
    const id = window.requestAnimationFrame((time) => { frames.delete(id); if (!cancelled) callback(time); });
    frames.add(id);
  }
  function listen(target, name, callback) {
    target.addEventListener(name, callback);
    disposers.push(() => target.removeEventListener(name, callback));
  }
  function watch(callback, options, target) {
    const observer = new IntersectionObserver(callback, options);
    observer.observe(target);
    disposers.push(() => observer.disconnect());
  }
  (function () {

  'use strict';
  var root = document.getElementById('calme');
  var sec = document.getElementById('c-intro');
  if (!root || !sec) return;
  var canvas = document.getElementById('c-3d');
  var beats = Array.prototype.slice.call(sec.querySelectorAll('.beat'));
  var bar = sec.querySelector('.progress i');
  function staticMode() {
    sec.classList.add('static');
    beats.forEach(function (beat) {
      beat.style.removeProperty('opacity');
      beat.style.removeProperty('visibility');
      beat.style.removeProperty('transform');
    });
  }
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.147.0/build/three.min.js';
  var FRAMES = {base:'/intro-frames/',count:160,mobileCount:80,ext:'webp'};

  /* ---------- shared helpers ---------- */
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function seg(p, a, b) { return clamp((p - a) / (b - a), 0, 1); }
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  var BEATS = [[-1, 0, .10, .16], [.17, .21, .31, .35], [.37, .41, .53, .57], [.59, .63, .76, .80], [.86, .91, 2, 2]];
  var beatState = [];
  function showBeats(p) {
    // only touch the copy when it actually changes, so scrolling never triggers needless style work
    beats.forEach(function (el2, n) {
      var w0 = BEATS[n] || BEATS[BEATS.length - 1];
      var o = Math.round(seg(p, w0[0], w0[1]) * (1 - seg(p, w0[2], w0[3])) * 500) / 500;
      if (beatState[n] === o) return;
      beatState[n] = o;
      el2.style.opacity = o;
      el2.style.transform = el2.classList.contains('center') ? 'translateY(' + ((1 - o) * 14).toFixed(1) + 'px)' : 'translateY(calc(-50% + ' + ((1 - o) * 14).toFixed(1) + 'px))';
      el2.style.visibility = o > 0.01 ? 'visible' : 'hidden';
    });
    if (bar) bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    // tell the page once the visitor has watched the whole story (used for "engaged visitor" audiences)
    if (p < 0.3) introStarted = true;
    if (!introDone && introStarted && p > 0.97) { introDone = true; try { root.dispatchEvent(new CustomEvent('calme:intro', { detail: 'complete' })); } catch (e) {} }
  }
  var introDone = false, introStarted = false;
  function progress() {
    var rect = sec.getBoundingClientRect();
    var total = sec.offsetHeight - window.innerHeight;
    return total > 0 ? clamp(-rect.top / total, 0, 1) : 0;
  }
  function tokColor(name, fb) {
    var v = (getComputedStyle(root).getPropertyValue(name) || '').trim() || fb;
    var m = /^#?([0-9a-f]{6})$/i.exec(v) || /^#?([0-9a-f]{6})$/i.exec(fb);
    var n = parseInt(m[1], 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  if (FRAMES && FRAMES.count > 1 && canvas && canvas.getContext) frameSequence(FRAMES);
  else live();

  /* ---------- photoreal mode: a path-traced frame sequence scrubbed by the scroll ----------
     Frames download coarse-first and then nearest-to-the-reader first; only the frames around the current
     position are kept decoded (as ImageBitmaps), so scrubbing never waits on a decode and memory stays small. */
  function frameSequence(cfg) {
    var ctx = canvas.getContext('2d');
    if (!ctx) { live(); return; }
    var narrow = (window.innerWidth || 1200) < 640;
    var useM = narrow && cfg.mobileCount > 1;
    var N = useM ? cfg.mobileCount : cfg.count;
    var base = useM ? (cfg.mobileBase || cfg.base) : cfg.base;
    var prefix = useM ? (cfg.mobilePrefix || 'calme-intro-m-') : (cfg.prefix || 'calme-intro-');
    function url(i) { return base + prefix + ('00' + i).slice(-3) + '.' + (cfg.ext || 'webp'); }
    var imgs = new Array(N), bmp = new Array(N), busy = new Array(N), requested = new Array(N);
    var failed = 0, loaded = 0, inflight = 0, decoding = 0, dead = false;
    disposers.push(function () { dead = true; running = false; bmp.forEach(function (b) { if (b && b.close) b.close(); }); });
    var canBitmap = typeof window.createImageBitmap === 'function';
    var cur = 0, dir = 1;
    var target = 0, shown = 0, dirty = true, running = false;

    // network: a coarse pass over the whole story first, then whatever is nearest the reader
    var coarse = [];
    for (var ci = 0; ci < N; ci += 8) coarse.push(ci);
    coarse.push(N - 1);
    function nextToLoad() {
      for (var k = 0; k < coarse.length; k++) if (!requested[coarse[k]]) return coarse[k];
      for (var d = 0; d < N; d++) {
        var a = cur + d * dir, b = cur - d * dir;
        if (a >= 0 && a < N && !requested[a]) return a;
        if (b >= 0 && b < N && !requested[b]) return b;
      }
      return -1;
    }
    function pump() {
      while (!dead && inflight < 6) {
        var i = nextToLoad();
        if (i < 0) return;
        requested[i] = true; inflight++;
        load(i);
      }
    }
    function load(i) {
      var im = new Image();
      disposers.push(function () { im.onload = im.onerror = null; im.src = ""; });
      im.onload = function () {
        if (cancelled || dead) return;
        inflight--; imgs[i] = im; loaded++;
        if (loaded === 1) sec.classList.add('ready');
        if (Math.abs(i - cur) <= 16) decodeAround();
        dirty = true; pump();
      };
      im.onerror = function () { if (cancelled || dead) return; inflight--; failed++; if (!loaded && failed >= 3) giveUp(); else pump(); };
      im.src = url(i);
    }
    // decoding: keep a small window of ready-to-draw bitmaps around the current frame, ahead of the scroll
    function decodeAround() {
      if (!canBitmap || dead) return;
      var ahead = 16, behind = 6;
      var lo = Math.max(0, dir > 0 ? cur - behind : cur - ahead), hi = Math.min(N - 1, dir > 0 ? cur + ahead : cur + behind);
      for (var i = 0; i < N; i++) {
        if (bmp[i] && (i < lo - 8 || i > hi + 8)) { if (bmp[i].close) bmp[i].close(); bmp[i] = null; }
      }
      for (var d = 0; d <= ahead && decoding < 3; d++) {
        tryDecode(cur + d * dir, lo, hi);
        if (d && d <= behind) tryDecode(cur - d * dir, lo, hi);
      }
    }
    function tryDecode(k, lo, hi) {
      if (k < lo || k > hi || decoding >= 3 || bmp[k] || busy[k] || !imgs[k]) return;
      busy[k] = true; decoding++;
      createImageBitmap(imgs[k]).then(function (b) {
        busy[k] = false; decoding--;
        if (cancelled || dead || Math.abs(k - cur) > 30) { if (b.close) b.close(); }
        else { bmp[k] = b; if (Math.abs(k - cur) <= 2) dirty = true; }
        decodeAround();
      }, function () { busy[k] = false; decoding--; canBitmap = false; dirty = true; });
    }
    function giveUp() {
      if (dead || cancelled) return;
      // the frames are not reachable: fall back to the live 3D scene on a fresh canvas
      dead = true; running = false;
      var c2 = canvas.cloneNode(false); canvas.parentNode.replaceChild(c2, canvas); canvas = c2;
      live();
    }
    function drawable(i) { return bmp[i] || (!canBitmap && imgs[i]) || null; }
    function pick(i, step) {
      for (var j = i; j >= 0 && j < N; j += step) if (drawable(j)) return j;
      return -1;
    }

    var W = 0, H = 0, dpr = 1, C0, C1, lastBg = '';
    function readColors() { C0 = tokColor('--canvas', '#F5F5F7'); C1 = tokColor('--white', '#FFFFFF'); lastBg = ''; dirty = true; }
    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      var w = canvas.clientWidth || sec.clientWidth, h = canvas.clientHeight || window.innerHeight;
      if (Math.round(w * dpr) !== canvas.width || Math.round(h * dpr) !== canvas.height) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); }
      W = w; H = h; dirty = true;
    }
    function draw(p) {
      // background: the scheme's canvas colour, warming to its white as the intro meets the hero
      var k = ease(seg(p, .82, .94));
      var bg = 'rgb(' + Math.round(lerp(C0[0], C1[0], k)) + ',' + Math.round(lerp(C0[1], C1[1], k)) + ',' + Math.round(lerp(C0[2], C1[2], k)) + ')';
      if (bg !== lastBg) { sec.style.setProperty('--intro-bg', bg); lastBg = bg; }
      // placement of the square frame: centred under the product copy, beside the copy for the skin story
      var mB = easeOut(seg(p, .14, .30)) * (1 - ease(seg(p, .82, .96)));
      var s, cx, cy;
      if (W >= 900) { s = Math.min(H * 1.02, W * 0.62); cx = lerp(W * 0.5, W * 0.66, mB); cy = H * 0.56; }
      else if (W < 640) { s = Math.min(lerp(W * 1.45, W * 1.12, mB), H * 0.7); cx = W * 0.5; cy = lerp(H * 0.6, H * 0.36, mB); }
      else { s = Math.min(W * 0.92, H * 0.8); cx = W * 0.5; cy = lerp(H * 0.6, H * 0.45, mB); }
      var f = p * (N - 1), a = pick(Math.floor(f), -1), b = pick(Math.ceil(f), 1);
      if (a < 0 && b < 0) {
        // nothing decoded yet (first moments): draw the nearest downloaded frame directly
        for (var d = 0; d < N && a < 0; d++) { var r = Math.round(f) + d, l = Math.round(f) - d; a = imgs[r] ? r : (imgs[l] ? l : -1); }
        if (a < 0) return;
        b = a;
      }
      if (a < 0) a = b; if (b < 0) b = a;
      var A = drawable(a) || imgs[a], B = drawable(b) || imgs[b];
      // blend neighbouring frames only; while the sequence is still streaming in, show the nearest frame
      var t = a === b ? 0 : clamp((f - a) / (b - a), 0, 1);
      if (b - a > 1) { if (t >= 0.5) A = B; t = 0; }
      var x = cx - s / 2, y = cy - s / 2;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'medium';
      ctx.globalAlpha = 1; ctx.drawImage(A, x, y, s, s);
      if (t > 0.03) { ctx.globalAlpha = t; ctx.drawImage(B, x, y, s, s); ctx.globalAlpha = 1; }
    }
    function frame() {
      if (!running) return;
      target = progress();
      var prev = shown;
      shown += (target - shown) * (reduce ? 1 : 0.16);
      if (Math.abs(target - shown) < 0.0003) shown = target;
      var c = Math.round(shown * (N - 1));
      if (c !== cur) { dir = c > cur ? 1 : -1; cur = c; decodeAround(); pump(); }
      if (dirty || shown !== prev) { draw(shown); showBeats(shown); dirty = false; }
      schedule(frame);
    }
    function start() { if (!running && !dead) { running = true; schedule(frame); } }
    if ('IntersectionObserver' in window) {
      watch(function (es) { es[0].isIntersecting ? start() : (running = false); }, { rootMargin: '200px' }, sec);
    } else start();
    listen(window, 'resize', size);
    listen(root, 'calme:palette', readColors);
    readColors(); size();
    shown = target = progress(); cur = Math.round(shown * (N - 1));
    pump(); showBeats(shown);
  }

  /* ---------- live mode: the real-time WebGL scene ---------- */
  function live() {
  if (cancelled) return;
  if (!canvas || !canvas.getContext) { staticMode(); return; }
  if (!window.THREE) {
    var tag = document.createElement('script'); tag.src = THREE_URL;
    tag.onload = function () { window.THREE ? live() : staticMode(); }; tag.onerror = function () { if (!cancelled) staticMode(); };
    disposers.push(function () { tag.onload = tag.onerror = null; tag.remove(); });
    document.head.appendChild(tag); return;
  }

  var T = window.THREE;
  var small = (window.innerWidth || 1200) < 640;
  var renderer;
  try { renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: 'high-performance' }); }
  catch (e) { staticMode(); return; }
  var pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(pixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  renderer.outputEncoding = T.sRGBEncoding;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  var scene = new T.Scene();
  disposers.push(function () {
    scene.traverse(function (obj) {
      if (obj.geometry) obj.geometry.dispose();
      var mats = obj.material ? (Array.isArray(obj.material) ? obj.material : [obj.material]) : [];
      mats.forEach(function (mat) { Object.keys(mat).forEach(function (key) { if (mat[key] && mat[key].isTexture) mat[key].dispose(); }); mat.dispose(); });
    });
    if (envTex) envTex.dispose();
    if (pmrem) pmrem.dispose();
    renderer.dispose(); renderer.forceContextLoss();
  });
  var camera = new T.PerspectiveCamera(30, 1, 0.1, 100);

  scene.add(new T.HemisphereLight(0xffffff, 0xd8d6d2, 0.95));
  var key = new T.DirectionalLight(0xffffff, 0.8);
  key.position.set(5, 9, 8); key.castShadow = true;
  key.shadow.mapSize.set(small ? 1024 : 2048, small ? 1024 : 2048);
  var sc = key.shadow.camera; sc.left = -9; sc.right = 9; sc.top = 9; sc.bottom = -9; sc.near = 1; sc.far = 40;
  key.shadow.radius = 4;
  scene.add(key);
  var rim = new T.DirectionalLight(0xffffff, 0.3); rim.position.set(-7, 4, 5); scene.add(rim);

  // studio environment for every glossy surface: a dark surround (which draws the dark edge lines in glass)
  // with softbox strips for the highlights
  var pmrem = new T.PMREMGenerator(renderer);
  var envTex = (function () {
    var e = new T.Scene();
    e.add(new T.Mesh(new T.SphereGeometry(30, 48, 24), new T.MeshBasicMaterial({ color: 0x1c1c1e, side: T.BackSide })));
    var fl = new T.Mesh(new T.PlaneGeometry(80, 80), new T.MeshBasicMaterial({ color: 0x8a8a8c })); fl.rotation.x = -Math.PI / 2; fl.position.y = -6; e.add(fl);
    function box(w, h, x, y, z, k) { var m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: new T.Color(k, k, k), side: T.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 1, 0); e.add(m); }
    box(7, 11, -11, 3, 7, 3.2); box(1.6, 13, 12, 2, 4, 3.0); box(1.2, 13, -12.5, 2, -3, 2.2); box(1.2, 13, 11, 2, -6, 2.0); box(10, 10, 0, 14, 2, 1.6); box(3.5, 6, 6, 2, 12, 0.9);
    return pmrem.fromScene(e, 0, 0.1, 100).texture;
  })();

  /* ---------- helpers ---------- */
  var seed = 11, seed2 = 7;
  function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  function rnd2() { seed2 = (seed2 * 48271) % 2147483647; return (seed2 - 1) / 2147483646; }
  function V(x, y, z) { return new T.Vector3(x, y, z); }

  /* ---------- palette (read from the page's CSS tokens) ---------- */
  function tok(name, fb) { var v = getComputedStyle(root).getPropertyValue(name).trim(); return v || fb; }
  var C = { bg: new T.Color(), white: new T.Color('#ffffff'), mortar: new T.Color(), accent: new T.Color() };

  /* ---------- the skin block ---------- */
  var HALF = 2.8;          // plate half-size
  var PLATE_T = 0.16;      // plate thickness
  var DEPTH = 3.1;         // reservoir depth under the plate
  var BELOW = 12;          // how far below the frame the block waits before it rises in
  var block = new T.Group(); scene.add(block);
  var inner = new T.Group(); block.add(inner);

  // skin surface maps, drawn once on the GPU and mapped across the whole plate:
  // a height map (soft relief, a fine network of furrows and pores) and a tone map (gentle mottling)
  var skinMaps = (function (N) {
    var opts = { generateMipmaps: true, minFilter: T.LinearMipmapLinearFilter, magFilter: T.LinearFilter, depthBuffer: false, stencilBuffer: false };
    var hRT = new T.WebGLRenderTarget(N, N, opts), cRT = new T.WebGLRenderTarget(N, N, opts);
    var mat = new T.ShaderMaterial({
      depthTest: false, depthWrite: false, toneMapped: false,
      uniforms: { uMode: { value: 0 }, uSize: { value: 2 * HALF } },
      vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
      fragmentShader: [
        'precision highp float;',
        'varying vec2 vUv; uniform float uMode; uniform float uSize;',
        'float h21(vec2 p) { p = fract(p * vec2(234.34, 435.345)); p += dot(p, p + 34.23); return fract(p.x * p.y); }',
        'vec2 h22(vec2 p) { float n = h21(p); return vec2(n, h21(p + n + 19.19)); }',
        'float vn(vec2 p) { vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);',
        '  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), u.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), u.x), u.y); }',
        'float fbm(vec2 p) { float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { s += a * vn(p); p = p * 2.07 + vec2(17.3, 9.1); a *= 0.5; } return s / 0.96875; }',
        'vec3 vor(vec2 p) { vec2 i = floor(p), f = fract(p); float d1 = 9.0, d2 = 9.0, id = 0.0;',
        '  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {',
        '    vec2 g = vec2(float(x), float(y)); vec2 r = g + 0.15 + 0.7 * h22(i + g) - f; float d = dot(r, r);',
        '    if (d < d1) { d2 = d1; d1 = d; id = h21(i + g + 3.7); } else if (d < d2) { d2 = d; } }',
        '  return vec3(sqrt(d1), sqrt(d2) - sqrt(d1), id); }',
        'void main() {',
        '  vec2 p = (vUv - 0.5) * uSize;',
        '  float big = fbm(p * 0.9), mid = fbm(p * 3.1 + 4.0), fine = fbm(p * 15.0 + 9.0);',
        '  vec2 w = vec2(fbm(p * 1.7 + 2.0), fbm(p * 1.7 + 7.3)) - 0.5;',
        '  vec3 v1 = vor(p * 6.5 + w * 1.6);',
        '  vec3 v2 = vor(p * 15.0 + w * 2.5 + 3.3);',
        '  float f1 = 1.0 - smoothstep(0.0, 0.085, v1.y);',
        '  float f2 = 1.0 - smoothstep(0.0, 0.07, v2.y);',
        '  vec3 vp = vor(p * 22.0 + 11.0);',
        '  float pore = (1.0 - smoothstep(0.05, 0.15, vp.x)) * step(0.8, vp.z);',
        '  if (uMode < 0.5) {',
        '    float h = 0.62 + 0.12 * (mid - 0.5) + 0.08 * (fine - 0.5) - 0.30 * f1 - 0.12 * f2 - 0.35 * pore;',
        '    gl_FragColor = vec4(vec3(clamp(h, 0.0, 1.0)), 1.0);',
        '  } else {',
        '    float m = 0.965 + 0.08 * (big - 0.5) + 0.035 * (mid - 0.5) - 0.05 * f1 - 0.025 * f2 - 0.07 * pore;',
        '    gl_FragColor = vec4(clamp(vec3(m, m * (0.995 - 0.06 * (big - 0.5)), m * (0.99 - 0.08 * (big - 0.5))), 0.0, 1.0), 1.0);',
        '  }',
        '}'
      ].join('\n')
    });
    var q = new T.Mesh(new T.PlaneGeometry(2, 2), mat), s2 = new T.Scene(), c2 = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    q.frustumCulled = false; s2.add(q);
    var prev = renderer.getRenderTarget();
    renderer.setRenderTarget(hRT); renderer.render(s2, c2);
    mat.uniforms.uMode.value = 1; mat.uniformsNeedUpdate = true;
    renderer.setRenderTarget(cRT); renderer.render(s2, c2);
    renderer.setRenderTarget(prev);
    mat.dispose(); q.geometry.dispose();
    var an = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    [hRT.texture, cRT.texture].forEach(function (t) { t.repeat.set(1 / (2 * HALF), 1 / (2 * HALF)); t.offset.set(0.5, 0.5); t.anisotropy = an; });
    return { height: hRT.texture, tone: cRT.texture };
  })(small ? 512 : 1024);

  // one satin skin material for every cell: vertex colours deepen the walls of each crack
  var HEALTHY = new T.Color('#C46A55'), DRY = new T.Color('#BE8A72');
  var skinMat = new T.MeshPhysicalMaterial({
    color: HEALTHY.clone(), vertexColors: true, map: skinMaps.tone, bumpMap: skinMaps.height, bumpScale: 0.012,
    roughness: 0.55, metalness: 0, sheen: 0.4, sheenRoughness: 0.55, sheenColor: new T.Color('#F0B4A0'),
    clearcoat: 0.12, clearcoatRoughness: 0.4,
    specularIntensity: 0.35, envMap: envTex, envMapIntensity: 0.35
  });
  // the living layer under the cells: hidden while the barrier is whole, it shows (and reddens) through the cracks
  var UNDER = new T.Color('#93453A'), INFLAMED = new T.Color('#A8382C');
  var underMat = new T.MeshStandardMaterial({ color: UNDER.clone(), roughness: 0.8, metalness: 0 });
  var under = new T.Mesh(new T.BoxGeometry(2 * HALF - 0.03, 0.03, 2 * HALF - 0.03), underMat);
  under.position.y = -0.016; under.receiveShadow = true;
  inner.add(under);

  // Voronoi cells: a jittered 7 x 7 grid of seeds, each cell clipped from the square by bisectors
  function clipPoly(poly, nx, nz, d) {
    var out = [];
    for (var i = 0; i < poly.length; i++) {
      var a = poly[i], b = poly[(i + 1) % poly.length];
      var da = nx * a[0] + nz * a[1] - d, db = nx * b[0] + nz * b[1] - d;
      if (da <= 0) out.push(a);
      if ((da <= 0) !== (db <= 0)) { var t = da / (da - db); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
    }
    return out;
  }
  // corners are pooled so neighbouring cells share exactly the same coordinates,
  // and every shared edge gets one jagged crack line that both cells follow (so they fit back together)
  var corners = [];
  function snap(q) {
    for (var i = 0; i < corners.length; i++) { var o = corners[i]; if (Math.abs(o[0] - q[0]) < 1e-6 && Math.abs(o[1] - q[1]) < 1e-6) return o; }
    corners.push(q); return q;
  }
  function onBorder(a, b) {
    return (Math.abs(a[0]) > HALF - 1e-6 && Math.abs(b[0]) > HALF - 1e-6 && a[0] * b[0] > 0) ||
           (Math.abs(a[1]) > HALF - 1e-6 && Math.abs(b[1]) > HALF - 1e-6 && a[1] * b[1] > 0);
  }
  var crackLines = {};
  function crackPts(a, b) {
    if (onBorder(a, b)) return [];
    var ia = corners.indexOf(a), ib = corners.indexOf(b), flip = ia > ib, k = flip ? ib + '_' + ia : ia + '_' + ib;
    if (!crackLines[k]) {
      var p0 = flip ? b : a, p1 = flip ? a : b, dx = p1[0] - p0[0], dz = p1[1] - p0[1], len = Math.hypot(dx, dz), pts = [];
      if (len > 0.05) {
        var n = Math.max(2, Math.round(len / 0.045)), nx = -dz / len, nz = dx / len, amp = Math.min(0.034, len * 0.1);
        var o1 = rnd2() * 6.283, o2 = rnd2() * 6.283, o3 = rnd2() * 6.283;
        for (var i = 1; i < n; i++) {
          var t = i / n, s = t * len, taper = Math.pow(Math.sin(Math.PI * t), 0.7);
          var off = amp * taper * (0.62 * Math.sin(s * 13.5 + o1) + 0.28 * Math.sin(s * 31 + o2) + 0.16 * Math.sin(s * 67 + o3) + 0.22 * (rnd2() - 0.5));
          pts.push([p0[0] + dx * t + nx * off, p0[1] + dz * t + nz * off]);
        }
      }
      crackLines[k] = pts;
    }
    return flip ? crackLines[k].slice().reverse() : crackLines[k];
  }

  var GRID = 7, seeds = [];
  for (var gx = 0; gx < GRID; gx++) for (var gz = 0; gz < GRID; gz++) {
    seeds.push([-HALF + (gx + 0.5 + (rnd() - .5) * 0.85) * (2 * HALF / GRID), -HALF + (gz + 0.5 + (rnd() - .5) * 0.85) * (2 * HALF / GRID)]);
  }
  var polys = [];
  seeds.forEach(function (s, i) {
    var poly = [[-HALF, -HALF], [HALF, -HALF], [HALF, HALF], [-HALF, HALF]];
    seeds.forEach(function (o, j) {
      if (i === j) return;
      var nx = o[0] - s[0], nz = o[1] - s[1];
      poly = clipPoly(poly, nx, nz, nx * (s[0] + o[0]) / 2 + nz * (s[1] + o[1]) / 2);
    });
    var clean = [];
    poly.forEach(function (q) { var l = clean[clean.length - 1]; if (!l || Math.abs(l[0] - q[0]) > 1e-7 || Math.abs(l[1] - q[1]) > 1e-7) clean.push(q); });
    if (clean.length > 1 && Math.abs(clean[0][0] - clean[clean.length - 1][0]) < 1e-7 && Math.abs(clean[0][1] - clean[clean.length - 1][1]) < 1e-7) clean.pop();
    polys.push(clean.length >= 3 ? clean.map(snap) : null);
  });

  var tiles = [], edgePts = [];
  var BT = 0.022, BS = 0.014;   // bevel: rounded top edge of each cell
  polys.forEach(function (poly) {
    if (!poly) return;
    var cx = 0, cz = 0; poly.forEach(function (q) { cx += q[0]; cz += q[1]; }); cx /= poly.length; cz /= poly.length;
    var outline = [];
    for (var e = 0; e < poly.length; e++) { var a = poly[e], b = poly[(e + 1) % poly.length]; outline.push(a); outline = outline.concat(crackPts(a, b)); }
    var shape = new T.Shape(outline.map(function (q) { return new T.Vector2(q[0], -q[1]); }));
    var g = new T.ExtrudeGeometry(shape, { depth: PLATE_T - 2 * BT, bevelEnabled: true, bevelThickness: BT, bevelSize: BS, bevelSegments: 3, curveSegments: 1 });
    g.rotateX(-Math.PI / 2); g.translate(-cx, BT, -cz);
    // vertex colours: the satin top keeps the skin tone; the crack walls deepen towards the dermis
    var pos = g.attributes.position, cols = new Float32Array(pos.count * 3);
    var jit = 0.97 + rnd2() * 0.06, warm = (rnd2() - 0.5) * 0.035;
    for (var vi = 0; vi < pos.count; vi++) {
      var kk = clamp((pos.getY(vi) - 0.095) / (PLATE_T - 0.099), 0, 1); kk = kk * kk * (3 - 2 * kk);
      cols[vi * 3] = jit * lerp(0.80, 1, kk) * (1 + warm);
      cols[vi * 3 + 1] = jit * lerp(0.58, 1, kk);
      cols[vi * 3 + 2] = jit * lerp(0.54, 1, kk) * (1 - warm);
    }
    g.setAttribute('color', new T.BufferAttribute(cols, 3));
    var m = new T.Mesh(g, skinMat);
    m.position.set(cx, 0, cz); m.castShadow = true;
    inner.add(m);
    tiles.push({ m: m, cx: cx, cz: cz, d: Math.hypot(cx, cz), sh: 0.885 + rnd() * 0.06,
      rx: (rnd() - .5) * 0.16, rz: (rnd() - .5) * 0.16, ly: 0.015 + rnd() * 0.05 });
    // points along this cell's interior edges, where irritants can lodge
    for (var k = 0; k < poly.length; k++) {
      var p0 = poly[k], p1 = poly[(k + 1) % poly.length];
      if (onBorder(p0, p1)) continue;
      var t = 0.25 + rnd() * 0.5; edgePts.push([p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t]);
    }
  });

  /* reservoir: glass beads packed into the block */
  var NS = small ? 560 : 1150;
  var radii = [];
  for (var i = 0; i < NS; i++) {
    var u = rnd();
    radii.push(u < 0.06 ? 0.22 + rnd() * 0.1 : u < 0.32 ? 0.13 + rnd() * 0.09 : 0.06 + rnd() * 0.07);
  }
  radii.sort(function (a, b) { return b - a; });
  var CELL = 0.7, hash = {}, bubbles = [];
  function hkey(x, y, z) { return Math.floor(x / CELL) + ',' + Math.floor(y / CELL) + ',' + Math.floor(z / CELL); }
  function fits(x, y, z, r) {
    var ix = Math.floor(x / CELL), iy = Math.floor(y / CELL), iz = Math.floor(z / CELL);
    for (var a = -1; a <= 1; a++) for (var b = -1; b <= 1; b++) for (var c = -1; c <= 1; c++) {
      var list = hash[(ix + a) + ',' + (iy + b) + ',' + (iz + c)];
      if (!list) continue;
      for (var n = 0; n < list.length; n++) {
        var o = bubbles[list[n]];
        var dx = o.h.x - x, dy = o.h.y - y, dz = o.h.z - z, mr = (o.r + r) * 0.8;
        if (dx * dx + dy * dy + dz * dz < mr * mr) return false;
      }
    }
    return true;
  }
  radii.forEach(function (r) {
    for (var tries = 0; tries < 50; tries++) {
      var x = -HALF + r + rnd() * (2 * HALF - 2 * r), z = -HALF + r + rnd() * (2 * HALF - 2 * r);
      var y = -DEPTH + r + rnd() * (DEPTH - 2 * r - 0.02);
      if (rnd() < 0.45) {                       // half the beads hug a face, so the block keeps a crisp outline
        var f = Math.floor(rnd() * 5);
        if (f === 0) x = HALF - r; else if (f === 1) x = -HALF + r; else if (f === 2) z = HALF - r; else if (f === 3) z = -HALF + r; else y = -DEPTH + r;
      }
      if (!fits(x, y, z, r)) continue;
      var h = V(x, y, z), out = V(x, 0, z);
      if (out.lengthSq() < 0.01) out.set(rnd() - .5, 0, rnd() - .5);
      out.normalize();
      var idx = bubbles.length;
      bubbles.push({
        h: h, r: r,
        t: h.clone().addScaledVector(out, 0.4 + rnd() * 2.4).add(V((rnd() - .5) * 0.6, -(0.9 + rnd() * 3.4), (rnd() - .5) * 0.6)),
        lost: rnd() < 0.55, ss: 0.55 + rnd() * 0.4,
        dd: rnd() * 0.35 + 0.22 * ((y + DEPTH) / DEPTH),
        dr: 0, ph: rnd() * 6.283
      });
      (hash[hkey(x, y, z)] = hash[hkey(x, y, z)] || []).push(idx);
      return;
    }
  });
  var impactLocal = V(0, PLATE_T, 0);
  var maxDR = 0;
  bubbles.forEach(function (b) { b.dr = b.h.distanceTo(impactLocal); maxDR = Math.max(maxDR, b.dr); });
  bubbles.forEach(function (b) { b.dr = (b.dr / maxDR) * 0.45 + rnd() * 0.12; });

  // Beads touching a side face form the outer skin of the block and are truly refractive: each one traces the
  // light through a sphere (in, across, out) and samples what lies behind it. The beads inside are drawn as
  // an opaque glass layer, which is exactly what the outer beads see and bend.
  var NB = bubbles.length, nOut = 0, nIn = 0;
  bubbles.forEach(function (b) {
    b.outer = Math.min(HALF - Math.abs(b.h.x), HALF - Math.abs(b.h.z)) < b.r + 0.14;
    b.slot = b.outer ? nOut++ : nIn++;
  });
  var BEAD = { uBack: { value: 1.25 }, uRing: { value: 0.5 }, uBody: { value: new T.Color(1, 1, 1) }, uIor: { value: 1.45 } };
  var OPTICS = [
    '  vec3 bV = normalize( cameraPosition - vBPos );',
    '  vec3 bN = normalize( vBPos - vBCen );',
    '  vec3 bD1 = refract( - bV, bN, 1.0 / uIor );',
    '  float bChord = max( 0.0, - 2.0 * vBRad * dot( bN, bD1 ) );',
    '  vec3 bX = vBPos + bD1 * bChord;',
    '  vec3 bD2 = refract( bD1, - normalize( bX - vBCen ), uIor );',
    '  if ( dot( bD2, bD2 ) < 0.01 ) bD2 = reflect( bD1, - normalize( bX - vBCen ) );',
    '  float bRing = 1.0 - uRing * smoothstep( 0.06, 0.55, 1.0 - clamp( dot( bD2, - bV ), 0.0, 1.0 ) );',
    '  #ifdef USE_COLOR',
    '  vec3 bTint = pow( max( vColor, vec3( 0.001 ) ), vec3( bChord / max( 2.0 * vBRad, 1e-4 ) ) );',
    '  #else',
    '  vec3 bTint = vec3( 1.0 );',
    '  #endif'
  ].join('\n');
  function beadShader(sh, refractive) {
    sh.uniforms.uBack = BEAD.uBack; sh.uniforms.uRing = BEAD.uRing; sh.uniforms.uBody = BEAD.uBody; sh.uniforms.uIor = BEAD.uIor;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vBPos;\nvarying vec3 vBCen;\nvarying float vBRad;')
      .replace('#include <fog_vertex>', [
        '#include <fog_vertex>',
        '  #ifdef USE_INSTANCING',
        '  mat4 bM = modelMatrix * instanceMatrix;',
        '  #else',
        '  mat4 bM = modelMatrix;',
        '  #endif',
        '  vBCen = ( bM * vec4( 0.0, 0.0, 0.0, 1.0 ) ).xyz;',
        '  vBRad = length( bM[ 0 ].xyz );',
        '  vBPos = ( bM * vec4( transformed, 1.0 ) ).xyz;'
      ].join('\n'));
    var fs = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vBPos;\nvarying vec3 vBCen;\nvarying float vBRad;\nuniform float uBack;\nuniform float uRing;\nuniform vec3 uBody;\nuniform float uIor;')
      // a perfect sphere normal per pixel, whatever the tessellation
      .replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\n  normal = normalize( ( viewMatrix * vec4( normalize( vBPos - vBCen ), 0.0 ) ).xyz );\n  geometryNormal = normal;');
    if (refractive) {
      fs = fs.replace('#include <transmission_fragment>', [
        '#ifdef USE_TRANSMISSION',
        '  {',
        OPTICS,
        '  vec4 bNdc = projectionMatrix * viewMatrix * vec4( bX + bD2 * uBack, 1.0 );',
        '  vec3 bT = getTransmissionSample( bNdc.xy / bNdc.w * 0.5 + 0.5, material.roughness, uIor ).rgb;',
        '  vec3 bF = EnvironmentBRDF( bN, bV, material.specularColor, material.specularF90, material.roughness );',
        '  material.transmissionAlpha = 1.0;',
        '  totalDiffuse = mix( totalDiffuse, ( 1.0 - bF ) * bT * bRing * bTint, transmission );',
        '  }',
        '#endif'
      ].join('\n'));
    } else {
      fs = fs.replace('#include <emissivemap_fragment>', [
        '#include <emissivemap_fragment>',
        '  {',
        OPTICS,
        '  float bF0 = pow2( ( uIor - 1.0 ) / ( uIor + 1.0 ) );',
        '  float bF = bF0 + ( 1.0 - bF0 ) * pow( 1.0 - clamp( dot( bN, bV ), 0.0, 1.0 ), 5.0 );',
        '  totalEmissiveRadiance = uBody * bRing * bTint * ( 1.0 - bF );',
        '  }'
      ].join('\n'));
    }
    sh.fragmentShader = fs;
  }
  var beadOuterMat = new T.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0, transmission: 1, thickness: 0.3, ior: 1.45,
    specularIntensity: 1, envMap: envTex, envMapIntensity: 1, toneMapped: false });
  beadOuterMat.onBeforeCompile = function (sh) { beadShader(sh, true); };
  beadOuterMat.customProgramCacheKey = function () { return 'calme-bead-refractive'; };
  var beadInnerMat = new T.MeshPhysicalMaterial({ color: 0x000000, metalness: 0, roughness: 0, ior: 1.45,
    specularIntensity: 1, envMap: envTex, envMapIntensity: 1, toneMapped: false });
  beadInnerMat.onBeforeCompile = function (sh) { beadShader(sh, false); };
  beadInnerMat.customProgramCacheKey = function () { return 'calme-bead-body'; };

  var beadGeo = new T.SphereGeometry(1, small ? 18 : 24, small ? 12 : 16);
  var beadsOut = new T.InstancedMesh(beadGeo, beadOuterMat, Math.max(1, nOut));
  var beadsIn = new T.InstancedMesh(beadGeo, beadInnerMat, Math.max(1, nIn));
  var GOLD = new T.Color('#F0C97E'), CLEAR = new T.Color(1, 1, 1), tintC = new T.Color();
  [beadsOut, beadsIn].forEach(function (m) {
    m.frustumCulled = false;
    m.instanceMatrix.setUsage(T.DynamicDrawUsage);
    for (var s = 0; s < m.count; s++) m.setColorAt(s, CLEAR);
    m.instanceColor.setUsage(T.DynamicDrawUsage);
    inner.add(m);
  });
  var dummy = new T.Object3D();

  /* irritants: small amber specks that settle into the cracks */
  var NI = 34;
  var irrMat = new T.MeshPhysicalMaterial({ color: 0x6A3412, roughness: 0.45, metalness: 0, clearcoat: 0.35, clearcoatRoughness: 0.35, envMap: envTex, envMapIntensity: 0.5 });
  var irritants = new T.InstancedMesh(new T.SphereGeometry(0.05, 14, 10), irrMat, NI);
  irritants.frustumCulled = false; inner.add(irritants);
  var irr = [];
  for (var q = 0; q < NI; q++) {
    var e = edgePts[Math.floor(rnd() * edgePts.length)] || [0, 0];
    irr.push({ e: V(e[0], PLATE_T * 0.55, e[1]), s: V(e[0] + (rnd() - .5) * 2.4, 1.6 + rnd() * 2.2, e[1] + (rnd() - .5) * 2.4),
      o: rnd() * 0.45, k: 0.7 + rnd() * 0.7, d: Math.hypot(e[0], e[1]) });
  }

  /* the ripple: a soft glowing ring that seals the surface as it spreads */
  var ringC = document.createElement('canvas'); ringC.width = ringC.height = 256;
  (function () {
    var g = ringC.getContext('2d');
    var grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grd.addColorStop(0, 'rgba(255,255,255,0.10)'); grd.addColorStop(0.62, 'rgba(255,255,255,0.06)');
    grd.addColorStop(0.8, 'rgba(255,255,255,0.55)'); grd.addColorStop(0.9, 'rgba(255,255,255,1)');
    grd.addColorStop(0.97, 'rgba(255,255,255,0.3)'); grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 256, 256);
  })();
  var ringTex = new T.CanvasTexture(ringC);
  function makeRing() {
    var mat = new T.MeshBasicMaterial({ map: ringTex, transparent: true, depthWrite: false, blending: T.AdditiveBlending, toneMapped: false });
    var r = new T.Mesh(new T.PlaneGeometry(1, 1), mat);
    r.rotation.x = -Math.PI / 2; r.position.y = PLATE_T + 0.012; r.renderOrder = 6;
    inner.add(r); return r;
  }
  var ring1 = makeRing(), ring2 = makeRing();

  /* ---------- the dropper bottle ---------- */
  var labelCanvas = document.createElement('canvas'); labelCanvas.width = 2048; labelCanvas.height = 512;
  var labelTex = new T.CanvasTexture(labelCanvas); labelTex.encoding = T.sRGBEncoding; labelTex.anisotropy = 4;
  function drawLabel() {
    var g = labelCanvas.getContext('2d');
    g.clearRect(0, 0, 2048, 512);
    var fam = '-apple-system, "Inter", "Helvetica Neue", Arial, sans-serif';
    g.fillStyle = '#FFFFFF'; g.fillRect(704, 70, 640, 400);
    g.textAlign = 'center';
    g.fillStyle = '#' + C.accent.getHexString(); g.font = '600 40px ' + fam;
    g.fillText('C  A  L  M  E', 1024, 150);
    g.fillRect(994, 176, 60, 4);
    g.fillStyle = '#1D1D1F'; g.font = '600 54px ' + fam;
    g.fillText('Ceramide', 1024, 260); g.fillText('Recovery Serum', 1024, 322);
    g.fillStyle = '#6E6E73'; g.font = '400 26px ' + fam;
    g.fillText('Ceramides 3:1:1 · Niacinamide 2%', 1024, 380);
    g.fillText('30 ml', 1024, 428);
    labelTex.needsUpdate = true;
  }
  var bottle = new T.Group(); scene.add(bottle);
  function lathe(pts, seg) { return new T.LatheGeometry(pts.map(function (p) { return new T.Vector2(p[0], p[1]); }), seg || 128); }
  // Boston-round dropper bottle, 30 ml
  var BR = 0.6, prof = [[0, 0], [0.5, 0], [0.555, 0.01], [0.584, 0.035], [0.597, 0.075], [0.6, 0.13], [0.6, 1.2]];
  for (var pi = 1; pi <= 14; pi++) { var pa = pi / 14 * Math.PI / 2; prof.push([0.305 + 0.295 * Math.cos(pa), 1.2 + 0.36 * Math.sin(pa)]); }
  prof.push([0.282, 1.575], [0.27, 1.605], [0.27, 1.82], [0, 1.82]);
  var glassMat = new T.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0.02, transmission: 1, thickness: 0.14, ior: 1.5,
    specularIntensity: 1, envMap: envTex, envMapIntensity: 1.0, toneMapped: false });
  var body = new T.Mesh(lathe(prof, 144), glassMat); bottle.add(body);
  function edgeMat(strength, lo, hi, inner) {
    return new T.ShaderMaterial({
      transparent: true, depthWrite: false, depthTest: !inner,
      uniforms: { uS: { value: strength }, uLo: { value: lo }, uHi: { value: hi }, uA: { value: 1 } },
      vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vec4 wp = modelMatrix * vec4(position, 1.0); vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - wp.xyz); gl_Position = projectionMatrix * viewMatrix * wp; }',
      fragmentShader: 'uniform float uS; uniform float uLo; uniform float uHi; uniform float uA; varying vec3 vN; varying vec3 vV; void main(){ float f = 1.0 - abs(dot(normalize(vN), normalize(vV))); float d = smoothstep(uLo, uHi, f) * (1.0 - 0.75 * smoothstep(0.975, 1.0, f)); gl_FragColor = vec4(0.15, 0.16, 0.18, d * uS * uA); }'
    });
  }
  var edgeOuter = new T.Mesh(lathe(prof, 144), edgeMat(0.5, 0.7, 0.93, false)); edgeOuter.renderOrder = 8; bottle.add(edgeOuter);
  var inProf = [[0.552, 0.14]].concat(prof.filter(function (q) { return q[1] > 0.14 && q[1] < 1.4; }).map(function (q) { return [q[0] * 0.92, q[1]]; }));
  var edgeInner = new T.Mesh(lathe(inProf, 144), edgeMat(0.28, 0.82, 0.97, true)); edgeInner.renderOrder = 9; bottle.add(edgeInner);
  // milky serum inside (opaque, so the glass refracts it)
  var liquid = new T.Mesh(lathe([[0, 0.19], [0.47, 0.19], [0.52, 0.202], [0.544, 0.24], [0.55, 0.29], [0.55, 1.08], [0.538, 1.1], [0.47, 1.088], [0, 1.086]], 96),
    new T.MeshPhysicalMaterial({ color: 0x8A857D, metalness: 0, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.2, envMap: envTex, envMapIntensity: 0.6 }));
  liquid.castShadow = true; bottle.add(liquid);
  var pipette = new T.Mesh(new T.CylinderGeometry(0.05, 0.04, 1.5, 24), new T.MeshPhysicalMaterial({ color: 0x8E9297, roughness: 0.05, clearcoat: 1, envMap: envTex, envMapIntensity: 1.2 }));
  pipette.position.y = 0.95; bottle.add(pipette);
  var sleeve = new T.Mesh(new T.CylinderGeometry(0.604, 0.604, 0.95, 96, 1, true, Math.PI, Math.PI * 2),
    new T.MeshStandardMaterial({ map: labelTex, transparent: true, roughness: 0.55, metalness: 0, envMap: envTex, envMapIntensity: 0.6 }));
  sleeve.position.y = 0.66; sleeve.renderOrder = 10; bottle.add(sleeve);
  var alu = new T.MeshPhysicalMaterial({ color: 0xD7DADF, metalness: 1, roughness: 0.3, envMap: envTex, envMapIntensity: 1.15 });
  var collar = new T.Mesh(lathe([[0, 1.6], [0.29, 1.6], [0.3, 1.61], [0.305, 1.63], [0.305, 1.98], [0.3, 2.0], [0.285, 2.01], [0, 2.01]]), alu);
  collar.castShadow = true; bottle.add(collar);
  var bulb = new T.Mesh(lathe([[0, 2.0], [0.2, 2.0], [0.205, 2.03], [0.19, 2.06], [0.14, 2.09], [0.13, 2.13], [0.15, 2.2], [0.17, 2.29], [0.168, 2.37], [0.15, 2.44], [0.11, 2.5], [0.05, 2.53], [0, 2.535]], 64),
    new T.MeshPhysicalMaterial({ color: 0xD8D3CA, metalness: 0, roughness: 0.7, sheen: 0.5, sheenColor: new T.Color(0xffffff), envMap: envTex, envMapIntensity: 0.8 }));
  bulb.castShadow = true; bottle.add(bulb);
  bottle.children.forEach(function (o) { o.position.y -= 1.1; });

  var floorMat = new T.ShadowMaterial({ opacity: 0.12, transparent: true, depthWrite: false });
  var floor = new T.Mesh(new T.PlaneGeometry(30, 30), floorMat); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);

  // one milky drop of serum
  var dropMat = new T.MeshPhysicalMaterial({ color: 0xFBF9F5, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.1, transparent: true });
  var drop = new T.Mesh(new T.SphereGeometry(0.17, 32, 20), dropMat); drop.visible = false; drop.renderOrder = 5; scene.add(drop);

  function readPalette() {
    C.bg.set(tok('--canvas', '#F5F5F7'));
    C.white.set(tok('--white', '#FFFFFF'));
    C.mortar.set(tok('--mortar', '#A9BFD6'));
    C.accent.set(tok('--blue', '#2F5C8A'));
    var glow = new T.Color('#FFE3E6').lerp(C.mortar, 0.4);
    ring1.material.color.copy(glow); ring2.material.color.copy(glow);
    drawLabel();
  }
  readPalette();
  listen(root, 'calme:palette', function () { readPalette(); render(true); });

  /* ---------- timeline ---------- */

  var wide = true, mobile = false;
  function resize() {
    var w = sec.clientWidth, h = Math.max(1, (sec.querySelector('.intro-stick') || sec).clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    wide = w >= 900; mobile = w < 640;
    render(true);
  }

  var target = 0, shown = 0, t0 = performance.now();

  var tmpA = V(0, 0, 0), tmpB = V(0, 0, 0), tmpC = V(0, 0, 0);
  function apply(p, time) {
    var side = wide ? 2.5 : 0;          // the scene sits right of the copy on wide screens
    var lift = mobile ? 1.5 : 0;        // and above the copy on phones
    var offY = mobile ? 16 : 8;
    var idle = reduce ? 0 : time;

    // background: canvas grey → the scheme's white at the very end (meets the hero)
    var endFade = ease(seg(p, .82, .94));
    var bg = C.bg.clone().lerp(C.white, endFade);
    scene.background = bg;
    BEAD.uBody.value.copy(bg);
    sec.style.setProperty('--intro-bg', '#' + bg.getHexString());

    var aOut = ease(seg(p, .14, .26));          // product hero leaves
    var bIn = easeOut(seg(p, .14, .30));        // skin block rises into frame
    var crack = ease(seg(p, .38, .47));         // surface cracks
    var dmg = seg(p, .40, .57);                 // reservoir drains
    var dIn = ease(seg(p, .57, .63));           // dropper arrives
    var dOut = ease(seg(p, .74, .82));
    var healR = lerp(0, 4.3, ease(seg(p, .665, .79)));   // ripple radius; cracks seal behind it
    var rep = seg(p, .655, .80);                // reservoir refills
    var healAll = ease(seg(p, .70, .80));
    var eIn = ease(seg(p, .82, .96));           // product returns
    var sink = ease(seg(p, .80, .91));          // block sinks away
    var vis = bIn * (1 - sink);

    /* block placement: rises from below the frame, sinks back out at the end */
    block.position.set(side, lift - BELOW * (1 - bIn) - BELOW * sink, 0);
    block.scale.setScalar(lerp(0.9, 1, bIn));
    inner.rotation.y = -0.74 + p * 0.45 + (reduce ? 0 : Math.sin(idle * 0.00022) * 0.05);
    block.visible = bIn > 0.001 && sink < 0.999;

    /* plate: cells shrink about their centres (cracks open), tilt and lift; they heal behind the ripple,
       which also runs through the surface as a gentle wave */
    var dry = crack * (1 - healAll);
    skinMat.color.copy(HEALTHY).lerp(DRY, dry);
    skinMat.bumpScale = lerp(0.012, 0.03, dry);
    skinMat.roughness = lerp(0.55, 0.85, dry);
    skinMat.sheen = lerp(0.4, 0.1, dry);
    skinMat.clearcoat = lerp(0.12, 0.01, dry);
    underMat.color.copy(UNDER).lerp(INFLAMED, dry);
    var waveAmp = 0.05 * clamp(healR / 0.3, 0, 1) * (1 - seg(healR, 3.4, 4.3));
    tiles.forEach(function (t) {
      var healT = clamp((healR - t.d + 0.35) / 0.7, 0, 1);
      var c = crack * (1 - healT);
      var s = 1 - (1 - t.sh) * c;
      var dw = (healR - t.d) / 0.32;
      t.m.scale.set(s, 1, s);
      t.m.position.y = t.ly * c + waveAmp * Math.exp(-dw * dw);
      t.m.rotation.set(t.rx * c, 0, t.rz * c);
    });

    /* reservoir: drains down and out from the bottom first, refills from the impact outward with a golden glow */
    var wob = reduce ? 0 : 1;
    for (var i = 0; i < NB; i++) {
      var b = bubbles[i];
      var u = clamp((dmg - b.dd) / 0.5, 0, 1), ue = u * u;
      var v = clamp((rep - b.dr) / 0.4, 0, 1), ve = easeOut(v);
      var away = ue * (1 - ve);
      var px = lerp(lerp(b.h.x, b.t.x, ue), b.h.x, ve);
      var py = lerp(lerp(b.h.y, b.t.y, ue), b.h.y, ve) + Math.sin(idle * 0.0011 + b.ph) * 0.018 * wob;
      var pz = lerp(lerp(b.h.z, b.t.z, ue), b.h.z, ve);
      // on the way back, swing in on a gentle arc
      var arc = Math.sin(v * Math.PI) * 0.35;
      px += -b.h.z * 0.12 * arc; pz += b.h.x * 0.12 * arc;
      dummy.position.set(px, py, pz);
      // water that is lost shrinks away as it leaves; what stays behind thins out
      dummy.scale.setScalar(Math.max(1e-4, b.r * (b.lost ? 1 - away : 1 + (b.ss - 1) * away)));
      dummy.updateMatrix();
      var mesh = b.outer ? beadsOut : beadsIn;
      mesh.setMatrixAt(b.slot, dummy.matrix);
      tintC.copy(CLEAR).lerp(GOLD, clamp(0.1 + Math.sin(v * Math.PI) * 0.8 + ve * 0.12, 0, 1));
      mesh.setColorAt(b.slot, tintC);
    }
    beadsOut.instanceMatrix.needsUpdate = true; beadsIn.instanceMatrix.needsUpdate = true;
    beadsOut.instanceColor.needsUpdate = true; beadsIn.instanceColor.needsUpdate = true;

    /* irritants settle into the cracks, then are pushed out as the ripple passes */
    var inT = seg(p, .43, .56);
    for (var j = 0; j < NI; j++) {
      var it = irr[j];
      var w = ease(clamp((inT - it.o) / 0.55, 0, 1));
      var ex = clamp((healR - it.d + 0.2) / 0.8, 0, 1);
      tmpA.copy(it.s).lerp(it.e, w);
      tmpA.y += ex * 0.9;
      dummy.position.copy(tmpA);
      dummy.scale.setScalar(it.k * w * (1 - ex) + 0.0001);
      dummy.updateMatrix();
      irritants.setMatrixAt(j, dummy.matrix);
    }
    irritants.instanceMatrix.needsUpdate = true;

    /* ripple rings */
    var r1 = Math.min(healR, 2.75);
    ring1.scale.set(2 * r1 + 0.001, 2 * r1 + 0.001, 1);
    ring1.material.opacity = 0.7 * clamp(healR / 0.35, 0, 1) * (1 - clamp((healR - 1.9) / 0.85, 0, 1)) * vis;
    var r2 = lerp(0, 2.75, ease(seg(p, .70, .80)));
    ring2.scale.set(2 * r2 + 0.001, 2 * r2 + 0.001, 1);
    ring2.material.opacity = 0.4 * clamp(r2 / 0.35, 0, 1) * (1 - clamp((r2 - 1.6) / 1.15, 0, 1)) * vis;
    ring1.visible = ring1.material.opacity > 0.003; ring2.visible = ring2.material.opacity > 0.003;

    /* camera: wide three-quarter view; pushes in on the cracks; pulls back for the repair */
    block.updateMatrixWorld(true);
    var impact = inner.localToWorld(tmpB.set(0, PLATE_T, 0)).clone();
    var close = ease(seg(p, .38, .52)) * (1 - ease(seg(p, .60, .72)));
    var el = 0.43;                               // camera elevation (rad)
    var mB = bIn * (1 - eIn);                    // 0 = product framing, 1 = skin-block framing
    var dist = lerp(mobile ? 26 : (wide ? 17.5 : 20), mobile ? 40 : (wide ? 17.5 : 22), mB);
    var lookW = tmpA.set(side * 0.22, lerp(lift - 1.15 + (mobile ? 0.6 : 0), lift - 1.15 - (mobile ? 4.3 : 0), mB), 0);
    var camW = tmpC.set(lookW.x, lookW.y + dist * Math.sin(el), dist * Math.cos(el));
    var lookC = mobile ? V(impact.x, impact.y - 1.7, impact.z) : V(impact.x - 0.2, impact.y - 0.15, impact.z);
    var camC = mobile ? V(impact.x, impact.y + 4.2, impact.z + 10.5) : V(impact.x + (wide ? -0.8 : 0), impact.y + 2.4, impact.z + 5.6);
    var look = lookW.clone().lerp(lookC, close);
    camera.position.copy(camW).lerp(camC, close);
    camera.lookAt(look);

    /* bottle */
    var spin = reduce ? -0.12 : Math.sin(idle * 0.0006) * 0.32 - 0.1;
    if (p < .5) {
      var bs = lerp(1.6, 1.3, aOut);
      bottle.position.set(lerp(side * 0.45, side + 1.5, aOut), lerp(lift - 1.35, offY, aOut), 1.4);
      bottle.scale.setScalar(bs); bottle.rotation.set(0.06, spin, lerp(0, -0.25, aOut));
    } else if (p < .82) {
      // tilt over the block so the dropper tip hangs just above the impact point
      bottle.position.set(0, 0, 0); bottle.scale.setScalar(1.0);
      bottle.rotation.set(0.06, spin * 0.4, lerp(-0.25, -2.35, dIn));
      bottle.updateMatrixWorld(true);
      var tipNow = bottle.localToWorld(V(0, 1.45, 0));
      var want = impact.clone().add(V(0.05, 1.35, 0.15));
      var away2 = want.clone().add(V(2.2, offY - 0.5, 0));
      var goal = away2.clone().lerp(want, dIn).lerp(away2, dOut);
      bottle.position.copy(goal.sub(tipNow));
    } else {
      bottle.position.set(lerp(side + 1.5, side * 0.45, eIn), lerp(offY, lift - 1.25, eIn), 1.4);
      bottle.scale.setScalar(lerp(1.0, 1.6, eIn)); bottle.rotation.set(0.06, spin, lerp(-2.35, 0, eIn));
    }
    bottle.visible = bottle.position.y < offY + 4;
    floor.position.set(bottle.position.x, bottle.position.y - 1.1 * bottle.scale.x, 1.4);
    floorMat.opacity = 0.12 * Math.max(1 - aOut, p > .82 ? eIn : 0);
    floor.visible = floorMat.opacity > 0.002;

    /* the drop: falls from the tip, lands, spreads and sinks in */
    bottle.updateMatrixWorld(true);
    var tip = bottle.localToWorld(V(0, 1.5, 0));
    var fall = seg(p, .632, .665), splash = seg(p, .665, .70);
    drop.visible = fall > 0 && splash < 1 && dIn > .95 && vis > .5;
    if (drop.visible) {
      if (fall < 1) {
        drop.position.set(lerp(tip.x, impact.x, fall), lerp(tip.y, impact.y + 0.2, fall * fall), lerp(tip.z, impact.z, fall));
        drop.scale.set(1, 1.25, 1);
        dropMat.opacity = 1;
      } else {
        drop.position.set(impact.x, impact.y + 0.03, impact.z);
        drop.scale.set(1 + 1.5 * splash, Math.max(0.15, 1.25 - 1.1 * splash), 1 + 1.5 * splash);
        dropMat.opacity = 1 - seg(p, .675, .695);
      }
    }

    showBeats(p);
  }

  // if this device can't keep up, render at a lower resolution rather than stutter
  var lastT = 0, samples = 0, slow = 0;
  function pace(time) {
    if (lastT) {
      var dt = time - lastT;
      if (dt < 250) { samples++; if (dt > 28) slow++; }
    }
    lastT = time;
    if (samples >= 45) {
      if (slow > samples * 0.5 && pixelRatio > 1) {
        pixelRatio = Math.max(1, pixelRatio - 0.5);
        renderer.setPixelRatio(pixelRatio); resize();
      }
      samples = slow = 0;
    }
  }

  var dirty = true, running = false;
  function render(force) { if (force) dirty = true; }
  function frame(time) {
    if (!running) return;
    target = progress();
    var prev = shown;
    shown += (target - shown) * (reduce ? 1 : 0.14);
    if (Math.abs(target - shown) < 0.0004) shown = target;
    if (dirty || shown !== prev || !reduce) {
      apply(shown, time - t0);
      renderer.render(scene, camera);
      dirty = false;
      pace(time);
    }
    schedule(frame);
  }
  function start() { if (!running) { running = true; lastT = 0; schedule(frame); } }
  function stop() { running = false; }

  if ('IntersectionObserver' in window) {
    watch(function (es) { es[0].isIntersecting ? start() : stop(); }, { rootMargin: '100px' }, sec);
  } else start();
  listen(window, 'resize', resize);
  resize();
  // compile every shader up front (the block starts hidden), so nothing stalls mid-scroll
  block.visible = true;
  try { renderer.compile(scene, camera); } catch (e) { /* compiling lazily is fine too */ }
  apply(progress(), 0); renderer.render(scene, camera);
  shown = target = progress();
  sec.classList.add('ready');
  }

  })();
  return () => {
    cancelled = true;
    frames.forEach(id => window.cancelAnimationFrame(id));
    disposers.reverse().forEach(dispose => dispose());
  };
}
