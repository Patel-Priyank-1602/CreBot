import { motion } from 'framer-motion';
import { Send, Mail, MapPin } from 'lucide-react';

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-[#000000] border-t border-[var(--border-soft)] relative overflow-hidden">
      <div className="w-full px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6 text-white">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E05A00] to-orange-400">Touch.</span>
            </h2>
            <p className="text-lg text-[var(--text-muted)] leading-relaxed mb-10 max-w-md">
              Have questions about enterprise plans, custom integrations, or just want to chat about AI? Drop us a message.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-soft)] flex items-center justify-center">
                  <Mail size={20} className="text-[#E05A00]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--text-muted)] font-medium">Email</p>
                  <p className="text-white font-medium">hello@crebot.ai</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-soft)] flex items-center justify-center">
                  <MapPin size={20} className="text-[#E05A00]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--text-muted)] font-medium">Office</p>
                  <p className="text-white font-medium">San Francisco, CA</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-[var(--bg-elevated)] border border-[var(--border-soft)] p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#E05A00]/5 blur-3xl rounded-full -z-10" />
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--text-secondary)]">First Name</label>
                    <input type="text" className="w-full bg-[#000000] border border-[var(--border-soft)] focus:border-[#E05A00] outline-none rounded-xl px-4 py-3 text-white transition-colors" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--text-secondary)]">Last Name</label>
                    <input type="text" className="w-full bg-[#000000] border border-[var(--border-soft)] focus:border-[#E05A00] outline-none rounded-xl px-4 py-3 text-white transition-colors" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--text-secondary)]">Email Address</label>
                  <input type="email" className="w-full bg-[#000000] border border-[var(--border-soft)] focus:border-[#E05A00] outline-none rounded-xl px-4 py-3 text-white transition-colors" placeholder="john@company.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--text-secondary)]">Message</label>
                  <textarea rows={4} className="w-full bg-[#000000] border border-[var(--border-soft)] focus:border-[#E05A00] outline-none rounded-xl px-4 py-3 text-white transition-colors resize-none" placeholder="How can we help you?" />
                </div>
                <button type="button" className="w-full bg-[#E05A00] hover:bg-[#ff6a00] text-white font-medium py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-[0_0_20px_rgba(224,90,0,0.3)]">
                  Send Message
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
