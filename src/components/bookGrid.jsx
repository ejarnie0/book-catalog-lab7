export default function BookGrid({ books, loans, isBookOnLoan, onAdd, onEdit, onDelete }) {
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

      {books.map((b) => {
        const onLoan = isBookOnLoan(b.id);
        const loan = loans?.find(l => l.bookId === b.id);
        
        return (
          <article 
            className={`book ${onLoan ? "on-loan" : ""}`} 
            key={b.id}
            style={{ position: "relative" }}
          >
            {onLoan && (
              <div className="loan-badge" style={{
                position: "absolute",
                top: "0.5rem",
                right: "0.5rem",
                background: "#ff6b6b",
                color: "white",
                padding: "0.25rem 0.5rem",
                borderRadius: "4px",
                fontSize: "0.75rem",
                fontWeight: "bold",
                zIndex: 10
              }}>
                ON LOAN
              </div>
            )}
            
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
            
            {onLoan && loan && (
              <p style={{ 
                margin: ".5rem 0", 
                padding: "0.5rem", 
                background: "#fff3cd", 
                borderRadius: "4px",
                fontSize: "0.9rem"
              }}>
                <strong>Loaned to:</strong> {loan.borrower}<br />
                <strong>Due:</strong> {new Date(loan.dueDate).toLocaleDateString()}
              </p>
            )}

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
        );
      })}
    </div>
  );
}
