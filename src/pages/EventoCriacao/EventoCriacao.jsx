import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, MenuItem, Select, InputLabel, FormControl, CircularProgress, Input } from '@mui/material';
import { db, storage } from '../../firebase/config';
import { collection, addDoc, getDocs, orderBy, query, limit, doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, listAll } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import styles from '../EventoCriacao/EventoCriacao.module.css';

const EventoCriacao = () => {
  const navigate = useNavigate();
  const [evento, setEvento] = useState({
    nome: '',
    tipo: '',
    genero: '',
    estado: '',
    cidade: '',
    tipoDeLogradouro: '',
    local: '',
    numeroPredial: '',
    completo: '',
    lotacaoMaxima: '',
    data: '',
    dataFim: '',
    horarioInicio: '',
    horarioFim: '',
    descricao: '',
    userUID: '',
    cnpjOrganizacao: '',
    eventoId: '',
    img: '',
    imgBanner: ''
  });

  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [imgBanner, setImgBanner] = useState(null); // Estado para o banner


  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvento({ ...evento, [name]: value });
  };

  

  const handleBannerUpload = async () => {
    if (!imgBanner) return;
  
    const storageRef = ref(storage, `eventos/banner_${imgBanner.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imgBanner);
  
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          console.error('Erro no upload da imagem do banner: ', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setEvento((prev) => ({ ...prev, imgBanner: downloadURL }));
            resolve(downloadURL);
          } catch (error) {
            console.error('Erro ao obter a URL do banner: ', error);
            reject(error);
          }
        }
      );
    });
  };
  

  const handleBannerChange = (e) => {
    if (e.target.files[0]) {
      setImgBanner(e.target.files[0]);
    }
  };
  

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleImageUpload = async () => {
    if (!image) return;

    const storageRef = ref(storage, `eventos/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          console.error('Erro no upload da imagem: ', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setEvento((prev) => ({ ...prev, img: downloadURL }));
            resolve(downloadURL);
          } catch (error) {
            console.error('Erro ao obter a URL da imagem: ', error);
            reject(error);
          }
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = getAuth().currentUser;
    if (!user) {
      console.error('Usuário não autenticado.');
      return;
    }
    const userUID = user.uid;

    try {
      const orgRef = doc(db, 'organizacao', userUID);
      const orgDoc = await getDoc(orgRef);

      if (orgDoc.exists()) {
        const cnpjOrganizacao = orgDoc.data().cnpj;

        const eventosRef = collection(db, 'Eventos');
        const eventosQuery = query(eventosRef, orderBy('eventoId', 'desc'), limit(1));
        const querySnapshot = await getDocs(eventosQuery);

        let ultimoEventoId = 0;
        if (!querySnapshot.empty) {
          const ultimoEvento = querySnapshot.docs[0].data();
          ultimoEventoId = parseInt(ultimoEvento.eventoId) || 0;
        }

        const novoEventoId = ultimoEventoId + 1;

        if (image) {
          await handleImageUpload();
        }

        const eventoComDadosAdicionais = {
          ...evento,
          userUID,
          cnpjOrganizacao,
          eventoId: novoEventoId.toString()
        };

        const documentName = cnpjOrganizacao + novoEventoId;

        await setDoc(doc(db, 'Eventos', documentName), eventoComDadosAdicionais);

        console.log('Evento criado com ID: ', documentName);

        navigate('/manage-events');
      } else {
        console.error('Organização não encontrada para o UID fornecido.');
      }
    } catch (e) {
      console.error('Erro ao criar o evento: ', e);
    }
  };

  return (
    <Box sx={{ width: '50%', maxWidth: 2000, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center" className={styles.criarEventoButton}>
        Criar Evento
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Nome do Evento"
          name="nome"
          value={evento.nome}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Tipo</InputLabel>
          <Select
            name="tipo"
            value={evento.tipo}
            onChange={handleChange}
            required
          >
            <MenuItem value="Musica">Música</MenuItem>
            <MenuItem value="Festa">Festa</MenuItem>
            <MenuItem value="Teatro">Teatro</MenuItem>
            <MenuItem value="Esporte">Esporte</MenuItem>
            <MenuItem value="Literatura">Literatura</MenuItem>
            <MenuItem value="Religioso">Religioso</MenuItem>
            <MenuItem value="+18">+18</MenuItem>
            <MenuItem value="Outros">Outros</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Gênero"
          name="genero"
          value={evento.genero}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />

        {/* Outros campos do formulário */}
        <TextField
          label="Logradouro"
          name="local"
          value={evento.local}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        
        <TextField
          label="Número Predial"
          name="numeroPredial"
          value={evento.numeroPredial}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />

        <TextField
          label="Complemento"
          name="completo"
          value={evento.completo}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Lotação Máxima"
          name="lotacaoMaxima"
          value={evento.lotacaoMaxima}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          type="number"
        />

        <TextField
          label="Data de Início"
          name="data"
          type="date"
          value={evento.data}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
        />
        
        <TextField
          label="Data de Fim"
          name="dataFim"
          type="date"
          value={evento.dataFim}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
        />

        <TextField
          label="Horário de Início"
          name="horarioInicio"
          type="time"
          value={evento.horarioInicio}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />

        <TextField
          label="Horário de Fim"
          name="horarioFim"
          type="time"
          value={evento.horarioFim}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />

        <TextField
          label="Descrição"
          name="descricao"
          value={evento.descricao}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          multiline
          rows={4}
        />



        <Box>
          <Typography variant="h6">Upload de Imagem</Typography>
          <Input type="file" onChange={handleImageChange} />
          <Button
            variant="contained"
            color="primary"
            onClick={handleImageUpload}
            disabled={!image}
          >
            Upload
          </Button>
          {progress > 0 && (
            <Box>
              <CircularProgress variant="determinate" value={progress} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {`${Math.round(progress)}%`}
              </Typography>
            </Box>
          )}
        </Box>
        <Box>
  <Typography variant="h6">Upload de Banner</Typography>
  <Input type="file" onChange={handleBannerChange} />
  <Button
    variant="contained"
    color="primary"
    onClick={handleBannerUpload}
    disabled={!imgBanner}
  >
    Upload Banner
  </Button>
  {progress > 0 && (
    <Box>
      <CircularProgress variant="determinate" value={progress} />
      <Typography variant="body2" sx={{ mt: 1 }}>
        {`${Math.round(progress)}%`}
      </Typography>
    </Box>
  )}
</Box>


        <Button variant="contained" type="submit" className={styles.salvarEventoButton2}>
          Salvar Evento
        </Button>
      </form>
    </Box>
  );
};

export default EventoCriacao;
