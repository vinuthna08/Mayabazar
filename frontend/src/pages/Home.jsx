import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Home.css'

const FEATURED_MOVIES = [
  {
    id: 1,
    title: "Kalki 2898 AD",
    genre: "Sci-Fi / Action",
    rating: 8.2,
    language: "Telugu",
    poster: "https://image.tmdb.org/t/p/w500/1tvfYywBnMfPDvUNzDFEyHHDgRn.jpg",
    price: "₹150 - ₹500",
    badge: "BLOCKBUSTER"
  },
  {
    id: 2,
    title: "Pushpa 2",
    genre: "Action / Drama",
    rating: 8.5,
    language: "Telugu",
    poster: "https://image.tmdb.org/t/p/w500/iHgLqBMSGHqSDDEm8tHQEDWmPwO.jpg",
    price: "₹120 - ₹450",
    badge: "TRENDING"
  },
  {
    id: 3,
    title: "Devara",
    genre: "Action / Thriller",
    rating: 7.8,
    language: "Telugu",
    poster: "https://image.tmdb.org/t/p/w500/jXJqHtDMbJqctnHHSHkJ6YgAOJU.jpg",
    price: "₹100 - ₹400",
    badge: "HIT"
  },
  {
    id: 4,
    title: "Fighter",
    genre: "Action",
    rating: 7.5,
    language: "Hindi",
    poster: "https://image.tmdb.org/t/p/w500/wHRmAbGKnJzUn0XCBpVNT4GSZR3.jpg",
    price: "₹130 - ₹480",
    badge: "NEW"
  },
  {
    id: 5,
    title: "Oppenheimer",
    genre: "Biography / Drama",
    rating: 9.0,
    language: "English",
    poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    price: "₹200 - ₹600",
    badge: "OSCAR"
  },
  {
    id: 6,
    title: "Animal",
    genre: "Action / Drama",
    rating: 7.6,
    language: "Hindi",
    poster: "https://image.tmdb.org/t/p/w500/nOPAa3pXMQvqfGarGvEiKjh3Ivc.jpg",
    price: "₹110 - ₹420",
    badge: "POPULAR"
  }
]

const STATS = [
  { value: "500+", label: "Theaters" },
  { value: "50+", label: "Cities" },
  { value: "10M+", label: "Bookings" },
  { value: "4.8★", label: "Rating" }
]

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [detecting, setDetecting] = useState(false)
  const navigate = useNavigate()

  const detectLocation = () => {
    setDetecting(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          )
          const data = await res.json()
          const city = data.address.city || data.address.town || data.address.village || 'Your City'
          setLocation(city)
        } catch {
          setLocation('Location detected')
        }
        setDetecting(false)
      },
      () => {
        setLocation('Location unavailable')
        setDetecting(false)
      }
    )
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/movies?search=${searchQuery}&location=${location}`)
    }
  }

  return (
    <div className="home">

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-overlay" />
          <div className="spotlight spotlight-1" />
          <div className="spotlight spotlight-2" />
        </div>

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-badge">🎬 Now Showing Near You</div>
          <h1 className="hero-title">
            BOOK YOUR <span className="gold-text">PERFECT</span><br />
            CINEMA EXPERIENCE
          </h1>
          <p className="hero-subtitle">
            Personalized theaters · Best seats · Best prices
          </p>

          {/* SEARCH BAR */}
          <div className="search-bar">
            <div className="search-location" onClick={detectLocation}>
              <span className="search-icon">📍</span>
              <span className={detecting ? 'detecting' : ''}>
                {detecting ? 'Detecting...' : location || 'Detect Location'}
              </span>
            </div>
            <div className="search-divider" />
            <input
              className="search-input"
              type="text"
              placeholder="Search movies, theaters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="search-btn" onClick={handleSearch}>
              🔍 Search
            </button>
          </div>

          {/* QUICK FILTERS */}
          <div className="quick-filters">
            {['Action', 'Drama', 'Comedy', 'Thriller', 'IMAX', '4DX'].map(tag => (
              <span key={tag} className="filter-tag">{tag}</span>
            ))}
          </div>
        </motion.div>

        {/* STATS BAR */}
        <motion.div
          className="stats-bar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {STATS.map((stat, i) => (
            <div key={i} className="stat-item">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* NOW SHOWING */}
      <section className="movies-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">NOW SHOWING</h2>
            <p className="section-sub">Handpicked for you based on your location</p>
          </div>
          <button className="btn-secondary" onClick={() => navigate('/movies')}>
            View All →
          </button>
        </div>

        <div className="movies-scroll">
          {FEATURED_MOVIES.map((movie, i) => (
            <motion.div
              key={movie.id}
              className="movie-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => navigate(`/theaters?movie=${movie.title}`)}
            >
              <div className="movie-poster-wrap">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="movie-poster"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/300x450/1C1C1C/F5C518?text=${movie.title}`
                  }}
                />
                <div className="movie-badge">{movie.badge}</div>
                <div className="movie-overlay">
                  <button className="book-now-btn">Book Now</button>
                </div>
              </div>
              <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <p className="movie-genre">{movie.genre}</p>
                <div className="movie-meta">
                  <span className="movie-rating">⭐ {movie.rating}</span>
                  <span className="movie-lang">{movie.language}</span>
                </div>
                <div className="movie-price">{movie.price}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WHY MAYABAZAR */}
      <section className="features-section">
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '10px' }}>
          WHY <span className="gold-text">MAYABAZAR</span>
        </h2>
        <p className="section-sub" style={{ textAlign: 'center', marginBottom: '50px' }}>
          Not just booking — an experience
        </p>

        <div className="features-grid">
          {[
            {  title: 'Location Smart', desc: 'Finds theaters nearest to you with real-time distance' },
            {  title: 'Budget Optimizer', desc: 'Min to max price comparison across all theaters' },
            {  title :'POV Seat View', desc: 'See exact screen view from your seat before booking' },
            {  title: 'Screen Intel', desc: 'IMAX, 4DX, Dolby info with full specs' },
            { title: 'Loyalty Points', desc: 'Earn points every booking, redeem for free tickets' },
            {  title: 'Group Booking', desc: 'Smart finder for best adjacent seats for groups' },
          ].map((f, i) => (
            <motion.div
              key={i}
              className="feature-card glass-card"
              whileHover={{ y: -5, borderColor: 'rgba(229,9,20,0.3)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo">🎬 MAYABAZAR</div>
        <p className="footer-sub">Your personalized cinema experience</p>
        <p className="footer-copy">© 2025 Mayabazar. All rights reserved.</p>
      </footer>

    </div>
  )
}

export default Home