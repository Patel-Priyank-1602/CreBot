import { motion } from 'framer-motion';
import { Share2, Eye, Edit3 } from 'lucide-react';
import AnimatedDivider from '../common/AnimatedDivider';

const points = [
  { icon: Eye, title: 'VIEW ACCESS', desc: 'Grants access to view the bot, chat with it, and copy the embed code. No configuration changes permitted.' },
  { icon: Edit3, title: 'EDIT ACCESS', desc: 'Grants full access to the bot to scan knowledge bases, write configs, and edit absolute parameters.' },
];

export default function SecuritySection() {
  return (
    <section
      className="relative py-28 lg:py-36 bg-[#000000] overflow-hidden" id="collaboration"
    >
      <AnimatedDivider />
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-10">

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="section-marker mb-6">
              <span>04 — Security</span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-white mb-8">
              SHARE BOTS.<br />
              <span className="text-stroke">CONTROL</span><br />
              <span className="text-[var(--btn-bg)]">ACCESS.</span>
            </h2>

            <div className="space-y-10 pt-8 border-t border-[var(--border-soft)]">
              {points.map((point) => (
                <div key={point.title} className="flex gap-6 group">
                  <div className="w-12 h-12 border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)] shrink-0 group-hover:border-[var(--btn-bg)] group-hover:bg-[var(--btn-bg)] group-hover:text-black transition-colors">
                    <point.icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-heading tracking-widest text-xl text-white uppercase mb-2 group-hover:text-[var(--btn-bg)] transition-colors">{point.title}</h4>
                    <p className="text-[var(--text-secondary)] text-sm font-sans leading-relaxed">{point.desc}</p>
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
            <div className="notch-corner border border-[var(--border-default)] bg-[var(--bg-card)] p-10 relative group">
              <div className="font-mono text-[10px] text-[var(--btn-bg)] tracking-[0.2em] uppercase mb-8 pb-4 border-b border-[var(--border-soft)]">
                / Access Control Roster
              </div>

              <div className="space-y-6 relative z-10">
                {/* User 1 */}
                <div className="flex items-center gap-4 pb-6 border-b border-[var(--border-soft)]">
                  <div className="w-12 h-12 flex items-center justify-center text-[var(--btn-bg)] font-mono text-sm border border-[var(--btn-bg)] bg-[var(--btn-bg)]/10">
                    JD
                  </div>
                  <div>
                    <p className="font-heading text-lg text-white uppercase tracking-wide">John Doe (You)</p>
                    <p className="font-mono text-[10px] text-[var(--text-muted)] tracking-widest uppercase">john@example.com</p>
                  </div>
                  <span className="ml-auto px-3 sm:px-4 py-2 font-mono text-[10px] tracking-widest text-white border border-white/20 shrink-0">OWNER</span>
                </div>

                {/* User 2 */}
                <div className="flex items-center gap-4 pb-6 border-b border-[var(--border-soft)]">
                  <div className="w-12 h-12 flex items-center justify-center text-[var(--text-primary)] font-mono text-sm border border-[var(--border-soft)] bg-[var(--bg-elevated)]">
                    AL
                  </div>
                  <div>
                    <p className="font-heading text-lg text-[var(--text-primary)] uppercase tracking-wide">Alex Lee</p>
                    <p className="font-mono text-[10px] text-[var(--text-muted)] tracking-widest uppercase">alex@example.com</p>
                  </div>
                  <span className="ml-auto px-3 sm:px-4 py-2 font-mono text-[10px] tracking-widest text-[var(--btn-bg)] border border-[var(--btn-bg)] shrink-0">EDIT</span>
                </div>

                {/* User 3 */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center text-[var(--text-primary)] font-mono text-sm border border-[var(--border-soft)] bg-[var(--bg-elevated)]">
                    MR
                  </div>
                  <div>
                    <p className="font-heading text-lg text-[var(--text-primary)] uppercase tracking-wide">Maria Rodriguez</p>
                    <p className="font-mono text-[10px] text-[var(--text-muted)] tracking-widest uppercase">maria@example.com</p>
                  </div>
                  <span className="ml-auto px-3 sm:px-4 py-2 font-mono text-[10px] tracking-widest text-white/50 border border-[var(--border-soft)] shrink-0">VIEW</span>
                </div>
              </div>

              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[var(--btn-bg)] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[var(--btn-bg)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
