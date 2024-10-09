import React, { useState, useEffect } from 'react';
import { Button, Menu, MenuItem, Pagination, Box } from '@mui/material';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import CardEvento from '../../components/CardEvento/CardEvento';
import styles from './EventList.module.css';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(5);
  const [filter, setFilter] = useState('todos');
  const [anchorEl, setAnchorEl] = useState(null);

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
  const handleSelect = (event) => {
    setFilter(event);
    setCurrentPage(1);
    setAnchorEl(null);
  };

  return (
    <Box className={styles.container}>
      <Button 
        variant="contained" 
        onClick={(e) => setAnchorEl(e.currentTarget)} 
        className={styles.dropdown}
        size="small" // Set button size to small
      >
        Filtro: {filter}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {['todos', 'show', 'games', 'comedia', 'curso'].map(tipo => (
          <MenuItem key={tipo} onClick={() => handleSelect(tipo)}>
            {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
          </MenuItem>
        ))}
      </Menu>
      <div className={styles.cardContainer}>
        {currentEvents.map(event => (
          <CardEvento key={event.id} event={event} />
        ))}
      </div>
      <Pagination 
        count={Math.ceil(filteredEvents.length / eventsPerPage)} 
        page={currentPage} 
        onChange={(e, page) => paginate(page)} 
        className={styles.paginationContainer}
      />
    </Box>
  );
};

export default EventList;
