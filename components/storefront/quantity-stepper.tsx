"use client";

import { Minus, Plus } from "lucide-react";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-mocha/30">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="flex h-10 w-10 items-center justify-center text-mocha transition hover:text-ink disabled:opacity-40"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-10 text-center text-sm font-medium tabular-nums">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="flex h-10 w-10 items-center justify-center text-mocha transition hover:text-ink disabled:opacity-40"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
