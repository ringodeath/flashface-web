import { CATEGORIES } from '../constants';
import type { CategoryName } from '../constants';
import type { FaceFeature } from '../types';

const validCategories: ReadonlyArray<string> = CATEGORIES;

export function serializeFace(features: Partial<Record<CategoryName, FaceFeature>>): string {
  return JSON.stringify(features, null, 2);
}

export function deserializeFace(data: string): Partial<Record<CategoryName, FaceFeature>> | null {
  try {
    const parsed: unknown = JSON.parse(data);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return null;
    }

    const record = parsed as Record<string, unknown>;
    const result: Partial<Record<CategoryName, FaceFeature>> = {};

    for (const key of Object.keys(record)) {
      if (!validCategories.includes(key)) {
        return null;
      }

      const value = record[key];
      if (!isValidFaceFeature(value)) {
        return null;
      }

      result[key as CategoryName] = value;
    }

    return result;
  } catch {
    return null;
  }
}

function isValidFaceFeature(value: unknown): value is FaceFeature {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  return (
    typeof obj.category === 'string' &&
    validCategories.includes(obj.category) &&
    typeof obj.variantIndex === 'number' &&
    typeof obj.x === 'number' &&
    typeof obj.y === 'number' &&
    typeof obj.scaleX === 'number' &&
    typeof obj.scaleY === 'number' &&
    typeof obj.opacity === 'number'
  );
}
