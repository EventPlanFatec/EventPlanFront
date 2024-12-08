import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { db } from '../../firebase/config';
import { collection, addDoc, getDocs, orderBy, query, limit, doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth'; // Para pegar o UID do usuário autenticado

const EventoCriacao = () => {
  const navigate = useNavigate();
  const [evento, setEvento] = useState({
    nome: '',
    dataInicio: '',
    dataFim: '',
    horarioInicio: '',
    horarioFim: '',
    local: '',
    descricao: '',
    userUID: '',  // Novo campo para UID do usuário
    cnpjOrganizacao: '', // Novo campo para CNPJ da organização
    eventoId: '' // Novo campo para EventoId
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvento({ ...evento, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Obtendo o UID do usuário autenticado
    const user = getAuth().currentUser;
    if (!user) {
      console.error("Usuário não autenticado.");
      return;
    }
    const userUID = user.uid; // UID do usuário

    try {
      // Buscando o CNPJ da organização usando o UID
      const orgRef = doc(db, 'organizacao', userUID); // Documento da organização com o UID do usuário
      const orgDoc = await getDoc(orgRef);

      if (orgDoc.exists()) {
        const cnpjOrganizacao = orgDoc.data().cnpj; // Recuperando o CNPJ da organização
        console.log('CNPJ da Organização: ', cnpjOrganizacao);  // Verifique o CNPJ aqui

        // Buscando o último evento para incrementar o EventoId
        const eventosRef = collection(db, 'Eventos');
        const eventosQuery = query(eventosRef, orderBy('eventoId', 'desc'), limit(1));
        const querySnapshot = await getDocs(eventosQuery);

        let ultimoEventoId = 0;
        if (!querySnapshot.empty) {
          const ultimoEvento = querySnapshot.docs[0].data();
          ultimoEventoId = parseInt(ultimoEvento.eventoId) || 0;
          console.log('Último EventoId encontrado: ', ultimoEventoId); // Verifique o EventoId aqui
        }

        const novoEventoId = ultimoEventoId + 1;
        console.log('Novo EventoId: ', novoEventoId); // Verifique o novo EventoId aqui

        // Adicionando o evento no Firestore com UID, CNPJ e EventoId
        const eventoComDadosAdicionais = {
          ...evento,
          userUID: userUID,         // UID do usuário
          cnpjOrganizacao: cnpjOrganizacao, // CNPJ da organização
          eventoId: novoEventoId.toString(),  // EventoId incrementado
        };

        // Criando o nome do documento como "cnpjOrganizacao+eventoId"
        const documentName = cnpjOrganizacao + novoEventoId;

        // Adicionando o evento na coleção "Eventos" do Firestore com o nome do documento
        await setDoc(doc(db, 'Eventos', documentName), eventoComDadosAdicionais);

        console.log('Evento criado com ID: ', documentName);

        // Redirecionando para a página de gerenciamento de eventos após salvar
        navigate('/manage-events');  // Ou o caminho que você quiser
      } else {
        console.error('Organização não encontrada para o UID fornecido.');
      }
    } catch (e) {
      console.error('Erro ao buscar CNPJ da organização ou evento: ', e);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Criar Evento
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Nome do Evento"
          name="nome"
          value={evento.nome}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Data de Início"
          name="dataInicio"
          type="date"
          value={evento.dataInicio}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
        />
        <TextField
          label="Data de Fim"
          name="dataFim"
          type="date"
          value={evento.dataFim}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
        />
        <TextField
          label="Horário de Início"
          name="horarioInicio"
          type="time"
          value={evento.horarioInicio}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Horário de Fim"
          name="horarioFim"
          type="time"
          value={evento.horarioFim}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Local"
          name="local"
          value={evento.local}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Descrição"
          name="descricao"
          value={evento.descricao}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          multiline
          rows={4}
        />

        

        <Box sx={{ marginTop: 2 }}>
          <Button variant="contained" color="primary" type="submit">
            Criar Evento
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EventoCriacao;
