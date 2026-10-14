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
