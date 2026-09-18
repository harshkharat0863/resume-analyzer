import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function signUp(name, email, password) {
  const res = await axios.post(`${API_URL}/auth/signup`, { name, email, password });
  return res.data;
}

export async function signIn(email, password) {
  const res = await axios.post(`${API_URL}/auth/signin`, { email, password });
  return res.data;
}

export async function getMe(token) {
  const res = await axios.get(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function saveHistory(token, filename, result) {
  const res = await axios.post(
    `${API_URL}/history/save`,
    { filename, result },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}

export async function getHistory(token) {
  const res = await axios.get(`${API_URL}/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.history;
}

export async function deleteHistory(token, id) {
  await axios.delete(`${API_URL}/history/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
export async function forgotPassword(email) {
  const res = await axios.post(`${API_URL}/auth/forgot-password`, { email });
  return res.data;
}

export async function resetPassword(token, newPassword) {
  const res = await axios.post(`${API_URL}/auth/reset-password`, { token, new_password: newPassword });
  return res.data;
}
export async function updateProfile(token, name) {
  const res = await axios.put(
    `${API_URL}/auth/update-profile`,
    { name },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}

export async function changePassword(token, currentPassword, newPassword) {
  const res = await axios.put(
    `${API_URL}/auth/change-password`,
    { current_password: currentPassword, new_password: newPassword },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}

export async function deleteAccount(token) {
  const res = await axios.delete(`${API_URL}/auth/delete-account`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
export async function getSharedResult(id) {
  const res = await axios.get(`${API_URL}/share/${id}`);
  return res.data;
}