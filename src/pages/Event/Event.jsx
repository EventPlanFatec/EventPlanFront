import { useParams } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  TextField,
  MenuItem,
} from "@mui/material";
import EventRating from "../../components/Avaliacao/Avaliacao";
import { useEventData, useTicketSelection } from "../../hooks/useEventData";
import { listarIngressosPorEvento } from "../../services/IngressosService";
import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import styles from "./Event.module.css";

const Event = () => {
  const { id } = useParams();
  const { eventData } = useEventData(id);
  const {
    ticketType,
    ticketQuantity,
    showConfirmation,
    handleTicketTypeChange,
    handleTicketQuantityChange,
  } = useTicketSelection();

  const { addToCart } = useCart();

  const [tickets, setTickets] = useState([]);
  const [ticketPrice, setTicketPrice] = useState(0); 

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const ticketsData = await listarIngressosPorEvento(id);
        setTickets(ticketsData);
      } catch (error) {
        console.error("Erro ao buscar ingressos:", error);
      }
    };

    if (id) {
      fetchTickets();
    }
  }, [id]);

  const calculateTotalPrice = () => {
    if (ticketType && ticketPrice > 0 && ticketQuantity > 0) {
      return ticketPrice * ticketQuantity;
    }
    return 0;
  };

  const handleTicketTypeChangeWithPrice = async (event) => {
    handleTicketTypeChange(event);
    const selectedType = event.target.value;

    const selectedTicket = tickets.find(
      (ticket) => ticket.tipoIngresso === selectedType
    );
    setTicketPrice(selectedTicket ? selectedTicket.valor : 0);
  };

  const handleAddToCartWithPrice = () => {
    if (ticketType && ticketQuantity > 0 && ticketPrice) {
      const totalPrice = calculateTotalPrice();

      const cartItem = {
        id: `${id}-${ticketType}`,
        nome: eventData.nome,
        tipoIngresso: ticketType,
        quantidade: ticketQuantity,
        preco: ticketPrice,
        total: totalPrice,
      };

      addToCart(cartItem);
      toast.success("Ingresso adicionado ao carrinho!");

    }
  };

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
            <img
              src={eventData.imgBanner}
              alt={eventData.nome}
              className={styles.eventImage}
            />
          </div>
        </Grid>

        <Grid
          item
          xs={12}
          container
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item>
            <Typography variant="h5" gutterBottom className={styles.eventTitle}>
              {eventData.nome}
            </Typography>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Typography
            variant="body1"
            className={`${styles.description} ${styles.marginTop20}`}
          >
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

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Ingressos
          </Typography>
          <Typography variant="body1" style={{ marginBottom: 16 }}>
            A partir de <strong>R$ {eventData.valorMin}</strong>
          </Typography>

          <Grid container spacing={2}>
            {/* Ticket Selection Section */}
            <Grid item xs={12} md={6}>
              <Box 
                className={styles.ticketsContainer}
              >
                <Typography variant="h6" style={{ marginBottom: 16 }}>
                  Selecionar Ingressos
                </Typography>
                
                {/* Ticket Quantity */}
                <TextField
                  type="number"
                  label="Quantidade"
                  value={ticketQuantity || 1}
                  onChange={handleTicketQuantityChange}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  inputProps={{ min: 1 }}
                />

                {/* Ticket Type */}
                <TextField
                  select
                  label="Tipo de Ingresso"
                  value={ticketType}
                  onChange={handleTicketTypeChangeWithPrice}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                >
                  {tickets.length > 0 ? (
                    tickets.map((ticket) => (
                      <MenuItem
                        key={ticket.tipoIngresso}
                        value={ticket.tipoIngresso}
                      >
                        {ticket.tipoIngresso} - R${" "}
                        {ticket.valor
                          ? ticket.valor.toFixed(2)
                          : "Preço indisponível"}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="">Nenhum tipo de ingresso disponível</MenuItem>
                  )}
                </TextField>
              </Box>
            </Grid>

            {/* Cart and Total Section */}
            <Grid item xs={12} md={6}>
              <Box 
                className={styles.ticketsContainer}
              >
                <Typography variant="h6" style={{ marginBottom: 16 }}>
                  Resumo da Compra
                </Typography>
                
                {ticketType && (
                  <>
                    <Typography variant="body1" style={{ marginBottom: 8 }}>
                      Preço por ingresso: R$ {ticketPrice.toFixed(2)}
                    </Typography>
                    <Typography variant="body1" style={{ marginBottom: 16 }}>
                      Total: R$ {calculateTotalPrice().toFixed(2)}
                    </Typography>
                  </>
                )}

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddToCartWithPrice}
                  disabled={!ticketType || ticketQuantity === 0}
                >
                  Adicionar ao Carrinho
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <EventRating eventId={id} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Event;