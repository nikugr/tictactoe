import "./styles.css";

var playerTurn = 1;
var boardWidth = 5;
var boardHeight = 5;
var playing = true;

const main = () => {
  //let arr = generateArray(5, 5);
  let board = document.getElementById("board");

  board.appendChild(createTable(boardWidth, boardHeight));
};

const turn = () => {
  checkForWinner(getMark());
  if(playerTurn === 1) {
    playerTurn = 2;
  } else {
    playerTurn = 1;
  }
}

const getMark = () => {
  return playerTurn === 1 ? "X" : "O";
}

const checkForWinner = (mark) => {
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

/*
const generateArray = (width, height) => {
  let arr = [];
  for (let y = 0; y < height; y++) {
    arr[y] = [];
    for (let x = 0; x < width; x++) {
      arr[y][x] = 0;
    }
  }
  return arr;
};
*/

const createTable = (width, height) => {
  let table = document.createElement("table");

  for (let y = 0; y < height; y++) {
    let row = document.createElement("tr");
    table.appendChild(row);

    for (let x = 0; x < width; x++) {
      let cell = document.createElement("td");
      let text = document.createTextNode("");
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
