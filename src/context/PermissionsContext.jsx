import React, { createContext, useContext, useState } from 'react';

const PermissionsContext = createContext();

export const PermissionsProvider = ({ children }) => {
  const [permissions, setPermissions] = useState({
    viewEvents: true,
    editEvents: false,
    deleteEvents: false,
  });

  const togglePermission = (permission) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: !prev[permission],
    }));
  };

  return (
    <PermissionsContext.Provider value={{ permissions, togglePermission }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  return useContext(PermissionsContext);
};
