import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, SignInButton, SignUpButton } from '@clerk/clerk-react';
import { Bot, Zap, Shield, Code, ArrowRight, MessageSquare, Sparkles, CheckCircle2, BarChart } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './LandingPage.css';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  useEffect(() => {
    if (isSignedIn) {
      navigate('/dashboard');
    }
  }, [isSignedIn, navigate]);

  // Chat demo animation
  useEffect(() => {
    const body = chatBodyRef.current;
    if (!body) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const script = [
      { from: 'visitor', text: "What's your return window?" },
      { from: 'bot', text: 'Returns are accepted within 30 days of delivery for a full refund — no receipt needed for guest checkouts.' },
      { from: 'visitor', text: 'Can I return something bought at your pop-up event?' },
      { from: 'bot', text: "That's not in the FAQ, so I won't guess. Email support@yourstore.com and the team will sort it out.", honest: true },
    ];

    function clearBody() { if (body) body.innerHTML = ''; }

    function addMessage({ from, text, honest }: { from: string; text: string; honest?: boolean }) {
      const el = document.createElement('div');
      el.className = 'demo-msg ' + from;
      el.textContent = text;
      if (honest) {
        const tag = document.createElement('div');
        tag.className = 'honest-tag';
        tag.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Honest — not in FAQ';
        el.appendChild(tag);
      }
      body!.appendChild(el);
      body!.scrollTop = body!.scrollHeight;
    }

    function addTyping() {
      const el = document.createElement('div');
      el.className = 'demo-typing';
      el.innerHTML = '<span></span><span></span><span></span>';
      body!.appendChild(el);
      body!.scrollTop = body!.scrollHeight;
      return el;
    }

    function wait(ms: number) { return new Promise(r => setTimeout(r, ms)); }

    async function playOnce() {
      clearBody();
      for (const turn of script) {
        if (turn.from === 'bot') {
          const t = addTyping();
          await wait(1200);
          t.remove();
          addMessage(turn);
          await wait(2000);
        } else {
          addMessage(turn);
          await wait(800);
        }
      }
      await wait(4000);
    }

    let cancelled = false;
    async function loop() {
      while (!cancelled) { await playOnce(); }
    }

    if (reduceMotion) {
      clearBody();
      script.forEach(addMessage);
    } else {
      loop();
    }

    return () => { cancelled = true; };
  }, []);

  return (
    <div className="landing">
      {/* Animated Background Orbs */}
      <div className="bg-orbs">
        <motion.div className="orb orb-1" style={{ y: yBg }} />
        <motion.div className="orb orb-2" style={{ y: yBg }} />
        <motion.div className="orb orb-3" style={{ y: yBg }} />
      </div>

      {/* Nav */}
      <div className="nav-wrapper">
        <div className="wrap">
          <nav className="landing-nav">
            <a href="/" className="brand">
              <span className="brand-mark">
                <MessageSquare size={16} color="#fff" strokeWidth={2.5} />
              </span>
              <span className="brand-text">CreBot.</span>
            </a>
            <ul className="nav-links">
              <li><a href="#features">Features</a></li>
              <li><a href="#how">How it works</a></li>
              <li><a href="#demo">Live Demo</a></li>
            </ul>
            <div className="nav-actions">
              <SignInButton mode="modal">
                <button className="nav-login">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="btn btn-primary btn-sm">Get Started</button>
              </SignUpButton>
            </div>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="hero">
        <div className="wrap">
          <div className="hero-grid">
            <motion.div 
              className="hero-copy"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeIn} className="eyebrow-wrapper">
                <span className="eyebrow">
                  <span className="pulse-dot"></span>
                  Llama 3 Powered
                  <span className="eyebrow-divider"></span>
                  100% Free Tier
                </span>
              </motion.div>

              <motion.h1 variants={fadeIn} className="headline">
                The AI support bot that<br />
                <span className="text-gradient">never hallucinates.</span>
              </motion.h1>

              <motion.p variants={fadeIn} className="sub">
                Upload your FAQ. Copy one <code>&lt;script&gt;</code>. Get a stunning customer support widget that answers instantly—and honestly says "I don't know" when it should.
              </motion.p>

              <motion.div variants={fadeIn} className="cta-row">
                <SignUpButton mode="modal">
                  <button className="btn btn-primary btn-lg shine-effect">
                    Start Building Free <ArrowRight size={18} />
                  </button>
                </SignUpButton>
                <a href="#demo" className="btn btn-ghost btn-lg">Watch Demo</a>
              </motion.div>

              <motion.div variants={fadeIn} className="stats">
                <div className="stat">
                  <div className="stat-num">&lt;5m</div>
                  <div className="stat-label">Time to Live</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat">
                  <div className="stat-num">$0</div>
                  <div className="stat-label">Forever Free</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat">
                  <div className="stat-num">&lt;2s</div>
                  <div className="stat-label">Response Time</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Widget Demo with 3D feel */}
            <motion.div 
              className="demo-stage" id="demo"
              initial={{ opacity: 0, scale: 0.95, rotateY: 5 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="demo-glow"></div>
              <motion.div 
                className="floaty-tag top"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="floaty-ico"><CheckCircle2 size={12} strokeWidth={3} /></div> 
                Trained on your FAQ
              </motion.div>

              <div className="widget-demo glass-panel">
                <div className="widget-head">
                  <div className="widget-head-left">
                    <div className="bot-avatar">
                      <MessageSquare size={16} color="#fff" />
                      <span className="status-dot"></span>
                    </div>
                    <div>
                      <div className="bot-name">Support Team</div>
                      <div className="bot-sub">Replies instantly</div>
                    </div>
                  </div>
                  <div className="live-pill">
                    <span className="live-dot"></span> Live Demo
                  </div>
                </div>

                <div className="widget-body" ref={chatBodyRef}></div>

                <div className="widget-footer">
                  <div className="widget-input-bar">
                    <span>Ask about shipping, returns...</span>
                    <div className="send-circle">
                      <ArrowRight size={14} color="#fff" />
                    </div>
                  </div>
                  <div className="widget-watermark">Powered by <strong>CreBot</strong></div>
                </div>
              </div>

              <motion.div 
                className="floaty-tag bottom"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <div className="floaty-ico warning"><Shield size={12} strokeWidth={3} /></div> 
                Zero Hallucinations
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tech Stack Marquee */}
      <div className="tech-marquee-section">
        <div className="tech-marquee">
          <div className="marquee-content">
            <span>Powered by</span>
            <div className="tech-item"><img src="https://upload.wikimedia.org/wikipedia/commons/8/87/Sql_data_base_with_logo.png" alt="SQL" /> Postgres</div>
            <div className="tech-dot">•</div>
            <div className="tech-item"><img src="https://huggingface.co/front/assets/huggingface_logo-noborder.svg" alt="HF" /> HuggingFace Embeddings</div>
            <div className="tech-dot">•</div>
            <div className="tech-item"><Zap size={16} color="#f59e0b" /> Groq LPU</div>
            <div className="tech-dot">•</div>
            <div className="tech-item"><img src="https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg" alt="Meta" /> Meta Llama 3</div>
            <div className="tech-dot">•</div>
            <div className="tech-item"><img src="https://supabase.com/dashboard/img/supabase-logo.svg" alt="Supabase" /> Supabase</div>
          </div>
          {/* Duplicate for infinite scroll */}
          <div className="marquee-content" aria-hidden="true">
            <span>Powered by</span>
            <div className="tech-item"><img src="https://upload.wikimedia.org/wikipedia/commons/8/87/Sql_data_base_with_logo.png" alt="SQL" /> Postgres</div>
            <div className="tech-dot">•</div>
            <div className="tech-item"><img src="https://huggingface.co/front/assets/huggingface_logo-noborder.svg" alt="HF" /> HuggingFace Embeddings</div>
            <div className="tech-dot">•</div>
            <div className="tech-item"><Zap size={16} color="#f59e0b" /> Groq LPU</div>
            <div className="tech-dot">•</div>
            <div className="tech-item"><img src="https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg" alt="Meta" /> Meta Llama 3</div>
            <div className="tech-dot">•</div>
            <div className="tech-item"><img src="https://supabase.com/dashboard/img/supabase-logo.svg" alt="Supabase" /> Supabase</div>
          </div>
        </div>
      </div>

      {/* Bento Grid Features */}
      <section className="section bento-section" id="features">
        <div className="wrap">
          <motion.div 
            className="section-header"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
          >
            <h2 className="section-title">An unfair advantage for your website.</h2>
            <p className="section-sub">Premium customer support without the premium price tag. CreBot gives you enterprise-grade AI chat instantly.</p>
          </motion.div>

          <div className="bento-grid">
            <motion.div className="bento-item span-2 glass-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <div className="bento-content">
                <div className="bento-icon"><Shield size={24} /></div>
                <h3>Honest by Default</h3>
                <p>When the answer isn't in your FAQ, the bot admits it. No hallucinating policies or making up prices. Just trustworthy support.</p>
              </div>
              <div className="bento-visual honest-visual">
                <div className="mock-chat">
                  <div className="m-user">Do you sell gift cards?</div>
                  <div className="m-bot">
                    That's not in my FAQ. Please contact support@store.com!
                    <div className="m-tag"><CheckCircle2 size={10} /> Honest Answer</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div className="bento-item glass-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
               <div className="bento-content">
                <div className="bento-icon"><Zap size={24} /></div>
                <h3>Ultra-Fast</h3>
                <p>Powered by Groq LPUs, responses generate at 800+ tokens per second. Answers appear instantly.</p>
              </div>
            </motion.div>

            <motion.div className="bento-item glass-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
               <div className="bento-content">
                <div className="bento-icon"><Code size={24} /></div>
                <h3>One Script Install</h3>
                <p>Drop a single line of code into your site. Works with React, Webflow, Shopify, or plain HTML.</p>
              </div>
            </motion.div>

            <motion.div className="bento-item span-2 glass-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <div className="bento-content">
                <div className="bento-icon"><BarChart size={24} /></div>
                <h3>Insights Dashboard</h3>
                <p>Track every conversation in real-time. Discover what your customers are really asking and identify gaps in your FAQ.</p>
              </div>
              <div className="bento-visual dashboard-visual">
                <div className="mock-dashboard">
                  <div className="m-dash-header">
                    <div className="m-dash-line"></div>
                    <div className="m-dash-line short"></div>
                  </div>
                  <div className="m-dash-chart">
                    <div className="m-bar h-1"></div>
                    <div className="m-bar h-3"></div>
                    <div className="m-bar h-2"></div>
                    <div className="m-bar h-4"></div>
                    <div className="m-bar h-5"></div>
                    <div className="m-bar h-2"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section dark-section" id="how">
        <div className="wrap">
          <motion.div className="section-header" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <h2 className="section-title">Live in under 3 minutes.</h2>
            <p className="section-sub">No coding required. If you can copy and paste, you can build an AI chatbot.</p>
          </motion.div>

          <div className="steps-container">
            <motion.div className="step-row" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.div className="step-box" variants={fadeIn}>
                <div className="step-number">1</div>
                <h3>Upload Knowledge</h3>
                <p>Paste your FAQ text into our dashboard. We instantly generate vector embeddings.</p>
              </motion.div>
              <div className="step-connector"></div>
              <motion.div className="step-box" variants={fadeIn}>
                <div className="step-number">2</div>
                <h3>Copy Snippet</h3>
                <p>Grab your unique widget script tag provided in your bot settings.</p>
              </motion.div>
              <div className="step-connector"></div>
              <motion.div className="step-box" variants={fadeIn}>
                <div className="step-number">3</div>
                <h3>Paste & Go</h3>
                <p>Drop it before your closing <code>&lt;/body&gt;</code> tag. Your AI assistant is now live.</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="wrap">
          <motion.div 
            className="cta-card glass-panel"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="cta-glow"></div>
            <h2>Elevate your customer experience.</h2>
            <p>Join the next generation of automated support. Free forever for standard usage.</p>
            <SignUpButton mode="modal">
              <button className="btn btn-primary btn-xl shine-effect">
                Create Your Free Bot Now <ArrowRight size={18} />
              </button>
            </SignUpButton>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="wrap">
          <div className="footer-top">
            <div className="footer-brand">
              <span className="brand-mark">
                <MessageSquare size={16} color="#fff" />
              </span>
              <span className="brand-text">CreBot</span>
              <p className="footer-tagline">Honest AI for modern businesses.</p>
            </div>
            <div className="footer-links">
              <div className="link-group">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#how">How it Works</a>
                <a href="#demo">Live Demo</a>
              </div>
              <div className="link-group">
                <h4>Legal</h4>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} CreBot. All rights reserved.</p>
            <div className="footer-social">
              <a href="#">Twitter</a>
              <a href="#">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
