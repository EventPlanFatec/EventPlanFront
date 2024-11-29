import { useState, useCallback } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import EventoModel from '../models/EventoModel';

export const useEventosFirebase = () => {
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const buscarEventos = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const eventoRef = collection(db, "Eventos");
      const querySnapshot = await getDocs(eventoRef);
      
      const listaEventos = querySnapshot.docs.map(doc => 
        EventoModel.fromFirestore(doc.id, doc.data())
      );
      
      setEventos(listaEventos);
      return listaEventos;
    } catch (error) {
      setErro(error.message);
      console.error('Erro ao buscar eventos:', error);
      throw error;
    } finally {
      setCarregando(false);
    }
  }, []);

  const criarEvento = useCallback(async (novoEvento) => {
    setCarregando(true);
    setErro(null);
    try {
      const eventoParaSalvar = novoEvento instanceof EventoModel 
        ? novoEvento 
        : new EventoModel(novoEvento);

      const errors = eventoParaSalvar.validate();
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      const eventoRef = collection(db, "Eventos");
      const docRef = await addDoc(eventoRef, eventoParaSalvar.toFirestore());
      
      const eventoComId = new EventoModel({
        ...eventoParaSalvar,
        id: docRef.id
      });
      
      setEventos(eventosAnteriores => [...eventosAnteriores, eventoComId]);
      
      return eventoComId;
    } catch (error) {
      setErro(error.message);
      console.error('Erro ao criar evento:', error);
      throw error;
    } finally {
      setCarregando(false);
    }
  }, []);

  const atualizarEvento = useCallback(async (id, eventoAtualizado) => {
    setCarregando(true);
    setErro(null);
    try {
      if (!id) throw new Error('ID do evento é obrigatório');

      const eventoRef = doc(db, "Eventos", id);
      await updateDoc(eventoRef, eventoAtualizado);

      setEventos(eventosAnteriores => 
        eventosAnteriores.map(evento => 
          evento.id === id 
            ? new EventoModel({ ...evento, ...eventoAtualizado }) 
            : evento
        )
      );

      return eventoAtualizado;
    } catch (error) {
      setErro(error.message);
      console.error('Erro ao atualizar evento:', error);
      throw error;
    } finally {
      setCarregando(false);
    }
  }, []);

  const deletarEvento = useCallback(async (id) => {
    setCarregando(true);
    setErro(null);
    try {
      if (!id) throw new Error('ID do evento é obrigatório');

      const eventoRef = doc(db, "Eventos", id);
      await deleteDoc(eventoRef);

      setEventos(eventosAnteriores => 
        eventosAnteriores.filter(evento => evento.id !== id)
      );

      return id;
    } catch (error) {
      setErro(error.message);
      console.error('Erro ao deletar evento:', error);
      throw error;
    } finally {
      setCarregando(false);
    }
  }, []);

  const buscarEventosPorFiltro = useCallback(async (filtro) => {
    setCarregando(true);
    setErro(null);
    try {
      const eventoRef = collection(db, "Eventos");
      
      const condicoesQuery = Object.entries(filtro)
        .map(([campo, valor]) => where(campo, '==', valor));
      
      const consultaFiltrada = query(eventoRef, ...condicoesQuery);
      const querySnapshot = await getDocs(consultaFiltrada);
      
      const listaEventos = querySnapshot.docs.map(doc => 
        EventoModel.fromFirestore(doc.id, doc.data())
      );
      
      return listaEventos;
    } catch (error) {
      setErro(error.message);
      console.error('Erro ao buscar eventos com filtro:', error);
      throw error;
    } finally {
      setCarregando(false);
    }
  }, []);

  return {
    eventos,
    carregando,
    erro,
    buscarEventos,
    criarEvento,
    atualizarEvento,
    deletarEvento,
    buscarEventosPorFiltro
  };
};