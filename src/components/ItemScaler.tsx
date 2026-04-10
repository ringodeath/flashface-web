import { useRef, useCallback, useState } from 'react';
import { useStore } from '../store/useStore';
import { DEFAULT_SCALE } from '../constants';

const PAD_SIZE = 150;
const SCALE_MIN = 0.2;
const SCALE_MAX = 3.0;
const SCALE_RANGE = SCALE_MAX - SCALE_MIN;

function scaleToPosition(scale: number): number {
  return ((scale - SCALE_MIN) / SCALE_RANGE) * PAD_SIZE;
}

function positionToScale(pos: number): number {
  const clamped = Math.max(0, Math.min(PAD_SIZE, pos));
  return SCALE_MIN + (clamped / PAD_SIZE) * SCALE_RANGE;
}

export default function ItemScaler() {
  const selectedFeatureCategory = useStore((s) => s.selectedFeatureCategory);
  const features = useStore((s) => s.features);
  const updateFeature = useStore((s) => s.updateFeature);
  const pushHistory = useStore((s) => s.pushHistory);

  const padRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const feature = selectedFeatureCategory
    ? features[selectedFeatureCategory]
    : undefined;
  const disabled = !feature;

  const currentScaleX = feature?.scaleX ?? DEFAULT_SCALE;
  const currentScaleY = feature?.scaleY ?? DEFAULT_SCALE;

  const updateScaleFromEvent = useCallback(
    (clientX: number, clientY: number) => {
      if (!padRef.current || !selectedFeatureCategory) return;
      const rect = padRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const scaleX = positionToScale(x);
      const scaleY = positionToScale(y);
      updateFeature(selectedFeatureCategory, { scaleX, scaleY });
    },
    [selectedFeatureCategory, updateFeature],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      setIsDragging(true);
      updateScaleFromEvent(e.clientX, e.clientY);

      const handleMouseMove = (moveEvent: MouseEvent) => {
        updateScaleFromEvent(moveEvent.clientX, moveEvent.clientY);
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        pushHistory();
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [disabled, updateScaleFromEvent, pushHistory],
  );

  const handleReset = useCallback(() => {
    if (!selectedFeatureCategory) return;
    updateFeature(selectedFeatureCategory, {
      scaleX: DEFAULT_SCALE,
      scaleY: DEFAULT_SCALE,
    });
    pushHistory();
  }, [selectedFeatureCategory, updateFeature, pushHistory]);

  const markerX = scaleToPosition(currentScaleX);
  const markerY = scaleToPosition(currentScaleY);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '8px' }}>
      <div
        ref={padRef}
        onMouseDown={handleMouseDown}
        style={{
          width: PAD_SIZE,
          height: PAD_SIZE,
          position: 'relative',
          borderStyle: 'inset',
          borderWidth: '2px',
          borderColor: '#808080',
          backgroundColor: disabled ? '#c0c0c0' : '#ffffff',
          cursor: disabled ? 'default' : (isDragging ? 'crosshair' : 'pointer'),
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {!disabled && (
          <div
            style={{
              position: 'absolute',
              left: markerX - 5,
              top: markerY - 5,
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#333',
              border: '1px solid #ffffff',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
      <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#eee' }}>
        X: {currentScaleX.toFixed(1)}&nbsp;&nbsp;Y: {currentScaleY.toFixed(1)}
      </div>
      <button disabled={disabled} onClick={handleReset}>
        Reset Scale
      </button>
    </div>
  );
}
