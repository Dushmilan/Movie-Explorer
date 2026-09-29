import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { storage } from '../utils/storage';

const USERS_KEY = 'movieExplorer.users';
const SESSION_KEY = 'movieExplorer.session';

const AuthContext = createContext(null);

// NOTE: this is a front-end only demo. Accounts are kept in localStorage and
// the password is stored as plain text, which is fine for a mock login but
// would never be done in a real app (that work belongs on a server).
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.get(SESSION_KEY));

  // Keep the session in sync so a refresh does not log the user out.
  useEffect(() => {
    if (user) {
      storage.set(SESSION_KEY, user);
    } else {
      storage.remove(SESSION_KEY);
    }
  }, [user]);

  const signUp = useCallback(({ username, password }) => {
    const name = username.trim();

    if (!name || !password) {
      throw new Error('Please fill in every field.');
    }
    if (password.length < 4) {
      throw new Error('Password must be at least 4 characters long.');
    }

    const users = storage.get(USERS_KEY, []);
    const alreadyExists = users.some(
      (existing) => existing.username.toLowerCase() === name.toLowerCase()
    );
    if (alreadyExists) {
      throw new Error('That username is already taken.');
    }

    storage.set(USERS_KEY, [...users, { username: name, password }]);
    const session = { username: name };
    setUser(session);
    return session;
  }, []);

  const signIn = useCallback(({ username, password }) => {
    const name = username.trim();
    const users = storage.get(USERS_KEY, []);
    const found = users.find(
      (existing) =>
        existing.username.toLowerCase() === name.toLowerCase() &&
        existing.password === password
    );

    if (!found) {
      throw new Error('Wrong username or password.');
    }

    const session = { username: found.username };
    setUser(session);
    return session;
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, signUp, signIn, signOut }),
    [user, signUp, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
}
