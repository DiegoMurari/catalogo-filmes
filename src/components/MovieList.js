import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './MovieList.module.css';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const apiKey = 'fa76dd2960151f8439bdea6dfe0160b9';
  const observer = useRef();

  // Carrega dados com paginação
  const fetchMovies = async () => {
    setIsLoading(true);
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=pt-BR&page=${page}`
    );
    const data = await res.json();
    setMovies((prev) => [...prev, ...data.results]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMovies();
  }, [page]);

  // Detecta rolagem até o fim
  const lastMovieRef = useRef();
  useEffect(() => {
    const handleObserver = (entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        setPage((prev) => prev + 1);
      }
    };

    observer.current = new IntersectionObserver(handleObserver);
    if (lastMovieRef.current) {
      observer.current.observe(lastMovieRef.current);
    }

    return () => {
      if (observer.current && lastMovieRef.current) {
        observer.current.unobserve(lastMovieRef.current);
      }
    };
  }, [movies]);

  // Likes persistentes por filme
  const getLikes = (id) => {
    const stored = localStorage.getItem(`likes-${id}`);
    if (stored) return parseInt(stored);
    const random = Math.floor(Math.random() * 100 + 20);
    localStorage.setItem(`likes-${id}`, random);
    return random;
  };

  const getComments = (id) => {
    const stored = localStorage.getItem(`comments-${id}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.length;
    }
    return 0;
  };

  return (
    <div className={styles.page}>
      {/* Destaque principal */}
      <div className={styles.highlight}>
        <img
          src="https://image.tmdb.org/t/p/w1280/rULWuutDcN5NvtiZi4FRPzRYWSh.jpg"
          alt="Filme em destaque"
          className={styles.highlightImage}
        />
        <div className={styles.highlightInfo}>
          <h2>Filme em Destaque</h2>
          <p>Assista agora ao trailer exclusivo de um dos filmes mais esperados do ano!</p>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Principal */}
        <div className={styles.main}>
          <h2 className={styles.title}>Filmes Populares</h2>
          <div className={styles.grid}>
            {movies.map((movie, index) => {
              const isLast = index === movies.length - 1;
              return (
                <div
                  key={movie.id}
                  className={styles.card}
                  ref={isLast ? lastMovieRef : null}
                >
                  <Link to={`/filme/${movie.id}`}>
                    <img
                      src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                      alt={movie.title}
                      className={styles.cardImg}
                    />
                  </Link>
                  <h4 className={styles.cardTitle}>{movie.title}</h4>
                  <div className={styles.reactions}>
                    <span>❤️ {getLikes(movie.id)}</span>
                    <span>💬 {getComments(movie.id)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {isLoading && <p className={styles.loading}>Carregando...</p>}
        </div>

        {/* Lateral "a seguir" */}
        <div className={styles.sidebar}>
          <h3>A seguir</h3>
          <ul className={styles.sidebarList}>
            {movies.slice(0, 5).map((movie) => (
              <li key={movie.id} className={styles.sidebarItem}>
                <Link to={`/filme/${movie.id}`} className={styles.sidebarLink}>
                  <img
                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                    alt={movie.title}
                    className={styles.sidebarImg}
                  />
                  <div>
                    <p className={styles.sidebarTitle}>{movie.title}</p>
                    <p className={styles.sidebarTime}>
                      {Math.floor(Math.random() * 40 + 70)} min
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MovieList;
