import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    num: '01',
    question: 'HOW DOES CREBOT PREVENT HALLUCINATIONS?',
    answer: 'CreBot uses a strictly constrained Retrieval-Augmented Generation (RAG) pipeline. The system prompt forces the AI to only answer using the retrieved context from your documents. If the answer isn\'t in your docs, it refuses to speculate.'
  },
  {
    num: '02',
    question: 'CAN I USE THE WIDGET ON MULTIPLE WEBSITES?',
    answer: 'Yes. Once you create a bot and get its embed script, you can place it on as many domains as you like. Rate limits apply per account, not per domain.'
  },
  {
    num: '03',
    question: 'WHAT FILE FORMATS DO YOU SUPPORT?',
    answer: 'Currently, we support raw text, Markdown (.md), and strict PDF extraction. We are continuously adding support for more formats like DOCX and HTML scraping via webhooks.'
  },
  {
    num: '04',
    question: 'IS MY KNOWLEDGE BASE SECURE?',
    answer: 'Absolutely. We use Row Level Security (RLS) in our database to ensure strict tenant isolation. Your knowledge base is isolated to your account and is never used to train our base models.'
  },
  {
    num: '05',
    question: 'CAN I CUSTOMIZE THE WIDGET APPEARANCE?',
    answer: 'Yes. You can customize the widget\'s primary color, name, and introductory message directly from the CreBot dashboard. Using our SDK, you can completely override the CSS.'
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-28 lg:py-36 bg-[var(--bg-main)] border-t border-[var(--border-default)]">
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-10">
        
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
          <div className="lg:col-span-5">
            <div className="section-marker mb-6">
              <span>08 — Intel</span>
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 text-white"
            >
              FREQUENTLY<br />
              <span className="text-stroke">ASKED</span><br />
              <span className="text-[var(--btn-bg)]">QUESTIONS.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-lg text-[var(--text-secondary)] leading-relaxed font-sans mt-8"
            >
              Everything you need to know about the product, deployment, and security protocols.
            </motion.p>
          </div>

          <div className="lg:col-span-7">
            <div className="border-t-2 border-[var(--border-default)]">
              {faqs.map((faq, idx) => (
                <motion.div
                  key={faq.num}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="border-b-2 border-[var(--border-default)] group"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                    className="w-full py-8 flex items-center justify-between text-left focus:outline-none hover:pl-4 transition-all duration-300"
                  >
                    <div className="flex items-center gap-6">
                      <span className={`font-mono text-sm tracking-[0.2em] transition-colors ${openIndex === idx ? 'text-[var(--btn-bg)]' : 'text-[var(--text-muted)] group-hover:text-white'}`}>
                        {faq.num}
                      </span>
                      <span className={`font-heading text-2xl md:text-3xl tracking-wide transition-colors ${openIndex === idx ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-white'}`}>
                        {faq.question}
                      </span>
                    </div>
                    <div className={`w-8 h-8 flex items-center justify-center border transition-all ${openIndex === idx ? 'border-[var(--btn-bg)] bg-[var(--btn-bg)]' : 'border-[var(--border-soft)] group-hover:border-white'}`}>
                      <div className={`w-3 h-[2px] transition-all bg-current ${openIndex === idx ? 'text-black' : 'text-[var(--text-muted)] group-hover:text-white'}`} />
                      <div className={`w-[2px] h-3 absolute transition-all bg-current ${openIndex === idx ? 'text-black rotate-90 opacity-0' : 'text-[var(--text-muted)] group-hover:text-white'}`} />
                    </div>
                  </button>
                  <AnimatePresence>
                    {openIndex === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="pl-14 pr-8 pb-10 text-[var(--text-secondary)] text-lg leading-relaxed font-sans">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
