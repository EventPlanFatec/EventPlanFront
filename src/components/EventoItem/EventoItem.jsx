import React from 'react';
import { Button } from '@mui/material';

const EventoItem = ({ evento, onCancel, isAdmin }) => {
  const handleCancel = () => {
    if (window.confirm('Você tem certeza que deseja cancelar este evento?')) {
      onCancel(evento.id);
    }
  };

  return (
    <div>
      <h3>{evento.nomeEvento}</h3>
      <p>{evento.data}</p>
      {isAdmin && (
        <Button variant="contained" color="secondary" onClick={handleCancel}>
          Cancelar Evento
        </Button>
      )}
    </div>
  );
};

export default EventoItem;
