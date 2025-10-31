import { useState } from 'react';
import SearchForm from './SearchForm';
import { 
  HiOutlineSearch, 
  HiOutlineX, 
  HiOutlineMoon, 
  HiOutlineSun 
} from 'react-icons/hi'; 
// Hapus 'import DatePicker' karena sudah tidak ada di file ini

const Header = ({ 
  onCategoryChange, 
  currentCategory, 
  onSearchSubmit, // Ini akan menerima payload
  theme, 
  toggleTheme,
  // --- 1. TERIMA SEMUA PROPS BARU ---
  startDate,
  setStartDate,
  sortBy,
  setSortBy,
  searchInTitle,
  setSearchInTitle,
  language,
  setLanguage
}) => {
  const categories = [
    { name: 'Business', param: 'business' },
    { name: 'Apple', param: 'apple' },
    { name: 'Tesla', param: 'tesla' },
    { name: 'Technology', param: 'technology' },
    { name: 'Sports', param: 'sports' },
  ];

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleClick = (param) => {
    onCategoryChange(param);
    setIsMobileMenuOpen(false); 
  };

  // --- 2. FIX UTAMA DI SINI ---
  // Terima 'searchPayload' sebagai OBJECT dan teruskan
  const handleSearchAndClose = (searchPayload) => {
    onSearchSubmit(searchPayload); // Teruskan object-nya ke App.jsx
    setIsSearchVisible(false); 
    setIsMobileMenuOpen(false); 
  };

  return (
    <header className="main-header">
      <div className="top-bar">
        <div className="top-content-wrapper">
          
          <div className="logo-section">
            <span className="logo">NEWSPORTAL.ID</span>
            <div className="logo-caption">Kabar Seluruh Dunia</div>
          </div>
          
          <nav className={`main-nav-single ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
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
            // --- 3. TERUSKAN SEMUA PROPS KE SEARCHFORM ---
            <SearchForm 
              onSearchSubmit={handleSearchAndClose}
              sortBy={sortBy}
              setSortBy={setSortBy}
              startDate={startDate}
              setStartDate={setStartDate}
              searchInTitle={searchInTitle}
              setSearchInTitle={setSearchInTitle}
              language={language}
              setLanguage={setLanguage}
            />
          )}

          <div className="utility-menu">
            {/* Date picker sudah dihapus dari sini */}

            <a href="#" onClick={() => setIsSearchVisible(prev => !prev)}>
              {isSearchVisible ? <HiOutlineX /> : <HiOutlineSearch />}
            </a>
            
            <a href="#" onClick={toggleTheme} className="theme-toggle-button">
              {theme === 'light' ? <HiOutlineMoon /> : <HiOutlineSun />}
            </a>
            
            <a href="#" onClick={() => setIsMobileMenuOpen(prev => !prev)} className="burger-toggle">
              {isMobileMenuOpen ? <HiOutlineX /> : '☰'}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;