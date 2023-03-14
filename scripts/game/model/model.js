import Board from "./board";
import BoardFactory from "./boardFactory";


class Model {
  constructor(settings) {
    this.initialNumberOfMines = settings.mines;
    let boardFactory = new BoardFactory(settings);
    this.board = boardFactory.prepare();
  }

  isGameFinished() {
    return this.isGameWon() || this.isGameLost();
  }

  isGameWon() {
    let coveredFields = this.board.getCoveredCells();
    return coveredFields.every(cell => cell.hasMine()) && coveredFields.length === this.initialNumberOfMines;
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
