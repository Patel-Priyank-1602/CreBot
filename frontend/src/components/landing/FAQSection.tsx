import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "How does CreBot prevent hallucinations?",
    answer: "CreBot uses a strictly constrained Retrieval-Augmented Generation (RAG) pipeline. The system prompt forces the AI to only answer using the retrieved context from your documents. If the answer isn't in your docs, it will say 'I don't know'."
  },
  {
    question: "Can I use the widget on multiple websites?",
    answer: "Yes. Once you create a bot and get its embed script, you can place it on as many domains as you like. Rate limits apply per account, not per domain."
  },
  {
    question: "What file formats do you support?",
    answer: "Currently, we support raw text, Markdown (.md), and basic PDF extraction. We are continuously adding support for more formats like DOCX and HTML scraping."
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use Row Level Security (RLS) in our database to ensure strict tenant isolation. Your knowledge base is isolated to your account and is never used to train our base models."
  },
  {
    question: "How do I customize the widget's appearance?",
    answer: "You can customize the widget's primary color, name, and introductory message directly from the CreBot dashboard. These changes apply immediately to your live widget."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-[#000000] relative border-t border-[var(--border-soft)]">
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6 text-white">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E05A00] to-orange-400">Questions.</span>
          </h2>
          <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
            Everything you need to know about the product and billing.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className={`border border-[var(--border-soft)] rounded-2xl overflow-hidden transition-colors ${openIndex === idx ? 'bg-[var(--bg-elevated)] border-[#E05A00]/30' : 'bg-[#000000] hover:bg-[var(--bg-elevated)]'}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-medium text-lg text-white">{faq.question}</span>
                <ChevronDown size={20} className={`text-[var(--text-muted)] transition-transform duration-300 ${openIndex === idx ? 'rotate-180 text-[#E05A00]' : ''}`} />
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-5 text-[var(--text-secondary)] leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
