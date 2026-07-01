import { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { Activity, Zap, ShieldCheck } from 'lucide-react';

const rateLimitItems = [
  'Prevent spam',
  'Keep AI responses fast',
  'Ensure fair access for every user',
  'Protect server resources',
];

function AnimatedCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, 10, {
      duration: 2.5,
      ease: 'easeOut',
      onUpdate(latest) { setCount(Math.floor(latest)); },
    });
    return () => controls.stop();
  }, [isInView]);

  return (
    <div ref={ref} className="flex flex-col items-center">
      <span className="counter-number font-display text-7xl lg:text-8xl text-white leading-none">{count}</span>
      <span className="font-heading text-lg tracking-[0.15em] text-[var(--text-muted)] uppercase mt-3">Requests</span>
      <span className="font-mono text-base tracking-[0.2em] text-[var(--btn-bg)] uppercase mt-1">Per Minute</span>
    </div>
  );
}

export default function UsagePolicySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const rateLimitRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={sectionRef}
      id="api-usage"
      className="relative pt-20 lg:pt-24 pb-28 lg:pb-36 border-t border-[var(--border-default)] bg-[var(--bg-main)] overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(224,90,0,0.05)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.015)_0%,transparent_70%)]" />
        <div className="absolute top-1/3 left-1/2 w-80 h-80 rounded-full bg-[var(--btn-bg)]/3 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-10">
        {/* ═══ Rate Limit Banner ═══ */}
        <motion.div
          ref={rateLimitRef}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-20 lg:mb-28"
        >
          <div className="glass rounded-3xl p-12 lg:p-16 overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle,rgba(224,90,0,0.06)_0%,transparent_70%)]" />

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="section-marker mb-12"
              >
                <span className="text-lg tracking-[0.2em]">07 — API Usage</span>
              </motion.div>

              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div>
                  <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-[var(--btn-bg)]/30 bg-[var(--btn-bg)]/5 mb-10">
                    <Activity size={18} className="text-[var(--btn-bg)]" />
                    <span className="font-mono text-base text-[var(--btn-bg)] uppercase tracking-[0.15em]">Rate Limits</span>
                  </div>

                  <h3 className="font-display text-6xl sm:text-7xl md:text-8xl text-white uppercase mb-6 leading-[1.1]">
                    Fair Usage Policy
                  </h3>

                  <p className="text-[var(--text-secondary)] text-xl md:text-2xl leading-relaxed font-sans mb-6">
                    To ensure fast responses and a smooth experience for everyone, CreBot currently allows up to{' '}
                    <strong className="text-white font-medium">10 requests per minute</strong> for each user.
                  </p>

                  <p className="text-[var(--text-secondary)] text-xl md:text-2xl leading-relaxed font-sans mb-10">
                    If you reach the limit, simply wait one minute before sending another request.
                  </p>

                  <div className="grid grid-cols-2 gap-5">
                    {rateLimitItems.map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <ShieldCheck size={16} className="text-[var(--btn-bg)] shrink-0" />
                        <span className="font-mono text-base text-[var(--text-secondary)] uppercase tracking-[0.12em]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-center py-8 lg:py-0">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(224,90,0,0.12)_0%,transparent_70%)] blur-3xl scale-150" />
                    <div className="relative w-56 h-56 lg:w-72 lg:h-72 rounded-full bg-gradient-to-br from-[var(--btn-bg)]/20 via-transparent to-[var(--btn-bg)]/10 p-[1px] shadow-[0_0_30px_rgba(224,90,0,0.1)]">
                      <div className="w-full h-full rounded-full bg-[var(--bg-card)]/80 backdrop-blur-sm flex flex-col items-center justify-center border border-[var(--border-soft)]/50">
                        <AnimatedCounter />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══ Bottom CTA ═══ */}
        <motion.div
          ref={ctaRef}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white uppercase mb-8 leading-[1.1]">
              Ready to Experience <span className="text-[var(--btn-bg)]">CreBot?</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-2xl md:text-3xl leading-relaxed font-sans mb-12">
              Join thousands of users using AI to learn faster, write better, and solve problems effortlessly.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              className="group relative inline-flex items-center gap-3 px-10 py-5 font-heading text-base tracking-[0.2em] uppercase text-white bg-[var(--btn-bg)] rounded-xl overflow-hidden hover:shadow-[0_0_40px_rgba(224,90,0,0.3)] transition-shadow duration-300"
            >
              <span className="relative z-10">Start Chatting</span>
              <span className="relative z-10 text-xl group-hover:translate-x-1 transition-transform duration-300">{'\u2192'}</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[var(--btn-hover)] via-[var(--btn-bg)] to-[var(--btn-hover)]"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
