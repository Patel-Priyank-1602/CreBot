import { Link, useLocation } from 'react-router-dom';
import { SignInButton, useUser } from '@clerk/clerk-react';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import Button from '../common/Button';
import CreBotLogo from '../common/CreBotLogo';

const navLinks = [
  { label: 'Product', href: '/#product' },
  { label: 'Features', href: '/#features' },
  { label: 'Docs', href: '/#docs' },
  { label: 'Use Case', href: '/#use-cases' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
  { label: 'FAQ', href: '/#faq' },
];

export default function Navbar() {
  const { isSignedIn } = useUser();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const isLanding = location.pathname === '/';

  useEffect(() => {
    if (!isLanding) return;
    const ids = navLinks.map(l => l.href.replace('#', ''));
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[90px] border-b border-[var(--border-soft)]"
      style={{ background: '#000000', backdropFilter: 'blur(16px)' }}>
      <div className="w-full px-4 md:px-8 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/favtag.png" alt="CreBot Logo" className="h-12 w-auto object-contain" />
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = link.href.includes('#') 
              ? activeSection === link.href.replace('/#', '')
              : location.pathname === link.href;

            return (
              <a
                key={link.label}
                href={link.href}
                className={cn(
                  'relative px-4 py-2 text-base rounded-lg transition-colors',
                  isActive
                    ? 'text-[var(--text-primary)] font-medium'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-[var(--hover-bg)] rounded-lg z-0"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </a>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-5">
          {isSignedIn ? (
            <Link to="/dashboard">
              <Button variant="primary">Dashboard</Button>
            </Link>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="px-5 py-2.5 text-base font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                  Login
                </button>
              </SignInButton>
              <SignInButton mode="modal">
                <Button variant="primary">Get Started</Button>
              </SignInButton>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-8 h-8 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border-soft)] bg-[var(--bg-main)] px-6 py-4 space-y-2">
          {isLanding && navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.label}
                href={link.href}
                className={cn(
                  'block px-3 py-2 text-sm rounded-lg',
                  isActive
                    ? 'text-[var(--text-primary)] bg-[var(--hover-bg)] font-medium'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                )}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            );
          })}
          <div className="pt-2 flex gap-3">
            {isSignedIn ? (
              <Link to="/dashboard" className="flex-1" onClick={() => setMobileOpen(false)}>
                <Button variant="primary" size="sm" className="w-full">Dashboard</Button>
              </Link>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="flex-1 px-4 py-2 text-sm text-[var(--text-muted)] border border-[var(--border-default)] rounded-xl hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-colors">
                    Login
                  </button>
                </SignInButton>
                <SignInButton mode="modal">
                  <Button variant="primary" size="sm" className="flex-1">Get Started</Button>
                </SignInButton>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
