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
              <span>06 — Workflow</span>
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
              Every stage of the CreBot pipeline is engineered around a single objective - measurable, uncompromising accuracy. We handle the vector math; you handle the deployment.
            </motion.p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 border border-[var(--btn-bg)] bg-[var(--btn-bg)] text-black font-heading tracking-widest text-sm uppercase font-bold">Standard Pipeline</span>
              <span className="px-4 py-2 border border-[var(--border-default)] text-[var(--text-muted)] hover:text-white hover:border-white transition-colors font-heading tracking-widest text-sm uppercase cursor-pointer">Custom API</span>
              <span className="px-4 py-2 border border-[var(--border-default)] text-[var(--text-muted)] hover:text-white hover:border-white transition-colors font-heading tracking-widest text-sm uppercase cursor-pointer">Webhooks</span>
            </div>
          </div>
        </div>

        {/* Animated Pipeline Layout */}
        <div className="mt-32 relative hidden lg:block">
          {/* Background Track */}
          <div className="absolute top-[11px] left-6 right-6 h-[2px] bg-white/5" />
          
          {/* Animated Laser Stream */}
          <div className="absolute top-[11px] left-6 right-6 h-[2px] overflow-hidden">
            <div className="w-[100px] h-full bg-gradient-to-r from-transparent via-[var(--btn-bg)] to-transparent shadow-[0_0_20px_var(--btn-bg)] animate-[slideRight_3s_linear_infinite]" />
          </div>

          <div className="grid lg:grid-cols-5 gap-8 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex flex-col group relative pt-12 px-6"
              >
                {/* Connection Node */}
                <div className="absolute top-[6px] left-6 w-3 h-3 bg-black border-2 border-white/20 rounded-full group-hover:border-[var(--btn-bg)] group-hover:bg-[var(--btn-bg)] group-hover:shadow-[0_0_15px_rgba(224,90,0,0.8)] transition-all duration-300 z-20" />
                
                {/* Vertical drop line */}
                <div className="absolute top-[18px] left-[29px] w-[2px] h-8 bg-white/5 group-hover:bg-[var(--btn-bg)]/50 transition-colors duration-300" />

                <div className="font-mono text-[10px] text-[var(--btn-bg)] tracking-[0.2em] mb-4 uppercase">
                  Phase {step.num}
                </div>
                
                <h3 className="font-display text-2xl text-white mb-3 group-hover:text-white transition-colors duration-300 relative z-10">
                  {step.title}
                </h3>
                <p className="text-[var(--text-secondary)] text-sm font-sans leading-relaxed relative z-10">
                  {step.desc}
                </p>
                
                {/* Hover bracket/glow effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--btn-bg)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl -z-10" />
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[var(--btn-bg)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tl-xl" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile / Tablet View (Vertical Pipeline) */}
        <div className="mt-20 relative lg:hidden ml-4">
          {/* Vertical Track */}
          <div className="absolute top-0 bottom-0 left-[5px] w-[2px] bg-white/5" />
          
          {/* Animated Laser Stream */}
          <div className="absolute top-0 bottom-0 left-[5px] w-[2px] overflow-hidden">
            <div className="w-full h-[100px] bg-gradient-to-b from-transparent via-[var(--btn-bg)] to-transparent shadow-[0_0_20px_var(--btn-bg)] animate-[slideDown_3s_linear_infinite]" />
          </div>

          <div className="flex flex-col gap-12 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex flex-col group relative pl-10"
              >
                {/* Connection Node */}
                <div className="absolute top-[6px] left-0 w-3 h-3 bg-black border-2 border-white/20 rounded-full group-hover:border-[var(--btn-bg)] group-hover:bg-[var(--btn-bg)] group-hover:shadow-[0_0_15px_rgba(224,90,0,0.8)] transition-all duration-300 z-20" />
                
                {/* Horizontal connection line */}
                <div className="absolute top-[11px] left-[12px] w-6 h-[2px] bg-white/5 group-hover:bg-[var(--btn-bg)]/50 transition-colors duration-300" />

                <div className="font-mono text-[10px] text-[var(--btn-bg)] tracking-[0.2em] mb-2 uppercase">
                  Phase {step.num}
                </div>
                
                <h3 className="font-display text-2xl text-white mb-2 group-hover:text-white transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-[var(--text-secondary)] text-sm font-sans leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
      
      <style>{`
        @keyframes slideRight {
          0% { transform: translateX(-150px); }
          100% { transform: translateX(100vw); }
        }
        @keyframes slideDown {
          0% { transform: translateY(-150px); }
          100% { transform: translateY(2000px); }
        }
      `}</style>
    </section>
  );
}
