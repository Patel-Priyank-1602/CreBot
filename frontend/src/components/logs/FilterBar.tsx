import { useState, useEffect } from 'react';
import { Search, Calendar } from 'lucide-react';
import { getChatbotFilters } from '../../services/chatLogService';
import { LogFilters } from '../../services/chatLogService';

interface FilterBarProps {
  onFilterChange: (filters: LogFilters) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [search, setSearch] = useState('');
  const [chatbotId, setChatbotId] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [chatbots, setChatbots] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    getChatbotFilters().then(setChatbots).catch(() => {});
  }, []);

  const applyFilters = (updates: Record<string, string>) => {
    const f: LogFilters = {};
    const s = updates.search ?? search;
    const c = updates.chatbotId ?? chatbotId;
    const t = updates.timeFilter ?? timeFilter;
    if (s) f.search = s;
    if (c) f.chatbotId = c;
    if (t === 'today') {
      f.from = new Date(Date.now() - 86400000).toISOString();
    } else if (t === 'week') {
      f.from = new Date(Date.now() - 7 * 86400000).toISOString();
    } else if (t === 'month') {
      f.from = new Date(Date.now() - 30 * 86400000).toISOString();
    }
    onFilterChange(f);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <div className="flex-1 min-w-[200px] max-w-xs">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters({ search })}
            className="w-full bg-[var(--bg-input)] border border-[var(--border-default)] rounded-xl pl-9 pr-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
          />
        </div>
      </div>
      <select value={chatbotId} onChange={(e) => { setChatbotId(e.target.value); applyFilters({ chatbotId: e.target.value }); }}
        className="bg-[var(--bg-input)] border border-[var(--border-default)] rounded-xl px-3 py-2 text-sm text-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] transition-colors">
        <option value="">All Chatbots</option>
        {chatbots.map((b) => (
          <option key={b.id} value={b.id}>{b.name}</option>
        ))}
      </select>
      <select value={timeFilter} onChange={(e) => { setTimeFilter(e.target.value); applyFilters({ timeFilter: e.target.value }); }}
        className="bg-[var(--bg-input)] border border-[var(--border-default)] rounded-xl px-3 py-2 text-sm text-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] transition-colors">
        <option value="">All Time</option>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
      </select>
    </div>
  );
}
