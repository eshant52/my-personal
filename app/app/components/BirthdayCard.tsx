import { motion, AnimatePresence } from "motion/react";
import { Heart, Sparkles } from "lucide-react";
import { useMemo } from "react";
import { getBirthdayPhotoUrl } from "~/lib/services";

interface BirthdayCardProps {
  isOpen: boolean;
  onClose: () => void;
  name?: string;
}

const generateRandomPositions = () =>
  [...Array(5)].map(() => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
  }));

export default function BirthdayCard({
  isOpen,
  onClose,
  name = "Beautiful",
}: BirthdayCardProps) {
  const decorativeElements = useMemo(() => generateRandomPositions(), []);
  const birthdayPhotoUrl = useMemo(() => getBirthdayPhotoUrl(), []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.4,
              ease: "easeInOut",
            }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 350,
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-linear-to-br from-pink-50 via-purple-50 to-pink-50 rounded-3xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                {decorativeElements.map((position, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      y: [0, -8, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: i * 0.4,
                    }}
                    style={position}
                  >
                    {i % 2 === 0 ? (
                      <Heart className="w-4 h-4 text-pink-500" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-purple-500" />
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.2,
                    type: "spring",
                    damping: 20,
                    stiffness: 300,
                  }}
                  className="text-center mb-6"
                >
                  <h2 className="text-4xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    Happy Birthday! 🎉
                  </h2>
                  <div className="flex items-center justify-center gap-2 text-purple-600">
                    <Heart className="w-5 h-5 fill-current" />
                    <p className="text-xl font-semibold">Dear {name}</p>
                    <Heart className="w-5 h-5 fill-current" />
                  </div>
                </motion.div>

                {/* Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.3,
                    type: "spring",
                    damping: 20,
                    stiffness: 200,
                  }}
                  className="mb-6 relative"
                >
                  <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-purple-300 shadow-xl">
                    <img
                      src={birthdayPhotoUrl}
                      alt={name}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <Sparkles className="w-8 h-8 text-yellow-500 fill-current" />
                  </div>
                </motion.div>

                {/* Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.45,
                    type: "spring",
                    damping: 25,
                    stiffness: 300,
                  }}
                  className="text-center mb-8 space-y-3"
                >
                  <p className="text-gray-700 leading-relaxed">
                    On this special day, I want you to know how much you mean to
                    me. Every moment with you is a treasure, and I'm so grateful
                    to celebrate another year of your beautiful existence.
                  </p>
                  <p className="text-purple-600 font-semibold italic">
                    You make every day brighter! ✨
                  </p>
                </motion.div>

                {/* Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: 0.6,
                    type: "spring",
                    damping: 20,
                    stiffness: 300,
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow:
                      "0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="w-full bg-linear-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5 fill-current" />
                    Love You Always
                    <Heart className="w-5 h-5 fill-current" />
                  </span>
                </motion.button>

                {/* Footer note */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.75, duration: 0.5 }}
                  className="text-center text-sm text-gray-500 mt-4"
                >
                  Click to start your special celebration 🎵
                </motion.p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
