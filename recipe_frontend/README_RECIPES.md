# Recipe Explorer Frontend

This React app implements:
- Routing via react-router-dom v6
- Global state via Context + useReducer for filters and pagination
- Services layer: apiClient, recipesApi with optional mock mode
- Components: NavBar, SearchFilterPanel, RecipeCard, Pagination
- Pages: RecipesListPage, RecipeDetailsPage, RecipeFormPage
- Theme: "Ocean Professional" with CSS variables in src/App.css

Environment:
- REACT_APP_API_BASE_URL: base URL of backend API (e.g., http://localhost:4000/api)
- REACT_APP_USE_MOCK: if "true", uses in-memory mock data. Any other value disables mock mode.

Setup:
1) Copy .env.example to .env and set your backend base URL:
   REACT_APP_API_BASE_URL=http://localhost:4000/api
   REACT_APP_USE_MOCK=0

2) Start the backend server on port 4000 (or adjust the URL above).
   Ensure the backend exposes endpoints like:
   - GET    /api/recipes
   - GET    /api/recipes/:id
   - POST   /api/recipes
   - PUT    /api/recipes/:id
   - DELETE /api/recipes/:id

3) Start the frontend:
   npm install
   npm start
   Open http://localhost:3000

Mock mode:
- To run without a backend, enable mock mode:
  npm run start:mock
  or set REACT_APP_USE_MOCK=true in .env

Structure:
- src/config.js: env helpers (reads REACT_APP_API_BASE_URL, REACT_APP_USE_MOCK)
- src/services: api client and recipes API
- src/context/AppContext.js: app state provider and hook
- src/components: reusable UI
- src/routes: application pages

API usage details:
- List recipes: GET /recipes with query params:
  q (or query), cuisine, tags (comma-separated), page, pageSize
- Get by id: GET /recipes/:id
- Create: POST /recipes
- Update: PUT /recipes/:id
- Delete: DELETE /recipes/:id

Model fields aligned with backend:
title, description, cuisine, tags, ingredients, steps, rating, imageUrl,
prepTimeMin, cookTimeMin, servings, id, createdAt, updatedAt

Accessibility:
- Buttons/controls include labels/aria attributes where applicable.
