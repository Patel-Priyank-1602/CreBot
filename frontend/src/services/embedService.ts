import { api } from '../lib/api';

export interface EmbedSettings {
  chatbot_id: string;
  embed_id: string;
  name: string;
  welcome_message: string;
  theme: string;
  position: string;
  allowed_domains: string[];
}

export async function getEmbedSettings(chatbotId: string): Promise<EmbedSettings> {
  return api.embed.get(chatbotId);
}

export async function updateEmbedSettings(chatbotId: string, data: Partial<EmbedSettings>): Promise<EmbedSettings> {
  return api.embed.update(chatbotId, data);
}

export async function getEmbedScript(chatbotId: string): Promise<{ snippet: string; embed_id: string; settings: EmbedSettings }> {
  return api.embed.getScript(chatbotId);
}
