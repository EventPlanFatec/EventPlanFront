import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { Container, Paper, Typography } from '@mui/material';
import './Admin.module.css';

const Admin = () => {
    const [list, setList] = useState([]);

    const userCollectionRef = collection(db, 'Eventos');

    useEffect(() => {
        const getEvents = async () => {
            const data = await getDocs(userCollectionRef);
            setList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        };
        getEvents();
    }, []);

    return (
        <Container className="main">
            <Typography variant="h4" gutterBottom textAlign="center">
                Lista de Eventos
            </Typography>
            {list.map((item) => (
                <Paper key={item.id} className="eventCard">
                    <Typography variant="h6">{item.nome}</Typography>
                </Paper>
            ))}
        </Container>
    );
};

export default Admin;
