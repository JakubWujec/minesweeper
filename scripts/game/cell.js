const MINE_VALUE = -1
const CELL_FLAGGED = 'CELL_FLAGGED';
const CELL_COVERED = 'CELL_COVERED';
const CELL_UNCOVERED = 'CELL_UNCOVERED';

class Cell{
  constructor(posX, posY, value=0){
    this.posX = posX;
    this.posY = posY;
    this.value = value; // 0-8 mines around, -1 mine
    this.status = CELL_COVERED;
  }

  hasMine(){
    return this.value === MINE_VALUE;
  }

  setMine(){
    this.value = MINE_VALUE;
  }

  uncover(){
    this.status = CELL_UNCOVERED;
  }

  isCovered(){
    return this.status === CELL_COVERED;
  }

  isFlagged(){
    return this.status === CELL_FLAGGED;
  }
}