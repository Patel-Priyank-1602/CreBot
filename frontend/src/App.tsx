import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import BotDetail from './pages/BotDetail';

const Navbar = () => {
  return (
    <nav className="navbar">
      <a href="/" className="navbar-brand">CreBot.</a>
    </nav>
  );
};

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/bot/:id" element={<BotDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
