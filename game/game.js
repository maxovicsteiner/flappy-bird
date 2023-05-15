const game = document.getElementById("game");
const pipes_HTML = document.getElementById("pipes");
let birds = [];
let pipes = [];

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
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
  constructor() {
    let shift = randomNumber(15, 40);
    this.sketch = document.createElement("div");
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
    this.sketch.style.transform = `translateY(${shift * -1}%)`;
    pipes_HTML.appendChild(this.sketch);
    pipes.push(this);
  }
}

const birdA = new Bird();

for (let i = 0; i < 20; i++) {
  let temp = new Pipe();
}

document.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    birdA.flap();
  }
});

let counter = 0;
setInterval(() => {
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
  pipes_HTML.style.transform = `translateX(${counter * -1}px)`;
}, 1);
