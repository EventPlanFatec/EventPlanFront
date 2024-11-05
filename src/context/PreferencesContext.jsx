import React, { createContext, useContext, useState, useEffect } from 'react';

const PreferencesContext = createContext();

export const usePreferences = () => {
  return useContext(PreferencesContext);
};

export const PreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState(() => {
    const savedPreferences = localStorage.getItem('preferences');
    return savedPreferences ? JSON.parse(savedPreferences) : {};
  });

  const updatePreferences = (newPreferences) => {
    setPreferences(newPreferences);
  };

  useEffect(() => {
    if (preferences) {
      localStorage.setItem('preferences', JSON.stringify(preferences));
    }
  }, [preferences]);

  return (
    <PreferencesContext.Provider value={{ preferences, updatePreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
};
