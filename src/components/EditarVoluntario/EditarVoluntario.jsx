import React, { useState } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const EditarVoluntario = ({ open, onClose, volunteer, onUpdate }) => {
  const [nome, setNome] = useState(volunteer.nome);
  const [email, setEmail] = useState(volunteer.email);
  const [funcao, setFuncao] = useState(volunteer.funcao);

  const handleUpdate = () => {
    const updatedVolunteer = { ...volunteer, nome, email, funcao };
    onUpdate(updatedVolunteer);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar Voluntário</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nome"
          fullWidth
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Email"
          fullWidth
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Função"
          fullWidth
          value={funcao}
          onChange={(e) => setFuncao(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleUpdate} color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditarVoluntario;
