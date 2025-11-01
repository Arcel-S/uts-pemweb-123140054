import { formatDate } from '../utils/formatDate.js';
import PropTypes from 'prop-types';
import '../components/DetailCard.css';
// --- (BARU) Import Ikon Hati ---
import { HiOutlineHeart, HiHeart } from 'react-icons/hi';

const DetailCard = ({ article, currentUser, favorites, toggleFavorite }) => {
  const { urlToImage, title, source, publishedAt, url } = article;
  
  const placeholderImage = 'https://placehold.co/300x200?text=No+Image';

  const handleImageError = (e) => {
    e.currentTarget.src = placeholderImage;
  };

  // --- (BARU) Cek apakah artikel ini di-favoritkan ---
  const isFavorited = favorites.some(fav => fav.url === url);

  const handleFavoriteClick = (e) => {
    e.preventDefault(); // Mencegah link card terbuka saat klik tombol
    toggleFavorite(article);
  };

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="article-card">
      
      {/* --- (BARU) Tombol Favorite --- */}
      {currentUser && (
        <button 
          className={`favorite-button ${isFavorited ? 'favorited' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorited ? <HiHeart /> : <HiOutlineHeart />}
        </button>
      )}
      {/* --- AKHIR TOMBOL BARU --- */}

      <div className="card-image-container">
        <img 
          src={urlToImage || placeholderImage} 
          alt={title || 'Article Thumbnail'} 
          className="card-image"
          onError={handleImageError}
        />
      </div>
      <div className="card-content">
        <h3>{title}</h3>

        <div className="card-meta">
          <span className="meta-source">
            Sumber: <strong>{source.name}</strong>
          </span>
          <span className="meta-date">
            {formatDate(publishedAt)}
          </span>
        </div>

      </div>
    </a>
  );
};

DetailCard.propTypes = {
  article: PropTypes.shape({
    urlToImage: PropTypes.string,
    title: PropTypes.string.isRequired,
    source: PropTypes.shape({
      name: PropTypes.string,
    }),
    publishedAt: PropTypes.string,
    url: PropTypes.string.isRequired,
  }).isRequired,
  // --- (BARU) PropTypes ---
  currentUser: PropTypes.string,
  favorites: PropTypes.array.isRequired,
  toggleFavorite: PropTypes.func.isRequired,
};

export default DetailCard;