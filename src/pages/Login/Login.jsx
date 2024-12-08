import { useState, useEffect } from 'react';
import { TextField, Button, IconButton, InputAdornment, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { userAuthentication } from '../../hooks/userAuthentication';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login, googleSignIn, facebookSignIn, error: authError, loading } = userAuthentication();
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

    if (!userType) {
      setError('Selecione o tipo de usuário');
      toast.error('Selecione o tipo de usuário');
      return;
    }

    const user = { email, password, userType };

    try {
      const res = await login(user);

      if (res) {
        if (userType === 'organizacao') {
          navigate('/manage-events');
        } else if (userType === 'usuarioAdm') {
          navigate('/PerfilAdm');
        } else if (userType === 'usuarioFinal') {
          navigate('/eventlist');
        } else {
          navigate('/eventlist');
        }
        toast.success('Login realizado com sucesso!');
      }
    } catch (err) {
      setError('Erro ao fazer login. Por favor, tente novamente.');
      toast.error('Erro ao fazer login. Por favor, tente novamente.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    if (authError) {
      setError('Erro de autenticação. Tente novamente.');
      toast.error('Erro de autenticação. Tente novamente.');
    }
  }, [authError]);

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
            aria-label="Campo de email"
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
            aria-label="Campo de senha"
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

          <FormControl fullWidth margin="normal">
            <InputLabel id="user-type-label">Tipo de Usuário</InputLabel>
            <Select
              labelId="user-type-label"
              id="userType"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              label="Tipo de Usuário"
              required
            >
              <MenuItem value="organizacao">Organização</MenuItem>
              <MenuItem value="usuarioAdm">Administrador</MenuItem>
              <MenuItem value="usuarioFinal">Usuario Final</MenuItem>
            </Select>
          </FormControl>

          {error && <p className={styles.error}>{error}</p>}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            style={{ marginTop: '10px', backgroundColor: '#1976d2' }}
          >
            {loading ? 'Carregando...' : 'ENTRAR'}
          </Button>

          <NavLink to="../recoverpass" className={styles.terms}>
            <span>Esqueceu a senha?</span>
          </NavLink>
        </form>

        <Button
          variant="outlined"
          fullWidth
          style={{ marginTop: '20px', borderColor: '#1976d2', color: '#1976d2' }}
          onClick={() => navigate('/register')} // Redireciona para a página de registro
        >
          REGISTRAR
        </Button>
      </div>
    </div>
  );
};

export default Login;
