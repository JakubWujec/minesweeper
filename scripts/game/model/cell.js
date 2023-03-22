
const MINE_VALUE = -1

class Cell {
  #location;

  constructor(location, value = 0) {
    this.#location = location
    this.value = value; // 0-8 mines around, -1 mine
    this.flagged = false;
    this.covered = true;
  }

  get row() { return this.#location.row };
  get column() { return this.#location.column }
  get location() { return this.#location; }
  set location(newLocation) { this.#location = newLocation }

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
    return this.flagged;
  }
}

export default Cell;
