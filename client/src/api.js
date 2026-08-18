const BASE_URL = '/api';

async function handleResponse(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = body.errors ? body.errors.join(' ') : `Request failed (${res.status})`;
    throw new Error(message);
  }
  return res.json();
}

export async function fetchEntries(contract) {
  const url = contract ? `${BASE_URL}/entries?contract=${encodeURIComponent(contract)}` : `${BASE_URL}/entries`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function fetchContracts() {
  const res = await fetch(`${BASE_URL}/entries/contracts`);
  return handleResponse(res);
}

export async function createEntry(entry) {
  const res = await fetch(`${BASE_URL}/entries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  return handleResponse(res);
}

export async function fetchSummary() {
  const res = await fetch(`${BASE_URL}/summary`);
  return handleResponse(res);
}
