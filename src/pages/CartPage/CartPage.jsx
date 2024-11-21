import { useCart } from '../../context/CartContext';
import { Container, Typography, Button, Grid, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cart, removeFromCart, updateCartQuantity } = useCart();

  const handleRemove = (itemId) => {
    removeFromCart(itemId);
  };

  const handleQuantityChange = (itemId, quantity) => {
    updateCartQuantity(itemId, quantity);
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Carrinho</Typography>
      <Grid container spacing={2}>
        {cart.map((item) => (
          <Grid item xs={12} key={item.id}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body1">{item.name}</Typography>
              <Typography variant="body1">R$ {item.price}</Typography>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                min="1"
              />
              <Button variant="contained" color="secondary" onClick={() => handleRemove(item.id)}>
                Remover
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Box display="flex" justifyContent="space-between" mt={3}>
        <Typography variant="h6">Total: R$ {getTotal()}</Typography>
        <Link to="/pagamento">
          <Button variant="contained" color="primary">Ir para o pagamento</Button>
        </Link>
      </Box>
    </Container>
  );
};

export default CartPage;
