import { motion } from 'framer-motion';
import { SignInButton } from '@clerk/clerk-react';
import { ArrowRight, Play } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import ParticleBackground from './ParticleBackground';

export default function HeroSection() {
  return (
    <section id="product" className="relative min-h-screen flex items-center overflow-hidden pt-[72px] scroll-mt-[72px]">
      <ParticleBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-[var(--text-primary)] leading-[1.1] tracking-tight mb-6 text-balance">
                Turn Your Knowledge Base Into an{' '}
                <span className="text-[var(--text-primary)] opacity-80">Intelligent Chatbot</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-lg text-[var(--text-muted)] leading-relaxed mb-8 max-w-lg"
            >
              Upload documents, build isolated knowledge spaces, and deploy AI chatbots that answer with context from your own data.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-8"
            >
              <SignInButton mode="modal">
                <Button variant="primary" size="lg">
                  Start Building
                  <ArrowRight size={18} />
                </Button>
              </SignInButton>
              <Button variant="secondary" size="lg">
                <Play size={18} />
                View Demo
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="text-sm text-[var(--text-muted)]"
            >
              Built for teams, SaaS products, documentation portals, and internal knowledge systems.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card elevated className="p-0 overflow-hidden shadow-2xl shadow-[var(--black-alpha-50)]">
              <div className="p-5 border-b border-[var(--border-soft)] flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[var(--border-default)]" />
                  <div className="w-3 h-3 rounded-full bg-[var(--border-default)]" />
                  <div className="w-3 h-3 rounded-full bg-[var(--border-default)]" />
                </div>
                <span className="text-xs text-[var(--text-muted)] font-mono">RAG Chat</span>
              </div>

              <div className="p-5 space-y-4">
                <div className="bg-[var(--bg-input)] border border-[var(--border-soft)] rounded-xl px-4 py-3 flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-[var(--white-alpha-10)] flex items-center justify-center">
                    <div className="w-3 h-0.5 bg-[var(--white-alpha-20)] rounded" />
                  </div>
                  <span className="text-sm text-[var(--text-muted)]">What are the key features of this product?</span>
                  <div className="ml-auto w-8 h-8 rounded-lg bg-[var(--btn-bg)] flex items-center justify-center">
                    <ArrowRight size={14} className="text-[var(--btn-text)]" />
                  </div>
                </div>

                <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[var(--white-alpha-10)] flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full border border-white/30" />
                    </div>
                    <span className="text-sm font-medium text-[var(--text-primary)]">AI Response</span>
                    <span className="text-xs text-[var(--text-muted)] ml-auto">Based on 3 sources</span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    Based on your documentation, the key features include multi-format file support, 
                    client-isolated knowledge bases, embeddable chat widgets, and detailed analytics.
                  </p>
                  <div className="flex gap-2 pt-1">
                    <span className="text-xs px-2 py-1 rounded-md bg-[var(--bg-input)] border border-[var(--border-soft)] text-[var(--text-muted)]">
                      product_overview.pdf
                    </span>
                    <span className="text-xs px-2 py-1 rounded-md bg-[var(--bg-input)] border border-[var(--border-soft)] text-[var(--text-muted)]">
                      features.md
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <div className="flex-1 bg-[var(--bg-input)] border border-[var(--border-soft)] rounded-lg px-3 py-2">
                    <span className="text-xs text-[var(--text-muted)] font-mono">product_overview.pdf</span>
                    <div className="mt-1 h-1.5 rounded-full bg-[var(--skeleton-bg)] overflow-hidden">
                      <div className="h-full w-3/4 rounded-full bg-[var(--white-alpha-10)]" />
                    </div>
                  </div>
                  <div className="flex-1 bg-[var(--bg-input)] border border-[var(--border-soft)] rounded-lg px-3 py-2">
                    <span className="text-xs text-[var(--text-muted)] font-mono">features.md</span>
                    <div className="mt-1 h-1.5 rounded-full bg-[var(--skeleton-bg)] overflow-hidden">
                      <div className="h-full w-2/3 rounded-full bg-[var(--white-alpha-10)]" />
                    </div>
                  </div>
                  <div className="flex-1 bg-[var(--bg-input)] border border-[var(--border-soft)] rounded-lg px-3 py-2">
                    <span className="text-xs text-[var(--text-muted)] font-mono">faq.docx</span>
                    <div className="mt-1 h-1.5 rounded-full bg-[var(--skeleton-bg)] overflow-hidden">
                      <div className="h-full w-1/2 rounded-full bg-[var(--white-alpha-10)]" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
