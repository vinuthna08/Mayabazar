import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { tmdb, TMDB_IMG } from '../services/api'
import './Movies.css'

const LANGUAGES = ['All', 'English', 'Hindi', 'Telugu', 'Tamil']
const SORT_OPTIONS = ['Popularity', 'Rating', 'Release Date']

const Movies = () => {
  const [movies, setMovies] = useState([])
  const [filtered, setFiltered] = useState([])
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [activeTab, setActiveTab] = useState('nowplaying')
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [selectedLang, setSelectedLang] = useState('All')
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState('Popularity')
  const [budget, setBudget] = useState(600)

  // Fetch genres
  useEffect(() => {
    tmdb.getGenres().then(data => {
      setGenres([{ id: 'all', name: 'All' }, ...data.genres])
    })
  }, [])

  // Fetch movies based on tab
  useEffect(() => {
    setLoading(true)
    const fetcher =
      activeTab === 'nowplaying' ? tmdb.getNowPlaying() :
      activeTab === 'trending'   ? tmdb.getTrending() :
                                   tmdb.getUpcoming()

    fetcher.then(data => {
      setMovies(data.results || [])
      setLoading(false)
    })
  }, [activeTab])

  // Search
  useEffect(() => {
    if (search.trim()) {
      setLoading(true)
      tmdb.searchMovies(search).then(data => {
        setMovies(data.results || [])
        setLoading(false)
      })
    }
  }, [search])

  // Apply filters
  useEffect(() => {
    let result = [...movies]

    if (selectedGenre !== 'All') {
      const genre = genres.find(g => g.name === selectedGenre)
      if (genre) result = result.filter(m => m.genre_ids?.includes(genre.id))
    }

    if (minRating > 0) {
      result = result.filter(m => m.vote_average >= minRating)
    }

    result = result.sort((a, b) => {
      if (sortBy === 'Rating') return b.vote_average - a.vote_average
      if (sortBy === 'Release Date') return new Date(b.release_date) - new Date(a.release_date)
      return b.popularity - a.popularity
    })

    setFiltered(result)
  }, [movies, selectedGenre, minRating, sortBy, budget])

  const getPrice = (popularity) => {
    const min = Math.floor(100 + (popularity % 100))
    const max = Math.floor(min + 200 + (popularity % 200))
    return { min, max }
  }

  return (
    <div className="movies-page">

      {/* PAGE HEADER */}
      <div className="movies-header">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🎬 MOVIES
        </motion.h1>

        {/* SEARCH */}
        <div className="movies-search">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')}>✕</button>
          )}
        </div>
      </div>

      <div className="movies-layout">

        {/* SIDEBAR FILTERS */}
        <aside className="filters-sidebar">
          <h3 className="filter-heading">FILTERS</h3>

          {/* TABS */}
          <div className="filter-group">
            <label>Category</label>
            <div className="tab-group">
              {[
                { key: 'nowplaying', label: 'Now Playing' },
                { key: 'trending',   label: 'Trending' },
                { key: 'upcoming',   label: 'Upcoming' },
              ].map(tab => (
                <button
                  key={tab.key}
                  className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => { setActiveTab(tab.key); setSearch('') }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* GENRE */}
          <div className="filter-group">
            <label>Genre</label>
            <div className="genre-list">
              {genres.slice(0, 10).map(g => (
                <button
                  key={g.id}
                  className={`genre-btn ${selectedGenre === g.name ? 'active' : ''}`}
                  onClick={() => setSelectedGenre(g.name)}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>

          {/* MIN RATING */}
          <div className="filter-group">
            <label>Min Rating: <span className="gold">{minRating}+</span></label>
            <input
              type="range"
              min="0" max="9" step="1"
              value={minRating}
              onChange={e => setMinRating(Number(e.target.value))}
              className="range-slider"
            />
            <div className="range-labels">
              <span>Any</span><span>9+</span>
            </div>
          </div>

          {/* MAX BUDGET */}
          <div className="filter-group">
            <label>Max Budget: <span className="gold">₹{budget}</span></label>
            <input
              type="range"
              min="100" max="600" step="50"
              value={budget}
              onChange={e => setBudget(Number(e.target.value))}
              className="range-slider"
            />
            <div className="range-labels">
              <span>₹100</span><span>₹600</span>
            </div>
          </div>

          {/* SORT */}
          <div className="filter-group">
            <label>Sort By</label>
            <div className="tab-group">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt}
                  className={`tab-btn ${sortBy === opt ? 'active' : ''}`}
                  onClick={() => setSortBy(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* RESET */}
          <button className="reset-btn" onClick={() => {
            setSelectedGenre('All')
            setSelectedLang('All')
            setMinRating(0)
            setBudget(600)
            setSortBy('Popularity')
            setSearch('')
          }}>
            Reset Filters
          </button>
        </aside>

        {/* MOVIES GRID */}
        <main className="movies-main">
          <div className="results-bar">
            <span className="results-count">
              Showing <strong>{filtered.length}</strong> movies
            </span>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton-card" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="no-results">
              <p>🎬 No movies found</p>
              <span>Try adjusting your filters</span>
            </div>
          ) : (
            <AnimatePresence>
              <div className="movies-grid">
                {filtered.map((movie, i) => {
                  const price = getPrice(movie.popularity)
                  return (
                    <motion.div
                      key={movie.id}
                      className="movie-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ y: -6 }}
                    >
                      <div className="poster-wrap">
                        <img
                          src={movie.poster_path
                            ? `${TMDB_IMG}${movie.poster_path}`
                            : `https://via.placeholder.com/300x450/1C1C1C/F5C518?text=${movie.title}`
                          }
                          alt={movie.title}
                          className="poster-img"
                          loading="lazy"
                        />
                        <div className="poster-overlay">
                          <button
                            className="book-btn"
                            onClick={() => navigate(`/theaters?movie=${movie.title}&movieId=${movie.id}`)}
                          >
                            Book Now
                          </button>
                        </div>
                        <div className="rating-badge">
                          ⭐ {movie.vote_average?.toFixed(1)}
                        </div>
                      </div>

                      <div className="card-info">
                        <h3 className="card-title">{movie.title}</h3>
                        <p className="card-date">
                          🗓 {movie.release_date?.slice(0, 4)}
                        </p>
                        <div className="price-range">
                          <span className="price-min">₹{price.min}</span>
                          <div className="price-bar">
                            <div
                              className="price-fill"
                              style={{ width: `${(price.max / 600) * 100}%` }}
                            />
                          </div>
                          <span className="price-max">₹{price.max}</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </AnimatePresence>
          )}
        </main>
      </div>
    </div>
  )
}

export default Movies