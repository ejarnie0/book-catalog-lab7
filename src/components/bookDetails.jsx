import { useEffect, useState } from "react";

export default function BookDetails({ book, loan, isOnLoan, onBack, onEdit, onDelete }) {
  const [similarBooks, setSimilarBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!book || !book.title) return;

    const fetchSimilarBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        // Extract main words from title for search (limit to first few words)
        const query = book.title.split(' ').slice(0, 3).join(' ');
        const encodedQuery = encodeURIComponent(query);
        const response = await fetch(`https://api.itbook.store/1.0/search/${encodedQuery}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch similar books');
        }
        
        const data = await response.json();
        // Limit to first 6 results to avoid too many
        const books = data.books ? data.books.slice(0, 6) : [];
        setSimilarBooks(books);
      } catch (err) {
        setError(err.message);
        setSimilarBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarBooks();
  }, [book]);

  if (!book) return null;

  return (
    <div className="book-details">
      <button className="back-button" onClick={onBack}>
        ← Back to Book Listing
      </button>
      
      <div className="book-details-content">
        <div className="book-details-image">
          {book.image ? (
            <img src={book.image} alt={book.title} className="book-details-img" />
          ) : (
            <div className="book-details-placeholder">No Image</div>
          )}
        </div>
        
        <div className="book-details-info">
          <h1>{book.title}</h1>
          
          {isOnLoan && (
            <div className="loan-status-badge" style={{
              background: "#ff6b6b",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              fontSize: "0.9rem",
              fontWeight: "bold",
              display: "inline-block",
              marginBottom: "1rem"
            }}>
              ON LOAN
            </div>
          )}
          
          <div className="book-details-meta">
            <p><strong>Author:</strong> {book.author || "-"}</p>
            <p><strong>Publisher:</strong> {book.publisher || "-"}</p>
            <p><strong>Language:</strong> {book.language || "-"}</p>
            <p><strong>Year:</strong> {book.year || "-"}</p>
            <p><strong>Pages:</strong> {book.pageCount ? `${book.pageCount} pages` : "-"}</p>
          </div>
          
          {isOnLoan && loan && (
            <div className="loan-details" style={{
              marginTop: "1.5rem",
              padding: "1rem",
              background: "#fff3cd",
              borderRadius: "8px"
            }}>
              <h3>Loan Information</h3>
              <p><strong>Borrower:</strong> {loan.borrower}</p>
              <p><strong>Due Date:</strong> {new Date(loan.dueDate).toLocaleDateString()}</p>
              <p><strong>Loan Period:</strong> {loan.loanPeriod} week{loan.loanPeriod !== 1 ? 's' : ''}</p>
            </div>
          )}
          
        </div>
      </div>

      {/* Similar Books Section */}
      <div className="similar-books-section" style={{ marginTop: "3rem" }}>
        <h2 style={{ color: "white", marginBottom: "1.5rem", textAlign: "center" }}>
          Similar Books
        </h2>
        
        {loading && (
          <p style={{ color: "white", textAlign: "center" }}>Loading similar books...</p>
        )}
        
        {error && (
          <p style={{ color: "#ff6b6b", textAlign: "center" }}>
            Unable to load similar books: {error}
          </p>
        )}
        
        {!loading && !error && similarBooks.length === 0 && (
          <p style={{ color: "white", textAlign: "center" }}>No similar books found.</p>
        )}
        
        {!loading && similarBooks.length > 0 && (
          <div className="similar-books-grid">
            {similarBooks.map((similarBook) => (
              <div key={similarBook.isbn13} className="similar-book-card">
                {similarBook.image && (
                  <img 
                    src={similarBook.image} 
                    alt={similarBook.title} 
                    className="similar-book-image"
                  />
                )}
                <div className="similar-book-info">
                  <h3 className="similar-book-title">{similarBook.title}</h3>
                  {similarBook.subtitle && (
                    <p className="similar-book-subtitle">{similarBook.subtitle}</p>
                  )}
                  {similarBook.price && (
                    <p className="similar-book-price">{similarBook.price}</p>
                  )}
                  {similarBook.url && (
                    <a 
                      href={similarBook.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="similar-book-link"
                    >
                      Learn More
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

