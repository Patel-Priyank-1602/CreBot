import { api } from '../lib/api';

export interface AdminStats {
  total_users: number;
  total_chatbots: number;
  total_files: number;
  total_queries: number;
  active_workspaces: number;
  failed_jobs: number;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  plan: string;
  chatbots: number;
  files: number;
  queries: number;
  status: string;
  created_at: string;
}

export async function getStats(): Promise<AdminStats> {
  return api.admin.stats();
}

export async function listUsers(): Promise<AdminUser[]> {
  const res = await api.admin.users();
  return res.users;
}

export async function updateUserStatus(workspaceId: string, action: 'suspend' | 'activate'): Promise<void> {
  await api.admin.updateUserStatus(workspaceId, action);
}
