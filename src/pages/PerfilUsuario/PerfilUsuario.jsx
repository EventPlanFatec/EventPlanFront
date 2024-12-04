import React, { useState, useEffect } from 'react';
import { TextField, Button, IconButton, InputAdornment } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { getAuth, updateProfile } from 'firebase/auth';
import { db } from '../../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './PerfilUsuario.module.css';

const PerfilUsuario = () => {
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      setUserData({
        fullName: user.displayName || '',
        email: user.email || '',
        phone: '', // Pode ser adicionado caso o telefone esteja no Firestore
      });
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSave = async () => {
    setError('');
    if (!user) {
      toast.error('Usuário não encontrado.');
      return;
    }

    try {
      // Atualizar o nome completo no Firebase Authentication
      if (userData.fullName !== user.displayName) {
        await updateProfile(user, {
          displayName: userData.fullName,
        });
      }

      // Atualizar o telefone no Firestore (caso esteja implementado)
      const userRef = doc(db, 'usuarios', user.uid);
      await updateDoc(userRef, {
        phone: userData.phone,
      });

      // Atualizar a senha (se for fornecida)
      if (password) {
        await user.updatePassword(password);
      }

      toast.success('Perfil atualizado com sucesso!');
    } catch (err) {
      setError(err.message);
      toast.error('Erro ao atualizar perfil.');
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <div className={styles.profile}>
        <h2 className={styles.title}>Perfil de Usuário</h2>
        <TextField
          label="Nome Completo"
          variant="outlined"
          value={userData.fullName}
          onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="E-mail"
          variant="outlined"
          value={userData.email}
          disabled
          fullWidth
          margin="normal"
        />
        <TextField
          label="Telefone"
          variant="outlined"
          value={userData.phone}
          onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Nova Senha"
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {error && <div className={styles.error}>{error}</div>}
        <Button variant="contained" color="primary" onClick={handleSave} fullWidth>
          Salvar
        </Button>
      </div>
    </div>
  );
};

export default PerfilUsuario;
