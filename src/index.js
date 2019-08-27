import "./styles.css";

var playerTurn = 1;
var boardWidth = 5;
var boardHeight = 5;
var expansionThreshold = 3;
var playing = true;

var progressLoopId;

var EMPTYCHAR = "";
var INFINITEBOARD = false;
var LOOPDELAY = 50; // 0.05s
var TIMER = 10000; // 10s
var USETIMER = true;

const main = () => {
  init();
  let board = document.getElementById("board");

  board.append(createTable(boardWidth, boardHeight));
};

const init = () => {
  playerTurn = 1;
  boardWidth = 5;
  boardHeight = 5;
  expansionThreshold = 3;
  playing = true;

  let board = document.getElementById("board");
  while (board.hasChildNodes()) {
    board.firstChild.remove();
  }
  progressLoopId = startProgressBar(LOOPDELAY);
};

const startProgressBar = (delay) => {
  if(!USETIMER) {
    return;
  }
  let elem = document.getElementById("progressbar-bar");
  let progress = 0;
  let id = setInterval( () => {
    if(progress >= TIMER) {
      turn();
    } else {
      progress += delay;
      elem.style.width = (progress / TIMER * 100) + "%";
    }
  }, delay);
  return id;
}

const turn = () => {
  clearInterval(progressLoopId);
  checkForWinner(getMark());
  if (playing) {
    if (INFINITEBOARD) {
      checkForExpansion();
    }
    progressLoopId = startProgressBar(LOOPDELAY);
    if (playerTurn === 1) {
      playerTurn = 2;
    } else {
      playerTurn = 1;
    }
  }
};

const getMark = () => {
  return playerTurn === 1 ? "x" : "o";
};

const checkForExpansion = () => {
  let arr = createArrayFromTable();

  for (let y = 0; y < boardHeight; y++) {
    for (let x = 0; x < boardWidth; x++) {
      if (arr[y][x] !== EMPTYCHAR) {
        if (x - expansionThreshold < 0) {
          expandHorizontal(x - expansionThreshold);
          arr = createArrayFromTable();
          x = y = 0;
        } else if (x + expansionThreshold > boardWidth - 1) {
          expandHorizontal(x + expansionThreshold - boardWidth + 1);
          arr = createArrayFromTable();
          x = y = 0;
        } else if (y - expansionThreshold < 0) {
          expandVertical(y - expansionThreshold);
          arr = createArrayFromTable();
          x = y = 0;
        } else if (y + expansionThreshold > boardHeight - 1) {
          expandVertical(y + expansionThreshold - boardHeight + 1);
          arr = createArrayFromTable();
          x = y = 0;
        }
      }
    }
  }
};

const expandVertical = amount => {
  let board = document.getElementById("board");
  let table = board.querySelector("table");

  for (let i = 0; i < Math.abs(amount); i++) {
    let row = document.createElement("tr");
    for (let j = 0; j < boardWidth; j++) {
      let cell = document.createElement("td");
      let text = document.createTextNode(EMPTYCHAR);
      cell.append(text);
      cell.onclick = () => {
        handleCellClick(cell);
      };
      row.append(cell);
    }
    if (amount > 0) {
      table.append(row);
    } else {
      table.prepend(row);
    }
  }
  boardHeight += Math.abs(amount);
};

const expandHorizontal = amount => {
  let board = document.getElementById("board");
  let rows = board.querySelectorAll("tr");

  for (let row = 0; row < rows.length; row++) {
    for (let i = 0; i < Math.abs(amount); i++) {
      let cell = document.createElement("td");
      let text = document.createTextNode(EMPTYCHAR);
      cell.append(text);
      cell.onclick = () => {
        handleCellClick(cell);
      };
      if (amount > 0) {
        rows[row].append(cell);
      } else {
        rows[row].prepend(cell);
      }
    }
  }
  boardWidth += Math.abs(amount);
};

const createArrayFromTable = () => {
  let board = document.getElementById("board");
  let cells = board.querySelectorAll("td");

  // Create array from table
  let arr = [];
  for (let y = 0; y < boardHeight; y++) {
    arr[y] = [];
    for (let x = 0; x < boardWidth; x++) {
      arr[y][x] = cells[x + boardWidth * y].innerHTML;
    }
  }
  return arr;
};

const checkForWinner = mark => {
  let arr = createArrayFromTable();

  // Check for the winner
  for (let y = 0; y < boardHeight; y++) {
    for (let x = 0; x < boardWidth; x++) {
      if (mark !== arr[y][x]) {
        continue;
      }

      // Check horizontal
      if (x - 2 >= 0 && x + 2 < boardWidth) {
        if (
          mark === arr[y][x - 2] &&
          mark === arr[y][x - 1] &&
          mark === arr[y][x + 1] &&
          mark === arr[y][x + 2]
        ) {
          gameover();
        }
      }

      // Check vertical
      if (y - 2 >= 0 && y + 2 < boardHeight) {
        if (
          mark === arr[y - 2][x] &&
          mark === arr[y - 1][x] &&
          mark === arr[y + 1][x] &&
          mark === arr[y + 2][x]
        ) {
          gameover();
        }
      }

      // Angles
      if (
        x - 2 >= 0 &&
        x + 2 < boardWidth &&
        y - 2 >= 0 &&
        y + 2 < boardHeight
      ) {
        // Check bottom-left to top-right
        if (
          mark === arr[y - 2][x + 2] &&
          mark === arr[y - 1][x + 1] &&
          mark === arr[y + 1][x - 1] &&
          mark === arr[y + 2][x - 2]
        ) {
          gameover();
        }

        // Check bottom-right to top-left
        if (
          mark === arr[y - 2][x - 2] &&
          mark === arr[y - 1][x - 1] &&
          mark === arr[y + 1][x + 1] &&
          mark === arr[y + 2][x + 2]
        ) {
          gameover();
        }
      }
    }
  }
};

const gameover = () => {
  alert("Player " + playerTurn + " won!");
  playing = false;
};

const createTable = (width, height) => {
  let table = document.createElement("table");

  for (let y = 0; y < height; y++) {
    let row = document.createElement("tr");
    table.append(row);

    for (let x = 0; x < width; x++) {
      let cell = document.createElement("td");
      let text = document.createTextNode(EMPTYCHAR);
      cell.append(text);
      cell.onclick = () => {
        handleCellClick(cell);
      };
      row.append(cell);
    }
  }

  return table;
};

const handleCellClick = elem => {
  // Legal move
  if (elem.innerHTML === EMPTYCHAR && playing) {
    elem.innerHTML = getMark();
    elem.classList.add(getMark());
    turn();
  }
  // Illegal move
  else {
    console.log("Can't do that");
  }
};

export default main;
