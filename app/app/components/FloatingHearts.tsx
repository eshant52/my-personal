import { motion } from "motion/react";
import { Heart } from "lucide-react";

interface HeartAnimation {
  id: number;
  initialX: number;
  animateX: number;
  duration: number;
  delay: number;
}

// Generate random values outside component to maintain React purity
const generateHeartAnimations = (): HeartAnimation[] => {
  const viewportWidth =
    typeof window !== "undefined" ? window.innerWidth : 1200;

  return Array.from({ length: 4 }, (_, i) => ({
    id: i,
    initialX: Math.random() * viewportWidth,
    animateX: Math.random() * viewportWidth,
    duration: 15 + Math.random() * 10,
    delay: i * 3,
  }));
};

// Generate once at module load time
const heartAnimations = generateHeartAnimations();

export default function FloatingHearts() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {heartAnimations.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{
            y: "100vh",
            x: heart.initialX,
            opacity: 0.5,
          }}
          animate={{
            y: "-10vh",
            x: heart.animateX,
          }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
            ease: "linear",
          }}
          className="absolute will-change-transform"
          style={{ transform: "translateZ(0)" }}
        >
          <Heart className="w-6 h-6 text-pink-300 fill-current opacity-20" />
        </motion.div>
      ))}
    </div>
  );
}
