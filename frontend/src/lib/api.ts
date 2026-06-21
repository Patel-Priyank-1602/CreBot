const API_URL = 'http://localhost:8000/api';

/**
 * Store the Clerk session token getter.
 * This is set by the Dashboard/BotDetail pages via useAuth().
 */
let _getToken: (() => Promise<string | null>) | null = null;

export function setClerkTokenGetter(getter: () => Promise<string | null>) {
  _getToken = getter;
}

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  // Attach Clerk JWT if available
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

export const api = {
  bots: {
    list: () => fetchApi('/bots/'),
    create: (data: any) => fetchApi('/bots/', { method: 'POST', body: JSON.stringify(data) }),
    train: (botId: string, data: any) => fetchApi(`/bots/${botId}/train`, { method: 'POST', body: JSON.stringify(data) }),
    retrain: (botId: string, data: any) => fetchApi(`/bots/${botId}/retrain`, { method: 'POST', body: JSON.stringify(data) }),
    getSnippet: (botId: string) => fetchApi(`/bots/${botId}/embed-snippet`),
    getLogs: (botId: string) => fetchApi(`/bots/${botId}/logs`),
  },
  chat: (widgetKey: string, question: string, chat_history: { role: string; content: string }[] = []) =>
    fetchApi(`/widget/${widgetKey}/chat`, { method: 'POST', body: JSON.stringify({ question, chat_history }) }),
};
