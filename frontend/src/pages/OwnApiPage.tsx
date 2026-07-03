import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Eye, EyeOff, ExternalLink, Loader, Check, AlertTriangle, Trash2, ArrowRight, Lock, Cpu, RefreshCw } from 'lucide-react';
import { getGroqKeyInfo, saveGroqApiKey, deleteGroqApiKey, type GroqKeyInfo } from '../services/settingsService';

export default function OwnApiPage() {
  const [keyInfo, setKeyInfo] = useState<GroqKeyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadKeyInfo = async () => {
    setLoading(true);
    try {
      const info = await getGroqKeyInfo();
      setKeyInfo(info);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadKeyInfo(); }, []);

  const handleSave = async () => {
    if (!apiKey.trim()) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await saveGroqApiKey(apiKey.trim());
      setSuccess('API key validated and saved successfully');
      setApiKey('');
      setShowKey(false);
      await loadKeyInfo();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError('');
    setSuccess('');
    try {
      await deleteGroqApiKey();
      setSuccess('Reverted to default CreBot key');
      setKeyInfo({ has_key: false, key_preview: '' });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setDeleting(false);
    }
  };

  const hasKey = keyInfo?.has_key ?? false;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Key size={15} className="text-orange-500" />
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-[var(--text-primary)]">Own API Key</h1>
        </div>
        <p className="text-sm text-[var(--text-muted)] ml-11">Bring your own Groq key to bypass shared rate limits.</p>
      </div>

      <div className="max-w-2xl space-y-5">

        {/* Status Banner */}
        <motion.div
          layout
          className={`rounded-2xl border p-4 sm:p-5 transition-colors ${
            hasKey
              ? 'bg-emerald-500/[0.04] border-emerald-500/15'
              : 'bg-[var(--bg-card)] border-[var(--border-soft)]'
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${hasKey ? 'bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.4)]' : 'bg-[var(--text-muted)]/30'}`}>
                {hasKey && <div className="w-full h-full rounded-full bg-emerald-500 animate-ping opacity-50" />}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {loading ? 'Checking status...' : hasKey ? 'Your API key is active' : 'No custom key configured'}
                </p>
                <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
                  {loading ? '' : hasKey ? keyInfo?.key_preview : 'Using default CreBot key'}
                </p>
              </div>
            </div>
            {hasKey && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="shrink-0 p-2 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                title="Remove key"
              >
                {deleting ? <Loader size={16} className="animate-spin" /> : <Trash2 size={16} />}
              </button>
            )}
          </div>
        </motion.div>

        {/* Key Input */}
        <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-card)] p-4 sm:p-6">
          <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
            {hasKey ? 'Replace API Key' : 'Enter your Groq API key'}
          </p>
          <p className="text-xs text-[var(--text-muted)] mb-4">
            We'll validate it with a quick test call before saving.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => { setApiKey(e.target.value); setError(''); setSuccess(''); }}
                placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full bg-[var(--bg-input)] border border-[var(--border-soft)] rounded-xl px-4 py-2.5 pr-10 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:border-orange-500/40 font-mono transition-colors"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                tabIndex={-1}
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button
              onClick={handleSave}
              disabled={saving || !apiKey.trim()}
              className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader size={14} className="animate-spin" />
                  <span className="hidden sm:inline">Validating</span>
                </>
              ) : (
                <>
                  <Check size={14} />
                  <span>{hasKey ? 'Update' : 'Save Key'}</span>
                </>
              )}
            </button>
          </div>

          {/* Feedback */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-start gap-2 mt-3 p-3 rounded-xl bg-red-500/8 border border-red-500/15 text-red-400 text-xs">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
            {success && (
              <motion.div
                key="success"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-2 mt-3 p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/15 text-emerald-400 text-xs">
                  <Check size={14} className="shrink-0" />
                  <span>{success}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* How it works — compact */}
        <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-card)] p-4 sm:p-6">
          <p className="text-sm font-medium text-[var(--text-primary)] mb-4">How it works</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { step: '1', icon: ExternalLink, title: 'Get a key', desc: 'Create a free key at console.groq.com' },
              { step: '2', icon: Key, title: 'Paste above', desc: 'Enter your key and we validate it' },
              { step: '3', icon: Cpu, title: 'You\'re set', desc: 'All your bots now use your key' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-soft)]/50">
                <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-orange-500">{item.step}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[var(--text-primary)]">{item.title}</p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <a
            href="https://console.groq.com/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-4 text-xs text-orange-500 hover:text-orange-400 transition-colors font-medium"
          >
            Open Groq Console
            <ArrowRight size={12} />
          </a>
        </div>

        {/* Security note — subtle footer */}
        <div className="flex items-start gap-3 px-1 pt-2 pb-4">
          <Lock size={13} className="text-[var(--text-muted)]/60 shrink-0 mt-0.5" />
          <p className="text-[11px] text-[var(--text-muted)]/70 leading-relaxed">
            Your key is encrypted at rest, used only for your chatbots, and never shared. You can remove it anytime to revert to the default CreBot key.
          </p>
        </div>

      </div>
    </motion.div>
  );
}
