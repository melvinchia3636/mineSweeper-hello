const grid = document.querySelector('.grid');
const width = 10;
const height = 10;
const squares = [];
const bombAmount = 20;
let isGameOver = false;
let flags = 0;

function createBoard() {
    const bombArray = Array(bombAmount).fill('bomb');
    const noBombArray = Array(width * height - bombAmount).fill('noBomb');
    const gameArray = [...bombArray, ...noBombArray];
    const shuffledArray = gameArray.sort(() => {
        return Math.random() - 0.5;
    });

    for (let i = 0; i < width * height; i++) {
        const square = document.createElement('div');
        square.setAttribute('id', i);
        square.classList.add(shuffledArray[i]);
        grid.appendChild(square);
        squares.push(square);

        square.addEventListener('click', (e) => {
            click(square);
        });

        square.oncontextmenu = (e) => {
            e.preventDefault();
            addFlag(square);
        };
    }
}

createBoard();

// check surrounding Bomb numbers
for (let i = 0; i < squares.length; i++) {
    let totalBomb = 0;
    const isLeftEdge = i % 10 === 0;
    const isRightEdge = i % 10 === 9;
    const isTopEdge = i - 10 < 0;
    const isBottomEdge = i + 10 >= 100;

    if (squares[i].classList.contains('noBomb')) {
        if (isLeftEdge === false) {
            // left
            if (squares[i - 1].classList.contains('bomb')) {
                totalBomb++;
            }
        }

        if (isRightEdge === false) {
            // right
            if (squares[i + 1].classList.contains('bomb')) {
                totalBomb++;
            }
        }

        if (isTopEdge === false) {
            // top
            if (squares[i - 10].classList.contains('bomb')) {
                totalBomb++;
            }
        }

        if (isBottomEdge === false) {
            // bottom
            if (squares[i + 10].classList.contains('bomb')) {
                totalBomb++;
            }
        }

        if (isTopEdge === false && isLeftEdge === false) {
            // topLeft
            if (squares[i - 11].classList.contains('bomb')) {
                totalBomb++;
            }
        }

        if (isTopEdge === false && isRightEdge === false) {
            // topRight
            if (squares[i - 9].classList.contains('bomb')) {
                totalBomb++;
            }
        }

        if (isBottomEdge === false && isLeftEdge === false) {
            // bottomLeft
            if (squares[i + 9].classList.contains('bomb')) {
                totalBomb++;
            }
        }

        if (isBottomEdge === false && isRightEdge === false) {
            // bottomRight
            if (squares[i + 11].classList.contains('bomb')) {
                totalBomb++;
            }
        }

        squares[i].setAttribute('data', totalBomb);
    }
}

function click(square) {
    if (isGameOver) return;
    if (square.classList.contains('clicked')) return;

    if (square.classList.contains('bomb')) {
        gameOver();
    } else {
        const bombNum = parseInt(square.getAttribute('data'));
        square.classList.add('clicked');

        if (bombNum !== 0) {
            square.innerHTML = `<p>${bombNum}</p>`;
            return;
        }

        const currentId = parseInt(square.id);
        checkSquare(square, currentId);
    }
}

function checkSquare(square, currentId) {
    const isLeftEdge = currentId % 10 === 0;
    const isRightEdge = currentId % 10 === 9;
    const isTopEdge = currentId - 10 < 0;
    const isBottomEdge = currentId + 10 >= 100;

    setTimeout(() => {
        if (isLeftEdge === false) {
            click(squares[currentId - 1]);
        }

        if (isRightEdge === false) {
            click(squares[currentId + 1]);
        }

        if (isTopEdge === false) {
            click(squares[currentId - 10]);
        }

        if (isBottomEdge === false) {
            click(squares[currentId + 10]);
        }

        if (isTopEdge === false && isLeftEdge === false) {
            click(squares[currentId - 11]);
        }

        if (isTopEdge === false && isRightEdge === false) {
            click(squares[currentId - 9]);
        }

        if (isBottomEdge === false && isLeftEdge === false) {
            click(squares[currentId + 9]);
        }

        if (isBottomEdge === false && isRightEdge === false) {
            click(squares[currentId + 11]);
        }
    }, 100);
}

function gameOver() {
    isGameOver = true;
    squares.forEach((s) => {
        if (s.classList.contains('bomb')) {
            s.innerHTML = '💣';
        }
    });
}

function addFlag(square) {
    if (isGameOver) return;

    if (flags < bombAmount) {
        if (square.classList.contains('flag') === false) {
            square.classList.add('flag');
            square.innerHTML = '🚩';
            flags++;
            checkForWin();
        } else {
            square.classList.remove('flag');
            square.innerHTML = '';
            flags--;
        }
    }
}

function checkForWin() {
    let match = 0;
    squares.forEach((s) => {
        if (s.classList.contains('bomb') && s.classList.contains('flag')) {
            match++;
        }

        if (match === bombAmount) {
            isGameOver = true;
            alert('YOU WIN');
        }
    });
}