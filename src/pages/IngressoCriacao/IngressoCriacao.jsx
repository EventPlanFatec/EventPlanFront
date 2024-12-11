import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography, Checkbox, FormControlLabel } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./IngressoCriacao.module.css";  // Importando o módulo CSS

const IngressoCriacao = () => {
  const navigate = useNavigate();
  const { eventoId } = useParams();  // Pega o ID do evento da URL para buscar o evento
  const [ingressoData, setIngressoData] = useState({
    valorIntegral: "",
    valorEstudante: "",
    valorVIP: "",
    nomeEvento: "", // Este campo será preenchido automaticamente
    dataIngresso: "", // Mudança para "Data do Ingresso"
    qrCode: "",
    vip: false,
    estudante: false,
    organizacaoId: "", // ID da organização
  });

  // Efeito para buscar o evento pelo ID e preencher o nome do evento
  useEffect(() => {
    const fetchEvento = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/eventos/${eventoId}`);
        if (response.status === 200) {
          setIngressoData((prevData) => ({
            ...prevData,
            nomeEvento: response.data.nomeEvento,  // Preenche o nome do evento
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar o evento", error);
      }
    };

    if (eventoId) {
      fetchEvento();
    }
  }, [eventoId]);

  // Atualiza os valores dos campos
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIngressoData({ ...ingressoData, [name]: value });
  };

  // Função para controlar os checkboxes VIP e Estudante
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setIngressoData({ ...ingressoData, [name]: checked });
  };

  // Envio dos dados para o backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/ingressos", ingressoData);
      if (response.status === 201) {
        navigate("/ingressos"); // Após a criação, redireciona para a lista de ingressos
      }
    } catch (error) {
      console.error("Erro ao criar ingresso", error);
    }
  };

  return (
    <Box sx={{ width: '50%',maxWidth: 2000, margin: '0 auto', padding: 3 }}>
      <Typography className={styles.title} variant="h4" gutterBottom >
        Criar Ingresso
      </Typography>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Valor Integral */}
        <TextField
          label="Valor Integral"
          name="valorIntegral"
          type="number"
          value={ingressoData.valorIntegral}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
        />

        {/* Valor para Estudante */}
        {ingressoData.estudante && (
          <TextField
            label="Valor para Estudante"
            name="valorEstudante"
            type="number"
            value={ingressoData.valorEstudante}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        )}

        {/* Valor VIP */}
        {ingressoData.vip && (
          <TextField
            label="Valor VIP"
            name="valorVIP"
            type="number"
            value={ingressoData.valorVIP}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        )}

       
        {/* Data do Ingresso */}
        <TextField
          label="Data do Ingresso"
          name="dataIngresso"
          type="date"
          value={ingressoData.dataIngresso}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
        />

       
        {/* Checkbox para Ingresso VIP */}
        <FormControlLabel
          control={
            <Checkbox
              checked={ingressoData.vip}
              onChange={handleCheckboxChange}
              name="vip"
              color="primary"
            />
          }
          label="Ingresso VIP"
        />

        {/* Checkbox para Ingresso Estudante */}
        <FormControlLabel
          control={
            <Checkbox
              checked={ingressoData.estudante}
              onChange={handleCheckboxChange}
              name="estudante"
              color="primary"
            />
          }
          label="Ingresso Estudante"
        />

        <Box mt={3} display="flex" justifyContent="space-between">
          <Button variant="outlined" color="secondary" onClick={() => navigate("/ingressos")}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Salvar Informações
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default IngressoCriacao;
