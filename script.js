// Музыка по нажатию
document.getElementById("play-music").addEventListener("click", () => {
  const audio = document.getElementById("bg-music");
  audio.play();
});

// 🎆 Простая реализация фейерверка
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

class Firework {
  constructor() {
    this.x = random(0, canvas.width);
    this.y = canvas.height;
    this.targetY = random(100, canvas.height / 2);
    this.color = `hsl(${Math.floor(random(0, 360))}, 100%, 60%)`;
    this.radius = 2;
    this.velocity = -random(4, 7);
    this.exploded = false;
    this.particles = [];
  }

  update() {
    if (!this.exploded) {
      this.y += this.velocity;
      if (this.y <= this.targetY) {
        this.explode();
      }
    } else {
      this.particles.forEach((p) => p.update());
    }
  }

  draw() {
    if (!this.exploded) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    } else {
      this.particles.forEach((p) => p.draw());
    }
  }

  explode() {
    this.exploded = true;
    for (let i = 0; i < 30; i++) {
      this.particles.push(new Particle(this.x, this.y, this.color));
    }
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = 2;
    this.angle = random(0, Math.PI * 2);
    this.speed = random(1, 6);
    this.alpha = 1;
    this.fade = random(0.01, 0.03);
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.alpha -= this.fade;
  }

  draw() {
    if (this.alpha <= 0) return;
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (Math.random() < 0.03) {
    fireworks.push(new Firework());
  }

  fireworks = fireworks.filter((fw) => {
    fw.update();
    fw.draw();
    return fw.exploded ? fw.particles.some((p) => p.alpha > 0) : true;
  });
}

animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
