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

    const [errors, setErrors] = useState({});
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
        
        // Validações de formato e tamanho da imagem
        if (file) {
            const validFormats = ['image/jpeg', 'image/png'];
            if (!validFormats.includes(file.type)) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    imagem: 'A imagem deve ser JPEG ou PNG.',
                }));
                return;
            }
            if (file.size > 5 * 1024 * 1024) { // Limite de 5MB
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    imagem: 'A imagem deve ter no máximo 5MB.',
                }));
                return;
            }
        }

        setErrors((prevErrors) => ({ ...prevErrors, imagem: null })); // Limpa o erro se a imagem for válida

        setFormData({
            ...formData,
            imagem: file,
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.nomeEvento) newErrors.nomeEvento = 'Nome do evento é obrigatório.';
        if (!formData.data) newErrors.data = 'Data é obrigatória.';
        if (!formData.horario) newErrors.horario = 'Horário é obrigatório.';
        if (!formData.local) newErrors.local = 'Local é obrigatório.';
        if (!formData.descricao) newErrors.descricao = 'Descrição é obrigatória.';
        if (!formData.preco) newErrors.preco = 'Preço é obrigatório.';
        if (!formData.imagem) newErrors.imagem = 'Imagem é obrigatória.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Retorna true se não houver erros
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return; // Se o formulário não for válido, não prosseguir
        }
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
                {errors.nomeEvento && <span>{errors.nomeEvento}</span>}
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
                {errors.data && <span>{errors.data}</span>}
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
                {errors.horario && <span>{errors.horario}</span>}
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
                {errors.local && <span>{errors.local}</span>}
            </div>
            <div>
                <label>Descrição</label>
                <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    required
                />
                {errors.descricao && <span>{errors.descricao}</span>}
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
                {errors.preco && <span>{errors.preco}</span>}
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
                {errors.imagem && <span>{errors.imagem}</span>}
            </div>
            <button type="submit">Salvar Evento</button>
            <button type="button" onClick={handleCancel}>Cancelar</button> {/* Botão de Cancelar */}
        </form>
    );
};

export default CriarEvento;