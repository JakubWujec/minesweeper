class Location {
  #x;
  #y;
  constructor(x, y) {
    this.#x = x;
    this.#y = y;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  fromArray(locationArray) {
    this.#x = locationArray[0];
    this.#y = locationArray[1];
  }

  asArray() {
    return [this.x, this.y]
  }

  toString() {
    return `{x: ${this.x}, y: ${this.y}}`
  }
}

export default Location;