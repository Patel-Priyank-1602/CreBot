import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Bot, Plus } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [bots, setBots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

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

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1>Your Bots</h1>
          <p>Manage your AI assistants</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreateBot} disabled={creating}>
          <Plus size={18} /> {creating ? 'Creating...' : 'Create Bot'}
        </button>
      </div>

      {error && <div className="error-text mb-4">{error}</div>}

      {bots.length === 0 ? (
        <div className="card flex flex-col items-center" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <Bot size={48} style={{ color: 'var(--muted)', marginBottom: '1rem' }} />
          <h3>No bots yet</h3>
          <p>Create your first chatbot to start answering customer queries automatically.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {bots.map(bot => (
            <div key={bot.id} className="card flex items-center justify-between" style={{ cursor: 'pointer' }} onClick={() => navigate(`/bot/${bot.id}`)}>
              <div className="flex items-center gap-4">
                <div style={{ padding: '1rem', background: 'var(--muted-bg)', borderRadius: '8px' }}>
                  <Bot size={24} />
                </div>
                <div>
                  <h3 style={{ margin: 0 }}>{bot.name}</h3>
                  <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                    Created: {new Date(bot.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <button className="btn btn-outline">Manage</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
