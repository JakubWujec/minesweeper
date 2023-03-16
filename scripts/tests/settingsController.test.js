import { assert, expect, test, describe, beforeEach } from 'vitest'
import SettingsController from "../game/controller/settingsController"

describe("Validate settings", () => {
  let settingsController = new SettingsController();

  beforeEach(() => {
    settingsController = new SettingsController();
  })

  test("Should return false when given non positive dimensions", () => {
    expect(settingsController.validateSettings({
      rows: -1,
      columns: 3,
      mines: 1
    })).toBe(false);

    expect(settingsController.validateSettings({
      rows: 0,
      columns: 3,
      mines: 1
    })).toBe(false);

    expect(settingsController.validateSettings({
      rows: 3,
      columns: -1,
      mines: 1
    })).toBe(false);

    expect(settingsController.validateSettings({
      rows: 3,
      columns: 0,
      mines: 1
    })).toBe(false);
  })

  test("Should return false when given negative #mines", () => {
    expect(settingsController.validateSettings({
      rows: 2,
      columns: 3,
      mines: -1
    })).toBe(false);

    expect(settingsController.validateSettings({
      rows: 2,
      columns: 3,
      mines: 0
    })).toBe(true);
  })

  test('Should return false when #mines > #cells', () => {

    expect(settingsController.validateSettings({
      rows: 3,
      columns: 3,
      mines: 10
    })).toBe(false);
  })

  test('Should return true when #mines equals #cells', () => {

    expect(settingsController.validateSettings({
      rows: 3,
      columns: 3,
      mines: 9
    })).toBe(true);
  })

  test('Should return false when #mines < #cells', () => {

    expect(settingsController.validateSettings({
      rows: 3,
      columns: 3,
      mines: 8
    })).toBe(true);
  })

})