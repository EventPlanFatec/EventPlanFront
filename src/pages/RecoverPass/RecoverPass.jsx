import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { Box, Button, TextField, Typography, Container } from '@mui/material';
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
    <Container maxWidth="xs" className={styles.container}>
      <Box className={styles.card} sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5" align="center" sx={{ fontWeight: 600 }}>Recuperação de Senha</Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="E-mail"
            type="email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Enviar e-mail de recuperação
          </Button>
        </form>
        {message && <Typography color="success.main" sx={{ mt: 2 }}>{message}</Typography>}
        {error && <Typography color="error.main" sx={{ mt: 2 }}>{error}</Typography>}
      </Box>
    </Container>
  );
};

export default RecoverPass;
