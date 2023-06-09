var components = {
  num_of_rows: 12,
  num_of_cols: 24,
  num_of_bombs: 55,
  bomb: "☕",
  alive: true,
  colors: {
    1: "blue",
    2: "green",
    3: "red",
    4: "purple",
    5: "maroon",
    6: "turquoise",
    7: "black",
    8: "grey",
  },
};

function startGame() {
  components.bombs = placeBombs();
  document.getElementById("terület").appendChild(createTable());
}

function placeBombs() {
  var i,
    rows = [];

  for (i = 0; i < components.num_of_bombs; i++) {
    placeSingleBomb(rows);
  }
  return rows;
}

function placeSingleBomb(bombs) {
  var nrow, ncol, row, col;
  nrow = Math.floor(Math.random() * components.num_of_rows);
  ncol = Math.floor(Math.random() * components.num_of_cols);
  row = bombs[nrow];

  if (!row) {
    row = [];
    bombs[nrow] = row;
  }

  col = row[ncol];

  if (!col) {
    row[ncol] = true;
    return;
  } else {
    placeSingleBomb(bombs);
  }
}

function cellID(i, j) {
  return "cell-" + i + "-" + j;
}

function createTable() {
  var table, row, td, i, j;
  table = document.createElement("table");

  for (i = 0; i < components.num_of_rows; i++) {
    row = document.createElement("tr");
    for (j = 0; j < components.num_of_cols; j++) {
      td = document.createElement("td");
      td.id = cellID(i, j);
      row.appendChild(td);
      addCellListeners(td, i, j);
    }
    table.appendChild(row);
  }
  return table;
}

function addCellListeners(td, i, j) {
  td.addEventListener("mousedown", function (event) {
    if (!components.alive) {
      return;
    }
    components.mousewhiches += event.which;
    if (event.which === 3) {
      return;
    }
    if (this.flagged) {
      return;
    }
    this.style.backgroundColor = "#9A7B4F";
  });

  td.addEventListener("mouseup", function (event) {
    if (!components.alive) {
      return;
    }

    if (this.clicked && components.mousewhiches == 4) {
      performMassClick(this, i, j);
    }

    components.mousewhiches = 0;

    if (event.which === 3) {
      if (this.clicked) {
        return;
      }
      if (this.flagged) {
        this.flagged = false;
        this.textContent = "";
      } else {
        this.flagged = true;
        this.textContent = components.flag;
      }

      event.preventDefault();
      event.stopPropagation();

      return false;
    } else {
      handleCellClick(this, i, j);
    }
  });

  td.oncontextmenu = function () {
    return false;
  };
}

function handleCellClick(cell, i, j) {
  if (!components.alive) {
    return;
  }

  if (cell.flagged) {
    return;
  }

  cell.clicked = true;

  if (components.bombs[i][j]) {
    cell.style.color = "red";
    cell.textContent = components.bomb;
    gameOver();
  } else {
    cell.style.backgroundColor = "#9A7B4F";
    num_of_bombs = adjacentBombs(i, j);
    if (num_of_bombs) {
      cell.style.color = components.colors[num_of_bombs];
      cell.textContent = num_of_bombs;
    } else {
      clickAdjacentBombs(i, j);
    }
  }
}

function adjacentBombs(row, col) {
  var i, j, num_of_bombs;
  num_of_bombs = 0;

  for (i = -1; i < 2; i++) {
    for (j = -1; j < 2; j++) {
      if (components.bombs[row + i] && components.bombs[row + i][col + j]) {
        num_of_bombs++;
      }
    }
  }
  return num_of_bombs;
}

function adjacentFlags(row, col) {
  var i, j, num_flags;
  num_flags = 0;

  for (i = -1; i < 2; i++) {
    for (j = -1; j < 2; j++) {
      cell = document.getElementById(cellID(row + i, col + j));
      if (!!cell && cell.flagged) {
        num_flags++;
      }
    }
  }
  return num_flags;
}

function clickAdjacentBombs(row, col) {
  var i, j, cell;

  for (i = -1; i < 2; i++) {
    for (j = -1; j < 2; j++) {
      if (i === 0 && j === 0) {
        continue;
      }
      cell = document.getElementById(cellID(row + i, col + j));
      if (!!cell && !cell.clicked && !cell.flagged) {
        handleCellClick(cell, row + i, col + j);
      }
    }
  }
}

function performMassClick(cell, row, col) {
  if (adjacentFlags(row, col) === adjacentBombs(row, col)) {
    clickAdjacentBombs(row, col);
  }
}

function gameOver() {
  components.alive = false;
  document.getElementById("lost").style.display = "block";
}

function reload() {
  window.location.reload();
}

window.addEventListener("load", function () {
  document.getElementById("lost").style.display = "none";
  startGame();
});

const mainMenu = document.querySelector(".main-menu");
const clickableArea = document.querySelector(".clickable-area");
const message = document.querySelector(".clickable-area .message");
const endScreen = document.querySelector(".end-screen");
const reactionTimeText = document.querySelector(
  ".end-screen .reaction-time-text"
);
const playAgainBtn = document.querySelector(".end-screen .play-again-btn");
// reakció
let timer;
let greenDisplayed;
let timeNow;
let waitingForStart;
let waitingForGreen;
let scores;

const init = () => {
  greenDisplayed = false;
  waitingForStart = false;
  waitingForGreen = false;
  scores = [];
};

init();

const setBrownColor = () => {
  clickableArea.style.backgroundColor = "#946544";
  message.innerHTML = "Kattints most!";
  message.style.color = "#111";
  brownDisplayed = true;
  timeNow = Date.now();
};

const StartGame = () => {
  clickableArea.style.backgroundColor = "#c1121f";
  message.innerHTML = "Várj a barna színre.";
  message.style.color = "#fff";

  let randomNumber = Math.floor(Math.random() * 4000 + 3000);
  timer = setTimeout(setBrownColor, randomNumber);

  waitingForStart = false;
  waitingForBrown = true;
};

mainMenu.addEventListener("click", () => {
  mainMenu.classList.remove("active");
  StartGame();
});

const endGame = () => {
  endScreen.classList.add("active");
  clearTimeout(timer);

  let total = 0;

  scores.forEach((s) => {
    total += s;
  });

  let averageScore = Math.round(total / scores.length);

  reactionTimeText.innerHTML = `${averageScore} ms`;
};

const displayReactionTime = (rt) => {
  clickableArea.style.backgroundColor = "#faf0ca";
  message.innerHTML = `<div class='reaction-time-text'>${rt} ms</div>Kattints a folytatáshoz.`;
  brownDisplayed = false;
  waitingForStart = true;
  scores.push(rt);

  if (scores.length >= 3) {
    endGame();
  }
};

const displayTooSoon = () => {
  clickableArea.style.backgroundColor = "#faf0ca";
  message.innerHTML = "Túl korai. Kattints a folytatáshoz.";
  message.style.color = "#111";
  waitingForStart = true;
  clearTimeout(timer);
};

clickableArea.addEventListener("click", () => {
  if (brownDisplayed) {
    let clickTime = Date.now();
    let reactionTime = clickTime - timeNow;
    displayReactionTime(reactionTime);
    return;
  }

  if (waitingForStart) {
    StartGame();
    return;
  }

  if (waitingForBrown) {
    displayTooSoon();
  }
});

playAgainBtn.addEventListener("click", () => {
  endScreen.classList.remove("active");
  init();
  StartGame();
});

