interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
  shape: "circle" | "square";
}

// Singleton canvas layer
let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let particles: Particle[] = [];
let animationId: number | null = null;
let lastTime = 0;

function ensureCanvas(): boolean {
  if (canvas && ctx) return true;

  canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    canvas = null;
    return false;
  }

  // Handle resize
  const resizeObserver = new ResizeObserver(() => {
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  });
  resizeObserver.observe(document.documentElement);

  return true;
}

function startAnimation() {
  if (animationId !== null) return;
  lastTime = performance.now();

  function animate(time: number) {
    const dt = (time - lastTime) / 1000;
    lastTime = time;

    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles = particles.filter((p) => {
      p.life += dt;
      if (p.life >= p.maxLife) return false;

      p.vy += 15 * dt;
      p.x += p.vx * 60 * dt;
      p.y += p.vy * 60 * dt;

      const progress = p.life / p.maxLife;
      const alpha = p.opacity * (1 - progress);

      ctx!.globalAlpha = alpha;
      ctx!.fillStyle = p.color;

      if (p.shape === "circle") {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fill();
      } else {
        ctx!.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }

      return true;
    });

    if (particles.length > 0) {
      animationId = requestAnimationFrame(animate);
    } else {
      animationId = null;
      // Hide canvas when no particles
      if (canvas) {
        canvas.style.display = "none";
      }
    }
  }

  if (canvas) {
    canvas.style.display = "block";
  }
  animationId = requestAnimationFrame(animate);
}

export function spawnParticles(
  originX: number,
  originY: number,
  color: string,
  count: number = 15
): void {
  if (!ensureCanvas()) return;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 8 + Math.random() * 7;
    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      size: 2 + Math.random() * 3,
      opacity: 0.6 + Math.random() * 0.4,
      color,
      life: 0,
      maxLife: 0.4 + Math.random() * 0.2,
      shape: Math.random() > 0.5 ? "circle" : "square",
    });
  }

  startAnimation();
}

export function spawnConfetti(): void {
  const colors = [
    "#FF6B6B", "#FFBE5C", "#A8E06C", "#5CC8FF",
    "#B18CFF", "#FF7EB3", "#6CDFCF",
  ];

  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const x = Math.random() * window.innerWidth;
      const color = colors[Math.floor(Math.random() * colors.length)];
      spawnParticles(x, -10, color, 8);
    }, i * 100);
  }
}
