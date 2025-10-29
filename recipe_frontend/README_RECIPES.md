# Recipe Explorer Frontend

This React app implements:
- Routing via react-router-dom v6
- Global state via Context + useReducer for filters and pagination
- Services layer: apiClient, recipesApi with optional mock mode
- Components: NavBar, SearchFilterPanel, RecipeCard, Pagination
- Pages: RecipesListPage, RecipeDetailsPage, RecipeFormPage
- Theme: "Ocean Professional" with CSS variables in src/App.css

Environment:
- REACT_APP_API_BASE: base URL of backend (e.g., http://localhost:4000)
- REACT_APP_USE_MOCK: if "true", uses in-memory mock data

Run:
- npm start (uses real API)
- npm run start:mock (mock mode)
- npm run build:mock (build with mock mode)

Structure:
- src/config.js: env helpers
- src/services: api client and recipes API
- src/context/AppContext.js: app state provider and hook
- src/components: reusable UI
- src/routes: application pages

Accessibility:
- Buttons/controls include labels/aria attributes where applicable.
