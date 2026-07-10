import { useEffect, useRef } from 'react';
import AnimatedDivider from '../common/AnimatedDivider';
import { motion, useInView, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { Zap, Bot, Shield, Sparkles, Globe, Gift, Gauge, Cpu, Wifi } from 'lucide-react';

const features = [
  { icon: Zap, title: 'Lightning Fast', desc: 'Receive AI responses within seconds with optimized backend performance.' },
  { icon: Bot, title: 'Smart AI Conversations', desc: 'Generate accurate answers, code, explanations, and ideas powered by advanced AI models.' },
  { icon: Shield, title: 'Secure & Private', desc: 'Your conversations stay protected with secure API handling and privacy-focused architecture.' },
  { icon: Sparkles, title: 'Beautiful User Experience', desc: 'Enjoy a clean, responsive interface with smooth animations and distraction-free chatting.' },
  { icon: Globe, title: 'Works Everywhere', desc: 'Use CreBot seamlessly across desktop, tablet, and mobile devices.' },
  { icon: Gift, title: 'Free to Try', desc: 'Start chatting instantly without complicated setup or subscriptions.' },
];

const usageStats = [
  { icon: Gauge, label: 'Average Response', value: '< 2 seconds' },
  { icon: Cpu, label: 'AI Powered', value: '24/7 Available' },
  { icon: Wifi, label: 'Accessibility', value: 'Any Device' },
  { icon: Shield, label: 'Secure Sessions', value: 'Encrypted' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export default function WhyChooseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const floatingCardRef = useRef<HTMLDivElement>(null);

  const shouldReduceMotion = useReducedMotion();

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 25 });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || shouldReduceMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [shouldReduceMotion, mouseX, mouseY]);

  const isInViewHeading = useInView(headingRef, { once: true, margin: '-80px' });
  const isInViewCards = useInView(cardsContainerRef, { once: true, margin: '-80px' });

  return (
    <section
      ref={sectionRef}
      id="why-choose"
      className="relative pt-20 lg:pt-24 pb-28 lg:pb-36 bg-[#030303] overflow-hidden"
    >
      <AnimatedDivider />
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ParallaxBlob className="absolute top-20 -left-20 w-[400px] h-[400px] rounded-full opacity-30 bg-[radial-gradient(circle,rgba(224,90,0,0.06)_0%,transparent_70%)]" mouseX={smoothX} mouseY={smoothY} factor={0.08} />
        <ParallaxBlob className="absolute bottom-40 -right-20 w-[300px] h-[300px] rounded-full opacity-30 bg-[radial-gradient(circle,rgba(224,90,0,0.04)_0%,transparent_70%)]" mouseX={smoothX} mouseY={smoothY} factor={-0.05} />

        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: ['linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)', 'linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)'].join(', '), backgroundSize: '60px 60px' }} />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-[var(--btn-bg)]/4 blur-[100px]" />
        <div className="absolute bottom-1/3 left-1/4 w-56 h-56 rounded-full bg-[var(--btn-bg)]/2 blur-[80px]" />

        <div className="absolute inset-0">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i} className="absolute h-[2px] w-[2px] rounded-full bg-white/40"
              style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
              animate={shouldReduceMotion ? {} : { y: [0, (Math.random() - 0.5) * 50], x: [0, (Math.random() - 0.5) * 50], opacity: [0.15, 0.5, 0.15] }}
              transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 3 }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-10">
        <motion.div ref={headingRef} initial="hidden" animate={isInViewHeading ? 'visible' : 'hidden'} variants={containerVariants} className="mb-12 lg:mb-14">
          <motion.div variants={fadeUpVariants} className="section-marker mb-6">
            <span className="text-sm md:text-lg tracking-[0.1em]">03 — Why Choose</span>
          </motion.div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.9] text-white uppercase flex flex-wrap gap-x-5">
            <motion.span variants={itemVariants}>Why Choose</motion.span>
            <motion.span variants={itemVariants} className="text-[var(--btn-bg)]">CreBot?</motion.span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 mb-14 lg:mb-16">
          <div className="lg:col-span-7">
            <motion.div ref={cardsContainerRef} initial="hidden" animate={isInViewCards ? 'visible' : 'hidden'} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }} className="grid grid-cols-2 gap-3 md:gap-5">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <motion.article
                    key={feature.title}
                    variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } } }}
                    className="group relative rounded-xl bg-gradient-to-br from-[var(--border-default)] via-transparent to-[var(--border-default)] p-[1px] transition-all duration-500 hover:from-[var(--btn-bg)]/40 hover:via-[var(--btn-bg)]/5 hover:to-transparent hover:shadow-[0_0_30px_rgba(224,90,0,0.08)] overflow-hidden cursor-default"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  >
                    <div className="rounded-xl bg-[var(--bg-card)] p-4 md:p-6 h-full relative overflow-hidden flex flex-col justify-center">
                      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[var(--btn-bg)]/5 via-transparent to-transparent pointer-events-none" />
                      <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
                        <Icon size={24} className="text-[var(--btn-bg)] mb-2 md:mb-4 md:w-[26px] md:h-[26px]" />
                        <h3 className="font-heading text-xs md:text-base tracking-[0.1em] md:tracking-[0.15em] uppercase text-white mb-0 md:mb-2 group-hover:text-[var(--btn-bg)] transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="hidden md:block text-[var(--text-secondary)] text-base leading-relaxed font-sans">{feature.desc}</p>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          </div>

          <div className="lg:col-span-5 relative flex items-start justify-center mt-10 lg:mt-0 lg:pt-6">
            <div className="relative w-full">
              <div className="float-card-body">
                <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full border border-[var(--btn-bg)]/20 animate-pulse" />
                <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full border border-[var(--btn-bg)]/10" />
                <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full border border-[var(--btn-bg)]/15" />

                <div className="relative glass rounded-2xl p-6 md:p-8">
                  <h3 className="font-heading text-lg tracking-[0.2em] uppercase text-white mb-6">CreBot Usage</h3>
                  <div className="space-y-5">
                    {usageStats.map((stat) => {
                      const StatIcon = stat.icon;
                      return (
                        <div key={stat.label} className="flex items-center justify-between pb-5 border-b border-[var(--border-soft)] last:border-b-0 last:pb-0">
                          <div className="flex items-center gap-3">
                            <StatIcon size={20} className="text-[var(--btn-bg)]" />
                            <span className="font-mono text-xs md:text-sm text-[var(--text-muted)] uppercase tracking-[0.15em]">{stat.label}</span>
                          </div>
                          <span className="font-heading text-sm md:text-base text-white tracking-wide">{stat.value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ParallaxBlob({ className, mouseX, mouseY, factor }: { className: string; mouseX: any; mouseY: any; factor: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothBlobX = useSpring(x, { stiffness: 60, damping: 25 });
  const smoothBlobY = useSpring(y, { stiffness: 60, damping: 25 });

  useEffect(() => {
    const ux = mouseX.on('change', (v: number) => x.set((v - 0.5) * 2 * 40 * factor * 10));
    const uy = mouseY.on('change', (v: number) => y.set((v - 0.5) * 2 * 40 * factor * 10));
    return () => { ux(); uy(); };
  }, [mouseX, mouseY, factor]);

  return <motion.div className={className} style={{ x: smoothBlobX, y: smoothBlobY }} />;
}
