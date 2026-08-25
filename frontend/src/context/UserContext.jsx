import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';
import { DEFAULT_SENSORY, applySensoryToDocument, applyLanguageToDocument } from '../utils/preferences';

const UserContext = createContext(null);
const STORAGE_KEY = 'humsaathi_user_id';

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiMode, setAiMode] = useState('unknown');

  const loadUser = useCallback(async (userId) => {
    try {
      const { user: loaded } = await api.getUser(userId);
      setUser(loaded);
      applySensoryToDocument(loaded.sensoryPrefs || DEFAULT_SENSORY);
      applyLanguageToDocument(loaded.language || 'en');
      localStorage.setItem(STORAGE_KEY, loaded.id);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    api.health().then((h) => setAiMode(h.mode)).catch(() => setAiMode('offline'));
    const storedId = localStorage.getItem(STORAGE_KEY);
    if (storedId) {
      loadUser(storedId).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [loadUser]);

  const setupUser = async (data) => {
    const payload = { ...data, userId: user?.id };
    const result = await api.setupUser(payload);
    const userObj = result?.user || result;
    setUser(userObj);
    applySensoryToDocument(userObj?.sensoryPrefs || DEFAULT_SENSORY);
    applyLanguageToDocument(userObj?.language || 'en');
    if (userObj?.id) {
      localStorage.setItem(STORAGE_KEY, userObj.id);
    }
    return userObj;
  };

  const updateSensory = async (prefs) => {
    if (!user) return;
    const merged = { ...(user.sensoryPrefs || DEFAULT_SENSORY), ...prefs };
    const result = await api.updateSensory(user.id, merged);
    const updated = result?.user || result;
    setUser(updated);
    applySensoryToDocument(updated?.sensoryPrefs || DEFAULT_SENSORY);
  };

  const refreshUser = () => user?.id && loadUser(user.id);

  return (
    <UserContext.Provider value={{ user, loading, aiMode, setupUser, updateSensory, refreshUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
