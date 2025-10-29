import { apiGet, apiPost } from './apiClient';
import { config } from '../config';

const mockDb = (() => {
  const items = [
    { id: '1', title: 'Spaghetti Carbonara', cuisine: 'Italian', timeMinutes: 25, difficulty: 'Easy', tags: ['Pasta'], imageUrl: '', description: 'Creamy pasta with pancetta and parmesan.', ingredients: ['Spaghetti', 'Eggs', 'Pancetta', 'Parmesan', 'Pepper'], steps: ['Boil pasta', 'Cook pancetta', 'Mix eggs and cheese', 'Combine'] },
    { id: '2', title: 'Chicken Tikka Masala', cuisine: 'Indian', timeMinutes: 50, difficulty: 'Medium', tags: ['Curry'], imageUrl: '', description: 'Rich tomato curry with marinated chicken.', ingredients: ['Chicken', 'Yogurt', 'Spices', 'Tomatoes', 'Cream'], steps: ['Marinate', 'Sear chicken', 'Make sauce', 'Simmer'] },
    { id: '3', title: 'Sushi Bowl', cuisine: 'Japanese', timeMinutes: 35, difficulty: 'Medium', tags: ['Rice', 'Seafood'], imageUrl: '', description: 'Deconstructed sushi with fresh toppings.', ingredients: ['Rice', 'Nori', 'Salmon', 'Avocado', 'Soy'], steps: ['Cook rice', 'Assemble bowl'] },
  ];
  return {
    list({ q = '', page = 1, pageSize = 9, cuisine, difficulty }) {
      let filtered = items;
      if (q) {
        const s = q.toLowerCase();
        filtered = filtered.filter(r => r.title.toLowerCase().includes(s) || r.description.toLowerCase().includes(s));
      }
      if (cuisine) filtered = filtered.filter(r => r.cuisine === cuisine);
      if (difficulty) filtered = filtered.filter(r => r.difficulty === difficulty);
      const total = filtered.length;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      return Promise.resolve({ items: filtered.slice(start, end), total, page, pageSize });
    },
    get(id) {
      const found = items.find(r => r.id === id);
      if (!found) return Promise.reject(Object.assign(new Error('Not found'), { status: 404 }));
      return Promise.resolve(found);
    },
    create(payload) {
      const id = String(items.length + 1);
      const rec = { id, ...payload };
      items.push(rec);
      return Promise.resolve(rec);
    }
  };
})();

// PUBLIC_INTERFACE
export async function fetchRecipes(params) {
  /**
   * Fetch paginated list of recipes.
   * params: { q, page, pageSize, cuisine, difficulty }
   */
  if (config.useMock()) {
    return mockDb.list(params || {});
  }
  const query = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') query.append(k, v);
  });
  return apiGet(`/recipes?${query.toString()}`);
}

// PUBLIC_INTERFACE
export async function fetchRecipeById(id) {
  /** Fetch a single recipe by id. */
  if (config.useMock()) {
    return mockDb.get(id);
  }
  return apiGet(`/recipes/${encodeURIComponent(id)}`);
}

// PUBLIC_INTERFACE
export async function createRecipe(payload) {
  /** Create a new recipe from payload. */
  if (config.useMock()) {
    return mockDb.create(payload);
  }
  return apiPost('/recipes', payload);
}
