import { useState } from 'react';
import SearchForm from './SearchForm';
import { 
  HiOutlineSearch, 
  HiOutlineX, 
  HiOutlineMoon, 
  HiOutlineSun 
} from 'react-icons/hi'; 
// --- 1. IMPORT DATE PICKER ---
import DatePicker from 'react-datepicker';

// --- 2. TERIMA PROPS 'startDate' dan 'setStartDate' ---
const Header = ({ 
  onCategoryChange, 
  currentCategory, 
  onSearchSubmit, 
  theme, 
  toggleTheme,
  startDate,
  setStartDate 
}) => {
  const categories = [
    { name: 'Business', param: 'business' },
    { name: 'Apple', param: 'apple' },
    { name: 'Tesla', param: 'tesla' },
    { name: 'Technology', param: 'technology' },
    { name: 'Sports', param: 'sports' },
  ];

  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const handleClick = (param) => {
    onCategoryChange(param);
  };

  const handleSearchAndClose = (query) => {
    onSearchSubmit(query);
    setIsSearchVisible(false); 
  };

  return (
    <header className="main-header">
      <div className="top-bar">
        <div className="top-content-wrapper">
          <div className="logo-section">
            <span className="logo">NEWSPORTAL.ID</span>
            <div className="logo-caption">Kabar Seluruh Dunia</div>
          </div>
          
          <nav className="main-nav-single">
            <ul className="category-links">
              {categories.map((cat, index) => (
                <li key={index}>
                  <a 
                    href="#"
                    onClick={() => handleClick(cat.param)}
                    className={currentCategory === cat.param ? 'active' : ''}
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {isSearchVisible && (
            <SearchForm onSearchSubmit={handleSearchAndClose} />
          )}

          <div className="utility-menu">
            
            {/* --- 3. RENDER DATE PICKER DI SINI --- */}
            <div className="datepicker-container">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                isClearable // Menampilkan tombol 'x' untuk clear
                placeholderText="Pilih tanggal..."
                className="datepicker-input" // Class untuk styling
                dateFormat="dd/MM/yyyy"
              />
            </div>
            {/* --- AKHIR DATE PICKER --- */}

            <a href="#" onClick={() => setIsSearchVisible(prev => !prev)}>
              {isSearchVisible ? <HiOutlineX /> : <HiOutlineSearch />}
            </a>
            
            <a href="#" onClick={toggleTheme} className="theme-toggle-button">
              {theme === 'light' ? <HiOutlineMoon /> : <HiOutlineSun />}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;