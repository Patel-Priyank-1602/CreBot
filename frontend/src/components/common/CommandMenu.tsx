import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { sidebarGroups } from '../layout/Sidebar';
import { cn } from '../../lib/utils';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandMenu({ isOpen, onClose }: CommandMenuProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      // Open with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // The parent handles opening, but this catches if it's already open
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  // Flatten and filter items based on query
  const flatItems = sidebarGroups.flatMap((group) =>
    group.items.map((item) => ({ ...item, groupTitle: group.title }))
  );

  const filteredItems = query
    ? flatItems.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      )
    : flatItems;

  const handleSelect = (href: string) => {
    navigate(href);
    onClose();
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Search Input */}
        <div className="flex items-center px-4 border-b border-[var(--border-soft)]">
          <Search size={18} className="text-[var(--text-muted)] mr-3 shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search menu..."
            className="flex-1 bg-transparent py-4 outline-none border-none ring-0 focus:ring-0 text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
          />
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-[var(--text-muted)] hover:bg-[var(--hover-bg)] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="p-6 text-center text-sm text-[var(--text-muted)]">
              No results found for "{query}"
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.href}
                    onClick={() => handleSelect(item.href)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-[var(--hover-bg)] transition-colors group"
                  >
                    <div className="p-1.5 rounded-md bg-[var(--white-alpha-5)]">
                      <Icon size={16} className={cn("transition-colors", item.color)} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        {item.label}
                      </span>
                      <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider">
                        {item.groupTitle}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-4 py-3 bg-[var(--bg-input)] border-t border-[var(--border-soft)] text-xs text-[var(--text-muted)] flex justify-between">
          <span>Use <b>Esc</b> to close</span>
          <span><b>Search</b> to navigate</span>
        </div>
      </div>
    </div>
  );
}
