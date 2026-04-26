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

  /* ============================================================
     Phase C — Gallery / Read-more / Activity rendering
     ============================================================ */

  function placeholderFor(item, label) {
    if (window.SheilaData && window.SheilaData.svgPlaceholder) {
      return window.SheilaData.svgPlaceholder(label || item.title || item.role || '', item.themeA, item.themeB, item.icon);
    }
    return '';
  }

  // Gallery modal
  window.openGallery = function (key) {
    var data = window.SheilaData;
    if (!data) return;
    var item = (data.activities || []).find(function (a) { return a.id === key; })
            || (data.experiences || []).find(function (a) { return a.id === key; });
    if (!item) return;
    var images = (item.images && item.images.length) ? item.images
              : (item.gallery && item.gallery.length) ? item.gallery
              : [];
    var videos = item.videos || [];
    var slides = [];
    images.forEach(function (img) {
      slides.push({ kind: 'image', src: typeof img === 'string' ? img : img.src, caption: typeof img === 'string' ? '' : (img.caption || '') });
    });
    videos.forEach(function (vid) {
      slides.push({ kind: 'video', src: typeof vid === 'string' ? vid : vid.src, caption: typeof vid === 'string' ? '' : (vid.caption || '') });
    });
    if (!slides.length) {
      // Single placeholder
      slides.push({ kind: 'image', src: placeholderFor(item, item.title || item.role || 'Documentation'), caption: 'Foto/video akan ditambahkan' });
    }

    var current = 0;
    var thumbsHtml = slides.map(function (s, i) {
      var isVideo = s.kind === 'video';
      var thumb = isVideo
        ? '<div class="gallery__thumb-vid"><i data-lucide="play"></i></div>'
        : '<img src="' + s.src + '" alt="thumb"/>';
      return '<button type="button" class="gallery__thumb' + (i === 0 ? ' is-active' : '') + '" data-idx="' + i + '">' + thumb + '</button>';
    }).join('');

    var html =
      '<div class="gallery">' +
        '<div class="gallery__stage">' +
          '<button type="button" class="gallery__nav gallery__nav--prev" aria-label="Previous"><i data-lucide="chevron-left"></i></button>' +
          '<div class="gallery__media" data-media></div>' +
          '<button type="button" class="gallery__nav gallery__nav--next" aria-label="Next"><i data-lucide="chevron-right"></i></button>' +
        '</div>' +
        '<div class="gallery__caption" data-caption></div>' +
        '<div class="gallery__meta">' +
          (item.date ? '<span class="gallery__chip"><i data-lucide="calendar"></i> ' + item.date + '</span>' : '') +
          (item.role ? '<span class="gallery__chip"><i data-lucide="user"></i> ' + item.role + '</span>' : '') +
          (item.category ? '<span class="gallery__chip"><i data-lucide="tag"></i> ' + item.category + '</span>' : '') +
          (item.skills && item.skills.length ? '<span class="gallery__chip"><i data-lucide="sparkles"></i> ' + item.skills.join(', ') + '</span>' : '') +
        '</div>' +
        (item.description ? '<p class="gallery__desc">' + item.description + '</p>' : '') +
        '<div class="gallery__thumbs">' + thumbsHtml + '</div>' +
      '</div>';

    var modal = openModal({
      title: item.title || item.role,
      subtitle: item.category ? item.category : '',
      html: html,
      size: 'gallery'
    });

    function render() {
      var slide = slides[current];
      var media = modal.querySelector('[data-media]');
      var caption = modal.querySelector('[data-caption]');
      if (slide.kind === 'video') {
        var src = slide.src || '';
        var isYouTube = /youtube\.com|youtu\.be/.test(src);
        if (isYouTube) {
          var ytId = (src.match(/(?:v=|be\/)([\w-]{6,})/) || [])[1];
          media.innerHTML = '<iframe src="https://www.youtube.com/embed/' + ytId + '" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
        } else {
          media.innerHTML = '<video controls src="' + src + '"></video>';
        }
      } else {
        media.innerHTML = '<img src="' + slide.src + '" alt="' + (slide.caption || '') + '"/>';
      }
      caption.textContent = slide.caption || '';
      var thumbs = modal.querySelectorAll('.gallery__thumb');
      thumbs.forEach(function (t, i) { t.classList.toggle('is-active', i === current); });
    }
    function go(delta) {
      current = (current + delta + slides.length) % slides.length;
      render();
    }
    modal.querySelector('.gallery__nav--prev').addEventListener('click', function () { go(-1); });
    modal.querySelector('.gallery__nav--next').addEventListener('click', function () { go(1); });
    modal.querySelectorAll('.gallery__thumb').forEach(function (t) {
      t.addEventListener('click', function () {
        current = parseInt(t.getAttribute('data-idx'), 10) || 0;
        render();
      });
    });
    modal.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    });
    render();
  };

  // Read-more modal for experience cards
  window.openDetail = function (key) {
    var data = window.SheilaData;
    if (!data) return;
    var item = (data.experiences || []).find(function (a) { return a.id === key; })
            || (data.activities || []).find(function (a) { return a.id === key; })
            || (data.knowledge || []).find(function (a) { return a.id === key; });
    if (!item) return;

    var bullets = item.details || (item.body ? [item.body] : []);
    var html =
      '<div class="detail">' +
        '<div class="detail__hero" style="background: linear-gradient(135deg, ' + (item.themeA || '#14B8A6') + ', ' + (item.themeB || '#0284C7') + ')">' +
          '<div class="detail__hero-icon"></div>' +
          '<div class="detail__hero-meta">' +
            (item.role || item.title) + (item.company ? ' · ' + item.company : '') +
            (item.period ? '<span>' + item.period + '</span>' : '') +
          '</div>' +
        '</div>' +
        (item.summary ? '<p class="detail__summary">' + item.summary + '</p>' : '') +
        (bullets.length ? '<ul class="detail__list">' + bullets.map(function (b) { return '<li>' + b + '</li>'; }).join('') + '</ul>' : '') +
        (item.skills && item.skills.length ? '<div class="detail__skills">' + item.skills.map(function (s) { return '<span class="chip">' + s + '</span>'; }).join('') + '</div>' : '') +
        '<div class="modal-actions">' +
          '<button type="button" class="btn btn--gradient" data-action="view-gallery" data-gallery="' + item.id + '"><i data-lucide="image"></i> View Gallery</button>' +
          '<button type="button" class="btn btn--outline" data-action="contact-me"><i data-lucide="send"></i> Contact Me</button>' +
        '</div>' +
      '</div>';

    openModal({
      title: item.title || item.role,
      subtitle: item.company || item.category || '',
      html: html,
    });
  };

  // ---------- Render dynamic activity grid (for activities.html / sections) ----------
  function renderActivityGrid(host, options) {
    var data = window.SheilaData; if (!data) return;
    options = options || {};
    var category = options.category || 'All';
    var items = data.activities.filter(function (a) {
      return category === 'All' || a.category === category;
    });
    host.innerHTML = items.map(function (a) {
      var thumb = (a.images && a.images.length) ? a.images[0] : placeholderFor(a, a.title);
      var src = typeof thumb === 'string' ? thumb : thumb.src;
      return '' +
        '<article class="activity-card" data-id="' + a.id + '">' +
          '<div class="activity-card__thumb"><img src="' + src + '" alt="' + a.title + '" loading="lazy"/></div>' +
          '<div class="activity-card__body">' +
            '<span class="activity-card__cat">' + a.category + '</span>' +
            '<h3 class="activity-card__title">' + a.title + '</h3>' +
            '<p class="activity-card__desc">' + a.description + '</p>' +
            '<div class="activity-card__tags">' + (a.tags || []).map(function (t) { return '<span class="chip">' + t + '</span>'; }).join('') + '</div>' +
            '<div class="activity-card__cta">' +
              '<button type="button" class="btn btn--gradient btn--sm" data-action="view-gallery" data-gallery="' + a.id + '"><i data-lucide="image"></i> View Gallery</button>' +
              '<button type="button" class="btn btn--outline btn--sm" data-action="read-more" data-detail="' + a.id + '"><i data-lucide="book-open"></i> Read More</button>' +
            '</div>' +
          '</div>' +
        '</article>';
    }).join('');
    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
  }

  function initActivityHosts() {
    document.querySelectorAll('[data-activity-grid]').forEach(function (host) {
      renderActivityGrid(host, { category: 'All' });
    });
    document.querySelectorAll('[data-activity-filter]').forEach(function (filter) {
      var targetSel = filter.getAttribute('data-activity-filter');
      var target = document.querySelector(targetSel);
      filter.querySelectorAll('button').forEach(function (b) {
        b.addEventListener('click', function () {
          filter.querySelectorAll('button').forEach(function (x) { x.classList.remove('is-active'); });
          b.classList.add('is-active');
          renderActivityGrid(target, { category: b.getAttribute('data-cat') });
        });
      });
    });
  }

  // ---------- Daily Activity rendering ----------
  function renderDailyPosts(host, opts) {
    var data = window.SheilaData; if (!data) return;
    opts = opts || {};
    var keyword = (opts.keyword || '').toLowerCase().trim();
    var category = opts.category || 'All';
    var items = data.dailyPosts.filter(function (p) {
      var matchCat = category === 'All' || p.category === category;
      var matchKey = !keyword || (
        p.title.toLowerCase().indexOf(keyword) !== -1 ||
        p.description.toLowerCase().indexOf(keyword) !== -1 ||
        (p.tags || []).join(' ').toLowerCase().indexOf(keyword) !== -1
      );
      return matchCat && matchKey;
    });
    host.innerHTML = items.length ? items.map(function (p) {
      return '' +
        '<article class="daily-card">' +
          '<div class="daily-card__thumb" style="background: linear-gradient(135deg,' + p.themeA + ',' + p.themeB + ')">' +
            '<svg viewBox="0 0 34 34"><path d="' + p.icon + '" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '</div>' +
          '<div class="daily-card__body">' +
            '<div class="daily-card__meta"><time>' + p.date + '</time><span class="chip chip--sm">' + p.category + '</span></div>' +
            '<h3>' + p.title + '</h3>' +
            '<p>' + p.description + '</p>' +
            '<div class="daily-card__tags">' + (p.tags || []).map(function (t) { return '<span class="chip chip--sm">#' + t + '</span>'; }).join('') + '</div>' +
            '<div class="daily-card__actions">' +
              '<button type="button" class="btn btn--text btn--sm" data-action="copy-quote" data-quote="' + p.title + ': ' + p.description.replace(/"/g, '&quot;') + '"><i data-lucide="copy"></i> Share</button>' +
            '</div>' +
          '</div>' +
        '</article>';
    }).join('') : '<p class="daily-empty">Belum ada post yang cocok dengan filter ini.</p>';
    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
  }

  function initDaily() {
    var host = document.querySelector('[data-daily-grid]');
    if (!host) return;
    var state = { keyword: '', category: 'All' };
    renderDailyPosts(host, state);
    var search = document.querySelector('[data-daily-search]');
    if (search) search.addEventListener('input', function () { state.keyword = search.value; renderDailyPosts(host, state); });
    var filter = document.querySelector('[data-daily-filter]');
    if (filter) {
      filter.querySelectorAll('button').forEach(function (b) {
        b.addEventListener('click', function () {
          filter.querySelectorAll('button').forEach(function (x) { x.classList.remove('is-active'); });
          b.classList.add('is-active');
          state.category = b.getAttribute('data-cat');
          renderDailyPosts(host, state);
        });
      });
    }
  }

  // ---------- Knowledge & Quotes rendering ----------
  function initKnowledgeQuotes() {
    var data = window.SheilaData; if (!data) return;
    var qHost = document.querySelector('[data-quotes-grid]');
    if (qHost) {
      qHost.innerHTML = data.quotes.map(function (q) {
        return '' +
          '<article class="quote-card">' +
            '<svg class="quote-card__mark" viewBox="0 0 32 32"><path d="' + window.SheilaData.icons.quote + '" fill="rgba(20,184,166,0.18)" stroke="currentColor" stroke-width="0"/></svg>' +
            '<p class="quote-card__text">' + q.text + '</p>' +
            (q.author ? '<span class="quote-card__author">— ' + q.author + '</span>' : '') +
            '<button type="button" class="quote-card__copy" data-action="copy-quote" data-quote="' + q.text.replace(/"/g, '&quot;') + '" aria-label="Copy quote"><i data-lucide="copy"></i></button>' +
          '</article>';
      }).join('');
    }
    var kHost = document.querySelector('[data-knowledge-grid]');
    if (kHost) {
      kHost.innerHTML = data.knowledge.map(function (k) {
        return '' +
          '<article class="knowledge-card">' +
            '<div class="knowledge-card__icon" style="background: linear-gradient(135deg,' + k.themeA + ',' + k.themeB + ')">' +
              '<svg viewBox="0 0 34 34"><path d="' + k.icon + '" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            '</div>' +
            '<span class="knowledge-card__cat">' + k.category + '</span>' +
            '<h3>' + k.title + '</h3>' +
            '<p>' + k.summary + '</p>' +
            '<button type="button" class="btn btn--text btn--sm" data-action="read-more" data-detail="' + k.id + '"><i data-lucide="book-open"></i> Read more</button>' +
          '</article>';
      }).join('');
    }
    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
  }

  // ---------- Social tabs ----------
  function initSocialTabs() {
    var section = document.querySelector('[data-social-tabs]');
    if (!section) return;
    var data = window.SheilaData; if (!data) return;
    var tabs = section.querySelectorAll('.social-tabs__tab');
    var grid = section.querySelector('.social-grid');
    function render(platform) {
      var posts = data.socials[platform] || [];
      var profileUrl = data.socialProfileUrls[platform] || '#';
      grid.innerHTML = posts.map(function (p) {
        return '' +
          '<article class="social-card">' +
            '<div class="social-card__head">' +
              '<i data-lucide="' + iconForPlatform(platform) + '"></i>' +
              '<span>' + platform.charAt(0).toUpperCase() + platform.slice(1) + '</span>' +
              (p.date ? '<time>' + p.date + '</time>' : '') +
            '</div>' +
            (p.url
              ? '<div class="social-card__embed"><a href="' + p.url + '" target="_blank" rel="noopener">View original post →</a></div>'
              : '<div class="social-card__embed social-card__embed--placeholder"><i data-lucide="image-plus"></i><p>Social post embed will appear here.</p></div>') +
            '<p class="social-card__caption">' + p.caption + '</p>' +
            '<div class="social-card__actions">' +
              '<button type="button" class="btn btn--text btn--sm" data-action="add-embed"><i data-lucide="link-2"></i> Add Embed Link</button>' +
              '<a href="' + profileUrl + '" target="_blank" rel="noopener" class="btn btn--text btn--sm"><i data-lucide="external-link"></i> Open Profile</a>' +
            '</div>' +
          '</article>';
      }).join('');
      if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
    }
    function iconForPlatform(p) {
      return ({ instagram: 'instagram', facebook: 'facebook', linkedin: 'linkedin', threads: 'at-sign' })[p] || 'share-2';
    }
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        tabs.forEach(function (x) { x.classList.remove('is-active'); });
        t.classList.add('is-active');
        render(t.getAttribute('data-platform'));
      });
    });
    var initial = section.querySelector('.social-tabs__tab.is-active') || tabs[0];
    if (initial) { initial.classList.add('is-active'); render(initial.getAttribute('data-platform')); }
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
    initActivityHosts();
    initDaily();
    initKnowledgeQuotes();
    initSocialTabs();
    initActivitiesPreview();
    initActivityTabs();
    enhanceExperienceCards();
  });

  // ---------- Activities preview (home) ----------
  function initActivitiesPreview() {
    var data = window.SheilaData; if (!data) return;
    var iconForPlatform = function (p) {
      return ({ instagram: 'instagram', facebook: 'facebook', linkedin: 'linkedin', threads: 'at-sign' })[p] || 'share-2';
    };

    var galleryHost = document.querySelector('[data-preview-gallery]');
    if (galleryHost && data.activities) {
      galleryHost.innerHTML = data.activities.slice(0, 3).map(function (a) {
        var thumb = (a.images && a.images.length) ? a.images[0] : placeholderFor(a, a.title);
        return '' +
          '<article class="activity-card">' +
            '<div class="activity-card__thumb"><img src="' + thumb + '" alt="' + (a.title || '') + '"/></div>' +
            '<div class="activity-card__body">' +
              '<span class="activity-card__cat">' + (a.category || '') + '</span>' +
              '<h3 class="activity-card__title">' + a.title + '</h3>' +
              '<p class="activity-card__desc">' + (a.description || '') + '</p>' +
              '<div class="activity-card__cta">' +
                '<button type="button" class="btn btn--text btn--sm" data-action="view-gallery" data-gallery="' + a.id + '"><i data-lucide="image"></i> View</button>' +
                '<button type="button" class="btn btn--text btn--sm" data-action="read-more" data-detail="' + a.id + '"><i data-lucide="book-open"></i> Detail</button>' +
              '</div>' +
            '</div>' +
          '</article>';
      }).join('');
    }

    var dailyHost = document.querySelector('[data-preview-daily]');
    if (dailyHost && data.dailyPosts) {
      dailyHost.innerHTML = data.dailyPosts.slice(0, 3).map(function (d) {
        return '' +
          '<article class="daily-card">' +
            '<div class="daily-card__thumb" style="background: linear-gradient(135deg,' + d.themeA + ',' + d.themeB + ')">' +
              '<svg viewBox="0 0 34 34"><path d="' + d.icon + '" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            '</div>' +
            '<div class="daily-card__body">' +
              '<div class="daily-card__meta"><time>' + d.date + '</time><span class="chip chip--sm">' + d.category + '</span></div>' +
              '<h3>' + d.title + '</h3>' +
              '<p>' + d.description + '</p>' +
            '</div>' +
          '</article>';
      }).join('');
    }

    var quotesHost = document.querySelector('[data-preview-quotes]');
    if (quotesHost && data.quotes) {
      quotesHost.innerHTML = data.quotes.slice(0, 2).map(function (q) {
        return '' +
          '<article class="quote-card">' +
            '<svg class="quote-card__mark" viewBox="0 0 32 32"><path d="' + data.icons.quote + '" fill="rgba(20,184,166,0.18)" stroke="currentColor" stroke-width="0"/></svg>' +
            '<p class="quote-card__text">' + q.text + '</p>' +
            (q.author ? '<span class="quote-card__author">— ' + q.author + '</span>' : '') +
            '<button type="button" class="quote-card__copy" data-action="copy-quote" data-quote="' + q.text.replace(/"/g, '&quot;') + '" aria-label="Copy quote"><i data-lucide="copy"></i></button>' +
          '</article>';
      }).join('');
    }

    var socialHost = document.querySelector('[data-preview-social]');
    if (socialHost && data.socials) {
      var preview = [];
      ['instagram', 'linkedin'].forEach(function (plat) {
        var p = (data.socials[plat] || [])[0];
        if (p) preview.push({ platform: plat, post: p });
      });
      socialHost.innerHTML = preview.map(function (s) {
        return '' +
          '<article class="social-card">' +
            '<div class="social-card__head">' +
              '<i data-lucide="' + iconForPlatform(s.platform) + '"></i>' +
              '<span>' + s.platform.charAt(0).toUpperCase() + s.platform.slice(1) + '</span>' +
              (s.post.date ? '<time>' + s.post.date + '</time>' : '') +
            '</div>' +
            '<div class="social-card__embed social-card__embed--placeholder"><i data-lucide="image-plus"></i><p>Social post embed will appear here.</p></div>' +
            '<p class="social-card__caption">' + s.post.caption + '</p>' +
          '</article>';
      }).join('');
    }

    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
  }

  // ---------- Activity page tabs (Gallery / Daily / Social / Quotes) ----------
  function initActivityTabs() {
    var bar = document.querySelector('[data-activity-tabs]');
    if (!bar) return;
    var tabs = bar.querySelectorAll('button[data-tab]');
    var panels = document.querySelectorAll('[data-tab-panel]');
    function activate(name) {
      tabs.forEach(function (t) { t.classList.toggle('is-active', t.getAttribute('data-tab') === name); });
      panels.forEach(function (p) { p.classList.toggle('is-active', p.getAttribute('data-tab-panel') === name); });
    }
    tabs.forEach(function (t) {
      t.addEventListener('click', function () { activate(t.getAttribute('data-tab')); });
    });
    var initial = bar.querySelector('button.is-active') || tabs[0];
    if (initial) activate(initial.getAttribute('data-tab'));
  }

  function enhanceExperienceCards() {
    document.querySelectorAll('.exp-card[data-theme]').forEach(function (card) {
      if (card.querySelector('.exp-card__cta')) return;
      var key = card.getAttribute('data-theme');
      var cta = document.createElement('div');
      cta.className = 'exp-card__cta';
      cta.innerHTML =
        '<button type="button" class="btn btn--text btn--sm" data-action="read-more" data-detail="' + key + '"><i data-lucide="book-open"></i> Read more</button>' +
        '<button type="button" class="btn btn--text btn--sm" data-action="view-gallery" data-gallery="' + key + '"><i data-lucide="image"></i> Gallery</button>';
      card.appendChild(cta);
    });
    // Bento portfolio cards → wire to gallery (use data-id or label fallback)
    document.querySelectorAll('.bento__item').forEach(function (card, i) {
      if (card.querySelector('.bento__cta')) return;
      var id = card.getAttribute('data-id');
      if (!id) {
        // Heuristic: map to first activity
        var fallback = (window.SheilaData && window.SheilaData.activities && window.SheilaData.activities[i % window.SheilaData.activities.length]);
        id = fallback ? fallback.id : 'social-microblog';
      }
      var cta = document.createElement('div');
      cta.className = 'bento__cta';
      cta.innerHTML =
        '<button type="button" class="btn btn--text btn--sm" data-action="view-gallery" data-gallery="' + id + '"><i data-lucide="image"></i> View Gallery</button>' +
        '<button type="button" class="btn btn--text btn--sm" data-action="read-more" data-detail="' + id + '"><i data-lucide="book-open"></i> Read More</button>';
      card.appendChild(cta);
    });
    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
  }
})();
