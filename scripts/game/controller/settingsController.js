class SettingsController {
  #defaultSettings;
  #levelSettings
  constructor() {
    this.#levelSettings = {
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
    this.#defaultSettings = this.#levelSettings.EASY;
  }

  set settings(settings) {
    if (this.validateSettings(settings)) {
      localStorage.setItem('settings', JSON.stringify(settings));
    }
  }

  get settings() {
    let chosenSettings = this.#defaultSettings;
    let lsSettings = JSON.parse(localStorage.getItem('settings'));
    if (lsSettings && this.validateSettings(lsSettings)) {
      chosenSettings = lsSettings;
    }
    return JSON.parse(JSON.stringify(chosenSettings));
  }

  get levelSettings() {
    return JSON.parse(JSON.stringify(this.#levelSettings));
  }

  validateSettings(settings) {
    return settings.rows > 0 && settings.columns > 0 && settings.mines >= 0 && (settings.rows * settings.columns) > settings.mines
  }


}

export default SettingsController;