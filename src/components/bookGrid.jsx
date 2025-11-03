export default function BookGrid({ books, onAdd, onEdit, onDelete }) {
  return (
    <div className="books-grid">
      {/* Add Book card */}
      <div className="add-book-card" onClick={onAdd} role="button" tabIndex={0}
           onKeyDown={(e)=>{ if(e.key==='Enter') onAdd(); }}>
        <span className="add-book-text">+ Add Book</span>
      </div>

      {books.length === 0 && (
        <div className="book">
          <p>No books match your filters.</p>
        </div>
      )}

      {books.map((b) => (
        <article className="book" key={b.id}>
          {b.image ? (
            <img src={b.image} alt={b.title} className="book-image" />
          ) : null}

          <h3>{b.title}</h3>
          <p className="price">{b.author}</p>
          <p style={{ margin: ".25rem 0" }}>
            <strong>Publisher:</strong> {b.publisher || "-"}
          </p>
          <p style={{ margin: ".25rem 0" }}>
            <strong>Language:</strong> {b.language || "-"}
          </p>
          <p style={{ margin: ".25rem 0" }}>
            <strong>Year:</strong> {b.year || "-"}
          </p>

          <div className="action-buttons" style={{ marginTop: "1rem" }}>
            <button className="edit-button" onClick={() => onEdit(b.id)}>Edit</button>
            <button
              className="delete-button"
              onClick={() => { if (confirm("Delete this book?")) onDelete(b.id); }}
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
