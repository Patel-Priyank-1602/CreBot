import { api } from '../lib/api';

export interface CurrentBilling {
  plan: string;
  price: number;
  chatbot_limit: number;
  storage_limit: number;
  query_limit: number;
  used_chatbots: number;
  used_storage: number;
  used_queries: number;
  billing_status: string;
  current_period_start: string;
  current_period_end: string;
}

export interface Plan {
  name: string;
  price: number;
  chatbots: number;
  storage: number;
  queries: number;
}

export async function getCurrentBilling(): Promise<CurrentBilling> {
  return api.billing.current();
}

export async function getPlans(): Promise<Plan[]> {
  const res = await api.billing.plans();
  return res.plans;
}

export async function upgradePlan(plan: string): Promise<{ success: boolean; message: string }> {
  return api.billing.upgrade(plan);
}


