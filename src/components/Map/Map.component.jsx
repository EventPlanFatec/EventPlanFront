import { useEffect } from 'react';
import L from 'leaflet';  
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
  useEffect(() => {
    const map = L.map('map', {
      center: [51.505, -0.09],  
      zoom: 13,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    L.marker([51.5, -0.09]).addTo(map)
      .bindPopup('<b>Meu Local</b><br>Esse é o meu marcador!')
      .openPopup();
  }, []);

  return (
    <div>
      <h2>Mapa com OpenStreetMap e Leaflet</h2>
      <div id="map" style={{ height: '400px', width: '100%' }}></div>
    </div>
  );
};

export default MapComponent;
