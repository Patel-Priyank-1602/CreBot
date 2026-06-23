import { memo } from 'react';
import { Bot, FileText, MessageSquare, ExternalLink, Settings as SettingsIcon, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

interface ChatbotCardProps {
  id: string;
  name: string;
  status: 'active' | 'draft';
  filesCount: number;
  conversationsCount: number;
  lastUpdated: string;
  onDelete?: () => void;
}

function ChatbotCard({
  id,
  name,
  status,
  filesCount,
  conversationsCount,
  lastUpdated,
  onDelete,
}: ChatbotCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5 hover:border-[var(--border-default)] transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-input)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)]">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">{name}</h3>
            <span className={`text-xs ${status === 'active' ? 'text-white/60' : 'text-[var(--text-muted)]'}`}>
              {status === 'active' ? 'Active' : 'Draft'}
            </span>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-md text-xs ${
          status === 'active' ? 'bg-[var(--white-alpha-10)] text-[var(--text-primary)]' : 'bg-[var(--bg-input)] text-[var(--text-muted)] border border-[var(--border-soft)]'
        }`}>
          {status === 'active' ? 'Active' : 'Draft'}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 text-xs text-[var(--text-muted)]">
        <span className="flex items-center gap-1.5"><FileText size={13} /> {filesCount} files</span>
        <span className="flex items-center gap-1.5"><MessageSquare size={13} /> {conversationsCount} chats</span>
        <span className="ml-auto">{lastUpdated}</span>
      </div>

      <div className="flex gap-2">
        <Button variant="primary" size="sm" className="flex-1" onClick={() => navigate(`/dashboard/chatbots/${id}`)}>
          Open
        </Button>
        <Button variant="secondary" size="sm" onClick={() => navigate(`/dashboard/embed?bot=${id}`)}>
          <ExternalLink size={14} />
        </Button>
        {onDelete && (
          <Button variant="danger" size="sm" onClick={onDelete}>
            <Trash2 size={14} />
          </Button>
        )}
      </div>
    </motion.div>
  );
}

export default memo(ChatbotCard);
