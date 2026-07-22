import { motion } from 'framer-motion';
import CreBotLogo from '../common/CreBotLogo';

const footerLinks = {
  Product: [
    { name: 'Features', href: '/#features' },
    { name: 'Use Cases', href: '/#use-cases' },
  ],
  'Why CreBot': [
    { name: 'Why Choose', href: '/#why-choose' },
    { name: 'Collaboration', href: '/#collaboration' },
    { name: 'Bring Your Own Key', href: '/#byok' },
  ],
  Resources: [
    { name: 'Docs', href: '/#docs' },
    { name: 'API Usage', href: '/#api-usage' },
    { name: 'FAQ', href: '/#faq' },
  ],
  Company: [
    { name: 'About', href: '/#about' },
    { name: 'Contact', href: '/#contact' },
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
          <div className="lg:col-span-4 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-8">

              <img
                src="/Fav.png"
                alt="CreBot Logo"
                className="w-16 h-16 object-contain"
                width={64}
                height={64}
                loading="lazy"
              />

              <span className="font-display font-bold text-2xl sm:text-3xl text-white tracking-wide">CreBot</span>
            </div>
            <p className="text-base text-[var(--text-secondary)] font-sans max-w-md leading-relaxed mb-10">
              Build intelligent chatbots from your own knowledge base. Zero hallucination, enterprise-grade security, and lightning-fast responses.
            </p>

            {/* Social Links */}
            {/* <div className="flex gap-4">
              <a href="#" aria-label="Follow CreBot on Twitter" className="w-12 h-12 rounded-full border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--btn-bg)] hover:border-[var(--btn-bg)] hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-[var(--btn-bg)]/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" aria-label="CreBot on GitHub" className="w-12 h-12 rounded-full border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:border-white hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
              <a href="#" aria-label="CreBot on LinkedIn" className="w-12 h-12 rounded-full border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-muted)] hover:text-[#0077b5] hover:border-[#0077b5] hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-[#0077b5]/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div> */}
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-6 pt-8 lg:pt-0">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="flex flex-col">
                <h4 className="text-[12px] font-mono font-bold text-white tracking-[0.2em] uppercase mb-8 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--btn-bg)] inline-block"></span>
                  {category}
                </h4>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a href={link.href} className="text-[15px] text-[var(--text-secondary)] hover:text-white hover:translate-x-1.5 inline-block transition-all duration-300 font-sans group">
                        {link.name}
                        <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-[var(--btn-bg)] rounded mt-0.5 opacity-0 group-hover:opacity-100"></span>
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
      <div className="w-full border-t border-[var(--border-soft)] relative z-20 bg-[#030303]">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <p className="text-[12px] font-mono text-[var(--text-muted)] uppercase tracking-[0.1em]">© 2026 CreBot. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-3 bg-[#111] px-4 py-2 rounded-full border border-[#222]">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f97316] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#f97316]"></span>
            </div>
            <p className="text-[12px] font-mono text-white uppercase tracking-[0.1em] font-medium">
              All systems operational
            </p>
          </div>
        </div>
      </div>

      {/* Massive Static Text Section */}
      <div className="w-full overflow-hidden flex items-end justify-center select-none bg-[#030303] leading-none pb-0 pt-8 border-t border-[var(--border-soft)]">
        <span className="text-[20vw] lg:text-[24vw] leading-[0.75] tracking-tighter font-serif text-[#111111] text-center w-full block hover:text-[#151515] transition-colors duration-700">
          CreBot
        </span>
      </div>
    </footer>
  );
}
