import React, { useState, useEffect } from 'react';
import './CriarEvento.module.css'; // Importar estilos se necessário
import { useNavigate } from 'react-router-dom';


const CriarEvento = ({ onSave }) => {
    const [formData, setFormData] = useState({
      nomeEvento: '',
      data: '',
      horario: '',
      local: '',
      descricao: '',
      preco: '',
      imagem: null,
    });
  
    const navigate = useNavigate(); // Hook para navegar entre páginas
  
    useEffect(() => {
      const savedData = JSON.parse(localStorage.getItem('eventoFormData'));
      if (savedData) {
        setFormData(savedData);
      }
    }, []);
  
    useEffect(() => {
      localStorage.setItem('eventoFormData', JSON.stringify(formData));
    }, [formData]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };
  
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        imagem: file,
      });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData); // Chamar função de salvamento externa
      localStorage.removeItem('eventoFormData');
    };
  
    // Função para cancelar e limpar o formulário
    const handleCancel = () => {
      setFormData({
        nomeEvento: '',
        data: '',
        horario: '',
        local: '',
        descricao: '',
        preco: '',
        imagem: null,
      });
      localStorage.removeItem('eventoFormData'); // Limpar dados do localStorage
      navigate('/eventos'); // Redirecionar para a página de eventos
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome do Evento</label>
          <input
            type="text"
            name="nomeEvento"
            value={formData.nomeEvento}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Data</label>
          <input
            type="date"
            name="data"
            value={formData.data}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Horário</label>
          <input
            type="time"
            name="horario"
            value={formData.horario}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Local</label>
          <input
            type="text"
            name="local"
            value={formData.local}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Descrição</label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Preço</label>
          <input
            type="number"
            name="preco"
            value={formData.preco}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Imagem</label>
          <input
            type="file"
            name="imagem"
            accept="image/jpeg,image/png"
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit">Salvar Evento</button>
        <button type="button" onClick={handleCancel}>Cancelar</button> {/* Botão de Cancelar */}
      </form>
    );
  };
  
  export default CriarEvento;