import { useState, useEffect } from 'react';
import { Bot, FileText, MessageSquare, HardDrive } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import ErrorState from '../components/common/ErrorState';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { formatTimeAgo } from '../lib/utils';
import { getOverview, getRecentChats } from '../services/dashboardService';
import type { DashboardOverview, RecentChat } from '../services/dashboardService';

export default function DashboardOverview() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [recentChats, setRecentChats] = useState<RecentChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    Promise.all([getOverview(), getRecentChats()])
      .then(([ov, chats]) => {
        setOverview(ov);
        setRecentChats(chats);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (error) return <ErrorState message={error} onRetry={load} />;

  const formatStorage = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-1">Overview</h1>
        <p className="text-sm text-[var(--text-muted)]">Welcome back. Here is your workspace summary.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
          </>
        ) : (
          <>
            <StatCard icon={<Bot size={18} />} label="Total Chatbots" value={overview?.total_chatbots ?? 0} />
            <StatCard icon={<FileText size={18} />} label="Uploaded Files" value={overview?.total_files ?? 0} />
            <StatCard icon={<MessageSquare size={18} />} label="Total Conversations" value={overview?.total_conversations ?? 0} />
            <StatCard icon={<HardDrive size={18} />} label="Storage Used"
              value={formatStorage(overview?.storage_used ?? 0)}
              trend={`of ${formatStorage(overview?.storage_limit ?? 0)}`} />
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <RecentActivity />
        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Recent Chats</h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 py-2">
                  <div className="w-8 h-8 rounded-lg bg-[var(--skeleton-bg)] animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[var(--skeleton-bg)] rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-[var(--skeleton-bg)] rounded w-1/2 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentChats.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)] text-center py-8">No conversations yet.</p>
          ) : (
            <div className="space-y-3">
              {recentChats.map((chat) => (
                <div key={chat.id} className="flex items-start gap-3 py-2">
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-input)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-muted)] shrink-0">
                    <MessageSquare size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-[var(--text-primary)] truncate">{chat.user_question}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {chat.chatbot_name ? `${chat.chatbot_name} • ` : ''}
                      {formatTimeAgo(chat.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


