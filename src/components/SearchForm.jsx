import { useState, useContext, useRef, useEffect } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';
import DatePicker from 'react-datepicker';
import { NewsContext } from '../context/NewsContext';
import PropTypes from 'prop-types';

const SearchForm = ({ onSearchSubmit }) => {
  const { state, dispatch } = useContext(NewsContext);
  
  const [query, setQuery] = useState(state.searchTerm);
  const [sortBy, setSortBy] = useState(state.sortBy);
  const [startDate, setStartDate] = useState(state.startDate);
  const [searchInTitle, setSearchInTitle] = useState(state.searchInTitle);
  const [language, setLanguage] = useState(state.language);
  
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
      dispatch({ type: 'SET_SEARCH_PAYLOAD', payload: searchPayload });
      onSearchSubmit(); 
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
          ref={inputRef}
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

SearchForm.propTypes = {
  onSearchSubmit: PropTypes.func.isRequired,
};

export default SearchForm;