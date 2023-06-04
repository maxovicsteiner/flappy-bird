const game = document.getElementById("game");
const pipes_HTML = document.getElementById("pipes");
const score_HTML = document.getElementById("score");
const high_score_HTML = document.getElementById("high_score");
const cmp_score_HTML = document.getElementById("cmp_score");
const cmp_high_score_HTML = document.getElementById("cmp_high_score");

let birds = [];
let pipes = [];
let game_over = false;
let score = 0;
let cmp_score = 0;
let cmp_high_score = 0;

score_HTML.innerText = score;
cmp_score_HTML.innerText = cmp_score;

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

let startCmp = true;

// this function is just to restart the cmp
function restart() {
  startCmp = false;
  setTimeout(() => {
    startCmp = true;
  }, 100);
}

class Bird {
  constructor(isPlayable) {
    this.x = 100;
    this.y = 100;

    this.sketch = document.createElement("div");
    this.sketch.classList.add("bird");
    this.sketch.style.top = this.y + "px";
    this.sketch.style.left = this.x + "px";
    game.appendChild(this.sketch);

    this.isFlapping = false;

    birds.push(this);

    if (!isPlayable) {
      this.sketch.classList.add("cmp");
    }
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

  kill() {
    // delete from array and delete sketch
    birds = birds.filter((bird) => bird !== this);
    this.sketch.remove();
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

    this.x = (pipes.length - 1) * 350 + 250;
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

let birdA;
let birdB;

function start() {
  birdB = new Bird();
  birdA = new Bird(true);

  restart();

  let cmp_high_score =
    localStorage.getItem("cmp_high_score") &&
    JSON.parse(localStorage.getItem("cmp_high_score"));

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

  if (cmp_high_score) {
    if (cmp_score > cmp_high_score) {
      cmp_high_score = cmp_score;
      localStorage.setItem("cmp_high_score", JSON.stringify(cmp_score));
    }
  } else {
    cmp_high_score = cmp_score;
    localStorage.setItem("cmp_high_score", JSON.stringify(cmp_score));
  }

  high_score_HTML.innerText = high_score;
  score = 0;
  score_HTML.innerText = score;

  cmp_high_score_HTML.innerText = cmp_high_score;
  cmp_score = 0;
  cmp_score_HTML.innerText = cmp_score;

  for (let i = 0; i < pipes.length; i++) {
    pipes[i].delete();
  }
  pipes = [];

  for (let _i = 0; _i < 4; _i++) {
    new Pipe({ initial: true });
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === " " && !game_over) {
    birdA.flap();
  }
});

document.addEventListener("pointerdown", () => {
  if (!game_over) {
    birdA.flap();
  }
});

start();

let closestPipe;

const gameInteralId = setInterval(() => {
  for (let i = 0; i < birds.length; i++) {
    if (birds[i].y <= 0) {
      birds[i].coordinates = [birds[i].x, 0];
    } else if (birds[i].y + 40 >= 500) {
      birds[i].coordinates = [birds[i].x, 460];
    }
  }

  closestPipe = pipes[0];
  if (closestPipe.x + 100 < birdA.x) {
    closestPipe = pipes[1];
  }

  for (let i = 0; i < pipes.length; i++) {
    pipes[i].x -= 1;
    pipes[i].sketch.style.left = pipes[i].x + "px";

    if (pipes[i].x === 0 && birds.includes(birdA)) {
      score++;
      score_HTML.innerText = score;
    }
    if (pipes[i].x === 0 && birds.includes(birdB)) {
      cmp_score++;
      cmp_score_HTML.innerText = cmp_score;
    }
    if (pipes[i].x + 100 <= 0) {
      pipes[i].delete();
      pipes.shift();
    }

    for (let k = 0; k < birds.length; k++) {
      if (birds[k].x - pipes[i].x <= 100 && birds[k].x + 60 - pipes[i].x >= 0) {
        if (
          !(birds[k].y - pipes[i].y <= 150 && birds[k].y - pipes[i].y >= 0) ||
          birds[k].y - pipes[i].y >= 110
        ) {
          birds[k].kill();
        }
      }
      if (birds[k]?.y + 40 >= 500) {
        birds[k]?.kill();
      }
    }

    game_over = birds.length === 0;
  }
  if (game_over) {
    game_over = false;
    birdA.coordinates = [100, 100];
    birdB.coordinates = [100, 100];
    start();
  }
  if (pipes.length < 4) new Pipe();
}, 1);
