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
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [propActivities]);

  const getActivityIcon = (type: string) => {
    const iconMap: Record<string, React.ElementType> = {
      upload: FileText,
      bot: Bot,
      chat: MessageSquare,
    };
    return iconMap[type] || MessageSquare;
  };

    return(
    <div className = "bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5 flex flex-col max-h-[500px]" >
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Recent Activity</h3>
      </div>
      
      <div className="overflow-y-auto custom-scrollbar pr-2 flex-1">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--skeleton-bg)] animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[var(--skeleton-bg)] rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-[var(--skeleton-bg)] rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)] text-center py-8">No recent activity.</p>
        ) : (
          <div className="space-y-4">
            {(showAll ? activities : activities.slice(0, 5)).map((activity) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-input)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-muted)] shrink-0 transition-colors group-hover:border-[var(--text-muted)]">
                    <Icon size={15} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[var(--text-primary)] break-words whitespace-normal">{activity.description}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{formatTimeAgo(activity.created_at)}</p>
                  </div>
                  <div className="shrink-0 ml-auto">
                    <span className="text-xs text-[var(--text-muted)] capitalize">{activity.type}</span>
                  </div>
                </div>
              );
            })}
            
            {activities.length >= 5 && (
              <button 
                onClick={async () => {
                  if (!showAll && activities.length <= 10) {
                    setLoading(true);
                    try {
                      const moreActivities = await getActivity(100);
                      setActivities(moreActivities);
                    } catch (e) {
                      console.error(e);
                    } finally {
                      setLoading(false);
                    }
                  }
                  setShowAll(!showAll);
                }}
                className="w-full mt-2 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all rounded-lg hover:bg-[var(--white-alpha-5)] border border-transparent hover:border-[var(--white-alpha-10)]"
              >
                {showAll ? 'Show less' : 'See more'}
              </button>
            )}
          </div>
        )}
      </div>
    </div >
  );
}

export default memo(RecentActivity);
