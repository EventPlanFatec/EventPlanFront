import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
import { Button, Card, CardContent, Typography, Box, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from "../EventosGerenciamento/EventosGerenciamento.module.css";
import { getAuth } from "firebase/auth";
import TicketManagementModal from "../IngressoGerenciamento/IngressoGerenciamento";

const EventosGerenciamento = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [userIdEvento, setUserIdEvento] = useState(null);
  const [cnpjEvento, setCnpjEvento] = useState(null);
  const [openTicketModal, setOpenTicketModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      console.log("Buscando todos os eventos...");
      const eventosRef = collection(db, "Eventos");
      const querySnapshot = await getDocs(eventosRef);
      const eventosData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Eventos encontrados:", eventosData);
      setEvents(eventosData);
    } catch (error) {
      console.error("Erro ao carregar eventos", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCNPJ = async (userId) => {
    const orgDocRef = doc(db, "organizacao", userId);
    const docSnap = await getDoc(orgDocRef);
    if (docSnap.exists()) {
      const orgData = docSnap.data();
      setCnpjEvento(orgData.cnpj);
    } else {
      console.error("Organização não encontrada para o usuário", userId);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      await deleteDoc(doc(db, "Eventos", eventId));
      setSnackbarMessage('Evento excluído com sucesso!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      fetchEvents();
    } catch (error) {
      console.error("Erro ao excluir evento", error);
      setSnackbarMessage('Erro ao excluir evento');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleOpenTicketModal = (eventoId) => {
    setSelectedEventId(eventoId);
    setOpenTicketModal(true);
  };

  const handleCloseTicketModal = () => {
    setOpenTicketModal(false);
    setSelectedEventId(null);
  };

  useEffect(() => {
    const user = getAuth().currentUser;
    if (user) {
      const userUid = user.uid;
      setUserIdEvento(userUid);
      fetchCNPJ(userUid);
    }
    fetchEvents();
  }, []);

  if (loading) {
    return <Typography>Carregando eventos...</Typography>;
  }

  return (
    <Box className={styles.container}>
      <Typography className={styles.title} variant="h4" gutterBottom>
        Gerenciamento de Eventos
      </Typography>

      {/* Botão para Criar Evento */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/create-event')} // Navega para a página de criação de evento
        style={{ marginBottom: '20px' }} // Adiciona espaçamento abaixo do botão
      >
        Criar Evento
      </Button>

      <Box mt={3}>
        {events.length === 0 ? (
          <Typography className={styles.noEventsMessage}>
            Nenhum evento encontrado.
          </Typography>
        ) : (
          events
            .filter((event) => event.cnpjOrganizacao === cnpjEvento)
            .map((event) => (
              <Card key={event.id} className={styles.eventCard} variant="outlined">
                <CardContent>
                  <Typography className={styles.eventTitle}>{event.nome}</Typography>
                  <Typography className={styles.eventCNPJ}>
                    {event.cnpjOrganizacao}
                  </Typography>
                  <Box className={styles.actions} mt={2}>
                    <Button
                      className={`${styles.actionButton} ${styles.editButton}`}
                      variant="contained"
                      onClick={() => navigate(`/editar-evento/${event.id}`)}
                    >
                      Editar Evento
                    </Button>
                    <Button
                      className={`${styles.actionButton} ${styles.ingressoButton}`}
                      variant="contained"
                      onClick={() => handleOpenTicketModal(event.id)}
                    >
                      Ingresso
                    </Button>
                    <Button
                      className={styles.deleteButton}
                      variant="contained"
                      color="error"
                      onClick={() => deleteEvent(event.id)}
                    >
                      Excluir Evento
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))
        )}
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

      {/* Modal de gerenciamento de ingressos */}
      {openTicketModal && (
        <TicketManagementModal
          open={openTicketModal}
          onClose={handleCloseTicketModal}
          eventoId={selectedEventId}
        />
      )}
    </Box>
  );
};

export default EventosGerenciamento;
