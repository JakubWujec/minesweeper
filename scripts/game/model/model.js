import Board from "./board";


class Model {
  constructor(row = 8, cols = 8, mines = 10) {
    this.board = new Board(row, cols, mines);
    this.board.prepare();
    this.board.logCells(true);
  }

  isGameFinished() {
    return this.isGameWon() || this.isGameLost();
  }

  isGameWon() {
    let coveredFields = this.board.getCoveredCells();
    return coveredFields.every(cell => cell.hasMine()) && coveredFields.length === this.board.initialNumberOfMines;
  }

  isGameLost() {
    let uncoveredMineFields = this.board.getFilteredCells(
      (cell) => !cell.isCovered() && cell.hasMine()
    )
    return uncoveredMineFields.length > 0;
  }

}

export default Model;
