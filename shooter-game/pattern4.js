/** @type {HTMLCanvasElement} */

// INFINITE CIRCULAR MOVEMENT WITH SIN
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = (canvas.width = window.innerWidth);
const CANVAS_HEIGHT = (canvas.height = window.innerHeight);

const collisionCanvas = document.getElementById("collisionCanvas");
const collisionCtx = collisionCanvas.getContext("2d");
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

const checkCollisionRect = ({ coord1, coord2 }) => {
  if (
    coord1.x > coord2.x + coord2.width ||
    coord1.x + coord1.width < coord2.x ||
    coord1.y > coord2.y + coord2.height ||
    coord1.y + coord1.height < coord2.y
  ) {
    return false;
  }
  return true;
};

const checkCollisionCircle = ({ coord1, coord2 }) => {
  let dx = coord1.x - coord2.x;
  let dy = coord1.y - coord2.y;
  // Pythagorean theorem
  let distance = Math.sqrt(dx * dx + dy * dy);

  // if the distance is less than the sum of the radius of the two circles, then there is a collision
  if (distance < coord1.radius + coord2.radius) {
    return true;
  }
  return false;
};

let gameFrame = 10;
let gameOver = false;
let score = 0;

const drawScore = () => {
  ctx.fillStyle = "white";
  ctx.font = "35px Impact";
  ctx.fillText(`Score: ${score}`, 10, 50);
  ctx.fillStyle = "black";
  ctx.font = "35px Impact";
  ctx.fillText(`Score: ${score}`, 12, 52);
};

const drawGameOver = () => {
  ctx.fillStyle = "white";
  ctx.font = "90px Impact";
  ctx.textAlign = "center";

  ctx.fillText(
    `GAME OVER, your score is ${score}`,
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT / 2
  );
  ctx.fillStyle = "black";
  ctx.font = "90px Impact";
  ctx.textAlign = "center";

  ctx.fillText(
    `GAME OVER, your score is ${score}`,
    CANVAS_WIDTH / 2 + 2,
    CANVAS_HEIGHT / 2 + 2
  );
};

class Raven {
  constructor() {
    this.directionX = Math.random() * 5 + 3;
    this.directionY = Math.random() * 5 - 2.5;

    this.markedForDeletion = false;

    this.image = new Image();
    this.image.src = "assets/raven.png";

    this.spriteWidth = 271;
    this.spriteHeight = 178;

    this.sizeModifier = Math.random() * 0.6 + 0.4;

    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;

    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.height);

    this.frame = 0;
    this.maxFrame = 4;
    this.timeSinceFlap = 0;
    this.flapInterval = Math.random() * 50 + 100;

    this.randomColors = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
    ];

    this.color = `rgb(${this.randomColors[0]},${this.randomColors[1]},${this.randomColors[2]})`;

    this.hasTrail = Math.random() > 0.5;
  }

  update(dt) {
    if (this.y < 0 || this.y > canvas.height - this.height)
      this.directionY *= -1;

    this.x -= this.directionX;
    this.y += this.directionY;
    if (this.x < 0 - this.width) this.markedForDeletion = true;

    this.timeSinceFlap += dt;

    if (this.timeSinceFlap > this.flapInterval) {
      if (this.frame > this.maxFrame) this.frame = 0;
      else this.frame++;

      this.timeSinceFlap = 0;
      if (this.hasTrail) {
        particles.push(
          ...Array.from(
            { length: 5 },
            () =>
              new Particle(this.x, this.y, this.width, this.color)
          )
        );
      }
    }

    if (this.x < 0 - this.width) gameOver = true;
  }

  draw() {
    collisionCtx.fillStyle = this.color;
    collisionCtx.fillRect(this.x, this.y, this.width, this.height);

    ctx.drawImage(
      this.image,

      this.frame * this.spriteWidth,
      0,

      this.spriteWidth,
      this.spriteHeight,

      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

class Explosion {
  constructor(x, y, size) {
    this.spriteWidth = 200;
    this.spriteHeight = 179;

    this.width = this.spriteWidth / 2;
    this.height = this.spriteHeight / 2;

    this.x = x;
    this.y = y;

    this.size = size;

    this.image = new Image();
    this.image.src = "assets/boom.png";
    this.frame = 0;

    this.timer = 0;

    this.angle = Math.random() * 6.2;

    this.sound = new Audio();
    this.sound.src = "assets/DeathFlash.flac";
    this.sound.volume = 0.2;

    // increase the speed of the sound
    this.sound.playbackRate = 5;

    this.timeSinceLastFrame = 0;
    this.frameInterval = 50;

    this.markedForDeletion = false;
  }

  update(dt) {
    if (this.frame === 0) this.sound.play();
    this.timer++;
    this.timeSinceLastFrame += dt;
    if (this.timeSinceLastFrame > this.frameInterval) {
      this.frame++;

      if (this.frame > 5) this.markedForDeletion = true;

      this.timeSinceLastFrame = 0;
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.drawImage(
      this.image,
      this.spriteWidth * this.frame,
      0,
      this.spriteWidth,
      this.spriteHeight,
      0 - this.width / 2,
      0 - this.height / 2,
      this.size,
      this.size
    );
    ctx.restore();
  }
}

class Particle {
  constructor(x, y, size, color) {
    this.size = size;
    this.x = x + this.size / 2;
    this.y = y + this.size / 3;
    this.color = color;

    this.radius = Math.random() * (this.size / 10);
    this.maxRadius = Math.random() * 20 + 35;
    this.markedForDeletion = false;
    this.speedX = Math.random() * 1 + 0.5;
    this.color = color;
  }

  update() {
    this.x += this.speedX;
    this.radius += 0.5;

    if (this.radius > this.maxRadius - 1) this.markedForDeletion = true;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = 1 - this.radius / this.maxRadius;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

const NUMBER_OF_RAVENS = 1;
let ravens = new Array(NUMBER_OF_RAVENS).fill().map(() => new Raven());
let explosions = [];
let particles = [];

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;

window.addEventListener("click", (e) => {
  const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
  const pc = detectPixelColor.data;

  ravens.forEach((raven) => {
    if (pc[0] === raven.randomColors[0]) {
      if (pc[1] === raven.randomColors[1]) {
        if (pc[2] === raven.randomColors[2]) {
          score++;
          raven.markedForDeletion = true;

          // add explosion
          explosions.push(new Explosion(e.x, e.y, raven.width));
        }
      }
    }
  });
});

function animate(timestamp) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  collisionCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  let dt = timestamp - lastTime;
  lastTime = timestamp;

  timeToNextRaven += dt;

  if (timeToNextRaven > ravenInterval) {
    ravens.push(new Raven());
    timeToNextRaven = 0;
    ravens.sort((a, b) => a.width - b.width);
  }
  drawScore();
  [...particles, ...ravens, ...explosions].forEach((r) => {
    r.update(dt);
    r.draw();
  });
  console.log(particles);
  ravens = ravens.filter((r) => !r.markedForDeletion);
  explosions = explosions.filter((e) => !e.markedForDeletion);
  particles = particles.filter((p) => !p.markedForDeletion);

  if (gameOver) {
    drawGameOver();
    return;
  }

  requestAnimationFrame(animate);
}

animate(0);
