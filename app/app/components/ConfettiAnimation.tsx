import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Heart, Star, Sparkles, Cake } from "lucide-react";

// Generate confetti pieces at module level for consistency
const colors = [
  "text-pink-500",
  "text-purple-500",
  "text-blue-500",
  "text-yellow-500",
  "text-red-500",
];

const confettiPieces = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  icon:
    i % 4 === 0
      ? "heart"
      : i % 4 === 1
        ? "star"
        : i % 4 === 2
          ? "sparkle"
          : "cake",
  x: Math.random() * 100,
  rotation: Math.random() * 720 - 360,
  delay: Math.random() * 0.5,
  duration: 2 + Math.random() * 1,
  size: 16 + Math.random() * 16,
  color: colors[Math.floor(Math.random() * colors.length)],
}));

interface ConfettiAnimationProps {
  trigger?: boolean;
}

export default function ConfettiAnimation({
  trigger = true,
}: ConfettiAnimationProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, [trigger]);

  const getIcon = (type: string, size: number, color: string) => {
    const className = `absolute w-${Math.floor(size / 4)} h-${Math.floor(size / 4)}`;

    switch (type) {
      case "heart":
        return <Heart className={`${className} ${color} fill-current`} />;
      case "star":
        return <Star className={`${className} ${color} fill-current`} />;
      case "sparkle":
        return <Sparkles className={`${className} ${color} fill-current`} />;
      case "cake":
        return <Cake className={`${className} ${color} fill-current`} />;
      default:
        return <Heart className={`${className} ${color} fill-current`} />;
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 pointer-events-none z-60 overflow-hidden will-change-transform"
          style={{ transform: "translateZ(0)" }}
        >
          {confettiPieces.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{
                x: `${piece.x}vw`,
                y: "-10vh",
                rotate: 0,
                opacity: 1,
                scale: 1,
              }}
              animate={{
                y: "110vh",
                rotate: piece.rotation,
                opacity: [1, 1, 0.8, 0],
                scale: [1, 1.2, 1, 0.8],
              }}
              transition={{
                duration: piece.duration,
                delay: piece.delay,
                ease: "easeIn",
              }}
              className="absolute"
              style={{
                left: 0,
                top: 0,
              }}
            >
              {getIcon(piece.icon, piece.size, piece.color)}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
