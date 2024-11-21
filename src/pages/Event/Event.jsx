import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { Container, Grid, Typography, Button, Box, TextField, Select, MenuItem, InputLabel, FormControl, Tooltip } from '@mui/material';
import Chat from '../../components/Chat/Chat';
import EventRating from '../../components/Avaliacao/Avaliacao';
import FavoriteEvents from '../../components/Favoritos/Favoritos';
import UploadImage from '../../components/UploadImage/UploadImage';
import ExportToCSV from '../../components/ExportToCsv/ExportToCSV';
import { db } from '../../firebase/config';
import styles from './Event.module.css';

const Event = () => {
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);
  const [ticketType, setTicketType] = useState('');
  const [ticketQuantity, setTicketQuantity] = useState(0);
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [cart, setCart] = useState([]);

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
    const totalRating = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return totalRating / ratings.length;
  };

  const handleTicketTypeChange = (event) => {
    setTicketType(event.target.value);
  };

  const handleTicketQuantityChange = (event) => {
    setTicketQuantity(event.target.value);
  };

  const handleAddToCart = () => {
    if (ticketQuantity > 0 && ticketType) {
      const newCartItem = {
        type: ticketType,
        quantity: ticketQuantity,
        price: eventData.valorMin * ticketQuantity,
      };
      setCart(prevCart => [...prevCart, newCartItem]);
      setTicketQuantity(0);
      setTicketType('');
    } else {
      alert('Por favor, selecione o tipo e a quantidade de ingressos.');
    }
  };

  const handlePurchase = () => {
    console.log('Compra realizada:', cart);
  };

  const getCartSummary = () => {
    if (cart.length === 0) return 'Carrinho vazio';
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
    const types = cart.map(item => `${item.quantity} ingresso(s) ${item.type}`).join(' - ');
    return `${types} - R$ ${totalPrice}`;
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
          <Typography variant="body1" className={`${styles.description} ${styles.marginTop20}`}>
            {eventData.descricao}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <div className={styles.dateVenueContainer}>
            <div className={styles.dateVenue}>
              <Typography variant="body1">{eventData.data}</Typography>
              <Typography variant="body1">{eventData.local}</Typography>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} md={10}>
          <div className={styles.ticketsContainer} style={{ padding: '20px' }}>
            <Box display="flex" flexDirection="column" alignItems="flex-start" width="100%">
              <Box display="flex" alignItems="center" sx={{ marginBottom: 2 }}>
                <Typography variant="body1"><strong>Ingressos:</strong></Typography>
                <Typography variant="body1" sx={{ color: 'orange', fontWeight: 'bold', marginLeft: 1 }}>
                  Ingressos a partir de R$ {eventData.valorMin}
                </Typography>
              </Box>
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Tipo de Ingresso</InputLabel>
                <Select
                  value={ticketType}
                  onChange={handleTicketTypeChange}
                  label="Tipo de Ingresso"
                >
                  <MenuItem value="normal">Normal</MenuItem>
                  <MenuItem value="VIP">VIP</MenuItem>
                  <MenuItem value="estudante">Estudante</MenuItem>
                </Select>
              </FormControl>
              <TextField
                type="number"
                label="Quantidade"
                value={ticketQuantity}
                onChange={handleTicketQuantityChange}
                fullWidth
                variant="outlined"
                margin="normal"
                inputProps={{ min: 1, max: 10 }}
                sx={{ marginTop: 2 }}
              />
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" sx={{ marginTop: 2 }}>
              <Box display="flex" alignItems="center" sx={{ marginRight: 2 }}>
                <Typography variant="body1">{getCartSummary()}</Typography>
              </Box>
              <Box display="flex">
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ padding: '8px 16px', marginRight: 2 }}
                  onClick={handleAddToCart}
                >
                  Adicionar ao Carrinho
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ padding: '8px 16px' }}
                  onClick={handlePurchase}
                >
                  Comprar
                </Button>
              </Box>
            </Box>
          </div>
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
