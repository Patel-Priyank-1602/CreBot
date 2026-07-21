import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import AnimatedDivider from '../common/AnimatedDivider';

export default function VideoDemoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const hideControlsTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;
    if (total > 0) {
      setProgress((current / total) * 100);
      setCurrentTime(formatTime(current));
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(formatTime(videoRef.current.duration));
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const seekTo = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
    videoRef.current.currentTime = seekTo;
    setProgress(parseFloat(e.target.value));
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleSpeedChange = () => {
    if (!videoRef.current) return;
    const rates = [1, 1.25, 1.5, 2];
    const nextIndex = (rates.indexOf(playbackRate) + 1) % rates.length;
    const newRate = rates[nextIndex];
    videoRef.current.playbackRate = newRate;
    setPlaybackRate(newRate);
  };

  const handleRestart = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().catch(() => {});
    setIsPlaying(true);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current);
    hideControlsTimeout.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 2500);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current);
    };
  }, []);

  return (
    <section id="demo-video" className="relative py-24 lg:py-32 bg-[#000000] overflow-hidden">
      <AnimatedDivider />
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[350px] sm:h-[500px] bg-[var(--btn-bg)]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14 lg:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] text-white mb-6 uppercase"
          >
            EXPERIENCE <span className="text-[var(--btn-bg)]">CREBOT</span> IN ACTION
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[var(--text-secondary)] text-base sm:text-lg font-sans leading-relaxed"
          >
            Watch how CreBot ingests complex enterprise data, constructs RAG pipelines, and delivers lightning-fast, zero-hallucination AI responses.
          </motion.p>
        </div>

        {/* Video Player Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
            className="relative bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl overflow-hidden shadow-2xl group transition-all duration-500 hover:border-[var(--btn-bg)]/60"
          >
            {/* Cyber Corner Brackets */}
            <div className="absolute top-0 left-0 w-8 h-8 sm:w-12 sm:h-12 border-t-2 border-l-2 border-[var(--btn-bg)] z-30 transition-all duration-300 group-hover:w-16 group-hover:h-16" />
            <div className="absolute top-0 right-0 w-8 h-8 sm:w-12 sm:h-12 border-t-2 border-r-2 border-[var(--btn-bg)] z-30 transition-all duration-300 group-hover:w-16 group-hover:h-16" />
            <div className="absolute bottom-0 left-0 w-8 h-8 sm:w-12 sm:h-12 border-b-2 border-l-2 border-[var(--btn-bg)] z-30 transition-all duration-300 group-hover:w-16 group-hover:h-16" />
            <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-12 sm:h-12 border-b-2 border-r-2 border-[var(--btn-bg)] z-30 transition-all duration-300 group-hover:w-16 group-hover:h-16" />

            {/* Video Top Status Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#0a0a0a]/90 border-b border-[var(--border-soft)] backdrop-blur-md z-20 relative">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                </div>
                <span className="font-mono text-[10px] sm:text-xs text-[var(--text-muted)] tracking-widest uppercase hidden sm:inline-block border-l border-[var(--border-soft)] pl-3">
                  CREBOT_SYS // WALKTHROUGH.MP4
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-[10px]">
                  Generated by Gemini
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] sm:text-xs text-[var(--btn-bg)] flex items-center gap-2 font-medium tracking-wider">
                  <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--btn-bg)] opacity-75 ${isPlaying ? 'block' : 'hidden'}`} />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--btn-bg)]" />
                  </span>
                  {isPlaying ? 'STREAMING' : 'PAUSED'}
                </span>
              </div>
            </div>

            {/* Video Canvas Area */}
            <div className="relative aspect-video bg-black flex items-center justify-center cursor-pointer overflow-hidden" onClick={togglePlay}>
              <video
                ref={videoRef}
                src="/crebot.mp4"
                poster="/crebott.png"
                playsInline
                autoPlay
                muted={isMuted}
                loop
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                className="w-full h-full object-contain"
              />

              {/* Big Center Play Overlay Button when Paused */}
              {!isPlaying && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="absolute z-20 flex flex-col items-center gap-3"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay();
                    }}
                    aria-label="Play Video"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[var(--btn-bg)] text-black flex items-center justify-center shadow-[0_0_50px_rgba(234,88,12,0.6)] hover:scale-110 transition-transform duration-300 group/btn"
                  >
                    <Play size={36} className="fill-black ml-1 transition-transform group-hover/btn:scale-110" />
                  </button>
                  <span className="font-mono text-xs text-white tracking-[0.2em] uppercase bg-black/60 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
                    Click to Play Demo
                  </span>
                </motion.div>
              )}

              {/* Custom Video Controls Bar */}
              <div
                onClick={(e) => e.stopPropagation()}
                className={`absolute bottom-0 left-0 right-0 z-30 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-opacity duration-300 backdrop-blur-[2px] ${
                  showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* Timeline Progress Bar */}
                <div className="relative mb-3 flex items-center group/scrubber">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[var(--btn-bg)] hover:h-2.5 transition-all"
                  />
                </div>

                {/* Controls Bottom Row */}
                <div className="flex items-center justify-between text-white">
                  {/* Left Controls */}
                  <div className="flex items-center gap-3 sm:gap-5">
                    <button
                      onClick={togglePlay}
                      className="p-2 rounded-lg hover:bg-white/10 text-white hover:text-[var(--btn-bg)] transition-colors"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause size={20} /> : <Play size={20} className="fill-current" />}
                    </button>

                    <button
                      onClick={handleRestart}
                      className="p-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                      title="Restart Video"
                    >
                      <RotateCcw size={18} />
                    </button>

                    <button
                      onClick={toggleMute}
                      className="p-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX size={20} className="text-red-400" /> : <Volume2 size={20} />}
                    </button>

                    <div className="font-mono text-xs text-white/70 tracking-wider">
                      <span>{currentTime}</span> / <span className="text-white/40">{duration}</span>
                    </div>
                  </div>

                  {/* Right Controls */}
                  <div className="flex items-center gap-2 sm:gap-4">
                    <button
                      onClick={handleSpeedChange}
                      className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 font-mono text-xs text-white font-medium transition-colors"
                      title="Playback Speed"
                    >
                      {playbackRate}x
                    </button>

                    <button
                      onClick={toggleFullscreen}
                      className="p-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                      title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                    >
                      {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
