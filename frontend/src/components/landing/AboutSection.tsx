import { motion } from 'framer-motion';

export default function AboutSection() {
  return (
    <section id="about" className="relative py-28 lg:py-36 border-t border-[var(--border-default)] bg-[#030303] overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
        
        {/* STATS STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 mb-24 pb-24 border-b border-[var(--border-soft)]">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="border-l border-[var(--border-soft)] pl-6">
            <div className="font-display text-5xl md:text-7xl text-white">0.0%</div>
            <div className="font-mono text-[11px] text-[var(--text-muted)] tracking-[0.2em] uppercase mt-2">Hallucination Rate</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="border-l border-[var(--border-soft)] pl-6">
            <div className="font-display text-5xl md:text-7xl text-[var(--btn-bg)]">100%</div>
            <div className="font-mono text-[11px] text-[var(--text-muted)] tracking-[0.2em] uppercase mt-2">Source Traceability</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="border-l border-[var(--border-soft)] pl-6">
            <div className="font-display text-5xl md:text-7xl text-white">124K</div>
            <div className="font-mono text-[11px] text-[var(--text-muted)] tracking-[0.2em] uppercase mt-2">Queries Handled</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="border-l border-[var(--border-soft)] pl-6">
            <div className="font-display text-5xl md:text-7xl text-white">24/7</div>
            <div className="font-mono text-[11px] text-[var(--text-muted)] tracking-[0.2em] uppercase mt-2">Uptime Protocol</div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-5">
            <div className="section-marker mb-6">
              <span>06 — Architecture</span>
            </div>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-white"
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
            className="lg:col-span-7 space-y-10"
          >
            <div>
              <h3 className="font-display text-3xl text-white mb-4">ENGINEERING PHILOSOPHY</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed font-sans max-w-2xl">
                We believe in shipping zero-speculation systems. By utilizing strict Retrieval-Augmented Generation (RAG) with high-speed LLM inference, CreBot ensures that every answer is traced directly back to the source text. No guessing. No making things up. Just raw, extracted facts.
              </p>
            </div>

            <div className="pt-8 border-t border-[var(--border-soft)]">
              <h3 className="font-display text-3xl text-white mb-4">OUR VISION</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed font-sans max-w-2xl">
                We aim to democratize enterprise intelligence. By transforming scattered documentation into a centralized, infinitely scalable knowledge engine, we empower organizations to move faster, eliminate data silos, and foster a culture of absolute clarity.
              </p>
            </div>
            
            <div className="pt-8 border-t border-[var(--border-soft)]">
              <h3 className="font-display text-3xl text-white mb-6">CORE TEAM</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="font-mono text-[11px] text-[var(--btn-bg)] tracking-[0.2em] mt-1 shrink-0 w-24">PRIYANK</div>
                  <div className="text-[var(--text-primary)] text-sm font-heading tracking-wide uppercase">Full Stack Developer</div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="font-mono text-[11px] text-[var(--btn-bg)] tracking-[0.2em] mt-1 shrink-0 w-24">MIRAL</div>
                  <div className="text-[var(--text-primary)] text-sm font-heading tracking-wide uppercase">Web Developer & Designer</div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="font-mono text-[11px] text-[var(--btn-bg)] tracking-[0.2em] mt-1 shrink-0 w-24">SUJAL</div>
                  <div className="text-[var(--text-primary)] text-sm font-heading tracking-wide uppercase">Backend Developer</div>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
