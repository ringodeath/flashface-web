import { useRef, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { VARIANT_COUNTS } from '../constants';
import { getPreviewImagePath } from '../utils/assetPaths';

export default function VariantStrip() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeCategory = useStore(s => s.activeCategory);
  const currentVariant = useStore(s => s.features[s.activeCategory]?.variantIndex);
  const count = VARIANT_COUNTS[activeCategory];

  const handleClick = (index: number) => {
    useStore.getState().placeFeature(activeCategory, index);
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  };

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    scrollRef.current?.scrollBy({ left: e.deltaY, behavior: 'auto' });
  }, []);

  return (
    <div className="variant-strip-row">
      <button className="variant-nav" onClick={scrollLeft}>&lt;</button>
      <div className="variant-scroll" ref={scrollRef} onWheel={handleWheel}>
        {Array.from({ length: count }, (_, i) => (
          <button
            key={`${activeCategory}-${i}`}
            className={`variant-thumb-btn${currentVariant === i ? ' active' : ''}`}
            onClick={() => handleClick(i)}
          >
            <img
              src={getPreviewImagePath(activeCategory, i)}
              alt={`${activeCategory} ${i}`}
            />
          </button>
        ))}
      </div>
      <button className="variant-nav" onClick={scrollRight}>&gt;</button>
    </div>
  );
}
