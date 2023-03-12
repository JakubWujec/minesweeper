class View {
  constructor(rows = 8, columns = 8) {
    this.ROWS = rows;
    this.COLUMNS = columns;
    this.BLOCK_SIZE = 20;
    this.SPACE_BETWEEN = 4;

    this.canvas = document.querySelector('#canvas');
    this.ctx = this.canvas.getContext('2d');

    this.setCanvasSize(
      this.calculateRequiredCanvasLength(columns), // width
      this.calculateRequiredCanvasLength(rows), // height
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

    this.closeModalButton.addEventListener('click', () => {
      this.closeSettingsModal();
    })
    this.backdrop.addEventListener('click', () => {
      this.closeSettingsModal();
    })
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

  toggleFlagButton() {
    this.flagButton.classList.toggle('active');
  }

  alertOnGameWon() {
    alert('You win');
  }

  alertOnGameLost() {
    alert('You lost');
  }

  getRowAndColOfClick(event) {
    function isBetween(start, end, mid) {
      return mid <= end && start <= mid;
    }

    let clickedX = event.pageX - this.canvasLeft;
    let clickedY = event.pageY - this.canvasTop;

    let col = null;
    let row = null;
    for (let i = 0; i < this.COLUMNS; i++) {
      let start = this.SPACE_BETWEEN + i * (this.SPACE_BETWEEN + this.BLOCK_SIZE);
      let end = (i + 1) * (this.SPACE_BETWEEN + this.BLOCK_SIZE);
      if (isBetween(start, end, clickedX)) {
        col = i;
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
    if (row !== null && col !== null) {
      return [row, col];
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
        for (let col = 0; col < board.cols; col++) {
          let x = this.SPACE_BETWEEN + col * (this.BLOCK_SIZE + this.SPACE_BETWEEN);
          let y = this.SPACE_BETWEEN + row * (this.BLOCK_SIZE + this.SPACE_BETWEEN);
          // x,y,width,height
          this.drawCell(x, y, board.getCellAt(row, col));
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
        if (cell.hasMine()) {
          this.drawMine(x, y);
        } else {
          if (cell.value > 0) {
            this.drawNumberInside(x, y, cell.value.toString());
          }
        }
      }
    }
  }


  drawCoveredCell() {
    this.ctx.fillStyle = cell.isCovered() ? 'gray' : 'lightgray';
    this.ctx.strokeStyle = 'black';

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

  toggleFlagButton() {
    this.flagButton.classList.toggle('active');
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

  bindToggleFlag(handler) {
    this.flagButton.addEventListener('click', handler);
  }

  bindStartGame(handler) {
    this.startGameButton.addEventListener('click', handler);
  }

  bindSaveSettings(handler) {
    this.saveSettingsButton.addEventListener('click', event => {
      let startFormValues = this.getSettingsModalValues();
      handler(startFormValues);
      this.closeSettingsModal();
    })
  }

  bindCanvasClicked(handler) {
    this.canvas.addEventListener('click', handler);
  }

  bindCanvasRightClicked(handler) {
    this.canvas.addEventListener('contextmenu', handler);
  }

  bindSettingsButtonClicked(handler) {
    this.settingsButton.addEventListener('click', handler);
  }

  bindDifficultyLevelElementClicked(handler) {
    for (let difficultyElement of this.difficultiesElements) {
      difficultyElement.addEventListener('click', () => {
        handler(difficultyElement.textContent);
      });
    }
  }

}

export default View;
