import axios from 'axios';
import API_URL from './apiConfig';

const INGRESSOS_ENDPOINT = `${API_URL}/api/ingresso`;

export const salvarIngresso = async (ingressoData) => {
  try {
    const response = await axios.post(INGRESSOS_ENDPOINT, ingressoData);
    return response.data;
  } catch (error) {
    console.error('Erro ao salvar ingresso:', error);
    throw new Error('Falha ao salvar ingresso');
  }
};

export const listarIngressosPorEvento = async (eventoId) => {
  try {
    const response = await axios.get(`${INGRESSOS_ENDPOINT}/evento/${eventoId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao listar ingressos:', error);
    throw new Error('Falha ao listar ingressos');
  }
};

export const cancelarIngresso = async (id) => {
  try {
    await axios.delete(`${INGRESSOS_ENDPOINT}/${id}`);
  } catch (error) {
    console.error('Erro ao cancelar ingresso:', error);
    throw new Error('Falha ao cancelar ingresso');
  }
};

export const editarIngresso = async (id, ingressoData) => {
  try {
    const response = await axios.put(`${INGRESSOS_ENDPOINT}/${id}`, ingressoData);
    return response.data;
  } catch (error) {
    console.error('Erro ao editar ingresso:', error);
    throw new Error('Falha ao editar ingresso');
  }
};

export const listarTiposIngressosPorEvento = async (eventoId) => {
  try {
    const response = await axios.get(`${INGRESSOS_ENDPOINT}/tipos/${eventoId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao listar tipos de ingressos:', error);
    throw new Error('Falha ao listar tipos de ingressos');
  }
};

