class Location {
  #row;
  #column;
  constructor(row, column) {
    this.#row = row;
    this.#column = column;
  }

  get row() {
    return this.#row;
  }

  get column() {
    return this.#column;
  }

  toString() {
    return `{row: ${this.row}, column: ${this.column}}`
  }

  equals(location) {
    return location.row === this.row && location.column === this.column;
  }
}

export default Location;