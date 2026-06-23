import { useState } from 'react';
import { Bot, Loader } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';

interface CreateChatbotModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
  loading?: boolean;
}

export default function CreateChatbotModal({ open, onClose, onCreate, loading }: CreateChatbotModalProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && !loading) {
      onCreate(name.trim());
      setName('');
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create New Chatbot">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-3 mb-5 p-3 bg-[var(--bg-input)] rounded-xl border border-[var(--border-soft)]">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
            <Bot size={20} className="text-black" />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">New AI Assistant</p>
            <p className="text-xs text-[var(--text-muted)]">Powered by your knowledge base</p>
          </div>
        </div>
        <Input
          label="Chatbot Name"
          placeholder="e.g. Support Agent, Docs Bot"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          disabled={loading}
        />
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" size="sm" type="button" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="primary" size="sm" type="submit" disabled={!name.trim() || loading}>
            {loading ? <Loader size={14} className="animate-spin" /> : null}
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
