import { useState, useEffect, useCallback } from 'react';

interface FilterDef {
  id: string;
  label: string;
  buildCss: (strength: number) => string;
  transform?: string;
  noSlider?: boolean;
}

const FILTERS: FilterDef[] = [
  { id: 'invert', label: 'Invert', buildCss: (s) => `invert(${s})` },
  { id: 'highContrast', label: 'Hi Contrast', buildCss: (s) => `contrast(${1 + 1.5 * s})` },
  { id: 'blur', label: 'Soft Blur', buildCss: (s) => `blur(${2 * s}px)` },
  { id: 'brighten', label: 'Brighten', buildCss: (s) => `brightness(${1 + 0.6 * s})` },
  { id: 'darken', label: 'Darken', buildCss: (s) => `brightness(${1 - 0.5 * s})` },
  { id: 'sepia', label: 'Sepia', buildCss: (s) => `sepia(${s})` },
  { id: 'mirror', label: 'Mirror', buildCss: () => '', transform: 'scaleX(-1)', noSlider: true },
  { id: 'outline', label: 'Outline', buildCss: (s) => `contrast(${1 + 4 * s}) brightness(${1 + 0.5 * s})` },
  { id: 'shadow', label: 'Drop Shadow', buildCss: (s) => `drop-shadow(${2 * s}px ${2 * s}px ${3 * s}px rgba(0,0,0,${0.7 * s}))` },
  { id: 'warm', label: 'Warm Tone', buildCss: (s) => `sepia(${0.4 * s}) saturate(${1 + 0.5 * s})` },
  { id: 'cool', label: 'Cool Tone', buildCss: (s) => `hue-rotate(${190 * s}deg) saturate(${1 - 0.6 * s})` },
  { id: 'vintage', label: 'Vintage', buildCss: (s) => `sepia(${0.5 * s}) contrast(${1 + 0.2 * s}) brightness(${1 - 0.1 * s})` },
];

interface FilterState {
  active: boolean;
  strength: number; // 0–1
}

function makeDefault(): Record<string, FilterState> {
  const out: Record<string, FilterState> = {};
  for (const f of FILTERS) {
    out[f.id] = { active: false, strength: 1 };
  }
  return out;
}

export default function FilterPanel() {
  const [filters, setFilters] = useState<Record<string, FilterState>>(makeDefault);

  const toggle = useCallback((id: string) => {
    setFilters(prev => ({
      ...prev,
      [id]: { ...prev[id], active: !prev[id].active },
    }));
  }, []);

  const setStrength = useCallback((id: string, strength: number) => {
    setFilters(prev => ({
      ...prev,
      [id]: { ...prev[id], strength },
    }));
  }, []);

  const clearAll = useCallback(() => {
    setFilters(makeDefault());
  }, []);

  const activeFilters = FILTERS.filter(f => filters[f.id].active);

  useEffect(() => {
    const canvas = document.querySelector('.canvas-section canvas') as HTMLCanvasElement | null;
    if (!canvas) return;

    const cssParts: string[] = [];
    let transform = '';

    for (const f of FILTERS) {
      const state = filters[f.id];
      if (!state.active) continue;
      const css = f.buildCss(state.strength);
      if (css) cssParts.push(css);
      if (f.transform) transform = f.transform;
    }

    const filterStr = cssParts.length > 0 ? cssParts.join(' ') : '';

    canvas.style.filter = filterStr;
    canvas.style.transform = transform;
    canvas.dataset.activeFilter = filterStr;
    canvas.dataset.activeTransform = transform;
  }, [filters]);

  return (
    <fieldset className="panel-section">
      <legend>Filters</legend>
      <div className="filter-grid">
        {FILTERS.map(f => (
          <button
            key={f.id}
            className={filters[f.id].active ? 'filter-btn active' : 'filter-btn'}
            onClick={() => toggle(f.id)}
          >
            {f.label}
          </button>
        ))}
        <button className="filter-btn filter-clear" onClick={clearAll}>
          Clear All
        </button>
      </div>
      {activeFilters.length > 0 && (
        <div className="filter-sliders">
          {activeFilters.map(f => {
            if (f.noSlider) return null;
            const pct = Math.round(filters[f.id].strength * 100);
            return (
              <div key={f.id} className="filter-slider-row">
                <label>{f.label}: {pct}%</label>
                <input
                  type="range"
                  min={0}
                  max={300}
                  value={pct}
                  onChange={(e) => setStrength(f.id, Number(e.target.value) / 100)}
                />
              </div>
            );
          })}
        </div>
      )}
    </fieldset>
  );
}
