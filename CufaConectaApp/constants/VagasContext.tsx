import React, { createContext, useState, useContext } from 'react';

const VagasContext = createContext<any>(null);

export const VagasProvider = ({ children }: { children: React.ReactNode }) => {
  const [vagasCandidatadas, setVagasCandidatadas] = useState<any[]>([]);

  const candidatar = (vaga: any) => {
    if (!vagasCandidatadas.find(v => v.company === vaga.company)) {
      setVagasCandidatadas([...vagasCandidatadas, vaga]);
      return true;
    }
    return false;
  };

  return (
    <VagasContext.Provider value={{ vagasCandidatadas, candidatar }}>
      {children}
    </VagasContext.Provider>
  );
};

export const useVagas = () => useContext(VagasContext);