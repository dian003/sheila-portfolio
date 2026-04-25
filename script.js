/* ============================================================
   Sheila Annisa — Premium 3D Portfolio interactions
   ============================================================ */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

  // ---------- Lucide icons ----------
  function initIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    } else {
      window.setTimeout(initIcons, 80);
    }
  }

  // ---------- Mobile nav ----------
  function initMobileMenu() {
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('navMenu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Tutup menu navigasi' : 'Buka menu navigasi');
    });

    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---------- Sticky nav style + scroll progress ----------
  function initScroll() {
    var nav = document.getElementById('nav');
    var bar = document.getElementById('scrollBar');
    var docEl = document.documentElement;
    var ticking = false;

    function update() {
      var y = window.scrollY || window.pageYOffset;
      if (nav) nav.classList.toggle('is-scrolled', y > 12);
      if (bar) {
        var max = (docEl.scrollHeight - window.innerHeight) || 1;
        var pct = Math.min(100, Math.max(0, (y / max) * 100));
        bar.style.width = pct + '%';
      }
      ticking = false;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update, { passive: true });
  }

  // ---------- Reveal on scroll ----------
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window) || prefersReducedMotion) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  // ---------- Active nav link ----------
  function initActiveLink() {
    var links = document.querySelectorAll('.nav__menu a[href^="#"]');
    var sections = [];
    links.forEach(function (a) {
      var id = a.getAttribute('href');
      if (!id || id.charAt(0) !== '#') return;
      var sec = document.querySelector(id);
      if (sec) sections.push({ link: a, sec: sec });
    });
    if (!sections.length || !('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var match = sections.find(function (s) { return s.sec === entry.target; });
        if (!match) return;
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('is-active'); });
          match.link.classList.add('is-active');
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(function (s) { io.observe(s.sec); });
  }

  // ---------- Hero typing rotator ----------
  function initTypeRotator() {
    var words = document.querySelectorAll('.hero__type-word');
    if (words.length < 2) return;
    var idx = 0;
    setInterval(function () {
      words[idx].classList.remove('is-active');
      idx = (idx + 1) % words.length;
      words[idx].classList.add('is-active');
    }, 2400);
  }

  // ---------- Counter animation ----------
  function initCounters() {
    var counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    function animate(el) {
      var target = parseFloat(el.dataset.target || '0');
      var decimals = parseInt(el.dataset.decimals || '0', 10);
      var suffix = el.dataset.suffix || '';
      if (prefersReducedMotion) {
        el.textContent = target.toFixed(decimals) + suffix;
        return;
      }
      var duration = 1400;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = (target * eased).toFixed(decimals);
        el.textContent = val + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toFixed(decimals) + suffix;
      }
      requestAnimationFrame(step);
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate(entry.target);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { io.observe(el); });
    } else {
      counters.forEach(animate);
    }
  }

  // ---------- GPA progress ring ----------
  function initRing() {
    var rings = document.querySelectorAll('.ring-progress');
    if (!rings.length) return;
    function animateRing(el) {
      var target = parseFloat(el.dataset.target || '0');
      var max = parseFloat(el.dataset.max || '4');
      var pct = Math.min(1, target / max);
      var len = parseFloat(el.getAttribute('stroke-dasharray') || '314');
      var offset = len * (1 - pct);
      requestAnimationFrame(function () {
        el.style.strokeDashoffset = String(offset);
      });
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateRing(entry.target);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      rings.forEach(function (el) { io.observe(el); });
    } else {
      rings.forEach(animateRing);
    }
  }

  // ---------- 3D tilt hover ----------
  function initTilt() {
    if (isCoarsePointer || prefersReducedMotion) return;
    var els = document.querySelectorAll('[data-tilt]');
    els.forEach(function (el) {
      var rect = null;
      var raf = 0;
      function update(x, y) {
        if (!rect) rect = el.getBoundingClientRect();
        var px = (x - rect.left) / rect.width - 0.5;
        var py = (y - rect.top) / rect.height - 0.5;
        var rx = (-py * 6).toFixed(2);
        var ry = (px * 8).toFixed(2);
        el.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateZ(0)';
      }
      el.addEventListener('mouseenter', function () { rect = el.getBoundingClientRect(); });
      el.addEventListener('mousemove', function (e) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () { update(e.clientX, e.clientY); });
      });
      el.addEventListener('mouseleave', function () {
        cancelAnimationFrame(raf);
        rect = null;
        el.style.transform = '';
      });
    });
  }

  // ---------- Magnetic buttons ----------
  function initMagnetic() {
    if (isCoarsePointer || prefersReducedMotion) return;
    document.querySelectorAll('.magnetic').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width / 2) * 0.18;
        var dy = (e.clientY - r.top - r.height / 2) * 0.18;
        el.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  // ---------- Cursor glow ----------
  function initCursorGlow() {
    if (isCoarsePointer || prefersReducedMotion) return;
    var glow = document.getElementById('cursorGlow');
    if (!glow) return;
    var raf = 0;
    document.addEventListener('mousemove', function (e) {
      glow.classList.add('is-visible');
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
      });
    });
    document.addEventListener('mouseleave', function () { glow.classList.remove('is-visible'); });
  }

  // ---------- Parallax floating tiles ----------
  function initParallax() {
    if (prefersReducedMotion) return;
    var els = document.querySelectorAll('.mini-tile, .hero-badge');
    if (!els.length) return;
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY || window.pageYOffset;
        if (y > window.innerHeight) { ticking = false; return; }
        els.forEach(function (el, i) {
          var speed = (i % 3 === 0) ? 0.04 : (i % 3 === 1) ? 0.07 : 0.05;
          el.style.translate = '0 ' + (-y * speed) + 'px';
        });
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---------- Contact form ----------
  function initContactForm() {
    var form = document.getElementById('contactForm');
    var status = document.getElementById('contactStatus');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.elements.namedItem('name');
      var email = form.elements.namedItem('email');
      var message = form.elements.namedItem('message');
      var btn = form.querySelector('button[type="submit"]');

      if (status) {
        status.classList.remove('is-error');
        status.textContent = '';
      }

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        if (status) {
          status.classList.add('is-error');
          status.textContent = 'Mohon lengkapi semua kolom terlebih dahulu.';
        }
        return;
      }
      var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(email.value)) {
        if (status) {
          status.classList.add('is-error');
          status.textContent = 'Format email tidak valid.';
        }
        return;
      }

      if (btn) btn.classList.add('is-success');
      if (status) status.textContent = 'Terima kasih! Membuka aplikasi email Anda…';

      var subject = encodeURIComponent('Pesan dari Portfolio — ' + name.value);
      var body = encodeURIComponent(
        'Halo Sheila,\n\n' + message.value +
        '\n\nSalam,\n' + name.value + '\n' + email.value
      );

      window.setTimeout(function () {
        window.location.href = 'mailto:sheilaannisa216@gmail.com?subject=' + subject + '&body=' + body;
        window.setTimeout(function () {
          if (btn) btn.classList.remove('is-success');
          form.reset();
          if (status) status.textContent = '';
        }, 1800);
      }, 600);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initIcons();
    initMobileMenu();
    initScroll();
    initReveal();
    initActiveLink();
    initTypeRotator();
    initCounters();
    initRing();
    initTilt();
    initMagnetic();
    initCursorGlow();
    initParallax();
    initContactForm();
  });
})();
