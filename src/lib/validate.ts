import type { Cell, Round } from "@/lib/grid";

export type MatchedSelection = { word: string; cells: Cell[] };

export function checkSelection(round: Round, cells: Cell[]): MatchedSelection | null {
  if (cells.length < 2) return null;
  const seen = new Set<string>();
  for (const cell of cells) {
    if (!Number.isInteger(cell.row) || !Number.isInteger(cell.col)) return null;
    if (cell.row < 0 || cell.row >= round.grid.length || cell.col < 0 || cell.col >= round.grid[cell.row]?.length) return null;
    const key = `${cell.row},${cell.col}`;
    if (seen.has(key)) return null;
    seen.add(key);
  }

  const rowDelta = cells[1].row - cells[0].row;
  const colDelta = cells[1].col - cells[0].col;
  const distance = Math.max(Math.abs(rowDelta), Math.abs(colDelta));
  if (distance !== 1 || (rowDelta !== 0 && colDelta !== 0 && Math.abs(rowDelta) !== Math.abs(colDelta))) return null;
  const stepRow = Math.sign(rowDelta);
  const stepCol = Math.sign(colDelta);
  if (!cells.every((cell, index) => cell.row === cells[0].row + stepRow * index && cell.col === cells[0].col + stepCol * index)) return null;

  const spelling = cells.map(({ row, col }) => round.grid[row][col]).join("");
  const word = round.words.find((candidate) => candidate === spelling || candidate === spelling.split("").reverse().join(""));
  return word ? { word, cells: cells.map(({ row, col }) => ({ row, col })) } : null;
}

export function snapToLine(start: Cell, current: Cell): Cell[] {
  const rowDelta = current.row - start.row;
  const colDelta = current.col - start.col;
  const distance = Math.max(Math.abs(rowDelta), Math.abs(colDelta));
  if (distance === 0) return [{ ...start }];

  const angle = Math.atan2(rowDelta, colDelta);
  const sector = Math.PI / 4;
  const snappedAngle = Math.round(angle / sector) * sector;
  const stepCol = Math.round(Math.cos(snappedAngle));
  const stepRow = Math.round(Math.sin(snappedAngle));
  return Array.from({ length: distance + 1 }, (_, index) => ({
    row: start.row + stepRow * index,
    col: start.col + stepCol * index,
  }));
}
