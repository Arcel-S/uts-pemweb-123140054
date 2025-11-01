import { useContext, useMemo, useCallback, useEffect } from 'react';
import Header from './components/Header';
import DataTable from './components/DataTable';
import Footer from './components/Footer'; // <-- BARU: 1. Import Footer
import './App.css';
import 'react-datepicker/dist/react-datepicker.css'; 
import { NewsContext } from './context/NewsContext';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  // 1. Theme/Local Storage Logic
  // Menggunakan Custom Hook useLocalStorage
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  useEffect(() => {
    // Memastikan body HTML memiliki atribut data-theme
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, [setTheme]);


  // 2. News Context Logic
  // Mengambil state dan dispatch dari NewsContext
  const { state, dispatch } = useContext(NewsContext);
  const { 
    articles, 
    loading, 
    error, 
    category, 
    currentPage, 
    totalResults, 
    pageSize, 
    popularArticles,
    searchTerm,
    startDate,
  } = state;

  // 3. Derived State and Handlers (useCallback untuk optimasi)
  const totalPages = Math.ceil(totalResults / pageSize);

  const handleCategoryChange = useCallback((param) => {
    dispatch({ type: 'SET_CATEGORY', payload: param });
  }, [dispatch]);

  const handleSearchSubmit = useCallback((payload) => {
    dispatch({ type: 'SET_SEARCH_PAYLOAD', payload });
  }, [dispatch]);

  const handlePageChange = useCallback((page) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  }, [dispatch]);
  
  // 4. useMemo for Title (Mengoptimalkan komputasi judul)
  const getTitle = useMemo(() => {
    if (category === 'search' && searchTerm) {
      const dateStr = startDate ? ` - Tanggal: ${startDate.toLocaleDateString('id-ID')}` : '';
      return `Hasil Pencarian: "${searchTerm}"${dateStr}`;
    }
    // Membuat judul kategori lebih rapi
    return category.charAt(0).toUpperCase() + category.slice(1) + ' Headlines';
  }, [category, searchTerm, startDate]);


  return (
    <div className="app-container">
      <Header 
        onCategoryChange={handleCategoryChange}
        currentCategory={category}
        onSearchSubmit={handleSearchSubmit}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main>
        <h1 className="main-title">{getTitle}</h1>
        <div className="news-layout-grid">
          
          {/* KOLOM ARTIKEL UTAMA */}
          <section>
            {error && <p className="error-message">Error: {error}</p>}
            {loading && <p>Memuat artikel...</p>}
            
            {!loading && !error && (
              articles.length > 0 ? (
                <>
                  <DataTable articles={articles} />
                  
                  {/* Pagination */}
                  <div className="pagination-controls">
                    <button 
                      onClick={() => handlePageChange(currentPage - 1)} 
                      disabled={currentPage <= 1}
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
                <p>Tidak ada artikel yang ditemukan untuk kategori atau pencarian ini.</p>
              )
            )}
          </section>
          
          {/* SIDEBAR POPULAR POSTS */}
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
                        src={article.urlToImage || 'https://placehold.co/65x65?text=Image'} 
                        alt={article.title || 'Popular article thumbnail'} 
                        className="popular-image" 
                    />
                    <div className="popular-content">
                        <h4 className="popular-title">{article.title}</h4>
                        <span className="popular-source">{article.source.name}</span>
                    </div>
                  </a>
                ))
              ) : (
                <p>Memuat popular posts...</p>
              )}
            </div>
          </aside>
        </div>
      </main>
      
      <Footer /> {/* <-- BARIS BARU: 5. Tambahkan Footer */}
    </div>
  );
}

export default App;