import { useState } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';
import DatePicker from 'react-datepicker';

const SearchForm = ({ 
  onSearchSubmit, 
  sortBy, setSortBy, 
  searchInTitle, setSearchInTitle,
  language, setLanguage,
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
        langValue: language,
        dateValue: startDate
      };
      onSearchSubmit(searchPayload); 
    }
  };

  return (
    <form className="search-form with-filters" onSubmit={handleSubmit}>
      
      <div className="search-bar-group">
        <input
          type="text"
          placeholder="Search article..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
          required 
          autoFocus
        />
        <button type="submit" className="search-button">
          <HiOutlineSearch />
        </button>
      </div>

      <div className="search-filters-grid">

        <div className="filter-group">
          <label htmlFor="sort-by-select">Sort By</label>
          <select 
            id="sort-by-select"
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)} 
            className="search-select"
          >
            <option value="publishedAt">Latest</option>
            <option value="relevancy">Relevance</option>
            <option value="popularity">Popularity</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="search-datepicker">Date</label>
          <DatePicker
            id="search-datepicker"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            isClearable
            placeholderText="Choose a date..."
            className="search-datepicker-input"
            dateFormat="dd/MM/yyyy"
          />
        </div>
        
        <div className="filter-group filter-group-radios">
          <label>Language</label>
          <div className="radio-options">
            <label>
              <input 
                type="radio" 
                name="language" 
                value="id" 
                checked={language === 'id'} 
                onChange={(e) => setLanguage(e.target.value)} 
              /> ID
            </label>
            <label>
              <input 
                type="radio" 
                name="language" 
                value="en" 
                checked={language === 'en'} 
                onChange={(e) => setLanguage(e.target.value)} 
              /> EN
            </label>
          </div>
        </div>

        <div className="filter-group filter-group-checkbox">
          <label>
            <input 
              type="checkbox" 
              checked={searchInTitle} 
              onChange={(e) => setSearchInTitle(e.target.checked)} 
            /> 
            <span>Search Title</span>
          </label>
        </div>
      </div> 
      
    </form>
  );
};

export default SearchForm;