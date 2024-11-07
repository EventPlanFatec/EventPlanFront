import React, { useState } from 'react';
import styles from './PreferencesForm.module.css';

const PreferencesForm = ({ onSubmit }) => {
  const [eventType, setEventType] = useState('');
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState('0-50');

  const handleSubmit = (e) => {
    e.preventDefault();
    const preferences = {
      eventType,
      location,
      priceRange
    };
    onSubmit(preferences);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.preferencesForm}>
        <h2 className={styles.title}>Preferências de Evento</h2>

        <div className={styles.formGroup}>
          <label htmlFor="eventType" className={styles.label}>Tipo de Evento:</label>
          <select
            id="eventType"
            className={styles.select}
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          >
            <option value="">Selecione um tipo</option>
            <option value="concert">Concerto</option>
            <option value="conference">Conferência</option>
            <option value="workshop">Workshop</option>
            <option value="webinar">Webinar</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="location" className={styles.label}>Localização:</label>
          <select
            id="location"
            className={styles.select}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">Selecione uma localização</option>
            <option value="sp">São Paulo</option>
            <option value="rj">Rio de Janeiro</option>
            <option value="bh">Belo Horizonte</option>
            <option value="br">Brasil (online)</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="priceRange" className={styles.label}>Faixa de Preço:</label>
          <select
            id="priceRange"
            className={styles.select}
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option value="0-50">R$ 0 - R$ 50</option>
            <option value="51-100">R$ 51 - R$ 100</option>
            <option value="101-200">R$ 101 - R$ 200</option>
            <option value="201-500">R$ 201 - R$ 500</option>
            <option value="500+">R$ 500+</option>
          </select>
        </div>

        <button type="submit" className={styles.submitButton}>Salvar Preferências</button>
      </form>
    </div>
  );
};

export default PreferencesForm;
