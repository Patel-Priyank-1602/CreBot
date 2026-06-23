import { useState, useRef } from 'react';
import { Upload, File, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { cn } from '../../lib/utils';
import { uploadFile } from '../../services/knowledgeService';

type UploadStatus = 'idle' | 'selected' | 'uploading' | 'success' | 'error';

interface UploadDropzoneProps {
  onUploadComplete?: () => void;
  chatbotId?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTS = ['.pdf', '.txt', '.md', '.docx', '.csv'];

export default function UploadDropzone({ onUploadComplete, chatbotId: initialChatbotId }: UploadDropzoneProps) {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTS.includes(ext)) {
      return `File type "${ext}" is not supported. Allowed: PDF, TXT, MD, DOCX, CSV.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum size is 10 MB.`;
    }
    if (file.size === 0) {
      return 'File is empty.';
    }
    return null;
  };

  const handleFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setErrorMsg(validationError);
      setStatus('error');
      return;
    }
    setSelectedFile(file);
    setStatus('selected');
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    if (!initialChatbotId) {
      setErrorMsg('No chatbot selected. Please select a chatbot before uploading.');
      setStatus('error');
      return;
    }
    setStatus('uploading');
    setErrorMsg('');
    try {
      await uploadFile(selectedFile, initialChatbotId);
      setStatus('success');
      setSelectedFile(null);
      onUploadComplete?.();
    } catch (e: any) {
      setErrorMsg(e.message || 'Upload failed. Please try again.');
      setStatus('error');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const reset = () => {
    setStatus('idle');
    setErrorMsg('');
    setSelectedFile(null);
  };

  return (
    <div>
      <div
        onClick={() => {
          if (status === 'idle') inputRef.current?.click();
        }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200',
          dragOver ? 'border-[var(--text-primary)] bg-[var(--white-alpha-5)]' : 'border-[var(--border-soft)] hover:border-[var(--border-default)]',
          status === 'uploading' ? 'pointer-events-none opacity-60' : 'cursor-pointer'
        )}
      >
        <input ref={inputRef} type="file" className="hidden" onChange={handleInputChange}
          accept=".pdf,.txt,.md,.docx,.csv" />
        <div className="flex flex-col items-center">
          {status === 'idle' && (
            <>
              <div className="w-14 h-14 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)] mb-4">
                <Upload size={24} />
              </div>
              <p className="text-base font-medium text-[var(--text-primary)] mb-1">Drop files here or click to upload</p>
              <p className="text-sm text-[var(--text-muted)]">Supports PDF, TXT, Markdown, DOCX, CSV (max 10 MB)</p>
            </>
          )}
          {status === 'selected' && selectedFile && (
            <>
              <div className="w-14 h-14 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)] mb-4">
                <File size={24} />
              </div>
              <p className="text-base font-medium text-[var(--text-primary)] mb-1">{selectedFile.name}</p>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                {(selectedFile.size / 1024).toFixed(1)} KB — {selectedFile.type || 'Unknown type'}
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                  className="px-5 py-2 rounded-xl text-sm font-medium bg-[var(--btn-bg)] text-[var(--btn-text)] hover:bg-[var(--btn-hover)] transition-colors"
                >
                  Upload file
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); reset(); }}
                  className="px-5 py-2 rounded-xl text-sm font-medium bg-transparent border border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
          {status === 'uploading' && (
            <>
              <div className="w-14 h-14 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)] mb-4">
                <Loader size={24} className="animate-spin" />
              </div>
              <p className="text-base font-medium text-[var(--text-primary)] mb-1">Uploading and processing...</p>
              <p className="text-sm text-[var(--text-muted)]">Extracting text and generating embeddings</p>
            </>
          )}
          {status === 'success' && (
            <>
              <div className="w-14 h-14 rounded-2xl bg-[var(--white-alpha-10)] border border-[var(--white-alpha-20)] flex items-center justify-center text-[var(--text-primary)] mb-4">
                <CheckCircle size={24} />
              </div>
              <p className="text-base font-medium text-[var(--text-primary)] mb-1">File uploaded successfully.</p>
              <button
                onClick={(e) => { e.stopPropagation(); reset(); }}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mt-2 transition-colors"
              >
                Upload another
              </button>
            </>
          )}
          {status === 'error' && (
            <>
              <div className="w-14 h-14 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-default)] flex items-center justify-center text-[var(--text-primary)] mb-4">
                <AlertCircle size={24} />
              </div>
              <p className="text-base font-medium text-[var(--text-primary)] mb-1">Upload failed</p>
              {errorMsg && <p className="text-xs text-[var(--text-secondary)] mb-2 max-w-sm">{errorMsg}</p>}
              <button
                onClick={(e) => { e.stopPropagation(); reset(); }}
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mt-2 transition-colors"
              >
                Try again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
