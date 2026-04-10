import { create } from 'zustand';
import { saveAs } from 'file-saver';
import type { AppState, FaceFeature } from '../types';
import type { CategoryName } from '../constants';
import { DEFAULT_SCALE, DEFAULT_OPACITY } from '../constants';
import { DEFAULT_POSITIONS } from '../utils/defaultPositions';

const MAX_HISTORY = 50;

export const useStore = create<AppState>()((set, get) => ({
  activeCategory: 'head',
  selectedFeatureCategory: null,
  features: {},
  history: [{}],
  historyIndex: 0,
  stageRef: null,
  showConfirmDialog: false,
  confirmDialogAction: null,

  setActiveCategory: (cat) => {
    set({ activeCategory: cat });
  },

  placeFeature: (category, variantIndex) => {
    set((state) => {
      const existing = state.features[category];
      const pos = DEFAULT_POSITIONS[category];
      const feature: FaceFeature = existing
        ? { ...existing, variantIndex }
        : {
            category,
            variantIndex,
            x: pos.x,
            y: pos.y,
            scaleX: DEFAULT_SCALE,
            scaleY: DEFAULT_SCALE,
            opacity: DEFAULT_OPACITY,
          };
      return {
        features: { ...state.features, [category]: feature },
        selectedFeatureCategory: category,
      };
    });
    get().pushHistory();
  },

  updateFeature: (category, updates) => {
    set((state) => {
      const existing = state.features[category];
      if (!existing) return {};
      return {
        features: {
          ...state.features,
          [category]: { ...existing, ...updates },
        },
      };
    });
  },

  removeFeature: (category) => {
    set((state) => {
      const newFeatures = { ...state.features };
      delete newFeatures[category];
      return {
        features: newFeatures,
        selectedFeatureCategory:
          state.selectedFeatureCategory === category
            ? null
            : state.selectedFeatureCategory,
      };
    });
    get().pushHistory();
  },

  selectFeature: (category) => {
    set({ selectedFeatureCategory: category });
  },

  clearAll: () => {
    set({ features: {}, selectedFeatureCategory: null });
    get().pushHistory();
  },

  undo: () => {
    set((state) => {
      if (state.historyIndex <= 0) return {};
      const newIndex = state.historyIndex - 1;
      return {
        historyIndex: newIndex,
        features: structuredClone(state.history[newIndex]),
      };
    });
  },

  redo: () => {
    set((state) => {
      if (state.historyIndex >= state.history.length - 1) return {};
      const newIndex = state.historyIndex + 1;
      return {
        historyIndex: newIndex,
        features: structuredClone(state.history[newIndex]),
      };
    });
  },

  saveToFile: () => {
    const { features } = get();
    const json = JSON.stringify(features, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    saveAs(blob, 'flashface-composite.json');
  },

  loadFromFile: (data) => {
    try {
      const parsed = JSON.parse(data) as Partial<Record<CategoryName, FaceFeature>>;
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return;
      set({ features: parsed, selectedFeatureCategory: null });
      get().pushHistory();
    } catch {
      // Invalid JSON — silently ignore
    }
  },

  pushHistory: () => {
    set((state) => {
      const sliced = state.history.slice(0, state.historyIndex + 1);
      const snapshot = structuredClone(state.features);
      const newHistory = [...sliced, snapshot];
      if (newHistory.length > MAX_HISTORY) {
        newHistory.splice(0, newHistory.length - MAX_HISTORY);
      }
      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  setStageRef: (stage) => {
    set({ stageRef: stage });
  },

  requestConfirm: (action) => {
    set({ showConfirmDialog: true, confirmDialogAction: action });
  },

  cancelConfirm: () => {
    set({ showConfirmDialog: false, confirmDialogAction: null });
  },
}));
