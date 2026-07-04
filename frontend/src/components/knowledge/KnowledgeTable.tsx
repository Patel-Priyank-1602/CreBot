import { memo } from 'react';
import { RefreshCw, Download, Trash2 } from 'lucide-react';
import { formatTimeAgo, formatFileSize } from '../../lib/utils';
import { KnowledgeFile, deleteFile, reprocessFile, getDownloadUrl } from '../../services/knowledgeService';

interface KnowledgeTableProps {
  files: KnowledgeFile[];
  onRefresh: () => void;
  chatbotId: string;
}

function KnowledgeTable({ files, onRefresh, chatbotId }: KnowledgeTableProps) {
  const handleDelete = async (fileId: string) => {
    if (!confirm('Delete this file?')) return;
    try {
      await deleteFile(fileId, chatbotId);
      onRefresh();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleReprocess = async (fileId: string) => {
    try {
      await reprocessFile(fileId, chatbotId);
      onRefresh();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border-soft)]">
              <th className="text-left text-xs font-medium text-[var(--text-muted)] px-5 py-3">File Name</th>
              <th className="text-left text-xs font-medium text-[var(--text-muted)] px-5 py-3">Type</th>
              <th className="text-left text-xs font-medium text-[var(--text-muted)] px-5 py-3">Size</th>
              <th className="text-left text-xs font-medium text-[var(--text-muted)] px-5 py-3">Status</th>
              <th className="text-left text-xs font-medium text-[var(--text-muted)] px-5 py-3">Uploaded At</th>
              <th className="text-right text-xs font-medium text-[var(--text-muted)] px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr
                key={file.id}
                className="border-b border-[var(--border-soft)] last:border-0 hover:bg-[var(--hover-soft)] transition-colors"
              >
                <td className="px-5 py-3.5 text-sm text-[var(--text-primary)] max-w-[200px] truncate">{file.original_name}</td>
                <td className="px-5 py-3.5 text-sm text-[var(--text-muted)] font-mono">{file.file_type}</td>
                <td className="px-5 py-3.5 text-sm text-[var(--text-muted)]">{formatFileSize(file.file_size)}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs px-2 py-1 rounded-md ${
                    file.status === 'embedded' ? 'bg-[var(--white-alpha-10)] text-[var(--text-primary)]' :
                    file.status === 'processing' ? 'bg-[var(--bg-input)] text-[var(--text-muted)] border border-[var(--border-soft)]' :
                    file.status === 'failed' ? 'bg-[var(--bg-input)] text-[var(--text-secondary)] border border-[var(--border-default)]' :
                    'bg-[var(--bg-input)] text-[var(--text-muted)] border border-[var(--border-soft)]'
                  }`}>
                    {file.status === 'embedded' ? 'Embedded' :
                     file.status === 'processing' ? 'Processing' :
                     file.status === 'failed' ? 'Failed' : 'Pending'}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-sm text-[var(--text-muted)]">{formatTimeAgo(file.created_at)}</td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {file.status !== 'processing' && (
                      <button onClick={() => handleReprocess(file.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-soft)] transition-colors">
                        <RefreshCw size={14} />
                      </button>
                    )}
                    <a href={getDownloadUrl(file.id, chatbotId)} download
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-soft)] transition-colors">
                      <Download size={14} />
                    </a>
                    <button onClick={() => handleDelete(file.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-soft)] transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default memo(KnowledgeTable);
