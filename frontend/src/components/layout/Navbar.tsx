import { Link, useLocation } from 'react-router-dom';
import { SignInButton, useUser } from '@clerk/clerk-react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import Button from '../common/Button';

const navGroups = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/#features' },
      { label: 'Use Case', href: '/#use-cases' }
    ]
  },
  {
    title: 'Why CreBot',
    links: [
      { label: 'Why Choose', href: '/#why-choose' },
      { label: 'Collaboration', href: '/#collaboration' },
      { label: 'Bring Your Own Key', href: '/#byok' }
    ]
  },
  {
    title: 'Resources',
    links: [
      { label: 'Docs', href: '/#docs' },
      { label: 'API Usage', href: '/#api-usage' },
      { label: 'FAQ', href: '/#faq' }
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/#about' },
      { label: 'Contact', href: '/#contact' }
    ]
  }
];

const signedInLinks = [
  { label: 'Join Bot', href: '/dashboard/join' },
  { label: 'Admin', href: '/dashboard/admin' },
];

export default function Navbar() {
  const { isSignedIn } = useUser();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const isLanding = location.pathname === '/';

  useEffect(() => {
    if (!isLanding) return;
    const ids = navGroups.flatMap(g => g.links.map(l => l.href.replace('/#', '')));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isLanding]);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isLanding && href.startsWith('/#')) {
      e.preventDefault();
      const targetId = href.replace('/#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', href);
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[90px] border-b border-[#222]"
      style={{ background: '#000000' }}>
      <div className="w-full max-w-[1600px] mx-auto px-4 lg:px-8 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 z-50">
          <img src="/favtag.png" alt="CreBot Logo" className="h-10 lg:h-12 w-auto object-contain" />
        </Link>

        {/* Desktop Navigation (> 1024px) */}
        <div className="hidden lg:flex items-center gap-2">
          {navGroups.map((group) => (
            <div key={group.title} className="relative group px-2 py-6">
              <button className="flex items-center gap-1.5 px-3 py-2 text-[15px] font-medium text-[#a9a9a6] hover:text-white transition-colors">
                {group.title}
                <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </button>
              
              <div className="absolute top-[80px] left-1/2 -translate-x-1/2 mt-0 w-56 bg-black border border-[#222] rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 p-2 flex flex-col gap-1 before:absolute before:inset-x-0 before:-top-6 before:h-6 before:bg-transparent">
                {group.links.map((link) => {
                  const isActive = link.href.includes('#')
                    ? activeSection === link.href.replace('/#', '')
                    : location.pathname === link.href;

                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={(e) => handleScroll(e, link.href)}
                      className={cn(
                        'block px-4 py-2.5 text-sm rounded-lg transition-colors',
                        isActive
                          ? 'bg-[#1a1a1a] text-white font-medium'
                          : 'text-[#a9a9a6] hover:bg-[#151515] hover:text-white'
                      )}
                    >
                      {link.label}
                    </a>
                  );
                })}
              </div>
            </div>
          ))}

          {isSignedIn && (
            <div className="mx-2 w-px h-6 bg-[#222]" />
          )}
          {isSignedIn && signedInLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.label}
                to={link.href}
                className={cn(
                  'relative px-4 py-2 text-[15px] rounded-lg transition-colors',
                  isActive
                    ? 'text-white font-medium'
                    : 'text-[#a9a9a6] hover:text-white'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-4">
          {isSignedIn ? (
            <Link to="/dashboard">
              <Button variant="primary">Dashboard</Button>
            </Link>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="px-4 py-2.5 text-[15px] font-medium text-[#a9a9a6] hover:text-white transition-colors">
                  Login
                </button>
              </SignInButton>
              <SignInButton mode="modal">
                <button className="bg-[#e8672a] hover:bg-[#ff7533] text-black font-bold px-6 py-2.5 rounded-lg transition-colors text-[15px]">
                  Get Started
                </button>
              </SignInButton>
            </>
          )}
        </div>

        {/* Mobile / Tablet Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden relative z-50 w-10 h-10 flex items-center justify-center text-[#a9a9a6] hover:text-white bg-[#151515] border border-[#222] rounded-xl"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile / Tablet Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-[90px] left-0 right-0 border-b border-[#222] bg-black shadow-2xl lg:hidden flex flex-col max-h-[calc(100vh-90px)] overflow-y-auto"
          >
            <div className="px-6 py-4 flex flex-col">
              {navGroups.map((group) => (
                <div key={group.title} className="border-b border-[#222]/50 last:border-0 py-2">
                  <button 
                    onClick={() => setOpenAccordion(openAccordion === group.title ? null : group.title)}
                    className="w-full flex items-center justify-between py-3 text-left text-[17px] font-medium text-[#a9a9a6] hover:text-white"
                  >
                    {group.title}
                    <ChevronDown size={18} className={cn("transition-transform duration-300", openAccordion === group.title && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {openAccordion === group.title && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-1 pb-3 pt-1">
                          {group.links.map((link) => {
                            const isActive = link.href.includes('#')
                              ? activeSection === link.href.replace('/#', '')
                              : location.pathname === link.href;

                            return (
                              <a
                                key={link.label}
                                href={link.href}
                                onClick={(e) => {
                                  setMobileOpen(false);
                                  handleScroll(e, link.href);
                                }}
                                className={cn(
                                  'px-4 py-3 rounded-xl text-[15px] transition-colors',
                                  isActive
                                    ? 'bg-[#1a1a1a] text-white font-medium'
                                    : 'text-[#a9a9a6] hover:bg-[#151515] hover:text-white'
                                )}
                              >
                                {link.label}
                              </a>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {isSignedIn && (
                <div className="pt-4 mt-2 border-t border-[#222]/50 flex flex-col gap-2">
                  {signedInLinks.map((link) => (
                    <Link
                      key={link.label}
                      to={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-3 text-[17px] font-medium text-[#a9a9a6] hover:text-white rounded-xl hover:bg-[#151515]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-[#222]/50 flex flex-col sm:flex-row gap-3 pb-6">
                {isSignedIn ? (
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="w-full">
                    <button className="w-full bg-[#e8672a] hover:bg-[#ff7533] text-black font-bold px-6 py-3.5 rounded-xl transition-colors text-[16px]">
                      Dashboard
                    </button>
                  </Link>
                ) : (
                  <>
                    <SignInButton mode="modal">
                      <button className="w-full sm:flex-1 px-6 py-3.5 text-[16px] font-medium text-[#a9a9a6] border border-[#222] rounded-xl hover:text-white hover:bg-[#1a1a1a] transition-colors">
                        Login
                      </button>
                    </SignInButton>
                    <SignInButton mode="modal">
                      <button className="w-full sm:flex-1 bg-[#e8672a] hover:bg-[#ff7533] text-black font-bold px-6 py-3.5 rounded-xl transition-colors text-[16px]">
                        Get Started
                      </button>
                    </SignInButton>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
