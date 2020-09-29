const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

let requestAnimationFrame = window.requestAnimationFrame;
let cancelAnimationFrame = window.cancelAnimationFrame;
let myReq;

const bird = new Image();
const bg = new Image();
const fg = new Image();
const pipeUp = new Image();
const pipeBottom = new Image();

bird.src = "img/bird.png";
bg.src = "img/bg.png";
fg.src = "img/fg.png";
pipeUp.src = "img/pipeUp.png";
pipeBottom.src = "img/pipeBottom.png";

const score_audio = new Audio();
score_audio.src = "audio/score.mp3";

let gap = 100;
let grav = 1.5;
let pipe = [];
let score;
let xPos;
let yPos;
let maxSpace;
let minSpace;

const wrapper = document.querySelector(".wrapper");
const btnPlay = document.getElementById("btnPlay");
const result = document.querySelector(".result");

btnPlay.addEventListener("click", () => {
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  score = 0;
  xPos = 10;
  yPos = 150;
  maxSpace = 100;
  minSpace = 20;
  pipe = [
    {
      x: cvs.width,
      y: 0,
    },
  ];
  draw();
  wrapper.style.display = "none";
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    yPos -= 25;
    if (yPos <= 0) {
      yPos = 0;
    }
  }
});

function draw() {
  ctx.drawImage(bg, 0, 0);

  for (let i = 0; i < pipe.length; i++) {
    ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y);
    ctx.drawImage(pipeBottom, pipe[i].x, pipe[i].y + pipeUp.height + gap);

    pipe[i].x--;

    if (pipe[i].x == 110) {
      pipe.push({
        x:
          cvs.width +
          Math.floor(Math.random() * (maxSpace - minSpace + 1)) +
          minSpace,
        y: Math.floor(Math.random() * pipeUp.height) - pipeUp.height,
      });
    }

    if (
      (xPos + bird.width >= pipe[i].x &&
        xPos <= pipe[i].x + pipeUp.width &&
        (yPos <= pipe[i].y + pipeUp.height ||
          yPos + bird.height >= pipe[i].y + pipeUp.height + gap)) ||
      yPos + bird.height >= cvs.height - fg.height
    ) {
      gameover(score);
      return;
    }

    if (pipe[i].x == 5) {
      score++;
      score_audio.play();
    }

    switch (score) {
      case 4:
        maxSpace = 80;
        minSpace = 15;
        break;
      case 8:
        maxSpace = 60;
        minSpace = 10;
        break;
      case 12:
        maxSpace = 40;
        minSpace = 5;
        break;
      case 16:
        maxSpace = 20;
        minSpace = 0;
        break;
    }
  }

  ctx.drawImage(fg, 0, cvs.height - fg.height);
  ctx.drawImage(bird, xPos, yPos);

  yPos += grav;

  ctx.fillStyle = "#000";
  ctx.font = "24px Arial";
  ctx.fillText("Счет: " + score, 10, cvs.height - 20);

  myReq = requestAnimationFrame(draw);
}

function gameover(value) {
  cancelAnimationFrame(myReq);
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  showResult(value);
  wrapper.style.display = "flex";
}

function showResult(count) {
  if (
    !localStorage.getItem("Score") ||
    +JSON.parse(localStorage.getItem("Score") < count)
  ) {
    localStorage.setItem("Score", JSON.stringify(count));
  }

  let val = +JSON.parse(localStorage.getItem("Score")) || 0;
  result.style.display = "block";
  result.innerHTML = "Ваш счет: " + score + ". <br> Ваш рекорд: " + val;
}
