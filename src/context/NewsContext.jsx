import React, { createContext, useReducer, useEffect, useCallback, useMemo } from 'react';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL_TOP = 'https://newsapi.org/v2/everything';
const BASE_URL_EVERY = 'https://newsapi.org/v2/top-headlines';

const initialState = {
  articles: [],
  popularArticles: [],
  popularError: null, // <-- (BARU) State error untuk popular
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
      return { ...state, popularArticles: action.payload, popularError: null }; // <-- Reset error
    
    // --- (BARU) Case untuk error popular ---
    case 'SET_POPULAR_ERROR':
      return { ...state, popularError: action.payload };
    // --- AKHIR CASE BARU ---

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
  const { category, searchTerm, startDate, sortBy, currentPage, pageSize, language, searchInTitle } = state;
  
  if (category === 'favorites') {
    return null; 
  }

  const yyyymmdd = (d) => d.toISOString().split('T')[0];
  const topHeadlineParams = `pageSize=${pageSize}&page=${currentPage}&apiKey=${API_KEY}`;
  let everythingParams = `pageSize=${pageSize}&page=${currentPage}&apiKey=${API_KEY}&sortBy=${sortBy}`;
  let query = searchTerm;
  if (searchInTitle) {
    query = query ? `"${query}" IN TITLE` : '';
  }
  if (category !== 'search') {
    const now = new Date();
    const oneMonthAgoDate = new Date(now);
    oneMonthAgoDate.setMonth(now.getMonth() - 1);
    const oneMonthAgo = yyyymmdd(oneMonthAgoDate);
    switch (category.toLowerCase()) {
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
  let url = `${BASE_URL_TOP}?q=${encodeURIComponent(searchQuery)}&${everythingParams}&language=${language}`;
  if (startDate) {
    const dateFilter = `&from=${yyyymmdd(startDate)}&to=${yyyymmdd(startDate)}`;
    url += dateFilter;
  }
  return url;
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
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status} - ${errorData.message}`);
      }
      
      const data = await response.json();
      
      if (data.status !== 'ok') {
        throw new Error(data.message || 'Failed to fetch news');
      }
      
      dispatch({ type: 'SET_ARTICLES_SUCCESS', payload: { articles: data.articles, totalResults: data.totalResults } });
    } catch (err) {
      dispatch({ type: 'SET_ARTICLES_ERROR', payload: err.message });
    }
  }, [state.category, state.searchTerm, state.startDate, state.sortBy, state.currentPage, state.language, state.searchInTitle]);

  const fetchPopularNews = useCallback(async () => {
    const popularUrl = `${BASE_URL_EVERY}?country=us&pageSize=5&apiKey=${API_KEY}`;
    try {
      const response = await fetch(popularUrl);
      if (!response.ok) throw new Error('Gagal fetch popular news');
      const data = await response.json();
      dispatch({ type: 'SET_POPULAR_SUCCESS', payload: data.articles });
    } catch (err) {
      // --- (BARU) Kirim error ke state ---
      dispatch({ type: 'SET_POPULAR_ERROR', payload: err.message });
      console.error("Gagal fetch popular:", err);
    }
  }, []);

  useEffect(() => {
    if (API_KEY) {
      fetchNews();
    }
  }, [fetchNews]);

  useEffect(() => {
    if (API_KEY) {
      fetchPopularNews();
    }
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