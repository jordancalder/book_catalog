import React, { useState, useEffect } from 'react';
import { useFetchBooks } from '../hooks/useFetchBooks';

export default function BookList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const { data, loading, error } = useFetchBooks({ currentPage, searchTerm: debouncedSearchTerm });

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(inputValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  const goToNextPage = () => setCurrentPage((prevPage) => prevPage + 1);
  const goToPreviousPage = () => setCurrentPage((prevPage) => prevPage - 1);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Book List</h2>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Search books..."
      />
      <ul>
        {data?.books.map((book) => (
          <li key={book.id}>
            {book.title} by {book.author} ({book.publicationYear}) - ISBN: {book.ISBN}
          </li>
        ))}
      </ul>
      <div>
        {currentPage > 1 && (
          <button onClick={goToPreviousPage}>Previous</button>
        )}
        {data?.totalPages > currentPage && (
          <button onClick={goToNextPage}>Next</button>
        )}
      </div>
    </div>
  );
};
