const game = document.getElementById("game");
const pipes_HTML = document.getElementById("pipes");
let birds = [];
let pipes = [];

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

class Bird {
  constructor() {
    this.sketch = document.createElement("div");
    this.sketch.classList.add("bird");
    this.x = 100;
    this.y = 100;
    this.isFlapping = false;
    this.sketch.style.top = this.y + "px";
    this.sketch.style.left = this.x + "px";
    game.appendChild(this.sketch);
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

    let counter = 0;
    let scale = 0.02;
    const flappingId = setInterval(() => {
      this.y -= jumpingDistance / 50 - counter * scale;
      this.sketch.style.top = this.y + "px";
      if (++counter >= jumpingDistance) {
        clearInterval(flappingId);
        this.isFlapping = false;
        this.fall();
      }
    }, 1);
  }
  fall() {
    if (this.isFlapping) return;
    if (this.y >= 450) return;
    let iteration = 0;
    let acceleration = 0.02;
    const fallId = setInterval(() => {
      this.y += iteration * acceleration;
      this.sketch.style.top = this.y + "px";
      iteration++;
      if (this.y >= 450 || this.isFlapping) {
        clearInterval(fallId);
      }
    }, 1);
  }
}

class Pipe {
  constructor(options) {
    let shift = randomNumber(15, 40);
    let y = (shift / 100) * 1150;
    this.y = -y + 500;
    this.sketch = document.createElement("div");
    pipes.push(this);
    this.x = (pipes.length - 1) * 300 + 200;
    if (options && options.initial) this.x += 500;
    this.sketch.classList.add("pipe");
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

for (let _i = 0; _i < 4; _i++) {
  new Pipe({ initial: true });
}
let game_over = false;

document.addEventListener("keydown", (e) => {
  if (e.key === " " && !game_over) {
    birdA.flap();
  }
});

let counter = 0;

const gameId = setInterval(() => {
  for (let i = 0; i < birds.length; i++) {
    if (birds[i].y <= 0) {
      birds[i].y = 0;
      birds[i].sketch.style.top = birds[i].y + "px";
    } else if (birds[i].y + 50 >= 500) {
      birds[i].y = 450;
      birds[i].sketch.style.top = birds[i].y + "px";
    }
  }
  counter++;

  for (let i = 0; i < pipes.length; i++) {
    pipes[i].x -= 1;
    pipes[i].sketch.style.left = pipes[i].x + "px";
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
        clearInterval(gameId);
      }
    }
    if (birdA.y + 40 === 500) {
      game_over = true;
      clearInterval(gameId);
    }
    if (pipes.length < 4) new Pipe();
  }
}, 1);
