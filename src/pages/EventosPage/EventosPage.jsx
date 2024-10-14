import React, { useState, useEffect } from 'react';
import CriarEvento from '../../components/CriarEvento/CriarEvento';
import { salvarEvento, listarEventos, cancelarEvento } from '../../../src/services/eventosService';
import { Container, Typography, Button, Card, CardContent } from '@mui/material';
import styles from './EventosPage.module.css';

const EventosPage = () => {
  const [eventos, setEventos] = useState([]);
  const isAdmin = true;

  useEffect(() => {
    const fetchEventos = async () => {
      const eventosData = await listarEventos();
      setEventos(eventosData);
    };
    fetchEventos();
  }, []);

  const handleSave = async (formData) => {
    try {
      await salvarEvento(formData);
      alert('Evento criado com sucesso!');
      const eventosData = await listarEventos();
      setEventos(eventosData);
    } catch (error) {
      console.error('Erro ao criar evento:', error);
    }
  };

  const handleCancelEvent = async (id) => {
    try {
      await cancelarEvento(id);
      setEventos(eventos.filter(evento => evento.id !== id));
      alert('Evento cancelado com sucesso!');
    } catch (error) {
      console.error('Erro ao cancelar evento:', error);
    }
  };

  return (
    <Container className={styles.container}>
      <Typography variant="h4" gutterBottom>
        Criar Novo Evento
      </Typography>
      <CriarEvento onSave={handleSave} />
      <Typography variant="h5" gutterBottom>
        Eventos Criados
      </Typography>
      {eventos.map(evento => (
        <Card key={evento.id} className={styles.card}>
          <CardContent>
            <Typography variant="h6">{evento.nome}</Typography>
            {isAdmin && (
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={() => handleCancelEvent(evento.id)}
              >
                Cancelar Evento
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default EventosPage;
