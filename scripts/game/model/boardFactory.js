import Board from "./board";
import Cell from "./cell";

class BoardFactory {
  constructor(settings) {
    this.settings = settings;
  }

  get rows() {
    return this.settings.rows;
  }

  get columns() {
    return this.settings.columns;
  }

  get mines() {
    return this.settings.mines;
  }

  prepare() {
    let cells = this.prepareCells();
    console.log(cells);
    let board = new Board(this.rows, this.columns, cells);
    this.prepareMines(board);
    this.prepareNumbers(board);
    return board;
  }

  prepareCells() {
    let cells = [];
    console.log(this.rows, this.columns, this.mines)
    for (let x = 0; x < this.rows; x++) {
      let newRow = [];
      for (let y = 0; y < this.columns; y++) {
        let newCell = new Cell(x, y, 0);
        newRow.push(newCell);
      }
      cells.push(newRow);
    }
    return cells;
  }

  prepareMines(board) {
    while (board.getNumberOfArmedCells() < this.mines) {
      let row = Math.floor(Math.random() * this.rows);
      let col = Math.floor(Math.random() * this.columns);
      board.getCellAt(row, col).setMine();
    }
  }

  prepareNumbers(board) {
    for (let x = 0; x < this.rows; x++) {
      for (let y = 0; y < this.columns; y++) {
        let f = board.getCellAt(x, y);
        if (!f.hasMine()) {
          let neigh = board.getNeighboursOf(x, y).filter(cell => cell.hasMine());
          f.value = neigh.length;
        }
      }
    }
  }

}

export default BoardFactory;