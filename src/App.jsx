import { useEffect, useMemo, useState } from "react";
import BookForm from "./components/bookForm.jsx";
import FilterBar from "./components/filterBar.jsx";
import BookGrid from "./components/bookGrid.jsx";
import Modal from "./components/Modal.jsx"

const LS_KEY = "books_v1";

// const seed = [
//     { id: crypto.randomUUID(), title: "Dune", author: "Frank Herbert", publisher: "Ace", language: "English", year: 1965, image: "" },
//     { id: crypto.randomUUID(), title: "Le Petit Prince", author: "Antoine de Saint-Exupéry", publisher: "Gallimard", language: "French", year: 1943, image: "" },
//     { id: crypto.randomUUID(), title: "Norwegian Wood", author: "Haruki Murakami", publisher: "Kodansha", language: "Japanese", year: 1987, image: "" },
// ];

const seed = [
    {
        "title": "Effective JavaScript",
        "subtitle": "68 Specific Ways to Harness the Power of JavaScript",
        "isbn13": "9780321812186",
        "price": "$21.99",
        "image": "https://itbook.store/img/books/9780321812186.png",
        "url": "https://itbook.store/books/9780321812186"
    },
    {
        "title": "Beginning JavaScript, 3nd Edition",
        "subtitle": "The Ultimate Guide to Modern JavaScript Development",
        "isbn13": "9781484243947",
        "price": "$19.02",
        "image": "https://itbook.store/img/books/9781484243947.png",
        "url": "https://itbook.store/books/9781484243947"
    },
    {
        "title": "Learn Enough JavaScript to Be Dangerous",
        "subtitle": "Write Programs, Publish Packages, and Develop Interactive Websites with JavaScript",
        "isbn13": "9780137843749",
        "price": "$31.98",
        "image": "https://itbook.store/img/books/9780137843749.png",
        "url": "https://itbook.store/books/9780137843749"
    },
    {
        "title": "Test-Driven JavaScript Development",
        "subtitle": "",
        "isbn13": "9780321683915",
        "price": "$10.29",
        "image": "https://itbook.store/img/books/9780321683915.png",
        "url": "https://itbook.store/books/9780321683915"
    },
    {
        "title": "Learning JavaScript",
        "subtitle": "A Hands-On Guide to the Fundamentals of Modern JavaScript",
        "isbn13": "9780321832740",
        "price": "$8.99",
        "image": "https://itbook.store/img/books/9780321832740.png",
        "url": "https://itbook.store/books/9780321832740"
    },
    {
        "title": "jQuery and JavaScript Phrasebook",
        "subtitle": "",
        "isbn13": "9780321918963",
        "price": "$14.48",
        "image": "https://itbook.store/img/books/9780321918963.png",
        "url": "https://itbook.store/books/9780321918963"
    },
    {
        "title": "JavaScript: The Good Parts",
        "subtitle": "Unearthing the Excellence in JavaScript",
        "isbn13": "9780596517748",
        "price": "$4.37",
        "image": "https://itbook.store/img/books/9780596517748.png",
        "url": "https://itbook.store/books/9780596517748"
    },
    {
        "title": "Head First JavaScript",
        "subtitle": "A Learner's Companion to JavaScript",
        "isbn13": "9780596527747",
        "price": "$7.72",
        "image": "https://itbook.store/img/books/9780596527747.png",
        "url": "https://itbook.store/books/9780596527747"
    },
    {
        "title": "High Performance JavaScript",
        "subtitle": "Build Faster Web Application Interfaces",
        "isbn13": "9780596802790",
        "price": "$19.59",
        "image": "https://itbook.store/img/books/9780596802790.png",
        "url": "https://itbook.store/books/9780596802790"
    },
    {
        "title": "Building iPhone Apps with HTML, CSS, and JavaScript",
        "subtitle": "Making App Store Apps Without Objective-C or Cocoa",
        "isbn13": "9780596805784",
        "price": "$5.00",
        "image": "https://itbook.store/img/books/9780596805784.png",
        "url": "https://itbook.store/books/9780596805784"
    }
    
]

export default function App() {
    const [books, setBooks] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [filters, setFilters] = useState({ publisher: "", language: "" });
    const [modalOpen, setModalOpen] = useState(false);

  // load once
    useEffect(() => {
        const fromLS = localStorage.getItem(LS_KEY);
        if (fromLS) {
        try { setBooks(JSON.parse(fromLS)); }
        catch { setBooks(seed); }
        } else {
        setBooks(seed);
        }
    }, []);

    // persist
    useEffect(() => {
        localStorage.setItem(LS_KEY, JSON.stringify(books));
    }, [books]);

    const unique = (arr) => [...new Set(arr.filter(Boolean))].sort((a,b)=>a.localeCompare(b));
    const publishers = useMemo(() => unique(books.map(b => b.publisher)), [books]);
    const languages  = useMemo(() => unique(books.map(b => b.language)),  [books]);

    const editingBook = useMemo(
        () => books.find(b => b.id === editingId) || null,
        [books, editingId]
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

    const removeBook = (id) => setBooks(prev => prev.filter(b => b.id !== id));

    const openAdd = () => { setEditingId(null); setModalOpen(true); };
    const openEdit = (id) => { setEditingId(id); setModalOpen(true); };

    return (
        <div className="app">
        <header className="header">
            <h1>Book Catalog</h1>
        </header>

        <main className="main-content">
            <div className="container">
            {/* LEFT PANEL: Filters */}
            <aside className="left-panel">
                <FilterBar
                publishers={publishers}
                languages={languages}
                filters={filters}
                onChange={setFilters}
                onClear={() => setFilters({ publisher: "", language: "" })}
                />
            </aside>

            {/* GRID: Cards + Add card */}
            <section style={{ gridColumn: 2 }}>
                <BookGrid
                books={filtered}
                onAdd={openAdd}
                onEdit={openEdit}
                onDelete={removeBook}
                />
            </section>
            </div>
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
