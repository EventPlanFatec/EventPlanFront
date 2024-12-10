import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import { toast } from 'react-toastify';
import { salvarIngresso, editarIngresso } from '../../services/IngressosService'; 

const IngressoForm = ({ eventoId, initialData, onClose, setIngressos }) => {
  const [formData, setFormData] = useState({
    tipo: '',
    preco: '',
    quantidade: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        tipo: initialData.tipo,
        preco: initialData.preco,
        quantidade: initialData.quantidade
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const { tipo, preco, quantidade } = formData;
    if (!tipo || !preco || !quantidade) {
      toast.error('Todos os campos são obrigatórios.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const ingressoData = {
        eventoId,
        tipo: formData.tipo,
        preco: parseFloat(formData.preco),
        quantidade: parseInt(formData.quantidade)
      };

      if (initialData) {
        // Edição de ingresso
        await editarIngresso(initialData.id, ingressoData);
        toast.success('Ingresso atualizado com sucesso!');
      } else {
        // Criação de ingresso
        const novoIngresso = await salvarIngresso(ingressoData);
        toast.success('Ingresso criado com sucesso!');
        setIngressos(prev => [...prev, novoIngresso]); // Atualiza a lista de ingressos
      }

      onClose();
    } catch (error) {
      console.error('Erro ao salvar ingresso:', error);
      toast.error('Falha ao salvar ingresso. Tente novamente.');
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <TextField
        label="Tipo"
        name="tipo"
        value={formData.tipo}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Preço"
        name="preco"
        type="number"
        value={formData.preco}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Quantidade"
        name="quantidade"
        type="number"
        value={formData.quantidade}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        fullWidth
        style={{ marginTop: '16px' }}
      >
        {initialData ? 'Salvar Alterações' : 'Criar Ingresso'}
      </Button>
    </form>
  );
};

export default IngressoForm;
