import React from 'react';
import styles from "./Profile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PerfilImg from "../../assets/FotoPerfil.jpeg";
import ArraiaGeraldoAzevedoImg from "../../assets/ArraiaGeraldoAzevedo.jpeg";
import DilsinhoImg from "../../assets/Dilsinho.jpeg";
import RebeldeImg from "../../assets/Rebelde.jpeg";
import AndreaBocelliImg from "../../assets/AndreaBocelli.jpeg";
import FerrugemImg from "../../assets/Ferrugem.jpeg";
import RobertaSaImg from "../../assets/RobertaSá.jpeg";
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
import { useTheme } from '../../context/ThemeContext';

const Profile = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme(); 
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
    <main className={`${styles.main} ${darkMode ? styles.dark : styles.light}`}>
      <div className={styles.container}>
        <div className={styles.profile}>
          <img src={PerfilImg} alt="Imagem de Perfil" />
          <span className={styles.username}>{user ? user.displayName : "Usuário"}</span>
        </div>
        <div className={styles.info}>
          <p className={styles.description}>
            O EventPlan é um site de venda de ingressos para diferentes tipos de eventos realizados no Brasil.
          </p>
          <div className={styles.editProfile}>
            <p className={styles.title}>Sobre Usuário</p>
            <FontAwesomeIcon icon="fa-solid fa-pen" className={styles.editIcon} />
          </div>
          <NavLink to="../Profile">
            <div className={styles.eventsButton}>MEUS EVENTOS</div>
          </NavLink>
        </div>

        <div className={styles.recommendations}>
          <h3 className={styles.title}>Recomendações</h3>
          <div className={styles.gallery}>
            <img src={ArraiaGeraldoAzevedoImg} alt="Arraia Geraldo Azevedo" />
            <img src={DilsinhoImg} alt="Dilsinho" />
            <img src={RebeldeImg} alt="Rebelde" />
            <img src={AndreaBocelliImg} alt="Andrea Bocelli" />
            <img src={FerrugemImg} alt="Ferrugem" />
            <img src={RobertaSaImg} alt="Roberta Sá" />
          </div>
          <NavLink to="../Profile">
            <div className={styles.viewMore}>VER MAIS</div>
          </NavLink>
        </div>

        <div className={styles.themeToggle}>
          <button onClick={toggleDarkMode} className={styles.themeButton}>
            {darkMode ? 'Modo Escuro' : 'Modo Claro'}
          </button>
        </div>

        {user ? (
          <button className={styles.logoutButton} onClick={handleLogout}>
            <FontAwesomeIcon icon="fa-solid fa-sign-out" />
            SAIR
          </button>
        ) : (
          <NavLink to="../">
            <div className={styles.backButton}>
              <FontAwesomeIcon icon="fa-solid fa-right-to-bracket" />
              VOLTAR
            </div>
          </NavLink>
        )}
      </div>
    </main>
  );
};

export default Profile;
