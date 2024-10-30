import React, { useState } from 'react';
import { TextField, Button, Typography, Grid, Card, CardContent } from '@mui/material';

const AdicionarVoluntario = ({ onAdicionarVoluntario }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [funcao, setFuncao] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const novoVoluntario = { nome, email, funcao };
    onAdicionarVoluntario(novoVoluntario);
    setNome('');
    setEmail('');
    setFuncao('');
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Adicionar Voluntário
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome"
                variant="outlined"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Função"
                variant="outlined"
                value={funcao}
                onChange={(e) => setFuncao(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Adicionar Voluntário
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdicionarVoluntario;
