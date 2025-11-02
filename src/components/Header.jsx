import { useState, useContext } from 'react';
import SearchForm from './SearchForm';
import { 
  HiOutlineSearch, 
  HiOutlineX, 
  HiOutlineMoon, 
  HiOutlineSun,
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
  currentUser,
  onLogout,
  onOpenAuthModal,
  favoritesCount
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

  const handleAuthClick = (e) => {
    e.preventDefault();
    if (currentUser) {
        onLogout();
    } else {
        onOpenAuthModal();
    }
    setIsMobileMenuOpen(false);
  };

  const handleShowFavorites = (e) => {
    e.preventDefault();
    dispatch({ type: 'SET_FAVORITES_VIEW', payload: favoritesCount });
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
              {/* (FIX) Kelas diubah agar tidak disembunyikan di mobile */}
              {categories.map((cat, index) => (
                <li key={index} className="category-link-item"> 
                  <a 
                    href="#"
                    onClick={(e) => { e.preventDefault(); handleClickCategory(cat.param); }}
                    className={state.category === cat.param ? 'active' : ''}
                  >
                    {cat.name}
                  </a>
                </li>
              ))}

              {/* (BARU) Garis pemisah untuk menu mobile */}
              <li className="mobile-only-separator" aria-hidden="true"></li>

              {/* Menu Khusus Mobile (Login & Favorites) */}
              <li className="mobile-only-menu">
                <a href="#" onClick={handleAuthClick}>
                  {currentUser ? (
                    <><HiOutlineLogout /> Logout ({currentUser})</>
                  ) : (
                    <><HiOutlineUser /> Login / Register</>
                  )}
                </a>
              </li>

              {currentUser && (
                <li className="mobile-only-menu">
                  <a 
                    href="#" 
                    onClick={handleShowFavorites}
                    className={state.category === 'favorites' ? 'active-favorite' : ''}
                  > 
                    <HiOutlineHeart /> My Favorites ({favoritesCount})
                  </a>
                </li>
              )}
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
            
            <a href="#" onClick={handleAuthClick} className="desktop-auth-button">
              {currentUser ? (
                <><span className="desktop-username">{currentUser}</span><HiOutlineLogout /></>
              ) : (
                <HiOutlineUser />
              )}
            </a>

            {currentUser && (
              <a 
                href="#" 
                onClick={handleShowFavorites} 
                className={`desktop-favorites-button ${state.category === 'favorites' ? 'active-favorite-desktop' : ''}`}
                title="My Favorites"
              >
                <HiOutlineHeart />
                {favoritesCount > 0 && <span className="favorite-count">{favoritesCount}</span>}
              </a>
            )}
            
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
  currentUser: PropTypes.string,
  onLogout: PropTypes.func.isRequired,
  onOpenAuthModal: PropTypes.func.isRequired,
  favoritesCount: PropTypes.number.isRequired,
};

export default Header;