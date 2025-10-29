import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createRecipe } from '../services/recipesApi';

const initial = {
  title: '',
  cuisine: '',
  timeMinutes: 0,
  difficulty: 'Easy',
  description: '',
  ingredients: '',
  steps: '',
};

// PUBLIC_INTERFACE
export default function RecipeFormPage() {
  /** Form for adding a new recipe */
  const [form, setForm] = useState(initial);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const payload = {
        title: form.title.trim(),
        cuisine: form.cuisine.trim(),
        timeMinutes: Number(form.timeMinutes) || 0,
        difficulty: form.difficulty,
        description: form.description.trim(),
        ingredients: form.ingredients.split('\n').map(s => s.trim()).filter(Boolean),
        steps: form.steps.split('\n').map(s => s.trim()).filter(Boolean),
      };
      const created = await createRecipe(payload);
      navigate(`/recipes/${created.id}`);
    } catch (ex) {
      setErr(ex.message || 'Failed to create recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <div className="kicker">Create</div>
          <h1 className="page-title">Add Recipe</h1>
        </div>
        <div>
          <Link className="btn" to="/recipes">Cancel</Link>
        </div>
      </div>

      {err && <div className="panel" style={{ borderColor: 'var(--error)', color: 'var(--error)' }}>{err}</div>}

      <form className="panel" onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
        <div>
          <label>Title</label>
          <input className="input" value={form.title} onChange={e => update('title', e.target.value)} required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div>
            <label>Cuisine</label>
            <input className="input" value={form.cuisine} onChange={e => update('cuisine', e.target.value)} />
          </div>
          <div>
            <label>Time (minutes)</label>
            <input className="input" type="number" min="0" value={form.timeMinutes} onChange={e => update('timeMinutes', e.target.value)} />
          </div>
          <div>
            <label>Difficulty</label>
            <select className="select" value={form.difficulty} onChange={e => update('difficulty', e.target.value)}>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
        </div>
        <div>
          <label>Description</label>
          <textarea className="input textarea" value={form.description} onChange={e => update('description', e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label>Ingredients (one per line)</label>
            <textarea className="input textarea" value={form.ingredients} onChange={e => update('ingredients', e.target.value)} />
          </div>
          <div>
            <label>Steps (one per line)</label>
            <textarea className="input textarea" value={form.steps} onChange={e => update('steps', e.target.value)} />
          </div>
        </div>
        <div>
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Recipe'}</button>
        </div>
      </form>
    </div>
  );
}
