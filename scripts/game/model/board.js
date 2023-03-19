import Location from "../controller/location";
class Board {
  #cells;

  constructor(rows, columns, cells) {
    this.rows = rows;
    this.columns = columns;
    this.#cells = cells;
  }

  get cells() {
    return this.#cells;
  }

  getCellAt(location) {
    let [row, column] = [location.row, location.column]
    if (row >= 0 && row < this.rows && column >= 0 && column < this.columns) {
      return this.cells.find(cell => cell.row === row && cell.column === column);
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

  toggleFlagAt(location) {
    this.getCellAt(location).toggleFlag();
  }


  selectCellAt(location) {
    let selectedCell = this.getCellAt(location);
    if (selectedCell && !selectedCell.isFlagged() && selectedCell.isCovered()) {
      selectedCell.uncover();
      if (!selectedCell.hasMine()) {
        this.uncoverUnarmedNeighbours(selectedCell);
      }
    } else {
      console.log(`no selected cell: row ${location.row}, column ${location.column}`)
    }
  }

  uncoverCellAt(location) {
    let cellToUncover = this.getCellAt(location);
    cellToUncover.uncover();
    return cellToUncover;
  }

  uncoverUnarmedNeighbours(cell) {
    let queue = [cell];
    let visited = [cell];
    while (queue.length > 0) {
      let cell = queue.pop();
      let cellLocation = cell.location;
      let coveredUnarmedNeighbours = this.getNeighboursOf(cellLocation).filter(cell => !cell.hasMine()).filter(cell => cell.isCovered());
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



  getNeighboursOf(location) {
    let [row, column] = [location.row, location.column]
    let neighbours = [];
    for (let i of [-1, 0, 1]) {
      for (let j of [-1, 0, 1]) {
        let newRow = row + parseInt(i);
        let newCol = column + parseInt(j);
        if ((0 <= newRow < this.rows) && (0 <= newCol < this.columns) && !(row === newRow && column === newCol)) {
          neighbours.push(this.getCellAt(new Location(newRow, newCol)));
        }
      }
    }

    return neighbours.filter(cell => !!cell);
  }


  logCells(showAll = false) {
    for (let x = 0; x < this.rows; x++) {
      let str = ' ';
      for (let y = 0; y < this.columns; y++) {
        let cell = this.getCellAt(x, y);
        str += ' ' + (showAll ? cell.value : cell.isCovered() ? 'A' : cell.value);
      }
      console.log(str);
    }
  }
}


export default Board;

