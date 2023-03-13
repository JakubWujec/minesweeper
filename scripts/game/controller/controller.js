import Model from "../model/model";
import View from "../view/view"
class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.levelSettings = {
      'EASY': {
        rows: 8,
        columns: 8,
        mines: 10
      },
      'MEDIUM': {
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

    this.view.bindCanvasClicked(this.handleCanvasClick.bind(this));
    this.view.bindCanvasRightClicked(this.handleCanvasRightClick.bind(this));
    this.view.bindToggleFlag(this.handleToggleFlagMode.bind(this));
    this.view.bindStartGame(this.handleStartGame.bind(this));
    this.view.bindSaveSettings(this.handleSaveSettings.bind(this));
    this.view.bindSettingsButtonClicked(this.handleSettingsButtonClick.bind(this));
    this.view.bindDifficultyLevelElementClicked(this.handleDifficultyLevelClick.bind(this));

    this.flagMode = false;
  }

  rerenderView() {
    this.view.displayBoard(this.model.board);
    this.view.setMinesCounter(this.model.board.getCoveredFlaggedCells().length, this.model.board.initialNumberOfMines);
  }

  handleCanvasRightClick(event) {
    event.preventDefault();
    let clickLocation = this.view.getRowAndColOfClick(event);
    if (clickLocation != null) {
      let clickedCell = this.model.board.getCellAt(...clickLocation)
      if (clickedCell.isCovered()) {
        clickedCell.toggleFlag();
        this.rerenderView();
      }
    }

  }

  handleCanvasClick(event) {
    console.log(event);
    if (!this.model.isGameFinished()) {
      let location = this.view.getRowAndColOfClick(event);
      console.log(location);
      if (location !== null) {
        if (this.flagMode) {
          this.model.toggleFlagAt(...location);
        } else {
          this.model.board.selectCell(...location);
        }
      }

      this.rerenderView();

      if (this.model.isGameWon()) {
        this.handleGameWon();
      } else if (this.model.isGameLost()) {
        this.handleGameLost();
      }
    }
  }

  handleGameLost() {
    this.model.board.uncoverAllCells();
    this.view.alertOnGameLost();
    this.rerenderView();
  }

  handleGameWon() {
    this.view.alertOnGameWon();
  }

  handleToggleFlagMode() {
    this.flagMode = !this.flagMode;
    this.view.toggleFlagButton();
  }

  handleStartGame() {
    let settings = this.getSettings();
    console.log(settings);
    if (settings.rows > 0 && settings.columns > 0 && settings.mines > 0 && (settings.rows * settings.columns) > settings.mines) {
      this.model = new Model(settings.rows, settings.columns, settings.mines);
      this.view = new View(settings.rows, settings.columns);
      this.rerenderView();
      if (this.flagMode) {
        this.handleToggleFlagMode();
      }
    }
  }

  handleSaveSettings(settings) {
    localStorage.setItem('settings', JSON.stringify(settings));
    this.handleStartGame();
  }

  handleSettingsButtonClick() {
    this.view.openSettingsModal();
    let settings = this.getSettings();
    this.view.setSettingsModalValues(settings.rows, settings.columns, settings.mines);
  }

  handleDifficultyLevelClick(levelName) {
    if (levelName in this.levelSettings) {
      this.view.setSettingsModalValues(
        this.levelSettings[levelName].rows,
        this.levelSettings[levelName].columns,
        this.levelSettings[levelName].mines
      );
    }

  }

  getSettings(defaultSettings = this.levelSettings.EASY) {
    let settings = defaultSettings;
    let lsSettings = JSON.parse(localStorage.getItem('settings'));
    if (lsSettings) {
      settings = lsSettings;
    }
    return settings;
  }
}

let app = new Controller(new Model(8, 8, 10), new View(8, 8));
app.handleStartGame(8, 8, 10);

