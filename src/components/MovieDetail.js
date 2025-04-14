import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ThemeContext } from '../ThemeContext';
import styles from './MovieDetail.module.css';

const MovieDetail = () => {
  const { id } = useParams();
  const { darkMode } = useContext(ThemeContext);
  const [movie, setMovie] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [comments, setComments] = useState(() => {
    const saved = localStorage.getItem(`comments-${id}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [newComment, setNewComment] = useState('');
  const apiKey = 'fa76dd2960151f8439bdea6dfe0160b9';

  useEffect(() => {
    const fetchMovie = async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=pt-BR`
      );
      const data = await response.json();
      setMovie(data);
    };

    fetchMovie();
  }, [id]);

  const handleAddComment = () => {
    if (newComment.trim() === '') return;
    const updated = [...comments, newComment];
    setComments(updated);
    localStorage.setItem(`comments-${id}`, JSON.stringify(updated));
    setNewComment('');
  };

  if (!movie) return <p className={styles.loading}>Carregando...</p>;

  return (
    <div className={`${styles.page} ${darkMode ? styles.dark : styles.light}`}>
      <Link to="/" className={styles.back}>← Voltar</Link>

      <div className={styles.container}>
        <div className={styles.posterBox}>
          {showVideo ? (
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Trailer"
              frameBorder="0"
              allowFullScreen
              className={styles.video}
            ></iframe>
          ) : (
            <>
              <img
                src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
                alt={movie.title}
                className={styles.poster}
              />
              <div className={styles.playOverlay} onClick={() => setShowVideo(true)}>▶</div>
            </>
          )}
        </div>

        <div className={styles.info}>
          <h2 className={styles.title}>{movie.title}</h2>
          <p className={styles.description}>{movie.overview}</p>

          <div className={styles.details}>
            <p><strong>Nota:</strong> {movie.vote_average}</p>
            <p><strong>Lançamento:</strong> {movie.release_date}</p>
            <p><strong>Duração:</strong> {movie.runtime} min</p>
            <p><strong>Gêneros:</strong> {movie.genres.map(g => g.name).join(', ')}</p>
          </div>

          <div className={styles.reactions}>
            <span>❤️ 128</span>
            <span>💬 23</span>
            <span>⭐ 64</span>
          </div>
        </div>
      </div>

      {/* Comentários */}
      <div className={styles.comments}>
        <h3>Comentários</h3>
        <textarea
          rows="3"
          placeholder="Escreva seu comentário..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleAddComment}>Enviar</button>

        {comments.length > 0 ? (
          <ul>
            {comments.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        ) : (
          <p>Nenhum comentário ainda.</p>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;
