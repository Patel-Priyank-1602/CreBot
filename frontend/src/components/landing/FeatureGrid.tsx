import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const features = [
  {
    num: '01',
    category: 'INGESTION',
    title: 'UPLOAD KNOWLEDGE',
    desc: 'Add PDFs, TXT, Markdown, DOCX, and structured files to power your chatbot. Advanced chunking and vectorization pipeline included.',
    image: '/fec1.png',
    meta1: { label: 'Supported', value: 'PDF, TXT, MD' },
    meta2: { label: 'Pipeline', value: 'AUTO-CHUNKING' }
  },
  {
    num: '02',
    category: 'RETRIEVAL',
    title: 'ASK WITH CONTEXT',
    desc: 'Get answers grounded in your uploaded knowledge base. No speculation. Every claim is traced back to a specific document.',
    image: '/fec2.png',
    meta1: { label: 'Latency', value: '< 200MS' },
    meta2: { label: 'Accuracy', value: 'GROUNDED' }
  },
  {
    num: '03',
    category: 'DEPLOYMENT',
    title: 'EMBED ANYWHERE',
    desc: 'Generate an embed snippet and place your chatbot on any website. Fully customizable UI to match your brand.',
    image: 'fec3.png',
    meta1: { label: 'Integration', value: 'IFRAME / JS' },
    meta2: { label: 'Customization', value: 'FULL CSS' }
  },
  {
    num: '04',
    category: 'SECURITY',
    title: 'CLIENT ISOLATION',
    desc: 'Keep every user\'s documents and vectors separated securely. Enterprise-grade tenant isolation by default.',
    image: '/fec4.png',
    meta1: { label: 'Standard', value: 'SOC2 TYPE II' },
    meta2: { label: 'Encryption', value: 'AES-256' }
  },
  {
    num: '05',
    category: 'ANALYTICS',
    title: 'CHAT LOGS',
    desc: 'Export conversations for review, support, and training. Identify knowledge gaps and improve your documentation.',
    image: '/fec5.png',
    meta1: { label: 'Retention', value: 'INFINITE' },
    meta2: { label: 'Format', value: 'JSON / CSV' }
  },
  {
    num: '06',
    category: 'PORTABILITY',
    title: 'KNOWLEDGE EXPORT',
    desc: 'Download the complete knowledge base as a single file. You own your data. No vendor lock-in, ever.',
    image: '/fec6.png',
    meta1: { label: 'Lock-in', value: 'ZERO' },
    meta2: { label: 'Access', value: 'API / UI' }
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="relative py-28 lg:py-36 border-t border-[var(--border-default)] bg-[var(--bg-main)]">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
        
        <div className="grid lg:grid-cols-12 gap-8 mb-20">
          <div className="lg:col-span-7">
            <div className="section-marker mb-6">
              <span>01 — Features</span>
            </div>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-white"
            >
              EVERYTHING YOU NEED.<br />
              <span className="text-stroke">NOTHING YOU</span><br />
              <span className="text-[var(--btn-bg)]">DON'T.</span>
            </motion.h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 flex flex-col justify-end">
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[var(--text-secondary)] text-lg leading-relaxed font-sans mb-6"
            >
              From file upload to deployment - manage your entire RAG pipeline from one place. Engineered for speed and precision.
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <motion.article 
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="group notch-corner border border-[var(--border-default)] bg-[var(--bg-card)] hover:border-[var(--btn-bg)] transition-colors duration-400"
            >
              <div className="relative h-48 sm:h-64 overflow-hidden">
                <img 
                  src={feature.image} 
                  className="w-full h-full object-cover img-noir group-hover:scale-105 group-hover:grayscale-[80%] transition-all duration-700" 
                  alt={feature.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4 font-mono text-[11px] text-[var(--btn-bg)] tracking-[0.2em]">{feature.num} / {feature.category}</div>
                <div className="absolute top-4 right-4 px-2 py-1 bg-[var(--btn-bg)] text-black font-mono text-[10px] tracking-[0.15em] font-bold">CORE</div>
              </div>
              
              <div className="p-7">
                <h3 className="font-display text-3xl mb-3 text-white group-hover:text-[var(--btn-bg)] transition-colors">{feature.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6 font-sans">
                  {feature.desc}
                </p>
                
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6 pb-6 border-b border-[var(--border-soft)]">
                  <div>
                    <div className="font-mono text-[10px] text-[var(--text-muted)] tracking-[0.2em] uppercase">{feature.meta1.label}</div>
                    <div className="font-heading text-base text-[var(--text-primary)] tracking-wide mt-1">{feature.meta1.value}</div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] text-[var(--text-muted)] tracking-[0.2em] uppercase">{feature.meta2.label}</div>
                    <div className="font-heading text-base text-[var(--text-primary)] tracking-wide mt-1">{feature.meta2.value}</div>
                  </div>
                </div>
                
                {/* <a href="#product" className="flex items-center justify-between font-heading text-sm tracking-[0.15em] uppercase text-[var(--text-primary)] group/link">
                  <span className="relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1px] after:bg-[var(--btn-bg)] after:transition-all group-hover/link:after:w-full">
                    Explore Capability
                  </span>
                  <ArrowRight size={16} className="text-[var(--btn-bg)]" />
                </a> */}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
