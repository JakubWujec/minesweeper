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
    let uncoveredMineFields = this.board.cells.filter(
      (cell) => !cell.isCovered() && cell.hasMine()
    )
    return uncoveredMineFields.length > 0;
  }

  toggleFlagAt(row, column) {
    this.board.toggleFlagAt(row, column);
  }

  selectCellAt(row, column) {
    this.board.selectCellAt(row, column);
  }

  uncoverAllCells() {
    for (let cell of this.board.cells) {
      if (cell.isCovered()) {
        cell.uncover();
      }
    }
  }

}

export default Model;
