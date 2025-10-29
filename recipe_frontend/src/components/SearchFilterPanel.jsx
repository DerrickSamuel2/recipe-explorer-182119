import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const cuisines = ['', 'Italian', 'Indian', 'Japanese', 'Mexican', 'French'];
const difficulties = ['', 'Easy', 'Medium', 'Hard'];

// PUBLIC_INTERFACE
export default function SearchFilterPanel({ onSearch }) {
  /** Filter panel for search, cuisine and difficulty */
  const { state } = useApp();
  const [q, setQ] = useState(state.search);
  const [cuisine, setCuisine] = useState(state.cuisine);
  const [difficulty, setDifficulty] = useState(state.difficulty);

  useEffect(() => {
    setQ(state.search);
    setCuisine(state.cuisine);
    setDifficulty(state.difficulty);
  }, [state.search, state.cuisine, state.difficulty]);

  const submit = (e) => {
    e.preventDefault();
    onSearch({ q, cuisine, difficulty });
  };

  return (
    <form className="panel search-filter" onSubmit={submit} aria-label="Search and filter recipes">
      <input className="input" value={q} onChange={e => setQ(e.target.value)} placeholder="Search recipes..." aria-label="Search" />
      <select className="select" value={cuisine} onChange={e => setCuisine(e.target.value)} aria-label="Cuisine">
        {cuisines.map(c => <option key={c} value={c}>{c || 'All cuisines'}</option>)}
      </select>
      <select className="select" value={difficulty} onChange={e => setDifficulty(e.target.value)} aria-label="Difficulty">
        {difficulties.map(d => <option key={d} value={d}>{d || 'All difficulties'}</option>)}
      </select>
      <button className="btn btn-primary" type="submit">Search</button>
    </form>
  );
}
