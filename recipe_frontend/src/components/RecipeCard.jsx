import React from 'react';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function RecipeCard({ recipe }) {
  /** Card preview for a recipe item with title, cuisine and time */
  const coverStyle = recipe.imageUrl
    ? { backgroundImage: `url(${recipe.imageUrl})` }
    : { backgroundImage: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(245,158,11,0.15))' };

  return (
    <div className="card">
      <div className="card-media" style={coverStyle} role="img" aria-label={`${recipe.title} image`} />
      <div className="card-body">
        <div className="badge" title="Cuisine and time">
          🍽 {recipe.cuisine || 'General'} • ⏱ {recipe.timeMinutes || 0}m
        </div>
        <h3 className="card-title">{recipe.title}</h3>
        <div className="card-meta">Difficulty: {recipe.difficulty || 'N/A'}</div>
        <div style={{ marginTop: 10 }}>
          <Link to={`/recipes/${recipe.id}`} className="btn btn-primary">View</Link>
        </div>
      </div>
    </div>
  );
}
