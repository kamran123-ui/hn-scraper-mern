import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import StoryCard from '../components/StoryCard';

const Bookmarks = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const { data } = await api.get('/stories/bookmarks');
        if (!cancelled) setStories(data.stories);
      } catch {
        if (!cancelled) setError('Failed to load bookmarks.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">🔖 My Bookmarks</h1>
          <p className="page-subtitle">Stories you saved for later</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>⚠️</span> {error}
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      ) : stories.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📌</div>
          <p>No bookmarks yet!</p>
          <p>
            <Link to="/">Browse stories</Link> and click 📌 to bookmark them.
          </p>
        </div>
      ) : (
        <div className="stories-list">
          {stories.map((story) => (
            <StoryCard key={story._id} story={story} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
