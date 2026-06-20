const API_URL = 'http://localhost:8000/api';

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

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
