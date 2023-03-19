import Model from "../model/model";
import View from "../view/view"
import SettingsController from "./settingsController";
import Location from "./location";
class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.settingsController = new SettingsController();

    this.view.bindToggleFlagAt(this.handleToggleFlagAt.bind(this))
    this.view.bindUncoverAt(this.handleUncoverAt.bind(this));
    this.view.bindToggleFlagMode(this.handleToggleFlagMode.bind(this));
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
        this.handleGameLost();
      }
    }

  }

  handleUncoverAt(location) {
    this.handleLocationSelected(location, this.flagMode);
  }

  handleToggleFlagAt(location) {
    this.handleLocationSelected(location, true);
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
    this.model = new Model(settings);
    this.view = new View(settings.rows, settings.columns);
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

let app = new Controller(new Model(8, 8, 10), new View(8, 8));
app.handleStartGame(8, 8, 10);

