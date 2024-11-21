import { useState, useEffect } from 'react';
import { Button, Menu, MenuItem, TextField, Box } from '@mui/material';
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
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "Eventos"));
      const eventsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsList);
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchSearchQuery = (
      (event.nome && event.nome.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (event.descricao && event.descricao.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    const matchFilter = filter === 'todos' || event.tipo === filter;
    return matchSearchQuery && matchFilter;
  });

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const handleSelect = (event) => {
    setFilter(event);
    setCurrentPage(1);
    setAnchorEl(null);
  };

  return (
    <Box className={styles.container}>
      <Box display="flex" alignItems="center" mb={2}>
        <TextField
          label="Buscar eventos"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginRight: '10px' }}
          size="small"
        />
        <Button 
          variant="contained" 
          onClick={(e) => setAnchorEl(e.currentTarget)} 
          size="small"
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
      </Box>
      <div className={styles.cardContainer}>
        {currentEvents.map(event => (
          <CardEvento key={event.id} event={event} />
        ))}
      </div>
    </Box>
  );
};

export default EventList;
