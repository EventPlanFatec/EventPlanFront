import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config"; // Importa a configuração do Firebase

const EventosEncontrados = () => {
  const [eventos, setEventos] = useState([]);  // Estado para armazenar os eventos
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento

  // Função para buscar os eventos da coleção "Eventos"
  const fetchEventos = async () => {
    try {
      const eventosRef = collection(db, "eventos");  // Referência à coleção "eventos"
      const eventosSnapshot = await getDocs(eventosRef);  // Obtém os dados da coleção
      const eventosList = eventosSnapshot.docs.map(doc => ({
        id: doc.id,  // O id do documento
        ...doc.data() // Os dados do evento
      }));
      setEventos(eventosList);  // Atualiza o estado com os eventos encontrados
    } catch (error) {
      console.error("Erro ao buscar eventos: ", error);
    } finally {
      setLoading(false);  // Finaliza o carregamento
    }
  };

  // Chama a função de busca assim que o componente for montado
  useEffect(() => {
    fetchEventos();
  }, []);

  if (loading) {
    return <div>Carregando eventos...</div>;  // Exibe mensagem de carregamento
  }

  return (
    <div>
      <h2>Eventos Encontrados</h2>
      {eventos.length === 0 ? (
        <p>Nenhum evento encontrado.</p>
      ) : (
        <div>
          {eventos.map((evento) => (
            <div key={evento.id} style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ccc" }}>
              <h3>{evento.NomeEvento}</h3>
              <p><strong>Data Início:</strong> {evento.DataInicio.toDate().toLocaleDateString()}</p>
              <p><strong>Data Fim:</strong> {evento.DataFim.toDate().toLocaleDateString()}</p>
              <p><strong>Local:</strong> {evento.Logradouro}, {evento.Cidade}, {evento.Estado}</p>
              <p><strong>Lotação Máxima:</strong> {evento.LotacaoMaxima}</p>
              <p><strong>Gênero:</strong> {evento.Genero}</p>
              <p><strong>Nota Média:</strong> {evento.NotaMedia}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventosEncontrados;
