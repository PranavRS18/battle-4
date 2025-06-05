// Document Object Model Manipulation

let navbar = document.querySelector('#navbar');
let main = document.querySelector('main');
let board = document.querySelector('#board');
let events = document.querySelector('#events');
let footer = document.querySelector('footer');

// Board
let columns = document.querySelectorAll('.columns');
let rows;
let moves = []
for (let col = 1; col < 8; col++) {
    for (let row = 1; row < 7; row++) {
        moves.push(`col-${col}row-${row}`);
    }
}

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
let theme = "light";
let changeTheme = document.querySelector('#theme');
let undo = document.querySelector('#undo');
let leaderboard = document.querySelector('#leaderboard');
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

// Change Theme
changeTheme.addEventListener('click', () => {

    let rowButtons = document.querySelectorAll('.rows');
    let redUserInfo = document.querySelectorAll('.red');
    let yellowUserInfo = document.querySelectorAll('.yellow');

    if (theme === 'light') {
        navbar.style.backgroundColor = 'teal';
        footer.style.backgroundColor = 'teal';
        board.style.backgroundColor = 'darkblue';
        events.style.backgroundColor = 'rgb(70, 130, 150)';
        main.style.backgroundColor = 'rgb(175, 110, 40)';

        undo.style.backgroundColor = 'gray';
        leaderboard.style.backgroundColor = 'gray';

        rowButtons.forEach(button => {
            button.style.transition = 'background-color 0.5s ease-in, border 0.2s ease-in'
            button.style.backgroundColor = 'gray';
        })

        red = 'rgb(139, 30, 15)';
        yellow = 'rgb(180, 160, 50)';

        redUserInfo.forEach(element => {
            element.style.backgroundColor = red;
        })

        redMoves.forEach(move => {
            move = document.querySelector(`#${move}`);
            move.style.backgroundColor = red;
        })

        yellowMoves.forEach(move => {
            move = document.querySelector(`#${move}`);
            move.style.backgroundColor = yellow;
        })

        yellowUserInfo.forEach(element => {
            element.style.backgroundColor = yellow;
        })


        // Turn
        if(turn === 'rgb(234, 47, 20)') {
            turn = red;
        }
        else {
            turn = yellow;
        }

        theme = "dark";
    }

    else {
        navbar.style.backgroundColor = 'rgb(75, 163, 163)';
        footer.style.backgroundColor = 'rgb(75, 163, 163)';
        board.style.backgroundColor = 'cornflowerblue';
        events.style.backgroundColor = 'skyblue';
        main.style.backgroundColor = 'rgb(251, 158, 58)';

        undo.style.backgroundColor = 'white';
        leaderboard.style.backgroundColor = 'white';

        rowButtons.forEach(button => {
            button.style.transition = 'background-color 0.5s ease-in, border 0.2s ease-in'
            button.style.backgroundColor = '';
        })

        red = 'rgb(234, 47, 20)';
        yellow = 'rgb(252, 242, 89)';

        redUserInfo.forEach(element => {
            element.style.backgroundColor = red;
        })

        redMoves.forEach(move => {
            move = document.querySelector(`#${move}`);
            move.style.backgroundColor = red;
        })

        yellowMoves.forEach(move => {
            move = document.querySelector(`#${move}`);
            move.style.backgroundColor = yellow;
        })

        yellowUserInfo.forEach(element => {
            element.style.backgroundColor = yellow;
        })


        // Turn
        if(turn === 'rgb(139, 30, 15)') {
            turn = red;
        }
        else {
            turn = yellow;
        }

        theme = "light";
    }
})

// Hover over Column
function onMouseEnter(column) {
    rows = Array.from(column.children).reverse();
    rows.some(row => {
        row.style.transition = 'background-color 0.2s ease-in, border 0.2s ease-in';
        if (row.style.backgroundColor === "") {
            row.style.backgroundColor = "darkgray";
            return true;
        }

        else if (row.style.backgroundColor === "gray") {
            row.style.backgroundColor = "white";
            return true;
        }
    })
}

// Leave Column
function onMouseLeave(column) {
    rows = Array.from(column.children).reverse();
    rows.some(row => {
        row.style.transition = 'background-color 0.2s ease-in, border 0.2s ease-in';
        if (row.style.backgroundColor === "darkgray") {
            row.style.backgroundColor = "";
            return true;
        }

        else if (row.style.backgroundColor === "white") {
            row.style.backgroundColor = "gray";
            return true;
        }
    })
}

// Select Column
function onMouseClick(column) {
    rows = Array.from(column.children).reverse();
    rows.some(row => {
        if (row.style.backgroundColor === "darkgray" || row.style.backgroundColor === "white") {
            row.style.transition = 'background-color 0.2s ease-in, border 0.2s ease-in';
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

function isGameOver(winner) {
    timerRed.innerText = "Time Left : 0:00:0";
    timerYellow.innerText = "Time Left : 0:00:0";
    gameOver.style.visibility = "visible";
    gameOverText.style.fontSize = "3rem";
    gameOver.style.height = "45%";
    gameOver.style.width = "25%";
    undo.disabled = true;

    if (winner) {
        gameOverText.innerText = `Player ${winner} Wins`;
    }
    else {
        gameOverText.innerText = `Draw`;
    }
}

// Check if Player has Won
function checkGameOver() {
    if (turn === yellow) {
        winningMoves.some(move => {
            if(move.every(pos => redMoves.includes(pos))){
                isGameOver(1);
                return true;
            }
        });
    }
    else if (turn === red) {
        winningMoves.some(move => {
            if(move.every(pos => yellowMoves.includes(pos))){
                isGameOver(2);
                return true;
            }
        });
    }

    if(moves.every(move => redMoves.concat(yellowMoves).includes(move))){
        isGameOver(0);
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
        checkGameOver();
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

    if(minutes === -1 && gameOverText.innerText !== "Draw") {
        minutes = 0;
        seconds = 0;
        deciseconds = 0;
        if(turn === red){
            isGameOver(2);
        }
        else{
            isGameOver(1)
        }
    }
    return minutes.toString() + ":" + seconds.toString().padStart(2, '0') + ":" + deciseconds.toString();
}

undo.addEventListener('click', () => {
    if (turn === red){
        let move = document.getElementById(yellowMoves.pop());
        if (theme === "light") {
            move.style.backgroundColor = "";
        }
        else {
            move.style.backgroundColor = "gray";
        }
        move.style.border = "solid 0.2rem";
        turn = yellow;
    }
    else {
        let move = document.getElementById(redMoves.pop());
        if (theme === "light") {
            move.style.backgroundColor = "";
        }
        else {
            move.style.backgroundColor = "gray";
        }
        move.style.border = "solid 0.2rem";
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

    document.querySelectorAll(".actions").forEach(action => {
        if (action.matches(":hover")) {
            if(theme === "light") {
                action.style.backgroundColor = "lightcoral";
            }
            else {
                action.style.backgroundColor = "coral";
            }
        }
        else {
            if(theme === "light") {
                action.style.backgroundColor = "white";
            }
            else {
                action.style.backgroundColor = "gray";
            }
        }
    })

}, 100);
