/** @type {HTMLCanvasElement} */

// INFINITE CIRCULAR MOVEMENT WITH SIN
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = (canvas.width = 500);
const CANVAS_HEIGHT = (canvas.height = 1000);

let mousePos = {
  x: 0,
  y: 0,
};

canvas.addEventListener("mousemove", function (e) {
  mousePos.x = e.offsetX;
  mousePos.y = e.offsetY;
});

const rect1 = {
  x: 200,
  y: 200,
  width: 100,
  height: 100,
};

const rect2 = {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
};

const circle1 = {
  x: 300,
  y: 300,
  radius: 50,
};

const circle2 = {
  x: 10,
  y: 10,
  radius: 10,
};

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

function animate() {
  // draw rect1 and rect2
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  // ctx.fillStyle = "blue";
  // ctx.fillRect(rect1.x, rect1.y, rect1.width, rect1.height);
  // ctx.fillStyle = "red";
  // ctx.fillRect(rect2.x, rect2.y, rect2.width, rect2.height);

  // move rect2
  let dx = mousePos.x - rect2.x - rect2.width / 2;
  let dy = mousePos.y - rect2.y - rect2.height / 2;


  // draw circle1 and circle2
  ctx.beginPath();
  ctx.arc(circle1.x, circle1.y, circle1.radius, 0, Math.PI * 2);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.arc(circle2.x, circle2.y, circle2.radius, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();

  // move circle2
  dx = mousePos.x - circle2.x;
  dy = mousePos.y - circle2.y;
  circle2.x += dx * 0.05;
  circle2.y += dy * 0.05;

  if( checkCollisionCircle({ coord1: circle1, coord2: circle2 }) ) {
    ctx.fillStyle = "orange";
    ctx.fill();

    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Collision", 10, 50);
    
  }

  // check collision
  if (
    checkCollisionRect({
      coord1: rect1,
      coord2: rect2,
    })
  ) {
    ctx.fillStyle = "orange";
    ctx.fillRect(rect1.x, rect1.y, rect1.width, rect1.height);
    ctx.fillRect(rect2.x, rect2.y, rect2.width, rect2.height);
  }

  requestAnimationFrame(animate);
}

animate();
