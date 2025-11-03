export default function FilterBar({ publishers, languages, filters, onChange, onClear }) {
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
    </div>
  );
}
