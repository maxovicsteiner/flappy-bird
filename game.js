const game = document.getElementById("game");
const pipes_HTML = document.getElementById("pipes");
const score_HTML = document.getElementById("score");
const high_score_HTML = document.getElementById("high_score");
let birds = [];
let pipes = [];
let game_over = false;
let score = 0;

score_HTML.innerText = score;

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

class Bird {
  constructor() {
    this.x = 100;
    this.y = 100;

    this.sketch = document.createElement("div");
    this.sketch.classList.add("bird");
    this.sketch.style.top = this.y + "px";
    this.sketch.style.left = this.x + "px";
    game.appendChild(this.sketch);

    this.isFlapping = false;

    birds.push(this);
  }
  flap() {
    if (this.y <= 0) {
      return;
    }
    this.isFlapping = true;
    let jumpingDistance = 75;
    if (this.y < jumpingDistance) {
      jumpingDistance = this.y;
    }

    let iteration = 0;
    let deceleration = 0.02;
    const flappingIntervalId = setInterval(() => {
      this.isFlapping = true;

      let newY = this.y - (jumpingDistance / 50 - iteration * deceleration);
      this.coordinates = [this.x, newY];
      if (++iteration >= jumpingDistance) {
        this.isFlapping = false;
        this.fall();
        clearInterval(flappingIntervalId);
      }
    }, 1);
  }
  fall() {
    if (this.isFlapping) return;
    if (this.y >= 460) return;
    let iteration = 0;
    let acceleration = 0.02;
    const fallIntervalId = setInterval(() => {
      let newY = this.y + iteration * acceleration;
      this.coordinates = [this.x, newY];
      iteration++;
      if (this.y >= 460 || this.isFlapping) {
        iteration = 0;
        clearInterval(fallIntervalId);
      }
    }, 1);
  }

  set coordinates([x, y]) {
    this.x = x;
    this.y = y;
    this.sketch.style.top = this.y + "px";
    this.sketch.style.left = this.x + "px";
  }
}

class Pipe {
  constructor(options) {
    let shift = randomNumber(15, 40);
    let y = (shift / 100) * 1150;

    this.y = -y + 500;

    this.sketch = document.createElement("div");
    this.sketch.classList.add("pipe");
    pipes.push(this);

    this.x = (pipes.length - 1) * 300 + 200;
    if (options && options.initial) this.x += 500;

    let topPipe = document.createElement("div");
    let bottomPipe = document.createElement("div");
    let passage = document.createElement("div");

    topPipe.classList.add("collision");
    bottomPipe.classList.add("collision");
    passage.classList.add("passage");

    this.sketch.appendChild(topPipe);
    this.sketch.appendChild(passage);
    this.sketch.appendChild(bottomPipe);

    this.sketch.style.left = `${this.x}px`;
    this.sketch.style.transform = `translateY(${-shift}%)`;

    pipes_HTML.appendChild(this.sketch);
  }

  delete() {
    this.sketch.remove();
  }
}

const birdA = new Bird();

function start() {
  let high_score =
    localStorage.getItem("high_score") &&
    JSON.parse(localStorage.getItem("high_score"));

  if (high_score) {
    if (score > high_score) {
      high_score = score;
      localStorage.setItem("high_score", JSON.stringify(score));
    }
  } else {
    high_score = score;
    localStorage.setItem("high_score", JSON.stringify(score));
  }
  high_score_HTML.innerText = high_score;
  score = 0;
  score_HTML.innerText = score;

  for (let i = 0; i < pipes.length; i++) {
    pipes[i].delete();
  }
  pipes = [];

  for (let _i = 0; _i < 4; _i++) {
    new Pipe({ initial: true });
  }
  birdA.isFlapping = true;
}

document.addEventListener("keydown", (e) => {
  if (e.key === " " && !game_over) {
    birdA.flap();
  }
});

start();

const gameInteralId = setInterval(() => {
  for (let i = 0; i < birds.length; i++) {
    if (birds[i].y <= 0) {
      birds[i].coordinates = [birds[i].x, 0];
    } else if (birds[i].y + 40 >= 500) {
      birds[i].coordinates = [birds[i].x, 460];
    }
  }

  for (let i = 0; i < pipes.length; i++) {
    pipes[i].x -= 1;
    pipes[i].sketch.style.left = pipes[i].x + "px";

    if (pipes[i].x === 0) {
      score++;
      score_HTML.innerText = score;
    }
    if (pipes[i].x + 100 <= 0) {
      pipes[i].delete();
      pipes.shift();
    }
    if (birdA.x - pipes[i].x <= 100 && birdA.x + 60 - pipes[i].x >= 0) {
      if (
        !(birdA.y - pipes[i].y <= 150 && birdA.y - pipes[i].y >= 0) ||
        birdA.y - pipes[i].y >= 110
      ) {
        game_over = true;
      }
    }
    if (birdA.y + 40 >= 500) {
      game_over = true;
    }

    if (game_over) {
      game_over = false;
      birdA.coordinates = [100, 100];
      start();
    }
    if (pipes.length < 4) new Pipe();
  }
}, 1);
