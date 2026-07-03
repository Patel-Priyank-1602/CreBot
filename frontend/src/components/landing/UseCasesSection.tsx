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

export default function UseCasesSection() {
  return (
    <section id="use-cases" className="relative py-28 lg:py-36 border-t border-[var(--border-default)] bg-[#050505]">
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {useCases.map((useCase, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="group perspective-1000 h-[400px] sm:h-[500px]"
            >
              <div className="relative w-full h-full transition-transform duration-[800ms] transform-style-3d group-hover:rotate-y-180">

                {/* Front */}
                <div className="absolute inset-0 backface-hidden bg-[var(--bg-card)] border border-[var(--border-default)] flex flex-col">
                  <div className="relative h-3/5 overflow-hidden">
                    <img
                      src={useCase.image}
                      className="w-full h-full object-cover img-noir group-hover:grayscale-[70%] transition-all duration-700"
                      alt={useCase.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] to-transparent" />
                    <div className="absolute top-4 left-4 font-mono text-[10px] text-[var(--btn-bg)] tracking-[0.2em]">/ {useCase.num}</div>
                    <div className="absolute top-4 right-4 px-2 py-1 bg-black/60 backdrop-blur-sm font-mono text-[10px] text-white tracking-[0.15em]">{useCase.category}</div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-3xl leading-none text-white">{useCase.title}</h3>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border-soft)]">
                      <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-[0.15em] uppercase">Use Case Detail</span>
                      <span className="font-mono text-[10px] text-[var(--btn-bg)] tracking-[0.15em]">HOVER →</span>
                    </div>
                  </div>
                </div>

                {/* Back */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[var(--bg-elevated)] border border-[var(--border-default)] p-7 flex flex-col">
                  <div className="font-mono text-[10px] text-[var(--btn-bg)] tracking-[0.2em] uppercase mb-4">/ {useCase.category} — Profile</div>
                  <h3 className="font-display text-2xl mb-5 text-white">Capabilities</h3>
                  <ul className="space-y-3 text-sm text-[var(--text-secondary)] font-sans mb-6">
                    {useCase.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 bg-[var(--btn-bg)] rounded-sm mt-1.5 shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-5 border-t border-[var(--border-soft)]">
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
