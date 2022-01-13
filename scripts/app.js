// variables
const startButton = document.querySelector(".start");
const stopButton = document.querySelector(".stop");
const backgroundAudio = new Audio("./audio/baby_shark.wav");
const containerD = document.querySelector(".containerD");
const containerF = document.querySelector(".containerF");
const containerJ = document.querySelector(".containerJ");
const containerK = document.querySelector(".containerK");
const noteDTimings = [];
const noteFTimings = [];
const noteJTimings = [];
const noteKTimings = [];
const allNoteTimeouts = [];
let collisionHeight = 562.5;
let noteFallSpeed = 1;

// timer variables
const timerBody = document.querySelector("#timer");
const timerScreen = timerBody.querySelector(".screen");
let timerId = null;

// note timings
const d1 = 16750;
const d2 = d1 + 2500;
const d3 = d2 + 2000;

const f1 = d1 + 500;
const f2 = f1 + 2250;
const f3 = f2 + 2000;

const j = d1 + 7000;

const k1 = d1 + 1000;
const k2 = k1 + 250;
const k3 = k2 + 250;
const k4 = k3 + 250;
const k5 = k4 + 125;
const k6 = k5 + 250;
const k7 = k6 + 125;

const k8 = d1 + 6500;
const k9 = k8 + 250;

for (let i = 0; i < 6; i++) {
  // d
  noteDTimings.push(d1 + 8000 * i);
  noteDTimings.push(d2 + 8000 * i);
  noteDTimings.push(d3 + 8000 * i);
  // f
  noteFTimings.push(f1 + 8000 * i);
  noteFTimings.push(f2 + 8000 * i);
  noteFTimings.push(f3 + 8000 * i);
  // j
  noteJTimings.push(j + 8000 * i);
  // k
  for (let j = 0; j < 3; j++) {
    noteKTimings.push(k1 + 2000 * j + 8000 * i);
    noteKTimings.push(k2 + 2000 * j + 8000 * i);
    noteKTimings.push(k3 + 2000 * j + 8000 * i);
    noteKTimings.push(k4 + 2000 * j + 8000 * i);
    noteKTimings.push(k5 + 2000 * j + 8000 * i);
    noteKTimings.push(k6 + 2000 * j + 8000 * i);
    noteKTimings.push(k7 + 2000 * j + 8000 * i);
  }
  noteKTimings.push(k8 + 8000 * i);
  noteKTimings.push(k9 + 8000 * i);
}

function makeNote(i, container) {
  const note = document.createElement("img");
  note.src = "./images/note.png";
  note.classList.add("note");
  container.append(note);

  let position = 0;

  let start, previousTimeStamp;
  const maxHeight = collisionHeight * 1.2;

  function nextStep(timestamp) {
    if (position >= maxHeight) {
      container.removeChild(note);
      return;
    }
    if (start === undefined) {
      start = timestamp;
    }
    const elapsed = timestamp - start;
    if (previousTimeStamp !== timestamp) {
      position = Math.min(elapsed * noteFallSpeed, maxHeight);
      note.style.transform = `translateY(${position}px)`;
      console.log(noteDTimings[i]);
    }
    if (elapsed < 2000) {
      previousTimeStamp = timestamp;
      window.requestAnimationFrame(nextStep);
    }
  }

  // Starting the note animation
  window.requestAnimationFrame(nextStep);
}

function startNoteFalls() {
  for (let i = 0; i < noteDTimings.length; i++) {
    const noteTimeout = setTimeout(() => {
      makeNote(i, containerD);
    }, noteDTimings[i] - collisionHeight / noteFallSpeed);
    allNoteTimeouts.push(noteTimeout);
  }

  for (let i = 0; i < noteFTimings.length; i++) {
    const noteTimeout = setTimeout(() => {
      makeNote(i, containerF);
    }, noteFTimings[i] - collisionHeight / noteFallSpeed);
    allNoteTimeouts.push(noteTimeout);
  }

  for (let i = 0; i < noteJTimings.length; i++) {
    const noteTimeout = setTimeout(() => {
      makeNote(i, containerJ);
    }, noteJTimings[i] - collisionHeight / noteFallSpeed);
    allNoteTimeouts.push(noteTimeout);
  }

  for (let i = 0; i < noteKTimings.length; i++) {
    const noteTimeout = setTimeout(() => {
      makeNote(i, containerK);
    }, noteKTimings[i] - collisionHeight / noteFallSpeed);
    allNoteTimeouts.push(noteTimeout);
  }
}

// play keys and add effects
window.addEventListener("keydown", function (e) {
  const audio = document.querySelector(`audio[key="${e.key}"]`);
  const key = document.querySelector(`.key[key="${e.key}"]`);
  audio.currentTime = 0;
  audio.play();
  key.classList.add("playing");
});

window.addEventListener("keyup", function (e) {
  const key = document.querySelector(`.key[key="${e.key}"]`);
  key.classList.remove("playing");
});

// timer
let startTime = 0;

function handleStartTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  } else {
    timerId = setInterval(() => {
      if (!startTime) {
        startTime = Date.now();
      }
      let elapsedTime = Date.now() - startTime;
      timerScreen.innerHTML = `${(elapsedTime / 1000).toFixed(3) + "s"}`;
    }, 10);
  }
}

function handleResetTimer() {
  clearInterval(timerId);
  timerId = null;
  startTime = null;
  elapsedTime = 0;
  timerScreen.innerHTML = `${0 + "s"}`;
}

// start and stop game
function startGame() {
  backgroundAudio.play();
  startNoteFalls();
  handleStartTimer();
}

function stopGame() {
  backgroundAudio.pause();
  backgroundAudio.currentTime = 0;
  allNoteTimeouts.forEach((note) => clearTimeout(note));
  handleResetTimer();
}

startButton.addEventListener("click", startGame);
stopButton.addEventListener("click", stopGame);
