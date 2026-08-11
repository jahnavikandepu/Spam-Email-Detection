/**
 * SpamGuard API Service
 * Handles email prediction, history, and stats REST API integration with Express backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Send email content to POST /api/predict
 * @param {string} emailContent 
 * @returns {Promise<{prediction: 'spam'|'not_spam', confidence: number, message?: string, id?: string}>}
 */
export async function predictEmail(emailContent) {
  if (!emailContent || !emailContent.trim()) {
    throw new Error('Please enter email content');
  }

  const trimmedText = emailContent.trim();

  const response = await fetch(`${API_BASE_URL}/api/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: trimmedText }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || `Server responded with status ${response.status}`);
  }

  return {
    prediction: data.prediction,
    confidence: data.confidence,
    message: data.message,
    id: data.id,
  };
}

/**
 * Fetch prediction history from GET /api/history
 * @param {string} search 
 * @param {string} prediction ('all' | 'spam' | 'not_spam')
 */
export async function fetchHistory(search = '', prediction = 'all') {
  const params = new URLSearchParams();
  if (search && search.trim()) params.append('search', search.trim());
  if (prediction && prediction !== 'all') params.append('prediction', prediction);

  const queryString = params.toString() ? `?${params.toString()}` : '';
  const response = await fetch(`${API_BASE_URL}/api/history${queryString}`);
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch history');
  }

  return data.data || [];
}

/**
 * Fetch a single prediction record by ID from GET /api/history/:id
 * @param {string} id 
 */
export async function fetchHistoryById(id) {
  const response = await fetch(`${API_BASE_URL}/api/history/${id}`);
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch prediction details');
  }

  return data.data;
}

/**
 * Clear all prediction history via DELETE /api/history
 */
export async function clearAllHistory() {
  const response = await fetch(`${API_BASE_URL}/api/history`, {
    method: 'DELETE',
  });
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to clear history');
  }

  return data;
}

/**
 * Delete a single prediction item via DELETE /api/history/:id
 * @param {string} id 
 */
export async function deleteHistoryItem(id) {
  const response = await fetch(`${API_BASE_URL}/api/history/${id}`, {
    method: 'DELETE',
  });
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to delete record');
  }

  return data;
}

/**
 * Fetch aggregate platform stats from GET /api/stats
 */
export async function fetchStats() {
  const response = await fetch(`${API_BASE_URL}/api/stats`);
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch stats');
  }

  return data.data;
}
