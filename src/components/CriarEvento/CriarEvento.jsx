import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, InputLabel, Checkbox, FormControlLabel } from '@mui/material'; 
import { useNavigate } from 'react-router-dom';
import './CriarEvento.module.css'; 

const CriarEvento = ({ onSave }) => {
    const [formData, setFormData] = useState({
        nomeEvento: '',
        data: '',
        horario: '',
        local: '',
        descricao: '',
        preco: '',
        imagem: null,
        emailsConvidados: '',
        senha: '', // Adicionando o campo de senha
    });

    const [isEventoPrivado, setIsEventoPrivado] = useState(false); // Estado para controle do evento privado
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

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

        if (file) {
            const validFormats = ['image/jpeg', 'image/png'];
            if (!validFormats.includes(file.type)) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    imagem: 'A imagem deve ser JPEG ou PNG.',
                }));
                return;
            }
            if (file.size > 5 * 1024 * 1024) { 
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    imagem: 'A imagem deve ter no máximo 5MB.',
                }));
                return;
            }
        }

        setErrors((prevErrors) => ({ ...prevErrors, imagem: null }));
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
        if (isEventoPrivado && !formData.senha) newErrors.senha = 'Senha é obrigatória para eventos privados.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        onSave(formData);
        localStorage.removeItem('eventoFormData');
    };

    const handleCancel = () => {
        setFormData({
            nomeEvento: '',
            data: '',
            horario: '',
            local: '',
            descricao: '',
            preco: '',
            imagem: null,
            emailsConvidados: '',
            senha: '', // Limpa o campo de senha ao cancelar
        });
        localStorage.removeItem('eventoFormData');
        navigate('/eventos');
    };

    return (
        <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                    label="Nome do Evento"
                    name="nomeEvento"
                    value={formData.nomeEvento}
                    onChange={handleChange}
                    error={!!errors.nomeEvento}
                    helperText={errors.nomeEvento}
                    required
                />
                <TextField
                    label="Data"
                    name="data"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={formData.data}
                    onChange={handleChange}
                    error={!!errors.data}
                    helperText={errors.data}
                    required
                />
                <TextField
                    label="Horário"
                    name="horario"
                    type="time"
                    InputLabelProps={{ shrink: true }}
                    value={formData.horario}
                    onChange={handleChange}
                    error={!!errors.horario}
                    helperText={errors.horario}
                    required
                />
                <TextField
                    label="Local"
                    name="local"
                    value={formData.local}
                    onChange={handleChange}
                    error={!!errors.local}
                    helperText={errors.local}
                    required
                />
                <TextField
                    label="Descrição"
                    name="descricao"
                    multiline
                    rows={4}
                    value={formData.descricao}
                    onChange={handleChange}
                    error={!!errors.descricao}
                    helperText={errors.descricao}
                    required
                />
                <TextField
                    label="Preço"
                    name="preco"
                    type="number"
                    value={formData.preco}
                    onChange={handleChange}
                    error={!!errors.preco}
                    helperText={errors.preco}
                    required
                />

                <InputLabel shrink>Imagem</InputLabel>
                <Button variant="contained" component="label">
                    Escolher Imagem
                    <input
                        type="file"
                        name="imagem"
                        accept="image/jpeg,image/png"
                        onChange={handleFileChange}
                        hidden
                    />
                </Button>
                {errors.imagem && <Typography color="error">{errors.imagem}</Typography>}

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isEventoPrivado}
                            onChange={(e) => setIsEventoPrivado(e.target.checked)}
                            color="primary"
                        />
                    }
                    label="Evento Privado"
                    sx={{ marginBottom: 1 }} // Reduzindo o espaço ocupado pelo checkbox
                />

                {isEventoPrivado && (
                    <TextField
                        label="Senha do Evento"
                        name="senha"
                        type="password"
                        value={formData.senha}
                        onChange={handleChange}
                        error={!!errors.senha}
                        helperText={errors.senha}
                        required={isEventoPrivado} // Torna obrigatório se o evento for privado
                    />
                )}

                <TextField
                    label="E-mails dos Convidados (separados por vírgula)"
                    name="emailsConvidados"
                    value={formData.emailsConvidados}
                    onChange={handleChange}
                    error={!!errors.emailsConvidados}
                    helperText={errors.emailsConvidados}
                />

                <Box display="flex" gap={2}>
                    <Button type="submit" variant="contained" color="primary">
                        Salvar Evento
                    </Button>
                    <Button type="button" variant="outlined" color="secondary" onClick={handleCancel}>
                        Cancelar
                    </Button>
                </Box>
            </Box>
        </form>
    );
};

export default CriarEvento;
