import { api, API_URL, getAuthToken } from '../lib/api';

export interface KnowledgeFile {
  id: string;
  bot_id?: string;
  user_id?: string;
  file_name: string;
  original_name: string;
  file_type: string;
  file_size: number;
  storage_path?: string;
  status: string;
  chunks_count?: number;
  error_message?: string;
  created_at: string;
  updated_at?: string;
}

export async function listFiles(chatbotId: string): Promise<KnowledgeFile[]> {
  return api.knowledge.list(chatbotId);
}

export async function uploadFile(file: File, chatbotId: string): Promise<KnowledgeFile> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('chatbot_id', chatbotId);
  const res = await api.knowledge.upload(formData);
  return res;
}

/**
 * Upload a file with real-time progress tracking using XMLHttpRequest.
 * onProgress receives a value 0–100 representing upload percentage.
 */
export function uploadFileWithProgress(
  file: File,
  chatbotId: string,
  onProgress: (percent: number) => void
): Promise<KnowledgeFile> {
  return new Promise(async (resolve, reject) => {
    const token = await getAuthToken();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('chatbot_id', chatbotId);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_URL}/knowledge/upload`);

    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(data);
        } else {
          reject(new Error(data.detail || 'Upload failed'));
        }
      } catch {
        reject(new Error('Upload failed — invalid response'));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.onabort = () => reject(new Error('Upload cancelled'));

    xhr.send(formData);
  });
}

/**
 * Upload pasted text directly as knowledge.
 */
export async function uploadText(
  title: string,
  content: string,
  chatbotId: string
): Promise<KnowledgeFile> {
  return api.knowledge.uploadText({ title, content, chatbot_id: chatbotId });
}

export async function deleteFile(fileId: string, chatbotId: string): Promise<void> {
  await api.knowledge.delete(fileId, chatbotId);
}

export async function reprocessFile(fileId: string, chatbotId: string): Promise<void> {
  await api.knowledge.reprocess(fileId, chatbotId);
}

export function getDownloadUrl(fileId: string, chatbotId: string): string {
  return api.knowledge.download(fileId, chatbotId);
}

export async function exportKnowledge(chatbotId: string) {
  return api.knowledge.export(chatbotId);
}
