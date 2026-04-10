import type { CategoryName } from '../constants';

export const DEFAULT_POSITIONS: Record<CategoryName, { x: number; y: number }> = {
  head:      { x: 300, y: 250 },
  hair:      { x: 300, y: 130 },
  eyebrows:  { x: 300, y: 200 },
  eyes:      { x: 300, y: 220 },
  nose:      { x: 300, y: 270 },
  mouth:     { x: 300, y: 320 },
  jaw:       { x: 300, y: 340 },
  beard:     { x: 300, y: 330 },
  moustache: { x: 300, y: 295 },
  glasses:   { x: 300, y: 215 },
};
