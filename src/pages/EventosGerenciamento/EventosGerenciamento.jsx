// src/pages/EventosGerenciamento.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, CardContent, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from "./EventosGerenciamento.module.css";  // Importando o módulo CSS

const EventosGerenciamento = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const organizationId = "id-da-organizacao"; // Substitua com o ID real da organização

  // Função para buscar eventos da organização
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/events/organization/${organizationId}`);
      setEvents(response.data);
    } catch (error) {
      console.error("Erro ao carregar eventos", error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar eventos quando o componente for montado
  useEffect(() => {
    fetchEvents();
  }, []);

  // Função para editar evento
  const handleEdit = (eventId) => {
    navigate(`/editar-evento/${eventId}`);
  };

  // Função para excluir evento
  const handleDelete = async (eventId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/events/${eventId}`);
      if (response.status === 200) {
        fetchEvents(); // Recarregar a lista após a exclusão
      }
    } catch (error) {
      console.error("Erro ao excluir evento", error);
    }
  };

  // Exibir mensagem de carregamento enquanto os dados estão sendo carregados
  if (loading) {
    return <Typography>Carregando eventos...</Typography>;
  }

  return (
    <Box className={styles.container}>
      <Typography className={styles.title} variant="h4" gutterBottom>
        Gerenciamento de Eventos
      </Typography>

      <Box mt={3}>
        {events.length === 0 ? (
          <Typography className={styles.noEventsMessage}>
            Nenhum evento encontrado.
          </Typography>
        ) : (
          events.map((event) => (
            <Card key={event.eventoId} className={styles.eventCard} variant="outlined">
              <CardContent>
                <Typography className={styles.eventTitle}>{event.nomeEvento}</Typography>
                <Typography className={styles.eventDate}>{event.dataInicio} - {event.dataFim}</Typography>
                <Box className={styles.actions} mt={2}>
                  <Button
                    className={`${styles.actionButton} ${styles.editButton}`}
                    variant="contained"
                    onClick={() => handleEdit(event.eventoId)}
                  >
                    Editar
                  </Button>
                  <Button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    variant="contained"
                    onClick={() => handleDelete(event.eventoId)}
                  >
                    Excluir
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Box>
  );
};

export default EventosGerenciamento;
