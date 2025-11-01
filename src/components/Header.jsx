import { useState, useContext } from 'react';
import SearchForm from './SearchForm';
import { 
  HiOutlineSearch, 
  HiOutlineX, 
  HiOutlineMoon, 
  HiOutlineSun,
  // --- (BARU) Import Ikon Auth ---
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineHeart
} from 'react-icons/hi';
import PropTypes from 'prop-types';
import { NewsContext } from '../context/NewsContext';
import '../components/Header.css';

const Header = ({ 
  theme, 
  toggleTheme,
  // --- (BARU) Props untuk Auth ---
  currentUser,
  onLogout,
  onOpenAuthModal
}) => {
  const { state, dispatch } = useContext(NewsContext);
  
  const categories = [
    { name: 'Business', param: 'business' },
    { name: 'Apple', param: 'apple' },
    { name: 'Tesla', param: 'tesla' },
    { name: 'Technology', param: 'technology' },
    { name: 'Sports', param: 'sports' },
  ];

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleClickCategory = (param) => {
    dispatch({ type: 'SET_CATEGORY', payload: param });
    setIsMobileMenuOpen(false); 
  };

  const handleSearchToggle = () => {
    setIsSearchVisible(prev => !prev);
    setIsMobileMenuOpen(false);
  };

  // --- (BARU) Handler untuk Tombol Auth ---
  const handleAuthClick = (e) => {
    e.preventDefault();
    if (currentUser) {
        onLogout();
    } else {
        onOpenAuthModal();
    }
    setIsMobileMenuOpen(false); // Tutup menu mobile setelah diklik
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
                    onClick={(e) => { e.preventDefault(); handleClickCategory(cat.param); }}
                    className={state.category === cat.param ? 'active' : ''}
                  >
                    {cat.name}
                  </a>
                </li>
              ))}

              {/* --- (BARU) Tombol Auth & Favorites untuk Mobile --- */}
              <li className="mobile-only-menu">
                <a href="#" onClick={handleAuthClick}>
                  {currentUser ? (
                    <>
                      <HiOutlineLogout /> Logout ({currentUser})
                    </>
                  ) : (
                    <>
                      <HiOutlineUser /> Login / Register
                    </>
                  )}
                </a>
              </li>

              {currentUser && (
                <li className="mobile-only-menu">
                  {/* TODO: Ganti onClick ini dengan fungsi 'buka halaman favorit' */}
                  <a href="#" onClick={(e) => {e.preventDefault(); setIsMobileMenuOpen(false);}}> 
                    <HiOutlineHeart /> My Favorites
                  </a>
                </li>
              )}
              {/* --- AKHIR MENU MOBILE BARU --- */}

            </ul>
          </nav>

          {isSearchVisible && (
            <SearchForm onSearchSubmit={handleSearchToggle} />
          )}

          <div className="utility-menu">
            <a href="#" onClick={(e) => { e.preventDefault(); handleSearchToggle(); }}>
              {isSearchVisible ? <HiOutlineX /> : <HiOutlineSearch />}
            </a>
            
            <a href="#" onClick={(e) => { e.preventDefault(); toggleTheme(); }} className="theme-toggle-button">
              {theme === 'light' ? <HiOutlineMoon /> : <HiOutlineSun />}
            </a>

            {/* --- (BARU) Tombol Auth untuk Desktop --- */}
            <a href="#" onClick={handleAuthClick} className="desktop-auth-button">
              {currentUser ? (
                <>
                  <span className="desktop-username">{currentUser}</span>
                  <HiOutlineLogout />
                </>
              ) : (
                <HiOutlineUser />
              )}
            </a>
            {/* --- AKHIR TOMBOL DESKTOP BARU --- */}
            
            <a href="#" onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(prev => !prev); }} className="burger-toggle">
              {isMobileMenuOpen ? <HiOutlineX /> : '☰'}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  theme: PropTypes.string.isRequired,
  toggleTheme: PropTypes.func.isRequired,
  // --- (BARU) PropTypes untuk Auth ---
  currentUser: PropTypes.string, // string (username) or null
  onLogout: PropTypes.func.isRequired,
  onOpenAuthModal: PropTypes.func.isRequired,
};

export default Header;