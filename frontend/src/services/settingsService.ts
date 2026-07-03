import { api } from '../lib/api';

export interface Workspace {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: string;
  chatbot_limit: number;
  storage_limit: number;
  created_at: string;
  updated_at: string;
  has_groq_key: boolean;
}

export interface ApiKey {
  id: string;
  key_preview: string;
  created_at: string;
  last_used_at?: string;
  status: string;
}

export interface CreatedApiKey {
  id: string;
  key_preview: string;
  full_key: string;
  created_at: string;
}

export interface GroqKeyInfo {
  has_key: boolean;
  key_preview: string;
}

export async function getWorkspace(): Promise<Workspace> {
  return api.settings.workspace();
}

export async function updateWorkspaceName(name: string): Promise<Workspace> {
  return api.settings.updateWorkspace({ name });
}

export async function listApiKeys(): Promise<ApiKey[]> {
  const res = await api.settings.apiKeys();
  return res.keys;
}

export async function createApiKey(): Promise<CreatedApiKey> {
  return api.settings.createApiKey();
}

export async function revokeApiKey(keyId: string): Promise<void> {
  await api.settings.revokeApiKey(keyId);
}

export async function exportData() {
  return api.settings.export();
}

export async function getGroqKeyInfo(): Promise<GroqKeyInfo> {
  return api.settings.getGroqKey();
}

export async function saveGroqApiKey(apiKey: string): Promise<{ message: string; has_key: boolean }> {
  return api.settings.saveGroqKey(apiKey);
}

export async function deleteGroqApiKey(): Promise<{ message: string; has_key: boolean }> {
  return api.settings.deleteGroqKey();
}
