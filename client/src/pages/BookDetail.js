import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState({});
  const [rating, setRating] = useState('');
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`/api/books/${id}`);
        const book = await response.json();
        setBook(book);
        setAverageRating(book.averageRating);
      } catch (error) {
        console.error('Failed to fetch book details:', error);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleRatingChange = (e) => {
    setRating(e.target.value);
  };

  const submitRating = async () => {
    try {
      const response = await fetch(`/api/books/${id}/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rating })
      });

      const fetchedRating = await response.json();
      setAverageRating(fetchedRating.averageRating);
    } catch (error) {
      console.error('Failed to submit rating:', error);
    }
  };

  return (
    <div>
      <h2>{book.title}</h2>
      <p>Author: {book.author}</p>
      <p>Publication Year: {book.publicationYear}</p>
      <p>Rating: {averageRating}</p>
      <div>
        <input
          type="number"
          value={rating}
          onChange={handleRatingChange}
          min="1"
          max="5"
          placeholder="Rate 1-5"
        />
        <button onClick={submitRating}>Submit Rating</button>
      </div>
    </div>
  );
}

export default BookDetail;
