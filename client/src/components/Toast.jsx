import React from 'react';
import { CheckCircle } from 'lucide-react';

export const Toast = ({ message }) => {
  if (!message) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      background: 'var(--bg-surface)',
      border: '1px solid var(--active-green)',
      color: 'var(--text-white)',
      padding: '14px 20px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
      zIndex: 1000,
      fontSize: '0.9rem'
    }}>
      <CheckCircle color="var(--active-green)" size={20} />
      <span>{message}</span>
    </div>
  );
};