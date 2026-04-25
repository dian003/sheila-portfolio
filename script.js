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
    var els = document.querySelectorAll('.mini-card, .hero-badge, .stage__leaf, .stage__flower');
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

  /* ============================================================
     Phase A/B — Theme toggle, Toast, Modal, Functional buttons
     ============================================================ */

  // ---------- Theme toggle (light/dark with localStorage + system pref) ----------
  function initTheme() {
    var stored = null;
    try { stored = localStorage.getItem('sheila-theme'); } catch (e) {}
    var systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || (systemDark ? 'dark' : 'light');
    applyTheme(theme);

    var toggleBtns = document.querySelectorAll('[data-action="theme-toggle"]');
    toggleBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        try { localStorage.setItem('sheila-theme', next); } catch (e) {}
        showToast({
          type: 'info',
          title: next === 'dark' ? 'Dark mode' : 'Light mode',
          message: 'Theme changed to ' + (next === 'dark' ? 'Dark Mode.' : 'Light Mode.')
        });
      });
    });
  }
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#020617' : '#F8FAFC');
  }

  // ---------- Toast notification system ----------
  var toastContainer = null;
  function ensureToastContainer() {
    if (toastContainer) return toastContainer;
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-stack';
    toastContainer.setAttribute('role', 'region');
    toastContainer.setAttribute('aria-live', 'polite');
    toastContainer.setAttribute('aria-label', 'Notifications');
    document.body.appendChild(toastContainer);
    return toastContainer;
  }
  function showToast(opts) {
    opts = opts || {};
    var type = opts.type || 'info';
    var title = opts.title || '';
    var message = opts.message || '';
    var duration = typeof opts.duration === 'number' ? opts.duration : 3600;
    var container = ensureToastContainer();
    var toast = document.createElement('div');
    toast.className = 'toast toast--' + type;
    var iconMap = { success: 'check-circle-2', error: 'alert-circle', warning: 'alert-triangle', info: 'info' };
    toast.innerHTML =
      '<div class="toast__icon"><i data-lucide="' + (iconMap[type] || 'info') + '"></i></div>' +
      '<div class="toast__body">' +
        (title ? '<div class="toast__title">' + title + '</div>' : '') +
        '<div class="toast__msg">' + message + '</div>' +
      '</div>' +
      '<button type="button" class="toast__close" aria-label="Close"><i data-lucide="x"></i></button>' +
      '<div class="toast__bar"><span style="animation-duration:' + duration + 'ms"></span></div>';
    container.appendChild(toast);
    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
    var close = function () {
      toast.classList.add('is-leaving');
      window.setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 280);
    };
    toast.querySelector('.toast__close').addEventListener('click', close);
    var timer = window.setTimeout(close, duration);
    toast.addEventListener('mouseenter', function () { window.clearTimeout(timer); });
    toast.addEventListener('mouseleave', function () { timer = window.setTimeout(close, 1500); });
    requestAnimationFrame(function () { toast.classList.add('is-visible'); });
    return toast;
  }
  window.showToast = showToast;

  // ---------- Modal system ----------
  function openModal(opts) {
    opts = opts || {};
    var existing = document.querySelector('.modal.is-open');
    if (existing) closeModal(existing);

    var modal = document.createElement('div');
    modal.className = 'modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    if (opts.title) modal.setAttribute('aria-label', opts.title);
    var sizeClass = opts.size === 'gallery' ? 'modal__panel--gallery' : '';
    modal.innerHTML =
      '<div class="modal__backdrop" data-modal-close></div>' +
      '<div class="modal__panel ' + sizeClass + '">' +
        '<button type="button" class="modal__close" aria-label="Close" data-modal-close><i data-lucide="x"></i></button>' +
        (opts.title ? '<header class="modal__header"><h2>' + opts.title + '</h2>' + (opts.subtitle ? '<p>' + opts.subtitle + '</p>' : '') + '</header>' : '') +
        '<div class="modal__body">' + (opts.html || '') + '</div>' +
      '</div>';
    document.body.appendChild(modal);
    document.body.classList.add('has-modal');
    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
    requestAnimationFrame(function () { modal.classList.add('is-open'); });

    function onKey(e) { if (e.key === 'Escape') closeModal(modal); }
    document.addEventListener('keydown', onKey);
    modal.addEventListener('click', function (e) {
      if (e.target.closest('[data-modal-close]')) closeModal(modal);
    });
    modal._cleanup = function () { document.removeEventListener('keydown', onKey); };
    if (typeof opts.onOpen === 'function') opts.onOpen(modal);
    return modal;
  }
  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.classList.add('is-closing');
    if (modal._cleanup) modal._cleanup();
    window.setTimeout(function () {
      if (modal.parentNode) modal.parentNode.removeChild(modal);
      if (!document.querySelector('.modal')) document.body.classList.remove('has-modal');
    }, 280);
  }
  window.openModal = openModal;
  window.closeModal = closeModal;

  // ---------- Functional buttons ----------
  function initActions() {
    document.body.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action]');
      if (!btn) return;
      var action = btn.getAttribute('data-action');
      switch (action) {
        case 'view-profile': {
          e.preventDefault();
          var about = document.getElementById('about');
          if (about) about.scrollIntoView({ behavior: 'smooth', block: 'start' });
          break;
        }
        case 'contact-me': {
          e.preventDefault();
          var contact = document.getElementById('contact');
          if (contact) contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
          showToast({ type: 'info', title: 'Contact section', message: 'Contact section opened.' });
          break;
        }
        case 'download-cv': {
          e.preventDefault();
          openModal({
            title: 'Download CV',
            subtitle: 'Status file CV',
            html: '<div class="modal-icon"><i data-lucide="file-text"></i></div>' +
                  '<p>CV file will be added soon. Untuk sementara, silakan hubungi via email atau WhatsApp untuk meminta CV terbaru.</p>' +
                  '<div class="modal-actions">' +
                    '<a class="btn btn--gradient" href="mailto:sheilaannisa216@gmail.com?subject=CV%20Request"><i data-lucide="mail"></i> Email Me</a>' +
                    '<a class="btn btn--outline" href="https://wa.me/6281280885672" target="_blank" rel="noopener"><i data-lucide="message-circle"></i> WhatsApp Me</a>' +
                  '</div>'
          });
          showToast({ type: 'warning', title: 'CV file', message: 'CV file will be available soon.' });
          break;
        }
        case 'email-me': {
          window.location.href = 'mailto:sheilaannisa216@gmail.com';
          break;
        }
        case 'whatsapp-me': {
          window.open('https://wa.me/6281280885672', '_blank', 'noopener');
          break;
        }
        case 'linkedin-me': {
          window.open('https://www.linkedin.com/in/sheilaannisa213', '_blank', 'noopener');
          break;
        }
        case 'view-gallery': {
          e.preventDefault();
          var key = btn.getAttribute('data-gallery');
          if (window.openGallery) window.openGallery(key);
          break;
        }
        case 'read-more': {
          e.preventDefault();
          var key2 = btn.getAttribute('data-detail');
          if (window.openDetail) window.openDetail(key2);
          break;
        }
        case 'copy-quote': {
          var q = btn.getAttribute('data-quote') || (btn.closest('.quote-card') && btn.closest('.quote-card').querySelector('.quote-card__text') && btn.closest('.quote-card').querySelector('.quote-card__text').textContent) || '';
          if (q && navigator.clipboard) {
            navigator.clipboard.writeText(q.trim()).then(function () {
              showToast({ type: 'success', title: 'Copied', message: 'Quote copied to clipboard.' });
            });
          }
          break;
        }
        case 'add-embed': {
          showToast({ type: 'info', title: 'Add embed', message: 'Embed link form will be available soon. For now, edit data.js to add real posts.' });
          break;
        }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initIcons();
    initTheme();
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
    initActions();
  });
})();
