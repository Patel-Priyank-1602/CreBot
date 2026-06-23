import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import FilterBar from '../components/logs/FilterBar';
import LogsTable from '../components/logs/LogsTable';
import Button from '../components/common/Button';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import { MessageSquare } from 'lucide-react';
import { listLogs, deleteLog, exportLogs, ChatLog, LogFilters } from '../services/chatLogService';

export default function ChatLogsPage() {
  const [logs, setLogs] = useState<ChatLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<LogFilters>({ limit: 50, offset: 0 });

  const load = (f?: LogFilters) => {
    const f2 = f || filters;
    setLoading(true);
    setError('');
    listLogs(f2)
      .then((res) => {
        setLogs(res.logs);
        setTotal(res.total);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleFilterChange = (newFilters: LogFilters) => {
    const combined = { ...filters, ...newFilters, offset: 0 };
    setFilters(combined);
    load(combined);
  };

  const handleDelete = async (logId: string) => {
    if (!confirm('Delete this log?')) return;
    try {
      await deleteLog(logId);
      load();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleExport = async () => {
    try {
      const data = await exportLogs();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-logs-export.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      alert(e.message);
    }
  };

  if (error) return <ErrorState message={error} onRetry={() => load()} />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-1">Chat Logs</h1>
          <p className="text-sm text-[var(--text-muted)]">Review previous conversations and export logs for analysis.</p>
        </div>
        <Button variant="primary" size="sm" onClick={handleExport}>
          <Download size={16} />
          Export Logs
        </Button>
      </div>

      <FilterBar onFilterChange={handleFilterChange} />

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl animate-pulse">
              <div className="h-4 bg-[var(--skeleton-bg)] rounded w-48" />
              <div className="h-4 bg-[var(--skeleton-bg)] rounded w-20" />
              <div className="h-4 bg-[var(--skeleton-bg)] rounded w-16" />
              <div className="h-4 bg-[var(--skeleton-bg)] rounded w-24 ml-auto" />
            </div>
          ))}
        </div>
      ) : logs.length === 0 ? (
        <EmptyState
          icon={<MessageSquare size={28} />}
          title="No logs found"
          description={filters.search || filters.chatbotId ? 'Try adjusting your filters.' : 'No conversations yet. Start chatting with your chatbot.'}
        />
      ) : (
        <>
          <LogsTable logs={logs} onDelete={handleDelete} />
          {total > filters.limit! && (
            <div className="flex justify-center mt-4">
              <Button variant="secondary" size="sm"
                onClick={() => {
                  const newFilters = { ...filters, offset: (filters.offset || 0) + filters.limit! };
                  setFilters(newFilters);
                  load(newFilters);
                }}>
                Load More ({logs.length} of {total})
              </Button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
