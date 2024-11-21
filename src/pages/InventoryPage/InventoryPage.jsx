import React, { useState, useEffect } from 'react';

const InventoryPage = ({ eventos }) => {
  const [inventoryItems, setInventoryItems] = useState([]);

  useEffect(() => {
    if (eventos && eventos.length > 0) {
      const updatedInventory = eventos.map(event => ({
        id: event.id,
        name: event.name,
        status: event.price > 0 ? 'Disponível' : 'Esgotado',
        quantity: event.price > 0 ? 50 : 0, 
      }));
      setInventoryItems(updatedInventory);
    }
  }, [eventos]);

  return (
    <div>
      <h2>Visualização de Status do Inventário</h2>
      <table>
        <thead>
          <tr>
            <th>Evento</th>
            <th>Status</th>
            <th>Quantidade</th>
          </tr>
        </thead>
        <tbody>
          {inventoryItems.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.status}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryPage;
