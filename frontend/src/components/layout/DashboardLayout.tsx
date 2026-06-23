import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { UserButton, useAuth } from '@clerk/clerk-react';
import { Search, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Sidebar from './Sidebar';
import ThemeSelector from '../common/ThemeSelector';
import { cn } from '../../lib/utils';
import { setClerkTokenGetter } from '../../lib/api';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { getToken } = useAuth();

  useEffect(() => {
    setClerkTokenGetter(getToken);
  }, [getToken]);

  return (
    <div className="min-h-screen app-bg">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <div className={cn('transition-all duration-300', collapsed ? 'ml-[60px]' : 'ml-[260px]')}>
        <header className="h-[72px] border-b border-[var(--border-soft)] flex items-center justify-between px-6 bg-[var(--bg-main)]">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <Search size={16} className="text-[var(--text-muted)]" />
            <input
              placeholder="Search chatbots, files, or logs..."
              className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] border-none outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <ThemeSelector />
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/dashboard/chatbots')}
            >
              <Plus size={16} />
              Create Chatbot
            </Button>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        <main className="p-6">
          <div className="page-fade">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
