const phrases = [
  "Protect, and enhance your natural glow daily.",
  "Thoughtfully crafted beauty essentials.",
  "Clean, science-backed formulas.",
  "Nourish naturally.",
];

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {phrases.map((phrase, i) => (
        <span
          key={i}
          className="flex items-center gap-8 whitespace-nowrap pr-8 font-heading text-sm font-semibold uppercase tracking-[0.18em] text-mocha-dark"
        >
          <span>{phrase}</span>
          <span className="text-gold">✦</span>
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <div className="overflow-hidden border-y border-mocha/15 bg-cream py-4">
      <div className="flex w-max animate-marquee">
        <Row />
        <Row />
      </div>
    </div>
  );
}
