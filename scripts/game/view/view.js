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
    this.addEventListener(this.closeModalButton, 'click', () => {
      this.closeSettingsModal();
    })

    this.addEventListener(this.backdrop, 'click', () => {
      this.closeSettingsModal();
    })
  }

  addEventListener(element, type, listener) {
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

  displayBoard(board) {
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
          this.drawCell(x, y, board.getCellAt(new Location(row, column)));
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
          this.drawExplodedMine(x, y);
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
      let flagImage = new Image();
      flagImage.src = './assets/images/flag1.png';
      this.ctx.drawImage(flagImage, x + 0.1 * this.BLOCK_SIZE, y + 0.1 * this.BLOCK_SIZE, 0.8 * this.BLOCK_SIZE, 0.8 * this.BLOCK_SIZE);
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
      let mineImage = new Image();
      mineImage.src = '../../../assets/images/mine2.png';
      this.ctx.drawImage(mineImage, x + 0.1 * this.BLOCK_SIZE, y + 0.1 * this.BLOCK_SIZE, 0.8 * this.BLOCK_SIZE, 0.8 * this.BLOCK_SIZE);
    } catch (error) {
      console.log(error);
    }
  }

  drawExplodedMine(x, y) {
    let drawX = x + 0.1 * this.BLOCK_SIZE
    let drawY = y + 0.1 * this.BLOCK_SIZE
    try {
      let mineImage = new Image();
      mineImage.src = '../../../assets/images/mine2.png';
      this.ctx.fillStyle = "red";
      this.ctx.fillRect(x, y, this.BLOCK_SIZE, this.BLOCK_SIZE);
      this.ctx.drawImage(mineImage, drawX, drawY, 0.8 * this.BLOCK_SIZE, 0.8 * this.BLOCK_SIZE);
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
    this.addEventListener(this.flagButton, 'click', handler);
  }

  bindStartGame(handler) {
    this.addEventListener(this.startGameButton, 'click', handler);
  }

  bindSaveSettings(handler) {
    this.addEventListener(this.saveSettingsButton, 'click', event => {
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
    this.addEventListener(this.canvas, 'click', _handler);
  }

  bindToggleFlagAt(handler) {
    let _handler = (event) => {
      event.preventDefault();
      handler(this.getLocationOfClick(event));
    }
    this.addEventListener(this.canvas, 'contextmenu', _handler);
  }

  bindSettingsButtonClicked(handler) {
    this.addEventListener(this.settingsButton, 'click', handler);
  }

  bindDifficultyLevelElementClicked(handler) {
    for (let difficultyElement of this.difficultiesElements) {
      this.addEventListener(difficultyElement, 'click', () => {
        handler(difficultyElement.textContent);
      })
    }
  }

}

export default View;
