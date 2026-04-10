import { useStore } from '../store/useStore';
import { CATEGORIES } from '../constants';
import { getCategoryIconPath } from '../utils/assetPaths';

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function CategorySelector() {
  const activeCategory = useStore(state => state.activeCategory);
  const setActiveCategory = useStore(state => state.setActiveCategory);

  return (
    <div className="category-selector">
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          className={cat === activeCategory ? 'active' : ''}
          onClick={() => {
            setActiveCategory(cat);
            const features = useStore.getState().features;
            if (features[cat]) {
              useStore.getState().selectFeature(cat);
            } else {
              useStore.getState().selectFeature(null);
            }
          }}
        >
          <img
            src={getCategoryIconPath(cat)}
            alt={capitalize(cat)}
          />
          <span>{capitalize(cat)}</span>
        </button>
      ))}
    </div>
  );
}
