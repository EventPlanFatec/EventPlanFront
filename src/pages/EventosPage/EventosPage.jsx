import React, { useState, useEffect } from 'react';
import CriarEvento from '../../components/CriarEvento/EventoForm';
import { salvarEvento, listarEventos, cancelarEvento } from '../../../src/services/eventosService';

const EventosPage = () => {
  const [eventos, setEventos] = useState([]);
  const isAdmin = true;

  useEffect(() => {
    const fetchEventos = async () => {
      const eventosData = await listarEventos();
      if (Array.isArray(eventosData)) {
        setEventos(eventosData);
      }
    };
    fetchEventos();
  }, []);

  const handleSave = async (formData) => {
    try {
      await salvarEvento(formData);
      alert('Evento criado com sucesso!');
      const eventosData = await listarEventos();
      setEventos(eventosData);
    } catch (error) {
      console.error('Erro ao criar evento:', error);
    }
  };

  const handleCancelEvent = async (id) => {
    try {
      await cancelarEvento(id);
      setEventos(eventos.filter(evento => evento.id !== id));
      alert('Evento cancelado com sucesso!');
    } catch (error) {
      console.error('Erro ao cancelar evento:', error);
    }
  };

  return (
    <div className="eventos-page">
      <CriarEvento onSave={handleSave} />
      {eventos.map(evento => (
        <div key={evento.id}>
          <h3>{evento.nome}</h3>
          {isAdmin && (
            <button onClick={() => handleCancelEvent(evento.id)}>
              Cancelar Evento
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default EventosPage;
