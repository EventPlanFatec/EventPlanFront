import React from 'react';
import CriarEvento from '../../components/CriarEvento/CriarEvento';
import { salvarEvento } from '../../../src/services/eventosService';

const EventosPage = () => {
  const handleSave = async (formData) => {
    try {
      await salvarEvento(formData);
      alert('Evento criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar evento:', error);
    }
  };

  return (
    <div className="eventos-page">
      <h1>Criar Novo Evento</h1>
      <CriarEvento onSave={handleSave} />
    </div>
  );
};

export default EventosPage;
