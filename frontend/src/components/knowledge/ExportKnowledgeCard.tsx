import { useState } from 'react';
import { Download, Loader } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { exportKnowledge } from '../../services/knowledgeService';

interface ExportKnowledgeCardProps {
  chatbotId: string;
}

export default function ExportKnowledgeCard({ chatbotId }: ExportKnowledgeCardProps) {
  const [exporting, setExporting] = useState(false);
  const [done, setDone] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const data = await exportKnowledge(chatbotId);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `knowledge-base-export.json`;
      a.click();
      URL.revokeObjectURL(url);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Card elevated className="p-5 flex items-center justify-between">
      <div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">Export Knowledge</h3>
        <p className="text-sm text-[var(--text-muted)]">Download your complete knowledge base as a single file.</p>
      </div>
      <Button variant="primary" size="sm" onClick={handleExport} disabled={exporting}>
        {exporting ? <Loader size={16} className="animate-spin" /> : <Download size={16} />}
        {done ? 'Exported!' : 'Download Knowledge'}
      </Button>
    </Card>
  );
}
