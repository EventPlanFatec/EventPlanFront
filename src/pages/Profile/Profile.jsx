import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Button, Typography, Box, Grid, Card, CardMedia } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../../context/AuthContext'; 
import PerfilImg from "../../assets/FotoPerfil.jpeg";
import ArraiaGeraldoAzevedoImg from "../../assets/ArraiaGeraldoAzevedo.jpeg";
import DilsinhoImg from "../../assets/Dilsinho.jpeg";
import RebeldeImg from "../../assets/Rebelde.jpeg";
import AndreaBocelliImg from "../../assets/AndreaBocelli.jpeg";
import FerrugemImg from "../../assets/Ferrugem.jpeg";
import RobertaSaImg from "../../assets/RobertaSá.jpeg";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error.message);
    }
  };

  return (
    <Box padding={3}>
      <Box display="flex" alignItems="center" mb={2}>
        <img
          src={PerfilImg}
          alt="Imagem de Perfil"
          style={{ borderRadius: '50%', width: '80px', height: '80px', marginRight: '16px' }}
        />
        <Typography variant="h5">{user ? user.displayName : "Usuário"}</Typography>
      </Box>
      <Typography variant="body1" paragraph>
        O EventPlan é um site de venda de ingressos para diferentes tipos de eventos realizados no Brasil. É possível comprar entradas para shows de artistas nacionais e internacionais, festivais de música, eventos esportivos, além de cinema, museu, apresentações de teatro, entre outros.
      </Typography>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Sobre Usuário</Typography>
        <FontAwesomeIcon icon="fa-solid fa-pen" />
      </Box>
      <NavLink to="../Profile">
        <Button variant="outlined" color="primary">
          MEUS EVENTOS
        </Button>
      </NavLink>

      <Box mt={4}>
        <Typography variant="h6">Recomendações</Typography>
        <Grid container spacing={2}>
          {[ArraiaGeraldoAzevedoImg, DilsinhoImg, RebeldeImg, AndreaBocelliImg, FerrugemImg, RobertaSaImg].map((img, index) => (
            <Grid item xs={6} sm={4} md={2} key={index}>
              <Card>
                <CardMedia component="img" height="140" image={img} alt="Recomendação" />
              </Card>
            </Grid>
          ))}
        </Grid>
        <NavLink to="../Profile">
          <Button variant="text" color="primary" sx={{ mt: 2 }}>
            VER MAIS
          </Button>
        </NavLink>
      </Box>

      <Box mt={4}>
        {user ? (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
            startIcon={<FontAwesomeIcon icon="fa-solid fa-sign-out" />}
          >
            SAIR
          </Button>
        ) : (
          <NavLink to="../Home">
            <Button
              variant="outlined"
              color="primary"
              startIcon={<FontAwesomeIcon icon="fa-solid fa-right-to-bracket" />}
            >
              VOLTAR
            </Button>
          </NavLink>
        )}
      </Box>
    </Box>
  );
};

export default Profile;
