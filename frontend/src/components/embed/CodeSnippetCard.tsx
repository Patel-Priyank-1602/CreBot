import { useState, useEffect } from 'react';
import { Copy, Check, Loader, Code, FileCode2, Globe } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

interface CodeSnippetCardProps {
  chatbotId: string;
}

type TabType = 'html' | 'react' | 'ajax';

export default function CodeSnippetCard({ chatbotId }: CodeSnippetCardProps) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('html');
  const [snippets, setSnippets] = useState<Record<TabType, string>>({
    html: '',
    react: '',
    ajax: ''
  });

  useEffect(() => {
    if (!chatbotId) return;
    setLoading(true);

    // Simulate loading for smooth transition
    setTimeout(() => {
      const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? 'https://crebot-ole4.onrender.com' : 'http://localhost:8000');
      const widgetUrl =
        (import.meta.env.VITE_WIDGET_URL || `${apiUrl}/widget/crebot-widget.js`) + '?v=2';

      setSnippets({
        html: `<script
  src="${widgetUrl}"
  data-bot-id="${chatbotId}"
  data-api-url="${apiUrl}"
></script>`,
        react: `import { useEffect } from 'react';

export default function ChatbotWidget() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "${widgetUrl}";
    script.setAttribute('data-bot-id', "${chatbotId}");
    script.setAttribute('data-api-url', "${apiUrl}");
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}`,
        ajax: `// Example AJAX Setup to dynamically load the widget
const loadCreBot = () => {
  const script = document.createElement('script');
  script.src = "${widgetUrl}";
  script.setAttribute('data-bot-id', "${chatbotId}");
  script.setAttribute('data-api-url', "${apiUrl}");
  script.onload = () => console.log('CreBot Widget Loaded');
  document.head.appendChild(script);
};

// Call this when needed
loadCreBot();`
      });
      setLoading(false);
    }, 200);
  }, [chatbotId]);

  const activeSnippet = snippets[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card elevated className="p-0 overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-[var(--border-soft)]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Embed Script</h3>
          <Button variant="primary" size="sm" onClick={handleCopy} disabled={!activeSnippet || loading}>
            {loading ? <Loader size={14} className="animate-spin" /> :
              copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy Script</>}
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 bg-[var(--bg-input)] border border-[var(--border-default)] p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('html')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${activeTab === 'html' ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
          >
            <Code size={14} /> HTML
          </button>
          <button
            onClick={() => setActiveTab('react')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${activeTab === 'react' ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
          >
            <FileCode2 size={14} /> React
          </button>
          <button
            onClick={() => setActiveTab('ajax')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${activeTab === 'ajax' ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
          >
            <Globe size={14} /> AJAX
          </button>
        </div>
      </div>

      <div className="bg-[var(--bg-input)] p-3 sm:p-5 overflow-x-auto min-h-[100px]">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader size={18} className="animate-spin text-[var(--text-muted)]" />
          </div>
        ) : (
          <code className="text-xs text-[var(--text-secondary)] font-mono leading-relaxed whitespace-pre-wrap break-all">{activeSnippet || 'Select a chatbot to generate embed code.'}</code>
        )}
      </div>
    </Card>
  );
}
