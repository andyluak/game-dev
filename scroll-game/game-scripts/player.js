export default class Player {
  constructor(gameWidth, gameHeight) {
    this.image = document.getElementById("playerImage");

    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.width = 200;
    this.height = 200;

    this.x = 0;
    this.y = gameHeight - this.height;

    this.frameX = 3;
    this.frameY = 0;

    this.speed = 1;

    this.vy = 0;
    this.gravity = 1;
  }

  draw(ctx) {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  update(input) {
    if (input.keys.includes("ArrowRight") || input.keys.includes("d")) {
      this.speed = 5;
    } else if (input.keys.includes("ArrowLeft") || input.keys.includes("a")) {
      this.speed = -5;
    } else if (input.keys.includes("ArrowUp") && this.onGround()) {
      this.vy -= 32;
    } else {
      this.speed = 0;
    }

    // horizontal movement
    this.x = Math.min(
      Math.max(0, this.x + this.speed),
      this.gameWidth - this.width
    );

    // vertical movement
    this.y += this.vy;
    if (!this.onGround()) {
      this.vy += this.gravity;
      this.frameY = 1;
    } else {
      this.vy = 0;
      this.frameY = 0;
    }

    if (this.y > this.gameHeight - this.height) {
      this.y = this.gameHeight - this.height;
    }
  }

  onGround() {
    return this.y >= this.gameHeight - this.height;
  }
}
