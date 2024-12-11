import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config"; // Importando a configuração do Firebase
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Funções do Firestore para manipulação de dados
import { Button, TextField, Box, Typography, Snackbar, Alert } from "@mui/material"; 
import { useNavigate, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import styles from "./EditarEvento.module.css"; // Importando o módulo CSS

const EditarEvento = () => {
  const [evento, setEvento] = useState({
    nome: "",
    cnpjOrganizacao: "",
    dataInicio: "",
    dataFim: "",
    horarioInicio: "",
    horarioFim: "",
    lotacaoMaxima: "",
    tipo: "",
    imagem: "", 
    genero: "",
  });
  const [loading, setLoading] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // Pegando o ID do evento da URL

  // Função para carregar os dados do evento
  const fetchEvento = async (eventId) => {
    try {
      const eventoRef = doc(db, "Eventos", eventId); // Referência para o evento
      const docSnap = await getDoc(eventoRef);

      if (docSnap.exists()) {
        setEvento(docSnap.data()); // Preenche os dados do evento no estado
      } else {
        console.error("Evento não encontrado!");
        setSnackbarMessage('Evento não encontrado');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        navigate("/manage-events"); // Redireciona caso não encontre o evento
      }
    } catch (error) {
      console.error("Erro ao buscar evento", error);
      setSnackbarMessage('Erro ao carregar evento');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  // Função para salvar as alterações do evento
  const saveEvento = async () => {
    try {
      const eventoRef = doc(db, "Eventos", id); // Referência para o evento
      await updateDoc(eventoRef, evento); // Atualiza o evento no Firestore

      setSnackbarMessage('Evento atualizado com sucesso!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      navigate("/manage-events"); // Redireciona para a página de gerenciamento de eventos
    } catch (error) {
      console.error("Erro ao atualizar evento", error);
      setSnackbarMessage('Erro ao atualizar evento');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  // Carregar os dados do evento quando o componente for montado
  useEffect(() => {
    fetchEvento(id); // Chama a função para carregar os dados do evento
  }, [id]); // Recarrega caso o ID do evento mude

  // Exibir mensagem de carregamento enquanto os dados estão sendo carregados
  if (loading) {
    return <Typography>Carregando dados do evento...</Typography>;
  }

  return (
    <Box className={styles.container}>
      <Typography className={styles.title} variant="h4" gutterBottom>
        Editar Evento
      </Typography>

      <Box mt={3}>
        <TextField
          label="Nome do Evento"
          fullWidth
          margin="normal"
          value={evento.nome}
          onChange={(e) => setEvento({ ...evento, nome: e.target.value })}
        />
        <TextField
          label="CNPJ da Organização"
          fullWidth
          margin="normal"
          value={evento.cnpjOrganizacao}
          InputProps={{
            readOnly: true, // Torna o campo somente leitura
          }}
        />
        <TextField
          label="Data de Início"
          type="date"
          fullWidth
          margin="normal"
          value={evento.dataInicio}
          onChange={(e) => setEvento({ ...evento, dataInicio: e.target.value })}
        />
        <TextField
          label="Data de Fim"
          type="date"
          fullWidth
          margin="normal"
          value={evento.dataFim}
          onChange={(e) => setEvento({ ...evento, dataFim: e.target.value })}
        />
        <TextField
          label="Horário de Início"
          type="time"
          fullWidth
          margin="normal"
          value={evento.horarioInicio}
          onChange={(e) => setEvento({ ...evento, horarioInicio: e.target.value })}
        />
        <TextField
          label="Horário de Fim"
          type="time"
          fullWidth
          margin="normal"
          value={evento.horarioFim}
          onChange={(e) => setEvento({ ...evento, horarioFim: e.target.value })}
        />
        <TextField
          label="Lotação Máxima"
          type="number"
          fullWidth
          margin="normal"
          value={evento.lotacaoMaxima}
          onChange={(e) => setEvento({ ...evento, lotacaoMaxima: e.target.value })}
        />
        <TextField
          label="Tipo de Evento"
          fullWidth
          margin="normal"
          value={evento.tipo}
          onChange={(e) => setEvento({ ...evento, tipo: e.target.value })}
        />

        <TextField
          label="Gênero"
          fullWidth
          margin="normal"
          value={evento.genero}
          onChange={(e) => setEvento({ ...evento, genero: e.target.value })}
        />
      </Box>

      <Box mt={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={saveEvento}
        >
          Salvar Alterações
        </Button>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditarEvento;
