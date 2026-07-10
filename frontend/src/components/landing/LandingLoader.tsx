import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

export default function LandingLoader({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Total duration set to 5 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      document.body.style.overflow = 'auto';
      clearTimeout(timer);
    };
  }, [onComplete]);

  // Reduced star count for performance (from 60 to 25)
  const stars = useMemo(() => Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 100,
    y: (Math.random() - 0.5) * 100,
    delay: Math.random() * 2,
    duration: Math.random() * 1.5 + 1,
    size: Math.random() * 3 + 1,
  })), []);

  return (
    <motion.div
      className="fixed inset-0 z-[99999] pointer-events-none bg-black"
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* 
        ====================================================
        EXIT DOORS
        ====================================================
      */}
      <motion.div
        className="absolute top-0 bottom-0 left-0 w-[50.5%] bg-[#000000] origin-left z-0 pointer-events-none"
        variants={{
          initial: { scaleX: 1 },
          exit: { scaleX: 0, transition: { duration: 1.5, ease: [0.76, 0, 0.24, 1], delay: 0.2 } }
        }}
      />
      <motion.div
        className="absolute top-0 bottom-0 right-0 w-[50.5%] bg-[#000000] origin-right z-0 pointer-events-none"
        variants={{
          initial: { scaleX: 1 },
          exit: { scaleX: 0, transition: { duration: 1.5, ease: [0.76, 0, 0.24, 1], delay: 0.2 } }
        }}
      />

      {/* 
        ====================================================
        MAIN HUD AND SCENE (IMPLODE THEN EXPLODE EXIT)
        ====================================================
      */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center overflow-hidden z-10 pointer-events-none"
        variants={{
          // Removed expensive blur filter during exit, kept scale and opacity
          exit: {
            scale: [1, 0.85, 4],
            opacity: [1, 1, 0],
            transition: { duration: 1.5, times: [0, 0.4, 1], ease: "easeInOut" }
          }
        }}
      >
        {/* Hexagonal Sci-Fi Grid Overlay */}
        <motion.div
          className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='103.92' viewBox='0 0 60 103.92' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 103.923L0 86.603V51.962L30 34.641L60 51.962V86.603L30 103.923ZM30 100.459L57 84.871V53.694L30 38.106L3 53.694V84.871L30 100.459ZM30 51.962L0 34.641V0L30 -17.32L60 0V34.641L30 51.962ZM30 48.498L57 32.91V1.732L30 -13.856L3 1.732V32.91L30 48.498Z' fill='%23ffffff' fill-opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: '120px',
            backgroundPosition: 'center',
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.03, 0.08, 0.03] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Extreme Vignette targeting the core */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.95)_60%,#000_100%)] z-10 pointer-events-none" />

        {/* High-Speed Warp Starfield (Reduced count for perf) */}
        <div className="absolute inset-0 flex items-center justify-center z-10 [perspective:800px] pointer-events-none">
          {stars.map((star) => (
            <motion.div
              key={star.id}
              className="absolute bg-white rounded-full"
              style={{
                width: star.size, height: star.size,
                left: `calc(50% + ${star.x}vw)`,
                top: `calc(50% + ${star.y}vh)`,
              }}
              initial={{ opacity: 0, z: -1000, scale: 0 }}
              animate={{ opacity: [0, 1, 0], z: 800, scale: [0, 3, 8] }}
              transition={{
                duration: star.duration,
                repeat: Infinity,
                delay: star.delay,
                ease: "easeIn"
              }}
            />
          ))}
        </div>

        {/* Deep Core Light Flares (Replaced blur with performant radial-gradient) */}
        <motion.div
          className="absolute w-[80vw] h-[20vw] max-w-[1000px] z-10 opacity-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, transparent 60%)' }}
          animate={{ opacity: [0, 1, 0], rotateZ: [0, 45, 90] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />

        {/* 
          ====================================================
          FUTURISTIC SVG DATA RINGS & HUD
          ====================================================
        */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          {/* Removed SVG drop-shadow filters for massive performance boost */}
          <svg className="absolute w-[800px] h-[800px] overflow-visible" viewBox="0 0 800 800">
            {/* Outer Data Track */}
            <motion.circle
              cx="400" cy="400" r="350"
              fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"
            />
            <motion.circle
              cx="400" cy="400" r="350"
              fill="none" stroke="url(#glowGradient)" strokeWidth="2"
              strokeDasharray="20 40 150 800"
              animate={{ strokeDashoffset: [1000, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            />

            {/* Middle Complex Track - Spinning backwards */}
            <motion.circle
              cx="400" cy="400" r="280"
              fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4"
              strokeDasharray="2 12"
              animate={{ rotate: -360, transformOrigin: '400px 400px' }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            />

            {/* Inner Precision Track */}
            <motion.circle
              cx="400" cy="400" r="200"
              fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1"
              strokeDasharray="60 120 200 150"
              animate={{ rotate: 360, transformOrigin: '400px 400px' }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />

            {/* High Energy Scanning Arc */}
            <motion.path
              d="M 400 120 A 280 280 0 0 1 680 400"
              fill="none" stroke="#ffffff" strokeWidth="2"
              animate={{ rotate: 360, transformOrigin: '400px 400px' }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />

            <defs>
              <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,1)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.2)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.8)" />
              </linearGradient>
            </defs>
          </svg>

          {/* HUD Targeting Brackets */}
          <motion.div
            className="absolute w-[320px] h-[320px]"
            initial={{ scale: 3, opacity: 0, rotate: 90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 3, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            {/* Removed heavy shadows for performance */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-white" />
            <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-white" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-white" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-white" />
          </motion.div>
        </div>

        {/* 
          ====================================================
          CENTRAL CORE (LOGO + AURA + IMPLOSION SHOCKWAVE)
          ====================================================
        */}
        <motion.div
          className="relative w-48 h-48 sm:w-64 sm:h-64 z-30 flex items-center justify-center pointer-events-none"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 3.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        >
          {/* Shockwave that triggers on exit */}
          <motion.div
            className="absolute inset-0 bg-white rounded-full z-0"
            variants={{
              initial: { scale: 0, opacity: 0 },
              exit: {
                scale: [0, 0, 30],
                opacity: [0, 1, 0],
                transition: { duration: 1.5, times: [0, 0.4, 1], ease: "easeOut" }
              }
            }}
          />

          {/* Fixed Logo with Performant Core Breathing */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full h-full relative flex items-center justify-center z-10"
          >
            {/* Massive Plasma Core Aura (Using radial gradients instead of blur & mix-blend for perf) */}
            <motion.div
              className="absolute inset-0 scale-[2]"
              style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 60%)' }}
              animate={{ scale: [1.8, 2.2, 1.8], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Intense Inner Core Ring (Using radial gradients) */}
            <motion.div
              className="absolute inset-0 scale-125"
              style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 60%)' }}
              animate={{ scale: [1.1, 1.3, 1.1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            />

            <img
              src="/Fav.png"
              alt="CreBot Logo"
              width={256}
              height={256}
              className="w-full h-full object-contain relative z-20"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
