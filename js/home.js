/* Home page interactions */

// Newsletter signup -> Google Sheet via a deployed Apps Script Web App.
const NEWSLETTER_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyGYTjW8DVn3SR3veYQbnbJmqMgmMHA8c3yoyu16t13UjyAThWaivKsAhRvg6JXRx-vKQ/exec';

const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  const newsletterSuccess = document.getElementById('newsletterSuccess');
  const newsletterError = document.getElementById('newsletterError');

  newsletterForm.addEventListener('submit', async e => {
    e.preventDefault();
    const submitBtn = newsletterForm.querySelector('button[type="submit"]');
    const submitLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    if (newsletterError) newsletterError.classList.remove('is-visible');

    try {
      const res = await fetch(NEWSLETTER_ENDPOINT, {
        method: 'POST',
        // text/plain avoids a CORS preflight against the Apps Script Web App, which doesn't handle OPTIONS.
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          name: newsletterForm.name.value.trim(),
          email: newsletterForm.email.value.trim()
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Submission rejected');

      newsletterForm.classList.add('is-hidden');
      if (newsletterSuccess) newsletterSuccess.classList.add('is-visible');
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = submitLabel;
      if (newsletterError) newsletterError.classList.add('is-visible');
    }
  });
}

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

// Hero canvas (disabled, background is now CSS gradient)
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

// Stat blocks. The panel itself is shown by CSS on :hover / :focus-within so it
// works with JS off. This does two things on top of that: keeps aria-expanded
// truthful, and gives the panel the exact height of the figure it belongs to.
//
// The height has to come from script because CSS cannot read a sibling's box.
// Without JS the panel falls back to the full height of the column, which is the
// stylesheet's top/bottom pair and is perfectly usable, just less precise.
const introGrid = document.querySelector('.intro__grid');
const PANEL_SIDE_BY_SIDE = '(min-width: 1025px)';
const PANEL_PROPS = ['left', 'top', 'bottom', 'height', 'min-height'];

document.querySelectorAll('.stat-block').forEach(block => {
  const trigger = block.querySelector('.stat-block__trigger');
  const panel = block.querySelector('.stat-block__detail');
  if (!trigger) return;

  const clearPanel = () => {
    if (panel) PANEL_PROPS.forEach(prop => panel.style.removeProperty(prop));
  };

  const sizePanel = () => {
    if (!panel || !introGrid) return;

    // Below this width the panel is static and sits under its own figure. Inline
    // geometry would out-rank the stylesheet there, so it has to be removed, not
    // just overridden.
    if (!window.matchMedia(PANEL_SIDE_BY_SIDE).matches) {
      clearPanel();
      return;
    }

    const gridBox = introGrid.getBoundingClientRect();
    const blockBox = block.getBoundingClientRect();

    // Horizontal span is the stylesheet's job and only the stylesheet's: the
    // panel is left:0/right:0 against .intro__grid, so it already runs the whole
    // width of the row. Setting it from here as well just gave the bug two
    // places to hide. All this does is line the band up with the figure being
    // hovered and make sure the sentence fits.
    panel.style.top = `${blockBox.top - gridBox.top}px`;

    // min-height, not height: the panel matches the figure it belongs to but
    // grows if the sentence needs more room, so the text is always enclosed.
    panel.style.bottom = 'auto';
    panel.style.height = 'auto';
    panel.style.minHeight = `${blockBox.height}px`;
  };

  const set = open => {
    if (open) sizePanel(); else clearPanel();
    trigger.setAttribute('aria-expanded', String(open));
  };

  block.addEventListener('mouseenter', () => set(true));
  block.addEventListener('mouseleave', () => set(false));
  trigger.addEventListener('focus', () => set(true));
  trigger.addEventListener('blur', () => set(false));

  // On touch there is no hover, and focus alone would leave every tapped block
  // stuck open. Tapping an already-open block closes it.
  trigger.addEventListener('click', () => {
    if (trigger.getAttribute('aria-expanded') === 'true') {
      trigger.blur();
      set(false);
    } else {
      set(true);
    }
  });

  window.addEventListener('resize', () => {
    if (trigger.getAttribute('aria-expanded') === 'true') sizePanel();
    else clearPanel();
  }, { passive: true });
});

// Hero bottom fade. The photograph holds the full screen until the page is
// actually scrolled; the fade to the white section below is what .is-scrolling
// turns on. pageshow covers a back/forward restore, where the browser puts the
// scroll position back without ever firing a scroll event.
const hero = document.querySelector('.hero');
if (hero) {
  const updateHeroFade = () => hero.classList.toggle('is-scrolling', window.scrollY > 80);
  updateHeroFade();
  window.addEventListener('scroll', updateHeroFade, { passive: true });
  window.addEventListener('pageshow', updateHeroFade);
}

// "Why EvE Waste", mark whichever pillar is nearest the middle of the viewport
// as active, and move the progress bar with it. Below 900px the CSS shows every
// pillar at full contrast and ignores .is-active, so this is desktop dressing:
// with JS off, the first pillar stays marked and the rest are still readable.
const pillars = [...document.querySelectorAll('.pillar')];
if (pillars.length) {
  const barFill = document.getElementById('pillarsBarFill');
  const indexOut = document.getElementById('pillarsIndex');
  let current = -1;

  const setActive = i => {
    if (i === current) return;
    current = i;
    pillars.forEach((p, n) => p.classList.toggle('is-active', n === i));
    if (barFill) barFill.style.width = `${((i + 1) / pillars.length) * 100}%`;
    if (indexOut) indexOut.textContent = String(i + 1);
  };

  const pick = () => {
    const middle = window.innerHeight / 2;
    let best = 0, bestDist = Infinity;
    pillars.forEach((p, i) => {
      const box = p.getBoundingClientRect();
      const dist = Math.abs(box.top + box.height / 2 - middle);
      if (dist < bestDist) { bestDist = dist; best = i; }
    });
    setActive(best);
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { pick(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', pick, { passive: true });
  pick();
}
