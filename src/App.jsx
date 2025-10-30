import { useState, useEffect } from 'react';
import Header from './components/Header';
import DataTable from './components/DataTable';
import './App.css';
import 'react-datepicker/dist/react-datepicker.css'; // Pastikan CSS-nya diimpor

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('business'); 
  const [searchParams] = useState({ pageSize: 20 }); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalResults, setTotalResults] = useState(0);
  const [popularArticles, setPopularArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  
  // --- 1. STATE BARU UNTUK TANGGAL ---
  const [startDate, setStartDate] = useState(null); // 'null' berarti "tidak ada tanggal"
  
  const API_KEY = import.meta.env.VITE_NEWS_API_KEY; 

  const BASE_URL_TOP = 'https://newsapi.org/v2/everything';
  const BASE_URL_EVERY = 'https://newsapi.org/v2/top-headlines';

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]); 

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const getCustomUrl = (topic, query, pageSize, page) => {
      // (Kita akan update logika ini di commit berikutnya)
      const now = new Date();
      const getFormattedDate = (date) => date.toISOString().split('T')[0];
      const yesterdayDate = new Date(now);
      yesterdayDate.setDate(now.getDate() - 1);
      const yesterday = getFormattedDate(yesterdayDate);
      const oneMonthAgoDate = new Date(now);
      oneMonthAgoDate.setMonth(now.getMonth() - 1);
      const oneMonthAgo = getFormattedDate(oneMonthAgoDate);
      const sixMonthsAgoDate = new Date(now);
      sixMonthsAgoDate.setMonth(now.getMonth() - 6);
      const sixMonthsAgo = getFormattedDate(sixMonthsAgoDate);
      const today = getFormattedDate(now);
      
      const defaultParams = `pageSize=${pageSize}&page=${page}&apiKey=${API_KEY}`;
      
      if (topic === 'search' && query) {
        return `${BASE_URL_TOP}?q=${encodeURIComponent(query)}&sortBy=publishedAt&${defaultParams}`;
      }
      
      switch (topic.toLowerCase()) {
          case 'apple':
              return `${BASE_URL_TOP}?q=apple&from=${yesterday}&to=${yesterday}&sortBy=popularity&${defaultParams}`;
          case 'tesla':
              return `${BASE_URL_TOP}?q=tesla&from=${oneMonthAgo}&sortBy=publishedAt&${defaultParams}`;
          case 'business':
              return `${BASE_URL_EVERY}?country=us&category=business&${defaultParams}`;
          case 'technology':
              return `${BASE_URL_EVERY}?country=us&category=technology&${defaultParams}`;
          case 'sports':
              return `${BASE_URL_EVERY}?country=us&category=sports&${defaultParams}`;
          default:
              return `${BASE_URL_EVERY}?country=us&category=business&${defaultParams}`;
      }
  };

  const fetchNews = async (currentTopic, query, params = {}, page = 1) => {
    setLoading(true);
    setError(null);
    const pageSize = params.pageSize || 20;

    try {
      const url = getCustomUrl(currentTopic, query, pageSize, page);
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status} - ${errorData.message}`);
      }
      
      const data = await response.json();
      
      if (data.status !== 'ok') {
        throw new Error(data.message || 'Failed to fetch news');
      }
      
      setArticles(data.articles);
      setTotalResults(data.totalResults);
    } catch (err) {
      setError(err.message);
      setArticles([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(API_KEY) {
      fetchNews(category, searchTerm, searchParams, currentPage); 
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [category, searchTerm, searchParams, currentPage, API_KEY]);

  useEffect(() => {
    const fetchPopularNews = async () => {
      const popularUrl = `${BASE_URL_EVERY}?country=us&pageSize=5&apiKey=${API_KEY}`;
      try {
        const response = await fetch(popularUrl);
        if (!response.ok) throw new Error('Gagal fetch popular news');
        const data = await response.json();
        setPopularArticles(data.articles);
      } catch (err) {
        console.error("Gagal fetch popular:", err);
      }
    };
    if (API_KEY) fetchPopularNews();
  }, [API_KEY, BASE_URL_EVERY]); 

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setSearchTerm(''); 
    setCurrentPage(1);
  };

  const handleSearchSubmit = (query) => {
    setCategory('search'); 
    setSearchTerm(query);  
    setCurrentPage(1);     
  };

  const totalPages = Math.ceil(totalResults / (searchParams.pageSize || 20));

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  
  const getTitle = (topic) => {
      switch (topic.toLowerCase()) {
          case 'search': return `Hasil Pencarian: "${searchTerm}"`;
          case 'apple': return 'Berita APPLE (24 Jam Terakhir, Populer)';
          case 'tesla': return 'Berita TESLA (1 Bulan Terakhir, Terbaru)';
          case 'business': return 'HEADLINE BISNIS US TERKINI';
          case 'technology': return 'HEADLINE TEKNOLOGI TERKINI';
          case 'sports': return 'HEADLINE OLAHRAGA TERKINI';
          default: return `Berita Terbaru - ${topic.toUpperCase()}`;
      }
  };

  return (
    <div className="app-container">
      <Header 
        onCategoryChange={handleCategoryChange} 
        currentCategory={category}
        onSearchSubmit={handleSearchSubmit} 
        theme={theme}
        toggleTheme={toggleTheme}
        // --- 2. KIRIM STATE TANGGAL KE HEADER ---
        startDate={startDate}
        setStartDate={setStartDate}
      />

      <main>
        <div className="news-layout-grid">
          <section className="featured-column">
             <h1 className="main-title">
               {getTitle(category)}
             </h1>

              {loading && <p>Memuat berita...</p>}
              {error && <p className="error-message">Error: {error}</p>}
              
              {
                !loading && !error && (
                  articles.length > 0 ? (
                    <>
                      <p>Total {totalResults} artikel ditemukan.</p>
                      <DataTable articles={articles} />
                      
                      <div className="pagination-controls">
                        <button 
                          onClick={() => handlePageChange(currentPage - 1)} 
                          disabled={currentPage === 1}
                        >
                          Sebelumnya
                        </button>
                        <span>Halaman {currentPage} dari {totalPages}</span>
                        <button 
                          onClick={() => handlePageChange(currentPage + 1)} 
                          disabled={currentPage >= totalPages}
                        >
                          Berikutnya
                        </button>
                      </div>
                    </>
                  ) : (
                    <p>Tidak ada artikel yang ditemukan untuk kategori atau pencarian ini.</p>
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
                    <h4 className="popular-title">{article.title}</h4>
                    <span className="popular-source">{article.source.name}</span>
                  </a>
                ))
              ) : (
                <p>Memuat popular posts...</p>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default App;