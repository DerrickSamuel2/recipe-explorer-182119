import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';
import { config } from '../config';

/**
 * Local mock for development if enabled.
 * Note: Fields align with backend model: title, description, cuisine, tags, ingredients, steps,
 * rating, imageUrl, prepTimeMin, cookTimeMin, servings, id, createdAt, updatedAt
 */
const mockDb = (() => {
  const now = () => new Date().toISOString();
  const items = [
    {
      id: '1',
      title: 'Spaghetti Carbonara',
      description: 'Creamy pasta with pancetta and parmesan.',
      cuisine: 'Italian',
      tags: ['Pasta'],
      ingredients: ['Spaghetti', 'Eggs', 'Pancetta', 'Parmesan', 'Pepper'],
      steps: ['Boil pasta', 'Cook pancetta', 'Mix eggs and cheese', 'Combine'],
      rating: 4.6,
      imageUrl: '',
      prepTimeMin: 10,
      cookTimeMin: 15,
      servings: 2,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: '2',
      title: 'Chicken Tikka Masala',
      description: 'Rich tomato curry with marinated chicken.',
      cuisine: 'Indian',
      tags: ['Curry'],
      ingredients: ['Chicken', 'Yogurt', 'Spices', 'Tomatoes', 'Cream'],
      steps: ['Marinate', 'Sear chicken', 'Make sauce', 'Simmer'],
      rating: 4.7,
      imageUrl: '',
      prepTimeMin: 20,
      cookTimeMin: 30,
      servings: 4,
      createdAt: now(),
      updatedAt: now(),
    },
  ];
  return {
    list({ q = '', page = 1, pageSize = 9, cuisine, tags, difficulty }) {
      // difficulty ignored in backend model; kept for UI compatibility
      let filtered = items;
      if (q) {
        const s = q.toLowerCase();
        filtered = filtered.filter(
          (r) =>
            r.title.toLowerCase().includes(s) ||
            (r.description || '').toLowerCase().includes(s)
        );
      }
      if (cuisine) filtered = filtered.filter((r) => r.cuisine === cuisine);
      if (tags) {
        const tagArr =
          Array.isArray(tags) ? tags : String(tags).split(',').map((t) => t.trim()).filter(Boolean);
        if (tagArr.length) {
          filtered = filtered.filter((r) =>
            (r.tags || []).some((t) => tagArr.includes(t))
          );
        }
      }
      const total = filtered.length;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      return Promise.resolve({ items: filtered.slice(start, end), total, page, pageSize });
    },
    get(id) {
      const found = items.find((r) => r.id === id);
      if (!found) return Promise.reject(Object.assign(new Error('Not found'), { status: 404 }));
      return Promise.resolve(found);
    },
    create(payload) {
      const id = String(items.length + 1);
      const rec = {
        ...payload,
        id,
        createdAt: now(),
        updatedAt: now(),
      };
      items.push(rec);
      return Promise.resolve(rec);
    },
    update(id, payload) {
      const idx = items.findIndex((r) => r.id === id);
      if (idx === -1) return Promise.reject(Object.assign(new Error('Not found'), { status: 404 }));
      items[idx] = { ...items[idx], ...payload, updatedAt: now() };
      return Promise.resolve(items[idx]);
    },
    remove(id) {
      const idx = items.findIndex((r) => r.id === id);
      if (idx === -1) return Promise.reject(Object.assign(new Error('Not found'), { status: 404 }));
      const [deleted] = items.splice(idx, 1);
      return Promise.resolve({ success: true, id: deleted.id });
    },
  };
})();

// PUBLIC_INTERFACE
export async function fetchRecipes(params) {
  /**
   * Fetch paginated list of recipes.
   * params: { q or query, cuisine, tags (comma-separated), page, pageSize }
   */
  if (config.useMock()) {
    return mockDb.list(params || {});
  }
  const query = new URLSearchParams();
  const p = params || {};
  // support q or query
  const search = p.q ?? p.query ?? '';
  if (search) query.set('q', search);
  if (p.cuisine) query.set('cuisine', p.cuisine);
  if (p.tags) {
    const tagsStr = Array.isArray(p.tags) ? p.tags.join(',') : String(p.tags);
    if (tagsStr) query.set('tags', tagsStr);
  }
  if (p.page) query.set('page', String(p.page));
  if (p.pageSize) query.set('pageSize', String(p.pageSize));
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
  /**
   * Create a new recipe.
   * Maps legacy UI fields to backend model where applicable.
   */
  if (config.useMock()) {
    return mockDb.create(mapToBackend(payload));
  }
  return apiPost('/recipes', mapToBackend(payload));
}

// PUBLIC_INTERFACE
export async function updateRecipe(id, payload) {
  /**
   * Update a recipe by id.
   */
  if (config.useMock()) {
    return mockDb.update(id, mapToBackend(payload));
  }
  return apiPut(`/recipes/${encodeURIComponent(id)}`, mapToBackend(payload));
}

// PUBLIC_INTERFACE
export async function deleteRecipe(id) {
  /**
   * Delete a recipe by id.
   */
  if (config.useMock()) {
    return mockDb.remove(id);
  }
  return apiDelete(`/recipes/${encodeURIComponent(id)}`);
}

/**
 * Map UI payload to backend model fields.
 * UI may provide timeMinutes and difficulty; backend expects prepTimeMin and/or cookTimeMin.
 * We place timeMinutes into prepTimeMin if cookTimeMin not provided.
 */
function mapToBackend(payload) {
  const p = { ...(payload || {}) };
  const mapped = {
    title: p.title,
    description: p.description,
    cuisine: p.cuisine,
    tags: p.tags || p.tagList || [],
    ingredients: p.ingredients,
    steps: p.steps,
    rating: p.rating ?? undefined,
    imageUrl: p.imageUrl ?? '',
    prepTimeMin:
      p.prepTimeMin != null
        ? Number(p.prepTimeMin)
        : p.timeMinutes != null
        ? Number(p.timeMinutes)
        : undefined,
    cookTimeMin: p.cookTimeMin != null ? Number(p.cookTimeMin) : undefined,
    servings: p.servings != null ? Number(p.servings) : undefined,
  };
  // Remove undefined keys to keep payload clean
  Object.keys(mapped).forEach((k) => mapped[k] === undefined && delete mapped[k]);
  return mapped;
}
