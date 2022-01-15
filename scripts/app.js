// variables
const startButton = document.querySelector(".start");
const stopButton = document.querySelector(".stop");
const backgroundAudio = new Audio("./audio/baby_shark.wav");
const containerD = document.querySelector(".containerD");
const containerF = document.querySelector(".containerF");
const containerJ = document.querySelector(".containerJ");
const containerK = document.querySelector(".containerK");
const allNoteTimeouts = [];
let collisionHeight = 562.5;
let noteFallSpeed = 1;
let comboCount = 0;
const accuracyScreen = document.querySelector(".accuracyScreen");
const comboScreen = document.querySelector(".comboScreen");

// timer variables
const timerBody = document.querySelector("#timer");
const timerScreen = timerBody.querySelector(".screen");
let timerId = null;

// note timings
const noteDTimings = [9250, 9750, 11000, 12750, 13500, 13750, 15000, 15750];
const noteFTimings = [
  8000, 9000, 9500, 10000, 10750, 13000, 13250, 14000, 14750, 15750,
];
const noteJTimings = [
  7750, 8250, 8750, 10250, 11250, 12000, 12250, 14500, 15250, 15750,
];
const noteKTimings = [8500, 10500, 11500, 11750, 12500, 14250, 15500, 15750];

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

// populate an array of note objects
const allNotes = [];
const dNotes = [];
const fNotes = [];
const jNotes = [];
const kNotes = [];

function populateNotes() {
  for (let i = 0; i < noteDTimings.length; i++) {
    const dNote = {
      timingInMs: noteDTimings[i],
      key: "d",
      container: containerD,
      hasBeenHit: false,
      position: null,
      element: null,
    };
    allNotes.push(dNote);
    dNotes.push(dNote);
  }
  for (let i = 0; i < noteFTimings.length; i++) {
    const fNote = {
      timingInMs: noteFTimings[i],
      key: "f",
      container: containerF,
      hasBeenHit: false,
      position: null,
      element: null,
    };
    allNotes.push(fNote);
    fNotes.push(fNote);
  }
  for (let i = 0; i < noteJTimings.length; i++) {
    const jNote = {
      timingInMs: noteJTimings[i],
      key: "j",
      container: containerJ,
      hasBeenHit: false,
      position: null,
      element: null,
    };
    allNotes.push(jNote);
    jNotes.push(jNote);
  }
  for (let i = 0; i < noteKTimings.length; i++) {
    const kNote = {
      timingInMs: noteKTimings[i],
      key: "k",
      container: containerK,
      hasBeenHit: false,
      position: null,
      element: null,
    };
    allNotes.push(kNote);
    kNotes.push(kNote);
  }
}

populateNotes();

// make note elements and animations
function startNoteFalls() {
  for (let i = 0; i < allNotes.length; i++) {
    const noteTimeout = setTimeout(() => {
      makeNote(allNotes[i]);
    }, allNotes[i].timingInMs - collisionHeight / noteFallSpeed);
    allNoteTimeouts.push(noteTimeout);
  }
}

function makeNote(note) {
  note.element = document.createElement("img");
  note.element.src = "./images/note.png";
  note.element.classList.add("note");
  note.container.append(note.element);

  let start;
  const maxHeight = collisionHeight * 1.5;

  // the note should be removed after max height not matter what. If it was already removed, there is no need to do it again.
  // the note should be removed when it has been hit.

  function nextStep(timestamp) {
    if (note.hasBeenHit) {
      // stop animating now
      note.container.removeChild(note.element);
      note.position = null;
      return;
    }
    if (note.position >= maxHeight) {
      miss("MISS");
      note.container.removeChild(note.element);
      note.position = null;
      return;
    }

    if (start === undefined) {
      start = timestamp;
    }
    const elapsed = timestamp - start;

    note.position = Math.min(elapsed * noteFallSpeed, maxHeight);
    note.element.style.transform = `translateY(${note.position}px)`;

    window.requestAnimationFrame(nextStep);
  }

  // Starting the note animation
  window.requestAnimationFrame(nextStep);
}

// play keys and add effects
window.addEventListener("keydown", (e) => {
  const keyDownTiming = parseFloat(timerScreen.innerHTML) * 1000;

  // set up keys
  const setupKeys = () => {
    if (e.key === "d" || e.key === "f" || e.key === "j" || e.key === "k") {
      // set up key audio
      const audio = document.querySelector(`audio[key="${e.key}"]`);
      audio.currentTime = 0;
      audio.play();

      // mute keys in intro
      if (keyDownTiming < d1 - 500) {
        audio.muted = true;
      } else {
        audio.muted = false;
      }

      // set up keydown effect
      const key = document.querySelector(`.key[key="${e.key}"]`);
      key.classList.add("playing");
    }
  };
  setupKeys();

  // judge accuracy
  const judge = (keyDownTiming) => {
    if (e.key === "d" || e.key === "f" || e.key === "j" || e.key === "k") {
      for (let i = 0; i < allNotes.length; i++) {
        const timingDiff =
          Math.abs(keyDownTiming - allNotes[i].timingInMs) / 31.25;
        if (timingDiff <= 1) {
          hit("PERFECT", i);
        } else if (timingDiff <= 2) {
          hit("GOOD", i);
        } else if (timingDiff <= 3) {
          hit("BAD", i);
        }
      }
    }
  };

  judge(keyDownTiming);
});

function hit(judgment, i) {
  accuracyScreen.innerHTML = judgment;
  console.log(judgment);
  comboCount++;
  comboScreen.innerHTML = comboCount;
  allNotes[i].hasBeenHit = true;
}

function miss(judgment) {
  accuracyScreen.innerHTML = judgment;
  console.log(judgment);
  comboCount = 0;
  comboScreen.innerHTML = comboCount;
}

window.addEventListener("keyup", (e) => {
  if (e.key === "d" || e.key === "f" || e.key === "j" || e.key === "k") {
    const key = document.querySelector(`.key[key="${e.key}"]`);
    key.classList.remove("playing");
  }
});

// instruction
const openModalButtons = document.querySelectorAll("[data-modal-target]");
const closeModalButtons = document.querySelectorAll("[data-close-button]");
const overlay = document.querySelector("#overlay");
const modal = document.querySelector("#instruction");

openModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openModal(modal);
  });
});

overlay.addEventListener("click", () => {
  const modals = document.querySelectorAll(".modal.active");
  modals.forEach((modal) => {
    closeModal(modal);
  });
});

closeModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".modal");
    closeModal(modal);
  });
});

function openModal(modal) {
  if (modal == null) {
    return;
  }
  modal.classList.add("active");
  overlay.classList.add("active");
}

function closeModal(modal) {
  if (modal == nul) {
    return;
  }
  modal.classList.remove("active");
  overlay.classList.remove("active");
}

// timer
let startTime = 0;
timerScreen.innerHTML = `${0 + "s"}`;

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
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
    startTime = null;
    allNoteTimeouts.forEach((note) => clearTimeout(note));
    handleResetTimer();
    accuracyScreen.innerHTML = null;
    comboScreen.innerHTML = null;
  }
  elapsedTime = 0;
  timerScreen.innerHTML = `${0 + "s"}`;
  backgroundAudio.currentTime = 0;
  backgroundAudio.play();
  startNoteFalls();
  handleStartTimer();
}

function stopGame() {
  backgroundAudio.pause();
  backgroundAudio.currentTime = 0;
  allNoteTimeouts.forEach((note) => clearTimeout(note));
  handleResetTimer();
  comboCount = 0;
  accuracyScreen.innerHTML = null;
  comboScreen.innerHTML = null;
  allNotes.forEach((note) => (note.hasBeenHit = false));
}

startButton.addEventListener("click", startGame);
stopButton.addEventListener("click", stopGame);
