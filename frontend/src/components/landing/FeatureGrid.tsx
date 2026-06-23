import { motion } from 'framer-motion';
import { Upload, MessageSquare, Globe, Lock, FileText, Download } from 'lucide-react';
import Card from '../common/Card';

const features = [
  {
    icon: Upload,
    title: 'Upload Knowledge',
    desc: 'Add PDFs, TXT, Markdown, DOCX, and structured files to power your chatbot.',
  },
  {
    icon: MessageSquare,
    title: 'Ask With Context',
    desc: 'Get answers grounded in your uploaded knowledge base.',
  },
  {
    icon: Globe,
    title: 'Embed Anywhere',
    desc: 'Generate an embed snippet and place your chatbot on any website.',
  },
  {
    icon: Lock,
    title: 'Client Isolation',
    desc: 'Keep every user\'s documents and vectors separated securely.',
  },
  {
    icon: FileText,
    title: 'Chat Logs',
    desc: 'Export conversations for review, support, and training.',
  },
  {
    icon: Download,
    title: 'Knowledge Export',
    desc: 'Download the complete knowledge base as a single file.',
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="py-24 bg-[var(--bg-secondary)] scroll-mt-[72px]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[var(--text-primary)] mb-4">
            Everything needed to launch a knowledge-powered chatbot
          </h2>
          <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
            From file upload to deployment — manage your entire RAG pipeline from one place.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Card hover className="p-6 h-full">
                <div className="w-10 h-10 rounded-xl bg-[var(--bg-input)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)] mb-4">
                  <feature.icon size={20} />
                </div>
                <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">{feature.title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{feature.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
