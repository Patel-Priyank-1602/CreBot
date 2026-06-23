import { api } from '../lib/api';

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


