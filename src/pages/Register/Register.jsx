import React, { useState } from 'react';
import { TextField, Button, IconButton, InputAdornment } from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { userAuthentication } from '../../hooks/userAuthentication';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Register.module.css';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { createUser, error: authError, loading } = userAuthentication();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      toast.error('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não conferem');
      toast.error('As senhas não conferem');
      return;
    }

    const user = { email, password, displayName: fullName };

    try {
      await createUser(user);
      toast.success('Usuário criado com sucesso!');
      navigate('/Home'); // Redireciona após o registro
    } catch (err) {
      setError(err.message || 'Erro ao criar usuário');
      toast.error(err.message || 'Erro ao criar usuário');
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className={styles.container}>
      <ToastContainer />
      <div className={styles.register}>
        <form onSubmit={handleSubmit}>
          <h2 className={styles.title}>Registrar-se</h2>
          <TextField
            label="Nome Completo"
            variant="outlined"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            fullWidth
            margin="normal"
            aria-label="Nome completo"
          />
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            aria-label="Email"
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
            aria-label="Senha"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility}>
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} style={{ color: '#6b6b6b' }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirme"
            type={showConfirmPassword ? 'text' : 'password'}
            variant="outlined"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            margin="normal"
            aria-label="Confirmar senha"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleConfirmPasswordVisibility}>
                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} style={{ color: '#6b6b6b' }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained" color="success" fullWidth disabled={loading}>
            {loading ? 'Carregando...' : 'REGISTRAR-SE'}
          </Button>
          {error && <p className={styles.error}>{error}</p>}
          {authError && <p className={styles.error}>{authError}</p>}
          <p className={styles.accountPrompt}>
            Tem uma conta? <span className={styles.loginLink} onClick={() => navigate('/Login')}>Conecte-se</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
