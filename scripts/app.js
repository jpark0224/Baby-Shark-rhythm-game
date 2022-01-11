const noteD = document.querySelector(".noteD");

let notePosition = 0;

setInterval(function() {
    notePosition += 10;
    noteD.style.transform = `translate3d(0, ${notePosition}px, 0)`;
}, 10)


// const canvas = document.querySelector('canvas')
// const context = canvas.getContext('2d')
// const keyXPosition = [100, 200, 300, 400];



// const drawBar = () => {
//     context.fillStyle = "#155BA7"
//     context.fillRect(
//             0, 600, 500, 30
//     )
// }

// const drawKeys = (x) => {
//     context.beginPath();
//     context.arc(x, 715, 40, 0, 2 * Math.PI);
//     context.fillStyle = "#F8449F"
//     context.fill()
//     context.closePath();
// }

// const drawNotes = (x, y) => {
//     context.fillStyle = "#FBD830"
//     context.fillRect(
//         x, y, 80, 30
//     )
// }

// let notePosition = 0

// let noteSpeed = 2

// const moveNotes = () => {
//     notePosition += noteSpeed;
// }

// const removeNotes = () => {
//     if (notePosition > 570) {
//         console.log("passed the bar")
//         redrawCanvas();
//     }
// }

// const redrawCanvas = () => {
//     // Clearing the note
//     context.clearRect(0, 0, 500, 800)

//     // drawing the current objects
//     drawNotes(keyXPosition[0] - 40, notePosition)

//     drawBar();
//     keyXPosition.forEach(x => drawKeys(x));
// }

// drawBar();
// keyXPosition.forEach(x => drawKeys(x));
// // keyXPosition.forEach(x => drawNotes(x - 40));

// // class Notes {
// //     contructor(x, y, width, height) {
// //         this.color = "#FBD830";
// //         this.x = x;
// //         this.y = y;
// //         this.width = width;
// //         this.height = height;
// //     }
// // } 

// // const noteOne = new Notes();
// // const noteTwo = new Notes();
// // const noteThree = new Notes();
// // const noteFour = new Notes();

// const initialise = () => {
//     moveNotes();
//     redrawCanvas();
// }

// setInterval(initialise, 10)

