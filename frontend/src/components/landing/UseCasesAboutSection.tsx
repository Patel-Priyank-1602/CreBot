import { motion } from 'framer-motion';
import { Briefcase, Users, ShoppingCart, Code, ShieldCheck, Zap } from 'lucide-react';

const useCases = [
  {
    title: 'SAAS CUSTOMER SUPPORT',
    icon: <Zap size={18} className="text-[var(--btn-bg)]" />,
    num: '01',
    category: 'SUPPORT',
    image: '/use1.png',
  },
  {
    title: 'INTERNAL KNOWLEDGE',
    icon: <Users size={18} className="text-[var(--btn-bg)]" />,
    num: '02',
    category: 'OPERATIONS',
    image: '/use2.png',
  },
  {
    title: 'E-COMMERCE FAQS',
    icon: <ShoppingCart size={18} className="text-[var(--btn-bg)]" />,
    num: '03',
    category: 'SALES',
    image: '/use3.png',
  },
  {
    title: 'API & DEV DOCS',
    icon: <Code size={18} className="text-[var(--btn-bg)]" />,
    num: '04',
    category: 'DEVELOPER',
    image: '/use4.png',
  },
];

const stats = [
  { value: '0.0%', label: 'Hallucination Rate', accent: false },
  { value: '100%', label: 'Source Traceability', accent: true },
  { value: '124K', label: 'Queries Handled', accent: false },
  { value: '24/7', label: 'Uptime Protocol', accent: false },
];

const team = [
  { name: 'PRIYANK', role: 'Full Stack Developer' },
  { name: 'MIRAL', role: 'Web Developer & Designer' },
  { name: 'SUJAL', role: 'Backend Developer' },
];

export default function UseCasesAboutSection() {
  return (
    <section id="use-cases-about" className="relative min-h-screen border-t border-[var(--border-default)] bg-[#050505] overflow-hidden flex items-center">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(224,90,0,0.04)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.01)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 lg:px-10 py-12 lg:py-16">
        <div className="section-marker mb-8 lg:mb-10">
          <span className="text-lg tracking-[0.2em]">04 — Use Cases / 05 — Architecture</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* ── LEFT: Use Cases ── */}
          <div className="lg:col-span-7 space-y-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[0.9] text-white"
            >
              ENDLESS <span className="text-[var(--btn-bg)]">POSSIBILITIES.</span><br />
              <span className="text-stroke">ONE SYSTEM.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed font-sans max-w-xl"
            >
              From technical API documentation to internal HR policies, CreBot adapts to any text-based knowledge base.
            </motion.p>

            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              {useCases.map((useCase, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.5 }}
                  className="group relative rounded-xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border-default)] hover:border-[var(--btn-bg)]/40 transition-all duration-300"
                >
                  <div className="relative h-28 sm:h-32 overflow-hidden">
                    <img src={useCase.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={useCase.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] to-transparent" />
                    <div className="absolute top-2 left-3 font-mono text-[9px] text-[var(--btn-bg)] tracking-[0.2em]">/ {useCase.num}</div>
                    <div className="absolute top-2 right-3 px-2 py-0.5 bg-black/60 backdrop-blur-sm font-mono text-[9px] text-white tracking-[0.15em]">{useCase.category}</div>
                  </div>
                  <div className="p-3 lg:p-4 flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">{useCase.icon}</div>
                    <h3 className="font-heading text-[11px] lg:text-xs tracking-[0.12em] uppercase text-white leading-snug">{useCase.title}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: About / Architecture ── */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-8">
            {/* Stats inline */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat, i) => (
                <div key={i} className="border-l border-[var(--border-soft)] pl-4">
                  <div className={`font-display text-2xl sm:text-3xl md:text-4xl ${stat.accent ? 'text-[var(--btn-bg)]' : 'text-white'}`}>{stat.value}</div>
                  <div className="font-mono text-[10px] text-[var(--text-muted)] tracking-[0.2em] uppercase mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-5 lg:space-y-6"
            >
              <div>
                <h3 className="font-display text-2xl sm:text-3xl text-white mb-3">ENGINEERED FOR TRUTH.</h3>
                <p className="text-[var(--text-secondary)] text-xs sm:text-sm leading-relaxed font-sans">
                  We believe in shipping zero-speculation systems. By utilizing strict RAG with high-speed LLM inference, CreBot ensures every answer is traced back to the source.
                </p>
              </div>

              <div className="pt-5 border-t border-[var(--border-soft)]">
                <h4 className="font-display text-lg text-white mb-3">OUR VISION</h4>
                <p className="text-[var(--text-secondary)] text-xs sm:text-sm leading-relaxed font-sans">
                  We aim to democratize enterprise intelligence by transforming scattered documentation into a centralized, infinitely scalable knowledge engine.
                </p>
              </div>

              <div className="pt-5 border-t border-[var(--border-soft)]">
                <h4 className="font-display text-lg text-white mb-4">CORE TEAM</h4>
                <ul className="space-y-3">
                  {team.map((member) => (
                    <li key={member.name} className="flex items-start gap-3">
                      <span className="font-mono text-[11px] text-[var(--btn-bg)] tracking-[0.2em] shrink-0 w-20 lg:w-24">{member.name}</span>
                      <span className="text-[var(--text-primary)] text-xs sm:text-sm font-heading tracking-wide uppercase">{member.role}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
