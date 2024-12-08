import React, { createContext, useContext, useState } from 'react';

const CnpjContext = createContext();

export const CnpjProvider = ({ children }) => {
  const [cnpj, setCnpj] = useState(null);

  return (
    <CnpjContext.Provider value={{ cnpj, setCnpj }}>
      {children}
    </CnpjContext.Provider>
  );
};

export const useCnpj = () => useContext(CnpjContext);
