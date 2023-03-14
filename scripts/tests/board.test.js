import Board from "../game/model/board"
import { assert, expect, test } from 'vitest'


test('get cells', () => {
  let board = new Board(2, 2, 1);
  let cells = board.cells;

  expect(cells.length).toBeGreaterThan(0);
})

test('get mined cells', () => {
  let board = new Board(2, 2, 1);
  board.prepare();
  let minedCells = board.getMinedCells();
  expect(minedCells.length).toEqual(1);
})

test('get number of mined  cells', () => {
  let board = new Board(2, 2, 2);
  board.prepare();
  expect(board.getNumberOfArmedMines()).toEqual(2);
})

test('Board flag toggle', () => {
  let board = new Board(2, 2, 1);

  expect(board.getCellAt(0, 0).isFlagged()).toBe(false);

  board.toggleFlagAt(0, 0);

  expect(board.getCellAt(0, 0).isFlagged()).toBe(true);

  board.toggleFlagAt(0, 0);

  expect(board.getCellAt(0, 0).isFlagged()).toBe(false);
})
