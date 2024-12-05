import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from "./EventoCriacao.module.css";  // Importando o módulo CSS

const EventoCriacao = () => {
  const navigate = useNavigate();
  const [isFormVisible, setIsFormVisible] = useState(false); // Estado para controlar a exibição do formulário
  const [eventData, setEventData] = useState({
    nomeEvento: "",
    dataInicio: "",
    dataFim: "",
    horarioInicio: "",
    horarioFim: "",
    lotacaoMaxima: "",
    tipoLogradouro: "",
    logradouro: "",
    numeroCasa: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    tipo: "",
    imagem01: "",
    imagem02: "",
    imagem03: "",
    video: "",
    organizacaoId: "id-da-organizacao", // Substitua pelo ID real da organização
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/events",
        eventData
      );
      if (response.status === 201) {
        navigate("/eventos-gerenciamento"); // Redireciona para a página de gerenciamento
      }
    } catch (error) {
      console.error("Erro ao criar evento", error);
    }
  };

  const handleStartCreate = () => {
    setIsFormVisible(true); // Exibe o formulário
  };

  const handleCancel = () => {
    setIsFormVisible(false); // Esconde o formulário
    setEventData({
      nomeEvento: "",
      dataInicio: "",
      dataFim: "",
      horarioInicio: "",
      horarioFim: "",
      lotacaoMaxima: "",
      tipoLogradouro: "",
      logradouro: "",
      numeroCasa: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
      tipo: "",
      imagem01: "",
      imagem02: "",
      imagem03: "",
      video: "",
      organizacaoId: "id-da-organizacao",
    }); // Limpa os dados do formulário
  };

  // Função para navegar para a página de criação de ingresso
  const handleCreateIngresso = () => {
    navigate("/criar-ingresso"); // Substitua pela rota de criação de ingresso
  };

  return (
    <Box className={styles.container}>
      <Typography className={styles.title} variant="h4" gutterBottom>
        Criar Novo Evento
      </Typography>

      {/* Exibe o botão de iniciar a criação, caso o formulário não esteja visível */}
      {!isFormVisible ? (
        <Box mt={3}>
          <Button variant="contained" color="primary" onClick={handleStartCreate} fullWidth>
            Iniciar Criação do Evento
          </Button>
        </Box>
      ) : (
        // Exibe o formulário para criação de evento
        <form onSubmit={handleSubmit} className={styles.form}>
          <TextField
            label="Nome do Evento"
            name="nomeEvento"
            value={eventData.nomeEvento}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Data de Início"
            name="dataInicio"
            type="date"
            value={eventData.dataInicio}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Data de Fim"
            name="dataFim"
            type="date"
            value={eventData.dataFim}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Horário de Início"
            name="horarioInicio"
            type="time"
            value={eventData.horarioInicio}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Horário de Fim"
            name="horarioFim"
            type="time"
            value={eventData.horarioFim}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Lotação Máxima"
            name="lotacaoMaxima"
            type="number"
            value={eventData.lotacaoMaxima}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Tipo de Logradouro"
            name="tipoLogradouro"
            value={eventData.tipoLogradouro}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Logradouro"
            name="logradouro"
            value={eventData.logradouro}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Número da Casa"
            name="numeroCasa"
            value={eventData.numeroCasa}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Bairro"
            name="bairro"
            value={eventData.bairro}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Cidade"
            name="cidade"
            value={eventData.cidade}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Estado"
            name="estado"
            value={eventData.estado}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="CEP"
            name="cep"
            value={eventData.cep}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Tipo"
            name="tipo"
            value={eventData.tipo}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Imagem 01 (URL)"
            name="imagem01"
            value={eventData.imagem01}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Imagem 02 (URL)"
            name="imagem02"
            value={eventData.imagem02}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Imagem 03 (URL)"
            name="imagem03"
            value={eventData.imagem03}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Vídeo (URL)"
            name="video"
            value={eventData.video}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button variant="outlined" color="secondary" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Salvar Evento
            </Button>
          </Box>

          {/* Botão para Criar Ingresso */}
          <Box mt={3}>
            <Button variant="contained" color="secondary" onClick={handleCreateIngresso} fullWidth>
              Criar Ingresso
            </Button>
          </Box>
        </form>
      )}
    </Box>
  );
};

export default EventoCriacao;
