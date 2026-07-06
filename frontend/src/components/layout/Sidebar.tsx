import { NavLink, Link } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import {
  LayoutDashboard, Bot, FileText, MessageSquare, Code, CreditCard, Settings, Shield,
  ChevronLeft, MessageCircle, Users, PanelLeft, Key, User
} from 'lucide-react';
import { cn } from '../../lib/utils';
import CreBotLogo from '../common/CreBotLogo';

export const sidebarGroups = [
  {
    title: 'Dashboard',
    items: [
      { label: 'Overview', icon: LayoutDashboard, href: '/dashboard', color: 'text-emerald-500' },
      { label: 'Chatbots', icon: Bot, href: '/dashboard/chatbots', color: 'text-blue-500' },
    ]
  },
  {
    title: 'Knowledge',
    items: [
      { label: 'Knowledge Base', icon: FileText, href: '/dashboard/knowledge', color: 'text-violet-500' },
      { label: 'Test Chat', icon: MessageCircle, href: '/dashboard/rag-chat', color: 'text-amber-500' },
    ]
  },
  {
    title: 'Activity',
    items: [
      { label: 'Chat Logs', icon: MessageSquare, href: '/dashboard/logs', color: 'text-pink-500' },
      { label: 'Join Bot', icon: Users, href: '/dashboard/join', color: 'text-cyan-500' },
    ]
  },
  {
    title: 'System',
    items: [
      { label: 'Embed', icon: Code, href: '/dashboard/embed', color: 'text-indigo-500' },
      { label: 'Own API', icon: Key, href: '/dashboard/own-api', color: 'text-orange-500' },
      { label: 'Settings', icon: Settings, href: '/dashboard/settings', color: 'text-[var(--text-muted)]' },
    ]
  },
  {
    title: 'Account',
    items: [
      { label: 'Billing', icon: CreditCard, href: '/dashboard/billing', color: 'text-teal-500' },
    ]
  }
];


interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  className?: string;
  isMobile?: boolean;
}

export default function Sidebar({ collapsed, onToggle, className, isMobile }: SidebarProps) {
  return (
      <aside
        className={cn(
          !isMobile && 'fixed left-0 top-0 z-40',
          'h-full transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col',
          'bg-[var(--sidebar-bg)] border-r border-[var(--border-soft)]',
          isMobile ? 'w-full' : (collapsed ? 'w-[80px]' : 'w-[260px]'),
          className
        )}
      >
      <div className={cn("relative flex items-center h-[72px] group", collapsed ? "justify-center" : "px-6 justify-between")}>
        
        {!collapsed ? (
          <>
            <Link to="/dashboard" className="flex items-center gap-2.5">
              <img src="/Fav.png" alt="CreBot Logo" className="h-8 w-auto object-contain" />
              <span className="font-display font-bold text-lg text-[var(--text-primary)] tracking-tight">CreBot</span>
            </Link>
            <button onClick={onToggle} className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors rounded-md hover:bg-[var(--hover-bg)]">
              <PanelLeft size={18} />
            </button>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="flex items-center justify-center transition-opacity duration-200 group-hover:opacity-0">
              <img src="/Fav.png" alt="CreBot Logo" className="h-8 w-auto object-contain" />
            </Link>
            <button 
              onClick={onToggle} 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all rounded-md hover:bg-[var(--hover-bg)] opacity-0 group-hover:opacity-100 z-10"
            >
              <PanelLeft size={18} />
            </button>
          </>
        )}
      </div>

      <nav className="flex-1 min-h-0 py-3 px-2 space-y-3 overflow-y-auto overflow-x-hidden">
        {sidebarGroups.map((group, index) => (
          <div key={group.title} className="space-y-0.5">
            {!collapsed ? (
              <div className="px-3 mb-1.5 mt-2 first:mt-0 flex items-center gap-2">
                <span className="text-[10px] font-bold text-[var(--btn-bg)] uppercase tracking-[0.15em] shrink-0">
                  {group.title}
                </span>
                <div className="flex-1 h-[1px] bg-[var(--btn-bg)] opacity-30" />
              </div>
            ) : (
              index !== 0 && <div className="mx-auto w-5 border-t border-[var(--border-soft)] mb-1.5 mt-3" />
            )}
            
            {group.items.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/dashboard'}
                onClick={() => {
                  if (isMobile && onToggle) {
                    onToggle();
                  }
                }}
                className={({ isActive }) =>
                  cn(
                    'relative group flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-300 ease-out',
                    collapsed && 'justify-center px-1.5',
                    isActive
                      ? 'text-[var(--text-primary)] bg-[var(--white-alpha-5)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-[var(--white-alpha-10)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--white-alpha-5)] border border-transparent'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Glowing Active Indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-1/2 bg-[var(--btn-bg)] rounded-r-full shadow-[0_0_8px_var(--btn-bg)]" />
                    )}
                    <div className={cn("flex items-center justify-center p-1 rounded-md transition-colors duration-300", isActive ? "bg-[var(--white-alpha-10)]" : "group-hover:bg-[var(--white-alpha-5)]")}>
                      <item.icon size={16} className={isActive ? item.color : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors'} />
                    </div>
                    {!collapsed && <span className="whitespace-nowrap tracking-wide translate-x-0 group-hover:translate-x-1 transition-transform duration-300">{item.label}</span>}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className={cn("mt-auto shrink-0 p-4 border-t border-[var(--border-soft)]", collapsed && "px-2 flex justify-center")}>
        <div className={cn("hover:bg-[var(--white-alpha-5)] rounded-2xl transition-all duration-300 cursor-pointer border border-transparent hover:border-[var(--white-alpha-10)] shadow-sm", collapsed ? "p-1" : "p-2 w-full")}>
          <UserButton showName={!collapsed} appearance={{
            elements: {
              userButtonOuterIdentifier: "text-[var(--text-primary)] font-medium ml-2",
              userButtonBox: collapsed ? "flex-row" : "flex-row-reverse w-full justify-end",
            }
          }} />
        </div>
      </div>
    </aside>
  );
}
