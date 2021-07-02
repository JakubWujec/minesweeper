class Controller{
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindCanvasClicked(this.handleCanvasClick.bind(this));
    this.view.bindToggleFlag(this.handleToggleFlagMode.bind(this));
    this.view.bindStartGame(this.handleStartGame.bind(this));

    this.flagMode = false;
  }

  handleCanvasClick(event){
    console.log(event);
    if(!this.model.isGameFinished()){
      let location = this.view.getRowAndColOfClick(event);
      console.log(location);
      if(location !== null){
        if(this.flagMode){
          this.model.board.getCellAt(...location).toggleFlag();
        } else {
          this.model.board.selectCell(...location);
        }
      }

      this.view.displayBoard(this.model.board);
      this.view.setMinesCounter(this.model.board.getFlaggedCells().length, this.model.board.initialNumberOfMines);

      if(this.model.isGameWon()){
        this.handleGameWon();
      } else if (this.model.isGameLost()){
        this.handleGameLost();
      }
    }
  }

  handleGameLost(){
    this.view.alertOnGameLost();
  }

  handleGameWon(){
    this.view.alertOnGameWon();
  }

  handleToggleFlagMode(){
    this.flagMode = !this.flagMode;
    this.view.toggleFlagButton();
  }

  handleStartGame(rows, cols, mines){
    if(rows > 0 && cols > 0 && mines > 0 && (rows * cols) > mines){
      this.model = new Model(rows, cols, mines);
      this.view = new View(rows, cols);
      this.view.displayBoard(this.model.board);
      this.view.setMinesCounter(0, mines);
      if(this.flagMode){
        this.handleToggleFlagMode();
      }
    }
  }
}


let app = new Controller(new Model(8,8,10), new View(8,8));
app.handleStartGame(5,5,10);
app.handleStartGame(8,8,10);

