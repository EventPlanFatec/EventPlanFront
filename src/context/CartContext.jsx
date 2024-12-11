import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Verificar se já existe um carrinho no sessionStorage e usá-lo
    const savedCart = sessionStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : []; // Retorna o carrinho salvo ou um array vazio
  });

  // Sempre que o carrinho for atualizado, salva a versão mais recente no sessionStorage
  useEffect(() => {
    if (cart.length > 0) {
      sessionStorage.setItem('cart', JSON.stringify(cart));
    } else {
      sessionStorage.removeItem('cart'); // Remove se o carrinho estiver vazio
    }
  }, [cart]);

  const addToCart = (item) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== itemId));
  };

  const updateItemQuantity = (itemId, quantity) => {
    setCart((prevCart) => prevCart.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateItemQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
