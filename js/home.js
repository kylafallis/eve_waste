/* Home page interactions */

// Dot timeline (How It Works)
const timelineEl = document.getElementById('howTimeline');
if (timelineEl) {
  const dots = timelineEl.querySelectorAll('.timeline__dot');
  const panels = timelineEl.querySelectorAll('.timeline__panel');
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const step = dot.dataset.step;
      dots.forEach(d => { d.classList.remove('is-active'); d.setAttribute('aria-expanded', 'false'); });
      panels.forEach(p => p.classList.remove('is-active'));
      dot.classList.add('is-active');
      dot.setAttribute('aria-expanded', 'true');
      timelineEl.querySelector(`[data-panel="${step}"]`).classList.add('is-active');
    });
  });
}

// Vision values accordion (Long-Term Vision)
document.querySelectorAll('.vision-value').forEach(btn => {
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.vision-value').forEach(b => b.setAttribute('aria-expanded', 'false'));
    if (!isOpen) btn.setAttribute('aria-expanded', 'true');
  });
});

// Hero canvas (disabled — background is now CSS gradient)
const heroCanvas = document.getElementById('heroCanvas');
if (heroCanvas) {
  const ctx = heroCanvas.getContext('2d');
  let particles = [];
  let animId;

  function resize() {
    heroCanvas.width = heroCanvas.offsetWidth;
    heroCanvas.height = heroCanvas.offsetHeight;
  }

  function createParticles() {
    const count = Math.min(55, Math.floor((heroCanvas.width * heroCanvas.height) / 16000));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * heroCanvas.width,
        y: Math.random() * heroCanvas.height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.8 + 0.6,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
    const maxDist = 150;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.018;
      if (p.x < 0 || p.x > heroCanvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > heroCanvas.height) p.vy *= -1;
    });

    // Connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.strokeStyle = `rgba(165,208,182,${(1 - dist / maxDist) * 0.22})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
      // Nodes
      const a = 0.35 + Math.sin(particles[i].pulse) * 0.18;
      ctx.fillStyle = `rgba(165,208,182,${a})`;
      ctx.beginPath();
      ctx.arc(particles[i].x, particles[i].y, particles[i].r, 0, Math.PI * 2);
      ctx.fill();
    }

    animId = requestAnimationFrame(draw);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      createParticles();
    }, 200);
  }, { passive: true });

  // Pause when tab is hidden (performance)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      draw();
    }
  });

  resize();
  createParticles();
  draw();
}
