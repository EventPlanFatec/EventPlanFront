import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import CardEvento from '../../components/CardEvento/CardEvento';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import styles from './Home.module.css';

const Home = () => {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const fetchEventos = async () => {
      const querySnapshot = await getDocs(collection(db, "Eventos"));
      const eventsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEventos(eventsList);
    };

    fetchEventos();
  }, []);

  return (
    <Box>
      <Box className={styles.cardContainer}>
        {eventos.slice(0, 6).map(event => (
          <CardEvento key={event.id} event={event} />
        ))}
      </Box>
      <Box className={styles.verMaisContainer}>
        <Link to="/EventList" style={{ textDecoration: 'none' }}>
          <Button 
            variant="contained" 
            className={styles.btn} 
            aria-label="Ver Mais" 
          >
            VER MAIS
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default Home;
