import DetailCard from './DetailCard';
import PropTypes from 'prop-types';

const DataTable = ({ articles }) => {
  return (
    <section className="article-list-grid"> 
      {articles.map((article, index) => (
        article.title && ( 
          <DetailCard 
            key={index} 
            article={article}
          />
        )
      ))}
    </section>
  );
};

DataTable.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default DataTable;