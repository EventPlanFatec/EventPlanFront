import React, { useState, useEffect } from 'react';
import CriarEvento from '../../components/CriarEvento/CriarEvento';
import EventoItem from '../../components/EventoItem';
import { salvarEvento, obterEventos, cancelarEvento } from '../../../src/services/eventosService';

const EventosPage = () => {
  const [eventos, setEventos] = useState([]);

  const handleSave = async (formData) => {
    try {
      await salvarEvento(formData);
      alert('Evento criado com sucesso!');
      fetchEventos();
    } catch (error) {
      console.error('Erro ao criar evento:', error);
    }
  };

  const fetchEventos = async () => {
    try {
      const eventosData = await obterEventos();
      setEventos(eventosData);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelarEvento(id);
      setEventos(eventos.filter(evento => evento.id !== id));
      alert('Evento cancelado com sucesso!');
    } catch (error) {
      console.error('Erro ao cancelar evento:', error);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  return (
    <div className="eventos-page">
      <h1>Criar Novo Evento</h1>
      <CriarEvento onSave={handleSave} />
      <h2>Eventos Criados</h2>
      {eventos.map(evento => (
        <EventoItem key={evento.id} evento={evento} onCancel={handleCancel} isAdmin={true} />
      ))}
    </div>
  );
};

export default EventosPage;
