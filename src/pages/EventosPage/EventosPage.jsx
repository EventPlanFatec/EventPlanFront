import React from 'react';
import CriarEvento from '../../components/CriarEvento/CriarEvento'; // Importa o componente de criação de eventos
import { salvarEvento } from '../../../src/services/eventosService'; // Requisição para API

const EventosPage = () => {
  const handleSave = async (formData) => {
    try {
      // Chama a função do service para salvar o evento no backend
      await salvarEvento(formData);
      alert('Evento criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar evento:', error);
    }
  };

  return (
    <div>
      <h1>Criar Novo Evento</h1>
      <CriarEvento onSave={handleSave} />
    </div>
  );
};

export default EventosPage;
