import React from 'react';

export function TextField({ label, ...props }) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-xs uppercase tracking-wider text-cine-gold2">{label}</label>
      <input
        {...props}
        className="w-full rounded-xl2 border border-white/10 bg-cine-panel2 px-4 py-2.5 text-sm text-white focus:border-cine-gold/50 focus:outline-none"
      />
    </div>
  );
}

export function TextAreaField({ label, ...props }) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-xs uppercase tracking-wider text-cine-gold2">{label}</label>
      <textarea
        {...props}
        rows={3}
        className="w-full rounded-xl2 border border-white/10 bg-cine-panel2 px-4 py-2.5 text-sm text-white focus:border-cine-gold/50 focus:outline-none"
      />
    </div>
  );
}

export function SelectField({ label, children, ...props }) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-xs uppercase tracking-wider text-cine-gold2">{label}</label>
      <select
        {...props}
        className="w-full rounded-xl2 border border-white/10 bg-cine-panel2 px-4 py-2.5 text-sm text-white focus:border-cine-gold/50 focus:outline-none"
      >
        {children}
      </select>
    </div>
  );
}

export function CheckboxField({ label, ...props }) {
  return (
    <label className="mb-3 flex items-center gap-2 text-sm text-white">
      <input type="checkbox" {...props} className="h-4 w-4 rounded accent-cine-gold" />
      {label}
    </label>
  );
}
