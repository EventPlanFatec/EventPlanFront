import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { Container, Grid, Typography, Tooltip, Button, Box } from '@mui/material';
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
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className={styles.imageContainer}>
            <img src={eventData.imgBanner} alt={eventData.nome} className={styles.eventImage} />
          </div>
        </Grid>
        <Grid item xs={12}>
          <div className={`${styles.description} ${styles.marginTop20}`}>
            <Typography variant="body1">{eventData.descricao}</Typography>
          </div>
        </Grid>
        <Grid item xs={12}>
          <div className={styles.dateVenueContainer}>
            <div className={styles.dateVenue}>
              <Typography variant="body1">
                <FontAwesomeIcon icon={['far', 'calendar']} /> {eventData.data}
              </Typography>
              <Typography variant="body1">
                <FontAwesomeIcon icon={['fas', 'map-marker-alt']} /> {eventData.local}
              </Typography>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} md={10}>
          <div className={styles.ticketsContainer}>
            <Box display="flex" alignItems="center" flexWrap="wrap">
              <Typography variant="body1"><strong>Ingressos:</strong></Typography>
              <Typography variant="body1" sx={{ color: 'orange', fontWeight: 'bold', marginLeft: 1 }}>
                Ingressos a partir de R$ {eventData.valorMin}
              </Typography>
            </Box>
          </div>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ width: '100%', height: '50px', marginTop: { xs: '10px', md: '18px' } }}
            onClick={() => console.log('Comprar clicado!')}
          >
            Comprar
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ marginY: '1vh' }}>
            <Chat eventId={id} />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ marginY: '1vh' }}>
            <EventRating eventId={id} />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ marginY: '1vh' }}>
            <UploadImage />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ marginY: '1vh' }}>
            <ExportToCSV eventData={eventData} averageRating={averageRating} />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Tooltip title="Adicionar aos Favoritos" arrow>
            <FavoriteEvents userId="user-id" eventId={id} eventName={eventData.nome} />
          </Tooltip>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Event;
