import React, { useState } from "react";

const AddBook = ({ onAddBook, onClose }) => {
    const [form, setForm] = useState({
        title: '',
        authors: '',
        publisher: '',
        year: '',
        language: '',
        pages: '',
        url: ''
    })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.placeholder.toLowerCase().replace(/ /g, '')]: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // Generate a unique ISBN13 for the new book
        const isbn13 = '978' + Math.random().toString().substr(2, 10);
        
        const newBook = {
            ...form,
            isbn13: isbn13,
            price: '$0.00', // Default price
            image: form.url || 'https://via.placeholder.com/200x300?text=No+Image',
            url: form.url || '#',
            selected: false
        };
        
        onAddBook(newBook);
        onClose();
    }
    
    return (
        <div className="modal-overlay">
            <div className="modal">
                <form className="add-book-form" onSubmit={handleSubmit}>
                    <h2>Add a New Book</h2>
                    <input type="text" placeholder="Title" required onChange={handleChange} />
                    <input type="text" placeholder="Author" required onChange={handleChange} />
                    <input type="text" placeholder="Publisher" required onChange={handleChange} />
                    <input type="text" placeholder="Publication Year" required onChange={handleChange} />
                    <input type="text" placeholder="Language" required onChange={handleChange} />
                    <input type="number" placeholder="Pages" required onChange={handleChange} />
                    <input type="url" placeholder="URL (Book Cover)" onChange={handleChange} />
                    <button type="submit">Add Book</button>
                </form>
            </div>
        </div>
    );
}

export default AddBook;