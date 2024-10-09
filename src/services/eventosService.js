export const obterEventos = async () => {
  const response = await fetch('/api/eventos');
  if (!response.ok) {
    throw new Error('Erro ao buscar eventos');
  }
  return await response.json();
};

export const salvarEvento = async (formData) => {
  const response = await fetch('/api/eventos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Falha ao salvar o evento');
  }

  return await response.json();
};

export const editarEvento = async (id, formData) => {
  const response = await fetch(`/api/eventos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Falha ao editar o evento');
  }

  return await response.json();
};

export const cancelarEvento = async (id) => {
  const response = await fetch(`/api/eventos/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Erro ao cancelar evento');
  }
  return await response.json();
};
