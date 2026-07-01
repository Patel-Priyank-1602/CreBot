import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, Bot, FileText, MessageSquare, HardDrive, AlertTriangle, Loader, Shield } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ErrorState from '../components/common/ErrorState';
import { getStats, listUsers, updateUserStatus, AdminStats, AdminUser } from '../services/adminService';

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState('');
  const tableRef = useRef<HTMLDivElement>(null);

  const load = () => {
    setLoading(true);
    setError('');
    Promise.all([getStats(), listUsers()])
      .then(([s, u]) => {
        setStats(s);
        setUsers(u);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleUserAction = async (wsId: string, action: 'suspend' | 'activate') => {
    setActionLoading(`${wsId}-${action}`);
    try {
      await updateUserStatus(wsId, action);
      load();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setActionLoading('');
    }
  };

  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-4">
        <h1 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-1">Admin</h1>
        <p className="text-sm text-[var(--text-muted)]">System-wide overview and management.</p>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5 animate-pulse">
              <div className="h-8 bg-[var(--skeleton-bg)] rounded w-16 mb-2" />
              <div className="h-4 bg-[var(--skeleton-bg)] rounded w-24" />
            </div>
          ))}
        </div>
      ) : stats && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            <StatCard icon={<Users size={18} />} label="Total Users" value={stats.total_users} />
            <StatCard icon={<Bot size={18} />} label="Total Chatbots" value={stats.total_chatbots} />
            <StatCard icon={<FileText size={18} />} label="Files Uploaded" value={stats.total_files} />
            <StatCard icon={<MessageSquare size={18} />} label="Total Queries" value={stats.total_queries} />
            <StatCard icon={<HardDrive size={18} />} label="Active Workspaces" value={stats.active_workspaces} />
            <StatCard icon={<AlertTriangle size={18} />} label="Failed Jobs" value={stats.failed_jobs} />
          </div>

          <Card className="flex flex-col max-h-[480px]">
            <div className="flex items-center gap-2 px-5 pt-4 pb-3 border-b border-[var(--border-soft)] shrink-0">
              <Users size={15} className="text-[var(--text-muted)]" />
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Users</h3>
              <span className="text-xs text-[var(--text-muted)] ml-auto">{users.length} total</span>
            </div>
            <div ref={tableRef} className="overflow-y-auto flex-1 min-h-0">
              <table className="w-full">
                <thead className="sticky top-0 bg-[var(--bg-card)]">
                  <tr className="border-b border-[var(--border-soft)]">
                    <th className="text-left text-xs font-medium text-[var(--text-muted)] px-4 py-2.5">Name / Email</th>
                    <th className="text-left text-xs font-medium text-[var(--text-muted)] px-4 py-2.5">Plan</th>
                    <th className="text-left text-xs font-medium text-[var(--text-muted)] px-4 py-2.5">Chatbots</th>
                    <th className="text-left text-xs font-medium text-[var(--text-muted)] px-4 py-2.5">Files</th>
                    <th className="text-left text-xs font-medium text-[var(--text-muted)] px-4 py-2.5">Queries</th>
                    <th className="text-left text-xs font-medium text-[var(--text-muted)] px-4 py-2.5">Status</th>
                    <th className="text-right text-xs font-medium text-[var(--text-muted)] px-4 py-2.5">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center text-sm text-[var(--text-muted)] py-8">No users found.</td>
                    </tr>
                  ) : (
                    users.map((user, i) => (
                      <tr key={user.id}
                        className="border-b border-[var(--border-soft)] last:border-0 hover:bg-[var(--hover-soft)] transition-colors"
                      >
                        <td className="px-4 py-2.5 text-sm text-[var(--text-primary)]">{user.email || user.name || 'Unknown'}</td>
                        <td className="px-4 py-2.5 text-sm text-[var(--text-muted)] capitalize">{user.plan}</td>
                        <td className="px-4 py-2.5 text-sm text-[var(--text-muted)]">{user.chatbots}</td>
                        <td className="px-4 py-2.5 text-sm text-[var(--text-muted)]">{user.files}</td>
                        <td className="px-4 py-2.5 text-sm text-[var(--text-muted)]">{user.queries}</td>
                        <td className="px-4 py-2.5">
                          <span className={`text-xs px-2 py-1 rounded-md ${
                            user.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-[var(--bg-input)] text-[var(--text-muted)] border border-[var(--border-soft)]'
                          }`}>
                            {user.status === 'active' ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          {user.status === 'active' ? (
                            <Button variant="danger" size="sm"
                              onClick={() => handleUserAction(user.id, 'suspend')}
                              disabled={actionLoading === `${user.id}-suspend`}>
                              {actionLoading === `${user.id}-suspend` ? <Loader size={12} className="animate-spin" /> : null}
                              Suspend
                            </Button>
                          ) : (
                            <Button variant="secondary" size="sm"
                              onClick={() => handleUserAction(user.id, 'activate')}
                              disabled={actionLoading === `${user.id}-activate`}>
                              {actionLoading === `${user.id}-activate` ? <Loader size={12} className="animate-spin" /> : null}
                              Activate
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </motion.div>
  );
}
