import React, { useState } from 'react';
import { useFetchBooks } from '../hooks/useFetchBooks';

export default function BookList() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, loading, error } = useFetchBooks({ currentPage, searchTerm: '' });

  const goToNextPage = () => setCurrentPage((prevPage) => prevPage + 1);
  const goToPreviousPage = () => setCurrentPage((prevPage) => prevPage - 1);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Book List</h2>
      <ul>
        {data?.books.map((book) => (
          <li key={book.id}>
            {book.title} by {book.author} ({book.publicationYear}) - ISBN: {book.isbn}
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
