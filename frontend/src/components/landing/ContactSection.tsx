import { motion } from 'framer-motion';

export default function ContactSection() {
  return (
    <section id="contact" className="relative py-28 lg:py-36 border-t border-[var(--border-default)] bg-[var(--bg-main)] overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 relative z-10">
        
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          <div className="lg:col-span-5">
            <div className="section-marker mb-6">
              <span>07 — Contact</span>
            </div>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-white mb-8"
            >
              DEPLOY<br />
              <span className="text-[var(--btn-bg)]">CREBOT.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[var(--text-secondary)] text-lg leading-relaxed font-sans mb-12"
            >
              Have questions about enterprise plans, custom integrations, or want to discuss a proof of concept? We respond within 4 hours.
            </motion.p>
            
            <div className="space-y-8 pt-8 border-t border-[var(--border-soft)]">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-[0.2em] uppercase mb-1">Direct Line</span>
                <span className="font-heading text-2xl text-white tracking-wide">ENTERPRISE@CREBOT.AI</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-[0.2em] uppercase mb-1">HQ Location</span>
                <span className="font-heading text-2xl text-white tracking-wide">SAN FRANCISCO, CA</span>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="relative p-10 bg-[var(--bg-card)] border border-[var(--border-default)] group">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[var(--btn-bg)] transition-all group-hover:w-16 group-hover:h-16" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[var(--btn-bg)] transition-all group-hover:w-16 group-hover:h-16" />
              
              <form className="space-y-8 relative z-10">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="flex flex-col">
                    <label className="font-mono text-[10px] text-[var(--btn-bg)] tracking-[0.2em] uppercase mb-2">First Name</label>
                    <input 
                      type="text" 
                      className="bg-transparent border-0 border-b border-[var(--border-soft)] focus:border-[var(--btn-bg)] outline-none text-white font-heading text-xl py-2 px-0 transition-colors focus:ring-0" 
                      placeholder="JOHN" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-mono text-[10px] text-[var(--btn-bg)] tracking-[0.2em] uppercase mb-2">Last Name</label>
                    <input 
                      type="text" 
                      className="bg-transparent border-0 border-b border-[var(--border-soft)] focus:border-[var(--btn-bg)] outline-none text-white font-heading text-xl py-2 px-0 transition-colors focus:ring-0" 
                      placeholder="DOE" 
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="font-mono text-[10px] text-[var(--btn-bg)] tracking-[0.2em] uppercase mb-2">Work Email</label>
                  <input 
                    type="email" 
                    className="bg-transparent border-0 border-b border-[var(--border-soft)] focus:border-[var(--btn-bg)] outline-none text-white font-heading text-xl py-2 px-0 transition-colors focus:ring-0" 
                    placeholder="JOHN@COMPANY.COM" 
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-mono text-[10px] text-[var(--btn-bg)] tracking-[0.2em] uppercase mb-2">Initiative Details</label>
                  <textarea 
                    rows={3} 
                    className="bg-transparent border-0 border-b border-[var(--border-soft)] focus:border-[var(--btn-bg)] outline-none text-white font-heading text-xl py-2 px-0 transition-colors resize-none focus:ring-0" 
                    placeholder="DESCRIBE YOUR KNOWLEDGE BASE..." 
                  />
                </div>
                <button type="button" className="mt-8 font-heading text-sm tracking-[0.2em] uppercase text-black bg-white px-10 py-5 hover:bg-[var(--btn-bg)] hover:text-white transition-colors duration-300 w-full text-center font-bold">
                  TRANSMIT REQUEST
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
