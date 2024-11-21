import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

const InventoryStatus = () => {
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchEventAndInventory = async () => {
      const eventRef = doc(db, 'Eventos', id);
      const eventSnap = await getDoc(eventRef);
      if (eventSnap.exists()) {
        setEventData(eventSnap.data());
      }

      const inventoryRef = collection(db, `Eventos/${id}/inventory`);
      const inventorySnapshot = await getDocs(inventoryRef);
      const fetchedInventory = inventorySnapshot.docs.map(doc => doc.data());
      setInventory(fetchedInventory);
    };
    fetchEventAndInventory();
  }, [id]);

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!eventData) return <div>Loading...</div>;

  return (
    <div>
      <h2>Status do Inventário: {eventData.nome}</h2>
      <input
        type="text"
        placeholder="Buscar produto"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Preço</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventory.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>R$ {item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryStatus;
