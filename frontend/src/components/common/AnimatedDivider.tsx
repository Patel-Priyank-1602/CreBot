import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function AnimatedDivider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Expands from center out and back in as you scroll past
  const scaleX = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <div ref={containerRef} className="absolute top-0 left-0 w-full h-[2px] z-20 pointer-events-none flex items-center justify-center">
      {/* Base dark line */}
      <div className="absolute w-full h-[1px] bg-[var(--border-default)]" />
      
      {/* Scroll reactive bright line */}
      <motion.div 
        style={{ scaleX, opacity }}
        className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--btn-bg)] to-transparent origin-center"
      />

      {/* Infinite scanning particles */}
      <motion.div
        initial={{ left: '-10%' }}
        animate={{ left: '110%' }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-[40px] h-[1px] bg-gradient-to-r from-transparent via-[var(--btn-bg)] to-transparent"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[var(--btn-bg)] rounded-full shadow-[0_0_15px_var(--btn-bg)]" />
      </motion.div>
      
      <motion.div
        initial={{ right: '-10%' }}
        animate={{ right: '110%' }}
        transition={{ duration: 7, repeat: Infinity, ease: 'linear', delay: 2 }}
        className="absolute w-[80px] h-[1px] bg-gradient-to-l from-transparent via-white to-transparent opacity-50"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]" />
      </motion.div>
    </div>
  );
}
