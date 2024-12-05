// src/pages/PerfilOrganizacao.js
import React from 'react';
import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PerfilOrganizacao = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Lógica para logout, por exemplo, limpar sessão ou token
    navigate('/login');  // Redireciona para a página de login
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Bem-vindo ao Perfil da Organização
      </Typography>
      <Typography variant="body1" paragraph>
        Como responsável pela organização, você pode gerenciar seus eventos, visualizar inscrições e interagir com os usuários.
      </Typography>
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate('/gerenciar-eventos')}
        style={{ marginTop: '10px' }}
      >
        Gerenciar Eventos
      </Button>

      <Button 
        variant="outlined" 
        color="secondary" 
        onClick={() => navigate('/visualizar-inscricoes')}
        style={{ marginTop: '10px', marginLeft: '10px' }}
      >
        Visualizar Inscrições
      </Button>

      <Button 
        variant="outlined" 
        color="error" 
        onClick={handleLogout} 
        style={{ marginTop: '20px' }}
      >
        Sair
      </Button>
    </div>
  );
};

export default PerfilOrganizacao;
