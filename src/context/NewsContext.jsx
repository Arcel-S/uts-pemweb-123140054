import React, { createContext, useReducer, useEffect, useCallback, useMemo } from 'react';

// (REVISI) Hapus API. Kita tidak lagi memanggil API eksternal
// sesuai instruksi untuk menggunakan JSON lokal agar Vercel berfungsi.
// const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
// const BASE_URL_TOP = 'https://newsapi.org/v2/everything';
// const BASE_URL_EVERY = 'https://newsapi.org/v2/top-headlines';

const initialState = {
  articles: [],
  popularArticles: [],
  popularError: null,
  loading: true,
  error: null,
  category: 'homepage',
  pageSize: 20,
  currentPage: 1,
  totalResults: 0,
  searchTerm: '',
  startDate: null,
  sortBy: 'publishedAt',
  searchInTitle: false,
  language: 'id',
};

const newsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: true, error: null };
    case 'SET_ARTICLES_SUCCESS':
      return {
        ...state,
        loading: false,
        articles: action.payload.articles,
        totalResults: action.payload.totalResults,
      };
    case 'SET_ARTICLES_ERROR':
      return { ...state, loading: false, error: action.payload, articles: [], totalResults: 0 };
    case 'SET_POPULAR_SUCCESS':
      return { ...state, popularArticles: action.payload, popularError: null };
    case 'SET_POPULAR_ERROR':
      return { ...state, popularError: action.payload };
    case 'SET_SEARCH_PAYLOAD':
      return {
        ...state,
        category: 'search',
        searchTerm: action.payload.query,
        sortBy: action.payload.sortValue,
        startDate: action.payload.dateValue,
        language: action.payload.langValue,
        searchInTitle: action.payload.titleOnly,
        currentPage: 1,
      };
    case 'SET_CATEGORY':
      return {
        ...state,
        category: action.payload,
        searchTerm: '',
        startDate: null,
        sortBy: 'publishedAt',
        language: 'id',
        searchInTitle: false,
        currentPage: 1,
      };
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_FAVORITES_VIEW':
      return {
        ...state,
        category: 'favorites',
        loading: false,
        error: null,
        totalResults: action.payload,
        articles: [] 
      };
    default:
      return state;
  }
};

const getCustomUrl = (state) => {
  const { category } = state;
  
  if (category === 'favorites') {
    return null; // Tidak perlu fetch
  }

  switch (category.toLowerCase()) {
    case 'apple':
      return './api/apple.json';
    case 'tesla':
      return './api/tesla.json';
    case 'business':
      return './api/business.json';
    case 'technology':
      return './api/technology.json';
    case 'sports':
      return './api/sports.json';
      
    case 'homepage': // Update Homepage
    case 'search':
      return './api/search.json';
    default:
      return './api/search.json';
  }
};


export const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(newsReducer, initialState);


// Penyesuaian Logika Search pada pencarian Json Local
const fetchNews = useCallback(async () => {
    if (state.category === 'favorites') {
      return;
    }
    dispatch({ type: 'SET_LOADING' });
    // Hapus window.scrollTo, biarkan App.jsx yang menangani scroll

    try {
      const url = getCustomUrl(state); // misal: './api/search.json'
      
      const response = await fetch(url); 

      if (!response.ok) {
        throw new Error(`Gagal memuat file JSON lokal: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.status !== 'ok') {
        throw new Error('Format JSON dummy tidak valid');
      }

      let processedArticles = data.articles;
      const { category, searchTerm, searchInTitle, startDate, sortBy, currentPage, pageSize } = state;

      // 1. Terapkan Filter HANYA jika kategorinya 'search'
      if (category === 'search') {
        
        // Filter berdasarkan Kata Kunci (SearchTerm)
        if (searchTerm) {
          const lowerCaseQuery = searchTerm.toLowerCase();
          
          processedArticles = processedArticles.filter(article => {
            const title = (article.title || '').toLowerCase();
            
            if (searchInTitle) {
              // Hanya cari di judul
              return title.includes(lowerCaseQuery);
            }
            
            // Cari di judul DAN deskripsi (Asumsi file JSON Anda memiliki field 'description')
            const description = (article.description || '').toLowerCase();
            return title.includes(lowerCaseQuery) || description.includes(lowerCaseQuery);
          });
        }

        // Filter berdasarkan Tanggal (StartDate)
        if (startDate) {
          const filterDate = new Date(startDate);
          filterDate.setHours(0, 0, 0, 0);
          const filterDayTimestamp = filterDate.getTime();

          processedArticles = processedArticles.filter(article => {
            if (!article.publishedAt) return false;
            
            // Set tanggal artikel ke awal hari (00:00:00)
            const articleDate = new Date(article.publishedAt);
            articleDate.setHours(0, 0, 0, 0);
            const articleDayTimestamp = articleDate.getTime();
            
            // Bandingkan timestamp harinya
            return articleDayTimestamp === filterDayTimestamp;
          });
        }
      }

      // 2. Terapkan Randomize hanya jika kategorinya 'homepage'
      if (category === 'homepage') {
        for (let i = processedArticles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [processedArticles[i], processedArticles[j]] = [processedArticles[j], processedArticles[i]];
        }
      }

      // 3. Terapkan Sorting (mengecualikan homepage, karena sudah random)
      if (category !== 'homepage') {
          if (sortBy === 'publishedAt') {
            // Urutkan dari yang terbaru (descending)
            processedArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
          }
          // 'relevancy' dan 'popularity' akan menggunakan urutan default dari JSON
      }
      
      // Simpan total hasil sebelum paginasi
      const totalResultsAfterProcessing = processedArticles.length;

      // 4. Terapkan Paginasi Sisi Klien
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedArticles = processedArticles.slice(startIndex, endIndex);

      // 5. Dispatch hasil Akhir
      dispatch({ 
        type: 'SET_ARTICLES_SUCCESS', 
        payload: { 
          articles: paginatedArticles, // Data per halaman
          totalResults: totalResultsAfterProcessing // Total data
        } 
      });


    } catch (err) {
      dispatch({ type: 'SET_ARTICLES_ERROR', payload: err.message });
    }
  }, [state.category, state.searchTerm, state.startDate, state.sortBy, state.currentPage, state.language, state.searchInTitle, state.pageSize]);


  const fetchPopularNews = useCallback(async () => {
    const popularUrl = './api/popular.json'; // Arahkan ke file JSON lokal
    try {
      const response = await fetch(popularUrl);
      if (!response.ok) throw new Error('Gagal memuat popular.json');
      const data = await response.json();
      dispatch({ type: 'SET_POPULAR_SUCCESS', payload: data.articles });
    } catch (err) {
      dispatch({ type: 'SET_POPULAR_ERROR', payload: err.message });
      console.error("Gagal fetch popular:", err);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  useEffect(() => {
    fetchPopularNews();
  }, [fetchPopularNews]);

  const providerValue = useMemo(() => ({
    state,
    dispatch,
  }), [state]);

  return (
    <NewsContext.Provider value={providerValue}>
      {children}
    </NewsContext.Provider>
  );
};