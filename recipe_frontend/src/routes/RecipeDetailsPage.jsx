import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchRecipeById } from '../services/recipesApi';

// PUBLIC_INTERFACE
export default function RecipeDetailsPage() {
  /** Detailed view of a single recipe with ingredients and steps */
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchRecipeById(id);
        if (mounted) setRecipe(data);
      } catch (e) {
        setErr(e.message || 'Failed to load recipe');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div className="panel">Loading...</div>;
  if (err) return <div className="panel" style={{ borderColor: 'var(--error)', color: 'var(--error)' }}>{err}</div>;
  if (!recipe) return <div className="panel">Recipe not found</div>;

  return (
    <div>
      <div className="page-heading">
        <div>
          <div className="kicker">Recipe</div>
          <h1 className="page-title">{recipe.title}</h1>
        </div>
        <div>
          <Link className="btn" to="/recipes">Back to list</Link>
        </div>
      </div>

      <div className="detail-hero panel">
        <div className="badge">🍽 {recipe.cuisine || 'General'} • ⏱ {recipe.timeMinutes || 0}m • ⭐ {recipe.difficulty || 'N/A'}</div>
        <p style={{ marginTop: 12 }}>{recipe.description}</p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="panel">
          <h3>Ingredients</h3>
          <ul>
            {(recipe.ingredients || []).map((ing, i) => <li key={i}>{ing}</li>)}
          </ul>
        </div>
        <div className="panel">
          <h3>Steps</h3>
          <ol>
            {(recipe.steps || []).map((s, i) => <li key={i} style={{ marginBottom: 6 }}>{s}</li>)}
          </ol>
        </div>
      </div>
    </div>
  );
}
