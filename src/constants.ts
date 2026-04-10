export const CATEGORIES = [
  'head', 'hair', 'jaw', 'eyebrows', 'eyes',
  'nose', 'mouth', 'beard', 'moustache', 'glasses',
] as const;

export type CategoryName = (typeof CATEGORIES)[number];

export const VARIANT_COUNTS: Record<CategoryName, number> = {
  head: 24,
  hair: 73,
  eyebrows: 208,
  eyes: 152,
  nose: 217,
  mouth: 214,
  jaw: 75,
  beard: 56,
  moustache: 24,
  glasses: 35,
};

export const LAYER_ORDER: CategoryName[] = [
  'head', 'hair', 'jaw', 'eyebrows', 'eyes',
  'nose', 'mouth', 'beard', 'moustache', 'glasses',
];

export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 500;
export const DEFAULT_SCALE = 1.0;
export const DEFAULT_OPACITY = 1.0;
