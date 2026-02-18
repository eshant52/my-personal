import { motion, useScroll, useTransform } from "motion/react";
import { Heart, Cake } from "lucide-react";
import { useRef } from "react";
import type { Photo } from "~/types/photo";
import VideoPlayer from "./VideoPlayer";

interface ParallaxViewProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo, index: number) => void;
  onVideoPlay?: () => void;
  onVideoEnded?: () => void;
}

export default function ParallaxView({
  photos,
  onPhotoClick,
  onVideoPlay,
  onVideoEnded,
}: ParallaxViewProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 overflow-x-hidden">
      {photos.map((photo, index) => (
        <ParallaxPhoto
          key={photo.id}
          photo={photo}
          index={index}
          onClick={() => onPhotoClick(photo, index)}
          onVideoPlay={onVideoPlay}
          onVideoEnded={onVideoEnded}
        />
      ))}
    </div>
  );
}

interface ParallaxPhotoProps {
  photo: Photo;
  index: number;
  onClick: () => void;
  onVideoPlay?: () => void;
  onVideoEnded?: () => void;
}

function ParallaxPhoto({
  photo,
  index,
  onClick,
  onVideoPlay,
  onVideoEnded,
}: ParallaxPhotoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Different animations based on index for variety
  const isEven = index % 2 === 0;
  const isThird = index % 3 === 0;

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    isEven ? [-2, 0, 2] : [2, 0, -2],
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0, 1, 1, 0],
  );

  return (
    <motion.div
      ref={ref}
      style={{ y: isThird ? y : 0, opacity }}
      className={`mb-24 sm:mb-32 md:mb-40 ${
        isEven ? "sm:ml-12" : "sm:mr-12"
      }`}
    >
      <motion.div
        style={{ scale, rotate }}
        className="cursor-pointer group relative will-change-transform"
        onClick={onClick}
      >
        {/* Decorative elements */}
        {index === 0 && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: "spring" }}
            className="absolute -top-8 -right-8 z-10"
          >
            <Cake className="w-12 h-12 text-pink-500 fill-current drop-shadow-lg" />
          </motion.div>
        )}

        <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-white p-3 sm:p-4 md:p-6">
          {/* Photo */}
          <div className="aspect-4/3 overflow-hidden rounded-2xl relative">
            {photo.type === "video" ? (
              <VideoPlayer
                src={photo.url}
                className="w-full h-full object-cover"
                onPlay={onVideoPlay}
                onEnded={onVideoEnded}
                showPlayButton={true}
              />
            ) : (
              <motion.img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-full object-cover"
                loading="lazy"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4 }}
              />
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Caption */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 sm:mt-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
                  {photo.caption}
                </h3>
                {photo.date && (
                  <p className="text-sm text-gray-500">{photo.date}</p>
                )}
              </div>
              <Heart className="w-6 h-6 text-pink-500 fill-current shrink-0" />
            </div>
          </motion.div>

          {/* Decorative corner hearts */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Heart className="w-4 h-4 text-pink-400 fill-current" />
          </div>
        </div>

        {/* Number badge */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, type: "spring" }}
          className="absolute -bottom-4 -left-4 w-12 h-12 bg-linear-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
        >
          {index + 1}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
