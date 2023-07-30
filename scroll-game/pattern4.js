/** @type {HTMLCanvasElement} */

import Player from "./game-scripts/player.js";

window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  const CANVAS_WIDTH = (canvas.width = 800);
  const CANVAS_HEIGHT = (canvas.height = 720);
  const listenedKeys = [
    "ArrowDown",
    "ArrowUp",
    "ArrowLeft",
    "ArrowRight",
    "w",
    "a",
    "s",
    "d",
  ];
  class InputHandler {
    constructor() {
      this.keys = [];

      window.addEventListener("keydown", (e) => {
        if (listenedKeys.includes(e.key) && !this.keys.includes(e.key)) {
          e.preventDefault();
          this.keys.push(e.key);
        }
      });
      window.addEventListener("keyup", (e) => {
        this.keys = this.keys.filter((key) => key !== e.key);
      });
    }
  }

  function handleEnemies() {}

  function displayStatusText() {}

  const rect1 = {
    x: 200,
    y: 200,
    width: 50,
    height: 50,
  };

  const input = new InputHandler();
  const player = new Player(CANVAS_WIDTH, CANVAS_HEIGHT);

  function animate(timestamp) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    player.draw(ctx);
    player.update(input);

    requestAnimationFrame(animate);
  }

  animate(0);
});
