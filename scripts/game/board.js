class Board{
  constructor(rows, cols, initialNumberOfMines){
    this.rows = rows;
    this.cols = cols;
    this.initialNumberOfMines = initialNumberOfMines;
    this.cells = [];
    
    for(let x = 0; x < this.rows; x++){
      for(let y = 0; y < this.cols; y++){
        let newCell = new Cell(x, y, 0);
        this.cells.push(newCell);
      }
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
        let f = this.getCellAt(x,y);
        if (!f.hasMine()){
          let neigh = this.getNeighboursOf(x, y).filter(cell => cell.hasMine());
          f.value = neigh.length;
        }
      }
    }
  }

  getNumberOfArmedMines(){
    return this.cells.filter(cell => cell.hasMine()).filter(minedCell => minedCell.isCovered()).length;
  }

  selectCell(x, y){
    let selectedCell = this.getCellAt(0, 0);
    if(selectedCell.isCovered()){
      selectedCell.uncover();
      if(!selectedCell.hasMine()){
        this.uncoverUnarmedNeighbours(selectedCell);
      }
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
      let coveredUnarmedNeighbours = this.getNeighboursOf(cell.posX, cell.posY).filter(cell => !cell.hasMine()).filter(cell => cell.isCovered());
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

  getCellAt(x, y){
    return this.cells.filter(cell => (cell.posX === x && cell.posY === y))[0];
  }

  getNeighboursOf(x, y){
    let neighbours = [];
    for(let i of [-1, 0, 1]){
      for(let j of [-1, 0, 1]){
        let newX = x + parseInt(i);
        let newY = y + parseInt(j);
        if((0 <= newX < this.rows) && (0 <= newY < this.cols) && !(x === newX && y === newY)){
          neighbours.push(this.getCellAt(newX, newY));
        }
      }
    }
    return neighbours.filter(x => x !== undefined);
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

let b = new Board(8, 8, 10);
b.logCells();
b.prepare();
b.logCells(true);
