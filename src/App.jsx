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
  
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null); 
  const [sortBy, setSortBy] = useState('publishedAt'); 
  const [searchInTitle, setSearchInTitle] = useState(false);
  const [language, setLanguage] = useState('id');

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

  const getCustomUrl = (topic, query, date, sort, page, pageSize, lang, titleOnly) => {
      const yyyymmdd = (d) => d.toISOString().split('T')[0];
      
      const topHeadlineParams = `pageSize=${pageSize}&page=${page}&apiKey=${API_KEY}`;
      let everythingParams = `pageSize=${pageSize}&page=${page}&apiKey=${API_KEY}&sortBy=${sort}&language=${lang}`;

      if (titleOnly) {
        query = query ? `"${query}" IN TITLE` : ''; 
      }
      
      if (topic !== 'search') {
          const now = new Date();
          const oneMonthAgoDate = new Date(now);
          oneMonthAgoDate.setMonth(now.getMonth() - 1);
          const oneMonthAgo = yyyymmdd(oneMonthAgoDate);

          switch (topic.toLowerCase()) {
              case 'apple':
                  return `${BASE_URL_TOP}?q=apple&from=${oneMonthAgo}&${everythingParams}`;
              case 'tesla':
                  return `${BASE_URL_TOP}?q=tesla&from=${oneMonthAgo}&${everythingParams}`;
              case 'business':
                  return `${BASE_URL_EVERY}?country=us&category=business&${topHeadlineParams}`;
              case 'technology':
                  return `${BASE_URL_EVERY}?country=us&category=technology&${topHeadlineParams}`;
              case 'sports':
                  return `${BASE_URL_EVERY}?country=us&category=sports&${topHeadlineParams}`;
              default:
                  return `${BASE_URL_EVERY}?country=us&category=business&${topHeadlineParams}`;
          }
      }

      let searchQuery = query ? query : 'berita'; 
      let url = `${BASE_URL_TOP}?q=${encodeURIComponent(searchQuery)}&${everythingParams}`;

      if (date) {
        const dateFilter = `&from=${yyyymmdd(date)}&to=${yyyymmdd(date)}`;
        url += dateFilter;
      }
      
      return url;
  };

  const fetchNews = async (currentTopic, query, date, sort, params = {}, page = 1, lang, titleOnly) => {
    setLoading(true);
    setError(null);
    const pageSize = params.pageSize || 20;

    try {
      const url = getCustomUrl(currentTopic, query, date, sort, page, pageSize, lang, titleOnly);
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
      fetchNews(category, searchTerm, startDate, sortBy, searchParams, currentPage, language, searchInTitle); 
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [category, searchTerm, startDate, sortBy, searchParams, currentPage, API_KEY, language, searchInTitle]);

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
    setStartDate(null); 
    setSortBy('publishedAt');
    setLanguage('id');
    setSearchInTitle(false);
    setCurrentPage(1);
  };

  const handleSearchSubmit = (searchPayload) => {
    const { query, sortValue, titleOnly, langValue, dateValue } = searchPayload;

    setCategory('search'); 
    setSearchTerm(query);  
    setSortBy(sortValue); 
    setStartDate(dateValue); 
    setLanguage(langValue);
    setSearchInTitle(titleOnly);
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
          case 'search': titleText = `Search Results: "${searchTerm}"`; break;
          case 'apple': titleText = 'APPLE News'; break;
          case 'tesla': titleText = 'TESLA News'; break;
          case 'business': titleText = 'LATEST US BUSINESS HEADLINES'; break;
          case 'technology': titleText = 'LATEST TECHNOLOGY HEADLINES'; break;
          case 'sports': titleText = 'LATEST SPORTS HEADLINES'; break;
          default: titleText = `Latest News - ${topic.toUpperCase()}`;
      }

      if (startDate && (topic === 'search' || topic === 'apple' || topic === 'tesla')) {
        const displayDate = startDate.toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric'});
        if (topic === 'search') {
          titleText += ` on ${displayDate}`;
        } else {
          titleText = `News for ${topic.toUpperCase()} on ${displayDate}`;
        }
      }
      return titleText;
  };

  const handlePopularImageError = (e) => {
    e.currentTarget.src = 'https://placehold.co/65x65?text=Img';
  };
  // ---

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
        sortBy={sortBy}
        setSortBy={setSortBy}
        searchInTitle={searchInTitle}
        setSearchInTitle={setSearchInTitle}
        language={language}
        setLanguage={setLanguage}
      />

      <main>
        <div className="news-layout-grid">
          <section className="featured-column">
             <h1 className="main-title">
               {getTitle(category)}
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