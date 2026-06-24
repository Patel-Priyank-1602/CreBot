import { motion } from 'framer-motion';
import { Upload, FileType, Database, MessageSquare, CheckCircle, Globe } from 'lucide-react';

const steps = [
  { icon: Upload, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', label: 'Upload Files' },
  { icon: FileType, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', label: 'Process & Chunk' },
  { icon: Database, color: 'text-violet-500 bg-violet-500/10 border-violet-500/20', label: 'Store Vectors' },
  { icon: MessageSquare, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', label: 'Ask Questions' },
  { icon: CheckCircle, color: 'text-pink-500 bg-pink-500/10 border-pink-500/20', label: 'Get Grounded Answers' },
  { icon: Globe, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20', label: 'Embed Chatbot' },
];

export default function WorkflowSection() {
  return (
    <section id="docs" className="py-24 scroll-mt-[72px]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[var(--text-primary)] mb-4">
            How it works
          </h2>
          <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
            From raw documents to a deployed AI chatbot in minutes.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-3 relative ${step.color}`}>
                <step.icon size={22} className="relative z-10" />
              </div>
              <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">{step.label}</span>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute left-[60%] top-7 w-[calc(100%-24px)] h-px bg-[var(--border-soft)]" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
