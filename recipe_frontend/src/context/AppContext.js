import React, { createContext, useContext, useReducer } from 'react';

/**
 * App state includes filters and pagination as well as last list response
 */
const AppContext = createContext();

const initialState = {
  search: '',
  cuisine: '',
  difficulty: '',
  page: 1,
  pageSize: 9,
  lastList: { items: [], total: 0, page: 1, pageSize: 9 },
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FILTERS':
      return { ...state, ...action.payload, page: 1 };
    case 'SET_PAGE':
      return { ...state, page: action.page };
    case 'SET_LIST':
      return { ...state, lastList: action.payload, page: action.payload.page, pageSize: action.payload.pageSize };
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function AppProvider({ children }) {
  /** Provides global state for filters and list cache */
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// PUBLIC_INTERFACE
export function useApp() {
  /** Accessor hook for app context */
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
