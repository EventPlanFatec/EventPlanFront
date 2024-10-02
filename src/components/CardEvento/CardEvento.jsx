import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import styles from './CardEvento.module.css';

const CardEvento = ({ event }) => {
  const iconSize = "1.25rem";

  return (
    <Link to={`/event/${event.id}`} className={styles.cardLink}>
      <Card className={styles.card}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <div className={styles.image}>
              <img src={event.img} alt="Imagem do evento" className={styles.eventImage} />
            </div>
          </Grid>
          <Grid item xs={12} md={8}>
            <CardContent>
              <Typography variant="h6" className={styles.eventTitle}>
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
