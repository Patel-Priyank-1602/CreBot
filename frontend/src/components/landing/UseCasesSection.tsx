import { motion } from 'framer-motion';
import { Briefcase, Users, ShoppingCart, Code, ShieldCheck, Zap } from 'lucide-react';

const useCases = [
  {
    title: 'SAAS CUSTOMER SUPPORT',
    description: 'Instantly answer repetitive questions about pricing, features, and troubleshooting using your existing docs.',
    icon: <Zap size={24} className="text-[var(--btn-bg)]" />,
    num: '01',
    category: 'SUPPORT',
    image: '/use1.png',
    details: [
      'Reduce ticket volume by 40%',
      '24/7 instant resolution',
      'Seamless human handoff',
      'Multi-language support'
    ]
  },
  {
    title: 'INTERNAL KNOWLEDGE',
    description: 'Onboard new engineers or sales reps by letting them chat with your company wiki and internal documentation.',
    icon: <Users size={24} className="text-[var(--btn-bg)]" />,
    num: '02',
    category: 'OPERATIONS',
    image: '/use2.png',
    details: [
      'Slash onboarding time',
      'Single source of truth',
      'Department-specific bots',
      'Secure access controls'
    ]
  },
  {
    title: 'E-COMMERCE FAQS',
    description: 'Provide instant answers to shipping policies, return windows, and product specifications.',
    icon: <ShoppingCart size={24} className="text-[var(--btn-bg)]" />,
    num: '03',
    category: 'SALES',
    image: '/use3.png',
    details: [
      'Pre-sales objection handling',
      'Policy clarification',
      'Order tracking integration',
      'High-intent lead capture'
    ]
  },
  {
    title: 'API & DEV DOCS',
    description: 'Help developers integrate faster by letting them ask questions directly to your API references.',
    icon: <Code size={24} className="text-[var(--btn-bg)]" />,
    num: '04',
    category: 'DEVELOPER',
    image: '/use4.png',
    details: [
      'Code snippet generation',
      'Endpoint discovery',
      'Error code resolution',
      'SDK usage examples'
    ]
  }
];
import AnimatedDivider from '../common/AnimatedDivider';

export default function UseCasesSection() {
  return (
    <section id="use-cases" className="relative py-28 lg:py-36 bg-[#000000]">
      <AnimatedDivider />
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10">

        <div className="grid lg:grid-cols-12 gap-8 mb-20">
          <div className="lg:col-span-7">
            <div className="section-marker mb-6">
              <span>02 — Use Cases</span>
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-white"
            >
              ENDLESS <span className="text-[var(--btn-bg)]">POSSIBILITIES.</span><br />
              <span className="text-stroke">ONE SYSTEM.</span>
            </motion.h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 flex flex-col justify-end">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[var(--text-secondary)] text-lg leading-relaxed font-sans mb-6"
            >
              From technical API documentation to internal HR policies, CreBot adapts to any text-based knowledge base. Hover cards to reveal protocol specifics.
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {useCases.map((useCase, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="group perspective-1000 h-[280px] sm:h-[400px] md:h-[500px]"
            >
              <div className="relative w-full h-full transition-transform duration-[800ms] transform-style-3d group-hover:rotate-y-180">

                {/* Front */}
                <div className="absolute inset-0 backface-hidden bg-[var(--bg-card)] border border-[var(--border-default)] flex flex-col">
                  <div className="relative flex-1 overflow-hidden">
                    <img
                      src={useCase.image}
                      className="w-full h-full object-cover transition-all duration-700"
                      alt={useCase.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-[var(--bg-card)]/50 to-transparent opacity-90" />
                    <div className="absolute top-2 left-2 md:top-4 md:left-4 font-mono text-[8px] md:text-[10px] text-[var(--btn-bg)] tracking-[0.2em]">/ {useCase.num}</div>
                    <div className="absolute top-2 right-2 md:top-4 md:right-4 px-1.5 md:px-2 py-0.5 md:py-1 bg-black/60 backdrop-blur-sm font-mono text-[8px] md:text-[10px] text-white tracking-[0.15em]">{useCase.category}</div>
                  </div>
                  <div className="p-3 md:p-6 shrink-0 flex flex-col">
                    <div>
                      <h3 className="font-display text-lg md:text-3xl leading-none text-white">{useCase.title}</h3>
                    </div>
                    {/* <div className="flex items-center justify-center md:justify-between mt-3 md:mt-5 pt-2 md:pt-4 border-t border-[var(--border-soft)]">
                      <span className="hidden md:inline font-mono text-[10px] text-[var(--text-muted)] tracking-[0.15em] uppercase">Use Case Detail</span>
                      <span className="font-mono text-[8px] md:text-[10px] text-[var(--btn-bg)] tracking-[0.15em]">HOVER →</span>
                    </div> */}
                  </div>
                </div>

                {/* Back */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[var(--bg-elevated)] border border-[var(--border-default)] p-3 md:p-7 flex flex-col">
                  <div className="font-mono text-[8px] md:text-[10px] text-[var(--btn-bg)] tracking-[0.2em] uppercase mb-2 md:mb-4">/ {useCase.category}</div>
                  <h3 className="font-display text-sm md:text-2xl mb-2 md:mb-5 text-white">Capabilities</h3>
                  <ul className="space-y-1.5 md:space-y-3 text-[10px] md:text-sm text-[var(--text-secondary)] font-sans mb-2 md:mb-6">
                    {useCase.details.slice(0, 3).map((detail, i) => (
                      <li key={i} className="flex items-start gap-1.5 md:gap-3">
                        <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-[var(--btn-bg)] rounded-sm mt-1 md:mt-1.5 shrink-0" />
                        <span className="leading-tight">{detail}</span>
                      </li>
                    ))}
                    <li className="hidden md:flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-[var(--btn-bg)] rounded-sm mt-1.5 shrink-0" />
                      <span>{useCase.details[3]}</span>
                    </li>
                  </ul>
                  <div className="hidden md:block mt-auto pt-5 border-t border-[var(--border-soft)]">
                    <div className="font-mono text-[10px] text-[var(--text-muted)] tracking-[0.2em] uppercase mb-2">Description</div>
                    <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                      {useCase.description}
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
