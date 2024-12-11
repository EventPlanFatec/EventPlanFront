import axios from 'axios';
import API_URL from './apiConfig';

const INGRESSOS_ENDPOINT = `${API_URL}/api/ingresso`;

export const salvarIngresso = async (ingressoData) => {
  try {
    const response = await axios.post(INGRESSOS_ENDPOINT, ingressoData);
    return response.data;
  } catch (error) {
    console.log('Erro ao salvar ingresso:', error); // Apenas loga o erro sem lançar
    return null; // Retorna null em caso de erro
  }
};

export const listarIngressosPorEvento = async (eventoId) => {
  try {
    const response = await axios.get(`${INGRESSOS_ENDPOINT}/evento/${eventoId}`);
    return response.data; // Se não houver ingressos, retornará um array vazio
  } catch (error) {
    console.log('Erro ao listar ingressos:', error); // Apenas loga o erro sem lançar
    return []; // Retorna um array vazio em vez de lançar um erro
  }
};

export const cancelarIngresso = async (id) => {
  try {
    await axios.delete(`${INGRESSOS_ENDPOINT}/${id}`);
  } catch (error) {
    console.log('Erro ao cancelar ingresso:', error); // Apenas loga o erro sem lançar
    return false; // Retorna false para indicar falha sem lançar um erro
  }
};

export const editarIngresso = async (id, ingressoData) => {
  try {
    const response = await axios.put(`${INGRESSOS_ENDPOINT}/${id}`, ingressoData);
    return response.data;
  } catch (error) {
    console.log('Erro ao editar ingresso:', error); // Apenas loga o erro sem lançar
    return null; // Retorna null em caso de erro
  }
};

export const listarTiposIngressosPorEvento = async (eventoId) => {
  try {
    const response = await axios.get(`${INGRESSOS_ENDPOINT}/tipos/${eventoId}`);
    return response.data;
  } catch (error) {
    console.log('Erro ao listar tipos de ingressos:', error); // Apenas loga o erro sem lançar
    return []; // Retorna um array vazio em vez de lançar um erro
  }
};
