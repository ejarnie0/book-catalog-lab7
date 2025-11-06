import { useEffect, useMemo, useState } from "react";
import BookForm from "./components/bookForm.jsx";
import FilterBar from "./components/filterBar.jsx";
import BookGrid from "./components/bookGrid.jsx";
import Modal from "./components/modal.jsx";
import LoanManagement from "./components/loanManagement.jsx";
import BookDetails from "./components/bookDetails.jsx";

const LS_KEY = "books_v1";
const LS_LOANS_KEY = "loans_v1";

// const seed = [
//     { id: crypto.randomUUID(), title: "Dune", author: "Frank Herbert", publisher: "Ace", language: "English", year: 1965, image: "" },
//     { id: crypto.randomUUID(), title: "Le Petit Prince", author: "Antoine de Saint-Exupéry", publisher: "Gallimard", language: "French", year: 1943, image: "" },
//     { id: crypto.randomUUID(), title: "Norwegian Wood", author: "Haruki Murakami", publisher: "Kodansha", language: "Japanese", year: 1987, image: "" },
// ];

const seed = [
    {
        id: crypto.randomUUID(),
        title: "Effective JavaScript",
        author: "David Herman",
        publisher: "Addison-Wesley",
        language: "English",
        year: 2012,
        image: "https://itbook.store/img/books/9780321812186.png"
    },
    {
        id: crypto.randomUUID(),
        title: "Beginning JavaScript, 3nd Edition",
        author: "Russ Ferguson",
        publisher: "Apress",
        language: "English",
        year: 2019,
        image: "https://itbook.store/img/books/9781484243947.png"
    },
    {
        id: crypto.randomUUID(),
        title: "Learn Enough JavaScript to Be Dangerous",
        author: "Michael Hartl",
        publisher: "Addison-Wesley",
        language: "English",
        year: 2020,
        image: "https://itbook.store/img/books/9780137843749.png"
    },
    {
        id: crypto.randomUUID(),
        title: "Test-Driven JavaScript Development",
        author: "Christian Johansen",
        publisher: "Addison-Wesley",
        language: "English",
        year: 2010,
        image: "https://itbook.store/img/books/9780321683915.png"
    },
    {
        id: crypto.randomUUID(),
        title: "Learning JavaScript",
        author: "Ethan Brown",
        publisher: "O'Reilly Media",
        language: "English",
        year: 2016,
        image: "https://itbook.store/img/books/9780321832740.png"
    },
    {
        id: crypto.randomUUID(),
        title: "jQuery and JavaScript Phrasebook",
        author: "Brad Dayley",
        publisher: "Addison-Wesley",
        language: "English",
        year: 2014,
        image: "https://itbook.store/img/books/9780321918963.png"
    },
    {
        id: crypto.randomUUID(),
        title: "JavaScript: The Good Parts",
        author: "Douglas Crockford",
        publisher: "O'Reilly Media",
        language: "English",
        year: 2008,
        image: "https://itbook.store/img/books/9780596517748.png"
    },
    {
        id: crypto.randomUUID(),
        title: "Head First JavaScript",
        author: "Michael Morrison",
        publisher: "O'Reilly Media",
        language: "English",
        year: 2008,
        image: "https://itbook.store/img/books/9780596527747.png"
    },
    {
        id: crypto.randomUUID(),
        title: "High Performance JavaScript",
        author: "Nicholas C. Zakas",
        publisher: "O'Reilly Media",
        language: "English",
        year: 2010,
        image: "https://itbook.store/img/books/9780596802790.png"
    },
    {
        id: crypto.randomUUID(),
        title: "Building iPhone Apps with HTML, CSS, and JavaScript",
        author: "Jonathan Stark",
        publisher: "O'Reilly Media",
        language: "English",
        year: 2010,
        image: "https://itbook.store/img/books/9780596805784.png"
    }
]

export default function App() {
    const [books, setBooks] = useState([]);
    const [loans, setLoans] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [filters, setFilters] = useState({ publisher: "", language: "" });
    const [modalOpen, setModalOpen] = useState(false);
    const [currentView, setCurrentView] = useState("books");
    const [selectedBookId, setSelectedBookId] = useState(null); // For details view
    const [selectedBookIdForEdit, setSelectedBookIdForEdit] = useState(null); // For selection in grid

  // load once
    useEffect(() => {
        const fromLS = localStorage.getItem(LS_KEY);
        if (fromLS) {
        try { setBooks(JSON.parse(fromLS)); }
        catch { setBooks(seed); }
        } else {
        setBooks(seed);
        }
        
        // Load loans
        const loansLS = localStorage.getItem(LS_LOANS_KEY);
        if (loansLS) {
            try { setLoans(JSON.parse(loansLS)); }
            catch { setLoans([]); }
        } else {
            setLoans([]);
        }
    }, []);

    // persist
    useEffect(() => {
        localStorage.setItem(LS_KEY, JSON.stringify(books));
    }, [books]);

    useEffect(() => {
        localStorage.setItem(LS_LOANS_KEY, JSON.stringify(loans));
    }, [loans]);

    const unique = (arr) => [...new Set(arr.filter(Boolean))].sort((a,b)=>a.localeCompare(b));
    const publishers = useMemo(() => unique(books.map(b => b.publisher)), [books]);
    const languages  = useMemo(() => unique(books.map(b => b.language)),  [books]);

    const editingBook = useMemo(
        () => books.find(b => b.id === editingId) || null,
        [books, editingId]
    );

    const selectedBook = useMemo(
        () => books.find(b => b.id === selectedBookId) || null,
        [books, selectedBookId]
    );

    const selectedBookLoan = useMemo(
        () => loans.find(l => l.bookId === selectedBookId) || null,
        [loans, selectedBookId]
    );

    const selectedBookForEdit = useMemo(
        () => books.find(b => b.id === selectedBookIdForEdit) || null,
        [books, selectedBookIdForEdit]
    );

    const filtered = useMemo(() => {
        return books.filter(b =>
        (!filters.publisher || b.publisher === filters.publisher) &&
        (!filters.language  || b.language  === filters.language)
        );
    }, [books, filters]);

    const upsertBook = (payload) => {
        if (payload.id) {
        setBooks(prev => prev.map(b => b.id === payload.id ? payload : b));
        } else {
        setBooks(prev => [...prev, { ...payload, id: crypto.randomUUID() }]);
        }
        setEditingId(null);
        setModalOpen(false);
    };

    const removeBook = (id) => {
        // Also remove any loans for this book
        setLoans(prev => prev.filter(loan => loan.bookId !== id));
        setBooks(prev => prev.filter(b => b.id !== id));
        // Clear selection if the deleted book was selected
        if (selectedBookIdForEdit === id) {
            setSelectedBookIdForEdit(null);
        }
    };

    const openAdd = () => { 
        setEditingId(null); 
        setModalOpen(true); 
        setSelectedBookIdForEdit(null);
    };
    const openEdit = (id) => { 
        setEditingId(id); 
        setModalOpen(true); 
        setSelectedBookIdForEdit(null);
    };
    const viewDetails = (id) => { setSelectedBookId(id); };
    const backToList = () => { setSelectedBookId(null); };
    const selectBook = (id) => { setSelectedBookIdForEdit(id); };

    // Loan management functions
    const createLoan = ({ borrower, bookId, loanPeriod }) => {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + (loanPeriod * 7));
        
        const newLoan = {
            id: crypto.randomUUID(),
            bookId,
            borrower: borrower.trim(),
            dueDate: dueDate.toISOString(),
            loanPeriod
        };
        setLoans(prev => [...prev, newLoan]);
    };

    const returnBook = (loanId) => {
        setLoans(prev => prev.filter(loan => loan.id !== loanId));
    };

    // Check if a book is on loan
    const isBookOnLoan = (bookId) => {
        return loans.some(loan => loan.bookId === bookId);
    };

    return (
        <div className="app">
        <header className="header">
            <h1>Book Catalog</h1>
            <div className="view-switcher">
                <button
                    className={currentView === "books" ? "active" : ""}
                    onClick={() => setCurrentView("books")}
                >
                    Book Listing
                </button>
                <button
                    className={currentView === "loans" ? "active" : ""}
                    onClick={() => setCurrentView("loans")}
                >
                    Loan Management
                </button>
            </div>
        </header>

        <main className="main-content">
            {currentView === "books" ? (
                selectedBookId ? (
                    <div className="container">
                        <section style={{ gridColumn: "1 / -1", padding: "2rem" }}>
                            <BookDetails
                                book={selectedBook}
                                loan={selectedBookLoan}
                                isOnLoan={isBookOnLoan(selectedBookId)}
                                onBack={backToList}
                                onEdit={(id) => { setSelectedBookId(null); openEdit(id); }}
                                onDelete={(id) => { removeBook(id); setSelectedBookId(null); }}
                            />
                        </section>
                    </div>
                ) : (
                    <div className="container">
                    {/* LEFT PANEL: Filters */}
                    <aside className="left-panel">
                        <FilterBar
                        publishers={publishers}
                        languages={languages}
                        filters={filters}
                        onChange={setFilters}
                        onClear={() => setFilters({ publisher: "", language: "" })}
                        selectedBook={selectedBookForEdit}
                        onEdit={openEdit}
                        onDelete={removeBook}
                        />
                    </aside>

                    {/* GRID: Cards + Add card */}
                    <section style={{ gridColumn: 2 }}>
                        <BookGrid
                        books={filtered}
                        loans={loans}
                        isBookOnLoan={isBookOnLoan}
                        onAdd={openAdd}
                        onViewDetails={viewDetails}
                        selectedBookId={selectedBookIdForEdit}
                        onSelectBook={selectBook}
                        />
                    </section>
                    </div>
                )
            ) : (
                <div className="container">
                    <section style={{ gridColumn: "1 / -1", padding: "2rem" }}>
                        <LoanManagement
                            books={books}
                            loans={loans}
                            onCreateLoan={createLoan}
                            onReturnBook={returnBook}
                        />
                    </section>
                </div>
            )}
        </main>

        <footer className="footer">
            <p>&copy; {new Date().getFullYear()} Book Catalog</p>
        </footer>

        {/* Popup for Add/Edit */}
        <Modal
            open={modalOpen}
            title={editingBook ? "Edit Book" : "Add Book"}
            onClose={() => { setModalOpen(false); setEditingId(null); }}
        >
            <BookForm
            initial={editingBook}
            onSave={upsertBook}
            onCancel={() => { setModalOpen(false); setEditingId(null); }}
            />
        </Modal>
        </div>
    );
}
