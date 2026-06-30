import { motion } from 'framer-motion';
import CreBotLogo from '../common/CreBotLogo';

const footerLinks = {
  Product: [
    { name: 'Features', href: '#features' },
    { name: 'Docs', href: '#docs' },
    { name: 'Collaboration', href: '#collaboration' },
    { name: 'Use Cases', href: '#use-cases' },
  ],
  Company: [
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
    { name: 'FAQ', href: '#faq' },
  ],
  Legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border-soft)] bg-[#030303] overflow-hidden flex flex-col relative">

      {/* Decorative gradient blur in background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--btn-bg)]/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      {/* Links Section */}
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-10 pt-20 pb-10 lg:pt-32 lg:pb-16 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-8">
  
                <img
                  src="/Fav.png"
                  alt="CreBot"
                  className="w-16 h-16 object-contain"
                />
              
              <span className="font-display font-bold text-2xl sm:text-3xl text-white tracking-wide">CreBot</span>
            </div>
            <p className="text-base text-[var(--text-secondary)] font-sans max-w-md leading-relaxed mb-10">
              Build intelligent chatbots from your own knowledge base. Zero hallucination, enterprise-grade security, and lightning-fast responses.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 rounded-full border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--btn-bg)] hover:border-[var(--btn-bg)] transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" className="w-12 h-12 rounded-full border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:border-white transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
              <a href="#" className="w-12 h-12 rounded-full border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-muted)] hover:text-[#0077b5] hover:border-[#0077b5] transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-8 pt-4 lg:pt-0">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="flex flex-col">
                <h4 className="text-[11px] font-mono font-bold text-white tracking-[0.2em] uppercase mb-8">{category}</h4>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a href={link.href} className="text-sm text-[var(--text-secondary)] hover:text-[var(--btn-bg)] hover:translate-x-1 inline-block transition-all duration-300 font-sans">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="w-full border-t border-[var(--border-soft)] relative z-20 bg-transparent mt-0">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-[0.1em]">© 2026 CreBot. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--btn-bg)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--btn-bg)]"></span>
            </div>
            <p className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-[0.1em]">All systems operational</p>
          </div>
        </div>
      </div>

      {/* Massive Static Text Section */}
      <div className="w-full overflow-hidden flex items-end justify-center select-none bg-[#030303] leading-none pb-0 pt-4">
        <span className="text-[20vw] lg:text-[24vw] leading-[0.75] tracking-tighter font-serif text-[#151515] text-center w-full block">
          CreBot
        </span>
      </div>
    </footer>
  );
}
