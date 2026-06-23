import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { api, setClerkTokenGetter } from '../lib/api';
import { cn } from '../lib/utils';
import { ArrowLeft, Code, MessageSquare, Settings, Send, Bot, Copy, Check, Users, Trash2, UserPlus, Mail } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

const TABS = [
  { key: 'train' as const, icon: <Settings size={15} />, label: 'Knowledge' },
  { key: 'chat' as const, icon: <Bot size={15} />, label: 'Test Chat' },
  { key: 'embed' as const, icon: <Code size={15} />, label: 'Embed Code' },
  { key: 'logs' as const, icon: <MessageSquare size={15} />, label: 'Chat Logs' },
  { key: 'members' as const, icon: <Users size={15} />, label: 'Members & Settings' },
];

export default function BotDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState<'train' | 'embed' | 'logs' | 'chat' | 'members'>('train');
  const [faqText, setFaqText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [snippet, setSnippet] = useState('');
  const [widgetKey, setWidgetKey] = useState('');
  const [logs, setLogs] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  const [isOwner, setIsOwner] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [addSuccess, setAddSuccess] = useState('');
  const [addError, setAddError] = useState('');

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', text: "Hi! 👋 I'm your bot. Ask me anything from the FAQ!" },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setClerkTokenGetter(getToken);
  }, [getToken]);

  useEffect(() => {
    api.bots.get(id!).then(res => {
      setIsOwner(res.is_owner);
    }).catch(console.error);

    api.bots.getSnippet(id!).then(res => {
      setSnippet(res.snippet);
      setWidgetKey(res.widget_key);
    }).catch(console.error);
  }, [id]);

  useEffect(() => {
    if (activeTab === 'logs') {
      api.bots.getLogs(id!).then(res => setLogs(res.logs)).catch(console.error);
    } else if (activeTab === 'members' && isOwner) {
      api.bots.getMembers(id!).then(res => setMembers(res)).catch(console.error);
    }
  }, [activeTab, id, isOwner]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  const handleTrain = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.bots.retrain(id!, { faq_text: faqText });
      setSuccess(`${res.message} Generated ${res.chunks_created} chunks.`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendChat = async () => {
    const question = chatInput.trim();
    if (!question || !widgetKey) return;

    setMessages(prev => [...prev, { role: 'user', text: question }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const chat_history = messages
        .filter((_, i) => i > 0)
        .map(m => ({
          role: m.role === 'bot' ? 'assistant' : 'user',
          content: m.text,
        }));
      chat_history.push({ role: 'user', content: question });

      const res = await api.chat(widgetKey, question, chat_history);
      setMessages(prev => [...prev, { role: 'bot', text: res.answer }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Error: ' + err.message }]);
    } finally {
      setChatLoading(false);
    }
  };

  const copySnippet = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    
    setInviteLoading(true);
    setAddSuccess('');
    setAddError('');
    try {
      await api.bots.addMember(id!, inviteEmail.trim());
      setAddSuccess(inviteEmail.trim());
      setInviteEmail('');
      api.bots.getMembers(id!).then(res => setMembers(res)).catch(console.error);
    } catch (err: any) {
      setAddError(err.message);
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    try {
      await api.bots.removeMember(id!, memberId);
      setMembers(prev => prev.filter(m => m.id !== memberId));
    } catch (err: any) {
      alert('Failed to remove member: ' + err.message);
    }
  };

  const handleDeleteBot = async () => {
    if (!confirm('Are you absolutely sure you want to delete this bot? This action cannot be undone.')) return;
    try {
      await api.bots.delete(id!);
      navigate('/dashboard');
    } catch (err: any) {
      alert('Failed to delete bot: ' + err.message);
    }
  };

  return (
    <div className="px-4">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-6 transition-colors bg-transparent border-none cursor-pointer"
      >
        <ArrowLeft size={15} /> Back to Dashboard
      </button>

      <h1 className="text-xl font-display font-bold text-[var(--text-primary)] mb-1">Bot Management</h1>
      <p className="text-sm text-[var(--text-muted)] mb-4">Configure your bot, test it, and get your embed code.</p>

      <div className="flex flex-wrap gap-1 mb-6 border-b border-[var(--border-soft)] pb-1">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={cn(
              'inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-xl border-none cursor-pointer transition-all duration-150',
              activeTab === t.key
                ? 'bg-[var(--active-bg)] text-[var(--text-primary)]'
                : 'bg-transparent text-[var(--text-muted)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]'
            )}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── Knowledge Tab ── */}
      {activeTab === 'train' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-6">
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-1">Training Data (FAQ)</h2>
          <p className="text-sm text-[var(--text-muted)] mb-4">Paste your business's FAQ text below. We'll chunk, embed, and index it so your bot can answer questions.</p>

          {success && (
            <div className="mb-4 p-3 rounded-xl bg-[var(--white-alpha-10)] border border-[var(--white-alpha-20)] text-sm text-[var(--text-primary)]">
              {success}
            </div>
          )}
          {error && <div className="mb-4 p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-sm text-[var(--text-secondary)]">{error}</div>}

          <form onSubmit={handleTrain}>
            <div className="mb-4">
              <textarea
                placeholder={"Q: What is your return policy?\nA: You can return items within 30 days.\n\nQ: What are your hours?\nA: We're open Monday-Friday, 9am-5pm."}
                value={faqText}
                onChange={(e) => setFaqText(e.target.value)}
                required
                minLength={20}
                disabled={!isOwner}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-default)] rounded-xl p-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] transition-colors resize-vertical"
                style={{ minHeight: '220px' }}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !isOwner}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 bg-[var(--btn-bg)] text-[var(--btn-text)] hover:bg-[var(--btn-hover)] border border-[var(--btn-bg)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing & Embedding...' : (isOwner ? 'Train / Update Bot' : 'Only owner can train')}
            </button>
          </form>
        </div>
      )}

      {/* ── Test Chat Tab ── */}
      {activeTab === 'chat' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-[var(--border-soft)]">
            <h2 className="text-base font-semibold text-[var(--text-primary)] mb-1">Test Chat</h2>
            <p className="text-sm text-[var(--text-muted)]">Chat with your bot to test its responses. Make sure you've trained it first!</p>
          </div>

          <div className="p-5 space-y-3 max-h-[400px] overflow-y-auto">
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  padding: '10px 16px',
                  borderRadius: '14px',
                  fontSize: '14px',
                  maxWidth: '80%',
                  lineHeight: 1.5,
                  background: msg.role === 'user' ? 'var(--btn-bg)' : 'var(--bg-input)',
                  color: msg.role === 'user' ? 'var(--btn-text)' : 'var(--text-primary)',
                  border: msg.role === 'bot' ? '1px solid var(--border-soft)' : 'none',
                  marginLeft: msg.role === 'user' ? 'auto' : '0',
                  marginRight: msg.role === 'bot' ? 'auto' : '0',
                }}
              >
                {msg.text}
              </div>
            ))}
            {chatLoading && (
              <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] p-3">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center gap-2 p-4 border-t border-[var(--border-soft)]">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSendChat(); }}
              placeholder="Type a question..."
              disabled={chatLoading || !widgetKey}
              className="flex-1 bg-[var(--bg-input)] border border-[var(--border-default)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
            />
            <button
              onClick={handleSendChat}
              disabled={chatLoading || !chatInput.trim() || !widgetKey}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--btn-bg)] text-[var(--btn-text)] hover:bg-[var(--btn-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── Embed Code Tab ── */}
      {activeTab === 'embed' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-6">
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-1">Install Widget</h2>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Copy and paste this script right before the closing <code className="text-[var(--text-secondary)] bg-[var(--bg-input)] px-1 rounded">&lt;/body&gt;</code> tag on your website.
          </p>

          {snippet ? (
            <div>
              <div className="bg-[var(--bg-input)] border border-[var(--border-soft)] rounded-xl p-4 mb-4 overflow-x-auto">
                <code className="text-xs text-[var(--text-secondary)] font-mono whitespace-pre">{snippet}</code>
              </div>
              <button
                onClick={copySnippet}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 bg-[var(--btn-bg)] text-[var(--btn-text)] hover:bg-[var(--btn-hover)] border border-[var(--btn-bg)]"
              >
                {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Snippet</>}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-[var(--border-default)] border-t-[var(--text-primary)] rounded-full animate-spin" />
            </div>
          )}
        </div>
      )}

      {/* ── Chat Logs Tab ── */}
      {activeTab === 'logs' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl overflow-hidden">
          <div className="p-5">
            <h2 className="text-base font-semibold text-[var(--text-primary)] mb-1">Recent Chat Logs</h2>
            <p className="text-sm text-[var(--text-muted)]">See exactly what your customers are asking.</p>
          </div>

          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare size={24} className="text-[var(--text-muted)] mb-3" />
              <p className="text-sm text-[var(--text-muted)]">No chats yet. Embed the widget to start collecting queries.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-soft)]">
                    <th className="text-left text-xs font-medium text-[var(--text-muted)] px-5 py-3">Time</th>
                    <th className="text-left text-xs font-medium text-[var(--text-muted)] px-5 py-3">Question</th>
                    <th className="text-left text-xs font-medium text-[var(--text-muted)] px-5 py-3">Answer</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-[var(--border-soft)] last:border-0 hover:bg-[var(--hover-soft)] transition-colors">
                      <td className="px-5 py-3 text-sm text-[var(--text-muted)] whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-sm text-[var(--text-primary)] font-medium">{log.question}</td>
                      <td className="px-5 py-3 text-sm text-[var(--text-secondary)]">{log.answer || 'No answer generated'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Members & Settings Tab ── */}
      {activeTab === 'members' && (
        <div className="flex flex-col gap-6">
          <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-6">
            <h2 className="text-base font-semibold text-[var(--text-primary)] mb-1">Bot Members</h2>
            <p className="text-sm text-[var(--text-muted)] mb-4">Add team members by their email address. They'll get access when they log in.</p>

            {isOwner ? (
              <div>
                <form onSubmit={handleAddMember} className="flex gap-2 mb-4 items-start">
                  <div className="flex-1">
                    <input 
                      type="email" 
                      placeholder="teammate@example.com" 
                      value={inviteEmail}
                      onChange={e => { setInviteEmail(e.target.value); setAddSuccess(''); setAddError(''); }}
                      required
                      className="w-full bg-[var(--bg-input)] border border-[var(--border-default)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={inviteLoading}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 bg-[var(--btn-bg)] text-[var(--btn-text)] hover:bg-[var(--btn-hover)] border border-[var(--btn-bg)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <UserPlus size={16} /> {inviteLoading ? 'Adding...' : 'Add Member'}
                  </button>
                </form>

                {addSuccess && (
                  <div className="mb-4 p-3 rounded-xl bg-[var(--white-alpha-10)] border border-[var(--white-alpha-20)] flex items-center justify-between flex-wrap gap-2">
                    <span className="text-sm text-[var(--text-primary)]">
                      <strong className="font-semibold">{addSuccess}</strong> has been added! They'll see this bot when they log in.
                    </span>
                    <a
                      href={`mailto:${addSuccess}?subject=You've been added to a CreBot bot!&body=Hi!%0A%0AYou've been added as a member to a bot on CreBot. Log in to your dashboard to access it:%0A%0A${encodeURIComponent(window.location.origin)}/dashboard%0A%0ACheers!`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--bg-input)] border border-[var(--border-soft)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-colors no-underline"
                    >
                      <Mail size={14} /> Notify via Email
                    </a>
                  </div>
                )}

                {addError && (
                  <div className="mb-4 p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-default)] text-sm text-[var(--text-secondary)]">
                    {addError}
                  </div>
                )}

                {members.length === 0 ? (
                  <div className="py-8 text-center text-sm text-[var(--text-muted)]">
                    No members added yet. Add your team members using the form above!
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[var(--border-soft)]">
                          <th className="text-left text-xs font-medium text-[var(--text-muted)] px-4 py-3">Email</th>
                          <th className="text-left text-xs font-medium text-[var(--text-muted)] px-4 py-3">Status</th>
                          <th className="text-left text-xs font-medium text-[var(--text-muted)] px-4 py-3">Added</th>
                          <th className="text-right text-xs font-medium text-[var(--text-muted)] px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map(member => (
                          <tr key={member.id} className="border-b border-[var(--border-soft)] last:border-0 hover:bg-[var(--hover-soft)] transition-colors">
                            <td className="px-4 py-3 text-sm text-[var(--text-primary)] font-medium">{member.member_email}</td>
                            <td className="px-4 py-3">
                              <span style={{
                                display: 'inline-block',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                fontWeight: 500,
                                background: member.clerk_user_id ? 'rgba(52, 211, 153, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                                color: member.clerk_user_id ? '#34d399' : '#fbbf24',
                              }}>
                                {member.clerk_user_id ? 'Active' : 'Pending'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-[var(--text-muted)]">
                              {new Date(member.joined_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button 
                                onClick={() => handleRemoveMember(member.id)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-transparent border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors"
                              >
                                <Trash2 size={14} /> Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users size={24} className="text-[var(--text-muted)] mb-3" />
                <p className="text-sm text-[var(--text-muted)]">Only the owner can view and manage members.</p>
              </div>
            )}
          </div>

          {isOwner && (
            <div className="bg-[var(--bg-card)] border border-red-500/30 rounded-2xl p-6">
              <h2 className="text-base font-semibold text-red-400 mb-1">Advanced Settings</h2>
              <p className="text-sm text-[var(--text-muted)] mb-4">Deleting this bot will permanently remove its training data, chat logs, and members.</p>
              <button 
                onClick={handleDeleteBot}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 bg-red-500/80 text-white hover:bg-red-500 border border-red-500/50"
              >
                <Trash2 size={16} /> Delete Bot
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
