import { useEffect, useRef, useState, useCallback } from "react";

interface UseAutoScrollProps {
  enabled: boolean;
  speed?: number;
  inactivityDelay?: number;
  isLightboxOpen: boolean;
  isVideoPlaying?: boolean;
}

export function useAutoScroll({
  enabled,
  speed = 0.5,
  inactivityDelay = 3000,
  isVideoPlaying = false,
  isLightboxOpen,
}: UseAutoScrollProps) {
  const [isPaused, setIsPaused] = useState(false);
  const scrollIntervalRef = useRef<number | null>(null);
  const inactivityTimerRef = useRef<number | null>(null);
  const lastScrollTopRef = useRef(0);

  const startAutoScroll = useCallback(() => {
    if (scrollIntervalRef.current) return;

    scrollIntervalRef.current = window.setInterval(() => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;

      if (currentScroll >= maxScroll - 10) {
        // Reached bottom, stop scrolling
        if (scrollIntervalRef.current) {
          clearInterval(scrollIntervalRef.current);
          scrollIntervalRef.current = null;
        }
      } else {
        window.scrollBy({ top: speed, behavior: "auto" });
      }
    }, 16); // ~60fps
  }, [speed]);

  const stopAutoScroll = useCallback(() => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  }, []);

  const handleUserInteraction = useCallback(() => {
    if (!enabled || isLightboxOpen) return;

    const currentScrollTop = window.scrollY;

    // Check if user actually scrolled
    if (Math.abs(currentScrollTop - lastScrollTopRef.current) > 5) {
      setIsPaused(true);
      stopAutoScroll();

      // Clear existing timer
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }

      // Resume after inactivity
      inactivityTimerRef.current = window.setTimeout(() => {
        setIsPaused(false);
      }, inactivityDelay);
    }

    lastScrollTopRef.current = currentScrollTop;
  }, [enabled, isLightboxOpen, stopAutoScroll, inactivityDelay]);

  // Main effect for auto-scroll
  useEffect(() => {
    if (!enabled || isPaused || isLightboxOpen || isVideoPlaying) {
      stopAutoScroll();
      return;
    }

    // Start auto-scroll after a short delay
    const startDelay = setTimeout(() => {
      startAutoScroll();
    }, 1000);

    return () => {
      clearTimeout(startDelay);
      stopAutoScroll();
    };
  }, [
    enabled,
    isPaused,
    isLightboxOpen,
    isVideoPlaying,
    startAutoScroll,
    stopAutoScroll,
  ]);

  // Listen for user scroll
  useEffect(() => {
    window.addEventListener("scroll", handleUserInteraction, { passive: true });
    window.addEventListener("wheel", handleUserInteraction, { passive: true });
    window.addEventListener("touchmove", handleUserInteraction, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleUserInteraction);
      window.removeEventListener("wheel", handleUserInteraction);
      window.removeEventListener("touchmove", handleUserInteraction);

      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [handleUserInteraction]);

  return { isPaused };
}
