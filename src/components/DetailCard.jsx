const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  
  const dateString = date.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
  
  const timeString = date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  });

  return `${dateString} | ${timeString}`;
};

const DetailCard = ({ article }) => {
  const { urlToImage, title, source, publishedAt, url } = article;
  
  // --- PERBAIKAN: GANTI LAYANAN PLACEHOLDER ---
  // Kita ganti dari via.placeholder.com ke placehold.co
  const placeholderImage = 'https://placehold.co/300x200?text=No+Image';

  const handleImageError = (e) => {
    // Jika gambar gagal dimuat (link rusak, 404, dll)
    // ganti sumbernya ke placeholder
    e.currentTarget.src = placeholderImage;
  };

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="article-card">
      <div className="card-image-container">
        <img 
          // Tetap gunakan placeholder jika urlToImage null
          src={urlToImage || placeholderImage} 
          alt={title || 'Article Thumbnail'} 
          className="card-image"
          // onError handler untuk menangani link rusak
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