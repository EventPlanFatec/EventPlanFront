import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Grid,
  Typography,
  Button,
  Snackbar,
  Alert,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Chat from '../../components/Chat/Chat';
import EventRating from '../../components/Avaliacao/Avaliacao';
import FavoriteEvents from '../../components/Favoritos/Favoritos';
import UploadImage from '../../components/UploadImage/UploadImage';
import ExportToCSV from '../../components/ExportToCsv/ExportToCsv';
import styles from './Event.module.css';

const Event = () => {
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [isFull, setIsFull] = useState(false);
  const [isOnWaitlist, setIsOnWaitlist] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchEventAndRatings = async () => {
      try {
        const eventResponse = await axios.get(`http://localhost:7151/api/events/${id}`);
        setEventData(eventResponse.data);
        if (eventResponse.data.ingressosVendidos >= eventResponse.data.lotacaoMaxima) {
          setIsFull(true);
        }

        const ratingsResponse = await axios.get(`http://localhost:7151/api/events/${id}/ratings`);
        const fetchedRatings = ratingsResponse.data;
        setRatings(fetchedRatings);
        const avgRating = calculateAverageRating(fetchedRatings);
        setAverageRating(avgRating);

        const waitlistResponse = await axios.get(`http://localhost:7151/api/events/${id}/lista-espera/user-id`);
        setIsOnWaitlist(!!waitlistResponse.data);
      } catch (error) {
        console.error('Error fetching event and ratings:', error);
      }
    };

    fetchEventAndRatings();
  }, [id]);

  const calculateAverageRating = (ratings) => {
    if (ratings.length === 0) {
      return 0;
    }
    const totalRating = ratings.reduce((acc, rating) => {
      const validRating = typeof rating.rating === 'number' && !isNaN(rating.rating) ? rating.rating : 0;
      return acc + validRating;
    }, 0);
    return totalRating / ratings.length;
  };

  const handleAddToWaitlist = async () => {
    try {
      await axios.post(`http://localhost:7151/api/events/${id}/lista-espera`, {
        usuarioFinalId: 'user-id',
      });
      setIsOnWaitlist(true);
      setFeedbackMessage('Você foi adicionado à lista de espera!');
      setIsError(false);
    } catch (error) {
      console.error('Error adding to waitlist:', error);
      setFeedbackMessage('Erro ao adicionar à lista de espera. Tente novamente.');
      setIsError(true);
    }
  };

  const handleRemoveFromWaitlist = async () => {
    try {
      await axios.delete(`http://localhost:7151/api/events/${id}/lista-espera/user-id`);
      setIsOnWaitlist(false);
      setFeedbackMessage('Você foi removido da lista de espera!');
      setIsError(false);
    } catch (error) {
      console.error('Error removing from waitlist:', error);
      setFeedbackMessage('Erro ao remover da lista de espera. Tente novamente.');
      setIsError(true);
    }
  };

  if (!eventData) return <div>Loading...</div>;

  return (
    <Container className={styles.container}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardMedia
              component="img"
              image={eventData.imgBanner}
              alt={eventData.nome}
            />
            <CardContent>
              <Typography variant="h5">{eventData.nome}</Typography>
              <Typography variant="body1">{eventData.descricao}</Typography>
              <Typography variant="subtitle1">
                <FontAwesomeIcon icon={['far', 'calendar']} /> {eventData.data}
              </Typography>
              <Typography variant="subtitle1">
                <FontAwesomeIcon icon={['fas', 'map-marker-alt']} /> {eventData.local}
              </Typography>
              <Typography variant="body2">
                <strong>Ingressos:</strong> Ingressos a partir de R$ {eventData.valorMin}
              </Typography>
              <Button variant="contained" color="primary" onClick={() => {}}>
                Comprar Ingresso
              </Button>
            </CardContent>
          </Card>
        </Grid>
        {feedbackMessage && (
          <Grid item xs={12}>
            <Snackbar open={true} autoHideDuration={6000}>
              <Alert severity={isError ? 'error' : 'success'}>
                {feedbackMessage}
              </Alert>
            </Snackbar>
          </Grid>
        )}
        {isFull && !isOnWaitlist && (
          <Grid item xs={12}>
            <Button onClick={handleAddToWaitlist} variant="outlined" color="warning">
              Adicionar à Lista de Espera
            </Button>
          </Grid>
        )}
        {isFull && isOnWaitlist && (
          <Grid item xs={12}>
            <Button onClick={handleRemoveFromWaitlist} variant="outlined" color="error">
              Remover da Lista de Espera
            </Button>
          </Grid>
        )}
        <Grid item xs={12}>
          <Chat eventId={id} />
        </Grid>
        <Grid item xs={12}>
          <EventRating eventId={id} />
        </Grid>
        <Grid item xs={12}>
          <FavoriteEvents userId="user-id" eventId={id} eventName={eventData.nome} />
        </Grid>
        <Grid item xs={12}>
          <UploadImage />
        </Grid>
        <Grid item xs={12}>
          <ExportToCSV data={ratings} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Event;
