import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  CircularProgress,
  IconButton,
  Box,
  MenuItem
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon 
} from '@mui/icons-material';
import { useEventosFirebase } from '../../hooks/eventHook'; 
import EventoModel from '../../models/EventoModel';

const EventosGerenciamento = () => {
  const { 
    eventos, 
    carregando, 
    erro, 
    buscarEventos, 
    criarEvento, 
    atualizarEvento, 
    deletarEvento 
  } = useEventosFirebase();

  const [openModal, setOpenModal] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    location: '',
    type: '',
    capacity: '',
    price: ''
  });
  const [formErrors, setFormErrors] = useState([]);

  useEffect(() => {
    buscarEventos();
  }, [buscarEventos]);

  const tiposEvento = [
    { value: 'conferencia', label: 'Conferência' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'palestra', label: 'Palestra' },
    { value: 'curso', label: 'Curso' },
    { value: 'outro', label: 'Outro' }
  ];

  const handleOpenModal = (evento = null) => {
    if (evento) {
      // Editar evento existente
      setEventoSelecionado(evento);
      setFormData({
        nome: evento.nome || '',
        date: evento.date instanceof Date 
          ? evento.date.toISOString().split('T')[0] 
          : new Date(evento.date).toISOString().split('T')[0],
        description: evento.description || '',
        location: evento.location || '',
        type: evento.type || '',
        capacity: evento.capacity || '',
        price: evento.price || ''
      });
    } else {
      // Criar novo evento
      setEventoSelecionado(null);
      setFormData({
        nome: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        location: '',
        type: '',
        capacity: '',
        price: ''
      });
    }
    setOpenModal(true);
    setFormErrors([]);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEventoSelecionado(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      // Converter campos numéricos
      const eventoData = {
        ...formData,
        date: new Date(formData.date),
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        price: formData.price ? parseFloat(formData.price) : null
      };

      const eventoModel = new EventoModel(eventoData);
      const validationErrors = eventoModel.validate();

      if (validationErrors.length > 0) {
        setFormErrors(validationErrors);
        return;
      }

      if (eventoSelecionado) {
        // Atualizar evento existente
        await atualizarEvento(eventoSelecionado.id, eventoModel.toFirestore());
      } else {
        // Criar novo evento
        await criarEvento(eventoModel);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
      alert('Erro ao salvar evento. Tente novamente.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este evento?')) {
      try {
        await deletarEvento(id);
      } catch (error) {
        console.error('Erro ao deletar evento:', error);
        alert('Erro ao deletar evento. Tente novamente.');
      }
    }
  };

  if (carregando) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (erro) {
    return (
      <Container>
        <Typography color="error">Erro: {erro}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gerenciamento de Eventos
      </Typography>

      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<AddIcon />}
        onClick={() => handleOpenModal()}
        sx={{ mb: 2 }}
      >
        Novo Evento
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Local</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {eventos.map((evento) => (
              <TableRow key={evento.id}>
                <TableCell>{evento.nome}</TableCell>
                <TableCell>{evento.getDataFormatada()}</TableCell>
                <TableCell>{evento.location}</TableCell>
                <TableCell>{evento.type}</TableCell>
                <TableCell align="right">
                  <IconButton 
                    color="primary" 
                    onClick={() => handleOpenModal(evento)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDelete(evento.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle>
          {eventoSelecionado ? 'Editar Evento' : 'Novo Evento'}
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
            name="location"
            label="Local"
            fullWidth
            value={formData.location}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="type"
            label="Tipo de Evento"
            fullWidth
            select
            value={formData.type}
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
            name="description"
            label="Descrição"
            multiline
            rows={4}
            fullWidth
            value={formData.description}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            name="capacity"
            label="Capacidade"
            type="number"
            fullWidth
            value={formData.capacity}
            onChange={handleInputChange}
            InputProps={{ inputProps: { min: 0 } }}
          />
          <TextField
            margin="dense"
            name="price"
            label="Preço"
            type="number"
            fullWidth
            value={formData.price}
            onChange={handleInputChange}
            InputProps={{ 
              inputProps: { min: 0, step: 0.01 },
              startAdornment: 'R$' 
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EventosGerenciamento;