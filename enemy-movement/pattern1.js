/** @type {HTMLCanvasElement} */

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = (canvas.width = 500);
const CANVAS_HEIGHT = (canvas.height = 1000);

let gameFrame = 0;

class Enemy {
  constructor() {
    this.image = new Image();
    this.image.src = "assets/enemy1.png";

    this.speed = Math.random() * 4 + 1;
    this.spriteWidth = 293;
    this.spriteHeight = 155;
    this.width = this.spriteWidth / 2.5;
    this.height = this.spriteHeight / 2.5;
    this.x = Math.random() * (CANVAS_WIDTH - this.width);
    this.y = Math.random() * (CANVAS_HEIGHT - this.height);
    this.frame = 0;
    this.flapSpeed = Math.floor(Math.random() * 3 + 1);
  }

  update() {
    this.x += Math.random() * 5 - 4.5;
    this.y += Math.random() * 5 - 4.5;
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

const numberOfEnemies = 10;
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
