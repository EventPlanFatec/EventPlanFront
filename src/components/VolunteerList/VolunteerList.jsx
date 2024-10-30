import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import AdicionarVoluntario from '../AdicionarVoluntario/AdicionarVoluntario';
import EditarVoluntario from '../EditarVoluntario/EditarVoluntario';
import styles from './VolunteerList.module.css';

const VolunteerList = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchVolunteers = async () => {
      const data = [
        { id: 1, nome: 'João Silva', email: 'joao@example.com', funcao: 'Coordenador', status: 'Ativo' },
        { id: 2, nome: 'Maria Oliveira', email: 'maria@example.com', funcao: 'Assistente', status: 'Inativo' },
      ];
      setVolunteers(data);
    };
    fetchVolunteers();
  }, []);

  const handleAddVolunteer = (novoVoluntario) => {
    const newVolunteer = { id: volunteers.length + 1, ...novoVoluntario, status: 'Ativo' };
    setVolunteers([...volunteers, newVolunteer]);
    toast.success('Voluntário adicionado com sucesso!');
    setShowForm(false);
  };

  const handleEditClick = (volunteer) => {
    setEditingVolunteer(volunteer);
    setIsEditing(true);
  };

  const handleUpdateVolunteer = (updatedVolunteer) => {
    setVolunteers((prev) =>
      prev.map((volunteer) =>
        volunteer.id === updatedVolunteer.id ? updatedVolunteer : volunteer
      )
    );
    toast.success('Voluntário atualizado com sucesso!');
    setIsEditing(false);
    setEditingVolunteer(null);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <h2 className={styles.title}>Lista de Voluntários</h2>
      <button style={{ marginBottom: '20px' }} onClick={toggleForm}>
        {showForm ? 'Cancelar' : 'Adicionar Voluntário'}
      </button>
      {showForm && <AdicionarVoluntario onAdicionarVoluntario={handleAddVolunteer} />}
      {isEditing && (
        <EditarVoluntario
          open={isEditing}
          onClose={() => setIsEditing(false)}
          volunteer={editingVolunteer}
          onUpdate={handleUpdateVolunteer}
        />
      )}
      <div className={styles.list}>
        {volunteers.map((volunteer) => (
          <div key={volunteer.id} className={styles.volunteerCard}>
            <p><strong>Nome:</strong> {volunteer.nome}</p>
            <p><strong>Email:</strong> {volunteer.email}</p>
            <p><strong>Função:</strong> {volunteer.funcao}</p>
            <p><strong>Status:</strong> {volunteer.status}</p>
            <button onClick={() => handleEditClick(volunteer)}>Editar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VolunteerList;
