import DetailCard from './DetailCard';
import PropTypes from 'prop-types';
import '../components/DataTable.css';

const DataTable = ({ articles, currentUser, favorites, toggleFavorite }) => {
  return (
    <section className="article-list-grid"> 
      {articles.map((article, index) => (
        article.title && ( 
          <DetailCard 
            key={index} 
            article={article}
            // --- (BARU) Teruskan props ---
            currentUser={currentUser}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        )
      ))}
    </section>
  );
};

DataTable.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.object).isRequired,
  // --- (BARU) PropTypes ---
  currentUser: PropTypes.string,
  favorites: PropTypes.array.isRequired,
  toggleFavorite: PropTypes.func.isRequired,
};

export default DataTable;