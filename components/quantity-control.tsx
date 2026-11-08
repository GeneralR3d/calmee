"use client";
export function QuantityControl({ value, onChange, label = 'quantity', minimum = 1 }: { value: number; onChange: (value: number) => void; label?: string; minimum?: number }) {
  return <div className="qty" role="group" aria-label={`Quantity: ${label}`}><button type="button" aria-label={`Decrease ${label}`} disabled={value <= minimum} onClick={() => onChange(Math.max(minimum, value - 1))}>−</button><span aria-live="polite">{value}</span><button type="button" aria-label={`Increase ${label}`} onClick={() => onChange(value + 1)}>+</button></div>;
}
