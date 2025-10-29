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

function joinUrl(base, path) {
  const b = String(base).replace(/\/*$/, '');
  const p = String(path || '');
  return `${b}${p.startsWith('/') ? '' : '/'}${p}`;
}

async function request(method, path, body, opts) {
  const base = config.getApiBase();
  const url = joinUrl(base, path);

  const headers = {
    ...(opts.headers || {}),
  };
  if (body != null && !('Content-Type' in headers)) {
    headers['Content-Type'] = 'application/json';
  }

  let res;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body != null ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    const err = new Error('Network error contacting API');
    err.cause = networkErr;
    throw err;
  }

  const raw = await res.text();
  let data;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = raw;
  }

  if (!res.ok) {
    const message =
      (data && (data.error || data.message)) ||
      `Request failed: ${res.status} ${res.statusText}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}
