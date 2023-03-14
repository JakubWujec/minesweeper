import Board from "../game/model/board"
import { assert, expect, test } from 'vitest'
import BoardFactory from "../game/model/boardFactory";



test('getNeighboursOf', () => {
  let bf = new BoardFactory({ rows: 3, columns: 3, mines: 0 })
  let board = bf.prepare();
  expect(board.getNeighboursOf(1, 1).length).toEqual(8);
  expect(board.getNeighboursOf(0, 0).length).toEqual(3);
  expect(board.getNeighboursOf(0, 1).length).toEqual(5);
})

test('selectCellAt uncover whole board when no mines', () => {
  let bf = new BoardFactory({ rows: 4, columns: 4, mines: 0 })
  let board = bf.prepare();
  board.selectCellAt(0, 0);

  expect(board.getCoveredCells().length).toEqual(0);
})

test('get cells', () => {
  let bf = new BoardFactory({ rows: 2, columns: 2, mines: 1 })
  let board = bf.prepare();
  let cells = board.cells;

  expect(cells.length).toBeGreaterThan(0);
})

test('get mined cells', () => {
  let bf = new BoardFactory({ rows: 2, columns: 2, mines: 1 })
  let board = bf.prepare();

  let minedCells = board.getMinedCells();
  expect(minedCells.length).toEqual(1);
})

test('get number of mined  cells', () => {
  let bf = new BoardFactory({ rows: 2, columns: 2, mines: 2 })
  let board = bf.prepare();
  expect(board.getNumberOfArmedCells()).toEqual(2);
})

test('Board flag toggle', () => {
  let bf = new BoardFactory({ rows: 2, columns: 2, mines: 1 })
  let board = bf.prepare();

  expect(board.getCellAt(0, 0).isFlagged()).toBe(false);

  board.toggleFlagAt(0, 0);

  expect(board.getCellAt(0, 0).isFlagged()).toBe(true);

  board.toggleFlagAt(0, 0);

  expect(board.getCellAt(0, 0).isFlagged()).toBe(false);
})
