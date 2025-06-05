// Document Object Model Manipulation

const navbar = document.querySelector('#navbar');
const main = document.querySelector('main');
const board = document.querySelector('#board');
const events = document.querySelector('#events');
const footer = document.querySelector('footer');

// Board
const columns = document.querySelectorAll('.columns');
let rows;
let moves = []
for (let col = 1; col < 8; col++) {
    for (let row = 1; row < 7; row++) {
        moves.push(`col-${col}row-${row}`);
    }
}

// Timers
const timerRed = document.querySelector('.time.red');
const timerYellow = document.querySelector('.time.yellow');

// Players
let red =  'rgb(234, 47, 20)';
let yellow = 'rgb(252, 242, 89)';
let turn = red;
let redMoves = [];
let yellowMoves = [];

// Tools and Actions
let theme = "light";
const changeTheme = document.querySelector('#theme');
const undo = document.querySelector('#undo');
const leaderboard = document.querySelector('#leaderboard');
const gameOver = document.querySelector('#game-over');
const gameOverText = document.querySelector('#game-over span');

// Blocked
let isBlocked = true;
let columnBlocked;
let columnBlocks = [];

// Powers
let lastPowers = [];
const powersRed = document.querySelector('.powerups.red span');
const powersYellow = document.querySelector('.powerups.yellow span');

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

// Theme
let themeRowsColor = "";

// Change Theme
changeTheme.addEventListener('click', () => {

    if (theme === 'light') {
        navbar.style.backgroundColor = 'rgb(0, 62, 64)';
        footer.style.backgroundColor = 'rgb(0, 62, 64)';
        board.style.backgroundColor = 'rgb(25, 25, 112)';
        events.style.backgroundColor = 'rgb(38, 66, 139)';
        main.style.backgroundColor = 'rgb(0, 139, 139)';

        themeRowsColor = "gray";

        red = 'rgb(178, 20, 20)';
        yellow = 'rgb(189, 183, 107)';

        document.querySelectorAll(".tools").forEach(tool => {
            tool.style.color = 'white';
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
        main.style.backgroundColor = 'rgb(0, 223, 223)';

        themeRowsColor = "";

        red = 'rgb(234, 47, 20)';
        yellow = 'rgb(252, 242, 89)';

        document.querySelectorAll(".tools").forEach(tool => {
            tool.style.color = 'black';
        })

        // Turn
        if(turn === 'rgb(139, 30, 15)') {
            turn = yellow;
        }
        else {
            turn = red;
        }

        theme = "light";
    }

    let rowButtons = document.querySelectorAll('.rows');
    let redUserInfo = document.querySelectorAll('.red');
    let yellowUserInfo = document.querySelectorAll('.yellow');

    rowButtons.forEach(button => {
        rowButtons.forEach(button => {
            if(button.parentElement !== columnBlocked) {
                button.style.transition = 'background-color 0.5s ease-in, border 0.2s ease-in'
                button.style.backgroundColor = themeRowsColor;
            }
        })
    })

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

})

function turnSwap(){
    if (turn === yellow) {
        turn = red;
    }
    else {
        turn = yellow
    }
}

// Hover over Column
function onMouseEnter(column) {
    if (isBlocked) {
        rows = Array.from(column.children).reverse();
        rows.some(row => {
            row.style.transition = 'background-color 0.2s ease-in, border 0.2s ease-in';
            if (row.style.backgroundColor === "") {
                row.style.backgroundColor = "darkgray";
                return true;
            } else if (row.style.backgroundColor === "gray") {
                row.style.backgroundColor = "white";
                return true;
            }
        })
    }
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
function onMouseClick(column, isPower) {
    rows = Array.from(column.children).reverse();
    rows.some(row => {
        if (row.style.backgroundColor !== red && row.style.backgroundColor !== yellow) {
            row.style.transition = 'background-color 0.2s ease-in, border 0.2s ease-in';
            row.style.backgroundColor = turn;
            row.style.border = "double 0.5rem";

            // Turn
            if (turn === red){
                redMoves.push(row.id);
            }
            else{
                yellowMoves.push(row.id);
            }

            isBlocked = false;
            onMouseEnter(column);
            return true;
        }
    })

    if (isPower) {
        checkGameOver(true);
        isBlocked = true;

        if (turn === red) {
            turn = yellow;
        }

        else {
            turn = red;
        }
    }
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
function checkGameOver(isPower = false) {
    if (turn === red) {
        winningMoves.some(move => {
            if(move.every(pos => redMoves.includes(pos))){
                isGameOver(1)
                return true;
            }
        });
    }
    else if (turn === yellow) {
        winningMoves.some(move => {
            if(move.every(pos => yellowMoves.includes(pos))){
                isGameOver(2)
                return true;
            }
        });
    }

    if(moves.every(move => redMoves.concat(yellowMoves).includes(move))){
        isGameOver(0);
    }
}

// Block
function placeBlock(column) {
    rows = Array.from(column.children).reverse();
    rows.forEach(row => {
        if (row.style.backgroundColor !== red && row.style.backgroundColor !== yellow) {
            row.style.backgroundColor = "black";
        }
    })

}

function removeBlock(column) {
    try {
        rows = Array.from(column.children).reverse();
        rows.forEach(row => {
            if (row.style.backgroundColor !== red && row.style.backgroundColor !== yellow) {
                row.style.backgroundColor = themeRowsColor;
            }
        })
    }
    catch (error) {
        console.log("No Column Blocked");
    }
}

function givePowers(){
    let currentTime;
    let minutes;
    let seconds;
    let deciseconds;

    let powers = ["remove_block", "random_coin", 'time_increase', 'time_decrease']
    let power = powers[Math.floor(Math.random() * powers.length)];
    power = "random_coin";

    if (turn === yellow) {
        powersYellow.innerText = `You got ${power}.`;
    }

    else {
        powersRed.innerText = `You got ${power}.`;
    }

    switch(power){
        case "remove_block":
            removeBlock(columnBlocked);
            columnBlocked = null;
            break;

        case "random_coin":
            let randomColumns = Array.from(document.querySelectorAll('.columns'))
            randomColumn = randomColumns[Math.floor(Math.random() * randomColumns.length)]
            while (randomColumn === columnBlocked) {
                randomColumn = randomColumns[Math.floor(Math.random() * randomColumns.length)]
            }
            onMouseClick(randomColumn, true);
            break;

        case "time_increase":
            if (turn === yellow) {
                currentTime = timerYellow.innerText.slice(12);
            }
            else {
                currentTime = timerRed.innerText.slice(12);
            }

            seconds = Number.parseInt(currentTime.slice(-4), 10);
            minutes = Number.parseInt(currentTime.slice(0, -4), 10);
            deciseconds = Number.parseInt(currentTime.slice(-1), 10);

            seconds += 30;

            if (seconds > 59) {
                seconds -= 60;
                minutes++;
            }

            currentTime =  minutes.toString() + ":" + seconds.toString().padStart(2, '0') + ":" + deciseconds.toString();

            if (turn === yellow) {
                timerYellow.innerText = `Time Left : ${currentTime}`;
            }
            else {
                timerRed.innerText = `Time Left : ${currentTime}`;
            }
            break;

        case "time_decrease":
            if (turn === red) {
                currentTime = timerYellow.innerText.slice(12);
            }
            else {
                currentTime = timerRed.innerText.slice(12);
            }

            seconds = Number.parseInt(currentTime.slice(-4), 10);
            minutes = Number.parseInt(currentTime.slice(0, -4), 10);
            deciseconds = Number.parseInt(currentTime.slice(-1), 10);

            seconds -= 20;

            if (seconds < 0) {
                seconds += 60;
                minutes--;
            }

            currentTime =  minutes.toString() + ":" + seconds.toString().padStart(2, '0') + ":" + deciseconds.toString();

            if (turn === yellow) {
                timerYellow.innerText = `Time Left : ${currentTime}`;
            }
            else {
                timerRed.innerText = `Time Left : ${currentTime}`;
            }
    }
    return power;

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
        if (isBlocked && column !== columnBlocked) {
            onMouseClick(column, false);
            checkGameOver();
            removeBlock(columnBlocked);
            columnBlocked = null;
        }
        else if (column !== columnBlocked){
            placeBlock(column);
            columnBlocked = column;
            columnBlocks.push(columnBlocked);
            isBlocked = true;
            turnSwap();
            lastPowers.push(givePowers());
        }
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
    if(redMoves.length > 0 || yellowMoves.length > 0) {
        if (turn === yellow && !isBlocked && lastPowers[lastPowers.length - 1] === "remove_block") {
            lastPowers.pop();
            isBlocked = true;

            let move = document.getElementById(yellowMoves.pop());
            move.style.backgroundColor = themeRowsColor;
            columnBlocks.pop();
            move.style.border = "solid 0.2rem";

        }

        else if (!isBlocked && lastPowers[lastPowers.length - 1] === "remove_block") {
            lastPowers.pop();
            isBlocked = true;
            let move = document.getElementById(redMoves.pop());
            move.style.backgroundColor = themeRowsColor;
            columnBlocks.pop();
            move.style.border = "solid 0.2rem";
        }

        else if (turn === yellow && !isBlocked) {
            isBlocked = true;

            let move = document.getElementById(yellowMoves.pop());
            move.style.backgroundColor = themeRowsColor;

            move.style.border = "solid 0.2rem";
            placeBlock(columnBlocks[columnBlocks.length - 1]);

        }

        else if (!isBlocked) {
            isBlocked = true;
            let move = document.getElementById(redMoves.pop());
            move.style.backgroundColor = themeRowsColor;

            move.style.border = "solid 0.2rem";
            placeBlock(columnBlocks[columnBlocks.length - 1]);

        }


        else if (isBlocked && lastPowers[lastPowers.length - 1] === "random_coin" && turn === red) {
            lastPowers.pop();

            let move = document.getElementById(yellowMoves.pop());
            move.style.backgroundColor = themeRowsColor;
            move.style.border = "solid 0.2rem";

            removeBlock(columnBlocks.pop());
            columnBlocked = null;
            isBlocked = false;

        }

        else if (isBlocked && lastPowers[lastPowers.length - 1] === "random_coin") {
            lastPowers.pop();

            let move = document.getElementById(redMoves.pop());
            move.style.backgroundColor = themeRowsColor;
            move.style.border = "solid 0.2rem";

            removeBlock(columnBlocks.pop());
            columnBlocked = null;
            isBlocked = false;

        }

        else if (isBlocked && turn === red) {
            lastPowers.pop();
            turn = yellow;
            removeBlock(columnBlocks.pop());
            columnBlocked = null;
            isBlocked = false;

        }

        else if (isBlocked) {
            lastPowers.pop();
            turn = red;
            removeBlock(columnBlocks.pop());
            columnBlocked = null;
            isBlocked = false;
        }
    }
});

// Timer and Actions
setInterval((rerollPower = false) => {

    if(!rerollPower) {
        if (turn === red) {
            let curr_time = timerRed.innerText.slice(12);
            curr_time = timer(curr_time);
            timerRed.innerText = "Time Left : " + curr_time;
        } else if (turn === yellow) {
            let curr_time = timerYellow.innerText.slice(12);
            curr_time = timer(curr_time);
            timerYellow.innerText = "Time Left : " + curr_time;
        }
    }

    document.querySelectorAll(".actions").forEach(action => {
        if (action.matches(":hover")) {
            if(theme === "light") {
                action.style.backgroundColor = "rgb(244, 105, 0)";
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
                action.style.backgroundColor = "rgb(159, 159, 159)";
            }
        }
    })

}, 100);