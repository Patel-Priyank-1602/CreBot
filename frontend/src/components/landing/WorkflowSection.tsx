import { motion } from 'framer-motion';
import { Upload, FileType, Database, MessageSquare, CheckCircle, Globe } from 'lucide-react';

const steps = [
  { icon: Upload, label: 'Upload Files' },
  { icon: FileType, label: 'Process & Chunk' },
  { icon: Database, label: 'Store Vectors' },
  { icon: MessageSquare, label: 'Ask Questions' },
  { icon: CheckCircle, label: 'Get Grounded Answers' },
  { icon: Globe, label: 'Embed Chatbot' },
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
              <div className="w-14 h-14 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)] mb-3">
                <step.icon size={22} />
              </div>
              <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">{step.label}</span>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute left-[60%] top-7 w-[calc(100%-24px)] h-px bg-gradient-to-r from-[var(--border-default)] to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
