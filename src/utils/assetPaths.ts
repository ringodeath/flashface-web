import type { CategoryName } from '../constants';

const BASE = import.meta.env.BASE_URL;

export function getFullImagePath(category: CategoryName, index: number): string {
  return `${BASE}assets/full/${category}/${index}.png`;
}

export function getPreviewImagePath(category: CategoryName, index: number): string {
  return `${BASE}assets/preview/${category}/${index}.png`;
}

export function getCategoryIconPath(category: CategoryName): string {
  return `${BASE}assets/categories/${category}.png`;
}
