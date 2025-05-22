import { useCallback, useEffect, useState } from 'react';

import { getItem, setItem } from '../utils/local_storage.js';

/**
 * Like `useState`, but initializing from `localStorage` if available and saving
 * to `localStorage` everytime the state is changed.
 * @param key localStorage key. Will be appended to the `react-iframe-bridge-` prefix.
 * @param initialValue Value to use if the storage is empty.
 */
export function useLocalStorage<ValueType>(
  key: string,
  initialValue: ValueType,
) {
  const [storedValue, setStoredValue] = useState<ValueType>(() => {
    // Get from local storage by key.
    const item = getItem(key);
    // Parse stored json or if none return initialValue.
    return item ? (item as ValueType) : initialValue;
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage.
  const setValue = useCallback(
    (value: ValueType) => {
      // Save state.
      setStoredValue(value);
      // Save to local storage.
      setItem(key, value);
    },
    [key],
  );

  return [storedValue, setValue] as const;
}

/**
 * Save the provided value to `localStorage` everytime it changes.
 * @param key localStorage key. Will be appended to the `react-iframe-bridge-` prefix.
 * @param value Value to save.
 */
export function useSaveToLocalStorage(key: string, value: unknown): void {
  useEffect(() => {
    setItem(key, value);
  }, [key, value]);
}
