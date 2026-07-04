import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Button from '../components/common/Button';
import ChatbotCard from '../components/chatbots/ChatbotCard';
import CreateChatbotModal from '../components/chatbots/CreateChatbotModal';
import UsageLimitBanner from '../components/chatbots/UsageLimitBanner';
import { formatTimeAgo } from '../lib/utils';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import { Bot as BotIcon } from 'lucide-react';
import { listBots, createBot, deleteBot, updateBot, Bot } from '../services/chatbotService';
import { api } from '../lib/api';

export default function ChatbotsPage() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [limit, setLimit] = useState({ used: 0, total: 5 });

  const load = () => {
    setLoading(true);
    setError('');
    // Fetch bots list + just the workspace limits (lightweight) in parallel
    Promise.all([
      listBots(),
      api.billing.current().catch(() => ({ chatbot_limit: 5 }))
    ])
      .then(([botList, billing]) => {
        setBots(botList);
        setLimit({ used: botList.length, total: billing.chatbot_limit ?? 5 });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (name: string) => {
    setCreating(true);
    try {
      await createBot(name);
      setModalOpen(false);
      await load();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (botId: string) => {
    if (!confirm('Are you sure you want to delete this chatbot?')) return;
    try {
      await deleteBot(botId);
      await load();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleRename = async (botId: string, newName: string) => {
    try {
      await updateBot(botId, { name: newName });
      await load();
    } catch (e: any) {
      alert(e.message);
    }
  };

  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-1">Chatbots</h1>
          <p className="text-sm text-[var(--text-muted)]">Create and manage AI assistants powered by your knowledge base.</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setModalOpen(true)} disabled={bots.length >= limit.total}>
          <Plus size={16} />
          New Chatbot
        </Button>
      </div>

      <UsageLimitBanner used={limit.used} limit={limit.total} />

      <div className="mt-6">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5 space-y-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--skeleton-bg)]" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-[var(--skeleton-bg)] rounded w-24" />
                    <div className="h-3 bg-[var(--skeleton-bg)] rounded w-16" />
                  </div>
                </div>
                <div className="h-3 bg-[var(--skeleton-bg)] rounded w-3/4" />
                <div className="h-3 bg-[var(--skeleton-bg)] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : bots.length === 0 ? (
          <EmptyState
            icon={<BotIcon size={28} />}
            title="No chatbots yet"
            description="Create your first AI assistant to get started."
            action={
              <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
                <Plus size={16} />
                Create Chatbot
              </Button>
            }
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bots.map((bot) => (
              <ChatbotCard
                key={bot.id}
                id={bot.id}
                name={bot.name}
                status={bot.status as 'active' | 'draft'}
                filesCount={bot.total_files}
                conversationsCount={bot.total_chats}
                lastUpdated={formatTimeAgo(bot.updated_at || bot.created_at)}
                accessTag={bot.access ? (bot.access as 'view' | 'edit') : undefined}
                onDelete={!bot.access ? () => handleDelete(bot.id) : undefined}
                onRename={!bot.access ? (newName) => handleRename(bot.id, newName) : undefined}
              />
            ))}
          </div>
        )}
      </div>

      <CreateChatbotModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={handleCreate} loading={creating} />
    </div>
  );
}


