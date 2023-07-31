const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const N = 10;

const cars = new Array(N)
  .fill()
  .map(() => new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));

let bestCar = cars[0];

if (localStorage.getItem("bestBrain")) {
  cars.forEach((car, i) => {
    car.brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i > 0) NeuralNetwork.mutate(car.brain, 0.2);
  });
  bestCar.brain = JSON.parse(localStorage.getItem("bestBrain"));
}

const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -100, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -100, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -1200, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -1500, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -1500, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -1200, 30, 50, "DUMMY", 2),
];

animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }

  cars.forEach((car) => car.update(road.borders, traffic));

  bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }
  carCtx.globalAlpha = 0.2;
  cars.forEach((car) => car.draw(carCtx, "blue"));
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "blue", true);

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  requestAnimationFrame(animate);
}
