// variables
const startButton = document.querySelector("#start");
const stopButton = document.querySelector("#stop");
const backgroundAudio = document.querySelector("#backgroundAudio");
const comboAudio = document.querySelector("#comboAudio");
const maxComboAudio = document.querySelector("#maxComboAudio");
const container = document.querySelector(".container");
const containerD = document.querySelector(".containerD");
const containerF = document.querySelector(".containerF");
const containerJ = document.querySelector(".containerJ");
const containerK = document.querySelector(".containerK");
const allNoteTimeouts = [];
const barTimeouts = [];
let collisionHeight = 600;
let noteFallSpeed = 1;
let comboCount = 0;
const accuracyScreen = document.querySelector(".accuracyScreen");
const comboScreen = document.querySelector(".comboScreen");
let perfectNotes = 0;
let perfectPercentages = 0;
let goodNotes = 0;
let goodPercentages = 0;
let badNotes = 0;
let badPercentages = 0;
let missedNotes = 0;
let missedPercentages = 0;
const highestCombos = [];
const speedScreen = document.querySelector("#speed .screen");
speedScreen.innerHTML = noteFallSpeed;
const settingsSpeed = document.querySelector(".settingsScreen");
settingsSpeed.innerHTML = noteFallSpeed;

let totalHitScore = 0;

// timer variables
const timerBody = document.querySelector("#timer");
const timerScreen = timerBody.querySelector(".screen");
let timerId = null;
let elapsedTime = 0;

// note timings
const noteDTimings = [
  9250, 9750, 11000, 12750, 13500, 13750, 15000, 15750, 89325, 89700, 90075,
];
const noteFTimings = [
  8000, 9000, 9500, 10000, 10750, 13000, 13250, 14000, 14750, 15750, 89450,
  89825,
];
const noteJTimings = [
  7750, 8250, 8750, 10250, 11250, 12000, 12250, 14500, 15250, 15750,
];
const noteKTimings = [
  8500, 10500, 11500, 11750, 12500, 14250, 15500, 15750, 89075, 90075,
];

// 120bpm, 2/4, 8th note = halfABeat

function makeNoteTimings(k1, halfABeat, numberOfRepeats, repeatIn) {
  let k2 = k1 + halfABeat;
  let k3 = k2 + halfABeat;
  let k4 = k3 + halfABeat;
  let k5 = k4 + halfABeat / 2;
  let k6 = k5 + halfABeat;
  let k7 = k6 + halfABeat / 2;

  let k8 = k1 + halfABeat * 22;
  let k9 = k8 + halfABeat;

  let d1 = k1 - halfABeat * 4;
  let d2 = k1 + halfABeat * 6;
  let d3 = d2 + halfABeat * 8;

  let f1 = k1 - halfABeat * 2;
  let f2 = f1 + halfABeat * 9;
  let f3 = f2 + halfABeat * 8;

  let j = k1 + halfABeat * 24;

  let modulatedD1 = 64770;
  let modulatedF1 = 65250;

  // repeat
  for (let i = 0; i < numberOfRepeats; i++) {
    // d
    if (k1 < 65000 || 75000 < k1) {
      noteDTimings.push(d1 + repeatIn * halfABeat * i);
    } else {
      noteDTimings.push(modulatedD1);
    }
    noteDTimings.push(d2 + repeatIn * halfABeat * i);
    noteDTimings.push(d3 + repeatIn * halfABeat * i);
    // f
    if (k1 < 65000 || 75000 < k1) {
      noteFTimings.push(f1 + repeatIn * halfABeat * i);
    } else {
      noteFTimings.push(modulatedF1);
    }
    noteFTimings.push(f2 + repeatIn * halfABeat * i);
    noteFTimings.push(f3 + repeatIn * halfABeat * i);
    // j
    if (k1 < 75000 || i === 0) {
      noteJTimings.push(j + repeatIn * halfABeat * i);
    }
    // k
    for (let j = 0; j < 3; j++) {
      noteKTimings.push(k1 + halfABeat * 8 * j + repeatIn * halfABeat * i);
      noteKTimings.push(k2 + halfABeat * 8 * j + repeatIn * halfABeat * i);
      noteKTimings.push(k3 + halfABeat * 8 * j + repeatIn * halfABeat * i);
      noteKTimings.push(k4 + halfABeat * 8 * j + repeatIn * halfABeat * i);
      if (k1 > 75000 && i === 1 && j === 2) {
        noteJTimings.push(k5 + halfABeat * 8 * j + repeatIn * halfABeat * i);
        noteJTimings.push(k6 + halfABeat * 8 * j + repeatIn * halfABeat * i);
        noteJTimings.push(k7 + halfABeat * 8 * j + repeatIn * halfABeat * i);
      } else {
        noteKTimings.push(k5 + halfABeat * 8 * j + repeatIn * halfABeat * i);
        noteKTimings.push(k6 + halfABeat * 8 * j + repeatIn * halfABeat * i);
        noteKTimings.push(k7 + halfABeat * 8 * j + repeatIn * halfABeat * i);
      }
    }
    if (k1 < 75000 || i === 0) {
      noteKTimings.push(k8 + repeatIn * halfABeat * i);
      noteKTimings.push(k9 + repeatIn * halfABeat * i);
    }
  }
}

makeNoteTimings(17750, 250, 6, 32);
makeNoteTimings(65735, 227.25, 1, 32);
makeNoteTimings(75075, 250, 2, 32);

// populate an array of note objects
const allNotes = [];

function populateNotes() {
  for (let i = 0; i < noteDTimings.length; i++) {
    const dNote = {
      timingInMs: noteDTimings[i],
      key: "d",
      container: containerD,
      hasBeenHit: false,
      position: null,
      element: null,
      judgment: null,
      score: null,
    };
    allNotes.push(dNote);
  }
  for (let i = 0; i < noteFTimings.length; i++) {
    const fNote = {
      timingInMs: noteFTimings[i],
      key: "f",
      container: containerF,
      hasBeenHit: false,
      position: null,
      element: null,
      judgment: null,
      score: null,
    };
    allNotes.push(fNote);
  }
  for (let i = 0; i < noteJTimings.length; i++) {
    const jNote = {
      timingInMs: noteJTimings[i],
      key: "j",
      container: containerJ,
      hasBeenHit: false,
      position: null,
      element: null,
      judgment: null,
      score: null,
    };
    allNotes.push(jNote);
  }
  for (let i = 0; i < noteKTimings.length; i++) {
    const kNote = {
      timingInMs: noteKTimings[i],
      key: "k",
      container: containerK,
      hasBeenHit: false,
      position: null,
      element: null,
      judgment: null,
      score: null,
    };
    allNotes.push(kNote);
  }
}

populateNotes();

// bar indicator timings
const barTimings = [];

function makeBarTimings() {
  for (let i = 0; i < 65; i++) {
    barTimings.push(750 + 1000 * i);
  }
  for (let j = 0; j < 9; j++) {
    barTimings.push(65735 + 909 * j);
  }
  for (let k = 0; k < 17; k++) {
    barTimings.push(74075 + 1000 * k);
  }
}

makeBarTimings();

// make bar objects
const bars = [];

function populateBars() {
  for (let i = 0; i < barTimings.length; i++) {
    const bar = {
      timingInMs: barTimings[i],
      position: null,
      element: null,
    };
    bars.push(bar);
  }
}

populateBars();

// make bar indicators and animations
function startbarIndicatorFalls() {
  for (let i = 0; i < bars.length; i++) {
    const barTimeout = setTimeout(() => {
      makeBar(bars[i]);
    }, bars[i].timingInMs - collisionHeight / noteFallSpeed);
    barTimeouts.push(barTimeout);
  }
}

function makeBar(bar) {
  bar.element = document.createElement("div");
  bar.element.classList.add("barIndicator");
  container.append(bar.element);

  let start;
  bar.position = 0;

  function nextStep(timestamp) {
    if (bar.position >= 800) {
      container.removeChild(bar.element);
      bar.position = null;
      return;
    }

    const elapsed =
      Date.now() -
      startTime -
      bar.timingInMs +
      (collisionHeight + 40) / noteFallSpeed;

    bar.position = Math.min(elapsed * noteFallSpeed, 800);
    bar.element.style.transform = `translateY(${bar.position}px)`;

    barStopID = window.requestAnimationFrame(nextStep);
  }

  // Starting the bar animation
  window.requestAnimationFrame(nextStep);
}

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
  const maxHeight = 720;

  function nextStep() {
    if (note.hasBeenHit) {
      // stop animating now
      note.container.removeChild(note.element);
      note.position = null;
      return;
    }

    // if note passed max height and there was no hit, judge as miss
    if (note.position >= maxHeight) {
      miss("MISS", note);
      note.container.removeChild(note.element);
      note.position = null;
      return;
    }

    const elapsed =
      Date.now() -
      startTime -
      note.timingInMs +
      collisionHeight / noteFallSpeed;

    note.position = Math.min(elapsed * noteFallSpeed, maxHeight);
    note.element.style.transform = `translateY(${note.position}px)`;

    noteStopID = window.requestAnimationFrame(nextStep);
  }

  // Starting the note animation
  window.requestAnimationFrame(nextStep);
}

// play keys and add effects
window.addEventListener("keydown", (e) => {
  // set up keys
  const setupKeys = () => {
    if (e.key === "d" || e.key === "f" || e.key === "j" || e.key === "k") {
      // set up key audio
      const audio = document.querySelector(`audio[key="${e.key}"]`);
      const modAudio = document.querySelector(`audio[key="${e.key}Mod"]`);
      if (elapsedTime > 64700 && elapsedTime < 92000) {
        modAudio.currentTime = 0;
        modAudio.play();
      } else {
        audio.currentTime = 0;
        audio.play();
      }

      // mute keys in intro & mute keys when mute icon is pressed
      if (elapsedTime < 16250 || backgroundAudio.muted === true) {
        audio.muted = true;
        modAudio.muted = true;
      } else {
        audio.muted = false;
        modAudio.muted = false;
      }

      // set up keydown effect
      const key = document.querySelector(`.key[key="${e.key}"]`);
      key.classList.add("playing");

      // developer feature: show elapsed time in ms
      console.log(elapsedTime);
    }

    // allow arrow up and down to change note fall speed in settings pop-up
    if (settingsModal.classList.contains("active")) {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (noteFallSpeed < 10.0) {
          noteFallSpeed = (parseFloat(noteFallSpeed) + 0.1).toFixed(1);
          speedScreen.innerHTML = noteFallSpeed;
          settingsSpeed.innerHTML = noteFallSpeed;
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (noteFallSpeed > 0.1) {
          noteFallSpeed = (parseFloat(noteFallSpeed) - 0.1).toFixed(1);
          speedScreen.innerHTML = noteFallSpeed;
          settingsSpeed.innerHTML = noteFallSpeed;
        }
      }
    }
  };
  setupKeys();

  // judge accuracy
  const judge = (elapsedTime) => {
    for (let i = 0; i < allNotes.length; i++) {
      const timingDiff = Math.abs(elapsedTime - allNotes[i].timingInMs) / 31.25;
      if (allNotes[i].key === e.key) {
        if (e.repeat) {
          return;
        }
        if (timingDiff <= 1) {
          hit("PERFECT", allNotes[i]);
        } else if (timingDiff <= 2) {
          hit("GOOD", allNotes[i]);
        } else if (timingDiff <= 3) {
          hit("BAD", allNotes[i]);
        }
      }
    }
  };

  judge(elapsedTime);
});

// handle note hits
function hit(judgment, note) {
  if (note.hasBeenHit) {
    return;
  }
  accuracyScreen.innerHTML = judgment;
  comboCount++;
  comboScreen.innerHTML = comboCount;
  note.hasBeenHit = true;
  note.judgment = judgment;

  //scoring
  if (judgment === "PERFECT") {
    note.score = 15;
  } else if (judgment === "GOOD") {
    note.score = 10;
  } else if (judgment === "BAD") {
    note.score = 5;
  }
  score += note.score;
  scoreScreen.innerHTML = score;

  handleCombo(note);
}

// handle misses
function miss(judgment, note) {
  accuracyScreen.innerHTML = judgment;
  note.judgment = judgment;
  note.score = 0;
  highestCombos.push(comboCount);
  comboCount = 0;
  comboScreen.innerHTML = comboCount;
}

// remove playing effect on keys when keys are up
window.addEventListener("keyup", (e) => {
  if (e.key === "d" || e.key === "f" || e.key === "j" || e.key === "k") {
    const key = document.querySelector(`.key[key="${e.key}"]`);
    key.classList.remove("playing");
  }
});

// track score
let score = 0;
const scoreBody = document.querySelector("#score");
const scoreScreen = scoreBody.querySelector(".screen");
scoreScreen.innerHTML = 0;

// add bonus score for combos
let maxComboReached = null;

function handleCombo(note) {
  let comboBonus = comboCount / 50;
  for (i = 0; i < 3; i++) {
    if (comboBonus === 1 + i * 2) {
      score += 30 + i * 40;
      scoreScreen.innerHTML = score;
    } else if (comboBonus === 2 + i * 2) {
      score += 50 + i * 40;
      scoreScreen.innerHTML = score;
      comboAudio.play();
    }
  }
  if (note === allNotes[allNotes.length - 1]) {
    if (comboCount === allNotes.length) {
      score += 500;
      maxComboAudio.play();
      scoreScreen.innerHTML = score;
      maxComboReached = true;
      highestCombos.push(allNotes.length);
    } else {
      highestCombos.push(comboCount);
    }
  }
}

// generate result screen
const resultScore = document.querySelector("#resultScore");

function generateResult() {
  resultScore.innerHTML = score;
  makeHitPercentages();
  calculateGrade();
  makePieChart();
  findMaxCombo();
}

// calculate the percantages of each hit judgment
const perfectNotesScreen = document.querySelector("#perfectNotes");
const goodNotesScreen = document.querySelector("#goodNotes");
const badNotesScreen = document.querySelector("#badNotes");
const missedNotesScreen = document.querySelector("#missedNotes");

function makeHitPercentages() {
  allNotes.forEach((note) => {
    if (note.judgment === "PERFECT") {
      perfectNotes += 1;
    } else if (note.judgment === "GOOD") {
      goodNotes += 1;
    } else if (note.judgment === "BAD") {
      badNotes += 1;
    } else if (note.judgment === "MISS") {
      missedNotes += 1;
    }
  });
  perfectPercentages = ((perfectNotes / allNotes.length) * 100).toFixed(2);
  goodPercentages = ((goodNotes / allNotes.length) * 100).toFixed(2);
  badPercentages = ((badNotes / allNotes.length) * 100).toFixed(2);
  missedPercentages = ((missedNotes / allNotes.length) * 100).toFixed(2);
  perfectNotesScreen.innerHTML = `${perfectPercentages}%`;
  goodNotesScreen.innerHTML = `${goodPercentages}%`;
  badNotesScreen.innerHTML = `${badPercentages}%`;
  missedNotesScreen.innerHTML = `${missedPercentages}%`;
}

// make a pie chart from the hit judgments
const pieChart = document.querySelector(".pieChart");

function makePieChart() {
  pieChart.style.background = `
  conic-gradient(
    #155ba7 0, 
    #155ba7 ${perfectPercentages}%,
    #57cdf5 0, 
    #57cdf5 ${parseFloat(perfectPercentages) + parseFloat(goodPercentages)}%,
    #FF8C33 0, 
    #FF8C33 ${
      parseFloat(perfectPercentages) +
      parseFloat(goodPercentages) +
      parseFloat(badPercentages)
    }%,
    #ffd600 0, 
    #ffd600 100%)`;
}

// calculate grade
let grade = null;
let scorePercentages = 0;
const gradeScreen = document.querySelector("#grade");

function calculateGrade() {
  scorePercentages = Math.round((score / 5630) * 100);
  if (scorePercentages >= 80) {
    grade = "S";
  } else if (scorePercentages >= 60) {
    grade = "A";
  } else if (scorePercentages >= 40) {
    grade = "B";
  } else if (scorePercentages >= 20) {
    grade = "C";
  } else {
    grade = "F";
  }

  gradeScreen.innerHTML = grade;
}

// find the highest combo
let maxComboCount = 0;
const maxCombo = document.querySelector("#maxCombo");

function findMaxCombo() {
  maxComboCount = 0;
  maxComboCount = highestCombos.reduce((a, b) => {
    return Math.max(a, b);
  }, 0);
  maxCombo.innerHTML = maxComboCount;
}

// instruction and settings pop up
const instructionButton = document.querySelector("#instructionButton");
const settingsButton = document.querySelector("#settingsButton");
const instructionCloseButton = document.querySelector(
  "#instructionCloseButton"
);
const settingsCloseButton = document.querySelector("#settingsCloseButton");
const resultCloseButton = document.querySelector("#resultCloseButton");
const instructionModal = document.querySelector("#instructionModal");
const settingsModal = document.querySelector("#settingsModal");
const resultModal = document.querySelector("#resultModal");
const overlay = document.querySelector("#overlay");

instructionButton.addEventListener("click", () => {
  openModal(instructionModal);
});

settingsButton.addEventListener("click", () => {
  const settingsModal = document.querySelector("#settingsModal");
  if (elapsedTime >= 92000 || elapsedTime === 0) {
    openModal(settingsModal);
  }
});

instructionCloseButton.addEventListener("click", () => {
  closeModal(instructionModal);
});

settingsCloseButton.addEventListener("click", () => {
  closeModal(settingsModal);
});

resultCloseButton.addEventListener("click", () => {
  closeModal(resultModal);
});

overlay.addEventListener("click", () => {
  const modals = document.querySelectorAll(".modal.active");
  modals.forEach((modal) => {
    closeModal(modal);
  });
});

function openModal(modal) {
  if (modal === null) {
    return;
  }
  modal.classList.add("active");
  overlay.classList.add("active");
}

function closeModal(modal) {
  if (modal === null) {
    return;
  }
  modal.classList.remove("active");
  overlay.classList.remove("active");
}

// mute button
const muteButton = document.querySelector("#muteButton");
const muteButtonImage = muteButton.querySelector("img");

function muteAudio() {
  document.querySelectorAll("audio").forEach((audio) => {
    if (backgroundAudio.muted === true) {
      muteButtonImage.src = "./images/mute.png";
      audio.muted = false;
    } else if (backgroundAudio.muted === false) {
      muteButtonImage.src = "./images/play.png";
      audio.muted = true;
    }
  });
}

muteButton.addEventListener("click", muteAudio);

// timer
let startTime = 0;
timerScreen.innerHTML = `${elapsedTime + "s"}`;

function handleStartTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  } else {
    timerId = setInterval(() => {
      if (!startTime) {
        startTime = Date.now();
      }
      elapsedTime = Date.now() - startTime;
      timerScreen.innerHTML = `${(elapsedTime / 1000).toFixed() + "s"}`;
      // wait for elapsedTime to update and play background music in sync with elapsedtime
      if (elapsedTime > 1000 && elapsedTime < 2000) {
        playBackgroundMusic();
      }
      if (elapsedTime >= 92000) {
        clearInterval(timerId);
        generateResult();
        openModal(resultModal);
      }
    }, 10);
  }
}

function handleResetTimer() {
  clearInterval(timerId);
  timerId = null;
  startTime = null;
  elapsedTime = 0;
}

function playBackgroundMusic() {
  if (backgroundAudio.duration > 0 && !backgroundAudio.paused) {
    return;
  }
  backgroundAudio.currentTime = elapsedTime / 1000;
  backgroundAudio.play();
}

function resetGame() {
  backgroundAudio.pause();
  backgroundAudio.currentTime = 0;
  allNoteTimeouts.forEach((note) => clearTimeout(note));
  barTimeouts.forEach((note) => clearTimeout(note));
  handleResetTimer();
  accuracyScreen.innerHTML = null;
  timerScreen.innerHTML = `${elapsedTime}s`;
  allNotes.forEach((note) => {
    note.hasBeenHit = false;
    note.judgment = false;
    note.score = null;
  });
  comboScreen.innerHTML = null;
  maxComboReached = null;
  // reset scores
  perfectPercentages = 0;
  goodPercentages = 0;
  badPercentages = 0;
  missedPercentages = 0;
  perfectNotes = 0;
  goodNotes = 0;
  badNotes = 0;
  missedNotes = 0;
  grade = null;
  comboCount = 0;
  score = 0;
  scoreScreen.innerHTML = score;
  maxComboCount = 0;
  highestCombos.length = 0;
}

// start and stop game
function startGame() {
  resetGame();
  startNoteFalls();
  startbarIndicatorFalls();
  handleStartTimer();
}

function stopGame() {
  resetGame();
}

startButton.addEventListener("click", startGame);
stopButton.addEventListener("click", stopGame);
