// Exemplo de serviço para interagir com a API

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
  