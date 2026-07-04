import { motion } from 'framer-motion';
import { KeyRound, ShieldCheck, TrendingUp, ArrowUpRight } from 'lucide-react';

export default function BYOKSection() {
  return (
    <section
      id="byok"
      className="relative py-28 lg:py-36 bg-[#050505] overflow-hidden border-t border-[var(--border-default)]"
    >
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-10 relative z-10 flex flex-col items-center">
        
        {/* Title Area - Exactly as requested */}
        <div className="grid lg:grid-cols-12 gap-8 mb-20 w-full">
          <div className="lg:col-span-7">
            <div className="section-marker mb-6">
              <span>05 — Custom Integration</span>
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-white"
            >
              BRING YOUR<br />
              <span className="text-stroke">OWN</span>{' '}
              <span className="text-[var(--btn-bg)]">API KEY.</span>
            </motion.h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 flex flex-col justify-end">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[var(--text-secondary)] text-lg leading-relaxed font-sans mb-6"
            >
              Break past default rate limits instantly. Bring a free API key from Groq to unleash massive throughput—at zero additional cost to your CreBot plan.
            </motion.p>
          </div>
        </div>

        {/* Premium Bento Box Layout */}
        <div className="w-full grid lg:grid-cols-3 gap-6 auto-rows-[300px]">
          
          {/* Main Large Card: Uncapped Throughput */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-10 overflow-hidden group hover:border-white/20 transition-colors duration-500 flex flex-col justify-between"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-[#1a0a00] opacity-50 pointer-events-none" />
            
            {/* Chart Visual */}
            <div className="absolute bottom-0 left-0 w-full h-[60%] pointer-events-none">
              <svg viewBox="0 0 1000 400" preserveAspectRatio="none" className="w-full h-full opacity-60 group-hover:opacity-100 transition-opacity duration-700">
                <path 
                  d="M0 350 L400 350 L500 50 L1000 0" 
                  fill="none" 
                  stroke="var(--btn-bg)" 
                  strokeWidth="4"
                  className="[stroke-dasharray:2000] [stroke-dashoffset:2000] animate-[dash_3s_ease-out_forwards]"
                />
                <path 
                  d="M0 350 L400 350 L500 50 L1000 0 L1000 400 L0 400 Z" 
                  fill="url(#gradient)" 
                  className="opacity-20"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="var(--btn-bg)" stopOpacity="1" />
                    <stop offset="100%" stopColor="var(--btn-bg)" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Labels for the chart */}
              <div className="absolute bottom-12 left-12 text-[var(--text-muted)] font-mono text-[10px] tracking-widest uppercase">
                Default: 10 RPM
              </div>
              <div className="absolute top-12 right-12 text-[var(--btn-bg)] font-mono text-[10px] tracking-widest uppercase flex items-center gap-2">
                <TrendingUp size={14} /> Uncapped Throughput
              </div>
            </div>

            <div className="relative z-10 max-w-sm">
              <h3 className="font-display text-3xl text-white mb-4">Scale Without Limits.</h3>
              <p className="text-[var(--text-secondary)] font-sans text-sm leading-relaxed">
                Don't get bottlenecked. By plugging in your own API key, you bypass our platform's default rate limits, giving your enterprise-grade bots the throughput they need.
              </p>
            </div>
          </motion.div>

          {/* Top Right Card: 100% Free via Groq */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 overflow-hidden group hover:border-white/20 transition-colors duration-500"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--btn-bg)]/10 blur-3xl rounded-full group-hover:bg-[var(--btn-bg)]/20 transition-colors" />
            
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform duration-500">
              <KeyRound size={20} />
            </div>

            <h3 className="font-heading text-xl text-white tracking-wide uppercase mb-3">100% Free via Groq</h3>
            <p className="text-[var(--text-secondary)] font-sans text-sm leading-relaxed">
              We leverage Groq's lightning-fast infrastructure. Generate your key on their console for free, paste it in, and you're done.
            </p>
            
            <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="absolute bottom-8 right-8 text-[var(--text-muted)] group-hover:text-[var(--btn-bg)] transition-colors flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest">
              Get Key <ArrowUpRight size={14} />
            </a>
          </motion.div>

          {/* Bottom Left Card: Zero-Knowledge */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 overflow-hidden group hover:border-white/20 transition-colors duration-500 flex flex-col justify-between"
          >
            <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-green-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-500">
              <ShieldCheck size={20} />
            </div>

            <div className="relative z-10">
              <h3 className="font-heading text-xl text-white tracking-wide uppercase mb-3">Zero-Knowledge</h3>
              <p className="text-[var(--text-secondary)] font-sans text-sm leading-relaxed">
                Your API key is AES-256 encrypted directly on your device before it ever touches our servers. We have zero access to your raw key.
              </p>
            </div>

            <div className="absolute top-8 right-8 px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-500 font-mono text-[10px] uppercase tracking-widest rounded flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Secure
            </div>
          </motion.div>

          {/* Bottom Right Card: Extra BYOK Info (LPU Direct Inference) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 lg:p-10 overflow-hidden group hover:border-white/20 transition-colors duration-500 flex flex-col md:flex-row gap-8 items-center"
          >
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[var(--btn-bg)]/10 to-transparent blur-3xl rounded-full pointer-events-none" />
            
            <div className="flex-1 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--btn-bg)]/10 border border-[var(--btn-bg)]/20 text-[var(--btn-bg)] font-mono text-[10px] uppercase tracking-widest rounded mb-6">
                Direct Inference
              </div>
              <h3 className="font-display text-3xl text-white mb-4">LPU Speed. Zero Queue.</h3>
              <p className="text-[var(--text-secondary)] font-sans text-sm leading-relaxed max-w-lg mb-6">
                When you bring your own key, you skip the CreBot centralized queue. Your retrieval queries route directly to Groq's Language Processing Units (LPUs), unlocking blistering <strong>800+ tokens-per-second</strong> generation speeds.
              </p>
              
              {/* Feature sub-points */}
              <div className="flex gap-6 mt-2 pt-6 border-t border-white/10">
                <div>
                  <p className="text-white font-mono text-xl">800+</p>
                  <p className="text-[var(--text-muted)] font-mono text-[10px] uppercase tracking-widest">Tokens / Sec</p>
                </div>
                <div>
                  <p className="text-white font-mono text-xl">&lt;10ms</p>
                  <p className="text-[var(--text-muted)] font-mono text-[10px] uppercase tracking-widest">Time to First Byte</p>
                </div>
              </div>
            </div>

            {/* Visual Abstract Speed Representation */}
            <div className="w-full md:w-64 h-full min-h-[160px] relative border border-white/5 bg-black rounded-xl overflow-hidden group-hover:border-[var(--btn-bg)]/30 transition-colors">
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
              {/* Animated data lines */}
              <div className="absolute inset-0 flex flex-col justify-center gap-3 px-4">
                <div className="w-full h-[2px] bg-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-1/3 bg-[var(--btn-bg)] animate-[slideRight_1s_ease-in-out_infinite]" />
                </div>
                <div className="w-4/5 h-[2px] bg-white/10 relative overflow-hidden ml-auto">
                  <div className="absolute top-0 left-0 h-full w-1/2 bg-[var(--btn-bg)] animate-[slideRight_1.5s_ease-in-out_infinite_0.2s]" />
                </div>
                <div className="w-full h-[2px] bg-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-1/4 bg-[var(--btn-bg)] animate-[slideRight_0.8s_ease-in-out_infinite_0.5s]" />
                </div>
              </div>
              <div className="absolute bottom-3 left-4 font-mono text-[10px] text-[var(--btn-bg)] uppercase tracking-widest">
                Data Stream Active
              </div>
            </div>
          </motion.div>

        </div>
      </div>
      
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes slideRight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </section>
  );
}
