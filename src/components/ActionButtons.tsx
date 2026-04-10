import { useRef } from 'react';
import { saveAs } from 'file-saver';
import { useStore } from '../store/useStore';

export default function ActionButtons() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    useStore.getState().saveToFile();
  };

  const handleLoad = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        useStore.getState().loadFromFile(reader.result);
      }
    };
    reader.readAsText(file);
    // Reset so the same file can be loaded again
    e.target.value = '';
  };

  const handlePrint = () => {
    const stage = useStore.getState().stageRef;
    if (!stage) {
      window.print();
      return;
    }

    const canvasEl = document.querySelector('.canvas-section canvas') as HTMLCanvasElement | null;
    const cssFilter = canvasEl?.dataset.activeFilter || '';
    const cssTransform = canvasEl?.dataset.activeTransform || '';

    if (!cssFilter && !cssTransform) {
      window.print();
      return;
    }

    // Create a filtered image for printing
    const dataUrl = stage.toDataURL();
    const img = new window.Image();
    img.src = dataUrl;
    img.onload = () => {
      const offscreen = document.createElement('canvas');
      offscreen.width = img.width;
      offscreen.height = img.height;
      const ctx = offscreen.getContext('2d')!;

      if (cssFilter) ctx.filter = cssFilter;
      if (cssTransform.includes('scaleX(-1)')) {
        ctx.translate(offscreen.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(img, 0, 0);

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        window.print();
        return;
      }
      printWindow.document.write(`
        <html><head><title>FlashFace Composite</title>
        <style>body{margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;}
        img{max-width:100%;max-height:100vh;}</style></head>
        <body><img src="${offscreen.toDataURL()}" /></body></html>
      `);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
    };
  };

  const handleExport = async () => {
    const stage = useStore.getState().stageRef;
    if (!stage) return;

    const dataUrl = stage.toDataURL();

    // Read active CSS filters from the canvas DOM element
    const canvasEl = document.querySelector('.canvas-section canvas') as HTMLCanvasElement | null;
    const cssFilter = canvasEl?.dataset.activeFilter || '';
    const cssTransform = canvasEl?.dataset.activeTransform || '';

    if (!cssFilter && !cssTransform) {
      // No filters active — export directly
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      saveAs(blob, 'flashface-composite.png');
      return;
    }

    // Draw onto offscreen canvas with filters applied
    const img = new window.Image();
    img.src = dataUrl;
    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
    });

    const offscreen = document.createElement('canvas');
    offscreen.width = img.width;
    offscreen.height = img.height;
    const ctx = offscreen.getContext('2d')!;

    if (cssFilter) {
      ctx.filter = cssFilter;
    }

    if (cssTransform.includes('scaleX(-1)')) {
      ctx.translate(offscreen.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(img, 0, 0);

    offscreen.toBlob((blob) => {
      if (blob) saveAs(blob, 'flashface-composite.png');
    }, 'image/png');
  };

  const handleClear = () => {
    useStore.getState().requestConfirm(() => useStore.getState().clearAll());
  };

  return (
    <fieldset className="panel-section">
      <legend>Actions</legend>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <button onClick={handleSave}>Save face</button>
        <button onClick={handleLoad}>Load face</button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <button onClick={handlePrint}>Print face</button>
        <button onClick={handleExport}>Export PNG</button>
        <button onClick={handleClear}>Clear all</button>
      </div>
    </fieldset>
  );
}
