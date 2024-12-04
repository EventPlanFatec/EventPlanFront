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
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { createUser, error: authError, loading } = userAuthentication();
  const navigate = useNavigate();

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
      navigate('/Home');
    } catch (err) {
      setError('Erro ao criar usuário. Tente novamente.');
      toast.error('Erro ao criar usuário. Tente novamente.');
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
          />
          <TextField
            label="E-mail"
            type="email"
            variant="outlined"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Telefone"
            type="tel"
            variant="outlined"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            margin="normal"
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
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility}>
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
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
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleConfirmPasswordVisibility}>
                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <p className={styles.terms}>
            Ao se cadastrar, você concorda com nossos <span className={styles.termsLink}>Termos, Política de Privacidade e Política de Cookies.</span>
          </p>
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
