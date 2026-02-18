import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion } from "motion/react";
import { getMusicUrl } from "~/lib/services";

export interface BackgroundMusicRef {
  startMusic: () => void;
}

const BackgroundMusic = forwardRef<BackgroundMusicRef>((_props, ref) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const musicUrl = useMemo(() => getMusicUrl(), []);

  useImperativeHandle(ref, () => ({
    startMusic: async () => {
      if (audioRef.current && !isPlaying) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          setIsMuted(false);
        } catch (error) {
          console.log("Play failed:", error);
        }
      }
    },
  }));

  useEffect(() => {
    // Set volume on mount
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
    }
  }, []);

  const toggleMute = async () => {
    if (audioRef.current) {
      // If not playing yet, start playing first
      if (!isPlaying) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          setIsMuted(false);
        } catch (error) {
          console.log("Play failed:", error);
        }
      } else {
        // Just toggle mute if already playing
        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
      }
    }
  };

  return (
    <>
      {/* Hidden audio element */}
      <audio ref={audioRef} loop preload="auto" playsInline src={musicUrl} />

      {/* Music control button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
        className="fixed bottom-8 left-8 z-100 will-change-transform"
        style={{ transform: "translateZ(0)" }}
      >
        <button
          onClick={toggleMute}
          className="group bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl rounded-full p-4 transition-all duration-300 border-2 border-purple-200 hover:border-purple-400"
          aria-label={isMuted ? "Unmute music" : "Mute music"}
        >
          <motion.div
            animate={{ scale: isPlaying ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.5, repeat: isPlaying ? Infinity : 0 }}
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6 text-purple-600" />
            ) : (
              <Volume2 className="w-6 h-6 text-purple-600" />
            )}
          </motion.div>

          {/* Tooltip */}
          <div className="absolute bottom-full left-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            {!isPlaying ? "Click to Play" : isMuted ? "Unmute" : "Mute"} Music
            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
          </div>
        </button>

        {/* Indicator dot */}
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -top-2 -right-2"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </motion.div>
        )}
        {isMuted && isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -top-2 -right-2"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
            </span>
          </motion.div>
        )}
      </motion.div>
    </>
  );
});

BackgroundMusic.displayName = "BackgroundMusic";

export default BackgroundMusic;
