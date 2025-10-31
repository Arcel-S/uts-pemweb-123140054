import { useState, useEffect } from 'react';
import Header from './components/Header';
import DataTable from './components/DataTable';
import './App.css';
import 'react-datepicker/dist/react-datepicker.css'; 

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
  const [startDate, setStartDate] = useState(null); 
  
  // --- 1. STATE BARU UNTUK SORTING ---
  const [sortBy, setSortBy] = useState('publishedAt'); // Default: Terbaru

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

  // --- 2. UPDATE getCustomUrl ---
  const getCustomUrl = (topic, query, date, sort, pageSize, page) => {
      const yyyymmdd = (d) => d.toISOString().split('T')[0];
      // Tambahkan parameter 'sort' (sortBy)
      const defaultParams = `pageSize=${pageSize}&page=${page}&apiKey=${API_KEY}&sortBy=${sort}`;

      if (date) {
        const queryTerm = query ? query : topic; 
        const dateFilter = `&from=${yyyymmdd(date)}&to=${yyyymmdd(date)}`;
        // Ganti endpoint ke /everything dan tambahkan sort
        return `${BASE_URL_TOP}?q=${encodeURIComponent(queryTerm)}&${defaultParams}${dateFilter}`;
      }

      if (topic === 'search' && query) {
        // Tambahkan 'sort' ke pencarian
        return `${BASE_URL_TOP}?q=${encodeURIComponent(query)}&${defaultParams}`;
      }
      
      const now = new Date();
      const yesterdayDate = new Date(now);
      yesterdayDate.setDate(now.getDate() - 1);
      const yesterday = yyyymmdd(yesterdayDate);
      const oneMonthAgoDate = new Date(now);
      oneMonthAgoDate.setMonth(now.getMonth() - 1);
      const oneMonthAgo = yyyymmdd(oneMonthAgoDate);
      
      // Hapus sortBy dari sini karena sudah ada di defaultParams
      switch (topic.toLowerCase()) {
          case 'apple':
              return `${BASE_URL_TOP}?q=apple&from=${yesterday}&to=${yesterday}&${defaultParams}`;
          case 'tesla':
              return `${BASE_URL_TOP}?q=tesla&from=${oneMonthAgo}&${defaultParams}`;
          // Endpoint /top-headlines tidak mendukung sortBy, jadi kita HAPUS dari defaultParams
          case 'business':
              return `${BASE_URL_EVERY}?country=us&category=business&pageSize=${pageSize}&page=${page}&apiKey=${API_KEY}`;
          case 'technology':
              return `${BASE_URL_EVERY}?country=us&category=technology&pageSize=${pageSize}&page=${page}&apiKey=${API_KEY}`;
          case 'sports':
              return `${BASE_URL_EVERY}?country=us&category=sports&pageSize=${pageSize}&page=${page}&apiKey=${API_KEY}`;
          default:
              return `${BASE_URL_EVERY}?country=us&category=business&pageSize=${pageSize}&page=${page}&apiKey=${API_KEY}`;
      }
  };

  // --- 3. UPDATE fetchNews ---
  const fetchNews = async (currentTopic, query, date, sort, params = {}, page = 1) => {
    setLoading(true);
    setError(null);
    const pageSize = params.pageSize || 20;

    try {
      const url = getCustomUrl(currentTopic, query, date, sort, pageSize, page);
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

  // --- 4. UPDATE useEffect (main) ---
  useEffect(() => {
    if(API_KEY) {
      fetchNews(category, searchTerm, startDate, sortBy, searchParams, currentPage); 
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [category, searchTerm, startDate, sortBy, searchParams, currentPage, API_KEY]);

  // useEffect (popular posts) - tidak berubah
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

  // --- 5. UPDATE Handlers ---
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setSearchTerm(''); 
    setStartDate(null); 
    setSortBy('publishedAt'); // Reset sort
    setCurrentPage(1);
  };

  const handleSearchSubmit = (query, sortValue) => {
    setCategory('search'); 
    setSearchTerm(query);  
    setSortBy(sortValue); // Set sort dari form
    setStartDate(null); 
    setCurrentPage(1);     
  };

  const totalPages = Math.ceil(totalResults / (searchParams.pageSize || 20));

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  
  const getTitle = (topic) => {
      let titleText = '';
      switch (topic.toLowerCase()) {
          case 'search': titleText = `Hasil Pencarian: "${searchTerm}"`; break;
          case 'apple': titleText = 'Berita APPLE'; break;
          case 'tesla': titleText = 'Berita TESLA'; break;
          case 'business': titleText = 'HEADLINE BISNIS US TERKINI'; break;
          case 'technology': titleText = 'HEADLINE TEKNOLOGI TERKINI'; break;
          case 'sports': titleText = 'HEADLINE OLAHRAGA TERKINI'; break;
          default: titleText = `Berita Terbaru - ${topic.toUpperCase()}`;
      }

      if (startDate) {
        const displayDate = startDate.toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'});
        if (topic === 'search') {
          titleText += ` pada ${displayDate}`;
        } else {
          titleText = `Berita ${topic.toUpperCase()} pada ${displayDate}`;
        }
      }
      return titleText;
  };


  return (
    <div className="app-container">
      <Header 
        onCategoryChange={handleCategoryChange} 
        currentCategory={category}
        onSearchSubmit={handleSearchSubmit} 
        theme={theme}
        toggleTheme={toggleTheme}
        startDate={startDate}
        setStartDate={setStartDate}
        // --- 6. KIRIM PROPS SORT KE HEADER ---
        sortBy={sortBy}
        setSortBy={setSortBy}
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