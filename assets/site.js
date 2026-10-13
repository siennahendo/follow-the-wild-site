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
          '<span>Follow the Wild is being set up as a nonprofit. 501(c)(3) status pending.</span></div>' +
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
})();
