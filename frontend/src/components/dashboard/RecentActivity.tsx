import { memo, useState, useEffect } from 'react';
import { FileText, MessageSquare, Bot } from 'lucide-react';
import { formatTimeAgo } from '../../lib/utils';
import { getActivity, ActivityItem } from '../../services/dashboardService';

interface RecentActivityProps {
  activities?: ActivityItem[];
  loading?: boolean;
}

function RecentActivity({ activities: propActivities, loading: propLoading }: RecentActivityProps) {
  const [activities, setActivities] = useState<ActivityItem[]>(propActivities || []);
  const [loading, setLoading] = useState(propLoading ?? !propActivities);
  const [showAll, setShowAll] = useState(false);
  const displayedActivities = showAll ? activities : activities.slice(0, 5);

  // Sync from parent props when provided
  useEffect(() => {
    if (propActivities !== undefined) {
      setActivities(propActivities);
    }
  }, [propActivities]);

  useEffect(() => {
    if (propLoading !== undefined) {
      setLoading(propLoading);
    }
  }, [propLoading]);

  // Only fetch independently if no props are provided
  useEffect(() => {
    if (propActivities !== undefined) return;
    getActivity()
      .then(setActivities)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [propActivities]);

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
          {displayedActivities.map((activity) => {
            const Icon = iconMap[activity.type] || MessageSquare;
            return (
              <div key={activity.id} className="flex items-center gap-3 py-2 group">
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-input)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-muted)] shrink-0 transition-colors group-hover:border-[var(--text-muted)]">
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
          
          {activities.length > 5 && (
            <button 
              onClick={() => setShowAll(!showAll)}
              className="w-full mt-2 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all rounded-lg hover:bg-[var(--white-alpha-5)] border border-transparent hover:border-[var(--white-alpha-10)]"
            >
              {showAll ? 'Show less' : 'See more'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(RecentActivity);
