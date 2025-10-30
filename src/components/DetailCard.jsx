import { formatDate } from '../utils/formatDate.js';

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

export default DetailCard;