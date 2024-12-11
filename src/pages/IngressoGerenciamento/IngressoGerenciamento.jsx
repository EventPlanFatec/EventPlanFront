import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  Container, 
  Typography, 
  TextField, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  IconButton,
  Box,
  CircularProgress
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { 
  salvarIngresso, 
  listarIngressosPorEvento, 
  editarIngresso, 
  cancelarIngresso 
} from '../../services/IngressosService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';

const TicketManagementModal = ({ 
  open, 
  onClose, 
  eventoId 
}) => {
  const [tickets, setTickets] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    eventoId: eventoId || '',
    usuarioId: '',
    tipoIngresso: '',
    valor: 0,
    dataCompra: new Date().toISOString(),
    isValido: true
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingTicketId, setEditingTicketId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadTickets = async () => {
      if (open && eventoId && isMounted) {
        try {
          setCarregando(true);
          const fetchedTickets = await listarIngressosPorEvento(eventoId);
          if (isMounted) {
            setTickets(fetchedTickets);
          }
        } catch (error) {
          toast.error(`Erro ao buscar ingressos: ${error.message}`);
        } finally {
          if (isMounted) {
            setCarregando(false);
          }
        }
      }
    };

    loadTickets();

    return () => {
      isMounted = false;
    };
  }, [open, eventoId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTicketForm(prev => ({
      ...prev,
      [name]: name === 'valor' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ticketData = {
      ...ticketForm,
      eventoId: eventoId,
      id: uuidv4(),
    };

    try {
      if (isEditing) {
        await editarIngresso(editingTicketId, ticketData);
        toast.success('Ingresso atualizado com sucesso');
      } else {
        await salvarIngresso(ticketData);
        toast.success('Ingresso criado com sucesso');
      }

      fetchTickets();
      resetForm();
    } catch (error) {
      toast.error(`Erro ao salvar ingresso: ${error.message}`);
    }
  };

  const startEditing = (ticket) => {
    setIsEditing(true);
    setEditingTicketId(ticket.id);
    setTicketForm({
      eventoId: ticket.eventoId,
      usuarioId: ticket.usuarioId,
      tipoIngresso: ticket.tipoIngresso,
      valor: ticket.valor,
      dataCompra: ticket.dataCompra,
      isValido: ticket.isValido
    });
  };

  const handleDeleteTicket = async (id) => {
    try {
      const confirmDelete = window.confirm('Tem certeza que deseja excluir este ingresso?');
      if (confirmDelete) {
        await cancelarIngresso(id);
        toast.success('Ingresso excluído com sucesso');
        fetchTickets();
      }
    } catch (error) {
      toast.error(`Erro ao deletar ingresso: ${error.message}`);
    }
  };

  const resetForm = () => {
    setTicketForm({
      eventoId: eventoId || '',
      usuarioId: '',
      tipoIngresso: '',
      valor: 0,
      dataCompra: new Date().toISOString(),
      isValido: true
    });
    setIsEditing(false);
    setEditingTicketId(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Gerenciamento de Ingressos
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
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

        <Container sx={{ mb: 3 }}>
          <form onSubmit={handleSubmit}>
            <Box display="grid" gap={2} gridTemplateColumns="repeat(2, 1fr)">
              <TextField 
                fullWidth
                name="tipoIngresso"
                label="Tipo de Ingresso"
                value={ticketForm.tipoIngresso}
                onChange={handleInputChange}
                required
                variant="outlined"
              />
              <TextField 
                fullWidth
                name="valor"
                label="Valor"
                type="number"
                value={ticketForm.valor}
                onChange={handleInputChange}
                inputProps={{ step: "0.01" }}
                required
                variant="outlined"
              />
              <Box display="flex" alignItems="center">
                <Typography>Válido:</Typography>
                <input 
                  type="checkbox"
                  checked={ticketForm.isValido}
                  onChange={(e) => setTicketForm(prev => ({
                    ...prev, 
                    isValido: e.target.checked
                  }))} 
                />
              </Box>
            </Box>

            <Box mt={2} display="flex" gap={2}>
              <Button 
                type="submit" 
                variant="contained" 
                color={isEditing ? "secondary" : "primary"}
                startIcon={isEditing ? <EditIcon /> : <AddIcon />}
              >
                {isEditing ? 'Atualizar Ingresso' : 'Criar Ingresso'}
              </Button>

              {isEditing && (
                <Button 
                  variant="outlined" 
                  onClick={resetForm}
                >
                  Cancelar Edição
                </Button>
              )}
            </Box>
          </form>
        </Container>

        {carregando ? (
          <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          tickets.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID Usuário</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Valor</TableCell>
                    <TableCell>Data Compra</TableCell>
                    <TableCell>Válido</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>{ticket.usuarioId || 'Não comprado'}</TableCell>
                      <TableCell>{ticket.tipoIngresso}</TableCell>
                      <TableCell>R$ {ticket.valor.toFixed(2)}</TableCell>
                      <TableCell>{new Date(ticket.dataCompra).toLocaleDateString()}</TableCell>
                      <TableCell>{ticket.isValido ? 'Sim' : 'Não'}</TableCell>
                      <TableCell align="right">
                        <IconButton 
                          color="primary" 
                          onClick={() => startEditing(ticket)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => handleDeleteTicket(ticket.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Nenhum ingresso encontrado para este evento.
            </Typography>
          )
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TicketManagementModal;
