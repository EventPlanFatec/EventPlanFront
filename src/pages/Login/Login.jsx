import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import styles from './Login.module.css';
import { userAuthentication } from '../../hooks/userAuthentication';

const registeredEmails = ['test@example.com', 'user@domain.com'];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, googleSignIn, facebookSignIn } = userAuthentication();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/home');
    } catch (err) {
      console.error('Erro ao fazer login', err);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      let user;
      if (provider === 'Google') {
        user = await googleSignIn();
      } else if (provider === 'Facebook') {
        user = await facebookSignIn();
      }

      if (user && registeredEmails.includes(user.email)) {
        navigate('/home');
      } else {
        console.error('Conta não encontrada. Por favor, registre-se.');
      }
    } catch (err) {
      console.error(`Erro ao fazer login com ${provider}`, err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.login}>
        <h2 className={styles.title}>Entrar</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Senha"
            type="password"
            variant="outlined"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" fullWidth>
            ENTRAR
          </Button>
          <div className={styles.socialLogin}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleSocialLogin('Google')}
              fullWidth
              startIcon={<GoogleIcon />}
              style={{ marginBottom: '5px' }}
            >
              Entrar com Google
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleSocialLogin('Facebook')}
              fullWidth
              startIcon={<FacebookIcon />}
              style={{ marginBottom: '10px' }}
            >
              Entrar com Facebook
            </Button>
          </div>
          <NavLink to="../Register">
            <Button variant="contained" fullWidth style={{ marginTop: '10px', backgroundColor: '#2e7d32' }}>
              REGISTRAR-SE
            </Button>
          </NavLink>
        </form>
      </div>
    </div>
  );
};

export default Login;
