import Board from "../game/model/board"
import { assert, expect, test } from 'vitest'


test('getNeighboursOf', () => {
  let board = new Board(3, 3, 0);
  expect(board.getNeighboursOf(1, 1).length).toEqual(8);
  expect(board.getNeighboursOf(0, 0).length).toEqual(3);
  expect(board.getNeighboursOf(0, 1).length).toEqual(5);
})

test('selectCellAt uncover whole board when no mines', () => {
  let board = new Board(4, 4, 0);
  board.selectCellAt(0, 0);

  expect(board.getCoveredCells().length).toEqual(0);
})

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
  expect(board.getNumberOfArmedCells()).toEqual(2);
})

test('Board flag toggle', () => {
  let board = new Board(2, 2, 1);

  expect(board.getCellAt(0, 0).isFlagged()).toBe(false);

  board.toggleFlagAt(0, 0);

  expect(board.getCellAt(0, 0).isFlagged()).toBe(true);

  board.toggleFlagAt(0, 0);

  expect(board.getCellAt(0, 0).isFlagged()).toBe(false);
})
