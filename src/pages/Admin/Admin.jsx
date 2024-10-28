import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import styles from './Admin.module.css';

const Admin = () => {
    const [list, setList] = useState([]);
    const userCollectionRef = collection(db, 'Eventos');

    useEffect(() => {
        const getUsers = async () => {
            const data = await getDocs(userCollectionRef);
            setList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        }
        getUsers();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.adminPanel}>
                <h1 className={styles.title}>Lista de Eventos</h1>
                <ul className={styles.eventList}>
                    {list.map((item) => (
                        <li key={item.id} className={styles.eventItem}>
                            {item.nome}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Admin;
