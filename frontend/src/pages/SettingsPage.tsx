import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Settings as SettingsIcon, Key, Download, Trash2, Bot, FileText, ExternalLink, Loader, Copy, Plus, Check, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import ErrorState from '../components/common/ErrorState';
import { getWorkspace, updateWorkspaceName, listApiKeys, createApiKey, revokeApiKey, exportData, Workspace, ApiKey, CreatedApiKey } from '../services/settingsService';

function SectionIcon({ icon: Icon, className }: { icon: any; className?: string }) {
  return (
    <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-[var(--bg-input)] border border-[var(--border-soft)] text-[var(--text-primary)]">
      <Icon size={20} />
    </div>
  );
}

export default function SettingsPage() {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [wsName, setWsName] = useState('');
  const [savingWs, setSavingWs] = useState(false);
  const [wsSaved, setWsSaved] = useState(false);
  const [creatingKey, setCreatingKey] = useState(false);
  const [newKey, setNewKey] = useState<CreatedApiKey | null>(null);
  const [exporting, setExporting] = useState(false);

  const load = () => {
    setLoading(true);
    setError('');
    Promise.all([getWorkspace(), listApiKeys()])
      .then(([ws, keys]) => {
        setWorkspace(ws);
        setWsName(ws.name);
        setApiKeys(keys);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSaveWorkspace = async () => {
    setSavingWs(true);
    try {
      const updated = await updateWorkspaceName(wsName);
      setWorkspace(updated);
      setWsSaved(true);
      setTimeout(() => setWsSaved(false), 2000);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSavingWs(false);
    }
  };

  const handleCreateKey = async () => {
    setCreatingKey(true);
    setNewKey(null);
    try {
      const key = await createApiKey();
      setNewKey(key);
      const keys = await listApiKeys();
      setApiKeys(keys);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setCreatingKey(false);
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    if (!confirm('Revoke this API key? This cannot be undone.')) return;
    try {
      await revokeApiKey(keyId);
      const keys = await listApiKeys();
      setApiKeys(keys);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const data = await exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `workspace-export.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setExporting(false);
    }
  };

  const copyNewKey = () => {
    if (newKey?.full_key) {
      navigator.clipboard.writeText(newKey.full_key);
      alert('API key copied to clipboard. Store it securely - you won\'t see it again.');
    }
  };

  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-10">
        <h1 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-1">Settings</h1>
        <p className="text-sm text-[var(--text-muted)]">Manage your workspace, API keys, and data controls.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">

        {/* Profile Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <SectionIcon icon={User} />
            <div>
              <h3 className="text-base font-semibold text-[var(--text-primary)]">Profile Settings</h3>
              <p className="text-sm text-[var(--text-muted)]">Manage your name, email, and personal preferences.</p>
            </div>
          </div>
          <Link to="/user">
            <Button variant="secondary" size="sm">
              <ExternalLink size={14} />
              Open Profile
            </Button>
          </Link>
        </Card>

        {/* Workspace Settings
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <SectionIcon icon={SettingsIcon} />
            <div>
              <h3 className="text-base font-semibold text-[var(--text-primary)]">Workspace Settings</h3>
              <p className="text-sm text-[var(--text-muted)]">Configure your workspace name and preferences.</p>
            </div>
          </div>
          <div className="space-y-4 max-w-sm">
            <Input label="Workspace Name" placeholder="My Workspace"
              value={wsName} onChange={(e) => setWsName(e.target.value)} />
            <Button variant="primary" size="sm" onClick={handleSaveWorkspace} disabled={savingWs}>
              {savingWs ? <Loader size={14} className="animate-spin" /> : wsSaved ? <Check size={14} /> : null}
              {wsSaved ? 'Saved!' : 'Save Changes'}
            </Button>
          </div>
        </Card> */}

        {/* API Keys */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <SectionIcon icon={Key} />
            <div>
              <h3 className="text-base font-semibold text-[var(--text-primary)]">API Keys</h3>
              <p className="text-sm text-[var(--text-muted)]">Manage your API keys for programmatic access.</p>
            </div>
          </div>

          {newKey && (
            <div className="mb-5 p-4 bg-[var(--bg-input)] border border-emerald-500/30 rounded-xl">
              <p className="text-xs text-[var(--text-secondary)] mb-3 font-medium">New API Key created — copy it now. It won't be shown again:</p>
              <div className="flex items-center gap-2">
                <code className="text-xs text-[var(--text-primary)] font-mono bg-[var(--black-alpha-50)] px-3 py-2 rounded-lg flex-1 truncate border border-[var(--border-soft)] break-all">
                  {newKey.full_key}
                </code>
                <button onClick={copyNewKey}
                  className="px-3 py-2 rounded-lg bg-[var(--btn-bg)] text-[var(--btn-text)] text-xs hover:opacity-90 transition-opacity flex items-center gap-1.5 font-medium shrink-0">
                  <Copy size={12} />
                  Copy
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2.5 mb-5">
            {apiKeys.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] py-3">No API keys created yet.</p>
            ) : (
              apiKeys.map((key) => (
                <div key={key.id}
                  className="flex items-center justify-between p-3 bg-[var(--bg-input)] border border-[var(--border-soft)] rounded-xl">
                  <div className="min-w-0 flex-1 mr-3">
                    <code className="text-xs text-[var(--text-secondary)] font-mono">{key.key_preview}</code>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      Created {new Date(key.created_at).toLocaleDateString()}
                      {key.last_used_at ? ` · Last used ${new Date(key.last_used_at).toLocaleDateString()}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                      key.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-[var(--bg-input)] text-[var(--text-muted)] border border-[var(--border-soft)]'
                    }`}>
                      {key.status}
                    </span>
                    {key.status === 'active' && (
                      <Button variant="danger" size="sm" onClick={() => handleRevokeKey(key.id)}>Revoke</Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <Button variant="primary" size="sm" onClick={handleCreateKey} disabled={creatingKey}>
            {creatingKey ? <Loader size={14} className="animate-spin" /> : <Plus size={14} />}
            Generate New Key
          </Button>
        </Card>

        {/* Data Export */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <SectionIcon icon={Download} />
            <div>
              <h3 className="text-base font-semibold text-[var(--text-primary)]">Data Export</h3>
              <p className="text-sm text-[var(--text-muted)]">Export all your workspace data as a JSON file.</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={handleExport} disabled={exporting}>
            {exporting ? <Loader size={14} className="animate-spin" /> : <Download size={14} />}
            Export Data
          </Button>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 !border-red-500/30">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-red-500/10 border border-red-500/20 text-red-500">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[var(--text-primary)]">Danger Zone</h3>
              <p className="text-sm text-[var(--text-muted)]">Irreversible actions. Proceed with caution.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="danger" size="sm" disabled>
              <Bot size={14} />
              Delete Chatbot
            </Button>
            <Button variant="danger" size="sm" disabled>
              <FileText size={14} />
              Delete Knowledge Base
            </Button>
            <Button variant="danger" size="sm" disabled>
              <Trash2 size={14} />
              Delete Workspace
            </Button>
          </div>
        </Card>

      </div>
    </motion.div>
  );
}
