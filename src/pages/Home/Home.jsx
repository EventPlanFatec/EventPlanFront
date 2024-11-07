import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import CardEvento from '../../components/CardEvento/CardEvento';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import Carousel from '../../components/Carousel/Carousel';
import styles from './Home.module.css';

const Home = ({ preferences }) => {
  const [eventos, setEventos] = useState([]);
  const [filteredEventos, setFilteredEventos] = useState([]);

  useEffect(() => {
    const fetchEventos = async () => {
      const querySnapshot = await getDocs(collection(db, "Eventos"));
      const eventsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEventos(eventsList);
    };

    fetchEventos();
  }, []);

  useEffect(() => {
    if (preferences) {
      const filterEvents = eventos.filter(event => {
        const isEventTypeMatch = preferences.eventType === 'todos' || event.type === preferences.eventType;
        const isLocationMatch = !preferences.location || event.location === preferences.location;
        const isPriceMatch = preferences.priceRange === '0-50' ? event.price <= 50 :
          preferences.priceRange === '51-100' ? event.price > 50 && event.price <= 100 :
          preferences.priceRange === '101-200' ? event.price > 100 && event.price <= 200 :
          preferences.priceRange === '201-500' ? event.price > 200 && event.price <= 500 :
          preferences.priceRange === '500+' ? event.price > 500 : true;

        return isEventTypeMatch && isLocationMatch && isPriceMatch;
      });

      setFilteredEventos(filterEvents);
    } else {
      setFilteredEventos(eventos);
    }
  }, [preferences, eventos]);

  const carouselItems = [
    {
      image: "https://firebasestorage.googleapis.com/v0/b/eventplan-30036.appspot.com/o/Design01.svg?alt=media&token=e0cc518f-049b-4cbb-938e-dbeb7b877053"
    },
    {
      image: "https://firebasestorage.googleapis.com/v0/b/eventplan-30036.appspot.com/o/Design2.svg?alt=media&token=7518c2e1-ad68-428b-82db-64e5f020e96c"
    },
    {
      image: "https://firebasestorage.googleapis.com/v0/b/eventplan-30036.appspot.com/o/Design3.svg?alt=media&token=c2da9f55-7348-46ba-8095-af8f5ce8657e"
    }
  ];

  return (
    <Box>
      <Carousel items={carouselItems} />
      <Box className={styles.cardContainer}>
        {filteredEventos.slice(0, 6).map(event => (
          <CardEvento key={event.id} event={event} />
        ))}
      </Box>
      <Box className={styles.verMaisContainer}>
        <Link to="/EventList" style={{ textDecoration: 'none' }}>
          <Button variant="contained" className={styles.btn} aria-label="Ver Mais">
            VER MAIS
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default Home;
