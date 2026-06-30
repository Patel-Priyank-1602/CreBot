import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Bot, Loader as LoaderIcon, RotateCcw, X, Maximize2, Minimize2, MonitorSmartphone, Monitor } from 'lucide-react';
import MessageBubble from './MessageBubble';
import QueryInput from './QueryInput';
import { api } from '../../lib/api';
import { listBots, Bot as BotType } from '../../services/chatbotService';
import Select from '../common/Select';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: { name: string; score: number }[];
}

const defaultMessage: Message = { role: 'assistant', content: 'Hello! Welcome. How can I help you?' };

export default function ChatWindow() {
  const [searchParams] = useSearchParams();
  const initialBotId = searchParams.get('bot');
  
  const [messages, setMessages] = useState<Message[]>([defaultMessage]);
  const [loading, setLoading] = useState(false);
  const [bots, setBots] = useState<BotType[]>([]);
  const [selectedBot, setSelectedBot] = useState<BotType | null>(null);
  const [botsLoading, setBotsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'preview' | 'full'>('preview');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listBots().then((list) => {
      setBots(list);
      if (list.length > 0) {
        if (initialBotId) {
          const found = list.find(b => b.id === initialBotId);
          setSelectedBot(found || list[0]);
        } else {
          setSelectedBot(list[0]);
        }
      }
    }).catch(() => {}).finally(() => setBotsLoading(false));
  }, [initialBotId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!selectedBot) return;
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role === 'user' ? 'user' as const : 'assistant' as const, content: m.content }));
      const res = await api.sendChat(selectedBot.id, text, history);
      const sources = res.sources && res.sources.length > 0
        ? res.sources.map((s: any) => ({ name: s.name || `Source`, score: s.score || 0 }))
        : res.source_chunks > 0
          ? [{ name: `Based on ${res.source_chunks} source${res.source_chunks > 1 ? 's' : ''}`, score: 0.9 }]
          : undefined;
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res.answer,
          sources,
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    setMessages((prev) => prev.slice(0, -1));
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUser) handleSend(lastUser.content);
  };

  const renderMessages = () => (
    <div className="w-full space-y-5 relative z-10 pb-4">
      {messages.map((msg, i) => (
        <MessageBubble
          key={i}
          role={msg.role}
          content={msg.content}
          sources={msg.sources}
          onRegenerate={msg.role === 'assistant' && i === messages.length - 1 ? handleRegenerate : undefined}
        />
      ))}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-start gap-3"
        >
          <div className="w-8 h-8 rounded-xl bg-[var(--bg-card)] border border-[var(--border-soft)] flex items-center justify-center">
            <Bot size={16} className="text-[var(--text-primary)]" />
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl rounded-tl-md px-4 py-3">
            <div className="flex items-center gap-1.5">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </div>
        </motion.div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[var(--bg-main)] relative overflow-hidden">
      <div className="flex-1 relative overflow-hidden">
        {/* Background Grid - Only visible in preview mode */}
        {viewMode === 'preview' && (
          <>
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, var(--text-primary) 1px, transparent 1px), linear-gradient(to bottom, var(--text-primary) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--bg-main)_80%)] pointer-events-none"></div>
          </>
        )}

        {viewMode === 'preview' ? (
          <div className="w-full h-full flex items-center justify-center p-4 sm:p-8 relative z-10">
            {/* Widget Container Preview */}
            <div className="w-full max-w-[420px] h-[700px] max-h-full flex flex-col bg-[var(--bg-card)] border border-[#ea580c] rounded-2xl shadow-[0_0_30px_-10px_#ea580c] overflow-hidden relative z-10">
              <header className="flex items-center justify-between px-5 h-16 border-b border-[var(--border-soft)] bg-[var(--bg-elevated)] shrink-0">
                <div className="flex items-center gap-3">
                  {botsLoading ? (
                    <LoaderIcon size={14} className="animate-spin text-[var(--text-muted)]" />
                  ) : (
                    <div className="w-48">
                      <Select
                        variant="ghost"
                        value={selectedBot?.id || ''}
                        onChange={(val) => {
                          const bot = bots.find((b) => b.id === val) || null;
                          setSelectedBot(bot);
                          setMessages([defaultMessage]);
                        }}
                        options={bots.map((b) => ({ value: b.id, label: b.name }))}
                        className="!p-0"
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 text-[var(--text-muted)]">
                  <button onClick={() => setViewMode('full')} className="hover:text-[var(--text-primary)] transition-colors" title="Go to Full Width Testing">
                    <Maximize2 size={16} />
                  </button>
                  <button onClick={() => setMessages([defaultMessage])} className="hover:text-[var(--text-primary)] transition-colors" title="Reset Chat">
                    <RotateCcw size={16} />
                  </button>
                  <button className="hover:text-[var(--text-primary)] transition-colors cursor-default" title="Close (Demo)">
                    <X size={20} />
                  </button>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto px-5 py-6 bg-[var(--bg-main)] relative">
                {renderMessages()}
              </div>

              <div className="shrink-0 bg-[var(--bg-card)] relative z-10">
                <QueryInput onSend={handleSend} onClear={() => setMessages([defaultMessage])} disabled={loading || !selectedBot} />
                <div className="flex items-center justify-center gap-1.5 pb-3">
                  <span className="text-[10px] text-[var(--text-muted)] font-medium">Powered by CreBot</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col relative z-10 bg-[var(--bg-main)]">
            <header className="flex items-center justify-between px-6 h-14 border-b border-[var(--border-soft)] bg-[var(--bg-secondary)] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--btn-bg)] flex items-center justify-center shrink-0">
                  <Bot size={16} className="text-[var(--btn-text)]" />
                </div>
                {botsLoading ? (
                  <LoaderIcon size={14} className="animate-spin text-[var(--text-muted)]" />
                ) : (
                  <div className="w-48">
                    <Select
                      variant="ghost"
                      value={selectedBot?.id || ''}
                      onChange={(val) => {
                        const bot = bots.find((b) => b.id === val) || null;
                        setSelectedBot(bot);
                        setMessages([defaultMessage]);
                      }}
                      options={bots.map((b) => ({ value: b.id, label: b.name }))}
                      className="!p-0"
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 text-[var(--text-muted)]">
                <button onClick={() => setViewMode('preview')} className="hover:text-[var(--text-primary)] transition-colors" title="Back to Preview">
                  <Minimize2 size={16} />
                </button>
                <button onClick={() => setMessages([defaultMessage])} className="hover:text-[var(--text-primary)] transition-colors" title="Reset Chat">
                  <RotateCcw size={16} />
                </button>
              </div>
            </header>
            
            <div className="flex-1 overflow-y-auto px-6 py-6 w-full">
              <div className="max-w-4xl mx-auto">
                {renderMessages()}
              </div>
            </div>
            
            <div className="shrink-0 pt-2 w-full">
              <QueryInput onSend={handleSend} onClear={() => setMessages([defaultMessage])} disabled={loading || !selectedBot} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
