const API_URL = 'http://localhost:8000/api';

let _getToken: (() => Promise<string | null>) | null = null;

export function setClerkTokenGetter(getter: () => Promise<string | null>) {
  _getToken = getter;
}

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (_getToken) {
    const token = await _getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || 'API request failed');
  }
  return data;
}

async function fetchApiFormData(endpoint: string, formData: FormData) {
  const headers: Record<string, string> = {};

  if (_getToken) {
    const token = await _getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || 'API request failed');
  }
  return data;
}

export const api = {
  bots: {
    list: () => fetchApi('/bots/'),
    get: (botId: string) => fetchApi(`/bots/${botId}`),
    create: (data: any) => fetchApi('/bots/', { method: 'POST', body: JSON.stringify(data) }),
    update: (botId: string, data: any) => fetchApi(`/bots/${botId}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (botId: string) => fetchApi(`/bots/${botId}`, { method: 'DELETE' }),
    train: (botId: string, data: any) => fetchApi(`/bots/${botId}/train`, { method: 'POST', body: JSON.stringify(data) }),
    retrain: (botId: string, data: any) => fetchApi(`/bots/${botId}/retrain`, { method: 'POST', body: JSON.stringify(data) }),
    getSnippet: (botId: string) => fetchApi(`/bots/${botId}/embed-snippet`),
    getLogs: (botId: string) => fetchApi(`/bots/${botId}/logs`),
    getMembers: (botId: string) => fetchApi(`/bots/${botId}/members`),
    removeMember: (botId: string, memberId: string) => fetchApi(`/bots/${botId}/members/${memberId}`, { method: 'DELETE' }),
    addMember: (botId: string, email: string) => fetchApi(`/bots/${botId}/members/add`, { method: 'POST', body: JSON.stringify({ email }) }),
  },
  members: {
    sync: (email: string) => fetchApi(`/invites/sync`, { method: 'POST', body: JSON.stringify({ email }) }),
  },
  chat: (widgetKey: string, question: string, chat_history: { role: string; content: string }[] = []) =>
    fetchApi(`/widget/${widgetKey}/chat`, { method: 'POST', body: JSON.stringify({ question, chat_history }) }),
  sendChat: (botId: string, message: string, chat_history: { role: string; content: string }[] = []) =>
    fetchApi('/chat/send', { method: 'POST', body: JSON.stringify({ bot_id: botId, message, chat_history }) }),
  dashboard: {
    overview: () => fetchApi('/dashboard/overview'),
    activity: () => fetchApi('/dashboard/activity'),
    recentChats: () => fetchApi('/dashboard/recent-chats'),
  },
  knowledge: {
    list: (chatbotId: string) => fetchApi(`/knowledge/files?chatbot_id=${chatbotId}`),
    get: (fileId: string, chatbotId: string) => fetchApi(`/knowledge/files/${fileId}?chatbot_id=${chatbotId}`),
    upload: (formData: FormData) => fetchApiFormData('/knowledge/upload', formData),
    download: (fileId: string, chatbotId: string) => `${API_URL}/knowledge/files/${fileId}/download?chatbot_id=${chatbotId}`,
    reprocess: (fileId: string, chatbotId: string) => fetchApi(`/knowledge/files/${fileId}/reprocess?chatbot_id=${chatbotId}`, { method: 'POST' }),
    delete: (fileId: string, chatbotId: string) => fetchApi(`/knowledge/files/${fileId}?chatbot_id=${chatbotId}`, { method: 'DELETE' }),
    export: (chatbotId: string) => fetchApi(`/knowledge/export?chatbot_id=${chatbotId}`),
  },
  chatlogs: {
    list: (params?: { search?: string; chatbotId?: string; status?: string; from?: string; to?: string; limit?: number; offset?: number }) => {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.set('search', params.search);
      if (params?.chatbotId) searchParams.set('chatbot_id', params.chatbotId);
      if (params?.status) searchParams.set('status', params.status);
      if (params?.from) searchParams.set('from_date', params.from);
      if (params?.to) searchParams.set('to_date', params.to);
      if (params?.limit) searchParams.set('limit', String(params.limit));
      if (params?.offset) searchParams.set('offset', String(params.offset));
      const qs = searchParams.toString();
      return fetchApi(`/chatlogs/${qs ? `?${qs}` : ''}`);
    },
    get: (logId: string) => fetchApi(`/chatlogs/${logId}`),
    delete: (logId: string) => fetchApi(`/chatlogs/${logId}`, { method: 'DELETE' }),
    export: () => fetchApi('/chatlogs/export/all'),
    chatbotFilters: () => fetchApi('/chatlogs/filters/chatbots'),
  },
  embed: {
    get: (chatbotId: string) => fetchApi(`/embed/${chatbotId}`),
    update: (chatbotId: string, data: any) => fetchApi(`/embed/${chatbotId}`, { method: 'PATCH', body: JSON.stringify(data) }),
    getScript: (chatbotId: string) => fetchApi(`/embed/${chatbotId}/script`),
  },
  billing: {
    current: () => fetchApi('/billing/current'),
    plans: () => fetchApi('/billing/plans'),
    upgrade: (plan: string) => fetchApi('/billing/upgrade', { method: 'POST', body: JSON.stringify({ plan }) }),
  },
  settings: {
    workspace: () => fetchApi('/settings/workspace'),
    updateWorkspace: (data: any) => fetchApi('/settings/workspace', { method: 'PATCH', body: JSON.stringify(data) }),
    apiKeys: () => fetchApi('/settings/api-keys'),
    createApiKey: () => fetchApi('/settings/api-keys', { method: 'POST' }),
    revokeApiKey: (keyId: string) => fetchApi(`/settings/api-keys/${keyId}`, { method: 'DELETE' }),
    export: () => fetchApi('/settings/export'),
  },
  admin: {
    stats: () => fetchApi('/admin/stats'),
    users: () => fetchApi('/admin/users'),
    updateUserStatus: (workspaceId: string, action: string) =>
      fetchApi(`/admin/users/${workspaceId}/status`, { method: 'PATCH', body: JSON.stringify({ action }) }),
  },
};
