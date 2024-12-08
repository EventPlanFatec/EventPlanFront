import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config"; // Importando a configuração do Firebase
import { collection, getDocs, doc, getDoc } from "firebase/firestore"; // Importando funções do Firestore
import { Button, Card, CardContent, Typography, Box, Snackbar, Alert } from "@mui/material"; 
import { useNavigate } from "react-router-dom";
import styles from "./EventosGerenciamento.module.css"; // Importando o módulo CSS
import { getAuth } from "firebase/auth";

const EventosGerenciamento = () => {
  const [events, setEvents] = useState([]); // Estado para armazenar os eventos
  const [loading, setLoading] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [userIdEvento, setUserIdEvento] = useState(null); // Variável para armazenar o UID do usuário
  const [cnpjEvento, setCnpjEvento] = useState(null); // Variável para armazenar o CNPJ da organização
  const navigate = useNavigate();

  // Função para buscar todos os eventos
  const fetchEvents = async () => {
    try {
      console.log("Buscando todos os eventos...");

      const eventosRef = collection(db, "Eventos"); // Referência para a coleção "Eventos"
      const querySnapshot = await getDocs(eventosRef); // Obter todos os documentos na coleção

      const eventosData = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Incluindo o ID do documento
        ...doc.data(), // Incluindo os dados do documento
      }));

      console.log("Eventos encontrados:", eventosData);
      setEvents(eventosData); // Atualiza o estado com os eventos encontrados
    } catch (error) {
      console.error("Erro ao carregar eventos", error);
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  // Função para buscar o CNPJ da organização usando o UID do usuário
  const fetchCNPJ = async (userId) => {
    const orgDocRef = doc(db, "organizacao", userId);
    const docSnap = await getDoc(orgDocRef);

    if (docSnap.exists()) {
      const orgData = docSnap.data();
      setCnpjEvento(orgData.cnpj); // Armazena o CNPJ no estado
    } else {
      console.error("Organização não encontrada para o usuário", userId);
    }
  };

  // Carregar dados ao montar o componente
  useEffect(() => {
    const user = getAuth().currentUser; // Obtendo o usuário logado
    if (user) {
      const userUid = user.uid;
      setUserIdEvento(userUid); // Armazena o UID do usuário
      fetchCNPJ(userUid); // Busca o CNPJ da organização
    }
    fetchEvents(); // Carrega os eventos quando o componente for montado
  }, []); // Recarrega apenas uma vez quando o componente for montado

  // Exibir mensagem de carregamento enquanto os dados estão sendo carregados
  if (loading) {
    return <Typography>Carregando eventos...</Typography>;
  }

  return (
    <Box className={styles.container}>
      <Typography className={styles.title} variant="h4" gutterBottom>
        Gerenciamento de Eventos
      </Typography>

      <Box mt={3}>
        {events.length === 0 ? (
          <Typography className={styles.noEventsMessage}>
            Nenhum evento encontrado.
          </Typography>
        ) : (
          events
            .filter((event) => event.cnpjOrganizacao === cnpjEvento) // Filtra os eventos que correspondem ao CNPJ da organização
            .map((event) => (
              <Card key={event.id} className={styles.eventCard} variant="outlined">
                <CardContent>
                  <Typography className={styles.eventTitle}>{event.nome}</Typography>
                  <Typography className={styles.eventCNPJ}>
                    {event.cnpjOrganizacao}
                  </Typography>
                  <Box className={styles.actions} mt={2}>
                    <Button
                      className={`${styles.actionButton} ${styles.editButton}`}
                      variant="contained"
                      onClick={() => navigate(`/editar-evento/${event.id}`)}
                    >
                      Editar Evento
                    </Button>
                    {/* Botão de Ingresso */}
                    <Button
                      className={`${styles.actionButton} ${styles.ingressoButton}`}
                      variant="contained"
                      onClick={() => navigate(`/criar-ingresso`)} // Navega para a página de compra de ingresso
                    >
                      Ingresso
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))
        )}
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

export default EventosGerenciamento;
