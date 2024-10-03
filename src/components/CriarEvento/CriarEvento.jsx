import React, { useState, useEffect } from 'react';
import '../../components/CriarEvento/CriarEvento.module.css';

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

  return (
    <form onSubmit={handleSubmit}>
      {/* Restante do formulário aqui */}
    </form>
  );
};

export default CriarEvento;
