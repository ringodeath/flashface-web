import { useStore } from '../store/useStore';

export default function TitleBar() {
  const historyIndex = useStore((s) => s.historyIndex);
  const historyLength = useStore((s) => s.history.length);
  const undo = useStore((s) => s.undo);
  const redo = useStore((s) => s.redo);

  return (
    <div className="title-bar">
      <div className="title-bar-text">FlashFace Web v1.0</div>
      <div className="title-bar-controls">
        <button
          aria-label="Undo"
          disabled={historyIndex <= 0}
          onClick={undo}
        >
          &#x21A9;
        </button>
        <button
          aria-label="Redo"
          disabled={historyIndex >= historyLength - 1}
          onClick={redo}
        >
          &#x21AA;
        </button>
      </div>
    </div>
  );
}
