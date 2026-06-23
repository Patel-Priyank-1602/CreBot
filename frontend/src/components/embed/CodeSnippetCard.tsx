import { useState, useEffect } from 'react';
import { Copy, Check, Loader } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { getEmbedScript } from '../../services/embedService';

interface CodeSnippetCardProps {
  chatbotId: string;
  snippet: string;
  onSnippetChange: (snippet: string) => void;
}

export default function CodeSnippetCard({ chatbotId, snippet, onSnippetChange }: CodeSnippetCardProps) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!chatbotId) return;
    
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const widgetUrl = import.meta.env.VITE_WIDGET_URL || `${apiUrl}/widget/crebot-widget.js`;
    
    const newSnippet = `<script
  src="${widgetUrl}"
  data-bot-id="${chatbotId}"
  data-api-url="${apiUrl}"
></script>`;
    
    onSnippetChange(newSnippet);
  }, [chatbotId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card elevated className="p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Embed Script</h3>
        <Button variant="primary" size="sm" onClick={handleCopy} disabled={!snippet || loading}>
          {loading ? <Loader size={14} className="animate-spin" /> :
           copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy Script</>}
        </Button>
      </div>
      <div className="bg-[var(--bg-input)] border border-[var(--border-soft)] rounded-xl p-4 overflow-x-auto min-h-[60px]">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader size={18} className="animate-spin text-[var(--text-muted)]" />
          </div>
        ) : (
          <code className="text-xs text-[var(--text-secondary)] font-mono leading-relaxed whitespace-pre">{snippet || 'Select a chatbot to generate embed code.'}</code>
        )}
      </div>
    </Card>
  );
}
