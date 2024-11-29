import { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useCart } from '../context/CartContext';

export const useEventData = (eventId) => {
  const [eventData, setEventData] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchEventAndRatings = async () => {
      try {
        const eventRef = doc(db, 'Eventos', eventId);
        const eventSnap = await getDoc(eventRef);
        if (eventSnap.exists()) {
          setEventData(eventSnap.data());
        }

        const ratingsCollection = collection(db, `Eventos/${eventId}/ratings`);
        const ratingsSnapshot = await getDocs(ratingsCollection);
        const fetchedRatings = ratingsSnapshot.docs.map((doc) => doc.data());

        // Limita o número de avaliações exibidas
        const limitedRatings = fetchedRatings.slice(0, 3);

        setRatings(limitedRatings);
        setAverageRating(
          limitedRatings.reduce((sum, r) => sum + r.rating, 0) / limitedRatings.length || 0
        );
      } catch (error) {
        console.error('Erro ao buscar dados do evento:', error);
      }
    };

    fetchEventAndRatings();
  }, [eventId]);

  return { eventData, ratings, averageRating };
};

export const useTicketSelection = () => {
  const [ticketType, setTicketType] = useState('');
  const [ticketQuantity, setTicketQuantity] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { cart, addToCart } = useCart();

  const handleTicketTypeChange = (event) => {
    setTicketType(event.target.value);
  };

  const handleTicketQuantityChange = (event) => {
    setTicketQuantity(Number(event.target.value));
  };

  const handleAddToCart = (eventPrice) => {
    if (ticketType && ticketQuantity > 0) {
      const newItem = {
        type: ticketType,
        quantity: ticketQuantity,
        price: eventPrice * ticketQuantity,
      };

      addToCart(newItem);
      setTicketType('');
      setTicketQuantity(0);
      setShowConfirmation(true);

      setTimeout(() => {
        setShowConfirmation(false);
      }, 2000); // Reduzido para 2 segundos
    }
  };

  const getCartSummary = () => {
    if (cart.length === 0) return 'Carrinho vazio';
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
    return `${totalQuantity} ingresso(s) - R$ ${totalPrice.toFixed(2)}`;
  };

  return {
    ticketType,
    ticketQuantity,
    showConfirmation,
    handleTicketTypeChange,
    handleTicketQuantityChange,
    handleAddToCart,
    getCartSummary,
  };
};
