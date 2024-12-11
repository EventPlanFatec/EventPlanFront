import React, { useEffect, useState } from 'react';
import { Button, Typography, TextField, MenuItem, Select, InputLabel, FormControl, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import axios from 'axios';
import styles from './PerfilOrganizacao.module.css';

const PerfilOrganizacao = () => {
  const navigate = useNavigate();  // Inicializa o hook de navegação
  const [cnpj, setCnpj] = useState(null);
  const [uid, setUid] = useState(null);
  const [nome, setNome] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [cep, setCep] = useState('');
  const [tipoLogradouro, setTipoLogradouro] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numeroPredial, setNumeroPredial] = useState('');
  const [estados, setEstados] = useState(['SP', 'RJ', 'MG', 'RS', 'BA']);  // Lista de estados fictícia
  const [cidades, setCidades] = useState([]);  // Lista de cidades por estado
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const db = getFirestore();

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userUid = user.uid;
      setUid(userUid);
      fetchOrganizationData(userUid);
    } else {
      navigate('/login');
    }

    // Carregar lista de estados fictícia (já definida estática)
  }, [navigate]);

  const fetchOrganizationData = async (userUid) => {
    const orgDocRef = doc(db, 'organizacao', userUid);
    const docSnap = await getDoc(orgDocRef);

    if (docSnap.exists()) {
      const orgData = docSnap.data();
      setCnpj(orgData.cnpj);
      setNome(orgData.nome);
      setEstado(orgData.estado);  // Recebe o estado do Firestore
      setCidade(orgData.cidade);  // Recebe a cidade do Firestore
      setCep(orgData.cep);
      setTipoLogradouro(orgData.tipoLogradouro);
      setLogradouro(orgData.logradouro);
      setNumeroPredial(orgData.numeroPredial);

      // Caso o estado seja alterado pelo Firestore, carregar as cidades correspondentes
      handleEstadoChange({ target: { value: orgData.estado } });
    } else {
      showSnackbar("Nenhuma organização encontrada para o usuário.", 'error');
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const handleCepChange = async (e) => {
    const cepValue = e.target.value;
    setCep(cepValue);

    if (cepValue.length === 8) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cepValue}/json/`);
        const data = response.data;

        if (data.erro) {
          showSnackbar("CEP inválido", 'error');
        } else {
          setTipoLogradouro(data.tipoLogradouro || '');
          setLogradouro(data.logradouro || '');
          setCidade(data.localidade || '');
          setEstado(data.uf || '');
        }
      } catch (error) {
        console.error("Erro ao buscar dados do CEP:", error);
        showSnackbar("Erro ao buscar dados do CEP", 'error');
      }
    }
  };

  const handleEstadoChange = async (e) => {
    const estadoSelecionado = e.target.value;
    setEstado(estadoSelecionado);

    // Carregar cidades fictícias dependendo do estado
    const cidadesPorEstado = {
      SP: ['São Paulo', 'Campinas', 'Santos'],
      RJ: ['Rio de Janeiro', 'Niterói', 'Campos'],
      MG: ['Belo Horizonte', 'Juiz de Fora', 'Uberlândia'],
      RS: ['Porto Alegre', 'Caxias do Sul', 'Pelotas'],
      BA: ['Salvador', 'Feira de Santana', 'Vitória da Conquista'],
    };
    setCidades(cidadesPorEstado[estadoSelecionado] || []);
  };

  const handleSave = async () => {
    if (!nome || !estado || !cidade || !cep || !tipoLogradouro || !logradouro || !numeroPredial) {
      showSnackbar("Por favor, preencha todos os campos obrigatórios.", 'error');
      return;
    }

    const orgDocRef = doc(db, 'organizacao', uid);
    try {
      await updateDoc(orgDocRef, {
        nome,
        estado,
        cidade,
        cep,
        tipoLogradouro,
        logradouro,
        numeroPredial
      });
      showSnackbar("Dados atualizados com sucesso!", 'success');
    } catch (error) {
      showSnackbar("Erro ao salvar dados.", 'error');
      console.error("Erro ao atualizar dados da organização:", error);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleAnnounce = () => {
    // Redireciona para a página de upload de anúncio
    navigate('/upload-anuncio');
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Bem-vindo ao Perfil da Organização
      </Typography>
      <Typography variant="body1" paragraph>
        Como responsável pela organização, você pode gerenciar seus eventos, visualizar inscrições e interagir com os usuários.
      </Typography>

      {cnpj && (
        <Typography variant="body1" paragraph>
          CNPJ da organização: {cnpj}
        </Typography>
      )}

      {uid && (
        <Typography variant="body5" paragraph className={styles.typographyBody5}>
          UID do usuário logado: {uid}
        </Typography>
      )}

      <TextField
        label="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        fullWidth
        style={{ marginTop: '10px' }}
      />
      
      <FormControl fullWidth style={{ marginTop: '10px' }}>
        <InputLabel>Estado</InputLabel>
        <Select
          value={estado}
          onChange={handleEstadoChange}
          fullWidth
        >
          {estados.map((estado) => (
            <MenuItem key={estado} value={estado}>
              {estado}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth style={{ marginTop: '10px' }}>
        <InputLabel>Cidade</InputLabel>
        <Select
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
          fullWidth
        >
          {cidades.map((cidade) => (
            <MenuItem key={cidade} value={cidade}>
              {cidade}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="CEP"
        value={cep}
        onChange={handleCepChange}
        fullWidth
        style={{ marginTop: '10px' }}
      />
      
      <TextField
        label="Tipo de Logradouro"
        value={tipoLogradouro}
        onChange={(e) => setTipoLogradouro(e.target.value)}
        fullWidth
        style={{ marginTop: '10px' }}
      />
      
      <TextField
        label="Logradouro"
        value={logradouro}
        onChange={(e) => setLogradouro(e.target.value)}
        fullWidth
        style={{ marginTop: '10px' }}
      />
      
      <TextField
        label="Número Predial"
        value={numeroPredial}
        onChange={(e) => setNumeroPredial(e.target.value)}
        fullWidth
        style={{ marginTop: '10px' }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        style={{ marginTop: '20px' }}
      >
        Salvar Alterações
      </Button>

      <Button 
        variant="outlined" 
        color="error" 
        onClick={handleLogout} 
        style={{ marginTop: '20px', marginLeft: '10px' }}
      >
        Logout
      </Button>

      <Button 
        variant="contained" 
        color="secondary" 
        onClick={handleAnnounce} 
        style={{ marginTop: '20px', marginLeft: '10px' }}
      >
        Anunciar no site
      </Button>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PerfilOrganizacao;
