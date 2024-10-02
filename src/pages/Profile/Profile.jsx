import React from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PerfilImg from '../../assets/FotoPerfil.jpeg';
import ArraiaGeraldoAzevedoImg from '../../assets/ArraiaGeraldoAzevedo.jpeg';
import DilsinhoImg from '../../assets/Dilsinho.jpeg';
import RebeldeImg from '../../assets/Rebelde.jpeg';
import AndreaBocelliImg from '../../assets/AndreaBocelli.jpeg';
import FerrugemImg from '../../assets/Ferrugem.jpeg';
import RobertaSaImg from '../../assets/RobertaSá.jpeg';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Profile.module.css';

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
    <Box className={styles.container}>
      <Box className={styles.profile}>
        <img src={PerfilImg} alt="Imagem de Perfil" className={styles.profileImage} />
        <Typography variant="h5" className={styles.username}>
          {user ? user.displayName : "Usuário"}
        </Typography>
      </Box>
      <Box className={styles.content}>
        <Typography variant="body1" className={styles.description}>
          O EventPlan é um site de venda de ingressos para diferentes tipos de eventos realizados no Brasil. É possível comprar entradas para shows de artistas nacionais e internacionais, festivais de música, eventos esportivos, além de cinema, museu, apresentações de teatro, entre outros.
        </Typography>
        <Box className={styles.aboutUser}>
          <Typography variant="h6">Sobre Usuário</Typography>
          <FontAwesomeIcon icon="fa-solid fa-pen" className={styles.editIcon} />
        </Box>
        <NavLink to="../Profile">
          <Button variant="contained" color="primary" className={styles.eventsButton}>
            MEUS EVENTOS
          </Button>
        </NavLink>
      </Box>

      <Box className={styles.recommendations}>
        <Typography variant="h6" className={styles.recommendationsTitle}>Recomendações</Typography>
        <Grid container spacing={2} className={styles.galleryContainer}>
          {[ArraiaGeraldoAzevedoImg, DilsinhoImg, RebeldeImg, AndreaBocelliImg, FerrugemImg, RobertaSaImg].map((img, index) => (
            <Grid item xs={4} key={index}>
              <img src={img} alt={`Recomendação ${index + 1}`} className={styles.recommendationImage} />
            </Grid>
          ))}
        </Grid>
        <NavLink to="../Profile">
          <Button variant="outlined" className={styles.moreButton}>
            VER MAIS
          </Button>
        </NavLink>
      </Box>

      {user ? (
        <Button variant="outlined" color="error" className={styles.logoutButton} onClick={handleLogout}>
          <FontAwesomeIcon icon="fa-solid fa-sign-out" className={styles.logoutIcon} />
          SAIR
        </Button>
      ) : (
        <NavLink to="../Home">
          <Button variant="outlined" className={styles.backButton}>
            <FontAwesomeIcon icon="fa-solid fa-right-to-bracket" className={styles.backIcon} />
            VOLTAR
          </Button>
        </NavLink>
      )}
    </Box>
  );
};

export default Profile;
