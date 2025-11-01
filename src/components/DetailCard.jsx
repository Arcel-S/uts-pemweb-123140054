import { formatDate } from '../utils/formatDate.js';
import PropTypes from 'prop-types';
import '../components/DetailCard.css';

const DetailCard = ({ article }) => {
  const { urlToImage, title, source, publishedAt, url } = article;
  
  const placeholderImage = 'https://placehold.co/300x200?text=No+Image';

  const handleImageError = (e) => {
    e.currentTarget.src = placeholderImage;
  };

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="article-card">
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
    title: PropTypes.string,
    source: PropTypes.shape({
      name: PropTypes.string,
    }),
    publishedAt: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
};

export default DetailCard;