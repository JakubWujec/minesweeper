
const MINE_VALUE = -1

class Cell {
  constructor(row, col, value = 0) {
    this.row = row;
    this.col = col;
    this.value = value; // 0-8 mines around, -1 mine
    this.flagged = false;
    this.covered = true;
  }

  hasMine() {
    return this.value === MINE_VALUE;
  }

  setMine() {
    this.value = MINE_VALUE;
  }

  toggleFlag() {
    if (this.isCovered()) {
      this.flagged = !this.flagged;
    }

  }

  uncover() {
    this.covered = false;
  }

  isCovered() {
    return this.covered;
  }

  isFlagged() {
    if (this.isCovered()) {
      return this.flagged;
    }
    return false;
  }
}

export default Cell;
