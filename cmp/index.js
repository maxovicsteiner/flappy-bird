// this file contains the algorithm by which the computer will play

function cmp() {
  birdB.flap();

  const cmpInterval = setInterval(() => {
    if (closestPipe.y + 100 < birdB.y + 30 && !birdB.isFlapping) {
      birdB.flap();
    }
    if (!startCmp) {
      clearInterval(cmpInterval);
      main();
    }
  }, 1);
}

function main() {
  setTimeout(() => {
    // wait until closestPipe is defined
    cmp();
  }, 100);
}

main();
