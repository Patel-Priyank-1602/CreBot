import { useState, useRef } from 'react';
import { Upload, File as FileIcon, CheckCircle, AlertCircle, Loader, Type, FileUp } from 'lucide-react';
import { cn } from '../../lib/utils';
import { uploadFileWithProgress, uploadText } from '../../services/knowledgeService';

type UploadStatus = 'idle' | 'selected' | 'uploading' | 'processing' | 'success' | 'error';
type InputTab = 'file' | 'text';

interface UploadDropzoneProps {
  onUploadComplete?: () => void;
  chatbotId?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTS = ['.pdf', '.txt', '.md', '.docx', '.csv'];

export default function UploadDropzone({ onUploadComplete, chatbotId: initialChatbotId }: UploadDropzoneProps) {
  const [activeTab, setActiveTab] = useState<InputTab>('file');
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Text input state
  const [textTitle, setTextTitle] = useState('');
  const [textContent, setTextContent] = useState('');

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
    setUploadProgress(0);
    setErrorMsg('');
    try {
      await uploadFileWithProgress(selectedFile, initialChatbotId, (percent) => {
        setUploadProgress(percent);
        if (percent >= 100) {
          setStatus('processing');
        }
      });
      setStatus('success');
      setSelectedFile(null);
      setUploadProgress(0);
      onUploadComplete?.();
    } catch (e: any) {
      setErrorMsg(e.message || 'Upload failed. Please try again.');
      setStatus('error');
      setUploadProgress(0);
    }
  };

  const handleTextSubmit = async () => {
    if (!textContent.trim()) {
      setErrorMsg('Please enter some text content.');
      setStatus('error');
      return;
    }
    if (!initialChatbotId) {
      setErrorMsg('No chatbot selected. Please select a chatbot before uploading.');
      setStatus('error');
      return;
    }
    const contentSize = new Blob([textContent]).size;
    if (contentSize > MAX_FILE_SIZE) {
      setErrorMsg(`Text is too large (${(contentSize / 1024 / 1024).toFixed(1)} MB). Maximum size is 10 MB.`);
      setStatus('error');
      return;
    }
    setStatus('processing');
    setErrorMsg('');
    try {
      await uploadText(textTitle.trim() || 'Pasted Text', textContent, initialChatbotId);
      setStatus('success');
      setTextTitle('');
      setTextContent('');
      onUploadComplete?.();
    } catch (e: any) {
      setErrorMsg(e.message || 'Upload failed. Please try again.');
      setStatus('error');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (activeTab !== 'file') setActiveTab('file');
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
    setUploadProgress(0);
  };

  const textCharCount = textContent.length;
  const textSizeKB = (new Blob([textContent]).size / 1024).toFixed(1);

  return (
    <div>
      {/* Tabs */}
      {(status === 'idle' || status === 'selected') && (
        <div className="flex gap-1 mb-3">
          <button
            onClick={() => { reset(); setActiveTab('file'); }}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
              activeTab === 'file'
                ? 'bg-[var(--btn-bg)] text-[var(--btn-text)] shadow-sm'
                : 'bg-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--white-alpha-5)]'
            )}
          >
            <FileUp size={15} />
            Upload File
          </button>
          <button
            onClick={() => { reset(); setActiveTab('text'); }}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
              activeTab === 'text'
                ? 'bg-[var(--btn-bg)] text-[var(--btn-text)] shadow-sm'
                : 'bg-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--white-alpha-5)]'
            )}
          >
            <Type size={15} />
            Paste Text
          </button>
        </div>
      )}

      {/* ─── File Upload Tab ─── */}
      {activeTab === 'file' && (
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
            (status === 'uploading' || status === 'processing') ? 'pointer-events-none opacity-60' : 'cursor-pointer'
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
                  <FileIcon size={24} />
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
                  <Upload size={24} className="animate-pulse" />
                </div>
                <p className="text-base font-medium text-[var(--text-primary)] mb-1">
                  Uploading… {uploadProgress}%
                </p>
                <p className="text-sm text-[var(--text-muted)] mb-4">Sending file to server</p>
                {/* Progress Bar */}
                <div className="w-full max-w-sm h-2.5 bg-[var(--white-alpha-5)] rounded-full overflow-hidden border border-[var(--border-soft)]">
                  <div
                    className="h-full rounded-full transition-all duration-300 ease-out"
                    style={{
                      width: `${uploadProgress}%`,
                      background: 'linear-gradient(90deg, #e05a00, #ff8c42)',
                    }}
                  />
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-2">
                  {selectedFile ? `${(selectedFile.size * uploadProgress / 100 / 1024).toFixed(0)} KB / ${(selectedFile.size / 1024).toFixed(0)} KB` : ''}
                </p>
              </>
            )}
            {status === 'processing' && (
              <>
                <div className="w-14 h-14 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)] mb-4">
                  <Loader size={24} className="animate-spin" />
                </div>
                <p className="text-base font-medium text-[var(--text-primary)] mb-1">Processing…</p>
                <p className="text-sm text-[var(--text-muted)] mb-4">Extracting text and generating embeddings</p>
                {/* Indeterminate shimmer bar */}
                <div className="w-full max-w-sm h-2.5 bg-[var(--white-alpha-5)] rounded-full overflow-hidden border border-[var(--border-soft)]">
                  <div
                    className="h-full rounded-full animate-pulse"
                    style={{
                      width: '100%',
                      background: 'linear-gradient(90deg, #e05a00, #ff8c42, #e05a00)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 1.5s ease-in-out infinite',
                    }}
                  />
                </div>
              </>
            )}
            {status === 'success' && (
              <>
                <div className="w-14 h-14 rounded-2xl bg-[var(--white-alpha-10)] border border-[var(--white-alpha-20)] flex items-center justify-center text-[var(--text-primary)] mb-4">
                  <CheckCircle size={24} />
                </div>
                <p className="text-base font-medium text-[var(--text-primary)] mb-1">
                  {activeTab === 'file' ? 'File uploaded successfully.' : 'Text uploaded successfully.'}
                </p>
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
      )}

      {/* ─── Paste Text Tab ─── */}
      {activeTab === 'text' && (
        <div className="border-2 border-dashed rounded-2xl p-6 border-[var(--border-soft)] transition-all duration-200">
          {(status === 'idle' || status === 'selected') && (
            <div className="space-y-4">
              {/* Title input */}
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">
                  Title <span className="text-[var(--text-muted)] font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={textTitle}
                  onChange={(e) => setTextTitle(e.target.value)}
                  placeholder="e.g. FAQ, Product Info, Company Policies..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-soft)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--btn-bg)] transition-colors"
                  maxLength={200}
                />
              </div>

              {/* Content textarea */}
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">
                  Content
                </label>
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Paste or type your knowledge content here…"
                  rows={8}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-soft)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--btn-bg)] transition-colors resize-y font-mono leading-relaxed"
                  style={{ minHeight: '160px', maxHeight: '400px' }}
                />
                <div className="flex items-center justify-between mt-1.5">
                  <p className="text-xs text-[var(--text-muted)]">
                    {textCharCount > 0 ? `${textCharCount.toLocaleString()} characters · ${textSizeKB} KB` : 'Paste your text, FAQ, documentation, or any knowledge content'}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">max 10 MB</p>
                </div>
              </div>

              {/* Submit buttons */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={handleTextSubmit}
                  disabled={!textContent.trim()}
                  className={cn(
                    'px-5 py-2 rounded-xl text-sm font-medium transition-colors',
                    textContent.trim()
                      ? 'bg-[var(--btn-bg)] text-[var(--btn-text)] hover:bg-[var(--btn-hover)]'
                      : 'bg-[var(--white-alpha-5)] text-[var(--text-muted)] cursor-not-allowed'
                  )}
                >
                  Upload text
                </button>
                {(textTitle || textContent) && (
                  <button
                    onClick={() => { setTextTitle(''); setTextContent(''); }}
                    className="px-5 py-2 rounded-xl text-sm font-medium bg-transparent border border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}

          {status === 'processing' && (
            <div className="flex flex-col items-center py-6">
              <div className="w-14 h-14 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)] mb-4">
                <Loader size={24} className="animate-spin" />
              </div>
              <p className="text-base font-medium text-[var(--text-primary)] mb-1">Processing text…</p>
              <p className="text-sm text-[var(--text-muted)] mb-4">Generating embeddings for your content</p>
              <div className="w-full max-w-sm h-2.5 bg-[var(--white-alpha-5)] rounded-full overflow-hidden border border-[var(--border-soft)]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: '100%',
                    background: 'linear-gradient(90deg, #e05a00, #ff8c42, #e05a00)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s ease-in-out infinite',
                  }}
                />
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center py-6">
              <div className="w-14 h-14 rounded-2xl bg-[var(--white-alpha-10)] border border-[var(--white-alpha-20)] flex items-center justify-center text-[var(--text-primary)] mb-4">
                <CheckCircle size={24} />
              </div>
              <p className="text-base font-medium text-[var(--text-primary)] mb-1">Text uploaded successfully.</p>
              <button
                onClick={reset}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mt-2 transition-colors"
              >
                Add more content
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center py-6">
              <div className="w-14 h-14 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-default)] flex items-center justify-center text-[var(--text-primary)] mb-4">
                <AlertCircle size={24} />
              </div>
              <p className="text-base font-medium text-[var(--text-primary)] mb-1">Upload failed</p>
              {errorMsg && <p className="text-xs text-[var(--text-secondary)] mb-2 max-w-sm text-center">{errorMsg}</p>}
              <button
                onClick={reset}
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mt-2 transition-colors"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      )}

      {/* Shimmer animation keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
