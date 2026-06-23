import { api } from '../lib/api';

export interface ChatLog {
  id: string;
  workspace_id: string;
  chatbot_id: string;
  chatbot_name: string;
  user_question: string;
  bot_answer?: string;
  sources?: any;
  status: string;
  created_at: string;
}

export interface LogFilters {
  search?: string;
  chatbotId?: string;
  status?: string;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
}

export interface LogListResponse {
  logs: ChatLog[];
  total: number;
  limit: number;
  offset: number;
}

export async function listLogs(filters?: LogFilters): Promise<LogListResponse> {
  return api.chatlogs.list(filters);
}

export async function getLog(logId: string): Promise<ChatLog> {
  return api.chatlogs.get(logId);
}

export async function deleteLog(logId: string): Promise<void> {
  await api.chatlogs.delete(logId);
}

export async function exportLogs() {
  return api.chatlogs.export();
}

export async function getChatbotFilters(): Promise<{ id: string; name: string }[]> {
  const res = await api.chatlogs.chatbotFilters();
  return res.chatbots;
}


