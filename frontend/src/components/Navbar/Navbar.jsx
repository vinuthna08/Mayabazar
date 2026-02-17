import { Link } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">🎬 MAYABAZAR</Link>
      </div>
      <div className="navbar-links">
        <Link to="/movies">Movies</Link>
        <Link to="/theaters">Theaters</Link>
        <button className="btn-primary">Sign In</button>
      </div>
    </nav>
  )
}

export default Navbar