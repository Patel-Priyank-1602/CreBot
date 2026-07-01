import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Loader, Bot, ExternalLink, CheckCircle, LogIn } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import type { Bot as BotType } from '../services/chatbotService';

export default function JoinBotPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [joinedBots, setJoinedBots] = useState<BotType[]>([]);
  const [botsLoading, setBotsLoading] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const loadJoinedBots = async () => {
    setBotsLoading(true);
    try {
      const bots = await api.bots.listJoined();
      setJoinedBots(bots);
    } catch {
      // silently fail
    } finally {
      setBotsLoading(false);
    }
  };

  useEffect(() => {
    loadJoinedBots();
  }, []);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.bots.join(code.trim());
      setSuccess(`Successfully joined "${res.name}"!`);
      setCode('');
      await loadJoinedBots();
    } catch (err: any) {
      setError(err.message || 'Failed to join bot. Please check your code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-4">
        <h1 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-1">Join a Bot</h1>
        <p className="text-sm text-[var(--text-muted)]">Enter the share code to access a team member's bot.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Left: Join Form */}
        <div className="lg:col-span-2">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <LogIn size={15} className="text-cyan-500" />
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">Enter Code</h2>
            </div>
            <form onSubmit={handleJoin} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                  Share Code
                </label>
                <input
                  type="text"
                  placeholder="Paste invite code here..."
                  value={code}
                  onChange={(e) => { setCode(e.target.value); setError(''); setSuccess(''); }}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-default)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                />
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400"
                  >
                    {error}
                  </motion.div>
                )}
                {success && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 flex items-center gap-2"
                  >
                    <CheckCircle size={16} />
                    {success}
                  </motion.div>
                )}
              </AnimatePresence>

              <Button type="submit" variant="primary" disabled={loading || !code.trim()} className="w-full justify-center">
                {loading ? <Loader size={16} className="animate-spin" /> : 'Join Bot'}
              </Button>
            </form>
          </Card>
        </div>

        {/* Right: Joined Bots */}
        <div className="lg:col-span-3 flex flex-col max-h-[500px]">
          <div className="flex items-center gap-2 mb-3">
            <Bot size={16} className="text-[var(--text-muted)]" />
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Your Joined Bots</h2>
            <span className="text-xs text-[var(--text-muted)] ml-auto">{joinedBots.length} bot{joinedBots.length !== 1 ? 's' : ''}</span>
          </div>

          {botsLoading ? (
            <div className="space-y-2 overflow-y-auto flex-1 min-h-0 pr-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--skeleton-bg)]" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-[var(--skeleton-bg)] rounded w-28" />
                      <div className="h-3 bg-[var(--skeleton-bg)] rounded w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : joinedBots.length === 0 ? (
            <Card className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[var(--white-alpha-5)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-muted)] mx-auto mb-3">
                  <Bot size={22} />
                </div>
                <p className="text-sm text-[var(--text-muted)]">No joined bots yet.</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Enter a share code above to get started.</p>
              </div>
            </Card>
          ) : (
            <div ref={listRef} className="space-y-2 overflow-y-auto flex-1 min-h-0 pr-1">
              {joinedBots.map((bot, index) => (
                <motion.div
                  key={bot.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <Card className="p-4 hover:border-[var(--border-default)] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--bg-input)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)] shrink-0">
                        <Bot size={20} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate">{bot.name}</h3>
                          {bot.access && (
                            <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-md shrink-0 ${
                              bot.access === 'edit'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                                : 'bg-sky-500/15 text-sky-400 border border-sky-500/25'
                            }`}>
                              {bot.access}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">
                          {bot.total_files} files / {bot.total_chats} chats
                        </p>
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate(`/dashboard/chatbots/${bot.id}`)}
                        className="shrink-0"
                      >
                        Open
                        <ExternalLink size={13} className="ml-1" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
