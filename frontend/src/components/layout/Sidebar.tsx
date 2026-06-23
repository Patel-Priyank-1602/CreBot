import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard, Bot, FileText, MessageSquare, Code, CreditCard, Settings, Shield,
  ChevronLeft, MessageCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import CreBotLogo from '../common/CreBotLogo';

const sidebarItems = [
  { label: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Chatbots', icon: Bot, href: '/dashboard/chatbots' },
  { label: 'Knowledge Base', icon: FileText, href: '/dashboard/knowledge' },
  { label: 'Test Chat', icon: MessageCircle, href: '/dashboard/rag-chat' },
  { label: 'Chat Logs', icon: MessageSquare, href: '/dashboard/logs' },
  { label: 'Embed', icon: Code, href: '/dashboard/embed' },
  { label: 'Billing', icon: CreditCard, href: '/dashboard/billing' },
  { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
  { label: 'Admin', icon: Shield, href: '/dashboard/admin' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
      <aside
        className={cn(
          'fixed left-0 top-0 h-full z-40',
          'transition-all duration-300 flex flex-col',
          collapsed ? 'w-[60px]' : 'w-[260px]',
          ''
        )}
        style={{
          background: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--border-soft)',
        }}
      >
      <div className={cn('flex items-center gap-2.5 h-[72px] px-4 border-b', collapsed && 'justify-center')}
        style={{ borderColor: 'var(--border-soft)' }}>
        {!collapsed ? (
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--btn-bg)] flex items-center justify-center shrink-0 transition-transform hover:scale-105">
              <CreBotLogo size={20} className="text-[var(--btn-text)] w-5 h-5" />
            </div>
            <span className="font-display font-bold text-lg text-[var(--text-primary)] tracking-tight">CreBot</span>
          </Link>
        ) : (
          <Link to="/dashboard">
            <div className="w-8 h-8 rounded-lg bg-[var(--btn-bg)] flex items-center justify-center shrink-0 transition-transform hover:scale-105">
              <CreBotLogo size={20} className="text-[var(--btn-text)] w-5 h-5" />
            </div>
          </Link>
        )}
        <button
          onClick={onToggle}
          className={cn(
            'w-7 h-7 rounded-lg flex items-center justify-center transition-colors',
            'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]',
            collapsed ? 'ml-0' : 'ml-auto'
          )}
        >
          <ChevronLeft size={16} className={cn('transition-transform', collapsed && 'rotate-180')} />
        </button>
      </div>

      <nav className="flex-1 py-3 px-2 space-y-1">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/dashboard'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                collapsed && 'justify-center px-2',
                isActive
                  ? 'text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]',
                isActive ? 'bg-[var(--active-bg)]' : 'hover:bg-[var(--hover-bg)]'
              )
            }
          >
            <item.icon size={18} />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
