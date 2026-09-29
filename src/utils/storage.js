// Small wrapper around localStorage so the rest of the app does not have to
// worry about JSON parsing errors or private-browsing restrictions. Everything
// is stored as a JSON string and falls back to a default on failure.
export const storage = {
  get(key, fallback = null) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (error) {
      return fallback;
    }
  },

  set(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Storage can be full or blocked - nothing useful to do here.
    }
  },

  remove(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      // Ignore.
    }
  },
};
