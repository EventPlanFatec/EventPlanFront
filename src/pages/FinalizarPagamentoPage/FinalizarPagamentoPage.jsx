import { Box, Button, Typography, TextField } from '@mui/material';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

function FinalizarPagamentoPage() {
  const { cartItems } = useCart();

  const totalPrice = (cartItems || []).reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Finalização da Compra
      </Typography>

      {cartItems && cartItems.length === 0 ? (
        <Typography>Seu carrinho está vazio.</Typography>
      ) : (
        <>
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6">Itens do Carrinho:</Typography>
            <ul>
              {cartItems && cartItems.map(item => (
                <li key={item.id}>
                  <Typography>{item.name} - {item.quantity} x R${item.price}</Typography>
                </li>
              ))}
            </ul>
          </Box>

          <Box sx={{ marginBottom: 3 }}>
            <Typography variant="h6">Total: R${totalPrice}</Typography>
          </Box>

          <Box sx={{ marginBottom: 3 }}>
            <TextField
              label="Número do Cartão"
              variant="outlined"
              fullWidth
              required
            />
            <TextField
              label="Data de Vencimento"
              variant="outlined"
              fullWidth
              required
            />
            <TextField
              label="CVV"
              variant="outlined"
              fullWidth
              required
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              color="inherit"
              component={Link}
              to="/pagamento"
            >
              Voltar à Pagamento
            </Button>
            <Button
              variant="contained"
              color="primary"
            >
              Confirmar Pagamento
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}

export default FinalizarPagamentoPage;
