import React, { useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem } from '@mui/material';
import { usePermissions } from '../../context/PermissionsContext';
import { toast, ToastContainer } from 'react-toastify';
import styles from './GerenciamentoUsuarios.module.css';

const GerenciamentoUsuarios = () => {
  const { permissions } = usePermissions();
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      const response = await fetch('/api/usuarios');
      const data = await response.json();
      setUsuarios(data);
    };

    fetchUsuarios();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    const response = await fetch(`/api/usuarios/${userId}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    });

    if (response.ok) {
      setUsuarios(usuarios.map(user => user.id === userId ? { ...user, role: newRole } : user));
      toast.success('Função atualizada com sucesso!');
    } else {
      toast.error('Erro ao atualizar a função.');
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <h2 className={styles.title}>Gerenciamento de Usuários</h2>
      <TableContainer>
        <Table className={styles.userTable}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Função</TableCell>
              {permissions.editUsers && <TableCell>Ações</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map(usuario => (
              <TableRow key={usuario.id}>
                <TableCell>{usuario.id}</TableCell>
                <TableCell>{usuario.name}</TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>
                  <Select
                    value={usuario.role}
                    onChange={(e) => handleRoleChange(usuario.id, e.target.value)}
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="editor">Editor</MenuItem>
                    <MenuItem value="viewer">Viewer</MenuItem>
                  </Select>
                </TableCell>
                {permissions.editUsers && (
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => alert(`Editando ${usuario.name}`)}>Editar</Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default GerenciamentoUsuarios;
