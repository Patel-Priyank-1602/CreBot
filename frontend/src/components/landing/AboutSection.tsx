import { motion } from 'framer-motion';

export default function AboutSection() {
  return (
    <section id="about" className="relative pt-20 lg:pt-24 pb-28 lg:pb-36 border-t border-[var(--border-default)] bg-[#030303] overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10">

        <div className="grid lg:grid-cols-12 gap-14 lg:gap-24 items-center">
          <div className="lg:col-span-5">
            <div className="section-marker mb-6">
              <span className="text-lg tracking-[0.2em]">08 — Architecture</span>
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
            className="lg:col-span-7 space-y-12"
          >
            <div>
              <h3 className="font-display text-4xl text-white mb-5">ENGINEERING PHILOSOPHY</h3>
              <p className="text-[var(--text-secondary)] text-base leading-relaxed font-sans max-w-2xl">
                We believe in shipping zero-speculation systems. By utilizing strict Retrieval-Augmented Generation (RAG) with high-speed LLM inference, CreBot ensures that every answer is traced directly back to the source text. No guessing. No making things up. Just raw, extracted facts.
              </p>
            </div>

            <div className="pt-10 border-t border-[var(--border-soft)]">
              <h3 className="font-display text-4xl text-white mb-5">OUR VISION</h3>
              <p className="text-[var(--text-secondary)] text-base leading-relaxed font-sans max-w-2xl">
                We aim to democratize enterprise intelligence. By transforming scattered documentation into a centralized, infinitely scalable knowledge engine, we empower organizations to move faster, eliminate data silos, and foster a culture of absolute clarity.
              </p>
            </div>

            <div className="pt-10 border-t border-[var(--border-soft)]">
              <h3 className="font-display text-4xl text-white mb-8">CORE TEAM</h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-5">
                  <div className="font-mono text-sm text-[var(--btn-bg)] tracking-[0.2em] mt-1 shrink-0 w-28">PRIYANK</div>
                  <div className="text-[var(--text-primary)] text-base font-heading tracking-wide uppercase">Full Stack Developer</div>
                </li>
                <li className="flex items-start gap-5">
                  <div className="font-mono text-sm text-[var(--btn-bg)] tracking-[0.2em] mt-1 shrink-0 w-28">MIRAL</div>
                  <div className="text-[var(--text-primary)] text-base font-heading tracking-wide uppercase">Web Developer & Designer</div>
                </li>
                <li className="flex items-start gap-5">
                  <div className="font-mono text-sm text-[var(--btn-bg)] tracking-[0.2em] mt-1 shrink-0 w-28">SUJAL</div>
                  <div className="text-[var(--text-primary)] text-base font-heading tracking-wide uppercase">Backend Developer</div>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
