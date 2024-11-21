import React, { useState, useEffect, useRef } from 'react';
import { Button, Menu, MenuItem, Pagination, Box } from '@mui/material';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import CardEvento from '../../components/CardEvento/CardEvento';
import styles from './EventList.module.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(5);
  const [filter, setFilter] = useState('todos');
  const [anchorEl, setAnchorEl] = useState(null);
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null); // Armazenar a localização do usuário

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "Eventos"));
      const eventsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsList);
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    // Verifique se o mapa já foi inicializado
    if (mapRef.current) return; // Se o mapa já existir, não cria um novo

    // Inicializa o mapa
    const mapInstance = L.map('map', {
      center: [51.505, -0.09], // Posição inicial
      zoom: 13,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance);

    mapRef.current = mapInstance; // Armazene a instância do mapa no useRef

    // Obter a localização do usuário
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude }); // Atualiza a localização do usuário
          mapInstance.setView([latitude, longitude], 13); // Centraliza o mapa na posição do usuário
          L.marker([latitude, longitude]).addTo(mapInstance) // Marca a posição do usuário
            .bindPopup('Sua localização')
            .openPopup();
        },
        (error) => {
          console.log(error);
        }
      );
    }

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

  const handleLocateUser = () => {
    if (navigator.geolocation && userLocation) {
      mapRef.current.setView([userLocation.lat, userLocation.lng], 13);
      L.marker([userLocation.lat, userLocation.lng]).addTo(mapRef.current)
        .bindPopup('Sua localização')
        .openPopup();
    }
  };

  return (
    <Box className={styles.container}>
      <Button 
        variant="contained" 
        onClick={(e) => setAnchorEl(e.currentTarget)} 
        className={styles.dropdown}
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
      <div id="map" style={{ width: '100%', height: '400px' }}></div>
      <Button 
        variant="contained" 
        onClick={handleLocateUser} 
        className={styles.locateButton}
      >
        Localizar-me
      </Button>
    </Box>
  );
};

export default EventList;
