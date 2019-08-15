import "./styles.css";

var playerTurn = 1;
var boardWidth = 5;
var boardHeight = 5;
var expansionThreshold = 3;
var playing = true;

const main = () => {
  init();
  let board = document.getElementById("board");

  board.appendChild(createTable(boardWidth, boardHeight));
};

const init = () => {
  
  playerTurn = 1;
  boardWidth = 5;
  boardHeight = 5;
  expansionThreshold = 3;
  playing = true;
  
  let board = document.getElementById("board");
  while(board.hasChildNodes()) {
    board.firstChild.remove();
  }
}

const turn = () => {
  checkForWinner(getMark());
  if(playing) {
    checkForExpansion();
    if(playerTurn === 1) {
      playerTurn = 2;
    } else {
      playerTurn = 1;
    }
  }
}

const getMark = () => {
  return playerTurn === 1 ? "x" : "o";
}

const checkForExpansion = () => {
  let arr = createArrayFromTable();

  for (let y = 0; y < boardHeight; y++) {
    for (let x = 0; x < boardWidth; x++) {
      if(arr[y][x] !== "") {
        if(x-expansionThreshold < 0) {
          // expandHorizontal(x-expansionThreshold);
        }
        if(x+expansionThreshold >= boardWidth) {
          // expandHorizontal(x+expansionThreshold-boardWidth);
        }
        if(y-expansionThreshold < 0) {
          // expandVertical(y-expansionThreshold);
        }
        if(y+expansionThreshold >= boardHeight) {
          // expandVertical(y+expansionThreshold-boardHeight);
        }
      }
    }
  }
}

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
}

const checkForWinner = (mark) => {
  let arr = createArrayFromTable();

  // Check for the winner
  for (let y = 0; y < boardHeight; y++) {
    for (let x = 0; x < boardWidth; x++) {
      if(mark !== arr[y][x]) {
        continue;
      }

      // Check horizontal
      if(x-2 >= 0 && x+2 < boardWidth) {
        if(mark === arr[y][x-2] &&
          mark === arr[y][x-1] &&
          mark === arr[y][x+1] &&
          mark === arr[y][x+2]) {
            gameover();
          }
      }

      // Check vertical
      if(y-2 >= 0 && y+2 < boardHeight) {
        if(mark === arr[y-2][x] &&
          mark === arr[y-1][x] &&
          mark === arr[y+1][x] &&
          mark === arr[y+2][x]) {
            gameover();
          }
      }

      // Angles
      if(x-2 >= 0 && x+2 < boardWidth && 
        y-2 >= 0 && y+2 < boardHeight) {
          // Check bottom-left to top-right
          if(mark === arr[y-2][x+2] &&
            mark === arr[y-1][x+1] &&
            mark === arr[y+1][x-1] &&
            mark === arr[y+2][x-2]) {
              gameover();
            }

          // Check bottom-right to top-left
          if(mark === arr[y-2][x-2] &&
            mark === arr[y-1][x-1] &&
            mark === arr[y+1][x+1] &&
            mark === arr[y+2][x+2]) {
              gameover();
            }
      }
    }
  }
}

const gameover = () => {
  alert("Player " + playerTurn + " won!");
  playing = false;
}

const createTable = (width, height) => {
  let table = document.createElement("table");

  for (let y = 0; y < height; y++) {
    let row = document.createElement("tr");
    table.appendChild(row);

    for (let x = 0; x < width; x++) {
      let cell = document.createElement("td");
      let text = document.createTextNode("x");
      cell.appendChild(text);
      cell.onclick = () => {handleCellClick(cell)};
      row.appendChild(cell);
    }
  }

  return table;
};

const handleCellClick = (elem) => {
  // Legal move
  if(elem.innerHTML === "" && playing) {
    elem.innerHTML = getMark();
    turn();
  } 
  // Illegal move
  else {
    console.log("Can't do that");
  }
}

export default main;
