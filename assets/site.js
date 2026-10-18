(() => {
  'use strict';
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches;
  try { paused = reduced.matches || sessionStorage.getItem('wild-motion-paused') === 'true'; } catch (_) {}
  const toggle = document.getElementById('motion-toggle');
  const verb = document.getElementById('hero-verb');
  const number = document.getElementById('verb-number');
  const words = ['Follow', 'Share', 'Stream', 'Watch'];
  let wordIndex = 0, rotation, stageTimer, changing = false;
  const finishedCounters = new WeakSet();
  function settleCounters() {
    document.querySelectorAll('[data-count]').forEach(el => { el.textContent = el.dataset.count; finishedCounters.add(el); });
  }
  let letterAnimations = [];
  function lettering(element, word) {
    element.replaceChildren(...Array.from(word, char => {
      const letter = document.createElement('span');
      letter.className = 'verb-letter'; letter.textContent = char;
      return letter;
    }));
  }
  if (verb) lettering(verb, words[0]);
  function settleWord() {
    letterAnimations.forEach(animation => animation.cancel());
    letterAnimations = [];
    document.querySelectorAll('.verb-ghost').forEach(el => el.remove());
    if (verb) lettering(verb, words[wordIndex]);
    changing = false;
  }
  function rotate(nextIndex) {
    if (paused || document.hidden || changing || !verb || verb.getBoundingClientRect().bottom < 0) return;
    changing = true;
    const ghost = verb.cloneNode(true);
    ghost.removeAttribute('id'); ghost.className = 'verb-ghost';
    verb.parentElement.append(ghost);
    wordIndex = Number.isInteger(nextIndex) ? nextIndex : (wordIndex + 1) % words.length;
    document.querySelectorAll('[data-word]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.word) === wordIndex)));
    lettering(verb, words[wordIndex]);
    if (number) number.textContent = String(wordIndex + 1).padStart(2, '0');
    ghost.querySelectorAll('.verb-letter').forEach((letter, i) => {
      letterAnimations.push(letter.animate([
        {opacity:1, transform:'translate3d(0,0,0) rotateY(0deg)', filter:'blur(0px)'},
        {opacity:0, transform:'translate3d(-.12em,-.24em,70px) rotateY(-65deg) rotateZ(-8deg)', filter:'blur(9px)'}
      ], {duration:850, delay:i*45, easing:'cubic-bezier(.4,0,.2,1)', fill:'both'}));
    });
    verb.querySelectorAll('.verb-letter').forEach((letter, i) => {
      letterAnimations.push(letter.animate([
        {opacity:0, transform:'translate3d(.18em,.28em,-90px) rotateY(65deg) rotateZ(7deg)', filter:'blur(10px)'},
        {opacity:1, transform:'translate3d(0,0,0) rotateY(0deg)', filter:'blur(0px)'}
      ], {duration:1200, delay:130+i*65, easing:'cubic-bezier(.16,1,.3,1)', fill:'both'}));
    });
    stageTimer = setTimeout(settleWord, 1750);
  }
  function applyMotion() {
    clearInterval(rotation); clearTimeout(stageTimer); settleWord();
    root.classList.toggle('motion-on', !paused);
    root.classList.toggle('motion-paused', paused);
    toggle.textContent = paused ? 'Play motion' : 'Pause motion';
    document.querySelectorAll('.hero-motion-toggle').forEach(button => {button.textContent = paused ? 'Play motion' : 'Pause motion'; button.setAttribute('aria-pressed', String(paused));});
    toggle.setAttribute('aria-pressed', String(paused));
    if (verb) { verb.classList.remove('out', 'enter'); if (!paused) { rotation = setInterval(rotate, 3600); stageTimer = setTimeout(rotate, 700); } }
    if (paused) settleCounters();
  }
  toggle.addEventListener('click', () => { paused = !paused; try { sessionStorage.setItem('wild-motion-paused', String(paused)); } catch (_) {} applyMotion(); });
  document.querySelector('.hero-motion-toggle')?.addEventListener('click', () => toggle.click());
  document.querySelectorAll('[data-word]').forEach(button => button.addEventListener('click', () => {
    clearTimeout(stageTimer); settleWord();
    const selected = Number(button.dataset.word);
    if (paused) {
      wordIndex = selected; settleWord();
      document.querySelectorAll('[data-word]').forEach(item => item.setAttribute('aria-pressed', String(Number(item.dataset.word) === wordIndex)));
    } else {
      clearInterval(rotation); rotate(selected); rotation = setInterval(rotate, 3600);
    }
  }));
  reduced.addEventListener('change', e => { paused = e.matches; applyMotion(); });
  applyMotion();
  const nav = document.querySelector('.site-nav');
  function scrollNav() { nav.classList.toggle('scrolled', window.scrollY > 25); }
  window.addEventListener('scroll', scrollNav, {passive:true}); scrollNav();
  const menu = document.getElementById('mobile-nav');
  const menuButton = document.querySelector('.menu-toggle');
  function closeMenu() { menu.hidden = true; menuButton.setAttribute('aria-expanded','false'); menuButton.textContent='Menu +'; }
  menuButton.addEventListener('click', () => { const open = menu.hidden; menu.hidden = !open; menuButton.setAttribute('aria-expanded', String(open)); menuButton.textContent = open ? 'Close −' : 'Menu +'; });
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && !menu.hidden) {closeMenu(); menuButton.focus();} });
  window.matchMedia('(min-width:761px)').addEventListener('change', e => {if(e.matches) closeMenu();});
  function count(el) {
    if (finishedCounters.has(el)) return;
    finishedCounters.add(el);
    const end = Number(el.dataset.count), decimals = el.dataset.decimals ? Number(el.dataset.decimals) : 0;
    if(paused){el.textContent = end.toFixed(decimals); return;}
    const start = performance.now();
    function frame(now) {
      const progress = Math.min(1,(now-start)/1600);
      el.textContent = paused ? end.toFixed(decimals) : (end * (1-Math.pow(1-progress,3))).toFixed(decimals);
      if(progress < 1 && !paused) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  document.querySelectorAll('.steps,.concept-grid,.evidence-pair,.collaboration-list').forEach(group => {
    Array.from(group.children).forEach((child, i) => child.style.setProperty('--stagger', `${i * 110}ms`));
  });
  document.querySelectorAll('.join-panel,.donation-card,.faq details,.page-hero h1,.why-hero h1,.network,.chapter,.audience-intro').forEach(el => el.classList.add('reveal'));
  document.querySelectorAll('.concept-image,.photo-strip figure,.restored-band').forEach(el => el.classList.add('image-reveal'));
  // Only visible images participate, with one scheduled frame per scroll update.
  const activeDrift = new Set();
  let scrollFrame = 0;
  function paintScroll() {
    scrollFrame = 0;
    if (paused || document.hidden) return;
    activeDrift.forEach(el => {
      const rect = el.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1, (innerHeight / 2 - rect.top - rect.height / 2) / innerHeight));
      el.style.setProperty('--drift', `${(progress * Number(el.dataset.drift)).toFixed(2)}px`);
      el.style.setProperty('--turn', `${(progress * 18).toFixed(2)}deg`);
    });
  }
  function scheduleScroll() { if (!scrollFrame && !paused) scrollFrame = requestAnimationFrame(paintScroll); }
  if ('IntersectionObserver' in window) {
    const driftObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.isIntersecting ? activeDrift.add(entry.target) : activeDrift.delete(entry.target));
      scheduleScroll();
    }, {rootMargin:'80px'});
    document.querySelectorAll('.hero-image,.closing>img,.photo-strip figure,.dark-chart').forEach((el,i) => {
      el.dataset.drift = el.matches('.photo-strip figure') ? (i%2 ? '55' : '-40') : '65';
      driftObserver.observe(el);
    });
  }
  window.addEventListener('scroll', scheduleScroll, {passive:true});
  window.addEventListener('resize', scheduleScroll, {passive:true});
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { clearTimeout(stageTimer); settleWord(); }
    else scheduleScroll();
  });
  if('IntersectionObserver' in window){
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      if(entry.target.hasAttribute('data-count')) count(entry.target);
      observer.unobserve(entry.target);
    }),{threshold:.15});
    document.querySelectorAll('.reveal,.image-reveal,[data-count]').forEach(el=>observer.observe(el));
  } else { root.classList.remove('motion-on'); }
  document.querySelectorAll('.bar-row').forEach((row,i) => row.style.setProperty('--row-delay', `${(i % 5)*100}ms`));
  const dataScenes = document.querySelectorAll('.chart,.evidence-pair');
  if ('IntersectionObserver' in window) {
    const scenes = new IntersectionObserver(entries => entries.forEach(entry => {
      const scene = entry.target;
      if (entry.isIntersecting) {
        scene.classList.remove('exited'); scene.classList.add('visible');
        scene.querySelectorAll('[data-count]').forEach(el => { finishedCounters.delete(el); count(el); });
      } else {
        scene.classList.toggle('exited', entry.boundingClientRect.bottom < innerHeight / 2);
        scene.classList.remove('visible');
      }
    }), {rootMargin:'-12% 0px -10% 0px', threshold:0});
    dataScenes.forEach(scene => scenes.observe(scene));
  }
  const NS = 'http://www.w3.org/2000/svg';
  function svgEl(tag, attrs) { const el=document.createElementNS(NS,tag); for(const key in attrs) el.setAttribute(key,attrs[key]); return el; }
  document.body.insertAdjacentHTML('afterbegin','<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><symbol id="print" viewBox="0 0 24 28"><g fill="currentColor"><ellipse cx="12" cy="19" rx="6" ry="5.5"/><ellipse cx="4.2" cy="11" rx="2.2" ry="3"/><ellipse cx="9" cy="6" rx="2.3" ry="3.2"/><ellipse cx="15" cy="6" rx="2.3" ry="3.2"/><ellipse cx="19.8" cy="11" rx="2.2" ry="3"/></g></symbol></defs></svg>');
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
      var mobileTrail = window.innerWidth < 900;
      if (!mobileTrail && textStart < 44) { trail.style.display = 'none'; return; }
      trail.style.display = '';
      var top = fr.top - mr.top + 48; trailH = tr.bottom - fr.top - 60;
      var w = mainEl.clientWidth, x0 = mobileTrail ? 14 : textStart / 2, amp = mobileTrail ? 4 : Math.min((textStart - 24) / 2, 46);
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
        var u = svgEl('use', { href: '#print', width: mobileTrail ? 9 : 13, height: mobileTrail ? 11 : 15, x: mobileTrail ? -4.5 : -6.5, y: mobileTrail ? -5.5 : -7.5,
          transform: 'translate(' + (xAt(py) + side * (mobileTrail ? 6 : 9)).toFixed(1) + ' ' + py + ') rotate(' + (ang + 90).toFixed(1) + ')' });
        trail.appendChild(u); paws.push({ el: u, y: py });
      }
      updateTrail();
    };
    var updateTrail = function () {
      if (!maskPath) return;
      var p = paused ? 1 : Math.max(0, Math.min(1, (window.innerHeight * 0.7 - trail.getBoundingClientRect().top) / trailH));
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
    toggle.addEventListener('click', updateTrail);
    reduced.addEventListener('change', updateTrail);
    buildTrail();
  }

  document.querySelectorAll('[data-replay]').forEach(button=>button.addEventListener('click',()=>{
    const chart=document.getElementById(button.dataset.replay);
    if(paused) return;
    chart.classList.remove('visible');
    // Commit the reset before the next animated frame.
    void chart.offsetWidth;
    requestAnimationFrame(()=>chart.classList.add('visible'));
  }));
  const form = document.getElementById('interest-form');
  if (form) {
    const email = form.elements.email;
    const instagram = form.elements.instagram;
    const status = document.getElementById('form-status');
    form.querySelector('button[type="submit"]').disabled = false;
    const validateContact = () => {
      const available = email.value.trim() || instagram.value.trim().replace(/^@/, '');
      email.setCustomValidity(available ? '' : 'Please provide an email address or Instagram handle.');
    };
    [email, instagram].forEach(input => input.addEventListener('input', () => {
      validateContact(); status.textContent = '';
    }));
    form.querySelector('button[type="submit"]').addEventListener('click', validateContact);
    form.addEventListener('submit', e => {
      validateContact();
      if (!form.reportValidity()) { e.preventDefault(); return; }
      if (form.dataset.delivery !== 'active') {
        e.preventDefault();
        status.textContent = 'Registration isn’t open yet. Your details have not been sent or saved. Please check back soon.';
        return;
      }
      // Native POST preserves FormSubmit CAPTCHA and provider error handling.
      // The provider confirms submission; never claim delivery optimistically.
    });
  }
  // Donation prototype: purely local UI, with no payment or submission service.
  const donation = document.getElementById('donation-form');
  if (donation) {
    const custom = document.getElementById('custom-amount');
    const customWrap = document.getElementById('custom-amount-wrap');
    const label = document.getElementById('donate-label');
    const status = document.getElementById('donation-status');
    const dialog = document.getElementById('donation-dialog');
    const money = new Intl.NumberFormat('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2});
    const formatAmount = value => Number.isInteger(value) ? '$' + value.toLocaleString('en-US') : money.format(value);
    function amount() {
      const selected = donation.querySelector('input[name="amount"]:checked');
      return selected.value === 'custom' ? Number(custom.value) : Number(selected.value);
    }
    function updateDonation() {
      const isCustom = donation.querySelector('input[name="amount"]:checked').value === 'custom';
      customWrap.hidden = !isCustom;
      custom.disabled = !isCustom;
      custom.required = isCustom;
      const value = amount();
      label.textContent = Number.isFinite(value) && value >= 1 ? 'Donate ' + formatAmount(value) : 'Preview donation';
      status.textContent = '';
    }
    donation.addEventListener('change', updateDonation);
    custom.addEventListener('input', updateDonation);
    donation.addEventListener('submit', e => {
      e.preventDefault();
      const value = amount();
      if (!Number.isFinite(value) || value < 1 || !donation.reportValidity()) {
        status.textContent = 'Enter an amount of at least $1 to try the demo.';
        return;
      }
      document.getElementById('donation-preview-amount').textContent = 'You’re previewing a ' + formatAmount(value) + ' one-time gift.';
      dialog.showModal();
    });
    document.getElementById('close-donation').addEventListener('click', () => dialog.close());
    donation.querySelector('button[type="submit"]').disabled = false;
    updateDonation();
  }
})();
