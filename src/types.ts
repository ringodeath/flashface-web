import type { CategoryName } from './constants';
import type Konva from 'konva';

export interface FaceFeature {
  category: CategoryName;
  variantIndex: number;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  opacity: number;
}

export interface AppState {
  // Active selections
  activeCategory: CategoryName;
  selectedFeatureCategory: CategoryName | null;

  // Placed features (keyed by category — one per category)
  features: Partial<Record<CategoryName, FaceFeature>>;

  // Undo/Redo
  history: Partial<Record<CategoryName, FaceFeature>>[];
  historyIndex: number;

  // Konva stage ref for export
  stageRef: Konva.Stage | null;

  // Confirm dialog
  showConfirmDialog: boolean;
  confirmDialogAction: (() => void) | null;

  // Actions
  setActiveCategory: (cat: CategoryName) => void;
  placeFeature: (category: CategoryName, variantIndex: number) => void;
  updateFeature: (category: CategoryName, updates: Partial<FaceFeature>) => void;
  removeFeature: (category: CategoryName) => void;
  selectFeature: (category: CategoryName | null) => void;
  clearAll: () => void;
  undo: () => void;
  redo: () => void;
  saveToFile: () => void;
  loadFromFile: (data: string) => void;
  pushHistory: () => void;
  setStageRef: (stage: Konva.Stage | null) => void;
  requestConfirm: (action: () => void) => void;
  cancelConfirm: () => void;
}
