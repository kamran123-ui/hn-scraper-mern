import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const getDomain = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
};

const formatPoints = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n);

const StoryCard = ({ story, rank }) => {
  const { user, toggleBookmark, isBookmarked } = useAuth();
  const navigate   = useNavigate();
  const bookmarked = isBookmarked(story._id);
  const domain     = story.url ? getDomain(story.url) : null;

  const handleBookmark = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    await toggleBookmark(story._id);
  };

  return (
    <article className="story-card">
      {rank && <span className="story-rank">{rank}</span>}

      <div className="story-points-badge">
        <span className="points-number">{formatPoints(story.points)}</span>
        <span className="points-label">pts</span>
      </div>

      <div className="story-body">
        <div className="story-title">
          {story.url ? (
            <a href={story.url} target="_blank" rel="noopener noreferrer">
              {story.title}
            </a>
          ) : (
            <span>{story.title}</span>
          )}
        </div>
        {domain && <span className="story-domain">{domain}</span>}
        <div className="story-meta">
          <span className="meta-item">
            <span className="meta-icon">👤</span> {story.author}
          </span>
          <span className="meta-dot">·</span>
          <span className="meta-item">
            <span className="meta-icon">🕒</span> {story.postedAt || 'unknown'}
          </span>
        </div>
      </div>

      <button
        className={`bookmark-btn ${bookmarked ? 'bookmarked' : ''}`}
        onClick={handleBookmark}
        aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this story'}
        title={user ? (bookmarked ? 'Remove bookmark' : 'Bookmark') : 'Login to bookmark'}
      >
        {bookmarked ? '🔖' : '📌'}
      </button>
    </article>
  );
};

export default StoryCard;
