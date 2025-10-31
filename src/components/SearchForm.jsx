import { useState } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';
// 1. IMPORT DATEPICKER DI SINI
import DatePicker from 'react-datepicker';

const SearchForm = ({ 
  onSearchSubmit, 
  sortBy, setSortBy, 
  searchInTitle, setSearchInTitle,
  language, setLanguage,
  // 2. TERIMA PROPS TANGGAL
  startDate, setStartDate
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); 
    
    if (query.trim()) {
      const searchPayload = {
        query: query.trim(),
        sortValue: sortBy,
        titleOnly: searchInTitle,
        langValue: language
      };
      onSearchSubmit(searchPayload); 
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
      
      <select 
        value={sortBy} 
        onChange={(e) => setSortBy(e.target.value)} 
        className="search-select"
      >
        <option value="publishedAt">Terbaru</option>
        <option value="relevancy">Relevansi</option>
        <option value="popularity">Popularitas</option>
      </select>

      {/* 3. RENDER DATEPICKER DI SINI */}
      <div className="search-datepicker-wrapper">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          isClearable
          placeholderText="Pilih tanggal..."
          className="search-datepicker-input" // Class baru untuk styling
          dateFormat="dd/MM/yyyy"
        />
      </div>
      {/* AKHIR RENDER DATEPICKER */}

      <div className="search-filters-row">
        <label>
          <input 
            type="checkbox" 
            checked={searchInTitle} 
            onChange={(e) => setSearchInTitle(e.target.checked)} 
          /> Title
        </label>
        
        <span className="filter-separator">|</span>

        <label>
          <input 
            type="radio" 
            name="radioGroup" 
            value="id" 
            checked={language === 'id'} 
            onChange={(e) => setLanguage(e.target.value)} 
          /> ID
        </label>
         <label>
          <input 
            type="radio" 
            name="radioGroup" 
            value="en" 
            checked={language === 'en'} 
            onChange={(e) => setLanguage(e.target.value)} 
          /> EN
        </label>
      </div>

      <button type="submit" className="search-button">
        <HiOutlineSearch />
      </button>
    </form>
  );
};

export default SearchForm;