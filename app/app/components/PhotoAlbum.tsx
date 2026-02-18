import { useState, useEffect, useRef } from "react";
import AlbumHeader from "./AlbumHeader";
import PhotoGrid from "./PhotoGrid";
import ParallaxView from "./ParallaxView";
import PhotoLightbox from "./PhotoLightbox";
import FloatingHearts from "./FloatingHearts";
import ViewToggle from "./ViewToggle";
import BirthdayBanner from "./BirthdayBanner";
import ConfettiAnimation from "./ConfettiAnimation";
import Loader from "./Loader";
import BackgroundMusic from "./BackgroundMusic";
import BirthdayCard from "./BirthdayCard";
import AutoScroll from "./AutoScroll";
import { usePhotoNavigation } from "~/hooks/usePhotoNavigation";
import { useAutoScroll } from "~/hooks/useAutoScroll";
import { motion, AnimatePresence } from "motion/react";
import { getPhotos, getMediaUrl } from "~/lib/services";
import type { Photo } from "~/types/photo";

export default function PhotoAlbum() {
  const [viewMode, setViewMode] = useState<"album" | "parallax">("parallax");
  const [isLoading, setIsLoading] = useState(true);
  const [showCard, setShowCard] = useState(true);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const musicRef = useRef<{ startMusic: () => void }>(null);
  const {
    selectedPhoto,
    currentIndex,
    openPhoto,
    closePhoto,
    nextPhoto,
    prevPhoto,
  } = usePhotoNavigation(photos);

  const { isPaused } = useAutoScroll({
    enabled: autoScrollEnabled && !showCard,
    speed: 0.8,
    inactivityDelay: 3000,
    isLightboxOpen: selectedPhoto !== null,
    isVideoPlaying: false,
  });

  useEffect(() => {
    // Fetch photos from API and wait minimum time for loader
    const fetchData = async () => {
      try {
        const data = await getPhotos();
        // Map API URLs to include auth token
        const mappedPhotos = data.map((p) => ({
          ...p,
          url: getMediaUrl(p.url),
        }));
        setPhotos(mappedPhotos);
      } catch (error) {
        console.error("Failed to fetch photos:", error);
      }
    };

    const loadTimer = new Promise((resolve) => setTimeout(resolve, 2500));

    Promise.all([fetchData(), loadTimer]).then(() => {
      setIsLoading(false);
    });
  }, []);

  const toggleView = () => {
    setViewMode((prev) => (prev === "album" ? "parallax" : "album"));
  };

  const handleCardClose = () => {
    setShowCard(false);
    // Start music after user interaction
    musicRef.current?.startMusic();
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-purple-50 to-blue-50 scroll-smooth">
      <AlbumHeader />

      <BirthdayBanner />

      <AnimatePresence mode="wait">
        {viewMode === "album" ? (
          <motion.div
            key="album"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
          >
            <PhotoGrid
              photos={photos}
              onPhotoClick={openPhoto}
              onVideoPlay={() => setIsVideoPlaying(true)}
              onVideoEnded={() => setIsVideoPlaying(false)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="parallax"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <ParallaxView
              photos={photos}
              onPhotoClick={openPhoto}
              onVideoPlay={() => setIsVideoPlaying(true)}
              onVideoEnded={() => setIsVideoPlaying(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {selectedPhoto && (
        <PhotoLightbox
          photo={selectedPhoto}
          currentIndex={currentIndex}
          totalPhotos={photos.length}
          onClose={closePhoto}
          onNext={nextPhoto}
          onPrev={prevPhoto}
        />
      )}

      <ViewToggle currentView={viewMode} onToggle={toggleView} />

      <AutoScroll
        enabled={autoScrollEnabled}
        onToggle={setAutoScrollEnabled}
        isPaused={isPaused}
      />

      <FloatingHearts />

      <ConfettiAnimation trigger={!showCard} />

      <BackgroundMusic ref={musicRef} />

      <BirthdayCard
        isOpen={showCard}
        onClose={handleCardClose}
        name="My Love"
      />
    </div>
  );
}
