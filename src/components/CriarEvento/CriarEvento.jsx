import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Checkbox,
  IconButton,
  InputAdornment,
  Typography,
  CircularProgress,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../firebase/config'; // Ajuste o caminho para o arquivo de configuração do Firebase

const CriarEvento = ({ open, onClose, onSave, formData, setFormData, editId }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isEventoPrivado, setIsEventoPrivado] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [image, setImage] = React.useState(null); // Variável para armazenar a imagem selecionada

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imagens" && files[0]) {
      setImage(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePasswordVisibility = () => setShowPassword(!showPassword);

  const handleEventoPrivadoChange = (e) => {
    setIsEventoPrivado(e.target.checked);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nomeEvento) newErrors.nomeEvento = "Nome do evento é obrigatório.";
    if (!formData.dataInicio) newErrors.dataInicio = "Data de início é obrigatória.";
    if (!formData.dataFim) newErrors.dataFim = "Data de fim é obrigatória.";
    if (!formData.horarioInicio) newErrors.horarioInicio = "Horário de início é obrigatório.";
    if (!formData.horarioFim) newErrors.horarioFim = "Horário de fim é obrigatório.";
    if (!formData.local) newErrors.local = "Local é obrigatório.";
    if (!formData.descricao) newErrors.descricao = "Descrição é obrigatória.";
    if (!formData.lotacaoMaxima) newErrors.lotacaoMaxima = "Lotação máxima é obrigatória.";
    if (!image) newErrors.imagens = "Imagem é obrigatória."; // Adicionando validação para a imagem
    if (isEventoPrivado && !formData.senha) newErrors.senha = "Senha é obrigatória para eventos privados.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async () => {
    if (!image) return;

    const storageRef = ref(storage, `events/${editId ? editId : 'new'}/images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.error("Upload error: ", error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData({ ...formData, imagens: [downloadURL] }); // Armazena a URL da imagem no formData
        } catch (error) {
          console.error("Error fetching download URL: ", error);
        }
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await handleImageUpload();
      await onSave({ ...formData, editId });
      onClose();
    } catch (error) {
      console.error("Erro ao salvar evento", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editId ? "Editar Evento" : "Criar Evento"}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
        <TextField
            label="Nome do Evento"
            variant="outlined"
            fullWidth
            margin="normal"
            name="nomeEvento"
            value={formData.nomeEvento}
            onChange={handleChange}
            error={Boolean(errors.nomeEvento)}
            helperText={errors.nomeEvento}
            required
          />

          <TextField
            label="Data Início"
            type="date"
            variant="outlined"
            fullWidth
            margin="normal"
            name="dataInicio"
            value={formData.dataInicio}
            onChange={handleChange}
            error={Boolean(errors.dataInicio)}
            helperText={errors.dataInicio}
            required
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Data Fim"
            type="date"
            variant="outlined"
            fullWidth
            margin="normal"
            name="dataFim"
            value={formData.dataFim}
            onChange={handleChange}
            error={Boolean(errors.dataFim)}
            helperText={errors.dataFim}
            required
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Horário Início"
            type="time"
            variant="outlined"
            fullWidth
            margin="normal"
            name="horarioInicio"
            value={formData.horarioInicio}
            onChange={handleChange}
            error={Boolean(errors.horarioInicio)}
            helperText={errors.horarioInicio}
            required
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Horário Fim"
            type="time"
            variant="outlined"
            fullWidth
            margin="normal"
            name="horarioFim"
            value={formData.horarioFim}
            onChange={handleChange}
            error={Boolean(errors.horarioFim)}
            helperText={errors.horarioFim}
            required
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Local"
            variant="outlined"
            fullWidth
            margin="normal"
            name="local"
            value={formData.local}
            onChange={handleChange}
            error={Boolean(errors.local)}
            helperText={errors.local}
            required
          />

          <TextField
            label="Descrição"
            variant="outlined"
            fullWidth
            margin="normal"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            error={Boolean(errors.descricao)}
            helperText={errors.descricao}
            multiline
            rows={4}
            required
          />

          <TextField
            label="Lotação Máxima"
            variant="outlined"
            fullWidth
            margin="normal"
            name="lotacaoMaxima"
            type="number"
            value={formData.lotacaoMaxima}
            onChange={handleChange}
            error={Boolean(errors.lotacaoMaxima)}
            helperText={errors.lotacaoMaxima}
            required
          />

          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Escolher Imagem
            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              name="imagens"
              hidden
              required
            />
          </Button>
          {errors.imagens && <Typography color="error">{errors.imagens}</Typography>}

          {progress > 0 && (
            <Box sx={{ marginTop: 2 }}>
              <CircularProgress variant="determinate" value={progress} />
              <Typography variant="body2">{`${Math.round(progress)}%`}</Typography>
            </Box>
          )}

          <Box marginTop={2} display="flex" alignItems="center">
            <Checkbox
              checked={isEventoPrivado}
              onChange={handleEventoPrivadoChange}
              color="primary"
            />
            <Typography>Evento Privado</Typography>
          </Box>

          {isEventoPrivado && (
            <TextField
              label="Senha"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              margin="normal"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              error={Boolean(errors.senha)}
              helperText={errors.senha}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}

          <DialogActions>
            <Button onClick={onClose} color="secondary">
              Cancelar
            </Button>
            <Button
              type="submit"
              color="primary"
              disabled={loading}
            >
              {loading ? "Salvando..." : editId ? "Salvar Alterações" : "Criar Evento"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

CriarEvento.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    nomeEvento: PropTypes.string.isRequired,
    dataInicio: PropTypes.string.isRequired,
    dataFim: PropTypes.string.isRequired,
    horarioInicio: PropTypes.string.isRequired,
    horarioFim: PropTypes.string.isRequired,
    local: PropTypes.string.isRequired,
    descricao: PropTypes.string.isRequired,
    lotacaoMaxima: PropTypes.number.isRequired,
    imagens: PropTypes.array.isRequired,
    senha: PropTypes.string,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
    editId: PropTypes.number,
};

export default CriarEvento;
