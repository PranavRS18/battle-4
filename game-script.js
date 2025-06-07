// Local Storage
if (!localStorage.getItem('player1Name')) {
    localStorage.setItem('player1Name', "Red");
    localStorage.setItem('player2Name', "Yellow");
    localStorage.setItem('player1Score', '0');
    localStorage.setItem('player2Score', '0');
}

let player1Score = localStorage.getItem('player1Score');
let player2Score = localStorage.getItem('player2Score');
let player1Name = localStorage.getItem('player1Name');
let player2Name = localStorage.getItem('player2Name');

//Name
const player1NameInput = document.getElementById('player1Name');
const player2NameInput = document.getElementById('player2Name');
player1NameInput.value = player1Name;
player2NameInput.value = player2Name;

//Score
const player1ScoreDisplay = document.querySelector(".score.red")
const player2ScoreDisplay = document.querySelector(".score.yellow")
player1ScoreDisplay.textContent = player1Score;
player2ScoreDisplay.textContent = player2Score;

// Start
let isFinished = true;
let startTime = "2:30:0";

const undo = document.querySelector('#undo');
const start = document.querySelector('#start');
const reset = document.querySelector('#reset');
undo.disabled = true;

// Document Object Model Manipulation
const navbar = document.querySelector('#navbar');
const main = document.querySelector('main');
const board = document.querySelector('#board');
const footer = document.querySelector('footer');
const settings = document.querySelector('#settings');
const settingsBlock = document.querySelector('#settingsBlock');

// Audio
const audio = document.querySelector('#isAudio');
const gameAudio = document.querySelector('#isGameAudio');
const backGroundMusic = new Audio('Assets/Music/background.mp3');

// Game Music
const gameMusic = [];
gameMusic.push(new Audio('Assets/Music/drop.mp3'));
gameMusic.push(new Audio('Assets/Music/block.mp3'));
gameMusic.push(new Audio('Assets/Music/powerSound.mp3'));
gameMusic.push(new Audio('Assets/Music/button.mp3'));
gameMusic.push(new Audio('Assets/Music/victory1.mp3'));
gameMusic.push(new Audio('Assets/Music/victory2.mp3'));
gameMusic.push(new Audio('Assets/Music/draw.mp3'));

const backGroundVolume = document.querySelector('#audioVolume');
const gameVolume = document.querySelector('#gameAudioVolume');
audio.checked = true;
gameAudio.checked = true;

// If Settings is Open
let isSettings = true;


// Timers
const timerRed = document.querySelector('.time.red');
const timerYellow = document.querySelector('.time.yellow');

// Powers
const powersRed = document.querySelector('.powerups.red span');
const powersYellow = document.querySelector('.powerups.yellow span');
const redPowerImg = document.querySelector('.red img');
const yellowPowerImg = document.querySelector('.yellow img');

// Tools and Actions
let theme = "light";
const changeTheme = document.querySelector('#theme');
const restart = document.querySelector('#restart');
const gameOver = document.querySelector('#game-over');
const gameOverText = document.querySelector('#game-over span');
const replay = document.querySelector('#replay');

let isReplaying = false;
let query;

// Theme
let themeRowsColor = "";

// User Info
const rowButtons = document.querySelectorAll('.rows');
const redUserInfo = document.querySelectorAll('.red');
const yellowUserInfo = document.querySelectorAll('.yellow');
redUserInfo[1].innerText = player1Name;
yellowUserInfo[2].innerText = player2Name;

// Board
const columns = document.querySelectorAll('.columns');
let rows;
let everyMoves = [];
for (let col = 1; col < 8; col++) {
    for (let row = 1; row < 7; row++) {
        everyMoves.push(`col-${col}row-${row}`);
    }
}

// Players
let red = 'rgb(234, 47, 20)';
let yellow = 'rgb(252, 242, 89)';
let firstTurn = 1;
let turn = firstTurn;
let players = {
    1 : red,
    2: yellow
}
let history = [];

// Blocked
let isPlay = true;

// Powers
let powersMapping = {
    "Block Remove" : 3,
    "Random Disc" : 4,
    "Add 15 Seconds" : 5,
    "Lose 10 Seconds" : 6,
    "Coin Defect" : 7
}

// Powers
let reversePowersMapping = {
    3 : "Block Remove",
    4 : "Random Disc" ,
    5 : "Add 15 Seconds",
    6 : "Lose 10 Seconds",
    7 : "Coin Defect"
}

// Swap Turns
function turnSwap() {
    turn = (turn === 1) ? 2 : 1;
}

// Get all winning combinations
let winningMoves = []
function computeWinningMoves() {
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
}
computeWinningMoves();

// Powers
function givePowers() {
    let currentTime;
    let powers = ["Block Remove", "Block Remove", "Block Remove", "Random Disc", 'Add 15 Seconds', 'Add 15 Seconds',
        'Lose 10 Seconds', 'Lose 10 Seconds', 'Coin Defect']
    let power = powers[Math.floor(Math.random() * powers.length)];

    if (gameAudio.checked) {
        gameMusic[2].play()
    }

    if (turn === 2) {
        powersRed.innerText = "";
        redPowerImg.style.opacity = '0';
        powersYellow.innerText = `${player2Name} gets`;
        yellowPowerImg.src = `Assets/Images/${power}.jpg`
        yellowPowerImg.style.opacity = '1';
    } else {
        powersYellow.innerText = "";
        yellowPowerImg.style.opacity = '0';
        powersRed.innerText = `${player1Name} gets`;
        redPowerImg.src = `Assets/Images/${power}.jpg`
        redPowerImg.style.opacity = '1';
    }

    switch (power) {
        case "Block Remove":
            removeBlock();
            break;

        case "Random Disc":
            let randomColumns = Array.from(document.querySelectorAll('.columns'))
            let randomColumn = randomColumns[Math.floor(Math.random() * randomColumns.length)]
            while (randomColumn === findBlockedColumn()) {
                randomColumn = randomColumns[Math.floor(Math.random() * randomColumns.length)]
            }
            onMouseClick(randomColumn, true);
            turnSwap();
            break;

        case "Add 15 Seconds":
            if (turn === 2) {
                currentTime = timerYellow.innerText.slice(12);
            } else {
                currentTime = timerRed.innerText.slice(12);
            }

            currentTime = timer(currentTime, -150);

            if (turn === 2) {
                timerYellow.innerText = `Time Left : ${currentTime}`;
            } else {
                timerRed.innerText = `Time Left : ${currentTime}`;
            }
            break;

        case "Lose 10 Seconds":
            if (turn === 1) {
                currentTime = timerYellow.innerText.slice(12);
            } else {
                currentTime = timerRed.innerText.slice(12);
            }

            currentTime = timer(currentTime, 100);

            if (turn === 1) {
                timerYellow.innerText = `Time Left : ${currentTime}`;
            } else {
                timerRed.innerText = `Time Left : ${currentTime}`;
            }
            break;

        case "Coin Defect":
            let discs = history.filter(log => log.slice(0, 2) === `${(turn === 2) ? 1 : 2}p`).map(log => log.slice(2, 12))
            let defects = history.filter(log => log.slice(0, 2) === `3s`).map(log => log.slice(2, 12));
            discs = discs.filter(disc => !defects.includes(disc));
            query = discs[Math.floor(Math.random() * discs.length)];
            let disc = document.querySelector(`#${query}`);
            disc.style.backgroundColor = 'darkslategray';
            history.push(`3s${disc.id}`);
    }
    return power;

}

// Find the Blocked Column
function findBlockedColumn() {
    let blockedColumns = history.filter(log => log[1] === 'b');
    if (blockedColumns.length !== 0 &&
        history.filter(log => (log.length === 12 && log[log.length - 1] === '1' && log[1] === 'p')).map(log => log[6]).length !== 6) {
        if (history[history.length - 1][0] !== '3') {
            query = blockedColumns[blockedColumns.length - 1].slice(2, 7);
            return document.querySelector(`#${query}`);
        }
    }
    return null;
}

// Block
function placeBlock(column) {
    rows = Array.from(column.children).reverse();
    rows.forEach(row => {
        if (row.style.backgroundColor === themeRowsColor && row.style.backgroundColor !== 'darkslategray') {
            row.style.backgroundColor = "black";
        }
    })

    if (gameAudio.checked) {
        gameMusic[1].play();
    }
    history.push(`${turn}b${column.id}row-0`);
    let curr_time;
    curr_time = (turn === 1) ? timerYellow.innerText.slice(12) : timerRed.innerText.slice(12);

    turnSwap();
    history.push(`${powersMapping[givePowers()]}${curr_time}`);
    isPlay = true;

}

function removeBlock() {
    let column = findBlockedColumn();
    try {
        rows = Array.from(column.children).reverse();
        rows.forEach(row => {
            if (row.style.backgroundColor === "black") {
                row.style.backgroundColor = themeRowsColor;
            }
        })
    } catch (error) {
        console.log("No Column Blocked");
    }
}

// Timer
function timer(time, lossInDeciseconds = 1) {
    let seconds = Number.parseInt(time.slice(-4), 10);
    let minutes = Number.parseInt(time.slice(0, -4), 10);
    let deciseconds = Number.parseInt(time.slice(-1), 10);

    deciseconds -= Math.floor(lossInDeciseconds % 10);
    seconds -= Math.floor(lossInDeciseconds / 10);

    if (deciseconds < 0) {
        seconds--;
        deciseconds += 10;
    }

    if (seconds < 0) {
        minutes--;
        seconds += 60;
    }

    else if (seconds > 59) {
        minutes++;
        seconds -= 60;
    }

    else if (minutes === -1) {
        minutes++;
        seconds = 0;
        deciseconds = 0;
    }

    return minutes.toString() + ":" + seconds.toString().padStart(2, '0') + ":" + deciseconds.toString();
}

// Hover over Column
function onMouseEnter(column) {
    if (isPlay) {
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
        } else if (row.style.backgroundColor === "white") {
            row.style.backgroundColor = "gray";
            return true;
        }
    })
}

function isGameOver(winner) {
    timerRed.innerText = "Time Left : 0:00:0";
    timerYellow.innerText = "Time Left : 0:00:0";
    gameOver.style.visibility = "visible";
    gameOver.style.height = "100%";
    gameOver.style.width = "30%";
    undo.disabled = true;

    if (winner && turn === 1) {
        gameOverText.innerText = `${player1Name} Wins`;
        player1Score++;
        localStorage.setItem('player1Score', player1Score);
        gameMusic[4].play();
        gameMusic[5].play();
    } else if (winner) {
        gameOverText.innerText = `${player2Name} Wins`;
        player2Score++;
        localStorage.setItem('player2Score', player2Score);
        gameMusic[4].play();
        gameMusic[5].play();
    }
    else {
        gameOverText.innerText = `Draw`;
        gameMusic[6].play();
    }

    player1ScoreDisplay.textContent = player1Score;
    player2ScoreDisplay.textContent = player2Score;

    player1NameInput.value = player1Name;
    player2NameInput.value = player2Name;

    replay.style.opacity = "1";
    replay.style.fontSize = "1.25rem";

}

// Check if Player has Won
function checkGameOver() {
    let moves = history.filter(log => log.slice(0, 2) === turn.toString() + 'p').map(log => log.slice(2, 12));
    let randomMoves = history.filter(log => log.slice(0, 2) === turn.toString() + 's').map(log => log.slice(2));
    let noMoves = history.filter(log => log.slice(0, 2) ===  '3s').map(log => log.slice(2, 12));
    moves = moves.concat(randomMoves).filter(move => !noMoves.includes(move));
    winningMoves.some(move => {
        if (move.every(pos => moves.includes(pos))) {
            isGameOver(turn);
            isFinished = true;
            return true;
        }
    });

    let allMoves = history.filter(log => log[1] === 'p').map(log => log.slice(2, 12));
    if (everyMoves.every(move => allMoves.includes(move))) {
        isGameOver(0);
        isFinished = true;
    }

}

// Select Column
function onMouseClick(column, isPower) {
    rows = Array.from(column.children).reverse();
    rows.some(row => {
        if (row.style.backgroundColor !== red && row.style.backgroundColor !== yellow && row.style.backgroundColor !== "darkslategray") {
            row.style.transition = 'background-color 0.2s ease-in, border 0.2s ease-in';
            row.style.backgroundColor = players[turn];
            row.style.border = "double 0.5rem";

            if (isPower) {
                history.push(`${turn}s${row.id}`);
                checkGameOver();
                turnSwap();
            }

            else {
                isPlay = false;
                history.push(`${turn}p${row.id}`);
                onMouseEnter(column);
            }
            checkGameOver();

            if (gameAudio.checked) {
                gameMusic[0].play()
            }
            return true;
        }
    })
}

// Clear Board
function clearBoard() {
    rowButtons.forEach(button => {
        button.style.transition = 'background-color 0.5s ease-in, border 0.2s ease-in'
        button.style.backgroundColor = themeRowsColor;
        button.style.border = "black 0.2rem solid";
    })
    redPowerImg.style.opacity = '0';
    yellowPowerImg.style.opacity = '0';
    powersYellow.innerText = "";
    powersRed.innerText = "";
    timerRed.innerText = `Time Left : ${startTime}`;
    timerYellow.innerText = `Time Left : ${startTime}`;
}

// Change Theme
function themeChange(logs) {
    if (theme === 'light') {
        navbar.style.backgroundColor = 'rgb(0, 62, 64)';
        footer.style.backgroundColor = 'rgb(0, 62, 64)';
        board.style.backgroundColor = 'rgb(25, 25, 112)';
        gameOver.style.backgroundColor = 'rgb(38, 66, 139)';
        main.style.backgroundColor = 'rgb(0, 108, 108)';

        themeRowsColor = "gray";

        red = 'rgb(178, 20, 20)';
        yellow = 'rgb(189, 183, 107)';

        document.querySelectorAll(".tools").forEach(tool => {
            tool.style.color = 'white';
        })

        theme = "dark";
    } else {
        navbar.style.backgroundColor = 'rgb(75, 163, 163)';
        footer.style.backgroundColor = 'rgb(75, 163, 163)';
        board.style.backgroundColor = 'cornflowerblue';
        gameOver.style.backgroundColor = 'skyblue';
        main.style.backgroundColor = 'rgb(0, 223, 223)';

        themeRowsColor = "";

        red = 'rgb(234, 47, 20)';
        yellow = 'rgb(252, 242, 89)';

        document.querySelectorAll(".tools").forEach(tool => {
            tool.style.color = 'black';
        })
        theme = "light";
    }

    players = {
        1: red,
        2: yellow
    }

    rowButtons.forEach(button => {
        if (button.parentElement !== findBlockedColumn() || !isPlay) {
            if (button.style.backgroundColor !== 'red' && button.style.backgroundColor !== 'yellow' &&
                button.style.backgroundColor !== 'black' && button.style.backgroundColor !== 'darkslategray') {
                button.style.transition = 'background-color 0.5s ease-in, border 0.2s ease-in'
                button.style.backgroundColor = themeRowsColor;
            }
        }
    });

    redUserInfo.forEach(element => {
        element.style.backgroundColor = red;
    });

    logs.filter(log => log[1] !== 'b' && log.length === 12).forEach(move => {
        let disc = document.querySelector(`#${move.slice(2, 12)}`);
        if (move[0] === '1' && disc.style.backgroundColor !== 'darkslategray') {
            disc.style.backgroundColor = red;
        } else if (disc.style.backgroundColor !== 'darkslategray') {
            disc.style.backgroundColor = yellow;
        }
    });

    yellowUserInfo.forEach(element => {
        element.style.backgroundColor = yellow;
    });

    player2NameInput.style.backgroundColor = themeRowsColor;
    player1NameInput.style.backgroundColor = themeRowsColor;
}

// Player Name Changes
function setPlayerNames() {
    player1Name = player1NameInput.value;
    player2Name = player2NameInput.value;
    document.querySelector('.name.red').innerText = player1Name;
    document.querySelector('.name.yellow').innerText = player2Name;
}

// Restart
function Restart() {
    clearBoard();
    history = [];
    isReplaying = false;
    isFinished = true;
    isPlay = true;
    if (firstTurn === 1) {
        firstTurn = 2;
    }
    else {
        firstTurn = 1;
    }
    turn = firstTurn;
    gameOverText.innerText = "";
    start.disabled = false;
    start.style.opacity = '1';
    undo.disabled = true;
    gameOver.style.width = "25%";
    gameOver.style.height = "80%";
    replay.style.opacity = "0";
    redPowerImg.backgroundImage = "Battle 4.png";
    yellowPowerImg.backgroundImage = "Battle 4.png";
    redPowerImg.style.opacity = "0";
    yellowPowerImg.style.opacity = "0";
    player1NameInput.style.opacity = "1";
    player2NameInput.style.opacity = "1";
    player1NameInput.disabled = false;
    player2NameInput.disabled = false;
    setPlayerNames();
}

function buttonSound() {
    if (gameAudio.checked) {
        gameMusic[3].play();
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
        if (!isFinished &&
            !history.filter(log => (log.length === 12 && log[log.length - 1] === '1' && log[1] === 'p')).map(log => log.slice(2, 7)).includes(column.id)
        ) {
            if (isPlay && column !== findBlockedColumn()) {
                history.push((turn === 1) ? `${timerRed.innerText.slice(12)}` : `${timerYellow.innerText.slice(12)}`);
                onMouseClick(column, false);
                removeBlock();
            } else if (!isPlay) {
                placeBlock(column);
            }
        }
    })
})

// Changing if not Replaying
changeTheme.addEventListener('click', () => {
    gameMusic[3].play();
    if (!isReplaying) {
        themeChange(history);
    }
});

undo.addEventListener('click', () => {
    buttonSound()
    if (!isFinished) {
        if (history.length > 0) {
            let move = history[history.length - 1];
            if (move.length === 7) {

                if (turn === 1) {
                    timerRed.innerText = "Time Left : " + move.slice(1);
                } else {
                    timerYellow.innerText = "Time Left : " + move.slice(1);
                }

                let power;
                let powerIndex = (move[0] === '4' || move[0] === '7') ? history.length - 6 : history.length - 5;
                try {
                    power = reversePowersMapping[Number.parseInt(history[powerIndex][0])];
                } catch (error) {
                    console.log("First Move");

                    // Restart with Same First Turn
                    firstTurn = (firstTurn === 2) ? 1 : 2;
                    Restart();
                    return;
                }

                if (turn === 1) {
                    powersRed.innerText = "";
                    redPowerImg.style.opacity = '0';
                    powersYellow.innerText = `${player2Name} gets`;
                    yellowPowerImg.src = `Assets/Images/${power}.jpg`;
                    yellowPowerImg.style.opacity = '1';
                } else {
                    powersYellow.innerText = "";
                    yellowPowerImg.style.opacity = '0';
                    powersRed.innerText = `${player1Name} gets`;
                    redPowerImg.src = `Assets/Images/${power}.jpg`;
                    redPowerImg.style.opacity = '1';
                }

                if (move[0] === '3') {
                    history.pop();
                } else if (move[0] === '4') {
                    history.pop();
                    let disc = document.querySelector(`#${history[history.length - 1].slice(2)}`);
                    disc.style.transition = "background-color 0.2s ease-in, border 0.2s ease-in"
                    disc.style.backgroundColor = themeRowsColor;
                    disc.style.border = "black 0.2rem solid";
                    history.pop()
                    removeBlock();
                } else if (move[0] === '5') {
                    history.pop();
                    removeBlock();
                } else if (move[0] === '6') {
                    history.pop();
                    removeBlock();
                    if (turn === 2) {
                        let new_time = timer(timerRed.innerText.slice(12), -200);
                        timerRed.innerText = "Time Left : " + new_time;
                    } else {
                        let new_time = timer(timerYellow.innerText.slice(12), -200);
                        timerYellow.innerText = "Time Left : " + new_time;
                    }
                } else if (move[0] === '7') {
                    history.pop();
                    let disc = document.querySelector(`#${history[history.length - 1].slice(2)}`);
                    disc.style.transition = "background-color 0.2s ease-in, border 0.2s ease-in"
                    disc.style.backgroundColor = players[(turn === 1) ? 2 : 1];
                    history.pop()
                    removeBlock();
                }

                isPlay = false;
                turnSwap();
            } else if (move.length === 12) {

                let disc = document.querySelector(`#${move.slice(2, 12)}`);
                disc.style.backgroundColor = themeRowsColor;
                disc.style.border = "black 0.2rem solid";

                try {
                    let blockedColumns = history.filter(log => log[1] === 'b');
                    query = blockedColumns[blockedColumns.length - 1].slice(2, 7);
                    let column = document.querySelector(`#${query}`);
                    let allPowers = history.filter(log => log.length === 7)
                    if (allPowers[allPowers.length - 1][0] !== '3') {
                        rows = Array.from(column.children).reverse();
                        rows.forEach(row => {
                            if (row.style.backgroundColor !== red && row.style.backgroundColor !== yellow &&
                                row.style.backgroundColor !== "darkslategray") {
                                row.style.backgroundColor = "black";
                            }
                        })
                    }
                }
                catch (e) {
                    console.error("No Columns to Block");
                }
                history.pop();
                if (turn === 1) {
                    timerRed.innerText = "Time Left : " + history[history.length - 1];
                } else {
                    timerYellow.innerText = "Time Left : " + history[history.length - 1];
                }

                isPlay = true;
            }
            history.pop();
        }
    }
});

// Timer and Actions
setInterval(() => {
    document.querySelectorAll(".actions").forEach(action => {
        if (action.matches(":hover")) {
            if (theme === "light") {
                action.style.backgroundColor = "rgb(244, 105, 0)";
            } else {
                action.style.backgroundColor = "coral";
            }
        } else {
            if (theme === "light") {
                action.style.backgroundColor = "white";
            } else {
                action.style.backgroundColor = "rgb(159, 159, 159)";
            }
        }
    })

    if (settings.matches(":hover")) {
        settingsBlock.style.opacity = '0.9';
        settingsBlock.style.zIndex = '1';
        isSettings = true;
    }
    else if (settingsBlock.matches(":hover") && isSettings) {
        settingsBlock.style.zIndex = '1';
        settingsBlock.style.opacity = '0.9';
    }
    else {
        settingsBlock.style.zIndex = '-1';
        settingsBlock.style.opacity = '0';
        isSettings = false;
    }

    if (!isPlay &&
        history.filter(log => (log.length === 12 && log[log.length - 1] === '1' && log[1] === 'p')).map(log => log[6]).length === 6) {
        isPlay = true;
        turnSwap();
        let columnsFilled =
            history.filter(log => (log.length === 12 && log[log.length - 1] === '1' && log[1] === 'p')).map(log => log.slice(2, 7))
        let query = ['col-1', 'col-2', 'col-3', 'col-4', 'col-5', 'col-6', 'col-7'].filter(column => !columnsFilled.includes(column))[0];
        let column = document.querySelector(`#${query}`);
        rows = Array.from(column.children).reverse();
        console.log(rows)
        rows.forEach(row => {
            if (row.style.backgroundColor === "black") {
                row.style.backgroundColor = themeRowsColor;
            }
        })
    }

    try {
        if (audio.checked) {
            backGroundMusic.play();
            backGroundMusic.volume = backGroundVolume.value / 100;
        } else {
            backGroundMusic.pause();
        }

        gameMusic.forEach(music => {
            music.volume = gameVolume.value / 100;
        })
    } catch (e) {
        console.log("No Audio");
    }

    // Text Display
    if (!isFinished) {

        // Undoing on First Move
        if (history.length === 0) {
            turn = firstTurn;
            isPlay = true;
            timerRed.innerText = `Time Left : ${startTime}`;
            timerYellow.innerText = `Time Left : ${startTime}`;
            history.push(`${powersMapping[givePowers()]}${startTime}`);
            if (turn === 1) {
                gameOverText.textContent = `${player1Name} to Play`;
            } else {
                gameOverText.textContent = `${player2Name} to Play`;
            }
        }

        if (isPlay && turn === 1) {
            gameOverText.textContent = `${player1Name} to Play`;
        } else if (turn === 1) {
            gameOverText.textContent = `${player1Name} to Block`;
        } else if (turn === 2 && isPlay) {
            gameOverText.textContent = `${player2Name} to Play`;
        } else {
            gameOverText.textContent = `${player2Name} to Block`;
        }

        // Timer
        if (turn === 1) {
            let curr_time = timerRed.innerText.slice(12);
            curr_time = timer(curr_time);
            timerRed.innerText = "Time Left : " + curr_time;
            if (curr_time === "0:00:0") {
                isGameOver(2);
                isFinished = true;
            }
            else if (timerYellow.innerText.slice(12) <= "0:00:0") {
                isGameOver(1);
                isFinished = true;
                timerYellow.innerText = "Time Left : 0:00:0";
            }

        } else if (turn === 2) {
            let curr_time = timerYellow.innerText.slice(12);
            curr_time = timer(curr_time);
            timerYellow.innerText = "Time Left : " + curr_time;
            if (curr_time === "0:00:0") {
                isGameOver(1);
                isFinished = true;
            }
            else if (timerRed.innerText.slice(12) <= "0:00:0") {
                isGameOver(2);
                isFinished = true;
                timerRed.innerText = "Time Left : 0:00:0";
            }
        }
    }

}, 100);

replay.addEventListener('click', () => {
    buttonSound()
    if(!isReplaying) {
        isReplaying = true;
        clearBoard();
        let logIndex = 0;
        let log;
        let power;
        let currentTime;
        let column;
        let blockedColumn = null;
        turn = firstTurn;
        console.log(history);
        const replayLoop = setInterval(() => {
            if (logIndex < history.length) {
                log = history[logIndex];
                if (log.length === 7) {
                    power = reversePowersMapping[Number.parseInt(log[0])];

                    if (gameAudio.checked) {
                        gameMusic[2].play();
                    }

                    if (turn === 2) {
                        powersRed.innerText = "";
                        redPowerImg.style.opacity = '0';
                        powersYellow.innerText = `${player2Name} gets`;
                        yellowPowerImg.src = `Assets/Images/${power}.jpg`
                        yellowPowerImg.style.opacity = '1';
                    } else {
                        powersYellow.innerText = "";
                        yellowPowerImg.style.opacity = '0';
                        powersRed.innerText = `${player1Name} gets`;
                        redPowerImg.src = `Assets/Images/${power}.jpg`
                        redPowerImg.style.opacity = '1';
                    }

                    try {
                        let nextLog = history[logIndex + 4];
                        if (nextLog[1] === 's') {
                            nextLog = history[logIndex + 5];
                        }
                        if (turn === 2) {
                            timerRed.innerText = "Time Left : " + nextLog.slice(1);
                        } else {
                            timerYellow.innerText = "Time Left : " + nextLog.slice(1);
                        }
                    } catch (e) {
                        console.error("About to End");
                    }

                    if (log[0] === "3" && logIndex > 1) {
                        let currentHistory = history.slice(0, logIndex).filter(log => log[1] === 'b');
                        query = currentHistory[currentHistory.length - 1].slice(2, 7);
                        column = document.querySelector(`#${query}`)
                        rows = Array.from(column.children).reverse();
                        rows.forEach(row => {
                            if (row.style.backgroundColor === "black") {
                                row.style.backgroundColor = themeRowsColor;
                            }
                        })
                        blockedColumn = null;
                    } else if (log[0] === "4") {
                        let currentHistory = history.slice(0, logIndex);
                        query = currentHistory[currentHistory.length - 1].slice(2);
                        let disc = document.querySelector(`#${query}`);
                        disc.style.transition = "background-color 0.2s ease-in, border 0.2s ease-in";
                        disc.style.backgroundColor = players[turn];
                        disc.style.border = "double 0.5rem";
                    } else if (log[0] === "5") {
                        if (turn === 2) {
                            currentTime = timerYellow.innerText.slice(12);
                        } else {
                            currentTime = timerRed.innerText.slice(12);
                        }

                        currentTime = timer(currentTime, -150);

                        if (turn === 2) {
                            timerYellow.innerText = `Time Left : ${currentTime}`;
                        } else {
                            timerRed.innerText = `Time Left : ${currentTime}`;
                        }

                    } else if (log[0] === "6") {
                        if (turn === 1) {
                            currentTime = timerYellow.innerText.slice(12);
                        } else {
                            currentTime = timerRed.innerText.slice(12);
                        }

                        currentTime = timer(currentTime, 100);

                        if (turn === 1) {
                            timerYellow.innerText = `Time Left : ${currentTime}`;
                        } else {
                            timerRed.innerText = `Time Left : ${currentTime}`;
                        }

                    } else if (log[0] === "7") {
                        let currentHistory = history.slice(0, logIndex);
                        query = currentHistory[currentHistory.length - 1].slice(2);
                        let disc = document.querySelector(`#${query}`);
                        disc.style.transition = "background-color 0.2s ease-in, border 0.2s ease-in";
                        disc.style.backgroundColor ="darkslategray";
                        disc.style.border = "double 0.5rem";
                    }

                } else if (log.length === 6) {

                    if (turn === 1) {
                        timerRed.innerText = "Time Left : " + log;
                    } else {
                        timerYellow.innerText = "Time Left : " + log;
                    }
                    logIndex++;
                    log = history[logIndex];
                    query = log.slice(2, 7);
                    column = document.querySelector(`#${query}`);
                    rows = Array.from(column.children).reverse();
                    rows.some(row => {
                        if (row.style.backgroundColor !== red && row.style.backgroundColor !== yellow
                            && row.style.backgroundColor !== "darkslategray") {
                            row.style.transition = 'background-color 0.2s ease-in, border 0.2s ease-in';
                            row.style.backgroundColor = players[turn];
                            row.style.border = "double 0.5rem";

                            if (gameAudio.checked) {
                                gameMusic[0].play();
                            }
                            return true;
                        }
                    });

                    try {
                        rows = Array.from(blockedColumn.children).reverse();
                        rows.forEach(row => {
                            if (row.style.backgroundColor !== red && row.style.backgroundColor !== yellow
                                && row.style.backgroundColor !== "darkslategray") {
                                row.style.backgroundColor = themeRowsColor;
                            }
                        })
                    } catch (error) {
                        console.error("No Column Found");
                    }
                } else if (log[1] === 'b') {
                    query = log.slice(2, 7);
                    column = document.querySelector(`#${query}`);
                    rows = Array.from(column.children).reverse();
                    rows.forEach(row => {
                        if (row.style.backgroundColor !== red && row.style.backgroundColor !== yellow
                            && row.style.backgroundColor !== "darkslategray") {
                            row.style.backgroundColor = "black";
                        }
                    })

                    if (gameAudio.checked) {
                        gameMusic[1].play();
                    }
                    blockedColumn = column;
                    turnSwap();
                }

                changeTheme.addEventListener('click', () => {
                    if (isReplaying) {
                        themeChange(history.slice(0, logIndex));
                    }
                });

                logIndex++;
            } else {
                if (timerYellow.innerText.slice(12) <= "0:00:0") {
                    isGameOver(1);
                    isFinished = true;
                    timerYellow.innerText = "Time Left : 0:00:0";
                }
                if (timerRed.innerText.slice(12) <= "0:00:0") {
                    isGameOver(1);
                    isFinished = true;
                    timerYellow.innerText = "Time Left : 0:00:0";
                }
                isReplaying = false;
                clearInterval(replayLoop);
            }

        }, 1000);
    }
})

start.addEventListener('click', () => {
    buttonSound()
    isFinished = false;
    // Start Button
    start.disabled = true;
    start.style.opacity = '0';
    undo.disabled = false;
    player1NameInput.style.opacity = "0";
    player2NameInput.style.opacity = "0";
    player1NameInput.disabled = true;
    player2NameInput.disabled = true;
    redUserInfo[1].innerText = player1Name;
    yellowUserInfo[2].innerText = player2Name;
    setPlayerNames();
})

restart.addEventListener("click", () => {
    buttonSound()
    Restart();
})

reset.addEventListener("click", () => {
    buttonSound()
    player1Score = 0;
    player2Score = 0;
    player1ScoreDisplay.innerText = player1Score;
    player2ScoreDisplay.innerText = player2Score;
    localStorage.setItem("player1Score", player1Score);
    localStorage.setItem("player2Score", player2Score);
})