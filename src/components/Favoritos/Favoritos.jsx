import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { getDocs, setDoc, doc, collection } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IconButton, List, ListItemText, Tooltip, Typography, Box, Card, CardContent } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';

const FavoriteEvents = ({ userId, eventId, eventName }) => {
    const [favorites, setFavorites] = useState([]);
    const { user } = useAuth();

    const fetchFavorites = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, `users/${userId}/favorites`));
            const favoriteData = querySnapshot.docs.map(doc => doc.data());
            setFavorites(favoriteData);
        } catch (error) {
            console.error("Erro ao buscar favoritos:", error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchFavorites();
        }
    }, [user]);

    const handleFavorite = async () => {
        if (!user) {
            console.error("Usuário não autenticado.");
            return;
        }

        try {
            await setDoc(doc(db, `users/${user.uid}/favorites/${eventId}`), { eventId, eventName });
            fetchFavorites();
            toast.success("Evento adicionado aos favoritos!");
        } catch (error) {
            console.error("Falha ao adicionar evento como Favorito.", error);
            toast.error("Falha ao adicionar evento como Favorito.");
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                maxWidth: 600,
                margin: '0 auto',
                padding: 3,
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                backgroundColor: '#fff',
            }}
        >
            <Typography variant="h5" sx={{ mb: 3, textAlign: 'center', fontWeight: 600, color: '#333' }}>
                Meus Favoritos
            </Typography>
            <Box sx={{ width: '100%', marginBottom: 3 }}>
                <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {favorites.map((favorite, index) => (
                        <Card key={index} sx={{ display: 'flex', alignItems: 'center', boxShadow: 3, borderRadius: '8px' }}>
                            <CardContent sx={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <ListItemText
                                    primary={favorite.eventName}
                                    sx={{ fontWeight: 500, fontSize: '1rem', color: '#333' }}
                                />
                                <Tooltip title="Remover dos Favoritos">
                                    <IconButton
                                        onClick={() => handleFavorite(favorite.eventId)}
                                        color="error"
                                        sx={{
                                            fontSize: '1.5rem',
                                            transition: 'transform 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.2)',
                                            },
                                        }}
                                    >
                                        <FavoriteIcon sx={{ fontSize: 'inherit' }} />
                                    </IconButton>
                                </Tooltip>
                            </CardContent>
                        </Card>
                    ))}
                </List>
            </Box>
            <Tooltip title="Adicionar aos Favoritos">
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 1,
                        border: '2px solid #ff4081',
                        borderRadius: '50%',
                        width: '60px',
                        height: '60px',
                        cursor: 'pointer',
                        backgroundColor: '#ff4081',
                        '&:hover': {
                            transform: 'scale(1.1)',
                            transition: '0.3s',
                            backgroundColor: '#d81b60',
                        },
                    }}
                >
                    <IconButton
                        onClick={handleFavorite}
                        sx={{
                            fontSize: '2rem',
                            color: '#fff',
                            '&:hover': {
                                color: '#fff',
                            },
                        }}
                    >
                        <FavoriteIcon />
                    </IconButton>
                </Box>
            </Tooltip>
            <ToastContainer />
        </Box>
    );
};

export default FavoriteEvents;
