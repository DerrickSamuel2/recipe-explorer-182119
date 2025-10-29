export const config = {
  // PUBLIC_INTERFACE
  getApiBase() {
    /** Returns API base URL from env or default. Requires REACT_APP_API_BASE in .env. */
    const base = process.env.REACT_APP_API_BASE || 'http://localhost:4000';
    return base.replace(/\/+$/, '');
  },
  // PUBLIC_INTERFACE
  useMock() {
    /** Returns whether to use mock API based on REACT_APP_USE_MOCK env */
    return String(process.env.REACT_APP_USE_MOCK || '').toLowerCase() === 'true';
  }
};
