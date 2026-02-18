import { motion } from "motion/react";
import { Heart } from "lucide-react";
import type { Photo } from "~/types/photo";
import VideoPlayer from "./VideoPlayer";

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo, index: number) => void;
  onVideoPlay?: () => void;
  onVideoEnded?: () => void;
}

export default function PhotoGrid({
  photos,
  onPhotoClick,
  onVideoPlay,
  onVideoEnded,
}: PhotoGridProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 pb-16 pt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{
              once: true,
              margin: "-50px",
              amount: 0.3,
            }}
            transition={{
              duration: 0.6,
              delay: (index % 4) * 0.1,
              type: "spring",
              stiffness: 100,
              damping: 15,
            }}
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer group"
            onClick={() => onPhotoClick(photo, index)}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white p-3 transform transition-all duration-300 hover:shadow-2xl">
              <div className="aspect-square overflow-hidden rounded-xl relative">
                {photo.type === "video" ? (
                  <VideoPlayer
                    src={photo.url}
                    className="w-full h-full object-cover"
                    onPlay={onVideoPlay}
                    onEnded={onVideoEnded}
                    showPlayButton={true}
                  />
                ) : (
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                )}
              </div>
              <div className="mt-3 px-1">
                <p className="text-sm font-medium text-gray-800 line-clamp-1">
                  {photo.caption}
                </p>
                {photo.date && (
                  <p className="text-xs text-gray-500 mt-1">{photo.date}</p>
                )}
              </div>
              <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Heart className="w-6 h-6 text-pink-500 fill-current" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
