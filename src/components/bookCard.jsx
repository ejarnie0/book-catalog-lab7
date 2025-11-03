import React from "react";

// UI for book card component

const BookCard = ({ image, title, authors, learnMore }) => {
    return (
        <div className="book-card">
            <button className='close-button'>Close X</button>
            <img src={image} className="book-image"/>
            <h2>{title}</h2>
            <h3 className="book-author">{authors}</h3>
            <a href={learnMore} target="_blank" rel="noopener noreferrer">Learn more</a>
        </div>
    );
};

export default BookCard;