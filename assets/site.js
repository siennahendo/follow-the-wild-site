/* Follow the Wild — shared header, footer, painted landscape scenes and the sign-up form. */
(function () {
  var root = document.querySelector('[data-page]');
  var page = root ? root.getAttribute('data-page') : '';
  var PAGES = [
    ['about', 'about.html', 'About'],
    ['programs', 'programs.html', 'What we do'],
    ['involved', 'get-involved.html', 'Get involved']
  ];
  var cur = function (key) { return key === page ? ' aria-current="page"' : ''; };
  var print = '<svg viewBox="0 0 24 28" aria-hidden="true"><use href="#print"/></svg>';

  // Fox-print symbol, used by the logo.
  document.body.insertAdjacentHTML('afterbegin',
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><symbol id="print" viewBox="0 0 24 28">' +
    '<ellipse cx="12" cy="19" rx="6" ry="5.5" fill="currentColor"/><ellipse cx="4.2" cy="11" rx="2.2" ry="3" fill="currentColor"/>' +
    '<ellipse cx="9" cy="6" rx="2.3" ry="3.2" fill="currentColor"/><ellipse cx="15" cy="6" rx="2.3" ry="3.2" fill="currentColor"/>' +
    '<ellipse cx="19.8" cy="11" rx="2.2" ry="3" fill="currentColor"/></symbol></defs></svg>');

  var header = document.getElementById('site-header');
  if (header) {
    header.outerHTML =
      '<header class="site-nav" id="site-nav"><div class="wrap bar">' +
        '<a class="brand" href="index.html"' + cur('home') + '>' + print + '<span>Follow the Wild</span></a>' +
        '<nav class="links" aria-label="Main">' +
          PAGES.map(function (p) { return '<a href="' + p[1] + '"' + cur(p[0]) + '>' + p[2] + '</a>'; }).join('') +
          '<a class="btn primary small" href="get-involved.html#join">Join the trail</a>' +
        '</nav>' +
        '<button class="menu-btn" id="menu-open" aria-expanded="false" aria-controls="menu"><i></i>Menu</button>' +
      '</div></header>' +
      '<div class="menu" id="menu" hidden>' +
        '<div class="bar"><a class="brand" href="index.html">' + print + '<span>Follow the Wild</span></a>' +
        '<button class="menu-btn" id="menu-close" style="display:inline-flex">Close</button></div>' +
        '<nav aria-label="Menu"><a href="index.html"' + cur('home') + '>Home</a>' +
          PAGES.map(function (p) { return '<a href="' + p[1] + '"' + cur(p[0]) + '>' + p[2] + '</a>'; }).join('') +
        '</nav>' +
        '<a class="btn primary" href="get-involved.html#join">Join the trail</a>' +
      '</div>';
  }

  var footer = document.getElementById('site-footer');
  if (footer) {
    footer.outerHTML =
      '<footer class="site-footer"><div class="wrap">' +
        '<div class="foot-top">' +
          '<div><a class="brand" href="index.html">' + print + '<span>Follow the Wild</span></a>' +
          '<p class="tagline">Inspire · Explore · Discover · Protect</p></div>' +
          '<div><h4>Explore</h4><ul><li><a href="index.html">Home</a></li><li><a href="about.html">About</a></li>' +
            '<li><a href="programs.html">What we do</a></li><li><a href="get-involved.html">Get involved</a></li></ul></div>' +
          '<div><h4>Get involved</h4><ul><li><a href="get-involved.html#teachers">Teachers</a></li><li><a href="get-involved.html#families">Families</a></li>' +
            '<li><a href="get-involved.html#creators">Creators</a></li><li><a href="get-involved.html#partners">Partners &amp; funders</a></li></ul></div>' +
        '</div>' +
        '<div class="foot-bottom"><span>© 2026 Follow the Wild</span>' +
          '<span>Follow the Wild is a 501(c)(3) nonprofit organization.</span></div>' +
      '</div></footer>';
  }

  // Nav turns solid once the hero scrolls away.
  var nav = document.getElementById('site-nav');
  var onScroll = function () { if (nav) nav.classList.toggle('solid', window.scrollY > 60); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var menu = document.getElementById('menu');
  var openBtn = document.getElementById('menu-open');
  var closeBtn = document.getElementById('menu-close');
  if (menu && openBtn && closeBtn) {
    var setMenu = function (open) {
      menu.hidden = !open;
      openBtn.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
      (open ? closeBtn : openBtn).focus();
    };
    openBtn.addEventListener('click', function () { setMenu(true); });
    closeBtn.addEventListener('click', function () { setMenu(false); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });
  }

  /* ---------- Painted scenes ----------
     <canvas class="scene" data-scene="dawn|forest|night|ocean" data-seed="7"> */
  function rng(seed) {
    var s = seed >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) | 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function fbm(rand) {
    var tables = [0, 1, 2, 3].map(function () { var v = []; for (var i = 0; i < 64; i++) v.push(rand()); return v; });
    var smooth = function (v, x) {
      var i = Math.floor(x), f = x - i, a = v[((i % 64) + 64) % 64], b = v[(((i + 1) % 64) + 64) % 64];
      var u = (1 - Math.cos(f * Math.PI)) / 2;
      return a * (1 - u) + b * u;
    };
    return function (x) {
      var sum = 0, amp = 1, freq = 1, norm = 0;
      for (var k = 0; k < 4; k++) { sum += smooth(tables[k], x * freq) * amp; norm += amp; amp *= 0.5; freq *= 2.1; }
      return sum / norm;
    };
  }
  function rgb(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
  function mix(a, b, t) {
    var A = rgb(a), B = rgb(b);
    return 'rgb(' + A.map(function (v, i) { return Math.round(v + (B[i] - v) * t); }).join(',') + ')';
  }

  var SCENES = {
    dawn:   { sky: ['#1f2c4b', '#5a6390', '#d48f7d', '#f4cd9c'], sun: [0.66, 0.5, 0.045, '#fff2da', 'rgba(255,200,150,.55)'],
              far: '#b49db2', near: '#121d26', fog: '255,232,214', layers: 5, horizon: 0.48, amp: 0.2, peaks: 1.7, clouds: true, birds: true, rim: 'rgba(255,196,150,.55)' },
    forest: { sky: ['#6f8c86', '#aec2b8', '#dce5da'], sun: [0.28, 0.26, 0.035, 'rgba(255,255,236,.95)', 'rgba(255,255,225,.4)'],
              far: '#a3b8ad', near: '#0c1d15', fog: '226,236,228', layers: 6, horizon: 0.4, amp: 0.13, peaks: 1.2, trees: true },
    night:  { sky: ['#030812', '#0a1e30', '#17404a'], far: '#1d3a45', near: '#03080c', fog: '70,120,128', layers: 5, horizon: 0.6,
              amp: 0.16, peaks: 1.4, stars: true, aurora: true, tent: true, trees: true },
    ocean:  { sky: ['#1b2241', '#74476f', '#de7862', '#f6b467'], sun: [0.6, 0.66, 0.06, '#ffe3b2', 'rgba(255,168,110,.6)'],
              sea: ['#3a3456', '#0b1525'], horizon: 0.66, birds: true, headland: true }
  };

  function ridgeAt(n, nx, peaks) { return Math.pow(n(nx), peaks); }

  function paint(cv) {
    var sc = SCENES[cv.getAttribute('data-scene')] || SCENES.dawn;
    var rand = rng(+cv.getAttribute('data-seed') || 1);
    var w = cv.clientWidth, h = cv.clientHeight;
    if (!w || !h) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    var c = cv.getContext('2d');
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    var S = Math.max(w, h * 1.3);  // scale reference so small thumbs and wide heroes read alike
    var hz = h * sc.horizon;

    // Sky
    var g = c.createLinearGradient(0, 0, 0, sc.sea ? hz : h * (sc.horizon + 0.2));
    sc.sky.forEach(function (col, i) { g.addColorStop(i / (sc.sky.length - 1), col); });
    c.fillStyle = g; c.fillRect(0, 0, w, h);

    if (sc.stars) {
      var count = Math.round(w * h / 1400);
      for (var i = 0; i < count; i++) {
        var sx = rand() * w, sy = rand() * hz * 1.05, r = rand() * 1.1 + 0.3;
        c.fillStyle = 'rgba(255,255,255,' + (0.25 + rand() * 0.7).toFixed(2) + ')';
        c.beginPath(); c.arc(sx, sy, r, 0, Math.PI * 2); c.fill();
      }
    }
    if (sc.aurora) {
      c.save(); c.globalCompositeOperation = 'lighter';
      var an = fbm(rand);
      [['95,255,190', 0.2, 0.0], ['120,205,255', 0.3, 2.3]].forEach(function (a) {
        for (var x = 0; x < w; x += 2) {
          var nx = x / S * 3;
          var cy = h * a[1] + Math.sin(nx * 2.2 + a[2]) * h * 0.07 + (an(nx * 2) - 0.5) * h * 0.08;
          var len = h * (0.1 + an(nx * 3 + 5) * 0.22);
          var gr = c.createLinearGradient(0, cy - len, 0, cy);
          gr.addColorStop(0, 'rgba(' + a[0] + ',0)');
          gr.addColorStop(1, 'rgba(' + a[0] + ',' + (0.05 + an(nx * 5) * 0.12).toFixed(3) + ')');
          c.fillStyle = gr; c.fillRect(x, cy - len, 2, len);
        }
      });
      c.restore();
    }
    if (sc.sun) {
      var sx2 = w * sc.sun[0], sy2 = h * sc.sun[1], sr = S * sc.sun[2];
      var glow = c.createRadialGradient(sx2, sy2, 0, sx2, sy2, sr * 9);
      glow.addColorStop(0, sc.sun[4]); glow.addColorStop(1, 'rgba(255,200,150,0)');
      c.fillStyle = glow; c.fillRect(0, 0, w, h);
      c.fillStyle = sc.sun[3]; c.beginPath(); c.arc(sx2, sy2, sr, 0, Math.PI * 2); c.fill();
    }
    if (sc.birds) {
      c.strokeStyle = 'rgba(20,20,30,.7)'; c.lineWidth = Math.max(1, S / 900); c.lineCap = 'round';
      var bx = w * (0.55 + rand() * 0.25), by = h * (0.16 + rand() * 0.12);
      for (var b = 0; b < 7; b++) {
        var x0 = bx + (rand() - 0.3) * S * 0.16, y0 = by + (rand() - 0.5) * h * 0.12, s = S * (0.005 + rand() * 0.006);
        c.beginPath(); c.moveTo(x0 - s, y0 - s * 0.35);
        c.quadraticCurveTo(x0 - s * 0.45, y0 - s * 0.65, x0, y0);
        c.quadraticCurveTo(x0 + s * 0.45, y0 - s * 0.65, x0 + s, y0 - s * 0.35); c.stroke();
      }
    }

    if (sc.sea) { paintSea(c, sc, rand, w, h, hz, S); return; }

    // Mountain layers, far to near
    var L = sc.layers, lastRidge = null;
    for (var l = 0; l < L; l++) {
      var t = l / (L - 1);
      var n = fbm(rand);
      var base = hz + t * (h - hz) * 0.78;
      var amp = h * sc.amp * (1.15 - t * 0.35);
      var freq = (3.2 - t * 1.6) / S;
      var pts = [];
      for (var x = 0; x <= w + 4; x += 4) pts.push([x, base - ridgeAt(n, x * freq + l * 9, sc.peaks) * amp]);
      c.fillStyle = mix(sc.far, sc.near, Math.pow(t, 0.85));
      c.beginPath(); c.moveTo(0, h);
      pts.forEach(function (p) { c.lineTo(p[0], p[1]); });
      c.lineTo(w, h); c.closePath(); c.fill();
      if (sc.rim && l >= L - 2) {
        c.strokeStyle = sc.rim; c.lineWidth = 1.2; c.beginPath();
        pts.forEach(function (p, i) { i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }); c.stroke();
      }
      if (sc.trees && t > 0.2) {
        c.fillStyle = mix(sc.far, sc.near, Math.pow(t, 0.85));
        var size = S * (0.008 + t * 0.03) * (sc.aurora ? 0.7 : 1);
        for (var tx = -size; tx < w + size; tx += size * (0.28 + rand() * 0.3)) {
          var ty = base - ridgeAt(n, Math.max(0, tx) * freq + l * 9, sc.peaks) * amp + size * 0.15;
          var th = size * (0.65 + rand() * 0.7), tw = th * 0.2;
          c.beginPath(); c.moveTo(tx - tw, ty); c.lineTo(tx, ty - th); c.lineTo(tx + tw, ty); c.fill();
          c.beginPath(); c.moveTo(tx - tw * 1.35, ty - th * 0.25); c.lineTo(tx, ty - th * 0.85); c.lineTo(tx + tw * 1.35, ty - th * 0.25); c.fill();
        }
      }
      if (l < L - 1) {
        var fg = c.createLinearGradient(0, base - amp * 0.35, 0, base + (h - hz) * 0.2);
        fg.addColorStop(0, 'rgba(' + sc.fog + ',0)');
        fg.addColorStop(1, 'rgba(' + sc.fog + ',' + (0.42 - t * 0.2).toFixed(2) + ')');
        c.fillStyle = fg; c.fillRect(0, base - amp * 0.35, w, h);
      }
      if (sc.clouds && l === L - 3) paintClouds(c, sc, rand, w, h, base + (h - hz) * 0.1, S);
      lastRidge = { pts: pts };
    }
    if (sc.tent && lastRidge) {
      var p = lastRidge.pts[Math.round(lastRidge.pts.length * 0.68)];
      var ts = S * 0.014;
      var tg = c.createRadialGradient(p[0], p[1] - ts * 0.4, 0, p[0], p[1] - ts * 0.4, ts * 7);
      tg.addColorStop(0, 'rgba(255,170,80,.55)'); tg.addColorStop(1, 'rgba(255,170,80,0)');
      c.fillStyle = tg; c.fillRect(p[0] - ts * 7, p[1] - ts * 7, ts * 14, ts * 14);
      c.fillStyle = '#ffb35c'; c.beginPath();
      c.moveTo(p[0] - ts, p[1] + 1); c.lineTo(p[0], p[1] - ts * 1.05); c.lineTo(p[0] + ts, p[1] + 1); c.fill();
    }
  }

  function paintClouds(c, sc, rand, w, h, top, S) {
    var g = c.createLinearGradient(0, top - h * 0.05, 0, h);
    g.addColorStop(0, 'rgba(' + sc.fog + ',0)'); g.addColorStop(0.3, 'rgba(' + sc.fog + ',.75)'); g.addColorStop(1, 'rgba(' + sc.fog + ',.95)');
    c.fillStyle = g; c.fillRect(0, top - h * 0.05, w, h);
    for (var i = 0; i < 40; i++) {
      var x = rand() * w, y = top + rand() * h * 0.12, r = S * (0.03 + rand() * 0.07);
      var rg = c.createRadialGradient(x, y, 0, x, y, r);
      rg.addColorStop(0, 'rgba(' + sc.fog + ',.55)'); rg.addColorStop(1, 'rgba(' + sc.fog + ',0)');
      c.fillStyle = rg; c.beginPath(); c.ellipse(x, y, r * 1.8, r * 0.6, 0, 0, Math.PI * 2); c.fill();
    }
  }

  function paintSea(c, sc, rand, w, h, hz, S) {
    var g = c.createLinearGradient(0, hz, 0, h);
    g.addColorStop(0, sc.sea[0]); g.addColorStop(1, sc.sea[1]);
    c.fillStyle = g; c.fillRect(0, hz, w, h - hz);
    var sx = w * sc.sun[0];
    for (var y = hz + 1; y < h; y += 2.5) {
      var d = (y - hz) / (h - hz);
      var spread = S * (0.02 + d * 0.12);
      for (var k = 0; k < 3; k++) {
        if (rand() > 0.6) continue;
        var x = sx + (rand() - 0.5) * spread * 2, len = S * (0.004 + rand() * 0.02) * (1 + d);
        c.fillStyle = 'rgba(255,198,140,' + ((1 - d) * 0.55 * rand()).toFixed(3) + ')';
        c.fillRect(x - len / 2, y, len, 1.2);
      }
      if (rand() > 0.55) {
        c.fillStyle = 'rgba(255,255,255,' + (0.02 + rand() * 0.04).toFixed(3) + ')';
        c.fillRect(rand() * w, y, S * (0.01 + rand() * 0.03), 1);
      }
    }
    var n = fbm(rand);
    // Distant headland on the right
    c.fillStyle = 'rgba(40,30,60,.55)'; c.beginPath(); c.moveTo(w * 0.72, hz);
    for (var x2 = w * 0.72; x2 <= w; x2 += 4) {
      var e = (x2 - w * 0.72) / (w * 0.28);
      c.lineTo(x2, hz - Math.pow(e, 0.6) * h * 0.06 * (0.7 + n(x2 / S * 8) * 0.6));
    }
    c.lineTo(w, hz); c.fill();
    // Near headland and sea stacks on the left
    c.fillStyle = '#0c111f'; c.beginPath(); c.moveTo(0, h);
    for (var x3 = 0; x3 <= w * 0.4; x3 += 3) {
      var f = 1 - x3 / (w * 0.4);
      c.lineTo(x3, hz + (h - hz) * 0.25 - Math.pow(f, 0.7) * h * 0.32 * (0.75 + n(x3 / S * 6 + 3) * 0.5));
    }
    c.lineTo(w * 0.42, h); c.closePath(); c.fill();
    [[0.47, 0.11, 0.02], [0.53, 0.06, 0.013]].forEach(function (st) {
      var x4 = w * st[0], sh = h * st[1], sw = S * st[2], yb = hz + (h - hz) * 0.18;
      c.beginPath(); c.moveTo(x4 - sw, yb); c.lineTo(x4 - sw * 0.7, yb - sh); c.lineTo(x4 + sw * 0.2, yb - sh * 1.08);
      c.lineTo(x4 + sw * 0.8, yb - sh * 0.7); c.lineTo(x4 + sw, yb); c.fill();
    });
  }

  var canvases = Array.prototype.slice.call(document.querySelectorAll('canvas.scene'));
  var sizes = new WeakMap();
  var draw = function (cv) {
    var key = cv.clientWidth + 'x' + cv.clientHeight;
    if (sizes.get(cv) === key) return;
    sizes.set(cv, key);
    paint(cv);
  };
  canvases.forEach(draw);
  if ('ResizeObserver' in window) {
    var ro = new ResizeObserver(function (entries) { entries.forEach(function (e) { draw(e.target); }); });
    canvases.forEach(function (cv) { ro.observe(cv); });
  }

  // Sign-up form (preview: nothing is sent or stored yet)
  var form = document.getElementById('signup');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var err = document.getElementById('err');
      var role = form.querySelector('input[name="role"]:checked');
      var email = document.getElementById('email').value.trim();
      var msg = !role ? 'Pick who you are signing up as.'
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Enter an email address like name@example.com.' : '';
      err.textContent = msg; err.hidden = !msg;
      if (msg) return;
      form.hidden = true;
      document.getElementById('done').hidden = false;
    });
  }

  /* ---------- Motion: trail line, topo lines, fade-ins, counters, photo slider ----------
     Everything is visible without JavaScript; motion is skipped for visitors who ask for reduced motion. */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';
  var svgEl = function (tag, attrs) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); return e; };

  // Topographic contour lines
  Array.prototype.forEach.call(document.querySelectorAll('svg.topo'), function (svg) {
    var r = rng(+svg.getAttribute('data-seed') || 11), ph = [r() * 6.28, r() * 6.28, r() * 6.28];
    svg.setAttribute('viewBox', '0 0 600 600');
    for (var k = 0; k < 10; k++) {
      var base = 36 + k * 27, d = '';
      for (var a = 0; a <= 90; a++) {
        var t = a / 90 * Math.PI * 2;
        var rr = base * (1 + 0.16 * Math.sin(3 * t + ph[0] + k * 0.22) + 0.09 * Math.sin(5 * t + ph[1] - k * 0.17) + 0.05 * Math.sin(2 * t + ph[2]));
        d += (a ? 'L' : 'M') + (300 + rr * Math.cos(t) * 1.12).toFixed(1) + ' ' + (300 + rr * Math.sin(t) * 0.86).toFixed(1);
      }
      svg.appendChild(svgEl('path', { d: d + 'Z' }));
    }
  });

  // Dashed trail that draws itself as you scroll, with paw prints along the way
  var trail = document.querySelector('svg.trail-line');
  if (trail) {
    var mainEl = trail.parentElement, fromEl = document.querySelector(trail.getAttribute('data-from')), toEl = document.querySelector(trail.getAttribute('data-to'));
    var maskPath = null, trailLen = 0, trailH = 0, paws = [], arrow = null;
    var buildTrail = function () {
      while (trail.firstChild) trail.removeChild(trail.firstChild);
      paws = []; maskPath = null;
      var wrap = fromEl.querySelector('.wrap');
      var mr = mainEl.getBoundingClientRect(), fr = fromEl.getBoundingClientRect(), tr = toEl.getBoundingClientRect();
      var textStart = wrap.getBoundingClientRect().left - mr.left + parseFloat(getComputedStyle(wrap).paddingLeft);
      if (window.innerWidth < 900 || textStart < 44) { trail.style.display = 'none'; return; }
      trail.style.display = '';
      var top = fr.top - mr.top + 48; trailH = tr.bottom - fr.top - 60;
      var w = mainEl.clientWidth, x0 = textStart / 2, amp = Math.min((textStart - 24) / 2, 46);
      trail.style.top = top + 'px'; trail.style.height = trailH + 'px';
      trail.setAttribute('viewBox', '0 0 ' + w + ' ' + trailH);
      var xAt = function (y) { return x0 + amp * (0.7 * Math.sin(y / 230) + 0.3 * Math.sin(y / 83)); };
      // Optional end point: curve in to an element (e.g. the sign-up button)
      var endEl = trail.getAttribute('data-end') && document.querySelector(trail.getAttribute('data-end'));
      var vy = trailH, ex = 0, ey = 0, lowY = 0;
      if (endEl) {
        var er = endEl.getBoundingClientRect();
        ex = er.left - mr.left - 18; ey = er.top - mr.top - top + er.height / 2;
        // Pass underneath any text block named in data-avoid before curving up into the target
        var avoid = trail.getAttribute('data-avoid') && document.querySelector(trail.getAttribute('data-avoid'));
        var lowY = Math.max(ey, avoid ? avoid.getBoundingClientRect().bottom - mr.top - top : ey) + 46;
        vy = lowY - 30; trailH = lowY + 40;
        trail.style.height = trailH + 'px'; trail.setAttribute('viewBox', '0 0 ' + w + ' ' + trailH);
      }
      var d = 'M' + xAt(0).toFixed(1) + ' 0';
      for (var y = 12; y <= vy; y += 12) d += ' L' + xAt(y).toFixed(1) + ' ' + y;
      if (endEl) d += ' C ' + xAt(vy).toFixed(1) + ' ' + (lowY + 25).toFixed(1) + ' ' + (ex - 40).toFixed(1) + ' ' + (lowY + 25).toFixed(1) + ' ' + ex.toFixed(1) + ' ' + ey.toFixed(1);
      var defs = svgEl('defs', {}), mask = svgEl('mask', { id: 'trail-mask', maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: w, height: trailH });
      maskPath = svgEl('path', { d: d, fill: 'none', stroke: '#fff', 'stroke-width': 10, 'stroke-linecap': 'round' });
      mask.appendChild(maskPath); defs.appendChild(mask); trail.appendChild(defs);
      trail.appendChild(svgEl('path', { d: d, 'class': 'trail-path', mask: 'url(#trail-mask)' }));
      trailLen = maskPath.getTotalLength();
      arrow = null;
      if (endEl) {
        var ang2 = Math.atan2(ey - (lowY + 25), 40) * 180 / Math.PI;
        arrow = svgEl('path', { d: 'M -11 -8 L 1 0 L -11 8', 'class': 'trail-arrow', transform: 'translate(' + (ex + 2).toFixed(1) + ' ' + ey.toFixed(1) + ') rotate(' + ang2.toFixed(1) + ')' });
        trail.appendChild(arrow);
      }
      maskPath.style.strokeDasharray = trailLen;
      for (var py = 90, side = 1; py < (endEl ? vy - 20 : trailH - 30); py += 115, side = -side) {
        var ang = Math.atan2(1, (xAt(py + 1) - xAt(py - 1)) / 2) * 180 / Math.PI;
        var u = svgEl('use', { href: '#print', width: 13, height: 15, x: -6.5, y: -7.5,
          transform: 'translate(' + (xAt(py) + side * 9).toFixed(1) + ' ' + py + ') rotate(' + (ang + 90).toFixed(1) + ')' });
        trail.appendChild(u); paws.push({ el: u, y: py });
      }
      updateTrail();
    };
    var updateTrail = function () {
      if (!maskPath) return;
      var p = reduce ? 1 : Math.max(0, Math.min(1, (window.innerHeight * 0.7 - trail.getBoundingClientRect().top) / trailH));
      maskPath.style.strokeDashoffset = trailLen * (1 - p);
      paws.forEach(function (pw) { pw.el.classList.toggle('on', p * trailH > pw.y); });
      if (arrow) arrow.classList.toggle('on', p > 0.985);
    };
    window.addEventListener('scroll', updateTrail, { passive: true });
    var rebuildTimer;
    window.addEventListener('resize', function () { clearTimeout(rebuildTimer); rebuildTimer = setTimeout(buildTrail, 150); });
    window.addEventListener('load', buildTrail);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(buildTrail);
    if ('ResizeObserver' in window) {
      var lastH = 0;
      new ResizeObserver(function () {
        var h = document.body.scrollHeight;
        if (Math.abs(h - lastH) > 4) { lastH = h; clearTimeout(rebuildTimer); rebuildTimer = setTimeout(buildTrail, 120); }
      }).observe(document.body);
    }
    buildTrail();
  }

  if (!reduce && 'IntersectionObserver' in window) {
    // Fade sections in as they scroll into view
    document.documentElement.classList.add('motion');
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(document.querySelectorAll('.head, .split > *, .card, .ways li, .values li, .three > div, .who article, .role, .role-card, .frame, .ptile, .pb-head, .faq details, .join-card, .loop li, .pillar-body, .stats > div, .field-track figure'), function (el) {
      var i = Array.prototype.indexOf.call(el.parentElement.children, el);
      el.style.setProperty('--d', Math.min(i, 6) * 80 + 'ms');
      el.classList.add('reveal');
      revealIO.observe(el);
    });

  }

  // Photo slider arrows and lightbox
  var track = document.querySelector('.field-track');
  if (track) {
    // Up/down swipes over the slider scroll the page instead of getting caught by the slider
    track.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && !e.shiftKey) {
        e.preventDefault();
        window.scrollBy(0, e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY);
      }
    }, { passive: false });
    Array.prototype.forEach.call(document.querySelectorAll('.fbtn'), function (b) {
      b.addEventListener('click', function () {
        track.scrollBy({ left: +b.getAttribute('data-dir') * track.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth' });
      });
    });
    var lb = document.getElementById('lightbox');
    if (lb && lb.showModal) {
      Array.prototype.forEach.call(track.querySelectorAll('.field-open'), function (btn) {
        btn.addEventListener('click', function () {
          var img = btn.querySelector('img');
          lb.querySelector('img').src = img.src; lb.querySelector('img').alt = img.alt;
          lb.querySelector('p').textContent = img.alt;
          lb.showModal();
        });
      });
      lb.querySelector('.lb-close').addEventListener('click', function () { lb.close(); });
      lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    }
  }

  Array.prototype.forEach.call(document.querySelectorAll('.rc-join[data-role]'), function (a) {
    a.addEventListener('click', function () {
      var radio = document.getElementById(a.getAttribute('data-role'));
      if (radio) radio.checked = true;
    });
  });

  // Rolling (odometer) numbers tied to scroll: digits roll as the stats move up the screen
  var odos = Array.prototype.map.call(document.querySelectorAll('[data-count]'), function (el, idx) {
    var end = +el.getAttribute('data-count'), digits = String(end).length, cols = [];
    if (reduce) return null;
    el.textContent = '';
    var sr = document.createElement('span'); sr.className = 'sr-only'; sr.textContent = end; el.appendChild(sr);
    for (var i = 0; i < digits; i++) {
      var col = document.createElement('span'); col.className = 'odo-col'; col.setAttribute('aria-hidden', 'true');
      var strip = document.createElement('span'); strip.className = 'odo-strip';
      for (var n = 0; n <= 9; n++) { var d = document.createElement('span'); d.textContent = n; strip.appendChild(d); }
      col.appendChild(strip); el.appendChild(col); cols.push({ col: col, strip: strip });
    }
    return { el: el, end: end, digits: digits, cols: cols, idx: idx };
  }).filter(Boolean);
  if (odos.length) {
    var statsBox = odos[0].el.closest('.stats') || odos[0].el;
    var updateOdos = function () {
      var r = statsBox.getBoundingClientRect();
      var p = (window.innerHeight - r.top) / (window.innerHeight * 0.5);
      odos.forEach(function (o) {
        var q = Math.max(0, Math.min(1, (p - o.idx * 0.12) / 0.76));
        var v = Math.round(o.end * q), str = String(v), pad = o.digits - str.length;
        o.cols.forEach(function (c, i) {
          var digit = i < pad ? 0 : +str[i - pad];
          c.strip.style.transform = 'translateY(' + (-digit * 10) + '%)';
          c.col.classList.toggle('off', i < pad);
        });
      });
    };
    window.addEventListener('scroll', updateOdos, { passive: true });
    window.addEventListener('resize', updateOdos);
    updateOdos();
  }

  // About: words fill in as you scroll past them
  var fills = Array.prototype.slice.call(document.querySelectorAll('.fill-text'));
  if (fills.length && !reduce) {
    fills.forEach(function (el) {
      var words = el.textContent.trim().split(/\s+/);
      el.textContent = '';
      words.forEach(function (w, i) {
        var sp = document.createElement('span'); sp.className = 'fw';
        sp.textContent = w + (i < words.length - 1 ? ' ' : '');
        el.appendChild(sp);
      });
    });
    var updateFills = function () {
      fills.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var p = Math.max(0, Math.min(1, (window.innerHeight * 0.85 - r.top) / (r.height + window.innerHeight * 0.3)));
        var n = Math.round(p * el.children.length);
        for (var i = 0; i < el.children.length; i++) el.children[i].classList.toggle('lit', i < n);
      });
    };
    window.addEventListener('scroll', updateFills, { passive: true });
    updateFills();
  }

  // About: the belief loop draws left to right and lights each step
  var loops = Array.prototype.slice.call(document.querySelectorAll('.loop-draw'));
  if (loops.length) {
    var updateLoops = function () {
      loops.forEach(function (ol) {
        var r = ol.getBoundingClientRect(), items = ol.children;
        var p = reduce ? 1 : Math.max(0, Math.min(1, (window.innerHeight * 0.85 - r.top) / (window.innerHeight * 0.4)));
        ol.style.setProperty('--p', p.toFixed(3));
        for (var i = 0; i < items.length; i++) items[i].classList.toggle('lit', p >= i / (items.length - 1) - 0.001);
        ol.classList.toggle('loop-complete', p >= 0.999);
      });
    };
    window.addEventListener('scroll', updateLoops, { passive: true });
    updateLoops();
  }

  // What we do: each program lights up as it scrolls past
  var litItems = Array.prototype.slice.call(document.querySelectorAll('.lit-list li'));
  if (litItems.length) {
    var updateLit = function () {
      litItems.forEach(function (li) { li.classList.toggle('lit', reduce || li.getBoundingClientRect().top < window.innerHeight * 0.72); });
    };
    window.addEventListener('scroll', updateLit, { passive: true });
    updateLit();
  }
})();
