import React, { useEffect, useState } from "react";
import axios from "axios";

const UsuarioIngresso = () => {
  const [ingressos, setIngressos] = useState([]); // Inicializa como um array vazio
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simula o ID do usuário logado (substitua pelo ID real)
  const usuarioId = 123;

  useEffect(() => {
    // Busca ingressos do backend
    const fetchIngressos = async () => {
      try {
        const response = await axios.get(`/api/usuarios/${usuarioId}/ingressos`);
        
        // Verifica se a resposta é um array antes de atribuir a 'ingressos'
        if (Array.isArray(response.data)) {
          setIngressos(response.data);
        } else {
          setIngressos([]); // Caso não seja um array, define 'ingressos' como array vazio
        }
      } catch (err) {
        setError("Erro ao buscar ingressos.");
      } finally {
        setLoading(false);
      }
    };

    fetchIngressos();
  }, [usuarioId]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (ingressos.length === 0) {
    return <p>Você não tem nenhum ingresso disponível.</p>;
  }

  return (
    <div>
      <h1>Meus Ingressos</h1>
      <ul>
        {ingressos.map((ingresso) => (
          <li key={ingresso.ingressoId}>
            <h2>{ingresso.nomeEvento}</h2>
            <p>Data: {new Date(ingresso.dataEvento).toLocaleString()}</p>
            <p>Localização: {ingresso.localizacao}</p>
            <p>Valor: R$ {ingresso.valor.toFixed(2)}</p>
            <p>Status: {ingresso.status}</p>
            <p>VIP: {ingresso.vip ? "Sim" : "Não"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsuarioIngresso;
