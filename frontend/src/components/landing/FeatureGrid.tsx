import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import AnimatedDivider from '../common/AnimatedDivider';
import { ArrowLeft, ArrowRight, Database, Search, Code2, ShieldCheck, Activity, Download } from 'lucide-react';

const features = [
  {
    num: '01',
    category: 'INGESTION',
    title: 'UPLOAD KNOWLEDGE',
    desc: 'Add PDFs, TXT, Markdown, DOCX, and structured files to power your chatbot. Advanced chunking and vectorization pipeline included.',
    image: '/fec1.png',
    icon: Database,
    meta: [
      { label: 'Supported', value: 'PDF, TXT, MD' },
      { label: 'Pipeline', value: 'AUTO-CHUNKING' }
    ]
  },
  {
    num: '02',
    category: 'RETRIEVAL',
    title: 'ASK WITH CONTEXT',
    desc: 'Get answers grounded in your uploaded knowledge base. No speculation. Every claim is traced back to a specific document.',
    image: '/fec2.png',
    icon: Search,
    meta: [
      { label: 'Latency', value: '< 200MS' },
      { label: 'Accuracy', value: 'GROUNDED' }
    ]
  },
  {
    num: '03',
    category: 'DEPLOYMENT',
    title: 'EMBED ANYWHERE',
    desc: 'Generate an embed snippet and place your chatbot on any website. Fully customizable UI to match your brand.',
    image: '/fec3.png',
    icon: Code2,
    meta: [
      { label: 'Integration', value: 'IFRAME / JS' },
      { label: 'Custom', value: 'FULL CSS' }
    ]
  },
  {
    num: '04',
    category: 'SECURITY',
    title: 'CLIENT ISOLATION',
    desc: 'Keep every user\'s documents and vectors separated securely. Enterprise-grade tenant isolation by default.',
    image: '/fec4.png',
    icon: ShieldCheck,
    meta: [
      { label: 'Standard', value: 'SOC2 TYPE II' },
      { label: 'Encryption', value: 'AES-256' }
    ]
  },
  {
    num: '05',
    category: 'ANALYTICS',
    title: 'CHAT LOGS',
    desc: 'Export conversations for review, support, and training. Identify knowledge gaps and improve your documentation.',
    image: '/fec5.png',
    icon: Activity,
    meta: [
      { label: 'Retention', value: 'INFINITE' },
      { label: 'Format', value: 'JSON / CSV' }
    ]
  },
  {
    num: '06',
    category: 'PORTABILITY',
    title: 'KNOWLEDGE EXPORT',
    desc: 'Download the complete knowledge base as a single file. You own your data. No vendor lock-in, ever.',
    image: '/fec6.png',
    icon: Download,
    meta: [
      { label: 'Lock-in', value: 'ZERO' },
      { label: 'Access', value: 'API / UI' }
    ]
  },
];

export default function FeatureGrid() {
  const [activeIdx, setActiveIdx] = useState(0);

  // Optional: Auto-advance (can be removed if user strictly wants manual control)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % features.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [activeIdx]);

  const handleNext = () => setActiveIdx((prev) => (prev + 1) % features.length);
  const handlePrev = () => setActiveIdx((prev) => (prev === 0 ? features.length - 1 : prev - 1));

  const activeFeature = features[activeIdx];
  const Icon = activeFeature.icon;

  return (
    <section id="features" className="relative py-20 lg:py-24 bg-[#030303] overflow-hidden">
      <AnimatedDivider />
      
      {/* Background Image with Fade Mask */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none z-0" 
        style={{
          backgroundImage: 'url("/bgd.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.25,
          filter: 'blur(2px)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)'
        }}
      />

      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--btn-bg)]/5 blur-[100px] rounded-full pointer-events-none z-0" />

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 relative z-10">

        {/* Title Area */}
        <div className="grid lg:grid-cols-12 gap-8 mb-24">
          <div className="lg:col-span-7">
            <div className="section-marker mb-6">
              <span>01 — Features</span>
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-white"
            >
              EVERYTHING YOU NEED.
              <span className="text-stroke">NOTHING YOU</span> <span className="text-[var(--btn-bg)]">DON'T.</span>
            </motion.h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 flex flex-col justify-end">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[var(--text-secondary)] text-lg leading-relaxed font-sans mb-6"
            >
              From file upload to deployment - manage your entire RAG pipeline from one beautifully engineered interface. No bloat. Just speed and precision.
            </motion.p>
            
          </div>
        </div>

        {/* The Card Stack Carousel Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[450px]">
          
          {/* Left Side: The Image Stack */}
          <div className="relative w-full h-[320px] sm:h-[400px] flex items-center justify-center perspective-1000">
            {features.map((feature, i) => {
              let relativeIndex = i - activeIdx;
              if (relativeIndex < 0) relativeIndex += features.length;

              const isVisible = relativeIndex < 3;
              if (!isVisible) return null;

              const isTop = relativeIndex === 0;
              const zIndex = 30 - relativeIndex;
              const scale = 1 - relativeIndex * 0.08; 
              const rotate = isTop ? 0 : relativeIndex === 1 ? -6 : 6;
              const translateX = isTop ? 0 : relativeIndex === 1 ? -20 : 20;
              const opacity = isTop ? 1 : relativeIndex === 1 ? 0.6 : 0.3;

              return (
                <motion.div
                  key={feature.num}
                  initial={false}
                  animate={{
                    scale,
                    rotate,
                    x: translateX,
                    y: relativeIndex * 15,
                    zIndex,
                    opacity,
                  }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  onClick={isTop ? handleNext : undefined}
                  className={`absolute w-[95%] max-w-[420px] aspect-[14/15] rounded-[24px] overflow-hidden shadow-2xl border ${isTop ? 'border-white/20 shadow-[0_0_40px_rgba(224,90,0,0.15)] cursor-pointer' : 'border-white/5'} bg-[#0a0a0a]`}
                >
                  <img
                    src={feature.image}
                    alt={feature.title}
                    width={420}
                    height={450}
                    loading="lazy"
                    className={`w-full h-full object-cover transition-all duration-700 ${isTop ? 'grayscale-[20%]' : 'grayscale-[80%] blur-[2px]'}`}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {isTop && (
                    <div className="absolute bottom-5 left-5 flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-black border border-white/20 flex items-center justify-center text-white backdrop-blur-md">
                        <feature.icon size={16} />
                      </div>
                      <div className="font-mono text-[10px] text-[var(--btn-bg)] tracking-[0.2em] bg-black/60 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                        {feature.num} / {feature.category}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Right Side: Content & Controls */}
          <div className="flex flex-col justify-center h-full pb-6">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="mb-8"
              >
                <div className="inline-flex items-center gap-2 mb-4">
                   <div className="w-1 h-1 bg-[var(--btn-bg)]" />
                   <span className="font-mono text-[9px] text-[var(--text-muted)] tracking-[0.2em] uppercase">
                     Capability Showcase
                   </span>
                </div>

                <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
                  {activeFeature.title}
                </h3>
                
                <p className="text-[var(--text-secondary)] text-base leading-relaxed font-sans max-w-lg">
                  {activeFeature.desc}
                </p>

                <div className="grid grid-cols-2 gap-6 mt-8 pt-8 border-t border-white/10">
                  {activeFeature.meta.map((m: any, i: number) => (
                    <div key={i}>
                      <div className="font-mono text-[10px] text-[var(--text-muted)] tracking-[0.2em] uppercase mb-1">{m.label}</div>
                      <div className="font-heading text-lg text-white tracking-widest">{m.value}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="flex items-center gap-3 mt-auto">
              <button 
                onClick={handlePrev}
                className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/30 transition-all hover:-translate-x-1"
                aria-label="Previous Feature"
              >
                <ArrowLeft size={16} />
              </button>
              
              <div className="flex items-center gap-2 px-3" role="tablist" aria-label="Feature slides">
                {features.map((f, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    aria-label={`Go to feature ${i + 1}: ${f.title}`}
                    aria-selected={i === activeIdx}
                    role="tab"
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${i === activeIdx ? 'w-6 bg-[var(--btn-bg)]' : 'w-1.5 bg-white/20 hover:bg-white/40'}`}
                  />
                ))}
              </div>

              <button 
                onClick={handleNext}
                className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-[var(--btn-bg)] hover:text-black hover:border-[var(--btn-bg)] transition-all hover:translate-x-1"
                aria-label="Next Feature"
              >
                <ArrowRight size={16} />
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
