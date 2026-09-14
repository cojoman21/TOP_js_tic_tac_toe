function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const setToken = (row, column, player) => {
    // check if the Cell() is empty (=== 0)
    const hasValue = board[row][column].getValue();
    if (hasValue) return;

    board[row][column].setValue(player);
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue()),
    );
    console.log(boardWithCellValues);
  };

  const getFlatBoard = () => {
    const flatBoard = board.flatMap((row) =>
      row.map((cell) => cell.getValue()),
    );
    return flatBoard;
  };

  return {
    getBoard,
    setToken,
    printBoard,
    getFlatBoard,
  };
}

function Cell() {
  let value = "";

  const setValue = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    setValue,
    getValue,
  };
}

function GameController(playerOneName, playerTwoName) {
  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      token: "X",
    },
    {
      name: playerTwoName,
      token: "O",
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const getWinner = () => {
    let flatBoard = board.getFlatBoard();
    console.log(flatBoard);

    const isBoardFull = () => {
      for (const cell of flatBoard) {
        if (cell === "") return false;
      }
      return true;
    };

    const winningPatterns = [
      [0, 1, 2],
      [0, 3, 6],
      [0, 4, 8],
      [2, 4, 6],
      [2, 5, 8],
      [6, 7, 8],
      [1, 4, 7],
      [3, 4, 5],
    ];

    for (const pattern of winningPatterns) {
      if (
        flatBoard[pattern[0]] !== "" &&
        flatBoard[pattern[0]] === flatBoard[pattern[1]] &&
        flatBoard[pattern[0]] === flatBoard[pattern[2]]
      ) {
        return flatBoard[pattern[0]];
      }
    }

    if (isBoardFull()) {
      return "Tie";
    } else return "None";
  };

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (row, column) => {
    console.log(
      `Dropping ${getActivePlayer().name}'s token into row: ${row}, column: ${column}.`,
    );
    board.setToken(row, column, getActivePlayer().token);

    const result = getWinner();

    if (result === "None") {
      console.log("No winner yet");
    } else if (result === "X") {
      console.log(`${players[0].name} WON!`);
    } else if (result === "O") {
      console.log(`${players[1].name} WON!`);
    } else if (getWinner() === "Tie") {
      console.log("It's a tie!!!");
    }

    switchPlayerTurn();
    printNewRound();
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
  };
}

function ScreenController() {
  let game;
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement("button");
        cellButton.dataset.rowPosition = rowIndex;
        cellButton.dataset.columnPosition = columnIndex;
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      });
    });
  };

  function clickHandlerBoard(e) {
    const selectedTileRow = e.target.dataset.rowPosition;
    const selectedTileColumn = e.target.dataset.columnPosition;

    if (!selectedTileRow || !selectedTileColumn) return;

    game.playRound(selectedTileRow, selectedTileColumn);
    updateScreen();
  }

  boardDiv.addEventListener("click", clickHandlerBoard);

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#game-start-dialog").showModal();
  });

  function startGame() {
    const playerOneField = document.querySelector("#player-one-name");
    const playerTwoField = document.querySelector("#player-two-name");

    const playerOneInput = playerOneField.value.trim();
    const playerTwoInput = playerTwoField.value.trim();

    const playerOneName = playerOneInput || "Player One";
    const playerTwoName = playerTwoInput || "Player Two";

    game = GameController(playerOneName, playerTwoName);

    playerOneField.value = "";
    playerTwoField.value = "";
    document.querySelector("#game-start-dialog").close();

    updateScreen();
  }

  const startGamebtn = document.querySelector("#start-game-btn");
  startGamebtn.addEventListener("click", startGame);
}

ScreenController();
