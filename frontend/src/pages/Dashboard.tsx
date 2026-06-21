import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { api, setClerkTokenGetter } from '../lib/api';
import { Bot, Plus } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [bots, setBots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  // Register Clerk token getter synchronously on every render
  setClerkTokenGetter(getToken);

  const fetchBots = async () => {
    try {
      const data = await api.bots.list();
      setBots(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBots();
  }, []);

  const handleCreateBot = async () => {
    try {
      setCreating(true);
      setError('');
      const name = prompt("Enter a name for your bot (e.g., 'Support Bot'):");
      if (!name) return;

      const newBot = await api.bots.create({ name });
      navigate(`/bot/${newBot.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <span style={{ color: 'var(--ink-soft)', fontSize: '14px' }}>Loading your bots…</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1>Your Bots</h1>
          <p style={{ margin: 0 }}>Create and manage your AI support chatbots</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreateBot} disabled={creating}>
          <Plus size={18} /> {creating ? 'Creating...' : 'Create Bot'}
        </button>
      </div>

      {error && <div className="error-text mb-4">{error}</div>}

      {bots.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">
            <Bot size={28} />
          </div>
          <h3>No bots yet</h3>
          <p style={{ maxWidth: 340 }}>Create your first chatbot to start answering customer queries automatically.</p>
          <button className="btn btn-primary mt-4" onClick={handleCreateBot}>
            <Plus size={16} /> Create your first bot
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {bots.map(bot => (
            <div
              key={bot.id}
              className="card card-interactive bot-card"
              onClick={() => navigate(`/bot/${bot.id}`)}
            >
              <div className="bot-card-info">
                <div className="bot-card-avatar">
                  <Bot size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0 }}>{bot.name}</h3>
                  <div className="bot-card-meta">
                    Created {new Date(bot.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <button className="btn btn-outline btn-sm">Manage →</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
