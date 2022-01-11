const noteD = document.querySelector(".noteD");
const barD = document.querySelector(".barD");
const startButton = document.querySelector(".start");
const stopButton = document.querySelector(".stop");
const backgroundAudio = new Audio("./audio/baby_shark.wav");

let notePosition = 0;

function startGame() {
    backgroundAudio.play();
    let animate = setInterval(() => {
        notePosition += 10;
        noteD.style.transform = `translate3d(0, ${notePosition}px, 0)`;
        if (notePosition > 560) {
        clearInterval(animate);
        }
    }, 10);
}

function stopGame() {
    backgroundAudio.pause();
    backgroundAudio.currentTime = 0;
}

startButton.addEventListener('click', startGame);
stopButton.addEventListener('click', stopGame);

// play notes and add effects
window.addEventListener("keydown", function(e) {
    const audio = document.querySelector(`audio[key="${e.key}"]`);
    const key = document.querySelector(`.key[key="${e.key}"]`);
    audio.currentTime = 0;
    audio.play();
    key.classList.add("playing");
})

window.addEventListener("keyup", function(e) {
    const key = document.querySelector(`.key[key="${e.key}"]`);
    key.classList.remove("playing");
})

// make an array of notes in play
// make a collision detection and remove it from the array when they come to the bottom
// document.createlement 
