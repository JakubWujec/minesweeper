import Board from "./board";
import Cell from "./cell";
import Location from "../controller/location";

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
    let board = new Board(this.rows, this.columns, cells);
    this.prepareMines(board);
    this.prepareNumbers(board);
    return board;
  }

  prepareCells() {
    let cells = [];
    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++) {
        cells.push(new Cell(new Location(row, column), 0))
      }
    }
    return cells;
  }

  getRandomLocation() {
    let row = Math.floor(Math.random() * this.rows);
    let column = Math.floor(Math.random() * this.columns);
    return new Location(row, column);
  }

  prepareMines(board) {
    while (board.getNumberOfArmedCells() < this.mines) {
      board.getCellAt(this.getRandomLocation()).setMine();
    }
  }

  prepareNumbers(board) {
    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++) {
        let location = new Location(row, column);
        let cell = board.getCellAt(location);
        if (!cell.hasMine()) {
          let neigh = board.getNeighboursOf(location).filter(cell => cell.hasMine());
          cell.value = neigh.length;
        }
      }
    }
  }

}

export default BoardFactory;