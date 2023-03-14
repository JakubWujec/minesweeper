import Cell from "./cell";

class Board {
  #cells;

  constructor(rows, cols, cells) {
    this.rows = rows;
    this.cols = cols;
    this.#cells = cells;
  }

  get cells() {
    return this.#cells;
  }

  getCellAt(row, col) {
    if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
      return this.cells.find(cell => cell.row === row && cell.col === col);
    }
    return null
  }

  getNumberOfArmedCells() {
    return this.cells.filter(cell => cell.hasMine()).length
  }

  getCoveredCells() {
    return this.cells.filter(cell => cell.isCovered());
  }

  getMinedCells() {
    return this.cells.filter(cell => cell.hasMine());
  }

  getFlaggedCells() {
    return this.cells.filter(cell => cell.isFlagged())
  }

  getCoveredFlaggedCells() {
    return this.cells.filter(cell => cell.isFlagged() && cell.isCovered());
  }

  toggleFlagAt(row, column) {
    this.getCellAt(row, column).toggleFlag();
  }


  selectCellAt(row, col) {
    let selectedCell = this.getCellAt(row, col);
    if (selectedCell && !selectedCell.isFlagged() && selectedCell.isCovered()) {
      selectedCell.uncover();
      if (!selectedCell.hasMine()) {
        this.uncoverUnarmedNeighbours(selectedCell);
      }
    } else {
      console.log(`no selected cell: row ${row}, col ${col}`)
    }
  }

  uncoverCellAt(x, y) {
    let cellToUncover = this.getCellAt(x, y);
    cellToUncover.uncover();
    return cellToUncover;
  }

  uncoverUnarmedNeighbours(cell) {
    let queue = [cell];
    let visited = [cell];
    while (queue.length > 0) {
      let cell = queue.pop();
      let coveredUnarmedNeighbours = this.getNeighboursOf(cell.row, cell.col).filter(cell => !cell.hasMine()).filter(cell => cell.isCovered());
      for (let neighbour of coveredUnarmedNeighbours) {
        if (!visited.includes(neighbour)) {
          neighbour.uncover();
          if (neighbour.value === 0) {
            queue.push(neighbour);
          }
          visited.push(neighbour);
        }
      }
    }
  }



  getNeighboursOf(row, col) {
    let neighbours = [];
    for (let i of [-1, 0, 1]) {
      for (let j of [-1, 0, 1]) {
        let newRow = row + parseInt(i);
        let newCol = col + parseInt(j);
        if ((0 <= newRow < this.rows) && (0 <= newCol < this.cols) && !(row === newRow && col === newCol)) {
          neighbours.push(this.getCellAt(newRow, newCol));
        }
      }
    }

    return neighbours.filter(cell => !!cell);
  }


  logCells(showAll = false) {
    for (let x = 0; x < this.rows; x++) {
      let str = ' ';
      for (let y = 0; y < this.cols; y++) {
        let cell = this.getCellAt(x, y);
        str += ' ' + (showAll ? cell.value : cell.isCovered() ? 'A' : cell.value);
      }
      console.log(str);
    }
  }
}


export default Board;

