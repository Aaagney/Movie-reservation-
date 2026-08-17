import React from 'react';
import { FiX } from 'react-icons/fi';

export default function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="glass max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl2 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-xl text-cine-muted hover:text-white">
            <FiX />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
