import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Movies from './pages/Movies'
import Theaters from './pages/TheaterList'
import SeatSelection from './pages/SeatSelection'
import Checkout from './pages/Checkout'
import Navbar from './components/Navbar/Navbar'
import './index.css'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/theaters" element={<Theaters />} />
        <Route path="/seats" element={<SeatSelection />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  )
}

export default App