// "Polyfill" localStorage for SSR and to add a prefix to the keys.

/**
 * Prefix a `localStorage` key to avoid conflicts with other applications.
 * @param key The key to prefix.
 * @returns
 */
function prefixKey(key: string): string {
  if (key.length === 0) {
    throw new Error('key must have at least one character');
  }
  return `react-iframe-bridge-${key}`;
}

let getItem: (key: string) => unknown | null;
let setItem: (key: string, value: unknown) => void;

if (typeof localStorage !== 'undefined') {
  getItem = function getItem(key: string) {
    const value = localStorage.getItem(prefixKey(key));
    if (!value) return null;
    return JSON.parse(value);
  };
  setItem = (key: string, value: unknown) =>
    localStorage.setItem(prefixKey(key), JSON.stringify(value));
} else {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getItem = (key: string) => null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setItem = (key: string, value: unknown): void => {
    // noop
  };
}

export { getItem, setItem };
