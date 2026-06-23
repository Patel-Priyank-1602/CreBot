import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import CodeSnippetCard from '../components/embed/CodeSnippetCard';
import EmbedPreview from '../components/embed/EmbedPreview';
import CustomizationPanel from '../components/embed/CustomizationPanel';
import { Loader, MessageSquare } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ErrorState from '../components/common/ErrorState';
import { listBots, Bot } from '../services/chatbotService';

const steps = [
  { num: 1, text: 'Copy the embed script.' },
  { num: 2, text: 'Paste it before the closing </body> tag.' },
  { num: 3, text: 'Save your website.' },
  { num: 4, text: 'Open your site and test the chatbot.' },
];

export default function EmbedPage() {
  const [searchParams] = useSearchParams();
  const [bots, setBots] = useState<Bot[]>([]);
  const [selectedBotId, setSelectedBotId] = useState(searchParams.get('bot') || '');
  const [snippet, setSnippet] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    listBots()
      .then((botList) => {
        setBots(botList);
        if (!selectedBotId && botList.length > 0) {
          setSelectedBotId(botList[0].id);
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const selectedBot = bots.find((b) => b.id === selectedBotId);

  const handleBotChange = (botId: string) => {
    setSelectedBotId(botId);
  };

  const handleSnippetChange = (newSnippet: string) => {
    setSnippet(newSnippet);
  };

  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-4">
        <h1 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-1">Embed Chatbot</h1>
        <p className="text-sm text-[var(--text-muted)]">Add your RAG chatbot to any website using a simple script.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader size={24} className="animate-spin text-[var(--text-muted)]" />
        </div>
      ) : bots.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-sm text-[var(--text-muted)]">Create a chatbot first to get the embed code.</p>
        </Card>
      ) : (
        <>
          <div className="mb-4 flex items-end justify-between flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Select Chatbot</label>
              <select value={selectedBotId} onChange={(e) => handleBotChange(e.target.value)}
                className="bg-[var(--bg-input)] border border-[var(--border-default)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors w-full min-w-[250px]">
                {bots.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <Button 
              variant="secondary" 
              onClick={() => window.open(`/dashboard/rag-chat?bot=${selectedBotId}`, '_blank')}
            >
              <MessageSquare size={16} /> Open Full-Screen Chat (ChatGPT UI)
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 mb-4">
            <div className="space-y-4">
              <CodeSnippetCard chatbotId={selectedBotId} snippet={snippet} onSnippetChange={handleSnippetChange} />
              <Card className="p-5">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Integration Steps</h3>
                <div className="space-y-3">
                  {steps.map((step) => (
                    <div key={step.num} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[var(--bg-input)] border border-[var(--border-soft)] flex items-center justify-center text-xs text-[var(--text-primary)] font-medium shrink-0">
                        {step.num}
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] pt-1">{step.text}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            <div className="space-y-4">
              <EmbedPreview selectedBot={selectedBot} />
              <CustomizationPanel chatbotId={selectedBotId} />
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
