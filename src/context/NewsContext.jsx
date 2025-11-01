import React, { createContext, useReducer, useEffect, useCallback, useMemo } from 'react';

// (REVISI) Hapus konstanta API. Kita tidak lagi memanggil API eksternal
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
  category: 'business',
  pageSize: 20,
  currentPage: 1,
  totalResults: 0,
  searchTerm: '',
  startDate: null,
  sortBy: 'publishedAt',
  searchInTitle: false,
  language: 'id',
};

// Reducer tetap sama, tidak ada perubahan
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

// (REVISI) Fungsi ini diubah untuk mengembalikan path ke file JSON lokal.
// Ini dilakukan agar Vercel dapat menyajikan data tanpa diblokir oleh NewsAPI.
const getCustomUrl = (state) => {
  const { category } = state;
  
  if (category === 'favorites') {
    return null; // Tidak perlu fetch
  }

  // (REVISI) Alihkan panggilan kategori ke file JSON lokal di folder 'public/api/'.
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
    case 'search':
      // (REVISI) Semua pencarian (apapun kata kuncinya) akan mengembalikan data 'search.json'.
      // Ini adalah batasan dari penggunaan data lokal.
      return './api/search.json';
    default:
      return './api/business.json';
  }
};


export const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(newsReducer, initialState);

  const fetchNews = useCallback(async () => {
    if (state.category === 'favorites') {
      return;
    }
    dispatch({ type: 'SET_LOADING' });
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const url = getCustomUrl(state);
      
      // (REVISI) Fetch sekarang menargetkan file JSON lokal di folder 'public'.
      const response = await fetch(url); 

      if (!response.ok) {
        throw new Error(`Gagal memuat file JSON lokal: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Asumsi skema JSON Anda (dari NewsAPI) selalu memiliki status 'ok'
      if (data.status !== 'ok') {
        throw new Error('Format JSON dummy tidak valid');
      }
      
      dispatch({ type: 'SET_ARTICLES_SUCCESS', payload: { articles: data.articles, totalResults: data.totalResults } });
    } catch (err) {
      dispatch({ type: 'SET_ARTICLES_ERROR', payload: err.message });
    }
  }, [state.category, state.searchTerm, state.startDate, state.sortBy, state.currentPage, state.language, state.searchInTitle]);

  // (REVISI) Mengarahkan fetch popular news ke file JSON lokal.
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
    // (REVISI) Hapus pengecekan API_KEY, kita selalu fetch dari lokal.
    fetchNews();
  }, [fetchNews]);

  useEffect(() => {
    // (REVISI) Hapus pengecekan API_KEY, kita selalu fetch dari lokal.
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