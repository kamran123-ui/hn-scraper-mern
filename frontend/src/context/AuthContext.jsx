import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,      setUser]      = useState(null);
  const [bookmarks, setBookmarks] = useState(new Set());
  const [loading,   setLoading]   = useState(true);

  // ─── Hydrate from localStorage on mount ────────────────────────────────────
  useEffect(() => {
    const savedUser  = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      fetchBookmarks();
    }
    setLoading(false);
  }, []);

  // ─── Fetch bookmarked story IDs ─────────────────────────────────────────────
  const fetchBookmarks = useCallback(async () => {
    try {
      const res = await api.get('/stories/bookmarks');
      const ids = res.data.stories.map((s) => s._id);
      setBookmarks(new Set(ids));
    } catch {
      setBookmarks(new Set());
    }
  }, []);

  // ─── Auth Actions ───────────────────────────────────────────────────────────
  const _persistSession = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    _persistSession(data.token, data.user);
    await fetchBookmarks();
    return data;
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    _persistSession(data.token, data.user);
    await fetchBookmarks();
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setBookmarks(new Set());
  };

  // ─── Bookmark Toggle ─────────────────────────────────────────────────────────
  const toggleBookmark = async (storyId) => {
    if (!user) return false;
    try {
      const { data } = await api.post(`/stories/${storyId}/bookmark`);
      setBookmarks((prev) => {
        const next = new Set(prev);
        data.bookmarked ? next.add(storyId) : next.delete(storyId);
        return next;
      });
      return data.bookmarked;
    } catch (err) {
      console.error('Bookmark toggle failed:', err.message);
      return null;
    }
  };

  const isBookmarked = (storyId) => bookmarks.has(storyId);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        bookmarkIds: bookmarks,
        register,
        login,
        logout,
        toggleBookmark,
        isBookmarked,
        fetchBookmarks,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
