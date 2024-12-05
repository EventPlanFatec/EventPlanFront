import React, { useEffect, useState } from "react";
import axios from "axios";
import { getFirestore, doc, getDoc } from "firebase/firestore"; 
import { Button } from "@mui/material"; 

// Abaixo exemplo de como inicializar o Firestore, use a configuração do seu projeto.
import { db } from "../../firebase/config"; 

const UsuarioIngresso = () => {
  const [ingressos, setIngressos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [selectedIngresso, setSelectedIngresso] = useState(null);
  const [showTicket, setShowTicket] = useState(false); // Para exibir o modelo do ingresso

  // Simula o ID do usuário logado (substitua pelo ID real)
  const usuarioId = 123;

  // Busca os ingressos do backend
  useEffect(() => {
    const fetchIngressos = async () => {
      try {
        const response = await axios.get(`/api/usuarios/${usuarioId}/ingressos`);
        if (Array.isArray(response.data)) {
          setIngressos(response.data);
        } else {
          setIngressos([]);
        }
      } catch (err) {
        setError("Erro ao buscar ingressos.");
      } finally {
        setLoading(false);
      }
    };

    fetchIngressos();
  }, [usuarioId]);

  // Busca os dados do usuário no Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "usuarios", String(usuarioId));
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        } else {
          setError("Usuário não encontrado.");
        }
      } catch (err) {
        setError("Erro ao buscar dados do usuário.");
      }
    };

    fetchUserData();
  }, [usuarioId]);

  const handleImprimirIngresso = (ingresso) => {
    setSelectedIngresso(ingresso);
    setShowTicket(true);
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (ingressos.length === 0) {
    return <p>Você não tem nenhum ingresso disponível.</p>;
  }

  const renderTicket = () => {
    const ingresso = selectedIngresso;
    const user = userData;

    if (!ingresso || !user) return null;

    return (
      <div>
        <h2>Modelo de Ingresso</h2>
        <p><strong>Nome:</strong> {user.nome} {user.sobrenome}</p>
        <p><strong>CPF:</strong> {user.cpf}</p>
        <p><strong>Nome do Evento:</strong> {ingresso.nomeEvento}</p>
        <p><strong>Data do Ingresso:</strong> {new Date(ingresso.dataEvento).toLocaleString()}</p>
        <p><strong>Localização:</strong> {ingresso.logradouro}, {ingresso.numeroPredial}, {ingresso.cidade}, {ingresso.estado}</p>
        <p><strong>VIP:</strong> {ingresso.vip ? "Sim" : "Não"}</p>
        <p><strong>Estudante:</strong> {ingresso.estudante ? "Sim" : "Não"}</p>
      </div>
    );
  };

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
            <p>Estudante: {ingresso.estudante ? "Sim" : "Não"}</p>
            {ingresso.status === "ativo" && (
              <Button onClick={() => handleImprimirIngresso(ingresso)}>Imprimir Ingresso</Button>
            )}
          </li>
        ))}
      </ul>

      {showTicket && (
        <div>
          {renderTicket()}
        </div>
      )}
    </div>
  );
};

export default UsuarioIngresso;
