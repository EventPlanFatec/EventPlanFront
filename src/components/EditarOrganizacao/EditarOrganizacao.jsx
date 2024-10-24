import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditarOrganizacao = ({ organizacaoId }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrganizacao = async () => {
      try {
        const response = await fetch(`/api/organizacoes/${organizacaoId}`);
        const data = await response.json();
        if (response.ok) {
          setNome(data.nome);
          setEmail(data.email);
          setTelefone(data.telefone);
          setEndereco(data.endereco);
        } else {
          setError('Erro ao buscar informações da organização.');
        }
      } catch {
        setError('Erro de rede. Tente novamente.');
      }
    };

    fetchOrganizacao();
  }, [organizacaoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const organizacaoAtualizada = { nome, email, telefone, endereco };

    try {
      const response = await fetch(`/api/organizacoes/${organizacaoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(organizacaoAtualizada),
      });

      if (response.ok) {
        toast.success('Informações da organização atualizadas com sucesso!');
      } else {
        setError('Erro ao atualizar informações.');
        toast.error('Erro ao atualizar informações.');
      }
    } catch {
      setError('Erro de rede. Tente novamente.');
      toast.error('Erro de rede. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: '50px',
    }}>
      <ToastContainer />
      <div style={{
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#ffffff',
        width: '100%',
        maxWidth: '400px',
        margin: '0 20px',
      }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '20px',
          fontWeight: '600',
          fontSize: '24px',
        }}>Editar Organização</h1>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nome da Organização"
            variant="outlined"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="E-mail"
            variant="outlined"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Telefone"
            variant="outlined"
            required
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Endereço"
            variant="outlined"
            required
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            style={{ marginTop: '10px', backgroundColor: '#1976d2' }}
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Atualizar Organização'}
          </Button>
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default EditarOrganizacao;
