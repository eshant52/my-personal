import { motion, AnimatePresence } from "motion/react";
import { Heart, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Photo } from "~/types/photo";

interface PhotoLightboxProps {
  photo: Photo | null;
  currentIndex: number;
  totalPhotos: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function PhotoLightbox({
  photo,
  currentIndex,
  totalPhotos,
  onClose,
  onNext,
  onPrev,
}: PhotoLightboxProps) {
  if (!photo) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-2 sm:p-4"
        onClick={onClose}
      >
        {/* Close Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-6 sm:right-6 text-white/80 hover:text-white transition-colors z-10 bg-black/30 rounded-full p-2"
          aria-label="Close photo viewer"
        >
          <X className="w-6 h-6 sm:w-8 sm:h-8" />
        </motion.button>

        {/* Previous Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-2 sm:left-4 md:left-8 text-white/80 hover:text-white transition-colors z-10 bg-white/10 hover:bg-white/20 rounded-full p-2 sm:p-3 active:scale-95"
          aria-label="Previous photo"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        {/* Next Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-2 sm:right-4 md:right-8 text-white/80 hover:text-white transition-colors z-10 bg-white/10 hover:bg-white/20 rounded-full p-2 sm:p-3 active:scale-95"
          aria-label="Next photo"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        {/* Photo Container */}
        <motion.div
          key={photo.id}
          initial={{ scale: 0.8, opacity: 0, x: 100 }}
          animate={{ scale: 1, opacity: 1, x: 0 }}
          exit={{ scale: 0.8, opacity: 0, x: -100 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-5xl w-full"
        >
          <div className="relative">
            {photo.type === "video" ? (
              <video
                src={photo.url}
                controls
                autoPlay
                className="w-full h-auto max-h-[70vh] sm:max-h-[80vh] object-contain rounded-xl sm:rounded-2xl shadow-2xl"
              />
            ) : (
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-auto max-h-[70vh] sm:max-h-[80vh] object-contain rounded-xl sm:rounded-2xl shadow-2xl"
              />
            )}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent rounded-b-xl sm:rounded-b-2xl p-3 sm:p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-white text-base sm:text-xl font-medium mb-1 truncate">
                    {photo.caption}
                  </p>
                  {photo.date && (
                    <p className="text-white/70 text-xs sm:text-sm">
                      {photo.date}
                    </p>
                  )}
                </div>
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500 fill-current shrink-0" />
              </div>
            </motion.div>
          </div>

          {/* Photo Counter */}
          <div className="text-center mt-3 sm:mt-4">
            <p className="text-white/60 text-xs sm:text-sm">
              {currentIndex + 1} / {totalPhotos}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
