import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FileText, Bot } from 'lucide-react';
import Select from '../components/common/Select';
import UploadDropzone from '../components/knowledge/UploadDropzone';
import KnowledgeTable from '../components/knowledge/KnowledgeTable';
import ExportKnowledgeCard from '../components/knowledge/ExportKnowledgeCard';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import { Skeleton as LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { listFiles, KnowledgeFile } from '../services/knowledgeService';
import { listBots } from '../services/chatbotService';

interface BotOption {
  id: string;
  name: string;
}

export default function KnowledgeBasePage() {
  const [files, setFiles] = useState<KnowledgeFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bots, setBots] = useState<BotOption[]>([]);
  const [selectedBotId, setSelectedBotId] = useState<string>('');
  const [botsLoading, setBotsLoading] = useState(true);

  useEffect(() => {
    listBots()
      .then((list) => {
        setBots(list);
        if (list.length > 0) {
          setSelectedBotId(list[0].id);
        }
      })
      .catch(() => {})
      .finally(() => setBotsLoading(false));
  }, []);

  const load = useCallback(() => {
    if (!selectedBotId) return;
    setLoading(true);
    setError('');
    listFiles(selectedBotId)
      .then(setFiles)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [selectedBotId]);

  useEffect(() => {
    if (selectedBotId) {
      load();
    } else {
      setFiles([]);
      setLoading(false);
    }
  }, [selectedBotId, load]);

  const handleBotChange = (botId: string) => {
    setSelectedBotId(botId);
    setFiles([]);
    setLoading(true);
  };

  const selectedBot = bots.find((b) => b.id === selectedBotId);
  const fileCount = files.length;

  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-1">Knowledge Base</h1>
        <p className="text-sm text-[var(--text-muted)]">Upload and manage the files your chatbot uses to answer questions.</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
          Select Chatbot
        </label>
        {botsLoading ? (
          <LoadingSkeleton className="h-10 w-64 rounded-xl" />
        ) : bots.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">Create a chatbot first to manage its knowledge base.</p>
        ) : (
          <div className="w-full max-w-xs">
            <Select
              value={selectedBotId}
              onChange={(val) => handleBotChange(val)}
              options={bots.map((b) => ({ value: b.id, label: b.name }))}
            />
          </div>
        )}
        {selectedBot && (
          <p className="text-xs text-[var(--text-muted)] mt-1.5 flex items-center gap-1.5">
            <Bot size={12} />
            Knowledge for: <span className="font-medium text-[var(--text-secondary)]">{selectedBot.name}</span>
            {fileCount > 0 && (
              <span className="ml-1">— {fileCount} file{fileCount !== 1 ? 's' : ''}</span>
            )}
          </p>
        )}
      </div>

      {selectedBotId && (
        <div className="space-y-6">
          <UploadDropzone onUploadComplete={load} chatbotId={selectedBotId} />
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl animate-pulse">
                  <div className="h-4 bg-[var(--skeleton-bg)] rounded w-48" />
                  <div className="h-4 bg-[var(--skeleton-bg)] rounded w-20" />
                  <div className="h-4 bg-[var(--skeleton-bg)] rounded w-16" />
                  <div className="h-4 bg-[var(--skeleton-bg)] rounded w-24 ml-auto" />
                </div>
              ))}
            </div>
          ) : files.length === 0 ? (
            <EmptyState
              icon={<FileText size={28} />}
              title="No files uploaded for this chatbot yet"
              description="Upload documents to build knowledge for this chatbot."
            />
          ) : (
            <KnowledgeTable files={files} onRefresh={load} chatbotId={selectedBotId} />
          )}
          <ExportKnowledgeCard chatbotId={selectedBotId} />
        </div>
      )}

      {!selectedBotId && !botsLoading && bots.length > 0 && (
        <EmptyState
          icon={<Bot size={28} />}
          title="Select a chatbot"
          description="Please select a chatbot above to view and manage its knowledge base."
        />
      )}
    </motion.div>
  );
}
