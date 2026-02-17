const TMDB_BASE = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

export const TMDB_IMG = 'https://image.tmdb.org/t/p/w500'

export const tmdb = {
  getNowPlaying: () =>
    fetch(`${TMDB_BASE}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`).then(r => r.json()),

  getTrending: () =>
    fetch(`${TMDB_BASE}/trending/movie/week?api_key=${API_KEY}`).then(r => r.json()),

  getUpcoming: () =>
    fetch(`${TMDB_BASE}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`).then(r => r.json()),

  searchMovies: (query) =>
    fetch(`${TMDB_BASE}/search/movie?api_key=${API_KEY}&query=${query}`).then(r => r.json()),

  getGenres: () =>
    fetch(`${TMDB_BASE}/genre/movie/list?api_key=${API_KEY}`).then(r => r.json()),
}