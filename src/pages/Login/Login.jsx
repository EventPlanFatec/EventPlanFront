import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
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
