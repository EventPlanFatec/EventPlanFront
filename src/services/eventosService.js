export const salvarEvento = async (formData) => {
  const response = await fetch('/api/eventos', {
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
  const response = await fetch('/api/eventos', {
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
  const response = await fetch(`/api/eventos/${id}`, {
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
  const response = await fetch(`/api/eventos/${id}`, {
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
