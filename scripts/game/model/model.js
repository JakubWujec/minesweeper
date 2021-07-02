const MINE_VALUE = -1

class Model{
  constructor(row=8, cols=8, mines=10){
    this.board = new Board(row, cols, mines);
    this.board.prepare();
    this.board.logCells(true);
  }

  isGameFinished(){
    return this.isGameWon() || this.isGameLost();
  }

  isGameWon(){
    let coveredFields = this.board.getCoveredCells();
    return coveredFields.every(cell => cell.hasMine()) && coveredFields.length === this.board.initialNumberOfMines;
  }

  isGameLost(){
    let uncoveredMineFields = this.board.getFilteredCells(
      (cell) => !cell.isCovered() && cell.hasMine()
    )
    return uncoveredMineFields.length > 0;
  }
    
}

class Cell{
  constructor(row, col, value=0){
    this.row = row;
    this.col = col;
    this.value = value; // 0-8 mines around, -1 mine
    this.flagged = false;
    this.covered = true;
  }

  hasMine(){
    return this.value === MINE_VALUE;
  }

  setMine(){
    this.value = MINE_VALUE;
  }

  toggleFlag(){
    if(this.isCovered()){
      this.flagged = !this.flagged;
    }
    
  }

  uncover(){
    this.covered = false;
  }

  isCovered(){
    return this.covered;  
  }

  isFlagged(){
    return this.flagged;
  }
}

class Board{
  constructor(rows, cols, initialNumberOfMines){
    this.rows = rows;
    this.cols = cols;
    this.initialNumberOfMines = initialNumberOfMines;
    this.cells = [];
    
    for(let x = 0; x < this.rows; x++){
      let newRow = [];
      for(let y = 0; y < this.cols; y++){
        let newCell = new Cell(x, y, 0);
        newRow.push(newCell);
      }
      this.cells.push(newRow);
    }
  }

  prepare(){
    this.plantMines();
    this.plantNumbers();
  }

  plantMines(){
    while(this.getNumberOfArmedMines() < this.initialNumberOfMines){
      let row = Math.floor(Math.random() * this.rows); 
      let col = Math.floor(Math.random() * this.cols);
      this.getCellAt(row, col).setMine(); 
    }
  }

  plantNumbers(){
    for(let x = 0; x < this.rows; x++){
      for(let y = 0; y < this.cols; y++){
        let f = this.getCellAt(x, y);
        if (!f.hasMine()){
          let neigh = this.getNeighboursOf(x, y).filter(cell => cell.hasMine());
          f.value = neigh.length;
        }
      }
    }
  }

  getNumberOfArmedMines(){
    let mines = 0;
    for(let row of this.cells){
      for(let cell of row){
        if(cell.hasMine()){
          mines +=1;
        }
      }
    }
    return mines;
  }

  getFilteredCells(filterFunction){
    let selected = [];
    for(let row of this.cells){
      for(let cell of row){
        if(filterFunction(cell)){
          selected.push(cell);
        }
      }
    }
    return selected
  }

  getCoveredCells(){
    return this.getFilteredCells(cell => cell.isCovered());
  }

  getMinedCells(){
    return this.getFilteredCells(cell => cell.hasMine());
  }

  getFlaggedCells(){
    return this.getFilteredCells(cell => cell.isFlagged())
  }


  selectCell(row, col){
    let selectedCell = this.getCellAt(row, col);
    if(selectedCell){
      if(selectedCell.isCovered()){
        selectedCell.uncover();
        if(!selectedCell.hasMine()){
          this.uncoverUnarmedNeighbours(selectedCell);
        }
      }
    }
    else{
      console.log(`no selected cell: row ${row}, col ${col}`)
    }
    
  }

  uncoverCellAt(x, y){
    let cellToUncover = this.getCellAt(x, y);
    cellToUncover.uncover(); 
    return cellToUncover;
  }

  uncoverUnarmedNeighbours(cell){
    let queue = [cell];
    let visited = [cell];
    while(queue.length > 0){
      let cell = queue.pop();
      let coveredUnarmedNeighbours = this.getNeighboursOf(cell.row, cell.col).filter(cell => !cell.hasMine()).filter(cell => cell.isCovered());
      for(let neighbour of coveredUnarmedNeighbours){
        if(!visited.includes(neighbour)){
          neighbour.uncover();
          if(neighbour.value === 0){
            queue.push(neighbour);
          }
          visited.push(neighbour);
        }
      }
    }
  }

  getCellAt(row, col){
    if(row >= 0 && row < this.rows && col >= 0 && col < this.cols){
      return this.cells[row][col];
    }
    return null
  }

  getNeighboursOf(row, col){
    let neighbours = [];
    for(let i of [-1, 0, 1]){
      for(let j of [-1, 0, 1]){
        let newRow = row + parseInt(i);
        let newCol = col + parseInt(j);
        if((0 <= newRow < this.rows) && (0 <= newCol < this.cols) && !(row === newRow && col === newCol)){
          neighbours.push(this.getCellAt(newRow, newCol));
        }
      }
    }

    return neighbours.filter(cell => !!cell);
  }

  
  logCells(showAll = false){
    for(let x = 0; x < this.rows; x++){
      let str = ' ';
      for(let y = 0; y < this.cols; y++){
        let cell = this.getCellAt(x, y);
        str += ' ' + (showAll ? cell.value : cell.isCovered() ? 'A' : cell.value);
      }
      console.log(str);
    }
  } 
}


