/** @type {HTMLCanvasElement} */

// INFINITE CIRCULAR MOVEMENT WITH SIN
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = (canvas.width = 500);
const CANVAS_HEIGHT = (canvas.height = 700);

let mousePos = {
  x: 0,
  y: 0,
};

canvas.addEventListener("mousemove", function (e) {
  mousePos.x = e.offsetX;
  mousePos.y = e.offsetY;
});

/** 
 y2 x1              x2
  |-----------------|    |-----------------|
  |                 |    |                 |
  |                 |    |                 |
  |-----------------|    |-----------------|
 y1 

 The above is the coordinate system for the canvas.

 Checks explanations : 
 - If the coord1.x is greater than coord2.x + coord2.width, then coord1 is to the right of coord2.
 - If the coord1.x + coord1.width is less than coord2.x, then coord1 is to the left of coord2.

 - If the coord1.y is greater than coord2.y + coord2.height, then coord1 is below coord2.
 - If the coord1.y + coord1.height is less than coord2.y, then coord1 is above coord2.

  If any of the above is true, then there is no collision.
*/
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

const explosions = [];

class Explosion {
  constructor(x, y) {
    this.spriteWidth = 200;
    this.spriteHeight = 179;

    this.width = this.spriteWidth / 2;
    this.height = this.spriteHeight / 2;

    this.x = x;
    this.y = y;

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
  }

  update() {
    if (this.frame === 0) this.sound.play();
    this.timer++;
    if (this.timer % 10 === 0) {
      this.frame++;
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
      this.width,
      this.height
    );
    ctx.restore();
  }
}

function createAnimation(e) {
  let positionX = e.offsetX;
  let positionY = e.offsetY;

  explosions.push(new Explosion(positionX, positionY));
}

window.addEventListener("click", (e) => {
  createAnimation(e);
});

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  explosions.forEach((explosion, index) => {
    explosion.update();
    explosion.draw();

    if (explosion.frame > 5) {
      explosions.splice(index, 1);
      index--;
    }
  });

  requestAnimationFrame(animate);
}

animate();
