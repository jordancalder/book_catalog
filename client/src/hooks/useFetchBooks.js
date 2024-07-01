import { useState, useEffect } from 'react';

export const useFetchBooks = ({ searchTerm = '', currentPage }) => {
  const [data, setData] = useState({ books: [], totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const fetched = await fetch(`/api/books?search=${encodeURIComponent(searchTerm)}&page=${currentPage}`);
        const response = await fetched.json();
        setData({ books: response.data, totalPages: response.totalPages });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchTerm, currentPage]);

  return { data, loading, error };
}
