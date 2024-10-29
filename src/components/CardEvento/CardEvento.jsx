import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, CardContent, CardMedia, Typography, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import styles from './CardEvento.module.css';

const CardEvento = ({ event }) => {
  const iconSize = "1.25rem";

  return (
    <Link to={`/event/${event.id}`} className={styles.cardLink}>
      <Card className={styles.card}>
        <Grid container>
          <Grid item xs={12} md={5} className={styles.cardImageContainer}>
            <CardMedia
              component="img"
              image={event.img}
              alt="Imagem do evento"
              className={styles.cardImage}
            />
          </Grid>
          <Grid item xs={12} md={7} className={styles.cardContentContainer}>
            <CardContent>
              <Typography variant="h6" className={styles.cardTitle}>
                {event.nome}
              </Typography>
              <div className={styles.cardInfo}>
                <Typography variant="body2">
                  <FontAwesomeIcon icon="fa-regular fa-calendar" style={{ fontSize: iconSize, marginRight: '8px' }} />
                  {event.data} <br /> {event.horario}
                </Typography>
                <Typography variant="body2">
                  <FontAwesomeIcon icon="fa-regular fa-map" style={{ fontSize: iconSize, marginRight: '8px' }} />
                  {event.local}
                </Typography>
              </div>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Link>
  );
}

export default CardEvento;
