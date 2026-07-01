import { api } from '../lib/api';

export interface Bot {
  id: string;
  name: string;
  widget_key: string;
  created_at: string;
  is_owner: boolean;
  status: string;
  description: string;
  total_files: number;
  total_chats: number;
  embed_id: string;
  allowed_domains: string[];
  welcome_message: string;
  theme: string;
  position: string;
  updated_at: string;
  access?: string;
}

export async function listBots(): Promise<Bot[]> {
  return api.bots.list();
}

export async function listJoinedBots(): Promise<Bot[]> {
  return api.bots.listJoined();
}

export async function getBot(botId: string): Promise<Bot> {
  return api.bots.get(botId);
}

export async function createBot(name: string): Promise<Bot> {
  return api.bots.create({ name });
}

export async function updateBot(botId: string, data: Partial<Bot>): Promise<Bot> {
  return api.bots.update(botId, data);
}

export async function deleteBot(botId: string): Promise<void> {
  await api.bots.delete(botId);
}

export async function getBotLogs(botId: string) {
  return api.bots.getLogs(botId);
}

export async function retrainBot(botId: string, faqText: string) {
  return api.bots.retrain(botId, { faq_text: faqText });
}

export async function addMember(botId: string, email: string) {
  return api.bots.addMember(botId, email);
}

export async function removeMember(botId: string, memberId: string) {
  return api.bots.removeMember(botId, memberId);
}
