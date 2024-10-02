import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { Container, Grid, Typography, IconButton, Button, Card } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Chat from '../../components/Chat/Chat';
import EventRating from '../../components/Avaliacao/Avaliacao';
import FavoriteEvents from '../../components/Favoritos/Favoritos';
import UploadImage from '../../components/UploadImage/UploadImage';
import ExportToCSV from '../../components/ExportToCsv/ExportToCsv';
import { db } from '../../firebase/config';
import styles from './Event.module.css';

const Event = () => {
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchEventAndRatings = async () => {
      try {
        const eventRef = doc(db, 'Eventos', id);
        const eventSnap = await getDoc(eventRef);
        if (eventSnap.exists()) {
          setEventData(eventSnap.data());
        } else {
          console.log('No such document!');
        }
        const ratingsCollection = collection(db, `Eventos/${id}/ratings`);
        const ratingsSnapshot = await getDocs(ratingsCollection);
        const fetchedRatings = ratingsSnapshot.docs.map(doc => doc.data());
        setRatings(fetchedRatings);
        const avgRating = calculateAverageRating(fetchedRatings);
        setAverageRating(avgRating);
      } catch (error) {
        console.error('Error fetching event and ratings:', error);
      }
    };

    fetchEventAndRatings();
  }, [id]);

  const calculateAverageRating = (ratings) => {
    if (ratings.length === 0) return 0;

    const totalRating = ratings.reduce((acc, rating) => {
      const validRating = typeof rating.rating === 'number' && !isNaN(rating.rating) ? rating.rating : 0;
      return acc + validRating;
    }, 0);

    return totalRating / ratings.length;
  };

  if (!eventData) return <div>Loading...</div>;

  return (
    <Container className={styles.container}>
      <Card className={styles.card}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div className={styles.imageContainer}>
              <img src={eventData.imgBanner} alt={eventData.nome} className={styles.eventImage} />
            </div>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" className={styles.description}>
              {eventData.descricao}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <div className={styles.dateVenue}>
              <Typography variant="body1">
                <FontAwesomeIcon icon={['far', 'calendar']} /> {eventData.data}
              </Typography>
              <Typography variant="body1">
                <FontAwesomeIcon icon={['fas', 'map-marker-alt']} /> {eventData.local}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} container alignItems="center">
            <Grid item xs>
              <Typography variant="body1">
                <strong>Ingressos:</strong> a partir de R$ {eventData.valorMin}
              </Typography>
            </Grid>
            <Grid item>
              <IconButton color="primary" className={styles.cartIcon}>
                <FontAwesomeIcon icon="fa-solid fa-cart-shopping" />
              </IconButton>
            </Grid>
          </Grid>
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
            <ExportToCSV eventData={eventData} averageRating={averageRating} />
          </Grid>
          <Grid item xs={12} container justifyContent="flex-end">
            <Button variant="contained" color="primary" startIcon={<FontAwesomeIcon icon="fa-solid fa-download" />}>
              Exportar Dados
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default Event;
