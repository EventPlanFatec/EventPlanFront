import React, { useState } from 'react';
import { TextField, Button, IconButton, InputAdornment, Radio, RadioGroup, FormControlLabel, FormLabel } from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { userAuthentication } from '../../hooks/userAuthentication';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Register.module.css';
import { db } from '../../firebase/config'; // Importe a configuração do Firebase
import { collection, doc, setDoc } from 'firebase/firestore';

const Register = () => {
  const [idType, setIdType] = useState('cpf'); // CPF ou CNPJ
  const [userType, setUserType] = useState(''); // usuário ou administrador
  const [idValue, setIdValue] = useState('');
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

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateCPF = (cpf) => /^\d{11}$/.test(cpf);
  const validateCNPJ = (cnpj) => /^\d{14}$/.test(cnpj);

  const handleIdValidation = () => {
    if (idType === 'cpf' && !validateCPF(idValue)) {
      toast.error('CPF inválido. Insira 11 dígitos.');
      return false;
    }
    if (idType === 'cnpj' && !validateCNPJ(idValue)) {
      toast.error('CNPJ inválido. Insira 14 dígitos.');
      return false;
    }
    return true;
  };

  const createUserInFirestore = async (user) => {
    try {
      if (idType === 'cpf') {
        if (userType === 'usuario') {
          // Criar o usuário na coleção 'usuarios' (usuário final)
          const userRef = doc(collection(db, 'usuarios'), idValue); // Usa o idValue (CPF) como o ID do documento
          await setDoc(userRef, {
            ...user,
            createdAt: new Date(),
          });
        } else if (userType === 'administrador') {
          // Criar o usuário na coleção 'usuariosadm' (usuário administrador)
          const adminRef = doc(collection(db, 'usuariosadm'), idValue); // Usa o idValue (CPF) como o ID do documento
          await setDoc(adminRef, {
            ...user,
            createdAt: new Date(),
          });
        }
      } else if (idType === 'cnpj') {
        // Criar a organização na coleção 'organizacoes'
        const organizationRef = doc(collection(db, 'organizacoes'), idValue); // Usa o idValue (CNPJ) como o ID do documento
        await setDoc(organizationRef, {
          ...user,
          createdAt: new Date(),
        });
      }
      toast.success('Usuário/Organização criado com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar usuário/organização no Firebase.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      toast.error('Email inválido.');
      return;
    }

    if (!handleIdValidation()) {
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('As senhas não conferem.');
      return;
    }

    // Criação do usuário com base no tipo
    const user = {
      idType,
      idValue,
      userType: idType === 'cpf' ? userType : 'organizacao', // Se for CPF, define o tipo de usuário
      email,
      password,
      displayName: fullName,
      phone,
    };

    try {
      await createUser(user); // Este método pode ser ajustado para salvar no Firebase Authentication
      // Agora, cria o documento na coleção apropriada no Firestore
      await createUserInFirestore(user);

      // Redirecionamento baseado no tipo de usuário
      if (idType === 'cpf') {
        if (userType === 'usuario') {
          navigate('/PerfilUsuario'); // Redireciona para o perfil de usuário
        } else if (userType === 'administrador') {
          navigate('/AdminDashboard'); // Redireciona para o painel do administrador
        }
      } else if (idType === 'cnpj') {
        navigate('/OrganizacaoDashboard'); // Redireciona para o painel da organização
      }
    } catch (err) {
      toast.error('Erro ao criar usuário. Tente novamente.');
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <div className={styles.register}>
        <form onSubmit={handleSubmit}>
          <h2 className={styles.title}>Registrar-se</h2>
          <FormLabel component="legend" className={styles.label}>CPF ou CNPJ</FormLabel>
          <RadioGroup
            value={idType}
            onChange={(e) => setIdType(e.target.value)}
            row
            className={styles.radioGroup}
          >
            <FormControlLabel value="cpf" control={<Radio />} label="CPF" />
            <FormControlLabel value="cnpj" control={<Radio />} label="CNPJ" />
          </RadioGroup>
          <TextField
            label={idType === 'cpf' ? 'CPF' : 'CNPJ'}
            variant="outlined"
            required
            value={idValue}
            onChange={(e) => setIdValue(e.target.value)}
            fullWidth
            margin="normal"
          />
          {idType === 'cpf' && (
            <>
              <FormLabel component="legend" className={styles.label}>Tipo de Usuário</FormLabel>
              <RadioGroup
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                row
                className={styles.radioGroup}
              >
                <FormControlLabel value="usuario" control={<Radio />} label="Usuário" />
                <FormControlLabel value="administrador" control={<Radio />} label="Administrador" />
              </RadioGroup>
            </>
          )}
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
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirme a Senha"
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
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
            {loading ? 'Criando...' : 'Cadastrar'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
