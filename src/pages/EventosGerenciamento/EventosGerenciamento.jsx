import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  listarEventos,
  salvarEvento,
  cancelarEvento,
  editarEvento,
} from "../../services/eventosService";
import CriarEvento from "../../components/CriarEvento/CriarEvento";

const EventosGerenciamento = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nomeEvento: "",
    tipo: "",
    descricao: "",
    dataInicio: "",
    dataFim: "",
    horarioInicio: "",
    horarioFim: "",
    lotacaoMaxima: 0,
    endereco: {
      tipoLogradouro: "",
      logradouro: "",
      numeroCasa: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
    },
    imagens: [],
    categoriaId: 0,
    tags: [],
    video: "",
    notaMedia: 0,
    genero: "",
    usuariosFinais: [],
    ingressos: [],
    organizacaoId: 0,
    isPrivate: false,
    senha: "",
    emailsConvidados: [],
  });
  const [editId, setEditId] = useState(null);

  const carregarEventos = async () => {
    setLoading(true);
    try {
      const data = await listarEventos();
      setEventos(data);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarEventos();
  }, []);

  const handleOpen = (evento = null) => {
    if (evento) {
      setFormData({
        nomeEvento: evento.nomeEvento,
        tipo: evento.tipo,
        descricao: evento.descricao,
        dataInicio: evento.dataInicio,
        dataFim: evento.dataFim,
        horarioInicio: evento.horarioInicio,
        horarioFim: evento.horarioFim,
        lotacaoMaxima: evento.lotacaoMaxima,
        endereco: evento.endereco,
        imagens: evento.imagens,
        categoriaId: evento.categoriaId,
        tags: evento.tags,
        video: evento.video,
        notaMedia: evento.notaMedia,
        genero: evento.genero,
        usuariosFinais: evento.usuariosFinais,
        ingressos: evento.ingressos,
        organizacaoId: evento.organizacaoId,
        isPrivate: evento.isPrivate,
        senha: evento.senha,
        emailsConvidados: evento.emailsConvidados,
      });
      setEditId(evento.eventoId);
    } else {
      setFormData({
        nomeEvento: "",
        tipo: "",
        descricao: "",
        dataInicio: "",
        dataFim: "",
        horarioInicio: "",
        horarioFim: "",
        lotacaoMaxima: 0,
        endereco: {
          tipoLogradouro: "",
          logradouro: "",
          numeroCasa: "",
          bairro: "",
          cidade: "",
          estado: "",
          cep: "",
        },
        imagens: [],
        categoriaId: 0,
        tags: [],
        video: "",
        notaMedia: 0,
        genero: "",
        usuariosFinais: [],
        ingressos: [],
        organizacaoId: 0,
        isPrivate: false,
        senha: "",
        emailsConvidados: [],
      });
      setEditId(null);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async (newData) => {
    try {
      if (editId) {
        await editarEvento(editId, newData);
      } else {
        await salvarEvento(newData);
      }
      carregarEventos();
      handleClose();
    } catch (error) {
      console.error("Erro ao salvar o evento:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await cancelarEvento(id);
      carregarEventos();
    } catch (error) {
      console.error("Erro ao cancelar o evento:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Gerenciamento de Eventos
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Novo Evento
      </Button>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : eventos.length > 0 ? (
              eventos.map((evento) => (
                <TableRow key={evento.eventoId}>
                  <TableCell>{evento.nomeEvento}</TableCell>
                  <TableCell>{evento.descricao}</TableCell>
                  <TableCell>
                    <Button
                      color="primary"
                      onClick={() => handleOpen(evento)}
                      style={{ marginRight: "10px" }}
                    >
                      Editar
                    </Button>
                    <Button color="error" onClick={() => handleDelete(evento.eventoId)}>
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Nenhum evento encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <CriarEvento
        open={open}
        onClose={handleClose}
        onSave={handleSave}
        formData={formData}
        setFormData={setFormData}
        editId={editId}
      />
    </Container>
  );
};

export default EventosGerenciamento;
