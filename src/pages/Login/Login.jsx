import React, { useState, useEffect } from 'react';
import { TextField, Button, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { NavLink } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { userAuthentication } from '../../hooks/userAuthentication';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login, googleSignIn, facebookSignIn, error: authError, loading } = userAuthentication();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Email inválido');
      toast.error('Email inválido');
      return;
    }

    const user = { email, password };

    try {
      const res = await login(user);
      if (res) {
        toast.success('Login realizado com sucesso!');
      }
    } catch (err) {
      setError('Erro ao fazer login. Por favor, tente novamente.');
      toast.error('Erro ao fazer login. Por favor, tente novamente.');
    }
  };

  const handleSocialSignIn = async (signInMethod) => {
    try {
      const user = await signInMethod();
      if (user) {
        toast.success(`Login com ${signInMethod.name} realizado com sucesso!`);
      }
    } catch {
      toast.error(`Erro ao fazer login com ${signInMethod.name}.`);
    }
  };

  useEffect(() => {
    if (authError) {
      setError('Erro de autenticação. Tente novamente.');
      toast.error('Erro de autenticação. Tente novamente.');
    }
  }, [authError]);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <div className={styles.login}>
        <h2 className={styles.title}>Entrar</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            label="E-mail"
            variant="outlined"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            aria-label='Campo de email'
          />
          <TextField
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            aria-label='Campo de senha'
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <NavLink to="../recoverpass" className={styles.terms}>
            <span>Esqueceu a senha?</span>
          </NavLink>
          <Button type="submit" variant="contained" fullWidth disabled={loading} style={{ marginTop: '10px', backgroundColor: '#1976d2' }}>
            {loading ? 'Carregando...' : 'ENTRAR'}
          </Button>
          <div className={styles.socialLogin}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleSocialSignIn(googleSignIn)}
              fullWidth
              startIcon={<GoogleIcon />}
              style={{ marginBottom: '5px' }}
            >
              Entrar com Google
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleSocialSignIn(facebookSignIn)}
              fullWidth
              startIcon={<FacebookIcon />}
              style={{ marginBottom: '10px' }}
            >
              Entrar com Facebook
            </Button>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.socialLogin}>
            <p className={styles.ou}>OU</p>
          </div>
          <NavLink to="../Register">
            <Button variant="contained" fullWidth style={{ marginTop: '10px', backgroundColor: '#2e7d32' }}>REGISTRAR-SE</Button>
          </NavLink>
        </form>
      </div>
    </div>
  );
};

export default Login;
