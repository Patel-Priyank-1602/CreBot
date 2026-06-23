import { useState, memo } from 'react';
import { Eye, Download, Trash2 } from 'lucide-react';
import { formatTimeAgo } from '../../lib/utils';
import { ChatLog } from '../../services/chatLogService';

interface LogsTableProps {
  logs: ChatLog[];
  onDelete: (id: string) => void;
}

function LogsTable({ logs, onDelete }: LogsTableProps) {
  const [viewingLog, setViewingLog] = useState<ChatLog | null>(null);

  return (
    <>
      <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-soft)]">
                <th className="text-left text-xs font-medium text-[var(--text-muted)] px-5 py-3">User Question</th>
                <th className="text-left text-xs font-medium text-[var(--text-muted)] px-5 py-3">Chatbot</th>
                <th className="text-left text-xs font-medium text-[var(--text-muted)] px-5 py-3">Date</th>
                <th className="text-left text-xs font-medium text-[var(--text-muted)] px-5 py-3">Status</th>
                <th className="text-right text-xs font-medium text-[var(--text-muted)] px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-[var(--border-soft)] last:border-0 hover:bg-[var(--hover-soft)] transition-colors"
                >
                  <td className="px-5 py-3.5 text-sm text-[var(--text-primary)] max-w-[250px] truncate">{log.user_question}</td>
                  <td className="px-5 py-3.5 text-sm text-[var(--text-muted)]">{log.chatbot_name || '-'}</td>
                  <td className="px-5 py-3.5 text-sm text-[var(--text-muted)]">{formatTimeAgo(log.created_at)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2 py-1 rounded-md ${
                      log.status === 'answered' ? 'bg-[var(--white-alpha-10)] text-[var(--text-primary)]' : 'bg-[var(--bg-input)] text-[var(--text-muted)] border border-[var(--border-soft)]'
                    }`}>
                      {log.status === 'answered' ? 'Answered' : log.status === 'unanswered' ? 'Unanswered' : 'Failed'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setViewingLog(log)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-soft)] transition-colors">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => onDelete(log.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-soft)] transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {viewingLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setViewingLog(null)}>
            <div className="absolute inset-0 bg-[var(--black-alpha-70)] backdrop-blur-sm" />
            <div className="relative w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}>
              <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4">Conversation Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">Question</p>
                  <p className="text-sm text-[var(--text-primary)] bg-[var(--bg-input)] rounded-xl p-3 border border-[var(--border-soft)]">{viewingLog.user_question}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">Answer</p>
                  <p className="text-sm text-[var(--text-primary)] bg-[var(--bg-input)] rounded-xl p-3 border border-[var(--border-soft)] whitespace-pre-wrap">
                    {viewingLog.bot_answer || 'No answer'}
                  </p>
                </div>
                <div className="flex gap-3 text-xs text-[var(--text-muted)]">
                  <span>Chatbot: {viewingLog.chatbot_name || '-'}</span>
                  <span>Status: {viewingLog.status}</span>
                  <span>{formatTimeAgo(viewingLog.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  export default memo(LogsTable);
