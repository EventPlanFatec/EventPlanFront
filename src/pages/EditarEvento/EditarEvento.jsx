import React, { useEffect, useState } from "react";
import { db, storage } from "../../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { 
  Button, 
  TextField, 
  Box, 
  Typography, 
  Snackbar, 
  Alert, 
  Input, 
  CircularProgress 
} from "@mui/material"; 
import { useNavigate, useParams } from "react-router-dom";
import styles from "./EditarEvento.module.css";

const EditarEvento = () => {
  const [evento, setEvento] = useState({
    nome: "",
    cnpjOrganizacao: "",
    dataInicio: "",
    dataFim: "",
    horarioInicio: "",
    horarioFim: "",
    lotacaoMaxima: "",
    tipo: "",
    img: "",
    genero: "",
  });
  const [imagemUpload, setImagemUpload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [progress, setProgress] = useState(0);
  const [img, setImg] = useState(null); 
  const [imgBanner, setImgBanner] = useState(null);
  const [imagemBannerUpload, setImagemBannerUpload] = useState(null); 


  const navigate = useNavigate();
  const { id } = useParams();

  // Função para carregar os dados do evento
  const fetchEvento = async (eventId) => {
    try {
      const eventoRef = doc(db, "Eventos", eventId);
      const docSnap = await getDoc(eventoRef);

      if (docSnap.exists()) {
        setEvento(docSnap.data());
      } else {
        console.error("Evento não encontrado!");
        setSnackbarMessage('Evento não encontrado');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        navigate("/manage-events");
      }
    } catch (error) {
      console.error("Erro ao buscar evento", error);
      setSnackbarMessage('Erro ao carregar evento');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleImageBannerChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setImgBanner(file); // Definir o arquivo de imagem do banner
      setImagemBannerUpload(file);
    }
  };
  

  // Função para lidar com a seleção da imagem
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setImg(file); // Changed from 'setImage' to 'setImg'
      setImagemUpload(file);
    }
  };

  // Função para lidar com o upload da imagem
  const handleImagemUpload = async () => {
    if (!imagemUpload) return null;

    const imagemRef = ref(storage, `eventos/${id}/${imagemUpload.name}`);
    const uploadTask = uploadBytesResumable(imagemRef, imagemUpload);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progressPercentage = 
            Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(progressPercentage);
        },
        (error) => reject(error),
        async () => {
          const img = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(img);
        }
      );
    });
  };

  const handleImagemBannerUpload = async () => {
    if (!imagemBannerUpload) return null;
  
    const imagemRef = ref(storage, `eventos/${id}/banner_${imagemBannerUpload.name}`);
    const uploadTask = uploadBytesResumable(imagemRef, imagemBannerUpload);
  
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progressPercentage = 
            Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(progressPercentage);
        },
        (error) => reject(error),
        async () => {
          const imgBannerURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(imgBannerURL); // Retornar o URL da imagem do banner
        }
      );
    });
  };
  

  // Função para salvar as alterações do evento
  const saveEvento = async () => {
    try {
      let imagemURL = evento.imagem;
      let imgBannerURL = evento.imgBanner; // Adicionando o banner
  
      if (imagemUpload) {
        imagemURL = await handleImagemUpload();
      }
  
      if (imagemBannerUpload) {
        imgBannerURL = await handleImagemBannerUpload(); // Carregar o banner
      }
  
      const eventoRef = doc(db, "Eventos", id);
      await updateDoc(eventoRef, { 
        ...evento, 
        img: imagemURL, 
        imgBanner: imgBannerURL // Atualizar com o novo campo de banner
      });
  
      setSnackbarMessage('Evento atualizado com sucesso!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      navigate("/manage-events");
    } catch (error) {
      console.error("Erro ao atualizar evento", error);
      setSnackbarMessage('Erro ao atualizar evento');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };
  

  useEffect(() => {
    fetchEvento(id); 
  }, [id]); 

  if (loading) {
    return <Typography>Carregando dados do evento...</Typography>;
  }

  return (
    <Box className={styles.container}>
      <Typography className={styles.title} variant="h4" gutterBottom>
        Editar Evento
      </Typography>

      <Box mt={3}>
        <TextField
          label="Nome do Evento"
          fullWidth
          margin="normal"
          value={evento.nome}
          onChange={(e) => setEvento({ ...evento, nome: e.target.value })}
        />
        <TextField
          label="CNPJ da Organização"
          fullWidth
          margin="normal"
          value={evento.cnpjOrganizacao}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="Data de Início"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={evento.dataInicio}
          onChange={(e) => setEvento({ ...evento, dataInicio: e.target.value })}
        />
        <TextField
          label="Data de Fim"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={evento.dataFim}
          onChange={(e) => setEvento({ ...evento, dataFim: e.target.value })}
        />
        <TextField
          label="Horário de Início"
          type="time"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={evento.horarioInicio}
          onChange={(e) => setEvento({ ...evento, horarioInicio: e.target.value })}
        />
        <TextField
          label="Horário de Fim"
          type="time"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={evento.horarioFim}
          onChange={(e) => setEvento({ ...evento, horarioFim: e.target.value })}
        />
        <TextField
          label="Lotação Máxima"
          type="number"
          fullWidth
          margin="normal"
          value={evento.lotacaoMaxima}
          onChange={(e) => setEvento({ ...evento, lotacaoMaxima: e.target.value })}
        />
        <TextField
          label="Tipo de Evento"
          fullWidth
          margin="normal"
          value={evento.tipo}
          onChange={(e) => setEvento({ ...evento, tipo: e.target.value })}
        />
        <TextField
          label="Gênero"
          fullWidth
          margin="normal"
          value={evento.genero}
          onChange={(e) => setEvento({ ...evento, genero: e.target.value })}
        />
        <Box mt={2}>
          <Typography variant="h6">Upload de Imagem</Typography>
          <Input 
            type="file" 
            onChange={handleImageChange} 
            inputProps={{ accept: 'image/*' }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleImagemUpload}
            disabled={!img} 
            sx={{ ml: 2 }}
          >
            Upload
          </Button>
          {progress > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <CircularProgress variant="determinate" value={progress} />
              <Typography variant="body2" sx={{ ml: 2 }}>
                {`${progress}%`}
              </Typography>
            </Box>
          )}
        </Box>
        <Box mt={2}>
  <Typography variant="h6">Upload de Banner</Typography>
  <Input 
    type="file" 
    onChange={(e) => handleImageBannerChange(e)} 
    inputProps={{ accept: 'image/*' }}
  />
  <Button
    variant="contained"
    color="primary"
    onClick={handleImagemBannerUpload}
    disabled={!imgBanner} 
    sx={{ ml: 2 }}
  >
    Upload
  </Button>
  {progress > 0 && (
    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
      <CircularProgress variant="determinate" value={progress} />
      <Typography variant="body2" sx={{ ml: 2 }}>
        {`${progress}%`}
      </Typography>
    </Box>
  )}
</Box>


        <Box mt={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={saveEvento}
          >
            Salvar Alterações
          </Button>
        </Box>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default EditarEvento;