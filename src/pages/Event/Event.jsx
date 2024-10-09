import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Chat from '../../components/Chat/Chat';
import EventRating from '../../components/Avaliacao/Avaliacao';
import FavoriteEvents from '../../components/Favoritos/Favoritos';
import UploadImage from '../../components/UploadImage/UploadImage';
import ExportToCSV from '../../components/ExportToCsv/ExportToCsv';
import styles from './Event.module.css';

const Event = () => {
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [isFull, setIsFull] = useState(false);
  const [isOnWaitlist, setIsOnWaitlist] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchEventAndRatings = async () => {
      try {
        const eventResponse = await axios.get(`http://localhost:7151/api/events/${id}`);
        setEventData(eventResponse.data);
        if (eventResponse.data.ingressosVendidos >= eventResponse.data.lotacaoMaxima) {
          setIsFull(true);
        }

        const ratingsResponse = await axios.get(`http://localhost:7151/api/events/${id}/ratings`);
        const fetchedRatings = ratingsResponse.data;
        setRatings(fetchedRatings);
        const avgRating = calculateAverageRating(fetchedRatings);
        setAverageRating(avgRating);

        const waitlistResponse = await axios.get(`http://localhost:7151/api/events/${id}/lista-espera/user-id`);
        setIsOnWaitlist(!!waitlistResponse.data);
      } catch (error) {
        console.error('Error fetching event and ratings:', error);
      }
    };

    fetchEventAndRatings();
  }, [id]);

  const calculateAverageRating = (ratings) => {
    if (ratings.length === 0) {
      return 0;
    }

    const totalRating = ratings.reduce((acc, rating) => {
      const validRating = typeof rating.rating === 'number' && !isNaN(rating.rating) ? rating.rating : 0;
      return acc + validRating;
    }, 0);

    return totalRating / ratings.length;
  };

  const handleAddToWaitlist = async () => {
    try {
      await axios.post(`http://localhost:7151/api/events/${id}/lista-espera`, {
        usuarioFinalId: 'user-id',
      });
      setIsOnWaitlist(true);
      setFeedbackMessage('Você foi adicionado à lista de espera!');
      setIsError(false);
    } catch (error) {
      console.error('Error adding to waitlist:', error);
      setFeedbackMessage('Erro ao adicionar à lista de espera. Tente novamente.');
      setIsError(true);
    }
  };

  const handleRemoveFromWaitlist = async () => {
    try {
      await axios.delete(`http://localhost:7151/api/events/${id}/lista-espera/user-id`);
      setIsOnWaitlist(false);
      setFeedbackMessage('Você foi removido da lista de espera!');
      setIsError(false);
    } catch (error) {
      console.error('Error removing from waitlist:', error);
      setFeedbackMessage('Erro ao remover da lista de espera. Tente novamente.');
      setIsError(true);
    }
  };

  if (!eventData) return <div>Loading...</div>;

  return (
    <Container className={styles.container}>
      <Row>
        <Col>
          <div className={styles.imageContainer}>
            <img src={eventData.imgBanner} alt={eventData.nome} className={styles.eventImage} />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className={`${styles.description} ${styles.marginTop20}`}>
            <p>{eventData.descricao}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className={styles.dateVenue}>
            <p><FontAwesomeIcon icon={['far', 'calendar']} /> {eventData.data}</p>
            <p><FontAwesomeIcon icon={['fas', 'map-marker-alt']} /> {eventData.local}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={10}>
          <div className={styles.tickets}>
            <p><strong>Ingressos:</strong></p>
            <p>Ingressos a partir de R$ {eventData.valorMin}</p>
          </div>
        </Col>
        <Col md={2}>
          <div className={styles.cartIcon}>
            <FontAwesomeIcon icon="fa-solid fa-cart-shopping" />
          </div>
        </Col>
      </Row>
      {feedbackMessage && (
        <Row>
          <Col>
            <div className={`alert ${isError ? 'alert-danger' : 'alert-success'}`} role="alert">
              {feedbackMessage}
            </div>
          </Col>
        </Row>
      )}
      {isFull && !isOnWaitlist && (
        <Row>
          <Col>
            <Button onClick={handleAddToWaitlist} variant="warning">
              Adicionar à Lista de Espera
            </Button>
          </Col>
        </Row>
      )}
      {isFull && isOnWaitlist && (
        <Row>
          <Col>
            <Button onClick={handleRemoveFromWaitlist} variant="danger">
              Remover da Lista de Espera
            </Button>
          </Col>
        </Row>
      )}
      <Row>
        <Col>
          <Chat eventId={id} />
        </Col>
      </Row>
      <Row>
        <Col>
          <EventRating eventId={id} />
        </Col>
      </Row>
      <Row>
        <Col>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="tooltip-favorite">Adicionar aos Favoritos</Tooltip>}
          >
            <FavoriteEvents userId="user-id" eventId={id} eventName={eventData.nome} />
          </OverlayTrigger>
        </Col>
      </Row>
      <Row>
        <Col>
          <UploadImage />
        </Col>
      </Row>
      <Row>
        <Col>
          <ExportToCSV data={ratings} />
        </Col>
      </Row>
    </Container>
  );
};

export default Event;
