const API_BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.success === false) {
    throw new Error(body.error || `Request failed: ${response.status}`);
  }
  return body.data !== undefined ? body.data : body;
}

export const api = {
  health: () => request('/api/health'),
  setupUser: (body) => request('/api/users/setup', { method: 'POST', body: JSON.stringify(body) }),
  getUser: (userId) => request(`/api/users/${userId}`),
  updateSensory: (userId, prefs) => request(`/api/users/${userId}/sensory`, { method: 'PATCH', body: JSON.stringify(prefs) }),
  getAssessmentQuestions: (userId) => request(`/api/assessment/${userId}/questions`),
  submitAssessment: (userId, responses) => request(`/api/assessment/${userId}/submit`, { method: 'POST', body: JSON.stringify({ responses }) }),
  getLatestAssessment: (userId) => request(`/api/assessment/${userId}/latest`),
  getActivity: (id) => request(`/api/activities/${id}`),
  getActivities: (params) => {
    const qs = params ? new URLSearchParams(params).toString() : '';
    return request(`/api/activities${qs ? `?${qs}` : ''}`);
  },
  submitAttempt: (userId, body) => request(`/api/attempts/${userId}/submit`, { method: 'POST', body: JSON.stringify(body) }),
  getDashboard: (userId) => request(`/api/dashboard/${userId}`),
  getProgress: (userId) => request(`/api/dashboard/${userId}/progress`),
  recommend: (userId) => request(`/api/dashboard/${userId}/recommend`, { method: 'POST', body: '{}' }),
  getParentView: (userId, pin) => request(`/api/dashboard/${userId}/parent`, { method: 'POST', body: JSON.stringify({ pin }) }),
};
