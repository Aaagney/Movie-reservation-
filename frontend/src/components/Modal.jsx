import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content-box">
        <h2 className="modal-title">{title}</h2>
        <div style={{ marginBottom: '1.5rem' }}>{children}</div>
        <button 
          type="button" 
          className="btn-secondary" 
          style={{ width: '100%', padding: '0.8rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', cursor: 'pointer' }}
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Modal;
