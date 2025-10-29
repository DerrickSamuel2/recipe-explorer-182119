import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { fetchRecipes } from '../services/recipesApi';
import SearchFilterPanel from '../components/SearchFilterPanel';
import RecipeCard from '../components/RecipeCard';
import Pagination from '../components/Pagination';

// PUBLIC_INTERFACE
export default function RecipesListPage() {
  /** List/grid of recipes with search/filter and pagination */
  const { state, dispatch } = useApp();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const load = async () => {
    setLoading(true);
    setErr('');
    try {
      const data = await fetchRecipes({
        q: state.search,
        cuisine: state.cuisine,
        difficulty: state.difficulty,
        page: state.page,
        pageSize: state.pageSize,
      });
      dispatch({ type: 'SET_LIST', payload: data });
    } catch (e) {
      setErr(e.message || 'Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.search, state.cuisine, state.difficulty, state.page, state.pageSize]);

  const onSearch = ({ q, cuisine, difficulty }) => {
    dispatch({ type: 'SET_FILTERS', payload: { search: q, cuisine, difficulty } });
  };

  const onPageChange = (p) => {
    dispatch({ type: 'SET_PAGE', page: p });
  };

  const { items, total, page, pageSize } = state.lastList;

  return (
    <div>
      <div className="page-heading">
        <div>
          <div className="kicker">Browse</div>
          <h1 className="page-title">Recipes</h1>
        </div>
      </div>

      <SearchFilterPanel onSearch={onSearch} />

      {err && <div className="panel" style={{ marginTop: 12, borderColor: 'var(--error)', color: 'var(--error)' }}>{err}</div>}
      {loading && <div className="panel" style={{ marginTop: 12 }}>Loading...</div>}

      {!loading && !err && (
        <>
          <div className="grid grid-3" style={{ marginTop: 16 }}>
            {items.map(r => <RecipeCard key={r.id} recipe={r} />)}
            {items.length === 0 && <div className="panel">No recipes found.</div>}
          </div>
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={onPageChange} />
        </>
      )}
    </div>
  );
}
