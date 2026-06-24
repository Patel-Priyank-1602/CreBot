import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SignInButton } from '@clerk/clerk-react';
import { ArrowRight, Play, Bot, CheckCircle, Zap } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import ParticleBackground from './ParticleBackground';

function AnimatedMockChat() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const sequence = async () => {
      while (isMounted) {
        setStep(0); // empty input
        await new Promise(r => setTimeout(r, 1200));
        if (!isMounted) break;
        setStep(1); // input typing
        await new Promise(r => setTimeout(r, 1200));
        if (!isMounted) break;
        setStep(2); // user sent bubble
        await new Promise(r => setTimeout(r, 500));
        if (!isMounted) break;
        setStep(3); // ai thinking
        await new Promise(r => setTimeout(r, 1500));
        if (!isMounted) break;
        setStep(4); // ai typing answer
        await new Promise(r => setTimeout(r, 5000));
      }
    };
    sequence();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="relative w-full max-w-[440px] mx-auto mt-10 lg:mt-0">

      <div className="relative z-10 bg-[var(--bg-main)] rounded-[2rem] border-2 border-[var(--border-soft)] shadow-[0_30px_60px_rgba(0,0,0,0.4)] flex flex-col h-[520px] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between bg-[var(--bg-card)]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-[14px] bg-[var(--btn-bg)] flex items-center justify-center relative shadow-lg shadow-[var(--btn-bg)]/20">
              <Bot size={22} className="text-white" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-[2.5px] border-[var(--bg-card)] rounded-full" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[var(--text-primary)] leading-tight tracking-tight">AI Assistant</h3>
              <p className="text-[12px] text-[var(--text-muted)] mt-0.5 font-medium">Answers from your docs only</p>
            </div>
          </div>
          <div className="px-2.5 py-1 rounded-full border border-[var(--border-soft)] text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider bg-[var(--bg-main)] shadow-inner">
            Live Preview
          </div>
        </div>
        
        <div className="mx-6 border-b border-dashed border-[var(--border-soft)]" />

        {/* Chat Body */}
        <div className="flex-1 overflow-hidden p-6 space-y-6 flex flex-col justify-end bg-[var(--bg-main)] relative">
          {/* Msg 1: User (History) */}
          <div className="flex justify-end opacity-60">
            <div className="bg-[var(--btn-bg)] text-white px-4 py-3 rounded-2xl rounded-br-sm max-w-[85%] shadow-md shadow-[var(--btn-bg)]/20">
              <p className="text-[14px] font-medium leading-relaxed">Can you summarize the Q3 report?</p>
            </div>
          </div>

          {/* Msg 2: AI (History) */}
          <div className="flex justify-start opacity-60">
            <div className="bg-[var(--bg-elevated)] border border-[var(--border-soft)] px-4 py-3.5 rounded-2xl rounded-bl-sm max-w-[90%] shadow-sm">
              <p className="text-[14px] text-[var(--text-secondary)] leading-[1.6]">
                Certainly! The Q3 report shows a 15% revenue increase driven primarily by new enterprise signups.
              </p>
            </div>
          </div>

          {/* Msg 3: User (Animated) */}
          {step >= 2 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10, transformOrigin: "bottom right" }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              className="flex justify-end"
            >
              <div className="bg-[var(--btn-bg)] text-white px-4 py-3 rounded-2xl rounded-br-sm max-w-[85%] shadow-lg shadow-[var(--btn-bg)]/30">
                <p className="text-[14px] font-medium leading-relaxed">What are the key features of this product?</p>
              </div>
            </motion.div>
          )}

          {/* Msg 4: AI (Animated) */}
          {step >= 3 && (
            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95, transformOrigin: "bottom left" }} animate={{ opacity: 1, y: 0, scale: 1 }} className="flex justify-start">
              <div className="bg-[var(--bg-elevated)] border border-[var(--border-soft)] px-4 py-3.5 rounded-2xl rounded-bl-sm max-w-[90%] shadow-md space-y-3">
                {step === 3 ? (
                  <div className="flex gap-1.5 py-1 px-1">
                    <div className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                ) : (
                  <>
                    <motion.div
                      initial={{ clipPath: "inset(0 100% 0 0)" }}
                      animate={{ clipPath: "inset(0 0 0 0)" }}
                      transition={{ duration: 1.5, ease: "linear" }}
                    >
                      <p className="text-[14px] text-[var(--text-secondary)] leading-[1.6]">
                        Based on your documentation, the key features include <strong className="text-[var(--text-primary)] font-semibold">multi-format file support</strong>, 
                        client-isolated knowledge bases, and embeddable chat widgets.
                      </p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[var(--btn-bg)]/10 rounded-md border border-[var(--btn-bg)]/20 mt-1">
                        <div className="w-1.5 h-1.5 rounded-sm bg-[var(--btn-bg)] rotate-45" />
                        <span className="text-[11px] font-mono text-[var(--btn-bg)] font-bold tracking-tight">grounded answer - from 3 sources</span>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 pt-3 bg-[var(--bg-main)] rounded-b-[2rem]">
          <div className="bg-[var(--bg-input)] border border-[var(--border-soft)] focus-within:border-[var(--btn-bg)] transition-colors rounded-full px-5 py-3.5 flex items-center gap-3 relative shadow-inner">
            <div className="flex-1 relative h-6 flex items-center overflow-hidden">
              {step === 0 && <span className="text-[14px] text-[var(--text-muted)] font-medium">Ask about features, pricing, docs...</span>}
              {step === 1 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.0, ease: "linear" }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap overflow-hidden text-[14px] font-medium text-[var(--text-primary)] border-r-2 border-[var(--btn-bg)] pr-1"
                >
                  What are the key features of this product?
                </motion.div>
              )}
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${step === 1 ? 'bg-[var(--btn-bg)] shadow-[0_0_12px_rgba(224,90,0,0.5)]' : 'bg-[var(--bg-elevated)] border border-[var(--border-soft)]'}`}>
              <ArrowRight size={14} className={step === 1 ? 'text-[var(--btn-text)]' : 'text-[var(--text-muted)]'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section id="product" className="relative min-h-screen flex items-center overflow-hidden pt-[72px] scroll-mt-[72px]">
      <ParticleBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-16">
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
            <AnimatedMockChat />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
