const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

let token = '';

export function setApiToken(value: string) {
  token = value;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || 'Request failed');
  }

  return res.json();
}

export const api = {
  register: (payload: { name?: string; username: string; email: string; password: string }) =>
    request<{ accessToken: string }>('/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload: { email: string; password: string }) =>
    request<{ accessToken: string }>('/login', { method: 'POST', body: JSON.stringify(payload) }),
  listSets: () => request<Array<any>>('/sets'),
  createSet: (payload: { name: string; difficulty: 'easy' | 'good' | 'hard' }) =>
    request('/sets', { method: 'POST', body: JSON.stringify(payload) }),
  updateSet: (id: string, payload: { name?: string; difficulty?: 'easy' | 'good' | 'hard' }) =>
    request(`/sets/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteSet: (id: string) => request(`/sets/${id}`, { method: 'DELETE' }),
  addCard: (setId: string, payload: { title: string; definition: string }) =>
    request(`/sets/${setId}/cards`, { method: 'POST', body: JSON.stringify(payload) }),
  updateCard: (setId: string, cardId: string, payload: { title?: string; definition?: string }) =>
    request(`/sets/${setId}/cards/${cardId}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteCard: (setId: string, cardId: string) => request(`/sets/${setId}/cards/${cardId}`, { method: 'DELETE' }),
  markLearned: (setId: string, cardId: string, learned: boolean) =>
    request(`/sets/${setId}/cards/${cardId}/mark-learned`, { method: 'POST', body: JSON.stringify({ learned }) }),
  testAutomatic: () => request<Array<any>>('/test/automatic'),
  testBySet: (setId: string) => request<Array<any>>(`/test/by-set/${setId}`),
  testByDifficulty: (difficulty: 'easy' | 'good' | 'hard') => request<Array<any>>(`/test/by-difficulty/${difficulty}`),
  completeTest: () => request<{ dailyStreak: number }>('/test/complete', { method: 'POST' }),
  getStreak: () => request<{ dailyStreak: number }>('/analytics/streak'),
  getScore: () => request<{ memorizeScore: number }>('/analytics/memorize-score'),
};
