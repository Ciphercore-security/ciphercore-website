// =========================================================
// CipherCore Security — Main Script
// =========================================================

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Footer year ----------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Scroll progress bar ----------
  const fill = document.getElementById('scrollFill');
  if (fill) {
    function updateScroll() {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? Math.min(100, Math.round((scrolled / max) * 100)) : 0;
      fill.style.width = pct + '%';
    }
    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();
  }

  // ---------- Mobile nav toggle ----------
  const navToggle = document.querySelector('.nav-toggle');
  const navEl = document.querySelector('.nav');
  if (navToggle && navEl) {
    navToggle.addEventListener('click', () => {
      navEl.classList.toggle('menu-open');
    });
    navEl.querySelectorAll('.nav-links a').forEach(a => {
      a.addEventListener('click', () => navEl.classList.remove('menu-open'));
    });
  }

  // ---------- Scan terminal typing ----------
  const scanLines = [
    { cls: 'ok',   text: '✓ firewall rules — verified' },
    { cls: 'flag', text: '⚑ 2 exposed ports flagged' },
    { cls: 'ok',   text: '✓ staff phishing check — passed' },
    { cls: 'flag', text: '⚑ intern almost clicked a link (caught it)' },
    { cls: 'ok',   text: '✓ coffee reserves — critically low' }
  ];

  const logEl = document.getElementById('scanLog');

  if (logEl) {
    if (reduceMotion) {
      // Static render
      scanLines.forEach(l => {
        const div = document.createElement('div');
        div.className = l.cls;
        div.textContent = l.text;
        logEl.appendChild(div);
      });
    } else {
      let lineIndex = 0;

      function typeScanLog() {
        logEl.innerHTML = '';
        lineIndex = 0;
        typeLine();
      }

      function typeLine() {
        if (lineIndex >= scanLines.length) {
          setTimeout(typeScanLog, 3600);
          return;
        }

        const { cls, text } = scanLines[lineIndex];
        const div = document.createElement('div');
        div.className = cls;

        const textSpan = document.createElement('span');
        const cursor = document.createElement('span');
        cursor.className = 'type-cursor';
        cursor.textContent = '▌';

        div.appendChild(textSpan);
        div.appendChild(cursor);
        logEl.appendChild(div);

        let i = 0;
        (function typeChar() {
          if (i < text.length) {
            textSpan.textContent = text.slice(0, i + 1);
            i++;
            setTimeout(typeChar, 26);
          } else {
            cursor.remove();
            lineIndex++;
            setTimeout(typeLine, 320);
          }
        })();
      }

      typeScanLog();
    }
  }

  // ---------- Scroll reveal ----------
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll(
      'section .tile, section .section-head, section .split-grid, section .mission-box, section .stats-strip, section .row-list'
    ).forEach(el => {
      el.classList.add('reveal-ready');
      observer.observe(el);
    });
  }

  // ---------- Console easter egg ----------
  console.log('%c👀 poking around the console?', 'color:#4EC3F0; font-size:14px; font-weight:bold;');
  console.log('%cWe like your style. If you can find a real gap, tell us: hello@ciphercoresecurity.co.za', 'color:#93A3C4; font-size:12px;');
})();
/* =========================================================
   HERO — BINARY RAIN CANVAS
   ========================================================= */
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const ctx = canvas.getContext('2d');
  let width, height, columns, drops;
  const fontSize = 16;
  const chars = '01'.split('');

  function resize() {
    const parent = canvas.parentElement;
    width = parent.offsetWidth;
    height = parent.offsetHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    columns = Math.floor(width / fontSize);
    drops = new Array(columns).fill(0).map(() => Math.random() * -height);
  }

  function draw() {
    ctx.fillStyle = 'rgba(10, 18, 38, 0.10)';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#2563eb';
    ctx.font = fontSize + 'px ui-monospace, monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i];

      ctx.fillText(char, x, y);

      if (y > height && Math.random() > 0.975) {
        drops[i] = 0;
      } else {
        drops[i] += fontSize * 0.5;
      }
    }
  }

  let rafId = null;
  function loop() {
    draw();
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    if (rafId) return;
    loop();
  }

  function stop() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // Resize handling
  window.addEventListener('resize', () => {
    resize();
  });

  // Pause when tab not visible (saves battery)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  // Init
  resize();
  start();
})();
