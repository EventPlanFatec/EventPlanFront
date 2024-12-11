import { Container, Grid, Typography, Box, Button } from '@mui/material';
import { useCart } from '../../context/CartContext';
import styles from './Cart.module.css';

const CartPage = () => {
  const { cart, removeFromCart, updateItemQuantity } = useCart();

  // Função para garantir que um valor seja um número válido
  const ensureValidNumber = (value) => {
    return !isNaN(value) && value !== null ? Number(value) : 0;
  };

  // Calcula o preço total do item
  const calculateTotalPrice = (price, quantity) => {
    return ensureValidNumber(price) * ensureValidNumber(quantity);
  };

  // Calcula o total do carrinho
  const calculateCartTotal = () => {
    return cart.reduce((total, item) => total + (ensureValidNumber(item.total) || 0), 0);
  };

  return (
    <Container maxWidth="md">
      <Box marginTop={4}>
        <Typography variant="h4" gutterBottom align="center">
          Carrinho de Compras
        </Typography>

        {cart.length === 0 ? (
          <Typography variant="body1" align="center">
            Seu carrinho está vazio.
          </Typography>
        ) : (
          cart.map((item) => (
            <Grid container key={item.id} spacing={2} alignItems="center" sx={{ marginBottom: 2 }}>
              <Grid item xs={8} sm={9}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {item.nome} ({item.tipoIngresso})
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    R$ {ensureValidNumber(item.total).toFixed(2)}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={4} sm={3} display="flex" justifyContent="flex-end">
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={() => removeFromCart(item.id)}
                >
                  Remover
                </Button>
              </Grid>
            </Grid>
          ))
        )}

        {cart.length > 0 && (
          <Box display="flex" flexDirection="column" alignItems="center" marginTop={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Total: R$ {ensureValidNumber(calculateCartTotal()).toFixed(2)}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ marginTop: 2, paddingX: 4 }}
              href="/pagamento"
            >
              Prosseguir para o pagamento
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default CartPage;
