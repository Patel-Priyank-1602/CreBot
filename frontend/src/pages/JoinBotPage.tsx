import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Loader } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';

export default function JoinBotPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await api.bots.join(code.trim());
      navigate(`/dashboard/chatbots/${res.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to join bot. Please check your code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto mt-10">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--white-alpha-5)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)] mx-auto mb-4">
          <Users size={28} />
        </div>
        <h1 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-1">Join a Bot</h1>
        <p className="text-sm text-[var(--text-muted)]">Enter the share code (widget key) to access a team member's bot.</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleJoin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Share Code
            </label>
            <input
              type="text"
              placeholder="wk_..."
              value={code}
              onChange={(e) => { setCode(e.target.value); setError(''); }}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-default)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-sm text-[var(--text-secondary)]">
              {error}
            </div>
          )}

          <Button type="submit" variant="primary" disabled={loading || !code.trim()} className="w-full justify-center">
            {loading ? <Loader size={16} className="animate-spin" /> : 'Join Bot'}
          </Button>
        </form>
      </Card>
    </motion.div>
  );
}
