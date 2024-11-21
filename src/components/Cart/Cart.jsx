import { useCart } from '../context/CartContext';
import { Button, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function Cart() {
  const { cartItems, removeItemFromCart, updateItemQuantity } = useCart();

  const handleQuantityChange = (id, event) => {
    updateItemQuantity(id, parseInt(event.target.value));
  };

  const handleRemoveItem = (id) => {
    removeItemFromCart(id);
  };

  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="cart">
      <h2>Revisar Carrinho</h2>
      {cartItems.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <>
          <ul>
            {cartItems.map(item => (
              <li key={item.id}>
                <div>
                  <h3>{item.name}</h3>
                  <p>Preço: R${item.price}</p>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, e)}
                  />
                  <button onClick={() => handleRemoveItem(item.id)}>Remover</button>
                </div>
              </li>
            ))}
          </ul>
          <div>
            <p>Total: R${totalPrice}</p>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                component={Link}
                to="/carrinho"
              >
                Revisar Carrinho
              </Button>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/pagamento"
                sx={{ fontWeight: 'bold' }}
              >
                Prosseguir para o Pagamento
              </Button>
            </Box>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
