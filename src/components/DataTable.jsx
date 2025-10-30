import DetailCard from './DetailCard';

const DataTable = ({ articles }) => {
  return (
    // Kriteria CPMK0501 - Formatting rapi, menggunakan CSS Grid untuk layout
    <section className="article-list-grid"> 
      {articles.map((article, index) => (
        // Kriteria CPMK0502 - Conditional Rendering: Filter item tanpa judul
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

export default DataTable;