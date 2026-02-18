import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

interface VideoPlayerProps {
  src: string;
  className?: string;
  onPlay?: () => void;
  onEnded?: () => void;
  showPlayButton?: boolean;
}

export default function VideoPlayer({
  src,
  className = "",
  onPlay,
  onEnded,
  showPlayButton = true,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const hasAutoPlayed = useRef(false);
  const isScrollingToCenter = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    // Use rootMargin to create a detection zone near the center of the viewport.
    // Negative top/bottom margins shrink the intersection rect so it only triggers
    // when the element is roughly centered vertically.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            !hasAutoPlayed.current &&
            !isScrollingToCenter.current
          ) {
            hasAutoPlayed.current = true;
            isScrollingToCenter.current = true;

            // Scroll video to center of viewport
            container.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });

            // Wait for scroll to settle, then play
            const checkScrollSettled = () => {
              let lastY = window.scrollY;
              const checker = setInterval(() => {
                if (Math.abs(window.scrollY - lastY) < 1) {
                  clearInterval(checker);
                  isScrollingToCenter.current = false;
                  video.play().catch(() => {
                    // Autoplay blocked — user will click play
                  });
                }
                lastY = window.scrollY;
              }, 100);

              // Safety timeout — play after 1.5s max
              setTimeout(() => {
                clearInterval(checker);
                isScrollingToCenter.current = false;
                if (video.paused) {
                  video.play().catch(() => {});
                }
              }, 1500);
            };

            // Small delay to let scrollIntoView start
            setTimeout(checkScrollSettled, 100);
          } else if (!entry.isIntersecting && hasAutoPlayed.current) {
            // Video scrolled out of view — pause
            video.pause();
          }
        });
      },
      {
        // Shrink the observation zone to the middle ~30% of the viewport
        // so the video must be near-center before triggering
        rootMargin: "-35% 0px -35% 0px",
        threshold: 0,
      },
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setIsPlaying(true);
      onPlay?.();
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("pause", handlePause);
    };
  }, [onPlay, onEnded]);

  const handleManualPlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <video
        ref={videoRef}
        src={src}
        className={className}
        loop={false}
        muted={true}
        playsInline
        preload="metadata"
      />
      {showPlayButton && !isPlaying && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleManualPlay();
          }}
          className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 flex items-center justify-center">
            <Play className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600 ml-1" />
          </div>
        </div>
      )}
    </div>
  );
}
