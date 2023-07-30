/** @type {HTMLCanvasElement} */


// INFINITE CIRCULAR MOVEMENT WITH SIN
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = (canvas.width = 500);
const CANVAS_HEIGHT = (canvas.height = 1000);

let gameFrame = 0;

class Enemy {
  constructor() {
    this.image = new Image();
    this.image.src = "assets/enemy3.png";

    this.speed = Math.random() * 4 + 1;
    this.spriteWidth = 218;
    this.spriteHeight = 177;
    this.width = this.spriteWidth / 2.5;
    this.height = this.spriteHeight / 2.5;
    this.x = Math.random() * (CANVAS_WIDTH - this.width);
    this.y = Math.random() * (CANVAS_HEIGHT - this.height);
    this.frame = 0;
    this.flapSpeed = Math.floor(Math.random() * 3 + 1);

    this.angle = Math.random() * 500;
    this.angleSpeed = Math.random() * 1.5 + 0.3

    this.curve = Math.random() * 200 + 50
  }

  update() {
    this.x = canvas.width / 2 * Math.sin(this.angle * Math.PI / 90) + (canvas.width / 2 - this.width / 2)
    this.y = canvas.height / 2 * Math.cos(this.angle * Math.PI / 180) + (canvas.height / 2 - this.height / 2)
    this.angle += this.angleSpeed
    if (this.x + this.width < 0) this.x = CANVAS_WIDTH;

    if (gameFrame % this.flapSpeed === 0) {
      this.frame > 4 ? (this.frame = 1) : this.frame++;
    }
  }

  draw() {
    ctx.drawImage(
      // image we want to draw
      this.image,
      // source from image
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      // destination
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

const numberOfEnemies = 100;
const enemies = new Array(numberOfEnemies).fill().map(() => new Enemy());

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  enemies.forEach((enemy) => {
    enemy.update();
    enemy.draw();
  });

  gameFrame++;

  requestAnimationFrame(animate);
}

animate();
