import API_URL from "../services/apiConfig";

const EVENTOS_URL = `${API_URL}/api/events`;

export const salvarEvento = async (formData) => {
  const response = await fetch(EVENTOS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error('Falha ao salvar o evento');
  }

  return await response.json();
};

export const listarEventos = async () => {
  const response = await fetch(EVENTOS_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Falha ao listar os eventos');
  }

  return await response.json();
};

export const cancelarEvento = async (id) => {
  const response = await fetch(`${EVENTOS_URL}/deletar/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Falha ao cancelar o evento');
  }

  return await response.json();
};

export const editarEvento = async (id, formData) => {
  const response = await fetch(`${EVENTOS_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error('Falha ao editar o evento');
  }

  return await response.json();
};


