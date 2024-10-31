import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Checkbox, IconButton, InputAdornment } from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './EditarEvento.module.css';

const EditarEvento = ({ eventoAtual, onSave }) => {
    const [formData, setFormData] = useState({
        nomeEvento: '',
        data: '',
        horario: '',
        local: '',
        descricao: '',
        preco: '',
        imagem: null,
        emailsConvidados: '',
        senha: '',
    });

    const [isEventoPrivado, setIsEventoPrivado] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (eventoAtual) {
            setFormData({
                ...eventoAtual,
                imagem: null
            });
            setIsEventoPrivado(eventoAtual.isEventoPrivado || false);
        }
    }, [eventoAtual]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, imagem: file });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.nomeEvento) newErrors.nomeEvento = 'Nome do evento é obrigatório.';
        if (!formData.data) newErrors.data = 'Data é obrigatória.';
        if (!formData.horario) newErrors.horario = 'Horário é obrigatório.';
        if (!formData.local) newErrors.local = 'Local é obrigatório.';
        if (!formData.descricao) newErrors.descricao = 'Descrição é obrigatória.';
        if (!formData.preco) newErrors.preco = 'Preço é obrigatório.';
        if (!formData.imagem && !eventoAtual) newErrors.imagem = 'Imagem é obrigatória.';
        if (isEventoPrivado && !formData.senha) newErrors.senha = 'Senha é obrigatória para eventos privados.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            await onSave({ ...formData, id });
            toast.success('Evento atualizado com sucesso!');
            navigate('/eventos');
        } catch (error) {
            toast.error('Erro ao atualizar o evento. Tente novamente.');
        }
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    if (!eventoAtual) {
        return <div>Carregando...</div>;
    }

    return (
        <div className={styles.container}>
            <ToastContainer />
            <div className={styles.register}>
                <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
                    <h2 className={styles.title}>Editar Evento</h2>
                    <TextField
                        label="Nome do Evento"
                        variant="outlined"
                        required
                        value={formData.nomeEvento}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Data"
                        type="date"
                        variant="outlined"
                        required
                        value={formData.data}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Horário"
                        type="time"
                        variant="outlined"
                        required
                        value={formData.horario}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Local"
                        variant="outlined"
                        required
                        value={formData.local}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Descrição"
                        variant="outlined"
                        required
                        multiline
                        rows={4}
                        value={formData.descricao}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Preço"
                        type="number"
                        variant="outlined"
                        required
                        value={formData.preco}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <Box marginTop={2} marginBottom={1}> 
                        <Button variant="contained" component="label" sx={{ width: '100%', textAlign: 'center' }}>
                            Escolher Imagem
                            <input
                                type="file"
                                accept="image/jpeg,image/png"
                                onChange={handleFileChange}
                                hidden
                            />
                        </Button>
                        {errors.imagem && <Typography color="error">{errors.imagem}</Typography>}
                    </Box>
                    <TextField
                        label="E-mails dos Convidados (separados por vírgula)"
                        variant="outlined"
                        value={formData.emailsConvidados}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <Box display="flex" alignItems="center" justifyContent="flex-start" marginBottom={2}>
                        <Checkbox
                            checked={isEventoPrivado}
                            onChange={(e) => setIsEventoPrivado(e.target.checked)}
                            color="primary"
                        />
                        <Typography>Evento Privado</Typography>
                    </Box>
                    {isEventoPrivado && (
                        <TextField
                            label="Senha do Evento"
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            value={formData.senha}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={togglePasswordVisibility}>
                                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}
                    <Box display="flex" flexDirection="column" alignItems="center" gap={2} marginTop={2}>
                        <Button type="submit" variant="contained" color="success" fullWidth sx={{ minWidth: '200px' }}>
                            Atualizar Evento
                        </Button>
                        <Button type="button" variant="contained" color="error" fullWidth sx={{ minWidth: '200px' }} onClick={() => navigate('/eventos')}>
                            Cancelar
                        </Button>
                    </Box>
                </form>
            </div>
        </div>
    );
};

export default EditarEvento;
