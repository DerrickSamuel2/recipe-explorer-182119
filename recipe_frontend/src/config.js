export const config = {
  // PUBLIC_INTERFACE
  getApiBase() {
    /**
     * Returns API base URL from env or default.
     * Reads REACT_APP_API_BASE_URL; falls back to http://localhost:4000/api.
     * Keeps backward compatibility with REACT_APP_API_BASE if present.
     * Strips trailing slashes for consistent URL join.
     */
    const base =
      process.env.REACT_APP_API_BASE_URL ||
      process.env.REACT_APP_API_BASE || // backward compatibility with older name
      'http://localhost:4000/api';
    return String(base).replace(/\/*$/, '');
  },
  // PUBLIC_INTERFACE
  useMock() {
    /**
     * Returns whether to use mock API based on REACT_APP_USE_MOCK env.
     * Default to false unless explicitly set to "true".
     */
    return String(process.env.REACT_APP_USE_MOCK || '').toLowerCase() === 'true';
  }
};
