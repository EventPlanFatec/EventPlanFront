import React from 'react';
import { usePermissions } from '../../context/PermissionsContext';
import styles from './ConfigPermissoes.module.css';

const ConfigPermissoes = () => {
  const { permissions, togglePermission } = usePermissions();

  const handleTogglePermission = (permission) => {
    togglePermission(permission);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Configuração de Permissões</h2>
      <div className={styles.permissionItem} onClick={() => handleTogglePermission('viewEvents')}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={permissions.viewEvents}
          readOnly
        />
        <label className={styles.label}>Ver Eventos</label>
      </div>
      <div className={styles.permissionItem} onClick={() => handleTogglePermission('editEvents')}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={permissions.editEvents}
          readOnly
        />
        <label className={styles.label}>Editar Eventos</label>
      </div>
      <div className={styles.permissionItem} onClick={() => handleTogglePermission('deleteEvents')}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={permissions.deleteEvents}
          readOnly
        />
        <label className={styles.label}>Deletar Eventos</label>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.saveButton}>Salvar Alterações</button>
      </div>
    </div>
  );
};

export default ConfigPermissoes;
