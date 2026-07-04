import { useState, useEffect } from 'react';
import { Bot, FileText, MessageSquare, HardDrive } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatCard from '../components/dashboard/StatCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import ErrorState from '../components/common/ErrorState';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { formatTimeAgo } from '../lib/utils';
import { getDashboardCombined } from '../services/dashboardService';
import type { DashboardOverview, RecentChat, ActivityItem } from '../services/dashboardService';

export default function DashboardOverview() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [recentChats, setRecentChats] = useState<RecentChat[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAllChats, setShowAllChats] = useState(false);

  const COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#eab308', '#06b6d4'];

  const load = () => {
    setLoading(true);
    setError('');
    getDashboardCombined()
      .then(({ overview: ov, activities: acts, chats }) => {
        setOverview(ov);
        setActivities(acts);
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
        <p className="text-sm text-[var(--text-muted)]">Welcome back. Here is your overview.</p>
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

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Chat Distribution Pie Chart */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5 overflow-hidden relative">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-6">Chat Distribution</h3>
          <div className="h-[250px] w-full">
            {!loading && (overview?.chat_distribution || []).length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={overview?.chat_distribution || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {(overview?.chat_distribution || []).map((_entry, index) => (
                      <Cell key={`cell-chat-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-soft)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--text-primary)' }}
                    formatter={(value: any) => [Number(value).toLocaleString(), 'Chats']}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: 'var(--text-muted)' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-[var(--text-muted)]">No chat data yet. Start chatting with your bots!</p>
              </div>
            )}
          </div>
        </div>

        {/* Storage Distribution Pie Chart */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5 overflow-hidden relative">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-6">Storage Usage (KB)</h3>
          <div className="h-[250px] w-full">
            {!loading && (overview?.storage_distribution || []).length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={overview?.storage_distribution || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {(overview?.storage_distribution || []).map((_entry, index) => (
                      <Cell key={`cell-storage-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-soft)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--text-primary)' }}
                    formatter={(value: any) => [`${value} KB`, 'Storage']}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: 'var(--text-muted)' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-[var(--text-muted)]">No storage data yet. Upload files to your bots!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <RecentActivity activities={activities} loading={loading} />
        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5 flex flex-col max-h-[500px]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4 shrink-0">Recent Chats</h3>
          <div className="overflow-y-auto custom-scrollbar pr-2 flex-1">
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
                {(showAllChats ? recentChats : recentChats.slice(0, 5)).map((chat) => (
                  <div key={chat.id} className="flex items-start gap-3 py-2 group">
                    <div className="w-8 h-8 rounded-lg bg-[var(--bg-input)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-muted)] shrink-0 transition-colors group-hover:border-[var(--text-muted)]">
                      <MessageSquare size={15} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-[var(--text-primary)] break-words whitespace-normal">{chat.user_question}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">
                        {chat.chatbot_name ? `${chat.chatbot_name} • ` : ''}
                        {formatTimeAgo(chat.created_at)}
                      </p>
                    </div>
                  </div>
                ))}

                {recentChats.length >= 5 && (
                  <button
                    onClick={async () => {
                      if (!showAllChats && recentChats.length <= 5) {
                        try {
                          const { getRecentChats } = await import('../services/dashboardService');
                          const moreChats = await getRecentChats(100);
                          setRecentChats(moreChats);
                        } catch (e) {
                          console.error(e);
                        }
                      }
                      setShowAllChats(!showAllChats);
                    }}
                    className="w-full mt-2 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all rounded-lg hover:bg-[var(--white-alpha-5)] border border-transparent hover:border-[var(--white-alpha-10)]"
                  >
                    {showAllChats ? 'Show less' : 'See more'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
