// variables
const startButton = document.querySelector("#start");
const stopButton = document.querySelector("#stop");
const backgroundAudio = new Audio("./audio/baby_shark.wav");
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

let totalHitScore = 0;

// timer variables
const timerBody = document.querySelector("#timer");
const timerScreen = timerBody.querySelector(".screen");
let timerId = null;
let elapsedTime = 0;

// note timings
const noteDTimings = [
  9250, 9750, 11000, 12750, 13500, 13750, 15000, 15750, 89200, 89575, 90075,
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

// 120bpm, 2/4, 8th note = beat

function makeNoteTimings(k1, beat, numberOfRepeats, repeatIn) {
  let k2 = k1 + beat;
  let k3 = k2 + beat;
  let k4 = k3 + beat;
  let k5 = k4 + beat / 2;
  let k6 = k5 + beat;
  let k7 = k6 + beat / 2;

  let k8 = k1 + beat * 22;
  let k9 = k8 + beat;

  let d1 = k1 - beat * 4;
  let d2 = k1 + beat * 6;
  let d3 = d2 + beat * 8;

  let f1 = k1 - beat * 2;
  let f2 = f1 + beat * 9;
  let f3 = f2 + beat * 8;

  let j = k1 + beat * 24;

  let modulatedD1 = 64770;
  let modulatedF1 = 65250;

  // repeat
  for (let i = 0; i < numberOfRepeats; i++) {
    // d
    if (k1 < 65000 || 75000 < k1) {
      noteDTimings.push(d1 + repeatIn * beat * i);
    } else {
      noteDTimings.push(modulatedD1);
    }
    noteDTimings.push(d2 + repeatIn * beat * i);
    noteDTimings.push(d3 + repeatIn * beat * i);
    // f
    if (k1 < 65000 || 75000 < k1) {
      noteFTimings.push(f1 + repeatIn * beat * i);
    } else {
      noteFTimings.push(modulatedF1);
    }
    noteFTimings.push(f2 + repeatIn * beat * i);
    noteFTimings.push(f3 + repeatIn * beat * i);
    // j
    if (k1 < 75000 || i === 0) {
      noteJTimings.push(j + repeatIn * beat * i);
    }
    // k
    for (let j = 0; j < 3; j++) {
      noteKTimings.push(k1 + beat * 8 * j + repeatIn * beat * i);
      noteKTimings.push(k2 + beat * 8 * j + repeatIn * beat * i);
      noteKTimings.push(k3 + beat * 8 * j + repeatIn * beat * i);
      noteKTimings.push(k4 + beat * 8 * j + repeatIn * beat * i);
      if (k1 > 75000 && i === 1 && j === 2) {
        noteJTimings.push(k5 + beat * 8 * j + repeatIn * beat * i);
        noteJTimings.push(k6 + beat * 8 * j + repeatIn * beat * i);
        noteJTimings.push(k7 + beat * 8 * j + repeatIn * beat * i);
      } else {
        noteKTimings.push(k5 + beat * 8 * j + repeatIn * beat * i);
        noteKTimings.push(k6 + beat * 8 * j + repeatIn * beat * i);
        noteKTimings.push(k7 + beat * 8 * j + repeatIn * beat * i);
      }
    }
    if (k1 < 75000 || i === 0) {
      noteKTimings.push(k8 + repeatIn * beat * i);
      noteKTimings.push(k9 + repeatIn * beat * i);
    }
  }
}

makeNoteTimings(17750, 250, 6, 32);
makeNoteTimings(65735, 227.25, 1, 32);
makeNoteTimings(75075, 250, 2, 32);

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
      judgment: null,
      score: null,
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
      judgment: null,
      score: null,
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
      judgment: null,
      score: null,
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
      judgment: null,
      score: null,
    };
    allNotes.push(kNote);
    kNotes.push(kNote);
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

    if (start === undefined) {
      start = timestamp;
    }
    const elapsed = timestamp - start;

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
    }, allNotes[i].timingInMs - (collisionHeight - 40) / noteFallSpeed);
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

  function nextStep(timestamp) {
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

    if (start === undefined) {
      start = timestamp;
    }
    const elapsed = timestamp - start;

    note.position = Math.min(elapsed * noteFallSpeed, maxHeight);
    note.element.style.transform = `translateY(${note.position}px)`;

    noteStopID = window.requestAnimationFrame(nextStep);
  }

  // Starting the note animation
  window.requestAnimationFrame(nextStep);
}

// play keys and add effects
window.addEventListener("keydown", (e) => {
  const keyDownTiming = elapsedTime;

  // set up keys
  const setupKeys = () => {
    if (e.key === "d" || e.key === "f" || e.key === "j" || e.key === "k") {
      // set up key audio
      const audio = document.querySelector(`audio[key="${e.key}"]`);
      if (keyDownTiming > 64700) {
        if (e.key === "d") {
          audio.src = "./audio/DSharp5.wav";
        } else if (e.key === "f") {
          audio.src = "./audio/F5.wav";
        } else if (e.key === "j") {
          audio.src = "./audio/G5.wav";
        } else if (e.key === "k") {
          audio.src = "./audio/GSharp5.wav";
        }
      }
      audio.currentTime = 0;
      audio.play();

      // mute keys in intro
      if (keyDownTiming < 16250) {
        audio.muted = true;
      } else {
        audio.muted = false;
      }

      // set up keydown effect
      const key = document.querySelector(`.key[key="${e.key}"]`);
      key.classList.add("playing");

      // developer feature: show elapsed time in ms
      console.log(elapsedTime);
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
          hit("PERFECT", allNotes[i]);
        } else if (timingDiff <= 2) {
          hit("GOOD", allNotes[i]);
        } else if (timingDiff <= 3) {
          hit("BAD", allNotes[i]);
        }
      }
    }
  };

  judge(keyDownTiming);
});

function hit(judgment, note) {
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
}

function miss(judgment, note) {
  accuracyScreen.innerHTML = judgment;
  note.judgment = judgment;
  note.score = 0;
  comboCount = 0;
  comboScreen.innerHTML = comboCount;
}

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
const comboBonus = comboCount / 50;
if (comboBonus === 1) {
  score += 30;
  scoreScreen.innerHTML = score;
} else if (comboBonus === 2) {
  score += 50;
  scoreScreen.innerHTML = score;
} else if (comboBonus === 3) {
  score += 70;
  scoreScreen.innerHTML = score;
} else if (comboBonus === 4) {
  score += 90;
  scoreScreen.innerHTML = score;
} else if (comboBonus === 5) {
  score += 110;
  scoreScreen.innerHTML = score;
} else if (comboBonus === 6) {
  score += 130;
  scoreScreen.innerHTML = score;
} else if (comboCount === allNotes.length) {
  score += 500;
  scoreScreen.innerHTML = score;
  maxComboReached = true;
}

// generate result screen
const resultScore = document.querySelector("#resultScore");

function generateResult() {
  resultScore.innerHTML = `${score}`;
  makeHitPercentages();
  calculateGrade();
  makePieChart();
}

// calculate hit percantages
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
  perfectNotesScreen.innerHTML = `${perfectNotes} notes, ${perfectPercentages}%`;
  goodNotesScreen.innerHTML = `${goodNotes} notes, ${goodPercentages}%`;
  badNotesScreen.innerHTML = `${badNotes} notes, ${badPercentages}%`;
  missedNotesScreen.innerHTML = `${missedNotes} notes, ${missedPercentages}%`;
}

const pieChart = document.querySelector(".pieChart");

function makePieChart() {
  pieChart.style.background = `
  conic-gradient(
    #f8449f ${perfectPercentages}%,
    #155ba7 ${parseFloat(perfectPercentages) + parseFloat(goodPercentages)}%,
    #41c5f5 ${
      parseFloat(perfectPercentages) +
      parseFloat(goodPercentages) +
      parseFloat(badPercentages)
    }%,
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

  gradeScreen.innerHTML = `${grade}`;
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
  openModal(settingsModal);
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

function resetGame() {
  backgroundAudio.pause();
  backgroundAudio.currentTime = 0;
  allNoteTimeouts.forEach((note) => clearTimeout(note));
  barTimeouts.forEach((note) => clearTimeout(note));
  handleResetTimer();
  accuracyScreen.innerHTML = null;
  timerScreen.innerHTML = `${elapsedTime + "s"}`;
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
}

// start and stop game
function startGame() {
  resetGame();
  backgroundAudio.play();
  startNoteFalls();
  startbarIndicatorFalls();
  handleStartTimer();
}

function stopGame() {
  resetGame();
}

startButton.addEventListener("click", startGame);
stopButton.addEventListener("click", stopGame);

// // noteFallSpeed -> up and down arrow to adjust
