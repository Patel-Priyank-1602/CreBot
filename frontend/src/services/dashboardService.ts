import { api } from '../lib/api';

export interface DistributionItem {
  name: string;
  value: number;
}

export interface DashboardOverview {
  total_chatbots: number;
  total_files: number;
  total_conversations: number;
  storage_used: number;
  storage_limit: number;
  chatbot_limit: number;
  chat_distribution: DistributionItem[];
  storage_distribution: DistributionItem[];
}

export interface ActivityItem {
  id: string;
  type: string;
  description: string;
  created_at: string;
}

export interface RecentChat {
  id: string;
  user_question: string;
  bot_answer?: string;
  status: string;
  chatbot_name: string;
  created_at: string;
}

export async function getOverview(): Promise<DashboardOverview> {
  return api.dashboard.overview();
}

export async function getActivity(): Promise<ActivityItem[]> {
  const res = await api.dashboard.activity();
  return res.activities;
}

export async function getRecentChats(): Promise<RecentChat[]> {
  const res = await api.dashboard.recentChats();
  return res.chats;
}
