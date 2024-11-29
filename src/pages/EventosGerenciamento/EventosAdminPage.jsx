import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  IconButton,
  Box
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useEventosFirebase } from '../../hooks/useEventosFirebase'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EventoForm from '../../components/CriarEvento/EventoForm';

const EventosAdminPage = () => {
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

  useEffect(() => {
    buscarEventos();
  }, [buscarEventos]);

  useEffect(() => {
    if (erro) {
      toast.error(`Erro ao carregar eventos: ${erro}`);
    }
  }, [erro]);

  const handleOpenModal = (evento = null) => {
    setEventoSelecionado(evento);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEventoSelecionado(null);
  };

  const handleSubmit = async (eventoModel) => {
    try {
      if (eventoSelecionado) {
        // Atualizar evento existente
        await atualizarEvento(eventoSelecionado.id, eventoModel.toFirestore());
        toast.success('Evento atualizado com sucesso');
      } else {
        // Criar novo evento
        await criarEvento(eventoModel);
        toast.success('Evento criado com sucesso');
      }
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
      toast.error('Erro ao salvar evento. Tente novamente.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm('Tem certeza que deseja excluir este evento?');
      if (confirmDelete) {
        await deletarEvento(id);
        toast.success('Evento excluído com sucesso', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
      toast.error('Erro ao deletar evento. Tente novamente.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
      
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

      <EventoForm 
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={eventoSelecionado}
      />
    </Container>
  );
};

export default EventosAdminPage;