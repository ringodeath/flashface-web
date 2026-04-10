import { useStore } from '../store/useStore';
import { getFullImagePath } from '../utils/assetPaths';

export default function FeaturePreview() {
  const selectedFeatureCategory = useStore((s) => s.selectedFeatureCategory);
  const features = useStore((s) => s.features);

  const feature = selectedFeatureCategory
    ? features[selectedFeatureCategory]
    : undefined;

  if (!feature) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: 120,
        color: '#808080',
        fontSize: 11,
      }}>
        No feature selected
      </div>
    );
  }

  const imagePath = getFullImagePath(feature.category, feature.variantIndex);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 4,
      height: '100%',
      minHeight: 120,
      background: '#eee',
    }}>
      <img
        src={imagePath}
        alt={`${feature.category} variant ${feature.variantIndex}`}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
        }}
      />
    </div>
  );
}
