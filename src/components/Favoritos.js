import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './MovieList.module.css';

const Favoritos = () => {
  const [favoritos, setFavoritos] = useState([]);
  const [filmes, setFilmes] = useState([]);
  const apiKey = 'fa76dd2960151f8439bdea6dfe0160b9';

  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    const ids = saved ? JSON.parse(saved) : [];
    setFavoritos(ids);
  }, []);

  useEffect(() => {
    const fetchFavoritos = async () => {
      const promises = favoritos.map((id) =>
        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=pt-BR`).then((res) => res.json())
      );
      const results = await Promise.all(promises);
      setFilmes(results);
    };

    if (favoritos.length > 0) {
      fetchFavoritos();
    }
  }, [favoritos]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Meus Filmes Favoritos</h2>
      <Link to="/" style={{ marginBottom: '20px', display: 'inline-block' }}>← Voltar</Link>

      <div className={styles.grid}>
        {filmes.map((movie) => (
          <div key={movie.id} className={styles.card}>
            <Link to={`/filme/${movie.id}`}>
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
              />
            </Link>
            <h4>{movie.title}</h4>
          </div>
        ))}
        {filmes.length === 0 && <p>Você ainda não favoritou nenhum filme.</p>}
      </div>
    </div>
  );
};

export default Favoritos;
