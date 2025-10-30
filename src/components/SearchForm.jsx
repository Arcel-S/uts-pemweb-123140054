import { useState } from 'react';
// --- 1. IMPORT IKON ---
import { HiOutlineSearch } from 'react-icons/hi';

const SearchForm = ({ onSearchSubmit }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); 
    
    if (query.trim()) {
      onSearchSubmit(query.trim());
      setQuery(''); 
    }
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Cari artikel..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
        required 
        autoFocus
      />
      {/* --- 2. GANTI EMOJI DENGAN IKON --- */}
      <button type="submit" className="search-button">
        <HiOutlineSearch />
      </button>
      {/* --- AKHIR PERUBAHAN --- */}
    </form>
  );
};

export default SearchForm;