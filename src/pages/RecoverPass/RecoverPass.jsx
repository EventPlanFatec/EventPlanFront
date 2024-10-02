import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
import styles from './RecoverPass.module.css';

const RecoverPass = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Um e-mail de recuperação foi enviado.');
      setError('');
    } catch (error) {
      setError('Erro ao enviar e-mail de recuperação: ' + error.message);
      setMessage('');
    }
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.card}>
        <Typography variant="h4" align="center" gutterBottom>
          Recuperação de Senha
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="E-mail"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Enviar e-mail de recuperação
          </Button>
        </form>
        {message && <Alert severity="success" className={styles.alert}>{message}</Alert>}
        {error && <Alert severity="error" className={styles.alert}>{error}</Alert>}
      </Box>
      <NavLink to="../Login" className={styles.link}>
        <FontAwesomeIcon icon="fa-solid fa-right-to-bracket" className={styles.icon} />
        VOLTAR
      </NavLink>
    </Box>
  );
};

export default RecoverPass;
