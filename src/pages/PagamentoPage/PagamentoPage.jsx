import { Box, Button, Typography } from '@mui/material';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

function PagamentoPage() {
  const { cartItems } = useCart();

  const totalPrice = (cartItems || []).reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Resumo da Compra
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

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              color="inherit"
              component={Link}
              to="/carrinho"
            >
              Voltar ao Carrinho
            </Button>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/finalizar-pagamento"
            >
              Finalizar Compra
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}

export default PagamentoPage;
