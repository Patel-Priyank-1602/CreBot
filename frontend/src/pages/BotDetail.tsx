import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { api, setClerkTokenGetter } from '../lib/api';
import { ArrowLeft, Code, MessageSquare, Settings, Send, Bot, Copy, Check } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

export default function BotDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState<'train' | 'embed' | 'logs' | 'chat'>('train');
  const [faqText, setFaqText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [snippet, setSnippet] = useState('');
  const [widgetKey, setWidgetKey] = useState('');
  const [logs, setLogs] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', text: "Hi! 👋 I'm your bot. Ask me anything from the FAQ!" },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Register Clerk token getter synchronously
  setClerkTokenGetter(getToken);

  useEffect(() => {
    api.bots.getSnippet(id!).then(res => {
      setSnippet(res.snippet);
      setWidgetKey(res.widget_key);
    }).catch(console.error);
  }, [id]);

  useEffect(() => {
    if (activeTab === 'logs') {
      api.bots.getLogs(id!).then(res => setLogs(res.logs)).catch(console.error);
    }
  }, [activeTab, id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  const tabs = [
    { key: 'train' as const, icon: <Settings size={15} />, label: 'Knowledge' },
    { key: 'chat' as const, icon: <Bot size={15} />, label: 'Test Chat' },
    { key: 'embed' as const, icon: <Code size={15} />, label: 'Embed Code' },
    { key: 'logs' as const, icon: <MessageSquare size={15} />, label: 'Chat Logs' },
  ];

  return (
    <div>
      <button className="btn btn-outline btn-sm mb-6" onClick={() => navigate('/dashboard')}>
        <ArrowLeft size={15} /> Back to Dashboard
      </button>

      <h1>Bot Management</h1>
      <p>Configure your bot, test it, and get your embed code.</p>

      <div className="tabs mt-4">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`tab-btn ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── Knowledge Tab ── */}
      {activeTab === 'train' && (
        <div className="card">
          <h2>Training Data (FAQ)</h2>
          <p>Paste your business's FAQ text below. We'll chunk, embed, and index it so your bot can answer questions.</p>

          {success && <div className="success-banner">{success}</div>}
          {error && <div className="error-text mb-4">{error}</div>}

          <form onSubmit={handleTrain}>
            <div className="form-group">
              <textarea
                placeholder={"Q: What is your return policy?\nA: You can return items within 30 days.\n\nQ: What are your hours?\nA: We're open Monday-Friday, 9am-5pm."}
                value={faqText}
                onChange={(e) => setFaqText(e.target.value)}
                required
                minLength={20}
                style={{ minHeight: '220px' }}
              />
            </div>
            <button className="btn btn-primary" disabled={loading}>
              {loading ? 'Processing & Embedding...' : 'Train / Update Bot'}
            </button>
          </form>
        </div>
      )}

      {/* ── Test Chat Tab ── */}
      {activeTab === 'chat' && (
        <div className="chat-panel">
          <div className="chat-header">
            <h2>Test Chat</h2>
            <p>Chat with your bot to test its responses. Make sure you've trained it first!</p>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-msg ${msg.role === 'user' ? 'chat-msg-user' : 'chat-msg-bot'}`}
              >
                {msg.text}
              </div>
            ))}
            {chatLoading && (
              <div className="chat-msg-thinking">Thinking…</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-row">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSendChat(); }}
              placeholder="Type a question…"
              disabled={chatLoading || !widgetKey}
            />
            <button
              className="btn btn-primary"
              onClick={handleSendChat}
              disabled={chatLoading || !chatInput.trim() || !widgetKey}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── Embed Code Tab ── */}
      {activeTab === 'embed' && (
        <div className="card">
          <h2>Install Widget</h2>
          <p>Copy and paste this script right before the closing <code>&lt;/body&gt;</code> tag on your website.</p>

          {snippet ? (
            <div>
              <div className="snippet-box mb-4">{snippet}</div>
              <button className="btn btn-primary" onClick={copySnippet}>
                {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Snippet</>}
              </button>
            </div>
          ) : (
            <div className="loading-container" style={{ padding: '2rem' }}>
              <div className="spinner"></div>
            </div>
          )}
        </div>
      )}

      {/* ── Chat Logs Tab ── */}
      {activeTab === 'logs' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem' }}>
            <h2>Recent Chat Logs</h2>
            <p style={{ marginBottom: 0 }}>See exactly what your customers are asking.</p>
          </div>

          {logs.length === 0 ? (
            <div className="empty-state" style={{ padding: '3rem 2rem' }}>
              <div className="empty-state-icon">
                <MessageSquare size={24} />
              </div>
              <p>No chats yet. Embed the widget to start collecting queries.</p>
            </div>
          ) : (
            <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Question</th>
                    <th>Answer</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td style={{ whiteSpace: 'nowrap', verticalAlign: 'top', fontSize: '0.85rem' }}>
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td style={{ verticalAlign: 'top', fontWeight: 500 }}>{log.question}</td>
                      <td style={{ verticalAlign: 'top', color: 'var(--ink-soft)' }}>{log.answer || 'No answer generated'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
