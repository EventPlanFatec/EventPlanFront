import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, CardContent, Typography, Box, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./IngressoGerenciamento.module.css";  // Importando o módulo CSS

const IngressoGerenciamento = () => {
  const { eventId } = useParams(); // Captura o eventId da URL
  const [ingressos, setIngressos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIngresso, setSelectedIngresso] = useState(null);
  const navigate = useNavigate();

  // Função para buscar os ingressos de um evento
  const fetchIngressos = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/tickets/event/${eventId}`);
      setIngressos(response.data);
    } catch (error) {
      console.error("Erro ao carregar ingressos", error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar ingressos quando o componente for montado
  useEffect(() => {
    fetchIngressos();
  }, [eventId]);

  // Função para selecionar um ingresso para edição
  const handleEditIngresso = (ingresso) => {
    setSelectedIngresso(ingresso);
  };

  // Função para salvar as alterações do ingresso
  const handleSaveIngresso = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/tickets/${selectedIngresso.ingressoId}`, selectedIngresso);
      if (response.status === 200) {
        fetchIngressos(); // Recarregar os ingressos após a atualização
        setSelectedIngresso(null); // Limpar a seleção
      }
    } catch (error) {
      console.error("Erro ao salvar ingresso", error);
    }
  };

  // Exibir mensagem de carregamento enquanto os dados estão sendo carregados
  if (loading) {
    return <Typography>Carregando ingressos...</Typography>;
  }

  return (
    <Box className={styles.container}>
      <Typography className={styles.title} variant="h4" gutterBottom>
        Gerenciamento de Ingressos
      </Typography>

      <Box mt={3}>
        {ingressos.length === 0 ? (
          <Typography className={styles.noEventsMessage}>
            Nenhum ingresso encontrado.
          </Typography>
        ) : (
          ingressos.map((ingresso) => (
            <Card key={ingresso.ingressoId} className={styles.eventCard} variant="outlined">
              <CardContent>
                <Typography className={styles.eventTitle}>Ingresso: {ingresso.nomeEvento}</Typography>
                <Typography className={styles.eventDate}>Valor: {ingresso.valor}</Typography>
                <Typography className={styles.eventDate}>Data: {ingresso.data}</Typography>
                <Button
                  variant="contained"
                  onClick={() => handleEditIngresso(ingresso)}
                >
                  Editar
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </Box>

      {selectedIngresso && (
        <Box mt={4}>
          <Typography variant="h6">Editar Ingresso</Typography>
          <TextField
            label="Nome do Evento"
            value={selectedIngresso.nomeEvento}
            onChange={(e) => setSelectedIngresso({ ...selectedIngresso, nomeEvento: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Valor"
            value={selectedIngresso.valor}
            onChange={(e) => setSelectedIngresso({ ...selectedIngresso, valor: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Data"
            value={selectedIngresso.data}
            onChange={(e) => setSelectedIngresso({ ...selectedIngresso, data: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="QR Code"
            value={selectedIngresso.qrCode}
            onChange={(e) => setSelectedIngresso({ ...selectedIngresso, qrCode: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="VIP"
            value={selectedIngresso.vip ? "Sim" : "Não"}
            onChange={(e) => setSelectedIngresso({ ...selectedIngresso, vip: e.target.value === "Sim" })}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            onClick={handleSaveIngresso}
            sx={{ marginTop: 2 }}
          >
            Salvar Alterações
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default IngressoGerenciamento;
