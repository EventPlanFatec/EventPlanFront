import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  TextField, 
  DialogActions,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import useUserManagement from '../../hooks/useUserManagement';
import { UserRole } from '../../models/UserModel';

const AdminUserManagement = () => {
  const {
    users,
    loading,
    error,
    updateUser,
    createUser,
    toggleUserStatus,
    changeUserRole
  } = useUserManagement();

  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUserModal, setNewUserModal] = useState(false);

  const handleEditUser = () => {
    if (selectedUser?.id) {
      updateUser(selectedUser.id, selectedUser);
      setOpenModal(false);
    }
  };

  const handleCreateUser = () => {
    createUser(selectedUser);
    setNewUserModal(false);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Erro: {error.message}</Typography>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Gerenciamento de Usuários
      </Typography>

      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => {
          setSelectedUser({});
          setNewUserModal(true);
        }}
      >
        Criar Novo Usuário
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Papel</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onChange={(e) => changeUserRole(user.id, e.target.value)}
                  >
                    {Object.values(UserRole).map((role) => (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={user.isActive}
                        onChange={() => toggleUserStatus(user.id, user.isActive)}
                      />
                    }
                    label={user.isActive ? 'Ativo' : 'Inativo'}
                  />
                </TableCell>
                <TableCell>
                  <Button onClick={() => openEditModal(user)}>
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Edição de Usuário */}
      <Dialog 
        open={openModal} 
        onClose={() => setOpenModal(false)}
      >
        <DialogTitle>Editar Usuário</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome"
            fullWidth
            value={selectedUser?.name || ''}
            onChange={(e) => setSelectedUser(prev => ({ ...prev, name: e.target.value }))}
            margin="normal"
          />
          <TextField
            label="Email"
            fullWidth
            value={selectedUser?.email || ''}
            onChange={(e) => setSelectedUser(prev => ({ ...prev, email: e.target.value }))}
            margin="normal"
          />
          <TextField
            label="Telefone"
            fullWidth
            value={selectedUser?.phoneNumber || ''}
            onChange={(e) => setSelectedUser(prev => ({ ...prev, phoneNumber: e.target.value }))}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
          <Button onClick={handleEditUser} color="primary">Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Criação de Usuário */}
      <Dialog 
        open={newUserModal} 
        onClose={() => setNewUserModal(false)}
      >
        <DialogTitle>Criar Novo Usuário</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome"
            fullWidth
            value={selectedUser?.name || ''}
            onChange={(e) => setSelectedUser(prev => ({ ...prev, name: e.target.value }))}
            margin="normal"
          />
          <TextField
            label="Email"
            fullWidth
            value={selectedUser?.email || ''}
            onChange={(e) => setSelectedUser(prev => ({ ...prev, email: e.target.value }))}
            margin="normal"
          />
          <TextField
            label="Telefone"
            fullWidth
            value={selectedUser?.phoneNumber || ''}
            onChange={(e) => setSelectedUser(prev => ({ ...prev, phoneNumber: e.target.value }))}
            margin="normal"
          />
          <Select
            fullWidth
            label="Papel"
            value={selectedUser?.role || UserRole.USER}
            onChange={(e) => setSelectedUser(prev => ({ ...prev, role: e.target.value }))}
            margin="normal"
          >
            {Object.values(UserRole).map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewUserModal(false)}>Cancelar</Button>
          <Button onClick={handleCreateUser} color="primary">Criar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminUserManagement;