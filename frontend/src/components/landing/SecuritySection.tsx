import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Key } from 'lucide-react';
import Card from '../common/Card';

const points = [
  { icon: Lock, title: 'Isolated Workspaces', desc: 'Every workspace keeps its documents, embeddings, chat history, and chatbot configuration isolated from other clients.' },
  { icon: Eye, title: 'Data Privacy', desc: 'Your data never leaves your workspace. No cross-client contamination.' },
  { icon: Key, title: 'Access Control', desc: 'Fine-grained permissions for workspace members and API keys.' },
];

export default function SecuritySection() {
  return (
    <section id="security" className="py-24 bg-[var(--bg-secondary)] scroll-mt-[72px]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-12 h-12 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)] mb-6">
              <Shield size={24} />
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[var(--text-primary)] mb-4">
              Designed for clean separation between knowledge bases
            </h2>
            <p className="text-lg text-[var(--text-muted)] mb-8">
              Every workspace keeps its documents, embeddings, chat history, and chatbot configuration isolated from other clients.
            </p>
            <div className="space-y-4">
              {points.map((point) => (
                <div key={point.title} className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-card)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)] shrink-0 mt-0.5">
                    <point.icon size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-1">{point.title}</h4>
                    <p className="text-sm text-[var(--text-muted)]">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card elevated className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-soft)]">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Shield size={16} className="text-[var(--text-primary)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">Workspace A</p>
                    <p className="text-xs text-[var(--text-muted)]">12 files • 2 chatbots</p>
                  </div>
                  <span className="ml-auto px-2 py-1 text-xs rounded-md bg-[var(--white-alpha-10)] text-[var(--text-primary)]">Isolated</span>
                </div>
                <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-soft)]">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Shield size={16} className="text-[var(--text-primary)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">Workspace B</p>
                    <p className="text-xs text-[var(--text-muted)]">8 files • 1 chatbot</p>
                  </div>
                  <span className="ml-auto px-2 py-1 text-xs rounded-md bg-[var(--white-alpha-10)] text-[var(--text-primary)]">Isolated</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Shield size={16} className="text-[var(--text-primary)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">Workspace C</p>
                    <p className="text-xs text-[var(--text-muted)]">24 files • 3 chatbots</p>
                  </div>
                  <span className="ml-auto px-2 py-1 text-xs rounded-md bg-[var(--white-alpha-10)] text-[var(--text-primary)]">Isolated</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
