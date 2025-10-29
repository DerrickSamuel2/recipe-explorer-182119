import React from 'react';

// PUBLIC_INTERFACE
export default function Pagination({ page, pageSize, total, onPageChange }) {
  /** Pagination control with previous/next and page indicators */
  const totalPages = Math.max(1, Math.ceil((total || 0) / (pageSize || 10)));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const goto = (p) => {
    if (p >= 1 && p <= totalPages) onPageChange(p);
  };

  return (
    <div className="pagination" aria-label="Pagination">
      <button className="btn" onClick={() => goto(1)} disabled={!canPrev} aria-disabled={!canPrev}>⏮ First</button>
      <button className="btn" onClick={() => goto(page - 1)} disabled={!canPrev} aria-disabled={!canPrev}>◀ Prev</button>
      <span className="badge">Page {page} / {totalPages}</span>
      <button className="btn" onClick={() => goto(page + 1)} disabled={!canNext} aria-disabled={!canNext}>Next ▶</button>
      <button className="btn" onClick={() => goto(totalPages)} disabled={!canNext} aria-disabled={!canNext}>Last ⏭</button>
    </div>
  );
}
