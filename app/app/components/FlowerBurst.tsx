import { useEffect, useState } from "react";

// Each petal gets a unique wind trajectory — all blow to the right
const PETALS = Array.from({ length: 12 }, (_, i) => {
  const angle = (360 / 12) * i; // evenly spaced around flower
  const windX = 160 + Math.random() * 220;         // always rightward
  const windY = (Math.random() - 0.6) * 160;       // slight vertical spread
  const spin = (Math.random() - 0.5) * 540;
  const delay = Math.random() * 0.35;
  const duration = 1.4 + Math.random() * 0.8;
  return { id: i, angle, windX, windY, spin, delay, duration };
});

interface FlowerBurstProps {
  trigger: boolean;
}

export default function FlowerBurst({ trigger }: FlowerBurstProps) {
  const [bursts, setBursts] = useState<number[]>([]);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    const id = counter;
    setCounter((c) => c + 1);
    setBursts((prev) => [...prev, id]);
    const t = setTimeout(
      () => setBursts((prev) => prev.filter((b) => b !== id)),
      3000,
    );
    return () => clearTimeout(t);
  }, [trigger]); // eslint-disable-line react-hooks/exhaustive-deps

  if (bursts.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-60 overflow-hidden">
      {bursts.map((id) => (
        <FlowerBurstInstance key={id} />
      ))}
    </div>
  );
}

function FlowerBurstInstance() {
  return (
    // Left side of screen, vertically centered, tilted ~-30deg
    <div
      className="absolute"
      style={{
        left: "8vw",
        top: "50%",
        transform: "translateY(-50%) rotate(-30deg)",
      }}
    >
      {/* Flower stem — fades out after burst */}
      <div className="flower-stem" />

      {/* Petals blow away */}
      {PETALS.map((p) => (
        <div
          key={p.id}
          className="petal"
          style={
            {
              "--angle": `${p.angle}deg`,
              "--wind-x": `${p.windX}px`,
              "--wind-y": `${p.windY}px`,
              "--spin": `${p.spin}deg`,
              "--delay": `${p.delay}s`,
              "--dur": `${p.duration}s`,
            } as React.CSSProperties
          }
        />
      ))}

      {/* Center of flower */}
      <div className="flower-center" />
    </div>
  );
}
