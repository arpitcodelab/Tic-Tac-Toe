import type { JSX } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps): JSX.Element | null {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(5, 7, 13, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: '16px',
      }}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-desc"
    >
      <div
        style={{
          background: 'linear-gradient(165deg, rgba(16, 22, 38, 0.95) 0%, rgba(8, 12, 24, 0.98) 100%)',
          border: '1px solid rgba(255, 0, 127, 0.4)',
          borderTop: '1px solid rgba(255, 255, 255, 0.4)',
          borderRadius: 'var(--radius-card)',
          padding: '24px',
          maxWidth: '380px',
          width: '100%',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.9), 0 0 32px rgba(255, 0, 127, 0.2)',
          textAlign: 'center',
        }}
      >
        <h3
          id="confirm-title"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '20px',
            fontWeight: 800,
            marginBottom: '10px',
            color: '#FFFFFF',
            letterSpacing: '0.04em',
            textShadow: '0 0 10px rgba(255, 0, 127, 0.6)',
          }}
        >
          {title}
        </h3>
        <p
          id="confirm-desc"
          style={{
            fontSize: '15px',
            color: 'var(--text-dim)',
            marginBottom: '24px',
            lineHeight: 1.45,
            fontWeight: 500,
          }}
        >
          {message}
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '13px',
              borderRadius: 'var(--radius-btn)',
              background: 'linear-gradient(145deg, rgba(16, 22, 38, 0.85) 0%, rgba(9, 13, 24, 0.95) 100%)',
              border: '1px solid rgba(0, 240, 255, 0.2)',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'var(--text)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '14px',
              letterSpacing: '0.06em',
              cursor: 'pointer',
            }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '13px',
              borderRadius: 'var(--radius-btn)',
              background: 'linear-gradient(135deg, rgba(255, 0, 127, 0.3) 0%, rgba(255, 59, 92, 0.4) 100%)',
              border: '1px solid #FF007F',
              borderTop: '1px solid rgba(255, 255, 255, 0.7)',
              boxShadow: '0 0 20px rgba(255, 0, 127, 0.5), 0 4px 14px rgba(0, 0, 0, 0.6)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '14px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
