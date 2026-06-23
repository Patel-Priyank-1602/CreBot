import { memo, useState, useEffect } from 'react';
import { FileText, MessageSquare, Bot } from 'lucide-react';
import { formatTimeAgo } from '../../lib/utils';
import { getActivity, ActivityItem } from '../../services/dashboardService';

function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActivity()
      .then(setActivities)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const iconMap: Record<string, React.ElementType> = {
    upload: FileText,
    bot: Bot,
    chat: MessageSquare,
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Recent Activity</h3>
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 py-2 animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-[var(--skeleton-bg)]" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-[var(--skeleton-bg)] rounded w-48" />
                <div className="h-3 bg-[var(--skeleton-bg)] rounded w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)] text-center py-4">No recent activity.</p>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => {
            const Icon = iconMap[activity.type] || MessageSquare;
            return (
              <div key={activity.id} className="flex items-center gap-3 py-2">
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-input)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-muted)] shrink-0">
                  <Icon size={15} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-[var(--text-primary)] truncate">{activity.description}</p>
                  <p className="text-xs text-[var(--text-muted)]">{formatTimeAgo(activity.created_at)}</p>
                </div>
                <span className="ml-auto text-xs text-[var(--text-muted)] capitalize">{activity.type}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default memo(RecentActivity);


