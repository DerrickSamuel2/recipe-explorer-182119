import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AppProvider } from './context/AppContext';
import NavBar from './components/NavBar';
import RecipesListPage from './routes/RecipesListPage';
import RecipeDetailsPage from './routes/RecipeDetailsPage';
import RecipeFormPage from './routes/RecipeFormPage';

// PUBLIC_INTERFACE
function App() {
  /** Maintain a lightweight theme toggle and persist in localStorage */
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <BrowserRouter>
      <AppProvider>
        <div>
          <NavBar onToggleTheme={toggleTheme} theme={theme} />
          <main className="container">
            <Routes>
              <Route path="/" element={<Navigate to="/recipes" replace />} />
              <Route path="/recipes" element={<RecipesListPage />} />
              <Route path="/recipes/new" element={<RecipeFormPage />} />
              <Route path="/recipes/:id" element={<RecipeDetailsPage />} />
              <Route path="*" element={<div>Not Found</div>} />
            </Routes>
          </main>
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
