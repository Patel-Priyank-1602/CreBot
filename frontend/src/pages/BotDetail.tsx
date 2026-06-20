import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { ArrowLeft, Code, MessageSquare, Settings, Send, Bot } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

export default function BotDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'train' | 'embed' | 'logs' | 'chat'>('train');
  const [faqText, setFaqText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [snippet, setSnippet] = useState('');
  const [widgetKey, setWidgetKey] = useState('');
  const [logs, setLogs] = useState<any[]>([]);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', text: 'Hi! 👋 I\'m your bot. Ask me anything from the FAQ!' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Always fetch the widget key for chat testing
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
      // Build chat history from existing messages (excluding the initial greeting)
      const chat_history = messages
        .filter((_, i) => i > 0) // skip the initial bot greeting
        .map(m => ({
          role: m.role === 'bot' ? 'assistant' : 'user',
          content: m.text,
        }));

      // Add the current question to history
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
    alert('Copied to clipboard!');
  };

  return (
    <div>
      <button className="btn btn-outline mb-4" onClick={() => navigate('/')}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <h1>Bot Management</h1>
      <p>Configure your bot, view chat logs, and get your embed code.</p>

      <div className="flex gap-2 mb-8 mt-4" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', flexWrap: 'wrap' }}>
        <button className={`btn ${activeTab === 'train' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('train')}><Settings size={16}/> Knowledge</button>
        <button className={`btn ${activeTab === 'chat' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('chat')}><Bot size={16}/> Test Chat</button>
        <button className={`btn ${activeTab === 'embed' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('embed')}><Code size={16}/> Embed Code</button>
        <button className={`btn ${activeTab === 'logs' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('logs')}><MessageSquare size={16}/> Chat Logs</button>
      </div>

      {/* ── Knowledge Tab ── */}
      {activeTab === 'train' && (
        <div className="card">
          <h2>Training Data (FAQ)</h2>
          <p>Paste your business's FAQ text below. We will use this to answer customer questions.</p>
          
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
                style={{ minHeight: '200px' }}
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
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ 
            padding: '1rem 1.5rem', 
            borderBottom: '1px solid var(--border)',
            background: 'var(--muted-bg)',
          }}>
            <h2 style={{ margin: 0, fontSize: '1.125rem' }}>Test Chat</h2>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem' }}>
              Chat with your bot to test its responses. Make sure you've trained it first!
            </p>
          </div>

          {/* Messages area */}
          <div style={{ 
            height: '400px', 
            overflowY: 'auto', 
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  ...(msg.role === 'user'
                    ? {
                        background: 'var(--primary)',
                        color: 'var(--primary-fg)',
                        borderBottomRightRadius: '4px',
                      }
                    : {
                        background: 'var(--muted-bg)',
                        border: '1px solid var(--border)',
                        borderBottomLeftRadius: '4px',
                      }),
                }}
              >
                {msg.text}
              </div>
            ))}
            {chatLoading && (
              <div style={{
                alignSelf: 'flex-start',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                background: 'var(--muted-bg)',
                border: '1px solid var(--border)',
                color: 'var(--muted)',
                fontStyle: 'italic',
                fontSize: '0.9rem',
              }}>
                Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border)',
          }}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSendChat(); }}
              placeholder="Type a question..."
              disabled={chatLoading || !widgetKey}
              style={{ flex: 1 }}
            />
            <button
              className="btn btn-primary"
              onClick={handleSendChat}
              disabled={chatLoading || !chatInput.trim() || !widgetKey}
              style={{ padding: '0.75rem 1rem' }}
            >
              <Send size={18} />
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
              <button className="btn btn-primary" onClick={copySnippet}>Copy Snippet</button>
            </div>
          ) : (
            <div>Loading snippet...</div>
          )}
        </div>
      )}

      {/* ── Chat Logs Tab ── */}
      {activeTab === 'logs' && (
        <div className="card">
          <h2>Recent Chat Logs</h2>
          <p>See exactly what your customers are asking.</p>

          {logs.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
              No chats yet. Embed the widget to start collecting queries.
            </div>
          ) : (
            <div className="table-container mt-4">
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
                      <td style={{ whiteSpace: 'nowrap', verticalAlign: 'top', fontSize: '0.875rem' }}>
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td style={{ verticalAlign: 'top', fontWeight: 500 }}>{log.question}</td>
                      <td style={{ verticalAlign: 'top', color: 'var(--muted)' }}>{log.answer || 'No answer generated'}</td>
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
