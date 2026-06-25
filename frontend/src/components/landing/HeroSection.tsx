import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SignInButton } from '@clerk/clerk-react';
import { Bot, Send, User } from 'lucide-react';

const REEL_IMAGES = [
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80',
];

const AnimatedMockChat = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const runSequence = async () => {
      while (isMounted) {
        setStep(0); // Empty
        await new Promise(r => setTimeout(r, 1500));
        if (!isMounted) break;
        setStep(1); // User typing
        await new Promise(r => setTimeout(r, 1000));
        if (!isMounted) break;
        setStep(2); // User sent
        await new Promise(r => setTimeout(r, 600));
        if (!isMounted) break;
        setStep(3); // Bot processing
        await new Promise(r => setTimeout(r, 2000));
        if (!isMounted) break;
        setStep(4); // Bot replied
        await new Promise(r => setTimeout(r, 4000));
      }
    };
    runSequence();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="relative w-full max-w-lg mx-auto lg:ml-auto perspective-1000">
      <motion.div
        initial={{ opacity: 0, rotateY: 10, x: 20 }}
        animate={{ opacity: 1, rotateY: -5, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full bg-[var(--bg-card)] border border-[var(--border-default)] shadow-2xl relative overflow-hidden transform-style-3d"
      >
        {/* Chat Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border-soft)] bg-black/40 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-sm bg-[var(--bg-elevated)] border border-[var(--border-soft)] flex items-center justify-center">
            <Bot size={20} className="text-[var(--btn-bg)]" />
          </div>
          <div>
            <h3 className="font-heading text-sm uppercase tracking-widest text-white">CreBot</h3>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--btn-bg)] animate-pulse"></span> ONLINE
            </p>
          </div>
        </div>

        {/* Chat Body */}
        <div className="p-5 space-y-5 min-h-[320px] bg-[var(--bg-main)]/50 flex flex-col justify-end pb-6">
          <AnimatePresence>
            {step >= 2 && (
              <motion.div 
                key="user-msg"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} 
                className="flex justify-end"
              >
                <div className="bg-[var(--bg-elevated)] border border-[var(--border-soft)] text-[var(--text-primary)] px-4 py-3 max-w-[85%] font-sans text-sm leading-relaxed rounded-sm">
                  How does the RAG pipeline handle contradictory documents?
                </div>
                <div className="w-8 h-8 rounded-sm bg-white/5 border border-white/10 ml-3 flex items-center justify-center shrink-0">
                  <User size={14} className="text-white/60" />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="bot-typing"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} 
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-sm bg-[var(--border-soft)] flex items-center justify-center shrink-0">
                  <Bot size={14} className="text-white/50" />
                </div>
                <div className="flex items-center gap-1.5 px-4 py-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--btn-bg)] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--btn-bg)] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--btn-bg)] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="bot-msg"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-sm bg-[var(--btn-bg)] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,84,0,0.4)]">
                  <Bot size={14} className="text-black" />
                </div>
                <div className="bg-transparent border border-[var(--btn-bg)] text-white px-4 py-3 max-w-[85%] font-sans text-sm leading-relaxed rounded-sm">
                  The retrieval engine weights document metadata by recency and source authority.
                  <div className="mt-3 flex items-center gap-2 pt-2 border-t border-[var(--btn-bg)]/20">
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--btn-bg)] flex items-center gap-1.5">
                      <div className="w-1 h-1 bg-[var(--btn-bg)]" /> Source: architecture.md
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-[var(--border-soft)] bg-black/40 backdrop-blur-sm">
          <div className="flex items-center gap-2 bg-[var(--bg-main)] border border-[var(--border-soft)] p-2">
            <div className="flex-1 px-2 font-mono text-xs overflow-hidden h-4">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[var(--text-muted)]">
                    QUERY SYSTEM...
                  </motion.div>
                )}
                {step === 1 && (
                  <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-white">
                    How does the RAG pipeline handle<span className="animate-pulse">|</span>
                  </motion.div>
                )}
                {step >= 2 && (
                  <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[var(--text-muted)]">
                    QUERY SYSTEM...
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button className={`w-8 h-8 flex items-center justify-center transition-colors rounded-sm ${step === 1 ? 'bg-[var(--btn-bg)] text-black' : 'bg-[var(--border-soft)] text-white/30'}`}>
              <Send size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function HeroSection() {
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % REEL_IMAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="product" className="relative h-screen min-h-[600px] w-full overflow-hidden bg-black flex items-center">
      
      {/* Reel Frames */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={currentFrame}
            src={REEL_IMAGES[currentFrame]}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 6, ease: "linear" }}
            className="w-full h-full object-cover img-noir opacity-40"
            alt="Cinematic abstract"
          />
        </AnimatePresence>
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black via-black/80 to-black/20"></div>
      <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_25%_60%,rgba(224,90,0,0.1)_0%,transparent_50%)]"></div>
      <div className="scan-line z-20"></div>

      {/* Content */}
      <div className="relative z-30 w-full max-w-[1600px] mx-auto px-6 lg:px-10">
        
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column - Typography */}
          <div className="max-w-3xl">
            <div className="section-marker mb-4 md:mb-6">
              <span>LIVE</span>
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-[4.5rem] leading-[0.9] mb-6 text-white uppercase tracking-tight">
              <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.1 }}>
                Zero-Speculation
              </motion.div>
              <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-stroke">
                AI Chatbots.
              </motion.div>
              <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="text-[var(--btn-bg)]">
                Forged from data.
              </motion.div>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
              className="max-w-xl text-[var(--text-secondary)] text-sm md:text-base leading-relaxed font-sans mb-10"
            >
              A private AI infrastructure for teams who refuse hallucination. Upload your knowledge base. Deploy instantly. One unrelenting standard - <span className="text-white font-medium">absolute precision</span>.
            </motion.p>
            
            {/* CTA & Social Proof */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-8"
            >
              <SignInButton mode="modal">
                <button className="font-heading text-sm tracking-[0.2em] uppercase text-black bg-[var(--text-primary)] px-8 py-4 hover:bg-[var(--btn-bg)] hover:text-white transition-colors duration-300">
                  Deploy System
                </button>
              </SignInButton>
              
              <div className="flex items-center gap-4 border-l border-white/10 pl-8">
                <div className="flex -space-x-3">
                  <div className="w-8 h-8 rounded-full border-2 border-black bg-[var(--bg-elevated)] flex items-center justify-center z-30 font-mono text-[10px] text-white">JD</div>
                  <div className="w-8 h-8 rounded-full border-2 border-black bg-[var(--bg-elevated)] flex items-center justify-center z-20 font-mono text-[10px] text-white">SK</div>
                  <div className="w-8 h-8 rounded-full border-2 border-black bg-[var(--bg-elevated)] flex items-center justify-center z-10 font-mono text-[10px] text-white">AL</div>
                  <div className="w-8 h-8 rounded-full border-2 border-black bg-[var(--btn-bg)] flex items-center justify-center font-display text-xs text-black">1K+</div>
                </div>
                <div>
                  <div className="font-mono text-[9px] tracking-[0.2em] text-[var(--text-muted)] uppercase">Active Teams</div>
                  <div className="font-heading text-xs text-[var(--text-primary)] tracking-widest uppercase mt-1">Trusted globally</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Mock Chat */}
          <div className="hidden lg:block relative z-30">
            <AnimatedMockChat />
          </div>

        </div>
      </div>

      {/* Marquee Ticker - Positioned Absolute Bottom */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/5 bg-black/60 backdrop-blur-sm py-2.5 overflow-hidden z-40">
        <div className="marquee-track font-display text-xs md:text-sm tracking-[0.25em] text-[var(--text-secondary)]">
          <span className="px-8 text-white">NO SPECULATION</span><span className="text-[var(--btn-bg)]">/</span>
          <span className="px-8">ABSOLUTE PRECISION</span><span className="text-[var(--btn-bg)]">/</span>
          <span className="px-8 text-white">GROUNDED RESPONSES</span><span className="text-[var(--btn-bg)]">/</span>
          <span className="px-8">YOUR DATA ONLY</span><span className="text-[var(--btn-bg)]">/</span>
          <span className="px-8 text-white">CLIENT ISOLATION</span><span className="text-[var(--btn-bg)]">/</span>
          <span className="px-8">ZERO HALLUCINATIONS</span><span className="text-[var(--btn-bg)]">/</span>
          <span className="px-8 text-white">NO SPECULATION</span><span className="text-[var(--btn-bg)]">/</span>
          <span className="px-8">ABSOLUTE PRECISION</span><span className="text-[var(--btn-bg)]">/</span>
          <span className="px-8 text-white">GROUNDED RESPONSES</span><span className="text-[var(--btn-bg)]">/</span>
          <span className="px-8">YOUR DATA ONLY</span><span className="text-[var(--btn-bg)]">/</span>
        </div>
      </div>
    </section>
  );
}
