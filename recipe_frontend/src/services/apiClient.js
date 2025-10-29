/**
 * Lightweight API client around fetch with JSON handling and error normalization.
 */

import { config } from '../config';

// PUBLIC_INTERFACE
export async function apiGet(path, opts = {}) {
  /** Perform a GET request to the configured API base */
  return request('GET', path, null, opts);
}

// PUBLIC_INTERFACE
export async function apiPost(path, body, opts = {}) {
  /** Perform a POST request with JSON body */
  return request('POST', path, body, opts);
}

// PUBLIC_INTERFACE
export async function apiPut(path, body, opts = {}) {
  /** Perform a PUT request with JSON body */
  return request('PUT', path, body, opts);
}

// PUBLIC_INTERFACE
export async function apiDelete(path, opts = {}) {
  /** Perform a DELETE request */
  return request('DELETE', path, null, opts);
}

async function request(method, path, body, opts) {
  const base = config.getApiBase();
  const url = `${base}${path.startsWith('/') ? '' : '/'}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(opts.headers || {})
  };
  const res = await fetch(url, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  });
  let data = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const err = new Error((data && data.message) || `Request failed: ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}
