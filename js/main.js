// =========================================================
// CipherCore Security — Main Script
// =========================================================

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Footer year ----------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Mobile nav toggle ----------
  const navToggle = document.querySelector('.nav-toggle');
  const navEl = document.querySelector('.nav');
  if (navToggle && navEl) {
    navToggle.addEventListener('click', () => navEl.classList.toggle('menu-open'));
    navEl.querySelectorAll('.nav-links a').forEach(a => {
      a.addEventListener('click', () => navEl.classList.remove('menu-open'));
    });
  }

  // ---------- SITE-WIDE BINARY RAIN ----------
  const canvas = document.getElementById('siteCanvas');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    let width, height, columns, drops;
    const fontSize = 16;
    const chars = '01'.split('');

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
      columns = Math.floor(width / fontSize);
      drops = new Array(columns).fill(0).map(() => Math.random() * -height);
    }

    function draw() {
      // Clear with a transparent fade to keep the trail
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, width, height);

      // Draw characters
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
    function loop() { draw(); rafId = requestAnimationFrame(loop); }
    function start() { if (!rafId) loop(); }
    function stop() { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());

    resize();
    start();
  }

  // ---------- Terminal typing ----------
  const terminalBody = document.querySelector('.terminal-body');
  if (terminalBody && !reduceMotion) {
    const lines = [
      { prompt: '$', cmd: 'ciphercore --status', out: '→ PROTECTED · 0 threats active', cls: 'ok' },
      { prompt: '$', cmd: 'ciphercore --mission', out: '→ Making cybersecurity make sense.', cls: 'hl' },
      { prompt: '$', cmd: 'ciphercore --training', out: '→ Awareness · Phishing · Refreshers', cls: 'ok' }
    ];
    let currentLine = 0;

    function clearTerminal() { terminalBody.innerHTML = ''; }

    function typeLine() {
      if (currentLine >= lines.length) {
        setTimeout(() => { clearTerminal(); currentLine = 0; typeLine(); }, 3200);
        return;
      }
      const line = lines[currentLine];
      const wrapper = document.createElement('span');
      wrapper.className = 'terminal-line';
      wrapper.innerHTML = '<span class="prompt">' + line.prompt + '</span> ';
      terminalBody.appendChild(wrapper);

      const cmdSpan = document.createElement('span');
      wrapper.appendChild(cmdSpan);
      const cursor = document.createElement('span');
      cursor.className = 'terminal-cursor';
      wrapper.appendChild(cursor);

      let i = 0;
      (function typeCmd() {
        if (i < line.cmd.length) {
          cmdSpan.textContent = line.cmd.slice(0, i + 1);
          i++;
          setTimeout(typeCmd, 40);
        } else {
          cursor.remove();
          setTimeout(() => {
            const outLine = document.createElement('span');
            outLine.className = 'terminal-line';
            outLine.innerHTML = '<span class="' + line.cls + '">' + line.out + '</span>';
            terminalBody.appendChild(outLine);
            currentLine++;
            setTimeout(typeLine, 900);
          }, 400);
        }
      })();
    }

    typeLine();
  }

  // ---------- Count-up stats ----------
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  if (statNums.length && !reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.dataset.target);
          const suffix = el.dataset.suffix || '';
          const duration = 1600;
          const start = performance.now();

          function tick(now) {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const value = Math.floor(target * eased);
            el.textContent = value.toLocaleString() + suffix;
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = target.toLocaleString() + suffix;
          }
          requestAnimationFrame(tick);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.4 });

    statNums.forEach(el => observer.observe(el));
  }

  // ---------- Console easter egg ----------
  console.log('%c🔒 CipherCore Security', 'color:#4EC3F0; font-size:14px; font-weight:bold;');
  console.log('%cCyber awareness training — info@ciphercoresecurity.co.za', 'color:#64748b; font-size:12px;');
})();
