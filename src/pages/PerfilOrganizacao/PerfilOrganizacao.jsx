import React, { useEffect, useState } from 'react';
import { Button, Typography, TextField, MenuItem, Select, InputLabel, FormControl, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import axios from 'axios';

const PerfilOrganizacao = () => {
  const navigate = useNavigate();
  const [cnpj, setCnpj] = useState(null);
  const [uid, setUid] = useState(null);
  const [nome, setNome] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [cep, setCep] = useState('');
  const [tipoLogradouro, setTipoLogradouro] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numeroPredial, setNumeroPredial] = useState('');
  const [estados, setEstados] = useState([]);  // Lista de estados
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

    // Carregar lista de estados brasileiros
    fetchEstados();
  }, [navigate]);

  const fetchEstados = async () => {
    try {
      const response = await axios.get('https://servicodados.ibge.gov.br/api/v2/censos/nomes/estados');
      const estadosData = response.data;
      setEstados(estadosData.map((estado) => estado.sigla));  // Filtra e organiza as siglas dos estados
    } catch (error) {
      showSnackbar("Erro ao carregar estados", 'error');
      console.error("Erro ao carregar estados:", error);
    }
  };

  const fetchCidades = async (estadoSigla) => {
    try {
      const response = await axios.get(`https://servicodados.ibge.gov.br/api/v2/localidades/estados/${estadoSigla}/municipios`);
      const cidadesData = response.data;
      setCidades(cidadesData.map((cidade) => cidade.nome));  // Filtra e organiza os nomes das cidades
    } catch (error) {
      showSnackbar("Erro ao carregar cidades", 'error');
      console.error("Erro ao carregar cidades:", error);
    }
  };

  const fetchOrganizationData = async (userUid) => {
    const orgDocRef = doc(db, 'organizacao', userUid);
    const docSnap = await getDoc(orgDocRef);

    if (docSnap.exists()) {
      const orgData = docSnap.data();
      setCnpj(orgData.cnpj);
      setNome(orgData.nome);
      setEstado(orgData.estado);
      setCidade(orgData.cidade);
      setCep(orgData.cep);
      setTipoLogradouro(orgData.tipoLogradouro);
      setLogradouro(orgData.logradouro);
      setNumeroPredial(orgData.numeroPredial);
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

    // Carrega as cidades do estado selecionado
    const siglaEstado = estados.find((estado) => estado === estadoSelecionado);
    if (siglaEstado) {
      fetchCidades(siglaEstado);
    }
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
        <Typography variant="body1" paragraph>
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
        Sair
      </Button>

      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert 
          severity={snackbarSeverity} 
          onClose={() => setOpenSnackbar(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PerfilOrganizacao;
