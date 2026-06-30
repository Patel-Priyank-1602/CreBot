import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import CodeSnippetCard from '../components/embed/CodeSnippetCard';
import EmbedPreview from '../components/embed/EmbedPreview';
import { Copy, Check, Loader, Code, MonitorSmartphone, Globe, MessageSquare } from 'lucide-react';
import Select from '../components/common/Select';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ErrorState from '../components/common/ErrorState';
import { listBots, Bot } from '../services/chatbotService';



export default function EmbedPage() {
  const [searchParams] = useSearchParams();
  const [bots, setBots] = useState<Bot[]>([]);
  const [selectedBotId, setSelectedBotId] = useState(searchParams.get('bot') || '');
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

  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
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
          <div className="mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="w-full sm:flex-1 max-w-sm">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Select Chatbot</label>
              <Select
                value={selectedBotId}
                onChange={(val) => handleBotChange(val)}
                options={bots.map((b) => ({ value: b.id, label: b.name }))}
              />
            </div>
            <Button 
              variant="secondary" 
              className="w-full sm:w-auto flex justify-center"
              onClick={() => window.open(`/dashboard/rag-chat?bot=${selectedBotId}`, '_blank')}
            >
              <MessageSquare size={16} /> Open Chat
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 mb-4">
            <div className="space-y-4 min-w-0">
              <CodeSnippetCard chatbotId={selectedBotId} />

            </div>
            <div className="space-y-4 min-w-0">
              <EmbedPreview selectedBot={selectedBot} />
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
