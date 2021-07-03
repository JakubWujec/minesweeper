class View{
  constructor(rows=8, columns=8){
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
    this.difficultiesElements = document.querySelectorAll('.modal__difficulty');


    this.settingsButton.addEventListener('click', () => {
      this.openModal();
    })
    this.closeModalButton.addEventListener('click', () => {
      this.closeModal();
    })
    this.backdrop.addEventListener('click', () => {
      this.closeModal();
    })

    this.levelSettings = {
      'EASY': {
        rows: 8,
        columns: 8,
        mines: 10
      }, 
      'MEDIUM' : {
        rows: 16,
        columns: 16,
        mines: 40
      },
      'HARD': {
        rows: 30,
        columns: 16,
        mines: 99
      }
    }
    
    for(let difficultyElement of this.difficultiesElements){
      difficultyElement.addEventListener('click', () => {
        document.getElementById('input-x').value = this.levelSettings[difficultyElement.textContent].rows;
        document.getElementById('input-y').value = this.levelSettings[difficultyElement.textContent].columns;
        document.getElementById('input-mines').value = this.levelSettings[difficultyElement.textContent].mines; 
        console.log('ha');
      });
    }
  }

  getSettingsModalValues(){
    let xValue = document.getElementById('input-x').value;
    let yValue = document.getElementById('input-y').value;
    let minesValue = document.getElementById('input-mines').value;
    return {
      rows: parseInt(xValue),
      columns: parseInt(yValue),
      mines: parseInt(minesValue),
    }
  }

  setCanvasSize(width, height){
    this.canvas.width = width;
    this.canvas.height = height;
  }

  get canvasLeft(){ return this.canvas.offsetLeft + this.canvas.clientLeft - this.canvas.scrollLeft;}
  get canvasTop(){ return this.canvas.offsetTop + this.canvas.clientTop - this.canvas.scrollTop;}

  calculateRequiredCanvasLength(cellsInLine){
    return cellsInLine * (this.BLOCK_SIZE + this.SPACE_BETWEEN) + this.SPACE_BETWEEN;
  }

  setMinesCounter(numerator, denominator){
    this.minesCounterElement.innerText= `Mines ${numerator} / ${denominator}`;
  }

  toggleFlagButton(){
    this.flagButton.classList.toggle('active');
  }

  alertOnGameWon(){
    alert('You win');
  }

  alertOnGameLost(){
    alert('You lost');
  }

  getRowAndColOfClick(event){     
    /* screen
      ------------>x
      |           h
      |           e
      |           i
      |           g
      |           h
      |           t
      |y
      v width
    */
    function isBetween(start, end, mid){
      return mid <= end && start <= mid;
    }
    //let canvas2 = document.querySelector('#canvas');

    let clickedX = event.pageX - this.canvasLeft;
    let clickedY = event.pageY -this.canvasTop;

    let col = null;
    let row = null;
    for(let i = 0; i < this.COLUMNS; i++){
      let start = this.SPACE_BETWEEN + i * (this.SPACE_BETWEEN + this.BLOCK_SIZE);
      let end = (i + 1) * (this.SPACE_BETWEEN + this.BLOCK_SIZE);
      if (isBetween(start, end, clickedX)){
        col = i;
        break;
      }
    }
    for(let i = 0; i < this.ROWS; i++){
      let start = this.SPACE_BETWEEN + i * (this.SPACE_BETWEEN + this.BLOCK_SIZE);
      let end = (i + 1) * (this.SPACE_BETWEEN + this.BLOCK_SIZE);
      if (isBetween(start, end, clickedY)){
        row = i;
        break;
      }
    }
    if(row!== null && col!==null){
      return [row, col];
    }
    return null;
  }
  
  displayBoard(board){
    if(this.canvas.getContext) {    
      // set fill and stroke styles
      this.ctx.fillStyle = 'gray';
      this.ctx.strokeStyle = 'black';
    
      // draw a rectangle with fill and stroke
      for(let row = 0; row < board.rows; row++){
        for(let col = 0; col < board.cols; col++){
          let x = this.SPACE_BETWEEN + col * (this.BLOCK_SIZE + this.SPACE_BETWEEN);
          let y = this.SPACE_BETWEEN + row * (this.BLOCK_SIZE + this.SPACE_BETWEEN);
          // x,y,width,height
          this.drawCell(x, y, board.getCellAt(row, col));
        }
      }
    }
  }

  drawCell(x, y, cell){
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

    if(cell){
      if(cell.isCovered() && cell.isFlagged()){
        this.drawFlag(x, y);
      } else if(!cell.isCovered()){
        if(cell.hasMine()){
          this.drawMine(x, y); 
        } else {
          if(cell.value > 0){
            this.drawNumberInside(x, y, cell.value.toString());
          }
        }
      }
    }   
  }


  drawCoveredCell(){
    this.ctx.fillStyle = cell.isCovered() ? 'gray' : 'lightgray';
    this.ctx.strokeStyle = 'black';

  }

  drawFlag(x, y){
    try{
      let flagImage = new Image();
      flagImage.src = './assets/images/flag1.png';
      this.ctx.drawImage(flagImage, x + 0.1 * this.BLOCK_SIZE, y + 0.1 * this.BLOCK_SIZE, 0.8 * this.BLOCK_SIZE, 0.8 * this.BLOCK_SIZE);
    } catch(error){
      console.log(error);
    }

  }

  drawNumberInside(x, y, numberString){
    this.ctx.fillText(numberString, x + Math.floor(this.BLOCK_SIZE / 2), y + Math.floor(this.BLOCK_SIZE / 2));
    this.ctx.strokeText(numberString, x + Math.floor(this.BLOCK_SIZE / 2), y + Math.floor(this.BLOCK_SIZE / 2));
  }

  drawMine(x, y){
    try{
      let mineImage = new Image();
      mineImage.src = './assets/images/mine2.png';
      this.ctx.drawImage(mineImage, x + 0.1 * this.BLOCK_SIZE, y + 0.1 * this.BLOCK_SIZE, 0.8 * this.BLOCK_SIZE, 0.8 * this.BLOCK_SIZE);
    } catch(error){
      console.log(error);
    }
  }

  bindToggleFlag(handler){
    this.flagButton.addEventListener('click', handler);
  }

  bindStartGame(handler){
    this.startGameButton.addEventListener('click', event =>{
      handler();
    })
  }

  bindSaveSettings(handler){
    this.saveSettingsButton.addEventListener('click', event => {
      let startFormValues = this.getSettingsModalValues();
      handler(startFormValues);
      this.closeModal();
    })
  }

  bindCanvasClicked(handler){
    this.canvas.addEventListener('click', handler);
  }
  
  toggleFlagButton(){
    this.flagButton.classList.toggle('active');
  }

  openModal(){
    this.modal.classList.add("open");
    this.backdrop.classList.add("open");
  }

  closeModal(){
    if(this.modal){
      this.modal.classList.remove("open");
      this.backdrop.classList.remove("open");
    }
  }  

}

