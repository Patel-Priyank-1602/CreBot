import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Settings as SettingsIcon, Key, Download, Trash2, Bot, FileText, ExternalLink, Loader, Copy, Plus, Check, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import ErrorState from '../components/common/ErrorState';
import { exportData } from '../services/settingsService';

function SectionIcon({ icon: Icon, className }: { icon: any; className?: string }) {
  return (
    <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-[var(--bg-input)] border border-[var(--border-soft)] text-[var(--text-primary)]">
      <Icon size={20} />
    </div>
  );
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

  const load = () => {
    setLoading(false);
    setError('');
  };

  useEffect(() => { load(); }, []);



  const handleExport = async () => {
    setExporting(true);
    try {
      const data = await exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `data-export.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setExporting(false);
    }
  };


  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-10">
        <h1 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-1">Settings</h1>
        <p className="text-sm text-[var(--text-muted)]">Manage your API keys and data controls.</p>
      </div>

      <div className="flex flex-col gap-6 max-w-3xl">

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


        {/* Data Export */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <SectionIcon icon={Download} />
            <div>
              <h3 className="text-base font-semibold text-[var(--text-primary)]">Data Export</h3>
              <p className="text-sm text-[var(--text-muted)]">Export all your data as a JSON file.</p>
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

          </div>
        </Card>

      </div>
    </motion.div>
  );
}
