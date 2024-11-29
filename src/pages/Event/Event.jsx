import { useParams } from 'react-router-dom';
import { Container, Grid, Typography, Button, Box, TextField, Tooltip, MenuItem } from '@mui/material';
import EventRating from '../../components/Avaliacao/Avaliacao';
import FavoriteEvents from '../../components/Favoritos/Favoritos';
import { useEventData, useTicketSelection } from '../../hooks/useEventData';
import styles from './Event.module.css';

const Event = () => {
  const { id } = useParams();
  const { eventData, ratings, averageRating } = useEventData(id);
  const {
    ticketType,
    ticketQuantity,
    showConfirmation,
    handleTicketTypeChange,
    handleTicketQuantityChange,
    handleAddToCart,
    getCartSummary,
  } = useTicketSelection();

  if (!eventData) return <div>Carregando...</div>;

  return (
    <Container className={styles.container}>
      {showConfirmation && (
        <Box className={styles.confirmation}>
          <Typography variant="body1" color="white">
            Ingresso adicionado ao carrinho!
          </Typography>
          <Box>
            <Button variant="outlined" color="inherit" href="/carrinho">
              Revisar Carrinho
            </Button>
            <Button variant="contained" color="primary" href="/pagamento">
              Prosseguir para o Pagamento
            </Button>
          </Box>
        </Box>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className={styles.imageContainer}>
            <img src={eventData.imgBanner} alt={eventData.nome} className={styles.eventImage} />
          </div>
        </Grid>

        <Grid item xs={12} container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5" gutterBottom className={styles.eventTitle}>
              {eventData.nome}
            </Typography>
          </Grid>
          <Grid item>
            <Tooltip title="Adicionar aos Favoritos" arrow>
              <div>
                <FavoriteEvents
                  userId="user-id"
                  eventId={id}
                  eventName={eventData.nome}
                  size="small" // Reduzido para tamanho pequeno
                />
              </div>
            </Tooltip>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body1" className={`${styles.description} ${styles.marginTop20}`}>
            {eventData.descricao}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Box className={styles.dateVenueContainer}>
            <Typography variant="body1" className={styles.iconText}>
              {eventData.data}
            </Typography>
            <Typography variant="body1" className={styles.iconText}>
              {eventData.local}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={10}>
          <Box display="flex" flexDirection="column" alignItems="flex-start" width="100%">
            <Typography variant="h6" gutterBottom>
              Ingressos
            </Typography>
            <Typography variant="body1" style={{ marginBottom: 16 }}>
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
            style={{ marginTop: '4rem' }}
          >
            <Typography variant="body2" style={{ marginBottom: 16 }}>
              {getCartSummary()}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAddToCart(eventData.valorMin)}
              style={{ width: '100%' }}
            >
              Adicionar ao Carrinho
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <EventRating eventId={id} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Event;
