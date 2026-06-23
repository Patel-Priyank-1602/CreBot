import { Bot, MessageSquare } from 'lucide-react';
import Card from '../common/Card';
import { Bot as BotType } from '../../services/chatbotService';

interface EmbedPreviewProps {
  selectedBot?: BotType | null;
}

export default function EmbedPreview({ selectedBot }: EmbedPreviewProps) {
  const botName = selectedBot?.name || 'Support Agent';
  const welcomeMsg = selectedBot?.welcome_message || 'Hi! How can I help you today?';

  return (
    <Card elevated className="p-5">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Widget Preview</h3>
      <div className="relative bg-[var(--bg-input)] border border-[var(--border-soft)] rounded-2xl p-4 min-h-[220px] flex items-end justify-end">
        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl w-72 shadow-2xl shadow-[var(--black-alpha-50)] overflow-hidden">
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[var(--border-soft)]">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
              <Bot size={14} className="text-black" />
            </div>
            <span className="text-sm font-medium text-[var(--text-primary)]">{botName}</span>
          </div>
          <div className="p-4 space-y-3">
            <div className="bg-[#0D0D0D] rounded-xl px-3 py-2">
              <p className="text-xs text-[var(--text-muted)]">{welcomeMsg}</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 border border-[var(--border-soft)] rounded-xl">
              <span className="text-xs text-[var(--text-muted)] flex-1">Ask a question...</span>
              <div className="w-6 h-6 rounded-lg bg-[var(--white-alpha-10)] flex items-center justify-center">
                <MessageSquare size={12} className="text-[var(--text-muted)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
