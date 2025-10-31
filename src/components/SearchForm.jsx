import { useState } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';

// --- 1. TERIMA PROPS 'sortBy' dan 'setSortBy' ---
const SearchForm = ({ onSearchSubmit, sortBy, setSortBy }) => {
  const [query, setQuery] = useState('');
  // Hapus state lokal sortBy
  const [filter1, setFilter1] = useState(false);
  const [filter2, setFilter2] = useState(false);
  const [radioOption, setRadioOption] = useState('option1');

  const handleSubmit = (e) => {
    e.preventDefault(); 
    
    if (query.trim()) {
      // --- 2. KIRIM 'sortBy' SAAT SUBMIT ---
      onSearchSubmit(query.trim(), sortBy); 
    }
  };

  return (
    <form className="search-form with-filters" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Cari artikel..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
        required 
        autoFocus
      />
      
      {/* --- 3. KONTROL INPUT DARI PROPS --- */}
      <select 
        value={sortBy} // Gunakan props 'sortBy'
        onChange={(e) => setSortBy(e.target.value)} // Gunakan props 'setSortBy'
        className="search-select"
      >
        <option value="publishedAt">Terbaru</option>
        <option value="relevancy">Relevansi</option>
        <option value="popularity">Popularitas</option>
      </select>

      {/* (Checkbox dan Radio belum fungsional) */}
      <div className="search-checkboxes">
        <label>
          <input 
            type="checkbox" 
            checked={filter1} 
            onChange={(e) => setFilter1(e.target.checked)} 
          /> Filter 1
        </label>
        <label>
          <input 
            type="checkbox" 
            checked={filter2} 
            onChange={(e) => setFilter2(e.target.checked)} 
          /> Filter 2
        </label>
      </div>
      
      <div className="search-radios">
        <label>
          <input 
            type="radio" 
            name="radioGroup" 
            value="option1" 
            checked={radioOption === 'option1'} 
            onChange={(e) => setRadioOption(e.target.value)} 
          /> Opsi A
        </label>
         <label>
          <input 
            type="radio" 
            name="radioGroup" 
            value="option2" 
            checked={radioOption === 'option2'} 
            onChange={(e) => setRadioOption(e.target.value)} 
          /> Opsi B
        </label>
      </div>

      <button type="submit" className="search-button">
        <HiOutlineSearch />
      </button>
    </form>
  );
};

export default SearchForm;