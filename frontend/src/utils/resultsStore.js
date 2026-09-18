const KEY = "resumecheck_history";

export function saveResult(result, filename) {
  const id = Date.now().toString();
  const entry = {
    id,
    result,
    filename,
    date: new Date().toISOString(),
  };
  const history = getAllResults();
  history.unshift(entry);
  localStorage.setItem(KEY, JSON.stringify(history.slice(0, 20))); // keep last 20
  return id;
}

export function getResult(id) {
  const history = getAllResults();
  return history.find((h) => h.id === id) || null;
}

export function getAllResults() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function deleteResult(id) {
  const history = getAllResults().filter((h) => h.id !== id);
  localStorage.setItem(KEY, JSON.stringify(history));
}