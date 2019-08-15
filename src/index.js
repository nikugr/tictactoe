import "./styles.css";

var playerTurn = 1;

const main = () => {
  //let arr = generateArray(5, 5);
  let board = document.getElementById("board");

  board.appendChild(createTable(5, 5));
};

const turn = () => {
  if(playerTurn === 1) {
    playerTurn = 2;
  } else {
    playerTurn = 1;
  }
}

const getMark = () => {
  return playerTurn === 1 ? "X" : "O";
}

const checkForWinner = () => {
  let board = document.getElementById("board");
  let cells = board.getElementsByClassName("td");
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
  if(elem.innerHTML === "") {
    elem.innerHTML = getMark();
    turn();
  } 
  // Illegal move
  else {
    console.log("Can't do that");
  }
}

export default main;
