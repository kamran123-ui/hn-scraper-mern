import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="page">
        <div className="loading-container">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton-card" />)}
        </div>
      </div>
    );
  }

  if (!user) {
    // Save the attempted URL so we can redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
