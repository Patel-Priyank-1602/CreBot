import { motion } from 'framer-motion';

const steps = [
  { num: '01', title: 'UPLOAD KNOWLEDGE', desc: 'Securely ingest your PDFs, Word documents, and text files. We instantly parse, chunk, and prepare your data.' },
  { num: '02', title: 'VECTORIZE', desc: 'Our proprietary pipeline embeds your text using state-of-the-art embedding models, optimizing for retrieval latency.' },
  { num: '03', title: 'ISOLATE STORE', desc: 'Data is committed to a client-isolated vector index. Strict RBAC ensures your data never bleeds into another tenant.' },
  { num: '04', title: 'DEPLOY CHATBOT', desc: 'Generate an iframe or use our JS SDK to embed the CreBot widget on your site, internal wiki, or app.' },
  { num: '05', title: 'QUERY & TRACE', desc: 'Users ask questions. CreBot fetches the exact chunks and generates a grounded response, citing the source document.' },
];

export default function WorkflowSection() {
  return (
    <section id="docs" className="relative py-28 lg:py-36 border-t border-[var(--border-default)] bg-[var(--bg-main)]">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10">

        <div className="grid lg:grid-cols-12 gap-8 mb-20">
          <div className="lg:col-span-5">
            <div className="section-marker mb-6">
              <span>05 — Workflow</span>
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-white"
            >
              RAW DATA.<br />
              <span className="text-stroke">TO GROUNDED</span><br />
              <span className="text-[var(--btn-bg)]">INTELLIGENCE.</span>
            </motion.h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 flex flex-col justify-end">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[var(--text-secondary)] text-lg leading-relaxed font-sans mb-6"
            >
              Every stage of the CreBot pipeline is engineered around a single objective — measurable, uncompromising accuracy. We handle the vector math; you handle the deployment.
            </motion.p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 border border-[var(--btn-bg)] bg-[var(--btn-bg)] text-black font-heading tracking-widest text-sm uppercase font-bold">Standard Pipeline</span>
              <span className="px-4 py-2 border border-[var(--border-default)] text-[var(--text-muted)] hover:text-white hover:border-white transition-colors font-heading tracking-widest text-sm uppercase cursor-pointer">Custom API</span>
              <span className="px-4 py-2 border border-[var(--border-default)] text-[var(--text-muted)] hover:text-white hover:border-white transition-colors font-heading tracking-widest text-sm uppercase cursor-pointer">Webhooks</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 border-t border-[var(--border-soft)] pt-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col group"
            >
              <div className="font-display text-6xl md:text-7xl text-[var(--border-soft)] group-hover:text-[var(--btn-bg)] transition-colors mb-6">{step.num}</div>
              <h3 className="font-display text-2xl text-white mb-3">{step.title}</h3>
              <p className="text-[var(--text-secondary)] text-sm font-sans leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
