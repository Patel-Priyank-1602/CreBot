import { motion } from 'framer-motion';
import { Share2, Eye, Edit3 } from 'lucide-react';
import Card from '../common/Card';

const points = [
  { icon: Eye, title: 'View Access', desc: 'Grants access to view the bot, chat with it, and copy the embed code.' },
  { icon: Edit3, title: 'Edit Access', desc: 'Grants full access to the bot to scan knowledge bases, write configs, and edit everything.' },
];

export default function SecuritySection() {
  return (
    <section className="py-24 bg-[var(--bg-secondary)] scroll-mt-[72px]">
      <div className="w-full px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-14 h-14 rounded-2xl bg-[#000000] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)] mb-6 shadow-sm">
              <Share2 size={24} className="text-[#E05A00]" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-[var(--text-primary)] mb-6 tracking-tight text-balance">
              Collaborate and <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E05A00] to-orange-400">Share Bots.</span>
            </h2>
            <p className="text-lg text-[var(--text-muted)] mb-10 leading-relaxed max-w-lg">
              You can easily share your bots with your team. Control exactly who has access to view and embed, versus who can edit the core configurations.
            </p>
            <div className="space-y-8">
              {points.map((point) => (
                <div key={point.title} className="flex gap-5 group">
                  <div className="w-12 h-12 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)] shrink-0 group-hover:border-[#E05A00]/50 transition-colors">
                    <point.icon size={20} className={point.title === 'Edit Access' ? 'text-[#E05A00]' : 'text-emerald-500'} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[var(--text-primary)] mb-2">{point.title}</h4>
                    <p className="text-[var(--text-secondary)] leading-relaxed">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:ml-auto w-full max-w-lg"
          >
            <Card elevated className="p-8 relative overflow-hidden border border-[var(--border-soft)] rounded-[2rem] shadow-2xl bg-[#000000]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#E05A00]/5 blur-3xl rounded-full -z-10" />
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-4 pb-6 border-b border-[var(--border-soft)]">
                  <div className="w-12 h-12 rounded-full bg-[#E05A00]/10 flex items-center justify-center text-[#E05A00] font-bold text-lg border border-[#E05A00]/20">
                    JD
                  </div>
                  <div>
                    <p className="text-base font-bold text-white">John Doe (You)</p>
                    <p className="text-sm text-[var(--text-muted)]">john@example.com</p>
                  </div>
                  <span className="ml-auto px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg bg-[var(--white-alpha-10)] text-[var(--text-primary)] border border-[var(--border-soft)]">Owner</span>
                </div>
                <div className="flex items-center gap-4 pb-6 border-b border-[var(--border-soft)]">
                  <div className="w-12 h-12 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center text-white font-bold text-lg border border-[var(--border-soft)]">
                    AL
                  </div>
                  <div>
                    <p className="text-base font-bold text-white">Alex Lee</p>
                    <p className="text-sm text-[var(--text-muted)]">alex@example.com</p>
                  </div>
                  <span className="ml-auto px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg bg-[#E05A00]/10 text-[#E05A00] border border-[#E05A00]/20">Edit Access</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center text-white font-bold text-lg border border-[var(--border-soft)]">
                    MR
                  </div>
                  <div>
                    <p className="text-base font-bold text-white">Maria Rodriguez</p>
                    <p className="text-sm text-[var(--text-muted)]">maria@example.com</p>
                  </div>
                  <span className="ml-auto px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">View Access</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
