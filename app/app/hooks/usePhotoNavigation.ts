import { useState, useCallback } from "react";
import type { Photo } from "~/types/photo";

export function usePhotoNavigation(photos: Photo[]) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openPhoto = useCallback((photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
  }, []);

  const closePhoto = useCallback(() => {
    setSelectedPhoto(null);
  }, []);

  const nextPhoto = useCallback(() => {
    const nextIndex = (currentIndex + 1) % photos.length;
    setCurrentIndex(nextIndex);
    setSelectedPhoto(photos[nextIndex]);
  }, [currentIndex, photos]);

  const prevPhoto = useCallback(() => {
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    setCurrentIndex(prevIndex);
    setSelectedPhoto(photos[prevIndex]);
  }, [currentIndex, photos]);

  return {
    selectedPhoto,
    currentIndex,
    openPhoto,
    closePhoto,
    nextPhoto,
    prevPhoto,
  };
}
