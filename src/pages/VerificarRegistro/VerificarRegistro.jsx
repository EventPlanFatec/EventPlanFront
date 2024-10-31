import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './VerificarRegistro.module.css';

const VerificarRegistro = ({ organizacaoId }) => {
  const [orgId, setOrgId] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckStatus = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/organizations/${orgId}/status`);
      setStatus(response.data.status);
    } catch (err) {
      setError(err.response.data || 'Erro ao buscar o status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Verificar Status de Registro</h2>
      <input
        className={styles.inputField}
        type="text"
        value={orgId}
        onChange={(e) => setOrgId(e.target.value)}
        placeholder="Digite o ID da Organização"
      />
      <button className={styles.checkButton} onClick={handleCheckStatus}>Verificar</button>
      {loading && <p>Carregando...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {status && (
        <div>
          <p>Status: {status}</p>
          {status === 'pendente' && <p>Seu registro está pendente de aprovação.</p>}
          {status === 'aprovado' && <p>Seu registro foi aprovado!</p>}
        </div>
      )}
    </div>
  );
};

export default VerificarRegistro;
