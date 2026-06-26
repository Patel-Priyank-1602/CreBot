import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
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
    <div className="min-h-screen app-bg">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <div className={cn('transition-all duration-300 relative', collapsed ? 'ml-[80px]' : 'ml-[260px]')}>
        <header className="sticky top-0 z-30 h-[72px] border-b border-[var(--border-soft)] flex items-center justify-between px-6 bg-[var(--bg-main)]">
          <div className="flex-1 flex justify-start">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/dashboard/chatbots')}
            >
              <Plus size={16} />
              Create
            </Button>
          </div>
          
          <div className="flex-1 flex justify-center">
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

          <div className="flex-1 flex justify-end items-center gap-3">
            <ThemeSelector />
          </div>
        </header>

        <main className="p-6">
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
