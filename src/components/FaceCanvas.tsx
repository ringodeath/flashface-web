import { useState, useEffect, useCallback } from 'react';
import { Stage, Layer, Rect, Image } from 'react-konva';
import Konva from 'konva';
import { useStore } from '../store/useStore';
import { LAYER_ORDER, CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants';
import type { CategoryName } from '../constants';
import { getFullImagePath } from '../utils/assetPaths';

function useLoadImage(url: string): HTMLImageElement | undefined {
  const [image, setImage] = useState<HTMLImageElement>();

  useEffect(() => {
    if (!url) {
      setImage(undefined);
      return;
    }
    let cancelled = false;
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (!cancelled) setImage(img);
    };
    img.onerror = () => {
      if (!cancelled) setImage(undefined);
    };
    img.src = url;
    return () => {
      cancelled = true;
    };
  }, [url]);

  return image;
}

function FeatureImage({ category }: { category: CategoryName }) {
  const variantIndex = useStore((s) => s.features[category]?.variantIndex);
  const x = useStore((s) => s.features[category]?.x);
  const y = useStore((s) => s.features[category]?.y);
  const scaleX = useStore((s) => s.features[category]?.scaleX);
  const scaleY = useStore((s) => s.features[category]?.scaleY);
  const opacity = useStore((s) => s.features[category]?.opacity);
  const isSelected = useStore((s) => s.selectedFeatureCategory === category);

  const imgUrl = variantIndex != null ? getFullImagePath(category, variantIndex) : '';
  const img = useLoadImage(imgUrl);

  if (variantIndex == null || !img) return null;

  return (
    <Image
      image={img}
      x={x!}
      y={y!}
      scaleX={scaleX!}
      scaleY={scaleY!}
      opacity={opacity!}
      offsetX={50}
      offsetY={50}
      listening={isSelected}
      draggable={isSelected}
      onDragEnd={(e: Konva.KonvaEventObject<DragEvent>) => {
        const node = e.target;
        useStore.getState().updateFeature(category, {
          x: node.x(),
          y: node.y(),
        });
        useStore.getState().pushHistory();
      }}
    />
  );
}

export default function FaceCanvas() {
  const handleStageRef = useCallback((node: Konva.Stage | null) => {
    useStore.getState().setStageRef(node);
  }, []);

  const handleDblClick = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const { features } = useStore.getState();
    // Check in reverse layer order (topmost visual layer first)
    for (let i = LAYER_ORDER.length - 1; i >= 0; i--) {
      const cat = LAYER_ORDER[i];
      const f = features[cat];
      if (!f) continue;
      const left = f.x - 50 * f.scaleX;
      const right = f.x + 50 * f.scaleX;
      const top = f.y - 50 * f.scaleY;
      const bottom = f.y + 50 * f.scaleY;
      if (pointer.x >= left && pointer.x <= right && pointer.y >= top && pointer.y <= bottom) {
        useStore.getState().selectFeature(cat);
        useStore.getState().setActiveCategory(cat);
        return;
      }
    }
  }, []);

  return (
    <Stage
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      ref={handleStageRef}
      onDblClick={handleDblClick}
    >
      <Layer>
        <Rect
          x={0}
          y={0}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          fill="white"
        />
        {LAYER_ORDER.map((category) => (
          <FeatureImage key={category} category={category} />
        ))}
      </Layer>
    </Stage>
  );
}
