import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bot, ArrowLeft, Loader, Settings } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import ErrorState from '../components/common/ErrorState';
import { getBot, updateBot } from '../services/chatbotService';
import { cn } from '../lib/utils';

export default function ChatbotDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bot, setBot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingKnowledge, setUpdatingKnowledge] = useState(false);

  const load = () => {
    if (!id) return;
    setLoading(true);
    setError('');
    getBot(id)
      .then(setBot)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  const handleToggleStrictKnowledge = async (checked: boolean) => {
    if (!bot) return;

    const actionText = checked 
      ? "Set Data Source to 'Only Knowledge Base'?\n\nThe chatbot will now STRICTLY answer using only the documents you provide. It will not use general internet knowledge." 
      : "Set Data Source to 'Knowledge Base + Internet'?\n\nThe chatbot will now use its general internet knowledge to answer questions if the provided documents do not contain the answer.";
    
    if (!window.confirm(actionText)) {
      return; // User cancelled
    }

    setUpdatingKnowledge(true);
    const previousState = bot.strict_knowledge;
    try {
      setBot({ ...bot, strict_knowledge: checked });
      const updatedBot = await updateBot(bot.id, { strict_knowledge: checked });
      setBot(updatedBot);
    } catch (err: any) {
      alert('Failed to update settings: ' + err.message);
      setBot({ ...bot, strict_knowledge: previousState });
    } finally {
      setUpdatingKnowledge(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Never';
    const d = new Date(dateStr);
    const now = Date.now();
    const diff = now - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return d.toLocaleDateString();
  };

  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <button
        onClick={() => navigate('/dashboard/chatbots')}
        className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-4 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Chatbots
      </button>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader size={24} className="animate-spin text-[var(--text-muted)]" />
        </div>
      ) : bot && (
        <>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)]">
              <Bot size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-1">{bot.name}</h1>
              <p className="text-sm text-[var(--text-muted)]">{bot.description || 'Manage your chatbot\'s knowledge, chat, and settings.'}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="space-y-6 lg:col-span-2">
              <Card className="p-5">
                  <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-soft)] mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[var(--bg-input)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)]">
                      <Bot size={16} />
                    </div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">Knowledge Base</h3>
                    <span className="ml-auto text-xs text-[var(--text-muted)]">{bot.total_files} files</span>
                  </div>
                  <p className="text-sm text-[var(--text-muted)] mb-4">
                  Upload and manage the documents this chatbot uses to answer questions.
                </p>
                <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard/knowledge')}>
                  Manage Files
                </Button>
              </Card>

              <Card className="p-5">
                  <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-soft)] mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[var(--bg-input)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)]">
                      <Settings size={16} />
                    </div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">Knowledge Settings</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-[var(--text-primary)]">Data Source</h4>
                      {updatingKnowledge && <Loader size={14} className="animate-spin text-[var(--text-muted)]" />}
                    </div>
                    
                    <div className="relative flex p-1 bg-[var(--bg-input)] rounded-xl border border-[var(--border-soft)]">
                      <div 
                        className={cn(
                          "absolute inset-y-1 w-[calc(50%-4px)] bg-[var(--bg-card)] border border-[var(--border-soft)] shadow-sm rounded-lg transition-all duration-300 ease-out",
                          bot.strict_knowledge !== false ? "left-1" : "left-1/2"
                        )}
                      />
                      
                      <button
                        onClick={() => bot.strict_knowledge === false && handleToggleStrictKnowledge(true)}
                        disabled={updatingKnowledge}
                        className={cn(
                          "flex-1 relative z-10 flex flex-col items-center justify-center py-2.5 px-3 rounded-lg transition-colors duration-200",
                          bot.strict_knowledge !== false ? "text-[var(--text-primary)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
                          updatingKnowledge && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <span className="text-sm font-semibold">Only Knowledge Base</span>
                        <span className={cn("text-[10px] mt-0.5", bot.strict_knowledge !== false ? "opacity-80" : "opacity-60")}>Strictly use provided files</span>
                      </button>
                      
                      <button
                        onClick={() => bot.strict_knowledge !== false && handleToggleStrictKnowledge(false)}
                        disabled={updatingKnowledge}
                        className={cn(
                          "flex-1 relative z-10 flex flex-col items-center justify-center py-2.5 px-3 rounded-lg transition-colors duration-200",
                          bot.strict_knowledge === false ? "text-[var(--text-primary)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
                          updatingKnowledge && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <span className="text-sm font-semibold">Knowledge Base + Internet</span>
                        <span className={cn("text-[10px] mt-0.5", bot.strict_knowledge === false ? "opacity-80" : "opacity-60")}>Fallback to whole internet</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-[var(--text-muted)] p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-soft)] leading-relaxed">
                      {bot.strict_knowledge !== false 
                        ? <><strong className="text-[var(--text-primary)]">Current Mode:</strong> The chatbot will strictly answer questions based on your Knowledge Base. It will refuse to answer if the information is not in the documents.</>
                        : <><strong className="text-[var(--text-primary)]">Current Mode:</strong> The chatbot will first scan your Knowledge Base. If the answer is not found, it will use its general knowledge (the whole internet) to provide a response.</>
                      }
                    </p>
                  </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-5">
                <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-soft)] mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-input)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)]">
                    <Bot size={16} />
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">Quick Stats</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Status</span>
                    <span className="text-[var(--text-primary)] capitalize">{bot.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Conversations</span>
                    <span className="text-[var(--text-primary)]">{bot.total_chats}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Files</span>
                    <span className="text-[var(--text-primary)]">{bot.total_files}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Last Updated</span>
                    <span className="text-[var(--text-primary)]">{formatDate(bot.updated_at)}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Members & Advanced Settings</h3>
                <p className="text-xs text-[var(--text-muted)] mb-4">
                  Generate access codes, invite team members, and customize widget settings.
                </p>
                <Button variant="primary" className="w-full justify-center" size="sm" onClick={() => navigate(`/bot/${bot.id}`)}>
                  Open Advanced Editor
                </Button>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
