import { useRef, useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Bot, PanelRight, Sparkles, Loader as LoaderIcon } from 'lucide-react';
import MessageBubble from './MessageBubble';
import QueryInput from './QueryInput';
import { cn } from '../../lib/utils';
import { api } from '../../lib/api';
import { listBots, Bot as BotType } from '../../services/chatbotService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: { name: string; score: number }[];
}

const suggestedPrompts = [
  'Summarize the uploaded document.',
  'What are the key points from this knowledge base?',
  'Find the section related to pricing.',
  'Explain this in simple words.',
];

export default function ChatWindow() {
  const [searchParams] = useSearchParams();
  const initialBotId = searchParams.get('bot');
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [bots, setBots] = useState<BotType[]>([]);
  const [selectedBot, setSelectedBot] = useState<BotType | null>(null);
  const [botsLoading, setBotsLoading] = useState(true);
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

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-6 h-14 border-b border-[var(--border-soft)] bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--btn-bg)] flex items-center justify-center">
              <Bot size={16} className="text-[var(--btn-text)]" />
            </div>
            <div>
              {botsLoading ? (
                <LoaderIcon size={14} className="animate-spin text-[var(--text-muted)]" />
              ) : (
                <select value={selectedBot?.id || ''} onChange={(e) => {
                  const bot = bots.find((b) => b.id === e.target.value) || null;
                  setSelectedBot(bot);
                  setMessages([]);
                }}
                  className="bg-transparent text-sm font-semibold text-[var(--text-primary)] border-none outline-none cursor-pointer">
                  {bots.map((b) => (
                    <option key={b.id} value={b.id} className="bg-[var(--bg-secondary)]">{b.name}</option>
                  ))}
                </select>
              )}
              {selectedBot && (
                <p className="text-[10px] text-[var(--text-muted)]">Ask your knowledge base anything</p>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)] mb-5">
                <Sparkles size={28} />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Ask your knowledge base anything</h3>
              <p className="text-sm text-[var(--text-muted)] mb-8">
                Your chatbot will search uploaded documents and generate a grounded answer with relevant sources.
              </p>
              {selectedBot && (
                <div className="grid grid-cols-2 gap-2 w-full">
                  {suggestedPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSend(prompt)}
                      className="text-xs text-left px-3 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-soft)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-default)] transition-all"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-5">
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
          )}
        </div>

        <QueryInput onSend={handleSend} onClear={() => setMessages([])} disabled={loading || !selectedBot} />
      </div>
    </div>
  );
}
