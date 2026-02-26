import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

// Helper to get initial theme synchronously to avoid flash of incorrect theme
function getInitialTheme() {
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch (e) {
    // ignore
  }

  // fallback to system preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  return 'light';
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  // Ensure document class is set as soon as possible
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

// Apply the initial theme synchronously to avoid flash and ensure Tailwind picks up the class
try {
  if (typeof document !== 'undefined') {
    const _initial = (function () {
      try {
        const saved = localStorage.getItem('theme');
        if (saved === 'light' || saved === 'dark') return saved;
      } catch (e) {
        /* ignore */
      }
      if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return 'light';
    })();
    const root = document.documentElement;
    const body = document.body;
    const appRoot = document.getElementById('root');
    if (_initial === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      body && body.classList.add('dark');
      appRoot && appRoot.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      body && body.classList.remove('dark');
      appRoot && appRoot.classList.remove('dark');
    }
  }
} catch (e) {
  // ignore in non-browser environments
}

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('theme', next);
      } catch (e) {
        // ignore
      }
      // apply immediately so UI updates without waiting for effect
      try {
        if (typeof document !== 'undefined') {
          const root = document.documentElement;
          const body = document.body;
          const appRoot = document.getElementById('root');
          if (next === 'dark') {
            root.classList.add('dark');
            root.setAttribute('data-theme', 'dark');
            body && body.classList.add('dark');
            appRoot && appRoot.classList.add('dark');
          } else {
            root.classList.remove('dark');
            root.setAttribute('data-theme', 'light');
            body && body.classList.remove('dark');
            appRoot && appRoot.classList.remove('dark');
          }
        }
      } catch (e) {
        // ignore
      }
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
