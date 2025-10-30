import { useState } from 'react';
import SearchForm from './SearchForm';
// --- 1. IMPORT IKON DARI LIBRARY ---
import { 
  HiOutlineSearch, 
  HiOutlineX, 
  HiOutlineMoon, 
  HiOutlineSun 
} from 'react-icons/hi'; // Heroicons (mirip gambar Anda)

// Terima props 'theme' dan 'toggleTheme'
const Header = ({ onCategoryChange, currentCategory, onSearchSubmit, theme, toggleTheme }) => {
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
    setIsSearchVisible(false); // Otomatis tutup form setelah submit
  };

  return (
    <header className="main-header">
      <div className="top-bar">
        <div className="top-content-wrapper">
          <div className="logo-section">
            <span className="logo">NEWSPORTAL.ID</span>
            <div className="logo-caption">Kabar Seluruh Dunia</div>
          </div>
          
          {/* Navbar kategori */}
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

          {/* SearchForm (muncul saat diklik) */}
          {isSearchVisible && (
            <SearchForm onSearchSubmit={handleSearchAndClose} />
          )}

          <div className="utility-menu">
            
            {/* --- 2. GANTI TEKS/EMOJI DENGAN KOMPONEN IKON --- */}
            
            {/* Tombol toggle tema */}
            <a href="#" onClick={toggleTheme} className="theme-toggle-button">
              {/* Kita panggil ikonnya seperti komponen React */}
              {theme === 'light' ? <HiOutlineMoon /> : <HiOutlineSun />}
            </a>

            {/* Tombol toggle search */}
            <a href="#" onClick={() => setIsSearchVisible(prev => !prev)}>
              {isSearchVisible ? <HiOutlineX /> : <HiOutlineSearch />}
            </a>
            {/* --- AKHIR PERUBAHAN --- */}

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;