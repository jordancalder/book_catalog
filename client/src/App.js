import { BrowserRouter, Routes, Route } from 'react-router-dom';

import BookList from './pages/BookList';
import BookDetail from './pages/BookDetail';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          Book Catalog
        </header>
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/books/:id" element={<BookDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
