import { useState, useCallback, useEffect } from 'react';
import { UserService } from '../models/UserModel';

const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedUsers = await UserService.listUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      setError(err);
      console.error('Erro ao buscar usuários', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update user
  const updateUser = useCallback(async (userId, userData) => {
    setLoading(true);
    setError(null);
    try {
      await UserService.updateUserProfile(userId, userData);
      await fetchUsers();
      return true;
    } catch (err) {
      setError(err);
      console.error('Erro ao atualizar usuário', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  // Create user
  const createUser = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      await UserService.createAdminUser(userData);
      await fetchUsers();
      return true;
    } catch (err) {
      setError(err);
      console.error('Erro ao criar usuário', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  // Toggle user status
  const toggleUserStatus = useCallback(async (userId, currentStatus) => {
    setLoading(true);
    setError(null);
    try {
      await UserService.toggleUserStatus(userId, !currentStatus);
      await fetchUsers();
      return true;
    } catch (err) {
      setError(err);
      console.error('Erro ao alterar status do usuário', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  // Change user role
  const changeUserRole = useCallback(async (userId, newRole) => {
    setLoading(true);
    setError(null);
    try {
      await UserService.changeUserRole(userId, newRole);
      await fetchUsers();
      return true;
    } catch (err) {
      setError(err);
      console.error('Erro ao alterar papel do usuário', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    updateUser,
    createUser,
    toggleUserStatus,
    changeUserRole
  };
};

export default useUserManagement;