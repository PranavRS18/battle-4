// Start
const start = document.querySelector('#start');
start.addEventListener('click', () => {

    // Start Button
    start.disabled = true;
    start.style.visibility = 'hidden';

    // Document Object Model Manipulation

    const navbar = document.querySelector('#navbar');
    const main = document.querySelector('main');
    const board = document.querySelector('#board');
    const footer = document.querySelector('footer');

    // Timers
    const timerRed = document.querySelector('.time.red');
    const timerYellow = document.querySelector('.time.yellow');

    // Powers
    const powersRed = document.querySelector('.powerups.red span');
    const powersYellow = document.querySelector('.powerups.yellow span');

    // Tools and Actions
    let theme = "light";
    const changeTheme = document.querySelector('#theme');
    const undo = document.querySelector('#undo');
    const restart = document.querySelector('#restart');
    const gameOver = document.querySelector('#game-over');
    const gameOverText = document.querySelector('#game-over span');
    const replay = document.querySelector('#replay');
    let isReplaying = false;

    // Theme
    let themeRowsColor = "";

    // User Info
    const rowButtons = document.querySelectorAll('.rows');
    const redUserInfo = document.querySelectorAll('.red');
    const yellowUserInfo = document.querySelectorAll('.yellow');

    // Board
    const columns = document.querySelectorAll('.columns');
    let rows;
    let everyMoves = []
    for (let col = 1; col < 8; col++) {
        for (let row = 1; row < 7; row++) {
            everyMoves.push(`col-${col}row-${row}`);
        }
    }
    let isFinished = false;

    // Players
    let red = 'rgb(234, 47, 20)';
    let yellow = 'rgb(252, 242, 89)';
    let turn = 1;
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
        "Lose 10 Seconds" : 6
    }

    // Powers
    let reversePowersMapping = {
         3 : "Block Remove",
         4 : "Random Disc" ,
         5 : "Add 15 Seconds",
         6 : "Lose 10 Seconds"
    }

    // Swap Turns
    function turnSwap() {
        if (turn === 2) {
            turn = 1;
        } else {
            turn = 2
        }
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
        let powers = ["Block Remove", "Random Disc", 'Add 15 Seconds', 'Lose 10 Seconds']
        let power = powers[Math.floor(Math.random() * powers.length)];

        if (turn === 2) {
            powersRed.innerText = "";
            document.querySelector(".red img").style.opacity = '0';
            powersYellow.innerText = `Player 2 gets`;
            document.querySelector(".yellow img").src = `${power}.jpg`
            document.querySelector(".yellow img").style.opacity = '1';
        } else {
            powersYellow.innerText = "";
            document.querySelector(".yellow img").style.opacity = '0';
            powersRed.innerText = `Player 1 gets`;
            document.querySelector(".red img").src = `${power}.jpg`
            document.querySelector(".red img").style.opacity = '1';
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
        }
        return power;

    }

    // Find the Blocked Column
    function findBlockedColumn() {
        let blockedColumns = history.filter(log => log[1] === 'b');
        if (blockedColumns.length !== 0) {
            if (history[history.length - 1][0] !== '3') {
                let query = blockedColumns[blockedColumns.length - 1].slice(2, 7);
                return document.querySelector(`#${query}`);
            }
        }
        return null;
    }

    // Block
    function placeBlock(column) {
        rows = Array.from(column.children).reverse();
        rows.forEach(row => {
            if (row.style.backgroundColor !== red && row.style.backgroundColor !== yellow) {
                row.style.backgroundColor = "black";
            }
        })
        history.push(`${turn}b${column.id}row-0`);
        let curr_time;
        if (turn === 1) {
            curr_time = timerYellow.innerText.slice(12);
        } else {
            curr_time = timerRed.innerText.slice(12);
        }
        turnSwap();
        history.push(`${powersMapping[givePowers()]}${curr_time}`);
        isPlay = true;

    }

    function removeBlock() {
        let column = findBlockedColumn();
        try {
            rows = Array.from(column.children).reverse();
            rows.forEach(row => {
                if (row.style.backgroundColor !== red && row.style.backgroundColor !== yellow) {
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

        if (winner) {
            gameOverText.innerText = `Player ${winner} Wins`;
        } else {
            gameOverText.innerText = `Draw`;
        }

        replay.style.visibility = "visible";
        replay.style.width = "30%";
        replay.style.fontSize = "1.25rem";

    }

    // Check if Player has Won
    function checkGameOver() {
        let moves = history.filter(log => log.slice(0, 2) === turn.toString() + 'p').map(log => log.slice(2, 12));
        let randomMoves = history.filter(log => log.slice(0, 2) === turn.toString() + 's').map(log => log.slice(2));
        moves = moves.concat(randomMoves);
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
            if (row.style.backgroundColor !== red && row.style.backgroundColor !== yellow) {
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
        document.querySelector(".red img").style.opacity = '0';
        document.querySelector(".yellow img").style.opacity = '0';
        powersYellow.innerText = "";
        powersRed.innerText = "";
        timerRed.innerText = "Time Left : 3:00:0";
        timerYellow.innerText = "Time Left : 3:00:0";
    }

    // Change Theme
    changeTheme.addEventListener('click', () => {

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

            // Turn
            if (turn === 'rgb(234, 47, 20)') {
                turn = 1;
            } else {
                turn = 2;
            }

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

            // Turn
            if (turn === 'rgb(139, 30, 15)') {
                turn = 2;
            } else {
                turn = 1;
            }

            theme = "light";
        }

        rowButtons.forEach(button => {
            if (button.parentElement !== findBlockedColumn() || !isPlay) {
                button.style.transition = 'background-color 0.5s ease-in, border 0.2s ease-in'
                button.style.backgroundColor = themeRowsColor;
            }
        })

        redUserInfo.forEach(element => {
            element.style.backgroundColor = red;
        })

        console.log(history)

        history.filter(log => log.slice(0, 2) === '1p').forEach(move => {
            move = document.querySelector(`#${move.slice(2, 12)}`);
            console.log(move);
            move.style.backgroundColor = red;
        })

        history.filter(log => log.slice(0, 2) === '2p').forEach(move => {
            move = document.querySelector(`#${move.slice(2, 12)}`);
            move.style.backgroundColor = yellow;
        })

        yellowUserInfo.forEach(element => {
            element.style.backgroundColor = yellow;
        })

    })

    // Game
    columns.forEach(column => {
        if (!isFinished) {
            column.addEventListener('mouseenter', () => {
                onMouseEnter(column);
            });
            column.addEventListener('mouseleave', () => {
                onMouseLeave(column);

            })
            column.addEventListener('click', () => {
                if (isPlay && column !== findBlockedColumn()) {
                    onMouseClick(column, false);
                    removeBlock();
                } else if (!isPlay) {
                    placeBlock(column);
                }
            })
        }
    })

    undo.addEventListener('click', () => {
        if (!isFinished) {
            if (history.length > 0) {
                let move = history[history.length - 1];
                if (move.length === 7) {

                    if (turn === 1) {
                        timerRed.innerText = "Time Left : " + move.slice(1);
                    } else {
                        timerYellow.innerText = "Time Left : " + move.slice(1);
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
                    }

                    isPlay = false;
                    turnSwap();
                } else if (move.length === 12) {
                    let disc = document.querySelector(`#${move.slice(2, 12)}`);
                    disc.style.backgroundColor = themeRowsColor;
                    disc.style.border = "black 0.2rem solid";
                    isPlay = true;
                }
                history.pop();
                console.log(history);
            }
        }
    });

    // Timer and Actions
    setInterval(() => {

        // Undoing on First Move
        if (history.length === 0) {
            turn = 1;
            isPlay = true;
            gameOverText.textContent = "Player 1 Turn";
            timerYellow.innerText = "Time Left : 3:00:0";
            history.push(`${powersMapping[givePowers()]}3:00:0`);
        }

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

        // Text Display
        if (!isFinished) {

            if (isPlay && turn === 1) {
                gameOverText.textContent = "Player 1 Turn";
            } else if (turn === 1) {
                gameOverText.textContent = "Player 1 to Block";
            } else if (turn === 2 && isPlay) {
                gameOverText.textContent = "Player 2 Turn";
            } else {
                gameOverText.textContent = "Player 2 to Block";
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

    history.push(`${powersMapping[givePowers()]}3:00:0`)

    replay.addEventListener('click', () => {

        if(isReplaying) {
            isReplaying = false;
        }
        else {
            isReplaying = true;
            clearBoard();

            let logIndex = 0;
            let log;
            let power;
            let currentTime;
            let column;
            let blockedColumn = null;
            turn = 1;

            const replayLoop = setInterval(() => {
                if (logIndex < history.length) {
                    log = history[logIndex];
                    console.log(log);
                    if (log.length === 7) {
                        power = reversePowersMapping[Number.parseInt(log[0])];

                        if (turn === 2) {
                            powersRed.innerText = "";
                            document.querySelector(".red img").style.opacity = '0';
                            powersYellow.innerText = `Player 2 gets`;
                            document.querySelector(".yellow img").src = `${power}.jpg`
                            document.querySelector(".yellow img").style.opacity = '1';
                        } else {
                            powersYellow.innerText = "";
                            document.querySelector(".yellow img").style.opacity = '0';
                            powersRed.innerText = `Player 1 gets`;
                            document.querySelector(".red img").src = `${power}.jpg`
                            document.querySelector(".red img").style.opacity = '1';
                        }

                        if (turn === 2) {
                            timerRed.innerText = "Time Left : " + log.slice(1);
                        } else {
                            timerYellow.innerText = "Time Left : " + log.slice(1);
                        }

                        if (log[0] === "3" && logIndex > 1) {
                            let currentHistory = history.slice(0, logIndex).filter(log => log[1] === 'b');
                            let query = currentHistory[currentHistory.length - 1].slice(2, 7);
                            column = document.querySelector(`#${query}`)
                            rows = Array.from(column.children).reverse();
                            rows.forEach(row => {
                                if (row.style.backgroundColor === "black") {
                                    row.style.backgroundColor = themeRowsColor;
                                }
                            })
                            blockedColumn = null;
                        }
                        else if (log[0] === "4") {
                            let currentHistory = history.slice(0, logIndex);
                            let query = currentHistory[currentHistory.length - 1].slice(2);
                            let disc = document.querySelector(`#${query}`);
                            disc.style.transition = "background-color 0.2s ease-in, border 0.2s ease-in";
                            disc.style.backgroundColor = players[turn];
                            disc.style.border = "double 0.5rem";
                        }
                        else if (log[0] === "5") {
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

                        }
                        else if (log[0] === "6") {
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

                        }

                    } else if (log[1] === 'p') {
                        let query = log.slice(2, 7);
                        column = document.querySelector(`#${query}`);
                        rows = Array.from(column.children).reverse();
                        rows.some(row => {
                            if (row.style.backgroundColor !== red && row.style.backgroundColor !== yellow) {
                                row.style.transition = 'background-color 0.2s ease-in, border 0.2s ease-in';
                                row.style.backgroundColor = players[turn];
                                row.style.border = "double 0.5rem";
                                return true;
                            }
                        });

                        try {
                            rows = Array.from(blockedColumn.children).reverse();
                            rows.forEach(row => {
                                if (row.style.backgroundColor !== red && row.style.backgroundColor !== yellow) {
                                    row.style.backgroundColor = themeRowsColor;
                                }
                            })
                        } catch (error) {
                            console.error("No Column Found");
                        }
                    } else if (log[1] === 'b') {
                        let query = log.slice(2, 7);
                        column = document.querySelector(`#${query}`);
                        rows = Array.from(column.children).reverse();
                        rows.forEach(row => {
                            if (row.style.backgroundColor !== red && row.style.backgroundColor !== yellow) {
                                row.style.backgroundColor = "black";
                            }
                        })
                        blockedColumn = column;
                        turnSwap();
                    }
                    logIndex++;
                } else {
                    isReplaying = false;
                    clearInterval(replayLoop);
                }
            }, 1000);
        }

    })
    restart.addEventListener("click", () => {
        location.reload();
    })
})