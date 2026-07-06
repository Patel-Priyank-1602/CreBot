import { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { Activity, Zap, ShieldCheck } from 'lucide-react';
import AnimatedDivider from '../common/AnimatedDivider';

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
      <span className="counter-number font-display text-5xl md:text-7xl lg:text-7xl text-white leading-none">{count}</span>
      <span className="font-heading text-xs md:text-lg tracking-[0.1em] md:tracking-[0.15em] text-[var(--text-muted)] uppercase mt-2 md:mt-3">Requests</span>
      <span className="font-mono text-[10px] md:text-base tracking-[0.15em] md:tracking-[0.2em] text-[var(--btn-bg)] uppercase mt-1">Per Minute</span>
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
      className="py-24 bg-[#030303] overflow-hidden relative"
    >
      <AnimatedDivider />
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
          className="relative mb-0"
        >
          <div className="glass rounded-3xl p-6 md:p-10 lg:p-12 overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle,rgba(224,90,0,0.06)_0%,transparent_70%)]" />

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="section-marker mb-8 md:mb-12"
              >
                <span className="text-xs md:text-lg tracking-[0.15em] md:tracking-[0.2em]">07 — API Usage</span>
              </motion.div>

              <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 md:gap-3 px-3 md:px-5 py-1.5 md:py-2.5 rounded-full border border-[var(--btn-bg)]/30 bg-[var(--btn-bg)]/5 mb-6 md:mb-10">
                    <Activity size={18} className="text-[var(--btn-bg)] w-4 h-4 md:w-[18px] md:h-[18px]" />
                    <span className="font-mono text-xs md:text-base text-[var(--btn-bg)] uppercase tracking-[0.1em] md:tracking-[0.15em]">Rate Limits</span>
                  </div>

                  <h3 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white uppercase mb-4 md:mb-6 leading-[1.1]">
                    Fair Usage Policy
                  </h3>

                  <p className="text-[var(--text-secondary)] text-base md:text-xl lg:text-xl leading-relaxed font-sans mb-4 md:mb-6">
                    To ensure fast responses and a smooth experience for everyone, CreBot currently allows up to{' '}
                    <strong className="text-white font-medium">10 requests per minute</strong> for each user.
                  </p>

                  <p className="text-[var(--text-secondary)] text-base md:text-xl lg:text-xl leading-relaxed font-sans mb-6 md:mb-10">
                    If you reach the limit, simply wait one minute before sending another request.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
                    {rateLimitItems.map((item) => (
                      <div key={item} className="flex items-center gap-2 md:gap-3">
                        <ShieldCheck size={16} className="text-[var(--btn-bg)] shrink-0 w-4 h-4" />
                        <span className="font-mono text-[10px] md:text-xs lg:text-base text-[var(--text-secondary)] uppercase tracking-[0.1em] md:tracking-[0.12em]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-center py-4 md:py-8 lg:py-0">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(224,90,0,0.12)_0%,transparent_70%)] blur-3xl scale-150" />
                    <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full bg-gradient-to-br from-[var(--btn-bg)]/20 via-transparent to-[var(--btn-bg)]/10 p-[1px] shadow-[0_0_30px_rgba(224,90,0,0.1)]">
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


      </div>
    </section>
  );
}
