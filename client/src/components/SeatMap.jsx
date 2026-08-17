import React from 'react';

export const SeatMap = ({ seats, selectedSeats, onToggleSeat }) => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

  const getSeatStatus = (code) => {
    if (selectedSeats.includes(code)) return 'selected';
    const s = seats.find(item => item.seat_code === code);
    return s ? s.status : 'available';
  };

  const getSeatBg = (status) => {
    switch (status) {
      case 'selected': return 'var(--accent-gold)';
      case 'reserved': return 'var(--seat-reserved)';
      case 'blocked': return 'var(--seat-blocked)';
      default: return 'var(--seat-available)';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* Curved Screen Header */}
      <div style={{ width: '80%', textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          height: '10px',
          borderTop: '3px solid var(--accent-gold)',
          borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
          boxShadow: '0 -10px 20px rgba(229, 169, 60, 0.3)'
        }} />
        <div style={{ fontSize: '0.75rem', letterSpacing: '4px', color: 'var(--text-muted)', marginTop: '8px' }}>
          SCREEN
        </div>
      </div>

      {/* Seats Matrix */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {rows.map(row => (
          <div key={row} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '20px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold' }}>
              {row}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {Array.from({ length: 10 }, (_, i) => i + 1).map(num => {
                const code = `${row}${num}`;
                const status = getSeatStatus(code);
                const isInteractable = status === 'available' || status === 'selected';

                return (
                  <button
                    key={code}
                    disabled={!isInteractable}
                    onClick={() => onToggleSeat(code)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      background: getSeatBg(status),
                      color: status === 'selected' ? '#000' : 'var(--text-white)',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      opacity: status === 'reserved' ? 0.4 : 1,
                      cursor: isInteractable ? 'pointer' : 'not-allowed',
                      border: status === 'selected' ? '1px solid var(--accent-gold)' : '1px solid transparent'
                    }}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Seat Legend */}
      <div style={{ display: 'flex', gap: '24px', marginTop: '36px', fontSize: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'var(--seat-available)' }} />
          <span style={{ color: 'var(--text-muted)' }}>Available</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'var(--accent-gold)' }} />
          <span>Selected</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'var(--seat-reserved)' }} />
          <span style={{ color: 'var(--text-muted)' }}>Reserved</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'var(--seat-blocked)' }} />
          <span style={{ color: 'var(--text-muted)' }}>Blocked</span>
        </div>
      </div>
    </div>
  );
};