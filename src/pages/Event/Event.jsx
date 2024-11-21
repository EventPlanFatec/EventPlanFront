import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { Container, Grid, Typography, Button, Box, TextField, Tooltip, MenuItem } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
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
  const [ticketType, setTicketType] = useState('');
  const [ticketQuantity, setTicketQuantity] = useState(0);
  const [cart, setCart] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchEventAndRatings = async () => {
      const eventRef = doc(db, 'Eventos', id);
      const eventSnap = await getDoc(eventRef);
      if (eventSnap.exists()) {
        setEventData(eventSnap.data());
      }
      const ratingsCollection = collection(db, `Eventos/${id}/ratings`);
      const ratingsSnapshot = await getDocs(ratingsCollection);
      const fetchedRatings = ratingsSnapshot.docs.map((doc) => doc.data());
      setRatings(fetchedRatings);
      setAverageRating(
        fetchedRatings.reduce((sum, r) => sum + r.rating, 0) / fetchedRatings.length || 0
      );
    };
    fetchEventAndRatings();
  }, [id]);

  const handleTicketTypeChange = (event) => {
    setTicketType(event.target.value);
  };

  const handleTicketQuantityChange = (event) => {
    setTicketQuantity(event.target.value);
  };

  const handleAddToCart = () => {
    if (ticketType && ticketQuantity > 0) {
      const newItem = {
        type: ticketType,
        quantity: ticketQuantity,
        price: eventData.valorMin * ticketQuantity,
      };
      setCart((prevCart) => [...prevCart, newItem]);
      setTicketType('');
      setTicketQuantity(0);
    }
  };

  const getCartSummary = () => {
    if (cart.length === 0) return 'Carrinho vazio';
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
    return `${totalQuantity} ingresso(s) - R$ ${totalPrice}`;
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
          <Typography variant="h5" gutterBottom className={styles.eventTitle}>
            {eventData.nome}
          </Typography>
          <Typography variant="body1" className={`${styles.description} ${styles.marginTop20}`}>
            {eventData.descricao}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box className={styles.dateVenueContainer}>
            <Typography variant="body1" className={styles.iconText}>
              <FontAwesomeIcon icon={faCalendar} /> {eventData.data}
            </Typography>
            <Typography variant="body1" className={styles.iconText}>
              <FontAwesomeIcon icon={faMapMarkerAlt} /> {eventData.local}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={10}>
          <Box display="flex" flexDirection="column" alignItems="flex-start" width="100%">
            <Typography variant="h6" gutterBottom>
              Ingressos
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
              A partir de <strong>R$ {eventData.valorMin}</strong>
            </Typography>
            <TextField
              select
              label="Tipo de Ingresso"
              value={ticketType}
              onChange={handleTicketTypeChange}
              fullWidth
              variant="outlined"
              margin="normal"
            >
              <MenuItem value="normal">Normal</MenuItem>
              <MenuItem value="VIP">VIP</MenuItem>
              <MenuItem value="estudante">Estudante</MenuItem>
            </TextField>
            <TextField
              type="number"
              label="Quantidade"
              value={ticketQuantity}
              onChange={handleTicketQuantityChange}
              fullWidth
              variant="outlined"
              margin="normal"
              inputProps={{ min: 1 }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={2}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ marginTop: '4rem' }}
          >
            <Typography variant="body2" sx={{ marginBottom: 2 }}>
              {getCartSummary()}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddToCart}
              sx={{ width: '100%' }}
            >
              Adicionar ao Carrinho
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Chat eventId={id} />
        </Grid>
        <Grid item xs={12}>
          <EventRating eventId={id} />
        </Grid>
        <Grid item xs={12}>
          <UploadImage />
        </Grid>
        <Grid item xs={12}>
          <ExportToCSV eventData={eventData} averageRating={averageRating} />
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
