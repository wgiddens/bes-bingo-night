const STAR_COLORS = ['255,211,90', '255,170,210', '255,255,255'];
const FIREWORK_PALETTES = [
  ['#ffd35a', '#fff1b8', '#ffb347'],
  ['#ff7eb6', '#ffc2de', '#ffd35a'],
  ['#b48cff', '#e6d9ff', '#ff7eb6'],
  ['#7fd8ff', '#e8f8ff', '#ffd35a'],
];
const GLITTER = ['255,244,207', '255,211,90', '255,226,150', '255,255,255', '255,190,220'];
const COMET_MS = 950;
const MAX_GLITTER = 1500;

const pick = (list) => list[Math.floor(Math.random() * list.length)];
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const bezier = (a, b, c, t) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;

function drawSparkle(ctx, x, y, r, rotation) {
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const radius = i % 2 === 0 ? r : r * 0.28;
    const angle = rotation + (i * Math.PI) / 4;
    ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
  }
  ctx.closePath();
  ctx.fill();
}

export function createMagicEffects({ skyCanvas, fxCanvas, castle, leftPanel }) {
  const sky = skyCanvas.getContext('2d');
  const fx = fxCanvas.getContext('2d');
  let width = 0;
  let height = 0;
  let stars = [];
  const rockets = [];
  const fireworkSparks = [];
  const meteors = [];
  let glitter = [];
  let comets = [];
  const timers = new Set();

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    for (const [canvas, ctx] of [[skyCanvas, sky], [fxCanvas, fx]]) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.9,
      r: Math.random() * 1.4 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 1.2 + 0.4,
      color: Math.random() < 0.15 ? STAR_COLORS[0] : Math.random() < 0.2 ? STAR_COLORS[1] : STAR_COLORS[2],
    }));
  }

  function addGlitter(props) {
    glitter.push({
      life: 1,
      decay: 0.02,
      rotation: Math.random() * 6,
      spin: (Math.random() - 0.5) * 0.2,
      gravity: 0.02,
      sparkle: Math.random() < 0.35,
      ...props,
    });
  }

  function launchRocket(delay, target = {}) {
    const timer = setTimeout(() => {
      timers.delete(timer);
      const castleRect = castle.getBoundingClientRect();
      const leftRect = leftPanel.getBoundingClientRect();
      const startX = castleRect.left + castleRect.width * (0.2 + Math.random() * 0.6);
      const startY = castleRect.bottom - 40;
      rockets.push({
        x: startX,
        y: startY,
        startX,
        startY,
        targetX: target.x ?? leftRect.left + leftRect.width * (0.22 + Math.random() * 0.56),
        targetY: target.y ?? height * (0.54 + Math.random() * 0.14),
        tick: 0,
        duration: 55 + Math.random() * 15,
        palette: pick(FIREWORK_PALETTES),
      });
    }, delay);
    timers.add(timer);
  }

  function explode(rocket) {
    const count = 90 + Math.floor(Math.random() * 40);
    const ring = Math.random() < 0.35;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.1;
      const speed = ring ? 5.6 + Math.random() * 0.5 : 1.2 + Math.random() * 6;
      fireworkSparks.push({
        x: rocket.targetX,
        y: rocket.targetY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.007 + Math.random() * 0.006,
        color: rocket.palette[i % rocket.palette.length],
        size: 2.4 + Math.random() * 2,
        twinkle: Math.random() < 0.3,
      });
    }
    fireworkSparks.push({ x: rocket.targetX, y: rocket.targetY, vx: 0, vy: 0, life: 1, decay: 0.03, color: rocket.palette[0], size: 40, core: true });
  }

  function shootingStar() {
    meteors.push({
      x: width * (0.2 + Math.random() * 0.7),
      y: height * Math.random() * 0.3,
      vx: -(6 + Math.random() * 2),
      vy: 4 + Math.random() * 2,
      life: 1,
    });
  }

  function scheduleShootingStar() {
    const timer = setTimeout(() => {
      timers.delete(timer);
      shootingStar();
      scheduleShootingStar();
    }, 7000 + Math.random() * 9000);
    timers.add(timer);
  }

  function drawSky(tick) {
    sky.globalCompositeOperation = 'source-over';
    sky.clearRect(0, 0, width, height);

    for (const star of stars) {
      const alpha = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(star.phase + tick * 0.02 * star.speed));
      sky.fillStyle = `rgba(${star.color},${alpha})`;
      sky.beginPath();
      sky.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      sky.fill();
      if (star.r > 1.4 && alpha > 0.85) {
        sky.strokeStyle = `rgba(${star.color},${(alpha - 0.85) * 3})`;
        sky.lineWidth = 0.6;
        sky.beginPath();
        sky.moveTo(star.x - 5, star.y);
        sky.lineTo(star.x + 5, star.y);
        sky.moveTo(star.x, star.y - 5);
        sky.lineTo(star.x, star.y + 5);
        sky.stroke();
      }
    }

    sky.globalCompositeOperation = 'lighter';

    for (let i = meteors.length - 1; i >= 0; i--) {
      const meteor = meteors[i];
      meteor.x += meteor.vx;
      meteor.y += meteor.vy;
      meteor.life -= 0.012;
      const tailX = meteor.x - meteor.vx * 14;
      const tailY = meteor.y - meteor.vy * 14;
      const gradient = sky.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
      gradient.addColorStop(0, `rgba(255,250,230,${meteor.life})`);
      gradient.addColorStop(1, 'rgba(255,126,182,0)');
      sky.strokeStyle = gradient;
      sky.lineWidth = 2;
      sky.lineCap = 'round';
      sky.beginPath();
      sky.moveTo(meteor.x, meteor.y);
      sky.lineTo(tailX, tailY);
      sky.stroke();
      if (meteor.life <= 0 || meteor.x < -100 || meteor.y > height) meteors.splice(i, 1);
    }

    for (let i = rockets.length - 1; i >= 0; i--) {
      const rocket = rockets[i];
      rocket.tick++;
      const progress = rocket.tick / rocket.duration;
      const eased = 1 - Math.pow(1 - progress, 2);
      const prevX = rocket.x;
      const prevY = rocket.y;
      rocket.x = rocket.startX + (rocket.targetX - rocket.startX) * eased;
      rocket.y = rocket.startY + (rocket.targetY - rocket.startY) * eased;
      sky.strokeStyle = 'rgba(255,220,150,.9)';
      sky.lineWidth = 2.5;
      sky.beginPath();
      sky.moveTo(prevX, prevY);
      sky.lineTo(rocket.x, rocket.y);
      sky.stroke();
      if (Math.random() < 0.6) {
        fireworkSparks.push({ x: rocket.x, y: rocket.y, vx: (Math.random() - 0.5) * 0.6, vy: Math.random() * 0.8, life: 0.6, decay: 0.03, color: '#ffcc80', size: 1.5 });
      }
      if (progress >= 1) {
        explode(rocket);
        rockets.splice(i, 1);
      }
    }

    for (let i = fireworkSparks.length - 1; i >= 0; i--) {
      const spark = fireworkSparks[i];
      spark.x += spark.vx;
      spark.y += spark.vy;
      spark.vx *= 0.975;
      spark.vy = spark.vy * 0.975 + 0.045;
      spark.life -= spark.decay;
      if (spark.life <= 0) {
        fireworkSparks.splice(i, 1);
        continue;
      }
      let alpha = spark.life;
      if (spark.twinkle) alpha *= 0.5 + 0.5 * Math.sin(tick * 0.6 + i);
      sky.globalAlpha = Math.max(0, alpha);
      if (spark.core) {
        const gradient = sky.createRadialGradient(spark.x, spark.y, 0, spark.x, spark.y, spark.size * 3);
        gradient.addColorStop(0, 'rgba(255,255,255,.9)');
        gradient.addColorStop(0.25, spark.color + '88');
        gradient.addColorStop(1, 'rgba(255,200,230,0)');
        sky.fillStyle = gradient;
        sky.beginPath();
        sky.arc(spark.x, spark.y, spark.size * 3, 0, Math.PI * 2);
        sky.fill();
      } else {
        sky.strokeStyle = spark.color;
        sky.lineCap = 'round';
        sky.lineWidth = spark.size * (0.4 + spark.life * 0.5);
        sky.beginPath();
        sky.moveTo(spark.x - spark.vx * 4, spark.y - spark.vy * 4);
        sky.lineTo(spark.x, spark.y);
        sky.stroke();
        sky.fillStyle = spark.color;
        sky.beginPath();
        sky.arc(spark.x, spark.y, spark.size * (0.5 + spark.life * 0.5), 0, Math.PI * 2);
        sky.fill();
      }
    }
    sky.globalAlpha = 1;
  }

  function drawPixieDust(now) {
    fx.clearRect(0, 0, width, height);

    comets = comets.filter((comet) => {
      const progress = Math.min(1, (now - comet.start) / COMET_MS);
      const eased = easeInOut(progress);
      const x = bezier(comet.startX, comet.controlX, comet.endX, eased);
      const y = bezier(comet.startY, comet.controlY, comet.endY, eased);
      const steps = Math.max(1, Math.ceil(Math.hypot(x - comet.prevX, y - comet.prevY) / 6));
      for (let i = 0; i < steps; i++) {
        const k = i / steps;
        addGlitter({
          x: comet.prevX + (x - comet.prevX) * k + (Math.random() - 0.5) * 10,
          y: comet.prevY + (y - comet.prevY) * k + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.2) * 0.8,
          r: Math.random() * 2.6 + 0.8,
          color: pick(GLITTER),
          decay: Math.random() * 0.02 + 0.018,
          gravity: 0.03,
        });
      }
      comet.prevX = x;
      comet.prevY = y;

      const glow = fx.createRadialGradient(x, y, 0, x, y, 34);
      glow.addColorStop(0, 'rgba(255,255,255,1)');
      glow.addColorStop(0.25, 'rgba(255,240,190,.9)');
      glow.addColorStop(1, 'rgba(255,211,90,0)');
      fx.fillStyle = glow;
      fx.beginPath();
      fx.arc(x, y, 34, 0, Math.PI * 2);
      fx.fill();
      fx.fillStyle = '#fff';
      drawSparkle(fx, x, y, 16, now / 120);

      if (progress < 1) return true;
      comet.onLand();
      return false;
    });

    glitter = glitter.filter((speck) => {
      speck.life -= speck.decay;
      if (speck.life <= 0) return false;
      speck.vy += speck.gravity;
      speck.vx *= 0.985;
      speck.vy *= 0.985;
      speck.x += speck.vx;
      speck.y += speck.vy;
      speck.rotation += speck.spin;
      const alpha = speck.life * (speck.alpha ?? 1);
      fx.fillStyle = `rgba(${speck.color},${alpha})`;
      fx.shadowColor = `rgba(${speck.color},${alpha})`;
      fx.shadowBlur = speck.r * 3;
      if (speck.sparkle) {
        drawSparkle(fx, speck.x, speck.y, speck.r * 2.2, speck.rotation);
      } else {
        fx.beginPath();
        fx.arc(speck.x, speck.y, speck.r, 0, Math.PI * 2);
        fx.fill();
      }
      return true;
    });
    fx.shadowBlur = 0;
    if (glitter.length > MAX_GLITTER) glitter.splice(0, glitter.length - MAX_GLITTER);
  }

  let tick = 0;
  let lastFrame = 0;
  let frameId = 0;
  function frame(now) {
    frameId = requestAnimationFrame(frame);
    // Motion is advanced per frame, so cap at ~60fps to keep 120Hz displays from running double speed.
    if (now - lastFrame < 15) return;
    lastFrame = now;
    tick++;
    drawSky(tick);
    drawPixieDust(now);
  }

  let lastMouseMove = 0;
  function onMouseMove(event) {
    const now = performance.now();
    if (now - lastMouseMove < 16) return;
    lastMouseMove = now;
    for (let i = 0; i < 2; i++) {
      addGlitter({
        x: event.clientX + (Math.random() - 0.5) * 6,
        y: event.clientY + (Math.random() - 0.5) * 6,
        vx: (Math.random() - 0.5) * 0.6,
        vy: Math.random() * 0.6 + 0.2,
        r: Math.random() * 1.8 + 0.6,
        color: pick(GLITTER),
        decay: 0.035,
        gravity: 0.01,
        alpha: 0.6,
        sparkle: Math.random() < 0.3,
      });
    }
  }

  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', onMouseMove);
  frameId = requestAnimationFrame(frame);
  const firstShootingStar = setTimeout(shootingStar, 1500);
  timers.add(firstShootingStar);
  scheduleShootingStar();

  return {
    sprinkle(rect) {
      for (let i = 0; i < 90; i++) {
        addGlitter({
          x: rect.left + Math.random() * rect.width,
          y: rect.top - 10 + Math.random() * rect.height * 0.4,
          vx: (Math.random() - 0.5) * 1.2,
          vy: Math.random() * 2 + 0.5,
          r: Math.random() * 3 + 1,
          color: pick(GLITTER),
          decay: Math.random() * 0.012 + 0.008,
          gravity: 0.04,
          sparkle: Math.random() < 0.55,
        });
      }
      for (let i = 0; i < 40; i++) {
        const t = i / 40;
        const side = i % 4;
        const x = side < 2 ? rect.left + t * rect.width : side === 2 ? rect.left : rect.right;
        const y = side === 0 ? rect.top : side === 1 ? rect.bottom : rect.top + t * rect.height;
        addGlitter({ x, y, vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 3, r: Math.random() * 2.5 + 1, color: pick(GLITTER), decay: 0.02, gravity: 0, sparkle: true });
      }
    },

    burst(rect) {
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const spread = Math.max(rect.width, rect.height) * 0.7;
      for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1;
        addGlitter({
          x: x + Math.cos(angle) * spread * 0.3 * Math.random(),
          y: y + Math.sin(angle) * spread * 0.3 * Math.random(),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          r: Math.random() * 3 + 1.5,
          color: pick(GLITTER),
          decay: Math.random() * 0.02 + 0.015,
          gravity: 0.05,
          sparkle: Math.random() < 0.5,
        });
      }
    },

    celebrate() {
      launchRocket(0);
      launchRocket(260);
      launchRocket(520);
      launchRocket(760);
      launchRocket(380, { x: width * (0.35 + Math.random() * 0.55), y: height * (0.12 + Math.random() * 0.2) });
    },

    launchComet(number, from, to, onLand) {
      const endX = to.left + to.width / 2;
      const endY = to.top + to.height / 2;
      const arcTop = Math.min(from.y, endY) - Math.max(180, Math.abs(endX - from.x) * 0.35);
      comets.push({
        number,
        startX: from.x,
        startY: from.y,
        controlX: (from.x + endX) / 2,
        controlY: Math.max(40, arcTop),
        endX,
        endY,
        prevX: from.x,
        prevY: from.y,
        start: performance.now(),
        onLand,
      });
    },

    cancelComet(number) {
      comets = comets.filter((comet) => comet.number !== number);
    },

    cancelAllComets() {
      comets = [];
    },

    destroy() {
      cancelAnimationFrame(frameId);
      timers.forEach(clearTimeout);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    },
  };
}
