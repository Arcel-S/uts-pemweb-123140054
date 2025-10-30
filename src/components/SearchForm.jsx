import { useState } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';

const SearchForm = ({ onSearchSubmit }) => {
  const [query, setQuery] = useState('');
  // State baru untuk input tambahan (belum digunakan)
  const [sortBy, setSortBy] = useState('publishedAt');
  const [filter1, setFilter1] = useState(false);
  const [filter2, setFilter2] = useState(false);
  const [radioOption, setRadioOption] = useState('option1');

  const handleSubmit = (e) => {
    e.preventDefault(); 
    
    if (query.trim()) {
      onSearchSubmit(query.trim()); 
    }
  };

  return (
    <form className="search-form with-filters" onSubmit={handleSubmit}>
      {/* Input #1: Text (Sudah ada) */}
      <input
        type="text"
        placeholder="Cari artikel..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
        required 
        autoFocus
      />
      
      {/* Input #2: Select (Dropdown) */}
      <select 
        value={sortBy} 
        onChange={(e) => setSortBy(e.target.value)} 
        className="search-select"
      >
        <option value="publishedAt">Terbaru</option>
        <option value="relevancy">Relevansi</option>
        <option value="popularity">Popularitas</option>
      </select>

      {/* Input #3 & #4: Checkbox */}
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
      
      {/* Input #5 & #6: Radio Buttons */}
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