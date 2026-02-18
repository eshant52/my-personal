import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Pause, Play } from "lucide-react";

interface AutoScrollProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  isPaused: boolean;
}

export default function AutoScroll({
  enabled,
  onToggle,
  isPaused,
}: AutoScrollProps) {
  const [showNotification, setShowNotification] = useState(false);
  const hasShownNotification = useRef(false);

  useEffect(() => {
    if (isPaused && enabled && !hasShownNotification.current) {
      hasShownNotification.current = true;
      const showTimer = setTimeout(() => {
        setShowNotification(true);
      }, 0);
      const hideTimer = setTimeout(() => {
        setShowNotification(false);
      }, 2000);
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [isPaused, enabled]);

  return (
    <>
      {/* Control Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-24 right-8 z-100 will-change-transform"
        style={{ transform: "translateZ(0)" }}
      >
        <button
          onClick={() => onToggle(!enabled)}
          className="group bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl rounded-full p-3 transition-all duration-300 border-2 border-purple-200 hover:border-purple-400"
          aria-label={enabled ? "Disable auto-scroll" : "Enable auto-scroll"}
        >
          <motion.div
            animate={{ rotate: enabled ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            {enabled ? (
              <Pause className="w-5 h-5 text-purple-600" />
            ) : (
              <Play className="w-5 h-5 text-purple-600" />
            )}
          </motion.div>

          {/* Tooltip */}
          <div className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            {enabled ? "Pause" : "Play"} Auto-Scroll
            <div className="absolute bottom-full right-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900" />
          </div>
        </button>

        {/* Active indicator */}
        {enabled && !isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -top-1 -right-1"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* User Interaction Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -10 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed top-24 right-20 bg-linear-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-full shadow-lg z-50 will-change-transform"
            style={{ transform: "translateZ(0)" }}
          >
            <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-xl px-4 py-2.5 border-2 border-purple-200 relative">
              {/* Arrow pointing to button */}
              <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-l-8 border-transparent border-l-purple-200" />
              <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-0 h-0 border-t-[7px] border-b-[7px] border-l-[7px] border-transparent border-l-white" />

              <div className="flex items-center gap-2">
                <Pause className="w-4 h-4 text-purple-600 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-800 whitespace-nowrap">
                    Auto-scroll paused
                  </p>
                  <p className="text-[10px] text-gray-600">Click to turn off</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
