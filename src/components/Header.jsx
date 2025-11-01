import { useState, useContext } from 'react';
import SearchForm from './SearchForm';
import '../components/Header.css';
import { 
  HiOutlineSearch, 
  HiOutlineX, 
  HiOutlineMoon, 
  HiOutlineSun 
} from 'react-icons/hi';
import PropTypes from 'prop-types';
import { NewsContext } from '../context/NewsContext';

const Header = ({ 
  theme, 
  toggleTheme,
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

  const handleClick = (param) => {
    dispatch({ type: 'SET_CATEGORY', payload: param });
    setIsMobileMenuOpen(false); 
  };

  const handleSearchToggle = () => {
    setIsSearchVisible(prev => !prev);
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
                    className={state.category === cat.param ? 'active' : ''}
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {isSearchVisible && (
            <SearchForm onSearchSubmit={handleSearchToggle} />
          )}

          <div className="utility-menu">
            <a href="#" onClick={handleSearchToggle}>
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

Header.propTypes = {
  theme: PropTypes.string.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default Header;