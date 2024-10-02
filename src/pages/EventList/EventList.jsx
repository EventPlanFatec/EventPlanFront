import React, { useState, useEffect } from 'react';
import { MenuItem, Select, Typography, Pagination, Box } from '@mui/material';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import CardEvento from '../../components/CardEvento/CardEvento';
import styles from './EventList.module.css';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(5);
  const [filter, setFilter] = useState('todos');

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "Eventos"));
      const eventsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsList);
    };

    fetchEvents();
  }, []);

  const filteredEvents = filter === 'todos' ? events : events.filter(event => event.tipo === filter);

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSelect = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1);
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h6">Filtro: {filter}</Typography>
      <Select
        value={filter}
        onChange={handleSelect}
        className={styles.dropdown}
        variant="outlined"
      >
        <MenuItem value="todos">Todos</MenuItem>
        <MenuItem value="show">Show e Música</MenuItem>
        <MenuItem value="games">Games e Tecnologia</MenuItem>
        <MenuItem value="comedia">Comédia e StandUp</MenuItem>
        <MenuItem value="curso">Art</MenuItem>
      </Select>
      <Box className={styles.cardContainer}>
        {currentEvents.map(event => (
          <CardEvento key={event.id} event={event} />
        ))}
      </Box>
      <Pagination
        count={Math.ceil(filteredEvents.length / eventsPerPage)}
        page={currentPage}
        onChange={(event, page) => paginate(page)}
        className={styles.paginationContainer}
      />
    </Box>
  );
};

export default EventList;
