import { motion } from 'framer-motion';
import { Github, Twitter, Mail } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="relative py-24 bg-[#000000] text-white overflow-hidden border-t border-[var(--border-soft)]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-gradient-to-b from-[#E05A00]/10 to-transparent blur-[100px] -z-10" />

      <div className="w-full px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">
            The Developer <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E05A00] to-orange-400">Behind CreBot.</span>
          </h2>
          <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
            CreBot was created out of a necessity for an AI customer support solution that strictly adhered to provided documentation without hallucinating answers.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold mb-4">Engineering Philosophy</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                I believe in shipping zero-speculation systems. By utilizing Retrieval-Augmented Generation (RAG) with high-speed LLM inference, CreBot ensures that every answer is traced directly back to the source text. Quality and latency are the top priorities.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-4">Tech Stack Details</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Built with a deep focus on performance and minimal overhead:
              </p>
              <ul className="space-y-3 text-[var(--text-muted)]">
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E05A00]" />
                  <strong className="text-white">Frontend:</strong> React, Vite, TailwindCSS, Framer Motion
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E05A00]" />
                  <strong className="text-white">Backend:</strong> FastAPI, Python, Groq API (Llama 3)
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E05A00]" />
                  <strong className="text-white">Infrastructure:</strong> Supabase, Vector Embeddings
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-[var(--bg-elevated)] border border-[var(--border-soft)] rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E05A00]/10 blur-2xl rounded-full" />
              
              <img src="/tag (2).png" alt="CreBot Logo" className="w-16 h-16 object-contain mb-8 relative z-10" />
              <h3 className="text-2xl font-bold mb-2 relative z-10">Connect with me</h3>
              <p className="text-[var(--text-muted)] mb-8 relative z-10">
                Always open to discussing AI, systems engineering, or potential opportunities.
              </p>

              <div className="space-y-4 relative z-10">
                <a href="#" className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border-soft)] hover:bg-[var(--hover-bg)] hover:border-[#E05A00]/50 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-[var(--bg-main)] border border-[var(--border-soft)] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Github size={18} className="text-[var(--text-primary)]" />
                  </div>
                  <span className="font-medium text-[var(--text-primary)]">GitHub Profile</span>
                </a>
                <a href="#" className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border-soft)] hover:bg-[var(--hover-bg)] hover:border-[#E05A00]/50 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-[var(--bg-main)] border border-[var(--border-soft)] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Twitter size={18} className="text-[#1DA1F2]" />
                  </div>
                  <span className="font-medium text-[var(--text-primary)]">Twitter / X</span>
                </a>
                <a href="#" className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border-soft)] hover:bg-[var(--hover-bg)] hover:border-[#E05A00]/50 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-[var(--bg-main)] border border-[var(--border-soft)] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail size={18} className="text-emerald-500" />
                  </div>
                  <span className="font-medium text-[var(--text-primary)]">Email Me</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
