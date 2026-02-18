import { useEffect, useState } from "react";

// Each petal gets a unique wind trajectory — all blow to the right
const makePetals = () =>
  Array.from({ length: 12 }, (_, i) => {
    const angle = (360 / 12) * i;
    const windX = 120 + Math.random() * 200; // rightward
    const windY = (Math.random() - 0.5) * 180; // spread up/down
    const spin = (Math.random() - 0.5) * 540;
    const delay = Math.random() * 0.35;
    const duration = 1.4 + Math.random() * 0.8;
    return { id: i, angle, windX, windY, spin, delay, duration };
  });

interface FlowerBurstProps {
  trigger: boolean;
  /** Screen-space origin of the burst (e.g. centre of the flower decoration) */
  position?: { x: number; y: number };
}

export default function FlowerBurst({ trigger, position }: FlowerBurstProps) {
  const [bursts, setBursts] = useState<
    { id: number; pos?: { x: number; y: number } }[]
  >([]);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    const id = counter;
    setCounter((c) => c + 1);
    setBursts((prev) => [...prev, { id, pos: position }]);
    const t = setTimeout(
      () => setBursts((prev) => prev.filter((b) => b.id !== id)),
      3000,
    );
    return () => clearTimeout(t);
  }, [trigger]); // eslint-disable-line react-hooks/exhaustive-deps

  if (bursts.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-60 overflow-hidden">
      {bursts.map(({ id, pos }) => (
        <FlowerBurstInstance key={id} position={pos} />
      ))}
    </div>
  );
}

function FlowerBurstInstance({
  position,
}: {
  position?: { x: number; y: number };
}) {
  const petals = makePetals();

  // Resolve origin: use passed screen coords, or fall back to left-side default
  const style: React.CSSProperties = position
    ? {
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -50%) rotate(-30deg)",
      }
    : {
        left: "8vw",
        top: "50%",
        transform: "translateY(-50%) rotate(-30deg)",
      };

  return (
    <div className="absolute" style={style}>
      {/* Flower stem — fades out after burst */}
      <div className="flower-stem" />

      {/* Petals blow away */}
      {petals.map((p) => (
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
