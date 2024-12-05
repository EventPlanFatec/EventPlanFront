import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const EventosEncontrados = () => {
  const [searchParams] = useSearchParams(); // Obtém os parâmetros da URL
  const [eventos, setEventos] = useState([]); // Armazena os eventos encontrados
  const [loading, setLoading] = useState(true); // Controle de carregamento
  const query = searchParams.get("query"); // Query enviada pela barra de pesquisa

  // Função para buscar eventos no backend
  const fetchEventos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://seu-backend.com/api/eventos?query=${query}`);
      if (response.ok) {
        const data = await response.json();
        setEventos(data); // Atualiza os eventos com a resposta do backend
      } else {
        setEventos([]); // Caso não haja eventos, mantém vazio
      }
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
      setEventos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, [query]); // Executa toda vez que a query mudar

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h1>Resultados para: "{query}"</h1>
      {eventos.length > 0 ? (
        <ul>
          {eventos.map((evento) => (
            <li key={evento.id}>{evento.nome}</li> // Renderiza cada evento
          ))}
        </ul>
      ) : (
        <p>Nenhum evento encontrado</p>
      )}
    </div>
  );
};

export default EventosEncontrados;
