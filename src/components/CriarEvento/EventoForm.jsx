import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button,
  Box,
  Typography,
  MenuItem,
  Input,
  CircularProgress
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/config';
import { toast } from 'react-toastify';
import EventoModel from '../../models/EventoModel';

const EventoForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  initialData = null 
}) => {
  const [formData, setFormData] = useState({
    nome: '',
    date: new Date().toISOString().split('T')[0],
    descricao: '',
    local: '',
    tipo: '',
    capacidade: '',
    valorMin: '',
    img: '',
    imgBanner: ''
  });
  const [formErrors, setFormErrors] = useState([]);
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  useEffect(() => {
    // Reset form when initial data changes
    if (initialData) {
      setFormData({
        nome: initialData.nome || '',
        date: initialData.date instanceof Date 
          ? initialData.date.toISOString().split('T')[0] 
          : new Date(initialData.date).toISOString().split('T')[0],
        descricao: initialData.descricao || '',
        local: initialData.local || '',
        tipo: initialData.tipo || '',
        capacidade: initialData.capacidade || '',
        valorMin: initialData.valorMin || '',
        img: initialData.img || '',
        imgBanner: initialData.imgBanner || '',
      });
    } else {
      // Reset to default values when no initial data
      setFormData({
        nome: '',
        date: new Date().toISOString().split('T')[0],
        descricao: '',
        local: '',
        tipo: '',
        capacidade: '',
        valorMin: '',
        img: '',
        imgBanner: ''
      });
    }
    
    setFormErrors([]);
    setImageUpload(null);
    setImageUploadProgress(0);
  }, [initialData, open]);

  const tiposEvento = [
    { value: 'conferencia', label: 'Conferência' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'palestra', label: 'Palestra' },
    { value: 'curso', label: 'Curso' },
    { value: 'outro', label: 'Outro' },
    { value: 'show', label: 'show' }
  ];

  const handleImageUpload = () => {
    if (!imageUpload) return;

    const uniqueFileName = `${Date.now()}_${imageUpload.name}`;
    const storageRef = ref(storage, `events/images/${uniqueFileName}`);
    const uploadTask = uploadBytesResumable(storageRef, imageUpload);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress);
      },
      (error) => {
        console.error("Upload error: ", error);
        toast.error('Erro no upload da imagem');
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData(prev => ({
            ...prev,
            img: downloadURL
          }));
          setImageUploadProgress(0);
          toast.success('Imagem carregada com sucesso');
        } catch (error) {
          console.error("Error fetching download URL: ", error);
          toast.error('Erro ao processar imagem');
        }
      }
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageUpload(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    try {
      const eventoData = {
        ...formData,
        date: new Date(formData.date),
        capacidade: formData.capacidade ? parseInt(formData.capacidade) : null,
        valorMin: formData.valorMin ? parseFloat(formData.valorMin) : null
      };

      const eventoModel = new EventoModel(eventoData);
      const validationErrors = eventoModel.validate();

      if (validationErrors.length > 0) {
        setFormErrors(validationErrors);
        validationErrors.forEach(error => toast.error(error));
        return;
      }

      // Call the onSubmit prop with the validated evento model
      onSubmit(eventoModel);
    } catch (error) {
      console.error('Erro ao validar evento:', error);
      toast.error('Erro ao salvar evento. Tente novamente.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? 'Editar Evento' : 'Novo Evento'}
      </DialogTitle>
      <DialogContent>
        {formErrors.length > 0 && (
          <Box sx={{ color: 'error.main', mb: 2 }}>
            {formErrors.map((error, index) => (
              <Typography key={index} variant="body2">
                {error}
              </Typography>
            ))}
          </Box>
        )}
        <TextField
          autoFocus
          margin="dense"
          name="nome"
          label="Nome do Evento"
          fullWidth
          value={formData.nome}
          onChange={handleInputChange}
          required
        />
        <TextField
          margin="dense"
          name="date"
          label="Data"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={formData.date}
          onChange={handleInputChange}
          required
        />
        <TextField
          margin="dense"
          name="local"
          label="Local"
          fullWidth
          value={formData.local}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="tipo"
          label="Tipo de Evento"
          fullWidth
          select
          value={formData.tipo}
          onChange={handleInputChange}
        >
          {tiposEvento.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          margin="dense"
          name="descricao"
          label="Descrição"
          multiline
          rows={4}
          fullWidth
          value={formData.descricao}
          onChange={handleInputChange}
          required
        />
        <TextField
          margin="dense"
          name="capacidade"
          label="Capacidade"
          type="number"
          fullWidth
          value={formData.capacidade}
          onChange={handleInputChange}
          InputProps={{ inputProps: { min: 0 } }}
        />
        <TextField
          margin="dense"
          name="valorMin"
          label="Preço"
          type="string"
          fullWidth
          value={formData.valorMin}
          onChange={handleInputChange}
          InputProps={{ 
            inputProps: { min: 0, step: 0.01 },
            startAdornment: 'R$' 
          }}
        />
        
        {/* Image Upload Section */}
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="subtitle1">Upload de Imagem</Typography>
          <Input
            type="file"
            onChange={handleImageChange}
            sx={{ display: 'none' }}
            id="image-upload-input"
            accept="image/*"
          />
          <label htmlFor="image-upload-input">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
            >
              Escolher Imagem
            </Button>
          </label>

          {imageUpload && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleImageUpload}
              sx={{ ml: 2 }}
            >
              Upload
            </Button>
          )}

          {imageUploadProgress > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <CircularProgress 
                variant="determinate" 
                value={imageUploadProgress} 
                size={24}
                sx={{ mr: 1 }}
              />
              <Typography variant="body2">
                {`${Math.round(imageUploadProgress)}%`}
              </Typography>
            </Box>
          )}

          {formData.img && (
            <Box sx={{ mt: 2, maxWidth: 300 }}>
              <Typography variant="subtitle2">Imagem Carregada:</Typography>
              <img 
                src={formData.img} 
                alt="Evento" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: 200, 
                  objectFit: 'cover' 
                }} 
              />
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} color="primary">
          {initialData ? 'Salvar' : 'Criar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
  };

export default EventoForm;