// Document Object Model Manipulation

// Board
let columns = document.querySelectorAll('.columns');
let rows;

// Timers
let timerRed = document.querySelector('.time.red');
let timerYellow = document.querySelector('.time.yellow');

// Players
let red =  'rgb(234, 47, 20)';
let yellow = 'rgb(252, 242, 89)';
let turn = red;
let redMoves = [];
let yellowMoves = [];

//Tools and Actions
let undo = document.querySelector('#undo');
let gameOver = document.querySelector('#game-over');
let gameOverText = document.querySelector('#game-over span');

let winningMoves = []
for (let col = 1; col < 5; col++) {
    for (let row = 1; row < 7; row++) {
        winningMoves.push([`col-${col}row-${row}`, `col-${col + 1}row-${row}`, `col-${col + 2}row-${row}`, `col-${col + 3}row-${row}`]);
    }
}
for (let col = 1; col < 8; col++) {
    for (let row = 1; row < 4; row++) {
        winningMoves.push([`col-${col}row-${row}`, `col-${col}row-${row + 1}`, `col-${col}row-${row + 2}`, `col-${col}row-${row + 3}`]);
    }
}

for (let col = 4; col < 8; col++) {
    for (let row = 4; row < 7; row++) {
        winningMoves.push([`col-${col}row-${row}`, `col-${col - 1}row-${row - 1}`, `col-${col - 2}row-${row - 2}`, `col-${col - 3}row-${row - 3}`]);
    }
}

for (let col = 1; col < 5; col++) {
    for (let row = 4; row < 7; row++) {
        winningMoves.push([`col-${col}row-${row}`, `col-${col + 1}row-${row - 1}`, `col-${col + 2}row-${row - 2}`, `col-${col + 3}row-${row - 3}`]);
    }
}

// Hover over Column
function onMouseEnter(column) {
    rows = Array.from(column.children).reverse();
    rows.some(row => {
        if (row.style.backgroundColor === "") {
            row.style.backgroundColor = "darkgray";
            return true;
        }
    })
}

// Leave Column
function onMouseLeave(column) {
    rows = Array.from(column.children).reverse();
    rows.some(row => {
        if (row.style.backgroundColor === "darkgray") {
            row.style.backgroundColor = "";
            return true;
        }
    })
}

// Select Column
function onMouseClick(column) {
    rows = Array.from(column.children).reverse();
    rows.some(row => {
        if (row.style.backgroundColor === "darkgray") {
            row.style.backgroundColor = turn;
            row.style.border = "double 0.5rem";

            // Turn
            if (turn === red){
                turn = yellow;
                redMoves.push(row.id);
            }
            else{
                turn = red;
                yellowMoves.push(row.id);
            }

            onMouseEnter(column);
            return true;
        }
    })
}

// Check if Player has Won
function isGameOver() {
    if (turn === yellow) {
        winningMoves.some(move => {
            if(move.every(pos => redMoves.includes(pos))){
                timerRed.innerText = "Time Left : 0:00:0";
                timerYellow.innerText = "Time Left : 0:00:0";
                gameOver.style.visibility = "visible";
                gameOverText.innerText = "Player 1 Wins";
                gameOver.style.height = "45%";
                gameOver.style.width = "25%";
                return true;
            }
        });
    }
    else if (turn === red) {
        winningMoves.some(move => {
            if(move.every(pos => yellowMoves.includes(pos))){
                timerRed.innerText = "Time Left : 0:00:0";
                timerYellow.innerText = "Time Left : 0:00:0";
                gameOver.style.visibility = "visible";
                gameOverText.innerText = "Player 2 Wins";
                gameOver.style.height = "45%";
                gameOver.style.width = "25%";
                return true;
            }
        });
    }
}

// Game
columns.forEach(column => {
    column.addEventListener('mouseenter', () => {
        onMouseEnter(column);
    });
    column.addEventListener('mouseleave', () => {
        onMouseLeave(column);
    })
    column.addEventListener('click', () => {
        onMouseClick(column);
        isGameOver();
    })
})

// Timer
function timer(time){
    let seconds =Number.parseInt(time.slice(-4), 10);
    let minutes = Number.parseInt(time.slice(0, -4), 10);
    let deciseconds = Number.parseInt(time.slice(-1), 10);

    if(seconds === 0 && deciseconds === 0) {
        minutes--;
        seconds = 59;
        deciseconds = 9;
    }
    else if(deciseconds) {
        deciseconds--;
    }
    else{
        seconds--;
        deciseconds = 9;
    }

    if(minutes === -1) {
        minutes = 0;
        seconds = 0;
        deciseconds = 0;
        if(turn === red){
            gameOver.style.visibility = "visible";
            gameOverText.innerText = "Player 2 Wins";
            gameOver.style.height = "45%";
            gameOver.style.width = "25%";
        }
        else{
            gameOver.style.visibility = "visible";
            gameOverText.innerText = "Player 1 Wins";
            gameOver.style.height = "45%";
            gameOver.style.width = "25%";
        }
    }
    return minutes.toString() + ":" + seconds.toString().padStart(2, '0') + ":" + deciseconds.toString();
}

undo.addEventListener('click', () => {
    if (turn === red){
        let move = document.getElementById(yellowMoves.pop());
        move.style.backgroundColor = "";
        move.style.border = "solid 0.2rem"
        turn = yellow;
    }
    else {
        let move = document.getElementById(redMoves.pop());
        move.style.backgroundColor = "";
        move.style.border = "solid 0.2rem"
        turn = red;
    }
});

setInterval(() => {
    if (turn === red) {
        let curr_time = timerRed.innerText.slice(12);
        curr_time = timer(curr_time);
        timerRed.innerText = "Time Left : " + curr_time;
    }
    else if (turn === yellow) {
        let curr_time = timerYellow.innerText.slice(12);
        curr_time = timer(curr_time);
        timerYellow.innerText = "Time Left : " + curr_time;
    }
}, 100);