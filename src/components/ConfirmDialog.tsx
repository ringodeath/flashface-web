import { useStore } from '../store/useStore';

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};

export default function ConfirmDialog() {
  const showConfirmDialog = useStore((s) => s.showConfirmDialog);
  const confirmDialogAction = useStore((s) => s.confirmDialogAction);
  const cancelConfirm = useStore((s) => s.cancelConfirm);

  if (!showConfirmDialog) return null;

  const onConfirm = () => {
    confirmDialogAction?.();
    cancelConfirm();
  };

  const onCancel = () => {
    cancelConfirm();
  };

  return (
    <div className="confirm-overlay" style={overlayStyle}>
      <div className="window confirm-dialog">
        <div className="title-bar">
          <div className="title-bar-text">Confirm</div>
        </div>
        <div className="window-body">
          <p>Are you sure you want to clear all features?</p>
          <div className="field-row" style={{ justifyContent: 'flex-end' }}>
            <button onClick={onConfirm}>OK</button>
            <button onClick={onCancel}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
