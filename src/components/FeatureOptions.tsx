import { useCallback } from 'react';
import { useStore } from '../store/useStore';

export default function FeatureOptions() {
  const selectedFeatureCategory = useStore((s) => s.selectedFeatureCategory);
  const features = useStore((s) => s.features);
  const updateFeature = useStore((s) => s.updateFeature);
  const removeFeature = useStore((s) => s.removeFeature);
  const pushHistory = useStore((s) => s.pushHistory);

  const feature = selectedFeatureCategory
    ? features[selectedFeatureCategory]
    : undefined;
  const disabled = !feature;

  const opacityPercent = Math.round((feature?.opacity ?? 1) * 100);

  const handleOpacityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!selectedFeatureCategory) return;
      updateFeature(selectedFeatureCategory, {
        opacity: Number(e.target.value) / 100,
      });
    },
    [selectedFeatureCategory, updateFeature],
  );

  const handleOpacityCommit = useCallback(() => {
    pushHistory();
  }, [pushHistory]);

  const handleDelete = useCallback(() => {
    if (!selectedFeatureCategory) return;
    removeFeature(selectedFeatureCategory);
  }, [selectedFeatureCategory, removeFeature]);

  return (
    <fieldset className="panel-section">
      <legend>Options</legend>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '4px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '11px', marginBottom: '4px', color: '#eee' }}>
            Opacity: {opacityPercent}%
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={opacityPercent}
            disabled={disabled}
            onChange={handleOpacityChange}
            onMouseUp={handleOpacityCommit}
            style={{ width: '100%' }}
          />
        </div>
        <button disabled={disabled} onClick={handleDelete}>
          Delete feature
        </button>
      </div>
    </fieldset>
  );
}
