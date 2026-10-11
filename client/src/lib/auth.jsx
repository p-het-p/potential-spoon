import { createContext, useContext, useState, useEffect } from 'react';
import { getProfile as fetchProfile } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [attendee, setAttendee] = useState(() => {
    try {
      const saved = localStorage.getItem('attendee');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [guestToken, setGuestToken] = useState(() => localStorage.getItem('guest_token') || null);
  const [isGuest, setIsGuest] = useState(() => {
    return !!(localStorage.getItem('attendee') || localStorage.getItem('guest_token') || sessionStorage.getItem('guest_session') === 'active');
  });
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    fetchProfile(token)
      .then(data => setUser(data))
      .catch(() => { localStorage.removeItem('token'); setToken(null); })
      .finally(() => setLoading(false));
  }, [token]);

  const login = (t, u) => {
    localStorage.setItem('token', t);
    setToken(t);
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const startGuestSession = (attendeeData = null, tokenStr = null) => {
    sessionStorage.setItem('guest_session', 'active');
    if (attendeeData) {
      localStorage.setItem('attendee', JSON.stringify(attendeeData));
      setAttendee(attendeeData);
    }
    if (tokenStr) {
      localStorage.setItem('guest_token', tokenStr);
      setGuestToken(tokenStr);
    }
    setIsGuest(true);
  };

  const clearGuestSession = () => {
    sessionStorage.removeItem('guest_session');
    localStorage.removeItem('guest_token');
    localStorage.removeItem('attendee');
    setAttendee(null);
    setGuestToken(null);
    setIsGuest(false);
  };

  const attendeeId = attendee?.attendee_id || null;

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isGuest,
      attendee,
      attendeeId,
      guestToken,
      loading,
      login,
      logout,
      startGuestSession,
      clearGuestSession
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
