import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import StoryCard from '../components/StoryCard';

const Home = () => {
  const [stories,    setStories]    = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [scraping,   setScraping]   = useState(false);
  const [error,      setError]      = useState('');
  const [page,       setPage]       = useState(1);

  const fetchStories = useCallback(async (p = 1) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/stories?page=${p}&limit=10`);
      setStories(data.stories);
      setPagination(data.pagination);
    } catch {
      setError('Failed to load stories. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStories(page);
  }, [fetchStories, page]);

  const handleScrape = async () => {
    setScraping(true);
    setError('');
    try {
      await api.post('/scrape');
      setPage(1);
      await fetchStories(1);
    } catch {
      setError('Scraping failed. Please try again.');
    } finally {
      setScraping(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Top Stories</h1>
          <p className="page-subtitle">From Hacker News, sorted by points</p>
        </div>
        <button
          onClick={handleScrape}
          className="btn-primary"
          disabled={scraping || loading}
        >
          {scraping ? (
            <><span className="spinner" /> Scraping...</>
          ) : (
            '🔄 Refresh'
          )}
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>⚠️</span> {error}
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      ) : stories.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p>No stories found.</p>
          <p>Click <strong>Refresh</strong> to scrape Hacker News!</p>
        </div>
      ) : (
        <>
          <div className="stories-list">
            {stories.map((story, idx) => (
              <StoryCard
                key={story._id}
                story={story}
                rank={(page - 1) * 10 + idx + 1}
              />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn-page"
                onClick={() => setPage((p) => p - 1)}
                disabled={!pagination.hasPrevPage}
              >
                ← Prev
              </button>
              <span className="page-info">
                Page <strong>{page}</strong> of <strong>{pagination.totalPages}</strong>
              </span>
              <button
                className="btn-page"
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNextPage}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
