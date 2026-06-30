import { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Search, Plus, PanelLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Sidebar from './Sidebar';
import ThemeSelector from '../common/ThemeSelector';
import CommandMenu from '../common/CommandMenu';
import { cn } from '../../lib/utils';
import { setClerkTokenGetter } from '../../lib/api';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { getToken } = useAuth();

  useEffect(() => {
    setClerkTokenGetter(getToken);
  }, [getToken]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandMenuOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  return (
    <div className="min-h-screen app-bg flex flex-col md:block">
      {/* Mobile Sidebar Overlay */}
      <div className={cn(
        "md:hidden fixed inset-0 z-50 flex transition-all duration-300",
        mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        <div 
          className={cn(
            "fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          )} 
          onClick={() => setMobileMenuOpen(false)} 
        />
        <div className={cn(
          "relative w-[260px] max-w-[80%] h-full bg-[var(--sidebar-bg)] shadow-2xl flex-shrink-0 transition-transform duration-300 ease-in-out",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
           <Sidebar collapsed={false} onToggle={() => setMobileMenuOpen(false)} isMobile={true} />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <Sidebar 
        collapsed={collapsed} 
        onToggle={() => setCollapsed(!collapsed)} 
        className="hidden md:flex" 
      />

      <div className={cn('transition-all duration-300 relative flex-1 flex flex-col', collapsed ? 'md:ml-[80px]' : 'md:ml-[260px]')}>
        <header className="sticky top-0 z-30 h-[64px] md:h-[72px] border-b border-[var(--border-soft)] flex items-center justify-between px-4 md:px-6 bg-[var(--bg-main)]/80 backdrop-blur-md">
          {/* Desktop Left */}
          <div className="hidden md:flex flex-1 justify-start">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/dashboard/chatbots')}
            >
              <Plus size={16} />
              Create
            </Button>
          </div>

          {/* Mobile Left */}
          <div className="flex md:hidden items-center gap-2 flex-1">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1.5 rounded-lg hover:bg-[var(--hover-bg)] shrink-0"
            >
              <PanelLeft size={20} />
            </button>
            <Link to="/dashboard" className="flex items-center shrink-0">
              <img src="/Fav.png" alt="CreBot Logo" className="h-7 w-auto object-contain" />
            </Link>
          </div>
          
          {/* Desktop Center */}
          <div className="hidden md:flex flex-1 justify-center">
            <button
              onClick={() => setIsCommandMenuOpen(true)}
              className="flex items-center gap-2 bg-[var(--bg-input)] hover:bg-[var(--hover-bg)] px-4 py-2 rounded-xl w-full max-w-xs border border-[var(--border-default)] transition-colors group"
            >
              <Search size={16} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
              <span className="flex-1 text-sm text-[var(--text-muted)] text-left group-hover:text-[var(--text-primary)] transition-colors">
                Search menu...
              </span>
              <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-muted)] bg-[var(--bg-card)] border border-[var(--border-default)] rounded">
                ⌘ K
              </kbd>
            </button>
          </div>

          {/* Right (Desktop & Mobile) */}
          <div className="flex flex-1 justify-end items-center gap-2 md:gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/dashboard/chatbots')}
              className="md:hidden px-2 py-1.5 h-auto shrink-0"
            >
              <Plus size={16} />
            </Button>
            <button
              onClick={() => setIsCommandMenuOpen(true)}
              className="md:hidden flex items-center justify-center p-1.5 bg-[var(--bg-input)] hover:bg-[var(--hover-bg)] rounded-lg border border-[var(--border-default)] transition-colors text-[var(--text-muted)] hover:text-[var(--text-primary)] shrink-0"
            >
              <Search size={16} />
            </button>
            <ThemeSelector />
          </div>
        </header>

        <main className="p-4 md:p-6 flex-1">
          <div className="page-fade">
            <Outlet />
          </div>
        </main>
      </div>
      
      <CommandMenu 
        isOpen={isCommandMenuOpen} 
        onClose={() => setIsCommandMenuOpen(false)} 
      />
    </div>
  );
}
