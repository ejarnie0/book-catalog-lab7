export default function FilterBar({ publishers, languages, filters, onChange, onClear, selectedBook, onEdit, onDelete }) {
  const set = (k, v) => onChange(prev => ({ ...prev, [k]: v }));

  return (
    <div className="books" style={{ padding: "1rem" }}>
      <h2 style={{ color: "#fff", marginTop: 0 }}>Filters</h2>

      <div style={{ display: "grid", gap: "0.75rem" }}>
        <label>
          Publisher:&nbsp;
          <select value={filters.publisher} onChange={e=>set("publisher", e.target.value)}>
            <option value="">All</option>
            {publishers.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>

        <label>
          Language:&nbsp;
          <select value={filters.language} onChange={e=>set("language", e.target.value)}>
            <option value="">All</option>
            {languages.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </label>

        <button type="button" onClick={onClear}>Clear Filters</button>
      </div>

      <div className="book-actions-panel" style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255, 255, 255, 0.3)" }}>
        <h3 style={{ color: "#fff", marginTop: 0, marginBottom: "1rem" }}>Book Actions</h3>
        {selectedBook && (
          <p style={{ color: "#fff", marginBottom: "1rem", fontSize: "0.9rem" }}>
            Selected: <strong>{selectedBook.title}</strong>
          </p>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <button 
            type="button" 
            className="edit-button" 
            onClick={() => selectedBook && onEdit(selectedBook.id)}
            disabled={!selectedBook}
            style={{ width: "100%" }}
          >
            Edit Book
          </button>
          <button 
            type="button" 
            className="delete-button" 
            onClick={() => { if (selectedBook && confirm("Delete this book?")) onDelete(selectedBook.id); }}
            disabled={!selectedBook}
            style={{ width: "100%" }}
          >
            Delete Book
          </button>
        </div>
      </div>
    </div>
  );
}
