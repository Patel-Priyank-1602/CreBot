import CreBotLogo from '../common/CreBotLogo';

const footerLinks = {
  Product: ['Features', 'Pricing', 'Security', 'Docs'],
  Company: ['About', 'Blog', 'Careers', 'Contact'],
  Legal: ['Privacy', 'Terms', 'Cookie Policy'],
};

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border-soft)] bg-[var(--bg-main)]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                <CreBotLogo size={20} className="text-black w-5 h-5" />
              </div>
              <span className="font-display font-bold text-lg text-[var(--text-primary)]">CreBot</span>
            </div>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Build intelligent chatbots from your own knowledge base.
            </p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-[var(--border-soft)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)]">© 2026 CreBot. All rights reserved.</p>
          <p className="text-xs text-[var(--text-muted)]">Built with black & white precision.</p>
        </div>
      </div>
    </footer>
  );
}
