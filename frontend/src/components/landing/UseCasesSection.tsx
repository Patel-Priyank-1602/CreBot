import { motion } from 'framer-motion';
import { Briefcase, Users, ShoppingCart, Code, ShieldCheck, Zap } from 'lucide-react';

const useCases = [
  {
    title: 'SaaS Customer Support',
    description: 'Instantly answer repetitive questions about pricing, features, and troubleshooting using your existing docs.',
    icon: <Zap size={24} className="text-[#E05A00]" />
  },
  {
    title: 'Internal Team Knowledge',
    description: 'Onboard new engineers or sales reps by letting them chat with your company wiki and internal documentation.',
    icon: <Users size={24} className="text-[#E05A00]" />
  },
  {
    title: 'E-Commerce FAQs',
    description: 'Provide instant answers to shipping policies, return windows, and product specifications.',
    icon: <ShoppingCart size={24} className="text-[#E05A00]" />
  },
  {
    title: 'API & Dev Tools Docs',
    description: 'Help developers integrate faster by letting them ask questions directly to your API references.',
    icon: <Code size={24} className="text-[#E05A00]" />
  },
  {
    title: 'Legal & Compliance',
    description: 'Search through massive compliance PDFs to find exact clauses and regulations instantly.',
    icon: <ShieldCheck size={24} className="text-[#E05A00]" />
  },
  {
    title: 'Agency Workflows',
    description: 'Manage multiple clients by creating isolated knowledge bases for each client account.',
    icon: <Briefcase size={24} className="text-[#E05A00]" />
  }
];

export default function UseCasesSection() {
  return (
    <section id="use-cases" className="py-24 bg-[#000000] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[500px] bg-gradient-to-tr from-[#E05A00]/5 to-transparent blur-[120px] -z-10" />

      <div className="w-full px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6 text-white">
            Endless <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E05A00] to-orange-400">Possibilities.</span>
          </h2>
          <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
            From technical API documentation to internal HR policies, CreBot adapts to any text-based knowledge base.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-[var(--bg-elevated)] border border-[var(--border-soft)] p-8 rounded-[2rem] hover:border-[#E05A00]/40 transition-colors group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E05A00]/0 group-hover:bg-[#E05A00]/10 blur-2xl rounded-full transition-all duration-500" />
              <div className="w-14 h-14 rounded-2xl bg-[#000000] border border-[var(--border-soft)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {useCase.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{useCase.title}</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">{useCase.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
