import React, { createContext, useContext, useState } from 'react';

const PermissionsContext = createContext();

export const PermissionsProvider = ({ children }) => {
  const [userType, setUserType] = useState(null); // 'UsuarioAdm', 'Organizacao', 'UsuarioFinal'

  return (
    <PermissionsContext.Provider value={{ userType, setUserType }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => useContext(PermissionsContext);
