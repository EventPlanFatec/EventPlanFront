// src/pages/PerfilAdm.js
import React from 'react';
import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PerfilAdm = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Lógica para logout, por exemplo, limpar sessão ou token
    navigate('/login');  // Redireciona para a página de login
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Bem-vindo ao Perfil do Administrador
      </Typography>
      <Typography variant="body1" paragraph>
        Como administrador, você pode gerenciar todos os aspectos do sistema, incluindo a visualização de eventos,
        a gestão de usuários e outras funcionalidades administrativas.
      </Typography>
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate('/gerenciar-usuarios')}
        style={{ marginTop: '10px' }}
      >
        Gerenciar Usuários
      </Button>

      <Button 
        variant="contained" 
        color="secondary" 
        onClick={() => navigate('/gerenciar-eventos')}
        style={{ marginTop: '10px', marginLeft: '10px' }}
      >
        Gerenciar Eventos
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

export default PerfilAdm;
