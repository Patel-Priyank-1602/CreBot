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
      { label: 'Video', href: '/#demo-video' },
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
  const [scrolled, setScrolled] = useState(false);
  const isLanding = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    <nav
      className="fixed left-0 right-0 z-50"
      style={{
        top: scrolled ? 12 : 0,
        height: scrolled ? 56 : 90,
        maxWidth: scrolled ? 900 : '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: scrolled ? 9999 : 0,
        borderStyle: 'solid',
        borderWidth: scrolled ? '1.2px' : '0px',
        borderColor: 'rgba(232, 103, 42, 0.35)',
        background: scrolled
          ? 'linear-gradient(to bottom, rgba(10, 10, 10, 0.85) 0%, rgba(10, 10, 10, 0.85) 100%)'
          : 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0) 100%)',
        boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.6)' : 'none',
        backdropFilter: scrolled ? 'blur(20px) saturate(1.5)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.5)' : 'none',
        transition: 'all 700ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      aria-label="Main navigation"
    >
      <div
        className="h-full flex items-center justify-between mx-auto relative"
        style={{
          maxWidth: scrolled ? 880 : 1600,
          paddingLeft: scrolled ? 20 : undefined,
          paddingRight: scrolled ? 20 : undefined,
          transition: 'all 700ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Link to="/" className="flex items-center gap-2.5 z-50 px-4 lg:px-8">
          <img
            src="/crebott.png"
            alt="CreBot Logo"
            className="w-auto object-contain"
            style={{
              height: scrolled ? 28 : 48,
              transition: 'all 700ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            width={160}
            height={48}
          />
        </Link>

        {/* Desktop Navigation (> 1024px) */}
        <div className="hidden lg:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          {navGroups.map((group) => (
            <div
              key={group.title}
              className="relative group px-1 lg:px-2"
              style={{
                paddingTop: scrolled ? 16 : 24,
                paddingBottom: scrolled ? 16 : 24,
                transition: 'all 700ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <button
                className="flex items-center gap-1.5 font-medium text-[#a9a9a6] hover:text-white whitespace-nowrap"
                style={{
                  fontSize: scrolled ? 13 : 15,
                  paddingLeft: scrolled ? 8 : 12,
                  paddingRight: scrolled ? 8 : 12,
                  paddingTop: scrolled ? 4 : 8,
                  paddingBottom: scrolled ? 4 : 8,
                  transition: 'all 700ms cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                aria-haspopup="true"
                aria-expanded="false"
              >
                {group.title}
                <ChevronDown size={scrolled ? 12 : 14} className="group-hover:rotate-180 transition-transform duration-300" />
              </button>

              <div
                className="absolute left-1/2 -translate-x-1/2 mt-0 w-56 bg-black border border-[#222] rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 p-2 flex flex-col gap-1 before:absolute before:inset-x-0 before:-top-6 before:h-6 before:bg-transparent"
                style={{ top: scrolled ? 48 : 80, transition: 'top 700ms cubic-bezier(0.4, 0, 0.2, 1)' }}
              >
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
                  'relative rounded-lg',
                  isActive
                    ? 'text-white font-medium'
                    : 'text-[#a9a9a6] hover:text-white'
                )}
                style={{
                  fontSize: scrolled ? 13 : 15,
                  paddingLeft: scrolled ? 12 : 16,
                  paddingRight: scrolled ? 12 : 16,
                  paddingTop: scrolled ? 6 : 8,
                  paddingBottom: scrolled ? 6 : 8,
                  transition: 'all 700ms cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-4 pr-4 lg:pr-8">
          {isSignedIn ? (
            <Link
              to="/dashboard"
              style={{
                transform: scrolled ? 'scale(0.9)' : 'scale(1)',
                transformOrigin: 'right center',
                transition: 'transform 700ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <Button variant="primary">Dashboard</Button>
            </Link>
          ) : (
            <>
              <SignInButton mode="modal">
                <button
                  className="bg-[#e8672a] hover:bg-[#ff7533] text-white font-bold rounded-lg"
                  style={{
                    fontSize: scrolled ? 13 : 15,
                    paddingLeft: scrolled ? 16 : 24,
                    paddingRight: scrolled ? 16 : 24,
                    paddingTop: scrolled ? 6 : 10,
                    paddingBottom: scrolled ? 6 : 10,
                    transition: 'all 700ms cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  Create Bot
                </button>
              </SignInButton>
            </>
          )}
        </div>

        {/* Mobile / Tablet Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
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
            className={cn(
              'absolute left-0 right-0 border-b border-[#222] bg-black shadow-2xl lg:hidden flex flex-col overflow-y-auto',
              scrolled
                ? 'top-[56px] rounded-b-2xl max-h-[calc(100vh-56px)]'
                : 'top-[90px] max-h-[calc(100vh-90px)]'
            )}
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
                      <button className="w-full bg-[#e8672a] hover:bg-[#ff7533] text-black font-bold px-6 py-3.5 rounded-xl transition-colors text-[16px]">
                        Create Bot
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
