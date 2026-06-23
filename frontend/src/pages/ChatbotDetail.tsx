import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bot, ArrowLeft, Loader } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import ErrorState from '../components/common/ErrorState';
import { getBot } from '../services/chatbotService';

export default function ChatbotDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bot, setBot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    if (!id) return;
    setLoading(true);
    setError('');
    getBot(id)
      .then(setBot)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Never';
    const d = new Date(dateStr);
    const now = Date.now();
    const diff = now - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return d.toLocaleDateString();
  };

  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <button
        onClick={() => navigate('/dashboard/chatbots')}
        className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-4 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Chatbots
      </button>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader size={24} className="animate-spin text-[var(--text-muted)]" />
        </div>
      ) : bot && (
        <>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)]">
              <Bot size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-1">{bot.name}</h1>
              <p className="text-sm text-[var(--text-muted)]">{bot.description || 'Manage your chatbot\'s knowledge, chat, and settings.'}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="p-5 lg:col-span-2">
                <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-soft)] mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-input)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)]">
                    <Bot size={16} />
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">Knowledge Base</h3>
                  <span className="ml-auto text-xs text-[var(--text-muted)]">{bot.total_files} files</span>
                </div>
                <p className="text-sm text-[var(--text-muted)] mb-4">
                Upload and manage the documents this chatbot uses to answer questions.
              </p>
              <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard/knowledge')}>
                Manage Files
              </Button>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-soft)] mb-4">
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-input)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)]">
                  <Bot size={16} />
                </div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">Quick Stats</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Status</span>
                  <span className="text-[var(--text-primary)] capitalize">{bot.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Conversations</span>
                  <span className="text-[var(--text-primary)]">{bot.total_chats}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Files</span>
                  <span className="text-[var(--text-primary)]">{bot.total_files}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Last Updated</span>
                  <span className="text-[var(--text-primary)]">{formatDate(bot.updated_at)}</span>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
