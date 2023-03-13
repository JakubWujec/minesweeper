import Board from "../game/model/board"
import { assert, expect, test } from 'vitest'

test('Board flag toggle', () => {
  let board = new Board(2, 2, 1);

  expect(board.getCellAt(0, 0).isFlagged()).toBe(false);

  board.toggleFlagAt(0, 0);

  expect(board.getCellAt(0, 0).isFlagged()).toBe(true);

  board.toggleFlagAt(0, 0);

  expect(board.getCellAt(0, 0).isFlagged()).toBe(false);
})
