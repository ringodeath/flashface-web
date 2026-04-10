import type { CategoryName } from '../constants';

export function getFullImagePath(category: CategoryName, index: number): string {
  return `/assets/full/${category}/${index}.png`;
}

export function getPreviewImagePath(category: CategoryName, index: number): string {
  return `/assets/preview/${category}/${index}.png`;
}

export function getCategoryIconPath(category: CategoryName): string {
  return `/assets/categories/${category}.png`;
}
