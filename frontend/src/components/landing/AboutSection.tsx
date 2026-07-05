import { motion } from 'framer-motion';
import AnimatedDivider from '../common/AnimatedDivider';

export default function AboutSection() {
  return (
    <section id="about" className="relative pt-20 lg:pt-24 pb-28 lg:pb-36 bg-[#030303] overflow-hidden">
      <AnimatedDivider />
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10">

        <div className="grid lg:grid-cols-12 gap-14 lg:gap-24 items-center">
          <div className="lg:col-span-5">
            <div className="section-marker mb-6">
              <span className="text-sm tracking-[0.2em]">09 — Architecture</span>
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl sm:text-6xl md:text-8xl lg:text-9xl leading-[0.9] text-white"
            >
              ENGINEERED<br />
              <span className="text-stroke">FOR</span><br />
              <span className="text-[var(--btn-bg)]">TRUTH.</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 flex flex-col gap-8"
          >
            {/* Philosophy & Vision Grid */}
            <div className="grid md:grid-cols-2 gap-6">

              <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 group hover:border-[var(--btn-bg)]/50 transition-colors duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--btn-bg)]/10 blur-3xl rounded-full group-hover:bg-[var(--btn-bg)]/20 transition-all duration-700" />
                <div className="font-mono text-[10px] text-[var(--btn-bg)] tracking-[0.2em] uppercase mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[var(--btn-bg)]" /> Philosophy
                </div>
                <h3 className="font-display text-3xl text-white mb-4">Zero Speculation.</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed font-sans">
                  By utilizing strict Retrieval-Augmented Generation with high-speed LLM inference, CreBot ensures every answer is traced directly back to the source text. No guessing. No making things up. Just raw, extracted facts.
                </p>
              </div>

              <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 group hover:border-white/30 transition-colors duration-500 relative overflow-hidden">
                <div className="font-mono text-[10px] text-[var(--text-muted)] tracking-[0.2em] uppercase mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white/20" /> Vision
                </div>
                <h3 className="font-display text-3xl text-white mb-4">Absolute Clarity.</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed font-sans">
                  We aim to democratize enterprise intelligence. By transforming scattered documentation into an infinitely scalable knowledge engine, we empower organizations to move faster and eliminate data silos.
                </p>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-white/5 group-hover:border-white/20 transition-colors" />
              </div>

            </div>

            {/* Core Team - High Tech ID Nodes */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 lg:p-10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 border-b border-white/10 pb-6 gap-4">
                <h3 className="font-display text-4xl text-white tracking-wide">CORE TEAM</h3>
                <div className="font-mono text-[10px] text-green-500 tracking-[0.2em] uppercase flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> System Architects
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-6 relative z-10">
                {['PRIYANK', 'MIRAL', 'SUJAL'].map((name, i) => (
                  <div key={name} className="relative p-6 border border-white/5 bg-black/50 hover:bg-black hover:border-[var(--btn-bg)]/30 transition-all duration-300 group/node">
                    {/* Decorative corner markers */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover/node:border-[var(--btn-bg)] transition-colors" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-hover/node:border-[var(--btn-bg)] transition-colors" />

                    <div className="font-mono text-[8px] text-[var(--text-muted)] tracking-widest uppercase mb-1">
                      ID // 00{i + 1}
                    </div>
                    <div className="font-heading text-xl text-white tracking-widest group-hover/node:text-[var(--btn-bg)] transition-colors duration-300">
                      {name}
                    </div>

                    {/* Animated scanning line on hover */}
                    <div className="absolute left-0 top-0 w-full h-[1px] bg-[var(--btn-bg)] opacity-0 group-hover/node:opacity-50 group-hover/node:animate-[slideDown_1.5s_ease-in-out_infinite]" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>


      <style>{`
        @keyframes slideDown {
          0% { top: 0; opacity: 0; }
          50% { opacity: 0.5; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </section>
  );
}
