import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MovieList from './components/MovieList';
import MovieDetail from './components/MovieDetail';
import Favoritos from './components/Favoritos';
import { ThemeContext } from './ThemeContext';
import './index.css';

function App() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <Router>
      <div className={darkMode ? 'app dark' : 'app'}>
        <header style={{ padding: '20px', textAlign: 'center', position: 'relative' }}>
          <h1 style={{ color: '#f5c518' }}>🎬 Catálogo de Filmes</h1>

          {/* Botão de alternância de tema */}
          <button
            onClick={toggleTheme}
            title="Alternar Tema"
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              color: '#f5c518',
              cursor: 'pointer',
            }}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </header>

        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/filme/:id" element={<MovieDetail />} />
          <Route path="/favoritos" element={<Favoritos />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
