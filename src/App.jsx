import { useContext, useMemo, useCallback } from 'react';
import Header from './components/Header';
import DataTable from './components/DataTable';
import './App.css';
import 'react-datepicker/dist/react-datepicker.css'; 
import { NewsContext } from './context/NewsContext';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const { state, dispatch } = useContext(NewsContext);
  const { articles, loading, error, popularArticles, totalResults, currentPage, pageSize } = state;
  
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, [setTheme]);

  const totalPages = Math.ceil(totalResults / (pageSize || 20));

  const handlePageChange = useCallback((newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      dispatch({ type: 'SET_PAGE', payload: newPage });
    }
  }, [totalPages, dispatch]);
  
  const getTitle = useMemo(() => {
      const { category, searchTerm, startDate } = state;
      let titleText = '';
      switch (category.toLowerCase()) {
          case 'search': titleText = `Search Results: "${searchTerm}"`; break;
          case 'apple': titleText = 'APPLE News'; break;
          case 'tesla': titleText = 'TESLA News'; break;
          case 'business': titleText = 'LATEST US BUSINESS HEADLINES'; break;
          case 'technology': titleText = 'LATEST TECHNOLOGY HEADLINES'; break;
          case 'sports': titleText = 'LATEST SPORTS HEADLINES'; break;
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

  return (
    <div className="app-container">
      <Header 
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main>
        <div className="news-layout-grid">
          <section className="featured-column">
             <h1 className="main-title">
               {getTitle}
             </h1>

              {loading && <p>Loading news...</p>}
              {error && <p className="error-message">Error: {error}</p>}
              
              {
                !loading && !error && (
                  articles.length > 0 ? (
                    <>
                      <p>Total {totalResults} articles found.</p>
                      <DataTable articles={articles} />
                      
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
                    </>
                  ) : (
                    <p>No articles found for this category or search.</p>
                  )
                )
              }
          </section>
          
          <aside className="popular-column">
            <h2>POPULAR POSTS</h2>
            <div className="popular-list">
              {popularArticles.length > 0 ? (
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
                <p>Loading popular posts...</p>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default App;