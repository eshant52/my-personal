import { motion } from "motion/react";
import { Grid, ScrollText } from "lucide-react";

interface ViewToggleProps {
  currentView: "album" | "parallax";
  onToggle: () => void;
}

export default function ViewToggle({ currentView, onToggle }: ViewToggleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-8 right-8 z-100 will-change-transform"
      style={{ transform: "translateZ(0)" }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="group relative bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl rounded-full p-4 transition-all duration-300 border-2 border-pink-200 hover:border-pink-400"
        aria-label={`Switch to ${currentView === "album" ? "parallax" : "album"} view`}
      >
        <div className="relative w-8 h-8">
          <motion.div
            initial={false}
            animate={{
              opacity: currentView === "album" ? 1 : 0,
              scale: currentView === "album" ? 1 : 0,
              rotate: currentView === "album" ? 0 : 180,
            }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Grid className="w-8 h-8 text-pink-600" />
          </motion.div>
          <motion.div
            initial={false}
            animate={{
              opacity: currentView === "parallax" ? 1 : 0,
              scale: currentView === "parallax" ? 1 : 0,
              rotate: currentView === "parallax" ? 0 : -180,
            }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <ScrollText className="w-8 h-8 text-purple-600" />
          </motion.div>
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          {currentView === "album" ? "Parallax View" : "Album View"}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </div>
      </button>
    </motion.div>
  );
}
