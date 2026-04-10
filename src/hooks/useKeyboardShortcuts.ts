import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export function useKeyboardShortcuts(): void {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = useStore.getState();
      const { selectedFeatureCategory } = state;

      // Ctrl+Z — undo
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        state.undo();
        return;
      }

      // Ctrl+Y or Ctrl+Shift+Z — redo
      if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'Z')) {
        e.preventDefault();
        state.redo();
        return;
      }

      // Ctrl+S — save face to JSON
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        state.saveToFile();
        return;
      }

      // Ctrl+E — export PNG
      if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        const { stageRef } = state;
        if (stageRef) {
          const dataUrl = stageRef.toDataURL();
          const link = document.createElement('a');
          link.download = 'flashface-composite.png';
          link.href = dataUrl;
          link.click();
        }
        return;
      }

      // Escape — deselect current feature
      if (e.key === 'Escape') {
        state.selectFeature(null);
        return;
      }

      // The remaining shortcuts require a selected feature
      if (!selectedFeatureCategory) return;
      const feature = state.features[selectedFeatureCategory];
      if (!feature) return;

      // Delete / Backspace — remove selected feature
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        state.removeFeature(selectedFeatureCategory);
        return;
      }

      // Arrow keys — nudge selected feature (Shift = 10px, otherwise 1px)
      const step = e.shiftKey ? 10 : 1;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        state.updateFeature(selectedFeatureCategory, { x: feature.x - step });
        state.pushHistory();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        state.updateFeature(selectedFeatureCategory, { x: feature.x + step });
        state.pushHistory();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        state.updateFeature(selectedFeatureCategory, { y: feature.y - step });
        state.pushHistory();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        state.updateFeature(selectedFeatureCategory, { y: feature.y + step });
        state.pushHistory();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
