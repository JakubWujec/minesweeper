import Location from "../controller/location";

class View {
  constructor(settings) {
    this.ROWS = settings.rows;
    this.COLUMNS = settings.columns;
    this.BLOCK_SIZE = 20;
    this.SPACE_BETWEEN = 4;

    this.canvas = document.querySelector('#canvas');
    this.ctx = this.canvas.getContext('2d');
    this.trackedListeners = [];

    this.setCanvasSize(
      this.calculateRequiredCanvasLength(this.COLUMNS), // width
      this.calculateRequiredCanvasLength(this.ROWS), // height
    );

    this.saveSettingsButton = document.querySelector('.modal__save');
    this.startGameButton = document.querySelector('.start-button');
    this.flagButton = document.getElementById('flag-button');
    this.minesCounterElement = document.getElementById('mines-counter');
    this.settingsButton = document.querySelector('.settings-button');
    this.modal = document.querySelector('.modal');
    this.closeModalButton = document.querySelector('.modal__exit');
    this.backdrop = document.querySelector('.backdrop');
    this.rowsModalInput = document.querySelector('#input-rows')
    this.columnsModalInput = document.querySelector('#input-columns')
    this.minesModalInput = document.querySelector('#input-mines');
    this.difficultiesElements = document.querySelectorAll('.modal__difficulty');

    this.bindModalToggle();

  }

  bindModalToggle() {
    this.addTrackedEventListener(this.closeModalButton, 'click', () => {
      this.closeSettingsModal();
    })

    this.addTrackedEventListener(this.backdrop, 'click', () => {
      this.closeSettingsModal();
    })
  }

  addTrackedEventListener(element, type, listener) {
    element.addEventListener(type, listener);
    this.trackEventListener(element, type, listener);
  }

  untrackAllEventListeners() {
    for (let { element, type, listener } of this.trackedListeners) {
      if (element) {
        element.removeEventListener(type, listener, { capture: true })
        element.removeEventListener(type, listener, { capture: false })
      }
    }
    this.trackedListeners = [];
  }

  trackEventListener(element, type, listener) {
    this.trackedListeners.push({ element, type, listener })
  }

  setCanvasSize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  get canvasLeft() { return this.canvas.offsetLeft + this.canvas.clientLeft - this.canvas.scrollLeft; }
  get canvasTop() { return this.canvas.offsetTop + this.canvas.clientTop - this.canvas.scrollTop; }

  calculateRequiredCanvasLength(cellsInLine) {
    return cellsInLine * (this.BLOCK_SIZE + this.SPACE_BETWEEN) + this.SPACE_BETWEEN;
  }

  setMinesCounter(numerator, denominator) {
    this.minesCounterElement.innerText = `Mines ${numerator} / ${denominator}`;
  }

  setFlagButtonOff() {
    this.flagButton.classList.remove('active');
  }

  setFlagButtonOn() {
    this.flagButton.classList.add('active')
  }

  alertOnGameWon() {
    alert('You win');
  }

  alertOnGameLost() {
    alert('You lost');
  }

  getLocationOfClick(event) {
    function isBetween(start, end, mid) {
      return mid <= end && start <= mid;
    }

    let clickedX = event.pageX - this.canvasLeft;
    let clickedY = event.pageY - this.canvasTop;

    let column = null;
    let row = null;
    for (let i = 0; i < this.COLUMNS; i++) {
      let start = this.SPACE_BETWEEN + i * (this.SPACE_BETWEEN + this.BLOCK_SIZE);
      let end = (i + 1) * (this.SPACE_BETWEEN + this.BLOCK_SIZE);
      if (isBetween(start, end, clickedX)) {
        column = i;
        break;
      }
    }
    for (let i = 0; i < this.ROWS; i++) {
      let start = this.SPACE_BETWEEN + i * (this.SPACE_BETWEEN + this.BLOCK_SIZE);
      let end = (i + 1) * (this.SPACE_BETWEEN + this.BLOCK_SIZE);
      if (isBetween(start, end, clickedY)) {
        row = i;
        break;
      }
    }
    if (row !== null && column !== null) {
      return new Location(row, column);
    }
    return null;
  }

  displayBoard(board, explodedMineLocation) {
    if (this.canvas.getContext) {
      // set fill and stroke styles
      this.ctx.fillStyle = 'gray';
      this.ctx.strokeStyle = 'black';

      // draw a rectangle with fill and stroke
      for (let row = 0; row < board.rows; row++) {
        for (let column = 0; column < board.columns; column++) {
          let x = this.SPACE_BETWEEN + column * (this.BLOCK_SIZE + this.SPACE_BETWEEN);
          let y = this.SPACE_BETWEEN + row * (this.BLOCK_SIZE + this.SPACE_BETWEEN);
          // x,y,width,height
          if (explodedMineLocation && explodedMineLocation.equals(new Location(row, column))) {
            this.drawExplodedMine(x, y);
          } else {
            this.drawCell(x, y, board.getCellAt(new Location(row, column)));
          }
        }
      }
    }
  }

  drawCell(x, y, cell) {
    this.ctx.fillStyle = cell.isCovered() ? 'gray' : 'lightgray';
    this.ctx.strokeStyle = 'black';

    this.ctx.fillRect(
      x,
      y,
      this.BLOCK_SIZE,
      this.BLOCK_SIZE
    );

    this.ctx.strokeRect(
      x,
      y,
      this.BLOCK_SIZE,
      this.BLOCK_SIZE
    );

    if (cell) {
      if (cell.isCovered() && cell.isFlagged()) {
        this.drawFlag(x, y);
      } else if (!cell.isCovered()) {
        if (cell.hasMine() && cell.isFlagged()) {
          this.drawFlaggedMine(x, y);
        }
        else if (cell.hasMine()) {
          this.drawMine(x, y);
        } else {
          if (cell.value > 0) {
            this.drawNumberInside(x, y, cell.value.toString());
          }
        }
      }
    }
  }

  drawFlag(x, y) {
    try {
      // draw flag
      this.ctx.fillStyle = 'red';
      this.ctx.fillRect(x + 0.2 * this.BLOCK_SIZE, y + 0.2 * this.BLOCK_SIZE, 0.4 * this.BLOCK_SIZE, 0.3 * this.BLOCK_SIZE);

      // draw pole
      this.ctx.lineWidth = 2;
      this.ctx.fillStyle = 'black';
      this.ctx.beginPath();
      this.ctx.moveTo(x + 0.55 * this.BLOCK_SIZE, y + 0.2 * this.BLOCK_SIZE);
      this.ctx.lineTo(x + 0.55 * this.BLOCK_SIZE, y + 0.8 * this.BLOCK_SIZE);
      this.ctx.stroke();

      // draw base 
      this.ctx.fillStyle = 'black';
      this.ctx.beginPath();
      this.ctx.moveTo(x + 0.2 * this.BLOCK_SIZE, y + 0.8 * this.BLOCK_SIZE);
      this.ctx.lineTo(x + 0.8 * this.BLOCK_SIZE, y + 0.8 * this.BLOCK_SIZE);
      this.ctx.stroke();

      this.ctx.lineWidth = 1;
    } catch (error) {
      console.log(error);
    }

  }

  drawNumberInside(x, y, numberString) {
    this.ctx.fillText(numberString, x + 0.4 * this.BLOCK_SIZE, y + 0.6 * this.BLOCK_SIZE);
    this.ctx.strokeText(numberString, x + 0.4 * this.BLOCK_SIZE, y + 0.6 * this.BLOCK_SIZE);
  }

  drawMine(x, y) {
    try {
      // draw black circle
      this.ctx.fillStyle = 'black';
      const circle = new Path2D();
      circle.arc(x + this.BLOCK_SIZE / 2, y + this.BLOCK_SIZE / 2, 0.3 * this.BLOCK_SIZE, 0, 2 * Math.PI);
      this.ctx.fill(circle);
      // draw + lines
      this.ctx.beginPath();
      this.ctx.moveTo(x + this.BLOCK_SIZE / 2, y + 0.1 * this.BLOCK_SIZE);
      this.ctx.lineTo(x + this.BLOCK_SIZE / 2, y + 0.9 * this.BLOCK_SIZE);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(x + 0.1 * this.BLOCK_SIZE, y + this.BLOCK_SIZE / 2);
      this.ctx.lineTo(x + 0.9 * this.BLOCK_SIZE, y + this.BLOCK_SIZE / 2);
      this.ctx.stroke();

      // draw white detail
      this.ctx.fillStyle = 'white';
      const circle2 = new Path2D();
      circle2.arc(x + 0.4 * this.BLOCK_SIZE, y + 0.4 * this.BLOCK_SIZE, 0.075 * this.BLOCK_SIZE, 0, 2 * Math.PI);
      this.ctx.fill(circle2);

    } catch (error) {
      console.log(error);
    }
  }

  drawExplodedMine(x, y) {
    try {
      this.ctx.fillStyle = "red";
      this.ctx.fillRect(x, y, this.BLOCK_SIZE, this.BLOCK_SIZE);
      this.drawMine(x, y);
    } catch (error) {
      console.log(error);
    }
  }

  drawFlaggedMine(x, y) {
    try {
      this.drawMine(x, y);

      this.ctx.strokeStyle = 'red';
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x + this.BLOCK_SIZE, y + this.BLOCK_SIZE);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(x + this.BLOCK_SIZE, y);
      this.ctx.lineTo(x, y + this.BLOCK_SIZE);
      this.ctx.stroke();

    } catch (error) {
      console.log(error);
    }
  }


  openSettingsModal() {
    this.modal.classList.add("open");
    this.backdrop.classList.add("open");
  }

  getSettingsModalValues() {
    let rowsValue = this.rowsModalInput.value;
    let columnsValue = this.columnsModalInput.value;
    let minesValue = this.minesModalInput.value;
    return {
      rows: parseInt(rowsValue),
      columns: parseInt(columnsValue),
      mines: parseInt(minesValue),
    }
  }

  setSettingsModalValues(rows, columns, mines) {
    this.rowsModalInput.value = rows;
    this.columnsModalInput.value = columns;
    this.minesModalInput.value = mines;
  }

  closeSettingsModal() {
    if (this.modal) {
      this.modal.classList.remove("open");
      this.backdrop.classList.remove("open");
    }
  }

  bindToggleFlagMode(handler) {
    this.addTrackedEventListener(this.flagButton, 'click', handler);
  }

  bindStartGame(handler) {
    this.addTrackedEventListener(this.startGameButton, 'click', handler);
  }

  bindSaveSettings(handler) {
    this.addTrackedEventListener(this.saveSettingsButton, 'click', event => {
      let startFormValues = this.getSettingsModalValues();
      handler(startFormValues);
      this.closeSettingsModal();
    })
  }

  bindUncoverAt(handler) {
    let _handler = (event) => {
      event.preventDefault();
      handler(this.getLocationOfClick(event));
    }
    this.addTrackedEventListener(this.canvas, 'click', _handler);
  }

  bindToggleFlagAt(handler) {
    let _handler = (event) => {
      event.preventDefault();
      handler(this.getLocationOfClick(event));
    }
    this.addTrackedEventListener(this.canvas, 'contextmenu', _handler);
  }

  bindSettingsButtonClicked(handler) {
    this.addTrackedEventListener(this.settingsButton, 'click', handler);
  }

  bindDifficultyLevelElementClicked(handler) {
    for (let difficultyElement of this.difficultiesElements) {
      this.addTrackedEventListener(difficultyElement, 'click', () => {
        handler(difficultyElement.textContent);
      })
    }
  }

}

export default View;
