import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import CardEvento from '../../components/CardEvento/CardEvento';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import styles from './Home.module.css';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

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
      <Carousel>
        <div>
          <img
            className={styles.carouselImage}
            src="https://firebasestorage.googleapis.com/v0/b/eventplan-30036.appspot.com/o/Design01.svg?alt=media&token=e0cc518f-049b-4cbb-938e-dbeb7b877053"
            alt="Primeiro slide"
          />
        </div>
        <div>
          <img
            className={styles.carouselImage}
            src="https://firebasestorage.googleapis.com/v0/b/eventplan-30036.appspot.com/o/Design2.svg?alt=media&token=7518c2e1-ad68-428b-82db-64e5f020e96c"
            alt="Segundo slide"
          />
        </div>
        <div>
          <img
            className={styles.carouselImage}
            src="https://firebasestorage.googleapis.com/v0/b/eventplan-30036.appspot.com/o/Design3.svg?alt=media&token=c2da9f55-7348-46ba-8095-af8f5ce8657e"
            alt="Terceiro slide"
          />
        </div>
      </Carousel>
      <Box className={styles.videoContainer}>
        <iframe
          className={styles.video}
          width="100%"
          height="auto"
          src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
          title="Trailer do Show do Roberto Carlos"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </Box>
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
