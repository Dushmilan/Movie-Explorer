import { useEffect, useState } from 'react';

// Waits until the user stops typing before we fire a request. Keeps the API
// happy and stops the results flickering on every keypress.
export default function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
