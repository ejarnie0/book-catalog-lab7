import { useState } from "react";

export default function LoanManagement({ books, loans, onCreateLoan, onReturnBook }) {
  const [form, setForm] = useState({
    borrower: "",
    bookId: "",
    loanPeriod: 1
  });

  // Get books that are not currently on loan
  const availableBooks = books.filter(book => 
    !loans.some(loan => loan.bookId === book.id)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.borrower.trim() || !form.bookId) {
      alert("Please fill in all fields.");
      return;
    }
    onCreateLoan(form);
    setForm({ borrower: "", bookId: "", loanPeriod: 1 });
  };

  const handleReturn = (loanId) => {
    if (confirm("Return this book?")) {
      onReturnBook(loanId);
    }
  };

  // Get loan details with book information
  const loansWithBooks = loans.map(loan => {
    const book = books.find(b => b.id === loan.bookId);
    return { ...loan, book };
  }).filter(loan => loan.book); // Filter out loans for deleted books

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="loan-management">
      <h2>Loan Management</h2>
      
      {/* Loan Form */}
      {availableBooks.length > 0 ? (
        <form className="loan-form" onSubmit={handleSubmit}>
          <h3>Create New Loan</h3>
          
          <input
            type="text"
            placeholder="Borrower Name *"
            value={form.borrower}
            onChange={(e) => setForm({ ...form, borrower: e.target.value })}
            required
          />
          
          <select
            value={form.bookId}
            onChange={(e) => setForm({ ...form, bookId: e.target.value })}
            required
          >
            <option value="">Select a book...</option>
            {availableBooks.map(book => (
              <option key={book.id} value={book.id}>
                {book.title} by {book.author}
              </option>
            ))}
          </select>
          
          <label>
            Loan Period (weeks):
            <input
              type="number"
              min="1"
              max="4"
              value={form.loanPeriod}
              onChange={(e) => {
                let value = parseInt(e.target.value) || 1;
                if (value < 1) value = 1;
                if (value > 4) value = 4;
                setForm({ ...form, loanPeriod: value });
              }}
              required
            />
          </label>
          
          <button type="submit">Create Loan</button>
        </form>
      ) : (
        <div className="all-books-loaned">
          <p>All books are currently on loan.</p>
        </div>
      )}

      {/* Loans List */}
      <div className="loans-list">
        <h3>Current Loans ({loansWithBooks.length})</h3>
        {loansWithBooks.length === 0 ? (
          <p>No books are currently on loan.</p>
        ) : (
          <div className="loans-grid">
            {loansWithBooks.map((loan) => (
              <div key={loan.id} className="loan-item">
                <div className="loan-info">
                  <p><strong>Borrower:</strong> {loan.borrower}</p>
                  <p><strong>Book:</strong> {loan.book.title}</p>
                  <p><strong>Due Date:</strong> {formatDate(loan.dueDate)}</p>
                </div>
                <button
                  className="return-button"
                  onClick={() => handleReturn(loan.id)}
                >
                  Return Book
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

