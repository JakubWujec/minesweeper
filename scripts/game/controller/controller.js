import Model from "../model/model";
import View from "../view/view"
import SettingsController from "./settingsController";
class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.settingsController = new SettingsController();

    this.view.bindCanvasClicked(this.handleCanvasClick.bind(this));
    this.view.bindCanvasRightClicked(this.handleCanvasRightClick.bind(this));
    this.view.bindToggleFlag(this.handleToggleFlagMode.bind(this));
    this.view.bindStartGame(this.handleStartGame.bind(this));
    this.view.bindSaveSettings(this.handleSaveSettings.bind(this));
    this.view.bindSettingsButtonClicked(this.handleSettingsButtonClick.bind(this));
    this.view.bindDifficultyLevelElementClicked(this.handleDifficultyLevelClick.bind(this));

    this.flagMode = false;
  }

  get levelSettings() {
    return this.settingsController.levelSettings;
  }

  getSettings() {
    return this.settingsController.settings;
  }

  rerenderView() {
    this.view.displayBoard(this.model.board);
    this.view.setMinesCounter(this.model.board.getCoveredFlaggedCells().length, this.model.initialNumberOfMines);
  }

  handleCanvasRightClick(event) {
    event.preventDefault();
    let location = this.view.getRowAndColOfClick(event);
    if (location) {
      this.model.toggleFlagAt(...location);
      this.rerenderView();
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
          this.model.selectCellAt(...location);
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
    this.model.uncoverAllCells();
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
    this.model = new Model(settings);
    this.view = new View(settings.rows, settings.columns);
    this.rerenderView();
    if (this.flagMode) {
      this.handleToggleFlagMode();
    }

  }

  handleSaveSettings(settings) {
    this.settingsController.settings = settings;
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


}

let app = new Controller(new Model(8, 8, 10), new View(8, 8));
app.handleStartGame(8, 8, 10);

