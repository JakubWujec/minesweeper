import Model from "../model/model";
import View from "../view/view"
import SettingsController from "./settingsController";
class Controller {
  constructor() {
    this.model = null;
    this.view = null;

    this.settingsController = new SettingsController();
    this.flagMode = false;
  }

  bindView(view) {
    if (this.view) {
      this.view.untrackAllEventListeners();
      delete this.view;
    }
    this.view = view;
    this.view.bindToggleFlagAt(this.handleToggleFlagAt.bind(this))
    this.view.bindUncoverAt(this.handleUncoverAt.bind(this));
    this.view.bindToggleFlagMode(this.handleToggleFlagMode.bind(this));
    this.view.bindStartGame(this.handleStartGame.bind(this));
    this.view.bindSaveSettings(this.handleSaveSettings.bind(this));
    this.view.bindSettingsButtonClicked(this.handleSettingsButtonClick.bind(this));
    this.view.bindDifficultyLevelElementClicked(this.handleDifficultyLevelClick.bind(this));
  }

  bindModel(model) {
    this.model = model;
  }

  get levelSettings() {
    return this.settingsController.levelSettings;
  }

  getSettings() {
    return this.settingsController.settings;
  }

  rerenderView() {
    this.view.displayBoard(this.model.board);
    this.view.setMinesCounter(this.model.numberOfFlaggedCells, this.model.initialNumberOfMines);
  }

  handleLocationSelected(location, flagMode) {
    if (!location) return;
    if (!this.model.isGameFinished()) {
      if (flagMode) {
        this.model.toggleFlagAt(location);
      } else {
        this.model.selectCellAt(location);
      }
      this.rerenderView();

      if (this.model.isGameWon()) {
        this.handleGameWon();
      } else if (this.model.isGameLost()) {
        this.handleGameLost(location);
      }
    }

  }

  handleUncoverAt(location) {
    this.handleLocationSelected(location, this.flagMode);
  }

  handleToggleFlagAt(location) {
    this.handleLocationSelected(location, true);
  }

  handleGameLost(explodedMineLocation) {
    this.model.uncoverAllCells();
    this.view.alertOnGameLost();
    this.view.displayBoard(this.model.board, explodedMineLocation);
  }

  handleGameWon() {
    this.view.alertOnGameWon();
  }

  handleToggleFlagMode() {
    if (this.flagMode) {
      this.setFlagModeOff();
    } else {
      this.setFlagModeOn();
    }
  }

  setFlagModeOff() {
    this.flagMode = false;
    this.view.setFlagButtonOff();
  }

  setFlagModeOn() {
    this.flagMode = true;
    this.view.setFlagButtonOn();
  }

  handleStartGame() {
    let settings = this.getSettings();
    this.bindModel(new Model(settings));
    this.bindView(new View(settings));
    this.setFlagModeOff();
    this.rerenderView();
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

let app = new Controller();
app.handleStartGame();

