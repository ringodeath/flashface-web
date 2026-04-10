import { useState } from 'react';

export default function WelcomeDialog() {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="confirm-overlay">
      <div className="window confirm-dialog" style={{ minWidth: 340 }}>
        <div className="title-bar">
          <div className="title-bar-text">Welcome</div>
        </div>
        <div className="window-body" style={{ padding: 16, background: '#111', color: '#eee' }}>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 16, color: '#fff' }}>
              Welcome to FlashFace Web
            </h3>
            <p style={{ margin: '0 0 6px', fontSize: 12, lineHeight: 1.5 }}>
              A facial composite editor for creating suspect sketches.
            </p>
            <p style={{ margin: '0 0 6px', fontSize: 11, color: '#aaa', lineHeight: 1.5 }}>
              Made by <strong style={{ color: '#eee' }}>ringodeath</strong>
            </p>
            <p style={{ margin: 0, fontSize: 11, color: '#aaa', lineHeight: 1.5 }}>
              Inspired by <strong style={{ color: '#eee' }}>Ultimate Flash Face</strong> (2006)
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14 }}>
            <button onClick={() => setOpen(false)} style={{ minWidth: 80, padding: '4px 16px' }}>
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
