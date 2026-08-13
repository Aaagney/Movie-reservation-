import React from 'react';
import { CreditCard } from 'lucide-react';

export const CardPreview = ({ cardNumber, cardHolder, expiry }) => {
  const formattedNumber = cardNumber ? cardNumber.padEnd(16, '•').replace(/(.{4})/g, '$1 ').trim() : '•••• •••• •••• ••••';

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1A1C23 0%, #0D0D12 100%)',
      border: '1px solid var(--accent-gold)',
      borderRadius: '12px',
      padding: '24px',
      width: '100%',
      maxWidth: '380px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
      position: 'relative',
      margin: '0 auto 24px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <span className="serif-title" style={{ fontSize: '1rem', color: 'var(--accent-gold)' }}>CINÉVAULT PASS</span>
        <CreditCard color="var(--accent-gold)" size={28} />
      </div>

      <div style={{ fontSize: '1.2rem', letterSpacing: '2px', fontFamily: 'monospace', marginBottom: '24px' }}>
        {formattedNumber}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
        <div>
          <div style={{ fontSize: '0.65rem', marginBottom: '2px' }}>CARDHOLDER</div>
          <div style={{ color: '#fff', fontWeight: 'bold' }}>{cardHolder || 'YOUNAME'}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.65rem', marginBottom: '2px' }}>EXPIRES</div>
          <div style={{ color: '#fff', fontWeight: 'bold' }}>{expiry || 'MM/YY'}</div>
        </div>
      </div>
    </div>
  );
};