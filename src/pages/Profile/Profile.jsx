import React, { useState, useRef, useEffect } from 'react';
import styles from './Profile.module.css';
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
import { useTheme } from '../../context/ThemeContext';
import { usePreferences } from '../../context/PreferencesContext';

const Profile = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const { preferences, updatePreferences } = usePreferences();
  const navigate = useNavigate();
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const settingsMenuRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error.message);
    }
  };

  const toggleSettingsMenu = () => {
    setSettingsMenuOpen(!settingsMenuOpen);
  };

  const handleClickOutside = (event) => {
    if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target)) {
      setSettingsMenuOpen(false);
    }
  };

  useEffect(() => {
    if (settingsMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [settingsMenuOpen]);

  const handlePreferencesEdit = () => {
    navigate('/preferences');
  };

  useEffect(() => {
    if (preferences) {
      updatePreferences(preferences);
    }
  }, [preferences, updatePreferences]);

  return (
    <main className={`${styles.main} ${darkMode ? styles.dark : styles.light}`}>
      <div className={styles.container}>
        <div className={styles.profile}>
          <img src={PerfilImg} alt="Imagem de Perfil" />
          <span className={styles.username}>{user ? user.displayName : 'Usuário'}</span>
        </div>

        <div className={styles.info}>
          <p className={styles.description}>
            O EventPlan é um site de venda de ingressos para diferentes tipos de eventos realizados no Brasil. É possível comprar entradas para shows de artistas nacionais e internacionais, festivais de música, eventos esportivos, entre outros.
          </p>

          <div className={styles.settingsSection}>
            <button onClick={toggleSettingsMenu} className={`${styles.settingsButton} ${styles.eventsButton}`}>
              <FontAwesomeIcon icon="fa-solid fa-cogs" /> CONFIGURAÇÕES
            </button>

            {settingsMenuOpen && (
              <div ref={settingsMenuRef} className={`${styles.settingsMenu} ${darkMode ? styles.dark : styles.light}`}>
                <div className={styles.settingsContent}>
                  <h3 className={styles.settingsTitle}>Configurações de Conta</h3>
                  <ul>
                    <li onClick={toggleDarkMode} className={`${styles.themeOption} ${darkMode ? styles.darkOption : styles.lightOption}`}>
                      {darkMode ? 'Tema: Escuro' : 'Tema: Claro'}
                    </li>
                    <li onClick={handlePreferencesEdit} className={styles.preferenceOption}>Preferências de Eventos</li>
                  </ul>
                  <button onClick={() => setSettingsMenuOpen(false)} className={styles.closeButton}>
                    <FontAwesomeIcon icon="fa-solid fa-xmark" /> FECHAR
                  </button>
                </div>
              </div>
            )}
          </div>

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
