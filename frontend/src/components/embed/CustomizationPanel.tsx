import { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import { getEmbedSettings, updateEmbedSettings, EmbedSettings } from '../../services/embedService';

interface CustomizationPanelProps {
  chatbotId: string;
}

export default function CustomizationPanel({ chatbotId }: CustomizationPanelProps) {
  const [settings, setSettings] = useState<EmbedSettings | null>(null);
  const [position, setPosition] = useState('bottom-right');
  const [theme, setTheme] = useState('dark');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [allowedDomains, setAllowedDomains] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!chatbotId) return;
    setLoading(true);
    getEmbedSettings(chatbotId)
      .then((s) => {
        setSettings(s);
        setPosition(s.position);
        setTheme(s.theme);
        setWelcomeMessage(s.welcome_message);
        setAllowedDomains((s.allowed_domains || []).join(', '));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [chatbotId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateEmbedSettings(chatbotId, {
        position,
        theme,
        welcome_message: welcomeMessage,
        allowed_domains: allowedDomains.split(',').map((d) => d.trim()).filter(Boolean),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card elevated className="p-5 flex items-center justify-center py-8">
        <Loader size={18} className="animate-spin text-[var(--text-muted)]" />
      </Card>
    );
  }

  return (
    <Card elevated className="p-5">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Widget Customization</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Widget Position</label>
            <div className="grid grid-cols-2 gap-2">
              {['bottom-right', 'bottom-left'].map((pos) => (
                <button
                  key={pos}
                  onClick={() => setPosition(pos)}
                  className={`px-3 py-2 rounded-xl text-xs transition-colors ${
                    position === pos
                      ? 'bg-[var(--btn-bg)] text-[var(--btn-text)]'
                      : 'bg-[var(--bg-input)] border border-[var(--border-soft)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {pos.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Theme</label>
            <div className="grid grid-cols-2 gap-2">
              {['dark', 'light'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-3 py-2 rounded-xl text-xs transition-colors ${
                    theme === t
                      ? 'bg-[var(--btn-bg)] text-[var(--btn-text)]'
                      : 'bg-[var(--bg-input)] border border-[var(--border-soft)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {t === 'dark' ? 'Dark' : 'Light'}
                </button>
              ))}
            </div>
          </div>
        </div>
        <Input label="Welcome Message" placeholder="Hi! How can I help you?"
          value={welcomeMessage} onChange={(e) => setWelcomeMessage(e.target.value)} />
        <Input label="Allowed Domains (comma separated)" placeholder="example.com, myapp.com"
          value={allowedDomains} onChange={(e) => setAllowedDomains(e.target.value)} />
        <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
          {saving ? <Loader size={14} className="animate-spin" /> : null}
          {saved ? 'Saved!' : 'Save Settings'}
        </Button>
      </div>
    </Card>
  );
}
