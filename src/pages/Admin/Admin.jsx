import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { Box, Typography, List, ListItem } from '@mui/material';
import styles from './Admin.module.css';

const Admin = () => {
    const [list, setList] = useState([]);

    const userCollectionRef = collection(db, 'Eventos');

    useEffect(() => {
        const getUsers = async () => {
            const data = await getDocs(userCollectionRef);
            setList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        };
        getUsers();
    }, []);

    return (
        <Box className={styles.main}>
            <Typography variant="h4" gutterBottom>
                Lista de Eventos
            </Typography>
            <List>
                {list.map((item) => (
                    <ListItem key={item.id}>
                        <Typography>{item.nome}</Typography>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default Admin;
