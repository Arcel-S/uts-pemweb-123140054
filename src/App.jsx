import { useContext, useMemo, useCallback, useEffect, useState } from 'react';
import Header from './components/Header';
import DataTable from './components/DataTable';
import Footer from './components/Footer';
import './App.css';
import 'react-datepicker/dist/react-datepicker.css'; 
import { NewsContext } from './context/NewsContext';
import { useLocalStorage } from './hooks/useLocalStorage';

import { getCurrentUser, logoutUser, getFavorites, updateFavorites } from './utils/authUtils.js'; 
import AuthModal from './components/AuthModal';

function App() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, [setTheme]);


  // 2. News Context Logic
  const { state, dispatch } = useContext(NewsContext);
  const { 
    articles, 
    loading, 
    error, 
    popularArticles,
    popularError,
    totalResults, 
    currentPage, 
    pageSize 
  } = state;

  
  // 3. Authentication & Favorites State
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const handleLoginSuccess = useCallback((username) => {
    setCurrentUser(username);
    setFavorites(getFavorites(username));
  }, []);

  useEffect(() => {
    if (currentUser) {
      setFavorites(getFavorites(currentUser));
    }
  }, [currentUser]);

  const handleLogout = useCallback(() => {
    logoutUser();
    setCurrentUser(null);
    setFavorites([]);
    dispatch({ type: 'SET_CATEGORY', payload: 'homepage' }); // Arahkan ke homepage saat logout
  }, [dispatch]);

  const toggleFavorite = useCallback((article) => {
    if (!currentUser) return; 

    const isFavorited = favorites.some(fav => fav.url === article.url);
    let newFavorites;

    if (isFavorited) {
      newFavorites = favorites.filter(fav => fav.url !== article.url);
    } else {
      const newFavoriteItem = {
        title: article.title,
        url: article.url,
        urlToImage: article.urlToImage,
        source: { name: article.source.name },
        publishedAt: article.publishedAt
      };
      newFavorites = [...favorites, newFavoriteItem];
    }
    setFavorites(newFavorites);
    updateFavorites(currentUser, newFavorites);
  }, [currentUser, favorites]);


  // 4. Derived State and Handlers
  const totalPages = Math.ceil(totalResults / pageSize);

  const handlePageChange = useCallback((newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      dispatch({ type: 'SET_PAGE', payload: newPage });
    }
  }, [totalPages, dispatch]);
  
  // 5. useMemo for Title
  const getTitle = useMemo(() => {
      const { category, searchTerm, startDate } = state;

      if (category === 'favorites') {
        return 'My Favorite Articles';
      }
      let titleText = '';
      switch (category.toLowerCase()) {
          case 'homepage': titleText = 'NEWS RECOMMENDATION'; break; // (BARU)
          case 'search': titleText = `Search Results: "${searchTerm}"`; break;
          case 'apple': titleText = 'APPLE NEWS'; break;
          case 'tesla': titleText = 'TESLA NEWS'; break;
          case 'business': titleText = 'BUSINESS NEWS'; break;
          case 'technology': titleText = 'TECHNOLOGY NEWS'; break;
          case 'sports': titleText = 'SPORTS NEWS'; break;
          default: titleText = `Latest News - ${category.toUpperCase()}`;
      }
      if (startDate && (category === 'search' || category === 'apple' || category === 'tesla')) {
        const displayDate = startDate.toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric'});
        if (category === 'search') {
          titleText += ` on ${displayDate}`;
        } else {
          titleText = `News for ${category.toUpperCase()} on ${displayDate}`;
        }
      }
      return titleText;
  }, [state.category, state.searchTerm, state.startDate]);

  const handlePopularImageError = useCallback((e) => {
    e.currentTarget.src = 'https://placehold.co/65x65?text=Img';
  }, []);

  const articlesToDisplay = state.category === 'favorites' ? favorites : articles;
  const resultsToDisplay = state.category === 'favorites' ? favorites.length : totalResults;

  return (
    <div className="app-container">
      <Header 
        theme={theme}
        toggleTheme={toggleTheme}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        favoritesCount={favorites.length}
      />

      <main>
        <div className="news-layout-grid">
          <section className="featured-column">
             <h1 className="main-title">
               {getTitle}
             </h1>

              {loading && state.category !== 'favorites' && <p>Loading news...</p>}
              {error && <p className="error-message">Error: {error}</p>}
              
              {
                (!loading || state.category === 'favorites') && !error && (
                  articlesToDisplay.length > 0 ? (
                    <>
                      <p>Total {resultsToDisplay} articles found.</p>
                      <DataTable 
                        articles={articlesToDisplay} 
                        currentUser={currentUser}
                        favorites={favorites}
                        toggleFavorite={toggleFavorite}
                      />
                      
                      {state.category !== 'favorites' && totalResults > pageSize && ( // Sembunyikan jika total < pageSize
                        <div className="pagination-controls">
                          <button 
                            onClick={() => handlePageChange(currentPage - 1)} 
                            disabled={currentPage === 1}
                          >
                            Previous
                          </button>
                          <span>Page {currentPage} Of {totalPages}</span>
                          <button 
                            onClick={() => handlePageChange(currentPage + 1)} 
                            disabled={currentPage >= totalPages}
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <p>{state.category === 'favorites' ? 'You have no favorite articles yet.' : 'No articles found for this category or search.'}</p>
                  )
                )
              }
          </section>
          
          <aside className="popular-column">
            <h2>POPULAR POSTS</h2>
            <div className="popular-list">
              {/* --- Logika Error Handling Sidebar --- */}
              {popularError && <p className="error-message">{popularError}</p>}
              
              {!popularError && popularArticles.length > 0 ? (
                popularArticles.map((article, index) => (
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    key={index} 
                    className="popular-item"
                  >
                    <img 
                      src={article.urlToImage || 'https://placehold.co/65x65?text=Img'}
                      alt={article.title}
                      className="popular-image"
                      onError={handlePopularImageError}
                    />
                    <div className="popular-content">
                      <h4 className="popular-title">{article.title}</h4>
                      <span className="popular-source">{article.source.name}</span>
                    </div>
                  </a>
                ))
              ) : (
                // Hanya tampilkan loading jika tidak ada error
                !popularError && <p>Loading popular posts...</p>
              )}
            </div>
          </aside>
        </div>
      </main>
      
      <Footer />

      {isAuthModalOpen && (
        <AuthModal 
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}

export default App;