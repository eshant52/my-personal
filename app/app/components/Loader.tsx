import { motion } from "motion/react";
import { Heart, Cake } from "lucide-react";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-100 bg-linear-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Hearts */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Heart className="w-16 h-16 text-pink-500 fill-current" />
          </motion.div>

          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Heart className="w-12 h-12 text-purple-400 fill-current opacity-60" />
          </motion.div>

          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-24 h-24 border-4 border-pink-300 rounded-full" />
          </motion.div>
        </div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Preparing Your Memories
          </h2>

          <div className="flex items-center justify-center gap-2 mb-6">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
              className="w-2 h-2 bg-pink-500 rounded-full"
            />
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              className="w-2 h-2 bg-purple-500 rounded-full"
            />
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              className="w-2 h-2 bg-blue-500 rounded-full"
            />
          </div>

          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            <Cake className="w-8 h-8 text-pink-400 fill-current" />
          </motion.div>
        </motion.div>

        {/* Floating hearts in background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: `${i * 12 + 5}%`,
                y: "100%",
              }}
              animate={{
                y: "-10%",
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.3,
              }}
              className="absolute"
            >
              <Heart
                className={`w-4 h-4 ${
                  i % 2 === 0 ? "text-pink-300" : "text-purple-300"
                } fill-current opacity-30`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
